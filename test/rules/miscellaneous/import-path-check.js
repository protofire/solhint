const path = require('path')
const assert = require('assert')
const sinon = require('sinon')
const linter = require('../../../lib/index')
const { assertNoErrors, assertErrorCount, assertWarnsCount } = require('../../common/asserts')
const { multiLine } = require('../../common/contract-builder')
const { successCases, errorCases } = require('../../fixtures/miscellaneous/import-path-check')

describe('import-path-check (mocked fs)', () => {
  let existsStub
  let currentFakeFileSystem = new Set()

  // Normalize paths
  const normalizePath = (p) => {
    const resolved = path.resolve(p)
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved
  }

  beforeEach(() => {
    existsStub = sinon.stub(require('fs-extra'), 'existsSync').callsFake((filePath) => {
      return currentFakeFileSystem.has(normalizePath(filePath))
    })
  })

  afterEach(() => {
    existsStub.restore()
    currentFakeFileSystem = new Set()
  })

  it(`Should work when using solhint:recommended`, () => {
    const fakeFileSystem = {
      '/project/Test.sol': true,
      '/project/Lib.sol': true,
    }
    const fileName = '/project/Test.sol'
    currentFakeFileSystem = new Set(Object.keys(fakeFileSystem).map(normalizePath))

    const code = multiLine('pragma solidity ^0.8.0;', 'import "./Lib.sol";', 'contract Test {}')

    const config = {
      extends: 'solhint:recommended',
      rules: {
        'compiler-version': 'off',
        'no-empty-blocks': 'off',
        'no-global-import': 'off',
        'use-natspec': 'off',
      },
    }

    const report = linter.processStr(code, config, fileName)

    assertNoErrors(report)
  })

  it(`Should fail when using solhint:recommended`, () => {
    const fakeFileSystem = {
      '/project/Test.sol': true,
    }
    const fileName = '/project/Test.sol'

    currentFakeFileSystem = new Set(Object.keys(fakeFileSystem).map(normalizePath))

    const code = multiLine('pragma solidity ^0.8.24;', 'import "./Lib.sol";', 'contract Test {}')

    const config = {
      extends: 'solhint:recommended',
      rules: {
        'no-empty-blocks': 'off',
        'no-global-import': 'off',
        'use-natspec': 'off',
      },
    }
    const report = linter.processStr(code, config, fileName)

    assertWarnsCount(report, 1)

    const message = `Import in ${fileName} doesn't exist in: ./Lib.sol`
    assert.ok(report.reports[0].message.includes(message))
  })

  successCases.forEach((testCase) => {
    it(`${testCase.name}`, () => {
      currentFakeFileSystem = new Set(Object.keys(testCase.fakeFileSystem).map(normalizePath))

      const config = {
        rules: {
          'import-path-check': ['error', testCase.searchOn],
        },
      }
      const report = linter.processStr(testCase.code, config, testCase.fileName)

      assertNoErrors(report)
    })
  })

  errorCases.forEach((testCase) => {
    it(`${testCase.name}`, () => {
      currentFakeFileSystem = new Set(Object.keys(testCase.fakeFileSystem).map(normalizePath))

      const config = {
        rules: {
          'import-path-check': ['error', testCase.searchOn],
        },
      }

      const report = linter.processStr(testCase.code, config, testCase.fileName)

      assertErrorCount(report, testCase.expectedErrors)
      assert.ok(report.reports[0].message.includes(testCase.message))
    })
  })
})
