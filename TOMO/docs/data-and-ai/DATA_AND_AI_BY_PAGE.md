# Data & AI Operations by Page

> **Purpose:** This document defines exactly how data flows and AI operates for each major page in TOMO. Use this as the authoritative reference when implementing or modifying features.
>
> **For Agentic Coding Partners:** This is your map. Before touching any page, read its section here.

**Last Updated:** January 2026

---

## Quick Reference Matrix

| Page | Data Sources | AI Operations | Belt Personalization | Output |
|------|--------------|---------------|---------------------|--------|
| **STATS (Dashboard)** | Sessions, submissions, sparring | Pattern analysis, breakthrough detection | Module selection, metrics, thresholds | Visualizations, insights |
| **INSIGHTS** | Journal entries, session history | Text analysis, pattern recognition, coaching generation | Tone, vocabulary, topics, risk messaging | Daily AI coaching |
| **JOURNAL** | Session entries | Sentiment extraction, technique matching | Card complexity, filter options | Chronological feed |
| **TECHNIQUES** | Journal mentions, struggles | Recommendation algorithm, content filtering | Difficulty range, defense priority | "For You" videos |

---

# 1. STATS (Dashboard)

**Component:** `/prototype/src/components/features/Dashboard.tsx`

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Sessions[]           → Training frequency, duration, types          │
│  Submissions[]        → Given/received, by technique                 │
│  SparringOutcomes[]   → Wins, losses, draws, partner context        │
│  Techniques[]         → Drilled, practiced, mentioned               │
│  BeltHistory[]        → Promotion dates, time at each belt          │
│  Goals[]              → User-set targets, progress                  │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING                                   │
├─────────────────────────────────────────────────────────────────────┤
│  1. PATTERN ANALYSIS                                                 │
│     - Training consistency trends                                    │
│     - Submission success rates by technique                          │
│     - Position strength/weakness mapping                             │
│     - Technique co-occurrence analysis                               │
│                                                                      │
│  2. BREAKTHROUGH DETECTION                                           │
│     - First-time achievements (first sub, first streak)              │
│     - Personal records (longest streak, most sessions/month)         │
│     - Milestone thresholds (10, 25, 50, 100 sessions)               │
│     - Technique mastery transitions                                  │
│                                                                      │
│  3. RISK SIGNAL ANALYSIS                                             │
│     - Attendance decline detection                                   │
│     - Extended gap flagging (>7 days)                               │
│     - Negative sentiment trending                                    │
│     - Blues detector (blue belt specific)                           │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BELT PERSONALIZATION                              │
├─────────────────────────────────────────────────────────────────────┤
│  Hook: useBeltPersonalization() → { dashboard, profile }             │
│                                                                      │
│  WHITE BELT:                                                         │
│  - Primary Metric: session_streak                                    │
│  - Modules: WeeklyProgressRing, CalendarHeatMap, DefenseFocus       │
│  - Celebrate every: 10 sessions                                      │
│  - Insight focus: "survival_skills"                                  │
│  - Show competition stats: NO                                        │
│                                                                      │
│  BLUE BELT:                                                          │
│  - Primary Metric: technique_variety                                 │
│  - Modules: + SessionTypeDistribution, BluesDetector, TechniquePairs │
│  - Celebrate every: 25 sessions                                      │
│  - Insight focus: "game_development"                                 │
│  - Show competition stats: YES                                       │
│                                                                      │
│  PURPLE+ BELT:                                                       │
│  - Primary Metric: sparring_rounds (purple), teaching_sessions (brown)│
│  - Modules: + YourJourney, TechniqueMastery                         │
│  - Celebrate every: 50 sessions                                      │
│  - Insight focus: "systems_thinking" (purple), "refinement" (brown)  │
│  - Show competition stats: YES                                       │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUTS                                       │
├─────────────────────────────────────────────────────────────────────┤
│  - Hero Metric (animated large number)                               │
│  - Breakthrough Hero (achievement celebration)                       │
│  - Style Fingerprint (radar chart - blue+ with 20+ sessions)        │
│  - Belt-specific stats modules (see CLAUDE.md)                      │
│  - "What's Working" callout (AI-generated)                          │
│  - "Focus Area" callout (AI-generated)                              │
│  - Tournament Readiness (competition-focused users)                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Stats Modules by Belt

