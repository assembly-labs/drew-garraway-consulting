# Stats Page PRD: Current State

**Version:** 1.1
**Last Updated:** January 27, 2026
**Status:** Implemented in Prototype (bjjj.pages.dev)

---

## Executive Summary

This document describes the **current implementation** of the Stats (Dashboard) page in the TOMO prototype. The Stats page is a single scrolling view that presents belt-adaptive training data visualizations, celebrating progress while keeping practitioners engaged through compelling data displays.

**Current State:**
- 20 active modules across 10 sections
- 18 component files implemented (2 deprecated)
- Belt-adaptive visibility working
- Mock data throughout (localStorage)

> **Deprecation Note (Jan 2026):** Modules 6.3 (YourProgress) and 6.4 (FoundationsProgress) were deprecated and replaced by the Tier 1 infographic modules in Section 4 (WeeklyProgressRing, CalendarHeatMap, DashboardSummaryCard, DefenseFocus).

---

## Page Architecture

### Layout Structure

```
┌─────────────────────────────────────────┐
│           HEADER (fixed)                │
│  [Avatar]     TOMO     [Profile Link]   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      HERO SECTION (70vh)        │   │
│  │  Breakthrough Hero OR           │   │
│  │  Hero Metric (belt-adaptive)    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   STYLE PROFILE (Blue+ only)    │   │
│  │   StyleFingerprint radar chart  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      WATCH OUT SECTION          │   │
│  │   Recent Rolls (submissions)    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    BELT-SPECIFIC MODULES        │   │
│  │   (varies by belt level)        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      ATTACK PROFILE             │   │
│  │   (Blue+ only)                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      AI CALLOUTS                │   │
│  │   What's Working / Focus Area   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   TOURNAMENT READINESS          │   │
│  │   (confirmation required)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   LOCKED FEATURES FOOTER        │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│           TAB BAR (fixed)               │
│  [Stats] [Journal] [Log] [Tech] [More]  │
└─────────────────────────────────────────┘
```

### Scroll Behavior

- Single continuous scroll
- Full-bleed sections with generous padding
- Sticky header with transparent fade
- Tab bar fixed at bottom (44px safe area)

---

## Module Inventory (Current State)

### Section 1: Hero Area

| ID | Module | Component | Purpose | Belt Access | Status |
|----|--------|-----------|---------|-------------|--------|
| **1.1** | Breakthrough Hero | `BreakthroughHero.tsx` | Auto-celebrate milestones | All | Done |
| **1.2** | Hero Metric | Dashboard.tsx (inline) | Primary stat for belt | All (adaptive) | Done |

#### Breakthrough Hero

**Location:** `/prototype/src/components/ui/BreakthroughHero.tsx`

**Trigger:** Displays when `detectBreakthroughs()` returns a breakthrough from the user's recent activity.

**Visual:** Full-width hero (70vh) with:
- Icon based on breakthrough type (Trophy, Flame, Target, Shield, etc.)
- Large headline ("NEW MILESTONE")
- Breakthrough title
- Description text
- Dismiss button

**Breakthrough Types:**
```typescript
type BreakthroughType =
  | 'streak'          // Training streak milestone
  | 'technique'       // Technique mastery
  | 'consistency'     // Consistency achievement
  | 'survival'        // Defense improvement
  | 'efficiency'      // Attack efficiency
  | 'volume'          // Training volume
  | 'growth'          // General progress
  | 'milestone';      // Generic milestone
```

**Data Required:**
- `sessions[]` - Training session history
- `achievements[]` - Detected milestones
- `user.belt` - For message personalization

---

#### Hero Metric

**Location:** Dashboard.tsx (inline, lines ~53-92)

**Purpose:** Show the single most important stat for the user's belt level.

**Belt Adaptation:**

| Belt | Primary Metric | Display |
|------|----------------|---------|
| White | Session streak | "7 day streak" with fire icon |
| Blue | Technique variety | "23 techniques" practiced |
| Purple | Sparring rounds | "127 rounds" this month |
| Brown/Black | Teaching sessions | "12 sessions" taught |

**Data Required:**
- `sessions[]` - Session history
- `user.belt` - Belt level
- `sparringRounds` - Total rounds (derived)
- `techniquesDrilled[]` - Unique techniques (derived)

---

