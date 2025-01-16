const { multiLine } = require('../../common/contract-builder')

const noDuplicates = [
  {
    name: 'No Duplicates1',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool} from './Afool.sol';",
      "import {Afool2} from './Afool2.sol';",
      'contract Test { }'
    ),
  },
  {
    name: 'No Duplicates2',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool as Bfool} from './Afool.sol';",
      'contract Test { }'
    ),
  },
  {
    name: 'No Duplicates4',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool, Cfool} from './Afool.sol';",
      "import {Cfool as Dfool} from './Cfool.sol';",
      'contract Test { }'
    ),
  },
  {
    name: 'No Duplicates6',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import './SimpleLibrary.sol';",
      "import {SimpleLibrary as lib} from './SimpleLibrary2.sol';",
      'contract Test { }'
    ),
  },
  {
    name: 'No Duplicates7',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {SimpleLibrary} from './SimpleLibrary.sol';",
      'contract Test { }'
    ),
  },
  {
    name: 'No Duplicates8',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {LibraryA} from './LibraryA.sol';",
      "import {LibraryB} from './LibraryB.sol';",
      'contract Test { }'
    ),
  },
]

const duplicates = [
  {
    name: 'Duplicates1',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool, Afool as Bfool} from './Afool.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(inline) Afool'], // Inline duplication
  },
  {
    name: 'Duplicates2',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool} from './Afool.sol';",
      "import {Afool} from './Afool.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) Afool'], // Global duplication within the same path
  },
  {
    name: 'Duplicates3',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool} from './Afool.sol';",
      "import {Afool as FoolAlias} from './Afool.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) Afool'], // Global duplication with alias
  },
  {
    name: 'Duplicates4',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import './SimpleLibrary.sol';",
      "import {SimpleLibrary} from './folder/SimpleLibrary.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalDiffPath) SimpleLibrary'], // Import with and without name specification
  },
  {
    name: 'Duplicates5',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {IXTokenFactory} from '../../token/interfaces/IXTokenFactory.sol';",
      "import {IXTokenFactory} from '../../token/interfaces/IXTokenFactory2.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalDiffPath) IXTokenFactory'], // Global duplication
  },
  {
    name: 'Duplicates6',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {IXTokenFactory} from '../../token/interfaces/IXTokenFactory.sol';",
      "import {IXTokenFactory, IXTokenFactory as AliasFactory} from '../../token/interfaces/IXTokenFactory.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 2,
    message: ['(inline) IXTokenFactory', '(globalSamePath) IXTokenFactory'], // Mixed inline and global duplication
  },
  {
    name: 'Duplicates7',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {SharedLib} from './LibraryA.sol';",
      "import {SharedLib} from './LibraryB.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalDiffPath) SharedLib'], // Same object name from different libraries
  },
  {
    name: 'Duplicates8',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Token, Token as Tkn} from './LibraryA.sol';",
      "import {Token} from './LibraryB.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 2,
    message: ['(inline) Token', '(globalDiffPath) Token'], // Mixed inline and global duplication
  },
  {
    name: 'Duplicates9',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import './LibraryA.sol';",
      "import {LibraryA} from './LibraryB.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalDiffPath) LibraryA'], // Import with and without name specification different libraries
  },
  {
    name: 'Duplicates10',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import './LibraryA.sol';",
      "import {LibraryA} from './LibraryA.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) LibraryA'], // Import with and without name specification same libraries
  },
  {
    name: 'Duplicates11',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {SharedLib} from '../LibraryA.sol';",
      "import {SharedLib} from './nested/LibraryA.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalDiffPath) SharedLib'], // Same object imported from different nested paths
  },
  {
    name: 'Duplicates12',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import '@openzeppelin/contracts/token/ERC20/ERC20.sol';",
      "import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) ERC20'], // Standard library duplicate
  },
  {
    name: 'Duplicates13',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import '../token/interfaces/IXTokenWrapper.sol';",
      "import {IXTokenWrapper} from '../token/interfaces/IXTokenWrapper.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) IXTokenWrapper'], // Import with and without name specification
  },
  {
    name: 'Duplicates14',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';",
      "import {ReentrancyGuardUpgradeable as Rguard} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) ReentrancyGuardUpgradeable'], // Reentrancy guard duplication with alias
  },
  {
    name: 'Duplicates15',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import './LibraryA.sol';",
      "import './LibraryA.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 1,
    message: ['(globalSamePath) LibraryA'], // Same path imported multiple times
  },
  {
    name: 'Duplicates16',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {Afool, Afool as Fool1, Afool as Fool2, Afool as Fool3} from './Afool.sol';",
      "import {Afool} from './Afool.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 2,
    message: ['(inline) Afool', '(globalSamePath) Afool'], // Global duplication within the same path
  },
  {
    name: 'Duplicates17',
    code: multiLine(
      '// SPDX-License-Identifier: Apache-2.0',
      'pragma solidity ^0.8.0;',
      "import {IXTokenFactory} from '../../token/interfaces/IXTokenFactory2.sol';",
      "import {IXTokenFactory, IXTokenFactory as AliasFactory} from '../../token/interfaces/IXTokenFactory.sol';",
      "import '../../token/interfaces/IXTokenFactory.sol';",
      'contract Test { }'
    ),
    qtyDuplicates: 3,
    message: [
      '(inline) IXTokenFactory',
      '(globalSamePath) IXTokenFactory',
      '(globalDiffPath) IXTokenFactory',
    ], // Mixed inline and global duplication
  },
]

module.exports = { noDuplicates, duplicates }
