const BaseChecker = require('./../base-checker');
const _ = require('lodash');
const { lineOf, stopLine } = require('./../../common/tokens');


const DEFAULT_MAX_LINES_COUNT = 50;


class FunctionMaxLinesChecker extends BaseChecker {

    constructor(reporter, config) {
        super(reporter);

        this.maxLines = config.getNumber('function-max-lines', DEFAULT_MAX_LINES_COUNT);
    }

    enterFunctionDefinition(ctx) {
        const block = Block.of(ctx);

        if (block.linesCount() > this.maxLines) {
            this.error(block);
        }
    }

    error(block) {
        const linesCount = block.linesCount();
        const message = `Function body contains ${linesCount} lines but allowed no more than ${this.maxLines} lines`;
        super.error(block.ctx, 'function-max-lines', message);
    }
}


class Block {

    static of(functionDefinitionCtx) {
        const lastNode = _.last(functionDefinitionCtx.children);
        return new Block(lastNode);
    }

    constructor(ctx) {
        this.ctx = ctx;
    }

    linesCount() {
        const ctx = this.ctx;
        const startStopGap = stopLine(ctx) - lineOf(ctx);

        if (this._isSingleLineBlock(startStopGap)) {
            return 1;
        } else {
            return this._withoutCloseBracket(startStopGap);
        }
    }

    _isSingleLineBlock(startStopGap) {
        return startStopGap === 0;
    }

    _withoutCloseBracket(startStopGap) {
        return startStopGap - 1;
    }
}


module.exports = FunctionMaxLinesChecker;