const Ajv = require('ajv')

const ajv = new Ajv({
  validateSchema: false,
  verbose: true,
  allErrors: true,
})

module.exports = ajv
