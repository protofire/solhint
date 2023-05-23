const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_ALLOW_PREFIX = false
const DEFAULT_OPTION = { allowPrefix: DEFAULT_ALLOW_PREFIX }

const ruleId = 'custom-error-name-camelcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Custom Error name must be in CamelCase.',
    category: 'Style Guide Rules',
  },

  options: [
    {
      description: severityDescription,
      default: DEFAULT_SEVERITY,
    },
    {
      description:
        'A JSON object with a single property "allowPrefix" specifying if the rule should allow `PREFIX__` for errors',
      default: JSON.stringify(DEFAULT_OPTION),
    },
  ],

  isDefault: false,
  recommended: false,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_OPTION],

  schema: {
    type: 'object',
    properties: {
      allowPrefix: {
        type: 'boolean',
      },
    },
  },
}

class ErrorNameCamelcaseChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)
    this.allowPrefix = config && config.getObjectPropertyBoolean(ruleId, 'allowPrefix', false)
  }

  CustomErrorDefinition(node) {
    if (naming.isNotCamelCase(node.name)) {
      let isValid = false

      if (this.allowPrefix && node.name.includes('__')) {
        const parts = node.name.split('__')

        if (parts.length === 2) {
          isValid = true

          if (naming.isNotCamelCase(parts[0])) {
            isValid = false
            this.error(node, `Custom error prefix "${node.name}" must be in CamelCase`)
          }
          if (naming.isNotCamelCase(parts[1])) {
            isValid = false
            this.error(node, `Custom error remainder "${node.name}" must be in CamelCase`)
          }
        }
      }
      if (!isValid) this.error(node, `Custom error "${node.name}" must be in CamelCase`)
    }
  }
}

module.exports = ErrorNameCamelcaseChecker
