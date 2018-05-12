const TreeTraversing = require('./../../common/tree-traversing');
const traversing = new TreeTraversing();
const BaseChecker = require('./../base-checker');


class ExternalCallChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitExpression(ctx) {
        this.validateSend(ctx);
        this.validateCallValue(ctx);
    }

    validateSend(ctx) {
        if (ctx.getText().includes('.send(')) {
            const hasVarDeclaration = traversing.statementNotContains(ctx, 'VariableDeclarationContext');
            const hasIfStatement = traversing.statementNotContains(ctx, 'IfStatementContext');

            if (!hasIfStatement && !hasVarDeclaration) {
                this.error(ctx, 'check-send-result', 'Check result of "send" call');
            }
        }
    }

    validateCallValue(ctx) {
        if (ctx.getText().endsWith('.call.value')) {
            this.error(ctx, 'avoid-call-value', 'Avoid to use ".call.value()()"');
        }
    }

}


module.exports = ExternalCallChecker;
