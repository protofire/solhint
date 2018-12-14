class ConfigMissingError extends Error {
  constructor(data) {
    const { configName } = data
    const message = `Failed to load config "${configName}" to extend from.`
    super(message)
  }
}

module.exports = {
  ConfigMissingError
}
