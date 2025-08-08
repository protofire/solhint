const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')

const ruleId = 'func-name-mixedcase'
const meta = {
  type: 'naming',

  docs: {
    description: 'Function name must be in mixedCase.',
    category: 'Style Guide Rules',
    notes: [
      {
        note: 'SNAKE_CASE allowed only in interfaces when matching constant/immutable getter signatures.',
      },
    ],
  },

  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

class FuncNameMixedcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
    this._ifaceDepth = 0
  }

  ContractDefinition(node) {
    if (node.kind === 'interface') this._ifaceDepth++
  }

  'ContractDefinition:exit'(node) {
    if (node.kind === 'interface') this._ifaceDepth--
  }

  FunctionDefinition(node) {
    if (node.isConstructor) return

    // Strict exception: only getters of constant/immutable in interfaces
    const inInterface = this._ifaceDepth > 0
    const noParams = (node.parameters?.length || 0) === 0
    const isView = node.stateMutability === 'view'
    const isSnake = naming.isUpperSnakeCase(node.name)

    const returns = node.returnParameters || []
    const singleElementaryReturn =
      returns.length === 1 && returns[0]?.typeName?.type === 'ElementaryTypeName'

    if (inInterface && noParams && isView && isSnake && singleElementaryReturn) {
      return // allowed
    }

    if (naming.isNotMixedCase(node.name)) {
      this.error(node, 'Function name must be in mixedCase')
    }
  }
}

module.exports = FuncNameMixedcaseChecker
