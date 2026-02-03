# Stats Page PRD: Future State (Planned Features)

**Version:** 1.0
**Last Updated:** January 25, 2026
**Status:** Planned (Not Yet Implemented)
**Source:** STATS_MODULE_STRATEGY.md

---

## Executive Summary

This document describes the **planned future state** of the Stats (Dashboard) page based on the STATS_MODULE_STRATEGY.md vision. These features are designed to dramatically improve retention by telling belt-appropriate data stories.

### The Problem (Current State)

The current dashboard uses a competition-oriented framework that works for experienced practitioners but actively discourages vulnerable users:
- White belts (70-90% dropout) see "Subs Given: 0 / Submitted By: 47" — shame, not motivation
- Blue belts with imposter syndrome see leaderboards instead of validation
- Purple belts see technique lists instead of systems

### The Solution (Future State)

Implement **belt-adaptive modules** that tell fundamentally different data stories:

| Belt | Current Data Story | Future Data Story | Primary Emotion |
|------|-------------------|-------------------|-----------------|
| White | "You're losing" | "You're surviving. That's rare." | Encouragement |
| Blue | "Win/loss stats" | "Your game is forming. The plateau is normal." | Validation |
| Purple | "Technique counts" | "Your systems are connecting. Your teaching matters." | Mastery |

### Expected Impact

- **White belt retention:** +15-25%
- **Blue belt retention:** +10-20%
- **Purple belt engagement:** +20%
- **Overall NPS:** +12 points

---

## Planned Modules: White Belt

### 1. Survival Score (NEW - Primary Module)

**Priority:** P0 - Critical for retention
**Status:** Planned

**Purpose:** Replace competition metrics with defense-first visualization that validates the white belt experience.

**Data Story:** "You're lasting longer. That's how it starts."

**Visual Wireframe:**
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

**Data Required:**

| Field | Type | Source | Priority |
|-------|------|--------|----------|
| `avgRoundDuration` | number (seconds) | Session logs | Critical |
| `prevMonthAvgDuration` | number | Historical | Critical |
| `escapeAttempts` | number | Session logs | High |
| `escapeSuccessRate` | number (0-1) | Derived | High |
| `positionRecoveries` | number | Session logs | Medium |
| `percentileRank` | number | Vs. other white belts | Low |

**Props Interface:**
```typescript
interface SurvivalScoreProps {
  currentAvgDuration: number;    // seconds
  previousAvgDuration: number;   // seconds
  escapeSuccessRate: number;     // 0-1
  percentileRank: number;        // vs other white belts
  belt: 'white';
}
```

**Messaging Guidelines:**
- Always frame duration positively ("lasting longer" not "still getting tapped")
- Compare to self, not others (unless percentile is favorable)
- Use specific numbers ("4:23") not vague ("good")

---

### 2. Foundation Builder (NEW)

**Priority:** P0
**Status:** Planned

**Purpose:** Visual progress tracker for survival essentials with clear targets.

**Data Story:** "These are the building blocks. You're laying the foundation."

**Visual Wireframe:**
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

**Skill Categories (12 total):**

| Category | Skills (4 each) |
|----------|-----------------|
| Escapes | Hip escape, Bridge, Shrimp, Technical stand-up |
| Frames & Defense | Basic frame, Elbow-knee connection, Posture in guard, Grip fighting |
| Position Recognition | Guard ID, Mount ID, Side control ID, Back position ID |

**Progress States:**
- `not_started` - Empty circle
- `learning` - Half-filled circle
- `applied` - Checkmark (used in sparring)
- `solid` - Gold checkmark (consistent success)

**Data Required:**
```typescript
interface FoundationBuilderInput {
  foundationSkills: {
    id: string;
    name: string;
    category: 'escapes' | 'frames' | 'position_recognition';
    status: 'not_started' | 'learning' | 'applied' | 'solid';
  }[];
}
```

---

### 3. The Journey Timeline (NEW)

**Priority:** P1
**Status:** Planned

**Purpose:** Visual milestone tracker that positions progress against the dropout cliff.

**Data Story:** "Most quit by now. You're still here. That's rare."

**Visual Wireframe:**
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

### 4. Modules to HIDE for White Belts

The following existing modules should be **hidden** for white belts:

