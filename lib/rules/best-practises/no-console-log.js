const BaseChecker = require('./../base-checker')

const DEFAULT_SEVERITY = 'error'

const ruleId = 'no-console-log'
const meta = {
  type: 'best-practises',
  docs: {
    description: 'No console.log() or hardhat/console.sol import statements',
    category: 'Best Practise Rules',
    examples: {
      bad: [
        {
          description: 'No console.log() statements',
          code: "console.log('test')"
        },
        {
          description: 'No hardhat/console.sol import',
          code: 'import "hardhat/console.sol"' // eslint-disable-line
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
    this.isHardhatImport(node)
    if (this.isHardhatImport(node)) {
      this.error(node, 'No import "hardhat/console.sol"') // eslint-disable-line
    }
  }

  FunctionCall(node) {
    if (this.isConsoleLog(node)) {
      this.error(node, 'No console.log()')
    }
  }

  isConsoleLog(node) {
    return node.expression.expression.name === 'console' && node.expression.memberName === 'log'
  }

  isHardhatImport(node) {
    return node.type === 'ImportDirective' && node.path === 'hardhat/console.sol'
  }
}

module.exports = NoConsoleLogChecker
