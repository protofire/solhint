const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'gas-named-return-values'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: `Enforce the return values of a function to be named`,
    category: 'Gas Consumption Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    examples: {
      good: [
        {
          description: 'Function definition with named return values',
          code: 'function checkBalance(address wallet) external view returns(uint256 retBalance) {}',
        },
      ],
      bad: [
        {
          description: 'Function definition with UNNAMED return values',
          code: 'function checkBalance(address wallet) external view returns(uint256) {}',
        },
      ],
    },
  },

  isDefault: false,
  recommended: false,
  defaultSetup: DEFAULT_SEVERITY,

  schema: null,
}

class GasNamedReturnValuesChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  FunctionDefinition(node) {
    if (node.returnParameters) {
      let index = 0
      for (const returnValue of node.returnParameters) {
        if (!returnValue.name) {
          this.error(node, `GC: Named return value is missing - Index ${index}`)
        }
        index++
      }
    }
  }
}

module.exports = GasNamedReturnValuesChecker
