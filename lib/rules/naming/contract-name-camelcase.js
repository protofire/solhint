const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

class ContractNameCamelcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'contract-name-camelcase')
  }

  enterContractDefinition(ctx) {
    this.validateContractName(ctx)
  }

  enterStructDefinition(ctx) {
    this.validateContractName(ctx)
  }

  enterEnumDefinition(ctx) {
    this.validateContractName(ctx)
  }

  validateContractName(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (naming.isNotCamelCase(text)) {
      this._error(identifier)
    }
  }

  _error(ctx) {
    this.error(ctx, 'Contract name must be in CamelCase')
  }
}

module.exports = ContractNameCamelcaseChecker
