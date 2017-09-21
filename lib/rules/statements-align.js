const Reporter = require('./../reporter');
const SEVERITY = Reporter.SEVERITY;
const { StatementsIndentValidator, Term } = require('./../common/statements-indent-validator');


class StatementsAlignChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterIfStatement (ctx) {
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('if').space().term('(').noSpaces().expression().noSpaces().term(')').statement(),
                term('if').space().term('(').noSpaces().expression().noSpaces().term(')').statement()
                    .term('else').statement()
            )
            .forEachError(
                this.makeReport.bind(this)
            );
    }

    enterWhileStatement (ctx) {
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('while').space().term('(').noSpaces().expression().noSpaces().term(')').statement()
            )
            .forEachError(
                this.makeReport.bind(this)
            );
    }

    enterDoWhileStatement (ctx) {
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('do').statement()
                    .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').noSpaces().term(';')
            )
            .forEachError(
                this.makeReport.bind(this)
            );
    }

    makeReport(ctx, message) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            `Statement indentation is incorrect.${message && ' ' + message || ''}`,
            'statement-indent'
        );
    }
}



module.exports = StatementsAlignChecker;