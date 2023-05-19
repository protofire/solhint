const BaseChecker = require('../base-checker')

const ruleId = 'strict-override'
const meta = {
  type: 'best-practices',

  docs: {
    description: 'Check that all overrides are specific about what they override',
    category: 'Best Practice Rules',
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class StrictOverrideInterface extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  ContractDefinition(node) {
    this.isContract = node.kind === 'contract'
  }

  'ContractDefinition:exit'() {
    this.isContract = false
  }

  FunctionDefinition(node) {
    if (!this.isContract) {
      return
    }

    if (node.override !== null && node.override.length === 0) {
      this.error(node, `Override for "${node.name}" must specify interface or contract overridden`)
    }
  }
}

module.exports = StrictOverrideInterface
