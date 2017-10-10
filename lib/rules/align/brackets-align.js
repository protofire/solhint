const BaseChecker = require('./../base-checker');
const { hasSpaceBefore, onSameLine, prevToken, startOf } = require('./../../common/tokens');
const { typeOf } = require('./../../common/tree-traversing');
const _ = require('lodash');


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

    validateBlock(ctx) {
        const bracket = new Block(ctx).openBracket();

        if (!bracket.isCorrectAligned()) {
            this._error(bracket.ctx, bracket.errorMsg);
        }
    }

    _error(ctx, message) {
        this.error(ctx, 'bracket-align', message);
    }
}


class Block {

    constructor (ctx) {
        this.ctx = ctx;
    }

    openBracket () {
        const bracketCtx = this._openBracketCtx();

        return (this.isFunctionDefinition()) ? new FunctionOpenBracket(bracketCtx) : new OpenBracket(bracketCtx);
    }

    isFunctionDefinition () {
        return typeOf(this.ctx.parentCtx) === 'functionDefinition';
    }

    _openBracketCtx () {
        const children = this.ctx.children;
        const openBrackets = children && children.filter(i => i.getText() === '{');

        return (_.size(openBrackets) === 1) ? openBrackets[0] : null;
    }
}


class FunctionOpenBracket {

    constructor (ctx) {
        this.ctx = ctx;
        this.errorMsg = 'Open bracket must be indented by other constructions by space';
    }

    isCorrectAligned () {
        return hasSpaceBefore(this.ctx);
    }
}


class OpenBracket {

    constructor (ctx) {
        this.ctx = ctx;
        this.errorMsg = 'Open bracket must be on same line. It must be indented by other constructions by space';
    }

    hasSpaceBefore() {
        return hasSpaceBefore(this.ctx);
    }

    isOnSameLineWithPreviousToken () {
        const ctx = this.ctx;

        return onSameLine(startOf(ctx), prevToken(ctx));
    }

    isCorrectAligned () {
        return this.hasSpaceBefore() && this.isOnSameLineWithPreviousToken();
    }
}


module.exports = BracketsAlign;