const BaseChecker = require('./../base-checker');


class NotRelyOnTimeChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitIdentifier(ctx) {
        this._textNotAllowed(ctx, 'now');
    }

    exitExpression(ctx) {
        this._textNotAllowed(ctx, 'block.timestamp');
    }

    _textNotAllowed(ctx, avoidedName) {
        if (ctx.getText() === avoidedName) {
            this._warn(ctx);
        }
    }

    _warn(ctx) {
        this.warn(ctx, 'not-rely-on-time', 'Avoid to make time-based decisions in your business logic');
    }
}


module.exports = NotRelyOnTimeChecker;
