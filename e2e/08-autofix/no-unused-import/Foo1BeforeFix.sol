// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { IERC20 } from '../token/interfaces/IERC20.sol';
import { Bar, Civ, Zed as Nit } from '../Other.sol';
import { Wyd, Mar } from '../Wyd.sol';

contract Foo is Bar, Nit, Wyd {
    constructor() Bar() Nit(msg.sender) Wyd() {}
}
