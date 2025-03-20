/**
 * @fileoverview SARIF v2.1 formatter
 * @author Adapted for solhint by @eshaan7 (Original: Microsoft <https://www.npmjs.com/package/@microsoft/eslint-formatter-sarif>)
 */

const url = require('url')
const lodash = require('lodash')

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the version of used solhint package
 * @returns {string} solhint version or undefined
 * @private
 */
function getSolhintVersion() {
  try {
    // Resolve solhint relative to main entry script, not the formatter
    const solhintPackageJson = require('../../package.json')
    return solhintPackageJson.version
  } catch {
    // Formatter was not called from solhint, return undefined
  }
}

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getResultLevel(message) {
  if (message.fatal || message.severity === 2) {
    return 'error'
  }
  return 'warning'
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results, data) {
  const rulesMeta = lodash.get(data, 'rulesMeta', null)

  const sarifLog = {
    version: '2.1.0',
    $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
    runs: [
      {
        tool: {
          driver: {
            name: 'solhint',
            informationUri: 'https://github.com/protofire/solhint',
            rules: [],
          },
        },
      },
    ],
  }

  const solhintVersion = getSolhintVersion()
  if (typeof solhintVersion !== 'undefined') {
    sarifLog.runs[0].tool.driver.version = solhintVersion
  }

  const sarifFiles = {}
  const sarifArtifactIndices = {}
  let nextArtifactIndex = 0
  const sarifRules = {}
  const sarifRuleIndices = {}
  let nextRuleIndex = 0
  const sarifResults = []

  // Emit a tool configuration notification with this id if ESLint emits a message with
  // no ruleId (which indicates an internal error in ESLint).
  //
  // It is not clear whether we should treat these messages tool configuration notifications,
  // tool execution notifications, or a mixture of the two, based on the properties of the
  // message. https://github.com/microsoft/sarif-sdk/issues/1798, "ESLint formatter can't
  // distinguish between an internal error and a misconfiguration", tracks this issue.
  const internalErrorId = 'ESL0999'

  const toolConfigurationNotifications = []
  let executionSuccessful = true

  for (const result of results) {
    // Only add it if not already there.
    if (typeof sarifFiles[result.filePath] === 'undefined') {
      sarifArtifactIndices[result.filePath] = nextArtifactIndex++

      // Create a new entry in the files dictionary.
      sarifFiles[result.filePath] = {
        location: {
          uri: url.pathToFileURL(result.filePath),
        },
      }

      const containsSuppressedMessages =
        result.suppressedMessages && result.suppressedMessages.length > 0
      const messages = containsSuppressedMessages
        ? [...result.messages, ...result.suppressedMessages]
        : result.messages

      if (messages.length > 0) {
        for (const message of messages) {
          const sarifRepresentation = {
            level: getResultLevel(message),
            message: {
              text: message.message,
            },
            locations: [
              {
                physicalLocation: {
                  artifactLocation: {
                    uri: url.pathToFileURL(result.filePath),
                    index: sarifArtifactIndices[result.filePath],
                  },
                },
              },
            ],
          }

          if (message.ruleId) {
            sarifRepresentation.ruleId = message.ruleId

            if (rulesMeta && typeof sarifRules[message.ruleId] === 'undefined') {
              const meta = rulesMeta[message.ruleId]

              // An unknown ruleId will return null. This check prevents unit test failure.
              if (meta) {
                sarifRuleIndices[message.ruleId] = nextRuleIndex++

                if (meta.docs) {
                  // Create a new entry in the rules dictionary.
                  sarifRules[message.ruleId] = {
                    id: message.ruleId,
                    helpUri: meta.docs.url,
                    properties: {
                      category: meta.docs.category,
                    },
                  }
                  if (meta.docs.description) {
                    sarifRules[message.ruleId].shortDescription = {
                      text: meta.docs.description,
                    }
                  }
                  // Some rulesMetas do not have docs property
                } else {
                  sarifRules[message.ruleId] = {
                    id: message.ruleId,
                    helpUri: 'Please see details in message',
                    properties: {
                      category: 'No category provided',
                    },
                  }
                }
              }
            }

            if (sarifRuleIndices[message.ruleId] !== 'undefined') {
              sarifRepresentation.ruleIndex = sarifRuleIndices[message.ruleId]
            }

            if (containsSuppressedMessages) {
              sarifRepresentation.suppressions = message.suppressions
                ? message.suppressions.map((suppression) => {
                    return {
                      kind: suppression.kind === 'directive' ? 'inSource' : 'external',
                      justification: suppression.justification,
                    }
                  })
                : []
            }
          } else {
            // ESLint produces a message with no ruleId when it encounters an internal
            // error. SARIF represents this as a tool execution notification rather
            // than as a result, and a notification has a descriptor.id property rather
            // than a ruleId property.
            sarifRepresentation.descriptor = {
              id: internalErrorId,
            }

            // As far as we know, whenever ESLint produces a message with no rule id,
            // it has severity: 2 which corresponds to a SARIF error. But check here
            // anyway.
            if (sarifRepresentation.level === 'error') {
              // An error-level notification means that the tool failed to complete
              // its task.
              executionSuccessful = false
            }
          }

          if (message.line > 0 || message.column > 0) {
            sarifRepresentation.locations[0].physicalLocation.region = {}
            if (message.line > 0) {
              sarifRepresentation.locations[0].physicalLocation.region.startLine = message.line
            }
            if (message.column > 0) {
              sarifRepresentation.locations[0].physicalLocation.region.startColumn = message.column
            }
            if (message.endLine > 0) {
              sarifRepresentation.locations[0].physicalLocation.region.endLine = message.endLine
            }
            if (message.endColumn > 0) {
              sarifRepresentation.locations[0].physicalLocation.region.endColumn = message.endColumn
            }
          }

          if (message.source) {
            // Create an empty region if we don't already have one from the line / column block above.
            sarifRepresentation.locations[0].physicalLocation.region =
              sarifRepresentation.locations[0].physicalLocation.region || {}
            sarifRepresentation.locations[0].physicalLocation.region.snippet = {
              text: message.source,
            }
          }

          if (message.ruleId) {
            sarifResults.push(sarifRepresentation)
          } else {
            toolConfigurationNotifications.push(sarifRepresentation)
          }
        }
      }
    }
  }

  if (Object.keys(sarifFiles).length > 0) {
    sarifLog.runs[0].artifacts = []

    for (const path of Object.keys(sarifFiles)) {
      sarifLog.runs[0].artifacts.push(sarifFiles[path])
    }
  }

  // Per the SARIF spec §3.14.23, run.results must be present even if there are no results.
  // This provides a positive indication that the run completed and no results were found.
  sarifLog.runs[0].results = sarifResults

  if (toolConfigurationNotifications.length > 0) {
    sarifLog.runs[0].invocations = [
      {
        toolConfigurationNotifications,
        executionSuccessful,
      },
    ]
  }

  if (Object.keys(sarifRules).length > 0) {
    for (const ruleId of Object.keys(sarifRules)) {
      const rule = sarifRules[ruleId]
      sarifLog.runs[0].tool.driver.rules.push(rule)
    }
  }

  return JSON.stringify(
    sarifLog,
    null, // replacer function
    2 // # of spaces for indents
  )
}
