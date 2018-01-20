#!/usr/bin/env node

const program = require('commander');
const linter = require('./lib/index');
const _ = require('lodash');
const fs = require('fs');
const process = require('process');


function init() {
    program
        .version('1.1.10');

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

function execMainAction() {
    const reportLists = program.args.filter(_.isString).map(processPath);
    const reports =_.flatten(reportLists);

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
    const configPath = '.solhint.json';
    const sampleConfig = [
        '{                                              ',
        '    "extends": "default",                      ',
        '    "rules": {                                 ',
        '        "indent": ["error", 4],                ',
        '        "quotes": ["error", "double"],         ',
        '        "max-line-length": ["error", 120]      ',
        '    }                                          ',
        '}                                              '
    ];

    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, sampleConfig.join('\n'));

        console.log('Configuration file created!');
    } else {
        console.log('Configuration file already exists');
    }
}

const readIgnore = _.memoize(function () {
    try {
        return fs
            .readFileSync('.solhintignore')
            .toString()
            .split('\n')
            .map(i => i.trim());
    } catch (e) {
        return [];
    }
});

const readConfig = _.memoize(function () {
    let config = {};

    try {
        const configStr = fs.readFileSync('.solhint.json').toString();
        config = JSON.parse(configStr);
    } catch (e) {
        if (e instanceof SyntaxError) {
            console.log('ERROR: Configuration file [.solhint.json] is not a valid JSON!\n');
            process.exit(0);
        }
    }

    const configExcludeFiles = _.flatten(config.excludedFiles);
    config.excludedFiles = _.concat(configExcludeFiles, readIgnore());

    return config;
});

function processStr(input) {
    return linter.processStr(input, readConfig());
}

function processPath(path) {
    return linter.processPath(path, readConfig());
}

function printReports(reports, formatter) {
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
