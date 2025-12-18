const QuotesChecker = require('./quotes')
const ComprehensiveInterfaceChecker = require('./comprehensive-interface')
const DuplicatedImportsChecker = require('./duplicated-imports')
const ImportPathChecker = require('./import-path-check')
const FoundryNoBlockTimeNumberChecker = require('./foundry-no-block-time-number')

module.exports = function checkers(reporter, config, tokens, fileName) {
  return [
    new QuotesChecker(reporter, config, tokens),
    new ComprehensiveInterfaceChecker(reporter, config, tokens),
    new DuplicatedImportsChecker(reporter),
    new ImportPathChecker(reporter, config, fileName),
    new FoundryNoBlockTimeNumberChecker(reporter, config, fileName),
  ]
}
