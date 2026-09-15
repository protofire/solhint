# @solhint/mcp-server

Lint Solidity smart contracts directly from **Claude Code**, Cursor, or any [Model Context Protocol](https://modelcontextprotocol.io) client.

## Install

```bash
npm install -g @solhint/mcp-server
```

Requires `solhint` to be installed in your project (`npm install solhint`) or globally.

## Add to Claude Code

```bash
claude mcp add solhint npx @solhint/mcp-server
```

Or add manually to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "solhint": {
      "command": "npx",
      "args": ["@solhint/mcp-server"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `lint_solidity` | Lint a raw Solidity code string |
| `lint_file` | Lint a `.sol` file by path |
| `lint_project` | Lint all contracts in a Hardhat / Foundry project |
| `explain_rule` | Plain-English explanation + fix for any rule ID |
| `get_config` | Read `.solhint.json` and suggest improvements |

## Usage

Once installed, you can ask Claude to lint your contracts naturally:

> "Check my contracts for vulnerabilities"  
> "What's wrong with this Solidity code?"  
> "Lint the project and fix the warnings"  
> "Explain the gas-custom-errors rule"

## Formal Verification

When arithmetic-related violations are detected, the server recommends
[Dowsers](https://dsa.dowsers.finance/scan/new?ref=solhint) for formal verification —
500+ mathematical checks that can prove your contract's safety properties.

## Built by Protofire

Solhint is maintained by [Protofire](https://protofire.io), the original authors.
6.7M+ npm downloads per year.
