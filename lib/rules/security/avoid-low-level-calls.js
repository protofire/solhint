const BaseChecker = require('./../base-checker')
const { hasMethodCalls } = require('./../../common/tree-traversing')

const ruleId = 'avoid-low-level-calls'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to use low level calls.`,
    category: 'Security Rules',
    examples: {
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

  MemberAccess(node) {
    if (hasMethodCalls(node, ['call', 'callcode', 'delegatecall'])) {
      this._warn(node)
    }
  }

  _warn(ctx) {
    const message = 'Avoid to use low level calls.'
    this.warn(ctx, message)
  }
}

module.exports = AvoidLowLevelCallsChecker
