const ImportsOnTopChecker = require('./imports-on-top')
const VisibilityModifierOrderChecker = require('./visibility-modifier-order')
const OrderingChecker = require('./ordering')
const ImportsOrderChecker = require('./imports-order')

module.exports = function order(reporter, tokens) {
  return [
    new ImportsOnTopChecker(reporter),
    new VisibilityModifierOrderChecker(reporter, tokens),
    new OrderingChecker(reporter),
    new ImportsOrderChecker(reporter),
  ]
}
