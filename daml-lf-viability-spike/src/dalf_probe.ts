#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

type AnyObject = Record<string, any>

interface Args {
  input?: string
  proto?: string
  outDir: string
}

interface LocatedRaw {
  path: string
  raw: AnyObject
  location: AnyObject | null
}

// Parse CLI arguments for input artifact, protobuf schema path, and output directory.

function parseArgs(argv: string[]): Args {
  const args: Args = { outDir: 'output' }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--proto') args.proto = argv[++i]
    else if (token === '--out-dir') args.outDir = argv[++i]
    else if (!args.input) args.input = token
    else throw new Error(`Unknown extra argument: ${token}`)
  }
  return args
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true })
}

async function loadDependencies() {
  // Lazy runtime import keeps startup lightweight and gives a clear install message
  // when this script is copied into a fresh environment.
  try {
    const protobufjs = await import('protobufjs')
    const admZip = await import('adm-zip')
    return { protobufjs, AdmZip: (admZip as any).default ?? admZip }
  } catch (err) {
    throw new Error(`Missing required dependencies. Install with: npm i protobufjs adm-zip\n${(err as Error).message}`)
  }
}

function collectDalfFromInput(inputPath: string, AdmZip: any): Array<{ name: string; bytes: Buffer }> {
  const ext = path.extname(inputPath).toLowerCase()
  if (ext === '.dalf') return [{ name: path.basename(inputPath), bytes: fs.readFileSync(inputPath) }]
  if (ext !== '.dar') throw new Error(`Unsupported extension: ${ext}. Expected .dar or .dalf`)

  // DAR files are zip archives that may contain multiple DALFs.
  // We return all DALFs, sorted so likely project payloads are analyzed first.
  const zip = new AdmZip(inputPath)
  const dalfEntries = zip.getEntries().filter((entry: any) => !entry.isDirectory && entry.entryName.endsWith('.dalf'))
  if (dalfEntries.length === 0) throw new Error(`No .dalf entries found in DAR ${inputPath}`)

  const scored = dalfEntries
    .map((entry: any) => {
      const name = entry.entryName
      const penalty = ['daml-stdlib', 'daml-prim', 'daml-script', 'ghc', 'da/'].reduce(
        (sum, marker) => sum + (name.toLowerCase().includes(marker) ? 1 : 0),
        0,
      )
      return { entry, penalty }
    })
    .sort((a, b) => a.penalty - b.penalty)

  return scored.map(({ entry }) => ({ name: entry.entryName, bytes: entry.getData() }))
}

function safeToObject(type: any, message: any): AnyObject {
  return type.toObject(message, {
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
    arrays: true,
    objects: true,
  })
}

const archiveCandidates = [
  'com.daml.daml_lf_dev.DamlLf.Archive',
  'com.daml.daml_lf_dev.DamlLf1.Archive',
  'com.daml.daml_lf_1.DamlLf.Archive',
  'com.daml.daml_lf_1.DamlLf1.Archive',
]
const payloadCandidates = [
  'com.daml.daml_lf_dev.DamlLf.ArchivePayload',
  'com.daml.daml_lf_dev.DamlLf1.ArchivePayload',
  'com.daml.daml_lf_1.DamlLf.ArchivePayload',
  'com.daml.daml_lf_1.DamlLf1.ArchivePayload',
]
const packageCandidates = [
  'com.daml.daml_lf_dev.DamlLf.Package',
  'com.daml.daml_lf_dev.DamlLf1.Package',
  'com.daml.daml_lf_1.DamlLf.Package',
  'com.daml.daml_lf_1.DamlLf1.Package',
]

// Resolve whichever candidate protobuf messages exist in the loaded schema.
// This supports small package-name differences across Daml-LF versions.
function lookupTypes(root: any, candidates: string[]) {
  return candidates
    .map((name) => {
      try {
        return { name, type: root.lookupType(name) }
      } catch {
        return null
      }
    })
    .filter(Boolean) as Array<{ name: string; type: any }>
}

