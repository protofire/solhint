// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract Generic {
    
    event NotUsedEvent1(uint256 indexed amount, address account);
    
    event NotUsedEvent2(uint256 indexed amount, address indexed account);

    event NotUsedEvent3(uint256 amount, address account);

    event NotUsedEvent4(uint256 indexed amount, address indexed account);
    
    event NotUsedEvent5(uint256 indexed amount, address account);
    
    event NotUsedEvent6(uint256 indexed amount, address account);

    event OkEvent1(uint256 indexed amount, address account);
    
    event OkEventOk2(uint256 indexed amount, address indexed account);

    constructor() {}

    function function1() external pure {
        uint af1 = 0;
        af1;
    }

    function function2() external pure {
        uint b;
        b;
    }
}
