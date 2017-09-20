const Reporter = require('./../reporter');
const _ = require('lodash');


const SEVERITY = Reporter.SEVERITY;

class IndentChecker {

    constructor(reporter, config) {
        this.reporter = reporter;
        this.linesWithError = [];

        const indent = this.parseConfig(config).indent || 4;
        const indentUnit = this.parseConfig(config).unit || 'spaces';

        this.blockValidator = new BlockValidator(indent, indentUnit, reporter);
        this.nestedSingleLineValidator = new NestedSingleLineValidator(indent, indentUnit, reporter);
        this.baseIndentMultiplicityValidator = new BaseIndentMultiplicityValidator(indent, reporter);
    }

    enterBlock (ctx) {
        this.blockValidator.validateBlock(ctx);
    }

    enterContractDefinition (ctx) {
        this.blockValidator.validateBlock(ctx);
    }

    enterStructDefinition (ctx) {
        this.blockValidator.validateBlock(ctx);
    }

    enterEnumDefinition (ctx) {
        this.blockValidator.validateBlock(ctx);
    }

    enterImportDirective(ctx) {
        this.blockValidator.validateBlock(ctx);
    }

    enterFunctionCallArguments(ctx) {
        this.blockValidator.validateBlock(ctx);
    }

    enterIfStatement (ctx) {
        const THEN_STATEMENT_POSITION = 4;
        const ELSE_STATEMENT_POSITION = 6;
        const STATEMENTS_POSITION = [THEN_STATEMENT_POSITION, ELSE_STATEMENT_POSITION];

        this.nestedSingleLineValidator.validateMultiple(ctx, STATEMENTS_POSITION);
    }

    enterWhileStatement (ctx) {
        const STATEMENT_POSITION = 4;

        this.nestedSingleLineValidator.validate(ctx, STATEMENT_POSITION);
    }

    enterDoWhileStatement (ctx) {
        this.nestedSingleLineValidator.validate(ctx, 1);
    }

    enterForStatement (ctx) {
        this.nestedSingleLineValidator.validate(ctx, ctx.children.length - 1);
    }

    enterSourceUnit(ctx) {
        ctx
            .children
            .filter(i => i.getText() !== '<EOF>')
            .forEach(curNode =>
                this.blockValidator.validateNode(0)(curNode, lineOf(curNode), columnOf(curNode))
            );
    }

    exitSourceUnit(ctx) {
        const linesWithErrors = this.getLinesWithError();

        this.baseIndentMultiplicityValidator.validate(linesWithErrors, ctx);
    }

    parseConfig(config) {
        const rules = config.rules;
        if (!(rules && rules.indent && rules.indent.length === 2)) {
            return {};
        }

        const indentConf = rules.indent[1];
        if (indentConf === 'tabs') {
            return { indent: 1, unit: 'tabs' };
        } else if (_.isNumber(indentConf)) {
            return { indent: indentConf, unit: 'spaces' };
        } else {
            return {};
        }
    }

    getLinesWithError () {
        return [].concat(
            this.nestedSingleLineValidator.linesWithError,
            this.blockValidator.linesWithError
        );
    }

}


class Block {

    constructor (ctx) {
        this.ctx = ctx;
    }

    startBracketIndex () {
        const children = this.ctx.children;
        return children && children.map(i => i.getText()).indexOf('{');
    }

    hasStartBracket () {
        return this.startBracketIndex() !== null && this.startBracketIndex() >= 0;
    }

    startBracket () {
        return this.ctx.children[this.startBracketIndex()];
    }

    startBracketLine () {
        return this.startBracket().symbol.line;
    }

    endBracketIndex () {
        return this.ctx.children.map(i => i.getText()).indexOf('}');
    }

    endBracket () {
        const children = this.ctx.children;
        return children[children.length - 1];
    }

    endBracketLine () {
        return this.endBracket().symbol.line;
    }

    endBracketColumn () {
        return this.endBracket().symbol.column;
    }

    isBracketsOnSameLine () {
        return this.startBracketLine() === this.endBracketLine();
    }

    forEachNestedNode (callback) {
        for (let i = this.startBracketIndex() + 1; i < this.endBracketIndex(); i += 1) {
            const curItem = this.ctx.children[i];

            callback && callback(curItem, lineOf(curItem), columnOf(curItem));
        }
    }

}


class KnowLineValidator {

    constructor (indent, indentUnit, reporter) {
        this.indent = indent;
        this.indentUnit = indentUnit;
        this.reporter = reporter;
        this.linesWithError = [];
    }

    makeReportCorrectLine(line, col, correctIndent) {
        this.linesWithError.push(line);
        this.reporter.addMessageExplicitLine(
            line, col, SEVERITY.ERROR,
            `Expected indentation of ${correctIndent} ${this.indentUnit} but found ${col}`, 'indent'
        );
    }

}


