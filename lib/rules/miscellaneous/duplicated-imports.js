const path = require('path')
const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'duplicated-imports'
const meta = {
  type: 'miscellaneous',

  docs: {
    description: `Check if an import is done twice in the same file and there is no alias`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    notes: [
      {
        note: 'Rule reports "(inline) duplicated" if the same object is imported more than once in the same import statement',
      },
      {
        note: 'Rule reports "(globalSamePath) duplicated" if the same object is imported on another import statement from same location',
      },
      {
        note: 'Rule reports "(globalDiffPath) duplicated" if the same object is imported on another import statement, from other location, but no alias',
      },
      {
        note: 'Rule does NOT support this kind of import "import * as Alias from "./filename.sol"',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class DuplicatedImportsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)

    this.imports = []
  }

  ImportDirective(node) {
    const normalizedPath = this.normalizePath(node.path)

    const importStatement = {
      path: '',
      objectNames: [],
    }

    importStatement.path = normalizedPath
    importStatement.objectNames = node.symbolAliases
      ? node.symbolAliases
      : this.getObjectName(normalizedPath)

    this.imports.push(importStatement)
  }

  'SourceUnit:exit'(node) {
    const duplicates = this.findDuplicates(this.imports)

    for (let i = 0; i < duplicates.length; i++) {
      this.error(node, `Duplicated Import (${duplicates[i].type}) ${duplicates[i].name}`)
    }
  }

  getObjectName(normalizedPath) {
    // get file name
    const fileNameWithExtension = path.basename(normalizedPath)
    // Remove extension
    const objectName = fileNameWithExtension.replace('.sol', '')
    return [[objectName, null]]
  }

  normalizePath(path) {
    if (path.startsWith('../')) {
      return `./${path}`
    }
    return path
  }

  findInlineDuplicates(data) {
    const inlineDuplicates = []

    data.forEach((entry) => {
      const path = entry.path
      // To track object names
      const objectNamesSet = new Set()

      entry.objectNames.forEach(([objectName]) => {
        // If object name already been found , it is a duplicated
        if (objectNamesSet.has(objectName)) {
          inlineDuplicates.push({
            name: objectName,
            type: 'inline',
            paths: [path],
          })
        } else {
          // If it is not found before, we add it
          objectNamesSet.add(objectName)
        }
      })
    })

    return inlineDuplicates
  }

  finGlobalDuplicatesSamePath(data) {
    const duplicates = []

    // Loop through data
    data.forEach((entry) => {
      const path = entry.path

      // Object to track object names on each path
      const objectNamesMap = {}

      // Loop through each objectName of current object
      entry.objectNames.forEach(([objectName]) => {
        if (!objectNamesMap[objectName]) {
          objectNamesMap[objectName] = []
        }
        objectNamesMap[objectName].push(path)
      })

      // Compare this object with the rest to detect duplicates
      data.forEach((otherEntry) => {
        if (otherEntry !== entry) {
          otherEntry.objectNames.forEach(([objectName]) => {
            if (
              objectNamesMap[objectName] &&
              objectNamesMap[objectName].includes(otherEntry.path)
            ) {
              // Add path only if it is not present
              const existingDuplicate = duplicates.find(
                (duplicate) =>
                  duplicate.name === objectName &&
                  duplicate.type === 'global' &&
                  duplicate.paths.includes(entry.path)
              )

              if (!existingDuplicate) {
                duplicates.push({
                  name: objectName,
                  type: 'globalSamePath',
                  paths: [entry.path], // Just add path once, it is always the same
                })
              }
            }
          })
        }
      })
    })

    return duplicates
  }

  finGlobalDuplicatesDiffPathNoAlias(data) {
    const duplicates = []

    // Loop through data
    data.forEach((entry) => {
      // Object to track names on each path
      entry.objectNames.forEach(([objectName, alias]) => {
        // Only compare if there is no alias
        if (!alias) {
          // Go through rest of objects to search for duplicates
          data.forEach((otherEntry) => {
            if (otherEntry !== entry) {
              otherEntry.objectNames.forEach(([otherObjectName, otherAlias]) => {
                // If object name is the same, has no alias and different path
                if (
                  objectName === otherObjectName &&
                  !otherAlias &&
                  entry.path !== otherEntry.path
                ) {
                  // Check if the name is already in the duplicated array
                  const existingDuplicate = duplicates.find(
                    (duplicate) =>
                      duplicate.name === objectName &&
                      duplicate.type === 'global' &&
                      duplicate.paths.includes(entry.path)
                  )

                  // Add new object if doesn't exist
                  if (!existingDuplicate) {
                    duplicates.push({
                      name: objectName,
                      type: 'globalDiffPath',
                      paths: [entry.path, otherEntry.path],
                    })
                  }

                  // Add path if already exists
                  if (existingDuplicate && !existingDuplicate.paths.includes(otherEntry.path)) {
                    existingDuplicate.paths.push(otherEntry.path)
                  }
                }
              })
            }
          })
        }
      })
    })

    return duplicates
  }

  removeDuplicatedObjects(data) {
    const uniqueData = data.filter((value, index, self) => {
      // Order path arrays to be compared later
      const sortedPaths = value.paths.slice().sort()

      return (
        index ===
        self.findIndex(
          (t) =>
            t.name === value.name &&
            t.type === value.type &&
            // Compare ordered arrays of paths
            JSON.stringify(t.paths.slice().sort()) === JSON.stringify(sortedPaths)
        )
      )
    })

    return uniqueData
  }

  findDuplicates(data) {
    /// @TODO THIS LOGIC CAN BE IMPROVED - Not done due lack of time

    const duplicates1 = this.findInlineDuplicates(data)

    const duplicates2 = this.finGlobalDuplicatesSamePath(data)

    const duplicates3 = this.finGlobalDuplicatesDiffPathNoAlias(data)

    const duplicates = this.removeDuplicatedObjects(duplicates1.concat(duplicates2, duplicates3))

    return duplicates
  }
}

module.exports = DuplicatedImportsChecker
