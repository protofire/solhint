// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract ExplicitTypes { 
    uint256 public varUint256_1;
    uint256 public varUint256_2 = uint256(1); 

    uint public varUint_1;
    uint public varUint_2 = uint(1);

    int256 public varInt256;
    int public varInt;

    ufixed128x18 public varUfixed128x18;
    ufixed public varUfixed;
    fixed128x18 public varFixed128x18;
    fixed public varFixed;


    event EventWithInt256(int256 varWithInt256, address addressVar, bool boolVat, int varWithInt);

    mapping(uint256 => fixed128x18) public mapWithFixed128x18_1;

    mapping(uint => fixed128x18) public mapWithFixed128x18_2;

    mapping(uint => mapping(fixed128x18 => int256)) mapOfMap;
    
    mapping(uint256 => Estructura[]) mapOfArrayStructWithMap;

    struct Estructura1 { 
      ufixed128x18 varWithUfixed128x18; 
      uint varUint; 
    }

    struct Estructura2 { 
      ufixed128x18 varWithUfixed128x18; 
      uint varUint; 
      mapping(uint256 => Estructura) mapOfStruct; 
    }

    struct Estructura3 { 
      ufixed varWithUfixed; 
      uint varUint; 
      mapping(address => uint256) structWithMap; 
    } 

    struct Estructura4 { 
      ufixed varWithUfixed; 
      uint varUint; 
      mapping(address => uint256) structWithMap; 
    } 
    

    uint256[] public arr1;

    uint[] public arr2 = [1,2,3];

    uint[] public arr3 = [uint(1),2,3];

    uint256[] public arr4 = [[1,2,3]];

    uint[] public arr5 = [1,2,3]; 
    
    mapping(uint256 => arr5) mapOfFixedArray;

    modifier withUint256() { 
      _; 
      uint256 varUint; 
      varUint = uint256(1);
    
    }

    constructor() {}

    function withUint256_1(uint256 varUint256, uint varUint) public returns(int256 returnInt256) {}

    function withUint256_2(uint varUint, uint varUint) public returns(int returnInt) {}

    function withUint256_3() external { 
      uint256 varUint256 = uint256(1); 
    }
    
    function withUint256_4() external { 
      uint256 varUint; 
      varUint = uint256(1);
    }

    function withUint_1() external { 
      uint varUint = uint(1); 
    }

    function withUint_2() external { 
      uint varUint; varUint = uint(1);
    }
}
