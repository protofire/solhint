const BaseChecker = require('./../base-checker');


class CompilerVersionChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitVersionOperator(ctx) {
        this.warn(ctx, 'compiler-fixed', 'Compiler version must be fixed');
    }

    exitVersionConstraint(ctx) {
        const versionNode = this.isVersionOperator(ctx.children[0]) && ctx.children[1] || ctx.children[0];

        if (versionNode.getText() < '0.4') {
            this.error(ctx, 'compiler-gt-0_4', 'Use at least \'0.4\' compiler version');
        }
    }

    isVersionOperator(ctx) {
        return ctx.constructor.name.includes('VersionOperator');
    }
}


module.exports = CompilerVersionChecker;