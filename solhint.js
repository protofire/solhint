#!/usr/bin/env node

/**
 * Solhint - Solidity Linter
 * 
 * This script is a command-line tool for linting Solidity source code. It provides functionality 
 * to analyze Solidity contracts for style and security issues, based on a set of predefined rules.
 * Solhint helps developers maintain clean and consistent code by identifying potential problems and 
 * suggesting fixes. It can automatically fix some issues, output linting reports in various formats, 
 * and even create configuration files for easy integration into development workflows.
 * 
 * The tool can lint files passed as arguments, read from stdin, and provides several options to control
 * the behavior, such as:
 *  - Reporting format (e.g., stylish, json, table)
 *  - Maximum allowed warnings
 *  - Configuration and ignore paths
 *  - Automatic fixes
 * 
 * Usage example:
 *   solhint [options] <file> [...other_files]
 * 
 * Dependencies:
 *   - Commander (CLI framework)
 *   - Lodash (utility functions)
 *   - File system (fs)
 *   - Readline (user input handling)
 *   - Latest-version (check for updates)
 */

// Import necessary modules
const program = require('commander');   // CLI framework for handling commands and options
const _ = require('lodash');           // Utility library for working with arrays, objects, and functions
const fs = require('fs');              // File system module for reading and writing files
const process = require('process');    // Provides access to process information
const readline = require('readline');  // Module for reading from the console

// Import internal modules for linter functionality
const linter = require('./lib/index');
const { loadConfig } = require('./lib/config/config-file');
const { validate } = require('./lib/config/config-validator');
const applyFixes = require('./lib/apply-fixes');
const ruleFixer = require('./lib/rule-fixer');
const packageJson = require('./package.json');

// Exit codes
const EXIT_CODES = { BAD_OPTIONS: 255, OK: 0, REPORTED_ERRORS: 1 };

// Initialize the command-line interface (CLI) with options and commands
function init() {
  const version = packageJson.version;
  program.version(version);

  // Main command to lint Solidity files
  program
    .name('solhint')
    .usage('[options] <file> [...other_files]')
    .option(
      '-f, --formatter [name]',
      'report formatter name (stylish, table, tap, unix, json, compact, sarif)'
    )
    .option('-w, --max-warnings [maxWarningsNumber]', 'number of allowed warnings')
    .option('-c, --config [file_name]', 'file to use as your .solhint.json')
    .option('-q, --quiet', 'report errors only - default: false')
    .option('--ignore-path [file_name]', 'file to use as your .solhintignore')
    .option('--fix', 'automatically fix problems. Skips fixes in report')
    .option('--noPrompt', 'do not suggest to backup files when any `fix` option is selected')
    .option('--init', 'create configuration file for solhint')
    .option('--disc', 'do not check for solhint updates')
    .option('--save', 'save report to file on current folder')
    .description('Linter for Solidity programming language')
    .action(execMainAction);

  // Command to lint Solidity code from stdin
  program
    .command('stdin', null, { noHelp: false })
    .option('--filename [file_name]', 'name of file received using STDIN')
    .description(
      'linting of source code data provided to STDIN\nEx: echo "contract Foo { function f1()external view returns(uint256) {} }" | solhint stdin\nEx: solhint stdin --filename "./pathToFilename" -f table'
    )
    .action(processStdin);

  // Command to create a sample configuration file
  program
    .command('init-config', null, { noHelp: true })
    .description('create configuration file for solhint')
    .action(writeSampleConfigFile);

  // Command to list rules from the current configuration
  program
    .command('list-rules', null, { noHelp: false })
    .description('display covered rules of current .solhint.json')
    .action(listRules);

  // If no command is provided, show help
  if (process.argv.length <= 2) {
    program.help();
  }

  program.parse(process.argv);
}

// Function to ask the user for confirmation before making changes to files (e.g., for automatic fixes)
function askUserToContinue(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    '\nFIX option detected. Solhint will modify your files whenever it finds a fix for a rule error. Please BACKUP your contracts first. \nContinue ? (y/n) ',
    (answer) => {
      rl.close();
      const normalizedAnswer = answer.trim().toLowerCase();
      callback(normalizedAnswer);
    }
  );
}

// Main logic for executing the linting process
function execMainAction() {
  // If the fix option is enabled, ask the user for confirmation
  if (program.opts().fix && !program.opts().noPrompt) {
    askUserToContinue((userAnswer) => {
      if (userAnswer !== 'y') {
        console.log('\nProcess terminated by user');
        process.exit(EXIT_CODES.OK);
      } else {
        continueExecution(); // Proceed if the user confirms
      }
    });
  } else {
    continueExecution(); // Continue without confirmation
  }

  // Execute the main linting logic after optional checks and updates
  function continueExecution() {
    if (program.opts().disc) {
      executeMainActionLogic();
    } else {
      checkForUpdate().then(() => {
        executeMainActionLogic(); // Proceed after checking for updates
      });
    }
  }
}

