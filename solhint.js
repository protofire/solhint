#!/usr/bin/env node
const program = require('commander')
const _ = require('lodash')
const fs = require('fs')
const process = require('process')
const readline = require('readline')

const linter = require('./lib/index')
const { loadConfig } = require('./lib/config/config-file')
const { validate } = require('./lib/config/config-validator')
const applyFixes = require('./lib/apply-fixes')
const ruleFixer = require('./lib/rule-fixer')
const packageJson = require('./package.json')

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
        process.exit(0)
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
    process.exit(1)
  }

  const reportLists = program.args.filter(_.isString).map(processPath)
  const reports = _.flatten(reportLists)

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
        }
      }
    }
  }

  if (program.opts().quiet) {
    // filter the list of reports, to set errors only.
    reports.forEach((reporter) => {
      reporter.reports = reporter.reports.filter((i) => i.severity === 2)
    })
  }

  printReports(reports, formatterFn)

  // exitWithCode(reports)
  process.exit(0)
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
    process.exit(1)
  }

  const reports = [report]

  printReports(reports, formatterFn)
  process.exit(0)
  // exitWithCode(reports)
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
    console.log('Configuration file already exists')
  }
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
    }
    return []
  }
})

const readConfig = _.memoize(() => {
  let config = {}
  try {
    config = loadConfig(program.opts().config)
  } catch (e) {
    console.log(e.message)
    process.exit(1)
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
  let exitWithOne = false
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
      exitWithOne = true
    } else {
      finalMessage =
        'Error/s found on rules! [max-warnings] param is ignored. Fixing errors enables max-warnings'
    }
  }

  const fullReport = formatter(reports) + (finalMessage || '')
  console.log(fullReport)

  if (program.opts().save) {
    writeStringToFile(fullReport)
  }

  if (exitWithOne) process.exit(1)
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
  }
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
      process.exit(1)
    }
  } else if (args.length !== 1) {
    console.log('Error!! no additional parameters after list-rules command')
    process.exit(1)
  }

  if (!fs.existsSync(configPath)) {
    console.log('Error!! Configuration does not exists')
    process.exit(1)
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

// function exitWithCode(reports) {
//   const errorsCount = reports.reduce((acc, i) => acc + i.errorCount, 0)
//   process.exit(errorsCount > 0 ? 1 : 0)
// }

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
