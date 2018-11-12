const BaseChecker = require('./../base-checker')

class PayableFallbackChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'payable-fallback')
  }

  exitFunctionDefinition(ctx) {
    // 'function' parameterList modifierList returnParameters? ( ';' | block ) ;
    const { modifierList } = this._nodes(ctx)

    if (modifierList && !modifierList.getText().includes('payable')) {
      this.warn(ctx, 'When fallback is not payable you will not be able to receive ethers')
    }
  }

  _nodes(ctx) {
    if (!this._isFallbackFunction(ctx)) {
      return {}
    }

    return {
      modifierList: ctx.children[2]
    }
  }

  _isFallbackFunction(ctx) {
    return (
      ctx.children && ctx.children[1] && ctx.children[1].constructor.name !== 'IdentifierContext'
    )
  }
}

module.exports = PayableFallbackChecker
