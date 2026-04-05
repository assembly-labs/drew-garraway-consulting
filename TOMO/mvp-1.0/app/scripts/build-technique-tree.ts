/**
 * Build Script — Technique Tree Generator
 *
 * Reads 14 BJJ technique CSV files and generates a single TypeScript data file
 * that the app imports directly. No CSV parsing at runtime.
 *
 * Usage:
 *   npx tsx scripts/build-technique-tree.ts
 *
 * Output:
 *   src/data/technique-tree.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ===========================================
// TYPES (inline for script — mirrors the app types)
// ===========================================

type PositionId =
  | 'closed_guard' | 'half_guard' | 'open_guard' | 'mount'
  | 'side_control' | 'back_control' | 'knee_on_belly' | 'north_south'
  | 'turtle' | 'standing' | 'leg_entanglements' | 'guard_passing';

type Perspective = 'top' | 'bottom' | 'standing' | 'neutral';
type TechniqueType = 'submission' | 'sweep' | 'pass' | 'escape' | 'control' | 'transition' | 'entry' | 'takedown' | 'defense';
type Branch = 'offense' | 'defense' | 'neutral';
type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'all_belts' | 'blue_and_above' | 'brown_black_only' | 'brown_black_nogi_only';
type GiNogi = 'gi' | 'nogi' | 'both';

interface Technique {
  id: string;
  name: string;
  alternateNames: string[];
  traditionalName: string | null;
  type: TechniqueType;
  subcategory: string;
  branch: Branch;
  beltLevel: BeltLevel;
  giNogi: GiNogi;
  ibjjfLegal: string;
  description: string;
  keyPoints: string[];
  commonMistakes: string[];
  relatedIds: string[];
  counterIds: string[];
  positionIds: PositionId[];
}

interface PositionDef {
  id: PositionId;
  name: string;
  description: string;
  perspective: Perspective;
  csvPrefix: string;
  csvFile: string;
}

// ===========================================
// POSITION DEFINITIONS
// ===========================================

const POSITIONS: PositionDef[] = [
  {
    id: 'closed_guard',
    name: 'Closed Guard',
    description: 'Full guard with legs locked around opponent. Primary attacking position from bottom.',
    perspective: 'bottom',
    csvPrefix: 'CG',
    csvFile: 'guard_closed.csv',
  },
  {
    id: 'half_guard',
    name: 'Half Guard',
    description: 'One leg entangled with opponent. Versatile position with multiple systems (underhook, lockdown, deep half).',
    perspective: 'bottom',
    csvPrefix: 'HG',
    csvFile: 'guard_half.csv',
  },
  {
    id: 'open_guard',
    name: 'Open Guard',
    description: 'Guard with legs not locked. Includes DLR, spider, lasso, butterfly, X-guard, and more.',
    perspective: 'bottom',
    csvPrefix: 'OG',
    csvFile: 'guard_open.csv',
  },
  {
    id: 'mount',
    name: 'Mount',
    description: 'Sitting on top of opponent. Dominant position with high submission rate.',
    perspective: 'top',
    csvPrefix: 'MT',
    csvFile: 'mount.csv',
  },
  {
    id: 'side_control',
    name: 'Side Control',
    description: 'Chest-to-chest control from the side. Multiple variations: standard, kesa gatame, 100 kilos.',
    perspective: 'top',
    csvPrefix: 'SC',
    csvFile: 'side_control.csv',
  },
  {
    id: 'back_control',
    name: 'Back Control',
    description: 'Behind opponent with hooks or body triangle. Highest-value position in BJJ.',
    perspective: 'top',
    csvPrefix: 'BC',
    csvFile: 'back_control.csv',
  },
  {
    id: 'knee_on_belly',
    name: 'Knee on Belly',
    description: 'Knee across opponent\'s torso. High-pressure transitional position with submissions.',
    perspective: 'top',
    csvPrefix: 'KB',
    csvFile: 'knee_on_belly.csv',
  },
  {
    id: 'north_south',
    name: 'North-South',
    description: 'Head-to-head position on top. Often reached from side control for chokes and armlocks.',
    perspective: 'top',
    csvPrefix: 'NS',
    csvFile: 'north_south.csv',
  },
  {
    id: 'turtle',
    name: 'Turtle',
    description: 'On hands and knees, defensive shell. Both attacking (breaking down) and defending (escaping).',
    perspective: 'neutral',
    csvPrefix: 'TT',
    csvFile: 'turtle.csv',
  },
  {
    id: 'standing',
    name: 'Standing',
    description: 'On feet. Includes takedowns, clinch work, guard pulls, and standing defense.',
    perspective: 'standing',
    csvPrefix: 'TD',
    csvFile: 'standing_takedowns.csv',
  },
  {
    id: 'leg_entanglements',
    name: 'Leg Entanglements',
    description: 'Ashi garami and leg lock positions. The modern leg lock game — entries, controls, and finishes.',
    perspective: 'neutral',
    csvPrefix: 'LE',
    csvFile: 'leg_entanglements.csv',
  },
  {
    id: 'guard_passing',
    name: 'Guard Passing',
    description: 'Techniques for getting past opponent\'s guard. Pressure, speed, and guard-specific passes.',
    perspective: 'top',
    csvPrefix: 'GP',
    csvFile: 'guard_passing.csv',
  },
];

// Standing clinch is merged into the "standing" position
const CLINCH_FILE = 'standing_clinch.csv';
const CLINCH_PREFIX = 'CL';

// Submissions master is a cross-cutting reference — we index it but don't create a position for it
const SUBMISSIONS_FILE = 'submissions_master.csv';
const SUBMISSIONS_PREFIX = 'SM';

// ===========================================
// BRANCH CLASSIFICATION
// ===========================================

/**
 * Determine which branch a technique belongs to based on its type and position perspective.
 */
