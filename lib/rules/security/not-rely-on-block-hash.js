const BaseChecker = require('./../base-checker');


class NotRelyOnBlockHashChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitExpression(ctx) {
        if (ctx.getText() === 'block.blockhash') {
            this._warn(ctx);
        }
    }

    _warn(ctx) {
        this.warn(ctx, 'not-rely-on-block-hash', 'Do not rely on "block.blockhash". Miners can influence its value.');
    }
}


module.exports = NotRelyOnBlockHashChecker;
