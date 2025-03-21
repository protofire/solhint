const fs = require('fs')
const path = require('path')
const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'import-path-check'
const meta = {
  type: 'miscellaneous',

  docs: {
    description: `Check if an import file exits in target path`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    notes: [
      {
        note: 'Rule checks relative and absolute path first. Then checks for each dependency path in config file',
      },
      {
        note: '`baseDepPath:` is the base path of the dependencies',
      },
      {
        note: '`deps:` is an array of dependency paths to check in specified order',
      },
      {
        note: '`baseDepPath` will concatenate with `deps` to check the import path',
      },
    ],
  },



/// USAR EL BASE PATH
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////
  /////////////////////////////

  fixable: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, { baseDepPath: './git/project', deps: ['node_modules', 'lib'] }],

  schema: {
    type: 'object',
    properties: {
      baseDepPath: {
        type: 'string',
      },
      deps: {
        type: 'array',
      },
    },
  },
}

class ImportPathChecker extends BaseChecker {
  constructor(reporter, config, fileName) {
    super(reporter, ruleId, meta)

    this.baseDepPath = config && config.getObjectPropertyString(ruleId, 'baseDepPath', '')
    this.deps = config && config.getObjectPropertyArray(ruleId, 'deps', '')
    this.fileName = fileName
  }

  ImportDirective(node) {
    const normalizedImportPath = this.normalizePath(node.path)
    const filesExist = this.resolveImportPath(normalizedImportPath)
    if (!filesExist) {
      this.error(node, `Import in ${this.fileName} doesn't exist in: ${normalizedImportPath}`)
    }
  }

  normalizePath(receivedPath) {
    if (receivedPath.startsWith('../')) {
      return `./${receivedPath}`
    }
    return receivedPath
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
    for (const depPath of this.deps) {
      // Construct the candidate path: depPath / importPath
      const candidatePath = path.resolve(this.baseDepPath, depPath, importPath)
      if (fs.existsSync(candidatePath)) {
        return candidatePath
      }
    }

    // 4. Return null if the file is not found.
    return null
  }
}

module.exports = ImportPathChecker
