const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')
const naming = require('./../../common/identifier-naming')

const traversing = new TreeTraversing()

class VarNameStyleChecker extends BaseChecker {
  exitIdentifierList(ctx) {
    this.validateVariablesName(ctx)
  }

  exitVariableDeclaration(ctx) {
    this.validateVariablesName(ctx)
  }

  exitStateVariableDeclaration(ctx) {
    const hasConstModifier = ctx.children.some(i => i.getText() === 'constant')

    if (hasConstModifier) {
      this.validateConstantName(ctx)
    } else {
      this.validateVariablesName(ctx)
    }
  }

  validateVariablesName(ctx) {
    this._forEachIdentifier(ctx, (curId, text) => {
      if (naming.isNotMixedCase(text)) {
        this.error(curId, 'var-name-mixedcase', 'Variable name must be in mixedCase')
      }
    })
  }

  validateConstantName(ctx) {
    this._forEachIdentifier(ctx, (curId, text) => {
      if (naming.isNotUpperSnakeCase(text)) {
        this.error(curId, 'const-name-snakecase', 'Constant name must be in capitalized SNAKE_CASE')
      }
    })
  }

  _forEachIdentifier(ctx, callback) {
    for (const curId of traversing.findIdentifier(ctx)) {
      const text = curId.getText()

      if (callback) {
        callback(curId, text)
      }
    }
  }
}

module.exports = VarNameStyleChecker
