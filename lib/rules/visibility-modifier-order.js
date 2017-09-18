const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class VisibilityModifierOrderChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitModifierList(ctx) {
        if (this.containsVisibilityModifier(ctx)) {
            const firstModifier = ctx.children[0];

            if (!this.containsVisibilityModifier(firstModifier)) {
                this.reporter.addMessage(
                    firstModifier.getSourceInterval(), SEVERITY.ERROR,
                    'Visibility modifier must be first in list of modifiers', 'visibility-modifier-order'
                );
            }
        }
    }

    containsVisibilityModifier (ctx) {
        const text = ctx.getText();

        const hasInternal = text.includes('internal');
        const hasExternal = text.includes('external');
        const hasPrivate = text.includes('private');
        const hasPublic = text.includes('public');

        return hasExternal || hasInternal || hasPrivate || hasPublic;
    }

}


module.exports = VisibilityModifierOrderChecker;