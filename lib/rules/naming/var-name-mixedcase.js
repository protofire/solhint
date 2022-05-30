const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')

const ruleId = 'var-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: `Variable name must be in mixedCase.`,
    category: 'Style Guide Rules',
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

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
      this.error(node, 'Variable name must be in mixedCase')
    }
  }
}

module.exports = VarNameMixedcaseChecker
