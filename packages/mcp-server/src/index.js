#!/usr/bin/env node
/**
 * @solhint/mcp-server
 * MCP server that exposes Solhint linting as tools for Claude Code and other MCP clients.
 *
 * Tools:
 *   lint_solidity   — lint a raw Solidity code string
 *   lint_file       — lint a .sol file by path
 *   lint_project    — lint all contracts in a directory
 *   explain_rule    — plain-English explanation of a rule ID
 *   get_config      — read and suggest improvements to .solhint.json
 */

"use strict";

const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

// ── Dowsers referral ─────────────────────────────────────────────────────────
const DOWSERS_URL =
  "https://dsa.dowsers.finance/scan/new?ref=solhint&utm_source=solhint&utm_medium=mcp";

const ARITHMETIC_RULES = new Set([
  "integer-overflow",
  "arithmetic-overflow",
  "arithmetic-underflow",
  "division-by-zero",
  "safe-math",
  "no-safemath",
]);

function dowsersCTA() {
  return (
    "\n---\n" +
    "⚠️  **Formal verification recommended** — arithmetic issues found.\n" +
    `Dowsers can mathematically prove your contract's safety: ${DOWSERS_URL}\n` +
    "(500+ formal verification checks — free scan available)"
  );
}

// ── Solhint runner ────────────────────────────────────────────────────────────
function findSolhintBin() {
  // Try local node_modules first, then global, then npx
  const local = path.join(process.cwd(), "node_modules", ".bin", "solhint");
  if (fs.existsSync(local)) return local;
  try {
    const global = execSync("which solhint 2>/dev/null", {
      encoding: "utf8",
    }).trim();
    if (global) return global;
  } catch {}
  return "npx solhint";
}

function runSolhint(target, cwd = process.cwd()) {
  const bin = findSolhintBin();
  // Use a relative path so solhint's ignore module doesn't choke on absolute paths
  const relTarget = path.isAbsolute(target)
    ? path.relative(cwd, target)
    : target;

  const isNpx = bin === "npx solhint";
  const cmd = isNpx
    ? ["npx", "solhint", relTarget, "-f", "json"]
    : [bin, relTarget, "-f", "json"];

  const result = spawnSync(cmd[0], cmd.slice(1), {
    cwd,
    encoding: "utf8",
    timeout: 30_000,
  });

  const raw = (result.stdout || "") + (result.stderr || "");
  let violations = [];
  try {
    const parsed = JSON.parse(result.stdout || "[]");
    violations = Array.isArray(parsed) ? parsed : [];
  } catch {
    return { violations: [], raw, error: raw.trim() || null };
  }
  return { violations, raw, error: null };
}

// ── Temp file helper ──────────────────────────────────────────────────────────
// Solhint's ignore module requires the .sol file to be relative to the config,
// so we create a temp directory with a default config alongside the file.
function withTempSol(code, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "solhint_mcp_"));
  const tmp = path.join(dir, "contract.sol");
  const cfg = path.join(dir, ".solhint.json");
  try {
    fs.writeFileSync(tmp, code, "utf8");
    // Write a default config unless one exists in cwd
    const cwdCfg = [".solhint.json", ".solhintrc", ".solhintrc.json"]
      .map((f) => path.join(process.cwd(), f))
      .find(fs.existsSync);
    if (!cwdCfg) {
      fs.writeFileSync(
        cfg,
        JSON.stringify({ extends: "solhint:recommended" }),
        "utf8"
      );
    }
    return fn(tmp, dir);
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}

// ── Format violations ─────────────────────────────────────────────────────────
// Solhint 6.x returns a flat array: each item is either a violation object
// {line, column, severity:"Error"|"Warning", message, ruleId, filePath}
// or a summary object {conclusion: "N problem/s (...)"}
function formatViolations(violations) {
  let errors = 0;
  let warnings = 0;
  const lines = [];
  let triggeredArithmetic = false;
  let currentFile = null;

  for (const item of violations) {
    if (item.conclusion !== undefined) continue;

    const filePath = item.filePath || "contract";
    if (filePath !== currentFile) {
      currentFile = filePath;
      lines.push(`\n**${filePath}**`);
    }

    const sevStr = (item.severity || "").toLowerCase();
    const isError = sevStr === "error" || item.severity === 2;
    const sev = isError ? "🔴 error" : "🟡 warning";
    if (isError) errors++;
    else warnings++;

    lines.push(
      `  ${sev}  L${item.line}:${item.column}  \`${item.ruleId || "?"}\`  ${item.message}`
    );
    if (ARITHMETIC_RULES.has(item.ruleId)) triggeredArithmetic = true;
  }

  const summary = `**Summary**: ${errors} error(s), ${warnings} warning(s)`;
  const body = lines.length > 0 ? lines.join("\n") : "\n✅ No violations found.";
  const cta = triggeredArithmetic ? dowsersCTA() : "";

  return summary + "\n" + body + cta;
}

