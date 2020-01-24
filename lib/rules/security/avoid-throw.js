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
    this.error(node, '"throw" is deprecated, avoid to use it', fixer =>
      // subtract 1 to make 'throw' a semi-closed range
      fixer.replaceTextRange([node.range[0], node.range[1] - 1], 'revert()')
    )
  }
}

module.exports = AvoidThrowChecker
