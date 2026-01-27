# Video Database Enrichment: Purple & Brown Belt Implementation Plan

> **Status:** COMPLETE
> **Last Updated:** January 2025
> **Related:** [VIDEO_ENRICHMENT_WORKFLOW.md](./VIDEO_ENRICHMENT_WORKFLOW.md)

---

## Current State

| Belt Level | Coverage | Status |
|------------|----------|--------|
| White | 48 techniques | Complete |
| Blue | ~160 techniques | Complete |
| New to BJJ | 12 videos | Complete |
| Purple | ~50 techniques | **Complete** |
| Brown | ~25 techniques | **Complete** |

**Total video mappings:** 300+
**Unique techniques with videos:** 250+

---

## Priority Overview

| Priority | Category | Techniques | Why Critical |
|----------|----------|------------|--------------|
| **P0** | New to BJJ (NB_) | 12 videos | **COMPLETE** - Cultural, etiquette, getting started |
| **P1** | Leg Entanglements | 18 techniques | **COMPLETE** - Modern BJJ foundation |
| **P2** | Advanced Submissions | 22 techniques | **COMPLETE** - Heel hooks, leg locks, catch wrestling |
| **P3** | Advanced Open Guards | 19 techniques | **COMPLETE** - Berimbolo, worm guard, competition guards |
| **P4** | Advanced Passing | 4 techniques | **COMPLETE** - Floating, 50/50 pass, guard-specific |
| **P5** | Advanced Positions | 11 techniques | **COMPLETE** - Crucifix, truck, advanced back attacks |

---

## P0: New to BJJ - COMPLETE

Cultural and practical content for brand new students:

- [x] **NB_001** - How to Tie a BJJ Belt (Stephan Kesting)
- [x] **NB_002** - BJJ Hygiene Essentials (Chewjitsu)
- [x] **NB_003** - What to Expect Your First Class (Chewjitsu)
- [x] **NB_004** - Benefits of Starting BJJ (Jocko Willink)
- [x] **NB_005** - BJJ Gym Etiquette (Chewjitsu)
- [x] **NB_006** - What to Wear to First Class (Chewjitsu)
- [x] **NB_007** - Surviving Your First Months (Chewjitsu)
- [x] **NB_008** - Rolling Etiquette for Beginners (Stephan Kesting)
- [x] **NB_009** - Tapping and Safety (Stephan Kesting)
- [x] **NB_010** - Gi vs No-Gi Explained (Chewjitsu)
- [x] **NB_011** - How to Pick a BJJ Gym (Chewjitsu)
- [x] **NB_012** - Basic BJJ Terminology (Stephan Kesting)

---

## Key Files

```
Video Database (edit):
/TOMO/prototype/src/data/techniqueVideos.ts

Type Definitions (reference):
/TOMO/prototype/src/types/techniqueVideos.ts

Technique Catalogs:
/TOMO/docs/domain-knowledge/bjj-techniques/bjj_library/
├── leg_entanglements.csv    ← P1
├── submissions_master.csv   ← P2
├── guard_open.csv           ← P3
├── guard_passing.csv        ← P4
├── back_control.csv         ← P5
├── mount.csv
├── side_control.csv
└── turtle.csv
```

---

## Approved Instructors for Advanced Content

### Tier 1: Leg Lock Specialists
- **Lachlan Giles** - K-guard, saddle escapes, ADCC-proven leg locks
- **Craig Jones** - Heel hooks, Z-guard to legs, darce systems
- **John Danaher** - Leg lock systems, enter the system philosophy
- **Gordon Ryan** - 50/50, leg pummeling, finishing mechanics

### Tier 2: Competition Specialists
- **Mikey Musumeci** - Guard retention, leg lock defense, 50/50
- **Keenan Cornelius** - Worm guard, lapel systems (gi)
- **Marcelo Garcia** - X-guard, guillotines, butterfly
- **Giancarlo Bodoni** - Saddle entries, modern leg game

### Tier 3: System Teachers
- **Stephan Kesting** - Conceptual breakdowns
- **Jon Thomas** - Competition analysis
- **Rob Biernacki** - Conceptual passing and guard

