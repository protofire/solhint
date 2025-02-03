// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { IERC20 } from '../token/interfaces/IERC20.sol';
import { Bar, Civ, Zed as Nit } from '../Other.sol';

contract Foo is Bar, Nit {
    constructor() Bar() Nit(msg.sender) {}
}
