const FallbackMustBePayableChecker = require('./fallback-must-be-payable');
const NoEmptyBlocksChecker = require('./no-empty-blocks');
const NoUnusedVarsChecker = require('./no-unused-vars');


module.exports = function checkers(reporter) {
    return [
        new FallbackMustBePayableChecker(reporter),
        new NoEmptyBlocksChecker(reporter),
        new NoUnusedVarsChecker(reporter)
    ];
};
