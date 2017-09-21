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
        Term
            .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').statement()
            .forEachError(ctx, this.makeReport.bind(this));
    }

    enterDoWhileStatement (ctx) {
        Term
            .term('do').statement()
            .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').noSpaces().term(';')
            .forEachError(ctx, this.makeReport.bind(this));
    }

    enterForStatement (ctx) {
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('for').space().term('(').noSpaces().term(';').noSpaces().term(';').noSpaces().term(')')
                    .statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').noSpaces().term(';').noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().term(';').space().expression().noSpaces().term(';').noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().term(';').noSpaces().term(';').space().expression().noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').space().expression().noSpaces().term(';').noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().term(';').space().expression().noSpaces().term(';').space().expression()
                    .noSpaces().term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').noSpaces().term(';').space().expression()
                    .noSpaces().term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').space().expression().noSpaces().term(';')
                    .space().expression().noSpaces().term(')').statement()
            )
            .forEachError(this.makeReport.bind(this));
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