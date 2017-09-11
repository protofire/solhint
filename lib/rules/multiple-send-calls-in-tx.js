const TreeTraversing = require('./../tree-traversing');
const Reporter = require('./../reporter');


const traversing = new TreeTraversing();
const SEVERITY = Reporter.SEVERITY;

class MultipleSendCallsInTxChecker {

    constructor(reporter) {
        this.reporter = reporter;
        this.funcDefSet = new Set();
    }

    exitExpression(ctx) {
        const isOk = this.validateMultipleSendInFunc(ctx);
        isOk && this.validateSendCallInLoop(ctx);
    }

    validateMultipleSendInFunc(ctx) {
        if (ctx.getText().startsWith('send(')) {
            const curFuncDef = traversing.findParentType(ctx, 'FunctionDefinitionContext');

            if (curFuncDef && this.funcDefSet.has(curFuncDef)) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(),
                    SEVERITY.ERROR,
                    'Avoid multiple calls of "send" method in single transaction'
                );
                return false;
            } else {
                this.funcDefSet.add(curFuncDef);
            }
        }

        return true;
    }

    validateSendCallInLoop(ctx) {
        if (ctx.getText().startsWith('send(')) {
            const hasForLoop = traversing.findParentType(ctx, 'ForStatementContext') !== null;
            const hasWhileLoop = traversing.findParentType(ctx, 'WhileStatementContext') !== null;
            const hasDoWhileLoop = traversing.findParentType(ctx, 'DoWhileStatementContext') !== null;

            if (hasForLoop || hasWhileLoop || hasDoWhileLoop) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(),
                    SEVERITY.ERROR,
                    'Avoid multiple calls of "send" method in single transaction'
                );
            }
        }
    }

}


module.exports = MultipleSendCallsInTxChecker;