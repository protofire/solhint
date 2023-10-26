// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import {ERC20Burnable} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';

contract Foo1 is ERC20Burnable {
    uint public hola;
    uint public hola2;
    int public constant hola3 = 2;
    ufixed hola4;
    fixed internal hola5;

    constructor() ERC20('MyToken', 'MTK') {}

    // solhint-disable no-empty-blocks
    function payableTrue() public payable {}

    // solhint-disable no-empty-blocks
    function payableFalse() public {}

    function zarasa() {}
}
