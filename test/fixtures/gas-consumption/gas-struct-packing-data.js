const { contractWith, multiLine } = require('../../common/contract-builder')

const contractStructsInefficient = [
  {
    name: 'Inefficient1',
    code: contractWith(
      multiLine(
        // Mixed Small and Large Types
        'struct Inefficient1 {',
        '    uint8 smallValue1; // 1 byte',
        '    uint256 largeValue; // 32 bytes, starts new slot due to size',
        '    uint8 smallValue2; // 1 byte, starts new slot, inefficient',
        '}'
      )
    ),
  },
  {
    name: 'Inefficient2',
    code: contractWith(
      multiLine(
        // // Small Types Followed by Dynamic Type
        'struct Inefficient2 {',
        '    uint16 smallValue; // 2 bytes',
        '    address addr; // 20 bytes',
        '    string dynamicData; // dynamically-sized, starts new slot',
        '    uint8 extraSmall; // 1 byte, starts new slot, inefficient',
        '}'
      )
    ),
  },
  {
    name: 'Inefficient3',
    code: contractWith(
      multiLine(
        // // Unaligned Array with Small Types
        'struct Inefficient3 {',
        '    uint32 smallValue; // 4 bytes, starts new slot, inefficient',
        '   uint32[] dynamicArray; // dynamically-sized, starts new slot',
        '   uint32[2] nonDynamicArray8Bytes; // 8 bytes non dynamically-sized',
        '   uint32[3] nonDynamicArray12Bytes; // 12 bytes non dynamically-sized ',
        '   bool flag; // 1 byte, starts new slot, inefficient',
        '}'
      )
    ),
  },
  {
    name: 'Inefficient4',
    code: contractWith(
      multiLine(
        // smallValue4b can be on top
        'struct Inefficient4 {',
        '   uint16 smallValue2b; // 2 bytes',
        '   uint16[2] fixedArray; // 4 bytes',
        '   uint32[] dynamicArray; // 32 dynamically-sized, starts new slot',
        '   uint128 smallValue16b; // 16 bytes',
        '   uint128 smallValue16b2; // 16 bytes',
        '   uint32 smallValue4b; // 4 bytes',
        '   uint256 largeValue; // 32 bytes',
        '   uint256[20] veryLargeArray; // 640 bytes',
        '   mapping(address => uint256) whatever;',
        '}'
      )
    ),
  },
]

const contractStructsEfficient = [
  {
    name: 'Efficient1',
    code: contractWith(
      multiLine(
        // // Packing Small Types Together
        'struct Efficient1 {',
        '   uint8 smallValue1; // 1 byte',
        '   uint8 smallValue2; // 1 byte, same slot',
        '   uint16 smallValue3; // 2 bytes, same slot',
        '   uint8 smallValue4; // 1 byte, same slot',
        '   uint8 smallValue5; // 1 byte, same slot',
        '   uint8 smallValue6; // 1 byte, same slot',
        '   uint8 smallValue7; // 1 byte, same slot',
        '   address addr; // 20 bytes, starts new slot',
        '}'
      )
    ),
  },
  {
    name: 'Efficient2',
    code: contractWith(
      multiLine(
        // Aligning Fixed-Size Arrays
        'struct Efficient2 {',
        '   uint256[20] veryLargeArray1; // 640 bytes starts new slot',
        '   uint16[2] fixedArray; // 4 bytes total, same slot',
        '   uint16 smallValue1; // 2 bytes, same slot',
        '   uint32 smallValue2; // 4 bytes, same slot',
        '   uint256 largeValue; // 32 bytes, starts new slot',
        '   uint256[20] veryLargeArray2; // 640 bytes starts new slot',
        '}'
      )
    ),
  },
  {
    name: 'Efficient3',
    code: contractWith(
      multiLine(
        // // Large Types Followed by Small Types
        'struct Efficient3 {',
        '   uint256 largeValue1; // 32 bytes, full slot',
        '   uint256 largeValue2; // 32 bytes, new slot',
        '   uint8 smallValue1; // 1 byte, new slot',
        '   bool flag; // 1 byte, same slot',
        '   address addr; // 20 bytes, same slot',
        '}'
      )
    ),
  },
  {
    name: 'Efficient4',
    code: contractWith(
      multiLine(
        'struct Efficient4 {',
        '   uint32[] dynamicArray; // dynamically-sized, starts new slot',
        '   uint32 smallValue; // 4 bytes, starts new slot, inefficient',
        '   bool flag; // 1 byte, starts new slot, inefficient',
        '}'
      )
    ),
  },
  {
    name: 'Efficient5',
    code: contractWith(
      multiLine(
        '   struct Efficient5 {',
        '   uint16 smallValue2b; // 2 bytes',
        '   uint16[2] fixedArray; // 4 bytes',
        '   uint128 smallValue16b; // 16 bytes',
        '   uint128 smallValue16b2; // 16 bytes',
        '   uint32 smallValue4b; // 4 bytes',
        '   uint256 largeValue; // 32 bytes',
        '   uint256[20] veryLargeArray; // 640 bytes',
        '   mapping(address => uint256) whatever;',
        '}'
      )
    ),
  },
]

module.exports = { contractStructsInefficient, contractStructsEfficient }
