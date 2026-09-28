const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const { createSolhintRunner } = require('../src/solhint-runner')
const { TOOL_DEFINITIONS, createToolService, formatReports } = require('../src/tools')

function makeProject(files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'solhint-mcp-test-'))
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = path.join(root, relativePath)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, contents)
  }
  return root
}

function cleanupProject(root) {
  fs.rmSync(root, { recursive: true, force: true })
}

function addFakeSolhint(root, version) {
  const packageRoot = path.join(root, 'node_modules', 'solhint')
  fs.mkdirSync(path.join(packageRoot, 'lib', 'config'), { recursive: true })
  fs.writeFileSync(
    path.join(packageRoot, 'package.json'),
    JSON.stringify({ name: 'solhint', version, main: 'index.js' }),
  )
  fs.writeFileSync(
    path.join(packageRoot, 'index.js'),
    'module.exports = { processStr() {}, processFile() {} }\n',
  )
  fs.writeFileSync(
    path.join(packageRoot, 'lib', 'config', 'config-file.js'),
    'module.exports = { applyExtends: x => x, loadConfig: () => ({}), loadConfigForFile: () => ({}) }\n',
  )
}

const badSource = 'pragma solidity ^0.8.0; contract Bad { uint value; }'

test('lintSource never silently uses an empty config', () => {
  const root = makeProject()
  try {
    const runner = createSolhintRunner({ projectRoot: root, forceBundled: true })
    const result = runner.lintSource(badSource)
    assert.ok(result.reports[0].errorCount + result.reports[0].warningCount > 0)
  } finally {
    cleanupProject(root)
  }
})

test('explicit source config replaces the project config', () => {
  const root = makeProject({
    '.solhint.json': JSON.stringify({ rules: { quotes: ['error', 'double'] } }),
  })
  const source = "pragma solidity ^0.8.24; contract C { string value = 'x'; }"
  try {
    const runner = createSolhintRunner({ projectRoot: root, forceBundled: true })
    const enabled = runner.lintSource(source, { rules: { quotes: ['error', 'double'] } })
    const disabled = runner.lintSource(source, { rules: { quotes: 'off' } })
    assert.equal(enabled.reports[0].errorCount, 1)
    assert.equal(disabled.reports[0].errorCount, 0)
  } finally {
    cleanupProject(root)
  }
})

test('project config is used for source linting', () => {
  const root = makeProject({
    '.solhint.json': JSON.stringify({ rules: { quotes: ['error', 'double'] } }),
  })
  try {
    const runner = createSolhintRunner({ projectRoot: root, forceBundled: true })
    const result = runner.lintSource("pragma solidity ^0.8.24; contract C { string s = 'x'; }")
    assert.equal(result.reports[0].errorCount, 1)
  } finally {
    cleanupProject(root)
  }
})

test('all Solhint project config formats are discovered and applied', () => {
  const config = { rules: { quotes: ['error', 'double'] } }
  const formats = {
    'package.json': JSON.stringify({ name: 'fixture', solhint: config }),
    '.solhint.json': JSON.stringify(config),
    '.solhintrc': JSON.stringify(config),
    '.solhintrc.json': JSON.stringify(config),
    '.solhintrc.yaml': 'rules:\n  quotes:\n    - error\n    - double\n',
    '.solhintrc.yml': 'rules:\n  quotes:\n    - error\n    - double\n',
    '.solhintrc.js': "module.exports = { rules: { quotes: ['error', 'double'] } }\n",
    'solhint.config.js': "module.exports = { rules: { quotes: ['error', 'double'] } }\n",
  }

  for (const [configFile, contents] of Object.entries(formats)) {
    const root = makeProject({ [configFile]: contents })
    try {
      const runner = createSolhintRunner({ projectRoot: root, forceBundled: true })
      assert.equal(path.basename(runner.getProjectConfig().configPath), configFile, configFile)
      const report = runner.lintSource(
        "pragma solidity ^0.8.24; contract C { string private value = 'x'; }",
      ).reports[0]
      assert.ok(
        report.messages.some((message) => message.ruleId === 'quotes'),
        configFile,
      )
      const shown = createToolService({ runner }).call('get_config', {}).content[0].text
      assert.doesNotMatch(shown, /No project Solhint config found/, configFile)
    } finally {
      cleanupProject(root)
    }
  }
})

test('resolution accepts the supported project Solhint range', () => {
  for (const version of ['6.1.0', '6.2.4']) {
    const root = makeProject()
    try {
      addFakeSolhint(root, version)
      const runner = createSolhintRunner({ projectRoot: root })
      assert.equal(runner.resolution.source, 'project')
      assert.equal(runner.resolution.version, version)
      assert.match(runner.describeResolution(), /node_modules.*solhint/)
    } finally {
      cleanupProject(root)
    }
  }
})

