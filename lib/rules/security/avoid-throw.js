const BaseChecker = require('./../base-checker')

const ruleId = 'avoid-throw'
const meta = {
  type: 'security',

  docs: {
    description: `"throw" is deprecated, avoid to use it.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',
  fixable: true,

  schema: []
}

class AvoidThrowChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  ThrowStatement(node) {
    this.error(node, '"throw" is deprecated, avoid to use it', fixer => {
      return [fixer.replaceTextRange(node.range, 'revert()')]
    })
  }
}

module.exports = AvoidThrowChecker
