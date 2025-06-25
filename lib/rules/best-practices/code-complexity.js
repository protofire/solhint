const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const ruleId = 'code-complexity'

const DEFAULT_SEVERITY = 'warn'
const DEFAULT_COMPLEXITY = 7
const ERR_DESCRIPTION = 'Function cyclomatic complexity reached.'

const meta = {
  type: 'best-practices',

  docs: {
    description:
      'Function has cyclomatic complexity "current" but allowed no more than configured max complexity.',
    category: 'Best Practices Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: ERR_DESCRIPTION,
        default: DEFAULT_COMPLEXITY,
      },
    ],
    examples: {
      good: [
        {
          description: 'Low code complexity',
          code: require('../../../test/fixtures/best-practices/code-complexity-low'),
        },
      ],
      bad: [
        {
          description: 'High code complexity',
          code: require('../../../test/fixtures/best-practices/code-complexity-high'),
        },
      ],
    },
  },

  recommended: false,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_COMPLEXITY],

  schema: {
    type: 'integer',
    description: ERR_DESCRIPTION + ' And should be an Integer',
    minimum: 1,
  },
}

class CodeComplexityChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.maxComplexity = (config && config.getNumber('code-complexity', 7)) || 7
  }

  FunctionDefinition(node) {
    this._attachComplexityScope(node)
  }

  ModifierDefinition(node) {
    this._attachComplexityScope(node)
  }

  IfStatement(node) {
    this._complexityPlusOne(node)
  }

  WhileStatement(node) {
    this._complexityPlusOne(node)
  }

  DoWhileStatement(node) {
    this._complexityPlusOne(node)
  }

  ForStatement(node) {
    this._complexityPlusOne(node)
  }

  'FunctionDefinition:exit'(node) {
    this._verifyComplexityScope(node)
  }

  'ModifierDefinition:exit'(node) {
    this._verifyComplexityScope(node)
  }

  _attachComplexityScope(node) {
    ComplexityScope.activate(node)
  }

  _complexityPlusOne(node) {
    const scope = ComplexityScope.of(node)
    if (scope) {
      scope.complexityPlusOne()
    }
  }

  _verifyComplexityScope(node) {
    const scope = ComplexityScope.of(node)

    if (scope && scope.complexity > this.maxComplexity) {
      this._error(node, scope)
    }
  }

  _error(node, scope) {
    const curComplexity = scope.complexity
    const maxComplexity = this.maxComplexity

    const message = `Function has cyclomatic complexity ${curComplexity} but allowed no more than ${maxComplexity}`
    this.error(node, message)
  }
}

class ComplexityScope {
  static of(node) {
    let curNode = node

    while (curNode && !curNode.complexityScope) {
      curNode = curNode.parent
    }

    return curNode && curNode.complexityScope
  }

  static activate(node) {
    node.complexityScope = new ComplexityScope()
  }

  constructor() {
    this.complexity = 1
  }

  complexityPlusOne() {
    this.complexity += 1
  }
}

module.exports = CodeComplexityChecker
