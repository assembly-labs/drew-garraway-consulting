# TOMO: Technology, Data & AI Overview

> **Purpose:** A 10,000 ft view of how technology, data, and AI power TOMO's product features. This document helps developers understand the technical landscape without diving into implementation details.
>
> **Audience:** Developers, technical stakeholders, AI/ML engineers
>
> **Last Updated:** January 25, 2026

---

## Executive Summary

TOMO is a voice-first BJJ training journal that uses three core technology pillars:

| Pillar | Purpose | Key Technology |
|--------|---------|----------------|
| **Voice Capture** | Convert spoken training reflections to structured data | AssemblyAI transcription |
| **Belt Personalization** | Adapt every feature to user's belt level | Rule-based config system |
| **AI Insights** | Generate coaching feedback from training patterns | LLM (Claude Sonnet recommended) |

---

## Technology Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
│  React 18 + TypeScript + Vite                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    STATS     │  │   JOURNAL    │  │  TECHNIQUES  │  │   INSIGHTS   │    │
│  │  Dashboard   │  │   History    │  │   Library    │  │   Feedback   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         └─────────────────┴─────────────────┴─────────────────┘             │
│                                   │                                          │
├───────────────────────────────────┼──────────────────────────────────────────┤
│                      BELT PERSONALIZATION LAYER                              │
│                                   │                                          │
│            useBeltPersonalization() Hook                                     │
│            ┌──────────────────────┴─────────────────────┐                   │
│            │                                            │                   │
│  ┌─────────┴────────┐  ┌────────────────┐  ┌───────────┴────────┐          │
│  │  Belt Profiles   │  │ Feature Config │  │   Risk Signals     │          │
│  │  (psychology)    │  │  (adaptations) │  │   (dropout detect) │          │
│  └──────────────────┘  └────────────────┘  └────────────────────┘          │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                          DATA & AI SERVICES                                  │
│                                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │  VOICE CAPTURE   │  │  PATTERN ENGINE  │  │  INSIGHT GEN     │          │
│  │  AssemblyAI      │  │  Local compute   │  │  LLM API         │          │
│  │  transcription   │  │  (aggregations)  │  │  (Claude Sonnet) │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                            DATA STORAGE                                      │
│                                                                              │
│  Prototype: localStorage          Production: Supabase (PostgreSQL)         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature-to-Technology Matrix

| Feature | Data Sources | AI/Tech Used | Belt Personalization |
|---------|--------------|--------------|----------------------|
| **Session Logger (Voice)** | Audio recording | AssemblyAI transcription, NLP extraction | Prompt complexity |
| **Session Logger (Text)** | User input | Keyword extraction, technique matching | Field visibility |
| **Stats Dashboard** | Session history, submissions | Pattern analysis, breakthrough detection | Module visibility, metrics |
| **Training Insights** | Journal entries, patterns | LLM coaching generation | Tone, vocabulary, topics |
| **Technique Library** | Journal mentions, struggles | Recommendation algorithm | Content filtering, difficulty |
| **Journal History** | All sessions | Sentiment extraction | Card complexity |
| **Profile/Settings** | User profile | None | N/A |
| **Risk Detection** | Multi-source | Signal aggregation, trend analysis | Risk thresholds |

---

## 1. Voice Capture System

### Purpose
Convert voice recordings (60-90 seconds) into structured session data, capturing what exhausted post-training users would otherwise forget.

### Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Audio Capture | expo-av (React Native) | Cross-platform recording |
| Transcription | AssemblyAI | 24% better on proper nouns vs Whisper |
| Entity Extraction | NLP patterns | Extract techniques, submissions, durations |
| Custom Vocabulary | AssemblyAI word_boost | ~180 BJJ terms (kimura, de la riva, etc.) |

### Data Flow

```
Audio Recording (60-90 sec)
        ↓
Upload to AssemblyAI
        ↓
Transcription with BJJ vocabulary boost
        ↓
NLP Extraction (duration, techniques, submissions, struggles)
        ↓
Confidence Scoring (>90% auto-accept, 50-70% prompt user)
        ↓
Review Screen (user confirms/edits)
        ↓
Structured Session Data saved
```

### Key Extractions

| Data Type | Examples | Confidence Target |
|-----------|----------|-------------------|
| Duration | "hour and a half" → 90 min | >90% |
| Training Type | "gi class", "no-gi" | >95% |
| Techniques | "armbar", "scissor sweep" | >80% |
| Submissions Given | "tapped him with an RNC" | >85% |
| Submissions Received | "got caught in a triangle" | >85% |
| Struggles | "couldn't escape mount" | >75% |
| Energy Level | "exhausted", "felt great" | >80% |