function classifyBranch(type: TechniqueType, perspective: Perspective, subcategory: string): Branch {
  // Offense: submissions, sweeps, passes, takedowns, entries (attacking actions)
  if (['submission', 'sweep', 'pass', 'takedown', 'entry'].includes(type)) {
    return 'offense';
  }

  // Defense: escapes, defensive techniques
  if (['escape', 'defense'].includes(type)) {
    return 'defense';
  }

  // Control and transitions are neutral (maintaining/moving between positions)
  if (['control', 'transition'].includes(type)) {
    return 'neutral';
  }

  // Fallback
  return 'neutral';
}

// ===========================================
// CSV PARSING
// ===========================================

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ?? '';
    }
    rows.push(row);
  }

  return rows;
}

/** Parse a single CSV line, handling quoted fields with commas */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

/** Split pipe-delimited field into array */
function splitPipes(val: string): string[] {
  if (!val || val === '') return [];
  return val.split('|').map(s => s.trim()).filter(Boolean);
}

/** Map CSV prefix to position ID */
function prefixToPositionId(prefix: string): PositionId | null {
  const pos = POSITIONS.find(p => p.csvPrefix === prefix);
  return pos?.id ?? null;
}

/** Map a primary_positions string to PositionId[] */
function mapPrimaryPositions(raw: string): PositionId[] {
  if (!raw) return [];
  return raw.split('|').map(s => {
    const mapped: Record<string, PositionId> = {
      'closed_guard': 'closed_guard',
      'half_guard': 'half_guard',
      'open_guard': 'open_guard',
      'mount': 'mount',
      'side_control': 'side_control',
      'back_control': 'back_control',
      'knee_on_belly': 'knee_on_belly',
      'north_south': 'north_south',
      'turtle': 'turtle',
      'standing': 'standing',
      'front_headlock': 'standing', // front headlock is a standing sub-position
      'leg_entanglements': 'leg_entanglements',
      'guard_passing': 'guard_passing',
    };
    return mapped[s.trim()] ?? null;
  }).filter((x): x is PositionId => x !== null);
}

// ===========================================
// TECHNIQUE BUILDING
// ===========================================

function buildTechnique(
  row: Record<string, string>,
  positionId: PositionId,
  perspective: Perspective,
): Technique {
  const type = row.type as TechniqueType;
  const subcategory = row.subcategory ?? '';

  // For submissions_master, use primary_positions
  let positionIds: PositionId[];
  if (row.primary_positions) {
    positionIds = mapPrimaryPositions(row.primary_positions);
    if (positionIds.length === 0) positionIds = [positionId];
  } else {
    positionIds = [positionId];
  }

  return {
    id: row.technique_id,
    name: row.technique_name,
    alternateNames: splitPipes(row.alternate_names),
    traditionalName: row.portuguese_japanese_name || null,
    type,
    subcategory,
    branch: classifyBranch(type, perspective, subcategory),
    beltLevel: (row.belt_level || 'white') as BeltLevel,
    giNogi: (row.gi_nogi || 'both') as GiNogi,
    ibjjfLegal: row.ibjjf_legal || 'all_belts',
    description: row.description || '',
    keyPoints: splitPipes(row.key_points),
    commonMistakes: splitPipes(row.common_mistakes),
    relatedIds: splitPipes(row.related_techniques),
    counterIds: splitPipes(row.counters),
    positionIds,
  };
}

// ===========================================
// MAIN BUILD
// ===========================================

