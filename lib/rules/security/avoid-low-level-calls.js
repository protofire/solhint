const BaseChecker = require('./../base-checker')
const { hasMethodCalls } = require('./../../common/tree-traversing')

const ruleId = 'avoid-low-level-calls'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to use low level calls.`,
    category: 'Security Rules',
    examples: {
      good: [
        {
          description: 'Using low level calls to transfer funds',
          code: require('../../../test/fixtures/security/allowed-low-level-calls').join('\n')
        }
      ],
      bad: [
        {
          description: 'Using low level calls',
          code: require('../../../test/fixtures/security/low-level-calls').join('\n')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null
}

class AvoidLowLevelCallsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  FunctionCall(node) {
    switch (node.expression.type) {
      case 'MemberAccess':
        if (hasMethodCalls(node.expression, ['call', 'callcode', 'delegatecall'])) {
          return this._warn(node)
        }
      case 'NameValueExpression':
        // Allow low level method calls for transferring funds
        //
        // See:
        //
        // - https://solidity-by-example.org/sending-ether/
        // - https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
        if (node.expression.expression.memberName === 'call'
          && node.expression.arguments.type === 'NameValueList'
          && node.expression.arguments.names.includes('value')
        ) {
          return
        }

        if (hasMethodCalls(node.expression.expression, ['call', 'callcode', 'delegatecall'])) {
          return this._warn(node)
        }
    }
  }

  _warn(ctx) {
    const message = 'Avoid to use low level calls.'
    this.warn(ctx, message)
  }
}

module.exports = AvoidLowLevelCallsChecker
