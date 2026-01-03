# STATS Module Implementation: Data-Realistic Roadmap

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Active Implementation Guide
**Companion To:** `STATS_MODULE_STRATEGY.md`

---

## Executive Summary

This document translates the aspirational STATS_MODULE_STRATEGY.md into a **buildable implementation plan** based on data we reliably collect.

### The Reality Check

The strategy document proposes 14 belt-adaptive modules. After auditing our data collection:

| Category | Count | Action |
|----------|-------|--------|
| **Build Now** | 8 modules | Full implementation with existing data |
| **Build Simplified** | 2 modules | Reduced scope, derived data |
| **Defer** | 2 modules | Requires optional new fields |
| **Cannot Build** | 2 modules | Data fundamentally unavailable |

### Why Some Modules Are Deferred

Our app serves **exhausted users** post-training. Every additional question reduces completion rates. We deliberately deprecated fields like `partnerBelt` and `roundOutcome` because users don't reliably provide them.

**Guiding Principle:** Build with data users naturally provide. Don't add friction for aspirational features.

---

## Data We Reliably Collect

### Per Session (High Confidence)

| Field | Type | Example |
|-------|------|---------|
| `date` | ISO date | "2024-12-20" |
| `time` | Time string | "18:30" |
| `trainingType` | Enum | 'gi' \| 'nogi' \| 'openmat' \| 'drilling' \| 'private' \| 'competition' |
| `durationMinutes` | Number | 90 |
| `lessonTopic` | String | "Toreando passing details" |
| `techniquesDrilled` | String[] | ["Toreando Pass", "Knee Cut"] |
| `didSpar` | Boolean | true |
| `sparringRounds` | Number | 5 |
| `submissionsGiven` | String[] | ["Triangle", "Armbar"] |
| `submissionsReceived` | String[] | ["RNC"] |
| `workedWell` | String[] | ["Guard retention"] |
| `struggles` | String[] | ["Passing butterfly"] |
| `notes` | String | Free text observations |

### Per User Profile

| Field | Type | Confidence |
|-------|------|------------|
| `belt_level` | Enum | High |
| `stripes` | 0-4 | High |
| `session_count` | Number | High (derived) |
| `training_start_date` | ISO date | High |
| `target_frequency` | Number | Medium |
| `gym_name` | String | Medium |

### Technique Progress (Aggregated)

| Field | Type |
|-------|------|
| `technique_id` | Reference |
| `times_drilled` | Number |
| `proficiency` | 'learning' \| 'developing' \| 'proficient' \| 'advanced' |
| `last_practiced` | ISO date |

### Data We DON'T Have (Deprecated)

| Field | Why Unreliable |
|-------|----------------|
| `partnerBelt` | Users roll with multiple partners, don't track belts |
| `roundOutcome` | Users don't track W/L per round |
| `roundDuration` | Not captured per round |
| `escapeAttempts` | Not tracked |
| `positionTime` | Too complex to recall |
| `mood/energyLevel` | Users won't submit feeling scores |

---

## Buildable Modules by Belt Level

---

## WHITE BELT MODULES

### 1. Journey Timeline (BUILD NOW)

**Original Strategy:** Journey Timeline showing milestones and dropout cliff position.

**Implementation:** Full build - we have all required data.

**Data Sources:**
- `session_count` - Total sessions logged
- `training_start_date` - When they started (or first session date)
- Derived: `daysActive`, `weeksActive`, `monthsActive`

**Milestones:**

| Milestone | Trigger | Message |
|-----------|---------|---------|
| First Class | `sessions >= 1` | "You started. That's step one." |
| First Week | `sessions >= 2` | "You came back. That's rare." |
| 10 Sessions | `sessions >= 10` | "Double digits. The habit is forming." |
| 25 Sessions | `sessions >= 25` | "A quarter hundred. You're committed." |
| 50 Sessions | `sessions >= 50` | "50 sessions. Most white belts never see this." |
| 100 Sessions | `sessions >= 100` | "Triple digits. This is who you are now." |
| 6 Months | `daysActive >= 180` | "Six months in. Past the first cliff." |
| 1 Year | `daysActive >= 365` | "One year. You're not a tourist anymore." |

**Dropout Cliff Messaging:**
- 0-3 months: "You're in the danger zone. 70% quit here. Keep showing up."
- 3-6 months: "The hardest part. Every session counts."
- 6+ months: "You're past the cliff. Most don't make it this far."

**Component:** `JourneyTimeline.tsx`

---

### 2. Consistency Score (REPLACES Survival Score)

