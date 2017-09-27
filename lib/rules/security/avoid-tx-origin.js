const BaseChecker = require('./../base-checker');


class AvoidTxOriginChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitExpression(ctx) {
        if (!ctx.children || !ctx.children[1] || ctx.children[1].getText() !== '(') {
            return;
        }

        if (ctx.children[0].getText().endsWith('tx.origin')) {
            this.error(ctx, 'avoid-tx-origin', 'Avoid to use tx.origin');
        }
    }

}


module.exports = AvoidTxOriginChecker;