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
    if (!structNode || !Array.isArray(structNode.members) || structNode.members.length <= 1) {
      return false // Early return for structs with 1 or no members
    }

    let members = structNode.members.map((member) => ({
      name: member.name,
      size: this.getVariableSize(member.typeName),
      type: member.typeName.type,
      sum: this.canBeAdded(member.typeName),
    }))

    console.log('members :>> ', members)

    return
/*
    let members = structNode.members.map((member) => ({
      name: member.name,
      size: this.getVariableSize(member.typeName),
      type: member.typeName.type,
      newSlot: this.isNewSlot(member.typeName),
    }))

    let currentSlotSize = 0
    let overflow = false

    console.log('members :>> ', members)

    // Iterate over struct members to assess packing efficiency
    for (const member of members) {
      // Special handling for large values that occupy an entire slot or more
      if (member.size == 32) {
        // If the current slot has been partially used, this large value starts a new slot
        if (currentSlotSize > 0) {
          currentSlotSize = 0 // Reset for the next slot
          overflow = true // Mark that we've overflowed into a new slot
        }
        // No need to add size to currentSlotSize since it occupies the whole new slot
        continue
      }

      if (currentSlotSize + member.size > 32) {
        // If adding this member exceeds the slot size, move to the next slot
        overflow = true // Mark that we've overflowed
        currentSlotSize = member.size // This member starts the new slot
      } else {
        // Accumulate member size in the current slot
        currentSlotSize += member.size
      }
    }

    // If we've never overflowed, all members are efficiently packed
    return overflow
    */
  }

  /*
  isInefficientlyPacked(structNode) {
    if (!structNode || !Array.isArray(structNode.members) || structNode.members.length <= 1) {
      return false
    }

    let members = structNode.members.map((member) => ({
      name: member.name,
      size: this.getVariableSize(member.typeName),
      type: member.typeName.type,
    }))

    console.log('members :>> ', members)

    let currentSlotSize = 0;
    let isPotentialInefficiencyDetected = false;
  
    // Iterate over struct members to assess packing efficiency
    members.forEach(member => {
      // If adding this member exceeds the current slot size, it starts in a new slot
      if (currentSlotSize + member.size > 32) {
        // If there was room left in the slot, it's a potential inefficiency
        if (currentSlotSize < 32) {
          isPotentialInefficiencyDetected = true;
        }
        currentSlotSize = member.size % 32;
      } else {
        currentSlotSize += member.size;
        // Adjust current slot size to modulo 32 for cases where exact fit or overflow
        currentSlotSize %= 32;
      }
    });
  
    // If there's unused space in the last slot, it might not indicate inefficiency by itself
    // unless combined with earlier detected potential inefficiency.
    if (currentSlotSize > 0 && currentSlotSize < 32 && isPotentialInefficiencyDetected) {
      isPotentialInefficiencyDetected = true;
    } else if (currentSlotSize === 0 && !isPotentialInefficiencyDetected) {
      // If we perfectly fill slots without earlier inefficiency, it's efficient
      isPotentialInefficiencyDetected = false;
    }
  
    return isPotentialInefficiencyDetected;

  }
  */

  isSlotFull(member) {
    console.log('member :>> ', member)
    if (!member) {
      return false
    }

    switch (member.type) {
      case 'Mapping':
        return true

      case 'ArrayTypeName':
        return member.size === 32

      case 'ElementaryTypeName':
        return member.name.startsWith('string') || member.name.startsWith('bytes')

      default:
        return false
    }
  }

  getVariableSize(typeNode) {
    if (!typeNode) {
      return 32
    }

    switch (typeNode.type) {
      case 'ElementaryTypeName':
        return this.getSizeForElementaryType(typeNode.name)
      case 'UserDefinedTypeName':
        return 32
      case 'ArrayTypeName':
        if (typeNode.length) {
          // if array is fixed, get the length * var size
          const varSize = this.getSizeForElementaryType(typeNode.baseTypeName.name)
          return parseInt(typeNode.length.number) * varSize
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

  canBeAdded(typeName) {
    console.log('typeName :>> ', typeName);

    if (typeName.name.includes('uint') || typeName.name.includes('int')) {
      const aa = this.getSizeForIntType(typeName.name)
      console.log('aa :>> ', aa);

      return !(this.getSizeForIntType(typeName.name) >= 32)
    }
    console.log("20");
    
    switch (typeName.name) {
      case 'address':
      case 'bool':
        return true
      default:
        return false
    }
  }

  reportError(node) {
    this.error(
      node,
      `GC: For [ ${node.name} ] struct, packing seems inefficient. Try rearranging variables to achieve 32bytes slots`
    )
  }
}

module.exports = GasStructPacking
