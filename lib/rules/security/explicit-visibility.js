const BaseChecker = require('./../base-checker');


class ExplicitVisibilityChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitModifierList(ctx) {
        const text = ctx.getText();

        const hasInternal = text.includes('internal');
        const hasExternal = text.includes('external');
        const hasPrivate = text.includes('private');
        const hasPublic = text.includes('public');

        if (!hasExternal && !hasInternal && !hasPrivate && !hasPublic) {
            this.warn(ctx, 'func-visibility', 'Explicitly mark visibility in function');
        }
    }

    exitStateVariableDeclaration(ctx) {
        const text = ctx.getText();

        const hasInternal = text.includes('internal');
        const hasPrivate = text.includes('private');
        const hasPublic = text.includes('public');

        if (!hasInternal && !hasPrivate && !hasPublic) {
            this.warn(ctx, 'state-visibility', 'Explicitly mark visibility of state');
        }
    }

}


module.exports = ExplicitVisibilityChecker;