test('resolution rejects an incompatible project Solhint without fallback', () => {
  for (const version of ['6.0.3', '7.0.0']) {
    const root = makeProject()
    try {
      addFakeSolhint(root, version)
      const escapedVersion = version.replaceAll('.', '\\.')
      assert.throws(
        () => createSolhintRunner({ projectRoot: root }),
        new RegExp(`Solhint ${escapedVersion}.*not supported`),
      )
    } finally {
      cleanupProject(root)
    }
  }
})

test('resolution falls back to bundled Solhint when the project has none', () => {
  const root = makeProject()
  try {
    const runner = createSolhintRunner({ projectRoot: root })
    assert.equal(runner.resolution.source, 'bundled')
    assert.match(runner.describeResolution(), new RegExp(`Solhint ${runner.resolution.version}`))
  } finally {
    cleanupProject(root)
  }
})

test('source linting is independent of the server startup directory', () => {
  const firstRoot = makeProject()
  const secondRoot = makeProject()
  try {
    const first = createSolhintRunner({ projectRoot: firstRoot, forceBundled: true })
    const second = createSolhintRunner({ projectRoot: secondRoot, forceBundled: true })
    assert.deepEqual(first.lintSource(badSource).reports, second.lintSource(badSource).reports)
  } finally {
    cleanupProject(firstRoot)
    cleanupProject(secondRoot)
  }
})

test('numeric severities and unordered files format correctly', () => {
  const output = formatReports([
    {
      filePath: 'z.sol',
      errorCount: 1,
      warningCount: 0,
      messages: [{ line: 2, column: 1, severity: 2, ruleId: 'quotes', message: 'bad' }],
    },
    {
      filePath: 'a.sol',
      errorCount: 0,
      warningCount: 1,
      messages: [{ line: 1, column: 2, severity: 3, ruleId: 'reason-string', message: 'warn' }],
    },
  ])
  assert.match(output, /Summary.*1 error\(s\), 1 warning\(s\)/)
  assert.ok(output.indexOf('a.sol') < output.indexOf('z.sol'))
})

test('tool schemas use the final camelCase surface', () => {
  const schemas = Object.fromEntries(TOOL_DEFINITIONS.map((tool) => [tool.name, tool.inputSchema]))
  assert.deepEqual(schemas.lint_solidity.required, ['code'])
  assert.deepEqual(schemas.lint_file.required, ['filePath'])
  assert.deepEqual(schemas.lint_project.required, [])
  assert.deepEqual(schemas.explain_rule.required, ['ruleId'])
  assert.deepEqual(schemas.get_config.required, [])
  assert.equal(schemas.lint_file.properties.cwd, undefined)
  assert.equal(schemas.lint_project.properties.projectDir, undefined)
  assert.equal(schemas.get_config.properties.project_dir, undefined)
})

test('lint_file rejects paths outside projectRoot', () => {
  const root = makeProject()
  try {
    const runner = createSolhintRunner({ projectRoot: root, forceBundled: true })
    const service = createToolService({ runner })
    const result = service.call('lint_file', { filePath: '../../etc/passwd' })
    assert.equal(result.isError, true)
    assert.match(result.content[0].text, /outside the project root/i)
  } finally {
    cleanupProject(root)
  }
})

test('lint_file reports a missing project file as an error', () => {
  const root = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const result = service.call('lint_file', { filePath: 'Missing.sol' })
    assert.equal(result.isError, true)
    assert.match(result.content[0].text, /File not found/i)
  } finally {
    cleanupProject(root)
  }
})

test('required arguments return tool errors without throwing', () => {
  const root = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    for (const toolName of ['lint_solidity', 'lint_file', 'explain_rule']) {
      const result = service.call(toolName, {})
      assert.equal(result.isError, true, toolName)
      assert.match(result.content[0].text, /required/i)
    }
    assert.equal(service.call('unknown_tool', {}).isError, true)
  } finally {
    cleanupProject(root)
  }
})

test('lint_project discovers nested Hardhat files and rejects empty projects', () => {
  const root = makeProject({ 'contracts/Nested/Bad.sol': badSource })
  const emptyRoot = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const result = service.call('lint_project', {})
    assert.equal(result.isError, undefined)
    assert.match(result.content[0].text, /Bad\.sol/)

    const emptyService = createToolService({
      runner: createSolhintRunner({ projectRoot: emptyRoot, forceBundled: true }),
    })
    const empty = emptyService.call('lint_project', {})
    assert.equal(empty.isError, true)
    assert.match(empty.content[0].text, /No Solidity files/i)
  } finally {
    cleanupProject(root)
    cleanupProject(emptyRoot)
  }
})

