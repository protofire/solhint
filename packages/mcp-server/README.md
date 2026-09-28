# solhint-mcp

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
claude mcp add solhint -- npx -y solhint-mcp
```

The default local scope associates the server with the current project. Use
`--scope project` before `--` if the configuration should be committed in `.mcp.json`.

On native Windows, Claude Code requires `cmd /c` for local MCP servers launched with
`npx`:

```powershell
claude mcp add solhint -- cmd /c npx -y solhint-mcp
```

## Claude Desktop

Claude Desktop installation is separate from Claude Code. This package is currently a
stdio npm server, not a packaged Desktop Extension (`.mcpb`). Configure it as a local
development MCP server only if the client launches it with the Solidity project as its
working directory. See Anthropic's current
[Claude Desktop local-server instructions](https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop).

## Tools

| Tool            | Input                  | Description                             |
| --------------- | ---------------------- | --------------------------------------- |
| `lint_solidity` | `{ code, config? }`    | Lint a Solidity source string           |
| `lint_file`     | `{ filePath }`         | Lint one `.sol` file inside the project |
| `lint_project`  | `{ pattern? }`         | Lint a project-relative glob            |
| `fix_solidity`  | `{ code, config? }`    | Autofix a Solidity source string        |
| `fix_file`      | `{ filePath, write? }` | Autofix one `.sol` file                 |
| `explain_rule`  | `{ ruleId }`           | Explain any rule the linter ships       |
| `get_config`    | `{}`                   | Show the project's Solhint config       |

`lint_project` autodetects `contracts/**/*.sol`, then `src/**/*.sol`, and finally
`**/*.sol`. Paths and patterns outside the project root are rejected.

The `fix_*` tools apply Solhint's own autofixes and then re-lint, so what they report
as remaining is what is genuinely left rather than the pre-fix report. `fix_solidity`
returns the corrected source and touches nothing on disk. `fix_file` previews by
default and only writes when called with `write: true` — Solhint's CLI asks for a
backup before `--fix`, and an MCP client should not rewrite someone's contracts
without being asked either.

`explain_rule` reads the documentation Solhint ships with each rule, so it covers the
whole registry and always describes the version this project runs: description,
category, default severity, configurable options, notes and the good/bad examples when
the rule defines them.

## If your repository already documents a lint command

An agent follows an explicit instruction in your repository over a tool description.
If `AGENTS.md`, `CLAUDE.md` or a similar playbook says how to lint, for example:

```markdown
- Solidity lint: `npm run lint:sol`
```

the agent will run that command and never reach for these tools. That is reasonable
behaviour, not a misconfiguration, but it means the server goes unused until you say it
is there. Mention it alongside the command:

```markdown
- Solidity lint: prefer the `solhint` MCP tools (`lint_file`, `lint_project`,
  `fix_file`, `explain_rule`, `get_config`) when that server is configured; they run this project's
  own Solhint with its config. Fall back to `npm run lint:sol` when the server is
  unavailable.
```

The two are complementary. The command is what a person and CI run. The tools are what
an agent runs, and their advantage is that the invocation cannot drift: no unquoted
`**` collapsing to a single level, no forgotten config, no stray flag. A shell glob
written by hand can silently cover a fraction of a project; `lint_project` cannot.

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
