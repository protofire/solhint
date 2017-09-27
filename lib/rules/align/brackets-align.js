const BaseChecker = require('./../base-checker');
const { hasSpaceBefore, onSameLine, prevToken, startOf } = require('./../../common/tokens');
const { typeOf } = require('./../../common/tree-traversing');


class BracketsAlign extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    enterBlock (ctx) {
        this.validateBlock(ctx);
    }

    enterContractDefinition (ctx) {
        this.validateBlock(ctx);
    }

    enterStructDefinition (ctx) {
        this.validateBlock(ctx);
    }

    enterEnumDefinition (ctx) {
        this.validateBlock(ctx);
    }

    enterImportDirective(ctx) {
        this.validateBlock(ctx);
    }

    enterFunctionCallArguments(ctx) {
        this.validateBlock(ctx);
    }

    validateBlock(ctx) {
        if (typeOf(ctx.parentCtx) === 'functionDefinition') {
            return;
        }

        this._validateOpenBracket(ctx);
    }

    _validateOpenBracket(ctx) {
        const bracket = this._openBracket(ctx);

        if (bracket && !this._isCorrectAligned(bracket)) {
            this._error(ctx);
        }
    }

    _isCorrectAligned(bracket) {
        return hasSpaceBefore(bracket) && onSameLine(startOf(bracket), prevToken(bracket));
    }

    _openBracket(ctx) {
        const children = ctx.children;
        const bracket = children && children.filter(i => i.getText() === '{');

        return (bracket && bracket.length === 1) ? bracket[0] : null;
    }

    _error(ctx) {
        const message = 'Open bracket must be on same line. It must be indented by other constructions by space';
        this.error(ctx, 'bracket-align', message);
    }

}


module.exports = BracketsAlign;