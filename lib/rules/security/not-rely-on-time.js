const BaseChecker = require('./../base-checker')

const ruleId = 'not-rely-on-time'
const meta = {
  type: 'security',

  docs: {
    description: `Avoid to make time-based decisions in your business logic.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null
}

class NotRelyOnTimeChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  Identifier(node) {
    if (node.name === 'now') {
      this._warn(node)
    }
  }

  MemberAccess(node) {
    if (node.expression.name === 'block' && node.memberName === 'timestamp') {
      this._warn(node)
    }
  }

  _warn(node) {
    this.warn(node, 'Avoid to make time-based decisions in your business logic')
  }
}

module.exports = NotRelyOnTimeChecker
