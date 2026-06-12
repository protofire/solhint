const BaseChecker = require('../base-checker')
const TreeTraversing = require('../../common/tree-traversing')
const {
  uncheckedCalls: NO_UNCHECKED_CALLS,
} = require('../../fixtureCases/security/low-level-calls')

const traversing = new TreeTraversing()

const WARN_UNCHECKED_CALLS = NO_UNCHECKED_CALLS[0]
const ALLOWED_UNCHECKED_CALLS = NO_UNCHECKED_CALLS[1]

const ruleId = 'no-unchecked-calls'
const meta = {
  type: 'security',

  docs: {
    description: 'Check return value of low-level calls (call, staticcall, delegatecall).',
    category: 'Security Rules',
    examples: {
      good: [
        {
          description: 'Return value of low-level call checked with tuple assignment',
          code: ALLOWED_UNCHECKED_CALLS.join('\n'),
        },
      ],
      bad: [
        {
          description: 'Return value of low-level call ignored',
          code: WARN_UNCHECKED_CALLS.join('\n'),
        },
      ],
    },
    notes: [
      {
        note: 'Unlike avoid-low-level-calls, this rule allows low-level calls but requires their return value to be checked.',
      },
    ],
  },

  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

class NoUncheckedCallsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  MemberAccess(node) {
    if (!['call', 'staticcall', 'delegatecall'].includes(node.memberName)) return

    // Walk up to the nearest FunctionCall (handles both addr.call(data) and addr.call{value}(data))
    const funcCall = this._outerLowLevelCall(node)
    if (!funcCall) return

    // If the final invocation is an ExpressionStatement, possibly wrapped in parentheses,
    // the return value is discarded. Other contexts consume or propagate the result.
    if (this._isDiscarded(funcCall)) {
      this.warn(node, 'Return value of low-level call is not checked.')
    }
  }

  _outerLowLevelCall(node) {
    let funcCall = traversing.findParentType(node, 'FunctionCall')
    if (!funcCall) return null

    // Handle legacy addr.call.value(1)() / addr.call.value(1).gas(g)() patterns:
    // the first FunctionCall found is the modifier (.value/.gas), not the actual invocation.
    while (funcCall.parent) {
      const parent = funcCall.parent

      if (parent.type === 'FunctionCall' && parent.expression === funcCall) {
        funcCall = parent
        continue
      }

      if (
        parent.type === 'MemberAccess' &&
        parent.expression === funcCall &&
        parent.parent &&
        parent.parent.type === 'FunctionCall' &&
        parent.parent.expression === parent
      ) {
        funcCall = parent.parent
        continue
      }

      break
    }

    return funcCall
  }

  _isDiscarded(node) {
    let current = node

    while (current.parent && current.parent.type === 'TupleExpression') {
      current = current.parent
    }

    return current.parent && current.parent.type === 'ExpressionStatement'
  }
}

module.exports = NoUncheckedCallsChecker
