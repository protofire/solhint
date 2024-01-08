const BaseChecker = require('../base-checker')
const { isFallbackFunction } = require('../../common/ast-types')

const ruleId = 'payable-fallback'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'When fallback is not payable you will not be able to receive ethers.',
    category: 'Best Practise Rules',
    examples: {
      good: [
        {
          description: 'Fallback is payable',
          code: require('../../../test/fixtures/best-practises/fallback-payable'),
        },
      ],
      bad: [
        {
          description: 'Fallback is not payable',
          code: require('../../../test/fixtures/best-practises/fallback-not-payable'),
        },
      ],
    },
    notes: [
      {
        note: 'Solhint allows this rule to automatically fix the code with `--fix` option',
      },
    ],
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class PayableFallbackChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  FunctionDefinition(node) {
    if (isFallbackFunction(node)) {
      if (node.stateMutability !== 'payable') {
        this.warn(
          node,
          'Fallback should be external and payable to accept native currency',
          this.fixStatement(node)
        )
      }
    }
  }

  fixStatement(node) {
    const range = node.range
    const stringToPut = ' payable '

    if (node.isReceiveEther) {
      range[0] += 9
    } else {
      range[0] += 10
    }

    return (fixer) => fixer.insertTextBeforeRange(range, stringToPut)
  }
}

module.exports = PayableFallbackChecker
