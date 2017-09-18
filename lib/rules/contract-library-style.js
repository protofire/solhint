const Reporter = require('./../reporter');
const naming = require('./../common/identifier-naming');


const SEVERITY = Reporter.SEVERITY;

class ContractNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterContractDefinition(ctx) {
        this.validateContractName(ctx);
    }

    enterStructDefinition(ctx) {
        this.validateContractName(ctx);
    }

    enterEnumDefinition(ctx) {
        this.validateContractName(ctx);
    }

    validateContractName(ctx) {
        const identifier = ctx.children[1];

        if (identifier.constructor.name === 'IdentifierContext') {
            const text = identifier.getText();

            if (naming.isNotCamelCase(text)) {
                this.reporter.addMessage(
                    identifier.getSourceInterval(), SEVERITY.ERROR,
                    'Contract name must be in CamelCase', 'contract-name-camelcase'
                );
            }
        }
    }

}


module.exports = ContractNameStyleChecker;