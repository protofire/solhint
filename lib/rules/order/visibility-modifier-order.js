const BaseChecker = require('./../base-checker')

const ruleId = 'visibility-modifier-order'
const meta = {
  type: 'order',

  docs: {
    description: `Visibility modifier must be first in list of modifiers.`,
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Visibility modifier placed first',
          code: require('../../../test/fixtures/order/visibility-modifier-first')
        }
      ],
      bad: [
        {
          description: 'Visibility modifier not placed first',
          code: require('../../../test/fixtures/order/visibility-modifier-not-first')
        }
      ]
    }
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null
}

class VisibilityModifierOrderChecker extends BaseChecker {
  constructor(reporter, tokens) {
    super(reporter, ruleId, meta)
    this.tokens = tokens
  }

  FunctionDefinition(node) {
    if (node.visibility !== 'default' && (node.stateMutability || node.modifiers.length)) {
      const functionTokens = []
      const nodeStart = node.loc.start.line
      const nodeEnd = node.loc.end.line

      for (let i = 0, n = this.tokens.length; i < n; ++i) {
        const token = this.tokens[i]

        if (functionTokens.length && token.value === '{') break

        const {
          type,
          loc: { start }
        } = token

        if (
          nodeStart <= start.line &&
          start.line <= nodeEnd &&
          ['Keyword', 'Identifier'].includes(type)
        ) {
          functionTokens.push(token)
        }
      }
      const visibilityIndex = functionTokens.findIndex(t => t.value === node.visibility)
      const stateMutabilityIndex = functionTokens.findIndex(t => t.value === node.stateMutability)
      const modifierIndex = functionTokens.findIndex(t => t.value === node.modifiers[0].name)

      if (
        (stateMutabilityIndex > -1 && visibilityIndex > stateMutabilityIndex) ||
        (modifierIndex > -1 && visibilityIndex > modifierIndex)
      ) {
        this._error(functionTokens[visibilityIndex])
      }
    }
  }

  _error(node) {
    const message = 'Visibility modifier must be first in list of modifiers'
    this.error(node, message)
  }
}

module.exports = VisibilityModifierOrderChecker
