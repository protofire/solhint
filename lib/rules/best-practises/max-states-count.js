const _ = require('lodash')
const BaseChecker = require('./../base-checker')
const { typeOf } = require('./../../common/tree-traversing')

class MaxStatesCountChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, 'max-states-count')

    this.maxStatesCount = config.getNumber('max-states-count', 15)
  }

  enterContractDefinition(ctx) {
    const countOfVars = new Contract(ctx)
      .variableDeclarations()
      .filter(curVar => curVar.isNotConstant()).length

    if (countOfVars > this.maxStatesCount) {
      this._error(ctx, countOfVars)
    }
  }

  _error(ctx, countOfVars) {
    const curStatesCount = countOfVars
    const maxStatesCount = this.maxStatesCount

    const message = `Contract has ${curStatesCount} states declarations but allowed no more than ${maxStatesCount}`
    this.error(ctx, message)
  }
}

class Contract {
  constructor(ctx) {
    this.ctx = ctx
  }

  variableDeclarations() {
    return this._children()
      .map(i => new ContractPart(i))
      .filter(curPart => curPart.isVarDefinition())
      .map(curPart => curPart.varDefinition())
  }

  _children() {
    return this.ctx.children
  }
}

class ContractPart {
  constructor(ctx) {
    this.ctx = ctx
  }

  isVarDefinition() {
    const firstChild = this._firstChild()
    return typeOf(firstChild) === 'stateVariableDeclaration'
  }

  varDefinition() {
    return new VarDefinition(this._firstChild())
  }

  _firstChild() {
    return _.first(this.ctx.children)
  }
}

class VarDefinition {
  constructor(ctx) {
    this.ctx = ctx
  }

  isNotConstant() {
    return !this.ctx.getText().includes('constant')
  }
}

module.exports = MaxStatesCountChecker