> **Note:** Belt progress is shown in **Profile/Bio**, not Stats. Stats focuses on training patterns, not promotion milestones.

### White Belt (Retention Focus)

| Module | Data Required | AI Processing |
|--------|---------------|---------------|
| `WeeklyProgressRing` | Sessions this week, target frequency | Goal progress calculation |
| `CalendarHeatMap` | Session dates (90 days) | Streak detection, gap identification |
| `DashboardSummaryCard` | Total sessions, hours, belt, streak | Aggregation only |
| `DefenseFocus` | Submissions given/received by type | Defense/offense ratio analysis |

### Blue Belt (Game Development)

| Module | Data Required | AI Processing |
|--------|---------------|---------------|
| `SessionTypeDistribution` | Session types (gi/nogi/open mat/drilling) | Distribution analysis |
| `SparringPatternAnalysis` | Submission exchanges | Success rate calculation, trend analysis |
| `AchievementTimeline` | Milestones, promotions, PRs | Milestone detection |
| `TechniquePairings` | Techniques logged together | Co-occurrence analysis |
| `BluesDetector` | Session gaps, sentiment, frequency trend | Risk signal aggregation |

### Purple+ Belt (Systems & Mastery)

| Module | Data Required | AI Processing |
|--------|---------------|---------------|
| `SessionTypeDistribution` | Session types + comp prep | Distribution analysis |
| `SparringPatternAnalysis` | Advanced submission data | Success rate, technique granularity |
| `AchievementTimeline` | Multi-year milestones | Milestone detection |
| `YourJourney` | Multi-year session data, submissions | Long-term trend analysis |
| `TechniqueMastery` | Technique frequency, outcomes | Specialization depth scoring |

### All Belts (Universal)

| Module | Data Required | AI Processing | Notes |
|--------|---------------|---------------|-------|
| `RecentRolls` | Last 5-10 submissions received | Defense coaching suggestions | "Watch Out" section |
| `StyleFingerprint` | Positional strength data | Archetype detection | Blue+ with 20+ sessions |
| `TournamentReadinessCard` | Consistency, technique, sparring, comp history | Readiness assessment | On-demand |
| `AttackProfile` | Submission history | Submission story narrative | Blue+ only |
| `BreakthroughHero` | Achievement data | Breakthrough detection | When triggered |
| `LockedFeaturesFooter` | Belt level, session count | Feature gating | Shows unlock criteria |

## Implementation Notes

```typescript
// How to access belt-personalized dashboard config
import { useBeltPersonalization } from '@/hooks';

const Dashboard = () => {
  const { dashboard, profile } = useBeltPersonalization();

  // dashboard.primaryMetric: 'session_streak' | 'technique_variety' | 'sparring_rounds' | 'teaching_sessions'
  // dashboard.streakEmphasis: 'high' | 'medium' | 'low'
  // dashboard.showCompetition: boolean
  // dashboard.insightFocus: string
  // dashboard.celebrationThresholds: { sessions: number, techniques: number, sparringRounds: number }
  // profile.beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black'
};
```

---

# 2. INSIGHTS (AI Training Feedback)

