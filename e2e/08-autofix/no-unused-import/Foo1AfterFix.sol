// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { Bar, Zed as Nit } from '../Other.sol';
import { Wyd } from '../Wyd.sol';

contract Foo is Bar, Nit, Wyd {
    constructor() Bar() Nit(msg.sender) Wyd() {}
}
