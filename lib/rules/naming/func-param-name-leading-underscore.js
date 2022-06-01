const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')

const ruleId = 'func-param-name-leading-underscore'
const meta = {
  type: 'naming',

  docs: {
    description: 'Function param name must start a single underscore',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null
}

class FunctionParamNameLeadingUnderscoreChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  EventDefinition(node) {
    this.FunctionDefinition(node)
  }

  FunctionDefinition(node) {
    node.parameters.forEach(parameter => {
      if (node.name === null) {
        return
      }
      if (!naming.hasLeadingUnderscore(parameter.name)) {
        this.error(parameter, `Function param "${parameter.name}" should start with _`)
      }
    })
  }
}

module.exports = FunctionParamNameLeadingUnderscoreChecker
