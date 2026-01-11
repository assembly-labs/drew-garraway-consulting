# BJJ Technique Library

This folder contains a comprehensive Brazilian Jiu-Jitsu technique database with 361 techniques organized across 14 CSV files by positional category.

## Purpose

This library powers multiple features in the BJJ Journal app:

1. **Curriculum & Technique Library** - Hierarchical technique taxonomy for browsing and learning
2. **Progress Tracking** - Enables "technique mastery heat map" showing strong vs. weak positions
3. **AI Note Parsing** - Structured vocabulary for LLM to extract techniques from free-form session notes
4. **Belt Progression** - Maps techniques to belt-level requirements per IBJJF standards
5. **Coach Feedback** - Allows coaches to tag feedback to specific techniques

## File Structure

```
bjj-techniques/
├── README.md                    # This file
├── bjj-techniques-research      # Source research document (490+ techniques)
└── bjj_library/                 # CSV files
    ├── guard_closed.csv         # CG_001-030 (30 techniques)
    ├── guard_half.csv           # HG_001-030 (30 techniques)
    ├── guard_open.csv           # OG_001-045 (45 techniques)
    ├── mount.csv                # MT_001-020 (20 techniques)
    ├── side_control.csv         # SC_001-025 (25 techniques)
    ├── back_control.csv         # BC_001-020 (20 techniques)
    ├── knee_on_belly.csv        # KB_001-015 (15 techniques)
    ├── north_south.csv          # NS_001-015 (15 techniques)
    ├── turtle.csv               # TT_001-018 (18 techniques)
    ├── standing_takedowns.csv   # TD_001-025 (25 techniques)
    ├── standing_clinch.csv      # CL_001-020 (20 techniques)
    ├── guard_passing.csv        # GP_001-030 (30 techniques)
    ├── leg_entanglements.csv    # LE_001-018 (18 techniques)
    └── submissions_master.csv   # SM_001-050 (50 techniques)
```

## CSV Schema

All files use this 14-column schema (submissions_master.csv has 15 columns):

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `technique_id` | string | Unique ID: `{POSITION_CODE}_{NUMBER}` | `CG_001`, `SM_015` |
| `technique_name` | string | Primary English name | `Scissor Sweep` |
| `alternate_names` | string | Pipe-separated aliases | `Knee Push Sweep\|Basic Sweep` |
| `portuguese_japanese_name` | string | Foreign terminology | `Tesoura`, `Juji-gatame` |
| `type` | enum | Technique category | `submission`, `sweep`, `pass`, `escape`, `transition`, `takedown`, `defense`, `control`, `entry` |
| `subcategory` | string | Position subdivision | `sweeps`, `knee_shield`, `pressure` |
| `belt_level` | enum | When typically learned | `white`, `blue`, `purple`, `brown`, `black` |
| `gi_nogi` | enum | Applicability | `gi`, `nogi`, `both` |
| `ibjjf_legal` | enum | Competition legality | `all_belts`, `blue_and_above`, `brown_black_only`, `brown_black_nogi_only`, `illegal` |
| `description` | string | 1-2 sentence explanation | Brief technique summary |
| `key_points` | string | Pipe-separated execution details | `Control sleeve\|Cut angle\|Squeeze` |
| `common_mistakes` | string | Pipe-separated errors to avoid | `Loose grip\|Poor timing` |
| `related_techniques` | string | Pipe-separated technique names/IDs | `CG_002\|Hip Bump Sweep` |
| `counters` | string | Pipe-separated defensive responses | `Posturing\|Stacking` |
| `primary_positions` | string | **(submissions_master.csv only)** Where submission is applied | `mount\|closed_guard` |

## Position Codes

| Code | Position |
|------|----------|
| CG | Closed Guard |
| HG | Half Guard |
| OG | Open Guard |
| MT | Mount |
| SC | Side Control |
| BC | Back Control |
| KB | Knee on Belly |
| NS | North-South |
| TT | Turtle |
| TD | Takedowns |
| CL | Clinch |
| GP | Guard Passing |
| LE | Leg Entanglements |
| SM | Submissions Master |

## IBJJF Legality Reference

| Value | Meaning |
|-------|---------|
| `all_belts` | Legal for white belt and above |
| `blue_and_above` | Legal for blue belt and above (e.g., wristlocks) |
| `brown_black_only` | Legal for brown/black belts (e.g., kneebars, toe holds, calf slicers) |
| `brown_black_nogi_only` | Legal only in no-gi for brown/black (e.g., heel hooks) |
| `illegal` | Never legal in IBJJF (e.g., neck cranks, slams, twister) |

---

## How to Use This Library

### For the App (Programmatic Access)

```typescript
// Example: Load techniques for a position
import Papa from 'papaparse';

async function loadTechniques(position: string): Promise<Technique[]> {
  const response = await fetch(`/data/bjj_library/${position}.csv`);
  const csv = await response.text();
  const { data } = Papa.parse(csv, { header: true });
  return data as Technique[];
}

// Example: Find techniques by belt level
function filterByBelt(techniques: Technique[], belt: string): Technique[] {
  const beltOrder = ['white', 'blue', 'purple', 'brown', 'black'];
  const maxIndex = beltOrder.indexOf(belt);
  return techniques.filter(t =>
    beltOrder.indexOf(t.belt_level) <= maxIndex
  );
}
```

### For AI Note Parsing

When parsing session notes, use technique names and alternate names as a vocabulary:

