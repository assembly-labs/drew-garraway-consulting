# AI Extraction Specification

**Version:** 1.2
**Date:** January 21, 2026
**Status:** Active
**Purpose:** Technical specification for the NLP pipeline that extracts structured data from voice and text journal entries

---

## Table of Contents

1. [Overview](#overview)
2. [Extraction Pipeline](#extraction-pipeline)
3. [Entity Extraction](#entity-extraction)
4. [Confidence Scoring](#confidence-scoring)
5. [BJJ Vocabulary (450+ Terms)](#bjj-vocabulary-450-terms)
6. [AssemblyAI Integration](#assemblyai-integration)
7. [Extraction Prompts](#extraction-prompts)
8. [Error Handling](#error-handling)
9. [Implementation Reference](#implementation-reference)

---

## Overview

### What This Document Covers

The AI Extraction system transforms unstructured voice recordings and text entries into structured session data. It handles:
- **Speech-to-text transcription** via AssemblyAI
- **Entity extraction** (techniques, positions, partners, outcomes)
- **Inference** for missing data (duration, training type)
- **Confidence scoring** to flag uncertain extractions

### Core Principles

1. **Aggressive Extraction** — Extract something rather than nothing
2. **Minimal Friction** — Never ask more than one follow-up question
3. **BJJ Domain Knowledge** — 450+ specialized vocabulary terms
4. **Graceful Degradation** — Partial data is better than no data

### Key Files

```
/prototype/src/
├── data/
│   └── techniqueVideos.ts         # Technique vocabulary reference
├── config/belt-system/
│   └── journal-patterns.ts        # Pattern detection for journal text
└── services/
    └── transcription.ts           # AssemblyAI integration (future)
```

---

## Extraction Pipeline

### Full Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      1. AUDIO CAPTURE                                │
├─────────────────────────────────────────────────────────────────────┤
│  Source: expo-av voice recording                                     │
│  Format: AAC or WAV                                                  │
│  Duration: 10 seconds - 5 minutes (typical: 60-90 seconds)          │
│  Quality: 16kHz minimum sample rate                                  │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   2. SPEECH-TO-TEXT (AssemblyAI)                     │
├─────────────────────────────────────────────────────────────────────┤
│  API: AssemblyAI /v2/transcript                                      │
│  Custom Vocabulary: BJJ_VOCABULARY (450+ terms)                      │
│  Boost Level: "high" for BJJ terminology                            │
│  Output: Raw transcript text with timestamps                         │
│  Latency: 5-10 seconds                                               │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   3. ENTITY EXTRACTION (LLM)                         │
├─────────────────────────────────────────────────────────────────────┤
│  Input: Raw transcript                                               │
│  Model: GPT-4o or Claude 3.5 Sonnet                                 │
│  Output: Structured SessionData JSON                                 │
│                                                                      │
│  Extracts:                                                           │
│  - duration_minutes: number | null                                   │
│  - training_type: 'gi' | 'nogi' | 'both' | null                     │
│  - sparring: boolean | null                                          │
│  - sparring_rounds: number | null                                    │
│  - techniques: string[]                                              │
│  - positions: string[]                                               │
│  - submissions_given: { technique: string, partner?: string }[]     │
│  - submissions_received: { technique: string, partner?: string }[]  │
│  - worked_well: string[]                                             │
│  - struggled_with: string[]                                          │
│  - training_partners: string[]                                       │
│  - injuries: { body_part: string, severity?: string }[]             │
│  - energy_level: 'high' | 'medium' | 'low' | null                   │
│  - notes: string                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   4. CONFIDENCE SCORING                              │
├─────────────────────────────────────────────────────────────────────┤
│  For each extracted field:                                           │
│  - HIGH (>90%): Auto-accept, show in review                         │
│  - MEDIUM (70-90%): Show with subtle highlight                      │
│  - LOW (50-70%): Show with "Did you mean...?" prompt                │
│  - VERY LOW (<50%): Exclude, keep in raw transcript only            │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   5. GAP-FILL (Max 1 Question)                       │
├─────────────────────────────────────────────────────────────────────┤
│  IF training_type missing AND can't infer:                          │
│     → Show tap selector: [ Gi ] [ No-Gi ]                           │
│                                                                      │
│  ELSE IF duration missing AND can't infer:                          │
│     → "About how long was class?"                                   │
│                                                                      │
│  ELSE IF techniques AND struggles both empty:                        │
│     → "Anything specific you worked on?"                            │
│                                                                      │
│  ELSE:                                                               │
│     → Skip to review. We have enough.                               │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   6. REVIEW CARD DISPLAY                             │
├─────────────────────────────────────────────────────────────────────┤
│  Show extracted data in summary card format                          │
│  Highlight low-confidence extractions for easy editing               │
│  User can edit, then save                                            │
│  Target time: 15-30 seconds                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Entity Extraction

### Extraction Targets

| Entity | Signal Words/Patterns | Priority |
|--------|----------------------|----------|
| **Duration** | "90 minutes," "hour and a half," "two-hour," "quick class" | Tier 1 |
| **Training Type** | "gi class," "no-gi," "nogi," "submission only" | Tier 1 |
| **Sparring** | "rolled," "sparring," "rounds," "tapped," "caught" | Tier 1 |
| **Techniques** | Named moves: "armbar," "kimura," "knee slice," "RNC" | Tier 2 |
| **Positions** | "from closed guard," "in mount," "from the back" | Tier 2 |
| **Sparring Rounds** | "rolled five times," "did 6 rounds," "three 5-minute" | Tier 2 |
| **Partners** | Names in context: "rolled with Jake," "Sarah caught me" | Tier 3 |
| **Submissions Given** | "tapped him," "got the choke," "finished," "submitted" | Tier 2 |
| **Submissions Received** | "got caught," "tapped to," "he got me," "caught me" | Tier 2 |
| **What Worked** | "felt good," "finally hit," "working well," "clicked" | Tier 2 |
| **Struggles** | "kept getting," "couldn't," "struggled," "got passed" | Tier 2 |
| **Injuries** | "knee is sore," "shoulder tight," "tweaked," "hurts" | Tier 3 |
| **Energy/Mood** | "exhausted," "felt strong," "low energy," "gassed" | Tier 3 |

### Inference Rules

**Training Type Inference:**
```typescript
function inferTrainingType(transcript: string): 'gi' | 'nogi' | null {
  // Strong Gi signals
  const giSignals = [
    /collar (choke|grip)/i,
    /lapel/i,
    /sleeve grip/i,
    /spider guard/i,
    /lasso/i,
    /bow and arrow/i,
    /baseball (bat )?choke/i,
    /loop choke/i,
  ];

  // Strong No-Gi signals
  const nogiSignals = [
    /heel hook/i,
    /no[ -]?gi/i,
    /submission only/i,
    /leg lock/i,
    /saddle/i,
    /body lock/i,
    /wrestling/i,
  ];

  const giScore = giSignals.filter(r => r.test(transcript)).length;
  const nogiScore = nogiSignals.filter(r => r.test(transcript)).length;

  if (giScore > nogiScore) return 'gi';
  if (nogiScore > giScore) return 'nogi';
  return null; // Can't determine
}
```

**Duration Inference:**
```typescript
function inferDuration(transcript: string): number | null {
  // Explicit duration patterns
  const patterns = [
    { regex: /(\d+)\s*minutes?/i, extract: (m: RegExpMatchArray) => parseInt(m[1]) },
    { regex: /(\d+)\s*hours?/i, extract: (m: RegExpMatchArray) => parseInt(m[1]) * 60 },
    { regex: /hour and a half/i, extract: () => 90 },
    { regex: /two hours?/i, extract: () => 120 },
    { regex: /an hour/i, extract: () => 60 },
  ];

  for (const { regex, extract } of patterns) {
    const match = transcript.match(regex);
    if (match) return extract(match);
  }

  // Contextual inference
  if (/quick (class|session)/i.test(transcript)) return 45;
  if (/open mat/i.test(transcript)) return 90;
  if (/long (day|session)/i.test(transcript)) return 120;

  return null;
}
```

**Sparring Inference:**
```typescript
function inferSparring(transcript: string): boolean | null {
  const sparringSignals = [
    /roll(ed|ing)/i,
    /sparr(ed|ing)/i,
    /\d+ rounds/i,
    /tapped/i,
    /got caught/i,
    /submitted/i,
    /swept (me|him|her)/i,
    /passed (my|his|her) guard/i,
  ];

  const noSparringSignals = [
    /just drill(ed|ing)/i,
    /no sparring/i,
    /technique (only|class)/i,
  ];

  const hasSparing = sparringSignals.some(r => r.test(transcript));
  const hasNoSparing = noSparringSignals.some(r => r.test(transcript));

  if (hasNoSparing) return false;
  if (hasSparing) return true;
  return null;
}
```

### Technique Normalization

Map variations to canonical technique names:

```typescript
const techniqueNormalization: Record<string, string> = {
  // Abbreviations
  'rnc': 'Rear Naked Choke',
  'dlr': 'De La Riva Guard',
  'rdlr': 'Reverse De La Riva',
  'slx': 'Single Leg X',
  'kob': 'Knee on Belly',

  // Common variations
  'armbar': 'Armbar',
  'arm bar': 'Armbar',
  'straight armlock': 'Armbar',
  'juji gatame': 'Armbar',

  'kimura': 'Kimura',
  'double wristlock': 'Kimura',
  'chicken wing': 'Kimura',

  'triangle': 'Triangle Choke',
  'triangle choke': 'Triangle Choke',
  'sankaku': 'Triangle Choke',

  'guillotine': 'Guillotine',
  'guilotine': 'Guillotine',  // Common misspelling

  'knee cut': 'Knee Slice Pass',
  'knee slice': 'Knee Slice Pass',
  'knee slide': 'Knee Slice Pass',

  'toreando': 'Toreando Pass',
  'toreando pass': 'Toreando Pass',
  'bullfighter': 'Toreando Pass',
  'bullfighter pass': 'Toreando Pass',

  'hip escape': 'Hip Escape',
  'shrimp': 'Hip Escape',
  'shrimping': 'Hip Escape',

  'upa': 'Bridge and Roll',
  'trap and roll': 'Bridge and Roll',
  'bridge and roll': 'Bridge and Roll',
};

function normalizeTechnique(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return techniqueNormalization[lower] || raw;
}
```

---

## Confidence Scoring

### Confidence Level Definitions

| Level | Range | UI Treatment | Example |
|-------|-------|--------------|---------|
| **High** | >90% | Auto-accept, display as-is | "armbar" clearly spoken |
| **Medium** | 70-90% | Show with subtle highlight | "kimura" in noisy audio |
| **Low** | 50-70% | Show "Did you mean...?" | "that sweep thing" |
| **Very Low** | <50% | Exclude, keep raw only | Unintelligible audio |

### Confidence Calculation

```typescript
interface ExtractionConfidence {
  field: string;
  value: any;
  confidence: number;          // 0.0 - 1.0
  source: 'explicit' | 'inferred' | 'default';
  raw_text?: string;           // Original text that led to extraction
}

function calculateConfidence(
  field: string,
  value: any,
  source: string,
  transcript: string
): number {
  let confidence = 0.5; // Base confidence

  // Explicit mentions get higher confidence
  if (source === 'explicit') confidence += 0.3;

  // Exact technique name match
  if (field === 'technique' && isKnownTechnique(value)) {
    confidence += 0.2;
  }

  // Duration with number
  if (field === 'duration' && typeof value === 'number') {
    confidence += 0.2;
  }

  // Name with context (e.g., "rolled with Jake")
  if (field === 'partner' && hasPartnerContext(value, transcript)) {
    confidence += 0.2;
  }

  // Penalize very short transcripts
  if (transcript.split(' ').length < 10) {
    confidence -= 0.1;
  }

  return Math.min(1.0, Math.max(0.0, confidence));
}
```

### Confidence Thresholds by Field

| Field | Auto-Accept | Highlight | Prompt | Exclude |
|-------|-------------|-----------|--------|---------|
| Duration | >85% | 60-85% | 40-60% | <40% |
| Training Type | >90% | 70-90% | 50-70% | <50% |
| Techniques | >80% | 60-80% | 40-60% | <40% |
| Partners | >70% | 50-70% | 30-50% | <30% |
| Submissions | >80% | 60-80% | 40-60% | <40% |
| Injuries | >85% | 70-85% | 50-70% | <50% |

---

## BJJ Vocabulary (450+ Terms)

### Complete Vocabulary for AssemblyAI `word_boost`

This comprehensive vocabulary is optimized for US practitioners and includes:
- Modern leg lock system (Danaher era)
- 10th Planet terminology
- Wrestling crossover terms
- Common misspellings (for robust matching)
- No-gi slang and abbreviations

```typescript
export const BJJ_VOCABULARY: string[] = [
  // ==========================================
  // CHOKES (Gi and No-Gi)
  // ==========================================
  // Gi chokes
  'cross collar choke',
  'bow and arrow choke',
  'baseball bat choke',
  'loop choke',
  'clock choke',
  'ezekiel choke',
  'paper cutter choke',
  'brabo choke',
  'bread cutter',
  'lapel choke',
  'sliding collar choke',
  'Magid choke',

  // No-gi chokes
  'rear naked choke',
  'RNC',
  'mata leao',
  'guillotine',
  'guillotine choke',
  'high elbow guillotine',
  'arm-in guillotine',
  'ten finger guillotine',
  'darce',
  'd\'arce',
  'darce choke',
  'anaconda',
  'anaconda choke',
  'gator roll',
  'arm triangle',
  'head and arm choke',
  'kata gatame',
  'north south choke',
  'von flue choke',
  'peruvian necktie',
  'Japanese necktie',
  'buggy choke',
  'standing guillotine',
  'power guillotine',
  'Marcelotine',

  // ==========================================
  // JOINT LOCKS - UPPER BODY
  // ==========================================
  // Armlocks
  'armbar',
  'arm bar',
  'juji gatame',
  'straight armbar',
  'belly down armbar',
  'spinning armbar',
  'mounted armbar',
  'S-mount armbar',
  'kimura',
  'double wristlock',
  'chicken wing',
  'americana',
  'keylock',
  'Americana lock',
  'omoplata',
  'monoplata',
  'gogoplata',
  'tarikoplata',
  'baratoplata',
  'wrist lock',
  'wristlock',
  'bicep slicer',
  'bicep crush',
  'straight armlock',
  'armlock',

  // ==========================================
  // JOINT LOCKS - LOWER BODY (MODERN LEG LOCK SYSTEM)
  // ==========================================
  // Core leg locks
  'heel hook',
  'inside heel hook',
  'outside heel hook',
  'ankle lock',
  'straight ankle lock',
  'straight footlock',
  'toe hold',
  'toehold',
  'kneebar',
  'knee bar',
  'calf slicer',
  'calf crush',
  'calf slicer',
  'estima lock',
  'aoki lock',

  // Danaher System Terminology
  'ashi garami',
  'standard ashi garami',
  'outside ashi',
  'outside ashi garami',
  'cross ashi',
  'cross ashi garami',
  'inside ashi',
  'inside ashi garami',
  'saddle',
  'inside sankaku',
  'honey hole',
  'honeyhole',
  '411',
  'four eleven',
  '50/50',
  'fifty fifty',
  '50-50',
  'backside 50/50',
  'inside 50/50',
  'outside 50/50',
  'leg entanglement',
  'leg entanglements',
  'reaping',
  'reap',
  'knee line',
  'kneeline',
  'boot',
  'the boot',
  'false reap',
  'Texas cloverleaf',
  'electric chair',

  // Leg lock entries
  'K guard entry',
  'single leg X entry',
  'Imanari roll',
  'rolling entry',
  'backside entry',

  // ==========================================
  // GUARD POSITIONS - CLOSED GUARDS
  // ==========================================
  'closed guard',
  'full guard',
  'high guard',
  'high closed guard',
  'guard',

  // 10th Planet Rubber Guard System
  'rubber guard',
  'mission control',
  'new york',
  'chill dog',
  'crackhead control',
  'dead orchard',
  'zombie',
  'carni',
  'meathook',
  'jiu claw',
  'kung fu move',

  // ==========================================
  // GUARD POSITIONS - OPEN GUARDS
  // ==========================================
  'open guard',
  'spider guard',
  'lasso guard',
  'lasso',
  'de la riva',
  'De La Riva',
  'DLR',
  'de la Riva guard',
  'reverse de la riva',
  'RDLR',
  'reverse DLR',
  'x guard',
  'X-guard',
  'single leg x',
  'SLX',
  'single leg X guard',
  'butterfly guard',
  'butterfly hooks',
  'half butterfly',
  'seated butterfly',
  'k guard',
  'K guard',
  'seated guard',
  'shin to shin',
  'shin-to-shin',
  'collar sleeve',
  'collar and sleeve',
  'worm guard',
  'squid guard',
  'mantis guard',
  'koala guard',
  'lapel guard',
  '93 guard',
  'Williams guard',

  // ==========================================
  // GUARD POSITIONS - HALF GUARDS
  // ==========================================
  'half guard',
  'deep half',
  'deep half guard',
  'z guard',
  'Z-guard',
  'knee shield',
  'knee shield half guard',
  'lockdown',
  'quarter guard',
  'three quarter guard',
  'dogfight',
  'dog fight',
  'coyote guard',

  // 10th Planet Half Guard System
  'old school',
  'old school sweep',
  'plan B',
  'electric sweep',
  'dog fight',

  // ==========================================
  // GUARD POSITIONS - INVERTED
  // ==========================================
  'inverted guard',
  'tornado guard',
  'berimbolo',
  'bolo',
  'baby bolo',
  'kiss of the dragon',
  'KOTD',
  'donkey guard',
  'inversion',
  'inverting',
  'crab ride',

  // ==========================================
  // TOP POSITIONS
  // ==========================================
  'mount',
  'full mount',
  'low mount',
  'high mount',
  's mount',
  'S-mount',
  'technical mount',
  'grapevine mount',
  'side control',
  'side mount',
  'cross side',
  'hundred kilos',
  '100 kilos',
  'kesa gatame',
  'scarf hold',
  'reverse kesa',
  'modified kesa',
  'north south',
  'north-south',
  'knee on belly',
  'KOB',
  'knee on chest',
  'knee ride',
  'back control',
  'back mount',
  'rear mount',
  'seatbelt',
  'seatbelt grip',
  'body triangle',
  'hooks in',
  'turtle',
  'turtle position',
  'front headlock',
  'front head',
  'crucifix',
  'crucifix position',
  'twister side control',

  // 10th Planet Back Control
  'truck',
  'the truck',
  'twister',
  'banana split',
  'calf crank',

  // ==========================================
  // LEG ENTANGLEMENT POSITIONS
  // ==========================================
  'leg entanglement',
  'leg ride',
  'leg knot',
  'matrix',
  'game over',
  'honey hole',
  'inside position',
  'outside position',
  'cross body',

  // ==========================================
  // SWEEPS AND TRANSITIONS
  // ==========================================
  'scissor sweep',
  'hip bump',
  'hip bump sweep',
  'flower sweep',
  'pendulum sweep',
  'pendulum',
  'elevator sweep',
  'overhead sweep',
  'sickle sweep',
  'lumberjack sweep',
  'tripod sweep',
  'technical standup',
  'technical stand up',
  'wrestle up',
  'balloon sweep',
  'star sweep',
  'waiter sweep',
  'hook sweep',
  'idiot sweep',
  'arm drag sweep',
  'half guard sweep',
  'John Wayne sweep',
  'tomahawk sweep',
  'dump sweep',

  // ==========================================
  // ESCAPES AND DEFENSE
  // ==========================================
  'hip escape',
  'shrimp',
  'shrimping',
  'elbow escape',
  'elbow-knee escape',
  'trap and roll',
  'upa',
  'bridge and roll',
  'bridge',
  'bridging',
  'frame',
  'framing',
  'underhook',
  'overhook',
  'whizzer',
  'granby roll',
  'Granby',
  'inversion',
  'technical stand up',
  'technical get up',
  'back escape',
  'mount escape',
  'side control escape',
  'ghost escape',
  'running escape',
  'running man',

  // ==========================================
  // TAKEDOWNS AND WRESTLING
  // ==========================================
  // Wrestling takedowns
  'double leg',
  'double leg takedown',
  'blast double',
  'power double',
  'single leg',
  'single leg takedown',
  'high crotch',
  'high C',
  'low single',
  'outside single',
  'ankle pick',
  'arm drag',
  'snap down',
  'snapdown',
  'duck under',
  'fireman\'s carry',
  'firemans carry',
  'body lock',
  'bear hug',
  'lat drop',
  'lateral drop',
  'suplex',
  'head and arm throw',
  'hip throw',

  // Wrestling positions
  'underhook',
  'overhook',
  'whizzer',
  'two on one',
  'Russian tie',
  'collar tie',
  'pummeling',
  'pummel',
  'hand fighting',
  'wrist control',
  'level change',
  'sprawl',
  'sprawling',
  'front headlock',
  'go behind',

  // Judo throws
  'osoto gari',
  'ouchi gari',
  'kouchi gari',
  'uchi mata',
  'seoi nage',
  'ippon seoi nage',
  'drop seoi nage',
  'harai goshi',
  'tai otoshi',
  'tomoe nage',
  'sumi gaeshi',
  'foot sweep',
  'de ashi barai',
  'sasae',
  'o goshi',
  'koshi guruma',
  'kata guruma',
  'yoko tomoe nage',
  'sode tsurikomi goshi',
  'drop kata guruma',
  'tani otoshi',
  'hiza guruma',
  'morote gari',

  // Guard pulls
  'guard pull',
  'pull guard',
  'pulling guard',
  'sit guard',
  'butt scoot',
  'seated guard pull',

  // ==========================================
  // GUARD PASSING
  // ==========================================
  'knee slice',
  'knee cut',
  'knee slide',
  'knee slice pass',
  'toreando',
  'toreando pass',
  'toreano',
  'bullfighter pass',
  'bullfighter',
  'leg drag',
  'leg drag pass',
  'x pass',
  'X-pass',
  'stack pass',
  'stacking',
  'over under pass',
  'over under',
  'smash pass',
  'pressure pass',
  'pressure passing',
  'long step pass',
  'long step',
  'headquarters',
  'HQ',
  'float pass',
  'float passing',
  'backstep',
  'backstep pass',
  'leg weave',
  'leg weave pass',
  'body lock pass',
  'body fold pass',
  'folding pass',
  'standing pass',
  'speed pass',
  'staple pass',

  // ==========================================
  // NO-GI SLANG AND ABBREVIATIONS
  // ==========================================
  'sub',
  'subs',
  'tap',
  'taps',
  'bolo',
  'bolos',
  'HQ',
  'seatbelt',
  'hooks',
  'boot',
  'the boot',
  'leg drag',
  'K guard',
  'SLX',
  'DLR',
  'RDLR',
  'KOB',
  'GI',
  'NOGI',
  'sub only',
  'submission only',
  'EBI',
  'EBI overtime',
  'escape time',
  'ride time',
  'ADCC',
  'IBJJF',

  // ==========================================
  // TRAINING TERMS
  // ==========================================
  'gi',
  'kimono',
  'no gi',
  'nogi',
  'no-gi',
  'submission only',
  'sub only',
  'points',
  'open mat',
  'drilling',
  'drill',
  'positional sparring',
  'specific training',
  'flow rolling',
  'flow roll',
  'hard roll',
  'competition class',
  'comp class',
  'fundamentals',
  'basics class',
  'advanced class',
  'shark tank',
  'gauntlet',
  'round robin',
  'king of the mat',
  'live training',
  'live rolling',

  // ==========================================
  // COMMON PHRASES
  // ==========================================
  'rolled',
  'rolling',
  'sparring',
  'sparred',
  'tapped',
  'tapped out',
  'submitted',
  'caught me',
  'got caught',
  'got me',
  'swept',
  'got swept',
  'passed my guard',
  'guard passed',
  'took the back',
  'got the back',
  'lost the back',
  'mount escape',
  'escaped mount',
  'side control escape',
  'escaped side control',
  'finished',
  'finish',
  'attempt',
  'attempted',
  'almost had',
  'defended',
  'escaped',
  'survived',
  'dominated',
  'controlled',

  // ==========================================
  // BELT LEVELS AND RANKS
  // ==========================================
  'white belt',
  'blue belt',
  'purple belt',
  'brown belt',
  'black belt',
  'coral belt',
  'red belt',
  'stripes',
  'stripe',
  'promotion',
  'promoted',
  'sandbagging',
  'sandbagger',

  // ==========================================
  // BODY PARTS (INJURY CONTEXT)
  // ==========================================
  'knee',
  'knees',
  'shoulder',
  'shoulders',
  'neck',
  'back',
  'lower back',
  'elbow',
  'elbows',
  'wrist',
  'wrists',
  'fingers',
  'finger',
  'thumb',
  'ribs',
  'rib',
  'hip',
  'hips',
  'ankle',
  'ankles',
  'foot',
  'toes',
  'ear',
  'cauliflower ear',

  // ==========================================
  // INSTRUCTOR REFERENCES
  // ==========================================
  'professor',
  'coach',
  'instructor',
  'sensei',
  'master',
  'teacher',

  // ==========================================
  // COMMON MISSPELLINGS (FOR ROBUST MATCHING)
  // ==========================================
  // These help catch voice-to-text errors and common user misspellings
  'kimmura',        // kimura
  'kimora',         // kimura
  'kemura',         // kimura
  'gilatine',       // guillotine
  'guilotine',      // guillotine
  'gullotine',      // guillotine
  'gillotine',      // guillotine
  'omaplata',       // omoplata
  'omoplatta',      // omoplata
  'toreanado',      // toreando
  'toreiando',      // toreando
  'toreano',        // toreando
  'torenado',       // toreando
  'berimbola',      // berimbolo
  'berimobolo',     // berimbolo
  'beremolo',       // berimbolo
  'delereva',       // de la riva
  'de la reeva',    // de la riva
  'delariva',       // de la riva
  'dela riva',      // de la riva
  'butterly guard', // butterfly guard
  'ezekial',        // ezekiel
  'ezekeil',        // ezekiel
  'anakonda',       // anaconda
  'annoconda',      // anaconda
  'darcy',          // darce
  'darcy choke',    // darce
  'arnbar',         // armbar
  'arm bar',        // armbar
  'kneecut',        // knee cut
  'knewbar',        // kneebar
  'kneebah',        // kneebar
  'healhoook',      // heel hook
  'heelhook',       // heel hook
  'heal hook',      // heel hook
  'toehold',        // toe hold
  'toe hold',       // toe hold
  'rnc',            // RNC
  'imanari',        // Imanari roll
  'immanari',       // Imanari roll
  'ashigarami',     // ashi garami
];

// ==========================================
// POSITION CONTEXT TYPES
// ==========================================
export type PositionContext =
  | 'standing'
  | 'guard_top'
  | 'guard_bottom'
  | 'half_guard_top'
  | 'half_guard_bottom'
  | 'mount_top'
  | 'mount_bottom'
  | 'side_control_top'
  | 'side_control_bottom'
  | 'back_control'
  | 'back_defense'
  | 'turtle_top'
  | 'turtle_bottom'
  | 'leg_entanglement'    // Added for modern leg lock game
  | 'front_headlock'
  | 'crucifix'
  | 'north_south_top'
  | 'north_south_bottom'
  | 'unknown';

// Total: ~450 terms
// AssemblyAI limit: 1000 words per request
// Note: This vocabulary is well within AssemblyAI's limit
```

### Vocabulary Categories Summary

| Category | Count | Examples |
|----------|-------|----------|
| Chokes (Gi) | 12 | bow and arrow, baseball bat, clock choke |
| Chokes (No-Gi) | 25 | guillotine, darce, anaconda, RNC |
| Upper Body Locks | 25 | armbar, kimura, omoplata, gogoplata |
| Leg Locks (Modern) | 40 | heel hook, saddle, 411, ashi garami |
| Guards (Closed) | 12 | closed guard, rubber guard, mission control |
| Guards (Open) | 30 | DLR, spider, butterfly, K guard |
| Guards (Half) | 15 | half guard, deep half, lockdown, dogfight |
| Guards (Inverted) | 10 | berimbolo, kiss of the dragon, crab ride |
| Top Positions | 30 | mount, side control, back control, truck |
| Leg Entanglements | 12 | saddle, 50/50, outside ashi, matrix |
| Sweeps | 25 | scissor, pendulum, hip bump, elevator |
| Escapes | 20 | shrimp, upa, granby, running escape |
| Takedowns (Wrestling) | 25 | double leg, single leg, blast double |
| Takedowns (Judo) | 20 | osoto gari, seoi nage, uchi mata |
| Guard Passing | 25 | knee slice, toreando, leg drag, HQ |
| No-Gi Slang | 20 | sub, bolo, HQ, seatbelt |
| Training Terms | 25 | open mat, drilling, flow rolling |
| Common Phrases | 30 | tapped, swept, passed guard |
| Belt/Rank | 12 | white belt, stripes, promotion |
| Body Parts | 20 | knee, shoulder, cauliflower ear |
| Misspellings | 45 | kimmura, gilatine, omaplata |
| **TOTAL** | **~450** | |

---

## AssemblyAI Integration

### API Configuration

```typescript
interface AssemblyAIConfig {
  apiKey: string;
  baseUrl: 'https://api.assemblyai.com/v2';
  wordBoost: string[];           // BJJ_VOCABULARY
  boostParam: 'high';            // Maximum vocabulary boost
  languageCode: 'en_us';
  punctuate: true;
  formatText: true;
}
```

### Transcription Request

```typescript
async function transcribeAudio(audioUrl: string): Promise<TranscriptResult> {
  // 1. Submit transcription job
  const submitResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': ASSEMBLYAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      word_boost: BJJ_VOCABULARY,
      boost_param: 'high',
      language_code: 'en_us',
      punctuate: true,
      format_text: true,
    }),
  });

  const { id } = await submitResponse.json();

  // 2. Poll for completion
  let result: TranscriptResult;
  while (true) {
    const pollResponse = await fetch(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      { headers: { 'Authorization': ASSEMBLYAI_API_KEY } }
    );
    result = await pollResponse.json();

    if (result.status === 'completed') break;
    if (result.status === 'error') throw new Error(result.error);

    await sleep(1000); // Wait 1 second before polling again
  }

  return result;
}

interface TranscriptResult {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  text: string;                  // Full transcript
  words: TranscriptWord[];       // Word-level data with timestamps
  confidence: number;            // Overall confidence 0.0-1.0
  audio_duration: number;        // Duration in seconds
  error?: string;
}

interface TranscriptWord {
  text: string;
  start: number;                 // Start time in ms
  end: number;                   // End time in ms
  confidence: number;            // Word-level confidence
}
```

### Cost Management

| Tier | Price | Use Case |
|------|-------|----------|
| Nano | $0.002/min | Development, testing |
| Best | $0.0062/min | Production |

**Cost Optimization:**
1. Trim silence from recordings before upload
2. Cap recordings at 5 minutes maximum
3. Use Nano tier for development
4. Batch non-urgent analytics processing

---

## Extraction Prompts

### Main Extraction Prompt

```
You are extracting structured data from a BJJ practitioner's voice note about their training session.

Extract the following fields. If a field cannot be determined, leave it null. Be AGGRESSIVE about inferring—it's better to extract something than nothing.

IMPORTANT RULES:
1. For techniques, use standard BJJ terminology
2. For duration, convert all formats to minutes (e.g., "hour and a half" → 90)
3. For partners, only extract names mentioned in training context
4. For injuries, note both body part and severity if mentioned
5. Don't invent information not present in the transcript

Fields to extract:
{
  "duration_minutes": number | null,
  "training_type": "gi" | "nogi" | "both" | null,
  "sparring": boolean | null,
  "sparring_rounds": number | null,
  "techniques": string[],
  "positions": string[],
  "submissions_given": [{ "technique": string, "partner": string? }],
  "submissions_received": [{ "technique": string, "partner": string? }],
  "worked_well": string[],
  "struggled_with": string[],
  "training_partners": string[],
  "injuries": [{ "body_part": string, "severity": string?, "notes": string? }],
  "energy_level": "high" | "medium" | "low" | null,
  "notes": string
}

Transcript:
"""
{transcript}
"""

Output valid JSON only. No markdown formatting.
```

### Few-Shot Examples

Including multiple examples in the prompt significantly improves extraction accuracy. The LLM learns the expected format and level of detail from these examples.

---

#### Example 1: Detailed Gi Session (Intermediate)

**Input Transcript:**
```
Tuesday night, maybe hour and a half. Worked on knee slice passing, the version
where you control the far arm. Rolled five rounds—got swept a lot from half guard,
couldn't maintain the underhook. Tapped Jake with a collar choke, Sarah caught me
in a triangle. Knee feels a little tight but nothing serious.
```

**Output JSON:**
```json
{
  "duration_minutes": 90,
  "training_type": "gi",
  "sparring": true,
  "sparring_rounds": 5,
  "techniques": ["Knee Slice Pass"],
  "positions": ["Half Guard"],
  "submissions_given": [
    { "technique": "Collar Choke", "partner": "Jake" }
  ],
  "submissions_received": [
    { "technique": "Triangle Choke", "partner": "Sarah" }
  ],
  "worked_well": ["Knee slice passing with far arm control"],
  "struggled_with": ["Maintaining underhook in half guard top", "Getting swept from half guard"],
  "training_partners": ["Jake", "Sarah"],
  "injuries": [
    { "body_part": "knee", "severity": "minor", "notes": "tightness" }
  ],
  "energy_level": null,
  "notes": "Focused on knee slice passing with far arm control variant"
}
```

---

#### Example 2: Minimal White Belt Entry

**Input Transcript:**
```
Good class. About an hour. Did some drilling and rolled a couple times. Got tapped a lot but whatever.
```

**Output JSON:**
```json
{
  "duration_minutes": 60,
  "training_type": null,
  "sparring": true,
  "sparring_rounds": 2,
  "techniques": [],
  "positions": [],
  "submissions_given": [],
  "submissions_received": [],
  "worked_well": [],
  "struggled_with": [],
  "training_partners": [],
  "injuries": [],
  "energy_level": null,
  "notes": "Drilling session followed by sparring"
}
```

---

#### Example 3: No-Gi Leg Lock Focus

**Input Transcript:**
```
Two hour open mat, all no-gi. Spent most of the time working on leg locks.
Drilled some entries from single leg X and butterfly ashi. Hit three heel hooks
today which felt good, mostly inside heel hooks. Marcus got me with a toe hold
when I was too focused on attacking. Need to work on my defensive awareness.
```

**Output JSON:**
```json
{
  "duration_minutes": 120,
  "training_type": "nogi",
  "sparring": true,
  "sparring_rounds": null,
  "techniques": ["Inside Heel Hook", "Toe Hold"],
  "positions": ["Single Leg X", "Butterfly Ashi"],
  "submissions_given": [
    { "technique": "Inside Heel Hook" },
    { "technique": "Inside Heel Hook" },
    { "technique": "Inside Heel Hook" }
  ],
  "submissions_received": [
    { "technique": "Toe Hold", "partner": "Marcus" }
  ],
  "worked_well": ["Leg lock entries", "Inside heel hook attacks"],
  "struggled_with": ["Defensive awareness while attacking"],
  "training_partners": ["Marcus"],
  "injuries": [],
  "energy_level": null,
  "notes": "Open mat focused on leg lock game development"
}
```

---

#### Example 4: Competition Prep Session

**Input Transcript:**
```
Hard training today, felt exhausted. Competition class, 90 minutes, six hard
rounds. Worked on my guard passing, toreando and knee slice combos. Got my
guard passed twice by that purple belt visiting. Did better in the later
rounds though. Shoulder is a bit sore from that failed arm drag.
```

**Output JSON:**
```json
{
  "duration_minutes": 90,
  "training_type": null,
  "sparring": true,
  "sparring_rounds": 6,
  "techniques": ["Toreando Pass", "Knee Slice Pass"],
  "positions": [],
  "submissions_given": [],
  "submissions_received": [],
  "worked_well": ["Guard passing combos", "Performance improved in later rounds"],
  "struggled_with": ["Guard got passed by purple belt visitor"],
  "training_partners": [],
  "injuries": [
    { "body_part": "shoulder", "severity": "minor", "notes": "sore from failed arm drag" }
  ],
  "energy_level": "low",
  "notes": "Competition class, hard training, performance improved through session"
}
```

---

#### Example 5: Technical Drilling Only (No Sparring)

**Input Transcript:**
```
Just drilling today, no rolling. Professor taught the bow and arrow choke
from back control, the version where you trap the arm first. Drilled it
for about 45 minutes. Also worked on the seatbelt grip and maintaining
back control when they try to escape. Feeling good, nice technical day.
```

**Output JSON:**
```json
{
  "duration_minutes": 45,
  "training_type": "gi",
  "sparring": false,
  "sparring_rounds": 0,
  "techniques": ["Bow and Arrow Choke", "Seatbelt Grip", "Back Control"],
  "positions": ["Back Control"],
  "submissions_given": [],
  "submissions_received": [],
  "worked_well": ["Back control maintenance"],
  "struggled_with": [],
  "training_partners": [],
  "injuries": [],
  "energy_level": "high",
  "notes": "Technical drilling focus on back attacks. Bow and arrow with arm trap variant."
}
```

---

#### Example 6: Frustration/Struggle Focus

**Input Transcript:**
```
Rough day. Hour class. Just kept getting swept from top half guard, every
single round. Can't figure out the underhook battle. Mike and Chris both
got me with the same sweep like three times each. Feeling pretty
discouraged honestly.
```

**Output JSON:**
```json
{
  "duration_minutes": 60,
  "training_type": null,
  "sparring": true,
  "sparring_rounds": null,
  "techniques": [],
  "positions": ["Half Guard Top"],
  "submissions_given": [],
  "submissions_received": [],
  "worked_well": [],
  "struggled_with": ["Half guard top sweeps", "Underhook battles", "Same sweep caught multiple times"],
  "training_partners": ["Mike", "Chris"],
  "injuries": [],
  "energy_level": "low",
  "notes": "Frustrating session. Repeated struggle with half guard top retention."
}
```

---

## Belt-Level Prompt Adaptation

Different belt levels communicate differently about their training. The extraction system adapts to these patterns.

### Why Adapt by Belt Level

| Belt Level | Typical Communication Style | Extraction Challenge |
|------------|----------------------------|----------------------|
| **White** | Vague, generic terms, limited vocabulary | Need to infer from context |
| **Blue** | Learning terminology, inconsistent use | Map slang to canonical terms |
| **Purple** | Detailed, systematic, position chains | Extract complex sequences |
| **Brown+** | Nuanced, focuses on refinement | Capture subtle details |

### Belt-Adaptive System Prompt

```typescript
function getExtractionPrompt(beltLevel: BeltLevel): string {
  const basePrompt = `You are extracting structured data from a BJJ practitioner's voice note.
Extract aggressively—it's better to extract something than nothing.`;

  const beltAdaptation = BELT_PROMPT_ADAPTATIONS[beltLevel];

  return `${basePrompt}

${beltAdaptation}

Fields to extract:
{schema}

Transcript:
"""
{transcript}
"""

Output valid JSON only.`;
}

const BELT_PROMPT_ADAPTATIONS: Record<BeltLevel, string> = {
  white: `
BELT CONTEXT: This is a WHITE BELT practitioner.

Expect:
- Generic descriptions ("that sweep", "some guard thing")
- Focus on survival and basic positions
- Limited technique vocabulary
- Emotional language about struggles
- Mentions of "tapping a lot" without specifics

Extraction guidance:
- Be generous with inference—"that choke from the back" is likely RNC
- "Guard" without context usually means closed guard
- "Swept" without detail = generic sweep, don't invent a name
- Capture emotional state (frustrated, excited, overwhelmed)
- Note mentions of survival as wins ("didn't get submitted", "escaped mount")
`,

  blue: `
BELT CONTEXT: This is a BLUE BELT practitioner.

Expect:
- Mix of correct terminology and slang
- Focus on developing "their game"
- More position-specific language
- Some technique chains mentioned
- Comparison to training partners by skill

Extraction guidance:
- Map common slang: "knee cut" = "knee slice", "RNC" = "rear naked choke"
- Capture game development focus ("working on my half guard")
- Note A-game vs B-game mentions
- Track position preferences they mention
- Capture sparring outcomes more precisely
`,

  purple: `
BELT CONTEXT: This is a PURPLE BELT practitioner.

Expect:
- Precise terminology
- Systematic thinking (position chains, game plans)
- Teaching/mentoring mentions
- Focus on refinement over survival
- Detailed positional breakdowns

Extraction guidance:
- Expect multi-step sequences ("DLR to berimbolo to back take")
- Capture teaching moments as character data
- Note refinement focus ("tightening up my knee slice grip")
- Track specific variations mentioned
- Capture both technical and strategic insights
`,

  brown: `
BELT CONTEXT: This is a BROWN/BLACK BELT practitioner.

Expect:
- Expert-level terminology
- Focus on micro-adjustments
- Teaching and coaching references
- Strategic and conceptual thinking
- Minimal survival struggles, more optimization

Extraction guidance:
- Capture subtle refinements ("changed my hip angle on the pass")
- Note conceptual insights
- Track teaching moments extensively
- Expect fewer submissions mentioned (focus on position/control)
- Capture efficiency focus ("got the sweep with less energy")
`,
};
```

### Belt-Specific Extraction Examples

#### White Belt Extraction

**Input:**
```
Survived today. Got put in some bad spots but escaped a few times.
That big guy crushed me in that position where he's on top sideways.
Almost got a choke from the back but he got out.
```

**Adapted Extraction (White Belt Mode):**
```json
{
  "duration_minutes": null,
  "training_type": null,
  "sparring": true,
  "sparring_rounds": null,
  "techniques": ["Rear Naked Choke"],
  "positions": ["Side Control"],
  "submissions_given": [],
  "submissions_received": [],
  "worked_well": ["Survived sparring", "Escaped from bad positions", "Attempted back choke"],
  "struggled_with": ["Pressure from side control"],
  "training_partners": [],
  "injuries": [],
  "energy_level": null,
  "notes": "Survival-focused session. Made escape attempts, showed initiative with back attack."
}
```

#### Purple Belt Extraction

**Input:**
```
Worked my DLR game today. Got the kiss of the dragon twice, finished one
with the crab ride to back take. Berimbolo attempts are getting cleaner
but still losing the back on bigger guys. Need to address the leg drag
counter—Marcus hit it on me three times from headquarters.
```

**Adapted Extraction (Purple Belt Mode):**
```json
{
  "duration_minutes": null,
  "training_type": null,
  "sparring": true,
  "sparring_rounds": null,
  "techniques": ["De La Riva Guard", "Kiss of the Dragon", "Crab Ride", "Back Take", "Berimbolo", "Leg Drag"],
  "positions": ["De La Riva Guard", "Back Control", "Headquarters"],
  "submissions_given": [],
  "submissions_received": [],
  "worked_well": ["Kiss of the dragon entries", "Crab ride to back take", "Berimbolo becoming cleaner"],
  "struggled_with": ["Maintaining back on larger opponents", "Defending leg drag from headquarters"],
  "training_partners": ["Marcus"],
  "injuries": [],
  "energy_level": null,
  "notes": "DLR game development session. Successful inversions but needs work on size-dependent back retention and leg drag defense."
}
```

### Implementation

```typescript
interface ExtractionRequest {
  transcript: string;
  userBeltLevel: BeltLevel;
  previousSessions?: SessionSummary[];  // For context
}

async function extractSessionData(request: ExtractionRequest): Promise<SessionData> {
  const prompt = getExtractionPrompt(request.userBeltLevel);

  const response = await llm.complete({
    model: 'gpt-4o',  // or 'claude-3-5-sonnet'
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: request.transcript }
    ],
    temperature: 0.1,  // Low temperature for consistent extraction
    response_format: { type: 'json_object' }
  });

  return parseAndValidate(response);
}
```

---

## Error Handling

### Transcription Errors

| Error | Cause | Handling |
|-------|-------|----------|
| `audio_too_short` | <1 second | "Recording too short. Try again?" |
| `audio_too_long` | >5 minutes | Truncate to first 5 minutes |
| `bad_audio_quality` | Noise/low volume | "Couldn't hear clearly. Try typing instead?" |
| `rate_limit` | API throttled | Queue with exponential backoff |
| `api_error` | AssemblyAI down | Fall back to text entry |

### Extraction Errors

| Error | Cause | Handling |
|-------|-------|----------|
| LLM timeout | Slow response | Use fallback: save raw transcript |
| Invalid JSON | Malformed output | Retry with simplified prompt |
| Empty extraction | No data found | Save minimal entry (timestamp only) |

### Fallback Flow

```
[Transcription/Extraction fails]
       ↓
[Show error message]
       ↓
[Offer options:]
   - [Try Again] → Re-record
   - [Type Instead] → Manual text entry
   - [Save Anyway] → Save with timestamp only
```

---

## Implementation Reference

### SessionData Interface

```typescript
interface SessionData {
  // Tier 0: Automatic
  date: string;                           // ISO date
  created_at: string;                     // ISO timestamp
  day_of_week: string;                    // Monday, Tuesday, etc.

  // Tier 1: Minimum viable
  duration_minutes: number | null;
  training_type: 'gi' | 'nogi' | 'both' | null;
  sparring: boolean | null;

  // Tier 2: Progress tracking
  sparring_rounds: number | null;
  techniques_drilled: string[];
  positions: string[];
  submissions_given: SubmissionRecord[];
  submissions_received: SubmissionRecord[];
  worked_well: string[];
  struggled_with: string[];

  // Tier 3: Context
  training_partners: string[];
  injuries: InjuryRecord[];
  energy_level: 'high' | 'medium' | 'low' | null;
  notes: string;

  // Metadata
  raw_transcript?: string;
  extraction_confidence?: ExtractionConfidence[];
}

interface SubmissionRecord {
  technique: string;
  partner?: string;
}

interface InjuryRecord {
  body_part: string;
  severity?: 'minor' | 'moderate' | 'serious';
  notes?: string;
}
```

### Integration with Voice Logger

```typescript
async function processVoiceLog(audioUri: string): Promise<SessionData> {
  // 1. Upload audio
  const audioUrl = await uploadAudio(audioUri);

  // 2. Transcribe
  const transcript = await transcribeAudio(audioUrl);

  // 3. Extract entities
  const extraction = await extractEntities(transcript.text);

  // 4. Build session data
  const sessionData: SessionData = {
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    day_of_week: getDayOfWeek(),
    ...extraction,
    raw_transcript: transcript.text,
    extraction_confidence: extraction.confidence,
  };

  // 5. Identify gaps for follow-up
  const gaps = identifyGaps(sessionData);

  return { sessionData, gaps };
}
```

---

## Testing Approach

### Test Suite Overview

Extraction testing requires both **unit tests** (individual components) and **integration tests** (full pipeline).

### Test Data Requirements

| Category | Count | Purpose |
|----------|-------|---------|
| **Golden examples** | 20 | Hand-verified input/output pairs |
| **Edge cases** | 15 | Minimal input, rambling, unusual terminology |
| **Belt-level samples** | 20 (5 per belt) | Validate belt-adaptive prompts |
| **Error cases** | 10 | Empty transcripts, gibberish, non-BJJ content |
| **Regression tests** | Ongoing | Previously failed extractions that were fixed |

### Sample Test Cases

#### Test Case 1: Basic Extraction

```typescript
const TEST_BASIC: ExtractionTest = {
  input: "Hour class, worked on armbars from closed guard. Rolled twice, got tapped by triangle.",
  expected: {
    duration_minutes: 60,
    training_type: null,
    sparring: true,
    sparring_rounds: 2,
    techniques: ["Armbar"],
    positions: ["Closed Guard"],
    submissions_given: [],
    submissions_received: [{ technique: "Triangle Choke" }],
    worked_well: [],
    struggled_with: [],
  },
  mustInclude: ["duration_minutes", "sparring", "techniques"],
  beltLevel: "white",
};
```

#### Test Case 2: Complex Gi Session

```typescript
const TEST_COMPLEX_GI: ExtractionTest = {
  input: `
    Two hours gi class. Drilled spider guard to triangle setup for the first hour.
    Rolled six rounds. Hit two collar chokes on white belts, got caught by Jake
    in a bow and arrow. Worked on lasso to omoplata but couldn't finish it live.
    Shoulder felt off after the second round but pushed through.
  `,
  expected: {
    duration_minutes: 120,
    training_type: "gi",
    sparring: true,
    sparring_rounds: 6,
    techniques: ["Spider Guard", "Triangle Choke", "Collar Choke", "Bow and Arrow Choke", "Lasso Guard", "Omoplata"],
    submissions_given: [
      { technique: "Collar Choke" },
      { technique: "Collar Choke" }
    ],
    submissions_received: [
      { technique: "Bow and Arrow Choke", partner: "Jake" }
    ],
    worked_well: ["Spider guard to triangle setup", "Collar chokes"],
    struggled_with: ["Omoplata finishes in live rolling"],
    injuries: [{ body_part: "shoulder", severity: "minor" }],
  },
  mustInclude: ["training_type", "sparring_rounds", "injuries"],
  beltLevel: "blue",
};
```

#### Test Case 3: Minimal Input

```typescript
const TEST_MINIMAL: ExtractionTest = {
  input: "Good class.",
  expected: {
    duration_minutes: null,
    training_type: null,
    sparring: null,
    techniques: [],
    positions: [],
  },
  mustBeNull: ["duration_minutes", "training_type", "sparring"],
  shouldNotHallucinate: true,
  beltLevel: "white",
};
```

#### Test Case 4: No-Gi Leg Lock Session

```typescript
const TEST_NOGI_LEGS: ExtractionTest = {
  input: `
    Hour and a half no-gi. All leg locks today. Worked inside sankaku entries
    and outside ashi transitions. Hit a heel hook on Marcus but got toe held
    by Sarah. Still struggling with the 50/50 dilemma.
  `,
  expected: {
    duration_minutes: 90,
    training_type: "nogi",
    techniques: ["Inside Sankaku", "Outside Ashi", "Heel Hook", "Toe Hold"],
    positions: ["50/50"],
    training_partners: ["Marcus", "Sarah"],
  },
  mustInclude: ["training_type", "training_partners"],
  beltLevel: "purple",
};
```

### Testing Framework

```typescript
interface ExtractionTest {
  id: string;
  input: string;                    // Transcript
  expected: Partial<SessionData>;   // Expected output (partial)
  mustInclude: string[];            // Fields that MUST be extracted
  mustBeNull?: string[];            // Fields that MUST be null
  shouldNotHallucinate?: boolean;   // Fail if invents data
  beltLevel: BeltLevel;
  tags?: string[];                  // For filtering tests
}

interface TestResult {
  testId: string;
  passed: boolean;
  errors: string[];
  extractionTime: number;
  actualOutput: SessionData;
}

async function runExtractionTest(test: ExtractionTest): Promise<TestResult> {
  const startTime = Date.now();
  const result = await extractSessionData({
    transcript: test.input,
    userBeltLevel: test.beltLevel,
  });
  const extractionTime = Date.now() - startTime;

  const errors: string[] = [];

  // Check required fields
  for (const field of test.mustInclude) {
    if (result[field] === null || result[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check must-be-null fields
  for (const field of test.mustBeNull || []) {
    if (result[field] !== null) {
      errors.push(`Field should be null: ${field}`);
    }
  }

  // Check expected values
  for (const [key, expected] of Object.entries(test.expected)) {
    if (!deepEqual(result[key], expected)) {
      errors.push(`Mismatch on ${key}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(result[key])}`);
    }
  }

  // Check for hallucinations
  if (test.shouldNotHallucinate) {
    const hallucinations = detectHallucinations(test.input, result);
    if (hallucinations.length > 0) {
      errors.push(`Hallucinated data: ${hallucinations.join(', ')}`);
    }
  }

  return {
    testId: test.id,
    passed: errors.length === 0,
    errors,
    extractionTime,
    actualOutput: result,
  };
}

function detectHallucinations(input: string, output: SessionData): string[] {
  const hallucinations: string[] = [];
  const inputLower = input.toLowerCase();

  // Check for invented partner names
  for (const partner of output.training_partners) {
    if (!inputLower.includes(partner.toLowerCase())) {
      hallucinations.push(`Partner name: ${partner}`);
    }
  }

  // Check for invented techniques not mentioned
  for (const technique of output.techniques) {
    const variations = getTechniqueVariations(technique);
    if (!variations.some(v => inputLower.includes(v.toLowerCase()))) {
      hallucinations.push(`Technique: ${technique}`);
    }
  }

  return hallucinations;
}
```

### Accuracy Metrics

```typescript
interface ExtractionMetrics {
  // Field-level accuracy
  fieldAccuracy: Record<string, number>;  // % correct per field

  // Overall metrics
  exactMatchRate: number;      // % of perfect extractions
  partialMatchRate: number;    // % with >80% correct fields
  hallucinationRate: number;   // % with invented data

  // Performance
  avgExtractionTimeMs: number;
  p95ExtractionTimeMs: number;

  // By belt level
  accuracyByBelt: Record<BeltLevel, number>;
}

function calculateMetrics(results: TestResult[]): ExtractionMetrics {
  // Implementation...
}
```

### Testing Checklist

#### Pre-Launch
- [ ] Create 20 golden example test cases
- [ ] Create 15 edge case tests
- [ ] Create 20 belt-level specific tests
- [ ] Achieve >85% field accuracy on golden examples
- [ ] Achieve <5% hallucination rate
- [ ] Measure baseline extraction latency

#### Ongoing
- [ ] Add failed extractions to regression suite
- [ ] Monthly accuracy review
- [ ] A/B test prompt variations
- [ ] Track user edit rate as proxy for accuracy

### LLM Model Comparison

Test extraction accuracy across different models:

| Model | Accuracy | Latency | Cost/1K calls |
|-------|----------|---------|---------------|
| GPT-4o | Baseline | ~2s | ~$3.00 |
| GPT-4o-mini | -5% | ~1s | ~$0.30 |
| Claude 3.5 Sonnet | +2% | ~2s | ~$4.50 |
| Claude 3 Haiku | -8% | ~0.5s | ~$0.15 |

**Recommendation:** GPT-4o for production, GPT-4o-mini for development/testing.

---

## LLM Choice Rationale

### Recommendation: GPT-4o (Primary) / Claude 3.5 Sonnet (Alternative)

| Factor | GPT-4o | Claude 3.5 Sonnet |
|--------|--------|-------------------|
| **JSON reliability** | Excellent | Excellent |
| **BJJ domain** | Good (with prompting) | Good (with prompting) |
| **Inference speed** | ~2s | ~2.5s |
| **Structured output** | Native support | Native support |
| **Cost** | $0.005/1K input tokens | $0.003/1K input tokens |
| **Hallucination rate** | Low | Very low |

**Decision:** GPT-4o is recommended for:
1. Native JSON mode reduces parsing errors
2. Slightly faster response times
3. Well-documented structured output API
4. Lower cost for our use case

**Claude 3.5 Sonnet** is a strong alternative if:
- Hallucination control is critical
- Longer transcripts are common
- You prefer Anthropic's safety features

### Implementation Note

```typescript
// Use OpenAI's structured output for reliable JSON
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: extractionPrompt },
    { role: 'user', content: transcript }
  ],
  response_format: { type: 'json_object' },  // Guarantees valid JSON
  temperature: 0.1,
});
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `VOICE_TRANSCRIPTION_SPEC.md` | AssemblyAI integration details, cost management |
| `VOICE_LOGGING_CONVERSATION_DESIGN.md` | Full voice logging UX flow |
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Three-tier data capture strategy |
| `DATA_AND_AI_BY_PAGE.md` | How extraction feeds Journal page |
| `/prototype/src/config/belt-system/` | Belt personalization implementation |

---

*Document Version: 1.2 — Expanded to 450+ terms with leg lock system, 10th Planet, wrestling crossover, and misspellings*
*Last Updated: January 21, 2026*
*Author: TOMO Product Team*
