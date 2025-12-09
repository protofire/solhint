const assert = require('assert')
const linter = require('../../../lib/index')
const { assertNoErrors, assertErrorCount } = require('../../common/asserts')
const { multiLine } = require('../../common/contract-builder')

describe('Linter - foundry-no-block-time-number (functional)', () => {
  it('Should report when using block.timestamp inside tests/ dir', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_timestamp() public {',
      '    uint256 x = block.timestamp;',
      '    x;',
      '  }',
      '}'
    )

    const fileName = '/project/tests/T.sol'
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertErrorCount(report, 1)
    assert.ok(
      report.reports[0].message.includes(
        'Avoid `block.timestamp` in Foundry tests. Use `vm.getBlockTimestamp()` instead.'
      ),
      `Unexpected message: ${report.reports[0] && report.reports[0].message}`
    )
  })

  it('Should report when using block.number inside test/ dir', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_number() public {',
      '    uint256 n = block.number;',
      '    n;',
      '  }',
      '}'
    )

    const fileName = '/project/test/T.sol'
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertErrorCount(report, 1)
    assert.ok(
      report.reports[0].message.includes(
        'Avoid `block.number` in Foundry tests. Use `vm.getBlockNumber()` instead.'
      ),
      `Unexpected message: ${report.reports[0] && report.reports[0].message}`
    )
  })

  it('Should report when using block.number inside test/folder1/folder2 dir', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_number() public {',
      '    uint256 n = block.number;',
      '    n;',
      '  }',
      '}'
    )

    const fileName = '/project/test/folder1/folder2/T.sol'
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertErrorCount(report, 1)
    assert.ok(
      report.reports[0].message.includes(
        'Avoid `block.number` in Foundry tests. Use `vm.getBlockNumber()` instead.'
      ),
      `Unexpected message: ${report.reports[0] && report.reports[0].message}`
    )
  })

  it('Should report twice when both block.timestamp and block.number are used', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_both() public {',
      '    uint256 a = block.timestamp;',
      '    uint256 b = block.number;',
      '    (a); (b);',
      '  }',
      '}'
    )

    const fileName = '/repo/tests/helpers/T.sol'
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertErrorCount(report, 2)

    // Accept any order; check that both messages are present
    const messages = report.reports.map((r) => r.message)
    assert.ok(
      messages.some((m) => m.includes('Avoid `block.timestamp`')),
      `Messages: ${messages}`
    )
    assert.ok(
      messages.some((m) => m.includes('Avoid `block.number`')),
      `Messages: ${messages}`
    )
  })

  it('Should NOT report outside configured test directories', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract Prod {',
      '  function f() public view returns (uint256) {',
      '    return block.timestamp + block.number;',
      '  }',
      '}'
    )

    const fileName = '/project/contracts/Prod.sol' // not under test/tests
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertNoErrors(report)
  })

  it('Should respect custom testDirs config (e.g., ["spec","integration"])', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_custom_dir() public {',
      '    uint256 a = block.number;',
      '    a;',
      '  }',
      '}'
    )

    const fileName = '/project/spec/T.sol'
    const config = {
      rules: {
        'foundry-no-block-time-number': ['error', ['spec', 'integration']],
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertErrorCount(report, 1)
    assert.ok(
      report.reports[0].message.includes(
        'Avoid `block.number` in Foundry tests. Use `vm.getBlockNumber()` instead.'
      ),
      `Unexpected message: ${report.reports[0] && report.reports[0].message}`
    )
  })

  it('Should match directory names case-insensitively', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_case_insensitive() public {',
      '    uint256 a = block.timestamp;',
      '    a;',
      '  }',
      '}'
    )

    const fileName = '/project/TeStS/T.sol' // mixed case
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertErrorCount(report, 1)
    assert.ok(
      report.reports[0].message.includes(
        'Avoid `block.timestamp` in Foundry tests. Use `vm.getBlockTimestamp()` instead.'
      ),
      `Unexpected message: ${report.reports[0] && report.reports[0].message}`
    )
  })

  it('Should NOT report if no block.timestamp/number usage exists (even under tests/)', () => {
    const code = multiLine(
      'pragma solidity ^0.8.24;',
      'contract T {',
      '  function test_ok() public {',
      '    uint256 x = 1;',
      '    (x);',
      '  }',
      '}'
    )

    const fileName = '/project/tests/T.sol'
    const config = {
      rules: {
        'foundry-no-block-time-number': 'error',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertNoErrors(report)
  })
})
