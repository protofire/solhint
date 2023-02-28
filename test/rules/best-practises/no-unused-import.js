const linter = require('../../../lib/index')
const { assertNoErrors, assertErrorMessage, assertErrorCount } = require('../../common/asserts')

describe('Linter - no-unused-import', () => {
  it('should raise when imported name is not used', () => {
    const code = `import {A} from './A.sol';`

    const report = linter.processStr(code, {
      rules: { 'no-unused-import': 'error' },
    })
    assertErrorCount(report, 1)
    assertErrorMessage(report, 'imported name A is not used')
  })

  it('should report correct name when unused import is aliased', () => {
    const code = `import {A as B} from './A.sol';`

    const report = linter.processStr(code, {
      rules: { 'no-unused-import': 'error' },
    })
    assertErrorCount(report, 1)
    assertErrorMessage(report, 'imported name B is not used')
  })

  it('should raise when some of the imported names are not used', () => {
    const code = `import {A, B} from './A.sol'; contract C is A {}`

    const report = linter.processStr(code, {
      rules: { 'no-unused-import': 'error' },
    })
    assertErrorCount(report, 1)
    assertErrorMessage(report, 'imported name B is not used')
  })

  it('should not raise when contract name is used as a type for a memory variable', () => {
    const code = `
    import {ERC20} from './ERC20.sol';
    contract A {
      function fun () public {
        ERC20 funToken = address(0);
      }
    }`

    const report = linter.processStr(code, {
      rules: { 'no-unused-import': 'error' },
    })
    assertNoErrors(report)
  })
  ;[
    {
      description: 'a field of an imported name is used',
      code: `import {Vm} from './Vm.sol';
            contract A {
              function fun () public {
                Vm.cheat('code');
              }
            }`,
    },
    {
      description: 'imported name is used in new statement',
      code: `import {OtherContract} from './Contract.sol';
            contract Factory {
              function deploy () public returns (address){
                return new OtherContract();
              }
            }`,
    },
    {
      description: 'imported name is used in array definition',
      code: `import {B} from './Contract.sol';
            contract A {
              function fun () public {
                B[] memory someArray;
              }
            }`,
    },
    {
      description: 'member of imported name is used in array definition',
      code: `import {B} from './Contract.sol';
            contract A {
              function fun () public {
                B.field[] memory someArray;
              }
            }`,
    },
    {
      description: 'imported name is used in type cast',
      code: `import {ImportedType} from './Contract.sol';
            contract A {
              function fun () public {
                ImportedType(address(0));
              }
            }`,
    },
    {
      description: 'imported name is used as a custom error',
      code: `import {SpecialError} from './Contract.sol';
            contract A {
              function fun () public {
                revert SpecialError();
              }
            }`,
    },
    {
      description: 'contract name is used for inheritance',
      code: `import {A} from './A.sol'; contract B is A {}`,
    },
    {
      description: 'aliased contract name is used',
      code: `import {A as B} from './A.sol'; contract C is B {}`,
    },
    {
      description: 'libary name is used in a using ... for statement',
      code: `import {A} from './A.sol'; contract B { using A for uint256; }`,
    },
    {
      description: 'contract name is used in a state variable declaration',
      code: ` import {A} from './A.sol'; contract B { A public statevar; }`,
    },
    {
      description: 'imported subtype is used in a state variable declaration',
      code: `import {A} from './A.sol'; contract B { A.thing public statevar; }`,
    },
    {
      description: 'imported type is used in a function parameter declaration',
      code: `import {A} from './A.sol'; contract B { function (A.thing statevar) public {} }`,
    },
  ].forEach(({ description, code }) => {
    it(`should not raise when ${description}`, () => {
      const report = linter.processStr(code, {
        rules: { 'no-unused-import': 'error' },
      })
      assertNoErrors(report)
    })
  })
})