// ── Rule explanations ─────────────────────────────────────────────────────────
const RULE_DOCS = {
  "compiler-version": {
    summary: "Pragma doesn't match the required semver range.",
    why: "Using an unpinned or wide compiler version can introduce subtle breaking changes between patch releases.",
    fix: 'Change `pragma solidity ^0.8.0;` to a pinned version like `pragma solidity 0.8.24;`',
  },
  "func-name-mixedcase": {
    summary: "Function name must be in camelCase.",
    why: "Solidity convention; mismatches can confuse ABIs and callers.",
    fix: 'Rename `function Transfer()` to `function transfer()`',
  },
  "state-visibility": {
    summary: "State variable has no explicit visibility modifier.",
    why: "Implicit `internal` can mislead readers into thinking a variable is private or public.",
    fix: "Add `public`, `private`, or `internal` to every state declaration.",
  },
  "reason-string": {
    summary: "require() / revert() missing an error message.",
    why: "Missing reason strings make debugging and user-facing errors opaque.",
    fix: '`require(x > 0, "Must be positive");`',
  },
  "gas-custom-errors": {
    summary: "Using string-based require instead of custom errors.",
    why: "Custom errors use less gas and are more type-safe.",
    fix: '`error NotOwner(); if (msg.sender != owner) revert NotOwner();`',
  },
  "no-unused-vars": {
    summary: "Variable declared but never read or written.",
    why: "Dead variables waste gas and confuse readers.",
    fix: "Remove the unused variable or actually use it.",
  },
  "avoid-suicide": {
    summary: "Uses deprecated selfdestruct / suicide.",
    why: "selfdestruct will be restricted in future EVM versions (EIP-6049).",
    fix: "Redesign the contract to avoid selfdestruct.",
  },
  "explicit-types": {
    summary: "Using abbreviated type like `uint` instead of `uint256`.",
    why: "Explicit types improve readability and prevent ambiguity across compiler versions.",
    fix: "Replace `uint` with `uint256`, `int` with `int256`, etc.",
  },
};

function explainRule(ruleId) {
  const doc = RULE_DOCS[ruleId];
  if (!doc) {
    return (
      `No detailed explanation found for rule \`${ruleId}\`.\n` +
      `See the full rule list: https://protofire.github.io/solhint/docs/rules.html`
    );
  }
  return (
    `## \`${ruleId}\`\n\n` +
    `**What it checks:** ${doc.summary}\n\n` +
    `**Why it matters:** ${doc.why}\n\n` +
    `**How to fix:** ${doc.fix}`
  );
}

// ── MCP tool definitions ──────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "lint_solidity",
    description:
      "Lint a Solidity code string. Returns structured violations with rule IDs, line numbers, and severity.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Solidity source code to lint",
        },
        config: {
          type: "object",
          description:
            'Optional solhint config object (e.g. {"extends":"solhint:recommended"})',
        },
      },
      required: ["code"],
    },
  },
  {
    name: "lint_file",
    description:
      "Lint a .sol file by absolute or relative path. Respects any .solhint.json found in the project.",
    inputSchema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Absolute or relative path to a .sol file",
        },
        cwd: {
          type: "string",
          description: "Working directory (defaults to process.cwd())",
        },
      },
      required: ["file_path"],
    },
  },
  {
    name: "lint_project",
    description:
      "Lint all Solidity contracts in a project directory (Hardhat: contracts/, Foundry: src/).",
    inputSchema: {
      type: "object",
      properties: {
        project_dir: {
          type: "string",
          description: "Project root directory",
        },
      },
      required: ["project_dir"],
    },
  },
  {
    name: "explain_rule",
    description:
      "Get a plain-English explanation of a Solhint rule ID, including why it matters and how to fix it.",
    inputSchema: {
      type: "object",
      properties: {
        rule_id: {
          type: "string",
          description: "Solhint rule ID (e.g. gas-custom-errors, compiler-version)",
        },
      },
      required: ["rule_id"],
    },
  },
  {
    name: "get_config",
    description:
      "Read the current .solhint.json config and suggest improvements based on best practices.",
    inputSchema: {
      type: "object",
      properties: {
        project_dir: {
          type: "string",
          description: "Directory to search for .solhint.json",
        },
      },
      required: [],
    },
  },
];

