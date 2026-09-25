const fs = require('fs')
const path = require('path')
const { globSync } = require('glob')

const RULE_DOCS = Object.freeze({
  'compiler-version': {
    summary: "Pragma doesn't match the required semver range.",
    why: 'Wide compiler ranges can introduce unexpected behavior between releases.',
    fix: 'Use a compiler range that matches the project policy.',
  },
  'func-name-mixedcase': {
    summary: 'Function name must be in camelCase.',
    why: 'Consistent naming makes contracts and generated ABIs easier to understand.',
    fix: 'Rename `function Transfer()` to `function transfer()`.',
  },
  'state-visibility': {
    summary: 'State variable has no explicit visibility modifier.',
    why: 'Explicit visibility makes the contract interface unambiguous.',
    fix: 'Add `public`, `private`, or `internal` to the declaration.',
  },
  'reason-string': {
    summary: 'A require or revert reason does not meet the configured policy.',
    why: 'Useful reasons make failures easier to diagnose.',
    fix: 'Add a concise reason or use a custom error.',
  },
  'gas-custom-errors': {
    summary: 'A string-based require can be replaced with a custom error.',
    why: 'Custom errors generally reduce deployment and execution gas.',
    fix: 'Declare a custom error and revert with it.',
  },
  'no-unused-vars': {
    summary: 'A variable is declared but never used.',
    why: 'Unused declarations add noise and can hide incomplete logic.',
    fix: 'Remove the declaration or use the value.',
  },
  'avoid-suicide': {
    summary: 'The contract uses selfdestruct or its deprecated suicide alias.',
    why: 'The opcode has changed semantics and should not be used for ordinary lifecycle control.',
    fix: 'Redesign the lifecycle without selfdestruct.',
  },
  'explicit-types': {
    summary: 'An abbreviated integer type is used.',
    why: 'Explicit widths make the intended representation clear.',
    fix: 'Replace `uint` with `uint256`, and `int` with `int256`.',
  },
})

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

function explainRule(ruleId) {
  const doc = RULE_DOCS[ruleId]
  if (!doc) {
    return `No detailed explanation found for rule \`${ruleId}\`.\nSee https://protofire.github.io/solhint/docs/rules.html`
  }
  return (
    `## \`${ruleId}\`\n\n` +
    `**What it checks:** ${doc.summary}\n\n` +
    `**Why it matters:** ${doc.why}\n\n` +
    `**How to fix:** ${doc.fix}`
  )
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
        if (name === 'explain_rule') {
          if (typeof args.ruleId !== 'string' || args.ruleId.length === 0) {
            throw new Error('ruleId is required and must be a non-empty string')
          }
          return success(`${resolutionText}\n\n${explainRule(args.ruleId)}`)
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

module.exports = { RULE_DOCS, TOOL_DEFINITIONS, createToolService, explainRule, formatReports }
