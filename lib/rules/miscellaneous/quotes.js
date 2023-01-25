const BaseChecker = require('../base-checker')
const { severityDescription, formatEnum } = require('../../doc/utils')

const ruleId = 'quotes'
const DEFAULT_SEVERITY = 'error'
const DEFAULT_QUOTES_TYPE = 'double'
const QUOTE_TYPES = ['single', 'double']
const meta = {
  type: 'miscellaneous',

  docs: {
    description: `Use double quotes for string literals. Values must be 'single' or 'double'.`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: `Type of quotes. Must be one of ${formatEnum(QUOTE_TYPES)}`,
        default: DEFAULT_QUOTES_TYPE,
      },
    ],
    examples: {
      good: [
        {
          description: 'String with double quotes',
          code: require('../../../test/fixtures/miscellaneous/string-with-double-quotes'),
        },
      ],
      bad: [
        {
          description: 'String with single quotes',
          code: require('../../../test/fixtures/miscellaneous/string-with-single-quotes'),
        },
      ],
    },
  },

  isDefault: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_QUOTES_TYPE],

  schema: {
    type: 'string',
    enum: QUOTE_TYPES,
  },
}

class QuotesChecker extends BaseChecker {
  constructor(reporter, config, tokens) {
    super(reporter, ruleId, meta)
    this.tokens = tokens
    this.visitedNodes = new Set()

    const quoteType = config && config.rules && config.rules.quotes && config.rules.quotes[1]
    this.quoteType = (QUOTE_TYPES.includes(quoteType) && quoteType) || DEFAULT_QUOTES_TYPE
    this.incorrectQuote = this.quoteType === 'single' ? '"' : "'"
  }

  StringLiteral(node) {
    const token = this.tokens.find(
      (token) =>
        token.loc.start.line === node.loc.start.line &&
        token.loc.start.column === node.loc.start.column
    )

    if (token && !this.alreadyVisited(token)) {
      this.addVisitedNode(token)
      this.validateQuotes(token)
    }
  }

  validateQuotes(node) {
    if (node.value.startsWith(this.incorrectQuote)) {
      this._error(node)
    }
  }

  alreadyVisited({
    loc: {
      start: { line, column },
    },
  }) {
    return this.visitedNodes.has(`${line}${column}`)
  }

  addVisitedNode({
    loc: {
      start: { line, column },
    },
  }) {
    this.visitedNodes.add(`${line}${column}`)
  }

  _error(ctx) {
    this.error(ctx, `Use ${this.quoteType} quotes for string literals`)
  }
}

module.exports = QuotesChecker
