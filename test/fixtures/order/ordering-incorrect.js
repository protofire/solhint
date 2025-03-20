module.exports = [
  {
    description: 'State variable declaration after function',
    code: `
  contract MyContract {
    function foo() public {}

    uint a;
  }
`,
  },
  {
    description: 'Library after contract',
    code: `
  contract MyContract {}

  library MyLibrary {}
`,
  },
  {
    description: 'Interface after library',
    code: `
  library MyLibrary {}

  interface MyInterface {}
`,
  },
  {
    description: 'Use for after state variable',
    code: `
contract MyContract {
  uint public x;
  
  using MyMathLib for uint;
}
`,
  },
  {
    description: 'External pure before external view',
    code: `
contract MyContract {
  function myExternalFunction() external {}
  function myExternalPureFunction() external pure {}
  function myExternalViewFunction() external view {}
}
`,
  },
  {
    description: 'Public pure before public view',
    code: `
contract MyContract {
  function myPublicFunction() public {}
  function myPublicPureFunction() public pure {}
  function myPublicViewFunction() public view {}
}
`,
  },
  {
    description: 'Internal pure before internal view',
    code: `
contract MyContract {
  function myInternalFunction() internal {}
  function myInternalPureFunction() internal pure {}
  function myInternalViewFunction() internal view {}
}
`,
  },
  {
    description: 'Private pure before private view',
    code: `
contract MyContract {
  function myPrivateFunction() private {}
  function myPrivatePureFunction() private pure {}
  function myPrivateViewFunction() private view {}
}
`,
  },

  {
    description: 'file-level constant before import',
    code: `
uint256 constant FOO_BAR = 42;
import {A} from "./A.sol";
`,
  },
  {
    description: 'file-level constant after type definition',
    code: `
struct foo { uint x; }
uint256 constant FOO_BAR = 42;
`,
  },
  {
    description: 'immutable after mutable',
    code: `
contract Foo {
uint bar;
uint immutable foo;
}
`,
  },
  {
    description: 'constant after immutable',
    code: `
contract Foo {
uint immutable bar;
uint constant foo;
}
`,
  },
  {
    description: 'constant after mutable',
    code: `
contract Foo {
uint bar;
uint constant foo;
}
`,
  },
  {
    description: 'file-scoped struct before enum',
    code: `
  struct MyStruct {
    uint x;
    uint y;
  }
  enum MyEnum {
    Foo,
    Bar
  }
`,
  },
  {
    description: 'contract-scoped struct before enum',
    code: `
contract MyContract {
  struct MyStruct {
    uint x;
    uint y;
  }
  enum MyEnum {
    Foo,
    Bar
  }
}
`,
  },
]