**Component:** `/prototype/src/components/features/TrainingFeedback.tsx`

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────────┤
│  JournalEntries[]     → Last 10-20 sessions, raw notes              │
│  Techniques[]         → What they're working on                      │
│  Struggles[]          → What they mentioned as difficult             │
│  Wins[]               → What they said worked well                   │
│  SessionGaps[]        → Time between sessions                        │
│  SparringOutcomes[]   → Recent performance data                      │
│  BeltLevel            → Current belt for context                     │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING                                   │
├─────────────────────────────────────────────────────────────────────┤
│  1. JOURNAL TEXT ANALYSIS                                            │
│     Location: config/belt-system/journal-patterns.ts                 │
│                                                                      │
│     Pattern Types:                                                   │
│     - ego_challenge: "got smashed", "destroyed", "humbled"          │
│     - breakthrough: "finally hit", "clicked", "first time"          │
│     - injury_mention: "tweaked", "sore", "hurt", "injured"          │
│     - frustration: "can't", "never", "always get", "keep losing"    │
│     - progress: "improving", "getting better", "felt good"          │
│     - plateau: "stuck", "no progress", "same mistakes"              │
│                                                                      │
│  2. INSIGHT GENERATION                                               │
│     Inputs:                                                          │
│     - Recent session patterns (frequency, techniques, outcomes)      │
│     - Detected journal patterns (struggles, wins, mood)              │
│     - Belt-specific context (what matters at this level)             │
│     - Risk signals (if any detected)                                 │
│                                                                      │
│     Output: 2-4 paragraph coaching insight with:                     │
│     - Observation (what we noticed in their data)                    │
│     - Interpretation (what it might mean)                            │
│     - Suggestion (what to consider - always defer to coach)          │
│     - Encouragement (belt-appropriate motivation)                    │
│                                                                      │
│  3. VIDEO RECOMMENDATIONS                                            │
│     - Match struggles to technique categories                        │
│     - Filter by belt-appropriate difficulty                          │
│     - Prioritize defense for white belts                            │
│     - Return 2-3 relevant videos                                     │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BELT PERSONALIZATION                              │
├─────────────────────────────────────────────────────────────────────┤
│  Hook: useBeltPersonalization() → { chatbot, profile, analyzeJournal }│
│                                                                      │
│  TONE PROFILES:                                                      │
│  - White: "warm_supportive" - High encouragement, simple language    │
│  - Blue: "coaching_balanced" - Moderate encouragement, peer language │
│  - Purple: "peer_analytical" - Minimal encouragement, technical      │
│  - Brown: "peer_analytical" - Colleague-level discussion             │
│                                                                      │
│  VOCABULARY LEVELS:                                                  │
│  - White: "basic" - Fundamental terms only                          │
│  - Blue: "intermediate" - Common BJJ terminology                     │
│  - Purple+: "advanced" - Full technical vocabulary                   │
│                                                                      │
│  TOPICS TO EMPHASIZE:                                                │
│  - White: survival, escapes, relaxation, when to tap                │
│  - Blue: game development, combinations, plateau normalization       │
│  - Purple: systems thinking, conceptual connections, teaching        │
│  - Brown: refinement, efficiency, legacy, instructor preparation     │
│                                                                      │
│  TOPICS TO AVOID:                                                    │
│  - White: advanced leg locks, berimbolo, competition tactics         │
│  - Blue: (none)                                                      │
│  - Purple+: (none)                                                   │
│                                                                      │
│  RISK-AWARE MESSAGING:                                               │
│  When risk signals detected (gap > 7 days, negative sentiment):      │
│  - White: "We noticed you've been away. Everything okay?"           │
│  - Blue: "Blue belt blues are real. This is part of the path."      │
│  - Purple+: "Your skills don't disappear. Here when you're ready."  │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUTS                                       │
├─────────────────────────────────────────────────────────────────────┤
│  - Daily insight text (typewriter animation)                         │
│  - 2-3 recommended videos with thumbnails                           │
│  - "Talk to your coach about..." prompt                             │
│  - Timestamp of last generation                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Generation Rules

| Rule | Implementation |
|------|----------------|
| **Frequency** | Max 1 insight per day |
| **Trigger** | Only if new session logged since last insight |
| **Length** | 2-4 paragraphs, ~150-300 words |
| **Coach Deferral** | ALWAYS include "worth discussing with your coach" |
| **Never Lecture** | Suggest, don't prescribe |
| **Belt Appropriate** | Use chatbot.toneProfile and chatbot.technicalVocabulary |

## Implementation Notes

