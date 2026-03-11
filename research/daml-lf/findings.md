# DAML-LF protobufjs feasibility spike

This folder now contains an upgraded probe script (`dalf_probe.ts`) that combines:

- strict decode-first flow from the initial spike,
- richer extraction/report ideas from your reference script,
- and explicit handling for DALF schema/version ambiguity.

## What changed in the upgraded script

1. **Decode strategies are now layered**:
   - direct decode as `ArchivePayload`,
   - or `Archive -> payload -> ArchivePayload/Package` fallback.
2. **DAR handling improved**:
   - all `.dalf` entries are extracted,
   - likely project DALF is prioritized over stdlib-like entries.
3. **Construct extraction now includes richer summaries**:
   - template summaries (name/module/fields/signatory+observer expr shape),
   - choice summaries (consuming, controller/observer expr shape, return type hint),
   - raw structures are still preserved for every construct class.
4. **Source-location quality analysis added**:
   - counts original `.daml` references vs internal/generated vs missing file refs,
   - outputs a sample set for manual line/column cross-checking.
5. **Per-DALF markdown report generated automatically**:
   - answers the binary research questions,
   - includes a manual verification checklist for location fidelity.

## Output files

For each analyzed DALF the script writes:

- `*.decoded.json`
- `*.constructs.json`
- `*.findings.md`
- `summary.json`

## Important constraints still true

- The script still requires local installation of `protobufjs` + `adm-zip`.
- The script still requires a local official Daml-LF `.proto` via `--proto`.
- Final truth about location accuracy requires real `.dalf` + matching `.daml` source and manual cross-check.
