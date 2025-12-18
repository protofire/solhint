const _ = require('lodash')
const BaseChecker = require('../base-checker')
const TreeTraversing = require('../../common/tree-traversing')
const { severityDescription } = require('../../doc/utils')

const traversing = new TreeTraversing()

const ruleId = 'no-immutable-before-declaration'
const DEFAULT_SEVERITY = 'warn'

const meta = {
  type: 'security',

  docs: {
    description:
      'Immutable variables should not be used in state variable initializers before they are declared.',
    category: 'Security Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    examples: {
      good: [
        {
          description: 'Immutable declared before being used in another initializer',
          code: `
            contract Immutables {
                uint256 internal immutable immB = 25;
                uint256 public immA = immB + 100; // OK, immB is already declared
            }
          `,
        },
        {
          description: 'Constants can be referenced before declaration',
          code: `
            contract Immutables {
                uint256 public constA = constB + 100; // OK, constants are compile-time
                uint256 internal constant constB = 50;
            }
          `,
        },
      ],
      bad: [
        {
          description: 'Immutable used before declaration in state variable initializer',
          code: `
            contract Immutables {
                uint256 public immA = immB + 100; // BAD: immB declared later
                uint256 internal immutable immB = 25;
            }
          `,
        },
      ],
    },
  },

  recommended: true,
  defaultSetup: DEFAULT_SEVERITY,

  schema: null,
}

/**
 * Internal per-contract structure:
 *
 * this.contracts = {
 *   [contractKey: string]: {
 *     name: string,
 *     declCounter: number,  // monotonically increasing index for state vars
 *     stateVarsByName: {
 *       [varName: string]: {
 *         name: string,
 *         index: number,        // declaration order within the contract
 *         isImmutable: boolean,
 *         isConstant: boolean,
 *         node: VariableDeclaration
 *       }
 *     },
 *     // references from state variable initializers
 *     // each entry describes "initializer of ownerName uses identifierName"
 *     refs: Array<{
 *       ownerName: string,
 *       ownerIndex: number,
 *       ownerNode: VariableDeclaration,
 *       identifierName: string
 *     }>
 *   }
 * }
 */

class ImmutableBeforeDeclarationChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)

    // Store contracts information keyed by a stable contract "id"
    this.contracts = Object.create(null)
  }

  /** ===== Helpers: contract lookup & initialization ===== */

  _getEnclosingContract(node) {
    // Walk up the AST until we find the ContractDefinition parent
    return traversing.findParentType(node, 'ContractDefinition')
  }

  _getContractKey(contractNode) {
    // Build a stable key per contract within the source unit
    if (!contractNode) return null

    return (
      contractNode.name ||
      (contractNode.range ? contractNode.range.join(':') : null) ||
      '<anonymous>'
    )
  }

  _getContractName(contractNode) {
    // Human readable contract name for messages
    if (!contractNode) return '<unknown contract>'
    return contractNode.name || '<anonymous contract>'
  }

  _ensureContractEntry(contractNode) {
    const key = this._getContractKey(contractNode)
    if (!key) return null

    if (!this.contracts[key]) {
      this.contracts[key] = {
        name: this._getContractName(contractNode),
        declCounter: 0,
        stateVarsByName: Object.create(null),
        refs: [],
      }
    }

    return key
  }

  /** ===== Helpers: collecting state variables and initializer references ===== */

  _collectInitializerIdentifiers(contract, ownerVarMeta, exprNode) {
    if (!exprNode) return

    // Generic DFS over the initializer expression to find identifier usages
    function visit(node) {
      if (!node || typeof node !== 'object') return

      // Case 1: plain identifier usage, e.g. `immB`
      if (node.type === 'Identifier' && node.name) {
        contract.refs.push({
          ownerName: ownerVarMeta.name,
          ownerIndex: ownerVarMeta.index,
          ownerNode: ownerVarMeta.node,
          identifierName: node.name,
        })
      }

      // Case 2: member access on `this`, e.g. `this.immB`
      // In the Solidity parser AST, this is represented as:
      //   {
      //     type: 'MemberAccess',
      //     expression: { type: 'Identifier', name: 'this', ... },
      //     memberName: 'immB',
      //     ...
      //   }
      if (
        node.type === 'MemberAccess' &&
        node.expression &&
        node.expression.type === 'Identifier' &&
        node.expression.name === 'this' &&
        typeof node.memberName === 'string'
      ) {
        contract.refs.push({
          ownerName: ownerVarMeta.name,
          ownerIndex: ownerVarMeta.index,
          ownerNode: ownerVarMeta.node,
          identifierName: node.memberName,
        })
      }

      // Traverse child nodes (generic AST walk)
      Object.keys(node).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(node, key)) return
        const value = node[key]

        if (!value) return

        if (Array.isArray(value)) {
          value.forEach((child) => {
            if (child && typeof child.type === 'string') {
              visit(child)
            }
          })
        } else if (value && typeof value === 'object' && typeof value.type === 'string') {
          visit(value)
        }
      })
    }

    // Start DFS from the initializer root expression
    visit(exprNode)
  }

  _registerStateVariableDeclaration(node) {
    const contractNode = this._getEnclosingContract(node)
    if (!contractNode) return

    const key = this._ensureContractEntry(contractNode)
    if (!key) return

    const contract = this.contracts[key]
    const vars = Array.isArray(node.variables) ? node.variables : []
    const initializer = node.initialValue || null

    // Solidity allows one variable per state declaration in practice,
    // but we keep this generic in case parser exposes more.
    vars.forEach((varDecl) => {
      if (!varDecl || !varDecl.name) return

      // Assign a monotonic declaration index within this contract
      const declIndex = contract.declCounter++

      const meta = {
        name: varDecl.name,
        index: declIndex,
        isImmutable: !!varDecl.isImmutable,
        isConstant: !!varDecl.isDeclaredConst,
        node: varDecl,
      }

      contract.stateVarsByName[meta.name] = meta

      // If there is an initializer expression, collect identifier usages for this variable
      if (initializer) {
        this._collectInitializerIdentifiers(contract, meta, initializer)
      }
    })
  }

  /** ===== Helpers: analysis after we know all declarations ===== */

  _analyzeContract(contract) {
    const varsByName = contract.stateVarsByName

    contract.refs.forEach((ref) => {
      const target = varsByName[ref.identifierName]
      if (!target) return

      // We only care about immutable variables of this contract
      if (!target.isImmutable) return

      // Constants are compile-time values and are always safe regardless of order
      if (target.isConstant) return

      // If the target immutable was declared BEFORE or at the same time as the owner,
      // there is no issue: order is correct or self-reference (self is index-equal).
      if (target.index <= ref.ownerIndex) return

      // At this point:
      // - "ref.ownerName" initializer uses identifier "ref.identifierName"
      // - that identifier resolves to an immutable state variable declared LATER
      //   in the same contract. This means the initializer will see the immutable's
      //   default value (usually 0) instead of its intended initialized value.
      const message = `Immutable "${target.name}" is used in the initializer of "${ref.ownerName}" before it is declared. This may lead to "${ref.ownerName}" being initialized with the default value of "${target.name}" (0) instead of its intended value.`

      this.warn(ref.ownerNode, message)
    })
  }

  /** ===== AST hooks ===== */

  StateVariableDeclaration(node) {
    // Collect state variable declarations and their initializer references
    this._registerStateVariableDeclaration(node)
  }

  'SourceUnit:exit'() {
    // Once the entire source unit has been traversed, analyze each contract
    _.forEach(this.contracts, (contract) => {
      this._analyzeContract(contract)
    })
  }
}

module.exports = ImmutableBeforeDeclarationChecker
