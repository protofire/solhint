const BaseChecker = require('./base-checker');


class QuotesChecker extends BaseChecker {

    constructor(reporter, config) {
        super(reporter);

        const quoteType = config.rules && config.rules.quotes && config.rules.quotes[1];
        this.quoteType = ['double', 'single'].includes(quoteType) && quoteType || 'double';
        this.incorrectQuote = (this.quoteType === 'single') ? '"' : '\'';
    }

    exitPrimaryExpression(ctx) {
        this.validateQuotes(ctx);
    }

    exitAssemblyLiteral(ctx) {
        this.validateQuotes(ctx);
    }

    exitImportDirective(ctx) {
        const children = ctx.children;

        if (children && children.length >= 2) {
            this.validateQuotes(children[1]);
        }

        for (let i = 0; i < children.length; i += 1) {
            const curChild = children[i];

            if (curChild.getText && curChild.getText() === 'from' && i + 1 < children.length) {
                this.validateQuotes(children[i + 1]);
            }
        }
    }

    validateQuotes(ctx) {
        if (ctx.getText().startsWith(this.incorrectQuote)) {
            this._error(ctx);
        }
    }

    _error(ctx) {
        this.error(ctx, 'quotes', `Use ${this.quoteType} quotes for string literals`);
    }
}


module.exports = QuotesChecker;
