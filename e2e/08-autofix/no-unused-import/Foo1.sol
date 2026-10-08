// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { IERC20 } from '../token/interfaces/IERC20.sol';
import * as Utils from '../Utils.sol';
import { Bar, Civ, Zed as Nit } from '../Other.sol';
import { Wyd, Abc as Mar } from '../Wyd.sol';
import '../Types.sol' as Types;

contract Foo is Bar, Nit, Wyd {
    constructor() Bar() Nit(msg.sender) Wyd() {}
}
