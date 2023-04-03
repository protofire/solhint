const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_MAX_LINES_COUNT = 50
const ruleId = 'function-max-lines'
const meta = {
  type: 'best-practises',

  docs: {
    description:
      'Function body contains "count" lines but allowed no more than maxlines. (comments and empty lines not considered)',
    category: 'Best Practise Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: 'Maximum allowed lines count per function',
        default: DEFAULT_MAX_LINES_COUNT,
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_MAX_LINES_COUNT],

  schema: {
    type: 'integer',
    minimum: 1,
  },
}

class FunctionMaxLinesChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.maxLines =
      (config && config.getNumber(ruleId, DEFAULT_MAX_LINES_COUNT)) || DEFAULT_MAX_LINES_COUNT
  }

  FunctionDefinition(node) {
    if (this._linesCount(node) > this.maxLines) {
      this._error(node)
    }
  }

  _linesCount(node) {
    return Object.keys(node.body.statements).length
  }

  _error(node) {
    const linesCount = this._linesCount(node)
    const message = `Function body contains ${linesCount} lines but allowed no more than ${this.maxLines} lines`
    this.error(node, message)
  }
}

module.exports = FunctionMaxLinesChecker
