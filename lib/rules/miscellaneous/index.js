const Prettier = require('./prettier')
const QuotesChecker = require('./quotes')
const { RULES } = require('../../constants')

module.exports = function checkers(reporter, config, inputSrc, fileName) {
  const { rules, validateDisabledByDefault } = config

  const rulesToCheck = [
    {
      rule: RULES.QUOTES,
      instance: new QuotesChecker(reporter, config)
    },
    {
      rule: RULES.PRETTIER,
      instance: new Prettier(reporter, config, inputSrc, fileName)
    }
  ]

  return validateDisabledByDefault(rules, rulesToCheck)
}
