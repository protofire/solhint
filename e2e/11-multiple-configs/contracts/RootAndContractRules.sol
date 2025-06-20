// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract RootAndContractRules {
    string public test = 'this one should NOT fail';

    constructor() {

        console.log("error on no-console");
    }
}