**Original Strategy:** Survival Score based on round duration and escape rates.

**Why We Can't Build Original:** We don't track round duration or escape attempts.

**Realistic Alternative:** Focus on what we CAN measure - showing up consistently.

**Data Sources:**
- `session_count` - Total sessions
- Session dates - For streak calculation
- `target_frequency` - User's goal (if set)

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   CONSISTENCY                                           │
│                                                         │
│                       47                                │
│                  sessions logged                        │
│                                                         │
│           Current streak: 12 days                       │
│           This week: 3 sessions                         │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  70% of white belts quit before 50 sessions.   │  │
│   │  You're 94% of the way there.                  │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   "Consistency beats intensity. You're proving that." │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `ConsistencyScore.tsx`

---

### 3. Foundations Progress (SIMPLIFIED Foundation Builder)

**Original Strategy:** Track explicit skill progress through a curriculum checklist.

**Why Simplified:** We don't have explicit "skill unlocked" tracking, but we DO know what techniques users have drilled.

**Implementation:** Match `techniquesDrilled` history against a "foundations checklist" to show implicit progress.

**Foundations Checklist (20 core techniques for white belt):**

```typescript
const WHITE_BELT_FOUNDATIONS = {
  escapes: [
    'Hip Escape',
    'Bridge',
    'Shrimp',
    'Technical Stand-up'
  ],
  guards: [
    'Closed Guard',
    'Half Guard',
    'Butterfly Guard',
    'Open Guard'
  ],
  submissions: [
    'Armbar',
    'Triangle',
    'Rear Naked Choke',
    'Kimura',
    'Americana',
    'Guillotine'
  ],
  positions: [
    'Mount',
    'Side Control',
    'Back Control',
    'Knee on Belly'
  ],
  defense: [
    'Mount Escape',
    'Side Control Escape',
    'Back Escape',
    'Guard Retention'
  ]
};
```

**Logic:** Scan all `techniquesDrilled` from user's session history. If technique name matches (fuzzy match), mark as "touched."

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   FOUNDATIONS                         14 / 20 touched  │
│                                                         │
│   ESCAPES                              ████████████ 4/4 │
│   GUARDS                               ████████░░░░ 3/4 │
│   SUBMISSIONS                          ██████████░░ 5/6 │
│   POSITIONS                            ████████░░░░ 3/4 │
│   DEFENSE                              ██████░░░░░░ 2/4 │
│                                                         │
│   Recently touched: Armbar, Hip Escape, Triangle        │
│                                                         │
│   "You've touched 70% of the fundamentals.             │
│    Keep drilling - repetition builds reflexes."        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `FoundationsProgress.tsx`

---

### WHITE BELT: Modules to HIDE

Per the strategy, hide these for white belts:

| Module | Reason |
|--------|--------|
| Sparring Stats Grid | White belts have ~0 subs given; creates shame |
| Deadliest Attack | They don't have a signature attack yet |
| Submission Breakdown | Overwhelming at this stage |
| Any W/L ratios | Discouraging and not meaningful |

---

## BLUE BELT MODULES

### 4. Your Style (SIMPLIFIED Game DNA)

**Original Strategy:** Game DNA showing position preferences, guard types, archetype detection.

**Why Simplified:** We don't have position time data, but we CAN infer style from submissions.

**Data Sources:**
- `submissionsGiven[]` - Attack patterns
- `submissionsReceived[]` - Defense gaps
- `techniquesDrilled[]` - Training focus

**Derived Metrics:**

```typescript
interface StyleAnalysis {
  submissionBalance: number; // ratio of given:received
  preferredAttacks: Array<{ technique: string; count: number }>;
  vulnerabilities: Array<{ technique: string; count: number }>;
  bodyFocus: {
    given: { neck: number; arms: number; legs: number };
    received: { neck: number; arms: number; legs: number };
  };
  styleLabel: 'balanced' | 'offensive' | 'defensive' | 'developing';
}
```

**Style Labels:**
- **Offensive:** Given:Received ratio > 2:1
- **Defensive:** Given:Received ratio < 0.5:1
- **Balanced:** Ratio between 0.5:1 and 2:1
- **Developing:** < 10 total submissions logged

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   YOUR STYLE                          "Guard Hunter"   │
│                                                         │
│   SUBMISSION BALANCE                                    │
│                                                         │
│   Given        ████████████████████░░░░  23            │
│   Received     ██████████░░░░░░░░░░░░░░  12            │
│                                                         │
│   Ratio: 1.9:1  →  Offensive style emerging            │
│                                                         │
│   YOUR GO-TO ATTACKS                                    │
│   1. Triangle      ████████████  8                     │
│   2. Armbar        ████████░░░░  5                     │
│   3. Guillotine    ██████░░░░░░  4                     │
│                                                         │
│   ATTACK ZONES                                          │
│   Neck  ████████████████  52%                          │
│   Arms  ████████░░░░░░░░  35%                          │
│   Legs  ████░░░░░░░░░░░░  13%                          │
│                                                         │
│   "You're hunting from guard. The triangle is         │
│    becoming your signature. Keep developing chains."   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `YourStyle.tsx`