### Cost Profile

| Scale | Monthly Cost | Calculation |
|-------|--------------|-------------|
| 100 users | ~$28 | 3 sessions/week × 90 sec × $0.0062/min |
| 1,000 users | ~$280 | Same formula |
| 10,000 users | ~$2,800 | Same formula |

---

## 2. Belt Personalization Engine

### Purpose
Adapt every user-facing feature to the user's belt level, because a white belt and purple belt have fundamentally different needs, psychology, and vocabulary.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    useBeltPersonalization() Hook                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUTS:                                                         │
│  - User belt level (white, blue, purple, brown, black)          │
│  - Session count                                                 │
│  - Risk signals (gaps, sentiment, frequency)                     │
│                                                                  │
│  OUTPUTS (per feature area):                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    profile      │  │   dashboard     │  │    chatbot      │  │
│  │ (psychology)    │  │ (metrics/mods)  │  │ (AI config)     │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ struggles       │  │ primaryMetric   │  │ toneProfile     │  │
│  │ motivations     │  │ showCompetition │  │ vocabulary      │  │
│  │ plateaus        │  │ moduleVisibility│  │ emphasizeTopics │  │
│  │ dropoutRisk     │  │ celebrations    │  │ avoidTopics     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ videoTutorials  │  │ sessionLogger   │  │ analyzeJournal  │  │
│  │ (content gate)  │  │ (prompts)       │  │ (patterns)      │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ difficultyRange │  │ sessionMessage  │  │ detectBreak-    │  │
│  │ prioritizeDefense│ │ fieldVisibility │  │ through()       │  │
│  │ showLegLocks    │  │ voicePrompts    │  │ detectRisk()    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Belt Adaptation Examples

| Feature | White Belt | Blue Belt | Purple Belt |
|---------|------------|-----------|-------------|
| **Primary Metric** | Session streak | Technique variety | Sparring rounds |
| **AI Tone** | Warm, supportive | Coaching, balanced | Peer, analytical |
| **Vocabulary** | Basic positions | Full BJJ terms | Advanced systems |
| **Content Gates** | No leg locks | Basic leg locks | All content |
| **Stats Modules** | Progress ring, calendar | + Style fingerprint, blues detector | + System mastery |
| **Celebration Threshold** | Every 10 sessions | Every 25 sessions | Every 50 sessions |

### Implementation Files

| File | Purpose |
|------|---------|
| `/config/belt-system/belt-profiles.ts` | Psychology per belt |
| `/config/belt-system/feature-adaptations.ts` | UI/AI config per belt |
| `/config/belt-system/risk-signals.ts` | Dropout detection logic |
| `/config/belt-system/journal-patterns.ts` | Text analysis patterns |
| `/hooks/useBeltPersonalization.ts` | React hook aggregator |

---

## 3. AI Insight Generation

### Purpose
Generate personalized, data-grounded coaching insights that help practitioners see patterns they'd miss in their own data.

### The Observation Engine Model

```
INPUT: User's session data (last N sessions)
       + User profile (belt, goals, frequency)
       + Pre-computed patterns
       + Journal text analysis

PROCESS: LLM synthesizes patterns into natural language

OUTPUT: Specific, data-grounded observation
        + Focus areas
        + Suggested coach conversation topic
```

### System Prompt Architecture

```
┌─────────────────────────────────────────┐
│     BASE SYSTEM PROMPT (Static)         │
│  - Role: "Dedicated Training Partner"   │
│  - 6 non-negotiable rules               │
│  - Voice attributes                     │
│  - Formatting requirements              │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│    BELT TONE LAYER (Per-Belt)           │
│  - Tone profile (warm → analytical)     │
│  - Vocabulary level                     │
│  - Topics to emphasize                  │
│  - Topics to avoid                      │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│    USER CONTEXT (Dynamic)               │
│  - Profile summary                      │
│  - Recent sessions (structured)         │
│  - Computed patterns                    │
│  - Journal text analysis results        │
└─────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────┐
│    GENERATION TASK (Per Insight Type)   │
│  - Selected insight archetype           │
│  - Output format requirements           │
│  - Length constraints                   │
└─────────────────────────────────────────┘
```

### Insight Types (MVP)

