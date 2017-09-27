const Reporter = require('./../../reporter');


const SEVERITY = Reporter.SEVERITY;

class BracketsAlign {

    constructor(reporter) {
        this.reporter = reporter;
        this.tokens = null;
    }

    enterBlock (ctx) {
        this.validateBlock(ctx);
    }

    enterContractDefinition (ctx) {
        this.validateBlock(ctx);
    }

    enterStructDefinition (ctx) {
        this.validateBlock(ctx);
    }

    enterEnumDefinition (ctx) {
        this.validateBlock(ctx);
    }

    enterImportDirective(ctx) {
        this.validateBlock(ctx);
    }

    enterFunctionCallArguments(ctx) {
        this.validateBlock(ctx);
    }

    validateBlock(ctx) {
        if (ctx.parentCtx.constructor.name === 'FunctionDefinitionContext') {
            return;
        }

        this.tokens = this.tokens || ctx.parser._input.tokens.filter(i => i.channel === 0);

        this.validateOpenBracket(ctx);
    }

    validateOpenBracket(ctx) {
        const openBracketIndex = ctx.children && ctx.children.map(i => i.getText()).indexOf('{');

        if (openBracketIndex !== null && openBracketIndex !== -1) {
            const startTokenIndex = this.tokens.indexOf(ctx.children[openBracketIndex].symbol);
            const bracketToken = this.tokens[startTokenIndex];
            const prevToken = this.tokens[startTokenIndex - 1];

            if (!(bracketToken && prevToken && prevToken.line === bracketToken.line
                && prevToken.stop === bracketToken.start - 2)) {
                this.makeReport(ctx);
            }
        }
    }

    makeReport(ctx) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            'Open bracket must be on same line. It must be indented by other constructions by space',
            'bracket-align'
        );
    }
}


module.exports = BracketsAlign;