const BaseChecker = require('../base-checker')
const { contractWith } = require('../../../test/common/contract-builder')
const { hasLeadingUnderscore } = require('../../common/identifier-naming')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'non-state-vars-leading-underscore'
const meta = {
  type: 'naming',
  docs: {
    description:
      'Variables that are not in contract state should start with underscore. Conversely, variables that can cause an SLOAD/SSTORE should NOT start with an underscore. This makes it evident which operations cause expensive storage access when hunting for gas optimizations',
    category: 'Best Practice Rules',
    examples: {
      good: [
        {
          description:
            'mutable variable should NOT start with underscore since they DO cause storage read/writes',
          code: contractWith('uint256 public foo;'),
        },
        {
          description:
            'immutable variable should start with underscore since they do not cause storage reads',
          code: contractWith('uint256 immutable public _FOO;'),
        },
        {
          description: 'block variable with leading underscore',
          code: contractWith('function foo() public { uint _myVar; }'),
        },
        {
          description: 'function parameter with leading underscore',
          code: contractWith('function foo( uint256 _foo ) public {}'),
        },
      ],
      bad: [
        {
          description: 'mutable variable starting with underscore',
          code: contractWith('uint256 public _foo;'),
        },
        {
          description: 'block variable without leading underscore',
          code: contractWith('function foo() public { uint myVar; }'),
        },
        {
          description: 'function parameter without leading underscore',
          code: contractWith('function foo( uint256 foo ) public {}'),
        },
      ],
    },
    notes: [
      {
        note: 'event & custom error parameters and struct memer names are ignored since they do not define variables',
      },
      {
        note: 'this rule is contradictory with private-vars-leading-underscore, only one of them should be enabled at the same time.',
      },
    ],
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
  },
  isDefault: false,
  recommended: false,
  schema: null,
  defaultSetup: [DEFAULT_SEVERITY],
}

class NonStateVarsLeadingUnderscoreChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
    this.definingSubName = false
  }

  FileLevelConstant(node) {
    this.validateName(node, true)
  }

  StructDefinition() {
    this.definingSubName = true
  }

  'StructDefinition:exit'() {
    this.definingSubName = false
  }

  EventDefinition() {
    this.definingSubName = true
  }

  'EventDefinition:exit'() {
    this.definingSubName = false
  }

  CustomErrorDefinition() {
    this.definingSubName = true
  }

  'CustomErrorDefinition:exit'() {
    this.definingSubName = false
  }

  VariableDeclaration(node) {
    if (this.definingSubName) return
    if (node.isStateVar) {
      this.validateName(node, node.isDeclaredConst || node.isImmutable)
    } else {
      this.validateName(node, true)
    }
  }

  validateName(node, shouldHaveLeadingUnderscore) {
    if (node.name === null) {
      return
    }

    if (hasLeadingUnderscore(node.name) !== shouldHaveLeadingUnderscore) {
      this._error(node, node.name, shouldHaveLeadingUnderscore)
    }
  }

  _error(node, name, shouldHaveLeadingUnderscore) {
    this.error(
      node,
      `'${name}' ${shouldHaveLeadingUnderscore ? 'should' : 'should not'} start with _`
    )
  }
}
module.exports = NonStateVarsLeadingUnderscoreChecker
