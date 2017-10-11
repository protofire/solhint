const BaseChecker = require('./../base-checker');


class NotRelyOnTimeChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitIdentifier(ctx) {
        if (ctx.getText() === 'now') {
            this._warn(ctx);
        }
    }

    exitExpression(ctx) {
        if (ctx.getText() === 'block.timestamp') {
            this._warn(ctx);
        }
    }

    _warn(ctx) {
        this.warn(ctx, 'not-rely-on-time', 'Avoid to make time-based decisions in your business logic');
    }
}


module.exports = NotRelyOnTimeChecker;