---

### 5. Vulnerability Map (REPLACES Hole Finder)

**Original Strategy:** Gap analysis with escape rates and drill suggestions.

**Why Adjusted:** We don't have escape rates, but we DO have `submissionsReceived`.

**Data Sources:**
- `submissionsReceived[]` - What's catching you
- `TECHNIQUE_BODY_MAP` - Body region mapping

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   WHERE YOU'RE GETTING CAUGHT           Last 30 days   │
│                                                         │
│   ⚠ MOST COMMON                                        │
│                                                         │
│   RNC              ████████████████  6 times           │
│   Triangle         ████████░░░░░░░░  3 times           │
│   Armbar           ██████░░░░░░░░░░  2 times           │
│                                                         │
│   BODY REGION HEAT MAP                                  │
│                                                         │
│   Neck     ████████████████████  67%                   │
│   Arms     ████████░░░░░░░░░░░░  25%                   │
│   Legs     ██░░░░░░░░░░░░░░░░░░   8%                   │
│                                                         │
│   SUGGESTED FOCUS                                       │
│   "You're getting caught with chokes. Focus on:        │
│    - Hand fighting before grips lock                   │
│    - Chin tuck and shoulder pressure                   │
│    - Early escape before position consolidates"        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Suggestion Logic:**

| Top Vulnerability Region | Suggested Focus |
|--------------------------|-----------------|
| Neck (chokes) | Hand fighting, chin tuck, posture |
| Arms (armlocks) | Elbow discipline, grip breaks, posture |
| Legs (leg locks) | Knee line defense, early disengage, boot awareness |

**Component:** `VulnerabilityMap.tsx`

---

### 6. Training Partners (SIMPLIFIED Technique Web)

**Original Strategy:** Visualize attack chains and transition success rates.

**Why Simplified:** We don't have chain/sequence data, but we CAN show technique co-occurrence.

**Data Sources:**
- `techniquesDrilled[]` per session - What's practiced together

**Logic:** When technique A appears in the same session as technique B, they're "paired." High co-occurrence suggests intentional system building.

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   TECHNIQUES YOU PAIR TOGETHER                          │
│                                                         │
│   When you drill ARMBAR, you also drill:               │
│                                                         │
│   Triangle         ████████████████  12 sessions       │
│   Kimura           ████████████░░░░   8 sessions       │
│   Omoplata         ████████░░░░░░░░   5 sessions       │
│                                                         │
│   When you drill GUARD PASS, you also drill:           │
│                                                         │
│   Mount control    ████████████████  10 sessions       │
│   Side control     ████████████░░░░   7 sessions       │
│   Knee on belly    ████████░░░░░░░░   4 sessions       │
│                                                         │
│   "You're building a closed guard attack system.       │
│    The armbar-triangle-kimura trio is classic."        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `TechniquePairings.tsx`

---

### 7. Blues Detector (BUILD NOW)

**Original Strategy:** Detect dropout risk through sentiment and attendance patterns.

**Why Full Build:** We have all required data - notes for sentiment, dates for patterns.

**Data Sources:**
- `notes` and `voiceTranscript` - For sentiment keywords
- Session dates - For attendance pattern analysis
- `session_count` - For milestone context

**Risk Signals:**

| Signal | Detection | Threshold |
|--------|-----------|-----------|
| Attendance Drop | Sessions this month vs last month | >30% decline |
| Extended Gap | Days since last session | >14 days |
| Negative Sentiment | Keywords in notes | 3+ negative entries |
| Post-Promotion Window | Time since belt promotion | 0-12 months at blue |

**Sentiment Keywords:**

```typescript
const NEGATIVE_KEYWORDS = [
  'frustrated', 'suck', 'terrible', 'quit', 'giving up',
  'impostor', 'imposter', 'fake', 'don\'t belong',
  'waste of time', 'not improving', 'stuck', 'plateau'
];

const POSITIVE_KEYWORDS = [
  'breakthrough', 'clicked', 'finally', 'got it',
  'improving', 'progress', 'proud', 'excited'
];
```

