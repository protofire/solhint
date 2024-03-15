const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const BASE_VERSION = [0, 8, 4]
const ruleId = 'gas-custom-errors'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Enforces the use of Custom Errors over Require and Revert statements',
    category: 'Gas Consumption Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    notes: [
      {
        note: 'This rules applies to Solidity version 0.8.4 and higher',
      },
    ],
    examples: {
      good: [
        {
          description: 'Use of Custom Errors',
          code: 'revert CustomErrorFunction();',
        },
        {
          description: 'Use of Custom Errors with arguments',
          code: 'revert CustomErrorFunction({ msg: "Insufficient Balance" });',
        },
      ],
      bad: [
        {
          description: 'Use of require statement',
          code: 'require(userBalance >= availableAmount, "Insufficient Balance");',
        },
        {
          description: 'Use of plain revert statement',
          code: 'revert();',
        },
        {
          description: 'Use of revert statement with message',
          code: 'revert("Insufficient Balance");',
        },
      ],
    },
  },

  isDefault: false,
  recommended: true,
  defaultSetup: DEFAULT_SEVERITY,

  schema: null,
}

class GasCustomErrorsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
    this.solidityVersion = 0
  }

  parseVersion(version) {
    // Remove any leading ^ or ~ and other non-numeric characters before the first digit
    const cleanVersion = version.replace(/^[^\d]+/, '')
    return cleanVersion.split('.').map((num) => parseInt(num, 10))
  }

  isVersionGreater(node) {
    const currentVersion = this.parseVersion(this.solidityVersion)
    if (currentVersion.length !== 3) {
      this.error(node, `GC: Invalid Solidity version`)
      return
    }

    for (let i = 0; i < BASE_VERSION.length; i++) {
      if (currentVersion[i] < BASE_VERSION[i]) {
        // If any part of the current version is less than the base version, return false
        return false
      } else if (currentVersion[i] > BASE_VERSION[i]) {
        // If any part of the current version is greater, no need to check further, return true
        return true
      }
      // If parts are equal, continue to the next part
    }

    // Reaching here means all parts compared are equal, or the base version parts have been exhausted,
    // so the current version is at least equal, return true
    return true
  }

  PragmaDirective(node) {
    if (node.type === 'PragmaDirective' && node.name === 'solidity') {
      this.solidityVersion = node.value
    }
  }

  FunctionCall(node) {
    let errorStr = ''

    if (this.isVersionGreater(node)) {
      if (node.expression.name === 'require') {
        errorStr = 'require'
      } else if (
        node.expression.name === 'revert' &&
        (node.arguments.length === 0 || node.arguments[0].type === 'StringLiteral')
      ) {
        errorStr = 'revert'
      }

      if (errorStr !== '') {
        this.error(node, `GC: Use Custom Errors instead of ${errorStr} statements`)
      }
    }
  }
}

module.exports = GasCustomErrorsChecker
