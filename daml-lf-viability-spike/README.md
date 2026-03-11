# DAML-LF Viability Spike (Canton)

A standalone TypeScript/Node.js research project to validate whether `.dalf` / `.dar` artifacts expose enough structured information to build a visitor-based static analyzer for DAML smart contracts.

## Goal

Before implementing any lint architecture, this repo focuses on evidence:

- decode DALF with `protobufjs` (no JVM path),
- dump raw decoded structures,
- extract templates/choices/signatories/observers/keys/interfaces,
- evaluate source-location quality.

## Repository layout

```text
.
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   └── dalf_probe.ts
├── docs/
│   └── findings.md
└── output/
```

## Requirements

- Node.js >= 18
- Local official Daml-LF protobuf schema (`.proto` file)
- A real `.dalf` or `.dar` input artifact

## Install

```bash
npm install
```

## Usage

```bash
npm run probe -- <input.dar|input.dalf> --proto <path/to/official/daml-lf.proto> [--out-dir output]
```

Direct Node execution:

```bash
node src/dalf_probe.ts <input.dar|input.dalf> --proto <path/to/official/daml-lf.proto> [--out-dir output]
```

## Outputs

For each DALF analyzed:

- `*.decoded.json` — raw protobuf decode (no assumptions)
- `*.constructs.json` — extracted construct buckets + location quality
- `*.findings.md` — binary answers and blocker summary

Global:

- `summary.json` — analyzed DALFs and output paths

## Scripts

- `npm run probe -- ...` : run spike via ts-node
- `npm run probe:node -- ...` : run script via node runtime
- `npm run check` : type-check project
- `npm run build` : compile TypeScript to `dist/`
- `npm run clean` : clean generated artifacts

## Notes

- This repo does **not** implement lint rules yet.
- If protobuf schema/version mismatches happen, inspect decode attempt logs in failures.
- Source location fidelity must be validated manually against original `.daml` files.
