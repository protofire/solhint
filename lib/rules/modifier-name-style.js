const Reporter = require('./../reporter');
const naming = require('./../common/identifier-naming');


const SEVERITY = Reporter.SEVERITY;

class ModifierNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitModifierDefinition(ctx) {
        const identifier = ctx.children[1];

        if (identifier.constructor.name === 'IdentifierContext') {
            const text = identifier.getText();

            if (naming.isNotSnakeCase(text)) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(), SEVERITY.ERROR,
                    'Modifier name must be in snake_case', 'modifier-name-snakecase'
                );
            }
        }
    }

}


module.exports = ModifierNameStyleChecker;