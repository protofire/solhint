const Reporter = require('./../reporter');
const TreeTraversing = require('./../tree-traversing');


const SEVERITY = Reporter.SEVERITY;
const traversing = new TreeTraversing();

class VarNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitIdentifierList(ctx) {
        this.validateVariablesName(ctx);
    }

    exitVariableDeclaration(ctx) {
        this.validateVariablesName(ctx);
    }

    exitStateVariableDeclaration(ctx) {
        const hasConstModifier = ctx.children.some(i => i.getText() == 'constant');

        if (!hasConstModifier) {
            this.validateVariablesName(ctx);
        }
    }

    validateVariablesName(ctx) {
        let mixedCaseRegexp = /[a-z]+[a-zA-Z0-9]*/;

        for (let curId of traversing.findIdentifier(ctx)) {
            const text = curId.getText();

            if (text.replace(mixedCaseRegexp, '').length > 0) {
                this.reporter.addMessage(
                    curId.getSourceInterval(), SEVERITY.ERROR,
                    'Variable name must be in mixedCase', 'var-name-mixedcase'
                );
            }
        }
    }

}


module.exports = VarNameStyleChecker;