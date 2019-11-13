const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

const ruleId = 'const-name-snakecase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Constant name must be in capitalized SNAKE_CASE.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class ConstNameSnakecaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  StateVariableDeclaration(node) {
    // as of time of this writing: despite being an array, `variables` is always returning one single element.
    if (node.variables[0].isDeclaredConst) {
      this.validateConstantName(node.variables[0])
    }
  }

  validateConstantName(variable) {
    if (naming.isNotUpperSnakeCase(variable.name)) {
      this.error(variable, 'Constant name must be in capitalized SNAKE_CASE')
    }
  }
}

module.exports = ConstNameSnakecaseChecker
