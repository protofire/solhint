// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract InterfaceRules {
    string public test = 'this one should NOT fail';

    constructor() {

        console.log('NO error: no-console is OFF');
    }
    
    function emptyBlocksToFail() external {}
}

