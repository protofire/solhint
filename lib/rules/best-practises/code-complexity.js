const BaseChecker = require('./../base-checker')

const ruleId = 'code-complexity'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Function has cyclomatic complexity "current" but allowed no more than maxcompl.',
    category: 'Best Practise Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: ['warn', 7],

  schema: [
    {
      type: 'array',
      items: [{ type: 'integer' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class CodeComplexityChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.maxComplexity = (config && config.getNumber('code-complexity', 7)) || 7
  }

  enterFunctionDefinition(ctx) {
    this._attachComplexityScope(ctx)
  }

  enterModifierDefinition(ctx) {
    this._attachComplexityScope(ctx)
  }

  enterIfStatement(ctx) {
    this._complexityPlusOne(ctx)
  }

  enterWhileStatement(ctx) {
    this._complexityPlusOne(ctx)
  }

  enterDoWhileStatement(ctx) {
    this._complexityPlusOne(ctx)
  }

  enterForStatement(ctx) {
    this._complexityPlusOne(ctx)
  }

  exitFunctionDefinition(ctx) {
    this._verifyComplexityScope(ctx)
  }

  exitModifierDefinition(ctx) {
    this._verifyComplexityScope(ctx)
  }

  _attachComplexityScope(ctx) {
    ComplexityScope.activate(ctx)
  }

  _complexityPlusOne(ctx) {
    const scope = ComplexityScope.of(ctx)
    if (scope) {
      scope.complexityPlusOne()
    }
  }

  _verifyComplexityScope(ctx) {
    const scope = ComplexityScope.of(ctx)

    if (scope && scope.complexity > this.maxComplexity) {
      this._error(ctx, scope)
    }
  }

  _error(ctx, scope) {
    const curComplexity = scope.complexity
    const maxComplexity = this.maxComplexity

    const message = `Function has cyclomatic complexity ${curComplexity} but allowed no more than ${maxComplexity}`
    this.error(ctx, message)
  }
}

class ComplexityScope {
  static of(ctx) {
    let curCtx = ctx

    while (curCtx && !curCtx.complexityScope) {
      curCtx = curCtx.parentCtx
    }

    return curCtx && curCtx.complexityScope
  }

  static activate(ctx) {
    ctx.complexityScope = new ComplexityScope()
  }

  constructor() {
    this.complexity = 1
  }

  complexityPlusOne() {
    this.complexity += 1
  }
}

module.exports = CodeComplexityChecker
