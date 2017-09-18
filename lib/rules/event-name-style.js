const Reporter = require('./../reporter');
const naming = require('./../common/identifier-naming');


const SEVERITY = Reporter.SEVERITY;

class EventNameStyleChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitEventDefinition(ctx) {
        const identifier = ctx.children[1];

        if (identifier.constructor.name === 'IdentifierContext') {
            const text = identifier.getText();

            if (naming.isNotCamelCase(text)) {
                this.reporter.addMessage(
                    ctx.getSourceInterval(), SEVERITY.ERROR,
                    'Event name must be in CamelCase', 'event-name-camelcase'
                );
            }
        }
    }

}


module.exports = EventNameStyleChecker;