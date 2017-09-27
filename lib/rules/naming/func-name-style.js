const BaseChecker = require('./../base-checker');
const naming = require('./../../common/identifier-naming');
const TreeTraversing = require('./../../common/tree-traversing');
const { typeOf } = TreeTraversing;
const traversing = new TreeTraversing();


class FunctionNameStyleChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitFunctionDefinition(ctx) {
        const identifier = ctx.children[1];

        if (typeOf(identifier) === 'identifier') {
            const text = identifier.getText();

            if (naming.isNotMixedCase(text) && !this.isConstructor(ctx, text)) {
                this.error(ctx, 'func-name-mixedcase', 'Function name must be in mixedCase');
            }
        }
    }

    isConstructor(ctx, name) {
        const parentDefinition = traversing.findParentType(ctx, 'ContractDefinitionContext');
        const contractName = parentDefinition.children[1].getText();

        return (contractName === name);
    }

}


module.exports = FunctionNameStyleChecker;