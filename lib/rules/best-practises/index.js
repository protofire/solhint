const FallbackMustBePayableChecker = require('./fallback-must-be-payable');
const NoEmptyBlocksChecker = require('./no-empty-blocks');
const NoUnusedVarsChecker = require('./no-unused-vars');
const FunctionMaxLinesChecker = require('./function-max-lines');


module.exports = function checkers(reporter, config) {
    return [
        new FallbackMustBePayableChecker(reporter),
        new NoEmptyBlocksChecker(reporter),
        new NoUnusedVarsChecker(reporter),
        new FunctionMaxLinesChecker(reporter, config)
    ];
};
