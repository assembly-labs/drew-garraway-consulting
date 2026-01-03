# STATS Module Strategy: Belt-Adaptive Data Visualization

**Version:** 1.0
**Last Updated:** December 2024
**Author:** UX Strategy & Data Visualization
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Strategic Context](#strategic-context)
3. [Current State Analysis](#current-state-analysis)
4. [Belt-Level Psychology & Needs](#belt-level-psychology--needs)
5. [Module Specifications by Belt](#module-specifications-by-belt)
   - [White Belt Modules](#white-belt-modules)
   - [Blue Belt Modules](#blue-belt-modules)
   - [Purple Belt Modules](#purple-belt-modules)
6. [Module Visibility Matrix](#module-visibility-matrix)
7. [Data Requirements](#data-requirements)
8. [Wireframe Specifications](#wireframe-specifications)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Success Metrics](#success-metrics)
11. [Open Questions](#open-questions)

---

## Executive Summary

### The Problem

Our current STATS dashboard employs a competition-oriented, performance-focused framework that works for experienced practitioners but actively discourages our most vulnerable users. White belts (70-90% dropout) and blue belts (50% dropout) are shown metrics that highlight their inadequacies rather than their progress.

**Key insight from research:** A white belt seeing "Subs Given: 0 / Submitted By: 47" experiences shame, not motivation. A blue belt struggling with imposter syndrome doesn't need a leaderboard—they need validation that their emerging game is normal.

### The Solution

Implement **belt-adaptive STATS modules** that tell fundamentally different data stories based on where practitioners are in their journey:

| Belt Level | Data Story | Primary Emotion |
|------------|------------|-----------------|
| **White** | "You're surviving. You're showing up. That's rare." | Encouragement |
| **Blue** | "Your game is forming. The plateau is normal." | Validation |
| **Purple** | "Your systems are connecting. Your teaching matters." | Mastery |

### Expected Impact

- **White belt retention:** +15-25% through survival-focused metrics
- **Blue belt retention:** +10-20% through identity validation and plateau normalization
- **Purple belt engagement:** +20% through teaching impact and systems visualization
- **Overall NPS improvement:** +12 points through belt-appropriate experiences

---

## Strategic Context

### Research Foundation

This strategy synthesizes insights from our internal research documents:

| Document | Key Insight Applied |
|----------|---------------------|
| `USER_PERSONAS_AND_RESEARCH.md` | 90-second logging window, post-training cognitive impairment |
| `research-practioner-journey.md` | Belt-specific dropout patterns and psychological crises |
| `data-requirements-analysis.md` | Four Pillars framework, technique proficiency scales |
| `belt-profiles.ts` | Psychological stages, plateau patterns, motivation evolution |

### Core Design Principles

1. **Different belts need different stories** — One dashboard doesn't fit all
2. **Progress, not comparison** — Show growth against self, not others
3. **Context over raw data** — A "loss" in flow rolling ≠ a competition loss
4. **Celebrate consistency** — Showing up matters more than winning
5. **Normalize struggle** — Plateaus and losses are expected, not failures

---

## Current State Analysis

### Existing Dashboard Components

| Component | Location | Current Behavior |
|-----------|----------|------------------|
| Hero Metric | `Dashboard.tsx:53-92` | Belt-adaptive (streak/techniques/rounds/teaching) |
| Attack Profile | `AttackProfile.tsx` | Shows deadliest attack, Achilles heel, body heat map |
| Sparring Grid | `Dashboard.tsx:591-681` | Subs given vs. submitted by (green/red) |
| Streak Section | `Dashboard.tsx:719-809` | Large typographic streak display |
| Callouts | `Dashboard.tsx:814-874` | "What's Working" / "Focus Area" |
| Tournament Readiness | `TournamentReadinessCard.tsx` | Four pillar scoring |
| Breakthrough List | `BreakthroughList.tsx` | Recent achievements |

### Current Belt Adaptations

The existing `useBeltPersonalization()` hook provides:

```typescript
dashboard: {
  primaryMetric: 'session_streak' | 'technique_variety' | 'sparring_rounds' | 'teaching_sessions',
  streakEmphasis: 'high' | 'medium' | 'low',
  showCompetitionStats: boolean,
  insightFocus: 'survival_skills' | 'game_development' | 'systems_thinking' | 'refinement' | 'legacy',
  celebrationThreshold: number
}
```

### Gaps Identified

| Gap | Impact | Affected Belts |
|-----|--------|----------------|
| No survival metrics | White belts see only losses | White |
| No game identity visualization | Blue belts lack style validation | Blue |
| No plateau normalization | Blues feel like failures | Blue |
| No systems visualization | Purple sees techniques, not connections | Purple |
| No teaching impact | Purple contribution invisible | Purple |
| Competition stats for all | Discourages non-competitors | White |
| Raw win/loss without context | Misrepresents training intent | All |

---

## Belt-Level Psychology & Needs

### White Belt: Survival Mode

**Psychological State:**
- "Ego death" — getting submitted by smaller, less athletic partners
- Analysis paralysis — overwhelmed by technique volume
- Novelty fading while competence remains invisible
- Physical challenges: soreness, finger sprains, neck strain

**Dropout Pattern:**
- **Peak risk:** 3-6 months (70-90% quit before blue)
- **Warning signs:** Declining attendance, avoiding sparring, excuse-making

**What They Need to See:**
- Evidence they're surviving longer
- Validation that showing up is rare
- Progress on fundamental skills
- Milestone celebrations (small thresholds)

**What They DON'T Need:**
- Competition statistics
- Win/loss ratios
- Comparison to other practitioners
- "Deadliest Attack" (they don't have one)

---

### Blue Belt: Identity Crisis

**Psychological State:**
- Post-goal emptiness — primary target (blue belt) achieved
- Imposter syndrome — "Am I truly a blue belt?"
- Hydraulic press — pressure from white belts AND upper belts
- Plateau frustration — learning curve flattens dramatically

**Dropout Pattern:**
- **Peak risk:** First 12 months after promotion (50% quit)
- **Key distinction:** White belts quit because "it's too hard"; blue belts quit because "it's no longer rewarding"

**What They Need to See:**
- Their emerging personal style visualized
- Technique chains forming (not isolated moves)
- Performance in context (flow rolling ≠ competition)
- Normalization of losses to white belts
- Gap analysis with actionable focus

**What They DON'T Need:**
- Raw win/loss without context
- Comparison to purple+ performance
- Pressure about tournament readiness (unless interested)

---

### Purple Belt: Systems Thinking

**Psychological State:**
- "Gateway to advanced play" — shifting from techniques to systems
- Teaching identity emerging — IBJJF qualifies to instruct
- "Loneliest belt" — pressure from all directions
- Possible contentment plateau — happy to stay here

**Dropout Pattern:**
- **Primary cause:** Life circumstances (marriage, children, career)
- **Secondary cause:** Injury accumulation after 4-7+ years

**What They Need to See:**
- Position ecosystems, not technique lists
- Teaching contribution and impact
- Efficiency trends (finesse over force)
- Long-term progression (multi-year view)
- Specialization depth in signature positions

**What They DON'T Need:**
- Basic survival metrics
- Achilles heel focus (that was a learning tool)
- Simple technique counts

---

## Module Specifications by Belt

### White Belt Modules

#### 1. Survival Score (NEW — Primary)

**Purpose:** Replace competition-focused metrics with defense-first visualization that validates the white belt experience.

**Data Story:** "You're lasting longer. That's how it starts."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ SURVIVAL              │
│                                                         │
│                        4:23                             │
│               average round duration                    │
│                                                         │
│           ↑ 1:11 improvement from last month           │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │░░░░░░░░░░░░░░░░░░████████████  You're here     │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   Most white belts: 2-3 min    You: 4:23               │
│                                                         │
│   "Surviving longer than most. Defense is working."    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Points Required:**
| Field | Source | Calculation |
|-------|--------|-------------|
| `avgRoundDuration` | Session logs | Mean of round durations before first tap |
| `prevMonthAvgDuration` | Historical | Same calculation, 30 days prior |
| `escapeAttempts` | Session logs | Count of escape attempts logged |
| `escapeSuccessRate` | Derived | `successfulEscapes / escapeAttempts` |
| `positionRecoveries` | Session logs | Times returned to guard after pass |

**Component Props:**
```typescript
interface SurvivalScoreProps {
  currentAvgDuration: number; // seconds
  previousAvgDuration: number; // seconds
  escapeSuccessRate: number; // 0-1
  percentileRank: number; // vs other white belts
  belt: 'white'; // only shown for white belts
}
```

**Messaging Guidelines:**
- Always frame duration positively ("lasting longer" not "still getting tapped")
- Compare to self, not others (unless percentile is favorable)
- Use specific numbers ("4:23") not vague ("good")

---

#### 2. Foundation Builder (NEW)

**Purpose:** Visual progress tracker for survival essentials that gives white belts clear targets.

**Data Story:** "These are the building blocks. You're laying the foundation."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   FOUNDATION                       ████████░░  80%     │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  ESCAPES                                        │  │
│   │  ✓ Hip escape        ✓ Bridge                   │  │
│   │  ✓ Shrimp            ○ Technical stand-up       │  │
│   ├─────────────────────────────────────────────────┤  │
│   │  FRAMES & DEFENSE                               │  │
│   │  ✓ Basic frame       ○ Posture in closed guard │  │
│   │  ✓ Elbow-knee        ○ Grip fighting basics    │  │
│   ├─────────────────────────────────────────────────┤  │
│   │  POSITION RECOGNITION                           │  │
│   │  ✓ Guard vs mount    ✓ Side control ID         │  │
│   │  ✓ Back taken        ○ Half guard variants     │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   "Survival first. Offense later."                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Points Required:**
| Field | Source | Type |
|-------|--------|------|
| `foundationSkills[]` | Predefined list | Static curriculum |
| `skillProgress{}` | User input / AI detection | Map<skillId, status> |
| `status` | Derived | 'not_started' | 'learning' | 'applied' | 'solid' |

**Skill Categories:**
1. **Escapes** (4 skills): Hip escape, Bridge, Shrimp, Technical stand-up
2. **Frames & Defense** (4 skills): Basic frame, Elbow-knee connection, Posture in guard, Grip fighting
3. **Position Recognition** (4 skills): Guard ID, Mount ID, Side control ID, Back position ID

---

#### 3. The Journey (Timeline)

**Purpose:** Visual milestone tracker that positions their progress against the dropout cliff.

**Data Story:** "Most quit by now. You're still here. That's rare."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   YOUR JOURNEY                                          │
│                                                         │
│   ●━━━━━●━━━━━●━━━━━◉━━━━━○━━━━━○━━━━━○                │
│   │     │     │     │     │     │     │                │
│  1st   1     3    YOU    50   100   1yr               │
│  class week  mo   (5mo)  sess  sess                    │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  ⚠ DROPOUT CLIFF (3-6 months)                   │  │
│   │  ░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░          │  │
│   │  You're past it. Most don't make it this far.   │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   "70% of white belts quit before 6 months.            │
│    You're in the 30% who kept showing up."             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Milestones:**
| Milestone | Trigger | Message |
|-----------|---------|---------|
| First class | `sessions >= 1` | "You started. That's step one." |
| First week | `daysActive >= 7` | "You came back. That's rare." |
| One month | `daysActive >= 30` | "A full month. The habit is forming." |
| 3 months | `daysActive >= 90` | "Past the first cliff. You're committed." |
| 50 sessions | `sessions >= 50` | "50 sessions. Most never see this." |
| 100 sessions | `sessions >= 100` | "Triple digits. This is who you are now." |
| One year | `daysActive >= 365` | "One year. You're not a tourist anymore." |

---

#### 4. Modules to HIDE for White Belts

The following existing modules should be **hidden** via `showCompetitionStats: false`:

| Module | Reason to Hide |
|--------|----------------|
| Sparring Grid (Subs Given/Received) | White belts have ~0 subs given; creates shame |
| Deadliest Attack Card | They don't have a signature attack yet |
| Achilles Heel Card | Focus on survival, not weaknesses yet |
| Tournament Readiness | Not relevant for 12-24 months |
| Full Attack Profile | Overwhelming and discouraging |

**Implementation:** Extend `dashboard.showCompetitionStats` to control these components conditionally.

---

### Blue Belt Modules

#### 1. Game DNA (NEW — Primary)

**Purpose:** Visualize the emerging personal style that defines the blue belt identity development phase.

**Data Story:** "Your game is forming. This is who you're becoming."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   YOUR GAME DNA                                         │
│                                                         │
│   ┌───────────────────────────────────────────────┐    │
│   │                                               │    │
│   │              GUARD PLAYER                     │    │
│   │         ████████████████████  68%            │    │
│   │                                               │    │
│   │   Your game lives on the bottom.             │    │
│   │   You're developing a guard-based style.     │    │
│   │                                               │    │
│   └───────────────────────────────────────────────┘    │
│                                                         │
│   POSITION BREAKDOWN                                    │
│                                                         │
│   Bottom Game        ████████████████░░░░  68%         │
│   Top Game           ████████░░░░░░░░░░░░  32%         │
│                                                         │
│   PREFERRED GUARDS                                      │
│                                                         │
│   Closed Guard       ████████████████████  Primary     │
│   Half Guard         ████████████░░░░░░░░  Secondary   │
│   Spider Guard       ████████░░░░░░░░░░░░  Developing  │
│                                                         │
│   "Blue belt is when your style emerges.               │
│    Own what's working. Build on it."                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Points Required:**
| Field | Source | Calculation |
|-------|--------|-------------|
| `topGameRatio` | Session logs | % time in top positions |
| `bottomGameRatio` | Session logs | % time in bottom positions |
| `preferredGuards[]` | Session logs | Frequency of guard types used |
| `passingStyle` | Session logs | Pressure vs. speed vs. distance |
| `submissionPreferences` | Submission records | Most attempted subs |

**Archetype Detection:**
```typescript
type GameArchetype =
  | 'guard_player'      // >60% bottom game
  | 'top_player'        // >60% top game
  | 'wrestler'          // High takedown frequency
  | 'leg_locker'        // Leg attack preference
  | 'pressure_passer'   // Pressure passing style
  | 'well_rounded';     // No dominant preference
```

---

#### 2. Technique Web (NEW)

**Purpose:** Visualize attack chains, not isolated techniques — showing the "grammar" forming from "vocabulary."

**Data Story:** "You're not just learning moves. You're connecting them."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ATTACK CHAINS                                         │
│                                                         │
│                    ┌─────────────┐                      │
│                    │   ARMBAR    │                      │
│                    │   (12 hits) │                      │
│                    └──────┬──────┘                      │
│                           │                             │
│              ┌────────────┼────────────┐               │
│              │            │            │               │
│              ▼            ▼            ▼               │
│        ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│        │ TRIANGLE │ │ OMOPLATA │ │ BACK TAKE│         │
│        │  (8 hits)│ │  (5 hits)│ │  (3 hits)│         │
│        └──────────┘ └──────────┘ └──────────┘         │
│                                                         │
│   CHAIN EFFECTIVENESS                                   │
│                                                         │
│   Armbar → Triangle      ████████████████  67%         │
│   Armbar → Omoplata      ████████████░░░░  52%         │
│   Triangle → Armbar      ██████████░░░░░░  44%         │
│                                                         │
│   "Blue belt is about connecting attacks.              │
│    Your armbar-triangle chain is working."             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Points Required:**
| Field | Source | Type |
|-------|--------|------|
| `techniqueAttempts[]` | Session logs | Array of attempts with timestamps |
| `chainSequences[]` | Derived | Sequential attempts within same round |
| `chainSuccessRate{}` | Derived | Map<chainId, successRate> |

---

#### 3. Pressure Meter (NEW)

**Purpose:** Normalize performance by opponent level, addressing imposter syndrome directly.

**Data Story:** "Getting tapped by white belts is normal. Here's how you're really doing."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   PERFORMANCE BY BELT                                   │
│                                                         │
│   vs. White Belts                                       │
│   ████████████████████████████░░  85% dominant         │
│   Expected: 70-90%  ✓ On track                         │
│                                                         │
│   vs. Blue Belts (peers)                               │
│   ████████████████░░░░░░░░░░░░░░  55% competitive      │
│   Expected: 45-55%  ✓ Normal                           │
│                                                         │
│   vs. Purple+ Belts                                     │
│   ████████░░░░░░░░░░░░░░░░░░░░░░  32% survival         │
│   Expected: 20-35%  ✓ Learning                         │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  REALITY CHECK                                  │  │
│   │                                                 │  │
│   │  Getting tapped by a white belt doesn't mean   │  │
│   │  you're not a "real" blue belt. It happens     │  │
│   │  to everyone. Focus on your peer performance.  │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Expected Performance Ranges:**
| Your Belt | vs. White | vs. Blue | vs. Purple+ |
|-----------|-----------|----------|-------------|
| Blue | 70-90% | 45-55% | 20-35% |

---

#### 4. Hole Finder (NEW)

**Purpose:** Gap analysis with actionable recommendations — turning frustration into focus.

**Data Story:** "Here's what to work on. Specific, not vague."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   GAME GAPS                                             │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  ⚠ PRIORITY: MOUNT ESCAPES                      │  │
│   │                                                 │  │
│   │  Caught from mount: 8 times (last 30 days)     │  │
│   │  Escape success rate: 25%                       │  │
│   │                                                 │  │
│   │  SUGGESTED FOCUS:                               │  │
│   │  Drill upa (bridge escape) and elbow-knee      │  │
│   │  escape. Ask coach to flow roll from mount.    │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   ✓ GUARD RETENTION                    Strong          │
│     Passes allowed: 3 in 30 days                       │
│                                                         │
│   ✓ BACK ESCAPES                       Improving       │
│     Was 15% success → Now 42%                          │
│                                                         │
│   ○ TAKEDOWNS                          Undeveloped     │
│     Only 2 attempts logged. Consider drilling.         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Gap Detection Logic:**
```typescript
interface GapAnalysis {
  position: string;
  timesExposed: number;
  escapeRate: number;
  trend: 'improving' | 'stable' | 'declining';
  priority: 'critical' | 'moderate' | 'low';
  suggestion: string;
}
```

---

#### 5. Roll Context (UPGRADE)

**Purpose:** Add context to sparring stats so "losses" in flow rolling don't count against development.

**Existing Problem:** Raw win/loss creates misleading signals. A purple belt working new techniques SHOULD lose.

**Data Story:** "Context matters. Training intent shapes results."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   SPARRING CONTEXT                    Last 30 days     │
│                                                         │
│   Competition Prep     █████████████████  15 rounds    │
│   Performance: 73% dominant                             │
│                                                         │
│   Flow Rolling         ████████████░░░░░  10 rounds    │
│   Performance: N/A (not tracked)                        │
│                                                         │
│   Working New Tech     ████████░░░░░░░░░   7 rounds    │
│   Performance: N/A (expected to struggle)               │
│                                                         │
│   Positional Sparring  ██████░░░░░░░░░░░   5 rounds    │
│   Performance: 62% position achieved                    │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  Only "Competition Prep" rounds count toward    │  │
│   │  your performance metrics. Flow and new tech    │  │
│   │  are for learning, not winning.                 │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Roll Context Options:**
```typescript
type RollContext =
  | 'competition_prep'  // A-game, competing hard
  | 'flow_rolling'      // Light, exploratory
  | 'working_new_tech'  // Deliberately trying new moves
  | 'positional'        // Start from specific position
  | 'handicap'          // Giving advantages
  | 'recovery'          // Coming back from injury
```

---

#### 6. Blue Belt Blues Detector (NEW — Subtle Intervention)

**Purpose:** Detect dropout risk patterns and provide gentle intervention.

**Data Story:** "The plateau is normal. It passes."

**Trigger Conditions:**
| Signal | Threshold | Intervention Level |
|--------|-----------|-------------------|
| Attendance drop | >30% month-over-month | Gentle check-in |
| Session gap | >14 days | Re-engagement message |
| Negative journal sentiment | 3+ negative entries | Supportive banner |
| Time at belt | 6-12 months post-promo | Plateau normalization |
| Performance anxiety keywords | "suck", "impostor", "quit" | Direct support |

**Intervention Examples:**

*Attendance drop:*
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Your training has slowed this month.                  │
│                                                         │
│   That's normal at blue belt. The first year is hard.  │
│   The plateau passes. Most blue belts experience this. │
│                                                         │
│   [I'm fine, hide this]  [Tell me more about plateaus] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

*Imposter syndrome detected:*
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Feeling like you don't deserve your blue belt?        │
│                                                         │
│   That's called imposter syndrome, and it affects      │
│   almost every blue belt. Your coach promoted you      │
│   for a reason. The feeling passes.                     │
│                                                         │
│   [I'm okay]  [Read about Blue Belt Blues]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Purple Belt Modules

#### 1. System Mastery (NEW — Primary)

**Purpose:** Visualize position ecosystems, not technique lists — reflecting the "sentences not words" shift.

**Data Story:** "You're not collecting techniques. You're building systems."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   HALF GUARD SYSTEM                    Your specialty  │
│                                                         │
│                      ┌────────────┐                     │
│                      │  LOCKDOWN  │                     │
│                      │  (entry)   │                     │
│                      └─────┬──────┘                     │
│                            │                            │
│              ┌─────────────┼─────────────┐             │
│              │             │             │             │
│              ▼             ▼             ▼             │
│        ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│        │OLD SCHOOL│  │ ELECTRIC │  │ DOGFIGHT │       │
│        │  sweep   │  │  sweep   │  │   sweep  │       │
│        └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│             │             │             │              │
│             ▼             ▼             ▼              │
│        ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│        │  MOUNT   │  │SIDE CTRL │  │BACK TAKE │       │
│        └──────────┘  └──────────┘  └──────────┘       │
│                                                         │
│   System depth: 14 connected techniques                │
│   Primary success rate: 62%                            │
│   Secondary paths: 4 documented                        │
│                                                         │
│   "At purple, you're making sentences, not words."     │
│                       — Roy Dean                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Points Required:**
| Field | Source | Type |
|-------|--------|------|
| `primarySystems[]` | User selection + AI | Guard/position systems |
| `systemNodes[]` | Technique library | Techniques in each system |
| `connectionStrength{}` | Session logs | Transition success rates |
| `systemDepth` | Derived | Count of connected techniques |

---

#### 2. Teaching Impact (NEW)

**Purpose:** Track contribution to the academy — validating the purple belt teaching role.

**Data Story:** "Teaching deepens your own understanding. Here's your impact."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   TEACHING IMPACT                                       │
│                                                         │
│                       47                                │
│              students helped this year                  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │  CONTRIBUTION                                   │  │
│   │                                                 │  │
│   │  Classes assisted          12                   │  │
│   │  Techniques taught         28                   │  │
│   │  White belts mentored      23                   │  │
│   │  Blue belts helped         18                   │  │
│   │  Open mat guidance         ✓ Regular           │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   STUDENT OUTCOMES (logged by them)                    │
│                                                         │
│   @Marcus_BJJ    "Sweep finally clicked. Thanks!"      │
│   @NewWhiteBelt  "Explained mount escape perfectly"    │
│                                                         │
│   "Purple belt is the teaching belt.                   │
│    Your contribution strengthens the whole academy."   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Points Required:**
| Field | Source | Type |
|-------|--------|------|
| `classesAssisted` | Session logs | Count where role = 'assistant' |
| `techniquesTaught` | Session logs | Unique techniques explained |
| `studentsHelped` | Derived | Unique partners with teaching context |
| `studentFeedback[]` | External input | Optional kudos from students |

---

#### 3. Efficiency Matrix (NEW)

**Purpose:** Track the shift from "bazooka" force to finesse and timing.

**Data Story:** "The bazooka doesn't work anymore. Finesse wins."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   EFFICIENCY TRENDS                                     │
│                                                         │
│   SUBMISSION EFFICIENCY         vs. 6 months ago       │
│                                                         │
│   Triangle      ████████████████████  78%   ↑ 12%     │
│   Armbar        ████████████████░░░░  62%   ↑ 8%      │
│   Kimura        ██████████░░░░░░░░░░  48%   ↑ 15%     │
│   Collar choke  ████████████████████  81%   ↑ 6%      │
│                                                         │
│   ENERGY EXPENDITURE                                    │
│                                                         │
│   Rounds to first sub:  3.2  →  2.4  (improving)       │
│   Attempts per success:  4.1  →  2.8  (more efficient) │
│   Average round length:  6:23 →  5:47 (finishing faster)│
│                                                         │
│   "Your triangle finish rate improved from 66% to 78%.  │
│    That's finesse, not force."                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

#### 4. The Long Game (NEW)

**Purpose:** Multi-year progression view for practitioners with 4-7+ years invested.

**Data Story:** "Look how far you've come. This is who you are now."

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   THE LONG GAME                                         │
│                                                         │
│   ┌───────────────────────────────────────────────────┐│
│   │                                            ●      ││
│   │                                       ●          ││
│   │                                  ●               ││
│   │                             ●                    ││
│   │                        ●                         ││
│   │                   ●                              ││
│   │              ●                                   ││
│   │         ●                                        ││
│   │    ●                                             ││
│   │●                                                 ││
│   └───────────────────────────────────────────────────┘│
│    2019    2020    2021    2022    2023    2024  NOW  │
│                                                         │
│   LIFETIME TOTALS                                       │
│                                                         │
│   Mat hours          1,847                              │
│   Sessions logged      892                              │
│   Techniques tracked   247                              │
│   Sparring rounds    2,340                              │
│   Teaching sessions     87                              │
│                                                         │
│   "5.5 years in. This is a lifestyle, not a hobby."   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

#### 5. Specialization Depth (NEW)

**Purpose:** Track mastery in signature positions that define purple belt identity.

**Visual Design:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   SPECIALIZATION                                        │
│                                                         │
│   PRIMARY: De La Riva Guard                             │
│   ████████████████████████████████████  Master        │
│   147 techniques logged • 89% success in live rolling   │
│                                                         │
│   SECONDARY: Single Leg X                               │
│   ██████████████████████████░░░░░░░░░░  Advanced      │
│   82 techniques logged • 71% success rate               │
│                                                         │
│   DEVELOPING: Worm Guard                                │
│   ████████████░░░░░░░░░░░░░░░░░░░░░░░░  Learning      │
│   23 techniques logged • 42% success rate               │
│                                                         │
│   "Your DLR is your identity. Opponents fear it.       │
│    Continue building depth, not just breadth."          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Module Visibility Matrix

### Summary Table

| Module | White | Blue | Purple | Brown | Black |
|--------|-------|------|--------|-------|-------|
| **Survival Score** | ✓ PRIMARY | — | — | — | — |
| **Foundation Builder** | ✓ | — | — | — | — |
| **Journey Timeline** | ✓ | ✓ subtle | — | — | — |
| **Day Streak** | ✓ HIGH | ✓ MEDIUM | ✓ LOW | ✓ LOW | ✓ LOW |
| **Sparring Grid** | ✗ HIDE | ✓ | ✓ | ✓ | ✓ |
| **Deadliest Attack** | ✗ HIDE | ✓ | ✓ | ✓ | ✓ |
| **Achilles Heel** | ✗ HIDE | ✓ | ✗ HIDE | ✗ HIDE | ✗ HIDE |
| **Game DNA** | — | ✓ PRIMARY | ✓ | ✓ | ✓ |
| **Technique Web** | — | ✓ | ✓ | ✓ | ✓ |
| **Pressure Meter** | — | ✓ | — | — | — |
| **Hole Finder** | — | ✓ | ✓ subtle | — | — |
| **Roll Context** | — | ✓ | ✓ | ✓ | ✓ |
| **Blues Detector** | — | ✓ conditional | — | — | — |
| **Tournament Readiness** | ✗ HIDE | ✓ | ✓ | ✓ | ✓ |
| **System Mastery** | — | — | ✓ PRIMARY | ✓ | ✓ |
| **Teaching Impact** | — | — | ✓ | ✓ PRIMARY | ✓ PRIMARY |
| **Efficiency Matrix** | — | — | ✓ | ✓ | ✓ |
| **Long Game** | — | — | ✓ | ✓ | ✓ |
| **Specialization** | — | — | ✓ | ✓ | ✓ |
| **Breakthrough List** | ✓ | ✓ | ✓ | ✓ | ✓ |

### Implementation in Belt System

Extend `feature-adaptations.ts`:

```typescript
interface DashboardAdaptation {
  // Existing
  primaryMetric: string;
  streakEmphasis: 'high' | 'medium' | 'low';
  showCompetitionStats: boolean;
  insightFocus: string;
  celebrationThreshold: number;

  // New
  modules: {
    survivalScore: boolean;
    foundationBuilder: boolean;
    journeyTimeline: boolean;
    gameDna: boolean;
    techniqueWeb: boolean;
    pressureMeter: boolean;
    holeFinder: boolean;
    rollContext: boolean;
    bluesDetector: boolean;
    systemMastery: boolean;
    teachingImpact: boolean;
    efficiencyMatrix: boolean;
    longGame: boolean;
    specialization: boolean;
  };

  hideModules: string[]; // Explicit list of what to hide
}
```

---

## Data Requirements

### New Data Points Needed

#### For White Belt Modules

| Field | Type | Source | Priority |
|-------|------|--------|----------|
| `roundDurations[]` | number[] | Session logs | Critical |
| `escapeAttempts` | number | Session logs | High |
| `escapeSuccesses` | number | Session logs | High |
| `foundationProgress{}` | Map | User input | Medium |
| `firstClassDate` | Date | Profile | Critical |
| `milestoneAchievements[]` | string[] | Derived | Medium |

#### For Blue Belt Modules

| Field | Type | Source | Priority |
|-------|------|--------|----------|
| `positionPreferences{}` | Map | Session logs | Critical |
| `guardTypeUsage{}` | Map | Session logs | High |
| `chainSequences[]` | Technique[][] | Derived | High |
| `rollContext` | enum | Session logs | Critical |
| `partnerBeltLevel` | string | Session logs | Critical |
| `journalSentiment` | number | AI analysis | Medium |

#### For Purple Belt Modules

| Field | Type | Source | Priority |
|-------|------|--------|----------|
| `systemDefinitions[]` | System[] | User + AI | Critical |
| `teachingSessions` | number | Session logs | Critical |
| `studentsHelped` | number | Derived | High |
| `techniquesTaught[]` | string[] | Session logs | High |
| `efficiencyTrends{}` | Map | Derived | Medium |
| `yearOverYearData{}` | Map | Historical | Medium |

### Session Log Schema Updates

```typescript
interface EnhancedSessionLog {
  // Existing fields...

  // New fields for belt-adaptive modules
  roundDetails?: RoundDetail[];
  rollContext?: RollContext;
  escapeAttempts?: number;
  escapeSuccesses?: number;
  positionTimeBreakdown?: PositionTime[];
  teachingNotes?: string;
  studentsHelped?: string[];
  techniquesTaught?: string[];
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  sentimentScore?: number; // AI-derived
}

interface RoundDetail {
  partnerName?: string;
  partnerBelt?: BeltLevel;
  duration: number; // seconds
  outcome?: 'submission_given' | 'submission_received' | 'positional' | 'draw';
  submissionType?: string;
  context: RollContext;
}
```

---

## Wireframe Specifications

### Mobile Layout Principles

1. **Full-bleed sections** — Modules extend edge-to-edge
2. **Vertical scroll** — Single column, no horizontal scrolling
3. **Large touch targets** — 56px minimum (80px for primary actions)
4. **High contrast** — Dark backgrounds, bright accents
5. **Progressive disclosure** — Summary first, details on tap

### Module Sizing

| Module Type | Height | Notes |
|-------------|--------|-------|
| Hero (Primary) | 60-70vh | First thing seen |
| Standard | 200-300px | Comfortable reading |
| Compact | 120-160px | Secondary info |
| Banner | 80-120px | Interventions |

### Component Hierarchy

```
Dashboard
├── HeroSection (belt-adaptive)
│   ├── WhiteBelt: SurvivalScore
│   ├── BlueBelt: GameDNA
│   └── PurpleBelt: SystemMastery
├── SecondaryModules[]
│   └── (filtered by belt visibility matrix)
├── InsightCallouts
│   ├── WhatsWorking
│   └── FocusArea
├── TertiaryModules[]
│   └── (filtered by belt visibility matrix)
└── BreakthroughList
```

---

## Implementation Roadmap

### Phase 1: Retention Critical (White Belt)
**Timeline:** Sprint 1-2
**Priority:** P0

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create `SurvivalScore` component | 3 days | Round duration data |
| Create `FoundationBuilder` component | 2 days | Skill progress schema |
| Create `JourneyTimeline` component | 2 days | Milestone definitions |
| Update `useBeltPersonalization` hook | 1 day | — |
| Add module visibility logic | 1 day | Hook updates |
| Hide competition modules for white | 0.5 days | Visibility matrix |

### Phase 2: Identity Development (Blue Belt)
**Timeline:** Sprint 3-4
**Priority:** P0

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create `GameDNA` component | 4 days | Position tracking data |
| Create `TechniqueWeb` component | 5 days | Chain detection logic |
| Create `PressureMeter` component | 2 days | Partner belt tracking |
| Create `HoleFinder` component | 3 days | Gap detection algorithm |
| Add `rollContext` to session logs | 1 day | Schema update |
| Create `BluesDetector` service | 3 days | Sentiment analysis |

### Phase 3: Systems Thinking (Purple Belt)
**Timeline:** Sprint 5-6
**Priority:** P1

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create `SystemMastery` component | 5 days | System definition schema |
| Create `TeachingImpact` component | 3 days | Teaching session tracking |
| Create `EfficiencyMatrix` component | 3 days | Historical data pipeline |
| Create `LongGame` component | 2 days | Multi-year aggregation |
| Create `Specialization` component | 2 days | Position depth tracking |

### Phase 4: Polish & Integration
**Timeline:** Sprint 7
**Priority:** P1

| Task | Effort | Dependencies |
|------|--------|--------------|
| Animation and transitions | 2 days | All components |
| Accessibility audit | 1 day | All components |
| Performance optimization | 2 days | All components |
| A/B testing setup | 2 days | Analytics integration |
| Documentation | 1 day | — |

---

## Success Metrics

### Primary Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| White belt 6-month retention | ~25% | 35% | Cohort analysis |
| Blue belt 12-month retention | ~50% | 65% | Cohort analysis |
| Purple belt engagement | — | +20% | Session frequency |
| NPS score | — | +12 points | Quarterly survey |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time spent in STATS | +30% | Analytics |
| Module interaction rate | 60%+ | Click tracking |
| Positive sentiment in feedback | 80%+ | In-app feedback |
| Plateau recovery rate | Track | Blues detector triggers → return |

### Qualitative Metrics

- User interviews: "Do you feel you can see your progress?"
- Coach feedback: "Is student data useful for promotion decisions?"
- Support tickets: Reduction in "I don't see progress" complaints

---

## Open Questions

### Product Questions

1. **Should we show comparative data?**
   - Pro: Context ("you're in the 60th percentile")
   - Con: Comparison can be discouraging
   - Recommendation: Opt-in, show only favorable comparisons

2. **How explicit should the Blues Detector be?**
   - Option A: Subtle banner, dismissible
   - Option B: Full intervention flow with resources
   - Recommendation: Start subtle, A/B test

3. **Should teaching impact require student confirmation?**
   - Pro: More accurate
   - Con: Friction
   - Recommendation: Self-reported first, add confirmation later

### Technical Questions

1. **How do we detect technique chains?**
   - Option: Time-based proximity in session logs
   - Alternative: Explicit chain logging by user
   - Recommendation: Hybrid with AI inference

2. **How do we calculate sentiment from journals?**
   - Option: Simple keyword matching
   - Alternative: LLM-based sentiment analysis
   - Recommendation: Start simple, enhance with AI

3. **How do we handle historical data for existing users?**
   - Some modules require data not previously captured
   - Recommendation: Graceful degradation, show what's available

---

## Appendix

### Related Documents

- `USER_PERSONAS_AND_RESEARCH.md` — Persona definitions
- `research-practioner-journey.md` — Belt psychology research
- `data-requirements-analysis.md` — Four Pillars framework
- `belt-profiles.ts` — Current belt psychology implementation
- `feature-adaptations.ts` — Current belt adaptation logic

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | UX Strategy | Initial draft |

---

*This document is a living strategy guide. Update as implementation progresses and user feedback is gathered.*
