const BaseChecker = require('./../base-checker')
const TreeTraversing = require('./../../common/tree-traversing')
const { isFallbackFunction } = require('../../common/ast-types')

const traversing = new TreeTraversing()

const ruleId = 'func-order'
const meta = {
  type: 'order',

  docs: {
    description: `Function order is incorrect.`,
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description: 'Constructor is placed before other functions',
          code: require('../../../test/fixtures/order/func-order-constructor-first')
        }
      ],
      bad: [
        {
          description: 'Constructor is placed after other functions',
          code: require('../../../test/fixtures/order/func-order-constructor-not-first')
        }
      ]
    }
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null
}

class FuncOrderChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  ContractDefinition(node) {
    this._assignOrderAnalysisTo(node)
  }

  StructDefinition(node) {
    this._assignOrderAnalysisTo(node)
  }

  _assignOrderAnalysisTo(node) {
    const nodeName = node.name
    node.funcOrderAnalysis = new FunctionOrderAnalysis(nodeName, this.reporter, this.ruleId)
  }

  'ConstructorDefinition:exit'(node) {
    const contract = traversing.findParentType(node, 'ContractDefinition')
    contract.funcOrderAnalysis.process(node)
  }

  FunctionDefinition(node) {
    const contract = traversing.findParentType(node, 'ContractDefinition')
    contract.funcOrderAnalysis.process(node)
  }
}

class State {
  constructor(config) {
    this.name = config.name
    this.after = config.after
    this.rules = config.rules
  }

  nextState(name) {
    const items = this.rules.filter(i => i.on === name).map(i => i.goTo)

    return items.length > 0 ? items[0] : null
  }
}

const STATES = {
  START: new State({
    name: 'START',
    after: '',
    rules: [
      { on: 'constructor', goTo: 'AFTER_CONSTR' },
      { on: 'fallback', goTo: 'AFTER_FALLBACK' },
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_CONSTR: new State({
    name: 'AFTER_CONSTR',
    after: 'constructor',
    rules: [
      { on: 'fallback', goTo: 'AFTER_FALLBACK' },
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_FALLBACK: new State({
    name: 'AFTER_CONSTR',
    after: 'fallback',
    rules: [
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_EXTERNAL: new State({
    name: 'AFTER_EXTERNAL',
    after: 'external',
    rules: [
      { on: 'external', goTo: 'AFTER_EXTERNAL' },
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_EXTERNAL_CONSTANT: new State({
    name: 'AFTER_EXTERNAL_CONSTANT',
    after: 'external constant',
    rules: [
      { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_PUBLIC: new State({
    name: 'AFTER_PUBLIC',
    after: 'public',
    rules: [
      { on: 'public', goTo: 'AFTER_PUBLIC' },
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_PUBLIC_CONSTANT: new State({
    name: 'AFTER_PUBLIC_CONSTANT',
    after: 'public constant',
    rules: [
      { on: 'public_const', goTo: 'AFTER_PUBLIC_CONSTANT' },
      { on: 'internal', goTo: 'AFTER_INTERNAL' },
      { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]
  }),

  AFTER_INTERNAL: new State({
    name: 'AFTER_INTERNAL',
    after: 'internal',
    rules: [{ on: 'internal', goTo: 'AFTER_INTERNAL' }, { on: 'private', goTo: 'AFTER_PRIVATE' }]
  }),

  AFTER_PRIVATE: new State({
    name: 'AFTER_PRIVATE',
    after: 'private',
    rules: [{ on: 'private', goTo: 'AFTER_PRIVATE' }]
  })
}

class FunctionOrderAnalysis {
  constructor(contractName, reporter, ruleId) {
    this.curState = STATES.START
    this.reporter = reporter
    this.ruleId = ruleId
    this.funcTypeParser = new FuncTypeParser(contractName)
  }

  process(node) {
    const name = this.funcTypeParser.funcType(node)
    const newState = this.curState.nextState(name)

    if (newState) {
      this.curState = STATES[newState]
    } else {
      const afterState = this.curState.after
      const message = `Function order is incorrect, ${name} function can not go after ${afterState} function.`
      this.reporter.error(node, this.ruleId, message)
    }
  }
}

class FuncTypeParser {
  funcType(node) {
    if (node.isConstructor) {
      return 'constructor'
    } else if (isFallbackFunction(node)) {
      return 'fallback'
    } else {
      return this.funcModifierType(node)
    }
  }

  funcModifierType(node) {
    const modifiers = ['pure', 'view', 'constant']
    const publicVisibility = ['external', 'public']
    const { visibility, stateMutability } = node

    if (publicVisibility.includes(visibility) && modifiers.includes(stateMutability)) {
      return `${visibility}_const`
    }

    return visibility
  }
}

module.exports = FuncOrderChecker