test('.solhintignore excludes files the way the CLI does', () => {
  // Solhint honours .solhintignore only in its CLI, so a server that enumerates files
  // itself has to reapply it or it reports violations the project excluded on purpose.
  const root = makeProject({
    'contracts/Kept.sol': badSource,
    'contracts/_mocks/Mock.sol': badSource,
    '.solhintignore': 'contracts/_mocks\n',
  })
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })

    const project = service.call('lint_project', {})
    assert.equal(project.isError, undefined)
    assert.match(project.content[0].text, /Kept\.sol/)
    assert.doesNotMatch(project.content[0].text, /Mock\.sol/)

    const ignored = service.call('lint_file', { filePath: 'contracts/_mocks/Mock.sol' })
    assert.equal(ignored.isError, true)
    assert.match(ignored.content[0].text, /\.solhintignore/)
  } finally {
    cleanupProject(root)
  }
})

test('excludedFiles in the project config is honoured too', () => {
  const root = makeProject({
    'contracts/Kept.sol': badSource,
    'contracts/skipme/Skipped.sol': badSource,
    '.solhint.json': JSON.stringify({
      extends: 'solhint:recommended',
      excludedFiles: ['contracts/skipme'],
    }),
  })
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const project = service.call('lint_project', {})
    assert.match(project.content[0].text, /Kept\.sol/)
    assert.doesNotMatch(project.content[0].text, /Skipped\.sol/)
  } finally {
    cleanupProject(root)
  }
})

test('lint_project discovers Foundry files and rejects escaping patterns', () => {
  const root = makeProject({ 'src/Nested/Bad.sol': badSource })
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    assert.match(service.call('lint_project', {}).content[0].text, /Bad\.sol/)
    const escaped = service.call('lint_project', { pattern: '../**/*.sol' })
    assert.equal(escaped.isError, true)
    assert.match(escaped.content[0].text, /inside the project root/i)
  } finally {
    cleanupProject(root)
  }
})

test('lint_project falls back to Solidity files at the project root', () => {
  const root = makeProject({
    'Bad.sol': badSource,
    'node_modules/example/Dependency.sol': badSource,
  })
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const result = service.call('lint_project', {}).content[0].text
    assert.match(result, /Bad\.sol/)
    assert.doesNotMatch(result, /Dependency\.sol/)
  } finally {
    cleanupProject(root)
  }
})

test('every rule Solhint ships can be explained', () => {
  // The explanations come from Solhint's own rule metadata, so coverage has to be total:
  // a hand-maintained subset is what left the most common rules unexplained before.
  const root = makeProject()
  try {
    const runner = createSolhintRunner({ projectRoot: root, forceBundled: true })
    const service = createToolService({ runner })
    const ruleIds = runner.listRuleIds()
    assert.ok(ruleIds.length > 50, `expected the full registry, got ${ruleIds.length}`)

    for (const ruleId of ruleIds) {
      const text = service.call('explain_rule', { ruleId }).content[0].text
      assert.match(text, new RegExp(`\\\`${ruleId}\\\``), ruleId)
      assert.doesNotMatch(text, /has no rule called/, ruleId)
    }
  } finally {
    cleanupProject(root)
  }
})

test('an explanation carries the rule metadata a caller needs', () => {
  const root = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const text = service.call('explain_rule', { ruleId: 'immutable-vars-naming' }).content[0].text

    assert.match(text, /Style Guide Rules/)
    assert.match(text, /Capitalized SNAKE_CASE/)
    assert.match(text, /\*\*Default:\*\*/)
    // The configurable option is the point: it is what tells a caller the rule can be
    // relaxed instead of renaming every immutable in the project.
    assert.match(text, /immutablesAsConstants/)
  } finally {
    cleanupProject(root)
  }
})

test('an explanation includes the good and bad examples when the rule has them', () => {
  const root = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const text = service.call('explain_rule', { ruleId: 'gas-custom-errors' }).content[0].text

    assert.match(text, /\*\*Notes\*\*/)
    assert.match(text, /\*\*Good/)
    assert.match(text, /```solidity/)
  } finally {
    cleanupProject(root)
  }
})

test('get_config resolves extends before making suggestions', () => {
  const root = makeProject({
    '.solhint.json': JSON.stringify({ extends: 'solhint:recommended' }),
  })
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const result = service.call('get_config', {})
    assert.equal(result.isError, undefined)
    assert.doesNotMatch(
      result.content[0].text,
      /Add `(?:gas-custom-errors|reason-string|compiler-version)/,
    )
  } finally {
    cleanupProject(root)
  }
})

