// test/best-practices/no-unused-private-funcs.js

const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('../../common/asserts')
const linter = require('../../../lib/index')
const { contractWith, multiLine } = require('../../common/contract-builder')

// Full integration fixture with many edge cases (recursion, modifiers, libs, abstract, overloads)
const FIXTURE_CODE = require('../../fixtures/best-practices/no-unused-private-funcs')

describe('Linter - no-unused-private-funcs', () => {
  it('should report all expected unused private functions in the integration fixture', () => {
    const report = linter.processStr(FIXTURE_CODE, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    // From the fixture comments:
    //  - PrivateFuncBasic._neverCalled
    //  - PrivateFuncRecursion._neverMutual
    //  - PrivateFuncOverloads._overload(bytes32)
    //  - AbstractWithPrivate._helper
    //  - PrivateLib._unusedInLib
    assertWarnsCount(report, 5)

    // Ensure messages contain function name AND contract name
    assertErrorMessage(report, 0, 'Private function "_neverCalled" in contract "PrivateFuncBasic"')
    assertErrorMessage(
      report,
      1,
      'Private function "_neverMutual" in contract "PrivateFuncRecursion"'
    )
    // For overload, the message only uses the function name, not the full signature
    assertErrorMessage(report, 2, 'Private function "_overload" in contract "PrivateFuncOverloads"')
    assertErrorMessage(report, 3, 'Private function "_helper" in contract "AbstractWithPrivate"')
    assertErrorMessage(report, 4, 'Private function "_unusedInLib" in contract "PrivateLib"')
  })

  it('should warn for a simple unused private function', () => {
    const code = contractWith(`
      function _neverUsed() private pure {
        // dead code
      }
    `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'Private function "_neverUsed"')
  })

  it('should NOT warn when a private function is called from the same contract', () => {
    const code = contractWith(`
      function _helper() private pure returns (uint256) {
        return 1;
      }

      function entry() external pure returns (uint256) {
        return _helper();
      }
    `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should NOT warn when a private function is used inside a modifier', () => {
    const code = contractWith(
      multiLine(
        'uint256 private counter;',
        '',
        'function _bump() private {',
        '  counter++;',
        '}',
        '',
        'modifier autoBump() {',
        '  _bump();',
        '  _;',
        '}',
        '',
        'function doSomething() external autoBump {',
        '  // business logic here',
        '}'
      )
    )

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should ignore non-private functions (public / external / internal)', () => {
    const code = contractWith(`
      function _internalHelper() internal pure returns (uint256) {
        return 1;
      }

      function _publicHelper() public pure returns (uint256) {
        return 2;
      }

      function _externalHelper() external pure returns (uint256) {
        return 3;
      }
    `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    // Rule only targets private functions, so no warnings here
    assertNoWarnings(report)
  })

  it('should report the unused overload when only one private overload is used', () => {
    // NOTE: contractWith() wraps this into a simple contract like:
    // contract A { ... }
    const code = contractWith(
      multiLine(
        'function _overload(uint256 x) private pure returns (uint256) {',
        '  return x + 1;',
        '}',
        '',
        'function _overload(bytes32) private pure returns (uint256) {',
        '  return 999;',
        '}',
        '',
        'function callOne() external pure returns (uint256) {',
        '  return _overload(10);',
        '}'
      )
    )

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    // Only the bytes32 overload should be considered unused
    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'Private function "_overload"')
    // The message also contains the contract name, but we do not assert it here
    // because contractWith() generates a helper name (implementation detail).
  })

  it('should NOT warn when both private overloads are used', () => {
    const code = contractWith(
      multiLine(
        'function _overload(uint256 x) private pure returns (uint256) {',
        '  return x + 1;',
        '}',
        '',
        'function _overload(bytes32 data) private pure returns (uint256) {',
        '  // use length to avoid unused parameter warning in other rules',
        '  return uint256(data) + 1;',
        '}',
        '',
        'function callBoth(uint256 x, bytes32 data) external pure returns (uint256) {',
        '  uint256 r = _overload(x);',
        '  r += _overload(data);',
        '  return r;',
        '}'
      )
    )

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should handle same private name in different contracts independently', () => {
    const code = `
    contract A {
      function _helper() private pure returns (uint256) {
        return 1;
      }
      function entry() external pure returns (uint256) {
        return _helper();
      }
    }

    contract B {
      function _helper() private pure returns (uint256) {
        return 2;
      }
    }
  `

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    // Solo la de B debería ser unused
    assertWarnsCount(report, 1)
    assertErrorMessage(
      report,
      0,
      'Private function "_helper" in contract "B" is never used within its defining contract'
    )
  })

  it('should treat calls via this._fn() as usage of private function', () => {
    const code = contractWith(`
      function _internalLogic() private pure returns (uint256) {
        return 1;
      }

      function entry() external pure returns (uint256) {
        return this._internalLogic();
      }
  `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when multiple private overloads with different types are all used', () => {
    const code = contractWith(`
    function _over(uint256 x) private pure returns (uint256) {
      return x + 1;
    }

    function _over(string memory s) private pure returns (uint256) {
      return bytes(s).length;
    }

    function callAll(uint256 x, string memory s) external pure returns (uint256) {
      return _over(x) + _over(s);
    }
  `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when call type is ambiguous and could match multiple private overloads', () => {
    const code = contractWith(`
    function _over(uint256 x) private pure returns (uint256) {
      return x + 1;
    }

    function _over(bytes32 y) private pure returns (uint256) {
      return uint256(y) + 1;
    }

    function callAmbiguous(bytes32 data) external pure returns (uint256) {
      // Here the rule sees an Identifier (data) and classifies it as "unknown".
      // Cannot distinguish between uint256 and bytes32, so marks both overloads as used.
      return _over(data);
    }
  `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    // We explicitly document that in this case NOTHING is reported.
    assertNoWarnings(report)
  })

  it('should consider private function used when called from constructor and report another dead one', () => {
    const code = contractWith(`
    uint256 public value;

    function _init() private {
      value = 1;
    }

    function _neverUsed() private pure returns (uint256) {
      return 42;
    }

    constructor() {
      _init();
    }
  `)

    const report = linter.processStr(code, {
      rules: { 'no-unused-private-funcs': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 0, 'Private function "_neverUsed"')
  })
})
