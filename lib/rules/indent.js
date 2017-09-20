const Reporter = require('./../reporter');
const _ = require('lodash');


const SEVERITY = Reporter.SEVERITY;

class IndentChecker {

    constructor(reporter, config) {
        this.reporter = reporter;
        this.indent = this.parseConfig(config) || 4;
        this.linesWithError = [];
    }

    parseConfig(config) {
        const rules = config.rules;
        if (!(rules && rules.indent && rules.indent.length === 2)) {
            return null;
        }

        const indentConf = rules.indent[1];
        if (indentConf === 'tabs') {
            return 1;
        } else if (_.isNumber(indentConf)) {
            return indentConf;
        } else {
            return null;
        }
    }

    enterBlock (ctx) {
        this.validateBlock(ctx);
    }

    // enterAssemblyBlock (ctx) {
    //     // this.validateBlock(ctx);
    // }

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

    enterIfStatement (ctx) {
        const THEN_STATEMENT_POSITION = 4;
        const ELSE_STATEMENT_POSITION = 6;

        this.validateMultipleSingleLineStatement(ctx, [THEN_STATEMENT_POSITION, ELSE_STATEMENT_POSITION]);
    }

    enterWhileStatement (ctx) {
        const STATEMENT_POSITION = 4;

        this.validateSingleLineStatement(ctx, STATEMENT_POSITION);
    }

    enterDoWhileStatement (ctx) {
        this.validateSingleLineStatement(ctx, 1);
    }

    enterForStatement (ctx) {
        this.validateSingleLineStatement(ctx, ctx.children.length - 1);
    }

    exitSourceUnit(ctx) {
        ctx.parser._input.tokenSource._input.strdata
            .split('\n')
            .map((i, index) => [i.replace(/[^\s\t]+.*/, ''), index])
            .filter(args => !this.linesWithError.includes(args[1] + 1))
            .filter(args => this.isValidForBaseIndent(args[0]))
            .forEach(args => this.makeReport(args[1] + 1, args[0].length));
    }

    validateMultipleSingleLineStatement (ctx, indexes) {
        indexes.forEach(index =>
            this.validateSingleLineStatement(ctx, index)
        );
    }

    validateSingleLineStatement (ctx, index) {
        if (ctx.children.length <= index) {
            return;
        }

        const statement = ctx.children[index];
        const statementColumn = statement.start.column;
        const statementLine = statement.start.line;
        const start = ctx.start;

        if (statement.children[0].constructor.name !== 'BlockContext'
            && statementColumn !== this.correctIndentOf(ctx.parentCtx) + this.indent
            && statementLine !== start.line) {
            this.makeReport(statementLine, statementColumn);
            statement.indentError = {
                indent: statementColumn,
                correctIndent: this.correctIndentOf(ctx.parentCtx) + this.indent
            };
        }
    }

    validateBlock(ctx) {
        const children = ctx.children;
        const startBracketIndex = children && children.map(i => i.getText()).indexOf('{');

        if (startBracketIndex === null || startBracketIndex === -1) {
            return;
        }

        this.validateBlockInternalStatements(ctx, children, startBracketIndex);
    }

    validateBlockInternalStatements(ctx, children, startBracketIndex) {
        const startBracket = children[startBracketIndex];

        const endBracketIndex = children.map(i => i.getText()).indexOf('}');
        const endBracket = children[children.length - 1];

        if (startBracket.symbol.line < endBracket.symbol.line) {
            const requiredIndent = this.correctIndentOf(this.rootOfLine(ctx.parentCtx)) + this.indent;

            for (let i = startBracketIndex + 1; i < endBracketIndex; i += 1) {
                const curItem = children[i];
                const line = (curItem.start && curItem.start.line) || (curItem.symbol && curItem.symbol.line);
                const column = this.columnOf(curItem);

                if (curItem.start && curItem.start.column !== requiredIndent
                    || curItem.symbol && curItem.symbol.column !== requiredIndent) {
                    this.makeReportCorrectLine(line, column, requiredIndent);
                    curItem.indentError = { indent: curItem.start.column, correctIndent: requiredIndent };
                }
            }

            if (this.correctIndentOf(this.rootOfLine(ctx)) !== endBracket.symbol.column) {
                this.makeReportCorrectLine(
                    endBracket.symbol.line,
                    endBracket.symbol.column,
                    this.correctIndentOf(this.rootOfLine(ctx))
                );
                endBracket.indentError = {
                    indent: endBracket.symbol.column,
                    correctIndent: this.correctIndentOf(this.rootOfLine(ctx.parentCtx))
                };
            }
        }
    }

    correctIndentOf(ctx) {
        let curIndent = this.columnOf(ctx);

        let curCtx = ctx;
        while (curCtx.parentCtx !== null && ctx.start.line === curCtx.start.line) {
            if (curCtx.indentError) {
                curIndent = curIndent - curCtx.indentError.indent + curCtx.indentError.correctIndent;
            }

            curCtx = curCtx.parentCtx;
        }

        return curIndent;
    }

    columnOf(ctx) {
        if (ctx && ctx.start) {
            return ctx.start.column;
        } else if (ctx && ctx.symbol) {
            return ctx.symbol.column;
        } else {
            return null;
        }
    }

    rootOfLine (ctx) {
        let rootCtx = ctx;

        while (rootCtx.parentCtx && rootCtx.start.line === rootCtx.parentCtx.start.line) {
            rootCtx = rootCtx.parentCtx;
        }

        return rootCtx;
    }

    isValidForBaseIndent(prefixLine) {
        return prefixLine.length % this.indent !== 0;
    }

    makeReport(line, col) {
        this.linesWithError.push(line);
        this.reporter.addMessageExplicitLine(
            line, col, SEVERITY.ERROR,
            'Indentation is incorrect', 'indent'
        );
    }

    makeReportCorrectLine(line, col, correctIndent) {
        this.linesWithError.push(line);
        this.reporter.addMessageExplicitLine(
            line, col, SEVERITY.ERROR,
            `Indentation is incorrect. Expected indentation of ${correctIndent} spaces but found ${col}`, 'indent'
        );
    }
}


module.exports = IndentChecker;