| Module | Reason |
|--------|--------|
| Sparring Grid (Subs Given/Received) | Creates shame with ~0 subs given |
| Deadliest Attack Card | They don't have one yet |
| Achilles Heel Card | Focus on survival, not weaknesses |
| Tournament Readiness | Not relevant for 12-24 months |
| Full Attack Profile | Overwhelming and discouraging |

---

## Planned Modules: Blue Belt

### 1. Game DNA (NEW - Primary Module)

**Priority:** P0
**Status:** Planned

**Purpose:** Visualize the emerging personal style that defines blue belt identity development.

**Data Story:** "Your game is forming. This is who you're becoming."

**Visual Wireframe:**
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

**Archetype Detection:**

| Archetype | Trigger |
|-----------|---------|
| `guard_player` | >60% bottom game |
| `top_player` | >60% top game |
| `wrestler` | High takedown frequency |
| `leg_locker` | Leg attack preference |
| `pressure_passer` | Pressure passing style |
| `well_rounded` | No dominant preference |

**Data Required:**
```typescript
interface GameDnaInput {
  topGameRatio: number;          // 0-100
  bottomGameRatio: number;       // 0-100
  preferredGuards: {
    type: string;
    frequency: number;
    status: 'primary' | 'secondary' | 'developing';
  }[];
  passingStyle: 'pressure' | 'speed' | 'distance' | 'mixed';
  submissionPreferences: string[];
}
```

---

### 2. Technique Web (NEW)

**Priority:** P1
**Status:** Planned

**Purpose:** Visualize attack chains, not isolated techniques — showing the "grammar" forming from "vocabulary."

**Data Story:** "You're not just learning moves. You're connecting them."

**Visual Wireframe:**
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
└─────────────────────────────────────────────────────────┘
```

**Data Required:**
```typescript
interface TechniqueWebInput {
  techniqueAttempts: {
    technique: string;
    timestamp: string;
    success: boolean;
  }[];
  chainSequences: string[][];  // Sequential attempts in same round
  chainSuccessRates: Record<string, number>;  // "armbar→triangle": 0.67
}
```

---

### 3. Pressure Meter (NEW)

**Priority:** P1
**Status:** Planned

**Purpose:** Normalize performance by opponent level, addressing imposter syndrome directly.

**Data Story:** "Getting tapped by white belts is normal. Here's how you're really doing."

**Visual Wireframe:**
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

**Data Required:**
```typescript
interface PressureMeterInput {
  performanceByOpponentBelt: {
    white: { wins: number; total: number };
    blue: { wins: number; total: number };
    purple: { wins: number; total: number };
  };
}
```

---

### 4. Hole Finder (NEW)

**Priority:** P1
**Status:** Planned

**Purpose:** Gap analysis with actionable recommendations — turning frustration into focus.

**Data Story:** "Here's what to work on. Specific, not vague."

**Visual Wireframe:**
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

### 5. Roll Context (UPGRADE to Existing)

**Priority:** P0
**Status:** Planned

**Purpose:** Add context to sparring stats so "losses" in flow rolling don't count against development.

**Problem:** Raw win/loss creates misleading signals. A purple belt working new techniques SHOULD lose.

**Roll Context Options:**
```typescript
type RollContext =
  | 'competition_prep'  // A-game, competing hard
  | 'flow_rolling'      // Light, exploratory
  | 'working_new_tech'  // Deliberately trying new moves
  | 'positional'        // Start from specific position
  | 'handicap'          // Giving advantages
  | 'recovery';         // Coming back from injury
