const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const DEFAULT_SEVERITY = 'warn'

const ruleId = 'imports-order'
const meta = {
  type: 'naming',

  docs: {
    description: `Order the imports of the contract to follow a certain hierarchy (read "Notes section")`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    notes: [
      {
        note: 'Paths starting with "@" like "@openzeppelin/" and urls ("http" and "https") will go first',
      },
      {
        note: 'Order by hierarchy of directories first, e.g. ./../../ comes before ./../, which comes before ./, which comes before ./foo',
      },
      {
        note: 'Direct imports come before relative imports',
      },
      {
        note: 'Order alphabetically for each path at the same level, e.g. ./contract/Zbar.sol comes before ./interface/Ifoo.sol',
      },
      {
        note: 'Rule does NOT support this kind of import "import * as Alias from "./filename.sol"',
      },
      {
        note: 'When "--fix",  rule will re-write this notation "../folder/file.sol" or this one "../file.sol" to "./../folder/file.sol" or this one "./../file.sol"',
      },
    ],
  },

  recommended: false,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class ImportsOrderChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
    this.orderedImports = [] // This will hold the sorted imports
  }

  SourceUnit(node) {
    // console.log('node.children :>> ', node.children)
    // get all the imports into one object
    this.fromContractImports = node.children
      .filter((child) => child.type === 'ImportDirective')
      .map((child) => {
        const normalizedPath = this.normalizePath(child.path)
        const result = {
          range: child.range,
          path: normalizedPath,
          fullSentence: child.symbolAliases
            ? `${this.getFullSentence(child.symbolAliases)}'${normalizedPath}';`
            : `import '${normalizedPath}';`,
        }
        return result
      })

    // Create a deep copy of fromContractImports for sorting
    this.orderedImports = JSON.parse(JSON.stringify(this.fromContractImports))

    // order the object to get the ordered and the contract order
    this.orderedImports = this.sortImports(this.orderedImports)

    // console.log('this.orderedImports :>> ', this.fromContractImports)
    // console.log('NO Order: \n')
    // this.fromContractImports.forEach((importItem) => console.log(importItem.fullSentence))
    // console.log('\n\nOrdered: \n')
    // this.orderedImports.forEach((importItem) => console.log(importItem.fullSentence))
  }

  'SourceUnit:exit'(node) {
    // when finish analyzing check if ordered import array is equal to the import contract order
    // const areEqual = areArraysEqual(this.fromContractImports, this.orderedImports)
    const areEqual = arePathsEqual(this.fromContractImports, this.orderedImports)

    // if are equal do nothing, if not enter the if
    if (!areEqual) {
      // Find the lowest starting range to start the replacement
      let currentStart = Math.min(...this.fromContractImports.map((imp) => imp.range[0]))
      // Prepare replacements changing the range
      const replacements = this.orderedImports.map((orderedImport) => {
        // replace single quotes by double quotes
        const newText = orderedImport.fullSentence.replace(/'/g, '"')
        const rangeEnd = currentStart + newText.length

        const replacement = {
          range: [currentStart, rangeEnd],
          newText,
        }

        currentStart = rangeEnd

        return replacement
      })

      // get the name of the contract only to report the error
      let name = ''
      const loopQty = replacements.length - 1
      // loop through imports to report and correct if requested
      for (let i = loopQty; i >= 0; i--) {
        name = this.fromContractImports[i].path.split('/')
        name = name[name.length - 1]
        this.error(
          node,
          `Wrong Import Order for {${name}}`,
          // replace from bottom to top all the imports in the right order
          // flag the first one, which will be the last import
          this.fixStatement(replacements[i], i === loopQty)
        )
      }
    }
  }

  fixStatement(replacement, isLast) {
    // the last import should replace all the chars up to the end
    // this is for imports path longer than the one it was before
    if (isLast) {
      const lastRangeEnd = this.fromContractImports[this.fromContractImports.length - 1].range[1]
      return (fixer) =>
        fixer.replaceTextRange([replacement.range[0], lastRangeEnd], replacement.newText)
    }
    return (fixer) => fixer.replaceTextRange(replacement.range, replacement.newText + '\n')
  }

  sortImports(unorderedImports) {
    // Helper function to determine the hierarchical level of a path
    function getHierarchyLevel(path) {
      // put very large numbers so these comes first in precedence
      const protocolOrder = {
        '@': -40000,
        'http://': -30000,
        'https://': -20000,
        // eslint-disable-next-line prettier/prettier
        folderPath: -10000,
      }

      // Check for protocol-specific paths and assign them their respective order levels
      for (const protocol in protocolOrder) {
        if (protocol !== 'folderPath' && path.startsWith(protocol)) {
          return protocolOrder[protocol]
        }
      }

      // Handling for paths that are likely folder names without a leading './'
      if (!path.startsWith('./') && /^[a-zA-Z0-9]/.test(path)) {
        return protocolOrder.folderPath
      }

      // Relative path handling
      if (path.startsWith('./')) {
        // Count the number of '../' sequences to determine depth
        const depth = path.split('/').filter((part) => part === '..').length
        // Return a negative value to ensure that lesser depth has higher precedence (closer to 0)
        return -depth
      }

      // Default catch-all for unhandled cases
      return Infinity
    }

    // Sort imports based on the hierarchy level and then alphabetically
    const orderedImports = unorderedImports.sort((a, b) => {
      const levelA = getHierarchyLevel(a.path)
      const levelB = getHierarchyLevel(b.path)

      if (levelA !== levelB) {
        return levelA - levelB
      }

      // For same level, sort alphabetically by the entire path, case-insensitive
      return a.path.localeCompare(b.path, undefined, { sensitivity: 'base' })
    })

    return orderedImports
  }

  // Map through each subarray to convert it to the desired format
  getFullSentence(elements) {
    const importParts = elements.map(([name, alias]) => {
      // Check if there is an alias; if so, format it as 'name as alias', otherwise just return the name
      return alias ? `${name} as ${alias}` : name
    })

    // Join all the parts with a comma and space, and format it into the final import string
    return `import { ${importParts.join(', ')} } from `
  }

  normalizePath(path) {
    if (path.startsWith('../')) {
      return `./${path}`
    }
    return path
  }
}

// This function was interfering with the imports order, so it was replaced with the one below
// // function to compare is both arrays are equal
// function areArraysEqual(arr1, arr2) {
//   console.log('arr1 :>> ', arr1)
//   console.log('arr2 :>> ', arr2)
//   if (arr1.length !== arr2.length) {
//     return false
//   }

//   for (let i = 0; i < arr1.length; i++) {
//     if (
//       arr1[i].path !== arr2[i].path ||
//       arr1[i].range[0] !== arr2[i].range[0] ||
//       arr1[i].range[1] !== arr2[i].range[1]
//     ) {
//       return false
//     }
//   }

//   return true
// }

function arePathsEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].path !== arr2[i].path) {
      return false
    }
  }

  return true
}

module.exports = ImportsOrderChecker