---

## P1: Leg Entanglements (HIGHEST PRIORITY)

**Why:** Modern competition BJJ revolves around leg entanglements. Current database has only defense-focused videos. Purple/brown practitioners need entry, control, and attack knowledge.

### Techniques to Cover

#### Control Positions (Purple Belt)
- [ ] **LE_003** - Inside Sankaku (Saddle/411/Honey Hole) - Most dominant leg lock position
- [ ] **LE_004** - Cross Ashi - Transitional control position
- [ ] **LE_005** - 50/50 Entanglement - Symmetrical leg battle
- [ ] **LE_006** - 80/20 Position - Dominant leg lock angle
- [ ] **LE_016** - Leg Knot - Complex multi-control entanglement
- [ ] **LE_018** - Mirrored Ashi - Same-side leg control

#### Control Positions (Brown Belt)
- [ ] **LE_008** - Calf Slicer Position - Compression setup (brown+ only)
- [ ] **LE_015** - Game Over Position - Maximum dominance (brown+ nogi)

#### Entries (Purple Belt)
- [ ] **LE_007** - K Guard Entry - Lachlan Giles specialty
- [ ] **LE_009** - Leg Pummeling - Fighting for superior position
- [ ] **LE_010** - Back Exposure - Counter/escape technique
- [ ] **LE_011** - DLR to Leg Lock - Guard to legs entry
- [ ] **LE_012** - RDLR to Leg Lock - Reverse DLR entry
- [ ] **LE_013** - Butterfly to Leg Lock - Butterfly entry
- [ ] **LE_014** - Imanari Roll - Standing rolling entry
- [ ] **LE_017** - Standing to Legs - Standing dive entry

### Suggested Videos to Find

| Instructor | Search Terms | Best For |
|------------|--------------|----------|
| Lachlan Giles | "K guard entry", "saddle attacks", "heel hook defense" | LE_007, LE_003 |
| Craig Jones | "leg lock entries", "50/50", "heel hook" | LE_005, LE_011 |
| John Danaher | "enter the system", "ashi garami", "leg lock" | All entries |
| Gordon Ryan | "leg pummeling", "50/50 wrestling" | LE_009, LE_005 |

### Existing Videos to Leverage

These are already in the database and may cover additional LE techniques:

| YouTube ID | Instructor | Title | Map To |
|------------|------------|-------|--------|
| `CFTLb8iywJg` | Lachlan Giles | Defending And Escaping The Saddle | LE_003 defense |
| `DrjbaXt-nTo` | Lachlan Giles | Rolling Out Of Heel Hooks | LE_010 |

---

## P2: Advanced Submissions

### Leg Locks (Brown Belt - IBJJF Restricted)

- [ ] **SM_029** - Toe Hold - Figure-four foot lock (brown+)
- [ ] **SM_030** - Kneebar - Leg hyperextension (brown+)
- [ ] **SM_031** - Inside Heel Hook - ACL/MCL attack from saddle (brown+ nogi)
- [ ] **SM_032** - Outside Heel Hook - Standard heel hook (brown+ nogi)
- [ ] **SM_046** - Inside Heel Hook from Saddle - 411 finish (brown+ nogi)
- [ ] **SM_047** - Outside Heel Hook from Ashi - Ashi finish (brown+ nogi)
- [ ] **SM_048** - Aoki Lock - Shinya Aoki calf variation (brown+)

### Compression Locks (Brown Belt)

- [ ] **SM_025** - Bicep Slicer - Arm compression (brown+)
- [ ] **SM_034** - Calf Slicer - Leg compression (brown+)
- [ ] **SM_044** - Calf Slicer from Half - Half guard finish (brown+)
- [ ] **SM_045** - Electric Chair Calf Slicer - Banana split (brown+)

### Advanced Chokes (Purple Belt)