// Main logic for executing linting and applying fixes
function executeMainActionLogic() {
  // If the --init option is specified, create a sample config file
  if (program.opts().init) {
    writeSampleConfigFile();
  }

  // Check if a formatter is specified, otherwise use the default
  let formatterFn;
  try {
    formatterFn = getFormatter(program.opts().formatter);
  } catch (ex) {
    console.error(ex.message);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  // Validate the configuration file if specified
  const customConfig = program.opts().config;
  if (customConfig && !fs.existsSync(customConfig)) {
    console.error(`Config file "${customConfig}" couldnt be found.`);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  // Process the provided files and generate reports
  let reports;
  try {
    const reportLists = program.args.filter(_.isString).map(processPath);
    reports = _.flatten(reportLists);
  } catch (e) {
    console.error(e);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }
  
  // Ensure there are files to lint
  if (reports.length === 0) {
    console.error(`No files to lint! check glob arguments "${program.args}" and ignore files.`);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  // If the --fix option is enabled, automatically apply fixes to the linted files
  if (program.opts().fix) {
    for (const report of reports) {
      const inputSrc = fs.readFileSync(report.filePath).toString();
      const fixes = _(report.reports)
        .filter((x) => x.fix)
        .map((x) => x.fix(ruleFixer))
        .sort((a, b) => a.range[0] - b.range[0])
        .value();

      const { fixed, output } = applyFixes(fixes, inputSrc);
      if (fixed) {
        report.reports.forEach((report) => {
          if (report.fix !== null) {
            report.message = `[FIXED] - ${report.message}`;
          }
        });
        try {
          fs.writeFileSync(report.filePath, output);
        } catch (error) {
          console.error('An error occurred while writing the file:', error);
          process.exit(EXIT_CODES.BAD_OPTIONS);
        }
      }
    }
  }

  // Print the linting reports
  printReports(reports, formatterFn);

  // Check if there were errors and exit with the appropriate code
  const reportedErrors = reports.some((obj) => obj.errorCount > 0);
  process.exit(reportedErrors ? EXIT_CODES.REPORTED_ERRORS : EXIT_CODES.OK);
}

// Process Solidity code from stdin
function processStdin(options) {
  const STDIN_FILE = options.filename || 0;
  const stdinBuffer = fs.readFileSync(STDIN_FILE);
  const report = processStr(stdinBuffer.toString());
  report.file = options.filename || 'stdin';

  // Check if a formatter is specified
  let formatterFn;
  try {
    formatterFn = getFormatter(program.opts().formatter);
  } catch (ex) {
    console.error(ex.message);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  // Print the report
  const reports = [report];
  printReports(reports, formatterFn);

  // Check for errors and exit with the appropriate status
  const reportedErrors = reports.some((obj) => obj.errorCount > 0);
  process.exit(reportedErrors ? EXIT_CODES.REPORTED_ERRORS : EXIT_CODES.OK);
}

// Function to create a sample configuration file for Solhint
function writeSampleConfigFile() {
  const configPath = '.solhint.json';
  const sampleConfig = `{
  "extends": "solhint:default"
}
`;

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, sampleConfig);
    console.log('Configuration file created!');
  } else {
    console.error('Configuration file already exists');
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  process.exit(EXIT_CODES.OK);
}

// Memoized function to read .solhintignore file
const readIgnore = _.memoize(() => {
  let ignoreFile = '.solhintignore';
  try {
    if (program.opts().ignorePath) {
      ignoreFile = program.opts().ignorePath;
    }

    return fs
      .readFileSync(ignoreFile)
      .toString()
      .split('\n')
      .map((i) => i.trim());
  } catch (e) {
    if (program.opts().ignorePath && e.code === 'ENOENT') {
      console.error(`\nERROR: ${ignoreFile} is not a valid path.`);
      process.exit(EXIT_CODES.BAD_OPTIONS);
    }
    return [];
  }
});

// Memoized function to read the configuration file
const readConfig = _.memoize(() => {
  let config = {};
  try {
    config = loadConfig(program.opts().config);
  } catch (e) {
    console.error(e.message);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  // Merge excluded files from config and .solhintignore
  const configExcludeFiles = _.flatten(config.excludedFiles);
  config.excludedFiles = _.concat(configExcludeFiles, readIgnore());

  // Validate the configuration
  validate(config);

  return config;
});

// Process Solidity code (either from a string or file path)
function processStr(input) {
  return linter.processStr(input, readConfig());
}

function processPath(path) {
  return linter.processPath(path, readConfig());
}

// Function to check if the warning limit has been exceeded
function areWarningsExceeded(reports) {
  const warningsCount = reports.reduce((acc, i) => acc + i.warningCount, 0);
  const warningsNumberExceeded =
    program.opts().maxWarnings >= 0 && warningsCount > program.opts().maxWarnings;

  return { warningsNumberExceeded, warningsCount };
}

// Function to print the linting reports
function printReports(reports, formatter) {
  const warnings = areWarningsExceeded(reports);
  let finalMessage = '';
  let maxWarnsFound = false;

  // Check if the number of warnings exceeds the max allowed
  if (
    program.opts().maxWarnings &&
    reports &&
    reports.length > 0 &&
    warnings.warningsNumberExceeded
  ) {
    if (!reports[0].errorCount) {
      finalMessage = `Solhint found more warnings than the maximum specified (maximum: ${
        program.opts().maxWarnings
      }, found: ${warnings.warningsCount})`;
      maxWarnsFound = true;
    } else {
      finalMessage =
        'Error/s found on rules! [max-warnings] param is ignored. Fixing errors enables max-warnings';
    }
  }

  // Output the formatted report
  const fullReport = formatter(reports) + (finalMessage || '');
  if (!program.opts().quiet) console.log(fullReport);

  // Optionally save the report to a file
  if (program.opts().save) {
    writeStringToFile(fullReport);
  }

  // If warnings exceeded, exit with error
  if (maxWarnsFound) process.exit(EXIT_CODES.REPORTED_ERRORS);
  return reports;
}

// Function to write the linting report to a file
function writeStringToFile(data) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  const fileName = `${year}${month}${day}${hour}${minute}${second}_solhintReport.txt`;

  // Remove any ANSI escape codes from the report
  const cleanedData = data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');

  try {
    fs.writeFileSync(fileName, cleanedData, 'utf-8');
  } catch (err) {
    console.error('Error writing to file:', err);
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  process.exit(EXIT_CODES.OK);
}

// Function to load the specified formatter
function getFormatter(formatter) {
  const formatterName = formatter || 'stylish';
  try {
    return require(`./lib/formatters/${formatterName}`);
  } catch (ex) {
    ex.message = `\nThere was a problem loading formatter option: ${
      program.opts().formatter
    } \nError: ${ex.message}`;
    throw ex;
  }
}

// Function to list rules from the current configuration
function listRules() {
  const args = process.argv.slice(2);
  let configPath = '.solhint.json';
  const configFileIndex = args.findIndex((arg) => arg === '-c' || arg === '--config');
  if (configFileIndex !== -1) {
    configPath = args[configFileIndex + 1];
    if (!configPath || configPath.startsWith('-')) {
      console.error('Error: Invalid configuration file path after -c or --config flag.');
      process.exit(EXIT_CODES.BAD_OPTIONS);
    }
  } else if (args.length !== 1) {
    console.error('Error!! no additional parameters after list-rules command');
    process.exit(EXIT_CODES.BAD_OPTIONS);
  }

  if (!fs.existsSync(configPath)) {
    console.error('Error!! Configuration does not exists');
    process.exit(EXIT_CODES.BAD_OPTIONS);
  } else {
    const config = readConfig();
    console.log('\nConfiguration File: \n', config);

    const reportLists = linter.processPath(configPath, config);
    const rulesObject = reportLists[0].config;

    console.log('\nRules: \n');
    const orderedRules = Object.keys(rulesObject)
      .sort()
      .reduce((obj, key) => {
        obj[key] = rulesObject[key];
        return obj;
      }, {});

    // Output the ordered rules
    Object.keys(orderedRules).forEach(function (key) {
      console.log('- ', key, ': ', orderedRules[key]);
    });
  }
}

// Function to check if there is a new Solhint version available
function checkForUpdate() {
  // Check for updates using the `latest-version` module
  return import('latest-version')
    .then((latestVersionModule) => {
      const latestVersion = latestVersionModule.default;
      const currentVersion = require('./package.json').version;

      return latestVersion('solhint')
        .then((latest) => {
          if (currentVersion < latest) {
            console.log('A new version of Solhint is available:', latest);
            console.log('Please consider updating your Solhint package.');
          }
        })
        .catch((error) => {
          console.error('Error checking for updates:', error.message);
        });
    })
    .catch((error) => {
      console.error('Error importing latest-version:', error.message);
    });
}

// Initialize the program
init();
