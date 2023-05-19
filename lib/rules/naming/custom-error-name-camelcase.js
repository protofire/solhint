const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')

const ruleId = 'error-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Custom Error name must be in CamelCase.',
    category: 'Style Guide Rules',
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class ErrorNameMixedcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  CustomErrorDefinition(node) {
    if (naming.isNotCamelCase(node.name)) {
      this.error(node, `Custom error "${node.name}" must be in CamelCase`)
    }
  }
}

module.exports = ErrorNameMixedcaseChecker
