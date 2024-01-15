const GasMultitoken1155 = require('./gas-multitoken1155')
const GasSmallStrings = require('./gas-small-strings')
// const GasIndexedEvents = require('./gas-indexed-events')

// module.exports = function checkers(reporter, config, tokens) {
module.exports = function checkers(reporter, config) {
  return [
    new GasMultitoken1155(reporter, config),
    new GasSmallStrings(reporter, config)
    // , new GasIndexedEvents(reporter, config),
  ]
}
