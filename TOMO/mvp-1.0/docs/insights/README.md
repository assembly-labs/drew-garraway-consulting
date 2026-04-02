# TOMO Insights — Feature Architecture

## Overview

Voice-first BJJ training journal that uses a tiered AI model system to provide personalized coaching insights. Three models operate at different cadences, with context flowing both up (data aggregation) and down (strategic priorities).

## The BJJ Coaching Hierarchy

- **Weekly (Haiku)** = Training partner debrief — quick, tactical, contextual
- **Monthly (Sonnet)** = Coach check-in — structured, developmental
- **Quarterly (Opus)** = Private with a black belt — comprehensive, strategic

## Data Flow Architecture

```
Sessions (raw)
    |
    v
Client-side Pattern Engine (free, instant, offline)
    |
    v
Computed stats (per-period summaries)
    |
    +---> Weekly stats -----> Haiku -----> Weekly insight (stored)
    |                                          |
    |     4 weekly insights + monthly stats    v
    +---> --------------------------------> Sonnet --> Monthly review (stored)
    |                                                      |
    |     3 monthly reviews + quarterly stats              v
    +---> ---------------------------------------------> Opus --> Quarterly assessment (stored)

--- Context flows DOWN ---

Opus quarterly priorities
    |
    v
Sonnet monthly focus areas
    |
    v
Haiku weekly framing
```

Each tier's output includes a `context_for_lower_tiers` field that gets extracted and stored. Lower-tier prompts receive this as strategic context, so a weekly insight knows what the quarterly assessment flagged as a priority.

## Conversational Follow-Up

- After any insight is generated, the user can chat with the model that produced it
- Maximum 5 user messages per insight conversation
- Same model handles follow-up (Haiku for weekly, Sonnet for monthly, Opus for quarterly)
- Full conversation history carried in each exchange (token growth accounted for in budgets)
- Conversations stored for UCD learning — recurring questions signal gaps in insight quality

## User Context Document (UCD)

A living personalization document injected into every AI prompt. It grows over time:

1. **Static profile data** — belt, weight, academy, training frequency, goals
2. **Computed patterns** — top submissions, guard style, positional tendencies, win/loss trends
3. **Learned preferences** — communication style, topics they ask about, what resonates

Key properties:
- Rebuilt after each session logged (only on meaningful change)
- Versioned with changelog for quarterly review reference
- ~200-400 tokens — concise enough to fit in every prompt without waste
- Variables include: belt, style identity, top submissions, vulnerabilities, injury history, training preferences

## Cost Projections

| Tier | Model | Frequency | Avg Input Tokens | Avg Output Tokens | Annual Cost/User |
|------|-------|-----------|------------------|-------------------|------------------|
| Weekly | Haiku | 52x/year | 1,000 | 350 | $0.016 |
| Monthly | Sonnet | 12x/year | 2,200 | 700 | $0.072 |
| Quarterly | Opus | 4x/year | 4,000 | 1,100 | $0.36 |
| Chat (est. 30% usage) | Mixed | Variable | Variable | ~250/exchange | $0.40 |
| **Total** | | | | | **~$0.85/user/year** |

At 10,000 users: ~$8,500/year in AI costs.

## Minimum Thresholds

These prevent low-data insights that would feel hollow or inaccurate:

| Tier | Requirement |
|------|-------------|
| Weekly | 1+ session logged that week |
| Monthly | 5+ sessions that month AND 2+ weekly insights generated |
| Quarterly | 2+ monthly reviews generated that quarter |

If thresholds aren't met, the insight is skipped for that period. No partial or padded output.

## Key Files

| File | Purpose |
|------|---------|
| `models/HAIKU_WEEKLY.md` | Weekly model spec — prompt template, output schema, examples |
| `models/SONNET_MONTHLY.md` | Monthly model spec — prompt template, output schema, examples |
| `models/OPUS_QUARTERLY.md` | Quarterly model spec — prompt template, output schema, examples |
| `CHAT_SPEC.md` | 5-exchange conversation design and rules |
| `PERSONALIZATION.md` | UCD architecture, rebuild triggers, variable definitions |
| `SCHEMA.md` | Database tables and migrations for insights storage |
| `BUILD_PLAN.md` | Phased implementation plan |

## Design Principles

1. **Never contradict or replace the user's coach.** Frame everything as observations and questions, not instructions.
2. **Belt-adaptive tone, vocabulary, and depth at every tier.** White belt gets encouragement and fundamentals framing. Purple belt gets technical depth and strategic nuance.
3. **Text-first insights (no charts in v1).** Matches the voice-first philosophy — insights should read like a conversation, not a dashboard.
4. **Context flows down.** Each tier is informed by the one above it. Weekly insights know what the quarterly assessment prioritized.
5. **Pattern engine is client-side.** Free, instant, works offline. AI models never touch raw session data.
6. **AI only sees pre-computed summaries.** The pattern engine aggregates and anonymizes. Models receive structured stats, not transcripts or raw notes.
