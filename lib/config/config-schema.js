/**
 * Solhint Configuration Schema
 *
 * This schema defines the structure of the Solhint configuration file.
 * It validates:
 * - Rule severity levels
 * - Rule configuration options
 * - Additional configuration such as globals, env, etc.
 */

const baseConfigProperties = {
  rules: {
    type: 'object',
    patternProperties: {
      // Matches any rule name
      '.*': {
        oneOf: [
          // Case 1: severity as a simple string
          {
            type: 'string',
            enum: ['off', 'warn', 'error'],
          },

          // Case 2: severity disabled as a boolean
          {
            type: 'boolean',
            enum: [false],
          },

          // Case 3: array format [severity, config]
          {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: [
              // First item: severity
              {
                type: 'string',
                enum: ['off', 'warn', 'error'],
              },
              // Second item: one of number, array or object config
              {
                oneOf: [
                  // Example: ['warn', 120] - numeric config
                  { type: 'number' },

                  // Example: ['warn', 'explicit'] - string config
                  { type: 'string' },

                  // Example: ['warn', ['setUp']] - array config
                  {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },

                  // Example: ['warn', { configOptions }]
                  {
                    type: 'object',
                    additionalProperties: false, // strict mode: only allow the defined properties
                    properties: {
                      // Common configuration properties across rules
                      maxLength: { type: 'number' }, // reason-string
                      immutablesAsConstants: { type: 'boolean' }, // immutable-vars-naming
                      ignoreConstructors: { type: 'boolean' }, // func-visibility
                      strict: { type: 'boolean' }, // private-vars-leading-underscore

                      // import-path-check specific configuration
                      baseDepPath: { type: 'string' },
                      deps: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      searchOn: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      includeDefaults: { type: 'boolean' },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    additionalProperties: false,
  },

  // Excluded files configuration
  excludedFiles: {
    type: 'array',
  },

  // Extends configuration (preset configs)
  extends: {
    anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  },

  // Global variables configuration
  globals: {
    type: 'object',
  },

  // Environment settings
  env: {
    type: 'object',
  },

  // Parser options (future use)
  parserOptions: {
    type: 'object',
  },

  // Plugins array
  plugins: {
    type: 'array',
  },
}

const configSchema = {
  type: 'object',
  properties: baseConfigProperties,
  additionalProperties: false,
}

module.exports = configSchema
