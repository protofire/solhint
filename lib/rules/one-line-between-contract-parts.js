const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class OneLineBetweenContractPartsChecker {

    constructor(reporter) {
        this.reporter = reporter;
        this.tokenLines = new Set();
    }

    enterContractDefinition(ctx) {
        this.calcTokenLines(ctx);

        const items = (ctx.children || []).filter(i => i.constructor.name === 'ContractPartContext');

        for (let i = 0, j = i + 1; j < items.length; i += 1, j += 1) {
            const curItem = items[i];
            const nextItem = items[j];
            const bothPartsIsNotSingleLine = !(this.isSingleLine(curItem) && this.isSingleLine(nextItem));

            if (bothPartsIsNotSingleLine
                && this.countOfEmptyLinesBetween(curItem.stop.line, nextItem.start.line) !== 1) {
                this.makeReport(nextItem);
            }
        }
    }

    countOfEmptyLinesBetween(start, end) {
        let count = 0;

        for (let i = start + 1; i < end; i += 1) {
            this.tokenLines.has(i) && count++;
        }

        return count;
    }

    calcTokenLines(ctx) {
        if (this.tokenLines.length === 0) {
            ctx.parser._input.tokens
                .filter(i => i.channel === 0)
                .forEach(i => this.tokenLines.add(i.line));
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