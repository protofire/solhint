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

        this.validateBracketsForDoWhileStatement(ctx);
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
        const IF_WITH_ELSE_LENGTH = 7;
        const STATEMENT_IDX = 4;
        const ELSE_IDX = 5;

        const childs = ctx.children;

        if (childs.length === IF_WITH_ELSE_LENGTH && isBlock(childs[STATEMENT_IDX])) {
            const firstBlock = childs[STATEMENT_IDX];
            const elseNode = childs[ELSE_IDX];

            if (firstBlock.stop.line !== elseNode.symbol.line) {
                this.makeReport(elseNode, 'Else must be on the same line with close bracket.');
            }
        }
    }

    validateBracketsForDoWhileStatement(ctx) {
        const STATEMENT_IDX = 1;
        const WHILE_IDX = 2;

        const childs = ctx.children;

        if (isBlock(childs[STATEMENT_IDX])) {
            const block = childs[STATEMENT_IDX];
            const whileNode = childs[WHILE_IDX];

            if (block.stop.line !== whileNode.symbol.line) {
                this.makeReport(whileNode, 'While must be on the same line with close bracket.');
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