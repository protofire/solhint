const fs = require('fs-extra')
const path = require('path')
const parser = require('@solidity-parser/parser')
const glob = require('glob')
const ignore = require('ignore')
const astParents = require('ast-parents')
const { applyExtends, loadConfigForFile } = require('./config/config-file')
const Reporter = require('./reporter')
const TreeListener = require('./tree-listener')
const checkers = require('./rules/index')
const { readCache, writeCache, shouldLint, updateCacheEntry } = require('./cache/cache-manager')

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

function processAndCache(file, config, cacheState = null) {
  const useCache = config?.cache

  const code = fs.readFileSync(file, 'utf8')

  if (useCache && cacheState) {
    const { cacheData, updatedCache } = cacheState
    if (!shouldLint(file, code, config, cacheData)) {
      const emptyReport = new Reporter([], config)
      emptyReport.file = file
      emptyReport.skipped = true
      return { report: emptyReport, updatedCache }
    }
  }

  const report = processStr(code, config, file)
  report.file = file

  const hasErrors = report.reports.some((r) => r.severity === 2)

  if (useCache && cacheState && !hasErrors) {
    updateCacheEntry(file, code, config, cacheState.updatedCache)
  }

  return { report, updatedCache: cacheState?.updatedCache }
}

// eslint-disable-next-line default-param-last
function processFile(file, config, rootDir = process.cwd(), explicitConfigPath) {
  const finalConfig =
    config !== undefined ? config : loadConfigForFile(file, rootDir, explicitConfigPath)

  const defaultCachePath = path.join('node_modules', '.cache', 'solhint', '.solhintcache.json')
  const cachePath = finalConfig.cacheLocation || defaultCachePath

  let cacheState = null
  if (finalConfig.cache) {
    const cacheData = readCache(cachePath)
    cacheState = {
      cacheData,
      updatedCache: { ...cacheData },
    }
  }

  const { report, updatedCache } = processAndCache(file, finalConfig, cacheState)

  if (finalConfig.cache && updatedCache) {
    fs.ensureDirSync(path.dirname(cachePath)) // make sure the directory exists
    writeCache(cachePath, updatedCache)
  }

  return report
}

// eslint-disable-next-line default-param-last
function processPath(pattern, config, rootDir = process.cwd(), explicitConfigPath) {
  const ignoreFilter = ignore({ allowRelativePaths: true }).add(config?.excludedFiles || [])
  const allFiles = glob.sync(pattern, { nodir: true })
  const files = ignoreFilter.filter(allFiles)

  const useCache = config?.cache
  const defaultCachePath = path.join('node_modules', '.cache', 'solhint', '.solhintcache.json')
  const cachePath = config?.cacheLocation || defaultCachePath

  const cacheData = useCache ? readCache(cachePath) : {}
  const updatedCache = { ...cacheData }

  const reports = []

  for (const file of files) {
    const fileConfig =
      config !== undefined ? config : loadConfigForFile(file, rootDir, explicitConfigPath)

    const { report } = processAndCache(file, fileConfig, {
      cacheData,
      updatedCache,
    })

    reports.push(report)
  }

  if (useCache) {
    fs.ensureDirSync(path.dirname(cachePath)) // make sure the directory exists
    writeCache(cachePath, updatedCache)
  }

  return reports
}

module.exports = { processPath, processFile, processStr }
