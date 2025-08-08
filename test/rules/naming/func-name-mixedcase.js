const assert = require('assert')
const linter = require('../../../lib/index')
const { multiLine } = require('../../common/contract-builder')
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - func-name-mixedcase', () => {
  it('should raise incorrect func name error', () => {
    const code = contractWith('function AFuncName () public {}')

    const report = linter.processStr(code, {
      rules: { 'func-name-mixedcase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('mixedCase'))
  })

  it('should dot raise incorrect func name error', () => {
    const code = contractWith('function aFunc1Nam23e () public {}')

    const report = linter.processStr(code, {
      rules: { 'func-name-mixedcase': 'error' },
    })

    assert.equal(report.errorCount, 0)
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

        assert.equal(report.errorCount, 0)
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

      assert.equal(report.errorCount, 0)
    })

    it('should fail when inside interface but returning multiple unnamed values', () => {
      const code = multiLine(
        'pragma solidity ^0.8.20;',
        'interface IBad {',
        '  function START_TIME() external view returns (uint256, uint256);',
        '}'
      )

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assert.equal(report.errorCount, 1)
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

      assert.equal(report.errorCount, 1)
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

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should fail when SNAKE_CASE in non-interface contract functions', () => {
      const code = contractWith('function START_TIME() public view returns (uint256) { return 1; }')

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assert.equal(report.errorCount, 1)
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

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('allows $ in mixedCase names (regresión de tus tests previos)', () => {
      const code = contractWith('function aFunc$1Nam23e () public {}')

      const report = linter.processStr(code, { rules: { 'func-name-mixedcase': 'error' } })

      assert.equal(report.errorCount, 0)
    })
  })
})
