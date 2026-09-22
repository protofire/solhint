# @solhint/mcp-server

An MCP server that exposes Solhint as tools for Claude Code and other MCP clients.

The server runs Solhint through its JavaScript API. It does not start a shell, invoke
`npx solhint`, make update checks, or parse CLI output.

## Requirements

- Node.js 20 or newer.
- One server process per Solidity project.

The process working directory is the project root. Start another server process for a
different project.

## Claude Code

From the Solidity project directory:

```bash
claude mcp add solhint -- npx -y @solhint/mcp-server
```

The default local scope associates the server with the current project. Use
`--scope project` before `--` if the configuration should be committed in `.mcp.json`.

On native Windows, Claude Code requires `cmd /c` for local MCP servers launched with
`npx`:

```powershell
claude mcp add solhint -- cmd /c npx -y @solhint/mcp-server
```

## Claude Desktop

Claude Desktop installation is separate from Claude Code. This package is currently a
stdio npm server, not a packaged Desktop Extension (`.mcpb`). Configure it as a local
development MCP server only if the client launches it with the Solidity project as its
working directory. See Anthropic's current
[Claude Desktop local-server instructions](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop).

## Tools

| Tool            | Input               | Description                             |
| --------------- | ------------------- | --------------------------------------- |
| `lint_solidity` | `{ code, config? }` | Lint a Solidity source string           |
| `lint_file`     | `{ filePath }`      | Lint one `.sol` file inside the project |
| `lint_project`  | `{ pattern? }`      | Lint a project-relative glob            |
| `explain_rule`  | `{ ruleId }`        | Explain a curated Solhint rule          |
| `get_config`    | `{}`                | Show the project's Solhint config       |

`lint_project` autodetects `contracts/**/*.sol`, then `src/**/*.sol`, and finally
`**/*.sol`. Paths and patterns outside the project root are rejected.

## Configuration

`lint_solidity` uses configuration in this order:

1. The complete `config` object supplied to the tool.
2. The configuration found in the project root.
3. `{ "extends": "solhint:recommended" }`.

An explicit config replaces the project config; it is not merged. File and project
linting use Solhint's per-file configuration hierarchy and the same recommended fallback
when no configuration exists.

The server prefers a compatible `solhint` (`>=6.1.0 <7.0.0`) installed by the project.
If none exists, it uses its bundled, tested version. An installed but incompatible
project version produces an explicit error. Pass `--bundled-solhint` only when you
intentionally want the bundled version.

Solhint 6.0.x is excluded because its plugin loader can terminate the host process when
a configured plugin cannot be loaded, which is unsafe for an in-process MCP server.

## Protocol and current limitations

The server uses `@modelcontextprotocol/server` 2.x over stdio. It supports the current
2026-07-28 lifecycle and the SDK's legacy compatibility path.

Solhint currently resolves shareable configs and plugins relative to `process.cwd()`.
That is why this release supports one project per process. A third-party plugin that
writes to stdout synchronously is redirected to stderr while linting so it cannot corrupt
the MCP channel. Full plugin isolation, cancellation, and lint timeouts are deferred to a
worker-based release.