### Section 2: Style Profile (Blue+ Only)

| ID | Module | Component | Purpose | Belt Access | Status |
|----|--------|-----------|---------|-------------|--------|
| **2.1** | Style Fingerprint | `StyleFingerprint.tsx` | 6-axis radar chart | Blue+ (20+ sessions) | Done |

#### Style Fingerprint

**Location:** `/prototype/src/components/ui/StyleFingerprint.tsx`

**Purpose:** Visualize grappling style across 6 dimensions as a radar chart.

**Visual:**
- Radar chart with 6 axes
- Gold fill for user's profile
- Grid lines at 25/50/75/100%
- Archetype badge (e.g., "BACK HUNTER")
- Balance score (0-100)

**6 Dimensions:**

| Dimension | Data Source | Calculation |
|-----------|-------------|-------------|
| Guard Game | Sweeps logged, guard subs | Frequency + success rate |
| Passing | Guard passes logged | Frequency + style analysis |
| Top Control | Mount/side control work | Time in top positions |
| Back Attacks | Back takes, finishes | Frequency + conversion |
| Takedowns | Standing game logged | Takedown attempts + success |
| Leg Locks | Leg attack activity | Attempts + finishes |

**Archetypes Detected:**
- "BACK HUNTER" - >40% back attacks
- "GUARD PLAYER" - >40% guard game
- "PRESSURE PASSER" - >40% passing
- "LEG LOCKER" - >30% leg locks
- "WELL-ROUNDED" - Balanced profile

**Lock State:**
- Greyed out until 20 sessions
- Progress bar shows sessions remaining
- Text: "Log X more sessions to unlock your Style Profile"

**Data Required:**
```typescript
interface StyleProfileInput {
  guardGame: number;      // 0-100
  passing: number;        // 0-100
  topControl: number;     // 0-100
  backAttacks: number;    // 0-100
  takedowns: number;      // 0-100
  legLocks: number;       // 0-100
}
```

---

### Section 3: Watch Out (All Belts)

| ID | Module | Component | Purpose | Belt Access | Status |
|----|--------|-----------|---------|-------------|--------|
| **3.1** | Recent Rolls | `RecentRolls.tsx` | Show submissions received | All | Done |

#### Recent Rolls

**Location:** `/prototype/src/components/features/stats-modules/RecentRolls.tsx`

**Purpose:** Show recent submissions received with coaching video links for improvement.

**Visual:**
- Section header: "WATCH OUT FOR"
- List of submissions received
- Each item shows: technique name, days ago, coaching link
- "Watch coaching video" CTA per item

**Belt Adaptation:**
| Belt | Submissions Shown |
|------|-------------------|
| White | Upper body only (Triangle, Armbar, RNC, Guillotine) |
| Blue | + Leg locks (Heel Hook, Ankle Lock, Kneebar) |
| Purple+ | All submission types |

**Data Required:**
```typescript
interface RecentSubmission {
  technique: string;
  daysAgo: number;
  coachingVideoId?: string;
}
```

---

### Section 4: White Belt Modules

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **4.1** | Weekly Progress Ring | `WeeklyProgressRing.tsx` | Apple Watch-style goal ring | Done |
| **4.2** | Calendar Heat Map | `CalendarHeatMap.tsx` | 13-week consistency grid | Done |
| **4.3** | Dashboard Summary Card | `DashboardSummaryCard.tsx` | Key stats display | Done |
| **4.4** | Defense Focus | `DefenseFocus.tsx` | Offense/defense charts | Done |

#### Weekly Progress Ring

**Location:** `/prototype/src/components/features/stats-modules/WeeklyProgressRing.tsx`

**Visual:**
- Circular progress ring (Apple Watch style)
- Sessions completed / goal
- Animated fill on mount
- Gold accent color

**Data Required:**
```typescript
interface WeeklyProgressInput {
  sessionsThisWeek: number;
  weeklyGoal: number;
}
```

---

#### Calendar Heat Map

**Location:** `/prototype/src/components/features/stats-modules/CalendarHeatMap.tsx`

**Visual:**
- GitHub-style heat map grid
- 13 weeks visible
- Intensity based on sessions per day
- Month labels along bottom

**Data Required:**
```typescript
interface CalendarHeatMapInput {
  sessionsByDate: Record<string, number>; // "2026-01-25": 1
  totalSessions: number;
  avgPerWeek: number;
}
```

