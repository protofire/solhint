const _ = require('lodash')
const BaseChecker = require('../base-checker')
const TreeTraversing = require('../../common/tree-traversing')

const traversing = new TreeTraversing()

const ruleId = 'no-unused-vars'
const meta = {
  type: 'best-practices',

  docs: {
    description: 'Variable "name" is unused.',
    category: 'Best Practices Rules',
  },

  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

// helpers of scope
function scopeOf(node) {
  // search for nearest scope as FunctionDefinition o ModifierDefinition
  if (node.type === 'FunctionDefinition' || node.type === 'ModifierDefinition') {
    return node.funcScope
  }
  const fn = findParentType(node, 'FunctionDefinition')
  if (fn && fn.funcScope) return fn.funcScope
  const mod = findParentType(node, 'ModifierDefinition')
  return mod && mod.funcScope
}

function scopeActivate(node) {
  node.funcScope = { vars: {}, _reported: false }
}

function scopeIsActivated(node) {
  return !!node.funcScope
}

function scopeAddVar(scope, node, name) {
  scope.vars[name] = { node, usage: 0 }
}

function scopeTrackVarUsage(scope, name) {
  const v = scope.vars[name]
  if (v) v.usage += 1
}

function scopeUnusedVariables(scope) {
  return _(scope.vars)
    .pickBy((val) => val.usage === 0)
    .map((info, varName) => ({ name: varName, node: info.node }))
    .value()
}
/** --------------------------------------------------------------------- */

class NoUnusedVarsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  /** ===== Functions ===== */
  FunctionDefinition(node) {
    const funcWithoutBlock = isFuncWithoutBlock(node)
    const emptyBlock = isEmptyBlock(node)

    if (!ignoreWhen(funcWithoutBlock, emptyBlock)) {
      scopeActivate(node)
      // filters 'payable' miss parsed as name in: function f(address payable) {}
      node.parameters
        .filter((parameter) => {
          if (
            parameter.typeName.name === 'address' &&
            parameter.typeName.stateMutability === null &&
            parameter.name === 'payable'
          ) {
            return null
          }
          return parameter.name
        })
        .forEach((parameter) => {
          this._addVariable(parameter)
        })
    }
  }

  'FunctionDefinition:exit'(node) {
    if (scopeIsActivated(node)) {
      this._reportErrorsFor(node)
    }
  }

  /** ===== Modifiers ===== */
  ModifierDefinition(node) {
    const modWithoutBlock = node.body === null
    const emptyBlock = isEmptyBlock(node)

    if (!ignoreWhen(modWithoutBlock, emptyBlock)) {
      scopeActivate(node)
      // Supports modifier parameters: modifier onlyOwner(uint256 _unused) { ... }
      // Filters out unused parameters
      if (Array.isArray(node.parameters)) {
        node.parameters
          .filter((parameter) => {
            if (
              parameter.typeName &&
              parameter.typeName.name === 'address' &&
              parameter.typeName.stateMutability === null &&
              parameter.name === 'payable'
            ) {
              return null
            }
            return parameter.name
          })
          .forEach((parameter) => {
            this._addVariable(parameter)
          })
      }
    }
  }

  'ModifierDefinition:exit'(node) {
    if (scopeIsActivated(node)) {
      this._reportErrorsFor(node)
    }
  }

  /** ===== Locals / Assembly ===== */
  VariableDeclarationStatement(node) {
    node.variables.forEach((variable) => this._addVariable(variable))
  }

  AssemblyLocalDefinition(node) {
    node.names.forEach((variable) => this._addVariable(variable))
  }

  Identifier(node) {
    this._trackVarUsage(node)
  }

  AssemblyCall(node) {
    const firstChild = node.arguments.length === 0 && node
    if (firstChild) {
      firstChild.name = firstChild.functionName
      this._trackVarUsage(firstChild)
    }
  }

  /** ===== Internals ===== */
  _addVariable(node) {
    const idNode = node
    const funcScope = scopeOf(node)

    if (idNode && funcScope) {
      scopeAddVar(funcScope, idNode, idNode.name)
    }
  }

  _trackVarUsage(node) {
    const isFunctionName = node.type === 'FunctionDefinition'
    const funcScope = scopeOf(node)

    if (funcScope && !this._isVarDeclaration(node) && !isFunctionName) {
      scopeTrackVarUsage(funcScope, node.name)
    }
  }

  _reportErrorsFor(node) {
    const funcScope = scopeOf(node)
    if (!funcScope || funcScope._reported) return

    scopeUnusedVariables(funcScope).forEach(this._error.bind(this))

    // prevent double emissions
    funcScope._reported = true
    if (node && node.funcScope) delete node.funcScope
  }

  _error({ name, node }) {
    this.warn(node, `Variable "${name}" is unused`)
  }

  _isVarDeclaration(node) {
    const variableDeclaration = findParentType(node, 'VariableDeclaration')
    const identifierList = findParentType(node, 'IdentifierList')
    const parameterList = findParentType(node, 'ParameterList')
    const assemblyLocalDefinition = findParentType(node, 'AssemblyLocalDefinition')

    // otherwise `let t := a` doesn't track usage of `a`
    const isAssemblyLocalDefinition =
      assemblyLocalDefinition &&
      assemblyLocalDefinition.names &&
      assemblyLocalDefinition.names.includes(node)

    return variableDeclaration || identifierList || parameterList || isAssemblyLocalDefinition
  }
}

function isEmptyBlock(node) {
  return _.size(node.body && node.body.statements) === 0
}

function isFuncWithoutBlock(node) {
  return node.body === null
}

function ignoreWhen(...args) {
  return _.some(args)
}

function findParentType(node, type) {
  return traversing.findParentType(node, type)
}

module.exports = NoUnusedVarsChecker
