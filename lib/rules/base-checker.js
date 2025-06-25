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

    // build schema in memory to use better errors
    // can be skipped if the rule has no options
    // can be disabled when solhint rules are compatible with ajv-errors
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
              errorMessage: meta.schema.description,
            },
          },
          required: ['value'],
          additionalProperties: false,
        }
      }
      return base
    }

    // console.log('userConfig :>> ', userConfig, ' - ', ruleId, ' - ', userConfig.length)

    const data =
      Array.isArray(userConfig) && userConfig.length > 1
        ? { severity: userConfig[0], options: { value: userConfig[1] } }
        : { severity: userConfig }

    // console.log('data :>> ', data)

    const schema = buildSchema()

    // console.log('schema :>> ', schema)

    const ajv = new Ajv({ allErrors: true, jsonPointers: true })
    ajvErrors(ajv) // activate ajv-errors
    const validate = ajv.compile(schema)

    if (!validate(data)) {
      this.enabled = false
      let message = ''
      try {
        message =
          betterAjvErrors(schema, data, validate.errors, {
            format: 'cli',
            indent: 2,
            json: JSON.stringify(data, null, 2),
          }) || ''
      } catch (_) {
        //
      }
      // if (!message.trim()) {
      //   message = validate.errors
      //     .map((e) => {
      //       const dp = e.instancePath || ''
      //       let human
      //       if (dp === '/severity') human = 'severity'
      //       else if (dp.startsWith('/options/value')) human = 'options.value'
      //       else human = dp.slice(1) || 'config'
      //       return `→ ${human}: ${e.message}`
      //     })
      //     .join('\n')
      // }
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

module.exports = BaseChecker
