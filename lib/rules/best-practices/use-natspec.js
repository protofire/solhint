const _ = require('lodash')
const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const ruleId = 'use-natspec'

const DEFAULT_SEVERITY = 'warn'
const VALID_TAGS = new Set(['title', 'author', 'notice', 'param', 'return', 'inheritdoc'])
const DEFAULT_CONFIG = {
  title: { enabled: true, ignore: {} },
  author: { enabled: true, ignore: {} },
  notice: { enabled: true, ignore: {} },
  param: { enabled: true, ignore: {} },
  return: { enabled: true, ignore: {} },
}

const NATSPEC_TARGETS = {
  contract: ['title', 'author', 'notice'],
  library: ['title', 'author', 'notice'],
  interface: ['title', 'author', 'notice'],
  function: ['notice', 'param', 'return'],
  event: ['notice', 'param'],
  variable: ['notice'],
}

const META_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        ignore: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'array',
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        },
      },
      required: ['enabled'],
      additionalProperties: false,
    },
    author: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        ignore: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'array',
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        },
      },
      required: ['enabled'],
      additionalProperties: false,
    },
    notice: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        ignore: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'array',
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        },
      },
      required: ['enabled'],
      additionalProperties: false,
    },
    param: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        ignore: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'array',
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        },
      },
      required: ['enabled'],
      additionalProperties: false,
    },
    return: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        ignore: {
          type: 'object',
          patternProperties: {
            '.*': {
              type: 'array',
              items: { type: 'string' },
            },
          },
          additionalProperties: false,
        },
      },
      required: ['enabled'],
      additionalProperties: false,
    },
  },
  additionalProperties: false,
}

const meta = {
  type: 'best-practices',

  docs: {
    description: 'Enforces the presence and correctness of NatSpec tags.',
    category: 'Best Practices Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: 'A JSON object with natspec properties. See EXAMPLE CONFIG section below.',
        default: 'Check EXAMPLE CONFIG',
      },
    ],

    examples: {
      good: [
        {
          description: 'Contract with valid NatSpec',
          code: `
                /// @title Token contract
                /// @author Me
                /// @notice This contract handles tokens
                contract Token {
                  /// @notice Transfers tokens
                  /// @param to The recipient address
                  /// @param amount The amount to transfer
                  /// @return success Whether the transfer succeeded
                  function transfer(address to, uint256 amount) public returns (bool success) {
                    return true;
                  }
                }
              `,
        },
        {
          description:
            'You can disable specific tags globally or by type/name using the `ignore` option in the config. For example:',
          code: `{
                "use-natspec": [
                  "warn",
                  {
                    "title": {
                      "enabled": true,
                      "ignore": {
                        "contract": ["MyContract"],
                        "*": ["LegacyContract"]
                      }
                    },
                    "param": { "enabled": false }
                  }
                ]
              }`,
        },
        {
          description: 'The default configuration enables all checks with no ignore rules:',
          code: `{
                "title": { "enabled": true, "ignore": {} },
                "author": { "enabled": true, "ignore": {} },
                "notice": { "enabled": true, "ignore": {} },
                "param": { "enabled": true, "ignore": {} },
                "return": { "enabled": true, "ignore": {} }
              }`,
        },
      ],
      bad: [
        {
          description: 'Missing @notice and incorrect @param and @return tags',
          code: `
                /// @title Token contract
                contract Token {
                  /// @param wrongParam Not matching actual parameter
                  function transfer(address to) public returns (bool) {
                    return true;
                  }
                }
                `,
        },
      ],
    },
    notes: [
      {
        note: 'If a function or return value has unnamed parameters (e.g. `function foo(uint256)`), the rule only checks the number of `@param` or `@return` tags, not their names.',
      },
      {
        note: 'If a function or variable has `@inheritdoc`, the rule skips the validation.',
      },
      {
        note: 'The rule supports both `///` and `/** */` style NatSpec comments.',
      },
      {
        note: 'If a custom config is provided, it is merged with the default config. Only the overridden fields need to be specified.',
      },
    ],
  },

  recommended: true,
  defaultSetup: ['warn', DEFAULT_CONFIG],

  schema: META_SCHEMA,
}

class UseNatspecChecker extends BaseChecker {
  constructor(reporter, config, tokens) {
    super(reporter, ruleId, meta)
    if (!this.enabled) return // if the rule is disabled, do nothing

    this.tokens = tokens
    const userConfig = config?.getObject(ruleId) || {}
    this.tagConfig = _.merge({}, DEFAULT_CONFIG, userConfig)
  }

  ContractDefinition(node) {
    this.checkNode(node, 'contract')
  }

  LibraryDefinition(node) {
    this.checkNode(node, 'library')
  }

  InterfaceDefinition(node) {
    this.checkNode(node, 'interface')
  }

  FunctionDefinition(node) {
    const visibility = node.visibility || 'default'
    const isPublicLike = visibility === 'public' || visibility === 'external'
    const tags = [...NATSPEC_TARGETS.function]

    if (!hasParameters(node)) tags.splice(tags.indexOf('param'), 1)
    if (!hasReturn(node)) tags.splice(tags.indexOf('return'), 1)

    this.checkNode(node, 'function', tags, isPublicLike)
  }

  EventDefinition(node) {
    const tags = [...NATSPEC_TARGETS.event]
    if (!hasParameters(node)) tags.splice(tags.indexOf('param'), 1)
    this.checkNode(node, 'event', tags)
  }

