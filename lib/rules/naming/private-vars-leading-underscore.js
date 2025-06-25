const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')
const { severityDescription } = require('../../doc/utils')

const ruleId = 'private-vars-leading-underscore'

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_STRICTNESS = false
const DEFAULT_OPTION = { strict: DEFAULT_STRICTNESS }
const ERR_DESCRIPTION =
  'When true, non-external functions and state variables should start with a single underscore.'

const meta = {
  type: 'naming',

  docs: {
    description:
      "Non-external functions and state variables should start with a single underscore. Others, shouldn't",
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description:
          'A JSON object with a single property "strict" specifying if the rule should apply to ALL non state variables. Default: { strict: false }.',
        default: JSON.stringify(DEFAULT_OPTION),
      },
    ],
    examples: {
      good: [
        {
          description: 'Internal function with correct naming',
          code: 'function _thisIsInternal() internal {}',
        },
        {
          description: 'Private function with correct naming',
          code: 'function _thisIsPrivate() private {}',
        },
        {
          description: 'Internal state variable with correct naming',
          code: 'uint256 internal _thisIsInternalVariable;',
        },
        {
          description:
            'Internal state variable with correct naming (no visibility is considered internal)',
          code: 'uint256 _thisIsInternalVariable;',
        },
      ],
      bad: [
        {
          description: 'Internal function with incorrect naming',
          code: 'function thisIsInternal() internal {}',
        },
        {
          description: 'Private function with incorrect naming',
          code: 'function thisIsPrivate() private {}',
        },
        {
          description: 'Internal state variable with incorrect naming',
          code: 'uint256 internal thisIsInternalVariable;',
        },
        {
          description:
            'Internal state variable with incorrect naming (no visibility is considered internal)',
          code: 'uint256 thisIsInternalVariable;',
        },
      ],
    },
    notes: [
      {
        note: 'This rule DO NOT considers functions and variables in Libraries',
      },
      {
        note: 'This rule skips external and public functions',
      },
      {
        note: 'This rule skips external and public state variables',
      },
      {
        note: 'See [here](https://docs.soliditylang.org/en/latest/style-guide.html#underscore-prefix-for-non-external-functions-and-variables) for further information',
      },
      {
        note: 'Solhint allows this rule to automatically fix the code with `--fix` option',
      },
    ],
  },

  recommended: false,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_OPTION],
  fixable: true,

  schema: {
    type: 'object',
    required: ['strict'],
    properties: {
      strict: {
        type: 'boolean',
        description: ERR_DESCRIPTION + ' And should be a boolean.',
      },
    },
  },
}

class PrivateVarsLeadingUnderscoreChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.isStrict = config && config.getObjectPropertyBoolean(ruleId, 'strict', DEFAULT_STRICTNESS)
  }

  ContractDefinition(node) {
    if (node.kind === 'library') {
      this.inLibrary = true
    }
  }

  'ContractDefinition:exit'() {
    this.inLibrary = false
  }

  FunctionDefinition(node) {
    if (!this.inLibrary) {
      if (!node.name) {
        return
      }

      const isPrivate = node.visibility === 'private'
      const isInternal = node.visibility === 'internal' || node.visibility === 'default'
      const shouldHaveLeadingUnderscore = isPrivate || isInternal
      this.validateName(node, shouldHaveLeadingUnderscore, 'function')
    }
  }

  StateVariableDeclaration() {
    this.inStateVariableDeclaration = true
  }

  'StateVariableDeclaration:exit'() {
    this.inStateVariableDeclaration = false
  }

  VariableDeclaration(node) {
    if (!this.inLibrary) {
      if (!this.inStateVariableDeclaration) {
        // if strict is enabled, non-state vars should not start with leading underscore
        if (this.isStrict) {
          this.validateName(node, false, 'variable')
        }
        return
      }

      const isPrivate = node.visibility === 'private'
      const isInternal = node.visibility === 'internal' || node.visibility === 'default'
      const shouldHaveLeadingUnderscore = isPrivate || isInternal
      this.validateName(node, shouldHaveLeadingUnderscore, 'variable')
    }
  }

  validateName(node, shouldHaveLeadingUnderscore, type) {
    if (node.name === null) {
      return
    }

    if (naming.hasLeadingUnderscore(node.name) !== shouldHaveLeadingUnderscore) {
      this._error(node, node.name, shouldHaveLeadingUnderscore, type)
    }
  }

  _error(node, name, shouldHaveLeadingUnderscore, type) {
    this.error(
      node,
      `'${name}' ${shouldHaveLeadingUnderscore ? 'should' : 'should not'} start with _`,
      this.fixStatement(node, shouldHaveLeadingUnderscore, type)
    )
  }

  fixStatement(node, shouldHaveLeadingUnderscore, type) {
    let range

    if (type === 'function') {
      range = node.range
      range[0] += 8
    } else {
      range = node.identifier.range
      range[0] -= 1
    }

    return (fixer) =>
      shouldHaveLeadingUnderscore
        ? fixer.insertTextBeforeRange(range, ' _')
        : fixer.removeRange([range[0] + 1, range[0] + 1])
  }
}

module.exports = PrivateVarsLeadingUnderscoreChecker
