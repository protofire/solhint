// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract RootRules {
    string public test = 'this one should fail';

    constructor() {

        console.log("error on no-console");
    }
}

