const BaseChecker = require('./../base-checker')
const { isFallbackFunction } = require('../../common/ast-types')

const ruleId = 'ordering'
const meta = {
  type: 'order',

  docs: {
    description: `Check order of elements in file and inside each contract, according to the style guide`,
    category: 'Style Guide Rules',
    examples: {
      good: require('../../../test/fixtures/order/ordering-correct'),
      bad: require('../../../test/fixtures/order/ordering-incorrect')
    }
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null
}

class OrderingChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  SourceUnit(node) {
    const children = node.children

    this.checkOrder(children, sourceUnitPartOrder)
  }

  ContractDefinition(node) {
    const children = node.subNodes

    this.checkOrder(children, contractPartOrder)
  }

  checkOrder(children, orderFunction) {
    if (children.length === 0) {
      return
    }

    let maxChild = children[0]
    let [maxComparisonValue, maxLabel] = orderFunction(children[0])

    for (let i = 1; i < children.length; i++) {
      const [comparisonValue, label] = orderFunction(children[i])
      if (comparisonValue < maxComparisonValue) {
        this.report(children[i], maxChild, label, maxLabel)
        return
      }

      maxChild = children[i]
      maxComparisonValue = comparisonValue
      maxLabel = label
    }
  }

  report(node, nodeBefore, label, labelBefore) {
    const message = `Function order is incorrect, ${label} can not go after ${labelBefore} (line ${
      nodeBefore.loc.start.line
    })`
    this.reporter.error(node, this.ruleId, message)
  }
}

function isConst(node) {
  return ['pure', 'view', 'constant'].includes(node.stateMutability)
}

function isTypeDeclaration(node) {
  return ['StructDefinition', 'EnumDefinition'].includes(node.type)
}

function sourceUnitPartOrder(node) {
  if (node.type === 'PragmaDirective') {
    return [0, 'pragma directive']
  }

  if (node.type === 'ImportDirective') {
    return [10, 'import directive']
  }

  if (node.type === 'EnumDefinition' || node.type === 'StructDefinition') {
    return [20, 'type definition']
  }

  if (node.type === 'ContractDefinition') {
    if (node.kind === 'interface') {
      return [30, 'interface']
    }

    if (node.kind === 'library') {
      return [40, 'library definition']
    }

    if (node.kind === 'contract') {
      return [50, 'contract definition']
    }
  }

  throw new Error('Unrecognized source unit part, please report this issue')
}

function contractPartOrder(node) {
  if (isTypeDeclaration(node)) {
    let label
    if (node.type === 'StructDefinition') {
      label = 'struct definition'
    } else {
      label = 'enum definition'
    }
    return [0, label]
  }

  if (node.type === 'StateVariableDeclaration') {
    return [10, 'state variable declaration']
  }

  if (node.type === 'EventDefinition') {
    return [20, 'event definition']
  }

  if (node.isConstructor) {
    return [30, 'constructor']
  }

  if (isFallbackFunction(node)) {
    return [40, 'fallback function']
  }

  if (node.type === 'FunctionDefinition') {
    if (node.visibility === 'external' && !isConst(node)) {
      return [50, 'external function']
    }
    if (node.visibility === 'external' && isConst(node)) {
      return [60, 'external const function']
    }
    if (node.visibility === 'public' && !isConst(node)) {
      return [70, 'public function']
    }
    if (node.visibility === 'public' && isConst(node)) {
      return [80, 'public const function']
    }
    if (node.visibility === 'internal') {
      return [90, 'internal function']
    }
    if (node.visibility === 'private') {
      return [100, 'private function']
    }
    throw new Error('Unknown order for function, please report this issue')
  }

  throw new Error('Unrecognized contract part, please report this issue')
}

module.exports = OrderingChecker
