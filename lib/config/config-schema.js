const baseConfigProperties = {
  rules: { type: 'object', additionalProperties: true },
  excludedFiles: { type: 'array', items: { type: 'string' } },
  plugins: { type: 'array', items: { type: 'string' } },
  extends: { anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
  globals: { type: 'object' },
  env: { type: 'object' },
  parserOptions: { type: 'object' },

  // Runtime options (CLI / engine)
  cache: { type: 'boolean' },
  cacheLocation: { type: 'string' },
}

const configSchema = {
  type: 'object',
  properties: baseConfigProperties,
  additionalProperties: false,
}

module.exports = configSchema
