const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class CompilerVersionChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitVersionOperator(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(),
            SEVERITY.ERROR,
            'Compiler version must be fixed'
        );
    }

    exitVersionLiteral(ctx) {
        if (ctx.getText() < '0.4') {
            this.reporter.addMessage(
                ctx.getSourceInterval(),
                SEVERITY.ERROR,
                'Use at least \'0.4\' compiler version'
            );
        }
    }

}


module.exports = CompilerVersionChecker;