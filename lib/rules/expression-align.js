const Reporter = require('./../reporter');
const SEVERITY = Reporter.SEVERITY;
const { StatementsIndentValidator, Term, Rule } = require('./../common/statements-indent-validator');


class ExpressionAlignChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterExpression (ctx) {
        const expression = Rule.expression;
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('new').space().rule('typeName'),
                expression().noSpacesAround('[').expression().noSpacesAround(']'),
                expression().noSpacesAround('(').rule('functionCallArguments').noSpacesAround(')'),
                expression().noSpacesAround('.').expression(),
                term('(').noSpaces().expression().noSpaces().term(')'),
                expression().spaceAround('=', '|=', '^=', '&=', '<<=').expression(),
                expression().spaceAround('>>=', '+=', '-=', '*=', '/=', '%=').expression(),
                expression().spaceAround('==', '!=', '<', '>', '<=', '>=').expression(),
                expression().spaceAroundOrNot('^', '**', '*',  '/', '%', '+', '-').expression(),
                expression().spaceAroundOrNot('<<', '>>', '&', '|', '&&', '||').expression(),
                expression().spaceAround('?').expression().spaceAround(':').expression(),
                term('!', '~', 'after', 'delete', '+', '-', '++', '--').noSpaces().expression(),
                expression().noSpaces().term('++', '--')
            )
            .forEachError(
                this.makeReport.bind(this)
            );
    }

    makeReport(ctx, message) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            `Expression indentation is incorrect.${message && ' ' + message || ''}`,
            'expression-indent'
        );
    }
}



module.exports = ExpressionAlignChecker;