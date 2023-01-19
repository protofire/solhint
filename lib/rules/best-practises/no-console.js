const BaseChecker = require('./../base-checker')

const DEFAULT_SEVERITY = 'error'

const ruleId = 'no-console'
const meta = {
  type: 'best-practises',
  docs: {
    description:
      'No console.log/logInt/logBytesX/logString/etc & No hardhat/console.sol and forge-std import statements',
    category: 'Best Practise Rules',
    examples: {
      bad: [
        {
          description: 'No console.logX statements',
          code: "console.log('test')"
        },
        {
          description: 'No hardhat/console.sol import statements',
          code: 'import "hardhat/console.sol"' // eslint-disable-line
        },
        {
          description: 'No forge-std import statements',
          code: 'import "forge-std/xxx"' // eslint-disable-line
        }
      ]
    }
  },

  isDefault: true,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY],
  schema: null
}

class NoConsoleLogChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  ImportDirective(node) {
    this.isAnImport(node)
    if (this.isAnImport(node)) {
      this.error(node, 'No import "hardhat/console.sol" or "forge-std/xxx" statements') // eslint-disable-line
    }
  }

  FunctionCall(node) {
    if (this.isConsoleLog(node)) {
      this.error(node, 'No console.logX statements')
    }
  }

  isConsoleLog(node) {
    return (
      node.expression.expression.name === 'console' && node.expression.memberName.includes('log')
    )
  }

  isAnImport(node) {
    return (
      node.type === 'ImportDirective' &&
      (node.path === 'hardhat/console.sol' || node.path.includes('forge-std'))
    )
  }
}

module.exports = NoConsoleLogChecker
