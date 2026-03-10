// lib/config/config-file.js

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { cosmiconfigSync } = require('cosmiconfig')
const { createRequire } = require('module') // Resolve shareable configs from the project (cwd)
const { ConfigMissingError } = require('../common/errors')
const packageJson = require('../../package.json')

// -----------------------------------------------------------------------------
// Constants (keep behavior, improve readability)
// -----------------------------------------------------------------------------
const CORE_PREFIX = 'solhint:'
const UNSCOPED_SHAREABLE_PREFIX = 'solhint-config-'
const REQUIRE_ANCHOR_BASENAME = '__solhint_require_anchor__.js'

// -----------------------------------------------------------------------------
// Core presets
// -----------------------------------------------------------------------------
const getSolhintCoreConfig = (name) => {
  if (name === 'solhint:recommended') {
    return require('../../conf/rulesets/solhint-recommended')
  }

  if (name === 'solhint:all') {
    return require('../../conf/rulesets/solhint-all')
  }

  throw new ConfigMissingError(name)
}

const createEmptyConfig = () => ({
  rules: {},
  extends: {},
  excludedFiles: {},
})

const loadConfig = (configFile) => {
  if (configFile && !fs.existsSync(configFile)) {
    throw new Error(`The config file passed as a parameter does not exist`)
  }

  // Use cosmiconfig to get the config from different sources
  const appDirectory = fs.realpathSync(process.cwd())
  const moduleName = packageJson.name
  const cosmiconfigOptions = {
    searchPlaces: [
      'package.json',
      `.${moduleName}.json`,
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `${moduleName}.config.js`,
    ],
  }

  const explorer = cosmiconfigSync(moduleName, cosmiconfigOptions)

  // if a specific path was specified, just load it and ignore default paths
  if (configFile) {
    return explorer.load(configFile).config
  }

  const searchedFor = explorer.search(appDirectory)
  if (!searchedFor) {
    throw new ConfigMissingError()
  }
  return searchedFor.config || createEmptyConfig()
}

const isAbsolute = path.isAbsolute

function resolveShareableConfigName(extendsValue) {
  // core presets
  if (extendsValue.startsWith(CORE_PREFIX)) return extendsValue

  // absolute path stays as-is
  if (isAbsolute(extendsValue)) return extendsValue

  // scoped packages: @scope/name
  if (extendsValue.startsWith('@')) {
    const parts = extendsValue.split('/')

    // Require-compatible scoped package must be exactly "@scope/name"
    // (we deliberately do NOT support deeper paths like "@scope/name/extra")
    if (parts.length !== 2) return extendsValue

    const scope = parts[0]
    const name = parts[1]

    // If already has the prefix, accept it as-is
    if (name.startsWith(UNSCOPED_SHAREABLE_PREFIX)) return `${scope}/${name}`

    // ESLint-style shorthand: "@scope/foo" -> "@scope/solhint-config-foo"
    return `${scope}/${UNSCOPED_SHAREABLE_PREFIX}${name}`
  }

  // unscoped: if already prefixed, accept it
  if (extendsValue.startsWith(UNSCOPED_SHAREABLE_PREFIX)) return extendsValue

  // default: keep current behavior
  return `${UNSCOPED_SHAREABLE_PREFIX}${extendsValue}`
}

// -----------------------------------------------------------------------------
// Shareable config resolver
// -----------------------------------------------------------------------------

// Cache the project require so we don't recreate it on each call.
// NOTE: This uses process.cwd() at module load time. In Solhint, config loading
// runs after the CLI has already set the working directory (your E2E does that),
// so this preserves current behavior and avoids repeated createRequire calls.
const projectRequire = (() => {
  // Resolve shareable configs from the *project* (cwd) instead of from Solhint's installation path.
  // This is important when Solhint is installed globally or when running from a different directory:
  // - Users expect `extends` packages to be resolved from their project's node_modules.
  // - E2E fixtures typically don't have a package.json, so we anchor to a dummy file in cwd.
  //
  // createRequire requires an absolute filename (not a directory). We anchor to a dummy file path.
  // The file doesn't need to exist for resolution to work.
  const anchor = path.join(process.cwd(), REQUIRE_ANCHOR_BASENAME)
  return createRequire(anchor)
})()

function requireFromProject(moduleId) {
  return projectRequire(moduleId)
}

const configGetter = (p) => {
  const resolved = resolveShareableConfigName(p)

  if (isAbsolute(resolved)) {
    return require(resolved)
  }

  if (resolved.startsWith(CORE_PREFIX)) {
    return getSolhintCoreConfig(resolved)
  }

  // Shareable config (npm package): resolve from project's node_modules (cwd)
  return requireFromProject(resolved)
}

const applyExtends = (config, getter = configGetter) => {
  if (!config.extends) {
    return config
  }

  if (!Array.isArray(config.extends)) {
    config.extends = [config.extends]
  }

  return config.extends.reduceRight((previousValue, parentPath) => {
    try {
      const extensionConfig = getter(parentPath)
      return _.merge({}, extensionConfig, previousValue)
    } catch (e) {
      throw new ConfigMissingError(parentPath)
    }
  }, config)
}

// Load and merge all .solhint.json files from the file's directory up to rootDir,
// unless explicitConfigPath is present (in that case use custom config file, not doing hierarchy).
function loadConfigForFile(filePath, rootDir, explicitConfigPath) {
  if (explicitConfigPath) {
    return loadConfig(explicitConfigPath)
  }

  let dir = path.dirname(path.resolve(filePath))
  const configs = []
  const configFileName = '.solhint.json'
  rootDir = path.resolve(rootDir)

  // Search from the file's directory up to rootDir (inclusive)
  // merge all found .solhint.json files (the config in the deepest directory overrides)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const configPath = path.join(dir, configFileName)
    if (fs.existsSync(configPath)) {
      // use loadConfig to parse, so it supports extends/etc.
      configs.unshift(loadConfig(configPath))
    }
    if (dir === rootDir || path.dirname(dir) === dir) break
    dir = path.dirname(dir)
  }

  // merge all configs found (from root to the deepest one)
  return _.merge({}, ...configs)
}

module.exports = {
  applyExtends,
  configGetter,
  loadConfig,
  loadConfigForFile,
  resolveShareableConfigName,
}
