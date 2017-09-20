const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class OneLineBetweenContractPartsChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterContractDefinition(ctx) {
        const items = (ctx.children || []).filter(i => i.constructor.name === 'ContractPartContext');

        for (let i = 0, j = i + 1; j < items.length; i += 1, j += 1) {
            const curItem = items[i];
            const nextItem = items[j];
            const bothPartsIsNotSingleLine = !(this.isSingleLine(curItem) && this.isSingleLine(nextItem));

            if (bothPartsIsNotSingleLine && curItem.stop.line + 2 !== nextItem.start.line) {
                this.makeReport(nextItem);
            }
        }
    }

    isSingleLine (item) {
        return item.start.line === item.stop.line;
    }

    makeReport(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            'Definitions inside contract / library must be separated by one line', 'separate-by-one-line-in-contract'
        );
    }
}


module.exports = OneLineBetweenContractPartsChecker;