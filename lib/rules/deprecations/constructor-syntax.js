const BaseDeprecation = require('./base-deprecation');
const TreeTraversing = require('./../../common/tree-traversing');
const traversing = new TreeTraversing();

class ConstructorSyntax extends BaseDeprecation {

    constructor(reporter) {
        super(reporter);
    }

    deprecationVersion() {
        return '0.4.22';
    }

    exitFunctionDefinition(ctx) {
        if(this.active) {
            const contract = traversing.findParentType(ctx, 'ContractDefinitionContext');
            const contractName = contract.children[1].getText();
            const functionName = ctx.children[1].getText();
            if(functionName === contractName) {
                this.warn(ctx, 'constructor-syntax', 'Constructors should use the new constructor keyword.');
            }
        }
    }

    exitConstructorDefinition(ctx) {
        if(!this.active) {
            var message = 'Constructor keyword not available before 0.4.22 (' + this.version + ')';
            this.error(ctx, 'constructor-syntax', message);
        }
    }
}

module.exports = ConstructorSyntax;
