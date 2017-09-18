const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class SeparateTopLevelByTwoLinesChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitSourceUnit(ctx) {
        for (let i = 0; ctx.children && i < ctx.children.length; i += 1) {
            const prevItemIndex = i - 1;
            const prevItem = (prevItemIndex >= 0) && ctx.children[prevItemIndex];

            const curItem = ctx.children[i];

            const nextItemIndex = i + 1;
            const nextItem = (nextItemIndex < ctx.children.length) && ctx.children[nextItemIndex];

            if (curItem.constructor.name === 'ContractDefinitionContext') {
                if (prevItem && prevItem.stop.line + 3 !== curItem.start.line) {
                    this.makeReport(curItem);
                }

                if (nextItem && nextItem.start && nextItem.start.line - 3 !== curItem.stop.line) {
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