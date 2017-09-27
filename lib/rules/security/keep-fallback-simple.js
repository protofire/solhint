const TreeTraversing = require('./../../common/tree-traversing');
const BaseChecker = require('./../base-checker');
const traversing = new TreeTraversing();


class KeepFallbackSimpleChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
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
                this.warn(ctx, 'no-complex-fallback', 'Fallback function must be simple');
            }
        }
    }

}


module.exports = KeepFallbackSimpleChecker;