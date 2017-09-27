const BaseChecker = require('./../base-checker');
const { StatementsIndentValidator, Term, Rule } = require('./../../common/statements-indent-validator');


class ExpressionAlignChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    enterExpression (ctx) {
        const expression = Rule.expression;
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('new').space().rule('typeName'),
                expression().noSpacesAround('[').expression().noSpaces().term(']'),
                expression().noSpacesAround('(').rule('functionCallArguments').noSpaces().term(')'),
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
            .errorsTo(
                this._error.bind(this)
            );
    }

    _error(ctx, message) {
        this.error(ctx, 'expression-indent', `Expression indentation is incorrect. ${message}`);
    }
}


module.exports = ExpressionAlignChecker;