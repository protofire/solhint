const Reporter = require('./../reporter');
const TreeTraversing = require('./../common/tree-traversing');
const naming = require('./../common/identifier-naming');


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

        if (hasConstModifier) {
            this.validateConstantName(ctx);
        } else {
            this.validateVariablesName(ctx);
        }
    }

    exitIndexedParameter(ctx) {
        this.validateVariablesName(ctx);
    }

    validateVariablesName(ctx) {
        for (let curId of traversing.findIdentifier(ctx)) {
            const text = curId.getText();

            if (naming.isNotMixedCase(text)) {
                this.reporter.addMessage(
                    curId.getSourceInterval(), SEVERITY.ERROR,
                    'Variable name must be in mixedCase', 'var-name-mixedcase'
                );
            }
        }
    }

    validateConstantName(ctx) {
        for (let curId of traversing.findIdentifier(ctx)) {
            const text = curId.getText();

            if (naming.isNotUpperSnakeCase(text)) {
                this.reporter.addMessage(
                    curId.getSourceInterval(), SEVERITY.ERROR,
                    'Constant name must be in SNAKE_CASE', 'const-name-snakecase'
                );
            }
        }
    }

}


module.exports = VarNameStyleChecker;