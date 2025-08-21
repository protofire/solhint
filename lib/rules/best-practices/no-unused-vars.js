const _ = require('lodash')
const BaseChecker = require('../base-checker')
const TreeTraversing = require('../../common/tree-traversing')
const { severityDescription } = require('../../doc/utils')

const traversing = new TreeTraversing()

const ruleId = 'no-unused-vars'

/** ==== Config defaults ==== */
const DEFAULT_PARAMETERS_VALIDATION = true
const DEFAULT_SEVERITY = 'warn'
const DEFAULT_OPTION = { validateParameters: DEFAULT_PARAMETERS_VALIDATION }
const ERR_DESCRIPTION =
  'Reports unused variables. When true, reports function and modifiers parameters. When false, parameters are ignored (useful for abstract/virtual NatSpec).'

const meta = {
  type: 'best-practices',

  docs: {
    description: 'Variable "name" is unused.',
    category: 'Best Practices Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description:
          'A JSON object with a single property "validateParameters" as boolean specifying whether to report unused parameters from functions and modifiers.',
        default: JSON.stringify(DEFAULT_OPTION),
      },
    ],
  },

  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_OPTION],

  schema: {
    type: 'object',
    required: ['validateParameters'],
    properties: {
      validateParameters: {
        type: 'boolean',
        description: ERR_DESCRIPTION + ' And should be a boolean.',
      },
    },
  },
}

class NoUnusedVarsChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    // IMPORTANT: default to TRUE when config is missing
    this.validateParameters =
      config &&
      config.getObjectPropertyBoolean(ruleId, 'validateParameters', DEFAULT_PARAMETERS_VALIDATION)
  }

  /** ===== Functions ===== */
  FunctionDefinition(node) {
    const funcWithoutBlock = isFuncWithoutBlock(node)
    const emptyBlock = isEmptyBlock(node)

    if (!ignoreWhen(funcWithoutBlock, emptyBlock)) {
      scopeActivate(node)

      // add function parameters directly into current function scope
      if (this.validateParameters && Array.isArray(node.parameters)) {
        node.parameters
          // filter false positive: function f(address payable) {}
          .filter((parameter) => {
            if (
              parameter.typeName &&
              parameter.typeName.name === 'address' &&
              parameter.typeName.stateMutability === null &&
              parameter.name === 'payable'
            ) {
              return false
            }
            return !!parameter.name
          })
          .forEach((parameter) => {
            // add using current node scope (no parent lookup)
            scopeAddVar(node.funcScope, parameter, parameter.name)
          })
      }
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

      // add modifier parameters directly into current modifier scope
      if (this.validateParameters && Array.isArray(node.parameters)) {
        node.parameters
          .filter((parameter) => {
            if (
              parameter.typeName &&
              parameter.typeName.name === 'address' &&
              parameter.typeName.stateMutability === null &&
              parameter.name === 'payable'
            ) {
              return false
            }
            return !!parameter.name
          })
          .forEach((parameter) => {
            scopeAddVar(node.funcScope, parameter, parameter.name)
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
    const funcScope = scopeOf(node)

    if (funcScope && !this._isVarDeclaration(node)) {
      scopeTrackVarUsage(funcScope, node.name)
    }
  }

  _reportErrorsFor(node) {
    const funcScope = scopeOf(node)
    if (!funcScope || funcScope._reported) return

    scopeUnusedVariables(funcScope).forEach(this._error.bind(this))

    // avoid double reporting
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

/** ---- scope helpers ---- */
function scopeOf(node) {
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
