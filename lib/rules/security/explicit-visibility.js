const Reporter = require('./../../reporter');


const SEVERITY = Reporter.SEVERITY;

class ExplicitVisibilityChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitModifierList(ctx) {
        const text = ctx.getText();

        const hasInternal = text.includes('internal');
        const hasExternal = text.includes('external');
        const hasPrivate = text.includes('private');
        const hasPublic = text.includes('public');

        if (!hasExternal && !hasInternal && !hasPrivate && !hasPublic) {
            this.reporter.addMessage(
                ctx.getSourceInterval(), SEVERITY.WARN,
                'Explicitly mark visibility in function', 'func-visibility'
            );
        }
    }

    exitStateVariableDeclaration(ctx) {
        const text = ctx.getText();

        const hasInternal = text.includes('internal');
        const hasPrivate = text.includes('private');
        const hasPublic = text.includes('public');

        if (!hasInternal && !hasPrivate && !hasPublic) {
            this.reporter.addMessage(
                ctx.getSourceInterval(), SEVERITY.WARN,
                'Explicitly mark visibility of state', 'state-visibility'
            );
        }
    }

}


module.exports = ExplicitVisibilityChecker;