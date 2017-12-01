const BaseChecker = require('./../base-checker');
const { typeOf } = require('./../../common/tree-traversing');


const ONLY_BRACKETS_LENGTH = 2;
const EMPTY_STRUCT_LENGTH = 4;
const EMPTY_ENUM_LENGTH = 4;


class NoEmptyBlocksChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitBlock(ctx) {
        this._validateChildrenCount(ctx, ONLY_BRACKETS_LENGTH);
    }

    exitStructDefinition(ctx) {
        this._validateChildrenCount(ctx, EMPTY_STRUCT_LENGTH);
    }

    exitEnumDefinition(ctx) {
        this._validateChildrenCount(ctx, EMPTY_ENUM_LENGTH);
    }

    exitAssemblyBlock(ctx) {
        this._validateChildrenCount(ctx, ONLY_BRACKETS_LENGTH);
    }

    exitContractDefinition(ctx) {
        this._validateContractPartsCount(ctx);
    }

    _validateChildrenCount(ctx, count) {
        if (ctx.children && ctx.children.length === count) {
            this.error(ctx);
        }
    }

    _validateContractPartsCount(ctx) {
        const contractPartCount = ctx
            .children
            .filter(i => typeOf(i) === 'contractPart')
            .length;

        if (contractPartCount === 0) {
            this.error(ctx);
        }
    }

    error(ctx) {
        super.warn(ctx, 'no-empty-blocks', 'Code contains empty block');
    }
}


module.exports = NoEmptyBlocksChecker;