```typescript
// How to generate belt-personalized AI insights
import { useBeltPersonalization } from '@/hooks';

const Insights = () => {
  const { chatbot, profile, analyzeJournal } = useBeltPersonalization();

  // Analyze recent journal entries
  const journalAnalysis = analyzeJournal(recentEntries);
  // Returns: { egoChallenge: boolean, breakthrough: boolean, injury: boolean, ... }

  // Use chatbot config for generation
  // chatbot.toneProfile: 'warm_supportive' | 'coaching_balanced' | 'peer_analytical'
  // chatbot.technicalVocabulary: 'basic' | 'intermediate' | 'advanced'
  // chatbot.emphasizeTopics: string[]
  // chatbot.avoidTopics: string[]
  // chatbot.encouragementLevel: 'high' | 'moderate' | 'minimal'
  // chatbot.responseDepth: 'simple' | 'moderate' | 'detailed'

  // Generate prompt for AI
  const prompt = buildInsightPrompt({
    journalAnalysis,
    recentSessions,
    beltLevel: profile.beltLevel,
    tone: chatbot.toneProfile,
    vocabulary: chatbot.technicalVocabulary,
    emphasize: chatbot.emphasizeTopics,
    avoid: chatbot.avoidTopics,
  });
};
```

---

# 3. JOURNAL (Session History)

**Component:** `/prototype/src/components/features/SessionHistory.tsx`

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Sessions[]           → All logged training sessions                 │
│  Each session contains:                                              │
│  - date, training_type, duration_minutes                            │
│  - sparring (boolean), sparring_rounds                              │
│  - techniques_drilled[]                                             │
│  - submissions_given[], submissions_received[]                       │
│  - worked_well, struggled_with, notes                               │
│  - energy_level, injuries[]                                         │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING                                   │
├─────────────────────────────────────────────────────────────────────┤
│  1. SESSION ENTRY CREATION (at logging time)                         │
│     See: Voice Logging AI Extraction below                           │
│                                                                      │
│  2. SENTIMENT EXTRACTION (background)                                │
│     - Analyze notes field for positive/negative signals              │
│     - Flag entries with frustration, breakthrough, injury patterns   │
│     - Feed into risk detection system                                │
│                                                                      │
│  3. TECHNIQUE MATCHING (background)                                  │
│     - Match mentioned techniques to canonical technique library      │
│     - Normalize variations ("rnc" → "Rear Naked Choke")             │
│     - Build user's personal terminology map over time                │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BELT PERSONALIZATION                              │
├─────────────────────────────────────────────────────────────────────┤
│  Hook: useBeltPersonalization() → { profile }                        │
│                                                                      │
│  CARD COMPLEXITY:                                                    │
│  - White: Simple (date, type, duration, lesson topic, notes)        │
│  - Blue: Standard (+ techniques, sparring rounds, worked/struggles)  │
│  - Purple+: Full (+ submissions given/received)                      │
│                                                                      │
│  FILTER OPTIONS:                                                     │
│  - White: Type only (Gi/No-Gi/All)                                  │
│  - Blue: Type + Sparring (Yes/No)                                   │
│  - Purple+: Type + Sparring + Position focus                        │
│                                                                      │
│  DISPLAY RULES:                                                      │
│  - White: Hide submission details (overwhelming for beginners)       │
│  - Blue: Show submissions but de-emphasize losses                   │
│  - Purple+: Full transparency on all data                           │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUTS                                       │
├─────────────────────────────────────────────────────────────────────┤
│  - Chronological feed grouped by: Today, Yesterday, This Week, Earlier│
│  - JournalEntryCard for each session (complexity varies by belt)     │
│  - Filter controls (scope varies by belt)                           │
│  - Tap → SessionDetail for full view + editing                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Voice Logging AI Extraction (Session Creation)

When a session is created via voice, the AI performs:

