const BaseChecker = require('./../base-checker')

const DEFAULT_SEVERITY = 'error'

const ruleId = 'no-console'
const meta = {
  type: 'best-practises',
  docs: {
    description:
      'No console.log/logInt/logBytesX/logString/etc & No hardhat and forge-std console.sol import statements',
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
          description: 'No forge-std console.sol & console2.sol import statements',
          code: 'import "forge-std/consoleN.sol"' // eslint-disable-line
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
      this.error(node, 'No import "hardhat/console.sol" or "forge-std/console.sol" statements') // eslint-disable-line
    }
  }

  FunctionCall(node) {
    if (this.isConsoleLog(node)) {
      this.error(node, 'No console.logX or console2.log statements')
    }
  }

  isConsoleLog(node) {
    return node.expression.expression.name.includes('console')
  }

  isAnImport(node) {
    return (
      node.type === 'ImportDirective' &&
      (node.path === 'hardhat/console.sol' || node.path.includes('forge-std/console'))
    )
  }
}

module.exports = NoConsoleLogChecker
