const Reporter = require('./../../reporter');


const SEVERITY = Reporter.SEVERITY;

class ImportsOnTopChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitSourceUnit(ctx) {
        let hasContractDef = false;
        for (let i = 0; ctx.children && i < ctx.children.length; i += 1) {
            const curItem = ctx.children[i];

            if (curItem.constructor.name === 'ContractDefinitionContext') {
                hasContractDef = true;
            }

            if (hasContractDef && curItem.constructor.name === 'ImportDirectiveContext') {
                this.makeReport(curItem);
            }
        }
    }

    makeReport(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            'Import statements must be on top', 'imports-on-top'
        );
    }
}


module.exports = ImportsOnTopChecker;