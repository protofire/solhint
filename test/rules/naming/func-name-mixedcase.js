const assert = require('assert')
const linter = require('../../../lib/index')
const { multiLine } = require('../../common/contract-builder')
const contractWith = require('../../common/contract-builder').contractWith
const { assertErrorCount, assertNoErrors } = require('../../common/asserts')

describe('Linter - func-name-mixedcase', () => {
  it('should raise incorrect func name error', () => {
    const code = contractWith('function AFuncName () public {}')

    const report = linter.processStr(code, {
      rules: { 'func-name-mixedcase': 'error' },
    })

    assertErrorCount(report, 1)
    assert.ok(report.messages[0].message.includes('mixedCase'))
  })

  it('should dot raise incorrect func name error', () => {
    const code = contractWith('function aFunc1Nam23e () public {}')

    const report = linter.processStr(code, {
      rules: { 'func-name-mixedcase': 'error' },
    })

    assertNoErrors(report)
  })

  describe('Function names with $ character', () => {
    const WITH_$ = {
      'starting with $': contractWith('function $aFunc1Nam23e () public {}'),
      'containing a $': contractWith('function aFunc$1Nam23e () public {}'),
      'ending with $': contractWith('function aFunc1Nam23e$ () public {}'),
      'only with $': contractWith('function $() public {}'),
    }

    for (const [key, code] of Object.entries(WITH_$)) {
      it(`should not raise func name error for Functions ${key}`, () => {
        const report = linter.processStr(code, {
          rules: { 'func-name-mixedcase': 'error' },
        })

        assertNoErrors(report)
      })
    }
  })

  describe('Interface function names representing a constant', () => {
    it('should NOT raise mixedCase name error', () => {
      const code = multiLine(
        '// SPDX-License-Identifier: Apache-2.0',
        'pragma solidity ^0.8.0;',
        '',
        'interface IA {',
        '/// @dev This is a constant state variable',
        'function START_TIME() external view returns (uint256);',
        '}',
        '',
        'contract A is IA {',
        '    /// @inheritdoc IA',
        '    uint256 public constant override START_TIME = 1;',
        '}'
      )

      const report = linter.processStr(code, {
        rules: { 'func-name-mixedcase': 'error' },
      })

      assertNoErrors(report)
    })

    it('should fail when inside interface but returning multiple unnamed values', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IBad {',
        '  function START_TIME() external view returns (uint256, uint256);',
        '}'
      )

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should fail when SNAKE_CASE in interface is missing `view` (not a getter-like signature)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IBad {',
        '  function START_TIME() external returns (uint256);',
        '}'
      )

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should fail when SNAKE_CASE interface function has parameters (not a getter-like signature)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IBad {',
        '  function START_TIME(address who) external view returns (uint256);',
        '}'
      )

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should fail when SNAKE_CASE in non-interface contract functions', () => {
      const code = contractWith('function START_TIME() public view returns (uint256) { return 1; }')

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should fail when inside interface but returning multiple named values', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IBad {',
        '  function START_TIME() external view returns (uint256 a, uint256 b);',
        '}'
      )

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('allows $ in mixedCase names (regression of former tests)', () => {
      const code = contractWith('function aFunc$1Nam23e () public {}')

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertNoErrors(report)
    })

    it('allows IERC20 as return (contract/interface type)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IERC20 { function totalSupply() external view returns (uint256); }',
        'interface I {',
        '  function TOKEN() external view returns (IERC20);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertNoErrors(report)
    })

    it('allows UDVT like UD60x18 as return', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'type UD60x18 is uint256;',
        'interface I {',
        '  function UNLOCK_PERCENTAGE() external view returns (UD60x18);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertNoErrors(report)
    })

    it('allows enum as return', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'enum Status { Init, Live, Done }',
        'interface I {',
        '  function CURRENT_STATUS() external view returns (Status);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertNoErrors(report)
    })

    it('rejects struct as return (UserDefinedTypeName with storageLocation)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'struct Info { uint256 a; uint256 b; }',
        'interface I {',
        '  function DATA() external view returns (Info memory);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('rejects array as return', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface I {',
        '  function VALUES() external view returns (uint256[] memory);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })
      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('rejects multiple returns (tuple)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface I {',
        '  function START_TIME() external view returns (uint256, uint256);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })
      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('rejects pure (only view allowed for constant/immutable getters)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface I {',
        '  function MAGIC_NUMBER() external pure returns (uint256);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })
      assertErrorCount(report, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('still allows mixedCase with $ (regression)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface I {',
        '  function aFunc$1Nam23e() external view returns (uint256);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertNoErrors(report)
    })

    it('allows string as return (elementary type)', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface I {',
        '  function NAME() external view returns (string memory);',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assertNoErrors(report)
    })

    it('rejects IERC20 return when declared in a non-interface contract', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IERC20 { function totalSupply() external view returns (uint256); }',
        'contract C {',
        '  function TOKEN() external view returns (IERC20) {',
        '    return IERC20(address(0));',
        '  }',
        '}'
      )
      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })
      assertErrorCount(report, 1)

      assert.ok(report.messages[0].message.includes('mixedCase'))
    })
  })
})