  VariableDeclaration(node) {
    if (!node.isStateVar || node.visibility !== 'public') return
    this.checkNode(node, 'variable', NATSPEC_TARGETS.variable, true)
  }

  checkNode(node, type, overrideTags, requireNoticeIfPublic = false) {
    const name = node.name || (node.id && node.id.name) || '<anonymous>'
    const tagsRequired = overrideTags || NATSPEC_TARGETS[type] || []
    const startOffset = node.range[0]
    const comments = getLeadingNatSpecComments(startOffset, this.tokens)
    const tags = extractNatSpecTags(comments)

    // console.log('\n>>> CHECKING', type, name)
    // console.log('COMMENTS:', comments)
    // console.log('TAGS:', tags)

    const hasInheritdoc = tags.includes('inheritdoc')
    if (requireNoticeIfPublic && hasInheritdoc) return

    for (const tag of tagsRequired) {
      const rule = this.tagConfig[tag]
      if (!rule?.enabled) continue
      if (!shouldValidateTag(tag, type, name, this.tagConfig)) continue

      if (!tags.includes(tag)) {
        this.reporter.warn(node, ruleId, `Missing @${tag} tag in ${type} '${name}'`)
      }

      if (tag === 'param') {
        const docParams = extractTagNames(comments, 'param')
        const solidityParams = node.parameters || []

        const namedParams = solidityParams
          .map((p) => p.name)
          .filter((name) => typeof name === 'string' && name.length > 0)

        const allParamsHaveNames = namedParams.length === solidityParams.length

        if (allParamsHaveNames) {
          if (namedParams.length !== docParams.length || !arraysEqual(namedParams, docParams)) {
            this.reporter.warn(
              node,
              ruleId,
              `Mismatch in @param names for ${type} '${name}'. Expected: [${namedParams.join(
                ', '
              )}], Found: [${docParams.join(', ')}]`
            )
          }
        } else if (solidityParams.length !== docParams.length) {
          this.reporter.warn(
            node,
            ruleId,
            `Mismatch in @param count for ${type} '${name}'. Expected: ${solidityParams.length}, Found: ${docParams.length}`
          )
        }
      }

      if (tag === 'return') {
        const docReturns = extractTagNames(comments, 'return')
        const solidityReturns = node.returnParameters || []

        const namedReturns = solidityReturns
          .map((p) => p.name)
          .filter((name) => typeof name === 'string' && name.length > 0)

        const allReturnsHaveNames = namedReturns.length === solidityReturns.length

        if (allReturnsHaveNames) {
          if (namedReturns.length !== docReturns.length || !arraysEqual(namedReturns, docReturns)) {
            this.reporter.warn(
              node,
              ruleId,
              `Mismatch in @return names for ${type} '${name}'. Expected: [${namedReturns.join(
                ', '
              )}], Found: [${docReturns.join(', ')}]`
            )
          }
        } else if (solidityReturns.length !== docReturns.length) {
          this.reporter.warn(
            node,
            ruleId,
            `Mismatch in @return count for ${type} '${name}'. Expected: ${solidityReturns.length}, Found: ${docReturns.length}`
          )
        }
      }
    }
  }
}

function getLeadingNatSpecComments(startOffset, tokens) {
  const comments = []

  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]

    if (token.range[1] > startOffset) continue

    const value = token.value?.trim()
    if (
      typeof value === 'string' &&
      (value.startsWith('///') || value.startsWith('/**')) &&
      value.includes('@') &&
      hasAnyNatSpecTag(value)
    ) {
      comments.unshift(value)
    }

    // Si encontramos código real (no comentario ni puntuación), cortamos
    if (!value || (!value.startsWith('///') && !value.startsWith('/**'))) {
      if (token.type !== 'Punctuator') break
    }
  }

  return comments
}

function extractTagNames(comments, tag) {
  const names = []
  const regex = new RegExp(`@${tag}\\s+(\\w+)`, 'g')

  for (const comment of comments) {
    let match = regex.exec(comment)
    while (match !== null) {
      names.push(match[1])
      match = regex.exec(comment)
    }
  }

  return names
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  return arr1.every((v, i) => v === arr2[i])
}

function hasAnyNatSpecTag(commentValue) {
  for (const [, tag] of commentValue.matchAll(/@([a-zA-Z0-9_]+)/g)) {
    if (VALID_TAGS.has(tag)) return true
  }
  return false
}

function extractNatSpecTags(comments) {
  const tags = new Set()
  for (const comment of comments) {
    const matches = comment.matchAll(/@([a-zA-Z0-9_]+)/g)
    for (const [, tag] of matches) {
      tags.add(tag)
    }
  }
  return [...tags]
}

function shouldValidateTag(tag, type, name, config) {
  const tagConf = config[tag]
  if (!tagConf || !tagConf.enabled) return false
  const ignoreByType = tagConf.ignore?.[type] || []
  const ignoreGlobal = tagConf.ignore?.['*'] || []
  return !ignoreByType.includes(name) && !ignoreGlobal.includes(name)
}

function hasParameters(node) {
  return node.parameters && node.parameters.length > 0
}

function hasReturn(node) {
  return node.returnParameters && node.returnParameters.length > 0
}

module.exports = UseNatspecChecker
