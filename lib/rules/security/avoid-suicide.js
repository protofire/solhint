const BaseChecker = require('../base-checker')

const ruleId = 'avoid-suicide'
const meta = {
  type: 'security',

  docs: {
    description: `Use "selfdestruct" instead of deprecated "suicide".`,
    category: 'Security Rules',
  },

  recommended: true,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class AvoidSuicideChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  FunctionCall(node) {
    if (node.expression.type === 'Identifier' && node.expression.name === 'suicide') {
      this.error(
        node,
        'Use "selfdestruct" instead of deprecated "suicide"',
        this.fixStatement(node)
      )
    }
  }

  fixStatement(node) {
    let stringToPut = 'selfdestruct()'

    if (node.arguments.length > 0) {
      stringToPut = 'selfdestruct(' + node.arguments[0].name + ')'
    }

    return (fixer) => fixer.replaceTextRange(node.range, stringToPut)
  }
}

module.exports = AvoidSuicideChecker
