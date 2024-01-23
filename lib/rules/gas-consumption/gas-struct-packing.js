/* eslint-disable */
const BaseChecker = require('../base-checker')

const ruleId = 'gas-struct-packing'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Suggest to re-arrange struct packing order when it is inefficient',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: 'This rule ',
      },
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (Variable Packing)',
      },
      {
        note: '[source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-f8m1r) of the rule initiative',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class GasStructPacking extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  StructDefinition(node) {
    if (this.isInefficientlyPacked(node)) {
      this.reportError(node)
    }
  }

  isInefficientlyPacked(structNode) {
    if (!structNode || !Array.isArray(structNode.members)) {
      return false
    }

    let members = structNode.members.map((member) => ({
      name: member.name,
      size: this.getVariableSize(member.typeName),
      type: member.typeName.type,
    }))

    let currentSlotSize = 0
    let potentialSavings = 0
    let dynamicTypeEncountered = false

    for (const member of members) {
      // Dynamically-sized types (strings, arrays) and mappings always start a new slot.
      if (this.isDynamicType(member.type)) {
        currentSlotSize = 0
        dynamicTypeEncountered = true
        continue
      }

      if (member.size === 32 || dynamicTypeEncountered) {
        currentSlotSize = 0
        dynamicTypeEncountered = false
      }

      if (currentSlotSize + member.size > 32) {
        potentialSavings += 32 - currentSlotSize
        currentSlotSize = member.size
      } else {
        currentSlotSize += member.size
      }
    }

    if (currentSlotSize > 0 && currentSlotSize < 32) {
      potentialSavings += 32 - currentSlotSize
    }

    return potentialSavings > 0
  }

  isDynamicType(typeNode) {
    if (!typeNode) {
      return false
    }

    switch (typeNode.type) {
      case 'Mapping':
        // Mappings are always dynamically sized
        return true
      case 'ArrayTypeName':
        // Arrays are dynamically sized unless they have a fixed size declared
        return !typeNode.length
      case 'ElementaryTypeName':
        // Strings and bytes are dynamically sized elementary types
        if (typeNode.name.startsWith('string') || typeNode.name.startsWith('bytes')) {
          return true
        }
        break
      case 'UserDefinedTypeName':
        // For user-defined types, more complex logic might be required
        // to determine if they are dynamically sized. This could involve
        // looking up their definitions if available.
        // For now, let's assume they are not dynamically sized.
        return false
      // ... handle any other specific types as needed ...
    }

    return false // Default to false if type is not recognized as dynamic
  }

  getVariableSize(typeNode) {
    // Enhanced version to handle more types
    switch (typeNode.type) {
      case 'ElementaryTypeName':
        switch (typeNode.name) {
          case 'address':
            return 20 // Address is 20 bytes
          case 'bool':
            return 1 // Bool is 1 byte
          case 'uint256':
          case 'int256':
            return 32 // uint256 and int256 are 32 bytes
          // ...other elementary types...
        }
        break
      case 'UserDefinedTypeName':
        // For user-defined types, you might assume worst-case (full slot usage)
        // unless you analyze their definitions as well.
        return 32
      // ...cases for arrays, mappings, etc...
    }

    return 32 // Default to 32 bytes for unknown or complex types
  }

  reportError(node) {
    // const variableName = fullVariableName.split('.')[0]
    this.error(
      node,
      `GC: For [ ] struct, packing seems inefficient. Try rearranging variables to achieve 32bytes slots`
    )
  }
}

module.exports = GasStructPacking
