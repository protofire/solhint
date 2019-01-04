const baseConfigProperties = {
  rules: { type: 'object' },
  excludedFiles: { type: 'array' },
  extends: { type: 'array' },
  globals: { type: 'object' },
  env: { type: 'object' },
  parserOptions: { type: 'object' }
}

const configSchema = {
  type: 'object',
  properties: baseConfigProperties,
  additionalProperties: false
}

module.exports = configSchema
