const Prettier = require('./prettier')
const QuotesChecker = require('./quotes')

module.exports = function checkers(reporter, config, inputSrc, fileName) {
  return [new QuotesChecker(reporter, config), new Prettier(reporter, config, inputSrc, fileName)]
}
