const fs = require('fs')
const parser = require('@solidity-parser/parser')
const glob = require('glob')
const ignore = require('ignore')
const astParents = require('ast-parents')
const { applyExtends, loadConfigForFile } = require('./config/config-file')
const Reporter = require('./reporter')
const TreeListener = require('./tree-listener')
const checkers = require('./rules/index')

function parseInput(inputStr) {
  try {
    // first we try to parse the string as we normally do
    return parser.parse(inputStr, { loc: true, range: true })
  } catch (e) {
    // using 'loc' may throw when inputStr is empty or only has comments
    return parser.parse(inputStr, {})
  }
}

function processStr(inputStr, config = {}, fileName = '') {
  config = applyExtends(config)

  let ast
  try {
    ast = parseInput(inputStr)
  } catch (e) {
    if (e instanceof parser.ParserError) {
      const reporter = new Reporter([], config)
      for (const error of e.errors) {
        reporter.addReport(
          error.line,
          error.column,
          Reporter.SEVERITY.ERROR,
          `Parse error: ${error.message}`
        )
      }
      return reporter
    } else {
      throw e
    }
  }

  const tokens = parser.tokenize(inputStr, { loc: true, range: true })
  const reporter = new Reporter(tokens, config)
  const listener = new TreeListener(checkers(reporter, config, inputStr, tokens, fileName))

  astParents(ast)
  parser.visit(ast, listener)

  return reporter
}

// Si se pasa config explícita, úsala. Si no, usa la jerárquica (.solhint.json)
function processFile(file, config, rootDir = process.cwd()) {
  const finalConfig = config !== undefined ? config : loadConfigForFile(file, rootDir)
  const report = processStr(fs.readFileSync(file).toString(), finalConfig, file)
  report.file = file
  return report
}

function processPath(pattern, config, rootDir = process.cwd()) {
  const ignoreFilter = ignore({ allowRelativePaths: true }).add(
    (config && config.excludedFiles) || []
  )
  const allFiles = glob.sync(pattern, { nodir: true })
  const files = ignoreFilter.filter(allFiles)
  return files.map((curFile) => processFile(curFile, config, rootDir))
}

module.exports = { processPath, processFile, processStr }
