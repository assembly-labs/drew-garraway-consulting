# AI Extraction Pipeline Specification

**Version:** 1.0 DRAFT
**Last Updated:** January 2026
**Status:** Draft for Review
**Author:** Product/Engineering
**Companion Docs:** `JOURNAL_DATA_CAPTURE_STRATEGY.md`, `VOICE_TRANSCRIPTION_SPEC.md`

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Input Types & Preprocessing](#input-types--preprocessing)
4. [Entity Extraction Rules](#entity-extraction-rules)
   - [Technique Extraction](#1-technique-extraction)
   - [Submission Parsing](#2-submission-parsing)
   - [Position Detection](#3-position-detection)
   - [Partner Extraction](#4-partner-extraction)
   - [Duration/Quantity Parsing](#5-durationquantity-parsing)
   - [Sentiment Analysis](#6-sentiment-analysis)
   - [Injury Detection](#7-injury-detection)
5. [Confidence Scoring](#confidence-scoring)
6. [Output Schema](#output-schema)
7. [Fallback Behaviors](#fallback-behaviors)
8. [Example Extractions](#example-extractions)
9. [Implementation Options](#implementation-options)
10. [Testing & Validation](#testing--validation)

---

## Executive Summary

### Purpose

This document specifies how TOMO transforms unstructured journal input (voice transcripts and text notes) into structured session data that powers belt-adaptive STATS modules.

### The Challenge

Users provide natural language like:
> "Worked on kimura today from closed guard. Got tapped twice by triangles rolling with Jake. Felt pretty good overall but my shoulder is still sore."

We need to extract:
```json
{
  "techniquesDrilled": ["Kimura"],
  "positions": ["Closed Guard"],
  "submissionsReceived": ["Triangle", "Triangle"],
  "partners": ["Jake"],
  "sentiment": "positive",
  "injuryMentions": [{ "bodyPart": "shoulder", "status": "ongoing" }]
}
```

### Design Principles

1. **Optimize for recall over precision** - Better to extract too much and let users correct than miss data
2. **BJJ-specific vocabulary** - Standard NLP fails on "got swept" or "hit a kimura"
3. **Context-aware parsing** - "Triangle" in "got caught in a triangle" ≠ drilling triangles
4. **Graceful degradation** - Low-confidence extractions prompt user confirmation
5. **Privacy-first** - All processing can run on-device; server optional

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           INPUT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Voice Recording              Text Entry              Quick Log         │
│        │                           │                       │             │
│        ▼                           │                       │             │
│   ┌──────────────┐                 │                       │             │
│   │ AssemblyAI   │                 │                       │             │
│   │ Transcription│                 │                       │             │
│   │ + Custom     │                 │                       │             │
│   │ Vocabulary   │                 │                       │             │
│   └──────┬───────┘                 │                       │             │
│          │                         │                       │             │
│          ▼                         ▼                       ▼             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    RAW TEXT (normalized)                         │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
└────────────────────────────────────┼─────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXTRACTION LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│   │  Technique   │  │  Submission  │  │   Position   │                 │
│   │  Extractor   │  │   Parser     │  │   Detector   │                 │
│   └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│   │   Partner    │  │  Quantity/   │  │  Sentiment   │                 │
│   │  Extractor   │  │  Duration    │  │  Analyzer    │                 │
│   └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                          │
│   ┌──────────────┐                                                      │
│   │   Injury     │                                                      │
│   │  Detector    │                                                      │
│   └──────────────┘                                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CONFIDENCE & MERGE LAYER                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. Score each extraction (0.0 - 1.0)                                  │
│   2. Resolve conflicts (same technique different positions)             │
│   3. Merge overlapping entities                                         │
│   4. Flag low-confidence items for user review                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          OUTPUT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   SessionExtractionResult {                                             │
│     techniquesDrilled: TechniqueExtraction[],                           │
│     submissionsGiven: SubmissionExtraction[],                           │
│     submissionsReceived: SubmissionExtraction[],                        │
│     positions: PositionExtraction[],                                    │
│     partners: PartnerExtraction[],                                      │
│     duration: DurationExtraction | null,                                │
│     sparringRounds: number | null,                                      │
│     sentiment: SentimentResult,                                         │
│     injuries: InjuryExtraction[],                                       │
│     lowConfidenceItems: LowConfidenceItem[],                            │
│     rawText: string                                                     │
│   }                                                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Input Types & Preprocessing

### Input Sources

| Source | Format | Preprocessing |
|--------|--------|---------------|
| Voice transcript | Raw text from AssemblyAI | Lowercase, normalize whitespace |
| Text entry | User-typed text | Lowercase, normalize whitespace |
| Quick log fields | Structured (technique chips, toggles) | Pass through (already structured) |

### Text Normalization

```typescript
function normalizeInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/[""]/g, '"')          // Normalize quotes
    .replace(/['']/g, "'")          // Normalize apostrophes
    .replace(/\.{2,}/g, '.')        // Normalize ellipsis
    .trim();
}
```

### Sentence Segmentation

Split on:
- Period followed by space
- Question mark
- Exclamation mark
- Long pauses in voice (indicated by `...` or `[pause]` from transcription)

---

## Entity Extraction Rules

### 1. Technique Extraction

**Goal:** Identify BJJ techniques mentioned and match to canonical technique library.

#### 1.1 Technique Vocabulary

```typescript
const TECHNIQUE_SYNONYMS: Record<string, string> = {
  // Submissions - Chokes
  'rnc': 'Rear Naked Choke',
  'rear naked': 'Rear Naked Choke',
  'mata leão': 'Rear Naked Choke',
  'mata leao': 'Rear Naked Choke',
  'bow and arrow': 'Bow and Arrow Choke',
  'bow & arrow': 'Bow and Arrow Choke',
  'cross collar': 'Cross Collar Choke',
  'x choke': 'Cross Collar Choke',
  'ezekiel': 'Ezekiel Choke',
  'zeke': 'Ezekiel Choke',
  'guillotine': 'Guillotine',
  'gillie': 'Guillotine',
  'darce': "D'Arce Choke",
  "d'arce": "D'Arce Choke",
  'anaconda': 'Anaconda Choke',
  'arm triangle': 'Arm Triangle',
  'head and arm': 'Arm Triangle',
  'kata gatame': 'Arm Triangle',
  'north south choke': 'North South Choke',
  'paper cutter': 'Paper Cutter Choke',
  'baseball bat': 'Baseball Bat Choke',
  'loop choke': 'Loop Choke',
  'clock choke': 'Clock Choke',
  'brabo': 'Brabo Choke',

  // Submissions - Arm Locks
  'armbar': 'Armbar',
  'arm bar': 'Armbar',
  'juji gatame': 'Armbar',
  'straight armbar': 'Armbar',
  'kimura': 'Kimura',
  'double wristlock': 'Kimura',
  'chicken wing': 'Kimura',
  'americana': 'Americana',
  'keylock': 'Americana',
  'v armlock': 'Americana',
  'omoplata': 'Omoplata',
  'omo': 'Omoplata',
  'wrist lock': 'Wrist Lock',
  'wristlock': 'Wrist Lock',

  // Submissions - Leg Locks
  'heel hook': 'Heel Hook',
  'inside heel hook': 'Inside Heel Hook',
  'outside heel hook': 'Outside Heel Hook',
  'knee bar': 'Knee Bar',
  'kneebar': 'Knee Bar',
  'toe hold': 'Toe Hold',
  'toehold': 'Toe Hold',
  'calf slicer': 'Calf Slicer',
  'calf crush': 'Calf Slicer',
  'straight ankle': 'Straight Ankle Lock',
  'ankle lock': 'Straight Ankle Lock',
  'achilles lock': 'Straight Ankle Lock',
  'estima lock': 'Estima Lock',

  // Sweeps
  'scissor sweep': 'Scissor Sweep',
  'hip bump': 'Hip Bump Sweep',
  'hip bump sweep': 'Hip Bump Sweep',
  'flower sweep': 'Flower Sweep',
  'pendulum sweep': 'Pendulum Sweep',
  'elevator sweep': 'Elevator Sweep',
  'hook sweep': 'Hook Sweep',
  'butterfly sweep': 'Butterfly Sweep',
  'sickle sweep': 'Sickle Sweep',
  'tripod sweep': 'Tripod Sweep',
  'lumberjack sweep': 'Lumberjack Sweep',
  'dummy sweep': 'Dummy Sweep',
  'balloon sweep': 'Balloon Sweep',
  'waiter sweep': 'Waiter Sweep',
  'old school sweep': 'Old School Sweep',
  'electric chair': 'Electric Chair Sweep',

  // Guard Passes
  'knee cut': 'Knee Cut Pass',
  'knee slice': 'Knee Cut Pass',
  'knee slide': 'Knee Cut Pass',
  'toreando': 'Toreando Pass',
  'toreano': 'Toreando Pass',
  'bullfighter': 'Toreando Pass',
  'stack pass': 'Stack Pass',
  'smash pass': 'Smash Pass',
  'over under': 'Over Under Pass',
  'over-under': 'Over Under Pass',
  'leg drag': 'Leg Drag Pass',
  'x pass': 'X Pass',
  'double under': 'Double Under Pass',
  'single under': 'Single Under Pass',
  'leg weave': 'Leg Weave Pass',
  'body lock pass': 'Body Lock Pass',
  'pressure pass': 'Pressure Pass',
  'long step': 'Long Step Pass',

  // Escapes
  'hip escape': 'Hip Escape',
  'shrimp': 'Hip Escape',
  'shrimping': 'Hip Escape',
  'elbow escape': 'Elbow Knee Escape',
  'elbow knee': 'Elbow Knee Escape',
  'upa': 'Bridge Escape',
  'bridge escape': 'Bridge Escape',
  'trap and roll': 'Bridge Escape',
  'technical standup': 'Technical Stand Up',
  'tech standup': 'Technical Stand Up',
  'back escape': 'Back Escape',
  'side control escape': 'Side Control Escape',
  'mount escape': 'Mount Escape',

  // Takedowns
  'double leg': 'Double Leg Takedown',
  'single leg': 'Single Leg Takedown',
  'ankle pick': 'Ankle Pick',
  'arm drag': 'Arm Drag',
  'snap down': 'Snap Down',
  'duck under': 'Duck Under',
  'fireman carry': "Fireman's Carry",
  "fireman's carry": "Fireman's Carry",
  'o goshi': 'O Goshi',
  'ogoshi': 'O Goshi',
  'hip throw': 'Hip Throw',
  'foot sweep': 'Foot Sweep',
  'osoto gari': 'Osoto Gari',
  'uchi mata': 'Uchi Mata',
  'seoi nage': 'Seoi Nage',
  'drop seoi': 'Drop Seoi Nage',
  'harai goshi': 'Harai Goshi',

  // Guard Types (when mentioned as technique focus)
  'closed guard': 'Closed Guard',
  'open guard': 'Open Guard',
  'half guard': 'Half Guard',
  'butterfly guard': 'Butterfly Guard',
  'spider guard': 'Spider Guard',
  'lasso guard': 'Lasso Guard',
  'de la riva': 'De La Riva Guard',
  'dlr': 'De La Riva Guard',
  'reverse de la riva': 'Reverse De La Riva',
  'rdlr': 'Reverse De La Riva',
  'x guard': 'X Guard',
  'single leg x': 'Single Leg X',
  'slx': 'Single Leg X',
  'deep half': 'Deep Half Guard',
  'rubber guard': 'Rubber Guard',
  'worm guard': 'Worm Guard',
  'lapel guard': 'Lapel Guard',
  '50/50': 'Fifty-Fifty',
  'fifty fifty': 'Fifty-Fifty',
  'saddle': 'Saddle Position',
  'ashi garami': 'Ashi Garami',
  'inside sankaku': 'Inside Sankaku',
  'outside sankaku': 'Outside Sankaku',
  '411': 'Inside Sankaku',
  'honeyhole': 'Inside Sankaku',

  // Transitions & Movements
  'berimbolo': 'Berimbolo',
  'kiss of the dragon': 'Kiss of the Dragon',
  'granby roll': 'Granby Roll',
  'inversion': 'Inversion',
  'back take': 'Back Take',
  'taking the back': 'Back Take',
  'mount transition': 'Mount Transition',
  'knee on belly': 'Knee on Belly',
  'kob': 'Knee on Belly',
  'north south': 'North South Position',
};
```

#### 1.2 Technique Extraction Algorithm

```typescript
interface TechniqueExtraction {
  canonical: string;        // Matched technique name
  originalText: string;     // What user actually said
  context: 'drilled' | 'attempted' | 'landed' | 'received' | 'mentioned';
  position?: string;        // Associated position if detected
  confidence: number;       // 0.0 - 1.0
}

function extractTechniques(text: string): TechniqueExtraction[] {
  const results: TechniqueExtraction[] = [];
  const normalizedText = normalizeInput(text);

  // Step 1: Direct synonym matching (highest confidence)
  for (const [synonym, canonical] of Object.entries(TECHNIQUE_SYNONYMS)) {
    const regex = new RegExp(`\\b${escapeRegex(synonym)}\\b`, 'gi');
    const matches = normalizedText.matchAll(regex);

    for (const match of matches) {
      const context = detectTechniqueContext(normalizedText, match.index);
      results.push({
        canonical,
        originalText: match[0],
        context,
        confidence: 0.95,
      });
    }
  }

  // Step 2: Fuzzy matching for misspellings (lower confidence)
  // Use Levenshtein distance or similar
  const unmatched = findUnmatchedNounsAndVerbs(normalizedText);
  for (const word of unmatched) {
    const fuzzyMatch = fuzzyMatchTechnique(word, TECHNIQUE_SYNONYMS);
    if (fuzzyMatch && fuzzyMatch.distance <= 2) {
      results.push({
        canonical: fuzzyMatch.canonical,
        originalText: word,
        context: 'mentioned',
        confidence: 0.70 - (fuzzyMatch.distance * 0.1),
      });
    }
  }

  // Step 3: Deduplicate (same technique mentioned multiple times)
  return deduplicateExtractions(results);
}
```

#### 1.3 Technique Context Detection

```typescript
const DRILLING_INDICATORS = [
  'worked on', 'drilled', 'practiced', 'focused on', 'repped',
  'went over', 'learned', 'reviewed', 'trained', 'did some'
];

const LANDED_INDICATORS = [
  'hit', 'got', 'landed', 'finished', 'caught them', 'submitted',
  'swept them', 'passed', 'took their back', 'mounted'
];

const RECEIVED_INDICATORS = [
  'got caught', 'tapped to', 'got swept', 'got passed', 'got submitted',
  'caught me', 'tapped me', 'got me with', 'fell for'
];

const ATTEMPTED_INDICATORS = [
  'tried', 'attempted', 'went for', 'almost', 'nearly', 'couldn\'t finish'
];

function detectTechniqueContext(
  text: string,
  techniqueIndex: number
): 'drilled' | 'attempted' | 'landed' | 'received' | 'mentioned' {
  // Look at surrounding 50 characters
  const windowStart = Math.max(0, techniqueIndex - 50);
  const windowEnd = Math.min(text.length, techniqueIndex + 50);
  const window = text.substring(windowStart, windowEnd).toLowerCase();

  if (RECEIVED_INDICATORS.some(ind => window.includes(ind))) {
    return 'received';
  }
  if (LANDED_INDICATORS.some(ind => window.includes(ind))) {
    return 'landed';
  }
  if (ATTEMPTED_INDICATORS.some(ind => window.includes(ind))) {
    return 'attempted';
  }
  if (DRILLING_INDICATORS.some(ind => window.includes(ind))) {
    return 'drilled';
  }

  return 'mentioned';
}
```

---

### 2. Submission Parsing

**Goal:** Distinguish between submissions given (offensive success) and submissions received (defensive failure).

#### 2.1 Submission Direction Detection

```typescript
interface SubmissionExtraction {
  technique: string;
  direction: 'given' | 'received';
  count: number;
  partner?: string;
  confidence: number;
}

const SUBMISSION_GIVEN_PATTERNS = [
  /(?:i\s+)?(?:hit|got|landed|finished|caught|submitted|tapped)\s+(?:\w+\s+)?(?:with\s+)?(?:a\s+)?(\w+)/gi,
  /(\w+)\s+(?:worked|connected|landed)/gi,
  /tapped\s+(?:\w+\s+)?(?:out\s+)?(?:with\s+)?(?:a\s+)?(\w+)/gi,
];

const SUBMISSION_RECEIVED_PATTERNS = [
  /(?:got\s+)?(?:caught|tapped|submitted|finished)\s+(?:by|with|in)\s+(?:a\s+)?(\w+)/gi,
  /(?:tapped\s+)?(?:to|from)\s+(?:a\s+)?(\w+)/gi,
  /(\w+)\s+(?:got|caught)\s+me/gi,
  /fell\s+for\s+(?:a\s+)?(\w+)/gi,
];

function extractSubmissions(text: string): SubmissionExtraction[] {
  const results: SubmissionExtraction[] = [];
  const normalizedText = normalizeInput(text);

  // Check for explicit counts: "got tapped twice", "hit 3 armbars"
  const countPatterns = [
    /(?:got\s+)?(?:tapped|caught|submitted)\s+(\w+)\s+times?/gi,
    /(\d+)\s+(\w+)s?\s+(?:today|this session)/gi,
  ];

  // Parse with direction detection
  for (const pattern of SUBMISSION_GIVEN_PATTERNS) {
    const matches = normalizedText.matchAll(pattern);
    for (const match of matches) {
      const technique = matchToCanonicalSubmission(match[1]);
      if (technique) {
        results.push({
          technique,
          direction: 'given',
          count: extractCountFromContext(normalizedText, match.index) || 1,
          confidence: 0.85,
        });
      }
    }
  }

  for (const pattern of SUBMISSION_RECEIVED_PATTERNS) {
    const matches = normalizedText.matchAll(pattern);
    for (const match of matches) {
      const technique = matchToCanonicalSubmission(match[1]);
      if (technique) {
        results.push({
          technique,
          direction: 'received',
          count: extractCountFromContext(normalizedText, match.index) || 1,
          confidence: 0.85,
        });
      }
    }
  }

  return results;
}
```

#### 2.2 Count Extraction

```typescript
const COUNT_WORDS: Record<string, number> = {
  'once': 1, 'one': 1, 'a': 1, 'single': 1,
  'twice': 2, 'two': 2, 'couple': 2,
  'three': 3, 'thrice': 3,
  'four': 4, 'five': 5, 'six': 6,
  'several': 3, 'few': 2, 'many': 4, 'bunch': 4,
};

function extractCountFromContext(text: string, index: number): number | null {
  const window = text.substring(Math.max(0, index - 30), index + 30);

  // Check for numeric digits
  const digitMatch = window.match(/(\d+)\s*times?/i);
  if (digitMatch) {
    return parseInt(digitMatch[1], 10);
  }

  // Check for count words
  for (const [word, count] of Object.entries(COUNT_WORDS)) {
    if (window.includes(word)) {
      return count;
    }
  }

  return null;
}
```

---

### 3. Position Detection

**Goal:** Identify BJJ positions mentioned (guard, mount, side control, etc.)

#### 3.1 Position Vocabulary

```typescript
const POSITIONS: Record<string, string> = {
  // Top positions
  'mount': 'Mount',
  'full mount': 'Mount',
  'mounted': 'Mount',
  'side control': 'Side Control',
  'side mount': 'Side Control',
  'cross side': 'Side Control',
  'hundred kilos': 'Side Control',
  'knee on belly': 'Knee on Belly',
  'knee on chest': 'Knee on Belly',
  'kob': 'Knee on Belly',
  'north south': 'North South',
  'n/s': 'North South',
  'back control': 'Back Control',
  'back mount': 'Back Control',
  'rear mount': 'Back Control',
  'back': 'Back Control',
  'turtle': 'Turtle',
  'crucifix': 'Crucifix',

  // Guard positions
  'closed guard': 'Closed Guard',
  'full guard': 'Closed Guard',
  'open guard': 'Open Guard',
  'half guard': 'Half Guard',
  'bottom half': 'Half Guard',
  'top half': 'Half Guard Top',
  'butterfly': 'Butterfly Guard',
  'spider': 'Spider Guard',
  'lasso': 'Lasso Guard',
  'de la riva': 'De La Riva',
  'dlr': 'De La Riva',
  'x guard': 'X Guard',
  'single leg x': 'Single Leg X',
  'deep half': 'Deep Half Guard',
  'z guard': 'Z Guard',
  'knee shield': 'Knee Shield',
  '50/50': 'Fifty-Fifty',
  'fifty fifty': 'Fifty-Fifty',

  // Leg entanglements
  'ashi': 'Ashi Garami',
  'ashi garami': 'Ashi Garami',
  'saddle': 'Inside Sankaku',
  'inside sankaku': 'Inside Sankaku',
  '411': 'Inside Sankaku',
  'outside ashi': 'Outside Ashi',
  'irimi ashi': 'Cross Ashi',

  // Neutral
  'standing': 'Standing',
  'clinch': 'Clinch',
  'over under clinch': 'Over Under Clinch',
};

const POSITION_CONTEXTS: Record<string, 'top' | 'bottom' | 'neutral'> = {
  'Mount': 'top',
  'Side Control': 'top',
  'Knee on Belly': 'top',
  'North South': 'top',
  'Back Control': 'top',
  'Closed Guard': 'bottom',
  'Open Guard': 'bottom',
  'Half Guard': 'bottom', // Can be top but usually bottom
  'Butterfly Guard': 'bottom',
  'Spider Guard': 'bottom',
  'De La Riva': 'bottom',
  'Standing': 'neutral',
  'Clinch': 'neutral',
};
```

#### 3.2 Position Extraction

```typescript
interface PositionExtraction {
  position: string;
  context: 'top' | 'bottom' | 'neutral' | 'unknown';
  role: 'playing' | 'passing' | 'escaping' | 'attacking' | 'mentioned';
  confidence: number;
}

function extractPositions(text: string): PositionExtraction[] {
  const results: PositionExtraction[] = [];
  const normalizedText = normalizeInput(text);

  for (const [phrase, canonical] of Object.entries(POSITIONS)) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      const role = detectPositionRole(normalizedText, phrase);
      results.push({
        position: canonical,
        context: POSITION_CONTEXTS[canonical] || 'unknown',
        role,
        confidence: 0.90,
      });
    }
  }

  return deduplicatePositions(results);
}

function detectPositionRole(
  text: string,
  position: string
): 'playing' | 'passing' | 'escaping' | 'attacking' | 'mentioned' {
  const passingIndicators = ['passing', 'passed', 'pass'];
  const escapingIndicators = ['escape', 'escaping', 'got out', 'survived'];
  const playingIndicators = ['playing', 'working', 'from', 'in my'];
  const attackingIndicators = ['attacking', 'submitted', 'finished', 'sweep'];

  const surroundingText = extractSurroundingText(text, position, 40);

  if (passingIndicators.some(ind => surroundingText.includes(ind))) return 'passing';
  if (escapingIndicators.some(ind => surroundingText.includes(ind))) return 'escaping';
  if (playingIndicators.some(ind => surroundingText.includes(ind))) return 'playing';
  if (attackingIndicators.some(ind => surroundingText.includes(ind))) return 'attacking';

  return 'mentioned';
}
```

---

### 4. Partner Extraction

**Goal:** Identify training partner names mentioned.

#### 4.1 Partner Detection Rules

```typescript
interface PartnerExtraction {
  name: string;
  context: 'rolled_with' | 'drilled_with' | 'mentioned';
  confidence: number;
}

const PARTNER_PATTERNS = [
  /(?:rolled|sparred|trained|drilled|worked)\s+with\s+(\w+)/gi,
  /(?:against|vs\.?|versus)\s+(\w+)/gi,
  /(\w+)\s+(?:tapped|caught|submitted|swept)\s+me/gi,
  /(?:tapped|caught|submitted|swept)\s+(\w+)/gi,
];

const EXCLUDED_PARTNER_WORDS = new Set([
  // BJJ terms that look like names
  'guard', 'mount', 'side', 'back', 'half', 'full', 'closed', 'open',
  'kimura', 'americana', 'armbar', 'triangle', 'guillotine',
  // Common false positives
  'today', 'everyone', 'someone', 'nobody', 'people', 'guys',
  'class', 'session', 'training', 'drilling', 'sparring',
]);

function extractPartners(text: string): PartnerExtraction[] {
  const results: PartnerExtraction[] = [];
  const normalizedText = normalizeInput(text);

  for (const pattern of PARTNER_PATTERNS) {
    const matches = normalizedText.matchAll(pattern);
    for (const match of matches) {
      const potentialName = match[1];

      // Filter out non-names
      if (EXCLUDED_PARTNER_WORDS.has(potentialName.toLowerCase())) {
        continue;
      }

      // Names typically start with capital (check original text)
      const originalIndex = text.toLowerCase().indexOf(potentialName.toLowerCase());
      const originalWord = text.substring(originalIndex, originalIndex + potentialName.length);
      const looksLikeName = /^[A-Z]/.test(originalWord);

      results.push({
        name: potentialName,
        context: detectPartnerContext(normalizedText, match.index),
        confidence: looksLikeName ? 0.85 : 0.60,
      });
    }
  }

  return deduplicatePartners(results);
}
```

---

### 5. Duration/Quantity Parsing

**Goal:** Extract session duration, round counts, and other numeric data.

```typescript
interface DurationExtraction {
  minutes: number;
  confidence: number;
}

interface RoundCountExtraction {
  count: number;
  context: 'sparring' | 'drilling' | 'total';
  confidence: number;
}

const DURATION_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\s*(?:and\s+)?(\d+)?\s*(?:minutes?|mins?|m)?/gi,
  /(\d+)\s*(?:minutes?|mins?|m)(?:\s+session)?/gi,
  /(?:trained|trained for|session was|class was)\s*(\d+)\s*(?:minutes?|mins?|m|hours?|hrs?)/gi,
];

const ROUND_PATTERNS = [
  /(\d+)\s*rounds?/gi,
  /(?:rolled|sparred)\s*(\d+)\s*times?/gi,
  /(\d+)\s*(?:5|6|7|8)\s*(?:minute)?\s*rounds?/gi,
];

function extractDuration(text: string): DurationExtraction | null {
  const normalizedText = normalizeInput(text);

  for (const pattern of DURATION_PATTERNS) {
    const match = pattern.exec(normalizedText);
    if (match) {
      let minutes = 0;

      if (match[0].includes('hour') || match[0].includes('hr')) {
        minutes = parseFloat(match[1]) * 60;
        if (match[2]) {
          minutes += parseInt(match[2], 10);
        }
      } else {
        minutes = parseInt(match[1], 10);
      }

      // Sanity check: BJJ sessions are typically 60-180 minutes
      if (minutes >= 30 && minutes <= 240) {
        return { minutes, confidence: 0.90 };
      }
    }
  }

  return null;
}

function extractRoundCount(text: string): RoundCountExtraction | null {
  const normalizedText = normalizeInput(text);

  for (const pattern of ROUND_PATTERNS) {
    const match = pattern.exec(normalizedText);
    if (match) {
      const count = parseInt(match[1], 10);

      // Sanity check: typically 3-15 rounds per session
      if (count >= 1 && count <= 20) {
        return {
          count,
          context: 'sparring',
          confidence: 0.85,
        };
      }
    }
  }

  return null;
}
```

---

### 6. Sentiment Analysis

**Goal:** Detect emotional tone for Blues Detector and risk assessment.

#### 6.1 Sentiment Vocabulary

```typescript
const SENTIMENT_KEYWORDS = {
  positive: {
    strong: [
      'breakthrough', 'clicked', 'finally got', 'amazing', 'best session',
      'proud', 'excited', 'love', 'awesome', 'great day', 'crushed it',
      'felt great', 'on fire', 'in the zone', 'flow state'
    ],
    moderate: [
      'good', 'nice', 'solid', 'better', 'improving', 'progress',
      'enjoyed', 'fun', 'productive', 'learned', 'figured out'
    ],
  },
  negative: {
    strong: [
      'terrible', 'awful', 'worst', 'hate', 'quit', 'giving up',
      'impostor', 'imposter', 'fake', 'don\'t belong', 'waste of time',
      'can\'t do this', 'never getting better', 'stuck forever'
    ],
    moderate: [
      'frustrated', 'struggling', 'hard', 'tough', 'rough', 'sucked',
      'bad day', 'off', 'tired', 'exhausted', 'sore', 'disappointed',
      'confused', 'lost', 'overwhelmed'
    ],
  },
  neutral: [
    'okay', 'fine', 'normal', 'regular', 'standard', 'typical', 'usual'
  ],
};

const RISK_SIGNAL_PHRASES = [
  'thinking about quitting',
  'not sure if i should continue',
  'maybe this isn\'t for me',
  'waste of time',
  'never going to get',
  'everyone is better',
  'too old for this',
  'body can\'t handle',
  'don\'t have time',
  'too expensive',
];
```

#### 6.2 Sentiment Analysis Algorithm

```typescript
interface SentimentResult {
  overall: 'positive' | 'negative' | 'neutral' | 'mixed';
  score: number;  // -1.0 to 1.0
  positiveKeywords: string[];
  negativeKeywords: string[];
  riskSignals: string[];
  confidence: number;
}

function analyzeSentiment(text: string): SentimentResult {
  const normalizedText = normalizeInput(text);

  let positiveScore = 0;
  let negativeScore = 0;
  const positiveKeywords: string[] = [];
  const negativeKeywords: string[] = [];
  const riskSignals: string[] = [];

  // Check positive keywords
  for (const keyword of SENTIMENT_KEYWORDS.positive.strong) {
    if (normalizedText.includes(keyword)) {
      positiveScore += 2;
      positiveKeywords.push(keyword);
    }
  }
  for (const keyword of SENTIMENT_KEYWORDS.positive.moderate) {
    if (normalizedText.includes(keyword)) {
      positiveScore += 1;
      positiveKeywords.push(keyword);
    }
  }

  // Check negative keywords
  for (const keyword of SENTIMENT_KEYWORDS.negative.strong) {
    if (normalizedText.includes(keyword)) {
      negativeScore += 2;
      negativeKeywords.push(keyword);
    }
  }
  for (const keyword of SENTIMENT_KEYWORDS.negative.moderate) {
    if (normalizedText.includes(keyword)) {
      negativeScore += 1;
      negativeKeywords.push(keyword);
    }
  }

  // Check risk signals
  for (const phrase of RISK_SIGNAL_PHRASES) {
    if (normalizedText.includes(phrase)) {
      riskSignals.push(phrase);
      negativeScore += 3;  // Risk signals are heavily weighted
    }
  }

  // Calculate overall sentiment
  const totalScore = positiveScore + negativeScore;
  const normalizedScore = totalScore === 0
    ? 0
    : (positiveScore - negativeScore) / totalScore;

  let overall: 'positive' | 'negative' | 'neutral' | 'mixed';
  if (positiveScore > 0 && negativeScore > 0) {
    overall = Math.abs(normalizedScore) < 0.3 ? 'mixed' : (normalizedScore > 0 ? 'positive' : 'negative');
  } else if (positiveScore > 0) {
    overall = 'positive';
  } else if (negativeScore > 0) {
    overall = 'negative';
  } else {
    overall = 'neutral';
  }

  return {
    overall,
    score: normalizedScore,
    positiveKeywords,
    negativeKeywords,
    riskSignals,
    confidence: totalScore > 0 ? Math.min(0.95, 0.5 + (totalScore * 0.1)) : 0.5,
  };
}
```

---

### 7. Injury Detection

**Goal:** Identify mentions of injuries, soreness, or physical issues.

```typescript
interface InjuryExtraction {
  bodyPart: string;
  type: 'injury' | 'soreness' | 'pain' | 'tweak';
  status: 'new' | 'ongoing' | 'recovering' | 'mentioned';
  confidence: number;
}

const BODY_PARTS = [
  'neck', 'shoulder', 'elbow', 'wrist', 'hand', 'finger', 'thumb',
  'back', 'spine', 'rib', 'hip', 'knee', 'ankle', 'foot', 'toe',
  'groin', 'hamstring', 'quad', 'calf', 'arm', 'leg',
];

const INJURY_INDICATORS = {
  injury: ['injured', 'hurt', 'broke', 'torn', 'popped', 'dislocated'],
  soreness: ['sore', 'tight', 'stiff', 'aching'],
  pain: ['pain', 'painful', 'hurts', 'killing me'],
  tweak: ['tweaked', 'twinge', 'aggravated', 'flared up'],
};

const INJURY_STATUS_INDICATORS = {
  new: ['just', 'today', 'happened', 'new'],
  ongoing: ['still', 'again', 'keeps', 'always', 'chronic'],
  recovering: ['better', 'healing', 'recovering', 'improving', 'almost'],
};

function extractInjuries(text: string): InjuryExtraction[] {
  const results: InjuryExtraction[] = [];
  const normalizedText = normalizeInput(text);

  for (const bodyPart of BODY_PARTS) {
    const bodyPartRegex = new RegExp(`\\b${bodyPart}\\b`, 'gi');
    if (!bodyPartRegex.test(normalizedText)) continue;

    // Check for injury indicators near body part mention
    const surroundingText = extractSurroundingText(normalizedText, bodyPart, 40);

    for (const [type, indicators] of Object.entries(INJURY_INDICATORS)) {
      for (const indicator of indicators) {
        if (surroundingText.includes(indicator)) {
          results.push({
            bodyPart,
            type: type as InjuryExtraction['type'],
            status: detectInjuryStatus(surroundingText),
            confidence: 0.80,
          });
          break;
        }
      }
    }
  }

  return deduplicateInjuries(results);
}

function detectInjuryStatus(text: string): InjuryExtraction['status'] {
  for (const [status, indicators] of Object.entries(INJURY_STATUS_INDICATORS)) {
    for (const indicator of indicators) {
      if (text.includes(indicator)) {
        return status as InjuryExtraction['status'];
      }
    }
  }
  return 'mentioned';
}
```

---

## Confidence Scoring

### Confidence Thresholds

| Confidence Range | Action | UI Treatment |
|------------------|--------|--------------|
| **0.90 - 1.00** | Auto-accept | Show in review, no highlight |
| **0.70 - 0.89** | Accept with flag | Show with subtle indicator |
| **0.50 - 0.69** | Prompt user | "Did you mean...?" confirmation |
| **0.00 - 0.49** | Exclude | Don't show, store in raw transcript |

### Confidence Factors

```typescript
function calculateConfidence(extraction: BaseExtraction): number {
  let confidence = extraction.baseConfidence;

  // Boost for exact vocabulary match
  if (extraction.matchType === 'exact') {
    confidence += 0.10;
  }

  // Reduce for fuzzy match
  if (extraction.matchType === 'fuzzy') {
    confidence -= 0.15;
  }

  // Boost for context confirmation
  if (extraction.contextConfirmed) {
    confidence += 0.05;
  }

  // Reduce for ambiguous context
  if (extraction.ambiguousContext) {
    confidence -= 0.10;
  }

  // Clamp to valid range
  return Math.max(0, Math.min(1, confidence));
}
```

---

## Output Schema

### Complete Extraction Result

```typescript
interface SessionExtractionResult {
  // Session metadata (from context, not extraction)
  sessionId: string;
  extractionTimestamp: string;

  // Extracted entities
  techniquesDrilled: TechniqueExtraction[];
  submissionsGiven: SubmissionExtraction[];
  submissionsReceived: SubmissionExtraction[];
  positions: PositionExtraction[];
  partners: PartnerExtraction[];

  // Parsed quantities
  duration: DurationExtraction | null;
  sparringRounds: RoundCountExtraction | null;

  // Analysis results
  sentiment: SentimentResult;
  injuries: InjuryExtraction[];

  // Quality indicators
  overallConfidence: number;
  lowConfidenceItems: LowConfidenceItem[];

  // Original input
  rawText: string;
  inputType: 'voice' | 'text' | 'quick_log';
}

interface LowConfidenceItem {
  type: 'technique' | 'submission' | 'position' | 'partner' | 'duration';
  extractedValue: string;
  confidence: number;
  suggestion: string;  // "Did you mean {X}?"
  alternatives: string[];
}
```

### Mapping to Session Data Model

```typescript
// After user confirms/corrects, map to SessionData
function mapToSessionData(
  extraction: SessionExtractionResult,
  userCorrections: UserCorrection[]
): Partial<SessionData> {
  return {
    techniquesDrilled: extraction.techniquesDrilled
      .filter(t => t.context === 'drilled')
      .map(t => t.canonical),

    submissionsGiven: extraction.submissionsGiven
      .flatMap(s => Array(s.count).fill(s.technique)),

    submissionsReceived: extraction.submissionsReceived
      .flatMap(s => Array(s.count).fill(s.technique)),

    workedWell: extraction.techniquesDrilled
      .filter(t => t.context === 'landed')
      .map(t => t.canonical),

    struggles: extraction.positions
      .filter(p => p.role === 'escaping')
      .map(p => p.position),

    sparringRounds: extraction.sparringRounds?.count ?? undefined,
    durationMinutes: extraction.duration?.minutes ?? undefined,

    // Store sentiment for Blues Detector
    _sentiment: extraction.sentiment,
    _riskSignals: extraction.sentiment.riskSignals,
  };
}
```

---

## Fallback Behaviors

### When Extraction Fails

| Scenario | Fallback Behavior |
|----------|-------------------|
| No techniques detected | Show empty list, allow manual entry |
| Ambiguous submission direction | Default to "mentioned", prompt user |
| Unknown duration | Leave blank, use session default |
| Partner name looks wrong | Show with low confidence highlight |
| Completely garbled input | Store raw text, show "We couldn't parse this session" |

### Minimum Viable Extraction

Even if extraction fails, always capture:
1. Raw text (for manual review)
2. Timestamp
3. Any high-confidence entities (>0.90)

---

## Example Extractions

### Example 1: Typical Voice Entry

**Input:**
> "Pretty good session today. Worked on armbars from closed guard for drilling. Did about 5 rounds of sparring, got caught with a triangle once but hit a couple kimuras. Rolled with Jake and Marcus."

**Extraction:**
```json
{
  "techniquesDrilled": [
    { "canonical": "Armbar", "context": "drilled", "confidence": 0.95 }
  ],
  "positions": [
    { "position": "Closed Guard", "role": "playing", "confidence": 0.92 }
  ],
  "submissionsGiven": [
    { "technique": "Kimura", "count": 2, "confidence": 0.85 }
  ],
  "submissionsReceived": [
    { "technique": "Triangle", "count": 1, "confidence": 0.88 }
  ],
  "partners": [
    { "name": "Jake", "confidence": 0.82 },
    { "name": "Marcus", "confidence": 0.82 }
  ],
  "sparringRounds": { "count": 5, "confidence": 0.90 },
  "sentiment": { "overall": "positive", "score": 0.6 },
  "overallConfidence": 0.87
}
```

### Example 2: Frustrated User (Blues Detector Trigger)

**Input:**
> "Terrible day. Got smashed by everyone, even the new white belts. Starting to think I don't belong here. Maybe BJJ isn't for me."

**Extraction:**
```json
{
  "techniquesDrilled": [],
  "submissionsGiven": [],
  "submissionsReceived": [],
  "sentiment": {
    "overall": "negative",
    "score": -0.85,
    "negativeKeywords": ["terrible", "smashed", "don't belong"],
    "riskSignals": ["maybe this isn't for me", "don't belong"]
  },
  "overallConfidence": 0.78
}
```

### Example 3: Brief Text Entry

**Input:**
> "Knee cut passing and half guard sweeps. 90 min, 6 rounds."

**Extraction:**
```json
{
  "techniquesDrilled": [
    { "canonical": "Knee Cut Pass", "context": "drilled", "confidence": 0.95 },
    { "canonical": "Half Guard", "context": "mentioned", "confidence": 0.88 }
  ],
  "duration": { "minutes": 90, "confidence": 0.92 },
  "sparringRounds": { "count": 6, "confidence": 0.90 },
  "sentiment": { "overall": "neutral", "score": 0 },
  "overallConfidence": 0.91
}
```

---

## Implementation Options

### Option A: Rule-Based (Recommended for MVP)

**Approach:** Pattern matching, keyword detection, regular expressions
**Pros:** Fast, predictable, no API costs, works offline
**Cons:** Less flexible, needs vocabulary maintenance
**Estimated Effort:** 2-3 weeks

### Option B: LLM-Enhanced

**Approach:** Use Claude/GPT for entity extraction with structured prompts
**Pros:** Handles edge cases, understands context, minimal vocabulary maintenance
**Cons:** API costs (~$0.01-0.05 per extraction), latency, requires connectivity
**Estimated Effort:** 1-2 weeks + ongoing API costs

### Option C: Hybrid (Recommended for v1.1+)

**Approach:** Rule-based for high-confidence patterns, LLM fallback for ambiguous cases
**Pros:** Best of both worlds, cost-effective
**Cons:** More complex architecture
**Estimated Effort:** 3-4 weeks

### Recommendation

**MVP:** Start with Option A (rule-based). The vocabulary is finite and well-defined for BJJ.

**v1.1:** Add Option B as fallback for low-confidence extractions.

---

## Testing & Validation

### Test Data Requirements

1. **Golden dataset:** 100+ real journal entries with manually labeled extractions
2. **Edge cases:** Misspellings, slang, multilingual (Portuguese terms)
3. **Belt diversity:** Examples from white, blue, purple belt journaling styles

### Accuracy Targets

| Entity Type | Target Precision | Target Recall |
|-------------|------------------|---------------|
| Techniques | 90% | 85% |
| Submissions | 85% | 80% |
| Positions | 90% | 85% |
| Partners | 80% | 70% |
| Duration | 95% | 90% |
| Sentiment | 85% | 80% |

### Validation Process

1. Extract entities from test set
2. Compare against gold labels
3. Calculate precision, recall, F1
4. Identify failure patterns
5. Update rules/vocabulary
6. Re-test

---

## Appendix A: Complete Technique Library

*See `/docs/domain-knowledge/bjj-techniques/` for complete CSV files.*

## Appendix B: AssemblyAI Custom Vocabulary

*See `VOICE_TRANSCRIPTION_SPEC.md` for transcription configuration.*

---

## Open Questions

1. **Should extraction run client-side or server-side?**
   - Client: Faster, works offline, privacy-preserving
   - Server: Easier updates, can use heavier ML models

2. **How to handle non-English BJJ terms (Portuguese)?**
   - "Mata leão" = RNC
   - "Oss" = greeting (ignore)
   - Recommendation: Include in synonym dictionary

3. **Should we learn from user corrections?**
   - If user changes "kimmy" → "Kimura", add to synonyms?
   - Recommendation: Collect corrections, batch review, update vocabulary

4. **What's the extraction latency target?**
   - Voice: After transcription completes (<5s total)
   - Text: <500ms

---

*This document is a living specification. Update as extraction rules are refined based on real user data.*
