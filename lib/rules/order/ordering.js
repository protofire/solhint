const BaseChecker = require('../base-checker')
const { isFallbackFunction, isReceiveFunction } = require('../../common/ast-types')

const ruleId = 'ordering'
const meta = {
  type: 'order',

  docs: {
    description: `Check order of elements in file and inside each contract, according to the style guide`,
    category: 'Style Guide Rules',
    examples: {
      good: require('../../../test/fixtures/order/ordering-correct'),
      bad: require('../../../test/fixtures/order/ordering-incorrect'),
    },
  },

  recommended: false,
  defaultSetup: 'warn',

  schema: null,
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
    const message = `Function order is incorrect, ${label} can not go after ${labelBefore} (line ${nodeBefore.loc.start.line})`
    this.reporter.error(node, this.ruleId, message)
  }
}

function getMutabilityWeight({ baseWeight, stateMutability }) {
  switch (stateMutability) {
    case 'constant':
    case 'view':
      return baseWeight + 2
    case 'pure':
      return baseWeight + 4
    default:
      return baseWeight
  }
}

function sourceUnitPartOrder(node) {
  if (node.type === 'PragmaDirective') {
    return [0, 'pragma directive']
  }

  if (node.type === 'ImportDirective') {
    return [10, 'import directive']
  }

  if (node.type === 'FileLevelConstant') {
    return [20, 'file level constant']
  }

  if (node.type === 'EnumDefinition') {
    return [30, 'enum definition']
  }

  if (node.type === 'StructDefinition') {
    return [35, 'struct definition']
  }

  if (node.type === 'CustomErrorDefinition') {
    return [40, 'custom error definition']
  }

  if (node.type === 'FunctionDefinition') {
    return [50, 'free function definition']
  }

  if (node.type === 'ContractDefinition') {
    if (node.kind === 'interface') {
      return [60, 'interface']
    }

    if (node.kind === 'library') {
      return [70, 'library definition']
    }

    if (node.kind === 'contract') {
      return [80, 'contract definition']
    }
  }

  throw new Error('Unrecognized source unit part, please report this issue')
}

function contractPartOrder(node) {
  if (node.type === 'UsingForDeclaration') {
    return [0, 'using for declaration']
  }

  if (node.type === 'EnumDefinition') {
    return [10, 'enum definition']
  }

  if (node.type === 'StructDefinition') {
    return [15, 'struct definition']
  }

  if (node.type === 'StateVariableDeclaration') {
    // the grammar: https://docs.soliditylang.org/en/latest/grammar.html
    // forbids declaration of multiple state variables in the same
    // StateVariableDeclaration, however in the AST they show up in an array,
    // similar to regular VariableDeclarationStatements, which allow
    // VariableDefinitionTuples inside them and therefore can declare many
    // variables at once
    if (node.variables.length !== 1) {
      throw new Error(
        'state variable definition with more than one variable. Please report this issue'
      )
    }
    const variable = node.variables[0]
    if (variable.isDeclaredConst) {
      return [20, 'contract constant declaration']
    } else if (variable.isImmutable) {
      return [22, 'contract immutable declaration']
    } else {
      return [25, 'state variable declaration']
    }
  }

  if (node.type === 'EventDefinition') {
    return [30, 'event definition']
  }

  if (node.type === 'CustomErrorDefinition') {
    return [35, 'custom error definition']
  }

  if (node.type === 'ModifierDefinition') {
    return [40, 'modifier definition']
  }

  if (node.isConstructor) {
    return [50, 'constructor']
  }

  if (isReceiveFunction(node)) {
    return [60, 'receive function']
  }

  if (isFallbackFunction(node)) {
    return [70, 'fallback function']
  }

  if (node.type === 'FunctionDefinition') {
    const { stateMutability, visibility } = node

    if (visibility === 'external') {
      const weight = getMutabilityWeight({ baseWeight: 80, stateMutability })
      const label = [visibility, stateMutability, 'function'].join(' ')

      return [weight, label]
    }

    if (visibility === 'public') {
      const weight = getMutabilityWeight({ baseWeight: 90, stateMutability })
      const label = [visibility, stateMutability, 'function'].join(' ')

      return [weight, label]
    }

    if (visibility === 'internal') {
      const weight = getMutabilityWeight({ baseWeight: 100, stateMutability })
      const label = [visibility, stateMutability, 'function'].join(' ')
      return [weight, label]
    }

    if (visibility === 'private') {
      const weight = getMutabilityWeight({ baseWeight: 110, stateMutability })
      const label = [visibility, stateMutability, 'function'].join(' ')
      return [weight, label]
    }

    throw new Error('Unknown order for function, please report this issue')
  }

  throw new Error('Unrecognized contract part, please report this issue')
}

module.exports = OrderingChecker