**Intervention Banners:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   It's been 16 days since your last session.           │
│                                                         │
│   That's normal at blue belt. The motivation dip       │
│   is real. One session can restart the momentum.       │
│                                                         │
│   [I'm okay, dismiss]    [I'm struggling]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Feeling like you don't deserve your blue belt?       │
│                                                         │
│   That's imposter syndrome. Nearly every blue belt     │
│   experiences it. Your coach promoted you for a        │
│   reason. The feeling passes.                          │
│                                                         │
│   [Thanks, I needed that]    [Tell me more]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `BluesDetector.tsx`

---

## PURPLE BELT MODULES

### 8. The Long Game (BUILD NOW)

**Original Strategy:** Multi-year progression visualization.

**Why Full Build:** We have complete session history with dates.

**Data Sources:**
- All sessions with dates - For year-over-year aggregation
- `submissionsGiven/Received` - For trend analysis
- `sparringRounds` - For volume tracking

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   THE LONG GAME                                         │
│                                                         │
│   SESSIONS BY YEAR                                      │
│   ┌───────────────────────────────────────────────────┐│
│   │                                            ●      ││
│   │                                       ●          ││
│   │                             ●    ●               ││
│   │                   ●    ●                         ││
│   │         ●    ●                                   ││
│   │    ●                                             ││
│   └───────────────────────────────────────────────────┘│
│    2020   2021   2022   2023   2024                    │
│     32     78    124    156    142                     │
│                                                         │
│   LIFETIME TOTALS                                       │
│                                                         │
│   Total sessions        532                             │
│   Total mat hours       798                             │
│   Sparring rounds     1,847                             │
│   Techniques drilled    247 unique                      │
│                                                         │
│   "5 years in. 532 sessions. This is a lifestyle."    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `LongGame.tsx`

---

### 9. Submission Trends (SIMPLIFIED Efficiency Matrix)

**Original Strategy:** Track attempt counts and finish rates over time.

**Why Simplified:** We only have successful submissions, not attempts.

**Data Sources:**
- `submissionsGiven[]` with dates - For trend over time
- `submissionsReceived[]` with dates - For defensive trend

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   FINISHING TRENDS                      Last 12 months │
│                                                         │
│   SUBMISSIONS GIVEN                                     │
│   ┌───────────────────────────────────────────────────┐│
│   │    ●         ●              ●         ●     ●    ││
│   │  ●   ●   ●     ●    ●   ●     ●   ●     ●       ││
│   │●       ●         ●              ●               ●││
│   └───────────────────────────────────────────────────┘│
│    J   F   M   A   M   J   J   A   S   O   N   D      │
│                                                         │
│   This year:  47 given / 31 received                   │
│   Last year:  35 given / 39 received                   │
│                                                         │
│   TREND: +34% given, -21% received                     │
│                                                         │
│   YOUR EVOLUTION                                        │
│   Most improved: Triangle (+8 this year)               │
│   New addition: Darce (first logged this year)         │
│   Declining: Kimura (-3 from last year)                │
│                                                         │
│   "Your offensive output is up. Defense is tighter."  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `SubmissionTrends.tsx`

---

### 10. Technique Mastery (BUILD NOW)

**Original Strategy:** Specialization depth in signature positions.

**Why Full Build:** We have `TechniqueProgress` with proficiency levels.

**Data Sources:**
- `TechniqueProgress` - Proficiency levels, times drilled
- `techniquesDrilled` history - Frequency and recency

**Display:**

