const Reporter = require('./../reporter');
const SEVERITY = Reporter.SEVERITY;
const { StatementsIndentValidator, Term } = require('./../common/statements-indent-validator');


class StatementsAlignChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterIfStatement (ctx) {
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('if').space().term('(').noSpaces().expression().noSpaces().term(')').statement(),

                term('if').space().term('(').noSpaces().expression().noSpaces().term(')').statement()
                    .term('else').statement()
            )
            .forEachError(
                this.makeReport.bind(this)
            );

        this.validateBracketsForElseStatement(ctx);
    }

    enterWhileStatement (ctx) {
        Term
            .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').statement()
            .forEachError(ctx, this.makeReport.bind(this));
    }

    enterDoWhileStatement (ctx) {
        Term
            .term('do').statement()
            .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').noSpaces().term(';')
            .forEachError(ctx, this.makeReport.bind(this));
    }

    enterForStatement (ctx) {
        const term = Term.term;

        new StatementsIndentValidator(ctx)
            .cases(
                term('for').space().term('(').noSpaces().term(';').noSpaces().term(';').noSpaces().term(')')
                    .statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').noSpaces().term(';').noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().term(';').space().expression().noSpaces().term(';').noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().term(';').noSpaces().term(';').space().expression().noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').space().expression().noSpaces().term(';').noSpaces()
                    .term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().term(';').space().expression().noSpaces().term(';').space().expression()
                    .noSpaces().term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').noSpaces().term(';').space().expression()
                    .noSpaces().term(')').statement(),

                term('for').space().term('(')
                    .noSpaces().rule('simpleStatement').space().expression().noSpaces().term(';')
                    .space().expression().noSpaces().term(')').statement()
            )
            .forEachError(this.makeReport.bind(this));
    }

    validateBracketsForElseStatement(ctx) {
        const childs = ctx.children;

        if (childs.length === 7 && isBlock(childs[4])) {
            const firstBlock = childs[4];
            const elseNode = childs[5];

            if (firstBlock.stop.line !== elseNode.symbol.line) {
                this.makeReport(elseNode, 'Else must be on the same line with close bracket.');
            }
        }
    }

    makeReport(ctx, message) {
        this.reporter.addMessage(
            ctx.getSourceInterval(), SEVERITY.ERROR,
            `Statement indentation is incorrect.${message && ' ' + message || ''}`,
            'statement-indent'
        );
    }
}


function isBlock(ctx) {
    let childs = ctx.children;
    while (childs && childs.length === 1) {
        if (ctx.children[0].constructor.name === 'BlockContext') {
            return true;
        }

        childs = childs.children;
    }

    return false;
}


module.exports = StatementsAlignChecker;