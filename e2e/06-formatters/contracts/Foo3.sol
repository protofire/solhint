// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Foo {
    uint256 public constant TEST1 = 1;
    uint256 public value;

    function _goodContract() private {
        value = TEST1;
    }
}
