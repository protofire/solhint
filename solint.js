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
        .command('init-config')
        .action(writeSampleConfigFile);

    program
        .parse(process.argv);

    program.args.length < 1
        && program.help();
}

async function execMainAction () {
    const pathPromises = program
        .args
        .filter(i => typeof(i) === 'string')
        .map(processPath);

    const reports = _.flatten(await Promise.all(pathPromises));

    printReports(reports, program.formatter);
    exitWithCode(reports);
}

function processStdin(options) {
    const STDIN_FILE = 0;
    const stdinBuffer = fs.readFileSync(STDIN_FILE);

    const report = processStr(stdinBuffer.toString());
    report.file = options.filename || 'stdin';
    printReports([report]);
}

function writeSampleConfigFile() {
    const sampleConfig = { extends: 'default', rules: { 'avoid-sha3': 'error' } };
    const sampleConfigJson = JSON.stringify(sampleConfig, (k, v) => v, 4);

    fs.writeFileSync('.solhint.json', sampleConfigJson);

    console.log('Configuration file created!');
}

const readConfig = _.curry(function () {
    const configStr = fs.readFileSync('.solhint.json').toString();
    return JSON.parse(configStr);
});

function processStr(input) {
    return linter.processStr(input, readConfig());
}

function processPath(path) {
    return linter.processPath(path, readConfig());
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
