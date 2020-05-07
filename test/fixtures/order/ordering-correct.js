module.exports = [
  {
    description: 'All units are in order',
    code: `
pragma solidity ^0.6.0;

import "./some/library.sol";
import "./some/other-library.sol";

enum MyEnum {
  Foo,
  Bar
}

struct MyStruct {
  uint x;
  uint y;
}

interface IBox {
  function getValue() public;
  function setValue(uint) public;
}

library MyLibrary {
  function add(uint a, uint b, uint c) public returns (uint) {
    return a + b + c;
  }
}

contract MyContract {
  struct InnerStruct {
    bool flag;
  }

  enum InnerEnum {
    A, B, C
  }

  uint public x;
  uint public y;

  event MyEvent(address a);

  constructor () public {}

  fallback () external {}

  function myExternalFunction() external {}
  function myExternalConstFunction() external const {}
  function myPublicFunction() public {}
  function myPublicConstFunction() public const {}
  function myInternalFunction() internal {}
  function myPrivateFunction() private {}
}
`
  }
]