class BlockValidator extends KnowLineValidator {

    constructor (indent, indentUnit, reporter) {
        super(indent, indentUnit, reporter);
    }

    validateBlock(ctx) {
        const block = new Block(ctx);

        if (!block.hasStartBracket() || block.isBracketsOnSameLine()) {
            return;
        }

        this.validateIndentOfNestedElements(block);

        this.validateEndBracketIndent(block);
    }

    validateIndentOfNestedElements(block) {
        const requiredIndent = correctIndentOf(firstNodeOfLine(block.ctx)) + this.indent;

        block.forEachNestedNode(this.validateNode(requiredIndent));
    }

    validateNode(requiredIndent) {
        return (curItem, curLine, curColumn) => {
            if (curColumn !== requiredIndent) {
                this.makeReportCorrectLine(curLine, curColumn, requiredIndent);
                curItem.indentError = {indent: curColumn, correctIndent: requiredIndent};
            }
        };
    }

    validateEndBracketIndent(block) {
        const endBracketCorrectIndent = correctIndentOf(firstNodeOfLine(block.ctx));

        if (endBracketCorrectIndent !== block.endBracketColumn()) {
            this.makeReportCorrectLine(block.endBracketLine(), block.endBracketColumn(), endBracketCorrectIndent);
        }
    }

}


class NestedSingleLineValidator extends KnowLineValidator {

    constructor (indent, indentUnit, reporter) {
        super(indent, indentUnit, reporter);
    }

    validateMultiple (ctx, indexes) {
        indexes.forEach(index =>
            this.validate(ctx, index)
        );
    }

    validate (ctx, index) {
        if (ctx.children.length <= index) {
            return;
        }

        const statement = ctx.children[index];
        const statementColumn = columnOf(statement);
        const statementLine = lineOf(statement);
        const start = ctx.start;
        const requiredIndent = correctIndentOf(ctx.parentCtx) + this.indent;

        if (statement.children[0].constructor.name !== 'BlockContext'
            && statementColumn !== requiredIndent && statementLine !== start.line) {
            this.makeReportCorrectLine(statementLine, statementColumn, requiredIndent);
            statement.indentError = {
                indent: statementColumn,
                correctIndent: correctIndentOf(ctx.parentCtx) + this.indent
            };
        }
    }

}


class BaseIndentMultiplicityValidator {

    constructor (indent, reporter) {
        this.reporter = reporter;
        this.indent = indent;
    }

    validate (linesWithError, ctx) {
        ctx.parser._input.tokenSource._input.strdata
            .split('\n')
            .map((i, index) => [i.replace(/[^\s\t]+.*/, ''), index])
            .filter(args => !linesWithError.includes(args[1] + 1))
            .filter(args => this.isNotValidForBaseIndent(args[0]))
            .forEach(args => this.makeReport(args[1] + 1, args[0].length));
    }

    isNotValidForBaseIndent(prefixLine) {
        return prefixLine.length % this.indent !== 0;
    }

    makeReport(line, col) {
        this.reporter.addMessageExplicitLine(
            line, col, SEVERITY.ERROR,
            'Indentation is incorrect', 'indent'
        );
    }

}


function correctIndentOf(ctx) {
    let curIndent = columnOf(ctx);

    let curCtx = ctx;
    if (curCtx.indentError) {
        curIndent = curIndent - curCtx.indentError.indent + curCtx.indentError.correctIndent;
        return curIndent;
    }

    while (curCtx.parentCtx !== null && ctx.start.line === curCtx.start.line) {
        curCtx = curCtx.parentCtx;

        if (curCtx.indentError) {
            curIndent = curIndent - curCtx.indentError.indent + curCtx.indentError.correctIndent;
            return curIndent;
        }
    }

    return curIndent;
}

function columnOf(ctx) {
    if (ctx && ctx.start) {
        return ctx.start.column;
    } else if (ctx && ctx.symbol) {
        return ctx.symbol.column;
    } else {
        return null;
    }
}

function firstNodeOfLine (ctx) {
    let rootCtx = ctx;

    while (rootCtx.parentCtx && rootCtx.start.line === rootCtx.parentCtx.start.line &&
            !['SourceUnitContext'].includes(rootCtx.parentCtx.constructor.name)) {
        rootCtx = rootCtx.parentCtx;
    }

    return rootCtx;
}

function lineOf(ctx) {
    if (ctx && ctx.start) {
        return ctx.start.line;
    } else if (ctx && ctx.symbol) {
        return ctx.symbol.line;
    } else {
        return null;
    }
}


module.exports = IndentChecker;