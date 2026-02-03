# Training Feedback (Insights) - Product Requirements Document

**Feature:** AI-Generated Training Insights
**Page:** Insights Tab (Training Feedback)
**Status:** MVP Specification Complete
**Last Updated:** January 25, 2026
**Component:** `TrainingFeedback.tsx`

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [User Flow](#user-flow)
4. [Trigger System](#trigger-system)
5. [Data Available for Insights](#data-available-for-insights)
6. [Insight Types (MVP)](#insight-types-mvp)
7. [LLM System Prompt Architecture](#llm-system-prompt-architecture)
8. [Belt Personalization](#belt-personalization)
9. [UI Specification](#ui-specification)
10. [Prioritization (MoSCoW)](#prioritization-moscow)
11. [Anti-Patterns](#anti-patterns)
12. [Validation Rules](#validation-rules)
13. [Implementation Status](#implementation-status)
14. [Related Documentation](#related-documentation)

---

## Overview

### Purpose

Generate personalized, data-grounded training insights that help practitioners reflect on their patterns, progress, and focus areas. The AI acts as a "Dedicated Training Partner"—observing what users might miss in their own data.

### Core Value Proposition

> "Your training data, illuminated. Patterns you didn't notice. Questions worth asking your coach."

Users log sessions but rarely step back to see the bigger picture. Insights surface patterns that would otherwise require manual analysis: recurring struggles, technique focus drift, consistency trends, submission patterns.

### What This Feature Is NOT

| We Are | We Are NOT |
|--------|------------|
| Pattern observation engine | Technique instructor |
| Coach amplifier | Coach replacement |
| Data mirror | Promotion predictor |
| Reflection prompter | Comparison engine |
| Belt-appropriate mentor | Motivational poster generator |

### The Archetype: The Dedicated Training Partner

> "We're the purple belt who's been training for six years. Not the loudest person in the room, but the one everyone trusts to roll with on their first day and their hundredth. We remember what it felt like to be new. We've seen enough to know what matters. We're still learning too."
>
> — Brand Voice Guide

---

## Design Philosophy

### Alignment with First Principles

| Principle | Application to Insights |
|-----------|-------------------------|
| **#1 Reflection Is Foundation** | Every insight prompts reflection by surfacing patterns users missed |
| **#4 Be Helpful** | Every insight must answer "how does this help them train better?" |
| **#5 Belt Psychology** | Tone, depth, vocabulary, and topics adapt to belt level |
| **#7 Amplify Coaches** | Every insight ends with coach deferral—never prescription |
| **#9 Specificity Over Encouragement** | "Triangle improved 40%" beats "You're doing great!" |
| **#11 Flashlight Not Path** | We illuminate patterns; users decide what to do |

### The Observation Engine Model

The LLM functions as a **pattern observation engine**, not a knowledge base:

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

The LLM doesn't need deep BJJ knowledge—it observes patterns in data and presents them in a belt-appropriate voice.

### Four Pillars Framework

Insights should touch on the four data pillars that drive BJJ development:

| Pillar | Weight | Insight Focus |
|--------|--------|---------------|
| **Technical Proficiency** | 35% | Techniques mentioned, drilling patterns, proficiency signals |
| **Sparring Performance** | 30% | Submissions, outcomes, partner context, performance trends |
| **Consistency** | 20% | Session frequency, mat hours, gaps, targets |
| **Character** | 15% | Teaching, energy/mood, goals, mental state |

---

## User Flow

### Primary Flow: Daily Insight Generation

```
User logs a session
        ↓
System marks: new_session_available = true
        ↓
User opens Insights tab (any time later that day or after)
        ↓
System checks generation eligibility ──── Not eligible ──▶ Show state message
        ↓ Eligible
Loading state (1-2 seconds)
        ↓
LLM generates insight based on recent data
        ↓
Insight displays with typewriter effect (streaming if available)
        ↓
User reads insight, sees focus areas
        ↓
Coach reminder displays at end
        ↓
Call to action: "Log another session to unlock next insight"
```

### State Machine

| State | Condition | Display |
|-------|-----------|---------|
| `loading` | Checking eligibility | Spinner + "Checking for insights..." |
| `generating` | New session exists, calling LLM | Spinner + "Analyzing your training..." |
| `ready` | Insight generated | Typewriter text + focus areas + coach reminder |
| `cached` | Same-day return visit | Previous insight (no regeneration) |
| `already_generated` | No new session since last insight | "Log a session to unlock next insight" |
| `no_session` | Zero sessions or < 3 total | "Log your first sessions to unlock AI feedback" |
| `error` | LLM failed | Fallback message + retry option |

---

## Trigger System

### Generation Rules

| Rule | Requirement | Rationale |
|------|-------------|-----------|
| **Daily Cap** | Max 1 insight per calendar day | Prevents spam, maintains perceived value |
| **New Session Required** | Must log session since last insight | Ensures new data to analyze |
| **Minimum Sessions** | 3+ total sessions | Need data for meaningful patterns |
| **Same-Day Cache** | If generated today, show cached | No wasted LLM calls |

### Eligibility Check (Pseudocode)

```typescript
function checkInsightEligibility(tracking: InsightTracking): InsightStatus {
  const today = getTodayDateString();

  // Already generated today → show cached
  if (tracking.lastInsightDate === today && tracking.todaysInsight) {
    return 'cached';
  }

  // Not enough sessions for patterns
  if (tracking.totalSessions < 3) {
    return 'no_session';
  }

  // No new session since last insight
  if (tracking.lastSessionDate <= tracking.lastInsightDate) {
    return 'already_generated';
  }

  // Ready to generate
  return 'ready_to_generate';
}
```

---

## Data Available for Insights

### Session Data (Per Entry)

| Field | Type | Insight Usage |
|-------|------|---------------|
| `date` | string | Training frequency, day-of-week patterns |
| `trainingType` | enum | Gi/nogi distribution |
| `durationMinutes` | number | Training volume, mat hours |
| `techniquesDrilled` | string[] | Technique focus patterns |
| `didSpar` | boolean | Sparring frequency |
| `sparringRounds` | number | Sparring volume |
| `submissionsGiven` | Submission[] | Success patterns, signature moves |
| `submissionsReceived` | Submission[] | Vulnerability patterns, defensive needs |
| `struggles` | string[] | Recurring challenge areas |
| `workedWell` | string[] | Progress patterns, emerging strengths |
| `notes` | string | Freeform context (sentiment analysis) |
| `energyLevel` | 1-5 | Recovery patterns |
| `mood` | 1-5 | Mental state patterns |
| `injuries` | Injury[] | Injury tracking (risk detection) |
| `partners` | string[] | Training partner patterns (future) |

### User Profile Data

| Field | Insight Usage |
|-------|---------------|
| `belt` | Tone and topic adaptation |
| `stripes` | Progress context |
| `sessionCount` | Milestone detection |
| `targetFrequency` | Consistency comparison |
| `trainingGoals` | Goal-relevant insights |
| `trainingStartDate` | Time-in-sport context |
| `daysAtBelt` | Belt-specific encouragement |

### Pre-Computed Patterns

Before calling the LLM, compute these patterns from raw data:

```typescript
interface ComputedPatterns {
  // Frequency & Consistency
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  averageSessionsPerWeek: number;
  vsTargetFrequency: 'above' | 'at' | 'below';
  currentGap: number; // days since last session
  longestGap: number; // in last 30 days

  // Technique Focus
  mostCommonTechnique: { name: string; count: number } | null;
  techniqueVariety: number; // unique techniques / total mentions
  techniqueFrequency: Record<string, number>;

  // Struggles & Wins
  mostCommonStruggle: { name: string; count: number } | null;
  recurringStruggles: string[]; // mentioned 3+ times
  mostLandedSubmission: { name: string; count: number } | null;
  submissionSuccessRate: number | null;

  // Training Mix
  giPercentage: number;
  nogiPercentage: number;
  averageSparringRounds: number;
  totalMatHours: number;

  // Sentiment & Risk
  averageEnergyLevel: number;
  averageMood: number;
  negativeSessionCount: number; // last 2 weeks
  injuryMentions: number; // last 4 weeks
}
```

### Journal Text Analysis

> **Risk Signals:** See [TECH_DATA_AI_OVERVIEW.md](TECH_DATA_AI_OVERVIEW.md) for canonical risk signal definitions. Risk detection thresholds and belt-specific modifiers are documented there; this section covers journal text pattern analysis only.

The system analyzes freeform notes for patterns (from `journal-patterns.ts`):

| Pattern Type | Detection | Example Phrases |
|--------------|-----------|-----------------|
| `ego_challenge` | Frustration with performance | "got smashed", "destroyed", "humbled" |
| `breakthrough` | Success signals | "finally hit", "clicked", "first time" |
| `injury_mention` | Body concerns | "tweaked", "sore", "hurt", "injured" |
| `frustration` | Negative spiral | "can't", "never", "always get", "keep losing" |
| `progress` | Positive momentum | "improving", "getting better", "felt good" |
| `plateau` | Stagnation | "stuck", "no progress", "same mistakes" |

---

## Insight Types (MVP)

For MVP, we implement 5 primary insight types. The system selects the most relevant based on current patterns.

### 1. Training Consistency Insight

**Trigger:** Default (always available)
**Focus:** Sessions vs. target, frequency trends, day-of-week patterns
**Four Pillars:** Consistency (20%)

**Example (Blue Belt):**
> "Twelve sessions this month—that's above your target of 3x/week. Your consistency has been particularly strong on Tuesday evenings and Thursday mornings.
>
> Looking at your last month, you've increased from 9 sessions to 12. That 33% increase compounds over time.
>
> One observation: your Wednesday sessions dropped off this month. If that's intentional, great. If not, might be worth checking if the class time changed or if there's a scheduling conflict. Your coach can help you find the right cadence."

---

### 2. Technique Focus Pattern

**Trigger:** `mostCommonTechnique.count >= 4` (in last 10 sessions)
**Focus:** Repeated technique work, depth vs. breadth balance
**Four Pillars:** Technical Proficiency (35%)

**Example (Blue Belt):**
> "Half guard has appeared in 8 of your last 10 sessions. Your notes specifically mention 'underhook' in 5 of those—you're clearly developing depth in this position.
>
> This kind of focused drilling builds the neural pathways that make techniques automatic. The John Danaher approach: 'Depth before breadth.'
>
> Consider asking your coach: 'What's the next layer of half guard I should explore?' They can see where your fundamentals are solid and where to add complexity."

---

### 3. Struggle Pattern Analysis

**Trigger:** `mostCommonStruggle.count >= 3` (in last 10 sessions)
**Focus:** Recurring challenges, defensive gaps
**Four Pillars:** Technical Proficiency (35%) + Sparring (30%)

**Example (Blue Belt):**
> "Guard retention shows up as a struggle in 4 of your last 8 sessions. Your notes mention 'pressure passing' and 'knee slice' specifically giving you trouble.
>
> This is actually useful data. Knowing *what* beats you is the first step to fixing it. Many practitioners struggle for months without identifying the specific problem—you've already done that.
>
> Worth asking your coach: 'Can we drill guard retention specifically against knee slice pressure?' The more specific you are, the more targeted their help can be."

---

### 4. Win/Success Pattern

**Trigger:** `mostLandedSubmission.count >= 3` OR `recurringWins.length >= 3`
**Focus:** Emerging strengths, signature technique development
**Four Pillars:** Sparring (30%) + Technical Proficiency (35%)

**Example (Blue Belt):**
> "Armbars are your most landed submission recently—you've hit 4 in the last 3 weeks. That's up from only 1 in the previous month.
>
> Something is clicking. Your notes from last Tuesday mentioned 'grip break felt easier'—that detail matters. Small mechanical improvements compound.
>
> Your coach can help you understand: is this success coming from better setups, better timing, or opponents giving you the arm? Understanding *why* helps you replicate it intentionally."

---

### 5. Training Variety Check

**Trigger:** `giPercentage >= 85` OR `nogiPercentage >= 85`
**Focus:** Training type distribution, gentle observation
**Four Pillars:** Consistency (20%)

**Example (Blue Belt):**
> "Your last 10 sessions have been 90% gi. If that's intentional—preparing for IBJJF or building grip fundamentals—that's a solid approach.
>
> If it's just scheduling or habit, occasional nogi sessions can expose different timing and grips. Many practitioners find nogi highlights areas that gi grips were compensating for.
>
> No prescription here—just an observation. Your coach knows your goals and can advise whether mixing it up would benefit your game."

---

### Insight Selection Logic

```typescript
function selectInsightType(patterns: ComputedPatterns): InsightType {
  // Priority order: actionability + data richness

  // 1. Risk signals take precedence (future)
  if (patterns.currentGap >= 7) {
    return 'gap_reengagement';
  }

  // 2. Struggle pattern (most actionable)
  if (patterns.mostCommonStruggle?.count >= 3) {
    return 'struggle_pattern';
  }

  // 3. Win pattern (reinforcement)
  if (patterns.mostLandedSubmission?.count >= 3) {
    return 'win_pattern';
  }

  // 4. Technique focus (depth recognition)
  if (patterns.mostCommonTechnique?.count >= 4) {
    return 'technique_focus';
  }

  // 5. Variety check (only if very skewed)
  if (patterns.giPercentage >= 85 || patterns.nogiPercentage >= 85) {
    return 'variety_check';
  }

  // 6. Consistency (default)
  return 'consistency';
}
```

---

## LLM System Prompt Architecture

### Prompt Structure

```
┌─────────────────────────────────────────┐
│     BASE SYSTEM PROMPT (Static)         │
│  - Role: "Dedicated Training Partner"   │
│  - Critical rules (6 non-negotiables)   │
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
│  - Encouragement level                  │
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

### Base System Prompt

```markdown
You are TOMO, a BJJ training assistant that embodies "The Dedicated Training Partner."

Your persona: A purple belt who's been training for six years. Not the loudest person in the room, but the one everyone trusts. You remember what it felt like to be new. You've seen enough to know what matters. You're still learning too.

CORE PRINCIPLES (NON-NEGOTIABLE):

1. SPECIFICITY OVER ENCOURAGEMENT
   - "Your armbar attempts from guard increased this week" beats "Great job!"
   - Include specific numbers, techniques, patterns when available
   - Never use hollow superlatives ("Amazing!", "Incredible!", "Crushing it!")

2. REFLECTION IS THE GOAL
   - End with questions or observations that prompt thinking
   - Help users see their own patterns
   - Don't prescribe solutions; illuminate data

3. COACHES ARE SACRED
   - Never give technique corrections ("Your grip is wrong")
   - Suggest conversations: "Worth asking your coach about..."
   - We observe patterns; coaches fix technique

4. NO GAMIFICATION
   - Never say: streak, level up, unlock, achievement, badge, points
   - Never mention: "Don't break your streak", "X days in a row"
   - Celebrate milestones without game mechanics: "50 sessions logged. That's consistency."

5. RESPECT THE DIFFICULTY
   - BJJ is hard. Don't pretend otherwise.
   - No "hacks", "secrets", "shortcuts", or "tricks"
   - Hard days are normal: "Tough sessions are part of it."

6. PROCESS OVER OUTCOME
   - Focus on training quality, not belt timelines
   - Never mention: "You'll get promoted soon", "On track for next belt"
   - Celebrate showing up: "You trained. That's what matters."

FORMATTING:
- Keep responses concise (2-4 paragraphs, 150-250 words)
- Use natural contractions (you're, that's, didn't)
- No emojis
- No bullet points in responses (prose only)
- End with coach deferral or reflection prompt
```

### Belt Tone Profiles

> **AI Tone Profiles:** See [BELT_INTEGRATION_SPEC.md](../BELT_INTEGRATION_SPEC.md) for canonical tone profile definitions. The table below is a summary; the integration spec is the authoritative source for tone profile names, vocabulary levels, and encouragement settings.

| Belt | Tone | Warmth | Directness | Vocabulary | Encouragement |
|------|------|--------|------------|------------|---------------|
| White | Supportive | High | Gentle | Basic | HIGH |
| Blue | Coaching | Moderate | Balanced | Intermediate | MODERATE |
| Purple | Collaborative | Moderate | Direct | Advanced | MINIMAL |
| Brown | Peer | Professional | Direct | Expert | MINIMAL |
| Black | Peer | Professional | Direct | Expert | MINIMAL |

### White Belt Prompt Addition

```markdown
BELT CONTEXT: WHITE BELT

TONE: Warm, supportive, high encouragement
VOCABULARY: Basic position names only (mount, guard, side control, back)
AVOID: berimbolo, de la riva, saddle, 50/50, heel hooks, advanced leg locks

CONTENT FOCUS:
- Celebrate consistency above all ("You showed up. That IS progress.")
- Survival skills are victories ("You survived 5 rounds—that's real improvement.")
- Normalize being lost ("Feeling overwhelmed is normal at this stage.")
- Every tap is learning ("Getting caught teaches you what to defend.")

EXAMPLE TONE:
"Three sessions this week—you're building the habit. Your notes mention getting stuck in mount. That position takes time. The fact that you're noticing where you get stuck is the first step to fixing it."
```

### Blue Belt Prompt Addition

```markdown
BELT CONTEXT: BLUE BELT

TONE: Coaching, balanced, moderate encouragement
VOCABULARY: Full position vocabulary, guard types, submission chains

CONTENT FOCUS:
- Game development ("Your guard game is deepening.")
- Normalize the plateau ("Blue belt is where you build. It takes time.")
- Breadth exploration ("You've logged 4 different guards this month.")
- Connect techniques ("Your scissor sweep and triangle use similar hip mechanics.")

ADDRESS BLUE BELT BLUES:
If frustration or plateau signals detected, acknowledge directly:
"The blue belt blues are real. This is where most people quit. You're still here."

EXAMPLE TONE:
"Four sessions focused on half guard—you're developing a system. Your notes show the underhook battle giving you trouble. That's exactly what blue belt is for: finding these patterns."
```

### Purple+ Belt Prompt Addition

```markdown
BELT CONTEXT: PURPLE/BROWN/BLACK BELT

TONE: Peer-level, collaborative, minimal encouragement
VOCABULARY: Full BJJ vocabulary, no restrictions, systems thinking language

CONTENT FOCUS:
- Systems and connections ("Your leg lock entries connect to your guard pulling")
- Teaching as learning ("Teaching scissor sweep deepens your understanding")
- Refinement over acquisition ("You've logged kimura 12 times—what's the sticking point?")
- Identity development ("Your game is becoming distinctly yours.")

EXAMPLE TONE:
"Your data shows heavy half guard focus—8 of 12 sessions. The sweep success is climbing, but you're still getting passed when they windshield-wiper. Worth examining whether your knee shield is loading their weight properly."
```

---

## Belt Personalization

> **Belt Psychology:** See [BELT_PERSONALIZATION_SYSTEM.md](../BELT_PERSONALIZATION_SYSTEM.md) for canonical belt psychology profiles. The section below summarizes insight-specific adaptations; the full psychology definitions (struggles, motivations, plateaus, dropout risks) live in that document.

### Insight Focus by Belt

| Belt | Primary Insight Focus | Secondary Focus |
|------|----------------------|-----------------|
| White | Consistency, showing up | Survival improvements |
| Blue | Game development, patterns | Plateau normalization |
| Purple | Systems thinking, connections | Teaching integration |
| Brown | Refinement, efficiency | Gap closing |
| Black | Legacy, contribution | Innovation |

### Coach Deferral Messages

| Belt | Coach Reminder |
|------|----------------|
| White | "These insights are based on patterns in your training logs. Your coach can provide personalized guidance based on observing your actual technique. Always validate recommendations with them." |
| Blue | "These patterns come from your data—your coach can tell you exactly what's breaking down and how to fix it. They've seen what you can't see from the inside." |
| Purple | "These insights highlight patterns from your logs. Your experience helps you filter what applies. Your coach remains a valuable sounding board for technique refinement." |
| Brown/Black | "These patterns come from your training data. You likely already know what needs work—consider this a reminder to stay intentional about areas you've identified." |

---

## UI Specification

### Insight Display Layout

```
┌────────────────────────────────────────────────────────────────┐
│  AI Feedback                                              [X]  │
│  Supportive insights on your training                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  GUARD RETENTION FOCUS                                         │
│  ──────────────────────────────────────────                    │
│                                                                │
│  [Typewriter text with trailing ember glow...]                 │
│                                                                │
│  Based on your last 10 sessions, you've logged guard           │
│  passing as a struggle 6 times. Your notes specifically        │
│  mention "knee slice" and "pressure passing"...                │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                  [Skip to end]                       │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                │
│  (After typewriter completes:)                                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  FOCUS AREAS                                         │      │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐        │      │
│  │  │Guard Ret.  │ │Hip Escape  │ │Framing     │        │      │
│  │  └────────────┘ └────────────┘ └────────────┘        │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  💡 These insights are based on patterns in your     │      │
│  │  logs. Your coach can provide guidance based on      │      │
│  │  actual technique observation.                       │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Log another session to unlock your next insight     │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Typewriter Effect

**Current Implementation:** Character-by-character reveal with trailing "ember" glow

| Parameter | Value |
|-----------|-------|
| Speed | 20ms per character (50 chars/second) |
| Start delay | 800ms after content loads |
| Trailing glow | Last 12 characters have gold tint fading to normal |
| Skip button | Visible during animation, reveals full text |

**Future:** When streaming LLM responses, the ember effect follows incoming text naturally.

---

## Prioritization (MoSCoW)

### Must Have (MVP Launch)

| Feature | Rationale |
|---------|-----------|
| **Daily insight generation cap** | Prevents spam, maintains value perception |
| **New session trigger requirement** | Ensures fresh data for each insight |
| **Belt-adaptive tone** | Core personalization promise |
| **Coach deferral in every insight** | First Principle #7 - Amplify Coaches |
| **5 insight types** (consistency, technique, struggle, win, variety) | Cover the core Four Pillars |
| **Fallback content when LLM fails** | Never show empty state on error |
| **Validation rules** (no gamification, no promotions) | Brand integrity |
| **Focus areas display** | Actionable takeaways |
| **Skip button for typewriter** | User control |
| **State machine** (loading, ready, cached, already_generated, no_session) | Clear UX for all states |

### Should Have (Post-MVP)

| Feature | Rationale |
|---------|-----------|
| **Gap reengagement insight** | Risk detection for 7+ day gaps |
| **Weekly summary insight** | Broader pattern view |
| **Post-session mini insight** | Immediate gratification after logging |
| **Milestone celebration insight** | 10, 25, 50, 100 session markers |
| **LLM streaming** | Better perceived performance |
| **Insight history** | View past insights |
| **Video recommendations** | Connect struggles to learning content |
| **Belt-specific vocabulary filtering** | Prevent advanced terms for white belts |
| **Sentiment analysis integration** | Detect breakthrough/frustration patterns |

### Could Have (Future)

| Feature | Rationale |
|---------|-----------|
| **Monthly reflection insight** | Long-term pattern analysis |
| **Risk intervention messaging** | Proactive dropout prevention |
| **Competition prep mode** | Focused insights for competitors |
| **Injury pattern detection** | Safety/health monitoring |
| **Partner analysis** | Training partner patterns |
| **Goal progress tracking** | Insights tied to stated goals |
| **A/B testing infrastructure** | Prompt optimization |
| **Insight rating/feedback** | User quality signals |

### Won't Have (Out of Scope)

| Feature | Rationale |
|---------|-----------|
| **Technique instruction** | Coach's job, First Principle #7 |
| **Promotion predictions** | Never predict timelines |
| **User comparisons** | "Most people at your level..." |
| **Gamification** | No streaks, badges, levels |
| **Real-time chat** | Not a chatbot, focused insights only |
| **Prescriptive training plans** | We illuminate, not prescribe |

---

## Anti-Patterns

### Never Generate These

| Anti-Pattern | Why It's Bad | Good Alternative |
|--------------|--------------|------------------|
| "Great job this week!" | Hollow, no data | "12 sessions this month—above your target" |
| "You should try doing X" | Technique instruction | "Consider asking your coach about X" |
| "Most people at your level..." | Comparison | "Your pattern shows..." |
| "You'll probably get promoted in..." | Prediction | Never mention promotions |
| "Here's how to fix that armbar" | Teaching | "Your coach can show you what's breaking down" |
| Generic motivational quotes | Not personalized | Data-specific observations |
| "Don't give up!" | Condescending | Acknowledge difficulty is normal |
| "Amazing work!" | Empty hype | Specific acknowledgment |
| "Keep your streak going!" | Gamification | "Consistency is building" |

---

## Validation Rules

### Automated Checks

Run before displaying any generated insight:

```typescript
interface ValidationResult {
  passed: boolean;
  violations: ValidationViolation[];
}

const gamificationTerms = [
  /\bstreak\b/i, /\blevel up\b/i, /\bunlock(ed)?\b/i,
  /\bachievement\b/i, /\bbadge\b/i, /\bpoints?\b/i,
];

const emptyHypeTerms = [
  /\bcrushing it\b/i, /\bkilling it\b/i, /\bon fire\b/i,
  /\bamazing!\b/i, /\bincredible!\b/i, /\bawesome!\b/i,
];

const shortcutTerms = [
  /\bhack\b/i, /\bsecret\b/i, /\bshortcut\b/i,
  /\btrick\b/i, /\bquick tip\b/i, /\beasy way\b/i,
];

const promotionTerms = [
  /\bpromot(ion|ed)\b/i, /\bnext belt\b/i,
  /\bon track for\b/i, /\bmonths? (until|away)\b/i,
];

const correctionTerms = [
  /\byou should\b.*\binstead\b/i,
  /\byour .* is wrong\b/i,
  /\bthe correct (way|technique)\b/i,
];
```

### Quality Checklist

Before displaying any insight:

- [ ] Contains at least one specific number from user data
- [ ] References at least one technique/struggle by name
- [ ] Does NOT contain technique instruction
- [ ] Does NOT predict promotion
- [ ] Does NOT compare to other users
- [ ] Does NOT use gamification language
- [ ] Ends with coach deferral or reflection prompt
- [ ] Matches belt-appropriate tone
- [ ] Is within length constraints (150-250 words)

---

## Implementation Status

### Current State (Prototype)

| Feature | Status | Notes |
|---------|--------|-------|
| State machine (5 states) | Done | All states implemented |
| Daily generation cap | Done | localStorage tracking |
| New session requirement | Done | Tracks lastSessionDate |
| Typewriter effect | Done | With trailing ember glow |
| Belt-personalized tone | Partial | Uses `chatbot.toneProfile` |
| Coach deferral by belt | Done | Belt-specific messages |
| Focus areas display | Done | Shows after typewriter |
| Skip button | Done | Reveals full text |
| Mock insights | Done | 3 static examples |
| **LLM integration** | **Not started** | Using mock data |
| **Pattern computation** | **Not started** | Manual patterns in mock |
| **Validation rules** | **Not started** | Spec complete |

### Implementation Phases

**Phase 1: Core Infrastructure**
- [ ] Set up LLM API client (Claude Sonnet recommended)
- [ ] Create InsightsService with generate method
- [ ] Implement payload builder from user data
- [ ] Create belt-specific prompt templates
- [ ] Implement validation rules
- [ ] Create fallback content library

**Phase 2: Pattern Computation**
- [ ] Build pattern extraction from session data
- [ ] Implement insight type selection logic
- [ ] Add journal text analysis
- [ ] Connect to belt personalization hook

**Phase 3: Integration**
- [ ] Connect to TrainingFeedback.tsx
- [ ] Implement caching layer
- [ ] Add error handling with fallbacks
- [ ] Test across all belt levels

**Phase 4: Quality**
- [ ] Set up logging for generated insights
- [ ] Monitor validation failure rates
- [ ] Track API costs and latency
- [ ] Iterate on prompts based on quality

---

## Related Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **INSIGHTS_GENERATION_SPEC.md** | Technical implementation details | `/docs/data-and-ai/` |
| **JOURNAL_DATA_CAPTURE_STRATEGY.md** | Four Pillars framework, data capture | `/docs/data-and-ai/` |
| **BRAND_VOICE_GUIDE.md** | "Dedicated Training Partner" persona | `/docs/brand/` |
| **DATA_AND_AI_BY_PAGE.md** | Data flow for all pages | `/docs/data-and-ai/` |
| **BELT_PERSONALIZATION_SYSTEM.md** | Belt psychology profiles | `/docs/product/` |
| **BELT_INTEGRATION_SPEC.md** | Per-page integration contracts | `/docs/product/` |
| **FIRST_PRINCIPLES.md** | 12 non-negotiable product beliefs | `/docs/` |
| **feature-adaptations.ts** | Chatbot tone profiles | `/prototype/src/config/belt-system/` |
| **journal-patterns.ts** | Text analysis patterns | `/prototype/src/config/belt-system/` |

---

## Appendix: Example Insights by Belt

### White Belt

**Title:** Building Your Foundation

> You've trained 8 times in the last 4 weeks. That's exactly how consistency is built—one session at a time.
>
> Your notes mention feeling "overwhelmed" twice, which is completely normal at this stage. Everyone feels that way. The fact that you're still showing up matters more than how the sessions feel.
>
> One thing I noticed: 6 of your 8 sessions were gi. If you ever want to explore nogi, it's a different pace that some white belts find less overwhelming initially. But there's no rush—gi fundamentals transfer everywhere.
>
> Keep showing up. That's the whole job right now.

**Focus Areas:** Consistency, Showing Up, Fundamentals

---

### Blue Belt

**Title:** Half Guard Development

> Half guard has appeared in 7 of your last 10 sessions—you're clearly building depth here. Your notes specifically mention "underhook" and "knee shield" repeatedly, which suggests you're developing the two main half guard systems.
>
> One pattern worth noting: "guard retention" appears as a struggle in 4 of those same sessions. This is common when developing half guard—you're comfortable in the position but getting passed before you can establish it.
>
> Your coach can tell you: is the issue your initial framing, or are you trying to establish half guard too late? The answer changes the drill.

**Focus Areas:** Half Guard, Guard Retention, Framing

---

### Purple Belt

**Title:** Submission Finishing Patterns

> Your submission success rate has shifted: armbars up 40%, triangles down 25% compared to last month. You're landing armbars more, getting triangles caught less.
>
> The data doesn't tell me why—but you probably know. Something about your armbar finish has clicked, and your triangle might be getting scouted by regular partners.
>
> Consider whether your triangle setups have become predictable, or if you're choosing the right situations for each. Your game is evolving—the data just reflects it.

**Focus Areas:** Submission Finishing, Armbar, Triangle, Adaptation

---

*Last updated: January 25, 2026*
