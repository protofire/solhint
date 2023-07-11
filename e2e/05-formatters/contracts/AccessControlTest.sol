// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AccessControlFacet {
    uint256 public INITIAL_SUPPLY = 100_000_000e18;

    constructor() {}

    function returnValue() external pure returns(uint256) {
        bytes memory hola;
        sha3(hola);
        throw;
        return 1;
    }
}