---

#### Dashboard Summary Card

**Location:** `/prototype/src/components/features/stats-modules/DashboardSummaryCard.tsx`

**Visual:**
- 4-stat grid layout
- Belt badge with stripes
- Training start date context

**Stats Displayed:**
| Stat | Data Source |
|------|-------------|
| Total Sessions | `sessions.length` |
| Total Hours | `sum(sessions.durationMinutes) / 60` |
| Current Streak | `calculateStreak(sessions)` |
| Best Streak | `maxStreak` |

**Data Required:**
```typescript
interface SummaryInput {
  totalSessions: number;
  totalHours: number;
  currentStreak: number;
  bestStreak: number;
  belt: BeltLevel;
  stripes: number;
  trainingStartDate?: string;
}
```

---

#### Defense Focus

**Location:** `/prototype/src/components/features/stats-modules/DefenseFocus.tsx`

**Visual:**
- Toggle: Offense / Defense
- Horizontal bar charts
- Green for offense (subs given)
- Red for defense (subs received)

**Data Required:**
```typescript
interface DefenseFocusInput {
  submissionsGiven: { technique: string; count: number }[];
  submissionsReceived: { technique: string; count: number }[];
}
```

---

### Section 5: Blue Belt Modules

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **5.1** | Session Type Distribution | `SessionTypeDistribution.tsx` | Gi/nogi donut chart | Done |
| **5.2** | Sparring Pattern Analysis | `SparringPatternAnalysis.tsx` | Submission exchanges | Done |
| **5.3** | Achievement Timeline | `AchievementTimeline.tsx` | Journey milestones | Done |
| **5.4** | Technique Pairings | `TechniquePairings.tsx` | Co-occurrence analysis | Done |
| **5.5** | Blues Detector | `BluesDetector.tsx` | Dropout risk intervention | Done |

#### Session Type Distribution

**Location:** `/prototype/src/components/features/stats-modules/SessionTypeDistribution.tsx`

**Visual:**
- Animated donut chart
- Segments: Gi (blue), No-Gi (orange), Open Mat (gray), Drilling (green)
- Legend with percentages
- Center shows total sessions

**Data Required:**
```typescript
interface SessionTypeInput {
  gi: number;
  nogi: number;
  openmat: number;
  drilling?: number;
  competition?: number;
}
```

---

#### Sparring Pattern Analysis

**Location:** `/prototype/src/components/features/stats-modules/SparringPatternAnalysis.tsx`

**Visual:**
- Dual horizontal bar charts
- "Landed" (green) vs "Received" (red)
- Technique names on left axis
- Count values on right

**Data Required:**
```typescript
interface SparringPatternInput {
  exchanges: {
    technique: string;
    landed: number;
    received: number;
  }[];
}
```

---

#### Achievement Timeline

**Location:** `/prototype/src/components/features/stats-modules/AchievementTimeline.tsx`

**Visual:**
- Vertical timeline with nodes
- Icons for achievement types
- Date labels
- "Highlight" achievements get gold border

**Data Required:**
```typescript
interface Achievement {
  id: string;
  type: 'belt' | 'milestone' | 'streak' | 'technique' | 'competition';
  title: string;
  description: string;
  date: string;
  highlight?: boolean;
}
```

---

#### Technique Pairings

**Location:** `/prototype/src/components/features/stats-modules/TechniquePairings.tsx`

**Purpose:** Show which techniques are drilled together frequently.

**Visual:**
- Connection lines between technique pairs
- Thicker lines = more frequent pairing
- Focus on top 5-7 pairings

**Data Required:**
```typescript
interface TechniquePairingInput {
  techniqueHistory: {
    date: string;
    techniques: string[];
  }[];
}
```

---

#### Blues Detector

**Location:** `/prototype/src/components/features/stats-modules/BluesDetector.tsx`

**Purpose:** Detect dropout risk patterns and show supportive intervention.

**Trigger Conditions:**
| Signal | Threshold |
|--------|-----------|
| Attendance drop | >30% month-over-month |
| Gap since session | >14 days |
| Negative journal sentiment | 3+ negative entries |
| Time since promotion | 6-12 months |