- [ ] **SM_015** - Baseball Bat Choke - Spinning collar choke (purple, gi)
- [ ] **SM_019** - Gogoplata - Shin choke from rubber guard (purple)
- [ ] **SM_035** - Twister - Eddie Bravo spinal lock (purple, nogi, illegal IBJJF)
- [ ] **SM_038** - Monoplata - Mounted omoplata (purple)
- [ ] **SM_039** - Peruvian Necktie - Front headlock variation (purple)
- [ ] **SM_040** - Japanese Necktie - Spinning front headlock (purple)
- [ ] **SM_042** - Ninja Choke - Side control armpit thread (purple)
- [ ] **SM_043** - Pace Choke - NS lat compression variation (purple)
- [ ] **SM_049** - Suloev Stretch - Groin stretch from back (purple)
- [ ] **SM_050** - Buggy Choke - Reverse arm triangle from bottom (purple)

### Foot Lock Variations (Purple Belt)

- [ ] **SM_033** - Estima Lock - Foot lock variation (purple, contested legality)

### Suggested Videos to Find

| Instructor | Search Terms | Best For |
|------------|--------------|----------|
| Lachlan Giles | "heel hook finish", "inside heel hook", "toe hold" | SM_031, SM_032, SM_029 |
| Craig Jones | "heel hook", "knee bar", "calf slicer" | SM_030, SM_034 |
| Eddie Bravo | "twister", "electric chair", "10th planet" | SM_035, SM_045 |
| Gordon Ryan | "heel hook mechanics", "finishing leg locks" | All leg locks |

---

## P3: Advanced Open Guards

### Berimbolo System (Purple Belt)

- [ ] **OG_003** - Berimbolo - Inverting back take
- [ ] **OG_006** - RDLR Sweep - Kiss of the Dragon entry
- [ ] **OG_007** - Kiss of the Dragon - RDLR back take
- [ ] **OG_008** - RDLR to Leg Entanglement - Leg lock entry
- [ ] **OG_018** - Collar Sleeve Back Take - Spin under (purple, gi)
- [ ] **OG_026** - SLX to Back Take - Ashi to back (purple)
- [ ] **OG_041** - Tornado Guard - Inverted guard variation (purple)
- [ ] **OG_042** - DLR Leg Drag Counter - Counter sweep (purple)
- [ ] **OG_045** - Matrix Back Take - Spider to back (purple, gi)

### Worm Guard System (Purple Belt, Gi)

- [ ] **OG_031** - Worm Guard - Lapel wrap control
- [ ] **OG_032** - Worm Guard Sweep - Lapel sweep
- [ ] **OG_033** - Worm Guard Back Take - Lapel berimbolo
- [ ] **OG_034** - Squid Guard - Worm variation

### Worm Guard System (Brown Belt, Gi)

- [ ] **OG_035** - Gubber Guard - Advanced lapel guard

### Rubber Guard System (Purple Belt)

- [ ] **OG_036** - Rubber Guard - Mission control (flexibility required)
- [ ] **OG_037** - Rubber Guard Omoplata - Mission control attack

### 50/50 System (Purple Belt)

- [ ] **OG_029** - 50/50 Guard - Symmetrical entanglement
- [ ] **OG_030** - 50/50 Sweep - Position sweep

### K-Guard (Purple Belt)

- [ ] **OG_044** - K Guard - Lachlan Giles modification

### Suggested Videos to Find

| Instructor | Search Terms | Best For |
|------------|--------------|----------|
| Mikey Musumeci | "berimbolo", "back take", "inversion" | OG_003, OG_007 |
| Keenan Cornelius | "worm guard", "lapel guard", "squid guard" | OG_031-034 |
| Lachlan Giles | "k guard", "slx back take" | OG_044, OG_026 |
| Eddie Bravo | "rubber guard", "mission control" | OG_036, OG_037 |

---

## P4: Advanced Passing

### Speed Passing (Purple Belt)

- [ ] **GP_012** - Cartwheel Pass - Athletic spinning pass
- [ ] **GP_023** - Floating Pass - Light hover passing

### Guard-Specific Passing (Purple Belt)

- [ ] **GP_018** - Passing Worm Guard - Lapel guard counter (gi)
- [ ] **GP_029** - 50/50 Passing - Extracting from 50/50

