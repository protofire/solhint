const Reporter = require('./../reporter');
const BlankLineCounter = require('./../common/blank-line-counter');


const SEVERITY = Reporter.SEVERITY;

class SeparateTopLevelByTwoLinesChecker {

    constructor(reporter) {
        this.reporter = reporter;
        this.lineCounter = new BlankLineCounter();
    }

    enterSourceUnit(ctx) {
        const lineCounter = this.lineCounter;

        lineCounter.calcTokenLines(ctx);

        for (let i = 0; ctx.children && i < ctx.children.length; i += 1) {
            const prevItemIndex = i - 1;
            const prevItem = (prevItemIndex >= 0) && ctx.children[prevItemIndex];

            const curItem = ctx.children[i];

            const nextItemIndex = i + 1;
            const nextItem = (nextItemIndex < ctx.children.length) && ctx.children[nextItemIndex];

            if (curItem.constructor.name === 'ContractDefinitionContext') {
                if (prevItem.stop && lineCounter.countOfEmptyLinesBetweenTokens(prevItem, curItem) !== 2) {
                    this.makeReport(curItem);
                    continue;
                }

                if (nextItem.start && lineCounter.countOfEmptyLinesBetweenTokens(curItem, nextItem) !== 2) {
                    this.makeReport(curItem);
                }
            }
        }
    }

    makeReport(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            'Definition must be surrounded with two blank line indent', 'two-lines-top-level-separator'
        );
    }
}


module.exports = SeparateTopLevelByTwoLinesChecker;