```
┌─────────────────────────────────────────────────────────────────────┐
│                 VOICE → STRUCTURED DATA PIPELINE                     │
├─────────────────────────────────────────────────────────────────────┤
│  INPUT: Voice recording (60-90 seconds typical)                      │
│                                                                      │
│  STEP 1: TRANSCRIPTION (AssemblyAI)                                  │
│  - Custom vocabulary for BJJ terms                                   │
│  - Handles: kimura, de la riva, berimbolo, omoplata, etc.           │
│  - Target accuracy: >85% for BJJ terminology                        │
│                                                                      │
│  STEP 2: NLP EXTRACTION                                              │
│  - Duration: "90 minutes", "hour and a half", "two-hour open mat"   │
│  - Training type: "gi class", "no-gi", "wrestling"                  │
│  - Techniques: Named moves (armbar, knee slice, RNC)                │
│  - Positions: "from closed guard", "in mount", "from the back"      │
│  - Sparring: "rolled 5 times", "did 6 rounds"                       │
│  - Partners: Names in context ("rolled with Jake")                   │
│  - Submissions: "tapped him", "got caught in a triangle"            │
│  - Struggles: "couldn't escape", "kept getting swept"               │
│  - Wins: "finally hit that armbar", "felt good"                     │
│  - Injuries: "knee is sore", "shoulder tight"                       │
│  - Energy: "exhausted", "felt strong", "gassed out"                 │
│                                                                      │
│  STEP 3: CONFIDENCE SCORING                                          │
│  - >90%: Auto-accept, show in review                                │
│  - 70-90%: Show with subtle highlight                               │
│  - 50-70%: Show with "Did you mean...?" prompt                      │
│  - <50%: Don't include, keep in raw transcript                      │
│                                                                      │
│  STEP 4: GAP-FILL (max 1 question)                                   │
│  Priority order:                                                     │
│  1. Gi/No-gi (if ambiguous)                                         │
│  2. Duration (if not mentioned)                                      │
│  3. Sparring rounds (if not mentioned)                               │
│                                                                      │
│  OUTPUT: Structured SessionData object                               │
└─────────────────────────────────────────────────────────────────────┘
```

## Implementation Notes

```typescript
// Belt-adaptive card rendering
import { useBeltPersonalization } from '@/hooks';

const JournalEntryCard = ({ session }) => {
  const { profile } = useBeltPersonalization();

  // Determine what to show based on belt
  const showTechniques = profile.beltLevel !== 'white';
  const showSubmissions = ['purple', 'brown', 'black'].includes(profile.beltLevel);
  const cardComplexity = getCardComplexity(profile.beltLevel);
  // 'simple' | 'standard' | 'full'

  return (
    <Card complexity={cardComplexity}>
      {/* Always show: date, type, duration */}
      {showTechniques && <Techniques list={session.techniques_drilled} />}
      {showSubmissions && <Submissions given={session.submissions_given} received={session.submissions_received} />}
    </Card>
  );
};
```

---

# 4. TECHNIQUES (Library)

