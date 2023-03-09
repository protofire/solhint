const { forIn } = require('lodash')
const BaseChecker = require('../base-checker')

const ruleId = 'no-unused-import'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Imported name is not used',
    category: 'Best Practise Rules',
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: null,
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

  MemberAccess(node) {
    this.registerUsage(node.expression.name)
  }

  ArrayTypeName(node) {
    this.registerUsage(node.baseTypeName.namePath)
  }

  NewExpression(node) {
    this.registerUsage(node.typeName.namePath)
  }

  FunctionCall(node) {
    this.registerUsage(node.expression.name)
  }

  ImportDirective(node) {
    node.symbolAliasesIdentifiers.forEach((it) => {
      this.importedNames[(it[1] || it[0]).name] = { node: it[0], used: false }
    })
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