test('get_config emits only the recommended preset when config is absent', () => {
  const root = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const text = service.call('get_config', {}).content[0].text
    assert.match(text, /"extends": "solhint:recommended"/)
    assert.doesNotMatch(text, /compiler-version|gas-custom-errors|reason-string/)
  } finally {
    cleanupProject(root)
  }
})

test('unknown rules link to the Solhint documentation', () => {
  const root = makeProject()
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const result = service.call('explain_rule', { ruleId: 'does-not-exist' })
    assert.match(result.content[0].text, /protofire\.github\.io\/solhint\/docs\/rules\.html/)
  } finally {
    cleanupProject(root)
  }
})

test('malformed project config is reported as an error', () => {
  const root = makeProject({ '.solhint.json': '{ not json' })
  try {
    const service = createToolService({
      runner: createSolhintRunner({ projectRoot: root, forceBundled: true }),
    })
    const result = service.call('get_config', {})
    assert.equal(result.isError, true)
    assert.match(result.content[0].text, /Error:/)
  } finally {
    cleanupProject(root)
  }
})

const RECOMMENDED = JSON.stringify({ extends: 'solhint:recommended' })

function fixService(files) {
  const root = makeProject({ '.solhint.json': RECOMMENDED, ...files })
  return {
    root,
    service: createToolService({ runner: createSolhintRunner({ projectRoot: root }) }),
  }
}

test('fix_solidity corrects autofixable violations without touching any file', () => {
  const { root, service } = fixService()
  try {
    const result = service.call('fix_solidity', {
      code: 'pragma solidity ^0.8.24;\ncontract A { uint b; }\n',
    })
    assert.equal(result.isError, undefined)
    assert.match(result.content[0].text, /uint256 b/)
    assert.match(result.content[0].text, /`explicit-types`/)
  } finally {
    cleanupProject(root)
  }
})

test('fix_solidity reports when there is nothing to fix', () => {
  const { root, service } = fixService()
  try {
    const result = service.call('fix_solidity', {
      code: 'pragma solidity ^0.8.24;\ncontract A {}\n',
    })
    assert.match(result.content[0].text, /No autofixable violations/)
  } finally {
    cleanupProject(root)
  }
})

test('fix_file previews by default and leaves the file untouched', () => {
  const source = 'pragma solidity ^0.8.24;\ncontract A { uint b; }\n'
  const { root, service } = fixService({ 'contracts/A.sol': source })
  try {
    const result = service.call('fix_file', { filePath: 'contracts/A.sol' })
    assert.match(result.content[0].text, /Preview only/)
    assert.equal(fs.readFileSync(path.join(root, 'contracts', 'A.sol'), 'utf8'), source)
  } finally {
    cleanupProject(root)
  }
})

test('fix_file writes the corrected source when asked', () => {
  const { root, service } = fixService({
    'contracts/A.sol': 'pragma solidity ^0.8.24;\ncontract A { uint b; }\n',
  })
  try {
    const result = service.call('fix_file', { filePath: 'contracts/A.sol', write: true })
    assert.match(result.content[0].text, /file has been written/)
    assert.match(fs.readFileSync(path.join(root, 'contracts', 'A.sol'), 'utf8'), /uint256 b/)
  } finally {
    cleanupProject(root)
  }
})

test('fix_file rejects a path outside the project root', () => {
  const { root, service } = fixService()
  try {
    assert.equal(service.call('fix_file', { filePath: '../../etc/hosts' }).isError, true)
  } finally {
    cleanupProject(root)
  }
})

test('fix_file rejects a non-boolean write flag', () => {
  const { root, service } = fixService({
    'contracts/A.sol': 'pragma solidity ^0.8.24;\ncontract A { uint b; }\n',
  })
  try {
    const result = service.call('fix_file', { filePath: 'contracts/A.sol', write: 'yes' })
    assert.equal(result.isError, true)
    assert.match(result.content[0].text, /write must be a boolean/)
  } finally {
    cleanupProject(root)
  }
})

test('unparsable source reports a readable error instead of a parser crash', () => {
  const { root, service } = fixService()
  try {
    const result = service.call('lint_solidity', { code: 'this is not solidity {{{' })
    assert.equal(result.isError, true)
    assert.match(result.content[0].text, /Could not parse the Solidity source/)
  } finally {
    cleanupProject(root)
  }
})
