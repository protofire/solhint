const BaseChecker = require('./../base-checker');


class NoSimilarFuncEventNamesChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);

        this.funcNameMap = {};
        this.eventNameMap = {};
    }

    exitFunctionDefinition(ctx) {
        const secondChild = ctx.children[1];

        if (secondChild.constructor.name === 'IdentifierContext') {
            const id = secondChild.getText().toLowerCase();

            if (this.eventNameMap[id]) {
                this.error(ctx);
            }

            this.funcNameMap[id] = true;
        }
    }

    exitEventDefinition(ctx) {
        const id = ctx.children[1].getText().toLowerCase();

        if (this.funcNameMap[id]) {
            this.error(ctx);
        }

        this.eventNameMap[id] = true;
    }

    error(ctx) {
        super.warn(ctx, 'no-simple-event-func-name', 'Event and function names must be different');
    }

}


module.exports = NoSimilarFuncEventNamesChecker;
