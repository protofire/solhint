const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'custom-error-over-require'
const meta = {
  type: 'best-practises',

  docs: {
    description:
      'Require should be replaced with Custom Errors reverts from solidity 0.8.4 and on.',
    category: 'Best Practise Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
  },

  isDefault: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY],

  schema: null,
}

class RevertCustomOverRequireChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  FunctionCall(node) {
    if (this.isReasonStringStatement(node)) {
      const functionParameters = this.getFunctionParameters(node)
      const functionName = this.getFunctionName(node)

      // Throw an error if have no message
      if (functionName === 'revert' && functionParameters.length === 0) {
        this.error(node, `Provide an error message for revert`)
        return
      }

      if (functionName === 'require') {
        this.error(node, `Replace require with revert and custom errors`)
      }
    }
  }

  isReasonStringStatement(node) {
    return node.expression.name === 'revert' || node.expression.name === 'require'
  }

  getFunctionName(node) {
    return node.expression.name
  }

  getFunctionParameters(node) {
    return node.arguments
  }
}

module.exports = RevertCustomOverRequireChecker
