const fs = require('fs');
const antlr4 = require('antlr4');
const SolidityLexer = require('./grammar/SolidityLexer').SolidityLexer;
const SolidityParser = require('./grammar/SolidityParser').SolidityParser;
const Reporter = require('./reporter');
const TreeListener = require('./tree-listener');
const checkers = require('./rules/index');
const glob = require('glob');


function processStr(inputStr) {
    const chars = new antlr4.InputStream(inputStr);
    const lexer = new SolidityLexer(chars);
    const tokens  = new antlr4.CommonTokenStream(lexer);
    const parser = new SolidityParser(tokens);
    parser.buildParseTrees = true;

    const tree = parser.sourceUnit();
    const reporter = new Reporter(tokens);

    const listener = new TreeListener(checkers(reporter));
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);

    return reporter;
}

function processFile (file) {
    const report = processStr(fs.readFileSync(file).toString());
    report.file = file;

    return report;
}

function processPath(path) {
    return new Promise((res) =>
        glob(path, (err, files) => res(files.map(processFile)))
    );
}

module.exports = { processPath, processFile, processStr };