### Suggested Videos to Find

| Instructor | Search Terms | Best For |
|------------|--------------|----------|
| Gordon Ryan | "passing worm guard", "floating pass" | GP_018, GP_023 |
| Lachlan Giles | "50/50 passing", "passing concepts" | GP_029 |

---

## P5: Advanced Positions

### Back Control (Purple Belt)

- [ ] **BC_010** - Triangle from Back - Back triangle setup
- [ ] **BC_017** - Armbar Crucifix Transition - Back to crucifix
- [ ] **BC_018** - Truck Position - Twister/calf slicer control
- [ ] **BC_020** - Straight Jacket - Double collar control (gi)

### Turtle Attacks (Purple Belt)

- [ ] **TT_009** - Crucifix Control - Both arms trapped
- [ ] **TT_010** - Twister Setup - Truck entry from turtle

### Side Control (Purple Belt)

- [ ] **SC_005** - Twister Side Control - Leg-focused side control
- [ ] **SC_014** - Baseball Bat Choke - Spinning choke (gi)
- [ ] **SC_025** - Monoplata from Side - Side control omoplata

### Mount (Purple Belt)

- [ ] **MT_018** - S-Mount Armbar - High mount attack
- [ ] **MT_019** - Mounted Omoplata - Mount shoulder lock

### Suggested Videos to Find

| Instructor | Search Terms | Best For |
|------------|--------------|----------|
| Eddie Bravo | "truck position", "twister", "crucifix" | BC_018, TT_010 |
| Craig Jones | "crucifix", "back attacks" | BC_017, TT_009 |

---

## Video Entry Template

```typescript
{
  technique_id: 'LE_003',
  video_type: 'instructional',
  youtube_id: 'YOUTUBE_ID_HERE',
  instructor: 'Lachlan Giles',
  title: 'Video Title Here',
  duration_seconds: 600,
  difficulty_level: 7,              // 7-8 = purple, 9-10 = brown
  belt_prerequisite: 'purple',
  gi_nogi: 'nogi',
  concepts: ['leg_entanglements', 'transitions', 'combinations'],
  quality_score: 5,
  source_channel: 'Absolute MMA St Kilda',
}
```

### Valid ConceptTags

`weight_distribution`, `leverage`, `timing`, `grip_fighting`, `hip_movement`, `frames`, `pressure`, `angle`, `connection`, `posture`, `base`, `transitions`, `combinations`, `setups`, `counters`, `defense`, `fundamentals`, `competition`, `mindset`, `longevity`

### Difficulty Level Mapping

| Level | Belt | Description |
|-------|------|-------------|
| 7 | Purple | Advanced concepts, competition-tested |
| 8 | Purple+ | High-level competition techniques |
| 9 | Brown | Expert-level, requires strong fundamentals |
| 10 | Brown/Black | Master-level refinements |

---

## Workflow

1. **Select a priority section** (start with P1: Leg Entanglements)
2. **Read the technique catalog CSV** for technique details
3. **Search YouTube** for approved instructor content
4. **Verify video quality** (clear instruction, good production)
5. **Add entry** to `techniqueVideos.ts` following template
6. **Run `npm run build`** from `/TOMO/prototype` to verify
7. **Check off technique** in this document
8. **Commit changes** when section complete

---

## Commands

```bash
# From /TOMO/prototype directory:
npm run build          # Verify TypeScript compiles
npm run dev            # Test locally at localhost:5173
npm run ship           # Full deploy pipeline

# Useful greps:
grep -E "technique_id: 'LE_" src/data/techniqueVideos.ts | wc -l
grep -E "technique_id: 'SM_" src/data/techniqueVideos.ts | wc -l
```

---

## Progress Tracking

