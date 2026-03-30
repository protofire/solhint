const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const sinon = require('sinon')
const rimraf = require('rimraf')
const linter = require('../../lib/index')

function mkTmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}

function createPluginPackage(baseDir, pluginName, exportBody) {
  const pluginDir = path.join(baseDir, `solhint-plugin-${pluginName}`)
  fs.mkdirSync(pluginDir, { recursive: true })

  fs.writeFileSync(
    path.join(pluginDir, 'package.json'),
    JSON.stringify({
      name: `solhint-plugin-${pluginName}`,
      version: '1.0.0',
      main: 'index.js',
    }),
  )

  fs.writeFileSync(path.join(pluginDir, 'index.js'), exportBody)

  return pluginDir
}

function pluginExportBody(ruleId, message = 'Plugin triggered') {
  return `
class TestPluginRule {
  constructor(reporter) {
    this.reporter = reporter;
    this.ruleId = '${ruleId}';
  }

  ContractDefinition(node) {
    this.reporter.error(node, this.ruleId, '${message}');
  }
}

module.exports = [TestPluginRule];
`
}

function pluginDefaultExportBody(ruleId, message = 'Plugin triggered') {
  return `
class TestPluginRule {
  constructor(reporter) {
    this.reporter = reporter;
    this.ruleId = '${ruleId}';
  }

  ContractDefinition(node) {
    this.reporter.error(node, this.ruleId, '${message}');
  }
}

module.exports = { default: [TestPluginRule] };
`
}

describe('Plugin loading', () => {
  const source = 'pragma solidity ^0.8.0; contract C {}'
  let initialCwd
  let warnSpy
  let tempDirs

  beforeEach(() => {
    initialCwd = process.cwd()
    warnSpy = sinon.spy(console, 'warn')
    tempDirs = []
  })

  afterEach(() => {
    process.chdir(initialCwd)
    warnSpy.restore()
    for (const dir of tempDirs) {
      rimraf.sync(dir)
    }
  })

  it('loads plugin from project local node_modules', () => {
    const projectDir = mkTmpDir('solhint-plugin-project-')
    tempDirs.push(projectDir)

    const nodeModulesDir = path.join(projectDir, 'node_modules')
    fs.mkdirSync(nodeModulesDir)
    createPluginPackage(nodeModulesDir, 'project-local', pluginExportBody('project-local-rule'))

    process.chdir(projectDir)

    const report = linter.processStr(source, {
      plugins: ['project-local'],
      rules: { 'project-local/project-local-rule': 'error' },
    })

    assert.equal(report.errorCount, 1)
  })

  it('loads plugin from pluginPaths provided as a string', () => {
    const projectDir = mkTmpDir('solhint-plugin-path-string-')
    const externalProjectDir = mkTmpDir('solhint-plugin-external-string-')
    tempDirs.push(projectDir, externalProjectDir)

    const externalNodeModulesDir = path.join(externalProjectDir, 'node_modules')
    fs.mkdirSync(externalNodeModulesDir)
    createPluginPackage(externalNodeModulesDir, 'string-path', pluginExportBody('string-path-rule'))

    process.chdir(projectDir)

    const report = linter.processStr(source, {
      pluginPaths: externalProjectDir,
      plugins: ['string-path'],
      rules: { 'string-path/string-path-rule': 'error' },
    })

    assert.equal(report.errorCount, 1)
  })

  it('loads plugin when plugin is under <pluginPath>/node_modules', () => {
    const projectDir = mkTmpDir('solhint-plugin-path-parent-')
    const externalProjectDir = mkTmpDir('solhint-plugin-external-project-')
    tempDirs.push(projectDir, externalProjectDir)

    const externalNodeModulesDir = path.join(externalProjectDir, 'node_modules')
    fs.mkdirSync(externalNodeModulesDir)
    createPluginPackage(externalNodeModulesDir, 'parent-path', pluginExportBody('parent-path-rule'))

    process.chdir(projectDir)

    const report = linter.processStr(source, {
      pluginPaths: [externalProjectDir],
      plugins: ['parent-path'],
      rules: { 'parent-path/parent-path-rule': 'error' },
    })

    assert.equal(report.errorCount, 1)
  })

  it('missing plugin in plugins does not abort linting', () => {
    const report = linter.processStr('pragma solidity ^0.4.4; contract C {}', {
      plugins: ['missing-plugin-206'],
      rules: { 'compiler-version': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(warnSpy.called)
    assert.ok(
      warnSpy.getCalls().some((call) => String(call.args[0]).includes('missing-plugin-206')),
      'should warn when plugin cannot be loaded',
    )
  })

  it('one missing plugin does not prevent another valid plugin from loading', () => {
    const projectDir = mkTmpDir('solhint-plugin-mixed-')
    tempDirs.push(projectDir)

    const nodeModulesDir = path.join(projectDir, 'node_modules')
    fs.mkdirSync(nodeModulesDir)
    createPluginPackage(nodeModulesDir, 'valid-plugin', pluginExportBody('valid-rule'))

    process.chdir(projectDir)

    const report = linter.processStr(source, {
      plugins: ['missing-plugin-207', 'valid-plugin'],
      rules: {
        'compiler-version': 'error',
        'valid-plugin/valid-rule': 'error',
      },
    })

    assert.equal(report.errorCount, 2)
  })

  it('supports plugin default export array', () => {
    const projectDir = mkTmpDir('solhint-plugin-default-export-')
    tempDirs.push(projectDir)

    const nodeModulesDir = path.join(projectDir, 'node_modules')
    fs.mkdirSync(nodeModulesDir)
    createPluginPackage(
      nodeModulesDir,
      'default-export',
      pluginDefaultExportBody('default-export-rule'),
    )

    process.chdir(projectDir)

    const report = linter.processStr(source, {
      plugins: ['default-export'],
      rules: { 'default-export/default-export-rule': 'error' },
    })

    assert.equal(report.errorCount, 1)
  })

  it('supports multiple pluginPaths', () => {
    const projectDir = mkTmpDir('solhint-plugin-multiple-paths-')
    const externalOne = mkTmpDir('solhint-plugin-path-one-')
    const externalTwo = mkTmpDir('solhint-plugin-path-two-')
    tempDirs.push(projectDir, externalOne, externalTwo)

    const externalOneNodeModules = path.join(externalOne, 'node_modules')
    fs.mkdirSync(externalOneNodeModules)
    createPluginPackage(externalOneNodeModules, 'multi-one', pluginExportBody('multi-one-rule'))

    const externalTwoNodeModules = path.join(externalTwo, 'node_modules')
    fs.mkdirSync(externalTwoNodeModules)
    createPluginPackage(externalTwoNodeModules, 'multi-two', pluginExportBody('multi-two-rule'))

    process.chdir(projectDir)

    const report = linter.processStr(source, {
      pluginPaths: [externalOne, externalTwo],
      plugins: ['multi-one', 'multi-two'],
      rules: {
        'multi-one/multi-one-rule': 'error',
        'multi-two/multi-two-rule': 'error',
      },
    })

    assert.equal(report.errorCount, 2)
  })
})
