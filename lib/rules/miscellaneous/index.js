const QuotesChecker = require('./quotes')

module.exports = function checkers(reporter, config, tokens) {
  return [new QuotesChecker(reporter, config, tokens)]
}
