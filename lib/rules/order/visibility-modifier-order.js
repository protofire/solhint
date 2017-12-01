const BaseChecker = require('./../base-checker');


class VisibilityModifierOrderChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitModifierList(ctx) {
        if (this.containsVisibilityModifier(ctx)) {
            const firstModifier = ctx.children[0];

            if (!this.containsVisibilityModifier(firstModifier)) {
                this._error(firstModifier);
            }
        }
    }

    containsVisibilityModifier(ctx) {
        const text = ctx.getText();

        const hasInternal = text.includes('internal');
        const hasExternal = text.includes('external');
        const hasPrivate = text.includes('private');
        const hasPublic = text.includes('public');

        return hasExternal || hasInternal || hasPrivate || hasPublic;
    }

    _error(ctx) {
        const message = 'Visibility modifier must be first in list of modifiers';
        this.error(ctx, 'visibility-modifier-order', message);
    }
}


module.exports = VisibilityModifierOrderChecker;