// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

struct NotUsedStruct1 {
        uint256 three;
        uint256 four;
}

enum Status1 {
        Pending,
        Approved,
        Rejected
    }

struct NotUsedStruct2 {
        uint256 three;
        uint256 four;
}

enum Status2 {
        Pending,
        Approved,
        Rejected
    }

contract Generic {

    struct NotUsedStruct3 {
        uint256 three;
        uint256 four;
    }

    enum Status3     {
        Pending,
        Approved,
        Rejected
    }

    struct NotUsedStruct4 {
        uint256 three;
        uint256 four;
    }

    enum Status4 {
        Pending,
        Approved,
        Rejected
    }

    constructor() {}

    function function1() pure external {
        uint af1 = 0;
        af1;
    }

    function function2() external pure {
        uint b;
        b;
    }
}