**Visual:**
- Subtle banner (not alarming)
- Supportive message about plateau normalization
- Dismissible with "I'm okay" button
- Optional "Learn about Blue Belt Blues" link

**Data Required:**
```typescript
interface BluesDetectorInput {
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  daysSinceLastSession: number;
  daysSincePromotion: number;
  recentNotes: string[];
}
```

---

### Section 6: Purple+ Modules

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **6.1** | Your Journey | `YourJourney.tsx` | Multi-year progression + submission trends | Done |
| **6.2** | Technique Mastery | `TechniqueMastery.tsx` | Specialization depth by proficiency | Done |
| ~~**6.3**~~ | ~~Your Progress~~ | ~~`YourProgress.tsx`~~ | ~~Progress summary~~ | **DEPRECATED** |
| ~~**6.4**~~ | ~~Foundations Progress~~ | ~~`FoundationsProgress.tsx`~~ | ~~Foundation skills~~ | **DEPRECATED** |

> **Deprecation Note:** Modules 6.3 and 6.4 were replaced by the Tier 1 infographic modules in Section 4. The files still exist in the codebase but are NOT exported from `stats-modules/index.ts` and are NOT rendered in `Dashboard.tsx`.

#### Your Journey

**Location:** `/prototype/src/components/features/stats-modules/YourJourney.tsx`

**Visual:**
- Multi-year line chart showing progression
- Lifetime totals section
- Submission trends over time

**Data Required:**
```typescript
interface YourJourneyInput {
  yearlyData: {
    year: number;
    sessions: number;
    hours: number;
  }[];
  totalSessions: number;
  totalMinutes: number;
  sparringRounds: number;
  trainingStartDate: string;
  submissionsGiven: { technique: string; count: number }[];
}
```

---

#### Technique Mastery

**Location:** `/prototype/src/components/features/stats-modules/TechniqueMastery.tsx`

**Visual:**
- Specialization depth bars by position
- Primary / Secondary / Developing categories
- Success rate percentages

**Data Required:**
```typescript
interface TechniqueMasteryInput {
  mastery: {
    position: string;
    techniques: number;
    proficiencyLevel: 'learning' | 'developing' | 'advanced' | 'master';
    successRate: number;
  }[];
}
```

---

### Section 7: Attack Profile (Blue+ Only)

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **7.1** | Attack Profile | `AttackProfile.tsx` | Comprehensive submission story | Done |

#### Attack Profile

**Location:** `/prototype/src/components/features/AttackProfile.tsx`

**Visual Components:**

1. **Submission Treemap**
   - Body region breakdown (neck/arms/legs)
   - Percentage bars with color coding
   - Largest region gets prominence

2. **Your Weapons (Top 5 Given)**
   - Green progress bars
   - Technique name + count
   - Ranked by frequency

3. **Watch Out For (Top 5 Received)**
   - Red progress bars
   - Technique name + count
   - Ranked by frequency

4. **Specialist Nickname Banner**
   - Icon based on dominant style
   - Nickname (e.g., "HEAD HUNTER", "ARM COLLECTOR")
   - Description text
   - Opponent quote

5. **Stats Footer**
   - Total subs given
   - Total subs received
   - Win rate percentage

**Specialist Nicknames:**
| Profile | Trigger | Color |
|---------|---------|-------|
| HEAD HUNTER | >70% neck | Red |
| CHOKE ARTIST | >55% neck | Purple |
| ARM COLLECTOR | >45% arms | Amber |
| LEG LOCKER | >45% legs | Cyan |
| WRIST WRECKER | >25% wrists | Pink |
| THE COMPLETE GAME | Balanced | Green |
| THE BACKPACK | >30% RNC | Red |
| HUMAN SCISSORS | >30% Triangle | Purple |

**Data Required:**
```typescript
interface AttackProfileInput {
  submissionStats: {
    totalGiven: number;
    totalReceived: number;
    bodyHeatMap: {
      given: Record<BodyRegion, number>;
      received: Record<BodyRegion, number>;
    };
    techniqueBreakdown: {
      given: { technique: string; count: number }[];
      received: { technique: string; count: number }[];
    };
  };
  belt?: BeltLevel;
}
```

**Minimum Data:** Requires 10+ submissions to show full visualization.

---

