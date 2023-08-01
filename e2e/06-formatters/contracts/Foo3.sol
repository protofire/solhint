// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8;

contract Foo {
    uint256 public constant TEST1 = 1;
    uint256 public value;

    function _goodContract() private {
        value = TEST1;
    }
}
