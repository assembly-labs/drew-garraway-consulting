# Journal Data Capture Strategy

> **Purpose:** Define how to maximize data collection from exhausted post-training users while respecting their cognitive state. This strategy informs voice logger design, AI extraction, and progressive data enrichment.

**Last Updated:** December 2024

---

## Executive Summary

**The Core Paradox:** We need rich, structured data across four pillars (Technical, Sparring, Consistency, Character) to personalize content and detect risk signals. But users have only **90 seconds of willingness** and **40% cognitive impairment** at the critical post-training capture moment.

**The Solution:** A three-tier data capture pyramid that collects minimal input immediately, extracts maximum structure via AI, and enriches data during high-cognition moments (pre-session, next day).

---

## The Data Capture Pyramid

```
                    ┌─────────────────────┐
                    │   TIER 3: ENRICH    │  ← Later (next day, pre-session)
                    │   Optional depth    │     Review mode, full cognition
                    └─────────────────────┘
               ┌───────────────────────────────┐
               │       TIER 2: EXTRACT         │  ← Post-session (5-30 min)
               │  AI parses what they said     │     Cooling down, recovering
               └───────────────────────────────┘
          ┌─────────────────────────────────────────┐
          │           TIER 1: CAPTURE               │  ← Immediately (0-5 min)
          │  Get SOMETHING, anything, in 60 sec     │     Exhausted, wants to leave
          └─────────────────────────────────────────┘
```

---

## Tier 1: Capture (The 60-Second Window)

### Philosophy

**Don't ask questions. Let them talk.**

Voice-first captures 3-4x more information than forms because it matches the exhausted user's output mode. They WANT to vent about their session—harness that.

### What We Capture Automatically

| Data Point | Method | Priority |
|------------|--------|----------|
| Date/time | System timestamp | Critical |
| Day of week | Derived | Critical |
| Session duration | Inferred from voice or gap-fill | High |
| Training type (gi/nogi) | Inferred or gap-fill | Critical |

### What Voice Naturally Provides

| Data Point | Example Utterance | Extraction Method |
|------------|-------------------|-------------------|
| Techniques practiced | "Worked on knee slice today" | NER for technique names |
| Sparring outcomes | "Got tapped twice by triangles" | Outcome parsing |
| Partners | "Rolled with Jake and Sarah" | Name extraction |
| Struggles | "Couldn't escape side control" | Sentiment + position matching |
| Wins | "Finally hit that armbar" | Success language detection |
| Energy/mood | "Felt gassed today" | Sentiment analysis |
| Injuries | "Tweaked my shoulder" | Body part + injury verb detection |

### Gap-Fill Rules

Only ask **ONE** follow-up question maximum. Priority order:

1. **Gi/No-gi** (if ambiguous) — Affects all technique/position analysis
2. **Duration** (if not mentioned) — Mat hours tracking
3. **Sparring rounds** (if not mentioned) — Performance context

**Never ask more than one.** If two things are missing, infer or ask next time.

### Belt-Specific Prompts

Use the belt personalization system to show relevant rotating prompts:

| Belt Level | Prompt Focus | Example Prompts |
|------------|--------------|-----------------|
| White | Survival, basics | "Did you survive today?", "Anything click?", "What felt scary?" |
| Blue | Identity, game development | "Working on anything specific?", "How'd sparring go?" |
| Purple | Systems, teaching | "What patterns did you notice?", "Teach anyone today?" |
| Brown | Refinement, efficiency | "Anything feel tighter?", "Working with competitors?" |

---

## Tier 2: Extract (AI Processing)

### Extraction Pipeline

```
Voice Recording
      ↓
┌─────────────────┐
│ Transcription   │  AssemblyAI with custom vocabulary
│ (AssemblyAI)    │  for BJJ terminology
└────────┬────────┘
         ↓
┌─────────────────┐
│ NLP Processing  │  Entity extraction, sentiment,
│                 │  technique matching
└────────┬────────┘
         ↓
┌─────────────────┐
│ Structured Data │  SessionData object with
│ Generation      │  all extracted fields
└────────┬────────┘
         ↓
┌─────────────────┐
│ Confidence      │  Flag low-confidence extractions
│ Scoring         │  for user confirmation
└─────────────────┘
```

