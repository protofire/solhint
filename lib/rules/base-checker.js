// lib/rules/base-checker.js
const chalk = require('chalk')
const Ajv = require('ajv')
const ajvErrors = require('ajv-errors')
// eslint-disable-next-line import/no-extraneous-dependencies
const betterAjvErrors = require('better-ajv-errors').default

const { normalizeRuleConfig, warnNoOptionsAllowed } = require('./rule-config-validator')

class BaseChecker {
  constructor(reporter, ruleId, meta) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
    this.enabled = true
    if (!reporter) return

    const userConfig = reporter.config[ruleId]
    if (userConfig === undefined) return

    // Centralized config normalization + schema generation
    const normalized = normalizeRuleConfig(ruleId, userConfig, meta)

    // If rule does NOT accept options, reject array-form configs
    if (!normalized.ok) {
      this.enabled = false
      warnNoOptionsAllowed(normalized.message)
      return
    }

    const { data, schema, schemaKey } = normalized

    // Build schema and cache by the actual content of the schema
    if (!BaseChecker.validators.has(schemaKey)) {
      let validate
      try {
        validate = BaseChecker.ajv.compile(schema)
      } catch (e) {
        this.enabled = false
        console.warn(
          chalk.yellow(
            `[solhint] Warning: could not compile schema for rule '${ruleId}': ${e.message}`
          )
        )
        return
      }
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

BaseChecker.ajv = new Ajv({ allErrors: true })
ajvErrors(BaseChecker.ajv) // keep support of errorMessage
BaseChecker.validators = new Map()

module.exports = BaseChecker
