const ExternalCallChecker = require('./external-call');
const CompilerVersionChecker = require('./fixed-compiler');
const ExplicitVisibilityChecker = require('./explicit-visibility');
const AvoidDeprecationsChecker = require('./avoid-deprecations');
const KeepFallbackSimpleChecker = require('./keep-fallback-simple');
const NoSimilarFuncEventNamesChecker = require('./no-similar-func-event-names');
const MultipleSendCallsInTxChecker = require('./multiple-send-calls-in-tx');
// const MarkUntrustedContractsChecker = require('./mark-unstrusted-contracts');
const AvoidTxOriginChecker = require('./avoid-tx-origin');
const NotRelyOnTimeChecker = require('./not-rely-on-time');
const NoInlineAssemblyChecker = require('./no-inline-assembly');
const NotRelyOnBlockHashChecker = require('./not-rely-on-block-hash');
const ReentrancyChecker = require('./reentrancy');
const AvoidLowLevelCallsChecker = require('./avoid-low-level-calls');


module.exports = function (reporter) {
    return [
        new ExternalCallChecker(reporter),
        new CompilerVersionChecker(reporter),
        new ExplicitVisibilityChecker(reporter),
        new AvoidDeprecationsChecker(reporter),
        new KeepFallbackSimpleChecker(reporter),
        new NoSimilarFuncEventNamesChecker(reporter),
        new MultipleSendCallsInTxChecker(reporter),
        // new MarkUntrustedContractsChecker(reporter),
        new AvoidTxOriginChecker(reporter),
        new NotRelyOnTimeChecker(reporter),
        new NoInlineAssemblyChecker(reporter),
        new NotRelyOnBlockHashChecker(reporter),
        new ReentrancyChecker(reporter),
        new AvoidLowLevelCallsChecker(reporter)
    ];
};
