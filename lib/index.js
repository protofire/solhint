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

// Process the solidity file using the specified config or, if not provided,
// searches for .solhint.json files in the file's directory hierarchy.
// explicitConfigPath is optional and is used to force a specific config.
// eslint-disable-next-line default-param-last
function processFile(file, config, rootDir = process.cwd(), explicitConfigPath) {
  // If we receive an explicit config, we use it; otherwise, we search hierarchically or use the config passed by -c
  const finalConfig =
    config !== undefined ? config : loadConfigForFile(file, rootDir, explicitConfigPath)
  const report = processStr(fs.readFileSync(file, 'utf8').toString(), finalConfig, file)
  report.file = file
  return report
}

// eslint-disable-next-line default-param-last
function processPath(pattern, config, rootDir = process.cwd(), explicitConfigPath) {
  const ignoreFilter = ignore({ allowRelativePaths: true }).add(
    (config && config.excludedFiles) || []
  )
  const allFiles = glob.sync(pattern, { nodir: true })
  const files = ignoreFilter.filter(allFiles)
  return files.map((curFile) => processFile(curFile, config, rootDir, explicitConfigPath))
}

module.exports = { processPath, processFile, processStr }
