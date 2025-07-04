const BaseChecker = require('../base-checker')

const ruleId = 'payable-fallback'
const meta = {
  type: 'best-practices',

  docs: {
    description:
      'When fallback is not payable and there is no receive function you will not be able to receive currency.',
    category: 'Best Practices Rules',
    examples: {
      good: [
        {
          description: 'Fallback is payable',
          code: 'function() public payable {}',
        },
        {
          description: 'Fallback is payable',
          code: 'fallback() external payable {}',
        },
      ],
      bad: [
        {
          description: 'Fallback is not payable',
          code: 'function() {} function g() payable {}',
        },
        {
          description: 'Fallback is not payable',
          code: 'fallback() {} function g() payable {}',
        },
      ],
    },
    notes: [
      {
        note: 'Solhint allows this rule to automatically fix the code with `--fix` option',
      },
      {
        note: 'Instead of having a fallback function to receive native currency it is recommended to code a receive() function [[here]](https://docs.soliditylang.org/en/v0.8.24/contracts.html#fallback-function)',
      },
    ],
  },

  recommended: false,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class PayableFallbackChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  ContractDefinition(node) {
    if (node.kind !== 'contract') return
    this.contractName = node.name

    this.receiveFunctionPresent = false
    this.fallbackFunctionPresentAndNotPayable = false
    this.nodesError = []
  }

  'ContractDefinition:exit'(node) {
    if (node.kind !== 'contract') return
    this.outputReport()
    this.contractName = ''
  }

  FunctionDefinition(node) {
    if (node.isReceiveEther) {
      this.receiveFunctionPresent = true
      return
    }

    if (node.isFallback && node.stateMutability !== 'payable') {
      this.fallbackFunctionPresentAndNotPayable = true
      this.nodesError.push(node)
    }
  }

  outputReport() {
    if (!this.receiveFunctionPresent && this.fallbackFunctionPresentAndNotPayable) {
      for (let i = 0; i < this.nodesError.length; i++) {
        this.warn(
          this.nodesError[i],
          `Contract [${this.contractName}] Fallback should be payable and external (code a receive() function is recommended!)`,
          this.fixStatement(this.nodesError[i])
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