| Type | Trigger | Focus |
|------|---------|-------|
| **Consistency** | Default | Sessions vs. target, frequency trends |
| **Technique Focus** | 4+ mentions in 10 sessions | Repeated technique work, depth |
| **Struggle Pattern** | 3+ mentions of same struggle | Recurring challenges, coaching suggestions |
| **Win Pattern** | 3+ same submission landed | Emerging strengths |
| **Variety Check** | >85% one training type | Gi/nogi balance observation |

### Generation Rules

| Rule | Implementation |
|------|----------------|
| **Frequency** | Max 1 insight per calendar day |
| **Trigger** | Only if new session logged since last insight |
| **Length** | 150-250 words, 2-4 paragraphs |
| **Coach Deferral** | ALWAYS include "worth discussing with your coach" |
| **Validation** | Check against forbidden patterns before display |

### Forbidden Patterns (Validation)

```typescript
// Auto-reject if matched
const FORBIDDEN = [
  /\bstreak\b/i,           // No gamification
  /\blevel up\b/i,         // No gamification
  /\bunlock\b/i,           // No gamification
  /\bcrushing it\b/i,      // No empty hype
  /\bamazing!\b/i,         // No hollow superlatives
  /\bhack\b/i,             // No shortcuts
  /\bsecret\b/i,           // No shortcuts
  /\bnext belt\b/i,        // No promotion timelines
  /\byou should.*instead/i // No technique corrections
];
```

---

## 4. Pattern Detection & Analysis

### Purpose
Compute patterns from raw session data to power stats visualizations and feed into AI insights.

### Pattern Categories

#### Frequency & Consistency Patterns

| Pattern | Calculation | Used By |
|---------|-------------|---------|
| Sessions/week | Rolling 4-week average | Dashboard, Insights |
| vs. Target | sessionsActual / targetFrequency | Dashboard |
| Current gap | Days since last session | Risk detection |
| Longest gap | Max gap in last 30 days | Risk detection |
| Day-of-week distribution | Sessions by weekday | Insights |

#### Technique Patterns

| Pattern | Calculation | Used By |
|---------|-------------|---------|
| Most common technique | Top from techniquesDrilled[] | Dashboard, Insights |
| Technique variety | Unique techniques / total mentions | Dashboard (blue belt metric) |
| Technique co-occurrence | Pair frequency analysis | TechniquePairings module |
| Technique chains | Sequential attempts in same round | Technique Web (future) |

#### Performance Patterns

| Pattern | Calculation | Used By |
|---------|-------------|---------|
| Submission ratio | Given / (given + received) | Attack Profile |
| Most landed submission | Top from submissionsGiven[] | Dashboard, Insights |
| Most received submission | Top from submissionsReceived[] | Watch Out section |
| Position strength | Win rate by position | Style Fingerprint |

#### Journal Text Analysis

| Pattern | Detection | Examples |
|---------|-----------|----------|
| `ego_challenge` | Frustration phrases | "got smashed", "humbled" |
| `breakthrough` | Success signals | "finally hit", "clicked" |
| `injury_mention` | Body concerns | "tweaked", "sore", "hurt" |
| `frustration` | Negative spiral | "can't", "never", "keep losing" |
| `progress` | Positive momentum | "improving", "felt good" |
| `plateau` | Stagnation | "stuck", "no progress" |

---

## 5. Risk Detection System

### Purpose
Identify users at risk of dropping out and trigger appropriate interventions before they leave.

### Risk Signals

| Signal | Threshold | Weight | Detection |
|--------|-----------|--------|-----------|
| Extended gap | >7 days | High | Days since last session |
| Frequency decline | >30% drop | High | Compare 4-week periods |
| Negative sentiment | 3+ entries | Medium | Journal text analysis |
| Missed targets | <50% for 3 weeks | Medium | Sessions vs. target |
| Injury mentions | 2+ in 4 weeks | Medium | Journal text analysis |
| Short sessions | 3+ under 45min | Low | Duration trending |
| No sparring | 5+ sessions | Low | Sparring = false streak |

### Belt-Specific Risk Modifiers

| Belt | Dropout Risk Window | Risk Multiplier |
|------|---------------------|-----------------|
| White | 0-6 months | 1.5x (highest risk) |
| Blue | 0-12 months post-promotion | 1.3x (blue belt blues) |
| Purple | Any | 0.8x (committed) |
| Brown | Any | 0.5x (very committed) |

### Intervention Examples

**White Belt (High Risk):**
> "We noticed you've been away for a bit. That's okay—everyone's journey looks different. When you're ready, we'll be here."

**Blue Belt (Blue Belt Blues):**
> "The blue belt plateau is real. The ones who become purple belts are the ones who kept showing up anyway."

---

## 6. Data Models

