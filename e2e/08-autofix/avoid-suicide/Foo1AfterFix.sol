// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/ownership/Suicide.sol';
import { feature as suicide} from '@openzeppelin/contracts/ownership/Suicide.sol';

uint256 constant suicide = 1;

enum MyEnum {
    suicide,
    B
}

struct OneNiceStruct {
    uint256 suicide;
    uint256 b;
}

error Unauthorized();

function freeFunction() pure returns (uint256) {
    selfdestruct();
    return 1;
}

contract Generic {
    struct AnotherNiceStruct {
        uint256 suicide;
        uint256 c;
    }

    address constant owner = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    function seekAndestroy1() external {
        selfdestruct();
    }    

    function seekAndestroy2() external {
        selfdestruct(owner);
    }

    function seekAndestroy3() external {
        selfdestruct();
    }

    function seekAndestroy4() external {
        selfdestruct(owner);
    }
}
