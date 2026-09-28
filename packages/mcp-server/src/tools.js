const fs = require('fs')
const path = require('path')
const { globSync } = require('glob')

const TOOL_DEFINITIONS = Object.freeze([
  {
    name: 'lint_solidity',
    description: 'Lint a Solidity source string with the project or supplied Solhint config.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', minLength: 1, description: 'Solidity source code to lint' },
        config: { type: 'object', description: 'Optional complete Solhint config object' },
      },
      required: ['code'],
      additionalProperties: false,
    },
  },
  {
    name: 'lint_file',
    description: 'Lint one Solidity file inside this server instance project.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          minLength: 1,
          description: 'Path relative to the project root',
        },
      },
      required: ['filePath'],
      additionalProperties: false,
    },
  },
  {
    name: 'lint_project',
    description: 'Lint Solidity files in this server instance project.',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', minLength: 1, description: 'Optional project-relative glob' },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: 'fix_solidity',
    description:
      'Apply Solhint autofixes to a Solidity source string and return the corrected source. Does not touch any file.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', minLength: 1, description: 'Solidity source code to fix' },
        config: { type: 'object', description: 'Optional complete Solhint config object' },
      },
      required: ['code'],
      additionalProperties: false,
    },
  },
  {
    name: 'fix_file',
    description:
      'Apply Solhint autofixes to one Solidity file. Previews the result by default; pass write: true to save it.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          minLength: 1,
          description: 'Path relative to the project root',
        },
        write: {
          type: 'boolean',
          description: 'Write the fixed source back to the file. Defaults to false (preview only).',
        },
      },
      required: ['filePath'],
      additionalProperties: false,
    },
  },
  {
    name: 'explain_rule',
    description: 'Explain a known Solhint rule and suggest a correction.',
    inputSchema: {
      type: 'object',
      properties: { ruleId: { type: 'string', minLength: 1, description: 'Solhint rule ID' } },
      required: ['ruleId'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_config',
    description: 'Read the Solhint config for this server instance project.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
])

function severityLabel(severity) {
  if (typeof severity === 'number') return severity === 2 ? '🔴 error' : '🟡 warning'
  return String(severity).toLowerCase() === 'error' ? '🔴 error' : '🟡 warning'
}

function formatReports(reports) {
  const errors = reports.reduce((total, report) => total + report.errorCount, 0)
  const warnings = reports.reduce((total, report) => total + report.warningCount, 0)
  const grouped = new Map()
  for (const report of reports) {
    const filePath = report.filePath || 'contract.sol'
    const messages = grouped.get(filePath) || []
    messages.push(...report.messages)
    grouped.set(filePath, messages)
  }

  const sections = []
  for (const filePath of [...grouped.keys()].sort()) {
    const messages = grouped
      .get(filePath)
      .sort((left, right) => left.line - right.line || left.column - right.column)
    if (messages.length === 0) continue
    sections.push(`\n**${filePath}**`)
    for (const message of messages) {
      sections.push(
        `  ${severityLabel(message.severity)}  L${message.line}:${message.column}  \`${message.ruleId || '?'}\`  ${message.message}`,
      )
    }
  }

  const summary = `**Summary**: ${errors} error(s), ${warnings} warning(s)`
  return sections.length > 0
    ? `${summary}\n${sections.join('\n')}`
    : `${summary}\n\n✅ No violations found.`
}

function success(text) {
  return { content: [{ type: 'text', text }] }
}

function failure(error, resolutionText) {
  const message = error instanceof Error ? error.message : String(error)
  return {
    content: [{ type: 'text', text: `${resolutionText}\n\nError: ${message}` }],
    isError: true,
  }
}

const MAX_EXAMPLES_PER_KIND = 2

function codeBlock(code) {
  const lines = String(code)
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
  while (lines.length > 0 && lines[0] === '') lines.shift()
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()

  return ['```solidity', ...lines, '```'].join('\n')
}

function exampleSection(title, entries) {
  if (!Array.isArray(entries) || entries.length === 0) return []

  return entries.slice(0, MAX_EXAMPLES_PER_KIND).flatMap((entry) => {
    const caption = entry.description ? `${title} — ${entry.description}` : title
    return [`**${caption}**`, codeBlock(entry.code)]
  })
}

function explainRule(runner, ruleId) {
  const rule = runner.describeRule(ruleId)
  if (!rule) {
    return (
      `Solhint has no rule called \`${ruleId}\`.\n` +
      'Call `lint_project` or `get_config` to see the rules this project actually uses, ' +
      'or browse https://protofire.github.io/solhint/docs/rules.html'
    )
  }

  const heading = rule.category ? `## \`${ruleId}\` — ${rule.category}` : `## \`${ruleId}\``
  const sections = [heading]
  if (rule.description) sections.push(rule.description)

  if (rule.defaultSetup !== undefined) {
    const preset = rule.recommended ? ' (enabled by `solhint:recommended`)' : ''
    sections.push(`**Default:** \`${JSON.stringify(rule.defaultSetup)}\`${preset}`)
  }

  if (rule.options.length > 0) {
    const options = rule.options.map((option) => {
      const fallback = option.default === undefined ? '' : ` (default: \`${option.default}\`)`
      return `- ${option.description || 'Option'}${fallback}`
    })
    sections.push(['**Options**', ...options].join('\n'))
  }

  if (rule.notes.length > 0) {
    const notes = rule.notes.map((entry) => `- ${entry.note || entry}`)
    sections.push(['**Notes**', ...notes].join('\n'))
  }

  sections.push(...exampleSection('Good', rule.examples?.good))
  sections.push(...exampleSection('Bad', rule.examples?.bad))

  return sections.join('\n\n')
}

function isInside(root, target) {
  const relative = path.relative(root, target)
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  )
}

