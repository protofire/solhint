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
      {
        note: 'Return must be elementary, enum, UDVT, or contract/interface.',
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

    // check return values
    const isReturnValid = this.hasSingleAllowedReturn(returns)

    if (inInterface && noParams && isView && isSnake && isReturnValid) {
      return // allowed
    }

    if (naming.isNotMixedCase(node.name)) {
      this.error(node, 'Function name must be in mixedCase')
    }
  }

  hasSingleAllowedReturn(returns) {
    // more than 1 element, not allowed
    if (returns.length !== 1) return false
    const ret = returns[0]
    const tn = ret?.typeName

    // check return element and type
    if (!tn || !tn.type) return false

    // exclude arrays and tuples
    if (tn.type === 'ArrayTypeName' || tn.type === 'TupleTypeName') return false

    // elementary: bool, address, int/uint*, bytes*, string...
    if (tn.type === 'ElementaryTypeName') return true

    // check if it's a user-defined type without storage location (contract/interface, enum, UDVT)
    if (tn.type === 'UserDefinedTypeName') {
      const hasStorage = !!ret.storageLocation // 'memory' | 'calldata' | undefined
      return !hasStorage
    }

    // optional: some older parsers separate address/bytes
    if (tn.type === 'AddressTypeName' || tn.type === 'BytesTypeName') return true

    return false
  }
}

module.exports = FuncNameMixedcaseChecker
