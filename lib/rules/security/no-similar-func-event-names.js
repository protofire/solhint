const Reporter = require('./../../reporter');


const SEVERITY = Reporter.SEVERITY;

class NoSimilarFuncEventNamesChecker {

    constructor(reporter) {
        this.reporter = reporter;
        this.funcNameMap = {};
        this.eventNameMap = {};
    }

    exitFunctionDefinition(ctx) {
        const secondChild = ctx.children[1];

        if (secondChild.constructor.name === 'IdentifierContext') {
            const id = secondChild.getText().toLowerCase();

            if (this.eventNameMap[id]) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(), SEVERITY.WARN,
                    'Event and function names must be different', 'no-simple-event-func-name'
                );
            }

            this.funcNameMap[id] = true;
        }
    }

    exitEventDefinition(ctx) {
        const secondChild = ctx.children[1];

        if (secondChild.constructor.name === 'IdentifierContext') {
            const id = secondChild.getText().toLowerCase();

            if (this.funcNameMap[id]) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(), SEVERITY.WARN,
                    'Event and function names must be different', 'no-simple-event-func-name'
                );
            }

            this.eventNameMap[id] = true;
        }
    }

}


module.exports = NoSimilarFuncEventNamesChecker;
