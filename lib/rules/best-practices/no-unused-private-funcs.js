const _ = require('lodash')
const BaseChecker = require('../base-checker')
const TreeTraversing = require('../../common/tree-traversing')
const { severityDescription } = require('../../doc/utils')

const traversing = new TreeTraversing()

const ruleId = 'no-unused-private-funcs'
const DEFAULT_SEVERITY = 'warn'

const meta = {
  type: 'best-practices',

  docs: {
    description:
      'Private function "name" is not being used within its defining contract. Support overloads.',
    category: 'Best Practices Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
  },

  // Users must opt-in explicitly
  recommended: false,
  defaultSetup: DEFAULT_SEVERITY,

  schema: null,
}

/**
 * Internal structure:
 *
 * this.contracts = {
 *   [contractKey: string]: {
 *     contractName: string,
 *     funcs: Array<{
 *       name: string,
 *       paramCategories: string[],  // ['integer', 'string', 'bool', 'bytes', 'unknown', ...]
 *       paramCount: number,
 *       node: FunctionDefinition,
 *       used: boolean
 *     }>,
 *     calls: Array<{
 *       name: string,
 *       argCategories: string[],
 *       argCount: number
 *     }>
 *   }
 * }
 */

class NoUnusedPrivateFuncsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)

    // Per-contract storage of private functions + calls
    this.contracts = Object.create(null)
  }

  /** ===== Helpers: contracts & keys ===== */

  _getEnclosingContract(node) {
    // Walk up the AST until we find the ContractDefinition parent
    return traversing.findParentType(node, 'ContractDefinition')
  }

  _getContractKey(contractNode) {
    // Create a stable key for each contract within the source unit
    if (!contractNode) return null

    return (
      contractNode.name ||
      (contractNode.range ? contractNode.range.join(':') : null) ||
      '<anonymous>'
    )
  }

  _getContractName(contractNode) {
    // Human readable name for reporting purposes
    if (!contractNode) return '<unknown contract>'
    return contractNode.name || '<anonymous contract>'
  }

  _ensureContractEntry(contractNode) {
    const key = this._getContractKey(contractNode)
    if (!key) return null

    if (!this.contracts[key]) {
      this.contracts[key] = {
        contractName: this._getContractName(contractNode),
        funcs: [],
        calls: [],
      }
    }

    return key
  }

  /** ===== Helpers: type categorization for overload resolution ===== */

  _categoryFromParamType(typeName) {
    // Normalize parameter type to a coarse-grained category
    if (!typeName) return 'unknown'

    if (typeName.type === 'ElementaryTypeName' && typeof typeName.name === 'string') {
      const t = typeName.name

      if (t === 'bool') return 'bool'
      if (t === 'string') return 'string'
      if (t === 'address' || t === 'address payable') return 'address'
      if (t.startsWith('uint') || t.startsWith('int')) return 'integer'
      if (t === 'bytes') return 'bytes'
      if (t.startsWith('bytes')) return 'fixed-bytes' // bytes1..bytes32

      // Anything else is “other elementary”: treat as unknown for overload matching
      return 'unknown'
    }

    // Arrays, mappings, user defined types, etc.
    return 'unknown'
  }

  _categoryFromArgument(arg) {
    // Approximate type category from argument AST node
    if (!arg) return 'unknown'

    switch (arg.type) {
      case 'NumberLiteral':
      case 'HexNumber':
        return 'integer'

      case 'BooleanLiteral':
        return 'bool'

      case 'StringLiteral':
      case 'UnicodeStringLiteral':
        return 'string'

      case 'HexLiteral':
        return 'fixed-bytes'

      default:
        // Identifiers, MemberAccess, FunctionCall, etc.
        // We do not know the exact type here.
        return 'unknown'
    }
  }

  /** ===== Helpers: registering private functions ===== */

  _markPrivateFunction(node) {
    // Ignore null nodes and constructors
    if (!node || node.isConstructor) return

    // Fallback / receive functions do not have a name
    if (!node.name) return

    // We only care about private functions
    if (node.visibility !== 'private') return

    const contractNode = this._getEnclosingContract(node)
    if (!contractNode) return

    const key = this._ensureContractEntry(contractNode)
    if (!key) return

    const contract = this.contracts[key]

    const params = Array.isArray(node.parameters) ? node.parameters : []
    const paramCategories = params.map((p) => this._categoryFromParamType(p.typeName))

    // Store private function metadata for later matching
    contract.funcs.push({
      name: node.name,
      paramCategories,
      paramCount: params.length,
      node,
      used: false,
    })
  }

  /** ===== Helpers: collecting calls ===== */

  _getCalledName(node) {
    const expr = node.expression
    if (!expr) return null

    // Direct call: foo(...)
    if (expr.type === 'Identifier') {
      return expr.name
    }

    // Member access on `this`: this.foo(...)
    if (
      expr.type === 'MemberAccess' &&
      expr.expression &&
      expr.expression.type === 'Identifier' &&
      expr.expression.name === 'this'
    ) {
      return expr.memberName
    }

    return null
  }

  _recordFunctionCall(node) {
    const contractNode = this._getEnclosingContract(node)
    if (!contractNode) return

    const key = this._ensureContractEntry(contractNode)
    if (!key) return

    const contract = this.contracts[key]
    const calledName = this._getCalledName(node)
    if (!calledName) return

    const args = Array.isArray(node.arguments) ? node.arguments : []
    const argCategories = args.map((a) => this._categoryFromArgument(a))

    // Store call information; we will resolve it after the whole source unit is visited
    contract.calls.push({
      name: calledName,
      argCategories,
      argCount: args.length,
    })
  }

  /** ===== Helpers: resolving calls to functions (after traversal) ===== */

  _resolveCallsAndMarkUsed() {
    // For each contract, walk over all recorded calls and mark matching private functions as used
    _.forEach(this.contracts, (contract) => {
      contract.calls.forEach((call) => {
        const { name, argCategories, argCount } = call

        // 1) Filter by name + number of parameters
        const candidates = contract.funcs.filter(
          (f) => f.name === name && f.paramCount === argCount
        )

        if (candidates.length === 0) {
          return
        }

        if (candidates.length === 1) {
          // Only one overload can match → mark it as used
          candidates[0].used = true
          return
        }

        // 2) Try to narrow down by argument / parameter categories
        const strongMatches = candidates.filter((f) => {
          // All parameters must be compatible with arg categories
          return f.paramCategories.every((cat, i) => {
            const argCat = argCategories[i] || 'unknown'

            if (argCat === 'unknown' || cat === 'unknown') {
              // We don't have enough info to disambiguate on this position
              return true
            }

            // Both known → must match exactly
            return cat === argCat
          })
        })

        if (strongMatches.length === 1) {
          // Exactly one overload is clearly compatible
          strongMatches[0].used = true
          return
        }

        // 3) Ambiguous: mark all candidates as used (conservative, avoids false positives)
        candidates.forEach((f) => {
          f.used = true
        })
      })
    })
  }

  /** ===== Reporting ===== */

  _reportUnusedPrivateFunctions() {
    // First, resolve all calls against the registered functions
    this._resolveCallsAndMarkUsed()

    // Then, report any private function that is still unused
    _.forEach(this.contracts, (contract) => {
      contract.funcs.forEach((f) => {
        if (!f.used) {
          const funcName = f.name
          const contractName = contract.contractName || '<unknown contract>'

          this.warn(
            f.node,
            `Private function "${funcName}" in contract "${contractName}" is never used within its defining contract`
          )
        }
      })
    })
  }

  /** ===== AST hooks ===== */

  FunctionDefinition(node) {
    // Collect all private functions (including overloads)
    this._markPrivateFunction(node)
  }

  FunctionCall(node) {
    // Collect calls for later resolution (after full traversal)
    this._recordFunctionCall(node)
  }

  'SourceUnit:exit'() {
    // When the whole source unit has been traversed, resolve calls and report unused private functions
    this._reportUnusedPrivateFunctions()
  }
}

module.exports = NoUnusedPrivateFuncsChecker
