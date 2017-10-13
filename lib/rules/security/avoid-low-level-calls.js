const BaseChecker = require('./../base-checker');
const { hasMethodCalls } = require('./../../common/tree-traversing');


class AvoidLowLevelCallsChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitExpression(ctx) {
        if (hasMethodCalls(ctx, ['call', 'callcode', 'delegatecall'])) {
            this._warn(ctx);
        }
    }

    _warn(ctx) {
        const message = 'Avoid to use low level calls.';
        this.warn(ctx, 'avoid-low-level-calls', message);
    }
}


module.exports = AvoidLowLevelCallsChecker;