```
┌─────────────────────────────────────────────────────────┐
│   YOUR MASTERY                                          │
│                                                         │
│   ADVANCED (3)                                          │
│   Triangle        ████████████████████  147 drills     │
│   Armbar          ████████████████████  132 drills     │
│   RNC             ██████████████████░░   98 drills     │
│                                                         │
│   PROFICIENT (8)                                        │
│   Kimura          ████████████████░░░░   67 drills     │
│   Guillotine      ██████████████░░░░░░   54 drills     │
│   Omoplata        ████████████░░░░░░░░   41 drills     │
│   ... and 5 more                                        │
│                                                         │
│   DEVELOPING (12)                                       │
│   Darce           ████████░░░░░░░░░░░░   23 drills     │
│   Loop Choke      ██████░░░░░░░░░░░░░░   18 drills     │
│   ... and 10 more                                       │
│                                                         │
│   DEPTH ANALYSIS                                        │
│   Primary system: Closed guard attacks (Triangle →     │
│   Armbar → Omoplata chain)                             │
│                                                         │
│   "Your triangle is your signature. 147 drills deep." │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Component:** `TechniqueMastery.tsx`

---

## DEFERRED MODULES

These modules COULD be built with minimal new data collection (optional fields):

### Roll Context (DEFER)

**Required:** Add optional `rollContext` field to session logging.

**Low-Friction Implementation:**
- Add toggle after "Did you spar?"
- Options: "Competition prep" | "Flow rolling" | "Trying new stuff" | "Just training"
- Default to "Just training" if skipped

**Value:** Allows contextualizing submissions (getting tapped while trying new things is expected).

### Teaching Impact (DEFER)

**Required:** Add optional "Did you help teach?" toggle.

**Low-Friction Implementation:**
- Add toggle in session completion
- If yes, optional: "Who did you help?" (text field)
- Track: `teachingSessionCount`, `studentsHelped[]`

**Value:** Purple+ belts see their contribution to the academy.

---

## CANNOT BUILD (Data Not Available)

| Module | Why | Alternative |
|--------|-----|-------------|
| **Survival Score** | Requires round duration + escape rates we don't capture | Use Consistency Score instead |
| **Pressure Meter** | Requires partner belt (deprecated, unreliable) | Show overall submission balance instead |
| **System Mastery** | Requires user-defined technique systems | Use Technique Pairings as proxy |

---

## Module Visibility Matrix

| Module | White | Blue | Purple | Brown | Black |
|--------|-------|------|--------|-------|-------|
| Journey Timeline | **PRIMARY** | subtle | - | - | - |
| Consistency Score | **HIGH** | medium | low | low | low |
| Foundations Progress | **YES** | - | - | - | - |
| Your Style | - | **PRIMARY** | yes | yes | yes |
| Vulnerability Map | - | **YES** | subtle | - | - |
| Technique Pairings | - | **YES** | yes | yes | yes |
| Blues Detector | - | **CONDITIONAL** | - | - | - |
| Long Game | - | - | **YES** | yes | yes |
| Submission Trends | - | - | **PRIMARY** | yes | yes |
| Technique Mastery | - | - | **YES** | **PRIMARY** | **PRIMARY** |

---

## Implementation Phases

### Phase 1: White Belt Retention (Priority: P0)

| Component | Effort | Dependencies |
|-----------|--------|--------------|
| `JourneyTimeline.tsx` | 2 days | None |
| `ConsistencyScore.tsx` | 1 day | None |
| `FoundationsProgress.tsx` | 2 days | Foundations checklist |
| Hide competition stats | 0.5 days | None |

**Total: ~5.5 days**

### Phase 2: Blue Belt Identity (Priority: P0)

| Component | Effort | Dependencies |
|-----------|--------|--------------|
| `YourStyle.tsx` | 3 days | Body region mapping |
| `VulnerabilityMap.tsx` | 2 days | Body region mapping |
| `TechniquePairings.tsx` | 2 days | Co-occurrence algorithm |
| `BluesDetector.tsx` | 3 days | Sentiment analysis |

**Total: ~10 days**

### Phase 3: Purple Belt Depth (Priority: P1)

| Component | Effort | Dependencies |
|-----------|--------|--------------|
| `LongGame.tsx` | 2 days | Date aggregation |
| `SubmissionTrends.tsx` | 3 days | Trend calculation |
| `TechniqueMastery.tsx` | 2 days | TechniqueProgress data |

**Total: ~7 days**

---

## Success Metrics

### Primary Metrics

| Metric | Baseline | Target | How Measured |
|--------|----------|--------|--------------|
| White belt 6-month retention | ~25% | 35% | Cohort analysis |
| Blue belt 12-month retention | ~50% | 60% | Cohort analysis |
| Purple+ engagement | - | +15% | Session frequency |

### Module-Specific Metrics

| Module | Success Signal |
|--------|----------------|
| Journey Timeline | Users reaching 50-session milestone increases |
| Blues Detector | Users clicking "I'm okay" after intervention |
| Technique Mastery | Users drilling suggested techniques |

---

## Appendix: Future Data Collection Opportunities

If we want to unlock deferred modules in the future, consider:

1. **Roll Context:** Add as optional toggle (low friction)
2. **Teaching Sessions:** Add "Did you teach?" toggle for purple+ (low friction)
3. **Round Duration:** Integrate with gym timer systems (future)
4. **Partner Tracking:** Optional gym roster integration (future)

---

*This document is the active implementation guide. Update as modules are built.*