function build() {
  const CSV_DIR = path.resolve(__dirname, '../../docs/domain-knowledge/bjj-techniques/bjj_library');
  const OUTPUT = path.resolve(__dirname, '../src/data/technique-tree.ts');

  console.log('📖 Reading CSV files from:', CSV_DIR);

  // Index for all techniques (flat lookup)
  const index: Record<string, Technique> = {};

  // Build positions
  const positions: any[] = [];

  for (const posDef of POSITIONS) {
    const csvPath = path.join(CSV_DIR, posDef.csvFile);
    const content = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCSV(content);

    const techniques: Technique[] = rows.map(row =>
      buildTechnique(row, posDef.id, posDef.perspective)
    );

    // Add to index
    for (const t of techniques) {
      index[t.id] = t;
    }

    // Also load clinch techniques into the standing position
    let clinchTechniques: Technique[] = [];
    if (posDef.id === 'standing') {
      const clinchPath = path.join(CSV_DIR, CLINCH_FILE);
      const clinchContent = fs.readFileSync(clinchPath, 'utf-8');
      const clinchRows = parseCSV(clinchContent);
      clinchTechniques = clinchRows.map(row =>
        buildTechnique(row, 'standing', 'standing')
      );
      for (const t of clinchTechniques) {
        index[t.id] = t;
      }
    }

    const allTechniques = [...techniques, ...clinchTechniques];

    const offense = allTechniques.filter(t => t.branch === 'offense');
    const defense = allTechniques.filter(t => t.branch === 'defense');
    const neutral = allTechniques.filter(t => t.branch === 'neutral');

    positions.push({
      id: posDef.id,
      name: posDef.name,
      description: posDef.description,
      perspective: posDef.perspective,
      csvPrefix: posDef.csvPrefix,
      branches: { offense, defense, neutral },
    });

    console.log(`  ✅ ${posDef.name}: ${allTechniques.length} techniques (${offense.length}O / ${defense.length}D / ${neutral.length}N)`);
  }

  // Load submissions master into index (cross-reference, not a position)
  const smPath = path.join(CSV_DIR, SUBMISSIONS_FILE);
  const smContent = fs.readFileSync(smPath, 'utf-8');
  const smRows = parseCSV(smContent);
  let smAdded = 0;
  for (const row of smRows) {
    const id = row.technique_id;
    if (!index[id]) {
      // Only add if not already indexed from a position file
      const positions = mapPrimaryPositions(row.primary_positions ?? '');
      const posId = positions[0] ?? 'standing';
      const t = buildTechnique(row, posId, 'neutral');
      t.positionIds = positions.length > 0 ? positions : ['standing'];
      index[id] = t;
      smAdded++;
    } else {
      // Merge additional position data from SM_ into existing technique
      const existing = index[id];
      const smPositions = mapPrimaryPositions(row.primary_positions ?? '');
      for (const p of smPositions) {
        if (!existing.positionIds.includes(p)) {
          existing.positionIds.push(p);
        }
      }
    }
  }
  console.log(`  ✅ Submissions Master: ${smRows.length} entries (${smAdded} new, ${smRows.length - smAdded} merged)`);

  // SM_ techniques stay in the index for direct lookups but are NOT injected
  // into position branches — position-specific entries (CG_, MT_, etc.) already
  // have context-aware descriptions for each position. SM_ is the cross-reference layer.

  // Compute stats
  const allTechniques = Object.values(index);
  const stats = {
    totalTechniques: allTechniques.length,
    totalPositions: positions.length,
    byBelt: {} as Record<string, number>,
    byType: {} as Record<string, number>,
    byBranch: {} as Record<string, number>,
  };

  for (const t of allTechniques) {
    stats.byBelt[t.beltLevel] = (stats.byBelt[t.beltLevel] ?? 0) + 1;
    stats.byType[t.type] = (stats.byType[t.type] ?? 0) + 1;
    stats.byBranch[t.branch] = (stats.byBranch[t.branch] ?? 0) + 1;
  }

  console.log('\n📊 Stats:');
  console.log(`  Total techniques: ${stats.totalTechniques}`);
  console.log(`  By belt:`, JSON.stringify(stats.byBelt));
  console.log(`  By type:`, JSON.stringify(stats.byType));
  console.log(`  By branch:`, JSON.stringify(stats.byBranch));

  // ===========================================
  // GENERATE OUTPUT
  // ===========================================

  const output = `/**
 * TOMO — Technique Tree (Auto-Generated)
 *
 * DO NOT EDIT — Generated by scripts/build-technique-tree.ts
 * Source: docs/domain-knowledge/bjj-techniques/bjj_library/*.csv
 *
 * Generated: ${new Date().toISOString()}
 * Techniques: ${stats.totalTechniques}
 * Positions: ${stats.totalPositions}
 */

import type {
  TechniqueTree,
  Position,
  Technique,
  TechniqueFilter,
  PositionId,
  Branch,
} from '../types/technique-tree-types';

// ===========================================
// TREE DATA
// ===========================================

const POSITIONS: Position[] = ${JSON.stringify(positions, null, 2)};

const INDEX: Record<string, Technique> = ${JSON.stringify(index, null, 2)};

// ===========================================
// THE TREE
// ===========================================

export const techniqueTree: TechniqueTree = {
  version: '1.0.0',
  positions: POSITIONS,
  index: INDEX,
  stats: ${JSON.stringify(stats, null, 2)},
};

// ===========================================
// QUERY HELPERS
// ===========================================

/** Get a technique by ID */
export function getTechnique(id: string): Technique | undefined {
  return techniqueTree.index[id];
}

/** Get a position by ID */
export function getPosition(id: PositionId): Position | undefined {
  return techniqueTree.positions.find(p => p.id === id);
}

/** Get all techniques for a position + branch */
export function getTechniquesForPosition(
  positionId: PositionId,
  branch?: Branch,
): Technique[] {
  const pos = getPosition(positionId);
  if (!pos) return [];
  if (branch) return pos.branches[branch];
  return [...pos.branches.offense, ...pos.branches.defense, ...pos.branches.neutral];
}

/** Get related techniques (the "chain") */
export function getRelated(id: string): Technique[] {
  const t = getTechnique(id);
  if (!t) return [];
  return t.relatedIds.map(rid => getTechnique(rid)).filter((x): x is Technique => !!x);
}

/** Get counters for a technique */
export function getCounters(id: string): string[] {
  const t = getTechnique(id);
  return t?.counterIds ?? [];
}

/** Filter techniques across the entire tree */
export function filterTechniques(filter: TechniqueFilter): Technique[] {
  let results = Object.values(techniqueTree.index);

  if (filter.positionId) {
    results = results.filter(t => t.positionIds.includes(filter.positionId!));
  }
  if (filter.branch) {
    results = results.filter(t => t.branch === filter.branch);
  }
  if (filter.type) {
    results = results.filter(t => t.type === filter.type);
  }
  if (filter.beltLevel) {
    results = results.filter(t => t.beltLevel === filter.beltLevel || t.beltLevel === 'all_belts');
  }
  if (filter.giNogi) {
    results = results.filter(t => t.giNogi === filter.giNogi || t.giNogi === 'both');
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.alternateNames.some(a => a.toLowerCase().includes(q)) ||
      (t.traditionalName?.toLowerCase().includes(q) ?? false)
    );
  }

  return results;
}

/** Get all submissions available from a position */
export function getSubmissionsFromPosition(positionId: PositionId): Technique[] {
  return getTechniquesForPosition(positionId, 'offense')
    .filter(t => t.type === 'submission');
}

/** Normalize for matching — punctuation → space, collapse whitespace */
function norm(s: string): string {
  return s.toLowerCase().replace(/[''\\-\\/]/g, ' ').replace(/\\s+/g, ' ').trim();
}

/** Strip ALL whitespace for tighter fuzzy matching */
function compact(s: string): string {
  return norm(s).replace(/\\s/g, '');
}

/** Check if input matches a technique name (exact, partial, or compact) */
function nameMatches(input: string, techniqueName: string): boolean {
  const ni = norm(input);
  const nt = norm(techniqueName);
  // Exact normalized
  if (nt === ni) return true;
  // Partial: input is substring of name
  if (nt.includes(ni)) return true;
  // Compact: "darce" matches "d arce"
  if (compact(techniqueName).includes(compact(input))) return true;
  return false;
}

/** Get all techniques a user has logged (match by name — supports partial + fuzzy matching) */
export function matchLoggedTechniques(
  loggedNames: string[],
): { matched: Technique[]; unmatched: string[] } {
  const matched: Technique[] = [];
  const unmatched: string[] = [];
  const all = Object.values(techniqueTree.index);

  for (const name of loggedNames) {
    const found = all.find(t =>
      nameMatches(name, t.name) ||
      t.alternateNames.some(a => nameMatches(name, a))
    );

    if (found && !matched.some(m => m.id === found.id)) {
      matched.push(found);
    } else if (!found) {
      unmatched.push(name);
    }
  }

  return { matched, unmatched };
}

/** Get positions where a technique can be done */
export function getPositionsForTechnique(id: string): Position[] {
  const t = getTechnique(id);
  if (!t) return [];
  return t.positionIds
    .map(pid => getPosition(pid))
    .filter((p): p is Position => !!p);
}
`;

  fs.writeFileSync(OUTPUT, output, 'utf-8');
  console.log(`\n✅ Generated: ${OUTPUT}`);
  console.log(`   File size: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
}

build();