function resolveProjectFile(projectRoot, filePath) {
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    throw new Error('filePath is required and must be a string')
  }
  const candidate = path.resolve(projectRoot, filePath)
  if (!isInside(projectRoot, candidate)) throw new Error('filePath is outside the project root')
  if (!fs.existsSync(candidate)) throw new Error(`File not found: ${candidate}`)
  const realPath = fs.realpathSync(candidate)
  if (!isInside(projectRoot, realPath)) throw new Error('filePath is outside the project root')
  if (!fs.statSync(realPath).isFile()) throw new Error(`Not a file: ${candidate}`)
  if (path.extname(realPath) !== '.sol') throw new Error('filePath must reference a .sol file')
  return realPath
}

function projectPattern(projectRoot, requestedPattern) {
  if (requestedPattern !== undefined) {
    if (typeof requestedPattern !== 'string' || requestedPattern.trim() === '') {
      throw new Error('pattern must be a non-empty string')
    }
    const normalized = requestedPattern.replace(/\\/g, '/')
    if (path.isAbsolute(requestedPattern) || normalized.split('/').includes('..')) {
      throw new Error('pattern must stay inside the project root')
    }
    return normalized
  }
  if (fs.existsSync(path.join(projectRoot, 'contracts'))) return 'contracts/**/*.sol'
  if (fs.existsSync(path.join(projectRoot, 'src'))) return 'src/**/*.sol'
  return '**/*.sol'
}

function enabled(value) {
  const severity = Array.isArray(value) ? value[0] : value
  return severity !== undefined && severity !== false && severity !== 0 && severity !== 'off'
}

function formatConfig(runner) {
  const { config, configPath, effectiveConfig } = runner.getProjectConfig()
  if (!configPath) {
    return (
      'No project Solhint config found. The default for `lint_solidity` is:\n\n' +
      '```json\n{\n  "extends": "solhint:recommended"\n}\n```'
    )
  }
  const suggestions = []
  const rules = effectiveConfig?.rules || {}
  if (!enabled(rules['gas-custom-errors'])) suggestions.push('Add `gas-custom-errors`')
  if (!enabled(rules['reason-string'])) suggestions.push('Add `reason-string`')
  if (!enabled(rules['compiler-version'])) suggestions.push('Add `compiler-version`')
  const suggestionText = suggestions.length
    ? `\n\n**Suggestions:**\n${suggestions.map((item) => `- ${item}`).join('\n')}`
    : '\n\n✅ Effective config already enables the recommended checks.'
  return `**Found:** \`${configPath}\`\n\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\`${suggestionText}`
}

