const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

const ruleId = 'private-vars-leading-underscore'
const meta = {
  type: 'naming',

  docs: {
    description: 'Private and internal names must start with a single underscore.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null
}

class PrivateVarsLeadingUnderscoreChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
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
    if (!node.name) {
      return
    }

    const isPrivate = node.visibility === 'private'
    const isInternal = node.visibility === 'internal'
    const shouldHaveLeadingUnderscore = isPrivate || (!this.inLibrary && isInternal)
    this.validateName(node, shouldHaveLeadingUnderscore)
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

    const isPrivate = node.visibility === 'private'
    const isInternal = node.visibility === 'internal' || node.visibility === 'default'
    const shouldHaveLeadingUnderscore = isPrivate || isInternal
    this.validateName(node, shouldHaveLeadingUnderscore)
  }

  validateName(node, shouldHaveLeadingUnderscore) {
    if (naming.hasLeadingUnderscore(node.name) !== shouldHaveLeadingUnderscore) {
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

module.exports = PrivateVarsLeadingUnderscoreChecker
