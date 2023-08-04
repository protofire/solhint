const { forIn } = require('lodash')
const BaseChecker = require('../base-checker')

const ruleId = 'no-unused-import'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Imported object name is not being used by the contract.',
    category: 'Best Practise Rules',
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

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

// meant to skip Identifiers that are part of the ImportDirective that defines a name
function isImportIdentifier(node) {
  return !node.parent || node.parent.type === 'ImportDirective'
}

class NoUnusedImportsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
    this.importedNames = {}
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

  ArrayTypeName(node) {
    this.registerUsage(node.baseTypeName.namePath)
  }

  NewExpression(node) {
    this.registerUsage(node.typeName.namePath)
  }

  Identifier(node) {
    if (!isImportIdentifier(node)) {
      this.registerUsage(node.name)
    }
  }

  FunctionDefinition(node) {
    if (node.override) {
      node.override.forEach((it) => this.registerUsage(it.namePath))
    }
    if (node.isConstructor) {
      node.modifiers.forEach((it) => this.registerUsage(it.name))
    }
  }

  ImportDirective(node) {
    if (node.unitAlias) {
      this.importedNames[node.unitAlias] = { node: node.unitAliasIdentifier, used: false }
    } else {
      node.symbolAliasesIdentifiers.forEach((it) => {
        this.importedNames[(it[1] || it[0]).name] = { node: it[0], used: false }
      })
    }
  }

  VariableDeclaration(node) {
    // this ignores builtin types, the check inside registerUsage ignores types
    // defined in the same file
    if (node.typeName.type === 'UserDefinedTypeName') {
      this.registerUsage(node.typeName.namePath)
    }
  }

  ContractDefinition(node) {
    node.baseContracts.forEach((inheritanceSpecifier) => {
      this.registerUsage(inheritanceSpecifier.baseName.namePath)
    })
  }

  UsingForDeclaration(node) {
    this.registerUsage(node.libraryName)
    node.functions.forEach((it) => this.registerUsage(it))
  }

  'SourceUnit:exit'() {
    forIn(this.importedNames, (value, key) => {
      if (!value.used) {
        this.error(value.node, `imported name ${key} is not used`)
      }
    })
  }
}

module.exports = NoUnusedImportsChecker
