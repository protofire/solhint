const BaseChecker = require('./../base-checker');
const _ = require('lodash');
const { hasMethodCalls } = require('./../../common/tree-traversing');


class ReentrancyChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    enterFunctionDefinition(ctx) {
        ctx.effects = new Effects();
    }

    enterExpression(ctx) {
        this._checkAssignment(ctx);
        this._checkSendCall(ctx);
    }

    _checkAssignment(ctx) {
        const effects = Effects.of(ctx);

        if (isAssignOperator(ctx) && effects && !effects.isAllowedAssign()) {
            this._warn(ctx);
        }
    }

    _checkSendCall(ctx) {
        if (hasMethodCalls(ctx, ['send', 'transfer'])) {
            Effects.of(ctx).trackTransfer();
        }
    }

    _warn(ctx) {
        this.warn(ctx, 'reentrancy', 'Possible reentrancy vulnerabilities. Avoid state changes after transfer.');
    }
}


class Effects {

    static of (ctx) {
        let curCtx = ctx;

        while (curCtx !== null && !curCtx.effects) {
            curCtx = curCtx.parentCtx;
        }

        return curCtx.effects;
    }

    constructor () {
        this.hasTransfer = false;
    }

    isAllowedAssign() {
        return !this.hasTransfer;
    }

    trackTransfer() {
        this.hasTransfer = true;
    }
}


function isAssignOperator(ctx) {
    return _.size(ctx.children) === 3 && ctx.children[1].getText() === '=';
}


module.exports = ReentrancyChecker;
