// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "lib1.sol";
import "lib2.sol";
import { something1 } from "lib3.sol";
import { something2 } from "lib4.sol";
import { something1 as smg1 } from "lib3.sol";
import { something2 as smg2 } from "lib4.sol";

contract Generic {

    string private constant STR1 = "You shall not 'pass' !";
    string private constant STR2 = "You shall not 'pass' !";

    function asmSingle() external view {
        assembly { "abc" }
        assembly { dataSize("uint") }
        assembly { linkerSymbol("uint") }
        assembly { let hexString := "48656c6c6f2c2027576f726c64212722" }
    }

    function asmDouble() external view {
        assembly { "abc" }
        assembly { dataSize("uint") }
        assembly { linkerSymbol("uint") }
        assembly { let hexString := "48656c6c6f2c2027576f726c64212722" }
    }
}