### Section 8: AI Callouts (All Belts)

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **8.1** | What's Working | Dashboard.tsx (inline) | Positive insight | Done |
| **8.2** | Focus Area | Dashboard.tsx (inline) | Improvement focus | Done |

**Location:** Dashboard.tsx (inline, lines ~814-874)

**Visual:**
- Two callout cards
- "What's Working" - Green gradient left border
- "Focus Area" - Gold gradient left border
- Belt-specific messaging

**Belt Messages:**

| insightFocus | What's Working | Focus Area |
|--------------|----------------|------------|
| `survival_skills` | "You're building your foundation" | "Focus on escapes and position recognition" |
| `game_development` | "Your guard retention is improving" | "Develop 2-3 techniques you can chain" |
| `systems_thinking` | "Your depth of understanding is growing" | "Connect your positions into complete systems" |
| At-risk | "Every session you complete is a win" | "Showing up matters. Aim for one more session" |

---

### Section 9: Tournament Readiness (All Belts)

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **9.1** | Tournament Button | Dashboard.tsx (inline) | Entry CTA | Done |
| **9.2** | Confirmation Sheet | `TournamentConfirmationSheet.tsx` | Modal confirmation | Done |
| **9.3** | Tournament Readiness Card | `TournamentReadinessCard.tsx` | 4-pillar scoring | Done |

#### Tournament Readiness Card

**Location:** `/prototype/src/components/ui/TournamentReadinessCard.tsx`

**Purpose:** Assess competition preparedness across 4 pillars.

**4 Pillars:**

| Pillar | Weight | Data Source |
|--------|--------|-------------|
| Consistency | 25% | Streak, weekly goal adherence |
| Technical Breadth | 25% | Technique categories covered |
| Sparring Performance | 25% | Rounds, submission exchange rate |
| Competition Experience | 25% | Past competitions, matches, medals |

**Visual:**
- Overall readiness score (0-100)
- 4 pillar breakdown with individual scores
- Recommendations for improvement
- Color coding: Green (ready), Yellow (developing), Red (needs work)

**Data Required:**
```typescript
interface TournamentReadinessInput {
  belt: BeltLevel;
  currentStreak: number;
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  weeklyTarget: number;
  weeksHitTarget: number;
  totalWeeksTracked: number;
  techniquesLogged: number;
  techniqueCategories: {
    guards: number;
    passes: number;
    submissions: number;
    escapes: number;
    takedowns: number;
  };
  submissionsLanded: number;
  timesTapped: number;
  sparringRoundsThisMonth: number;
  totalCompetitions: number;
  totalMatches: number;
  competitionWins: number;
  medals: number;
  hasUpcomingCompetition: boolean;
  daysUntilCompetition?: number;
}
```

---

### Section 10: Locked Features Footer (All Belts)

| ID | Module | Component | Purpose | Status |
|----|--------|-----------|---------|--------|
| **10.1** | Locked Features Footer | `LockedFeaturesFooter.tsx` | Show what unlocks next | Done |

**Location:** `/prototype/src/components/features/stats-modules/LockedFeaturesFooter.tsx`

**Purpose:** Show upcoming features that unlock with progression.

**Locked Features:**

| Feature | Unlock Criteria |
|---------|-----------------|
| Style Fingerprint | Blue belt + 20 sessions |
| Competition Analytics | 3+ competitions logged |
| Teaching Tracker | Purple belt |
| Multi-Year View | 1+ year training |

**Visual:**
- Grid of locked feature cards
- Progress bars showing distance to unlock
- Feature name + unlock criteria
- Greyed out icon

---

## Module Visibility Matrix

| Module | White | Blue | Purple | Brown | Black |
|--------|-------|------|--------|-------|-------|
| Breakthrough Hero | YES | YES | YES | YES | YES |
| Hero Metric | YES | YES | YES | YES | YES |
| Style Fingerprint | NO | YES* | YES | YES | YES |
| Recent Rolls | YES | YES | YES | YES | YES |
| Weekly Progress Ring | YES | NO | NO | NO | NO |
| Calendar Heat Map | YES | NO | NO | NO | NO |
| Dashboard Summary | YES | NO | NO | NO | NO |
| Defense Focus | YES | NO | NO | NO | NO |
| Session Type Distribution | NO | YES | YES | YES | YES |
| Sparring Pattern Analysis | NO | YES | YES | YES | YES |
| Achievement Timeline | NO | YES | YES | YES | YES |
| Technique Pairings | NO | YES | NO | NO | NO |
| Blues Detector | NO | YES | NO | NO | NO |
| Your Journey | NO | NO | YES | YES | YES |
| Technique Mastery | NO | NO | YES | YES | YES |
| Attack Profile | NO | YES | YES | YES | YES |
| AI Callouts | YES | YES | YES | YES | YES |
| Tournament Readiness | YES | YES | YES | YES | YES |
| Locked Features Footer | YES | YES | YES | YES | YES |

