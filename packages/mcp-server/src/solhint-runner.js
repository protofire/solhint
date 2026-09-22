const fs = require('fs')
const path = require('path')
const { createRequire } = require('module')
const semver = require('semver')

const packageJson = require('../package.json')

const DEFAULT_CONFIG = Object.freeze({ extends: 'solhint:recommended' })
const CONFIG_FILES = [
  'package.json',
  '.solhint.json',
  '.solhintrc',
  '.solhintrc.json',
  '.solhintrc.yaml',
  '.solhintrc.yml',
  '.solhintrc.js',
  'solhint.config.js',
]

function resolveFromProject(projectRoot) {
  const projectRequire = createRequire(path.join(projectRoot, 'package.json'))
  let packagePath
  try {
    packagePath = projectRequire.resolve('solhint/package.json')
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') return null
    throw error
  }
  return { packagePath, require: projectRequire, source: 'project' }
}

function resolveBundled() {
  return { packagePath: require.resolve('solhint/package.json'), require, source: 'bundled' }
}

function loadResolution(candidate) {
  const metadata = JSON.parse(fs.readFileSync(candidate.packagePath, 'utf8'))
  const supportedRange = packageJson.solhintCompatibility
  if (!semver.valid(metadata.version) || !semver.satisfies(metadata.version, supportedRange)) {
    throw new Error(
      `Solhint ${metadata.version || 'with an invalid version'} at ${candidate.packagePath} is not supported; expected ${supportedRange}`,
    )
  }

  const solhint = candidate.require('solhint')
  for (const functionName of ['processStr', 'processFile']) {
    if (typeof solhint[functionName] !== 'function') {
      throw new Error(`Solhint ${metadata.version} does not expose ${functionName}()`)
    }
  }

  const packageRoot = path.dirname(candidate.packagePath)
  const configPath = path.join(packageRoot, 'lib', 'config', 'config-file.js')
  let configApi
  try {
    configApi = candidate.require(configPath)
  } catch (error) {
    throw new Error(`Cannot load Solhint's configuration API at ${configPath}: ${error.message}`)
  }
  for (const functionName of ['applyExtends', 'loadConfig', 'loadConfigForFile']) {
    if (typeof configApi[functionName] !== 'function') {
      throw new Error(`Solhint's configuration API does not expose ${functionName}()`)
    }
  }

  return Object.freeze({
    configApi,
    entryPath: candidate.require.resolve('solhint'),
    packageRoot,
    packageRequire: candidate.require,
    solhint,
    source: candidate.source,
    version: metadata.version,
  })
}

function findProjectConfig(projectRoot) {
  for (const name of CONFIG_FILES) {
    const configPath = path.join(projectRoot, name)
    if (!fs.existsSync(configPath)) continue
    if (name !== 'package.json') return configPath

    try {
      const projectPackage = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      if (Object.hasOwn(projectPackage, 'solhint')) return configPath
    } catch {
      // Let Solhint's config loader report the malformed package.json.
      return configPath
    }
  }
  return null
}

function normalizeReport(report, fallbackFilePath) {
  if (!report || !Array.isArray(report.reports))
    throw new Error('Solhint returned an invalid report')
  return {
    filePath: report.filePath || fallbackFilePath,
    errorCount: report.errorCount,
    warningCount: report.warningCount,
    messages: report.messages.map(({ line, column, severity, message, ruleId }) => ({
      line,
      column,
      severity,
      message,
      ruleId,
    })),
  }
}

function createSolhintRunner({ projectRoot = process.cwd(), forceBundled = false } = {}) {
  const resolvedProjectRoot = fs.realpathSync(projectRoot)
  const projectCandidate = forceBundled ? null : resolveFromProject(resolvedProjectRoot)
  const resolution = loadResolution(projectCandidate || resolveBundled())

  function loadProjectConfig() {
    const configPath = findProjectConfig(resolvedProjectRoot)
    if (!configPath) return { config: null, configPath: null }
    const config = resolution.configApi.loadConfig(configPath)
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error(`Solhint config at ${configPath} must contain an object`)
    }
    return { config, configPath }
  }

  function sourceConfig(explicitConfig) {
    if (explicitConfig !== undefined) {
      if (!explicitConfig || typeof explicitConfig !== 'object' || Array.isArray(explicitConfig)) {
        throw new Error('config must be an object')
      }
      if (Object.keys(explicitConfig).length === 0) {
        throw new Error('config cannot be empty; enable rules or extend a preset')
      }
      return explicitConfig
    }
    const { config } = loadProjectConfig()
    if (config && Object.keys(config).length > 0) return config
    return { ...DEFAULT_CONFIG }
  }

  function lintSource(code, config, fileName = 'contract.sol') {
    if (typeof code !== 'string') throw new Error('code is required and must be a string')
    const report = resolution.solhint.processStr(code, sourceConfig(config), fileName)
    return { reports: [normalizeReport(report, fileName)], resolution }
  }

  function lintFiles(files) {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('No Solidity files matched the requested project pattern')
    }
    const projectConfig = loadProjectConfig().config
    const reports = files.map((file) => {
      const fileConfig = resolution.configApi.loadConfigForFile(file, resolvedProjectRoot)
      let config = { ...DEFAULT_CONFIG }
      if (projectConfig && Object.keys(projectConfig).length > 0) config = projectConfig
      if (fileConfig && Object.keys(fileConfig).length > 0) config = fileConfig
      const report = resolution.solhint.processFile(file, config, resolvedProjectRoot)
      return normalizeReport(report, file)
    })
    return { reports, resolution }
  }

  function getProjectConfig() {
    const loaded = loadProjectConfig()
    if (!loaded.config) return { ...loaded, effectiveConfig: null }
    return {
      ...loaded,
      effectiveConfig: resolution.configApi.applyExtends({ ...loaded.config }),
    }
  }

  function listRuleIds() {
    const rulesPath = path.join(resolution.packageRoot, 'lib', 'load-rules.js')
    const { loadRules } = resolution.packageRequire(rulesPath)
    return loadRules().map((rule) => rule.ruleId)
  }

  return Object.freeze({
    describeResolution() {
      return `Solhint ${resolution.version} (${resolution.source}) — ${resolution.entryPath}`
    },
    getProjectConfig,
    lintFiles,
    lintSource,
    listRuleIds,
    projectRoot: resolvedProjectRoot,
    resolution,
  })
}

module.exports = { DEFAULT_CONFIG, createSolhintRunner, normalizeReport }
