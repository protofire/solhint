const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'private-vars-no-leading-underscore'
const meta = {
  type: 'naming',

  docs: {
    description: 'Private and internal variable names must NOT start with a single underscore.',
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: [DEFAULT_SEVERITY],

  schema: null,
}

class PrivateVarsNoLeadingUnderscoreChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  StateVariableDeclaration() {
    this.inStateVariableDeclaration = true
  }

  'StateVariableDeclaration:exit'() {
    this.inStateVariableDeclaration = false
  }

  VariableDeclaration(node) {
    if (!this.inStateVariableDeclaration) {
      return
    }

    this.validateName(node, false)
  }

  validateName(node, shouldHaveLeadingUnderscore) {
    if (node.name === null) {
      return
    }

    if (naming.hasLeadingUnderscore(node.name) !== shouldHaveLeadingUnderscore) {
      this._error(node, node.name, shouldHaveLeadingUnderscore)
    }
  }

  _error(node, name, shouldHaveLeadingUnderscore) {
    this.error(
      node,
      `Variable "${name}" ${shouldHaveLeadingUnderscore ? 'should' : 'should not'} start with _`
    )
  }
}

module.exports = PrivateVarsNoLeadingUnderscoreChecker
