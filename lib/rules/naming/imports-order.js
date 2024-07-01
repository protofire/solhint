const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const FOLDER_LEVELS_SUPPORT = 10
const DEFAULT_SEVERITY = 'warn'

const ruleId = 'imports-order'
const meta = {
  type: 'naming',

  docs: {
    description: `Order the imports of the contract to follow a certain hierarchy`,
    category: 'Style Guide Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
    ],
    notes: [
      {
        note: 'Order by hierarchy of directories first, e.g. ../../ comes before ../, which comes before ./, which comes before ./foo',
      },
      {
        note: 'Order alphabetically for each file at the same level, e.g. ./bar comes before ./foo',
      },
      {
        note: 'Rule support up to 10 folder levels "../../../../../../../../../../"',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class ImportsOrderChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  SourceUnit(node) {
    // get all the imports into one object
    this.fromContractImports = node.children
      .filter((child) => child.type === 'ImportDirective')
      .map((child) => ({
        range: child.range,
        path: child.path,
        fullSentence: child.symbolAliases
          ? this.getFullSentence(child.symbolAliases) + "'" + child.path + "';"
          : `import '${child.path}';`,
      }))

    // copy the object into another one
    this.orderedImports = [...this.fromContractImports]

    // order the object to get the ordered and the contract order
    this.orderImports(this.orderedImports)
  }

  'SourceUnit:exit'(node) {
    // when finish analyzing check if ordered import array is equal to the import contract order
    const areEqual = areArraysEqual(this.fromContractImports, this.orderedImports)

    // if are equal do nothing, if not enter the if
    if (!areEqual) {
      // Find the lowest starting range to start the replacement
      let currentStart = Math.min(...this.fromContractImports.map((imp) => imp.range[0]))
      // Prepare replacements changing the range
      const replacements = this.orderedImports.map((orderedImport) => {
        const newText = orderedImport.fullSentence
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

  orderImports(imports) {
    // it supports up to ten folder of hierarchy
    // ===>>  ../../../../../../../../../../
    // generate that hierarchy and put @ first
    const generateDirHierarchy = (levels) => {
      const hierarchy = ['@']
      for (let i = levels; i > 0; i--) {
        hierarchy.push('../'.repeat(i))
      }
      hierarchy.push('./')
      return hierarchy
    }

    const dirHierarchy = generateDirHierarchy(FOLDER_LEVELS_SUPPORT)

    // get dir level to compare and order
    const getDirLevel = (path) => {
      for (let i = 0; i < dirHierarchy.length; i++) {
        if (path.startsWith(dirHierarchy[i])) {
          return i
        }
      }
      return dirHierarchy.length // Default level if no match
    }

    // count the folders to put first if there's an only file at the same level
    const getSubDirCount = (path) => {
      // Count number of slashes in the path
      return (path.match(/\//g) || []).length
    }

    // compare paths alphabetically
    const comparePathsAlphabetically = (pathA, pathB) => {
      const partsA = pathA.split('/')
      const partsB = pathB.split('/')

      for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
        const comparison = partsA[i].localeCompare(partsB[i])
        if (comparison !== 0) {
          return comparison
        }
      }

      return 0 // Equal parts up to the length of the shorter path
    }

    // check if there's a single file and put it at last
    const isSingleFile = (path) => {
      const parts = path.split('/')
      return parts.length === 2 && parts[1].includes('.')
    }

    return imports.sort((a, b) => {
      const dirLevelA = getDirLevel(a.path)
      const dirLevelB = getDirLevel(b.path)

      if (dirLevelA !== dirLevelB) {
        return dirLevelA - dirLevelB
      }

      const singleFileA = isSingleFile(a.path)
      const singleFileB = isSingleFile(b.path)

      if (singleFileA !== singleFileB) {
        return singleFileA - singleFileB // Place single file imports last at each level
      }

      const alphabeticComparison = comparePathsAlphabetically(a.path, b.path)
      if (alphabeticComparison !== 0) {
        return alphabeticComparison
      }

      const subDirCountA = getSubDirCount(a.path)
      const subDirCountB = getSubDirCount(b.path)

      return subDirCountB - subDirCountA // More subdirectories come first
    })
  }

  // function to get the full sentence, because the AST only get the path and alias separated
  getFullSentence(node) {
    const sentenceStart = 'import {'
    const sentenceEnd = '} from '
    let imported = ''

    if (node.length === 1) {
      imported = node[0][0]
    } else {
      for (let i = 0; i < node.length; i++) {
        if (i === node.length - 1) imported += node[i][0]
        else imported += node[i][0] + ', '
      }
    }

    return sentenceStart + imported + sentenceEnd
  }
}

// function to compare is both arrays are equal
function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].path !== arr2[i].path ||
      arr1[i].range[0] !== arr2[i].range[0] ||
      arr1[i].range[1] !== arr2[i].range[1]
    ) {
      return false
    }
  }

  return true
}

module.exports = ImportsOrderChecker
