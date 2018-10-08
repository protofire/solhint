const security = require('./security/index')
const naming = require('./naming/index')
const order = require('./order/index')
const align = require('./align/index')
const bestPractises = require('./best-practises/index')
const deprecations = require('./deprecations/index')
const miscellaneous = require('./miscellaneous/index')
const configObject = require('./../config')

module.exports = function checkers(reporter, configVals, inputSrc, fileName) {
  const config = configObject.from(configVals)

  return [
    ...security(reporter, config),
    ...order(reporter, config),
    ...naming(reporter, config),
    ...align(reporter, config),
    ...deprecations(reporter, config),
    ...bestPractises(reporter, config),
    ...miscellaneous(reporter, config, inputSrc, fileName)
  ]
}
