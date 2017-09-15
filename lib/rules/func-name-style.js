const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class FunctionNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitFunctionDefinition(ctx) {
        const identifier = ctx.children[1];

        if (identifier.constructor.name === 'IdentifierContext') {
            const text = identifier.getText();

            if (text.replace(/[a-z]+[a-zA-Z0-9]*/, '').length !== 0) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(), SEVERITY.ERROR,
                    'Function name must be in camelCase', 'func-name-camelcase'
                );
            }
        }
    }

}


module.exports = FunctionNameStyleChecker;