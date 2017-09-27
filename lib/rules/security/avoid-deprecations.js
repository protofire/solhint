const BaseChecker = require('./../base-checker');


class AvoidDeprecationsChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitIdentifier(ctx) {
        const text = ctx.getText();

        if (text.includes('sha3')) {
            this.error(ctx, 'avoid-sha3', 'Use "keccak256" instead of deprecated "sha3"');
        }

        if (text.includes('suicide')) {
            this.error(ctx, 'avoid-suicide', 'Use "selfdestruct" instead of deprecated "suicide"');
        }
    }

    exitThrowStatement(ctx) {
        this.error(ctx, 'avoid-throw', '"throw" is deprecated, avoid to use it');
    }

}


module.exports = AvoidDeprecationsChecker;