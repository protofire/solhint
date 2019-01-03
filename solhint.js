#!/usr/bin/env node

const program = require('commander')
const _ = require('lodash')
const fs = require('fs')
const process = require('process')
const linter = require('./lib/index')
const packageJson = require('./package.json')
const { FileNotExistsError } = require('./lib/common/errors')

function init() {
  const version = packageJson.version
  program.version(version)

  program
    .usage('[options] <file> [...other_files]')
    .option('-f, --formatter [name]', 'report formatter name (stylish, table, tap, unix)')
    .option(
      '-w, --max-warnings [maxWarningsNumber]',
      'number of allowed warnings'
    )
    .option('-c, --config [file_name]', 'file to use as your .solhint.json')
    .option('-q, --quiet', 'report errors only - default: false')
    .option('--ignore-path [file_name]', 'file to use as your .solhintignore')
    .description('Linter for Solidity programming language')
    .action(execMainAction)

  program
    .command('stdin')
    .description('linting of source code data provided to STDIN')
    .option('--filename [file_name]', 'name of file received using STDIN')
    .action(processStdin)

  program
    .command('init-config')
    .description('create in current directory configuration file for solhint')
    .action(writeSampleConfigFile)

  program.parse(process.argv)

  if (program.args.length < 1) {
    program.help()
  }
}

function execMainAction() {
  let formatterFn

  try {
    // to check if is a valid formatter before execute linter
    formatterFn = getFormatter(program.formatter)
  } catch (ex) {
    console.error(ex.message)
    process.exit(1)
  }

  const reportLists = program.args.filter(_.isString).map(processPath)
  const reports = _.flatten(reportLists)
  const warningsNumberExceeded =
    program.maxWarnings >= 0 && reports[0].warningCount > program.maxWarnings

  if (program.quiet) {
    // filter the list of reports, to set errors only.
    reports[0].reports = reports[0].reports.filter(i => i.severity === 2)
  }

  if (printReports(reports, formatterFn)) {
    if (program.maxWarnings && !reports[0].errorCount && warningsNumberExceeded) {
      console.log(
        'Solhint found more warnings than the maximum specified (maximum: %s)',
        program.maxWarnings
      )
      process.exit(1)
    }
  }

  exitWithCode(reports)
}

function processStdin(options) {
  const STDIN_FILE = 0
  const stdinBuffer = fs.readFileSync(STDIN_FILE)

  const report = processStr(stdinBuffer.toString())
  report.file = options.filename || 'stdin'
  printReports([report])
}

function writeSampleConfigFile() {
  const configPath = '.solhint.json'
  const sampleConfig = [
    '{                                              ',
    '    "extends": "default",                      ',
    '    "rules": {                                 ',
    '        "indent": ["error", 4],                ',
    '        "quotes": ["error", "double"],         ',
    '        "max-line-length": ["error", 120]      ',
    '    }                                          ',
    '}                                              '
  ]

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, sampleConfig.join('\n'))

    console.log('Configuration file created!')
  } else {
    console.log('Configuration file already exists')
  }
}

const readIgnore = _.memoize(() => {
  let ignoreFile = '.solhintignore'
  try {
    if (program.ignorePath) {
      ignoreFile = program.ignorePath
    }

    return fs
      .readFileSync(ignoreFile)
      .toString()
      .split('\n')
      .map(i => i.trim())
  } catch (e) {
    if (program.ignorePath && e.code === 'ENOENT') {
      console.error(`\nERROR: ${ignoreFile} is not a valid path.`)
    }
    return []
  }
})

const readConfig = _.memoize(() => {
  let config = {}

  try {
    const configFile = program.config || '.solhint.json'

    if (!fs.existsSync(configFile)) {
      throw new FileNotExistsError('The config file doesnt exist')
    }

    const configStr = fs.readFileSync(configFile).toString()

    config = JSON.parse(configStr)
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.log('ERROR: Configuration file [.solhint.json] is not a valid JSON!\n')
    }
    if (e instanceof FileNotExistsError) {
      console.log(`ERROR: Configuration file [${program.config}] doesn't exist!\n`)
    }
    process.exit(1)
  }

  const configExcludeFiles = _.flatten(config.excludedFiles)
  config.excludedFiles = _.concat(configExcludeFiles, readIgnore())

  return config
})

function processStr(input) {
  return linter.processStr(input, readConfig())
}

function processPath(path) {
  return linter.processPath(path, readConfig())
}

function printReports(reports, formatter) {
  console.log(formatter(reports))
  return reports
}

function getFormatter(formatter) {
  const formatterName = formatter || 'stylish'
  try {
    return require(`eslint/lib/formatters/${formatterName}`)
  } catch (ex) {
    ex.message = `\nThere was a problem loading formatter option: ${program.formatter} \nError: ${
      ex.message
    }`
    throw ex
  }
}

function exitWithCode(reports) {
  const errorsCount = reports.reduce((acc, i) => acc + i.errorCount, 0)

  process.exit(errorsCount > 0 ? 1 : 0)
}

init()
