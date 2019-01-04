const ajv = require('../common/ajv')
const configSchema = require('./config-schema')

let validateSchema

const validSeverityMap = ['error', 'warn']

const invalidSeverityMap = ['off']

const defaultSchemaValueForRules = Object.freeze({
  oneOf: [{ type: 'string', enum: [...validSeverityMap, ...invalidSeverityMap] }, { const: false }]
})

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

const validate = config => {
  validateSchema = validateSchema || ajv.compile(configSchema)

  if (!validateSchema(config)) {
    throw new Error(`Solhint configuration is invalid:\n${formatErrors(validateSchema.errors)}`)
  }
}

module.exports = {
  validate,
  validSeverityMap,
  defaultSchemaValueForRules
}
