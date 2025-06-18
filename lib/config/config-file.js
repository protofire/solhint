const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { cosmiconfigSync } = require('cosmiconfig')
const { ConfigMissingError } = require('../common/errors')
const packageJson = require('../../package.json')

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
const configGetter = (path) => {
  if (isAbsolute(path)) {
    return require(path)
  }
  return path.startsWith('solhint:')
    ? getSolhintCoreConfig(path)
    : require(`solhint-config-${path}`)
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

// Load and merge all .solhint.json files from the file's directory up to the root
function loadConfigForFile(filePath, rootDir = process.cwd()) {
  let dir = path.dirname(path.resolve(filePath))
  const configs = []
  const configFileName = '.solhint.json'

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const configPath = path.join(dir, configFileName)
    if (fs.existsSync(configPath)) {
      configs.unshift(JSON.parse(fs.readFileSync(configPath, 'utf8')))
    }
    if (dir === rootDir || path.dirname(dir) === dir) break
    dir = path.dirname(dir)
  }
  // Combine configs, the deepest one overrides
  return _.merge({}, ...configs)
}

module.exports = {
  applyExtends,
  configGetter,
  loadConfig,
  loadConfigForFile,
}
