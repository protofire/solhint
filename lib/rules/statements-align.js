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
                term('if').space().term('(').noSpaces().expression().noSpaces().term(')')
                    .rule('statement'),

                term('if').space().term('(').noSpaces().expression().noSpaces().term(')')
                    .rule('statement')
                    .term('else')
                    .rule('statement')
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