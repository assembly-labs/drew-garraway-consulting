# TOMO Feature Backlog

**Last Updated:** January 19, 2026
**Purpose:** Prioritized feature backlog based on comprehensive product and research review
**Belt Integration:** See Category 9 for explicit belt personalization integration tasks

---

## Table of Contents

1. [Priority Tiers](#priority-tiers)
2. [Category 1: Core Session Loop](#category-1-core-session-loop)
3. [Category 2: Onboarding & First-Time Experience](#category-2-onboarding--first-time-experience)
4. [Category 3: Progress Visibility](#category-3-progress-visibility)
5. [Category 4: Retention & Re-engagement](#category-4-retention--re-engagement)
6. [Category 5: Personalization Engine](#category-5-personalization-engine)
7. [Category 6: Connection & Community](#category-6-connection--community)
8. [Category 7: Coach Integration](#category-7-coach-integration)
9. [Category 8: Advanced Analytics](#category-8-advanced-analytics)
10. [Category 9: Belt Personalization Integration](#category-9-belt-personalization-integration) *(NEW)*
11. [Category 10: Platform & Infrastructure](#category-10-platform--infrastructure)
12. [Gap Analysis](#gap-analysis)
13. [Risk Assessment](#risk-assessment)
14. [Backlog Summary](#backlog-summary)

---

## Priority Tiers

| Tier | Definition | Criteria |
|------|------------|----------|
| **P0** | Critical | Must have for TestFlight. Blocks core user journey. |
| **P1** | High | Important for retention. Should ship within first 3 months post-launch. |
| **P2** | Medium | Valuable but not urgent. Planned for V1.5+. |
| **P3** | Nice-to-have | Future consideration. Requires additional research. |

---

## Category 1: Core Session Loop

> **Why This Category Matters:** The core loop (Log → Review → Reflect) is TOMO's foundation. Without a complete, frictionless session loop, nothing else matters.

---

### 1.1 Voice-First Session Logging

| Attribute | Value |
|-----------|-------|
| **Status** | Complete (in prototype) |
| **Priority** | P0 - Critical |
| **Complexity** | L (already built) |

**Description:** Users capture training sessions via voice in under 90 seconds. AI extracts structured data (techniques, sparring outcomes, notes) from natural speech.

**Personas Served:**
- `newcomer` - Can log even when exhausted and confused
- `survivor` - Builds habit through low-friction capture
- `plateau-warrior` - Captures nuanced observations without typing

**First Principles Alignment:**
- #2 (Capture Important Data, Easily) - Voice-first respects 90-second window
- #10 (Two User States) - Designed for exhausted state

**Research Justification:**
- Users have 20-40% reduced decision-making capacity post-training
- 90-second friction budget is non-negotiable (User Personas research)
- Voice logging differentiates from all competitors (Market Research)

**Dependencies:** AssemblyAI integration, BJJ custom vocabulary

---

### 1.2 Session Detail View

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | M |

**Description:** Full-screen view of a logged session showing all captured data: techniques, sparring, notes, AI-generated insights, and coaching prompts.

**Personas Served:**
- `plateau-warrior` - Reviews patterns across sessions
- `survivor` - Sees what they logged, builds connection to data
- All personas - Validates what was captured

**First Principles Alignment:**
- #1 (Reflection Is the Foundation) - Enables post-session reflection
- #11 (Flashlight, Not the Path) - Shows data without prescribing action

**Research Justification:**
- Periodic review (monthly/quarterly) produces deeper insight than daily capture (Sports Psychology Research)
- Self-reflection predicts elite development at OR=4.9 (Sports Psychology Research)

**Dependencies:** Session logging must be complete

---

### 1.3 Session Edit Mode

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | M |

**Description:** Inline editing of any session field with staged save. Users can correct AI transcription errors, add forgotten techniques, update sparring notes.

**Personas Served:**
- All personas - Corrects transcription errors
- `newcomer` - May not know technique names during voice capture
- `plateau-warrior` - Adds analytical notes after reflection

**First Principles Alignment:**
- #2 (Capture Important Data, Easily) - Correction is part of capture
- #4 (Be Helpful) - Don't make users re-record to fix small errors

**Research Justification:**
- Even best transcription has 15%+ error rate on proper nouns
- "Capture something, not everything" means editing completes capture (Voice Logging Spec)

**Dependencies:** Session Detail View

---

### 1.4 Session Delete with Undo

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | S |

**Description:** Delete confirmation modal with undo option. Prevents accidental data loss while allowing cleanup.

**Personas Served:**
- All personas - Error recovery
- `newcomer` - May log test sessions during learning

**First Principles Alignment:**
- #4 (Be Helpful) - Recoverable errors are helpful

**Research Justification:**
- Fat-fingered exhausted users need error recovery (UI Strategy)

**Dependencies:** Session Detail View

---

### 1.5 Session History with Filters

| Attribute | Value |
|-----------|-------|
| **Status** | Partial (list exists, filters missing) |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Filterable list of past sessions. Filter by: date range, training type (gi/no-gi), techniques mentioned, sparring outcomes.

**Personas Served:**
- `plateau-warrior` - Finds patterns in training
- `specialist` - Reviews specific technique development
- `survivor` - Revisits journey milestones

**First Principles Alignment:**
- #11 (Flashlight, Not the Path) - Makes past visible
- #9 (Specificity Over Encouragement) - Data-rich exploration

**Research Justification:**
- Relaxed browsing state allows rich data exploration (UI Strategy)
- Periodic review produces insight (Sports Psychology Research)

**Dependencies:** Session logging complete

---

### 1.6 Quick Log (Emergency Mode)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | S |

**Description:** 3-tap minimum capture: Training type → Duration → Save. For when users can't do voice (noisy gym, no time, mic issues).

**Personas Served:**
- `newcomer` - Fallback when overwhelmed
- All personas - When voice isn't possible

**First Principles Alignment:**
- #2 (Capture Important Data, Easily) - Capture something > capture nothing

**Research Justification:**
- Some data better than no data for habit formation (Journaling Research)
- 66-day habit formation requires consistent logging (Sports Psychology)

**Dependencies:** Core logging flow

**Note:** Must not become default path. Voice remains primary.

---

## Category 2: Onboarding & First-Time Experience

> **Why This Category Matters:** 70-90% of white belts quit within 6 months. First impressions and early habit formation are critical to retention.

---

### 2.1 Microphone Permission Flow

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | S |

**Description:** Explains why TOMO needs microphone access before requesting permission. Handles denial gracefully with text fallback.

**Personas Served:**
- All personas - Required for core feature
- `newcomer` - Needs reassurance about privacy

**First Principles Alignment:**
- #2 (Capture Important Data, Easily) - Permission is prerequisite
- #6 (Respect the Difficulty) - Honest about why we need it

**Research Justification:**
- iOS permission denial rate is 25-40% without explanation
- Trust-building critical for newcomers (Persona Research)

**Dependencies:** None

---

### 2.2 Belt Selection (Onboarding)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | S |

**Description:** User selects current belt and stripes during onboarding. Drives all personalization downstream.

**Personas Served:**
- All personas - Required for personalization

**First Principles Alignment:**
- #5 (Belt Psychology Shapes Everything) - Must know belt to personalize

**Research Justification:**
- Belt-specific psychology documented across all research
- White vs blue vs purple need fundamentally different support (Belt Personalization System)

**Dependencies:** None

---

### 2.3 "What to Say" Guidance

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | S |

**Description:** Example prompts and sample voice inputs shown before first recording. Shows what good input looks like.

**Personas Served:**
- `newcomer` - Doesn't know what to say or BJJ terminology
- `survivor` - Understands depth expected

**First Principles Alignment:**
- #4 (Be Helpful) - Reduce anxiety about "doing it right"
- #6 (Respect the Difficulty) - Acknowledge they may not know what to say

**Research Justification:**
- New users experience 60% pre-class anxiety (Persona Research)
- Technique overload means terminology is overwhelming (Newcomer Persona)

**Dependencies:** None

---

### 2.4 Welcome Tour (3-4 Screens)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Brief walkthrough of core features: Voice logging, Stats, Progress tracking. Skip always available.

**Personas Served:**
- `newcomer` - Orientation to app value
- `survivor` - Quick understanding of features

**First Principles Alignment:**
- #4 (Be Helpful) - Show value proposition quickly
- #2 (Capture Important Data, Easily) - Skip available, not forced

**Research Justification:**
- Onboarding must complete in < 2 minutes (TestFlight success metric)
- First impression determines continued use (Journaling Research)

**Dependencies:** Belt Selection

---

### 2.5 Progressive Profiling (Sessions 3-20)

| Attribute | Value |
|-----------|-------|
| **Status** | Designed (not implemented) |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Collect profile data gradually over 20 sessions instead of long onboarding. Session 3: Training start date. Session 5: Stripes. Session 7: Gym name. etc.

**Personas Served:**
- `newcomer` - Not overwhelmed at start
- All personas - Data collected when relevant

**First Principles Alignment:**
- #2 (Capture Important Data, Easily) - Don't front-load friction
- #4 (Be Helpful) - Ask when it makes sense

**Research Justification:**
- Habit formation takes 66 days (Sports Psychology)
- Early friction predicts dropout (Journaling Research)

**Dependencies:** Session logging, nudge system

**Schedule (from Product Docs):**
| Session | Data Point |
|---------|-----------|
| 3 | Training start date |
| 5 | Stripes count |
| 7 | Gym name |
| 10 | Training goals |
| 12 | Target frequency |
| 15 | Current belt date |
| 18 | Birth year |

---

### 2.6 First Session Celebration

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | S |

**Description:** Special acknowledgment after first logged session. Not gamified, just human: "First session logged. You've started something."

**Personas Served:**
- `newcomer` - Validation matters early
- `newcomer-female` - Belonging signal

**First Principles Alignment:**
- #9 (Specificity Over Encouragement) - Acknowledge the specific milestone
- #12 (No Gamification) - No confetti, no "achievement unlocked"

**Research Justification:**
- First success predicts continued use (Journaling Research)
- Habit formation requires early reinforcement (Sports Psychology)

**Dependencies:** Session logging

---

## Category 3: Progress Visibility

> **Why This Category Matters:** "Am I even getting better?" is the question that precedes quitting. Visible progress is the antidote to invisible progress syndrome.

---

### 3.1 Dashboard (Belt-Personalized)

| Attribute | Value |
|-----------|-------|
| **Status** | Complete (in prototype) |
| **Priority** | P0 - Critical |
| **Complexity** | L (already built) |

**Description:** Primary landing screen with belt-appropriate metrics, recent sessions, and insights. Adapts primary metric based on belt level.

**Personas Served:**
- `newcomer` - Sees session count (their primary metric)
- `plateau-warrior` - Sees technique variety (their primary metric)
- All personas - Homepage of their BJJ journey

**First Principles Alignment:**
- #5 (Belt Psychology) - Different belts see different data
- #11 (Flashlight) - Shows progress without prescribing path

**Research Justification:**
- White belts need session count, not submission rate (Belt Personalization)
- Process metrics beat outcome metrics (d=1.36 vs d=0.09)

**Dependencies:** Session logging, belt selection

---

### 3.2 Belt Progress Screen

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | L |

**Description:** Visual representation of progress toward next belt. Self-assessment against IBJJF-style requirements. NOT a checklist for promotion—a mirror for self-awareness.

**Personas Served:**
- `survivor` - "How close am I to blue?"
- `plateau-warrior` - "What gaps should I work on?"
- All personas - Understand their position in the journey

**First Principles Alignment:**
- #11 (Flashlight, Not the Path) - Shows position, doesn't dictate
- #7 (Amplify Coaches) - Supports, doesn't replace promotion decisions
- #3 (Process Over Outcome) - Focus on skills, not timeline

**Research Justification:**
- Progress invisibility is #1 plateau cause (Belt Research)
- Coach evaluation is continuous, not event-based (Belt Research)
- TOMO must never automate promotion decisions (Belt Research)

**Dependencies:** Belt selection, technique logging

**Critical Design Principle:** This is NOT a promotion countdown. It's a self-awareness tool. Copy must be carefully written to avoid outcome fixation.

---

### 3.3 Technique Library (Browse)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Browsable catalog of BJJ techniques organized by position. Filter by position, belt level, category. Shows which techniques user has logged.

**Personas Served:**
- `plateau-warrior` - See technique breadth
- `survivor` - Build mental vocabulary
- `specialist` - Track systems development

**First Principles Alignment:**
- #1 (Reflection) - Reflect on technique coverage
- #11 (Flashlight) - Show what they've worked vs what exists

**Research Justification:**
- Purple belts know what black belts know—difference is experience (Persona Research)
- Technique breadth visibility helps blue belt plateau (Stats Module Strategy)

**Dependencies:** Technique taxonomy

---

### 3.4 Technique Library (Search)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Search techniques by name, aliases, tags. "kimura" finds Kimura, "double wristlock", etc.

**Personas Served:**
- `newcomer` - Finds techniques they heard in class
- `plateau-warrior` - Quick access to specific techniques

**First Principles Alignment:**
- #4 (Be Helpful) - Fast access to what they need

**Research Justification:**
- Relaxed browsing state allows complex interaction (UI Strategy)

**Dependencies:** Technique Library (Browse)

---

### 3.5 Proficiency Self-Rating

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** User self-rates technique proficiency: Learning → Developing → Proficient. Updates over time as they train.

**Personas Served:**
- `plateau-warrior` - Track skill development
- `specialist` - Identify gaps in systems
- `survivor` - See growth over time

**First Principles Alignment:**
- #9 (Specificity) - Specific skill tracking
- #11 (Flashlight) - Self-assessment, not external judgment

**Research Justification:**
- Self-assessment correlates with actual skill (within belts) (Sports Psychology)
- Process goals (technique mastery) outperform outcome goals (Sports Psychology)

**Dependencies:** Technique Library

---

### 3.6 Training Calendar Visualization

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** GitHub-style contribution graph showing training days. Shows consistency patterns without gamified streaks.

**Personas Served:**
- `survivor` - Visual proof of commitment
- `plateau-warrior` - Pattern recognition
- All personas - See consistency over time

**First Principles Alignment:**
- #12 (No Gamification) - Show data, don't create streak anxiety
- #11 (Flashlight) - Observation, not prescription

**Research Justification:**
- Consistency compounds (First Principle)
- Visual progress prevents "am I improving?" syndrome (Persona Research)

**Dependencies:** Session history

**Note:** NO streak counters. Show patterns, not streaks. "You trained 3x/week this month" not "7-day streak!"

---

### 3.7 Month-over-Month Progress

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Compare current month to previous month: sessions, techniques, sparring rounds. Shows growth trajectory.

**Personas Served:**
- `plateau-warrior` - Proof they're not stagnating
- `survivor` - See improvement over time
- `specialist` - Track training intensity

**First Principles Alignment:**
- #9 (Specificity) - Numbers, not vague encouragement
- #3 (Process Over Outcome) - Focus on what they did

**Research Justification:**
- Progress visibility prevents dropout (Persona Research)
- Specific feedback beats vague praise (Brand Voice Guide)

**Dependencies:** Session history with 2+ months data

---

## Category 4: Retention & Re-engagement

> **Why This Category Matters:** 70-90% of white belts quit. Most dropout happens silently. We must detect risk and re-engage before it's too late.

---

### 4.1 Absence Detection

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** System detects when user hasn't logged a session beyond their typical frequency. Triggers appropriate re-engagement.

**Personas Served:**
- `newcomer` - 7-day gap = high risk
- `plateau-warrior` - 14-day gap + negative sentiment = critical
- All personas - Silent dropout prevention

**First Principles Alignment:**
- #4 (Be Helpful) - Proactive, not reactive
- #8 (Connection Matters) - Maintain connection during absence

**Research Justification:**
- 2 staff touchpoints/month = 33% churn reduction (IHRSA)
- Risk signals documented per belt (Belt Personalization System)

**Dependencies:** Session history, notification system

**Risk Thresholds:**
| Persona | High Risk Threshold |
|---------|---------------------|
| `newcomer` | 7 days |
| `survivor` | 10 days |
| `plateau-warrior` | 14 days |
| `specialist` | 21 days |
| `finisher` | 30 days |

---

### 4.2 Belt-Appropriate Re-engagement

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Re-engagement messages adapted to belt level and persona. Warm and welcoming for newcomers, light touch for specialists.

**Personas Served:**
- `newcomer` - "We noticed you've been away. Everything okay?"
- `plateau-warrior` - "Plateaus are hard. This is part of the path."
- `specialist` - "When you're ready, your data is here."

**First Principles Alignment:**
- #5 (Belt Psychology) - Different belts need different tone
- #6 (Respect Difficulty) - Acknowledge BJJ is hard
- #12 (No Gamification) - Never "You broke your streak!"

**Research Justification:**
- Belt-specific messaging documented (TOMO_PERSONAS.md)
- Autonomy support reduces burnout (r = -0.638) (Sports Psychology)

**Dependencies:** Absence Detection, belt selection

---

### 4.3 Return Welcome

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | S |

**Description:** When user logs session after gap, acknowledge return without shame. "Welcome back. Your last session was 3 weeks ago—you worked on half guard."

**Personas Served:**
- All personas - Validates return decision
- `newcomer` - Critical for continued engagement

**First Principles Alignment:**
- #6 (Respect Difficulty) - Life happens
- #12 (No Gamification) - No "streak broken" messaging

**Research Justification:**
- "Welcome back" beats "You broke your streak" (First Principles)
- Shame prevents return, warmth encourages it (Persona Research)

**Dependencies:** Absence Detection

---

### 4.4 Injury Tracking

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Log injuries during session capture. Track recovery timeline. Adjust expectations during recovery period.

**Personas Served:**
- All personas - 91% injury rate in BJJ
- `newcomer` - First injury often triggers quit consideration
- `plateau-warrior` - Injuries compound during plateau

**First Principles Alignment:**
- #4 (Be Helpful) - Practical support for real problem
- #8 (Connection) - Stay connected during recovery

**Research Justification:**
- 91% lifetime injury rate in BJJ (User Research)
- Injury is #1 quit reason (Persona Research)
- Injury + isolation = dropout (Journaling Research)

**Dependencies:** Session logging

---

### 4.5 Recovery Return Support

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** After injury period, support gradual return. "You logged knee injury 4 weeks ago. How's it feeling? Ready to modify your training?"

**Personas Served:**
- All personas - Especially those returning from injury
- `newcomer` - Prevent permanent dropout after first injury

**First Principles Alignment:**
- #4 (Be Helpful) - Practical return support
- #6 (Respect Difficulty) - Injury recovery is part of journey

**Research Justification:**
- Injury often final dropout trigger (Persona Research)
- Mental strategies for return-to-mat needed (Roadmap - Consultation)

**Dependencies:** Injury Tracking

---

### 4.6 Plateau Intervention (Blue Belt Blues)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | L |

**Description:** Targeted support for blue belts showing plateau signals. Surface relevant content, normalize the experience, provide process-focused reframing.

**Personas Served:**
- `plateau-warrior` - Primary target
- `survivor` approaching blue - Preparation

**First Principles Alignment:**
- #5 (Belt Psychology) - Blue belt has specific crisis
- #6 (Respect Difficulty) - Plateau is normal, not failure
- #3 (Process Over Outcome) - Reframe from "when purple" to "what's next"

**Research Justification:**
- Blue belt plateau lasts 18-36 months (Belt Research)
- Blue belt → black belt: 99% never make it (Persona Research)
- This is the critical retention crisis (First Principles)

**Dependencies:** Absence Detection, sentiment analysis

---

## Category 5: Personalization Engine

> **Why This Category Matters:** A white belt's survival mode is fundamentally different from a purple belt's systems thinking. Same feature, same presentation = failure for both.

---

### 5.1 Belt Personalization (Core)

| Attribute | Value |
|-----------|-------|
| **Status** | Complete (engine exists in prototype) |
| **Priority** | P0 - Critical |
| **Complexity** | L (already built) |

**Description:** Core engine that adapts UI, metrics, messaging, and content based on belt level. Already exists at `/prototype/src/config/belt-system/`.

**Personas Served:**
- All personas - Foundational system

**First Principles Alignment:**
- #5 (Belt Psychology) - The entire point

**Research Justification:**
- Belt psychology extensively documented (Belt Personalization System)
- Different belts need different support (All research)

**Dependencies:** Belt selection

---

### 5.2 Primary Metric Adaptation

| Attribute | Value |
|-----------|-------|
| **Status** | Complete (in prototype) |
| **Priority** | P0 - Critical |
| **Complexity** | S (already built) |

**Description:** Dashboard hero metric changes based on belt. White = session count. Blue = technique variety. Purple = sparring patterns.

**Personas Served:**
- All personas - See relevant metric first

**First Principles Alignment:**
- #5 (Belt Psychology) - Show what matters to them
- #9 (Specificity) - Relevant data, not generic data

**Research Justification:**
- White belt: session count (consistency focus)
- Blue belt: technique breadth (variety focus)
- Purple belt: sparring depth (pattern focus)
(Belt Personalization System)

**Dependencies:** Belt Personalization Core

---

### 5.3 Messaging Tone Adaptation

| Attribute | Value |
|-----------|-------|
| **Status** | Partial (defined, not fully implemented) |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** All app copy adapts to belt level. Warm and supportive for white, neutral and factual for blue, peer-level analytical for purple+.

**Personas Served:**
- `newcomer` - Needs encouragement
- `plateau-warrior` - Needs data, not cheerleading
- `specialist` - Needs peer-level treatment

**First Principles Alignment:**
- #5 (Belt Psychology) - Tone matches psychology
- #9 (Specificity) - Copy matches their needs

**Research Justification:**
- Vocabulary and tone per belt documented (Belt Personalization System)
- Empty hype erodes trust at upper belts (Brand Voice Guide)

**Dependencies:** Belt Personalization Core

---

### 5.4 Content Recommendations

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Recommend techniques, insights, and reflections based on belt level and recent training patterns.

**Personas Served:**
- `newcomer` - Survival-focused recommendations
- `plateau-warrior` - Breadth expansion
- `specialist` - Systems deepening

**First Principles Alignment:**
- #4 (Be Helpful) - Relevant suggestions
- #11 (Flashlight) - Illuminate options, don't prescribe

**Research Justification:**
- White belts shouldn't see submission rate (Belt Personalization)
- Purple belts want systems, not isolated techniques (Persona Research)

**Dependencies:** Belt Personalization Core, Technique Library

---

### 5.5 Risk Detection by Belt

| Attribute | Value |
|-----------|-------|
| **Status** | Designed (not implemented) |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Risk signals have different thresholds by belt. White belt 7-day gap = high risk. Brown belt 30-day gap = normal variation.

**Personas Served:**
- All personas - Belt-appropriate risk assessment

**First Principles Alignment:**
- #5 (Belt Psychology) - Risk differs by belt
- #4 (Be Helpful) - Intervene appropriately

**Research Justification:**
- Risk thresholds per belt documented (Belt Personalization System)
- White belt attrition 70-90% (Persona Research)

**Dependencies:** Absence Detection, Belt Personalization Core

---

## Category 6: Connection & Community

> **Why This Category Matters:** Relatedness is a basic psychological need—not a nice-to-have. Quality relationships protect against burnout.

---

### 6.1 Training Partner Logging

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | S |

**Description:** Optional field during session logging: "Who did you train with?" Track frequent partners over time.

**Personas Served:**
- `newcomer-female` - Connection is make-or-break
- `survivor` - Build gym relationships
- All personas - Acknowledge training partners

**First Principles Alignment:**
- #8 (Connection Matters) - Relatedness need
- #2 (Capture Important Data) - Partners are important data

**Research Justification:**
- Coach-athlete relationship β=0.556 for performance (Sports Psychology)
- Relatedness correlates with motivation (Self-Determination Theory)
- Maya (female newcomer): connection determines whether she stays

**Dependencies:** Session logging

---

### 6.2 Training Partner Insights

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Surface patterns: "You've trained with Marcus 23 times—your most frequent partner." "Your best sessions are when you train with upper belts."

**Personas Served:**
- `newcomer-female` - Validates she has community
- `plateau-warrior` - Sees who helps them grow
- All personas - Recognize training relationships

**First Principles Alignment:**
- #8 (Connection) - Strengthen bonds through awareness
- #9 (Specificity) - Specific partner insights

**Research Justification:**
- Quality relationships protect against burnout (r = -0.638)
- "Best sessions with upper belts" insight documented (First Principles)

**Dependencies:** Training Partner Logging, sufficient data

---

### 6.3 Gym Affiliation

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | S |

**Description:** User can specify their gym. Enables future features: gym-specific content, coach connection, community features.

**Personas Served:**
- All personas - Identity connection to gym

**First Principles Alignment:**
- #8 (Connection) - Gym is primary community
- #7 (Amplify Coaches) - Prerequisite for coach features

**Research Justification:**
- Gym community determines retention (Persona Research)
- Coach relationship is sacred (Brand Voice Guide)

**Dependencies:** Progressive Profiling (Session 7)

---

### 6.4 Coach Connection (Future Prep)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have |
| **Complexity** | L |

**Description:** Foundation for coach integration. User can indicate who their coach is. Prerequisite for "Share with Coach" and coach app.

**Personas Served:**
- All personas - Bridge to coach relationship
- `plateau-warrior` - Need coach visibility

**First Principles Alignment:**
- #7 (Amplify Coaches) - Core principle
- #8 (Connection) - Strengthen coach-student bond

**Research Justification:**
- Coach evaluation is continuous (Belt Research)
- Coach feedback section planned for Belt Progress screen (Roadmap)

**Dependencies:** Gym Affiliation

---

## Category 7: Coach Integration

> **Why This Category Matters:** We amplify coaches, never replace them. These features strengthen the coach-student relationship.

---

### 7.1 Share with Coach Button

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Export training summary to share with coach. Shows patterns, consistency, technique focus—helps coach see what they might miss.

**Personas Served:**
- `plateau-warrior` - "My coach doesn't see my progress"
- `survivor` - Proactive communication
- All personas - Bridge to coach

**First Principles Alignment:**
- #7 (Amplify Coaches) - Give coaches visibility
- #11 (Flashlight) - Show data to coach

**Research Justification:**
- "Coach might be watching: mount escapes and top pressure" (Marcus persona)
- Coach-athlete relationship predicts performance (Sports Psychology)

**Dependencies:** Sufficient session history

---

### 7.2 Coach Feedback Display

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have |
| **Complexity** | M |

**Description:** Display feedback from coach (entered via future coach app). Technique tags, observations, promotion readiness notes.

**Personas Served:**
- All personas - See coach perspective
- `survivor` - "What does my coach think?"

**First Principles Alignment:**
- #7 (Amplify Coaches) - Surface coach input
- #9 (Specificity) - Concrete feedback

**Research Justification:**
- Coach feedback is authoritative (Brand Voice Guide)
- Progress invisibility solved by coach visibility (Persona Research)

**Dependencies:** Coach App (Phase 4), permission model

---

### 7.3 Coach App (Full)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have (Post-V1) |
| **Complexity** | XL |

**Description:** Companion app/mode for coaches. Student roster, progress indicators, voice/text feedback, promotion pipeline.

**Personas Served:**
- Coaches (new persona)
- All practitioner personas (indirectly)

**First Principles Alignment:**
- #7 (Amplify Coaches) - Core feature
- #8 (Connection) - Strengthen coach-student bond

**Research Justification:**
- Documented in Roadmap Phase 4A
- Requires significant additional research and design

**Dependencies:** Core practitioner app complete

**Note:** Full Coach App is Phase 4. P3 for backlog tracking.

---

## Category 8: Advanced Analytics

> **Why This Category Matters:** Upper belts need depth. Data-rich exploration serves the relaxed browsing state.

---

### 8.1 Sparring Analytics

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Track sparring outcomes: positions achieved, submissions made/received, patterns over time.

**Personas Served:**
- `plateau-warrior` - Where am I getting stuck?
- `specialist` - Systems performance tracking
- Competitors - Competition prep

**First Principles Alignment:**
- #3 (Process Over Outcome) - Position data, not just win/loss
- #9 (Specificity) - Detailed sparring analysis

**Research Justification:**
- "Getting caught by guillotine in 4 of last 6 sessions" insight (First Principles)
- Pattern detection is valuable (Data Requirements Analysis)

**Dependencies:** Sparring logging in sessions

---

### 8.2 Technique Pattern Detection

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | L |

**Description:** AI detects patterns in technique mentions. "Half guard appeared in 9 of your last 12 sessions. Building something there."

**Personas Served:**
- `plateau-warrior` - Proof of deliberate work
- `specialist` - Systems tracking
- All personas - Pattern awareness

**First Principles Alignment:**
- #1 (Reflection) - Pattern awareness supports reflection
- #9 (Specificity) - Specific pattern, not vague "you're improving"

**Research Justification:**
- "47 sessions focused on guard work" example (First Principles)
- Pattern detection surfaced multiple times in research

**Dependencies:** Technique extraction from voice, sufficient history

---

### 8.3 Position Heat Map

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have |
| **Complexity** | M |

**Description:** Visual representation of time spent in different positions. Shows where user excels vs struggles.

**Personas Served:**
- `plateau-warrior` - Gap identification
- `specialist` - Game analysis

**First Principles Alignment:**
- #11 (Flashlight) - Illuminate without prescribing

**Research Justification:**
- Listed in Feature Tracker (V.4)
- Advanced visualization for browsing state

**Dependencies:** Detailed position logging

---

### 8.4 Submission Breakdown

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have |
| **Complexity** | M |

**Description:** Chart showing submission types made/received over time. Identify signature moves and defensive gaps.

**Personas Served:**
- `plateau-warrior` - What's working, what's not
- `specialist` - A-game analysis
- Competitors - Competition prep

**First Principles Alignment:**
- #9 (Specificity) - Concrete submission data

**Research Justification:**
- Listed in Feature Tracker (V.6)
- Advanced analytics for upper belts

**Dependencies:** Submission logging

**Note:** NOT for white belts. Submission data is meaningless/demoralizing at white belt.

---

### 8.5 Competition Tracking

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have |
| **Complexity** | L |

**Description:** Log competition results, match video references, post-competition reflection. Separate from regular training.

**Personas Served:**
- Competitors at any belt
- `plateau-warrior` - Optional competition focus
- `specialist` - Competition as systems test

**First Principles Alignment:**
- #3 (Process Over Outcome) - Frame as learning, not just win/loss
- #1 (Reflection) - Post-competition reflection

**Research Justification:**
- "When someone logs a competition loss, prompt: 'What did you learn?'" (First Principles)
- Competition tracking is Phase 4E feature (Roadmap)

**Dependencies:** Core session logging

---

## Category 9: Belt Personalization Integration

> **Why This Category Matters:** The belt personalization engine is built but not fully integrated. Each feature needs explicit wiring to deliver the belt-adaptive experience that differentiates TOMO.
>
> **Reference:** See `/docs/product/BELT_INTEGRATION_SPEC.md` for detailed integration contracts.

---

### 9.1 Dashboard Celebration Thresholds

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | S |

**Description:** Implement belt-specific celebration thresholds. White belts celebrate every 10 sessions, blue every 25, purple every 50, brown every 100.

**Hook Property:** `dashboard.celebrationThreshold`

**Implementation:**
```typescript
if (sessionCount % dashboard.celebrationThreshold === 0) {
  triggerCelebration();
}
```

**Dependencies:** Dashboard complete

---

### 9.2 Session History Card Complexity

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Journal cards show different fields based on belt level. White sees simple cards. Blue sees techniques and sparring. Purple+ sees full detail with submissions.

**Current State:** Hook imported but not used.

**Target State:**
- White: Date, type, duration, notes only
- Blue: + Techniques, sparring rounds, outcomes
- Purple+: + Submissions given/received

**Dependencies:** Session History complete

---

### 9.3 Session Logger Field Visibility

| Attribute | Value |
|-----------|-------|
| **Status** | Partial |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Hide advanced fields from white belts. Submission picker, positional time, teaching notes should only appear for appropriate belt levels.

**Hook Property:** `sessionLogger.showAdvancedFields`

**Current State:** Post-session message implemented. Field visibility not gated.

**Dependencies:** Session Logger complete

---

### 9.4 Techniques Difficulty Filtering

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** "For You" recommendations filter videos by belt-appropriate difficulty range. White belt sees 1-3 difficulty. Blue sees 2-5. Purple+ sees 4-10.

**Hook Property:** `videoTutorials.difficultyRange`

**Current State:** Basic recommendations work but don't filter by difficulty.

**Dependencies:** Technique Library complete

---

### 9.5 Techniques Category Gating

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Browse view hides categories inappropriate for belt level. White belts don't see "Leg Locks" or "Advanced Systems" categories.

**Hook Property:** `videoTutorials.recommendedCategories`

**Current State:** All categories shown to all users.

**Dependencies:** Technique Library complete

---

### 9.6 AI Insight Tone Enforcement

| Attribute | Value |
|-----------|-------|
| **Status** | Partial |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** AI-generated insights use belt-appropriate tone. White belt gets warm/supportive. Blue gets coaching/balanced. Purple+ gets peer/analytical.

**Hook Properties:** `chatbot.toneProfile`, `chatbot.encouragementLevel`, `chatbot.technicalVocabulary`

**Current State:** Some tone adaptation. Not enforcing vocabulary or topics to avoid.

**Dependencies:** TrainingFeedback complete, AI prompt engineering

---

### 9.7 Risk-Aware Messaging

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | L |

**Description:** When risk signals are detected (extended gap, declining attendance, negative sentiment), show belt-appropriate intervention messaging.

**Hook Properties:** Risk signals system, `profile.stageName`

**Algorithm:**
1. Check risk signals on app open
2. Calculate risk score with belt multipliers
3. If above threshold, show intervention
4. Message varies by belt: "We noticed you've been away" (white) vs "Blue belt blues are real" (blue)

**Dependencies:** Session history, notification system

---

### 9.8 Belt Progress Plateau Guidance

| Attribute | Value |
|-----------|-------|
| **Status** | Partial |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** When user is in a plateau phase, display contextual support: symptoms, normalization, breakthrough strategies.

**Hook Property:** `currentPlateau`

**Current State:** Plateau detected but not displayed to user.

**Target State:** Show plateau card with:
- "You're in a common [X] belt plateau"
- List of symptoms
- Breakthrough strategies
- Normalizing message

**Dependencies:** Belt Progress complete

---

### 9.9 Progressive Profiling Belt Timing

| Attribute | Value |
|-----------|-------|
| **Status** | Partial |
| **Priority** | P2 - Medium |
| **Complexity** | S |

**Description:** Question timing adapts to belt level. White belts get delayed questions (more time to build habit). Purple+ belts get earlier questions (assumed committed).

**Hook Properties:** `profiling.questionTiming`, `profiling.priorityQuestions`

**Current State:** Progressive profiling works but doesn't adapt timing by belt.

**Dependencies:** Profile Screen complete

---

### 9.10 Session Detail Belt Sections

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Session detail view shows different sections based on belt. White sees Overview + Notes. Blue+ sees Techniques + Sparring. Purple+ sees Analysis.

**Current State:** All sections shown to all users.

**Dependencies:** Session Detail complete

---

### 9.11 AI/Chatbot Full Integration

| Attribute | Value |
|-----------|-------|
| **Status** | Designed (spec exists) |
| **Priority** | P1 - High |
| **Complexity** | L |

**Description:** Full chatbot/AI integration using all chatbot adaptations: tone, vocabulary, topics to avoid/emphasize, assumed knowledge.

**Hook Properties:** All `chatbot.*` properties

**Specification:** See `/docs/data-and-ai/CONVERSATION_DESIGN_FOUNDATION.md`

**Current State:** Spec complete, not implemented.

**Dependencies:** AI backend integration

---

### 9.12 Journal Pattern Analysis Integration

| Attribute | Value |
|-----------|-------|
| **Status** | Designed (spec exists) |
| **Priority** | P2 - Medium |
| **Complexity** | M |

**Description:** Analyze journal text for patterns (ego challenges, breakthroughs, injuries, plateaus) and generate belt-contextualized responses.

**Hook Function:** `analyzeJournal(sessionId, text)`

**Returns:** Detected patterns, sentiment, risk signals, belt-specific response

**Current State:** Function exists, not called from any component.

**Dependencies:** Session logging, AI processing

---

## Category 10: Platform & Infrastructure

> **Why This Category Matters:** Technical foundation enables everything else. Offline support, iOS deployment, and data sync are prerequisites for TestFlight.

---

### 10.1 iOS App (React Native)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | XL |

**Description:** Native iOS app built with React Native + Expo. Required for TestFlight and App Store deployment.

**Personas Served:**
- All personas - iOS is primary platform

**First Principles Alignment:**
- #2 (Capture Important Data) - Native app enables voice capture

**Research Justification:**
- Most users log on phones after class (Feature Tracker)
- iOS TestFlight is next major milestone (Roadmap)

**Dependencies:** Current prototype complete

---

### 10.2 Supabase Backend

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | L |

**Description:** PostgreSQL database via Supabase. Authentication, data persistence, real-time sync.

**Personas Served:**
- All personas - Data persistence

**First Principles Alignment:**
- #4 (Be Helpful) - Data must be reliable

**Research Justification:**
- Technology decision made (Roadmap)
- API service layer already abstracted in prototype

**Dependencies:** None

---

### 10.3 AssemblyAI Integration

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P0 - Critical |
| **Complexity** | M |

**Description:** Voice transcription via AssemblyAI with BJJ custom vocabulary. Real-time transcription for voice logging.

**Personas Served:**
- All personas - Voice logging

**First Principles Alignment:**
- #2 (Capture Important Data) - Voice-first requires transcription

**Research Justification:**
- 24% better accuracy on proper nouns than Whisper (CLAUDE.md)
- 30% lower hallucination rate (critical for exhausted users)
- BJJ custom vocabulary support (Roadmap)

**Dependencies:** Supabase Backend

---

### 10.4 Offline Mode

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | L |

**Description:** Full functionality without connectivity. Session logging works offline, syncs when online.

**Personas Served:**
- All personas - Gym parking lots have poor connectivity

**First Principles Alignment:**
- #2 (Capture Important Data) - Capture must work anywhere

**Research Justification:**
- 90-second window can't wait for network
- "Capture something > capture nothing" (Feature List)

**Dependencies:** Supabase Backend, AsyncStorage

---

### 10.5 Push Notifications

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | M |

**Description:** Push notification infrastructure for re-engagement, coach feedback alerts, milestone celebrations.

**Personas Served:**
- `newcomer` - Re-engagement
- `plateau-warrior` - Plateau intervention
- All personas - Timely communication

**First Principles Alignment:**
- #8 (Connection) - Stay connected
- #4 (Be Helpful) - Proactive, not just reactive

**Research Justification:**
- 2 touchpoints/month = 33% churn reduction (IHRSA)
- Absence detection requires notification capability

**Dependencies:** iOS App

---

### 10.6 Analytics (PostHog)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | S |

**Description:** Product analytics to track user behavior, feature usage, retention metrics.

**Personas Served:**
- Product team - Understand usage

**First Principles Alignment:**
- #4 (Be Helpful) - Data-informed product decisions

**Research Justification:**
- Technology decision made (Roadmap)
- Key metrics defined for TestFlight success

**Dependencies:** iOS App

---

### 10.7 Crash Reporting (Sentry)

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P1 - High |
| **Complexity** | S |

**Description:** Real-time crash monitoring and error tracking.

**Personas Served:**
- All personas - App must be reliable

**First Principles Alignment:**
- #4 (Be Helpful) - Reliable app is helpful app

**Research Justification:**
- Crash rate < 1% is TestFlight success metric (Roadmap)

**Dependencies:** iOS App

---

### 10.8 Android Support

| Attribute | Value |
|-----------|-------|
| **Status** | Not Started |
| **Priority** | P3 - Nice-to-have |
| **Complexity** | M |

**Description:** Android version of the app. React Native enables cross-platform.

**Personas Served:**
- Android users

**First Principles Alignment:**
- #4 (Be Helpful) - Serve all users

**Research Justification:**
- Listed as Phase 4E (Roadmap)
- iOS first, Android follows

**Dependencies:** iOS App stable

---

## Gap Analysis

> Features our research suggests we need but aren't currently planned or prioritized appropriately.

---

### Gap 1: Emotional State Tracking

**Research Signal:** Sports psychology research shows emotional state correlates with performance. Journaling research shows mood tracking predicts adherence.

**Current Status:** Not in backlog.

**Recommendation:** Add optional mood/energy field to session logging. Simple 3-point scale: Low / Normal / High. Use for pattern detection.

**Priority Recommendation:** P2

**First Principles:** #1 (Reflection) - Emotional reflection is reflection. #4 (Be Helpful) - Correlate mood with training quality.

---

### Gap 2: Goal Setting (Process Goals)

**Research Signal:** Process goals produce 10x larger effects than outcome goals (d=1.36 vs d=0.09). Feature list mentions goals but no spec exists.

**Current Status:** Mentioned in Feature List but not in detailed backlog.

**Recommendation:** Add "Focus for this week/month" feature. NOT outcome goals like "get blue belt" but process goals like "work half guard escapes."

**Priority Recommendation:** P1

**First Principles:** #3 (Process Over Outcome) - This IS the principle.

---

### Gap 3: Pre-Session Intention

**Research Signal:** First Principles document says: "After logging a session, prompt with 'What's one thing you want to focus on next time?' This seeds the next training session with intention."

**Current Status:** Post-session reflection exists. Pre-session intention not planned.

**Recommendation:** Add optional pre-session check-in: "Today's focus: [last set intention]". Quick reminder of what they wanted to work on.

**Priority Recommendation:** P2

**First Principles:** #1 (Reflection) - Seeds reflection into training.

---

### Gap 4: Technique Context (Why/When)

**Research Signal:** Brand Voice Guide says "Understanding beats memorization. We show how techniques connect—not just what they are, but why they work and when to use them."

**Current Status:** Technique Library planned but focused on browse/search. No context layer.

**Recommendation:** Add "When to use" and "Common mistakes" to technique entries. Source from established instructionals/resources.

**Priority Recommendation:** P3 (requires content creation)

**First Principles:** #4 (Be Helpful) - Context makes techniques useful.

---

### Gap 4B: White Belt Vocabulary Learning (DEFERRED)

**Research Signal:** White belts experience "technique overload" - hearing dozens of new terms per class. Vocabulary barrier contributes to feeling lost. Voice logging works better when users know technique names.

**Current Status:** Deferred to Phase 4C. See `/docs/project/FUTURE_FEATURES.md`.

**Recommendation:** Spaced repetition flashcards to help white belts learn BJJ terminology and recognize techniques.

**Priority Recommendation:** Phase 4C (deferred, but could be earlier if demand is high)

**First Principles:** #5 (Belt Psychology) - Designed specifically for white belt survival phase.

**Note:** Added January 19, 2026. Full spec in FUTURE_FEATURES.md under "Phase 4C: Practitioner Learning Features".

---

### Gap 5: Body Load / Recovery Tracking

**Research Signal:** 91% injury rate. Recovery time is major concern for older practitioners. David Morrison persona explicitly struggles with recovery.

**Current Status:** Injury tracking planned (4.4) but no body load or recovery tracking.

**Recommendation:** Add simple body load indicator: "How does your body feel today?" 3-point scale. Track over time to detect overtraining patterns.

**Priority Recommendation:** P2

**First Principles:** #4 (Be Helpful) - Practical help for real problem.

---

### Gap 6: Size-Normalized Progress (Female Users)

**Research Signal:** Maya (newcomer-female) persona explicitly calls out: "Progress against partners 50 lbs heavier looks different." Need size-normalized visualization.

**Current Status:** Not addressed anywhere.

**Recommendation:** When logging training partners, optionally note relative size. Adjust sparring metrics accordingly. "Survived 3 minutes against much larger partner."

**Priority Recommendation:** P2

**First Principles:** #9 (Specificity) - Specific to her reality.

---

### Gap 7: Teaching/Mentoring Hours

**Research Signal:** Purple and brown belt personas explicitly mention teaching. Sofia "helped lower belts click." Elena runs fundamentals classes.

**Current Status:** Teaching mentioned in persona stats but no logging mechanism.

**Recommendation:** Add "Did you teach or help newer students today?" to session logging for purple+. Track teaching contribution.

**Priority Recommendation:** P2 (purple+ only)

**First Principles:** #8 (Connection) - Teaching is connection.

---

## Risk Assessment

> Features that might conflict with First Principles or user psychology.

---

### Risk 1: Belt Progress Screen Becomes Promotion Countdown

**Feature:** Belt Progress Screen (3.2)

**Risk:** Users interpret progress visualization as "promotion timeline" rather than "self-awareness tool." Creates outcome fixation. Contradicts First Principle #3 (Process Over Outcome).

**Mitigation:**
- Copy must explicitly state this is NOT a promotion countdown
- Never show "estimated time to promotion" (deleted from persona mock data)
- Focus on skills, not timeline: "You've worked these areas" not "You're 78% to blue"
- Include disclaimer: "Belt promotions are your coach's decision"

**Risk Level:** HIGH - This feature could easily violate First Principles if not carefully designed.

---

### Risk 2: Re-engagement Messaging Becomes Nagging

**Feature:** Belt-Appropriate Re-engagement (4.2)

**Risk:** Push notifications feel like spam. User disables notifications. Trust erodes.

**Mitigation:**
- Strict limits: Max 1 re-engagement message per week
- Easy opt-out at every message
- Warmth, not urgency: "We noticed..." not "ALERT: You haven't..."
- Never mention streaks or lost progress

**Risk Level:** MEDIUM - Requires careful copy and frequency management.

---

### Risk 3: Sparring Analytics Creates Unhealthy Competition

**Feature:** Sparring Analytics (8.1)

**Risk:** Users obsess over win/loss ratios. Leads to avoiding hard rolls. Contradicts "the mat is a laboratory" philosophy.

**Mitigation:**
- Frame as learning data, not scoreboard
- Emphasize positions over outcomes
- Hide from white belts (meaningless/demoralizing)
- Copy: "Patterns in your rolls" not "Your win rate"

**Risk Level:** MEDIUM - Design framing is critical.

---

### Risk 4: AI Recommendations Contradict Coach

**Feature:** Content Recommendations (5.4), Technique Pattern Detection (8.2)

**Risk:** AI suggests something that contradicts what user's coach is teaching. Violates First Principle #7 (Amplify Coaches, Never Replace).

**Mitigation:**
- Frame all suggestions as "worth asking your coach about"
- Never say "you should do X"
- Qualify: "Based on your patterns..." not "You need to..."
- Always include "your coach knows your game better"

**Risk Level:** HIGH - Must be carefully implemented.

---

### Risk 5: Quick Log (6) Becomes Default Path

**Feature:** Quick Log (Emergency Mode) (1.6)

**Risk:** Users default to 3-tap quick log instead of voice. Lose reflection value. Becomes "checking a box" instead of capturing insight.

**Mitigation:**
- Position as fallback, not default
- Voice prompt first, quick log only if skipped/failed
- Don't optimize quick log flow to be "better" than voice
- Occasional nudge: "Want to add more detail with voice?"

**Risk Level:** MEDIUM - Requires deliberate product friction.

---

### Risk 6: Technique Proficiency Self-Rating Is Inaccurate

**Feature:** Proficiency Self-Rating (3.5)

**Risk:** Users over- or under-estimate their skills. Data becomes meaningless. Dunning-Kruger effect at white belt.

**Mitigation:**
- Clear anchors for each level (Learning = can't do without help, Developing = can do with setup, Proficient = can hit in live rolling)
- Treat as directional, not absolute
- Compare to self over time, not to objective standard
- Adjust expectations by belt (white belt "proficient" ≠ purple belt "proficient")

**Risk Level:** LOW - Expected limitation, not a blocker.

---

### Risk 7: Data Collection Feels Like Surveillance

**Feature:** Training Partner Logging (6.1), All session capture

**Risk:** Users feel surveilled. Resist logging honestly. Especially relevant for at-risk users who might hide struggles.

**Mitigation:**
- All data private by default
- Explicit control over any sharing
- Never auto-share anything
- Value proposition clear: "This is YOUR training journal"

**Risk Level:** LOW - Privacy-first design addresses this.

---

## Backlog Summary

### By Priority

| Priority | Count | Key Features |
|----------|-------|--------------|
| P0 - Critical | 13 | Voice logging, session detail/edit, onboarding, dashboard, belt progress, iOS app, Supabase, AssemblyAI |
| P1 - High | 25 | Session filters, welcome tour, progressive profiling, absence detection, re-engagement, injury tracking, training partner logging, offline mode, notifications, **+ 10 belt integration tasks** |
| P2 - Medium | 17 | Quick log, first celebration, technique search, proficiency rating, calendar, MoM progress, return welcome, recovery support, share with coach, analytics, **+ 4 belt integration tasks** |
| P3 - Nice-to-have | 8 | Coach connection, coach app, position heat map, submission breakdown, competition tracking, Android |

### By Category

| Category | P0 | P1 | P2 | P3 | Total |
|----------|-----|-----|-----|-----|-------|
| Core Session Loop | 3 | 2 | 1 | 0 | 6 |
| Onboarding | 3 | 2 | 1 | 0 | 6 |
| Progress Visibility | 2 | 2 | 3 | 0 | 7 |
| Retention & Re-engagement | 0 | 4 | 2 | 0 | 6 |
| Personalization Engine | 2 | 2 | 1 | 0 | 5 |
| Connection & Community | 0 | 1 | 2 | 1 | 4 |
| Coach Integration | 0 | 0 | 1 | 2 | 3 |
| Advanced Analytics | 0 | 0 | 2 | 3 | 5 |
| **Belt Personalization Integration** | **0** | **8** | **4** | **0** | **12** |
| Platform & Infrastructure | 3 | 4 | 0 | 1 | 8 |

### Critical Path to TestFlight

These P0 items block TestFlight:

1. **Session Detail View** (1.2) - Can't just log, must view
2. **Session Edit Mode** (1.3) - Must correct transcription errors
3. **Mic Permission Flow** (2.1) - Voice-first requires mic
4. **Belt Selection** (2.2) - Personalization requires belt
5. **"What to Say" Guidance** (2.3) - Users need to know what to say
6. **Belt Progress Screen** (3.2) - Core value proposition
7. **iOS App** (9.1) - Platform requirement
8. **Supabase Backend** (9.2) - Data persistence
9. **AssemblyAI Integration** (9.3) - Voice transcription

---

## Next Steps

1. **Complete P0 Features** - Session detail, edit, onboarding
2. **Begin iOS Development** - React Native + Expo setup
3. **Configure Backend** - Supabase + AssemblyAI
4. **Address Gaps** - Add goal setting (Gap 2) to P1
5. **Validate with Users** - Test with 5-10 BJJ practitioners before TestFlight

---

*This backlog should be reviewed weekly and updated as features are completed, priorities shift, or new research emerges.*

*Cross-reference with: `/docs/project/ROADMAP.md`, `/docs/project/FEATURE_TRACKER.md`, `/docs/FIRST_PRINCIPLES.md`*
