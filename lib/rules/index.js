const ExternalCallChecker = require('./external-call');
const CompilerVersionChecker = require('./fixed-compiler');
const ExplicitVisibilityChecker = require('./explicit-visibility');
const AvoidDeprecationsChecker = require('./avoid-deprecations');
const KeepFallbackSimpleChecker = require('./keep-fallback-simple');
const NoSimilarFuncEventNamesChecker = require('./no-similar-func-event-names');
const MultipleSendCallsInTxChecker = require('./multiple-send-calls-in-tx');
const MarkUntrustedContractsChecker = require('./mark-unstrusted-contracts');
const FunctionNameStyleChecker = require('./func-name-style');
const FunctionParamNameStyleChecker = require('./func-params-style');
const VarNameStyleChecker = require('./var-name-style');
const EventNameStyleChecker = require('./event-name-style');
const ModifierNameStyleChecker = require('./modifier-name-style');
const ContractNameStyleChecker = require('./contract-library-style');
const ForbiddenNamesChecker = require('./forbidden-names');
const VisibilityModifierOrderChecker = require('./visibility-modifier-order');
const ImportsOnTopChecker = require('./imports-on-top');
const SeparateTopLevelByTwoLinesChecker = require('./separate-top-level-by-two-lines');
const FunctionOrderChecker = require('./function-order');
const QuotesChecker = require('./quotes');


module.exports = function checkers(reporter, config={}) {
    return [
        new ExternalCallChecker(reporter),
        new CompilerVersionChecker(reporter),
        new ExplicitVisibilityChecker(reporter),
        new AvoidDeprecationsChecker(reporter),
        new KeepFallbackSimpleChecker(reporter),
        new NoSimilarFuncEventNamesChecker(reporter),
        new MultipleSendCallsInTxChecker(reporter),
        new MarkUntrustedContractsChecker(reporter),
        new FunctionNameStyleChecker(reporter),
        new FunctionParamNameStyleChecker(reporter),
        new VarNameStyleChecker(reporter),
        new EventNameStyleChecker(reporter),
        new ModifierNameStyleChecker(reporter),
        new ContractNameStyleChecker(reporter),
        new ForbiddenNamesChecker(reporter),
        new VisibilityModifierOrderChecker(reporter),
        new ImportsOnTopChecker(reporter),
        new SeparateTopLevelByTwoLinesChecker(reporter),
        new FunctionOrderChecker(reporter),
        new QuotesChecker(reporter, config)
    ];
};