### P1: Leg Entanglements - COMPLETE
- [x] LE_001 - Standard Ashi (was existing)
- [x] LE_002 - Outside Ashi (was existing)
- [x] LE_003 - Inside Sankaku (was existing)
- [x] LE_004 - Cross Ashi
- [x] LE_005 - 50/50 (was existing)
- [x] LE_006 - 80/20
- [x] LE_007 - K Guard Entry
- [x] LE_008 - Calf Slicer Position
- [x] LE_009 - Leg Pummeling (was existing)
- [x] LE_010 - Back Exposure (was existing)
- [x] LE_011 - DLR to Legs
- [x] LE_012 - RDLR to Legs
- [x] LE_013 - Butterfly to Legs
- [x] LE_014 - Imanari Roll
- [x] LE_015 - Game Over
- [x] LE_016 - Leg Knot
- [x] LE_017 - Standing to Legs
- [x] LE_018 - Mirrored Ashi

### P2: Advanced Submissions - COMPLETE
- [x] SM_015 - Baseball Bat Choke
- [x] SM_019 - Gogoplata
- [x] SM_025 - Bicep Slicer
- [x] SM_029 - Toe Hold
- [x] SM_030 - Kneebar
- [x] SM_031 - Inside Heel Hook
- [x] SM_032 - Outside Heel Hook
- [x] SM_033 - Estima Lock
- [x] SM_034 - Calf Slicer
- [x] SM_035 - Twister
- [x] SM_038 - Monoplata
- [x] SM_039 - Peruvian Necktie
- [x] SM_040 - Japanese Necktie
- [x] SM_042 - Ninja Choke
- [x] SM_043 - Pace Choke
- [x] SM_044 - Calf Slicer from Half
- [x] SM_045 - Electric Chair Calf Slicer
- [x] SM_046 - Inside Heel Hook from Saddle
- [x] SM_047 - Outside Heel Hook from Ashi
- [x] SM_048 - Aoki Lock
- [x] SM_049 - Suloev Stretch
- [x] SM_050 - Buggy Choke

### P3: Advanced Open Guards - COMPLETE
- [x] OG_003 - Berimbolo
- [x] OG_006 - RDLR Sweep
- [x] OG_007 - Kiss of the Dragon
- [x] OG_008 - RDLR to Legs
- [x] OG_018 - Collar Sleeve Back Take
- [x] OG_026 - SLX to Back
- [x] OG_029 - 50/50 Guard
- [x] OG_030 - 50/50 Sweep
- [x] OG_031 - Worm Guard
- [x] OG_032 - Worm Guard Sweep
- [x] OG_033 - Worm Guard Back Take
- [x] OG_034 - Squid Guard
- [x] OG_035 - Gubber Guard
- [x] OG_036 - Rubber Guard
- [x] OG_037 - Rubber Guard Omoplata
- [x] OG_041 - Tornado Guard
- [x] OG_042 - DLR Leg Drag Counter
- [x] OG_044 - K Guard
- [x] OG_045 - Matrix Back Take

### P4: Advanced Passing - COMPLETE
- [x] GP_012 - Cartwheel Pass
- [x] GP_018 - Passing Worm Guard
- [x] GP_023 - Floating Pass
- [x] GP_029 - 50/50 Passing

### P5: Advanced Positions - COMPLETE
- [x] BC_010 - Triangle from Back
- [x] BC_017 - Armbar Crucifix Transition
- [x] BC_018 - Truck Position
- [x] BC_020 - Straight Jacket
- [x] MT_018 - S-Mount Armbar
- [x] MT_019 - Mounted Omoplata
- [x] SC_005 - Twister Side Control
- [x] SC_014 - Baseball Bat Choke
- [x] SC_025 - Monoplata from Side
- [x] TT_009 - Crucifix Control
- [x] TT_010 - Twister Setup

---

## Notes

- **No-gi priority:** Leg entanglements and heel hooks are primarily no-gi. Prioritize no-gi instructors (Danaher, Lachlan, Craig Jones, Gordon Ryan).
- **IBJJF legality:** Mark brown+ techniques appropriately. Many leg locks are restricted to brown/black belts in IBJJF.
- **Gi-specific:** Worm guard, baseball bat choke, lapel guards are gi-only. Mark appropriately.
- **Eddie Bravo content:** Great for rubber guard, truck, twister - but verify production quality.
