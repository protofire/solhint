const BaseChecker = require('../base-checker')

const ruleId = 'named-parameters-mapping'
const meta = {
  type: 'naming',
  docs: {
    description: `Solidity v0.8.18 introduced named parameters on the mappings definition`,
    category: 'Style Guide Rules',
    examples: {
      good: [
        {
          description:
            'To enter "users" mapping the key called "name" is needed to get the "balance"',
          code: 'mapping(string name => uint256 balance) public users;',
        },
        {
          description:
            'To enter owner token balance, the main key "owner" enters another mapping which its key is "token" to get its "balance"',
          code: 'mapping(address owner => mapping(address token => uint256 balance)) public tokenBalances;',
        },
      ],
      bad: [
        {
          description: 'No naming in regular mapping ',
          code: 'mapping(address => uint256)) public tokenBalances;',
        },
        {
          description: 'No naming in nested mapping ',
          code: 'mapping(address => mapping(address => uint256)) public tokenBalances;',
        },
        {
          description: 'No complete naming in nested mapping. Missing main key and value ',
          code: 'mapping(address => mapping(address token => uint256)) public tokenBalances;',
        },
      ],
    },
  },
  isDefault: false,
  recommended: false,
  defaultSetup: 'off',
  schema: null,
}

class NamedParametersMapping extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  StateVariableDeclaration(node) {
    let isNested = false
    const variables = node.variables
    variables.forEach((variable) => {
      // maybe the comparission to VariableDeclaration can be deleted
      if (variable.type === 'VariableDeclaration' && variable.typeName.type === 'Mapping') {
        if (variable.typeName.valueType.type === 'Mapping') {
          // isNested mapping
          isNested = true
        }
        this.checkNameOnMapping(variable, isNested)
      }
    })
  }

  checkNameOnMapping(variable, isNested) {
    let mainKeyName
    let nestedKeyName
    let valueName

    if (isNested) {
      mainKeyName = variable.typeName.keyName ? variable.typeName.keyName.name : null
      nestedKeyName = variable.typeName.valueType.keyName
        ? variable.typeName.valueType.keyName.name
        : null
      valueName = variable.typeName.valueType.valueName
        ? variable.typeName.valueType.valueName.name
        : null
    } else {
      mainKeyName = variable.typeName.keyName ? variable.typeName.keyName.name : null
      nestedKeyName = null
      valueName = variable.typeName.valueName ? variable.typeName.valueName.name : null
    }

    if (!mainKeyName) {
      this.report(variable, 'Main key')
    }

    if (!nestedKeyName && isNested) {
      this.report(variable, 'Nested key')
    }

    if (!valueName) {
      this.report(variable, 'Value')
    }
  }

  report(variable, type) {
    const message = `${type} parameter in mapping ${variable.name} is not named`
    this.reporter.error(variable, this.ruleId, message)
  }
}

module.exports = NamedParametersMapping
