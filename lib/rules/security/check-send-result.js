const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')

const traversing = new TreeTraversing()

const ruleId = 'check-send-result'
const meta = {
  type: 'security',

  docs: {
    description: `Check result of "send" call.`,
    category: 'Security Rules',
    examples: {
      good: [
        {
          description: 'result of "send" call checked with if statement',
          code: require('../../../test/fixtures/security/send-result-checked')
        }
      ],
      bad: [
        {
          description: 'result of "send" call ignored',
          code: require('../../../test/fixtures/security/send-result-ignored')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null
}

class CheckSendResultChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  MemberAccess(node) {
    this.validateSend(node)
  }

  validateSend(node) {
    if (node.memberName === 'send') {
      const hasVarDeclaration = traversing.statementNotContains(node, 'VariableDeclaration')
      const hasIfStatement = traversing.statementNotContains(node, 'IfStatement')
      const hasRequire = traversing.someParent(node, this.isRequire)
      const hasAssert = traversing.someParent(node, this.isAssert)

      if (!hasIfStatement && !hasVarDeclaration && !hasRequire && !hasAssert) {
        this.error(node, 'Check result of "send" call')
      }
    }
  }

  isRequire(node) {
    return node.type === 'FunctionCall' && node.expression.name === 'require'
  }

  isAssert(node) {
    return node.type === 'FunctionCall' && node.expression.name === 'assert'
  }
}

module.exports = CheckSendResultChecker
