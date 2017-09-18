const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;
const FROBIDDEN_NAMES = ['I', 'l', 'O'];

class ForbiddenNamesChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitIdentifier(ctx) {
        const text = ctx.getText();

        if (FROBIDDEN_NAMES.includes(text)) {
            this.reporter.addMessage(
                ctx.getSourceInterval(), SEVERITY.ERROR,
                'Avoid to use letters \'I\', \'l\', \'O\' as identifiers', 'use-forbidden-name'
            );
        }
    }

}


module.exports = ForbiddenNamesChecker;