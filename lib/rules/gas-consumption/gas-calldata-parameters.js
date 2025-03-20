const BaseChecker = require('../base-checker')

const solidityOperators = [
  '=',
  '++',
  '--',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '&=',
  '|=',
  '^=',
  '<<=',
  '>>=',
]
const ruleId = 'gas-calldata-parameters'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Suggest calldata keyword on function arguments when read only',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: 'Only applies for external functions when receiving arguments with [memory] keyword',
      },
      {
        note: 'This rule makes a soft check to see if argument is readOnly to make the suggestion. Check it manually before changing it.',
      },
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (see Calldata vs Memory)',
      },
      {
        note: '[source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-6acr7) of the rule initiative',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class GasCalldataParameters extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  // checkIfReadOnly(statements, functionArguments) {
  checkIfReadOnly(node, index) {
    let isUpdated = false
    let i = 0
    const statements = node.body.statements

    while (i < statements.length) {
      if (statements[i].type === 'ExpressionStatement') {
        // variable manipulation
        if (solidityOperators.includes(statements[i].expression.operator)) {
          // binary operation
          if (statements[i].expression.type === 'BinaryOperation') {
            // array
            if (statements[i].expression.left.base && statements[i].expression.left.base.name) {
              isUpdated = statements[i].expression.left.base.name === node.parameters[index].name
            }
            // regular expression
            else if (statements[i].expression.left.name) {
              isUpdated = statements[i].expression.left.name === node.parameters[index].name
            }
            // struct
            else if (statements[i].expression.left.type === 'MemberAccess') {
              isUpdated =
                statements[i].expression.left.expression.name === node.parameters[index].name
            }
          }
          // unary operations
          else if (statements[i].expression.type === 'UnaryOperation') {
            isUpdated =
              // regular unary expression
              statements[i].expression.subExpression.name === node.parameters[index].name ||
              // on array expression
              statements[i].expression.subExpression.base.name === node.parameters[index].name
          }
        }
      }
      // if is updated stop looping
      if (isUpdated) i = statements.length
      // if not, keep looping statements
      else i++
    }

    return isUpdated
  }

  FunctionDefinition(node) {
    const qtyArguments = node.parameters.length
    let isUpdated = false

    // check for external functions the memory keyword
    if (node.visibility === 'external' && qtyArguments > 0) {
      for (let i = 0; i < qtyArguments; i++) {
        if (node.parameters[i].storageLocation === 'memory') {
          isUpdated = this.checkIfReadOnly(node, i)
          if (!isUpdated) this.reportError(node, node.parameters[i].name)
        }
      }
    }
  }

  reportError(node, parameterName) {
    this.error(
      node,
      `GC: [${parameterName}] argument on Function [${node.name}] could be [calldata] if it's not being updated`
    )
  }
}

module.exports = GasCalldataParameters
