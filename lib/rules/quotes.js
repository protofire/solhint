const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class QuotesChecker {

    constructor(reporter, config) {
        this.reporter = reporter;

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

    exitAssemblyItem(ctx) {
        this.validateQuotes(ctx);
    }

    exitDataSize(ctx) {
        ctx.children && this.validateQuotes(ctx.children[2]);
    }

    exitLinkerSymbol(ctx) {
        ctx.children && this.validateQuotes(ctx.children[2]);
    }

    exitImportDirective(ctx) {
        const children = ctx.children;

        if (children && children.length >= 2) {
            this.validateQuotes(children[1]);
        }

        for (let i = 0; i < children.length; i += 1) {
            if (i.getText && i.getText() === 'from' && i + 1 < children.length) {
                this.validateQuotes(children[i + 1]);
            }
        }
    }

    validateQuotes(ctx) {
        if (ctx.getText().startsWith(this.incorrectQuote)) {
            this.makeReport(ctx);
            return;
        }

        if (ctx.getText().endsWith(this.incorrectQuote)) {
            this.makeReport(ctx);
        }
    }

    makeReport(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            `Use ${this.quoteType} quotes for string literals`, 'quotes'
        );
    }
}


module.exports = QuotesChecker;