```

**Key Insight:** Only "Competition Prep" rounds count toward performance metrics.

---

### 6. Enhanced Blues Detector (UPGRADE)

**Priority:** P0
**Status:** Partially Implemented

**Current State:** Basic implementation exists
**Planned Enhancement:** More sophisticated intervention system

**Additional Trigger Conditions:**

| Signal | Threshold | Intervention |
|--------|-----------|--------------|
| Performance anxiety keywords | "suck", "impostor", "quit" | Direct support message |
| Negative journal sentiment | AI-detected (3+ entries) | Supportive banner |

**Enhanced Intervention Examples:**

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

## Planned Modules: Purple Belt

### 1. System Mastery (NEW - Primary Module)

**Priority:** P0
**Status:** Planned

**Purpose:** Visualize position ecosystems, not technique lists — reflecting the "sentences not words" shift.

**Data Story:** "You're not collecting techniques. You're building systems."

**Visual Wireframe:**
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

**Data Required:**
```typescript
interface SystemMasteryInput {
  primarySystems: {
    name: string;
    nodes: {
      technique: string;
      type: 'entry' | 'attack' | 'transition' | 'position';
      connections: string[];
    }[];
    depth: number;
    successRate: number;
  }[];
}
```

---

### 2. Teaching Impact (NEW)

**Priority:** P0
**Status:** Planned

**Purpose:** Track contribution to the academy — validating the purple belt teaching role.

**Data Story:** "Teaching deepens your own understanding. Here's your impact."

**Visual Wireframe:**
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

**Data Required:**
```typescript
interface TeachingImpactInput {
  classesAssisted: number;
  techniquesTaught: string[];
  studentsHelped: number;
  studentFeedback?: {
    studentName: string;
    message: string;
  }[];
}
```

---

### 3. Efficiency Matrix (NEW)

**Priority:** P1
**Status:** Planned

**Purpose:** Track the shift from "bazooka" force to finesse and timing.

**Data Story:** "The bazooka doesn't work anymore. Finesse wins."

**Visual Wireframe:**
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
└─────────────────────────────────────────────────────────┘
```

---

### 4. The Long Game (NEW)

**Priority:** P1
**Status:** Planned (Similar to existing YourJourney.tsx)

**Purpose:** Multi-year progression view for practitioners with 4-7+ years invested.

**Data Story:** "Look how far you've come. This is who you are now."

**Lifetime Totals Display:**
- Mat hours
- Sessions logged
- Techniques tracked
- Sparring rounds
- Teaching sessions

---

### 5. Specialization Depth (NEW)

**Priority:** P1
**Status:** Planned (Similar to existing TechniqueMastery.tsx)

**Purpose:** Track mastery in signature positions that define purple belt identity.

**Visual:**
- Primary position (Master level)
- Secondary position (Advanced)
- Developing position (Learning)
- Success rates per position

---

## Future Module Visibility Matrix

| Module | White | Blue | Purple | Brown | Black |
|--------|-------|------|--------|-------|-------|
| **Survival Score** | ✓ PRIMARY | — | — | — | — |
| **Foundation Builder** | ✓ | — | — | — | — |
| **Journey Timeline** | ✓ | subtle | — | — | — |
| Day Streak | HIGH | MEDIUM | LOW | LOW | LOW |
| Sparring Grid | HIDE | ✓ | ✓ | ✓ | ✓ |
| Deadliest Attack | HIDE | ✓ | ✓ | ✓ | ✓ |
| Achilles Heel | HIDE | ✓ | HIDE | HIDE | HIDE |
| **Game DNA** | — | ✓ PRIMARY | ✓ | ✓ | ✓ |
| **Technique Web** | — | ✓ | ✓ | ✓ | ✓ |
| **Pressure Meter** | — | ✓ | — | — | — |
| **Hole Finder** | — | ✓ | subtle | — | — |
| **Roll Context** | — | ✓ | ✓ | ✓ | ✓ |
| Blues Detector | — | conditional | — | — | — |
| Tournament Readiness | HIDE | ✓ | ✓ | ✓ | ✓ |
| **System Mastery** | — | — | ✓ PRIMARY | ✓ | ✓ |
| **Teaching Impact** | — | — | ✓ | ✓ PRIMARY | ✓ PRIMARY |
| **Efficiency Matrix** | — | — | ✓ | ✓ | ✓ |
| **Long Game** | — | — | ✓ | ✓ | ✓ |
| **Specialization** | — | — | ✓ | ✓ | ✓ |
| Breakthrough List | ✓ | ✓ | ✓ | ✓ | ✓ |

**Legend:**
- **Bold** = New module (not yet implemented)
- ✓ PRIMARY = Hero/main module for that belt
- ✓ = Visible
- — = Not shown
- HIDE = Explicitly hidden
- subtle = Shown but de-emphasized
- conditional = Only shown when triggered

---

## Data Requirements Summary

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

---

## Session Log Schema Updates Required

