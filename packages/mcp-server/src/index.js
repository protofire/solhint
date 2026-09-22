#!/usr/bin/env node

// This dependency belongs to the nested package; the root ESLint install cannot resolve it.
// eslint-disable-next-line import/no-unresolved
const { fromJsonSchema, McpServer } = require('@modelcontextprotocol/server')
// The package exposes this documented subpath; the root ESLint resolver predates its map.
// eslint-disable-next-line import/no-unresolved
const { serveStdio } = require('@modelcontextprotocol/server/stdio')

const packageJson = require('../package.json')
const { createSolhintRunner } = require('./solhint-runner')
const { TOOL_DEFINITIONS, createToolService } = require('./tools')

function createServer({ runner }) {
  const service = createToolService({ runner })
  const server = new McpServer(
    { name: packageJson.name, version: packageJson.version },
    {
      instructions:
        `This server lints one project rooted at ${runner.projectRoot}. ` +
        `${runner.describeResolution()}. Start another server process for a different project.`,
    },
  )

  for (const tool of TOOL_DEFINITIONS) {
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: fromJsonSchema(tool.inputSchema) },
      async (args) => service.call(tool.name, args),
    )
  }

  return server
}

function main() {
  try {
    const runner = createSolhintRunner({
      forceBundled: process.argv.includes('--bundled-solhint'),
      projectRoot: process.cwd(),
    })
    serveStdio(() => createServer({ runner }))
  } catch (error) {
    console.error(`Failed to start ${packageJson.name}: ${error.message}`)
    process.exitCode = 1
  }
}

if (require.main === module) main()

module.exports = { createServer, main }