*Requires 20+ sessions

---

## Data Flow Summary

### Data Sources

| Source | Data Type | Status |
|--------|-----------|--------|
| `UserProfileContext` | Profile data | Done |
| `localStorage` | Session history | Done |
| `useBeltPersonalization()` | Belt adaptations | Done |
| `detectBreakthroughs()` | Achievement detection | Done |

### Derived Calculations

| Calculation | Input | Output |
|-------------|-------|--------|
| Session streak | `sessions[].date` | `currentStreak: number` |
| Total hours | `sessions[].durationMinutes` | `totalHours: number` |
| Technique variety | `sessions[].techniquesDrilled[]` | `uniqueTechniques: number` |
| Submission ratio | `given / (given + received)` | `winRate: number` |
| Style dimensions | Multiple session fields | `StyleProfileInput` |

---

## Integration Status

| System | Status | Notes |
|--------|--------|-------|
| Belt personalization hook | 85% | Missing celebration thresholds |
| Module visibility | 100% | Working per matrix |
| Mock data | 100% | Comprehensive test data |
| Real data | 0% | Requires backend |
| Animations | 80% | Some modules need polish |

---

## File Locations

### Core Components

| Component | Path |
|-----------|------|
| Dashboard | `/prototype/src/components/features/Dashboard.tsx` |
| AttackProfile | `/prototype/src/components/features/AttackProfile.tsx` |
| StyleFingerprint | `/prototype/src/components/ui/StyleFingerprint.tsx` |
| BreakthroughHero | `/prototype/src/components/ui/BreakthroughHero.tsx` |
| TournamentReadinessCard | `/prototype/src/components/ui/TournamentReadinessCard.tsx` |

### Stats Modules Directory

```
/prototype/src/components/features/stats-modules/
├── AchievementTimeline.tsx
├── BluesDetector.tsx
├── CalendarHeatMap.tsx
├── DashboardSummaryCard.tsx
├── DefenseFocus.tsx
├── FoundationsProgress.tsx      # DEPRECATED - not exported/used
├── LockedFeaturesFooter.tsx
├── RecentRolls.tsx
├── SessionTypeDistribution.tsx
├── SparringPatternAnalysis.tsx
├── TechniqueMastery.tsx
├── TechniquePairings.tsx
├── TournamentConfirmationSheet.tsx
├── WeeklyProgressRing.tsx
├── YourJourney.tsx
├── YourProgress.tsx             # DEPRECATED - not exported/used
└── index.ts                     # Exports only active modules
```

---

## Design Specifications

### Colors

| Element | Color | Hex |
|---------|-------|-----|
| Background | Black | `#111111` |
| Accent | Gold | `#F5A623` |
| Positive | Green | `#22c55e` |
| Negative | Red | `#ef4444` |
| Text Primary | White | `#ffffff` |
| Text Secondary | Gray | `#9ca3af` |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Hero Numbers | Unbounded | 800-900 | 72-144px |
| Section Headers | Unbounded | 700 | 24-32px |
| Body | Inter | 500 | 14-16px |
| Labels | JetBrains Mono | 500-600 | 10-12px |

### Spacing

| Element | Value |
|---------|-------|
| Section padding | 24px |
| Card padding | 16-24px |
| Grid gap | 16px |
| Module margin-bottom | 32px |

---

## Known Issues & Limitations

1. **Mock Data Only** - All data is localStorage-based; real backend required for production
2. **No Real Transcription** - Voice logging uses mock transcription
3. **Celebration Thresholds** - Not implemented (planned per belt)
4. **Session Count Gating** - Some modules should lock until N sessions
5. **Performance** - Large session histories may cause lag

---

*Document maintained by UX Team. Last verified against codebase: January 27, 2026*
