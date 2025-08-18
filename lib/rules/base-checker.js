const chalk = require('chalk')
const Ajv = require('ajv')
const ajvErrors = require('ajv-errors')
// eslint-disable-next-line import/no-extraneous-dependencies
const betterAjvErrors = require('better-ajv-errors').default

class BaseChecker {
  constructor(reporter, ruleId, meta) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
    this.enabled = true
    if (!reporter) return

    const userConfig = reporter.config[ruleId]
    if (userConfig === undefined) return

    // build schema related to userConfig and meta.schema
    const buildSchema = () => {
      const base = {
        type: 'object',
        properties: {
          severity: {
            enum: ['error', 'warn', 'off'],
            description: 'Severity level of the rule.',
          },
        },
        required: ['severity'],
        additionalProperties: false,
      }

      if (Array.isArray(userConfig) && userConfig.length > 1 && meta.schema) {
        base.properties.options = {
          type: 'object',
          properties: {
            value: {
              ...meta.schema,
              errorMessage: meta.schema.description, // used by ajv-errors
            },
          },
          required: ['value'],
          additionalProperties: false,
        }
      }

      return base
    }

    const data =
      Array.isArray(userConfig) && userConfig.length > 1
        ? { severity: userConfig[0], options: { value: userConfig[1] } }
        : { severity: userConfig }

    // build schema and cache by the actual content of the schema
    const schema = buildSchema()
    const schemaKey = ruleId + '//' + JSON.stringify(schema)

    if (!BaseChecker.validators.has(schemaKey)) {
      const validate = BaseChecker.ajv.compile(schema)
      BaseChecker.validators.set(schemaKey, validate)
    }

    const validate = BaseChecker.validators.get(schemaKey)

    if (!validate(data)) {
      this.enabled = false
      let message = ''
      try {
        message =
          betterAjvErrors(validate.schema, data, validate.errors, {
            format: 'cli',
            indent: 2,
            json: JSON.stringify(data, null, 2),
          }) || ''
      } catch (_) {
        // noop
      }
      console.warn(
        chalk.yellow(`[solhint] Warning: invalid configuration for rule '${ruleId}':\n${message}`)
      )
    }
  }

  error(ctx, msg, fix) {
    this.addReport('error', ctx, msg, fix)
  }

  warn(ctx, msg, fix) {
    this.addReport('warn', ctx, msg, fix)
  }

  errorAt(l, c, msg, fix) {
    this.error({ loc: { start: { line: l, column: c } } }, msg, fix)
  }

  addReport(type, ctx, msg, fix) {
    if (!this.enabled) return
    this.reporter[type](ctx, this.ruleId, msg, this.meta.fixable ? fix : null)
  }
}

BaseChecker.ajv = new Ajv({ allErrors: true, jsonPointers: true })
ajvErrors(BaseChecker.ajv) // <- kee support of errorMessage
BaseChecker.validators = new Map()

module.exports = BaseChecker
