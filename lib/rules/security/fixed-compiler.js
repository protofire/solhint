const Reporter = require('./../../reporter');


const SEVERITY = Reporter.SEVERITY;

class CompilerVersionChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitVersionOperator(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            'Compiler version must be fixed', 'compiler-fixed'
        );
    }

    exitVersionConstraint(ctx) {
        const versionNode = this.isVersionOperator(ctx.children[0]) && ctx.children[1] || ctx.children[0];

        if (versionNode.getText() < '0.4') {
            this.reporter.addMessage(
                ctx.getSourceInterval(), SEVERITY.ERROR,
                'Use at least \'0.4\' compiler version', 'compiler-gt-0_4'
            );
        }
    }

    isVersionOperator(ctx) {
        return ctx.constructor.name.includes('VersionOperator');
    }

}


module.exports = CompilerVersionChecker;