const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')
const naming = require('../../common/identifier-naming')

const ruleId = 'var-name-mixedcase'

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_PREFIX = 'IMM_'
const DEFAULT_OPTION = { prefixForImmutables: DEFAULT_PREFIX }
const ERR_DESCRIPTION =
  'Variable names must be in mixedCase. Skips immutables with defined prefix to allow ALL CAPS naming.'

const meta = {
  type: 'naming',

  docs: {
    description: `Variable names must be in mixedCase. (Does not check IMMUTABLES nor CONSTANTS (use inherent rules for that)`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description:
          'A JSON object with a single property "prefixForImmutables" specifying the prefix to put to consider a variable as kind of immutable to allow it to be in all CAPS.',
        default: JSON.stringify(DEFAULT_OPTION),
      },
    ],
    examples: {
      good: [
        {
          description:
            'If config is { prefixForImmutables: "RST_" } and variable is prefixed with that prefix',
          code: 'string public RST_VARIABLE_NAME',
        },
        {
          description: 'If no config is provided and variable is prefixed with default',
          code: 'string public IMM_VARIABLE_NAME',
        },
      ],
      bad: [
        {
          description: 'If no config is selected and "error" is defined in rule',
          code: 'string public VARIABLE_NAME',
        },
        {
          description: 'If config is { prefixForImmutables: "RST_" } and variable is not prefixed',
          code: 'string public VARIABLE_NAME',
        },
        {
          description:
            'If config is { prefixForImmutables: "RST_" } and variable is prefixed with another prefix',
          code: 'string public IMM_VARIABLE_NAME',
        },
      ],
    },
  },

  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_OPTION],

  schema: {
    type: 'object',
    required: ['prefixForImmutables'],
    properties: {
      prefixForImmutables: {
        type: 'string',
        description: ERR_DESCRIPTION + ' And should be a string.',
      },
    },
  },

  notes: [
    {
      note: 'This rule can be configure to set variables as if where immutables using all CAPS by adding a prefix.',
    },
    {
      note: 'The default prefix is `IMM_`.',
    },
  ],
}

class VarNameMixedcaseChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.prefixForImmutables =
      config && config.getObjectPropertyString(ruleId, 'prefixForImmutables', DEFAULT_PREFIX)
  }

  VariableDeclaration(node) {
    if (!node.isDeclaredConst && !node.isImmutable && !this.isImmutablePrefix(node.name)) {
      this.validateVariablesName(node)
    }
  }

  isImmutablePrefix(name) {
    if (name.startsWith(this.prefixForImmutables)) return true
    return false
  }

  validateVariablesName(node) {
    if (naming.isNotMixedCase(node.name)) {
      this.error(node, `Variable name must be in mixedCase ${node.name}`)
    }
  }
}

module.exports = VarNameMixedcaseChecker
