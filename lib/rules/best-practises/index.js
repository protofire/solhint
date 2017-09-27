const FallbackMustBePayableChecker = require('./fallback-must-be-payable');
const NoEmptyBlocksChecker = require('./no-empty-blocks');


module.exports = function checkers(reporter) {
    return [
        new FallbackMustBePayableChecker(reporter),
        new NoEmptyBlocksChecker(reporter)
    ];
};
