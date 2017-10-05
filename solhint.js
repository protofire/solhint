#!/usr/bin/env node

const program = require('commander');
const linter = require('./lib/index');
const _ = require('lodash');
const fs = require('fs');
const process = require('process');


function init () {
    program
        .version('1.1.4');

    program
        .usage('[options] <file> [...other_files]')
        .option('-f, --formatter [name]', 'report formatter name (stylish, table, tap, unix)')
        .description('Linter for Solidity programming language')
        .action(execMainAction);

    program
        .command('stdin')
        .description('linting of source code data provided to STDIN')
        .option('--filename [file_name]', 'name of file received using STDIN')
        .action(processStdin);

    program
        .command('init-config')
        .description('create in current directory configuration file for solhint')
        .action(writeSampleConfigFile);

    program
        .parse(process.argv);

    program.args.length < 1
        && program.help();
}

function execMainAction () {
    const pathPromises = program
        .args
        .filter(i => typeof(i) === 'string')
        .map(processPath);

    Promise
        .all(pathPromises)
        .then(items => _.flatten(items))
        .then(reports => {
            printReports(reports, program.formatter);
            exitWithCode(reports);
        });
}

function processStdin(options) {
    const STDIN_FILE = 0;
    const stdinBuffer = fs.readFileSync(STDIN_FILE);

    const report = processStr(stdinBuffer.toString());
    report.file = options.filename || 'stdin';
    printReports([report]);
}

function writeSampleConfigFile() {
    const sampleConfig = {
        extends: 'default',
        rules: {
            'no-complex-fallback': 'warn',
            'indent': ['error', 4],
            'quotes': ['error', 'double'],
            'max-line-length': ['error', 120]
        }
    };

    const sampleConfigJson = JSON.stringify(sampleConfig, (k, v) => v, 4);

    fs.writeFileSync('.solhint.json', sampleConfigJson);

    console.log('Configuration file created!');
}

const readConfig = _.memoize(function () {
    try {
        const configStr = fs.readFileSync('.solhint.json').toString();
        return JSON.parse(configStr);
    } catch (e) {
        return { rules: {} };
    }
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