```typescript
// Build lookup from all CSVs
const techniqueLookup = new Map<string, Technique>();
techniques.forEach(t => {
  techniqueLookup.set(t.technique_name.toLowerCase(), t);
  t.alternate_names?.split('|').forEach(alt =>
    techniqueLookup.set(alt.toLowerCase(), t)
  );
});

// Match against user input
function extractTechniques(notes: string): Technique[] {
  const found: Technique[] = [];
  for (const [name, technique] of techniqueLookup) {
    if (notes.toLowerCase().includes(name)) {
      found.push(technique);
    }
  }
  return found;
}
```

### For Progress Tracking

```typescript
// Structure for tracking user proficiency
interface TechniqueProgress {
  technique_id: string;
  proficiency: 'learning' | 'developing' | 'proficient' | 'advanced';
  last_practiced: Date;
  notes: string[];
}

// Calculate position strength
function calculatePositionStrength(
  position: string,
  userProgress: TechniqueProgress[]
): number {
  const positionTechniques = techniques.filter(t =>
    t.technique_id.startsWith(position)
  );
  const practiced = userProgress.filter(p =>
    positionTechniques.some(t => t.technique_id === p.technique_id)
  );
  return practiced.length / positionTechniques.length;
}
```

---

## How to Update This Library

### Adding a New Technique

1. **Determine the correct file** based on primary position
2. **Find the next available ID** in that file (e.g., if last is `CG_030`, use `CG_031`)
3. **Add a new row** with all 14 columns (15 for submissions_master.csv)
4. **Validate CSV** after editing (see validation section below)

Example new row for guard_closed.csv:
```csv
CG_031,New Technique Name,Alternate Name,Portuguese Name,sweep,sweeps,blue,both,all_belts,"Description here","Point 1|Point 2","Mistake 1|Mistake 2","CG_001|Related",Counter 1|Counter 2
```

### Adding a New Submission

Add to **submissions_master.csv** with the extra `primary_positions` column:

```csv
SM_051,New Submission,,Japanese Name,submission,choke,purple,both,all_belts,"Description","Points","Mistakes","Related","Counters",mount|side_control
```

### Updating an Existing Technique

1. Open the appropriate CSV file
2. Find the technique by `technique_id`
3. Edit the relevant columns
4. Save and validate

### Bulk Updates

For bulk updates, use a spreadsheet application:
1. Open CSV in Excel/Google Sheets/Numbers
2. Make edits
3. Export as CSV (UTF-8 encoding)
4. Validate the output

---

## Validation

### Quick Validation (Command Line)

```bash
cd bjj_library

# Count techniques per file
for f in *.csv; do echo "$f: $(($(wc -l < "$f") - 1)) techniques"; done

# Check for parsing errors with Python
python3 -c "
import csv
import os
for f in sorted(os.listdir('.')):
    if f.endswith('.csv'):
        with open(f) as csvfile:
            reader = csv.reader(csvfile)
            rows = list(reader)
            expected_cols = len(rows[0])
            for i, row in enumerate(rows[1:], 2):
                if len(row) != expected_cols:
                    print(f'{f} line {i}: column mismatch')
            print(f'{f}: OK ({len(rows)-1} techniques)')
"
```

### Validation Rules

1. **Unique IDs**: Each `technique_id` must be unique within its file
2. **Column count**: 14 columns for standard files, 15 for submissions_master.csv
3. **Enum values**: `type`, `belt_level`, `gi_nogi`, `ibjjf_legal` must use valid values
4. **No trailing commas**: Ensure no extra commas at end of rows
5. **Proper quoting**: Fields with commas or pipes must be quoted
6. **UTF-8 encoding**: All files must be UTF-8 encoded

### Common Issues

| Issue | Solution |
|-------|----------|
| Column count mismatch | Check for unquoted commas in description or other fields |
| Character encoding errors | Re-save as UTF-8 |
| Duplicate technique_id | Renumber to next available ID |
| Invalid enum value | Use only values from schema above |

---

## For Claude Code

When working with this library:

### Reading Techniques
```
Read the CSV file directly:
Read /path/to/bjj_library/guard_closed.csv
```

### Adding Techniques
```
1. Read the target CSV file first
2. Find the last technique_id number
3. Use Edit tool to append new row at end of file
4. Validate column count matches header
```

### Searching Techniques
```
Use Grep to find techniques by name:
Grep pattern="triangle" path="/path/to/bjj_library"

Or search specific file:
Grep pattern="sweep" path="/path/to/bjj_library/guard_closed.csv"
```

### Bulk Operations
```
For bulk changes, read entire file, process in memory,
then Write the complete updated content.
```

### Key Considerations
- Always preserve the header row
- Use pipe `|` for multi-value fields (alternate_names, key_points, etc.)
- Quote any field containing commas
- Escape internal quotes with double-quotes (`""`)
- Maintain Unix line endings (LF)
- Keep technique_ids sequential within each file

---

## Source Material

The techniques in this library were compiled from:
- `bjj-techniques-research` - Comprehensive research document with 490+ techniques
- IBJJF rulebook for legality classifications
- Standard BJJ curriculum progressions
- Notable practitioners' systems (Danaher, Cornelius, Bravo, etc.)

## Statistics

| Metric | Count |
|--------|-------|
| Total Techniques | 361 |
| Guard Files | 3 (105 techniques) |
| Top Position Files | 5 (95 techniques) |
| Standing Files | 2 (45 techniques) |
| Passing & Legs | 2 (48 techniques) |
| Submissions Master | 1 (50 techniques) |
| Turtle | 1 (18 techniques) |

---

## Future Enhancements

Potential additions to consider:
- [ ] Video URL column for technique demonstrations
- [ ] Prerequisite techniques column for curriculum sequencing
- [ ] Difficulty rating (1-5) independent of belt level
- [ ] Competition frequency data
- [ ] Body type suitability indicators
- [ ] Drill/warm-up variations
