const BaseChecker = require('./../base-checker');
const naming = require('./../../common/identifier-naming');
const { typeOf } = require('./../../common/tree-traversing');


class ModifierNameStyleChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitModifierDefinition(ctx) {
        const identifier = ctx.children[1];

        if (typeOf(identifier) === 'identifier') {
            const text = identifier.getText();

            if (naming.isNotMixedCase(text)) {
                this.error(ctx, 'modifier-name-mixedcase', 'Modifier name must be in mixedCase');
            }
        }
    }
}


module.exports = ModifierNameStyleChecker;