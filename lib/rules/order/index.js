const VisibilityModifierOrderChecker = require('./visibility-modifier-order');
const ImportsOnTopChecker = require('./imports-on-top');
const SeparateTopLevelByTwoLinesChecker = require('./separate-top-level-by-two-lines');
const FunctionOrderChecker = require('./function-order');
const OneLineBetweenContractPartsChecker = require('./one-line-between-contract-parts');


module.exports = function (reporter) {
    return [
        new VisibilityModifierOrderChecker(reporter),
        new ImportsOnTopChecker(reporter),
        new SeparateTopLevelByTwoLinesChecker(reporter),
        new FunctionOrderChecker(reporter),
        new OneLineBetweenContractPartsChecker(reporter)
    ];
};
