# Technique Recommendation Engine

**Version:** 1.0
**Date:** January 21, 2026
**Status:** Active
**Purpose:** Technical specification for how journal data drives personalized video recommendations

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Scoring Algorithm](#scoring-algorithm)
4. [Temporal Decay](#temporal-decay)
5. [Diversity & Freshness Rules](#diversity--freshness-rules)
6. [AI Prompts for Personalization](#ai-prompts-for-personalization)
7. [Belt-Level Filtering](#belt-level-filtering)
8. [Implementation Paths](#implementation-paths)
9. [Example Scenarios by Belt](#example-scenarios-by-belt)
10. [Video Library Integration](#video-library-integration)
11. [Success Metrics](#success-metrics)
12. [Implementation Reference](#implementation-reference)

---

## Overview

### What This Document Covers

The Technique Recommendation Engine generates personalized "For You" video recommendations based on:
- Recent journal entries (techniques mentioned, struggles logged)
- Sparring outcomes (submissions given/received)
- Belt-level appropriateness
- Training patterns and goals

### Core Principles

1. **Struggle-First** — Videos that address logged struggles have highest priority
2. **Belt-Appropriate** — Never recommend content beyond the user's level
3. **Defense Priority for White Belts** — Survival content weighted 2x for beginners
4. **Specific Reasons** — Every recommendation includes context ("You mentioned struggling with...")
5. **Quality over Quantity** — Fewer, better recommendations beat a flood of content

### Key Files

```
/prototype/src/
├── data/
│   └── techniqueVideos.ts         # Video catalog and recommendation functions
├── config/belt-system/
│   └── feature-adaptations.ts     # Belt-specific recommendation configs
└── hooks/
    └── useBeltPersonalization.ts  # Hook for accessing recommendation settings
```

---

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INPUT SOURCES                                 │
├─────────────────────────────────────────────────────────────────────┤
│  JournalEntries[]     → Techniques mentioned, struggles logged      │
│  SparringOutcomes[]   → Submissions received (defense needs)        │
│  TechniqueProgress[]  → User's proficiency per technique            │
│  UserProfile          → Belt level, training goals, preferences     │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      SIGNAL EXTRACTION                               │
├─────────────────────────────────────────────────────────────────────┤
│  1. RECENT STRUGGLES (Last 10 sessions)                              │
│     - "couldn't escape side control" → SC_016, SC_019                │
│     - "got caught in triangle" → defense videos for triangle         │
│     - "losing the underhook" → half guard technique videos           │
│                                                                      │
│  2. TECHNIQUE MENTIONS                                               │
│     - Positive: "working on X" → suggest advanced X content          │
│     - Repeated: 3+ mentions → suggest system-level content           │
│                                                                      │
│  3. SUBMISSIONS RECEIVED                                             │
│     - Map to defense videos: guillotine received → guillotine defense│
│     - Track frequency: 3+ same sub = high priority recommendation    │
│                                                                      │
│  4. PLATEAU DETECTION                                                │
│     - Technique at "developing" for 3+ weeks → fundamentals refresh  │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BELT-LEVEL FILTERING                              │
├─────────────────────────────────────────────────────────────────────┤
│  WHITE BELT:                                                         │
│  - Difficulty range: 1-3                                             │
│  - Defense weight: 2x (prioritize survival)                          │
│  - Excluded: leg locks, berimbolo, advanced systems                  │
│  - Max recommendations: 3/week                                       │
│                                                                      │
│  BLUE BELT:                                                          │
│  - Difficulty range: 2-5                                             │
│  - Defense weight: 1x (balanced)                                     │
│  - Basic leg locks OK, no heel hooks                                 │
│  - Max recommendations: 5/week                                       │
│                                                                      │
│  PURPLE+ BELT:                                                       │
│  - Difficulty range: 4-10                                            │
│  - Defense weight: 1x                                                │
│  - All content available                                             │
│  - Max recommendations: 3-5/week (quality focus)                     │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      SCORING & RANKING                               │
├─────────────────────────────────────────────────────────────────────┤
│  For each candidate video:                                           │
│    baseScore = relevanceScore (0-100)                               │
│    + recencyBonus (0-30)     # Recent struggles weighted higher      │
│    + frequencyBonus (0-20)   # Repeated mentions weighted higher     │
│    + instructorBonus (0-10)  # Priority instructors: Danaher, Ryan   │
│    × defenseMultiplier       # 2x for white belt defense content     │
│                                                                      │
│  Sort by score, take top N                                           │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         OUTPUT                                       │
├─────────────────────────────────────────────────────────────────────┤
│  ForYouSection {                                                     │
│    recommendations: VideoRecommendation[]                            │
│    generated_at: ISO timestamp                                       │
│    based_on_sessions: number                                         │
│    user_belt: BeltLevel                                              │
│  }                                                                   │
│                                                                      │
│  Each VideoRecommendation includes:                                  │
│  - video: TechniqueVideo                                             │
│  - reason: RecommendationReason                                      │
│  - reason_text: "You mentioned struggling with X..."                 │
│  - priority: 'high' | 'medium'                                       │
│  - user_proficiency: ProficiencyLevel | null                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Scoring Algorithm

### Relevance Score Calculation

```typescript
interface ScoringFactors {
  // Direct match: struggle text matches video topic
  struggleMatch: 50;        // Base points for matching a logged struggle

  // Technique mention: user is actively working on this
  techniqueMatch: 30;       // Base points for matching technique interest

  // Submission defense: got caught by this submission
  submissionReceived: 40;   // Points for matching defense need

  // Plateau breaker: stuck on this technique
  plateauMatch: 35;         // Points for addressing stalled progress
}

interface Bonuses {
  // Recency: more recent = more relevant
  recencyBonus: {
    within_7_days: 30;
    within_14_days: 20;
    within_30_days: 10;
    older: 0;
  };

  // Frequency: repeated mentions = clear priority
  frequencyBonus: {
    mentioned_5_plus: 20;
    mentioned_3_to_4: 15;
    mentioned_2: 10;
    mentioned_1: 5;
  };

  // Instructor quality: priority instructors
  instructorBonus: {
    priority_instructor: 10;  // Danaher, Ryan, Giles, Jones
    other_instructor: 0;
  };
}

interface Multipliers {
  // Defense priority for white belts
  defenseMultiplier: {
    white_belt_defense_content: 2.0;
    other: 1.0;
  };
}
```

### Score Calculation Function

```typescript
function calculateVideoScore(
  video: TechniqueVideo,
  userSignals: UserSignals,
  beltLevel: BeltLevel
): number {
  let score = 0;

  // 1. Check struggle matches
  for (const struggle of userSignals.recentStruggles) {
    if (videoMatchesStruggle(video, struggle)) {
      score += 50;
      score += getRecencyBonus(struggle.date);
      score += getFrequencyBonus(struggle.technique, userSignals);
    }
  }

  // 2. Check technique interest matches
  for (const technique of userSignals.techniquesMentioned) {
    if (videoMatchesTechnique(video, technique)) {
      score += 30;
      score += getRecencyBonus(technique.lastMentioned);
    }
  }

  // 3. Check submission defense needs
  for (const submission of userSignals.submissionsReceived) {
    if (videoAddressesDefense(video, submission)) {
      score += 40;
      score += getFrequencyBonus(submission.technique, userSignals);
    }
  }

  // 4. Check plateau techniques
  for (const plateau of userSignals.plateauedTechniques) {
    if (videoMatchesTechnique(video, plateau)) {
      score += 35;
    }
  }

  // 5. Apply instructor bonus
  if (isPriorityInstructor(video.instructor)) {
    score += 10;
  }

  // 6. Apply defense multiplier for white belts
  if (beltLevel === 'white' && isDefenseContent(video)) {
    score *= 2.0;
  }

  return score;
}
```

---

## Temporal Decay

### Why Temporal Decay Matters

Recent struggles are more relevant than old ones. A user who got caught in armbars last week needs help now; struggles from 6 months ago may already be resolved.

### Decay Function

```typescript
function calculateTemporalDecay(
  signalDate: Date,
  currentDate: Date,
  halfLifeDays: number = 14
): number {
  const daysSince = differenceInDays(currentDate, signalDate);

  // Exponential decay: signal worth 50% at halfLife days
  // Worth 25% at 2x halfLife, 12.5% at 3x halfLife, etc.
  return Math.pow(0.5, daysSince / halfLifeDays);
}

// Example decay values (halfLife = 14 days):
// Today: 1.0 (100%)
// 7 days ago: 0.71 (71%)
// 14 days ago: 0.5 (50%)
// 21 days ago: 0.35 (35%)
// 28 days ago: 0.25 (25%)
// 60 days ago: 0.06 (6%)
```

### Session-Level Decay Application

Apply decay to each session's signals, then aggregate:

```typescript
function aggregateDecayedSignals(
  sessions: SessionData[],
  currentDate: Date
): Map<string, number> {
  const aggregated = new Map<string, number>();

  for (const session of sessions) {
    const decay = calculateTemporalDecay(
      new Date(session.date),
      currentDate
    );

    session.struggled_with?.forEach(struggle => {
      const techniqueId = mapToTechniqueId(struggle);
      if (techniqueId) {
        aggregated.set(
          techniqueId,
          (aggregated.get(techniqueId) || 0) + decay
        );
      }
    });
  }

  return aggregated;
}
```

---

## Diversity & Freshness Rules

### Preventing Repetitive Recommendations

Users should not see the same videos repeatedly. The engine maintains a "recently shown" list.

```typescript
interface FreshnessState {
  recentlyShown: Map<string, Date>;      // video_id -> last shown date
  positionDistribution: Map<string, number>; // position -> count shown
  instructorDistribution: Map<string, number>; // instructor -> count shown
}

const FRESHNESS_CONFIG = {
  videoRepeatCooldownDays: 7,            // Don't repeat video within 7 days
  maxSamePosition: 2,                    // Max 2 videos from same position
  maxSameInstructor: 2,                  // Max 2 videos from same instructor
  rotationPoolSize: 50,                  // Track last 50 shown videos
};
```

### Diversity Algorithm

```typescript
function applyDiversityRules(
  rankedVideos: VideoScore[],
  freshnessState: FreshnessState,
  maxRecommendations: number
): VideoScore[] {
  const result: VideoScore[] = [];
  const selectedPositions = new Map<string, number>();
  const selectedInstructors = new Map<string, number>();

  for (const video of rankedVideos) {
    if (result.length >= maxRecommendations) break;

    // Skip if shown recently
    const lastShown = freshnessState.recentlyShown.get(video.video_id);
    if (lastShown && isWithinDays(lastShown, FRESHNESS_CONFIG.videoRepeatCooldownDays)) {
      continue;
    }

    // Check position diversity
    const videoPosition = getVideoPosition(video.video_id);
    if ((selectedPositions.get(videoPosition) || 0) >= FRESHNESS_CONFIG.maxSamePosition) {
      continue;
    }

    // Check instructor diversity
    const videoInstructor = getVideoInstructor(video.video_id);
    if ((selectedInstructors.get(videoInstructor) || 0) >= FRESHNESS_CONFIG.maxSameInstructor) {
      continue;
    }

    // Video passes all diversity checks
    result.push(video);
    selectedPositions.set(videoPosition, (selectedPositions.get(videoPosition) || 0) + 1);
    selectedInstructors.set(videoInstructor, (selectedInstructors.get(videoInstructor) || 0) + 1);
  }

  return result;
}
```

### Freshness Injection

Every recommendation set should include at least one "discovery" video the user hasn't seen:

```typescript
function injectFreshnessVideo(
  recommendations: VideoScore[],
  allVideos: Video[],
  userBelt: BeltLevel,
  freshnessState: FreshnessState
): VideoScore[] {
  const hasNewVideo = recommendations.some(
    r => !freshnessState.recentlyShown.has(r.video_id)
  );

  if (!hasNewVideo && recommendations.length > 0) {
    // Find a never-shown video appropriate for belt
    const freshVideo = allVideos.find(
      v => isVideoEligible(v, userBelt) &&
           !freshnessState.recentlyShown.has(v.video_id)
    );

    if (freshVideo) {
      // Replace lowest-scored recommendation
      recommendations[recommendations.length - 1] = {
        video_id: freshVideo.video_id,
        baseScore: 10,
        finalScore: 20,
        recommendationReason: 'next_progression',
        reasonText: 'Something new for your game',
      };
    }
  }

  return recommendations;
}
```

### Recommendation Reasons

```typescript
type RecommendationReason =
  | 'recent_struggle'      // You mentioned difficulty with X
  | 'plateau_technique'    // X has been at "developing" for a while
  | 'belt_level_gap'       // Core technique for your belt level
  | 'chain_completion'     // Completes a technique chain you're building
  | 'fundamentals_refresh' // Been a while since you practiced X
  | 'next_progression'     // Natural next step from what you've mastered
  | 'training_focus';      // Aligns with your training goals

const reasonTextTemplates: Record<RecommendationReason, (name: string) => string> = {
  recent_struggle: (name) =>
    `You mentioned difficulty with ${name} in recent sessions. This video can help.`,
  plateau_technique: (name) =>
    `${name} has been at "developing" for a while. Review the fundamentals to break through.`,
  belt_level_gap: (name) =>
    `${name} is a core technique for your belt level that needs attention.`,
  chain_completion: (name) =>
    `Learning ${name} will complete a technique chain you're building.`,
  fundamentals_refresh: (name) =>
    `It's been a while since you practiced ${name}. A quick refresh can help.`,
  next_progression: (name) =>
    `Based on what you've mastered, ${name} is a natural next step.`,
  training_focus: (name) =>
    `${name} aligns with your training goals.`,
};
```

---

## AI Prompts for Personalization

### Struggle-to-Video Matching Prompt

When journal text doesn't map directly to technique IDs, use this prompt:

```
You are matching BJJ training struggles to video content.

User's recent struggle from journal:
"{struggle_text}"

Available video categories:
- Closed Guard (fundamentals, sweeps, submissions)
- Half Guard (sweeps, retention, passing defense)
- Open Guard (butterfly, spider, DLR, retention)
- Mount (escapes, attacks, maintenance)
- Side Control (escapes, attacks, transitions)
- Back Control (escapes, attacks)
- Guard Passing (pressure, speed, techniques)
- Takedowns (wrestling, judo)
- Submissions (chokes, armlocks, leg locks)

Which category (or categories) best addresses this struggle?

Output format:
{
  "categories": ["category1", "category2"],
  "focus": "offense" | "defense" | "both",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}
```

### Personalized Reason Generation Prompt

For generating natural-sounding recommendation reasons:

```
Generate a brief, conversational explanation for why this video is being recommended.

User context:
- Belt level: {belt}
- Recent struggle: "{struggle}"
- Times mentioned: {count} in last {days} days

Video being recommended:
- Title: "{video_title}"
- Instructor: {instructor}
- Category: {category}

Rules:
- Keep under 20 words
- Be specific, not generic
- Match tone to belt level (supportive for white, direct for purple+)
- Don't use gamification language

Output a single sentence recommendation reason.
```

### Example AI Outputs

**White Belt Struggle: "kept getting swept from half guard top"**
```json
{
  "categories": ["half_guard", "guard_passing"],
  "focus": "offense",
  "confidence": 0.9,
  "reasoning": "User is losing position when trying to pass from half guard. Needs both half guard passing concepts and top retention."
}
```

**Reason Text Generated:**
> "Half guard top is giving you trouble. This video covers the exact retention concepts you need."

---

## Belt-Level Filtering

### Configuration Source

```typescript
// From: /prototype/src/config/belt-system/feature-adaptations.ts

const videoTutorialAdaptation: Record<BeltLevel, VideoTutorialAdaptation> = {
  white: {
    recommendedCategories: [
      'escapes', 'basic-sweeps', 'closed-guard-fundamentals',
      'mount-defense', 'back-escape', 'posture'
    ],
    difficultyRange: { min: 1, max: 3 },
    prioritizeDefense: true,
    includeConceptual: false,
    weeklyRecommendationCount: 3,
  },
  blue: {
    recommendedCategories: [
      'guard-systems', 'passing-fundamentals', 'submission-chains',
      'half-guard', 'open-guard-intro', 'takedowns'
    ],
    difficultyRange: { min: 2, max: 5 },
    prioritizeDefense: false,
    includeConceptual: true,
    weeklyRecommendationCount: 5,
  },
  purple: {
    recommendedCategories: [
      'advanced-guards', 'leg-locks', 'combination-attacks',
      'guard-retention', 'pressure-passing', 'conceptual'
    ],
    difficultyRange: { min: 4, max: 8 },
    prioritizeDefense: false,
    includeConceptual: true,
    weeklyRecommendationCount: 5,
  },
  brown: {
    recommendedCategories: [
      'advanced-leg-locks', 'competition-footage', 'high-level-concepts',
      'teaching-methodology', 'game-refinement'
    ],
    difficultyRange: { min: 6, max: 10 },
    prioritizeDefense: false,
    includeConceptual: true,
    weeklyRecommendationCount: 3,
  },
  black: {
    recommendedCategories: [
      'competition-analysis', 'teaching-methodology',
      'innovation', 'high-level-concepts'
    ],
    difficultyRange: { min: 7, max: 10 },
    prioritizeDefense: false,
    includeConceptual: true,
    weeklyRecommendationCount: 2,
  },
};
```

### Content Gates

| Content Type | White | Blue | Purple | Brown | Black |
|--------------|-------|------|--------|-------|-------|
| Basic positions | Yes | Yes | Yes | Yes | Yes |
| Guard sweeps | Yes | Yes | Yes | Yes | Yes |
| Basic submissions | Yes | Yes | Yes | Yes | Yes |
| Leg locks (basic) | No | Yes | Yes | Yes | Yes |
| Heel hooks | No | No | Yes | Yes | Yes |
| Berimbolo/inversions | No | No | Yes | Yes | Yes |
| Competition strategy | No | Yes | Yes | Yes | Yes |
| Teaching methodology | No | No | Yes | Yes | Yes |
| Conceptual content | No | Yes | Yes | Yes | Yes |

---

## Implementation Paths

### MVP (Phase 1): Lookup Table Approach

Simpler implementation using pre-defined rules without AI scoring:

```typescript
// MVP: Belt-based lookup with basic signal matching
function getMVPRecommendations(
  userBelt: BeltLevel,
  signals: JournalSignals
): ForYouSection {
  const recommendations: VideoRecommendation[] = [];

  // 1. Priority: Address documented struggles
  for (const [techniqueId] of signals.struggles) {
    const video = findVideoForTechnique(techniqueId, userBelt);
    if (video && recommendations.length < 2) {
      recommendations.push({
        video,
        reason: 'recent_struggle',
        reason_text: 'Based on your recent training notes',
        priority: 'high',
      });
    }
  }

  // 2. Fill remaining with belt-appropriate core techniques
  const beltDefaults = getBeltDefaultVideos(userBelt);
  for (const video of beltDefaults) {
    if (recommendations.length >= 5) break;
    if (!recommendations.some(r => r.video.video_id === video.video_id)) {
      recommendations.push({
        video,
        reason: 'belt_level_gap',
        reason_text: `Core ${userBelt} belt technique`,
        priority: 'medium',
      });
    }
  }

  return {
    recommendations,
    generated_at: new Date().toISOString(),
    based_on_sessions: signals.sessionsAnalyzed,
    user_belt: userBelt,
  };
}
```

### Phase 2: Full AI Scoring Engine

Complete implementation with weighted scoring, temporal decay, and AI copy:

```typescript
// Phase 2: Full scoring engine
async function getAIRecommendations(
  user: User,
  sessions: SessionData[],
  freshnessState: FreshnessState
): Promise<ForYouSection> {
  // 1. Extract signals from journal
  const signals = extractSignals(sessions);

  // 2. Get eligible videos
  const eligibleVideos = getEligibleVideos(user.belt_level);

  // 3. Score all videos
  const scoredVideos = eligibleVideos.map(video =>
    calculateVideoScore(video, signals, user.belt_level)
  );

  // 4. Sort by final score
  const ranked = scoredVideos.sort((a, b) => b.finalScore - a.finalScore);

  // 5. Apply diversity rules
  const diverse = applyDiversityRules(ranked, freshnessState, 5);

  // 6. Inject freshness
  const withFreshness = injectFreshnessVideo(diverse, eligibleVideos,
    user.belt_level, freshnessState);

  // 7. Generate AI copy (optional enhancement)
  const withCopy = await generatePersonalizedCopy(withFreshness, signals);

  return {
    recommendations: withCopy,
    generated_at: new Date().toISOString(),
    based_on_sessions: sessions.length,
    user_belt: user.belt_level,
  };
}
```

### Implementation Timeline

| Phase | Scope | Dependencies |
|-------|-------|--------------|
| **MVP (Phase 1)** | Belt filtering, basic signal matching, template copy | Video library complete |
| **Phase 2a** | Weighted scoring, temporal decay | Session data schema finalized |
| **Phase 2b** | Diversity rules, freshness tracking | User analytics infrastructure |
| **Phase 2c** | AI copy generation | LLM integration complete |
| **Phase 3** | Feedback loop, A/B testing | Analytics pipeline |

---

## Example Scenarios by Belt

### Scenario 1: White Belt Getting Smashed from Side Control

**User Profile:**
- Belt: White (3 stripes)
- Training: 6 weeks
- Sessions logged: 12

**Journal Signals (Last 10 Sessions):**
- `struggled_with`: ["side control escape" x4, "framing" x2]
- `submissions_received`: ["kimura" x2, "americana" x1]
- `positions`: ["side control" x6, "mount" x4]

**Recommendations Generated:**

| Priority | Video | Reason Text |
|----------|-------|-------------|
| High | "The Best Way To Escape Side Control" (Lachlan Giles) | "You've mentioned side control escapes 4x this month" |
| High | "How To Do The Perfect BJJ Side Control Escape" (John Danaher) | "Stop getting caught in kimuras" |
| Medium | "Escaping The Back" (Lachlan Giles) | "Core white belt technique" |
| Medium | "Single And Double Leg Takedowns For Beginners" (Stephan Kesting) | "Every white belt needs this" |
| Low | "John Danaher Explains Closed Guard Fundamentals" | "Build a safe position to work from" |

---

### Scenario 2: Blue Belt Stuck at Guard Passing

**User Profile:**
- Belt: Blue (2 stripes)
- Training: 18 months
- Sessions logged: 87

**Journal Signals (Last 10 Sessions):**
- `struggled_with`: ["knee shield" x3, "half guard passing" x2]
- `positions`: ["guard passing" x7, "half guard top" x5]
- `techniques_drilled`: ["knee slice" x4, "smash pass" x2]

**Recommendations Generated:**

| Priority | Video | Reason Text |
|----------|-------|-------------|
| High | "6 Approaches To Passing The Knee Shield" (Lachlan Giles) | "Knee shield is killing your passes" |
| High | "How To Pass The BJJ Half Guard No Gi" (Lachlan Giles) | "Address your half guard passing struggles" |
| Medium | "Understanding Guard Passing - Concepts And Heuristics" (Lachlan Giles) | "Systems thinking for your passing game" |
| Medium | "5 Tips To Pass ANY Guard" (John Danaher) | "Blue belt passing concepts" |
| Low | "How To Build The Perfect Half Guard Game" (John Danaher) | "Understand it to beat it" |

---

### Scenario 3: Purple Belt Working Leg Locks

**User Profile:**
- Belt: Purple (1 stripe)
- Training: 4 years
- Sessions logged: 243

**Journal Signals (Last 10 Sessions):**
- `worked_well`: ["saddle entries" x3, "heel hook finish" x2]
- `struggled_with`: ["heel hook defense" x2, "50/50 escapes" x1]
- `submissions_received`: ["heel hook" x2]
- `training_type`: nogi (8/10 sessions)

**Recommendations Generated:**

| Priority | Video | Reason Text |
|----------|-------|-------------|
| High | "Defending And Escaping The Saddle" (Lachlan Giles) | "You're getting caught in heel hooks—fix the defense" |
| High | "Rolling Out Of Heel Hooks" (Lachlan Giles) | "Defense before offense in leg lock game" |
| Medium | "The Most Basic Principles Of Butterfly And Open Guard" (Gordon Ryan) | "Entry points for your leg lock game" |
| Medium | "How To Build The Perfect Half Guard Game For No Gi" (John Danaher) | "Half guard to leg entanglement chains" |
| Low | "Overcoming Burnout - Where Discipline Comes From" (Jocko Willink) | "Mental game for the grind" |

---

### Scenario 4: Brown Belt Refining Submissions

**User Profile:**
- Belt: Brown (2 stripes)
- Training: 9 years
- Sessions logged: 512

**Journal Signals (Last 10 Sessions):**
- `techniques_drilled`: ["RNC finish details" x3, "back control retention" x2]
- `worked_well`: ["back takes" x4]
- `submissions_given`: ["rear naked choke" x6]
- Training focus: "finish rate improvement"

**Recommendations Generated:**

| Priority | Video | Reason Text |
|----------|-------|-------------|
| High | "Finishing A Mandible Rear Naked" (Craig Jones) | "Micro-details for your RNC finish rate" |
| Medium | "Escaping The Back" (Lachlan Giles) | "Understand what they're trying to do" |
| Medium | "Understanding Guard Passing - Concepts And Heuristics" (Lachlan Giles) | "Efficiency is the brown belt game" |
| Low | "Discipline Equals Freedom" (Jocko Willink) | "The long game perspective" |
| Low | "Training Smart - Never Be Sore Philosophy" (Firas Zahabi) | "Longevity principles" |

---

## Video Library Integration

### Technique ID Mapping

Videos are mapped to technique IDs using position prefixes:

```typescript
const techniqueIdPrefixes: Record<string, string> = {
  'CG': 'Closed Guard',
  'HG': 'Half Guard',
  'OG': 'Open Guard',
  'MT': 'Mount',
  'SC': 'Side Control',
  'BC': 'Back Control',
  'NS': 'North-South',
  'TT': 'Turtle',
  'TD': 'Takedowns',
  'CL': 'Clinch',
  'GP': 'Guard Passing',
  'KB': 'Knee on Belly',
  'SM': 'Submissions',
  'TR': 'Transitions',
  // Mindset categories
  'BJ': 'Belt Journey',
  'MG': 'Mental Game',
  'AL': 'Age & Longevity',
  'LB': 'Lifestyle',
  'IR': 'Injury & Recovery',
};
```

### Matching Journal Text to Technique IDs

```typescript
// Struggle text → Technique ID patterns
const strugglePatterns: Record<string, string[]> = {
  // Guard escapes
  'mount escape': ['MT_001', 'MT_002', 'MT_003'],
  'side control escape': ['SC_016', 'SC_001', 'SC_002'],
  'back escape': ['BC_014', 'BC_001', 'BC_003'],

  // Guard retention
  'guard pass': ['OG_019', 'OG_020', 'HG_001'],
  'half guard': ['HG_001', 'HG_016', 'HG_019'],

  // Submissions (defense)
  'triangle': ['CG_008', 'SM_005'],
  'armbar': ['SM_004', 'CG_001'],
  'guillotine': ['CL_017', 'SM_010'],
  'rear naked': ['BC_005', 'SM_001'],
};
```

### Priority Instructors

Videos from these instructors receive a scoring bonus:

1. **John Danaher** — Systematic teaching, conceptual depth
2. **Gordon Ryan** — Modern technique, competition-proven
3. **Lachlan Giles** — Clear explanations, accessible style
4. **Craig Jones** — Leg lock expertise, entertaining delivery

---

## Success Metrics

### Primary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Video Watch Rate** | >40% | % of recommended videos that users start watching |
| **Video Completion Rate** | >60% | % of started videos watched to >80% duration |
| **Return to For You** | >3x/week | Times user visits recommendation section |
| **Relevance Rating** | >4.0/5 | User feedback on "Was this helpful?" |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Struggle Resolution** | 50% decrease | Same struggle mentioned less after video watched |
| **Technique Proficiency Gain** | +0.5 level/month | Users who watch videos improve faster |
| **Session Logging Rate** | +20% | More journal entries = better recommendations |
| **Diversity Score** | >0.7 | Entropy of position/instructor distribution |

### Tracking Implementation

```typescript
interface RecommendationAnalytics {
  recommendation_id: string;
  user_id: string;
  video_id: string;
  recommendation_reason: RecommendationReason;
  displayed_at: string;

  // Engagement
  clicked: boolean;
  clicked_at?: string;
  watch_started: boolean;
  watch_started_at?: string;
  watch_completed: boolean;
  watch_duration_seconds?: number;

  // Feedback
  user_rating?: 1 | 2 | 3 | 4 | 5;
  user_feedback?: string;
  saved_for_later: boolean;

  // Context
  signals_snapshot: JournalSignals;
  final_score: number;
  position_in_list: number;
}

async function trackRecommendation(
  event: 'display' | 'click' | 'start' | 'complete' | 'rate',
  data: Partial<RecommendationAnalytics>
): Promise<void> {
  await analyticsService.track('recommendation_event', {
    event_type: event,
    timestamp: new Date().toISOString(),
    ...data,
  });
}
```

### Feedback Loop Integration

```
User watches video
       ↓
Track completion → Update engagement metrics
       ↓
User logs next session
       ↓
Check if related struggle decreased
       ↓
Adjust scoring weights based on outcome
```

---

## Implementation Reference

### React Hook Usage

```typescript
import { useBeltPersonalization } from '@/hooks';
import { getBeltSpecificRecommendations } from '@/data/techniqueVideos';

function TechniqueLibrary() {
  const { videoTutorials, profile } = useBeltPersonalization();

  // Get recommendations using built-in function
  const recommendations = getBeltSpecificRecommendations(profile.beltLevel);

  // Or generate custom recommendations
  const customRecommendations = generateRecommendations({
    recentStruggles: extractStruggles(recentJournalEntries),
    plateauedTechniques: getPlateauedTechniques(techniqueProgress),
    beltLevel: profile.beltLevel,
    techniqueProgress: userTechniqueMap,
    trainingGoals: profile.trainingGoals,
  });

  return (
    <ForYouSection
      recommendations={recommendations}
      difficultyRange={videoTutorials.difficultyRange}
      prioritizeDefense={videoTutorials.prioritizeDefense}
    />
  );
}
```

### Recommendation Output Interface

```typescript
interface ForYouSection {
  recommendations: VideoRecommendation[];
  generated_at: string;          // ISO timestamp
  based_on_sessions: number;     // Sessions analyzed
  user_belt: BeltLevel;
}

interface VideoRecommendation {
  video: TechniqueVideo;
  technique_name: string;
  position_category: string;
  reason: RecommendationReason;
  reason_text: string;           // Human-readable explanation
  priority: 'high' | 'medium';
  user_proficiency: ProficiencyLevel | null;
  times_practiced: number;
  last_practiced: string | null; // ISO date
}
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `VIDEO_CONTENT_LIBRARY_SPEC.md` | Video schema, curation criteria, maintenance |
| `DATA_AND_AI_BY_PAGE.md` | How recommendations appear in Techniques page |
| `BELT_INTEGRATION_SPEC.md` | Belt-level personalization contracts |
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | How struggle data is captured |

---

*Document Version: 1.0*
*Last Updated: January 21, 2026*
*Author: TOMO Product Team*
