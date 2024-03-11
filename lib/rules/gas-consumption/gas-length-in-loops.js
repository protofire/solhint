const BaseChecker = require('../base-checker')

let found
const ruleId = 'gas-length-in-loops'
const meta = {
  type: 'gas-consumption',

  docs: {
    description:
      'Suggest replacing object.length in a loop condition to avoid calculation on each lap',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (see Array Length Caching)',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class GasLengthInLoops extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  checkConditionForMemberAccessLength(node) {
    if (found) return // Return early if the condition has already been found
    if (typeof node === 'object' && node !== null) {
      if (node.type === 'MemberAccess' && node.memberName === 'length') {
        found = true // Update the flag if the condition is met
        return
      }
      // Recursively search through all object properties
      Object.values(node).forEach((value) => this.checkConditionForMemberAccessLength(value))
    }
  }

  DoWhileStatement(node) {
    found = false
    this.checkConditionForMemberAccessLength(node.condition)
    if (found) {
      this.reportError(node)
    }
  }

  WhileStatement(node) {
    found = false
    this.checkConditionForMemberAccessLength(node.condition)
    if (found) {
      this.reportError(node)
    }
  }

  ForStatement(node) {
    found = false
    this.checkConditionForMemberAccessLength(node.conditionExpression)
    if (found) {
      this.reportError(node)
    }
  }

  reportError(node) {
    this.error(
      node,
      `GC: Found [ .length ] property in Loop condition. Suggestion: assign it to a variable`
    )
  }
}

module.exports = GasLengthInLoops
