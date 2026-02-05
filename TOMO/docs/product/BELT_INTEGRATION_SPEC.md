# Belt Personalization Integration Specification

**Last Updated:** February 3, 2026
**Purpose:** Developer reference for integrating belt personalization across all TOMO features
**Audience:** Developers implementing belt-aware UI and AI features

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Implementation Status](#implementation-status)
3. [System Architecture](#system-architecture)
4. [Page-by-Page Integration Contracts](#page-by-page-integration-contracts)
   - [Dashboard (Stats)](#1-dashboard-stats)
   - [Insights Page](#2-insights-page)
   - [Techniques Page](#3-techniques-page)
   - [Session Logger](#4-session-logger)
   - [Session History (Journal)](#5-session-history-journal)
   - [Session Detail](#6-session-detail)
   - [Belt Progress](#7-belt-progress)
   - [Profile & Settings](#8-profile--settings)
5. [AI Integration Points](#ai-integration-points)
6. [Data Flow Diagram](#data-flow-diagram)
7. [Hook Reference](#hook-reference)
8. [Testing Belt Personalization](#testing-belt-personalization)

---

## Executive Summary

TOMO's belt personalization system adapts the entire app experience based on the user's belt level. A white belt user sees different metrics, messaging, and modules than a purple belt user.

**The Core Principle:** Belt psychology shapes everything. White belts need survival focus and habit formation. Blue belts need breadth and plateau support. Purple+ belts need depth and systems thinking.

**The Algorithm:** User's belt level → Psychology profile → Feature adaptations → UI rendering

**The Hook:** All components access personalization via `useBeltPersonalization()` which returns:
- `profile` — Psychology profile (struggles, motivations, plateaus)
- `dashboard` — Dashboard-specific adaptations
- `sessionLogger` — Logger-specific adaptations
- `chatbot` — AI/chatbot tone and vocabulary
- `videoTutorials` — Video recommendation settings
- `beltProgress` — Progress screen adaptations
- `profiling` — Progressive profiling settings
- `analyzeJournal()` — Journal text analysis function
- Helper functions for risk detection, sentiment, prompts

---

## Implementation Status

> **Quick Reference:** What's done, what's partial, what's needed

| Page/Module | Uses Belt System | Integration Depth | Status | Priority |
|-------------|------------------|-------------------|--------|----------|
| **Dashboard** | Yes | 70% | Module gating + primary metric done; celebration thresholds, streak emphasis, comp stats missing | P1 |
| **Stats Modules** | Partial | 60% | Module gating done, celebration thresholds missing | P1 |
| **Insights (TrainingFeedback)** | Partial | 25% | Hook imported, uses `getPostSessionMessage()`; tone/risk/vocabulary not implemented | P1 |
| **Techniques (For You)** | Yes | 45% | Basic filtering + belt recommendations; difficulty range, defense priority, playlist names missing | P1 |
| **Techniques (Browse)** | No | 0% | No belt filtering on browse categories | P2 |
| **Session Logger** | Partial | 55% | Post-session message + belt prompts done; field visibility, technique count, default duration missing | P1 |
| **Session History** | Partial | 35% | Hook imported, basic rendering adapts; card complexity, field visibility, filter options missing | P1 |
| **Session Detail** | No | 0% | No belt-specific field visibility | P2 |
| **Belt Progress** | Partial | 50% | Belt visualization + plateau detection done; plateau guidance display, time estimates, motivational framing missing | P1 |
| **Profile Screen** | Partial | 25% | Progressive profiling exists; belt-adapted question timing, question style not implemented | P2 |
| **Settings** | N/A | - | Demo mode only, not user-facing | - |
| **AI/Chatbot** | Designed | 0% | Full spec exists, not implemented | P1 |
| **Risk Detection** | Designed | 0% | Full spec exists, not implemented | P1 |
| **Re-engagement** | Designed | 0% | Full spec exists, not implemented | P1 |

**Overall Average Integration Depth: ~39%** (across 8 measurable components)

### Legend
- **Uses Belt System** — Component imports `useBeltPersonalization`
- **Integration Depth** — % of available adaptations actually used
- **Priority** — P1 = Must fix before developer handoff, P2 = Important but not blocking

---

## System Architecture

### File Locations

```
/prototype/src/config/belt-system/
├── types.ts              # TypeScript interfaces
├── belt-profiles.ts      # Psychology profiles (5 belts)
├── feature-adaptations.ts # UI adaptations per feature
├── risk-signals.ts       # Dropout detection rules
├── journal-patterns.ts   # Journal text analysis
└── index.ts              # Central exports

/prototype/src/hooks/
└── useBeltPersonalization.ts  # React integration hook
```

### The Personalization Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Profile   │────▶│  Belt Selection  │────▶│  useBeltPerson- │
│  (localStorage) │     │  (white/blue/    │     │  alization()    │
│                 │     │   purple/brown)  │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌─────────────────────────────────┼─────────────────────────────────┐
                        │                                 │                                 │
                        ▼                                 ▼                                 ▼
               ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
               │  profile        │              │  dashboard      │              │  chatbot        │
               │  ─────────────  │              │  ─────────────  │              │  ─────────────  │
               │  stageName      │              │  primaryMetric  │              │  toneProfile    │
               │  struggles[]    │              │  insightFocus   │              │  responseDepth  │
               │  motivations[]  │              │  streakEmphasis │              │  vocabulary     │
               │  plateaus[]     │              │  celebration    │              │  avoidTopics[]  │
               │  riskWindow     │              │  showCompStats  │              │  emphasizeTopics│
               └─────────────────┘              └─────────────────┘              └─────────────────┘
                        │                                 │                                 │
                        └─────────────────────────────────┼─────────────────────────────────┘
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │   UI RENDERS    │
                                                │   Belt-Adapted  │
                                                │   Experience    │
                                                └─────────────────┘
```

---

## Page-by-Page Integration Contracts

### 1. Dashboard (Stats)

**Location:** `/prototype/src/components/features/Dashboard.tsx`

**Hook:** `useBeltPersonalization()` → `{ dashboard, profile }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple Belt | Brown/Black |
|--------|------------|-----------|-------------|-------------|
| **Primary Metric** | `session_streak` | `technique_variety` | `sparring_rounds` | `teaching_sessions` |
| **Streak Emphasis** | HIGH (big visual) | MEDIUM | MEDIUM | LOW |
| **Show Competition Stats** | NO | YES | YES | YES |
| **Insight Focus** | "survival_skills" | "game_development" | "systems_thinking" | "refinement" |
| **Celebration Threshold** | Every 10 sessions | Every 25 sessions | Every 50 sessions | Every 100 sessions |

#### Visible Modules by Belt

| Module | White | Blue | Purple+ |
|--------|-------|------|---------|
| WeeklyProgressRing | YES | NO | NO |
| CalendarHeatMap | YES | YES | YES |
| DashboardSummaryCard | YES | YES | YES |
| DefenseFocus | YES | NO | NO |
| SessionTypeDistribution | NO | YES | YES |
| SparringPatternAnalysis | NO | YES | YES |
| AchievementTimeline | NO | YES | YES |
| TechniquePairings | NO | YES | NO |
| BluesDetector | NO | YES | NO |
| YourJourney | NO | NO | YES |
| TechniqueMastery | NO | NO | YES |

#### Implementation Checklist

- [x] Primary metric switching based on `dashboard.primaryMetric`
- [x] Module visibility gating by belt level
- [x] Insight focus text from `dashboard.insightFocus`
- [ ] **TODO:** Celebration thresholds from `dashboard.celebrationThreshold`
- [ ] **TODO:** Streak visual emphasis from `dashboard.streakEmphasis`
- [ ] **TODO:** Competition stats visibility from `dashboard.showCompetitionStats`

#### Code Pattern

```typescript
const { dashboard, profile } = useBeltPersonalization();

// Primary metric
const heroMetric = dashboard.primaryMetric; // 'session_streak' | 'technique_variety' | etc.

// Module visibility
const showBluesDetector = profile.beltLevel === 'blue';
const showAdvancedAnalytics = ['purple', 'brown', 'black'].includes(profile.beltLevel);

// Celebration
if (sessionCount % dashboard.celebrationThreshold === 0) {
  showCelebration();
}
```

---

### 2. Insights Page

**Location:** `/prototype/src/components/features/TrainingFeedback.tsx`

**Hook:** `useBeltPersonalization()` → `{ chatbot, profile, analyzeJournal }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Tone** | Warm, supportive, gentle | Coaching, balanced | Peer-level, analytical |
| **Encouragement Level** | HIGH | MODERATE | MINIMAL |
| **Technical Vocabulary** | Basic (position names, tapping) | Intermediate (guards, passing) | Advanced (systems, entries) |
| **Response Depth** | Simple (1-2 sentences) | Moderate (paragraph) | Detailed (analysis) |
| **Topics to Emphasize** | Survival, escapes, relaxation | Game development, combinations | Systems thinking, teaching |
| **Topics to Avoid** | Advanced leg locks, berimbolo | None | None |

#### AI Insight Generation Rules

```
IF user.belt === 'white':
  - Lead with encouragement
  - Use simple terminology
  - Focus on one actionable takeaway
  - Never mention submissions user hasn't logged
  - Always suggest asking coach

IF user.belt === 'blue':
  - Balance encouragement with analysis
  - Reference technique connections
  - Mention plateau normalization if detected
  - Suggest breadth expansion

IF user.belt >= 'purple':
  - Lead with data/pattern
  - Use full BJJ vocabulary
  - Discuss systems and chains
  - Treat as peer conversation
```

#### Risk-Aware Messaging

When `checkRiskSignals()` returns elevated risk:

| Risk Signal | White Belt Response | Blue Belt Response |
|-------------|--------------------|--------------------|
| Extended gap (14+ days) | "We noticed you've been away..." | "Blue belt blues are real..." |
| Declining attendance | "Consistency beats intensity" | "Plateaus are part of the process" |
| Negative sentiment | "BJJ is hard. That's the point." | "Every blue belt goes through this" |
| Injury mention | "Rest is training too" | "Smart training is sustainable" |

#### Implementation Checklist

- [x] Belt-appropriate tone in AI responses
- [x] Coach deferral in all insights
- [ ] **TODO:** Risk-aware messaging integration
- [ ] **TODO:** Vocabulary level enforcement
- [ ] **TODO:** Topics to avoid filtering
- [ ] **TODO:** Response depth calibration

#### Code Pattern

```typescript
const { chatbot, profile, analyzeJournal } = useBeltPersonalization();

// Tone configuration for AI prompt
const aiPromptContext = {
  tone: chatbot.toneProfile, // { warmth: 'high', directness: 'low', formality: 'casual' }
  vocabulary: chatbot.technicalVocabulary,
  encouragementLevel: chatbot.encouragementLevel,
  avoidTopics: chatbot.avoidTopics,
  emphasizeTopics: chatbot.emphasizeTopics,
};

// Journal analysis
const analysis = analyzeJournal(sessionId, journalText);
// Returns: { patterns, sentiment, riskSignals, beltContextualizedResponse }
```

---

### 3. Techniques Page

**Location:** `/prototype/src/components/features/TechniqueLibrary.tsx`

**Hook:** `useBeltPersonalization()` → `{ videoTutorials, profile }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Recommended Categories** | Escapes, basics, closed guard | Guard systems, passing, subs | Advanced guards, leg locks |
| **Difficulty Range** | 1-3 | 2-5 | 4-10 |
| **Prioritize Defense** | YES | NO | NO |
| **Include Conceptual** | NO | YES | YES |
| **Weekly Recommendations** | 3 videos | 5 videos | 3 videos (quality) |
| **Playlist Name** | "White Belt Essentials" | "Blue Belt Development" | "Purple Belt Systems" |

#### "For You" Algorithm

```
1. Get user's recent journal entries (last 10 sessions)
2. Extract techniques mentioned
3. Cross-reference with struggles logged
4. Apply belt filters:
   - Filter to difficulty range: videoTutorials.difficultyRange
   - Filter to categories: videoTutorials.recommendedCategories
   - If prioritizeDefense: weight defensive content 2x
5. If user logged getting caught by X submission:
   - Recommend "X defense" videos (belt-appropriate level)
6. Return top N videos where N = videoTutorials.weeklyRecommendationCount
```

#### "Browse" Category Visibility

| Category | White | Blue | Purple+ |
|----------|-------|------|---------|
| Closed Guard | YES | YES | YES |
| Half Guard | YES | YES | YES |
| Open Guard | BASIC | YES | YES |
| Mount | YES | YES | YES |
| Side Control | YES | YES | YES |
| Back Control | YES | YES | YES |
| Guard Passing | YES | YES | YES |
| Takedowns | YES | YES | YES |
| Leg Locks | NO | BASIC | YES |
| Advanced Systems | NO | NO | YES |
| Competition Strategy | NO | YES | YES |
| Teaching | NO | NO | YES |

#### Implementation Checklist

- [x] Basic "For You" recommendations
- [x] Video embed functionality
- [ ] **TODO:** Difficulty range filtering from `videoTutorials.difficultyRange`
- [ ] **TODO:** Category filtering in Browse view
- [ ] **TODO:** Defense prioritization for white belts
- [ ] **TODO:** Weekly recommendation count enforcement
- [ ] **TODO:** Belt-specific playlist names

#### Code Pattern

```typescript
const { videoTutorials, profile } = useBeltPersonalization();

// Filter videos
const filteredVideos = allVideos.filter(video => {
  const inDifficultyRange =
    video.difficulty >= videoTutorials.difficultyRange.min &&
    video.difficulty <= videoTutorials.difficultyRange.max;

  const inRecommendedCategory =
    videoTutorials.recommendedCategories.includes(video.category);

  return inDifficultyRange && inRecommendedCategory;
});

// Apply defense priority for white belts
if (videoTutorials.prioritizeDefense) {
  filteredVideos.sort((a, b) =>
    (b.isDefensive ? 1 : 0) - (a.isDefensive ? 1 : 0)
  );
}
```

---

### 4. Session Logger

**Location:** `/prototype/src/components/features/VoiceFirstLogger.tsx`

**Hook:** `useBeltPersonalization()` → `{ sessionLogger, profile, getPostSessionMessage }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Prompt Style** | Encouraging | Neutral | Analytical |
| **Technique Suggestions** | 5 | 10 | 15-20 |
| **Show Advanced Fields** | NO | YES | YES |
| **Sparring Emphasis** | LOW | MEDIUM | HIGH |
| **Default Duration** | 60 min | 90 min | 90-120 min |
| **Post-Session Message** | "Great work showing up..." | "Session logged. Keep developing..." | "Logged. Your depth grows..." |

#### Field Visibility by Belt

| Field | White | Blue | Purple+ |
|-------|-------|------|---------|
| Training type | YES | YES | YES |
| Duration | YES | YES | YES |
| Sparring Y/N | YES | YES | YES |
| Techniques drilled | YES | YES | YES |
| Submissions given | NO | YES | YES |
| Submissions received | NO | YES | YES |
| Positional time | NO | NO | YES |
| Intensity rating | NO | YES | YES |
| Teaching notes | NO | NO | YES |

#### Voice Prompts by Belt

**White Belt Prompts:**
- "What did you work on today?"
- "How did sparring go?" (if sparring = yes)
- "Anything click for you today?"

**Blue Belt Prompts:**
- "What techniques did you drill?"
- "How did your rounds go?"
- "What's working? What's not?"

**Purple+ Belt Prompts:**
- "What was your focus?"
- "Sparring observations?"
- "Any teaching moments?"

#### Implementation Checklist

- [x] Post-session message from `getPostSessionMessage()`
- [ ] **TODO:** Prompt style adaptation from `sessionLogger.promptStyle`
- [ ] **TODO:** Field visibility by belt
- [ ] **TODO:** Technique suggestion count from `sessionLogger.suggestedTechniqueCount`
- [ ] **TODO:** Default duration from `sessionLogger.defaultDuration`

#### Code Pattern

```typescript
const { sessionLogger, profile, getPostSessionMessage } = useBeltPersonalization();

// Field visibility
const showAdvancedFields = sessionLogger.showAdvancedFields;
const showSubmissions = ['blue', 'purple', 'brown', 'black'].includes(profile.beltLevel);

// Technique suggestions
const maxSuggestions = sessionLogger.suggestedTechniqueCount;

// Post-session
const successMessage = getPostSessionMessage();
```

---

### 5. Session History (Journal)

**Location:** `/prototype/src/components/features/SessionHistory.tsx`

**Hook:** `useBeltPersonalization()` → `{ profile }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Card Complexity** | Simple | Standard | Full |
| **Fields Shown** | Date, type, duration, notes | + Techniques, sparring, outcomes | + Submissions, analysis |
| **Filter Options** | Type only | Type, sparring | Type, sparring, position |

#### Card Complexity Detail

**White Belt Card:**
```
┌─────────────────────────────────┐
│ Tuesday, Jan 14                 │
│ Gi • 60 min                     │
│ ─────────────────────────────── │
│ "Worked on escapes from mount"  │
└─────────────────────────────────┘
```

**Blue Belt Card:**
```
┌─────────────────────────────────┐
│ Tuesday, Jan 14                 │
│ Gi • 90 min • 5 rounds          │
│ ─────────────────────────────── │
│ Techniques: Hip escape, Kimura  │
│ ─────────────────────────────── │
│ "Getting better at guard..."    │
└─────────────────────────────────┘
```

**Purple+ Belt Card:**
```
┌─────────────────────────────────┐
│ Tuesday, Jan 14                 │
│ Gi • 90 min • 5 rounds          │
│ ─────────────────────────────── │
│ Focus: Half guard retention     │
│ Subs: 2 given / 1 received      │
│ ─────────────────────────────── │
│ "Working the underhook..."      │
└─────────────────────────────────┘
```

#### Implementation Checklist

- [x] Hook imported
- [ ] **TODO:** Card complexity switching by belt
- [ ] **TODO:** Field visibility in cards
- [ ] **TODO:** Filter options by belt

#### Code Pattern

```typescript
const { profile } = useBeltPersonalization();

// Card complexity
const cardVariant = {
  white: 'simple',
  blue: 'standard',
  purple: 'full',
  brown: 'full',
  black: 'full',
}[profile.beltLevel];

// Field visibility
const showSubmissions = ['purple', 'brown', 'black'].includes(profile.beltLevel);
const showTechniqueList = ['blue', 'purple', 'brown', 'black'].includes(profile.beltLevel);
```

---

### 6. Session Detail

**Location:** `/prototype/src/components/features/SessionDetail.tsx`

**Hook:** `useBeltPersonalization()` → `{ profile, analyzeJournal }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Sections Shown** | Overview, Notes | + Techniques, Sparring | + Analysis, Patterns |
| **AI Analysis** | None | Basic patterns | Full analysis |
| **Edit Complexity** | Simple form | Standard form | Advanced form |

#### Implementation Checklist

- [ ] **TODO:** Section visibility by belt
- [ ] **TODO:** AI analysis integration for blue+
- [ ] **TODO:** Edit form complexity

---

### 7. Belt Progress

**Location:** `/prototype/src/components/features/BeltProgress.tsx`

**Hook:** `useBeltPersonalization()` → `{ beltProgress, profile, currentPlateau }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Show Time Estimate** | NO | YES | NO |
| **Requirements Emphasis** | Technical | Balanced | Subjective |
| **Milestone Granularity** | Stripes | Both | Skills |
| **Comparison Benchmark** | NONE | Average | NONE |

#### Motivational Framing

| Belt | Framing Message |
|------|-----------------|
| White | "Focus on showing up consistently. Every class builds your foundation." |
| Blue | "You have the fundamentals. Now develop your personal style and game." |
| Purple | "Purple belt is where you develop your BJJ identity. Teach to deepen understanding." |
| Brown | "The final approach. Refine what you have, close remaining gaps." |

#### Plateau Display

When `currentPlateau` is detected, show contextual support:

```typescript
if (currentPlateau) {
  // Show: "You're in a common plateau phase for [belt] belts"
  // Display: currentPlateau.symptoms
  // Suggest: currentPlateau.breakThroughStrategies
}
```

#### Implementation Checklist

- [x] Basic belt visualization
- [x] Plateau detection (retrieves data)
- [ ] **TODO:** Plateau guidance display
- [ ] **TODO:** Time estimate conditional display
- [ ] **TODO:** Motivational framing from `beltProgress.motivationalFraming`
- [ ] **TODO:** Requirements emphasis switching

---

### 8. Profile & Settings

**Location:** `/prototype/src/components/features/ProfileScreen.tsx`

**Hook:** `useBeltPersonalization()` → `{ profiling, profile }`

#### Belt Adaptations

| Aspect | White Belt | Blue Belt | Purple+ |
|--------|------------|-----------|---------|
| **Question Timing** | Delayed | Standard | Early |
| **Question Style** | Friendly | Friendly | Professional |
| **Skip Tolerance** | 3 | 3 | 2 |
| **Priority Questions** | trainingStartDate, targetFrequency | gymName, goals | currentBeltDate |

#### Progressive Profiling Schedule

Questions are asked at specific session milestones, adapted by belt:

| Session | Question | White Delay | Blue/Purple+ |
|---------|----------|-------------|--------------|
| 3 | Training start date | Session 5 | Session 3 |
| 5 | Stripes count | Session 7 | Session 5 |
| 7 | Gym name | Session 10 | Session 7 |
| 10 | Training goals | Session 15 | Session 10 |
| 12 | Target frequency | Session 18 | Session 12 |
| 15 | Current belt date | Session 20 | Session 15 |

#### Implementation Checklist

- [x] Progressive profiling system
- [x] Skip tolerance
- [ ] **TODO:** Belt-adapted question timing
- [ ] **TODO:** Question style adaptation

---

## AI Integration Points

### Where AI Connects to Belt Personalization

| AI Feature | Belt System Integration | Hook Properties Used |
|------------|------------------------|----------------------|
| **Voice Transcription** | BJJ vocabulary by belt level | `chatbot.technicalVocabulary` |
| **Session Extraction** | Field expectations by belt | `sessionLogger.showAdvancedFields` |
| **Insight Generation** | Tone, depth, topics | `chatbot.*` |
| **Journal Analysis** | Pattern detection, sentiment | `analyzeJournal()` |
| **Risk Detection** | Belt-specific thresholds | Risk signals system |
| **Re-engagement** | Belt-appropriate messaging | `profile.stageName`, risk multipliers |
| **Video Recommendations** | Difficulty, categories | `videoTutorials.*` |

### AI Prompt Engineering by Belt

When generating AI responses, include belt context:

```typescript
const { chatbot, profile } = useBeltPersonalization();

const systemPrompt = `
You are a BJJ training assistant. The user is a ${profile.beltLevel} belt.

Tone: ${chatbot.toneProfile.warmth} warmth, ${chatbot.toneProfile.directness} directness
Vocabulary: ${chatbot.technicalVocabulary}
Encouragement: ${chatbot.encouragementLevel}

EMPHASIZE these topics: ${chatbot.emphasizeTopics.join(', ')}
AVOID these topics: ${chatbot.avoidTopics.join(', ')}

${profile.beltLevel === 'white' ? 'Keep responses simple. Focus on one takeaway.' : ''}
${profile.beltLevel === 'blue' ? 'Balance encouragement with analysis. Normalize plateaus.' : ''}
${profile.beltLevel === 'purple' ? 'Treat as peer. Discuss systems and concepts.' : ''}
`;
```

### Risk Detection Algorithm

```typescript
function calculateRiskScore(signal: RiskSignal, userBelt: BeltLevel): number {
  const baseScore = signal.baseSeverity;
  const beltMultiplier = signal.beltModifiers[userBelt];
  const timeWindowFactor = getTimeWindowFactor(signal, userLastSession);

  return baseScore * beltMultiplier * timeWindowFactor;
}

// Example: Extended training gap
// White belt: 10 (base) × 1.8 (modifier) × 1.2 (time) = 21.6 → CRITICAL
// Black belt: 10 (base) × 0.6 (modifier) × 1.0 (time) = 6.0 → LOW
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION LAYER                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   Dashboard    Session     Techniques    Insights    Belt      Journal       │
│   (Stats)      Logger      Library       (AI)        Progress  History       │
│      │            │            │            │           │          │          │
│      └────────────┴────────────┴────────────┴───────────┴──────────┘          │
│                                    │                                          │
│                                    ▼                                          │
│                         ┌──────────────────┐                                  │
│                         │ useBeltPerson-   │                                  │
│                         │ alization()      │                                  │
│                         └────────┬─────────┘                                  │
│                                  │                                            │
├──────────────────────────────────┼────────────────────────────────────────────┤
│                    PERSONALIZATION ENGINE                                     │
├──────────────────────────────────┼────────────────────────────────────────────┤
│                                  │                                            │
│      ┌───────────────────────────┼───────────────────────────┐                │
│      │                           │                           │                │
│      ▼                           ▼                           ▼                │
│ ┌──────────────┐        ┌──────────────┐        ┌──────────────┐              │
│ │ Belt         │        │ Feature      │        │ Risk         │              │
│ │ Profiles     │        │ Adaptations  │        │ Signals      │              │
│ │ ──────────── │        │ ──────────── │        │ ──────────── │              │
│ │ Psychology   │        │ Dashboard    │        │ Attendance   │              │
│ │ Struggles    │        │ SessionLogger│        │ Plateau      │              │
│ │ Motivations  │        │ Chatbot      │        │ Injury       │              │
│ │ Plateaus     │        │ VideoTutorial│        │ Sentiment    │              │
│ │ Risk Windows │        │ BeltProgress │        │ Burnout      │              │
│ └──────────────┘        └──────────────┘        └──────────────┘              │
│                                  │                                            │
│                                  ▼                                            │
│                    ┌──────────────────────────┐                               │
│                    │   Journal Pattern        │                               │
│                    │   Analysis               │                               │
│                    │   ────────────────────── │                               │
│                    │   18 regex patterns      │                               │
│                    │   Sentiment detection    │                               │
│                    │   Belt-specific response │                               │
│                    └──────────────────────────┘                               │
│                                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                            DATA LAYER                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   UserProfile        Sessions           Techniques        Injuries            │
│   (localStorage)     (localStorage)     (static data)     (localStorage)      │
│                                                                               │
│   ──────────────     ──────────────     ──────────────    ──────────────      │
│   belt: 'blue'       [{date, type,      [{name, pos,      [{bodyPart,         │
│   stripes: 2         duration, ...}]    category}]        sessionId}]         │
│   sessionCount: 47                                                            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Hook Reference

### Primary Hook

```typescript
import { useBeltPersonalization } from '@/hooks';

const {
  // Core profile
  profile,           // BeltPsychologyProfile - struggles, motivations, plateaus

  // Feature adaptations
  dashboard,         // DashboardAdaptation - metrics, modules, celebrations
  sessionLogger,     // SessionLoggerAdaptation - prompts, fields, messages
  chatbot,           // ChatbotAdaptation - tone, vocabulary, topics
  videoTutorials,    // VideoTutorialAdaptation - categories, difficulty
  beltProgress,      // BeltProgressAdaptation - framing, requirements
  profiling,         // ProfilingAdaptation - question timing, style

  // Computed values
  isInRiskWindow,    // boolean - is user in dropout risk window?
  currentPlateau,    // PlateauPattern | null - current plateau phase
  daysAtBelt,        // number - days since last promotion
  monthsAtBelt,      // number - months since last promotion

  // Functions
  analyzeJournal,    // (sessionId, text) => JournalAnalysisResult
  checkSentiment,    // (text) => 'positive' | 'neutral' | 'negative'
  getPostSessionMessage,  // () => string
  getSuggestedPrompts,    // () => string[]
} = useBeltPersonalization();
```

### Convenience Hooks

```typescript
// For components that only need specific adaptations
import {
  useDashboardAdaptation,      // Just dashboard
  useSessionLoggerAdaptation,  // Just session logger
  useChatbotAdaptation,        // Just chatbot
  useDropoutRiskStatus,        // Risk detection with messaging
  useBeltSuggestedContent,     // Insight focus, video categories
  useBeltMotivation,           // Motivational content
} from '@/hooks/useBeltPersonalization';
```

---

## Testing Belt Personalization

### In the Prototype

1. Go to Profile → Settings
2. Enable Demo Mode
3. Use Belt Switcher to change belt level
4. Navigate app to verify adaptations

### Test Checklist by Belt

**White Belt Test:**
- [ ] Dashboard shows WeeklyProgressRing, CalendarHeatMap, DefenseFocus
- [ ] Dashboard does NOT show SparringPatternAnalysis, BluesDetector
- [ ] Session logger hides submission fields
- [ ] Techniques "For You" shows difficulty 1-3 only
- [ ] Post-session message is encouraging

**Blue Belt Test:**
- [ ] Dashboard shows SessionTypeDistribution, BluesDetector, TechniquePairings
- [ ] Session logger shows submission fields
- [ ] Techniques "For You" includes intermediate content
- [ ] Insights use coaching tone, not supportive tone

**Purple Belt Test:**
- [ ] Dashboard shows YourJourney, TechniqueMastery
- [ ] Session logger shows teaching notes field
- [ ] Techniques "For You" includes advanced systems
- [ ] Insights use peer-level analytical tone

### Automated Testing

```typescript
// Example test
describe('Belt Personalization', () => {
  it('shows different primary metric per belt', () => {
    // White belt
    renderWithBelt('white');
    expect(screen.getByTestId('hero-metric')).toHaveTextContent('Sessions');

    // Blue belt
    renderWithBelt('blue');
    expect(screen.getByTestId('hero-metric')).toHaveTextContent('Techniques');

    // Purple belt
    renderWithBelt('purple');
    expect(screen.getByTestId('hero-metric')).toHaveTextContent('Rounds');
  });
});
```

---

## Related Documentation

- **Belt Psychology Details:** `/docs/product/BELT_PERSONALIZATION_SYSTEM.md`
- **AI/Data Strategy:** `/docs/data-and-ai/`
- **Feature Backlog:** `/docs/project/BACKLOG.md`
- **Feature Specs:** `/docs/product/FEATURES.md`
- **Visualization Strategy:** `/docs/data-and-ai/INFOGRAPHIC_STRATEGY.md`

---

*This document should be updated whenever belt personalization logic changes or new features are added.*
