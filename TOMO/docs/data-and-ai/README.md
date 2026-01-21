# Data & AI Strategy

> **Purpose:** Documents defining how we collect, process, and leverage user data to personalize the BJJ Journal experience.

---

## iOS Handoff Status

**Status: 95% READY FOR HANDOFF** | [Full Assessment](../project/handoff/DATA_AI_HANDOFF_ASSESSMENT.md)

All critical AI specifications are complete:
- LLM system prompts for all belt levels
- Data payload schemas with TypeScript interfaces
- Good/bad example outputs with validation rules
- 450+ BJJ vocabulary for voice transcription
- Video recommendation scoring algorithm

---

## For Agentic Coding Partners

### Quick Start

[`AI_QUICK_START.md`](./AI_QUICK_START.md) — 5-minute overview of AI implementation with code snippets

### Deep Dive

| Domain | Document | Purpose |
|--------|----------|---------|
| **Per-Page Behavior** | [`DATA_AND_AI_BY_PAGE.md`](./DATA_AND_AI_BY_PAGE.md) | How data & AI operate on each page |
| **Voice & Extraction** | [`AI_EXTRACTION_SPEC.md`](./AI_EXTRACTION_SPEC.md) | NLP pipeline, 450+ BJJ vocabulary, confidence scoring |
| **Content Recommendations** | [`TECHNIQUE_RECOMMENDATION_ENGINE.md`](./TECHNIQUE_RECOMMENDATION_ENGINE.md) | Scoring algorithm, AI prompts, belt filtering |
| **Video Library** | [`VIDEO_CONTENT_LIBRARY_SPEC.md`](./VIDEO_CONTENT_LIBRARY_SPEC.md) | Video schema, curation criteria, maintenance |
| **Insight Generation** | [`INSIGHTS_GENERATION_SPEC.md`](./INSIGHTS_GENERATION_SPEC.md) | LLM prompts, payloads, validation rules |
| **Voice Transcription** | [`VOICE_TRANSCRIPTION_SPEC.md`](./VOICE_TRANSCRIPTION_SPEC.md) | AssemblyAI integration, cost management |

### Page-Level Reference

How data and AI operate on each major page:
- **STATS (Dashboard)** — Pattern analysis, breakthrough detection, belt-adaptive visualizations
- **INSIGHTS** — Journal text analysis, AI coaching generation, risk-aware messaging
- **JOURNAL** — Voice-to-text extraction, sentiment analysis, belt-adaptive cards
- **TECHNIQUES** — Content recommendations, difficulty filtering, content gates

---

## Overview

This folder contains strategy and specification documents for:

1. **Data Capture** — How we collect data from exhausted users
2. **AI Extraction** — How we turn voice/text into structured data
3. **Content Recommendations** — How journal data drives personalized video suggestions
4. **Insight Generation** — How we generate belt-appropriate coaching text
5. **Personalization** — How data drives belt-specific experiences
6. **Risk Detection** — How we identify at-risk users early
7. **Data Visualization** — How we present data through charts and infographics

---

## Documents

### Developer Quick Start
| Document | Status | Description |
|----------|--------|-------------|
| `AI_QUICK_START.md` | **Active** | **START HERE** - 5-minute overview, code snippets, key files map |

### Core Specifications
| Document | Status | Description |
|----------|--------|-------------|
| `DATA_AND_AI_BY_PAGE.md` | **Active** | Master reference for how data & AI operate on each page |
| `INSIGHTS_GENERATION_SPEC.md` | **Active** | LLM-powered insight generation: system prompts, data payloads, validation rules |
| `AI_EXTRACTION_SPEC.md` | **Active** | NLP pipeline: entity extraction, confidence scoring, 450+ BJJ vocabulary |
| `TECHNIQUE_RECOMMENDATION_ENGINE.md` | **Active** | Video recommendation scoring algorithm, AI prompts, belt filtering |
| `VIDEO_CONTENT_LIBRARY_SPEC.md` | **Active** | Video schema, curation criteria, maintenance process |
| `VOICE_TRANSCRIPTION_SPEC.md` | **Active** | AssemblyAI integration, accuracy targets, cost management |

### Supporting Documents
| Document | Status | Description |
|----------|--------|-------------|
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Active | Three-tier data capture pyramid, persona adaptations |
| `CONVERSATION_DESIGN_FOUNDATION.md` | Active | Voice/chatbot conversation design principles |
| `VOICE_LOGGING_CONVERSATION_DESIGN.md` | Active | Voice logger conversation flow specification |
| `INFOGRAPHIC_STRATEGY.md` | Active | Charts, infographics, and data visualization strategy |
| [`DATA_AI_HANDOFF_ASSESSMENT.md`](../project/handoff/DATA_AI_HANDOFF_ASSESSMENT.md) | **Ready** | Handoff readiness evaluation — **95% complete, ready for iOS development** |
| `index.html` | Active | Interactive infographic preview/demo |

### Merged/Deprecated
| Document | Status | Description |
|----------|--------|-------------|
| `PERSONALIZATION_ENGINE.md` | MERGED | Covered in DATA_AND_AI_BY_PAGE.md |
| `RISK_DETECTION_SIGNALS.md` | MERGED | Covered in DATA_AND_AI_BY_PAGE.md |
| `LLM_INTEGRATION_ARCHITECTURE.md` | MERGED | Covered in INSIGHTS_GENERATION_SPEC.md and AI_EXTRACTION_SPEC.md |

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

---

*Last updated: January 21, 2026*
