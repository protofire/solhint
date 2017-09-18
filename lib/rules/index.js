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


module.exports = function checkers(reporter) {
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
        new ModifierNameStyleChecker(reporter)
    ];
};
