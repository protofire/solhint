const BaseChecker = require('./../base-checker');


class NoInlineAssemblyChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitInlineAssemblyStatement(ctx) {
        this.error(ctx);
    }

    error(ctx) {
        const message = 'Avoid to use inline assembly. It is acceptable only in rare cases';
        super.warn(ctx, 'no-inline-assembly', message);
    }
}


module.exports = NoInlineAssemblyChecker;
