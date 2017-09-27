const BaseChecker = require('./../base-checker');
const naming = require('./../../common/identifier-naming');


class EventNameStyleChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitEventDefinition(ctx) {
        const identifier = ctx.children[1];
        const text = identifier.getText();

        if (naming.isNotCamelCase(text)) {
            this.error(ctx, 'event-name-camelcase', 'Event name must be in CamelCase');
        }
    }
}


module.exports = EventNameStyleChecker;