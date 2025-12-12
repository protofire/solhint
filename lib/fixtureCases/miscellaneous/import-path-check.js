const { multiLine } = require('../../common/contract-builder')

const successCases = [
  {
    name: 'Should succeed when relative import (same folder)',
    code: multiLine('pragma solidity ^0.8.0;', 'import "./Lib.sol";', 'contract Test {}'),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/project/Test.sol': true,
      '/project/Lib.sol': true,
    },
    searchOn: ['/project'],
  },
  {
    name: 'Should succeed when relative import with parent folder',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "../shared/Helper.sol";',
      'contract Test {}'
    ),
    fileName: '/project/contracts/Test.sol',
    fakeFileSystem: {
      '/project/contracts/Test.sol': true,
      '/project/shared/Helper.sol': true,
    },
    searchOn: ['/project'],
  },
  {
    name: 'Should succeed when absolute path import',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "/usr/lib/solc/Standard.sol";',
      'contract Test {}'
    ),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/project/Test.sol': true,
      '/usr/lib/solc/Standard.sol': true,
    },
    searchOn: [],
  },
  {
    name: 'Should succeed when importing from node_modules',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
      'contract Test {}'
    ),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/project/Test.sol': true,
      '/project/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol': true,
    },
    searchOn: ['/project/node_modules'],
  },
  {
    name: 'Should succeed when importing from global npm',
    code: multiLine('pragma solidity ^0.8.0;', 'import "solhint/solhint.sol";', 'contract Test {}'),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/usr/local/lib/node_modules/solhint/solhint.sol': true,
    },
    searchOn: ['/usr/local/lib/node_modules'],
  },
  {
    name: 'Should succeed when importing from custom project subdir',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "./modules/math/Calc.sol";',
      'contract Test {}'
    ),
    fileName: '/project/src/Test.sol',
    fakeFileSystem: {
      '/project/src/Test.sol': true,
      '/project/src/modules/math/Calc.sol': true,
    },
    searchOn: ['/project/src'],
  },
  {
    name: 'Should succeed when importing from foundry-style lib folder',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "foundry-lib/utils.sol";',
      'contract Test {}'
    ),
    fileName: '/project/contracts/MyContract.sol',
    fakeFileSystem: {
      '/project/lib/foundry-lib/utils.sol': true,
    },
    searchOn: ['/project/lib'],
  },
  {
    name: 'Should succeed when importing with relative "./" in node_modules',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "./node_modules/package/Inner.sol";',
      'contract Test {}'
    ),
    fileName: '/project/contracts/Test.sol',
    fakeFileSystem: {
      '/project/contracts/Test.sol': true,
      '/project/contracts/node_modules/package/Inner.sol': true,
    },
    searchOn: ['/project/contracts'],
  },
]

const errorCases = [
  {
    name: 'Should fail when missing import (relative path)',
    code: multiLine('pragma solidity ^0.8.0;', 'import "./Missing.sol";', 'contract Test {}'),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/project/Test.sol': true,
    },
    searchOn: ['/project'],
    expectedErrors: 1,
    message: [`Import in /project/Test.sol doesn't exist in: ./Missing.sol`],
  },
  {
    name: 'Should fail when missing import (from node_modules)',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";',
      'contract Test {}'
    ),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/project/Test.sol': true,
    },
    searchOn: ['/project/node_modules'],
    expectedErrors: 1,
    message: [
      `Import in /project/Test.sol doesn't exist in: @openzeppelin/contracts/token/ERC20/ERC20.sol`,
    ],
  },
  {
    name: 'Should fail when importing with typo in filename',
    code: multiLine('pragma solidity ^0.8.0;', 'import "./Libb.sol";', 'contract Test {}'), // typo on import
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/project/Test.sol': true,
      '/project/Lib.sol': true,
    },
    searchOn: ['/project'],
    expectedErrors: 1,
    message: ["Import in /project/Test.sol doesn't exist in: ./Libb.sol"],
  },
  {
    name: 'Should fail when importing from yarn global with wrong subpath',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "some-yarn-lib/core.sol";',
      'contract Test {}'
    ),
    fileName: '/project/Test.sol',
    fakeFileSystem: {
      '/home/user/.yarn/global/node_modules/some-yarn-lib/utils.sol': true, // wrong file
    },
    searchOn: ['/home/user/.yarn/global/node_modules'],
    expectedErrors: 1,
    message: ["Import in /project/Test.sol doesn't exist in: some-yarn-lib/core.sol"],
  },
  {
    name: 'Should fail when importing with deep relative path',
    code: multiLine(
      'pragma solidity ^0.8.0;',
      'import "../../../common/Ownable.sol";',
      'contract Test {}'
    ),
    fileName: '/project/src/modules/test/MyContract.sol',
    fakeFileSystem: {
      '/project/src/modules/test/MyContract.sol': true,
      // missing Ownable.sol
    },
    searchOn: ['/project'],
    expectedErrors: 1,
    message: [
      "Import in /project/src/modules/test/MyContract.sol doesn't exist in: ../../../common/Ownable.sol",
    ],
  },
]

module.exports = { successCases, errorCases }
