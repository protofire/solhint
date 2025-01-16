#!/usr/bin/env node
const program = require('commander')
const _ = require('lodash')
const fs = require('fs')
const process = require('process')
const readline = require('readline')
const chalk = require('chalk')

const linter = require('./lib/index')
const { loadConfig } = require('./lib/config/config-file')
const { validate } = require('./lib/config/config-validator')
const applyFixes = require('./lib/apply-fixes')
const ruleFixer = require('./lib/rule-fixer')
const packageJson = require('./package.json')

const EXIT_CODES = { BAD_OPTIONS: 255, OK: 0, REPORTED_ERRORS: 1 }

function init() {
  const version = packageJson.version
  program.version(version)

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
    .action(execMainAction)

  program
    .command('stdin', null, { noHelp: false })
    .option('--filename [file_name]', 'name of file received using STDIN')
    .description(
      'linting of source code data provided to STDIN\nEx: echo "contract Foo { function f1()external view returns(uint256) {} }" | solhint stdin\nEx: solhint stdin --filename "./pathToFilename" -f table'
    )
    .action(processStdin)

  program
    .command('init-config', null, { noHelp: true })
    .description('create configuration file for solhint')
    .action(writeSampleConfigFile)

  program
    .command('list-rules', null, { noHelp: false })
    .description('display covered rules of current .solhint.json')
    .action(listRules)

  if (process.argv.length <= 2) {
    program.help()
  }

  program.parse(process.argv)
}

function askUserToContinue(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(
    '\nFIX option detected. Solhint will modify your files whenever it finds a fix for a rule error. Please BACKUP your contracts first. \nContinue ? (y/n) ',
    (answer) => {
      // Close the readline interface.
      rl.close()

      // Normalize and pass the user's answer to the callback function.
      const normalizedAnswer = answer.trim().toLowerCase()
      callback(normalizedAnswer)
    }
  )
}

function execMainAction() {
  if (program.opts().fix && !program.opts().noPrompt) {
    askUserToContinue((userAnswer) => {
      if (userAnswer !== 'y') {
        console.log('\nProcess terminated by user')
        process.exit(EXIT_CODES.OK)
      } else {
        // User agreed, continue with the operation.
        continueExecution()
      }
    })
  } else {
    // No need for user input, continue with the operation.
    continueExecution()
  }

  function continueExecution() {
    if (program.opts().disc) {
      executeMainActionLogic()
    } else {
      // Call checkForUpdate and wait for it to complete using .then()
      checkForUpdate().then(() => {
        // This block runs after checkForUpdate is complete
        executeMainActionLogic()
      })
    }
  }
}

