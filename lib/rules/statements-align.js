const Reporter = require('./../reporter');
const SEVERITY = Reporter.SEVERITY;
const { StatementsIndentValidator, Term } = require('./../common/statements-indent-validator');


class StatementsAlignChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterIfStatement (ctx) {
        new StatementsIndentValidator(ctx)
            .cases(ifWithoutElse(), ifElse())
            .errorsTo(this.makeReport.bind(this));

        this.validateBracketsForElseStatement(ctx);
    }

    enterWhileStatement (ctx) {
        Term
            .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').statement()
            .errorsTo(ctx, this.makeReport.bind(this));
    }

    enterDoWhileStatement (ctx) {
        Term
            .term('do').statement()
            .term('while').space().term('(').noSpaces().expression().noSpaces().term(')').noSpaces().term(';')
            .errorsTo(ctx, this.makeReport.bind(this));

        this.validateBracketsForDoWhileStatement(ctx);
    }

    enterForStatement (ctx) {
        new StatementsIndentValidator(ctx)
            .cases(
                forLoopWith({ statement: true, expression1: true, expression2: true }),
                forLoopWith({ statement: false, expression1: false, expression2: false }),
                forLoopWith({ statement: true, expression1: false, expression2: false }),
                forLoopWith({ statement: false, expression1: true, expression2: false }),
                forLoopWith({ statement: false, expression1: false, expression2: true }),
                forLoopWith({ statement: true, expression1: true, expression2: false }),
                forLoopWith({ statement: false, expression1: true, expression2: true }),
                forLoopWith({ statement: true, expression1: false, expression2: true }),
            )
            .errorsTo(this.makeReport.bind(this));
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
            `Statement indentation is incorrect. ${message}`,
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


function forLoopWith(config) {
    let { statement, expression1, expression2 } = config;
    let seq = Term.term('for').space().term('(').noSpaces();

    statement && seq.rule('simpleStatement') || seq.term(';');
    expression1 && seq.space().expression();
    seq.noSpaces().term(';');

    expression2 && seq.space().expression();

    return seq.noSpaces().term(')').statement();
}


function ifWithoutElse() {
    return Term.term('if').space().term('(').noSpaces().expression().noSpaces().term(')').statement();
}


function ifElse() {
    return ifWithoutElse().term('else').statement();
}


module.exports = StatementsAlignChecker;