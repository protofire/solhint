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
    let funcCall = traversing.findParentType(node, 'FunctionCall')
    if (!funcCall) return

    // Handle legacy addr.call.value(1)() / addr.call.gas(g)() pattern:
    // the first FunctionCall found is the modifier (.value/.gas), not the actual invocation.
    // Distinguish from require(addr.call()): in the chained case, funcCall IS the
    // .expression of its parent FunctionCall; in the argument case it is not.
    if (
      funcCall.parent &&
      funcCall.parent.type === 'FunctionCall' &&
      funcCall.parent.expression === funcCall
    ) {
      funcCall = funcCall.parent
    }

    // If the FunctionCall is directly the expression of an ExpressionStatement,
    // the return value is discarded. Any other parent (require, assert, if, assignment)
    // means the result is being used.
    if (funcCall.parent && funcCall.parent.type === 'ExpressionStatement') {
      this.warn(node, 'Return value of low-level call is not checked.')
    }
  }
}

module.exports = NoUncheckedCallsChecker
