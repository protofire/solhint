const BaseChecker = require('./../base-checker')

const ruleId = 'max-line-length'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Line length must be no more than maxlen.',
    category: 'Best Practise Rules'
  },

  isDefault: true,
  recommended: false,
  defaultSetup: ['error', 120],

  schema: [
    {
      type: 'array',
      items: [{ type: 'integer' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class MaxLineLengthChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.maxLength = (config && config.getNumber(ruleId, 120)) || 120
  }

  enterSourceUnit(ctx) {
    const lines = ctx.parser._input.tokenSource._input.strdata.split('\n')

    lines.map(line => line.length).forEach(this.validateLineLength.bind(this))
  }

  validateLineLength(curLength, lineNum) {
    if (curLength > this.maxLength) {
      const message = `Line length must be no more than ${
        this.maxLength
      } but current length is ${curLength}.`
      this.errorAt(lineNum + 1, 1, message)
    }
  }
}

module.exports = MaxLineLengthChecker