### What AI Should Extract

| Category | Data Points | Four Pillars Mapping |
|----------|-------------|----------------------|
| **Techniques** | Names, positions, whether drilled or used in sparring | Technical (35%) |
| **Sparring** | Outcomes, submissions given/received, partner mentions | Sparring (30%) |
| **Consistency** | Duration, class type, training variety indicators | Consistency (20%) |
| **Character** | Teaching mentions, helping others, mood/attitude | Character (15%) |
| **Risk Signals** | Injury mentions, fatigue language, negative sentiment | Risk Detection |

### Custom Vocabulary for AssemblyAI

BJJ-specific terms to add for transcription accuracy:

```
Positions: mount, guard, side control, half guard, turtle, back mount,
           closed guard, open guard, butterfly guard, spider guard,
           de la riva, x-guard, single leg x, saddle, 50/50

Techniques: armbar, kimura, americana, triangle, guillotine, RNC,
            rear naked choke, bow and arrow, collar choke, ezekiel,
            arm triangle, d'arce, anaconda, heel hook, toe hold,
            knee bar, calf slicer, omoplata, gogoplata

Actions: swept, passed, submitted, tapped, escaped, transitioned,
         drilled, rolled, sparred, flow rolled

Modifiers: gi, nogi, no-gi, positional sparring, competition rounds
```

### Confidence Thresholds

| Confidence Level | Action |
|------------------|--------|
| > 90% | Auto-accept, show in review |
| 70-90% | Show in review with subtle highlight |
| 50-70% | Show with "Did you mean...?" prompt |
| < 50% | Don't include, note in raw transcript |

---

## Tier 3: Enrich (Pre-Session & Review)

### The Untapped Opportunity

Before the NEXT session, users are:
- Cognitively sharp
- Motivated (about to train)
- Have 2-3 minutes while changing/waiting

This is where we get **quality data** impossible to capture post-training.

### Pre-Session Prompts

| Prompt Type | Example | Data Captured |
|-------------|---------|---------------|
| Continuity | "Last session you mentioned struggling with half guard top. Still want to work on that?" | Training focus, persistence |
| Proficiency | "You logged 3 collar chokes last week. Rate your confidence: learning / developing / solid" | Technique self-assessment |
| Body state | "How's your body feeling? Fresh / Normal / Sore / Managing injury" | Recovery tracking |
| Intent | "What's the goal today? Learn / Drill / Spar hard / Competition prep" | Session context |

### Review Mode (Next Day)

When users open the app outside training context:
- Show session summary with "Add details?" expansion
- Prompt for partner belt levels (builds over time)
- Offer technique proficiency updates
- Allow injury status updates

### Cadence Rules

| Prompt Type | Frequency | Condition |
|-------------|-----------|-----------|
| Body state | Every session | Always |
| Technique proficiency | Weekly | After 3+ mentions of same technique |
| Training goal | When returning after 3+ day gap | Re-engagement context |
| Partner details | Monthly | Building social graph |

---

## Persona-Specific Adaptations

### What Each Persona Naturally Shares vs. Needs Prompting

| Persona | Naturally Shares | Needs Prompting For |
|---------|------------------|---------------------|
| **Jake (White-Excelling)** | Techniques, wins, specific moves | Struggles (ego protection), recovery |
| **David (White-At-Risk)** | Recovery concerns, fatigue | Technical details (lacks vocabulary) |
| **Marcus (Blue-Excelling)** | What worked/didn't, positions | Energy level (takes for granted) |
| **Ryan (Blue-At-Risk)** | Short answers, justifications | Anything positive (spiral mindset) |
| **Sofia (Purple)** | Rich detail, systems thinking | Nothing—natural power user |
| **Elena (Brown)** | Refinement, student progress | Body concerns (minimizes them) |

### Smart Defaults by Persona

