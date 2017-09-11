const TreeTraversing = require('./../tree-traversing');
const Reporter = require('./../reporter');


const traversing = new TreeTraversing();
const SEVERITY = Reporter.SEVERITY;

class KeepFallbackSimpleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitFunctionDefinition(ctx) {
        const firstChild = ctx.children[0];
        const isFirstChildFunction = firstChild && firstChild.getText() === 'function';

        const secondChild = ctx.children[1];
        const isSecondChildParams = secondChild && secondChild.constructor.name === 'ParameterListContext';

        const isFallbackFunction = isFirstChildFunction && isSecondChildParams;

        if (isFallbackFunction) {
            const block = traversing.findDownType(ctx, 'BlockContext');
            const TERMINAL_NODE_COUNT = 2;

            if (block && block.children.length - TERMINAL_NODE_COUNT >= 2) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(),
                    SEVERITY.WARN,
                    'Fallback function must be simple'
                );
            }
        }
    }

}


module.exports = KeepFallbackSimpleChecker;