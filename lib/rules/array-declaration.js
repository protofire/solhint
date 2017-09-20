const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class ArrayDeclarationChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterTypeName (ctx) {
        this.tokens = this.tokens || ctx.parser._input.tokens.filter(i => i.channel === 0);

        this.validateOpenBracket(ctx);
        this.validateCloseBracket(ctx);
    }

    validateOpenBracket(ctx) {
        const children = ctx.children;
        const openBracketIndex = children && children.map(i => i.getText()).indexOf('[');

        if (openBracketIndex !== null && openBracketIndex !== -1) {
            const curTokenIndex = this.tokens.indexOf(children[openBracketIndex].symbol);
            const curToken = this.tokens[curTokenIndex];
            const prevToken = this.tokens[curTokenIndex - 1];

            if (!(curToken && prevToken && curToken.start - 1 === prevToken.stop)) {
                this.makeReport(children[openBracketIndex]);
            }
        }
    }

    validateCloseBracket(ctx) {
        const children = ctx.children;
        const closeBracketIndex = children && children.map(i => i.getText()).indexOf(']');

        if (closeBracketIndex !== null && closeBracketIndex !== -1) {
            const curTokenIndex = this.tokens.indexOf(children[closeBracketIndex].symbol);
            const curToken = this.tokens[curTokenIndex];
            const prevToken = this.tokens[curTokenIndex - 1];

            if (!(curToken && prevToken && curToken.start - 1 === prevToken.stop)) {
                this.makeReport(children[closeBracketIndex]);
            }
        }
    }

    makeReport(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            'Array declaration must not contains spaces',
            'array-declaration-spaces'
        );
    }
}


module.exports = ArrayDeclarationChecker;