function executeMainActionLogic() {
  if (program.opts().init) {
    writeSampleConfigFile()
  }

  let formatterFn
  try {
    // to check if is a valid formatter before execute linter
    formatterFn = getFormatter(program.opts().formatter)
  } catch (ex) {
    console.error(ex.message)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  const customConfig = program.opts().config
  if (customConfig && !fs.existsSync(customConfig)) {
    console.error(`Config file "${customConfig}" couldn't be found.`)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  let reports
  try {
    const reportLists = program.args.filter(_.isString).map(processPath)
    // console.log('reportLists :>> ', reportLists)
    reports = _.flatten(reportLists)
  } catch (e) {
    console.error(e)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }
  if (reports.length === 0) {
    console.error(`No files to lint! check glob arguments "${program.args}" and ignore files.`)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  if (program.opts().fix) {
    for (const report of reports) {
      const inputSrc = fs.readFileSync(report.filePath).toString()

      const fixes = _(report.reports)
        .filter((x) => x.fix)
        .map((x) => x.fix(ruleFixer))
        .sort((a, b) => a.range[0] - b.range[0])
        .value()

      const { fixed, output } = applyFixes(fixes, inputSrc)
      if (fixed) {
        report.reports.forEach((report) => {
          if (report.fix !== null) {
            report.message = `[FIXED] - ${report.message}`
          }
        })
        try {
          fs.writeFileSync(report.filePath, output)
        } catch (error) {
          console.error('An error occurred while writing the file:', error)
          process.exit(EXIT_CODES.BAD_OPTIONS)
        }
      }
    }
  }

  /// REMOVED THIS TO ALLOW PROCESS OF WARNINGS IN QUIET MODE
  // if (program.opts().quiet) {
  //   // filter the list of reports, to set errors only.
  //   reports.forEach((reporter) => {
  //     reporter.reports = reporter.reports.filter((i) => i.severity === 2)
  //   })
  // }

  printReports(reports, formatterFn)

  // check if there's any error reported
  const reportedErrors = reports.some((obj) => obj.errorCount > 0)

  process.exit(reportedErrors ? EXIT_CODES.REPORTED_ERRORS : EXIT_CODES.OK)
}

function processStdin(options) {
  const STDIN_FILE = options.filename || 0
  const stdinBuffer = fs.readFileSync(STDIN_FILE)
  const report = processStr(stdinBuffer.toString())
  report.file = options.filename || 'stdin'

  let formatterFn
  try {
    // to check if is a valid formatter before execute linter
    formatterFn = getFormatter(program.opts().formatter)
  } catch (ex) {
    console.error(ex.message)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  const reports = [report]
  printReports(reports, formatterFn)

  // check if there's any error reported
  const reportedErrors = reports.some((obj) => obj.errorCount > 0)

  process.exit(reportedErrors ? EXIT_CODES.REPORTED_ERRORS : EXIT_CODES.OK)
}

function writeSampleConfigFile() {
  const configPath = '.solhint.json'
  const sampleConfig = `{
  "extends": "solhint:default"
}
`
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, sampleConfig)

    console.log('Configuration file created!')
  } else {
    console.error('Configuration file already exists')
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  process.exit(EXIT_CODES.OK)
}

const readIgnore = _.memoize(() => {
  let ignoreFile = '.solhintignore'
  try {
    if (program.opts().ignorePath) {
      ignoreFile = program.opts().ignorePath
    }

    return fs
      .readFileSync(ignoreFile)
      .toString()
      .split('\n')
      .map((i) => i.trim())
  } catch (e) {
    if (program.opts().ignorePath && e.code === 'ENOENT') {
      console.error(`\nERROR: ${ignoreFile} is not a valid path.`)
      process.exit(EXIT_CODES.BAD_OPTIONS)
    }
    return []
  }
})

const readConfig = _.memoize(() => {
  let config = {}
  try {
    config = loadConfig(program.opts().config)
  } catch (e) {
    console.error(e.message)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  const configExcludeFiles = _.flatten(config.excludedFiles)
  config.excludedFiles = _.concat(configExcludeFiles, readIgnore())

  // validate the configuration before continuing
  validate(config)

  return config
})

function processStr(input) {
  return linter.processStr(input, readConfig())
}

function processPath(path) {
  return linter.processPath(path, readConfig())
}

function areWarningsExceeded(reports) {
  const warningsCount = reports.reduce((acc, i) => acc + i.warningCount, 0)
  const warningsNumberExceeded =
    program.opts().maxWarnings >= 0 && warningsCount > program.opts().maxWarnings

  return { warningsNumberExceeded, warningsCount }
}

function printReports(reports, formatter) {
  const warnings = areWarningsExceeded(reports)
  let finalMessage = ''
  let maxWarnsFound = false
  if (
    program.opts().maxWarnings &&
    reports &&
    reports.length > 0 &&
    warnings.warningsNumberExceeded
  ) {
    if (!reports[0].errorCount) {
      finalMessage = `Solhint found more warnings than the maximum specified (maximum: ${
        program.opts().maxWarnings
      }, found: ${warnings.warningsCount})`
      maxWarnsFound = true
    } else {
      finalMessage =
        'Error/s found on rules! [max-warnings] param is ignored. Fixing errors enables max-warnings'
    }
  }

  const fullReport = formatter(reports) + (finalMessage || '')

  if (!program.opts().quiet) {
    console.log(fullReport)
    if (fullReport && !program.opts().formatter) {
      console.log(
        chalk.italic.bgYellow.black.bold(
          ' -------------------------------------------------------------------------- '
        )
      )

      console.log(
        chalk.italic.bgYellow.black.bold(
          ' ===> Join SOLHINT Community at: https://discord.com/invite/4TYGq3zpjs <=== '
        )
      )

      console.log(
        chalk.italic.bgYellow.black.bold(
          ' -------------------------------------------------------------------------- \n'
        )
      )
    }
  }

  if (program.opts().save) {
    writeStringToFile(fullReport)
  }
  if (maxWarnsFound) process.exit(EXIT_CODES.REPORTED_ERRORS)
  return reports
}

function writeStringToFile(data) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')

  const fileName = `${year}${month}${day}${hour}${minute}${second}_solhintReport.txt`

  // Remove ANSI escape codes from the data
  // eslint-disable-next-line no-control-regex
  const cleanedData = data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')

  try {
    fs.writeFileSync(fileName, cleanedData, 'utf-8') // Specify the encoding (UTF-16)
    // console.log('File written successfully:', fileName)
  } catch (err) {
    console.error('Error writing to file:', err)
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }
  process.exit(EXIT_CODES.OK)
}

function getFormatter(formatter) {
  const formatterName = formatter || 'stylish'
  try {
    return require(`./lib/formatters/${formatterName}`)
  } catch (ex) {
    ex.message = `\nThere was a problem loading formatter option: ${
      program.opts().formatter
    } \nError: ${ex.message}`
    throw ex
  }
}

function listRules() {
  const args = process.argv.slice(2)
  let configPath = '.solhint.json'
  const configFileIndex = args.findIndex((arg) => arg === '-c' || arg === '--config')
  if (configFileIndex !== -1) {
    configPath = args[configFileIndex + 1]
    if (!configPath || configPath.startsWith('-')) {
      console.error('Error: Invalid configuration file path after -c or --config flag.')
      process.exit(EXIT_CODES.BAD_OPTIONS)
    }
  } else if (args.length !== 1) {
    console.error('Error!! no additional parameters after list-rules command')
    process.exit(EXIT_CODES.BAD_OPTIONS)
  }

  if (!fs.existsSync(configPath)) {
    console.error('Error!! Configuration does not exists')
    process.exit(EXIT_CODES.BAD_OPTIONS)
  } else {
    const config = readConfig()
    console.log('\nConfiguration File: \n', config)

    const reportLists = linter.processPath(configPath, config)
    const rulesObject = reportLists[0].config

    console.log('\nRules: \n')
    const orderedRules = Object.keys(rulesObject)
      .sort()
      .reduce((obj, key) => {
        obj[key] = rulesObject[key]
        return obj
      }, {})

    // eslint-disable-next-line func-names
    Object.keys(orderedRules).forEach(function (key) {
      console.log('- ', key, ': ', orderedRules[key])
    })
  }
}

function checkForUpdate() {
  // eslint-disable-next-line import/no-extraneous-dependencies
  return import('latest-version')
    .then((latestVersionModule) => {
      const latestVersion = latestVersionModule.default
      const currentVersion = require('./package.json').version

      return latestVersion('solhint')
        .then((latest) => {
          if (currentVersion < latest) {
            console.log('A new version of Solhint is available:', latest)
            console.log('Please consider updating your Solhint package.')
          }
        })
        .catch((error) => {
          console.error('Error checking for updates:', error.message)
        })
    })
    .catch((error) => {
      console.error('Error importing latest-version:', error.message)
    })
}

init()
