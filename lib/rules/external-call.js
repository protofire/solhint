const TreeTraversing = require('./../tree-traversing');
const Reporter = require('./../reporter');


const traversing = new TreeTraversing();
const SEVERITY = Reporter.SEVERITY;

class ExternalCallChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitExpression(ctx) {
        this.validateSend(ctx);
        this.validateCallValue(ctx);
    }

    validateSend(ctx) {
        if (ctx.getText().startsWith('send(')) {
            const hasVarDeclaration = traversing.statementNotContains(ctx, 'VariableDeclarationContext');
            const hasIfStatement = traversing.statementNotContains(ctx, 'IfStatementContext');

            if (!hasIfStatement && !hasVarDeclaration) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(),
                    SEVERITY.ERROR,
                    'Check result of "send" call',
                    'check-send-result'
                );
            }
        }
    }

    validateCallValue(ctx) {
        if (ctx.getText().includes('.call.value(')) {
            this.reporter.addMessage(
                ctx.getSourceInterval(),
                SEVERITY.ERROR,
                'Avoid to use ".call.value()()"',
                'avoid-call-value'
            );
        }
    }

}


module.exports = ExternalCallChecker;