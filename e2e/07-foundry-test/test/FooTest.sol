// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

import "./Test.sol";

contract FooTest is Test {
    uint256 testNumber;

    function setUp() public {
        testNumber = 42;
    }

    function testFail_Subtract43() public {
        testNumber -= 43;
    }

    function wrongFunctionDefinitionName() public {
        testNumber -= 43;
    }
}