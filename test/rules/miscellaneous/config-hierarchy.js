const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const rimraf = require('rimraf')
const linter = require('../../../lib/index')
const { assertErrorCount } = require('../../common/asserts')

// Helper to create nested temporary directories and return their path
function createTempProject(
  structure,
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'solhint-hier-'))
) {
  Object.entries(structure).forEach(([name, content]) => {
    const fullPath = path.join(root, name)
    if (typeof content === 'string') {
      fs.writeFileSync(fullPath, content)
    } else if (typeof content === 'object') {
      fs.mkdirSync(fullPath)
      createTempProject(content, fullPath)
    }
  })
  return root
}

function toGlobPattern(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/')
}

describe('Solhint config hierarchy (unit)', function () {
  let tmpProject
  afterEach(() => {
    if (tmpProject) rimraf.sync(tmpProject)
    tmpProject = null
  })

  it('should apply only root .solhint.json if no subdir config', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'double'] },
      }),
      'Foo.sol': "pragma solidity ^0.8.0; contract Foo { string s = 'single'; }",
    })

    const filePath = path.join(tmpProject, 'Foo.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    assertErrorCount(reports[0], 1)
  })

  it('should override root config with subdir .solhint.json', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'double'] },
      }),
      src: {
        '.solhint.json': JSON.stringify({
          rules: { quotes: ['error', 'single'] },
        }),
        'Bar.sol': 'pragma solidity ^0.8.0; contract Bar { string s = "double"; }',
      },
    })

    const filePath = path.join(tmpProject, 'src', 'Bar.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    // Expects error for using double quotes (should be single)
    assertErrorCount(reports[0], 1)
  })

  it('should merge rules from both root and subdir configs', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'double'], 'func-visibility': 'error' },
      }),
      test: {
        '.solhint.json': JSON.stringify({
          rules: { quotes: ['error', 'single'] },
        }),
        'Test.sol': `pragma solidity ^0.8.0; contract T { function f() {} string s = "double"; }`,
      },
    })

    const filePath = path.join(tmpProject, 'test', 'Test.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    // Expects two errors: one for double quotes (should be single), one for missing visibility
    assertErrorCount(reports[0], 2)
  })

  it('should apply config from closest .solhint.json only if no root', function () {
    tmpProject = createTempProject({
      src: {
        '.solhint.json': JSON.stringify({
          rules: { quotes: ['error', 'single'] },
        }),
        'Bar.sol': 'pragma solidity ^0.8.0; contract Bar { string s = "double"; }',
      },
    })

    const filePath = path.join(tmpProject, 'src', 'Bar.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    assertErrorCount(reports[0], 1)
  })

  it('should respect hierarchy for deeply nested files', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'double'] },
      }),
      contracts: {
        '.solhint.json': JSON.stringify({
          rules: { quotes: ['error', 'single'] },
        }),
        lib: {
          '.solhint.json': JSON.stringify({
            rules: { quotes: ['error', 'double'] },
          }),
          'Lib.sol': "pragma solidity ^0.8.0; contract L { string s = 'single'; }",
        },
      },
    })

    // contracts/lib/Lib.sol should use "double" due to the config in contracts/lib/.solhint.json
    const filePath = path.join(tmpProject, 'contracts', 'lib', 'Lib.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    // single quote, valid only if double is required
    assertErrorCount(reports[0], 1)
  })

  it('should not raise errors if file matches subdir config', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'double'] },
      }),
      test: {
        '.solhint.json': JSON.stringify({
          rules: { quotes: ['error', 'single'] },
        }),
        'Test.sol': `pragma solidity ^0.8.0; contract T { string s = 'single'; }`,
      },
    })

    const filePath = path.join(tmpProject, 'test', 'Test.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    // single quote, valid for the subdir
    assertErrorCount(reports[0], 0)
  })

  it('should apply root config if no .solhint.json in subdir', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'single'] },
      }),
      src: {
        'Bar.sol': 'pragma solidity ^0.8.0; contract Bar { string s = "double"; }',
      },
    })

    const filePath = path.join(tmpProject, 'src', 'Bar.sol')
    const reports = linter.processPath(toGlobPattern(filePath))
    assertErrorCount(reports[0], 1)
  })

  it('should apply subdir config for files in subdir and root config for root files', function () {
    tmpProject = createTempProject({
      '.solhint.json': JSON.stringify({
        rules: { quotes: ['error', 'double'] },
      }),
      'Root.sol': "pragma solidity ^0.8.0; contract R { string s = 'single'; }",
      contracts: {
        '.solhint.json': JSON.stringify({
          rules: { quotes: ['error', 'single'] },
        }),
        'Sub.sol': `pragma solidity ^0.8.0; contract S { string s = "double"; }`,
      },
    })

    // normalize paths for glob: relative and with "/"
    const rootFile = path
      .relative(process.cwd(), path.join(tmpProject, 'Root.sol'))
      .replace(/\\/g, '/')
    const subFile = path
      .relative(process.cwd(), path.join(tmpProject, 'contracts', 'Sub.sol'))
      .replace(/\\/g, '/')

    const rootReports = linter.processPath(rootFile)
    const subReports = linter.processPath(subFile)
    // root: should be double
    assertErrorCount(rootReports[0], 1)
    // subdir: should be single
    assertErrorCount(subReports[0], 1)
  })
})
