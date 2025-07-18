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
        note: 'This rule assumes all UserDefinedTypeName take a new slot. (beware of Enums inside Structs) ',
      },
      {
        note: 'Simple cases like a struct with three addresses might be reported as false positive. (needs to be fixed)',
      },
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (Variable Packing)',
      },
      {
        note: '[source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-f8m1r) of the rule initiative',
      },
    ],
  },

  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

class GasStructPacking extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  StructDefinition(node) {
    const reportError = this.isInefficientlyPacked(node)
    if (reportError) {
      this.reportError(node)
    }
  }

  isInefficientlyPacked(structNode) {
    if (!structNode || !Array.isArray(structNode.members) || structNode.members.length <= 1) {
      // if (!structNode || !Array.isArray(structNode.members)) {
      return false // Early return for structs with 1 or no members
    }

    let members = structNode.members.map((member) => ({
      name: member.name,
      size: this.getVariableSize(member.typeName),
      type: member.typeName.type,
    }))

    const canBeImproved = this.analyzePacking(members)
    return canBeImproved
  }

  calculateCurrentSlotsUsed(members) {
    let slotsUsed = 0
    let currentSlotSpace = 0

    members.forEach((member) => {
      if (member.size === 32) {
        if (currentSlotSpace > 0) {
          slotsUsed += 1 // Finish the current slot if it was partially filled
          currentSlotSpace = 0
        }
        slotsUsed += 1 // This member occupies a full slot
      } else {
        if (currentSlotSpace + member.size > 32) {
          slotsUsed += 1 // Move to the next slot if adding this member exceeds the current slot
          currentSlotSpace = member.size // Start filling the next slot
        } else {
          currentSlotSpace += member.size // Add to the current slot space
        }
      }
    })

    // If there's any space used in the current slot after looping, it means another slot is partially filled
    if (currentSlotSpace > 0) {
      slotsUsed += 1
    }

    return slotsUsed
  }

  analyzePacking(members) {
    // calculateCurrentSlotsUsed
    const currentSlots = this.calculateCurrentSlotsUsed(members)

    // calculate optimal slots by rounding up the total size of members in descending order
    const sortedMembers = [...members].sort((a, b) => b.size - a.size)
    const optimalSlots = this.calculateCurrentSlotsUsed(sortedMembers)

    return currentSlots > optimalSlots
  }

  getVariableSize(typeNode) {
    if (!typeNode) {
      return 32
    }

    switch (typeNode.type) {
      case 'ElementaryTypeName':
        return this.getSizeForElementaryType(typeNode.name)
      case 'UserDefinedTypeName':
        // this can be improved for enums
        return 32
      case 'ArrayTypeName':
        if (typeNode.length) {
          // if array is fixed, get the length * var size
          const varSize = this.getSizeForElementaryType(typeNode.baseTypeName.name)
          const size = parseInt(typeNode.length.number) * varSize
          return size > 32 ? 32 : size
        }
        return 32 // Dynamic arrays occupy a full slot

      default:
        return 32
    }
  }

  getSizeForElementaryType(typeName) {
    switch (typeName) {
      case 'address':
        return 20
      case 'bool':
        return 1
      case 'string':
      case 'bytes':
        return 32
      default:
        return typeName.includes('uint') || typeName.includes('int')
          ? this.getSizeForIntType(typeName)
          : 32
    }
  }

  getSizeForIntType(typeName) {
    const bits = parseInt(typeName.replace(/\D/g, ''), 10)
    return Math.ceil(bits / 8)
  }

  reportError(node) {
    this.error(
      node,
      `GC: For [ ${node.name} ] struct, packing seems inefficient. Try rearranging to achieve 32bytes slots`
    )
  }
}

module.exports = GasStructPacking
