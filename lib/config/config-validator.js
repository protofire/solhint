const _ = require('lodash')
const ajv = require('../common/ajv')
const configSchema = require('./config-schema')
const { loadRule } = require('../load-rules')

let validateSchema

const validSeverityMap = ['error', 'warn']

const invalidSeverityMap = ['off']

const defaultSchemaValueForRules = Object.freeze({
  oneOf: [{ type: 'string', enum: [...validSeverityMap, ...invalidSeverityMap] }, { const: false }]
})

const validateRules = rulesConfig => {
  if (!rulesConfig) {
    return
  }

  const errorsSchema = []
  const errorsRules = []
  const rulesConfigKeys = Object.keys(rulesConfig)

  for (const ruleId of rulesConfigKeys) {
    const ruleInstance = loadRule(ruleId)
    const ruleValue = rulesConfig[ruleId]

    if (ruleInstance === undefined) {
      errorsRules.push(ruleId)
      continue
    }

    // Inject default schema
    if (ruleInstance.meta.schema.length) {
      let i
      for (i = 0; i < ruleInstance.meta.schema.length; i++) {
        const schema = ruleInstance.meta.schema[i]
        if (schema.type === 'array') {
          ruleInstance.meta.schema[i] = _.cloneDeep(defaultSchemaValueForRules)
          ruleInstance.meta.schema[i].oneOf.push(schema)
          ruleInstance.meta.schema[i].oneOf[2].items.unshift(defaultSchemaValueForRules)
        }
      }
    } else {
      ruleInstance.meta.schema.push(defaultSchemaValueForRules)
    }

    // Validate rule schema
    validateSchema = ajv.compile(ruleInstance.meta.schema[0])

    if (!validateSchema(ruleValue)) {
      errorsSchema.push({ ruleId, defaultSetup: ruleInstance.meta.defaultSetup })
    }
  }

  if (errorsRules.length) {
    throw new Error(errorsRules.map(error => `\tRule ${error} doesn't exist.\n`).join(''))
  }

  if (errorsSchema.length) {
    throw new Error(
      errorsSchema
        .map(
          (ruleId, defaultSetup) =>
            `\tRule ${ruleId} have an invalid schema.\n\tThe default setup is: ${JSON.stringify(
              defaultSetup
            )}`
        )
        .join('')
    )
  }
}

const formatErrors = errors =>
  errors
    .map(error => {
      if (error.keyword === 'additionalProperties') {
        const formattedPropertyPath = error.dataPath.length
          ? `${error.dataPath.slice(1)}.${error.params.additionalProperty}`
          : error.params.additionalProperty

        return `Unexpected top-level property "${formattedPropertyPath}"`
      }
      if (error.keyword === 'type') {
        const formattedField = error.dataPath.slice(1)
        const formattedExpectedType = Array.isArray(error.schema)
          ? error.schema.join('/')
          : error.schema
        const formattedValue = JSON.stringify(error.data)

        return `Property "${formattedField}" is the wrong type (expected ${formattedExpectedType} but got \`${formattedValue}\`)`
      }

      const field = error.dataPath[0] === '.' ? error.dataPath.slice(1) : error.dataPath

      return `"${field}" ${error.message}. Value: ${JSON.stringify(error.data)}`
    })
    .map(message => `\t- ${message}.\n`)
    .join('')

const validateConfigSchema = config => {
  validateSchema = validateSchema || ajv.compile(configSchema)

  if (!validateSchema(config)) {
    throw new Error(`Solhint configuration is invalid:\n${formatErrors(validateSchema.errors)}`)
  }
}

const validate = config => {
  validateConfigSchema(config)
  validateRules(config.rules)
}

module.exports = {
  validate,
  validSeverityMap,
  defaultSchemaValueForRules
}
