const assert = require('node:assert/strict')
const { spawn, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const readline = require('node:readline')

const packageRoot = path.resolve(__dirname, '..')
const repositoryRoot = path.resolve(packageRoot, '..', '..')

// Installing both tarballs pulls Solhint's dependency tree, which on a cold npm cache
// takes well over a minute on a slow runner.
const COMMAND_TIMEOUT_MS = 300000

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: COMMAND_TIMEOUT_MS,
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`)
  }
  return result.stdout.trim()
}

function request(child, pending, message) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pending.delete(message.id)
      reject(new Error(`Timed out waiting for MCP response ${message.id}`))
    }, 10000)
    pending.set(message.id, {
      reject,
      resolve(response) {
        clearTimeout(timeout)
        resolve(response)
      },
    })
    child.stdin.write(`${JSON.stringify(message)}\n`)
  })
}

async function smokeInstalledPackage(projectRoot) {
  const child = spawn('npx', ['-y', '@solhint/mcp-server'], {
    cwd: projectRoot,
    env: { ...process.env, npm_config_offline: 'true' },
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  const pending = new Map()
  const invalidLines = []
  let stderr = ''

  readline.createInterface({ input: child.stdout }).on('line', (line) => {
    let response
    try {
      response = JSON.parse(line)
    } catch {
      invalidLines.push(line)
      return
    }
    const waiter = pending.get(response.id)
    if (waiter) {
      pending.delete(response.id)
      waiter.resolve(response)
    }
  })
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  child.on('error', (error) => {
    for (const waiter of pending.values()) waiter.reject(error)
    pending.clear()
  })

  try {
    const initialized = await request(child, pending, {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: { name: 'packed-smoke', version: '1.0.0' },
      },
    })
    assert.equal(initialized.result.serverInfo.name, '@solhint/mcp-server')

    const listed = await request(child, pending, { jsonrpc: '2.0', id: 2, method: 'tools/list' })
    assert.equal(listed.result.tools.length, 5)

    const linted = await request(child, pending, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'lint_file', arguments: { filePath: 'Bad.sol' } },
    })
    assert.equal(linted.result.isError, undefined)
    assert.match(linted.result.content[0].text, /compiler-version/)
    assert.deepEqual(invalidLines, [], stderr)
  } finally {
    child.stdin.end()
    const exited = new Promise((resolve) => {
      child.once('exit', resolve)
    })
    const timeout = new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
    await Promise.race([exited, timeout])
    if (child.exitCode === null) child.kill()
  }
}

async function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'solhint-mcp-packed-'))
  const artifacts = path.join(tempRoot, 'artifacts')
  const project = path.join(tempRoot, 'project')
  fs.mkdirSync(artifacts)
  fs.mkdirSync(project)

  try {
    run('npm', ['pack', '--pack-destination', artifacts], repositoryRoot)
    run('npm', ['pack', '--pack-destination', artifacts], packageRoot)
    const tarballs = fs.readdirSync(artifacts).filter((file) => file.endsWith('.tgz'))
    const solhintTarball = tarballs.find((file) => /^solhint-\d/.test(file))
    const serverTarball = tarballs.find((file) => file.startsWith('solhint-mcp-server-'))
    assert.ok(solhintTarball, 'root Solhint tarball was not produced')
    assert.ok(serverTarball, 'MCP server tarball was not produced')

    const contents = run('tar', ['-tzf', path.join(artifacts, serverTarball)], project)
      .split('\n')
      .filter(Boolean)
    assert.ok(
      contents.every((file) => /^package\/(?:package\.json|README\.md|LICENSE|src\/)/.test(file)),
    )
    console.log(`MCP tarball contents:\n${contents.join('\n')}`)

    run('npm', ['init', '--yes'], project)
    // The temp project has no lockfile, so npm must resolve the tarballs' dependency
    // ranges from registry metadata. `npm ci` only caches tarballs, never that metadata,
    // so a strict `--offline` install fails on a clean machine. The offline guarantee
    // that matters is the server's own, and smokeInstalledPackage() asserts that.
    run(
      'npm',
      [
        'install',
        '--prefer-offline',
        '--ignore-scripts',
        path.join(artifacts, solhintTarball),
        path.join(artifacts, serverTarball),
      ],
      project,
    )
    fs.writeFileSync(
      path.join(project, 'Bad.sol'),
      'pragma solidity ^0.8.0; contract Bad { uint value; }',
    )
    await smokeInstalledPackage(project)
    console.log('Packed installation smoke test passed')
  } finally {
    // The npx child ran with its cwd inside tempRoot; retry while the OS releases it.
    fs.rmSync(tempRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
