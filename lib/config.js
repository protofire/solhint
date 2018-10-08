const _ = require('lodash')
const { RULES } = require('./constants')

module.exports = {
  from(configVals) {
    return _.assign(configVals, this)
  },

  getNumberByPath(path, defaultValue) {
    const configVal = _.get(this, path)
    return _.isNumber(configVal) && configVal > 0 ? configVal : defaultValue
  },

  getNumber(ruleName, defaultValue) {
    return this.getNumberByPath(`rules["${ruleName}"][1]`, defaultValue)
  },

  getRulesDisabledByDefault() {
    const { PRETTIER } = RULES
    return [PRETTIER]
  },

  isRuleDisabledByDefault(ruleId) {
    const rules = module.exports.getRulesDisabledByDefault()
    return rules.includes(ruleId)
  },

  validateDisabledByDefault(rulesConfig, rulesToCheck) {
    const rulesArrayOfObjects = []

    for (const ruleToCheck of rulesToCheck) {
      const { rule, instance } = ruleToCheck
      if (
        (!_.isUndefined(rulesConfig[rule]) && module.exports.isRuleDisabledByDefault(rule)) || // If exist in the rules and exist in the disabled rules, ADD
        (!_.isUndefined(rulesConfig[rule]) && !module.exports.isRuleDisabledByDefault(rule)) || // If exist in the rules and not exist in the disabled rules, ADD
        (_.isUndefined(rulesConfig[rule]) && !module.exports.isRuleDisabledByDefault(rule)) // If not exist in the rules and not exist in the disabled rules, ADD
      ) {
        rulesArrayOfObjects.push(instance)
      }
    }
    return rulesArrayOfObjects
  }
}
