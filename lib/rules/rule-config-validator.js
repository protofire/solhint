// lib/rules/rule-config-validator.js
const chalk = require('chalk')

const SEVERITIES = ['error', 'warn', 'off']

function ruleAcceptsOptions(meta) {
  // if meta.schema exists, the rule accepts options ==> ["severity", options]
  // if meta.schema does not exist, the rule does not accept options, only "severity"
  return !!(meta && meta.schema)
}

function isArrayWithOptions(userConfig) {
  return Array.isArray(userConfig) && userConfig.length > 1
}

function normalizeRuleConfig(ruleId, userConfig, meta) {
  const acceptsOptions = ruleAcceptsOptions(meta)
  const hasOptions = isArrayWithOptions(userConfig)

  // Case: options were passed but the rule does not accept them
  if (hasOptions && !acceptsOptions) {
    return {
      ok: false,
      reason: 'NO_OPTIONS_ALLOWED',
      message:
        `[solhint] Warning: invalid configuration for rule '${ruleId}':\n` +
        `  This rule does not accept options. Use "${ruleId}": "error" | "warn" | "off".`,
    }
  }

  // data: what AJV validates
  // - if there is an array, severity is userConfig[0]
  // - if not, severity is userConfig
  // - we only include options if it really applies (hasOptions && acceptsOptions)
  const severity = Array.isArray(userConfig) ? userConfig[0] : userConfig
  const data =
    hasOptions && acceptsOptions ? { severity, options: { value: userConfig[1] } } : { severity }

  // schema: always validates severity
  // and only validates options when applicable
  const schema = buildAjvSchema(userConfig, meta)

  // cache key
  const schemaKey = ruleId + '//' + JSON.stringify(schema)

  return { ok: true, data, schema, schemaKey }
}

function buildAjvSchema(userConfig, meta) {
  const acceptsOptions = ruleAcceptsOptions(meta)
  const hasOptions = isArrayWithOptions(userConfig)

  const base = {
    type: 'object',
    properties: {
      severity: {
        enum: SEVERITIES,
        description: 'Severity level of the rule.',
      },
    },
    required: ['severity'],
    additionalProperties: false,
  }

  if (hasOptions && acceptsOptions) {
    base.properties.options = {
      type: 'object',
      properties: {
        value: {
          ...meta.schema,
        },
      },
      required: ['value'],
      additionalProperties: false,
    }
  }

  return base
}

function warnNoOptionsAllowed(msg) {
  console.warn(chalk.yellow(msg))
}

module.exports = {
  normalizeRuleConfig,
  buildAjvSchema,
  ruleAcceptsOptions,
  warnNoOptionsAllowed,
  SEVERITIES,
}
