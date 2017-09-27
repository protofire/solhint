const Reporter = require('./../../reporter');
const BlankLineCounter = require('./../../common/blank-line-counter');


const SEVERITY = Reporter.SEVERITY;

class OneLineBetweenContractPartsChecker {

    constructor(reporter) {
        this.reporter = reporter;
        this.lineCounter = new BlankLineCounter();
    }

    enterContractDefinition(ctx) {
        const lineCounter = this.lineCounter;
        lineCounter.calcTokenLines(ctx);

        const items = (ctx.children || []).filter(i => i.constructor.name === 'ContractPartContext');

        for (let i = 0, j = i + 1; j < items.length; i += 1, j += 1) {
            const curItem = items[i];
            const nextItem = items[j];
            const bothPartsIsNotSingleLine = !(this.isSingleLine(curItem) && this.isSingleLine(nextItem));

            if (bothPartsIsNotSingleLine
                && lineCounter.countOfEmptyLinesBetween(curItem.stop.line, nextItem.start.line) !== 1) {
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