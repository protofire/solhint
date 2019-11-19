const fs = require('fs')
const parser = require('solidity-parser-antlr')
const glob = require('glob')
const ignore = require('ignore')
const Reporter = require('./reporter')
const TreeListener = require('./tree-listener')
const checkers = require('./rules/index')

function processStr(inputStr, config = {}, fileName = '') {
  const ast = parser.parse(inputStr, { loc: true })
  const tokens = parser.tokenize(inputStr, { loc: true })
  const reporter = new Reporter(tokens, config)
  const listener = new TreeListener(checkers(reporter, config, inputStr, fileName))

  parser.visit(ast, listener)

  return reporter
}

function processFile(file, config) {
  const report = processStr(fs.readFileSync(file).toString(), config, file)
  report.file = file

  return report
}

function processPath(path, config) {
  const ignoreFilter = ignore().add(config.excludedFiles)

  const allFiles = glob.sync(path, {})
  const files = ignoreFilter.filter(allFiles)

  return files.map(curFile => processFile(curFile, config))
}

module.exports = { processPath, processFile, processStr }
