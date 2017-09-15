const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class FunctionParamNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitParameter(ctx) {
        let identifier = this.findIdentifier(ctx);

        if (identifier && identifier.getText().replace(/[a-z]+[a-zA-Z0-9]*/, '').length !== 0) {
            this.reporter.addMessage(
                identifier.getSourceInterval(), SEVERITY.ERROR,
                'Function param name must be in mixedCase', 'func-param-name-camelcase'
            );
        }
    }

    findIdentifier(ctx) {
        const children = ctx.children;

        for (let i = 0; i < children.length; i += 1) {
            if (children[i].constructor.name === 'IdentifierContext') {
                return children[i];
            }
        }

        return null;
    }

}


module.exports = FunctionParamNameStyleChecker;