const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-tx-origin'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to use tx.origin.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class AvoidTxOriginChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  MemberAccess(node) {
    if (node.memberName === 'origin' && node.expression.name === 'tx') {
      this.error(node, 'Avoid to use tx.origin')
    }
  }
}

module.exports = AvoidTxOriginChecker
