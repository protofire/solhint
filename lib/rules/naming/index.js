const FunctionNameStyleChecker = require('./func-name-style');
const FunctionParamNameStyleChecker = require('./func-params-style');
const VarNameStyleChecker = require('./var-name-style');
const EventNameStyleChecker = require('./event-name-style');
const ModifierNameStyleChecker = require('./modifier-name-style');
const ContractNameStyleChecker = require('./contract-library-style');
const ForbiddenNamesChecker = require('./forbidden-names');


module.exports = function checkers(reporter) {
    return [
        new FunctionNameStyleChecker(reporter),
        new FunctionParamNameStyleChecker(reporter),
        new VarNameStyleChecker(reporter),
        new EventNameStyleChecker(reporter),
        new ModifierNameStyleChecker(reporter),
        new ContractNameStyleChecker(reporter),
        new ForbiddenNamesChecker(reporter)
    ];
};
