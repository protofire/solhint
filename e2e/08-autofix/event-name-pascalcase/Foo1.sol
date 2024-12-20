// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract Generic {
    
    event not_UsedEvent1(uint256 indexed amount, address account);
    
    event __not_UsedEvent___2(uint256 indexed amount, address indexed account);

    event not___UsedEvent3(uint256 amount, address account);

    event notUsedEvent4(uint256 indexed amount, address indexed account);
    
    event notUsedEvent5____(uint256 indexed amount, address account);
    
    event __not_UsedEvent6__(uint256 indexed amount, address account);

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
