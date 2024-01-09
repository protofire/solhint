const GasMultitoken1155 = require('./gas-multitoken1155')

// module.exports = function checkers(reporter, config, tokens) {
module.exports = function checkers(reporter, config) {
  return [new GasMultitoken1155(reporter, config)]
}
