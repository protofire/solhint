// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import {ERC20Burnable} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

contract Foo1 is ERC20Burnable {
    uint256 public hola;
    uint256 public hola2;
    int256 public constant hola3 = 2;
    ufixed128x18 hola4;
    fixed128x18 internal hola5;

    constructor() ERC20('MyToken', 'MTK') {}

    // solhint-disable no-empty-blocks
    function payableTrue() public payable {}

    // solhint-disable no-empty-blocks
    function payableFalse() public {}

    function zarasa() {}
}
