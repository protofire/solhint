const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_MAX_UNNAMED_ARGUMENTS = 2

const ruleId = 'func-named-parameters'
const meta = {
  type: 'naming',

  docs: {
    description:
      'Enforce function calls with Named Parameters when containing more than the configured qty',
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: 'Maximum qty of unnamed parameters for a function call.',
        default: JSON.stringify(DEFAULT_MAX_UNNAMED_ARGUMENTS),
      },
    ],
    examples: {
      good: [
        {
          description: 'Function call with two UNNAMED parameters (default is max 2)',
          code: "functionName('0xA81705c8C247C413a19A244938ae7f4A0393944e', 1e18)",
        },
        {
          description: 'Function call with two NAMED parameters',
          code: "functionName({ sender: '0xA81705c8C247C413a19A244938ae7f4A0393944e', amount: 1e18})",
        },
        {
          description: 'Function call with four NAMED parameters',
          code: 'functionName({ sender: _senderAddress, amount: 1e18, token: _tokenAddress, receiver: _receiverAddress })',
        },
      ],
      bad: [
        {
          description: 'Function call with four UNNAMED parameters (default is max 2)',
          code: 'functionName(_senderAddress, 1e18, _tokenAddress, _receiverAddress )',
        },
      ],
    },
  },

  isDefault: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_MAX_UNNAMED_ARGUMENTS],

  schema: { type: 'integer' },
}

class FunctionNamedParametersChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)
    this.maxUnnamedArguments = config && config.getNumber(ruleId, DEFAULT_MAX_UNNAMED_ARGUMENTS)
    if (!(this.maxUnnamedArguments >= 0)) this.maxUnnamedArguments = DEFAULT_MAX_UNNAMED_ARGUMENTS
  }

  FunctionCall(node) {
    const qtyNamed = node.names.length
    const qtyArgs = node.arguments.length

    if (qtyArgs !== 0) {
      if (qtyNamed === 0 && qtyArgs > this.maxUnnamedArguments) {
        this.error(
          node,
          `Missing named parameters. Max unnamed parameters value is ${this.maxUnnamedArguments}`
        )
      }
    }
  }
}

module.exports = FunctionNamedParametersChecker
