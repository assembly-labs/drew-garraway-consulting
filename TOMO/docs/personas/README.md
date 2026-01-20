# User Personas

> **Purpose:** Canonical persona definitions for product decisions, feature prioritization, and design.

---

## Canonical Source

**`TOMO_PERSONAS.md`** is the single source of truth for all persona definitions.

| Document | Status | Purpose |
|----------|--------|---------|
| `TOMO_PERSONAS.md` | **Canonical** | All persona definitions, psychology, success metrics |

---

## Quick Reference

| ID | Persona | Belt | Priority | Core Need |
|----|---------|------|----------|-----------|
| `newcomer` | Alex Rivera | White (0-6mo) | PRIMARY | Survive the initial filter |
| `survivor` | Jake Thompson | White (6-18mo) | PRIMARY | Build toward blue belt |
| `plateau-warrior` | Marcus Chen | Blue | PRIMARY | Break through the plateau |
| `newcomer-female` | Maya Okonkwo | White (0-6mo) | SECONDARY | Belong + survive |
| `specialist` | Sofia Rodriguez | Purple | TERTIARY | Develop systems |
| `finisher` | Daniel Reyes | Brown | TERTIARY | Earn black belt |

---

## Market Prioritization

| Segment | % of Practitioners | Priority | Rationale |
|---------|-------------------|----------|-----------|
| White Belt (0-6mo) | 15-20% | **PRIMARY** | 70-90% quit—highest impact opportunity |
| White Belt (6-18mo) | 10-15% | **PRIMARY** | Continuation of newcomer success |
| Blue Belt | 35-40% | **PRIMARY** | Largest segment, highest revenue, clearest pain |
| Purple Belt | 20-25% | TERTIARY | Low dropout risk |
| Brown Belt | 10-15% | TERTIARY | Very low dropout risk |

**Our mission:** Keep people on the mats. 70-90% of people who start BJJ quit within 6 months.

---

## Usage in Code

Persona IDs are used throughout the codebase for personalization:

```typescript
// Belt personalization hook
import { useBeltPersonalization } from '@/hooks';

const { profile, dashboard, chatbot } = useBeltPersonalization();
// profile.personaId returns: 'newcomer' | 'survivor' | 'plateau-warrior' | etc.
```

---

## Related Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Research Synthesis | `/docs/research/USER_PERSONAS_AND_RESEARCH.md` | Market data, cognitive research |
| Messaging Guidelines | `/docs/research/MESSAGING_GUIDELINES.md` | Personalized messaging templates |
| Features | `/docs/product/FEATURES.md` | Feature specifications |
| Belt Psychology | `/docs/research/TOMO_Belt_Progression_Requirements_Reference.md` | Belt-by-belt psychology |

---

## The Exhausted User State

Beyond WHO users are, every persona becomes "The Exhausted User" post-training:

- **Physical:** Heart rate 100-140 BPM, sweating, grip depleted
- **Cognitive:** 40% impaired, 30-60 second attention span
- **Emotional:** High or low based on session, low tolerance for friction

See `/docs/research/USER_PERSONAS_AND_RESEARCH.md` for full research.

---

*Last updated: January 2026*
