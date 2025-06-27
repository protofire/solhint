const fs = require('fs-extra')
const path = require('path')
const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'
const LOCATION_REPLACEMENT_FLAG = '[~dependenciesPath]'
const DEFAULT_LOCATIONS = [
  // import related to base path
  path.resolve(process.cwd()),
  // typical contracts path
  path.resolve(process.cwd(), 'contracts'),
  path.resolve(process.cwd(), 'src'),
  // hardhat typical paths
  path.resolve(process.cwd(), 'node_modules'),
  path.resolve(process.cwd(), 'artifacts'),
  path.resolve(process.cwd(), 'cache'),
  // foundry typical paths
  path.resolve(process.cwd(), 'lib'),
  path.resolve(process.cwd(), 'out'),
  // npm global (Linux/macOS)
  '/usr/local/lib/node_modules',
  // nvm global (Linux/macOS)
  path.join(process.env.HOME || '', '.nvm/versions/node', process.version, 'lib/node_modules'),
  // yarn global (Linux/macOS)
  path.join(process.env.HOME || '', '.yarn/global/node_modules'),
  // npm global (Windows)
  path.join(process.env.APPDATA || '', 'npm/node_modules'),
  // yarn global (Windows)
  path.join(process.env.LOCALAPPDATA || '', 'Yarn/Data/global/node_modules'),
]

const ruleId = 'import-path-check'
const meta = {
  type: 'miscellaneous',

  docs: {
    description: `Check if an import file exits in target path`,
    category: 'Miscellaneous',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: 'Array of allowed base path patterns for imports.',
        default: 'read DEFAULT_LOCATIONS',
      },
    ],
    notes: [
      {
        note: 'Rule checks relative and absolute path first. Then checks for each dependency path in config file',
      },
      {
        note: '`searchOn`: an array of paths to check in specified order',
      },
      {
        note: 'If `searchOn` is empty only `DEFAULT_LOCATIONS` are used.',
      },
      {
        note: 'If `searchOn` has value, will be concatenated with DEFAULT_LOCATIONS.',
      },
      {
        note: 'If config has `extends:recommended` or `all` and rule is overwritten with `searchOn`, values are concatenated with DEFAULT_LOCATIONS.',
      },
      {
        note: [
          '*Default Locations:*',
          '/[`~current-project`]',
          '/[`~current-project`]/contracts',
          '/[`~current-project`]/src',
          '/[`~current-project`]/node_modules',
          '/[`~current-project`]/artifacts',
          '/[`~current-project`]/cache',
          '/[`~current-project`]/lib',
          '/[`~current-project`]/out',
          '/usr/local/lib/node_modules',
          '/home/[`~user`]/.nvm/versions/node/[~node-version]/lib/node_modules',
          '/home/[`~user`]/.yarn/global/node_modules',
          '/npm/node_modules (for Windows)',
          '/Yarn/Data/global/node_modules (for Windows)',
        ],
      },
      {
        note: 'WINDOWS OS file structure has not been thoroughly tested.',
      },
    ],
  },

  fixable: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, [LOCATION_REPLACEMENT_FLAG]],
  schema: {
    type: 'array',
    description: 'Array of folder names to search',
    items: { type: 'string', errorMessage: 'Each item must be a string' },
  },
}

class ImportPathChecker extends BaseChecker {
  constructor(reporter, config, fileName) {
    super(reporter, ruleId, meta)
    this.searchOn = []
    const arr = config ? config.getArray(ruleId) : []
    if (!Array.isArray(arr) || arr.length === 0 || arr[0] === LOCATION_REPLACEMENT_FLAG) {
      this.searchOn = [...DEFAULT_LOCATIONS]
    } else {
      this.searchOn = arr.concat(DEFAULT_LOCATIONS)
    }

    this.fileName = fileName
  }

  ImportDirective(node) {
    const normalizedImportPath = node.path
    const filesExist = this.resolveImportPath(normalizedImportPath)
    if (!filesExist) {
      this.error(node, `Import in ${this.fileName} doesn't exist in: ${normalizedImportPath}`)
    }
  }

  resolveImportPath(importPath) {
    // Use the directory of the file being evaluated
    const baseDir = path.dirname(this.fileName)

    // 1. Check if importPath is absolute and exists.
    if (path.isAbsolute(importPath)) {
      if (fs.existsSync(importPath)) {
        return importPath
      }
    } else {
      // 2. If importPath is relative, resolve it relative to the caller file's directory.
      const resolvedRelativePath = path.resolve(baseDir, importPath)
      if (fs.existsSync(resolvedRelativePath)) {
        return resolvedRelativePath
      }
    }

    // 3. Search in the specified dependency paths.
    for (const searchOn of this.searchOn) {
      // Construct the candidate path: searchOn / importPath
      const candidatePath = path.resolve(searchOn, importPath)
      if (fs.existsSync(candidatePath)) {
        return candidatePath
      }
    }

    // 4. Return null if the file is not found.
    return null
  }
}

module.exports = ImportPathChecker