function tryDecodeWithType(name: string, type: any, bytes: Buffer): { name: string; decoded: AnyObject } | null {
  try {
    return { name, decoded: safeToObject(type, type.decode(bytes)) }
  } catch {
    return null
  }
}

// Decode using multiple strategies and record all failed attempts for debugging.
function decodeDalf(root: any, bytes: Buffer) {
  const payloadTypes = lookupTypes(root, payloadCandidates)
  const archiveTypes = lookupTypes(root, archiveCandidates)
  const packageTypes = lookupTypes(root, packageCandidates)

  const attempts: string[] = []

  for (const p of payloadTypes) {
    const decoded = tryDecodeWithType(p.name, p.type, bytes)
    if (decoded) return { strategy: `direct:${p.name}`, decoded: decoded.decoded, attempts }
    attempts.push(`fail direct ${p.name}`)
  }

  for (const a of archiveTypes) {
    const archiveDecoded = tryDecodeWithType(a.name, a.type, bytes)
    if (!archiveDecoded) {
      attempts.push(`fail archive ${a.name}`)
      continue
    }

    const payload = archiveDecoded.decoded.payload
    if (!payload) {
      attempts.push(`archive ${a.name} had no payload field`) // useful debug signal
      continue
    }

    const payloadBytes = Buffer.from(payload)
    for (const p of payloadTypes) {
      const decodedPayload = tryDecodeWithType(p.name, p.type, payloadBytes)
      if (decodedPayload) {
        return {
          strategy: `archive:${a.name} -> payload:${p.name}`,
          decoded: {
            archive: archiveDecoded.decoded,
            payload: decodedPayload.decoded,
          },
          attempts,
        }
      }
      attempts.push(`fail payload ${p.name} after ${a.name}`)
    }

    for (const p of packageTypes) {
      const decodedPackage = tryDecodeWithType(p.name, p.type, payloadBytes)
      if (decodedPackage) {
        return {
          strategy: `archive:${a.name} -> package:${p.name}`,
          decoded: {
            archive: archiveDecoded.decoded,
            pkg: decodedPackage.decoded,
          },
          attempts,
        }
      }
      attempts.push(`fail package ${p.name} after ${a.name}`)
    }
  }

  throw new Error(`Unable to decode DALF with loaded protobuf types. Attempts: ${attempts.join(' | ')}`)
}

function walk(node: any, visitor: (value: AnyObject, pathBits: string[]) => void, pathBits: string[] = []) {
  if (Array.isArray(node)) return node.forEach((item, idx) => walk(item, visitor, [...pathBits, String(idx)]))
  if (!node || typeof node !== 'object') return
  visitor(node as AnyObject, pathBits)
  Object.entries(node).forEach(([key, value]) => walk(value, visitor, [...pathBits, key]))
}

// Normalize location access because objects may expose `location` or `loc`.
function pickLocation(raw: AnyObject): AnyObject | null {
  if (raw.location && typeof raw.location === 'object') return raw.location
  if (raw.loc && typeof raw.loc === 'object') return raw.loc
  return null
}

// Report expression shape by top-level keys only (spike-level granularity).
function exprShape(node: unknown): string {
  if (!node || typeof node !== 'object') return 'missing'
  const keys = Object.keys(node as AnyObject).filter((k) => k !== 'location')
  return keys.join('|') || 'empty'
}

