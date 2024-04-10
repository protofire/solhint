const BaseChecker = require('../base-checker')

const ruleId = 'gas-indexed-events'
const suggestForTypes = ['uint', 'int', 'bool', 'ufixed', 'fixed', 'address']
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Suggest indexed arguments on events for uint, bool and address',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: '[source](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (see Indexed Events)',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class GasIndexedEvents extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  EventDefinition(node) {
    const qtyArguments = node.parameters.length
    const positionsOfPossibleSuggestions = []
    let qtyOfIndexedKetwords = 0
    let argumentType = ''

    // first check if the indexed keyword is used three times to left room for suggestion
    for (let i = 0; i < qtyArguments; i++) {
      // put the type in the variable for better code reading
      argumentType = node.parameters[i].typeName.name

      // compare if the type is one of the possible suggestion types
      for (const type of suggestForTypes) {
        if (argumentType.startsWith(type) && !node.parameters[i].isIndexed) {
          // push the position into an array to come back later if there's room for another indexed argument
          positionsOfPossibleSuggestions.push(i)
        }
      }

      // count the indexed arguments
      if (node.parameters[i].isIndexed) qtyOfIndexedKetwords++
    }

    // if there's room for more indexed arguments
    if (qtyOfIndexedKetwords < 3 && positionsOfPossibleSuggestions.length > 0) {
      this.reportError(node, positionsOfPossibleSuggestions)
    }
  }

  reportError(node, positionsOfPossibleSuggestions) {
    let parameterName = ''
    for (let i = 0; i < positionsOfPossibleSuggestions.length; i++) {
      parameterName = node.parameters[positionsOfPossibleSuggestions[i]].name
      this.error(node, `GC: [${parameterName}] on Event [${node.name}] could be Indexed`)
    }
  }
}

module.exports = GasIndexedEvents
