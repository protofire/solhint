const BaseChecker = require('./../base-checker');


const FROBIDDEN_NAMES = ['I', 'l', 'O'];

class ForbiddenNamesChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitIdentifier(ctx) {
        const text = ctx.getText();

        if (FROBIDDEN_NAMES.includes(text)) {
            this.error(ctx, 'use-forbidden-name', 'Avoid to use letters \'I\', \'l\', \'O\' as identifiers');
        }
    }

}


module.exports = ForbiddenNamesChecker;