| Persona | Training Type | Duration | Sparring | Class Type |
|---------|---------------|----------|----------|------------|
| Jake | Gi (60%) | 90 min | Likely | Advanced |
| David | Gi (80%) | 60 min | Maybe skip | Fundamentals |
| Marcus | 50/50 | 90 min | Likely | Mixed |
| Ryan | Based on last | 60 min | Uncertain | Variable |
| Sofia | Based on pattern | 90-120 min | Always | Advanced/Comp |
| Elena | Gi (65%) | 90 min | Moderate | Teaching focus |

### At-Risk Persona Handling

For users showing risk signals (Ryan, David):

1. **Accept minimal input** — Don't push for more data
2. **Celebrate any engagement** — "Good to see you back"
3. **Skip optional prompts** — Reduce friction completely
4. **Never show negative comparisons** — Only self-progress

---

## Data Flow to Personalization

### How Captured Data Enables Features

```
Journal Data
     ↓
┌────────────────────────────────────────────────────────┐
│                    DATA STORE                          │
│  Sessions, Submissions, Techniques, Struggles, etc.   │
└────────────────────────────────────────────────────────┘
     ↓                    ↓                    ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  DASHBOARD   │  │   CHATBOT    │  │    RISK      │
│  Metrics     │  │   Context    │  │  Detection   │
└──────────────┘  └──────────────┘  └──────────────┘
     ↓                    ↓                    ↓
Belt-specific      Personalized        Early warning
stat modules       responses           interventions
```

### Four Pillars Data Mapping

| Pillar | Weight | Primary Data Sources |
|--------|--------|----------------------|
| **Technical Proficiency** | 35% | Techniques mentioned, self-assessment, coach feedback |
| **Sparring Performance** | 30% | Submissions, outcomes, partner data, roll context |
| **Consistency** | 20% | Session frequency, mat hours, streaks, gaps |
| **Character** | 15% | Teaching mentions, energy/mood, goals progress |

---

## Implementation Priorities

### Phase 1: Core Voice Capture (Current)
- [x] Voice recording with rotating prompts
- [x] Belt-specific prompt selection
- [x] Gap-fill for gi/nogi
- [x] Review phase with extracted data
- [ ] Real transcription (AssemblyAI integration)
- [ ] Real NLP extraction pipeline

### Phase 2: Smart Extraction
- [ ] Custom vocabulary for BJJ terms
- [ ] Technique name matching to library
- [ ] Submission outcome parsing
- [ ] Partner name extraction
- [ ] Sentiment analysis for struggles/wins

### Phase 3: Enrichment Layer
- [ ] Pre-session prompt system
- [ ] Body state quick-tap
- [ ] Technique proficiency prompts
- [ ] Partner belt level collection
- [ ] Training intent capture

### Phase 4: Feedback Loop
- [ ] Data quality scoring
- [ ] User correction learning
- [ ] Extraction accuracy improvement
- [ ] Personalization refinement

---

## Success Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Voice log completion rate | > 80% | Users finishing the flow |
| Average log time | < 90 sec | Respecting exhausted state |
| Data fields captured per session | 5+ | Extraction effectiveness |
| Technique match rate | > 85% | NLP accuracy |
| Pre-session prompt response rate | > 40% | Tier 3 adoption |
| User correction rate | < 15% | Extraction confidence |

---

## Open Questions

1. **Offline-first priority?** Many gyms have poor signal. Full offline with sync?
2. **Partner graph building?** How aggressively to collect partner data?
3. **Coach visibility?** What data flows to coaches? User control?
4. **Competition mode?** Different capture flow for competition vs. training?

---

## Related Documents

- `/docs/research/data-requirements-analysis.md` — Four pillars framework
- `/docs/research/USER_PERSONAS_AND_RESEARCH.md` — Persona details
- `/docs/personas/PERSONA_PROFILES.md` — Full persona specifications
- `/docs/data-and-ai/AI_EXTRACTION_SPEC.md` — Technical extraction details, confidence scoring, 180+ BJJ vocabulary
- `/docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md` — AssemblyAI integration, accuracy targets, cost management
