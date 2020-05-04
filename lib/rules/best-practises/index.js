const CodeComplexityChecker = require('./code-complexity')
const FunctionMaxLinesChecker = require('./function-max-lines')
const MaxLineLengthChecker = require('./max-line-length')
const MaxStatesCountChecker = require('./max-states-count')
const NoEmptyBlocksChecker = require('./no-empty-blocks')
const NoUnusedVarsChecker = require('./no-unused-vars')
const PayableFallbackChecker = require('./payable-fallback')
const ReasonStringChecker = require('./reason-string')

module.exports = function checkers(reporter, config, inputSrc) {
  return [
    new CodeComplexityChecker(reporter, config),
    new FunctionMaxLinesChecker(reporter, config),
    new MaxLineLengthChecker(reporter, config, inputSrc),
    new MaxStatesCountChecker(reporter, config),
    new NoEmptyBlocksChecker(reporter),
    new NoUnusedVarsChecker(reporter),
    new PayableFallbackChecker(reporter),
    new ReasonStringChecker(reporter, config)
  ]
}
