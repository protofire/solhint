const QuotesChecker = require('./quotes')

module.exports = function checkers(reporter, config, inputSrc, fileName) {
  return [new QuotesChecker(reporter, config)]
}