### Core Entities

```typescript
// Session (primary data unit)
interface Session {
  id: string;
  user_id: string;
  date: string;                    // ISO date
  training_type: 'gi' | 'nogi' | 'both';
  duration_minutes: number;
  class_type: 'fundamentals' | 'advanced' | 'comp_prep' | 'open_mat' | 'drilling';
  techniques_drilled: string[];
  did_spar: boolean;
  sparring_rounds?: number;
  submissions_given: Submission[];
  submissions_received: Submission[];
  worked_well?: string;
  struggled_with?: string;
  notes?: string;
  energy_level?: 1 | 2 | 3 | 4 | 5;
  injuries?: Injury[];
  created_at: string;
  updated_at: string;
}

// User Profile
interface UserProfile {
  id: string;
  name: string;
  belt: BeltLevel;
  stripes: number;
  training_start_date?: string;
  current_belt_date?: string;
  target_frequency?: number;       // Sessions per week
  training_goals?: string[];
  gym_name?: string;
  birth_year?: number;
}

// Technique
interface Technique {
  id: string;
  name: string;
  position: Position;
  category: TechniqueCategory;
  belt_level: BeltLevel;
  description: string;
  key_points: string[];
  common_mistakes: string[];
  video_id?: string;
}

// AI Insight
interface Insight {
  id: string;
  user_id: string;
  type: InsightType;
  content: string;
  focus_areas: string[];
  generated_at: string;
  session_trigger_id: string;     // Session that triggered generation
}
```

### Data Storage

| Environment | Technology | Notes |
|-------------|------------|-------|
| **Prototype** | localStorage | All data persisted in browser |
| **Production** | Supabase (PostgreSQL) | Real-time sync, auth, row-level security |

---

## 7. Technology Summary by Page

### STATS (Dashboard)

| Technology | Purpose |
|------------|---------|
| Local computation | Aggregate sessions into stats |
| Pattern engine | Detect streaks, breakthroughs, trends |
| Belt config | Determine which modules to show |
| No LLM | Stats are computed, not generated |

### SESSION LOGGER

| Technology | Purpose |
|------------|---------|
| AssemblyAI | Voice-to-text transcription |
| NLP extraction | Parse structured data from transcript |
| Belt config | Determine prompt complexity, field visibility |
| No LLM | Extraction is rule-based, not generative |

### TRAINING INSIGHTS

| Technology | Purpose |
|------------|---------|
| Pattern engine | Pre-compute patterns for LLM context |
| Journal analysis | Detect sentiment, breakthroughs, struggles |
| LLM (Claude) | Generate personalized coaching text |
| Belt config | Determine tone, vocabulary, topics |

### TECHNIQUES

| Technology | Purpose |
|------------|---------|
| Recommendation algo | Match struggles → videos |
| Belt config | Filter by difficulty, gate content |
| No LLM | Recommendations are rule-based |

### JOURNAL

| Technology | Purpose |
|------------|---------|
| Sentiment extraction | Flag entries for risk detection |
| Technique matching | Normalize technique mentions |
| Belt config | Determine card complexity |
| No LLM | Display is data-driven |

---

## 8. Implementation Priorities

### MVP (Required for Launch)

| Feature | Technology | Status |
|---------|------------|--------|
| Voice transcription | AssemblyAI | Spec complete |
| Belt personalization | Config system | Implemented |
| Pattern computation | Local compute | Implemented |
| AI insight generation | LLM API | Spec complete |
| Risk detection | Signal aggregation | Partially implemented |

### Post-MVP

| Feature | Technology | Priority |
|---------|------------|----------|
| Streaming insights | LLM streaming | P1 |
| Offline voice queue | Local storage + sync | P1 |
| Multi-language support | Translation layer | P2 |
| Advanced technique chains | ML model | P3 |
| Social features | Backend expansion | P3 |

---

## Related Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **Voice Transcription Spec** | AssemblyAI integration details | `/docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md` |
| **Insights Generation Spec** | LLM prompts and payloads | `/docs/data-and-ai/INSIGHTS_GENERATION_SPEC.md` |
| **Data & AI by Page** | Per-page data flows | `/docs/data-and-ai/DATA_AND_AI_BY_PAGE.md` |
| **Belt Integration Spec** | Per-page belt adaptations | `/docs/product/BELT_INTEGRATION_SPEC.md` |
| **First Principles** | 12 non-negotiable rules | `/docs/FIRST_PRINCIPLES.md` |

---

*This document provides the 10,000 ft view. For implementation details, see the related documentation.*
