const BaseChecker = require('../base-checker')

const ruleId = 'quotes'
const meta = {
  type: 'miscellaneous',

  docs: {
    description: `Use double quotes for string literals. Values must be 'single' or 'double'.`,
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: ['error', 'double'],

  schema: [
    {
      type: 'array',
      items: [
        {
          type: 'string',
          enum: ['single', 'double']
        }
      ],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class QuotesChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    const quoteType = config && config.rules && config.rules.quotes && config.rules.quotes[1]
    this.quoteType = (['double', 'single'].includes(quoteType) && quoteType) || 'double'
    this.incorrectQuote = this.quoteType === 'single' ? '"' : "'"
  }

  exitPrimaryExpression(ctx) {
    this.validateQuotes(ctx)
  }

  exitAssemblyLiteral(ctx) {
    this.validateQuotes(ctx)
  }

  exitImportDirective(ctx) {
    const children = ctx.children

    if (children && children.length >= 2) {
      this.validateQuotes(children[1])
    }

    for (let i = 0; i < children.length; i += 1) {
      const curChild = children[i]

      if (curChild.getText && curChild.getText() === 'from' && i + 1 < children.length) {
        this.validateQuotes(children[i + 1])
      }
    }
  }

  validateQuotes(ctx) {
    if (ctx.getText().startsWith(this.incorrectQuote)) {
      this._error(ctx)
    }
  }

  _error(ctx) {
    this.error(ctx, `Use ${this.quoteType} quotes for string literals`)
  }
}

module.exports = QuotesChecker