// Summarize source-location quality signals for manual cross-checking.
function analyzeLocationQuality(locationNodes: LocatedRaw[]) {
  const details = locationNodes.map((node) => {
    const loc = node.location ?? {}
    const file = loc.file || loc.filename || loc.moduleFilename || loc.source || null
    const range = loc.range || {}
    const line = range.startLine ?? loc.startLine ?? null
    const col = range.startCol ?? loc.startCol ?? null

    let fileKind = 'absent'
    if (typeof file === 'string' && file.length > 0) {
      if (file.endsWith('.daml')) fileKind = 'original_daml'
      else if (file.includes('daml') || file.includes('DA.')) fileKind = 'internal_or_generated'
      else fileKind = 'unknown'
    }

    return {
      path: node.path,
      file,
      line,
      col,
      fileKind,
      raw: node.location,
    }
  })

  return {
    exists: details.length > 0,
    total: details.length,
    originalDamlRefs: details.filter((d) => d.fileKind === 'original_daml').length,
    internalRefs: details.filter((d) => d.fileKind === 'internal_or_generated').length,
    missingFileRefs: details.filter((d) => d.fileKind === 'absent').length,
    samples: details.slice(0, 30),
  }
}

// Heuristic extraction pass: collect raw candidates without assuming strict schema fields.
function extractConstructs(decoded: AnyObject) {
  const out = {
    templates: [] as LocatedRaw[],
    choices: [] as LocatedRaw[],
    signatories: [] as LocatedRaw[],
    observers: [] as LocatedRaw[],
    contractKeys: [] as LocatedRaw[],
    interfaces: [] as LocatedRaw[],
    sourceLocations: [] as LocatedRaw[],
  }

  // Traverse all nodes and bucket matches by shape/path hints.
  walk(decoded, (raw, pathBits) => {
    const keys = Object.keys(raw)
    const lower = keys.map((k) => k.toLowerCase())
    const pathText = pathBits.join('.')
    const located = { path: pathText, raw, location: pickLocation(raw) }

    if ((lower.includes('signatories') && lower.includes('choices')) || pathText.toLowerCase().includes('template')) out.templates.push(located)
    if (lower.includes('consuming') || lower.includes('controllers')) out.choices.push(located)
    if (lower.includes('signatories')) out.signatories.push({ ...located, raw: raw.signatories ?? raw })
    if (lower.includes('observers')) out.observers.push({ ...located, raw: raw.observers ?? raw })
    if (lower.includes('key') || lower.includes('maintainers')) {
      if (pathText.toLowerCase().includes('key')) out.contractKeys.push(located)
    }
    if (pathText.toLowerCase().includes('interface') || lower.includes('methods') || lower.includes('requires')) out.interfaces.push(located)

    if (
      lower.includes('location') ||
      lower.includes('modulefilename') ||
      lower.includes('startline') ||
      lower.includes('start_line')
    ) {
      out.sourceLocations.push(located)
    }
  })

  const choiceSummary = out.choices.map((c) => ({
    path: c.path,
    name: c.raw.name ?? c.raw.nameInternedStr ?? '(unknown)',
    consuming: c.raw.consuming ?? null,
    controllerExpr: exprShape(c.raw.controllers),
    observerExpr: exprShape(c.raw.observers),
    returnTypeExpr: exprShape(c.raw.retType ?? c.raw.returnType),
    raw: c.raw,
    location: c.location,
  }))

  const templateSummary = out.templates.map((t) => ({
    path: t.path,
    name: t.raw.name ?? t.raw.tycon ?? '(unknown)',
    module: t.raw.module ?? null,
    fields: t.raw.fields ?? t.raw.record?.fields ?? null,
    signatoryExpr: exprShape(t.raw.signatories),
    observerExpr: exprShape(t.raw.observers),
    raw: t.raw,
    location: t.location,
  }))

  const locationQuality = analyzeLocationQuality(out.sourceLocations)

  return {
    found: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length > 0])),
    counts: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])),
    templates: templateSummary,
    choices: choiceSummary,
    signatories: out.signatories,
    observers: out.observers,
    contractKeys: out.contractKeys,
    interfaces: out.interfaces,
    sourceLocations: out.sourceLocations,
    sourceLocationQuality: locationQuality,
  }
}

