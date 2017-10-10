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
            this._validateBracket(ctx, {
                isCorrectAligned: i => i.hasSpaceBefore(),
                errorMessage: 'Open bracket must be indented by other constructions by space'
            });
        } else {
            this._validateBracket(ctx, {
                isCorrectAligned: i => i.hasSpaceBeforeAndOnSameLineWithPreviousToken(),
                errorMessage: 'Open bracket must be on same line. It must be indented by other constructions by space'
            });
        }
    }

    _validateBracket(ctx, params) {
        const openBracket = new Block(ctx).openBracket();
        const { isCorrectAligned, errorMessage } = params;

        if (!isCorrectAligned(openBracket)) {
            this._error(openBracket.ctx, errorMessage);
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