function withProtocolStdoutProtected(action) {
  const originalWrite = process.stdout.write
  process.stdout.write = process.stderr.write.bind(process.stderr)
  try {
    return action()
  } finally {
    process.stdout.write = originalWrite
  }
}

function formatFixResult({ fixed, ruleIds, output, reports }, { file = null, written = false }) {
  const target = file ? `\`${file}\`` : 'the supplied source'
  if (!fixed) {
    return `No autofixable violations in ${target}.\n\n${formatReports(reports)}`
  }
  const applied = `Fixed ${ruleIds.length} rule${ruleIds.length === 1 ? '' : 's'} in ${target}: ${ruleIds.map((id) => `\`${id}\``).join(', ')}`
  let disposition = ''
  if (file) {
    disposition = written
      ? '\n\nThe file has been written.'
      : '\n\nPreview only — the file was not modified. Call again with `write: true` to save it.'
  }
  return `${applied}${disposition}\n\n\`\`\`solidity\n${output}\n\`\`\`\n\nRemaining after the fix:\n\n${formatReports(reports)}`
}

function createToolService({ runner }) {
  const resolutionText = runner.describeResolution()
  function call(name, args = {}) {
    try {
      return withProtocolStdoutProtected(() => {
        if (!args || typeof args !== 'object' || Array.isArray(args)) {
          throw new Error('arguments must be an object')
        }
        if (name === 'lint_solidity') {
          if (typeof args.code !== 'string' || args.code.length === 0) {
            throw new Error('code is required and must be a non-empty string')
          }
          return success(
            `${resolutionText}\n\n${formatReports(runner.lintSource(args.code, args.config).reports)}`,
          )
        }
        if (name === 'lint_file') {
          const file = resolveProjectFile(runner.projectRoot, args.filePath)
          return success(`${resolutionText}\n\n${formatReports(runner.lintFiles([file]).reports)}`)
        }
        if (name === 'lint_project') {
          const pattern = projectPattern(runner.projectRoot, args.pattern)
          const files = globSync(pattern, {
            absolute: true,
            cwd: runner.projectRoot,
            ignore: ['**/node_modules/**'],
            nodir: true,
          })
            .map((file) => resolveProjectFile(runner.projectRoot, file))
            .sort()
          return success(
            `${resolutionText}\n\n${formatReports(runner.lintFiles([...new Set(files)]).reports)}`,
          )
        }
        if (name === 'fix_solidity') {
          if (typeof args.code !== 'string' || args.code.length === 0) {
            throw new Error('code is required and must be a non-empty string')
          }
          const result = runner.fixSource(args.code, args.config)
          return success(`${resolutionText}\n\n${formatFixResult(result, {})}`)
        }
        if (name === 'fix_file') {
          const file = resolveProjectFile(runner.projectRoot, args.filePath)
          if (args.write !== undefined && typeof args.write !== 'boolean') {
            throw new Error('write must be a boolean')
          }
          const result = runner.fixFile(file)
          const written = args.write === true && result.fixed
          if (written) fs.writeFileSync(file, result.output)
          const relative = path.relative(runner.projectRoot, file)
          return success(
            `${resolutionText}\n\n${formatFixResult(result, { file: relative, written })}`,
          )
        }
        if (name === 'explain_rule') {
          if (typeof args.ruleId !== 'string' || args.ruleId.length === 0) {
            throw new Error('ruleId is required and must be a non-empty string')
          }
          return success(`${resolutionText}\n\n${explainRule(runner, args.ruleId)}`)
        }
        if (name === 'get_config') return success(`${resolutionText}\n\n${formatConfig(runner)}`)
        throw new Error(`Unknown tool: ${name}`)
      })
    } catch (error) {
      return failure(error, resolutionText)
    }
  }
  return Object.freeze({ call })
}

module.exports = { TOOL_DEFINITIONS, createToolService, explainRule, formatReports }
