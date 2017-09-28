const BaseChecker = require('./../base-checker');
const BlankLineCounter = require('./../../common/blank-line-counter');
const { typeOf } = require('./../../common/tree-traversing');


class SeparateTopLevelByTwoLinesChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
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

            if (typeOf(curItem) === 'contractDefinition') {
                if (prevItem.stop && lineCounter.countOfEmptyLinesBetween(prevItem, curItem) !== 2) {
                    this.makeReport(curItem);
                    continue;
                }

                if (nextItem.start && lineCounter.countOfEmptyLinesBetween(curItem, nextItem) !== 2) {
                    this.makeReport(curItem);
                }
            }
        }
    }

    makeReport(ctx) {
        const message = 'Definition must be surrounded with two blank line indent';
        this.error(ctx, 'two-lines-top-level-separator', message);
    }
}


module.exports = SeparateTopLevelByTwoLinesChecker;