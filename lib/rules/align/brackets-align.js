const BaseChecker = require('./../base-checker');
const { hasSpaceBefore, onSameLine, prevToken, startOf } = require('./../../common/tokens');
const { typeOf } = require('./../../common/tree-traversing');
const _ = require('lodash');


class BracketsAlign extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    enterBlock(ctx) {
        this.validateBlock(ctx);
    }

    enterContractDefinition(ctx) {
        this.validateBlock(ctx);
    }

    enterStructDefinition(ctx) {
        this.validateBlock(ctx);
    }

    enterEnumDefinition(ctx) {
        this.validateBlock(ctx);
    }

    enterImportDirective(ctx) {
        this.validateBlock(ctx);
    }

    validateBlock(ctx) {
        const bracket = new Block(ctx).openBracket();

        if (bracket && !bracket.isCorrectAligned()) {
            this._error(bracket);
        }
    }

    _error({ ctx, errorMessage }) {
        this.error(ctx, 'bracket-align', errorMessage);
    }
}


class Block {

    constructor(ctx) {
        this.ctx = ctx;
    }

    openBracket() {
        const bracketCtx = this._openBracketCtx();

        return (bracketCtx) ? this._makeBracketObj(bracketCtx) : null;
    }

    isFunctionDefinition() {
        return typeOf(this.ctx.parentCtx) === 'functionDefinition';
    }

    _openBracketCtx() {
        const children = this.ctx.children;
        const openBrackets = children && children.filter(i => i.getText() === '{');

        return (_.size(openBrackets) === 1) ? openBrackets[0] : null;
    }

    _makeBracketObj(ctx) {
        return (this.isFunctionDefinition()) ? new FunctionOpenBracket(ctx) : new UsualOpenBracket(ctx);
    }
}


class OpenBracket {

    constructor(ctx) {
        this.ctx = ctx;
        this.errorMessage = 'Open bracket must be indented by other constructions by space';
    }

    isCorrectAligned() {
        return hasSpaceBefore(this.ctx);
    }
}


class FunctionOpenBracket extends OpenBracket {

}


class UsualOpenBracket extends OpenBracket {

    constructor(ctx) {
        super(ctx);
        this.errorMessage = 'Open bracket must be on same line. It must be indented by other constructions by space';
    }

    isOnSameLineWithPreviousToken() {
        const ctx = this.ctx;

        return onSameLine(startOf(ctx), prevToken(ctx));
    }

    isCorrectAligned() {
        return super.isCorrectAligned() && this.isOnSameLineWithPreviousToken();
    }
}


module.exports = BracketsAlign;
