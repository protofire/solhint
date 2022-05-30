const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')
const { severityDescription } = require('../../doc/utils')


const DEFAULT_SEVERITY = 'warn'
const DEFAULT_TREAT_IMMUTABLE_VAR_AS_CONSTANT = false
const DEFAULT_OPTION = { treatImmutableVarAsConstant: DEFAULT_TREAT_IMMUTABLE_VAR_AS_CONSTANT }
const ruleId = 'var-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: `Variable name must be in mixedCase.`,
    category: 'Style Guide Rules',
  },
  options: [
    {
      description: severityDescription,
      default: DEFAULT_SEVERITY
    },
    {
      description: 'A JSON object with a single property "treatImmutableVarAsConstant" specifying if the rule should treat immutables as constants',
      default: JSON.stringify(DEFAULT_OPTION)
    }
  ],

  isDefault: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_OPTION],

  schema: {
    type: 'object',
    properties: {
      treatImmutableVarAsConstant: {
        type: 'boolean',
      },
    },
  },
}

class VarNameMixedcaseChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.treatImmutableVarAsConstant =
      config && config.getObjectPropertyBoolean(ruleId, 'treatImmutableVarAsConstant', false)
  }

  VariableDeclaration(node) {
    if (!node.isDeclaredConst && (!this.treatImmutableVarAsConstant || !node.isImmutable)) {
      this.validateVariablesName(node)
    }
  }

  validateVariablesName(node) {
    if (naming.isNotMixedCase(node.name)) {
      this.error(node, `Variable "${node.name}" must be in mixedCase`)
    }
  }
}

module.exports = VarNameMixedcaseChecker
