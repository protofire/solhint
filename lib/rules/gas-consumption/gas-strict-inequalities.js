const BaseChecker = require('../base-checker')

const ruleId = 'gas-strict-inequalities'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Suggest Strict Inequalities over non Strict ones',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: 'Strict inequality does not always saves gas. It is dependent on the context of the surrounding opcodes',
      },
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (see Less/Greater Than vs Less/Greater Than or Equal To)',
      },
      {
        note: '[source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-7b77t) of the rule initiative',
      },
    ],
  },

  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

class GasStrictInequalities extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  BinaryOperation(node) {
    if (node.operator === '>=' || node.operator === '<=') {
      this.reportError(node)
    }
  }

  reportError(node) {
    this.error(node, `GC: Non strict inequality found. Try converting to a strict one`)
  }
}

module.exports = GasStrictInequalities
