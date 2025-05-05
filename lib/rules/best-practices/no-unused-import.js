const { forIn } = require('lodash')
const BaseChecker = require('../base-checker')

const ruleId = 'no-unused-import'
const meta = {
  type: 'best-practices',

  docs: {
    description: 'Imported object name is not being used by the contract.',
    category: 'Best Practices Rules',
    examples: {
      good: [
        {
          description: 'Imported object is being used',
          code: `
            import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            contract MyToken is ERC20 {}
          `,
        },
      ],
      bad: [
        {
          description: 'Imported object is not being used',
          code: `
          import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            contract B {}
          `,
        },
      ],
    },
  },

  recommended: true,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

// meant to skip Identifiers that are part of the ImportDirective that defines a name
function isImportIdentifier(node) {
  return !node.parent || node.parent.type === 'ImportDirective'
}

class NoUnusedImportsChecker extends BaseChecker {
  constructor(reporter, tokens) {
    super(reporter, ruleId, meta)
    this.importedNames = {}
    this.tokens = tokens

    this.groupCount = 0
    this.importGroups = []
  }

  registerUsage(rawName) {
    if (!rawName) return
    // '.' is always a separator of names, and the first one is the one that
    // was imported
    const name = rawName.split('.')[0]
    // if the key isn't set, then it's not a name that has been imported so we
    // don't care about it
    if (this.importedNames[name]) {
      this.importedNames[name].used = true
    }
  }

  Identifier(node) {
    if (!isImportIdentifier(node)) {
      this.registerUsage(node.name)
    }
  }

  FunctionDefinition(node) {
    if (node.isConstructor) {
      node.modifiers.forEach((it) => this.registerUsage(it.name))
    }
  }

  ImportDirective(node) {
    if (node.unitAlias) {
      this.importedNames[node.unitAlias] = { node: node.unitAliasIdentifier, used: false }
    } else {
      this.importGroups.push({ count: 0, updateCount: 0, range: node.range })
      node.symbolAliasesIdentifiers.forEach((it, index) => {
        this.importedNames[(it[1] || it[0]).name] = {
          node: it[0],
          used: false,
          group: this.groupCount,
          index,
          aliasLength: it[1] ? it[1].name.length : 0,
        }
        this.importGroups[this.groupCount].count++
      })
      this.groupCount++
    }
  }

  UserDefinedTypeName(node) {
    this.registerUsage(node.namePath)
  }

  UsingForDeclaration(node) {
    this.registerUsage(node.libraryName)
    node.functions.forEach((it) => this.registerUsage(it))
  }

  fixStatement(importedName) {
    if (importedName.group !== undefined) {
      const group = this.importGroups[importedName.group]

      // Delete whole import statement if it's the only one in the group
      if (group.count === 1) {
        group.range[1] += 1
        return (fixer) => fixer.removeRange(group.range)
      }

      // Add comma separator and indentation to the range
      if (importedName.index > group.updateCount) {
        importedName.node.range[0] -= 2
      } else if (importedName.index < group.count + group.updateCount - 1) {
        importedName.node.range[1] += 2
      }

      // Extend range with alias
      importedName.node.range[1] += importedName.aliasLength ? importedName.aliasLength + 4 : 0

      // Remove the range of the identifier from the group range
      group.count--
      group.updateCount++
    }

    return (fixer) => fixer.removeRange(importedName.node.range)
  }

  'SourceUnit:exit'() {
    const keywords = this.tokens.filter((it) => it.type === 'Keyword')
    const inheritdocStatements = keywords.filter(
      ({ value }) => /^\/\/\/ *@inheritdoc/.test(value) || /^\/\*\* *@inheritdoc/.test(value)
    )
    inheritdocStatements.forEach(({ value }) => {
      const match = value.match(/@inheritdoc *([a-zA-Z0-9_]*)/)
      if (match && match[1]) {
        this.registerUsage(match[1])
      }
    })
    forIn(this.importedNames, (value, key) => {
      if (!value.used) {
        this.error(value.node, `imported name ${key} is not used`, this.fixStatement(value))
      }
    })
  }
}

module.exports = NoUnusedImportsChecker
