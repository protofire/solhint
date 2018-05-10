const TreeTraversing = require('./../../common/tree-traversing');
const traversing = new TreeTraversing();
const BaseChecker = require('./../base-checker');


class MultipleSendCallsInTxChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
        this.funcDefSet = new Set();
    }

    exitExpression(ctx) {
        const isOk = this.validateMultipleSendInFunc(ctx);
        isOk && this.validateSendCallInLoop(ctx);
    }

    validateMultipleSendInFunc(ctx) {
        if (ctx.getText().includes('.send(')) {
            const curFuncDef = traversing.findParentType(ctx, 'FunctionDefinitionContext');

            if (curFuncDef && this.funcDefSet.has(curFuncDef)) {
                this.error(ctx);
                return false;
            } else {
                this.funcDefSet.add(curFuncDef);
            }
        }

        return true;
    }

    validateSendCallInLoop(ctx) {
        if (ctx.getText().includes('.send(')) {
            const hasForLoop = traversing.findParentType(ctx, 'ForStatementContext') !== null;
            const hasWhileLoop = traversing.findParentType(ctx, 'WhileStatementContext') !== null;
            const hasDoWhileLoop = traversing.findParentType(ctx, 'DoWhileStatementContext') !== null;

            if (hasForLoop || hasWhileLoop || hasDoWhileLoop) {
                this.error(ctx);
            }
        }
    }

    error(ctx) {
        super.error(ctx, 'multiple-sends', 'Avoid multiple calls of "send" method in single transaction');
    }
}


module.exports = MultipleSendCallsInTxChecker;
