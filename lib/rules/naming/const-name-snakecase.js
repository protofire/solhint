const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')

const ruleId = 'const-name-snakecase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Constant name must be in capitalized SNAKE_CASE.',
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

class ConstNameSnakecaseChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.treatImmutableVarAsConstant =
      config && config.getObjectPropertyBoolean(ruleId, 'treatImmutableVarAsConstant', false)
  }

  VariableDeclaration(node) {
    if (node.isDeclaredConst || (this.treatImmutableVarAsConstant && node.isImmutable)) {
      this.validateConstantName(node)
    }
  }

  validateConstantName(variable) {
    if (naming.isNotUpperSnakeCase(variable.name)) {
      this.error(variable, `Constant name (${variable.name}) must be in capitalized SNAKE_CASE`)
    }
  }
}

module.exports = ConstNameSnakecaseChecker