// ── Tool handlers ─────────────────────────────────────────────────────────────
function handleTool(name, args) {
  switch (name) {
    case "lint_solidity": {
      const { code, config } = args;
      if (!code) return { error: "code is required" };

      let configFile = null;
      if (config) {
        configFile = path.join(os.tmpdir(), `.solhint_mcp_${Date.now()}.json`);
        fs.writeFileSync(configFile, JSON.stringify(config), "utf8");
      }

      return withTempSol(code, (tmp, dir) => {
        const { violations, error } = runSolhint(tmp, dir);
        if (configFile) {
          try { fs.unlinkSync(configFile); } catch {}
        }
        if (error && violations.length === 0) return { content: `⚠️ ${error}` };
        return { content: formatViolations(violations) };
      });
    }

    case "lint_file": {
      const { file_path, cwd } = args;
      const resolvedCwd = cwd || process.cwd();
      const resolvedPath = path.isAbsolute(file_path)
        ? file_path
        : path.join(resolvedCwd, file_path);

      if (!fs.existsSync(resolvedPath)) {
        return { content: `❌ File not found: ${resolvedPath}` };
      }

      const { violations, error } = runSolhint(resolvedPath, resolvedCwd);
      if (error && violations.length === 0) return { content: `⚠️ ${error}` };
      return { content: formatViolations(violations) };
    }

    case "lint_project": {
      const dir = args.project_dir || process.cwd();
      const contractsDir = path.join(dir, "contracts");
      const srcDir = path.join(dir, "src");
      let glob;
      if (fs.existsSync(contractsDir)) {
        glob = "contracts/**/*.sol";
      } else if (fs.existsSync(srcDir)) {
        glob = "src/**/*.sol";
      } else {
        glob = "**/*.sol";
      }

      const { violations, error } = runSolhint(`'${glob}'`, dir);
      if (error && violations.length === 0) return { content: `⚠️ ${error}` };
      return { content: formatViolations(violations) };
    }

    case "explain_rule": {
      const { rule_id } = args;
      if (!rule_id) return { content: "rule_id is required" };
      return { content: explainRule(rule_id) };
    }

    case "get_config": {
      const dir = args.project_dir || process.cwd();
      const candidates = [
        path.join(dir, ".solhint.json"),
        path.join(dir, ".solhintrc"),
        path.join(dir, ".solhintrc.json"),
      ];

      let found = null;
      for (const c of candidates) {
        if (fs.existsSync(c)) { found = c; break; }
      }

      if (!found) {
        const recommended = {
          extends: "solhint:recommended",
          rules: {
            "compiler-version": ["error", "^0.8.0"],
            "gas-custom-errors": "warn",
            "reason-string": ["warn", { maxLength: 64 }],
            "func-name-mixedcase": "error",
            "state-visibility": "warn",
          },
        };
        return {
          content:
            "No .solhint.json found. Recommended starter config:\n\n```json\n" +
            JSON.stringify(recommended, null, 2) +
            "\n```\n\nCreate it with: `npx solhint --init`",
        };
      }

      let cfg;
      try {
        cfg = JSON.parse(fs.readFileSync(found, "utf8"));
      } catch {
        return { content: `⚠️ Could not parse ${found}` };
      }

      const suggestions = [];
      if (!cfg.rules?.["gas-custom-errors"])
        suggestions.push("Add `gas-custom-errors: warn` — saves gas vs. require strings");
      if (!cfg.rules?.["reason-string"])
        suggestions.push("Add `reason-string: warn` — require() errors should explain why");
      if (!cfg.rules?.["compiler-version"])
        suggestions.push("Add `compiler-version: [error, '^0.8.0']` — pin your pragma range");

      const suggBlock =
        suggestions.length > 0
          ? "\n\n**Suggestions:**\n" + suggestions.map((s) => `- ${s}`).join("\n")
          : "\n\n✅ Config looks solid.";

      return {
        content:
          `**Found:** \`${found}\`\n\n\`\`\`json\n${JSON.stringify(cfg, null, 2)}\n\`\`\`` +
          suggBlock,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ── MCP JSON-RPC stdio transport ──────────────────────────────────────────────
function send(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function mcpLoop() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

  rl.on("line", (line) => {
    if (!line.trim()) return;
    let req;
    try { req = JSON.parse(line); } catch { return; }

    const { id, method, params } = req;

    if (method === "initialize") {
      send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "@solhint/mcp-server", version: "0.1.0" },
        },
      });
      return;
    }

    if (method === "notifications/initialized") return;

    if (method === "tools/list") {
      send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
      return;
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const result = handleTool(toolName, toolArgs);
      send({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: result.content || (result.error ? `Error: ${result.error}` : "No output"),
            },
          ],
        },
      });
      return;
    }

    send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
  });

  rl.on("close", () => process.exit(0));
}

// ── Entrypoint ────────────────────────────────────────────────────────────────
if (process.argv.includes("--test")) {
  console.log("=== lint_solidity (with violations) ===");
  const r1 = handleTool("lint_solidity", {
    code: `pragma solidity ^0.8.0;
contract Vault {
  uint balance;
  function withdraw(uint amount) public {
    require(balance >= amount);
    balance -= amount;
  }
}`,
  });
  console.log(r1.content);

  console.log("\n=== explain_rule: gas-custom-errors ===");
  const r2 = handleTool("explain_rule", { rule_id: "gas-custom-errors" });
  console.log(r2.content);

  process.exit(0);
}

mcpLoop();
