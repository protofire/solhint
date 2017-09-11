const program = require('commander');
const linter = require('./lib/index');
const _ = require('lodash');
const fs = require('fs');
const process = require('process');


function init () {
    program
        .version('1.0.0');

    program
        .usage('[options] <file> [...other_files]')
        .option('-f, --formatter [name]', 'Report formatter name')
        .description('Linter for Solidity programming language')
        .action(execMainAction);

    program
        .command('stdin')
        .option('--filename [file_name]', 'Name of file received using STDIN')
        .action(processStdin);

    program
        .parse(process.argv);

    program.args.length < 1
        && program.help();
}

async function execMainAction () {
    const pathPromises = program
        .args
        .filter(i => typeof(i) === 'string')
        .map(linter.processPath);

    const reports = _.flatten(await Promise.all(pathPromises));

    printReports(reports, program.formatter);
    exitWithCode(reports);
}

function processStdin(options) {
    const STDIN_FILE = 0;
    const stdinBuffer = fs.readFileSync(STDIN_FILE);

    const report = linter.processStr(stdinBuffer.toString());
    report.file = options.filename || 'stdin';
    printReports([report]);
}

function printReports (reports, formatter) {
    const formatterName = formatter || 'stylish';
    const formatterFn = require(`eslint/lib/formatters/${formatterName}`);
    console.log(formatterFn(reports));

    return reports;
}

function exitWithCode(reports) {
    const errorsCount = reports.reduce((acc, i) => acc + i.errorCount, 0);

    process.exit(errorsCount > 0 ? 1 : 0);
}

init();