**Component:** `/prototype/src/components/features/TechniqueLibrary.tsx`

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────────┤
│  JournalEntries[]     → Techniques mentioned, struggles noted        │
│  TechniqueLibrary[]   → Curated video database                      │
│  VideoMetadata        → Difficulty level, category, instructor       │
│  UserBeltLevel        → Current belt for filtering                  │
│  SparringOutcomes[]   → What they're getting caught with            │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING                                   │
├─────────────────────────────────────────────────────────────────────┤
│  "FOR YOU" RECOMMENDATION ALGORITHM:                                 │
│                                                                      │
│  1. EXTRACT RECENT SIGNALS (last 10 sessions)                        │
│     - Techniques mentioned positively ("working on X")              │
│     - Struggles mentioned ("can't escape Y")                        │
│     - Submissions received (defensive needs)                         │
│     - Positions frequently in                                        │
│                                                                      │
│  2. MATCH TO VIDEO LIBRARY                                           │
│     - Technique name → Video category                               │
│     - Struggle → Defensive/counter content                          │
│     - Position → Position-specific instruction                       │
│                                                                      │
│  3. APPLY BELT FILTERS                                               │
│     - Filter by difficulty range for belt                           │
│     - If prioritizeDefense: weight defensive content 2x              │
│     - Exclude topics in avoidTopics list                            │
│                                                                      │
│  4. RANK AND SELECT                                                  │
│     - Relevance to recent journal (50%)                             │
│     - Recency of struggle mention (30%)                             │
│     - Instructor quality score (20%)                                │
│     - Return top N videos (N = weeklyRecommendationCount)           │
│                                                                      │
│  "BROWSE" VIEW:                                                      │
│  - No AI processing                                                 │
│  - Category-based navigation                                        │
│  - All videos shown (no belt filtering in browse)                   │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BELT PERSONALIZATION                              │
├─────────────────────────────────────────────────────────────────────┤
│  Hook: useBeltPersonalization() → { videoTutorials, profile }        │
│                                                                      │
│  DIFFICULTY RANGES:                                                  │
│  - White: 1-3 (fundamentals only)                                   │
│  - Blue: 2-5 (fundamentals + intermediate)                          │
│  - Purple: 4-8 (intermediate + advanced)                            │
│  - Brown: 6-10 (advanced + expert)                                  │
│  - Black: 1-10 (all content)                                        │
│                                                                      │
│  DEFENSE PRIORITY:                                                   │
│  - White: YES (2x weight on defensive content)                      │
│  - Blue: NO                                                         │
│  - Purple+: NO                                                       │
│                                                                      │
│  WEEKLY RECOMMENDATION COUNT:                                        │
│  - White: 3 (don't overwhelm)                                       │
│  - Blue: 5 (exploring game)                                         │
│  - Purple: 3 (quality over quantity)                                │
│  - Brown: 3 (refinement focus)                                      │
│                                                                      │
│  CONTENT GATES:                                                      │
│  - White: NO leg locks, NO advanced systems (berimbolo, etc.)       │
│  - Blue: Basic leg locks OK, NO heel hooks                          │
│  - Purple+: All content available                                   │
│                                                                      │
│  INCLUDE CONCEPTUAL CONTENT:                                         │
│  - White: NO (too abstract)                                         │
│  - Blue: YES                                                        │
│  - Purple+: YES                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        OUTPUTS                                       │
├─────────────────────────────────────────────────────────────────────┤
│  "FOR YOU" TAB:                                                      │
│  - Personalized video cards (N based on belt)                       │
│  - "Based on your recent training" context                          │
│  - Embedded YouTube player                                          │
│                                                                      │
│  "BROWSE" TAB:                                                       │
│  - Category grid (Positions, Submissions, Mindset)                  │
│  - Sub-category drill-down                                          │
│  - Full video library (no filtering)                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Video Categories

**Technical:**
- Closed Guard, Half Guard, Open Guard
- Mount, Side Control, Back Control
- Guard Passing, Takedowns, Turtle, Clinch
- Submissions (by type)

**Mindset & Lifestyle:**
- Belt Journey (white → black psychology)
- Mental Game (competition, ego, flow state)
- Age & Longevity (training over 40)
- Lifestyle (work-life balance, family)
- Injury & Recovery

## Priority Instructors

Videos prioritized from: John Danaher, Gordon Ryan, Lachlan Giles, Craig Jones

## Implementation Notes

```typescript
// "For You" recommendation algorithm
import { useBeltPersonalization } from '@/hooks';

const TechniqueLibrary = () => {
  const { videoTutorials, profile } = useBeltPersonalization();

  // videoTutorials.recommendedCategories: string[]
  // videoTutorials.difficultyRange: { min: number, max: number }
  // videoTutorials.prioritizeDefense: boolean
  // videoTutorials.weeklyRecommendationCount: number
  // videoTutorials.includeConceptual: boolean
  // videoTutorials.showLegLocks: boolean | 'basic'
  // videoTutorials.showAdvancedSystems: boolean

  const recommendations = generateRecommendations({
    recentJournalEntries,
    recentStruggles,
    recentSubmissionsReceived,
    difficultyRange: videoTutorials.difficultyRange,
    prioritizeDefense: videoTutorials.prioritizeDefense,
    count: videoTutorials.weeklyRecommendationCount,
    excludeTopics: getExcludedTopics(profile.beltLevel),
  });
};
```

---

# Cross-Cutting: Risk Detection System

**Location:** `/prototype/src/config/belt-system/risk-signals.ts`

Risk detection operates across all pages, feeding data into Insights and Dashboard.

## Risk Signal Detection

| Signal | Detection Method | Threshold | Weight |
|--------|------------------|-----------|--------|
| `extended_gap` | Days since last session | >7 days | High |
| `frequency_decline` | Compare last 4 weeks vs prior 4 | >30% drop | High |
| `negative_sentiment` | Journal text analysis | 3+ negative entries in 2 weeks | Medium |
| `missed_targets` | Sessions vs target frequency | <50% for 3 weeks | Medium |
| `injury_mentions` | Journal text analysis | 2+ in 4 weeks | Medium |
| `short_sessions` | Duration trending down | 3+ sessions <45min | Low |
| `no_sparring` | Sparring = false streak | 5+ sessions | Low |

## Belt-Specific Risk Modifiers

| Belt | Dropout Risk Window | Risk Multiplier | Primary Concern |
|------|---------------------|-----------------|-----------------|
| White | 0-6 months | 1.5x | Overwhelm, injury fear |
| Blue | 0-12 months post-promotion | 1.3x | Blue belt blues, plateau |
| Purple | Low risk | 0.8x | Burnout possible |
| Brown | Very low risk | 0.5x | Life events only |

## Intervention Messages

When risk signals trigger, the system generates belt-appropriate interventions:

**White Belt (High Risk):**
> "We noticed you've been away for a bit. That's okay—everyone's journey looks different. When you're ready, we'll be here. No pressure."

**Blue Belt (Moderate-High Risk):**
> "The blue belt plateau is real, and it's part of the path. Many practitioners feel stuck at this stage. The ones who become purple belts are the ones who kept showing up anyway."

**Purple+ (Low Risk):**
> "Life happens. Your skills don't disappear during a break. When you're ready to get back on the mats, your experience will still be there."

---

# Implementation Checklist for Agentic Coding Partners

When working on any of these pages, verify:

## STATS (Dashboard)
- [ ] Uses `useBeltPersonalization()` hook
- [ ] Shows correct modules for belt level
- [ ] Uses correct primary metric per belt
- [ ] Applies celebration thresholds correctly
- [ ] Risk signals surfaced for at-risk users (blue belt blues detector)

## INSIGHTS
- [ ] Uses `useBeltPersonalization()` hook
- [ ] Tone matches belt level (warm → analytical)
- [ ] Vocabulary matches belt level (basic → advanced)
- [ ] Topics emphasized match belt level
- [ ] Topics avoided for belt level are excluded
- [ ] Risk messaging appears when signals detected
- [ ] Always includes coach deferral language

## JOURNAL
- [ ] Uses `useBeltPersonalization()` hook
- [ ] Card complexity matches belt level
- [ ] Filter options match belt level
- [ ] Submissions hidden for white belts
- [ ] Techniques hidden for white belts

## TECHNIQUES
- [ ] Uses `useBeltPersonalization()` hook
- [ ] "For You" filtered by difficulty range
- [ ] Defense prioritized for white belts
- [ ] Correct recommendation count per belt
- [ ] Content gates enforced (no leg locks for white, etc.)
- [ ] Conceptual content only for blue+

---

# Related Documents

| Document | Purpose |
|----------|---------|
| `/docs/product/BELT_INTEGRATION_SPEC.md` | Developer contracts for each page |
| `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` | Quick reference for belt system |
| `/docs/data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` | Voice logging data strategy |
| `/docs/data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` | Voice logging flow spec |
| `/docs/data-and-ai/INFOGRAPHIC_STRATEGY.md` | Visualization recommendations |
| `/docs/data-and-ai/CONVERSATION_DESIGN_FOUNDATION.md` | AI conversation principles |
| `/docs/personas/PERSONA_PROFILES.md` | Test user profiles |

---

*This document is the source of truth for data and AI operations. When in doubt, reference this first.*
