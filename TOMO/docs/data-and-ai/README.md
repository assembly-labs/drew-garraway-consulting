# Data & AI Strategy

> **Purpose:** Documents defining how we collect, process, and leverage user data to personalize the BJJ Journal experience.

---

## For Agentic Coding Partners

**Start here:** [`DATA_AND_AI_BY_PAGE.md`](./DATA_AND_AI_BY_PAGE.md)

This document maps exactly how data and AI operate for each major page:
- **STATS (Dashboard)** — Pattern analysis, breakthrough detection, belt-adaptive visualizations
- **INSIGHTS** — Journal text analysis, AI coaching generation, risk-aware messaging
- **JOURNAL** — Voice-to-text extraction, sentiment analysis, belt-adaptive cards
- **TECHNIQUES** — Recommendation algorithm, difficulty filtering, content gates

---

## Overview

This folder contains strategy and specification documents for:

1. **Data Capture** — How we collect data from exhausted users
2. **AI Extraction** — How we turn voice/text into structured data
3. **Personalization** — How data drives belt-specific experiences
4. **Risk Detection** — How we identify at-risk users early
5. **Data Visualization** — How we present data through charts and infographics

---

## Documents

| Document | Status | Description |
|----------|--------|-------------|
| `DATA_AND_AI_BY_PAGE.md` | **Active** | **START HERE** - Master reference for how data & AI operate on each page (Stats, Insights, Journal, Techniques) |
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Active | Three-tier data capture pyramid, persona adaptations, implementation roadmap |
| `CONVERSATION_DESIGN_FOUNDATION.md` | Active | Voice/chatbot conversation design principles |
| `VOICE_LOGGING_CONVERSATION_DESIGN.md` | Active | Voice logger conversation flow specification |
| `INFOGRAPHIC_STRATEGY.md` | **Updated** | Charts, infographics, and data visualization strategy (aligned with implementation) |
| `index.html` | Active | Interactive infographic preview/demo |
| `VOICE_TRANSCRIPTION_SPEC.md` | **Active** | AssemblyAI integration, 180+ BJJ vocabulary terms, accuracy targets, cost management |
| `AI_EXTRACTION_SPEC.md` | MERGED | Covered in VOICE_LOGGING_CONVERSATION_DESIGN.md (lines 204-450) |
| `PERSONALIZATION_ENGINE.md` | MERGED | Covered in DATA_AND_AI_BY_PAGE.md |
| `RISK_DETECTION_SIGNALS.md` | MERGED | Covered in DATA_AND_AI_BY_PAGE.md |

---

## Key Concepts

### The 90-Second Rule

Every post-training logging flow must complete in under 90 seconds. After that, friction wins and data is lost.

### The Data Capture Pyramid

```
        TIER 3: ENRICH     ← Later, full cognition
       TIER 2: EXTRACT     ← AI processing
      TIER 1: CAPTURE      ← Immediate, voice-first
```

### Four Pillars of BJJ Progression

All data collection maps to these pillars (from data-requirements-analysis.md):

| Pillar | Weight | Key Data |
|--------|--------|----------|
| Technical Proficiency | 35% | Techniques, drilling, proficiency self-assessment |
| Sparring Performance | 30% | Outcomes, submissions, partner context |
| Consistency | 20% | Session frequency, mat hours, streaks |
| Character | 15% | Teaching, attitude, community contribution |

---

## Related Folders

- `/research/` — Market research, competitive analysis, user studies
- `/personas/` — Detailed persona profiles
- `/prototype/src/config/belt-system/` — Belt personalization implementation

---

## Contributing

When adding new documents:

1. Use `SCREAMING_SNAKE_CASE.md` for strategy docs
2. Include status (Active, Draft, TODO, Deprecated)
3. Link related documents
4. Add to the table above