```typescript
interface EnhancedSessionLog {
  // Existing fields...

  // NEW fields for belt-adaptive modules
  roundDetails?: {
    partnerName?: string;
    partnerBelt?: BeltLevel;
    duration: number;           // seconds
    outcome?: 'submission_given' | 'submission_received' | 'positional' | 'draw';
    submissionType?: string;
    context: RollContext;       // NEW: competition_prep, flow, new_tech, etc.
  }[];

  escapeAttempts?: number;      // NEW
  escapeSuccesses?: number;     // NEW
  positionTimeBreakdown?: {     // NEW
    position: string;
    seconds: number;
  }[];

  teachingNotes?: string;       // NEW
  studentsHelped?: string[];    // NEW
  techniquesTaught?: string[];  // NEW

  energyLevel?: 1 | 2 | 3 | 4 | 5;
  sentimentScore?: number;      // AI-derived
}
```

---

## Implementation Roadmap

### Phase 1: Retention Critical (White Belt)

**Priority:** P0

| Task | Dependencies |
|------|--------------|
| Create `SurvivalScore` component | Round duration data |
| Create `FoundationBuilder` component | Skill progress schema |
| Create `JourneyTimeline` component | Milestone definitions |
| Update `useBeltPersonalization` hook | — |
| Add module visibility logic | Hook updates |
| Hide competition modules for white | Visibility matrix |

### Phase 2: Identity Development (Blue Belt)

**Priority:** P0

| Task | Dependencies |
|------|--------------|
| Create `GameDNA` component | Position tracking |
| Create `TechniqueWeb` component | Chain detection |
| Create `PressureMeter` component | Partner belt tracking |
| Create `HoleFinder` component | Gap detection |
| Add `rollContext` to session logs | Schema update |
| Enhance `BluesDetector` | Sentiment analysis |

### Phase 3: Systems Thinking (Purple Belt)

**Priority:** P1

| Task | Dependencies |
|------|--------------|
| Create `SystemMastery` component | System schema |
| Create `TeachingImpact` component | Teaching tracking |
| Create `EfficiencyMatrix` component | Historical data |
| Enhance `LongGame` component | Multi-year aggregation |
| Enhance `Specialization` component | Position depth |

### Phase 4: Polish & Integration

**Priority:** P1

| Task |
|------|
| Animation and transitions |
| Accessibility audit |
| Performance optimization |
| A/B testing setup |
| Documentation |

---

## Success Metrics

### Primary Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| White belt 6-month retention | ~25% | 35% |
| Blue belt 12-month retention | ~50% | 65% |
| Purple belt engagement | — | +20% |
| NPS score | — | +12 points |

### Secondary Metrics

| Metric | Target |
|--------|--------|
| Time spent in STATS | +30% |
| Module interaction rate | 60%+ |
| Positive sentiment in feedback | 80%+ |
| Plateau recovery rate | Track |

---

## Open Questions

### Product Questions

1. **Should we show comparative data?**
   - Recommendation: Opt-in, show only favorable comparisons

2. **How explicit should the Blues Detector be?**
   - Recommendation: Start subtle, A/B test

3. **Should teaching impact require student confirmation?**
   - Recommendation: Self-reported first, add confirmation later

### Technical Questions

1. **How do we detect technique chains?**
   - Recommendation: Hybrid (time proximity + AI inference)

2. **How do we calculate sentiment from journals?**
   - Recommendation: Start simple (keywords), enhance with LLM

3. **How do we handle historical data for existing users?**
   - Recommendation: Graceful degradation, show what's available

---

## Comparison: Current vs Future State

| Aspect | Current State | Future State |
|--------|---------------|--------------|
| **White Belt Focus** | Competition stats (discouraging) | Survival metrics (encouraging) |
| **Blue Belt Focus** | Raw win/loss | Game identity + context |
| **Purple Belt Focus** | Technique counts | Systems + teaching impact |
| **Data Story** | "Here are your stats" | "Here's your journey" |
| **Emotional Design** | Neutral/competitive | Belt-appropriate emotions |
| **Dropout Prevention** | None | Blues Detector + interventions |
| **Session Context** | All rolls equal | Roll context matters |
| **Partner Tracking** | None | Partner belt level |
| **Teaching Tracking** | None | Full teaching impact |

---

*Document maintained by UX Team. Source: STATS_MODULE_STRATEGY.md*
*Last Updated: January 25, 2026*
