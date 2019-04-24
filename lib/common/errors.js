class ConfigMissingError extends Error {
  constructor(configName) {
    const message = `Failed to load config "${configName}" to extend from.`
    super(message)
  }
}

module.exports = {
  ConfigMissingError
}
