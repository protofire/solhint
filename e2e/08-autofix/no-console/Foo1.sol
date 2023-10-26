pragma solidity 0.8.0;

import 'hardhat/console.sol';
import 'forge-std/console.sol';
import 'forge-std/console2.sol';
import 'forge-std/xxxxx.sol';

contract Foo1 {
    Console[] public consoleTest;
    Console[] public console;

    struct Console {
        uint256 one;
        uint256 two;
    }

    function a() public {
        console.log('test');
        // comment
        console.logString('test logString');
        uint256 declaration;
        console.logBytes12('test logBytes12');
    }

    function b() public {
        console2.log('test console 2');
        // comment
        console.logString('test logString');
        uint256 declaration;
        console.logBytes12('test');
    }

    function c() external {
        consoleTest.push(0, 0);
        console.push = (1, 1);
    }
}
