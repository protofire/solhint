# DAML-LF viability spike (Canton-focused)

This folder contains a **research spike** to validate whether DALF artifacts contain enough structured information to support a static analyzer for DAML contracts running on Canton.

> This is intentionally **not** a linter engine yet. It is an evidence-gathering tool.

## What this spike validates

1. Can `.dalf` / `.dar` be decoded in Node.js via `protobufjs` (no JVM runtime)?
2. Are templates, choices, signatories, observers, keys, and interfaces present as structured nodes?
3. Are source locations available and are they useful for mapping back to `.daml` files?
4. What concrete blockers exist for a visitor-based analyzer?

## Files

- `dalf_probe.ts` — main probe script.
- `findings.md` — high-level notes for this spike iteration.
- output directory (generated):
  - `*.decoded.json` — raw decoded protobuf object (no filtering assumptions).
  - `*.constructs.json` — extracted semantic buckets + source-location quality signals.
  - `*.findings.md` — per-DALF report with binary answers.
  - `summary.json` — list of analyzed DALFs and output paths.

## Installation (developer setup)

Use Node.js 18+ (22+ recommended).

Install required runtime deps:

```bash
npm i protobufjs adm-zip
```

Install dev tooling for TypeScript execution (if your repo does not already include it):

```bash
npm i -D typescript ts-node @types/node
```

## Suggested package.json snippet

If you want to run this as part of a standalone spike package, add scripts like:

```json
{
  "scripts": {
    "daml:probe": "ts-node research/daml-lf/dalf_probe.ts",
    "daml:probe:node": "node research/daml-lf/dalf_probe.ts"
  },
  "dependencies": {
    "adm-zip": "^0.5.16",
    "protobufjs": "^7.4.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.0"
  }
}
```

## Usage

```bash
node research/daml-lf/dalf_probe.ts <input.dar|input.dalf> --proto <path/to/official/daml-lf.proto> [--out-dir research/daml-lf/output]
```

Example:

```bash
node research/daml-lf/dalf_probe.ts ./sample.dar --proto ./proto/daml_lf.proto --out-dir ./research/daml-lf/output
```

## Decode strategy implemented

The probe does not assume a single wrapper shape. It tries:

1. direct decode as `ArchivePayload`.
2. decode as `Archive`, then decode `archive.payload` as:
   - `ArchivePayload`, then
   - `Package`.

This helps when DALF versions/wrappers differ.

## How to interpret results

- Start with `summary.json`.
- Open `*.findings.md` to read binary answers and blockers.
- Inspect `*.constructs.json`:
  - `found` + `counts` show discovered construct categories.
  - `templates` and `choices` include expression shape hints.
  - `sourceLocationQuality` indicates whether file refs look like original `.daml` files.
- If location refs look plausible, manually cross-check line/column against source.

## Known limitations

- Protobuf schema/version mismatch can produce partial or failed decode.
- Expression fields (signatory/controller/observer) may be lambda-heavy and require AST traversal.
- Location data may be module-level or generated/internal instead of direct source file paths.

## Next step after successful viability

If outputs are consistently good across real Canton-targeted DARs:

1. Define a typed IR for Template/Choice/Expr/Location.
2. Build a visitor over decoded expression trees.
3. Add first structural rules (presence/shape checks) before semantic rules.
4. Add robust source mapping strategy for diagnostics.
