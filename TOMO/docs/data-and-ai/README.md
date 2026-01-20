# Data & AI Strategy

> **Purpose:** Documents defining how we collect, process, and leverage user data to personalize the BJJ Journal experience.

---

## Overview

This folder contains strategy and specification documents for:

1. **Data Capture** — How we collect data from exhausted users
2. **AI Extraction** — How we turn voice/text into structured data
3. **Personalization** — How data drives belt-specific experiences
4. **Risk Detection** — How we identify at-risk users early
5. **Data Visualization** — How we present data through charts and infographics
6. **Content Recommendations** — How journal data drives technique video recommendations

---

## Documents

| Document | Status | Description |
|----------|--------|-------------|
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Active | Three-tier data capture pyramid, persona adaptations, implementation roadmap |
| `CONVERSATION_DESIGN_FOUNDATION.md` | Active | Voice/chatbot conversation design principles |
| `VOICE_LOGGING_CONVERSATION_DESIGN.md` | Active | Voice logger conversation flow specification |
| `INFOGRAPHIC_STRATEGY.md` | Active | Charts, infographics, and data visualization strategy |
| `TECHNIQUE_RECOMMENDATION_ENGINE.md` | Active | **How journal data drives video recommendations** - scoring algorithm, AI prompts, personalization logic |
| `index.html` | Active | Interactive infographic preview/demo |
| `AI_EXTRACTION_SPEC.md` | TODO | Technical spec for NLP pipeline, entity extraction, confidence scoring |
| `VOICE_TRANSCRIPTION_SPEC.md` | TODO | AssemblyAI integration, custom vocabulary, accuracy requirements |
| `PERSONALIZATION_ENGINE.md` | TODO | How captured data flows to dashboard, chatbot, recommendations |
| `RISK_DETECTION_SIGNALS.md` | TODO | Dropout prediction, intervention triggers, re-engagement flows |

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
