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

    exitBlock (ctx) {
        this.validateBlock(ctx);
    }

    exitAssemblyBlock (ctx) {
        this.validateBlock(ctx);
    }

    exitContractDefinition (ctx) {
        this.validateBlock(ctx);
    }

    exitStructDefinition (ctx) {
        this.validateBlock(ctx);
    }

    exitEnumDefinition (ctx) {
        this.validateBlock(ctx);
    }

    exitImportDirective(ctx) {
        this.validateBlock(ctx);
    }

    exitFunctionCallArguments(ctx) {
        this.validateBlock(ctx);
    }

    exitIfStatement (ctx) {
        const THEN_STATEMENT_POSITION = 4;
        const ELSE_STATEMENT_POSITION = 6;

        this.validateMultipleSingleLineStatement(ctx, [THEN_STATEMENT_POSITION, ELSE_STATEMENT_POSITION]);
    }

    exitWhileStatement (ctx) {
        const STATEMENT_POSITION = 4;

        this.validateSingleLineStatement(ctx, STATEMENT_POSITION);
    }

    exitDoWhileStatement (ctx) {
        this.validateSingleLineStatement(ctx, 1);
    }

    exitForStatement (ctx) {
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
            && statementColumn !== start.column + this.indent
            && statementLine !== start.line) {
            this.makeReport(statementLine, statementColumn);
            statement.indentError = { correctIndent: start.column + this.indent };
        }
    }

    validateBlock(ctx) {
        const children = ctx.children;
        const startBracketIndex = children && children.map(i => i.getText()).indexOf('{');

        if (!startBracketIndex || startBracketIndex === -1) {
            return;
        }

        this.validateBlockInternalStatements(children, startBracketIndex);
    }

    validateBlockInternalStatements(children, startBracketIndex) {
        const startBracket = children[startBracketIndex];

        const endBracketIndex = children.map(i => i.getText()).indexOf('}');
        const endBracket = children[children.length - 1];

        if (startBracket.symbol.line < endBracket.symbol.line) {
            const requiredIndent = endBracket.symbol.column + this.indent;

            for (let i = startBracketIndex + 1; i < endBracketIndex; i += 1) {
                const curItem = children[i];
                const line = (curItem.start && curItem.start.line) || (curItem.symbol && curItem.symbol.line);
                const column = (curItem.start && curItem.start.column) || (curItem.symbol && curItem.symbol.column);

                if (curItem.start && curItem.start.column !== requiredIndent
                    || curItem.symbol && curItem.symbol.column !== requiredIndent) {
                    this.makeReport(line, column);
                    curItem.indentError = { correctIndent: requiredIndent };
                }
            }
        }
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

}


module.exports = IndentChecker;