function renderFindingsReport(inputName: string, decodeStrategy: string, constructs: AnyObject) {
  const templatesFound = constructs.counts.templates > 0 ? 'Yes' : 'No'
  const choicesFound = constructs.counts.choices > 0 ? 'Yes' : 'No'
  const signatoryReadability = constructs.signatories.some((s: any) => String(exprShape(s.raw)).includes('abs'))
    ? 'Lambda'
    : constructs.counts.signatories > 0
      ? 'Structured'
      : 'Mixed'
  const loc = constructs.sourceLocationQuality

  return `# DAML-LF Spike Findings\n\n- Input: ${inputName}\n- Decode strategy: ${decodeStrategy}\n\n## Answers\n\n1. Is the Daml-LF protobuf decodable with protobufjs without a JVM?\n   - Yes (for this sample with strategy: ${decodeStrategy}).\n2. Are template and choice definitions present as structured data?\n   - ${templatesFound === 'Yes' || choicesFound === 'Yes' ? 'Partially' : 'No'} (templates=${templatesFound}, choices=${choicesFound}).\n3. Are signatory and controller expressions readable as structured data or opaque lambda expressions?\n   - ${signatoryReadability}.\n4. Do source locations exist and point to original .daml source with accurate line/column?\n   - ${loc.exists ? 'Partially' : 'No'} (locations=${loc.total}, originalDamlRefs=${loc.originalDamlRefs}, internalRefs=${loc.internalRefs}, missingFileRefs=${loc.missingFileRefs}).\n5. What is the actual recommended input pipeline?\n   - .dalf directly (or .dar -> .dalf extraction) with protobufjs decode and post-processing over raw JSON.\n6. What are the real blockers for building a visitor-based linter on top of this?\n   - Schema/version drift between DALF and protobuf definitions.\n   - Potentially lambda-heavy signatory/controller expressions requiring expression visitor logic.\n   - Source location fidelity may be partial and needs manual verification against original .daml files.\n\n## Manual line/column validation checklist\n\n- Pick entries from \`*.constructs.json -> sourceLocationQuality.samples\`.\n- Open corresponding original \`.daml\` file and verify line/column points to expected construct.\n- Record mismatches if location appears module-only or generated/internal.\n`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.input) throw new Error('Usage: node src/dalf_probe.ts <input.dar|input.dalf> --proto <path/to/proto> [--out-dir dir]')
  if (!args.proto || !fs.existsSync(args.proto)) throw new Error('Missing --proto path. Point to official Daml-LF .proto.')
  if (!fs.existsSync(args.input)) throw new Error(`Input not found: ${args.input}`)

  const deps = await loadDependencies()
  ensureDir(args.outDir)

  // Load official Daml-LF protobuf schema from local path.
  const root = await deps.protobufjs.load(args.proto)
  const dalfs = collectDalfFromInput(args.input, deps.AdmZip)
  const summary: AnyObject[] = []

  // Analyze every DALF independently to avoid coupling failures across entries.
  for (const dalf of dalfs) {
    const decoded = decodeDalf(root, dalf.bytes)
    const constructs = extractConstructs(decoded.decoded)

    const base = dalf.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const decodedPath = path.join(args.outDir, `${base}.decoded.json`)
    const constructsPath = path.join(args.outDir, `${base}.constructs.json`)
    const reportPath = path.join(args.outDir, `${base}.findings.md`)

    fs.writeFileSync(decodedPath, JSON.stringify(decoded, null, 2))
    fs.writeFileSync(constructsPath, JSON.stringify(constructs, null, 2))
    fs.writeFileSync(reportPath, renderFindingsReport(dalf.name, decoded.strategy, constructs))

    summary.push({
      dalf: dalf.name,
      decodeStrategy: decoded.strategy,
      decodedPath,
      constructsPath,
      reportPath,
      found: constructs.found,
    })
  }

  const summaryPath = path.join(args.outDir, 'summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  console.log(`Wrote ${summary.length} DALF analysis result(s) into ${args.outDir}`)
  console.log(`Summary: ${summaryPath}`)
}

main().catch((err) => {
  console.error('[dalf-probe] fatal:', err.message)
  process.exitCode = 1
})
