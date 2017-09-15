const Reporter = require('./../reporter');
const naming = require('./../common/identifier-naming');


const SEVERITY = Reporter.SEVERITY;

class FunctionNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitFunctionDefinition(ctx) {
        const identifier = ctx.children[1];

        if (identifier.constructor.name === 'IdentifierContext') {
            const text = identifier.getText();

            if (naming.isNotMixedCase(text)) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(), SEVERITY.ERROR,
                    'Function name must be in mixedCase', 'func-name-mixedcase'
                );
            }
        }
    }

}


module.exports = FunctionNameStyleChecker;