const GasMultitoken1155 = require('./gas-multitoken1155')
const GasSmallStrings = require('./gas-small-strings')
const GasIndexedEvents = require('./gas-indexed-events')
const GasCalldataParameters = require('./gas-calldata-parameters')
const GasIncrementByOne = require('./gas-increment-by-one')
const GasStructPacking = require('./gas-struct-packing')
const GasNamedReturnValuesChecker = require('./gas-named-return-values')

module.exports = function checkers(reporter, config) {
  return [
    new GasMultitoken1155(reporter, config),
    new GasSmallStrings(reporter, config),
    new GasIndexedEvents(reporter, config),
    new GasCalldataParameters(reporter, config),
    new GasIncrementByOne(reporter, config),
    new GasStructPacking(reporter, config),
    new GasNamedReturnValuesChecker(reporter),
  ]
}
