// ADITTIONS:
// custom errors
// outside struct
// free functions
// library with outside struct
// unchecked {}

const V7_V8_ADDITIONS = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/ownership/Ownable.sol";

    struct Data {
        mapping(uint256 => bool) flags;
    }

    library Set {
        function insert(Data storage self, uint256 value) public returns (bool) {
            if (self.flags[value]) return false; // already there
            self.flags[value] = true;
            return true;
        }
    }

    function addition(uint256 a, uint256 b) pure returns (uint256) {
        unchecked {
            return a + b;
        }
    }

    contract Test is Ownable {
        Data knownValues;

        function testFunction1(uint256 a, uint256 b) external {
        Set.insert(knownValues, a);
        unchecked {
            a + b;
        }
        revert InsufficientBalance(0, 1000);
        }    
`
module.exports = V7_V8_ADDITIONS
