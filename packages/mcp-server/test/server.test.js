const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const readline = require('node:readline')
const test = require('node:test')

const serverEntry = path.resolve(__dirname, '..', 'src', 'index.js')

function makeProject(files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'solhint-mcp-server-test-'))
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = path.join(root, relativePath)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, contents)
  }
  return root
}

async function stopServer(server) {
  const { child } = server
  if (child.exitCode !== null || child.signalCode !== null) return

  const exited = new Promise((resolve) => {
    child.once('exit', resolve)
  })
  child.kill()
  await exited
}

// Windows locks a process's working directory until it is gone, and can hold the handle
// for a moment after that, so removal has to wait for the exit and then retry.
function removeProject(root) {
  fs.rmSync(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
}

function startServer(projectRoot) {
  const child = spawn(process.execPath, [serverEntry, '--bundled-solhint'], {
    cwd: projectRoot,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  const pending = new Map()
  const invalidLines = []
  const unmatchedMessages = []
  let stderr = ''

  readline.createInterface({ input: child.stdout }).on('line', (line) => {
    let message
    try {
      message = JSON.parse(line)
    } catch {
      invalidLines.push(line)
      return
    }
    const waiter = pending.get(message.id)
    if (waiter) {
      pending.delete(message.id)
      waiter.resolve(message)
    } else {
      unmatchedMessages.push(message)
    }
  })
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  child.on('exit', (code) => {
    for (const waiter of pending.values()) {
      waiter.reject(new Error(`MCP server exited with code ${code}: ${stderr}`))
    }
    pending.clear()
  })

  function send(message) {
    child.stdin.write(`${JSON.stringify(message)}\n`)
  }

  function request(message) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(message.id)
        reject(new Error(`Timed out waiting for response ${message.id}: ${stderr}`))
      }, 5000)
      pending.set(message.id, {
        reject,
        resolve(response) {
          clearTimeout(timeout)
          resolve(response)
        },
      })
      send(message)
    })
  }

  return {
    child,
    invalidLines,
    unmatchedMessages,
    request,
    send,
    stderr: () => stderr,
  }
}

test(
  'stdio server validates tools and stays alive after bad calls',
  { timeout: 20000 },
  async () => {
    const root = makeProject({ 'contracts/Bad.sol': 'pragma solidity ^0.8.0; contract Bad {}' })
    const server = startServer(root)
    try {
      const initialized = await server.request({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'test', version: '1.0.0' },
        },
      })
      assert.equal(initialized.result.serverInfo.name, '@solhint/mcp-server')

      server.send({ jsonrpc: '2.0', method: 'notifications/initialized' })
      server.send({ jsonrpc: '2.0', method: 'notifications/unknown' })

      const listed = await server.request({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
      assert.deepEqual(
        listed.result.tools.map((tool) => tool.name),
        ['lint_solidity', 'lint_file', 'lint_project', 'explain_rule', 'get_config'],
      )
      const explainSchema = listed.result.tools.find((tool) => tool.name === 'explain_rule')
      assert.deepEqual(explainSchema.inputSchema.required, ['ruleId'])
      assert.deepEqual(server.unmatchedMessages, [])

      for (const [id, name] of [
        [3, 'lint_solidity'],
        [4, 'lint_file'],
        [5, 'explain_rule'],
      ]) {
        // Deliberately sequential: each check uses and verifies the same session.
        // eslint-disable-next-line no-await-in-loop
        const failed = await server.request({
          jsonrpc: '2.0',
          id,
          method: 'tools/call',
          params: { name, arguments: {} },
        })
        assert.equal(failed.result.isError, true, name)
        // eslint-disable-next-line no-await-in-loop
        const stillAlive = await server.request({
          jsonrpc: '2.0',
          id: id + 10,
          method: 'tools/list',
        })
        assert.equal(stillAlive.result.tools.length, 5)
      }

      const unknown = await server.request({ jsonrpc: '2.0', id: 20, method: 'unknown/method' })
      assert.equal(unknown.error.code, -32601)
      const unknownTool = await server.request({
        jsonrpc: '2.0',
        id: 21,
        method: 'tools/call',
        params: { name: 'does_not_exist', arguments: {} },
      })
      assert.ok(unknownTool.error)
      assert.deepEqual(server.invalidLines, [])
      assert.deepEqual(server.unmatchedMessages, [])
    } finally {
      await stopServer(server)
      removeProject(root)
    }
  },
)

test('plugin stdout is redirected away from the protocol', { timeout: 20000 }, async () => {
  const plugin = [
    "console.log('boom from plugin')",
    'class NoisyRule {',
    "  constructor(reporter) { this.reporter = reporter; this.ruleId = 'noisy-rule' }",
    "  ContractDefinition(node) { this.reporter.error(node, this.ruleId, 'plugin finding') }",
    '}',
    'module.exports = [NoisyRule]',
    '',
  ].join('\n')
  const root = makeProject({
    '.solhint.json': JSON.stringify({
      plugins: ['noisy'],
      rules: { 'noisy/noisy-rule': 'error' },
    }),
    'Contract.sol': 'pragma solidity ^0.8.24; contract Contract {}',
    'node_modules/solhint-plugin-noisy/index.js': plugin,
    'node_modules/solhint-plugin-noisy/package.json': JSON.stringify({
      name: 'solhint-plugin-noisy',
      version: '1.0.0',
      main: 'index.js',
    }),
  })
  const server = startServer(root)
  try {
    await server.request({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0.0' },
      },
    })
    const linted = await server.request({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'lint_file', arguments: { filePath: 'Contract.sol' } },
    })
    assert.equal(linted.result.isError, undefined)
    assert.match(linted.result.content[0].text, /plugin finding/)
    assert.deepEqual(server.invalidLines, [])
    assert.match(server.stderr(), /boom from plugin/)
  } finally {
    await stopServer(server)
    removeProject(root)
  }
})
