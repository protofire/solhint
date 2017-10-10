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
        const block = new Block(ctx);

        if (block.isFunctionDefinition()) {
            this._validateFunctionBlock(block);
        } else {
            this._validateOtherBlock(block);
        }
    }

    _validateFunctionBlock(block) {
        this._validateBracketOf(block, {
            isCorrectAligned: bracket => bracket.hasSpaceBefore(),
            error: 'Open bracket must be indented by other constructions by space'
        });
    }

    _validateOtherBlock(block) {
        this._validateBracketOf(block, {
            isCorrectAligned: bracket => bracket.hasSpaceBeforeAndOnSameLineWithPreviousToken(),
            error: 'Open bracket must be on same line. It must be indented by other constructions by space'
        });
    }

    _validateBracketOf(block, params) {
        const openBracket = block.openBracket();
        const { isCorrectAligned, error } = params;

        if (!isCorrectAligned(openBracket)) {
            this._error(openBracket.ctx, error);
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
        const children = this.ctx.children;
        const openBrackets = children && children.filter(i => i.getText() === '{');

        if (_.size(openBrackets) === 1) {
            return new OpenBracket(openBrackets[0]);
        }
    }

    isFunctionDefinition () {
        return typeOf(this.ctx.parentCtx) === 'functionDefinition';
    }
}


class OpenBracket {

    constructor (ctx) {
        this.ctx = ctx;
    }

    hasSpaceBefore() {
        return hasSpaceBefore(this.ctx);
    }

    isOnSameLineWithPreviousToken () {
        const ctx = this.ctx;

        return onSameLine(startOf(ctx), prevToken(ctx));
    }

    hasSpaceBeforeAndOnSameLineWithPreviousToken () {
        return this.hasSpaceBefore() && this.isOnSameLineWithPreviousToken();
    }
}


module.exports = BracketsAlign;