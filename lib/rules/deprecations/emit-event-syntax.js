const BaseDeprecation = require('./base-deprecation');

class EmitEventSyntax extends BaseDeprecation {

    constructor(reporter) {
        super(reporter);
        this.events = {};
    }

    deprecationVersion() {
        return '0.4.21';
    }

    exitEventDefinition(ctx) {
        this.events[ctx.children[1].getText()] = true;
    }

    exitExpression(ctx) {
        if(this.active) {
            if(ctx.children.length >= 4  && this.events[ctx.children[0].getText()]) {
                this.warn(ctx, 'emit-event-syntax', 'Use emit syntax');
            }
        }
    }
}

module.exports = EmitEventSyntax;
