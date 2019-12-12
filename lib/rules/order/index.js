const FuncOrderChecker = require('./func-order')
const ImportsOnTopChecker = require('./imports-on-top')
const VisibilityModifierOrderChecker = require('./visibility-modifier-order')

module.exports = function order(reporter) {
  return [
    new FuncOrderChecker(reporter),
    new ImportsOnTopChecker(reporter),
    new VisibilityModifierOrderChecker(reporter)
  ]
}
