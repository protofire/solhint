const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_TREAT_IMMUTABLE_VAR_AS_CONSTANT = false
const DEFAULT_OPTION = { treatImmutableVarAsConstant: DEFAULT_TREAT_IMMUTABLE_VAR_AS_CONSTANT }
const ruleId = 'const-name-snakecase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Constant name must be in capitalized SNAKE_CASE.',
    category: 'Style Guide Rules'
  },
  options: [
    {
      description: severityDescription,
      default: DEFAULT_SEVERITY
    },
    {
      description:
        'A JSON object with a single property "treatImmutableVarAsConstant" specifying if the rule should treat immutables as constants',
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
        type: 'boolean'
      }
    }
  }
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
      this.error(variable, `Constant name "${variable.name}" must be in capitalized SNAKE_CASE`)
    }
  }
}

module.exports = ConstNameSnakecaseChecker
