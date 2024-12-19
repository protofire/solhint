const BaseChecker = require('../base-checker')
const { severityDescription, formatEnum } = require('../../doc/utils')

const EXPLICIT_TYPES = ['uint256', 'int256', 'ufixed128x18', 'fixed128x18']
const IMPLICIT_TYPES = ['uint', 'int', 'ufixed', 'fixed']
const ALL_TYPES = EXPLICIT_TYPES.concat(IMPLICIT_TYPES)
const VALID_CONFIGURATION_OPTIONS = ['explicit', 'implicit']
const DEFAULT_OPTION = 'explicit'
const DEFAULT_SEVERITY = 'warn'
const alreadyFixedRanges = []
let typesToSearch

const ruleId = 'explicit-types'
const meta = {
  type: 'best-practices',

  docs: {
    description: 'Forbid or enforce explicit types (like uint256) that have an alias (like uint).',
    category: 'Best Practice Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: `Options need to be one of ${formatEnum(VALID_CONFIGURATION_OPTIONS)}`,
        default: DEFAULT_OPTION,
      },
    ],
    examples: {
      good: [
        {
          description: 'If explicit is selected',
          code: 'uint256 public variableName',
        },
        {
          description: 'If implicit is selected',
          code: 'uint public variableName',
        },
        {
          description: 'If explicit is selected',
          code: 'uint256 public variableName = uint256(5)',
        },
      ],
      bad: [
        {
          description: 'If explicit is selected',
          code: 'uint public variableName',
        },
        {
          description: 'If implicit is selected',
          code: 'uint256 public variableName',
        },
        {
          description: 'At any setting',
          code: 'uint public variableName = uint256(5)',
        },
      ],
    },
    notes: [
      {
        note: 'Solhint allows this rule to automatically fix the code with `--fix` option',
      },
    ],
  },

  isDefault: false,
  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_OPTION],
  fixable: true,

  schema: {
    type: 'string',
    enum: VALID_CONFIGURATION_OPTIONS,
  },
}

class ExplicitTypesChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)
    this.configOption =
      (config && config.getStringFromArray(ruleId, DEFAULT_OPTION)) || DEFAULT_OPTION
    this.isExplicit = this.configOption === 'explicit'

    // if explicit, it will search for implicit and viceversa
    if (this.isExplicit) {
      typesToSearch = IMPLICIT_TYPES
    } else {
      typesToSearch = EXPLICIT_TYPES
    }
  }

  VariableDeclaration(node) {
    this.validateInNode(node)
  }

  VariableDeclarationStatement(node) {
    if (!node.initialValue) return
    this.validateInNode(node.initialValue)
  }

  ExpressionStatement(node) {
    this.validateInNode(node)
  }

  validateInNode(node) {
    if (!VALID_CONFIGURATION_OPTIONS.includes(this.configOption)) {
      this.error(node, 'Error: Config error on [explicit-types]. See explicit-types.md.')
      return
    }

    const typeToFind = 'ElementaryTypeName'
    const onlyTypes = this.findNamesOfElementaryTypeName(node, typeToFind)

    // if no variables are defined, return
    if (onlyTypes && onlyTypes.length === 0) return

    // this tells if the variable needs to be checked
    const varsToBeChecked = onlyTypes.filter((type) => ALL_TYPES.includes(type))

    // if defined variables are not to be checked (example address type), return
    if (varsToBeChecked && varsToBeChecked.length === 0) return

    this.validateVariables(typesToSearch, node, varsToBeChecked)
  }

  validateVariables(configType, node, varsToBeChecked) {
    const errorVars = varsToBeChecked.filter((type) => configType.includes(type))

    if (errorVars && errorVars.length > 0) {
      for (const errorVar of errorVars) {
        this.error(
          node,
          `Rule is set with ${this.configOption} type [var/s: ${errorVar}]`,
          this.fixStatement(node, errorVar)
        )
      }
    }
  }

  findNamesOfElementaryTypeName(jsonObject, typeToFind) {
    const names = []

    const searchInObject = (obj) => {
      if (obj.type === typeToFind && obj.name) {
        names.push(obj.name)
      }

      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          searchInObject(obj[key])
        }
      }
    }

    searchInObject(jsonObject)
    return names
  }

  findTypeRanges(node, typeToSearch, results = []) {
    // Check if the current node is an object
    if (typeof node === 'object' && node !== null) {
      // Check if the current node matches the criteria
      if (node.type === 'ElementaryTypeName' && node.name === typeToSearch) {
        // If it matches, push its range to the results array
        results.push(node.range)
      }
      // Recursively search through all properties of the object
      Object.values(node).forEach((value) => {
        // If the value is an object or an array, search it recursively
        if (typeof value === 'object') {
          this.findTypeRanges(value, typeToSearch, results)
        }
      })
    } else if (Array.isArray(node)) {
      // If the current node is an array, search each element
      node.forEach((item) => this.findTypeRanges(item, typeToSearch, results))
    }
    return results
  }

  fixStatement(node, errorVar) {
    const range = this.findTypeRanges(node, errorVar)

    // previous script searches all json and if two uint/uint256/ufixed/etc are in the same line
    // it will return two set of range values
    // this is to remove the first one if it's already been corrected
    // and to push it to the array to store the corrected ones
    if (alreadyFixedRanges.includes(range[0])) {
      range.shift()
    }
    alreadyFixedRanges.push(range[0])

    // only check the first range returned when findTypesRanges return two or more
    const charsToReplace = errorVar.length - 1
    range[0][1] = range[0][0] + charsToReplace

    const configFileIndex = typesToSearch.findIndex((arg) => arg === errorVar)

    return (fixer) =>
      fixer.replaceTextRange(
        range[0],
        this.isExplicit ? EXPLICIT_TYPES[configFileIndex] : IMPLICIT_TYPES[configFileIndex]
      )
  }
}

module.exports = ExplicitTypesChecker
