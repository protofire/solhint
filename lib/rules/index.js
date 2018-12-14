const security = require('./security/index')
const naming = require('./naming/index')
const order = require('./order/index')
const align = require('./align/index')
const bestPractises = require('./best-practises/index')
const deprecations = require('./deprecations/index')
const miscellaneous = require('./miscellaneous/index')
const configObject = require('./../config')
const { validSeverityMap } = require('../config/config-validator')

module.exports = function checkers(reporter, configVals, inputSrc, fileName) {
  const config = configObject.from(configVals)
  const { rules = {} } = config
  const data = {
    reporter,
    config,
    inputSrc,
    fileName
  }

  return buildAllRules(data).filter(coreRule => ruleEnabled(coreRule, rules))
}

function buildAllRules(data) {
  return [...coreRules(data), ...pluginsRules()]
}

function coreRules(data) {
  const { reporter, config, inputSrc, fileName } = data

  return [
    ...align(reporter, config),
    ...bestPractises(reporter, config),
    ...deprecations(reporter, config),
    ...miscellaneous(reporter, config, inputSrc, fileName),
    ...naming(reporter, config),
    ...order(reporter, config),
    ...security(reporter, config)
  ]
}

function pluginsRules() {
  return []
}

function ruleEnabled(coreRule, rules) {
  let ruleValue
  if (rules && !Array.isArray(rules[coreRule.ruleId])) {
    ruleValue = rules[coreRule.ruleId]
  } else if (rules && Array.isArray(rules[coreRule.ruleId])) {
    ruleValue = rules[coreRule.ruleId][0]
  }

  if (
    rules &&
    rules[coreRule.ruleId] !== undefined &&
    ruleValue &&
    validSeverityMap.includes(ruleValue)
  ) {
    return coreRule
  }
}
