const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class AvoidDeprecationsChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitIdentifier(ctx) {
        const text = ctx.getText();

        if (text.includes('sha3')) {
            this.reporter.addMessage(
                ctx.getSourceInterval(),
                SEVERITY.ERROR,
                'Use "keccak256" instead of deprecated "sha3"'
            );
        }

        if (text.includes('suicide')) {
            this.reporter.addMessage(
                ctx.getSourceInterval(),
                SEVERITY.ERROR,
                'Use "selfdestruct" instead of deprecated "suicide"'
            );
        }
    }

    exitThrowStatement(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(),
            SEVERITY.ERROR,
            '"throw" is deprecated, avoid to use it'
        );
    }

}


module.exports = AvoidDeprecationsChecker;