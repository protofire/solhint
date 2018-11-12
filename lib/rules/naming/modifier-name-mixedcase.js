const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

class ModifierNameMixedcase extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'modifier-name-mixedcase')
  }

  exitModifierDefinition(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (naming.isNotMixedCase(text)) {
      this.error(ctx, 'Modifier name must be in mixedCase')
    }
  }
}

module.exports = ModifierNameMixedcase
