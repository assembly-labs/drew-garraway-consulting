# AI Implementation Quick Start

> **For coding agents and developers implementing AI features in TOMO**

---

## 5-Minute Overview

TOMO uses AI/LLM technology for three core capabilities:

| Capability | What It Does | Key Document |
|------------|--------------|--------------|
| **Voice Extraction** | Transcribe + extract structured data from voice logs | `VOICE_TRANSCRIPTION_SPEC.md` |
| **Insight Generation** | Generate personalized, belt-appropriate coaching text | `INSIGHTS_GENERATION_SPEC.md` |
| **Pattern Detection** | Identify training patterns, risks, and breakthroughs | `DATA_AND_AI_BY_PAGE.md` |

---

## Before You Write Any Code

**Read these in order:**

1. **[FIRST_PRINCIPLES.md](../FIRST_PRINCIPLES.md)** — The 12 non-negotiable rules. Every AI output must pass these.
2. **[DATA_AND_AI_BY_PAGE.md](./DATA_AND_AI_BY_PAGE.md)** — How data/AI works on each page (Stats, Insights, Journal, Techniques)
3. **[INSIGHTS_GENERATION_SPEC.md](./INSIGHTS_GENERATION_SPEC.md)** — System prompts, data payloads, validation rules

---

## Quick Reference: What Goes Where

### Getting Belt Configuration

```typescript
import { useBeltPersonalization } from '@/hooks';

const {
  profile,        // Psychology profile (struggles, motivations, plateaus)
  chatbot,        // AI config: tone, vocabulary, topics to avoid/emphasize
  dashboard,      // Dashboard metrics and module visibility
  analyzeJournal, // Journal text analysis function
} = useBeltPersonalization();
```

**File:** `/prototype/src/hooks/useBeltPersonalization.ts`

### System Prompt Construction

Use the chatbot adaptation to build prompts:

```typescript
const { chatbot, profile } = useBeltPersonalization();

const systemPrompt = `
You are TOMO, a BJJ training assistant.
User is a ${profile.beltLevel} belt.

Tone: ${chatbot.toneProfile.warmth} warmth, ${chatbot.toneProfile.directness} directness
Vocabulary: ${chatbot.technicalVocabulary}
Encouragement: ${chatbot.encouragementLevel}

EMPHASIZE: ${chatbot.emphasizeTopics.join(', ')}
AVOID: ${chatbot.avoidTopics.join(', ')}
`;
```

**Full templates:** `INSIGHTS_GENERATION_SPEC.md` → Section 4: System Prompts

### Data Payload Schema

What user data to send to the LLM:

```typescript
interface InsightPayload {
  user: { beltLevel, stripes, totalSessions, daysAtBelt };
  recentSessions: { date, techniques, struggles, wins, notes }[];
  patterns: { averageSessionsPerWeek, mostLoggedTechniques, recurringStruggles };
  insightType: 'post_session' | 'weekly_summary' | 'pattern_detection';
}
```

**Full schema:** `INSIGHTS_GENERATION_SPEC.md` → Section 5: Data Payload Schema

### Validation (First Principles Compliance)

Every generated insight must pass validation:

```typescript
// Forbidden patterns (auto-reject if matched)
const FORBIDDEN = [
  /\bstreak\b/i,           // No gamification
  /\blevel up\b/i,         // No gamification
  /\bcrushing it\b/i,      // No empty hype
  /\bhack\b/i,             // No shortcuts
  /\bnext belt\b/i,        // No promotion timelines
  /\byou should.*instead/i // No technique corrections
];
```

**Full validation rules:** `INSIGHTS_GENERATION_SPEC.md` → Section 7: Validation Rules

---

## Key Files Map

```
/TOMO/docs/
├── FIRST_PRINCIPLES.md              ← START HERE (philosophy)
├── data-and-ai/
│   ├── AI_QUICK_START.md            ← YOU ARE HERE
│   ├── DATA_AND_AI_BY_PAGE.md       ← Per-page AI behavior
│   ├── INSIGHTS_GENERATION_SPEC.md  ← LLM prompts & payloads
│   ├── VOICE_TRANSCRIPTION_SPEC.md  ← AssemblyAI integration
│   └── VOICE_LOGGING_CONVERSATION_DESIGN.md ← Voice UX flow
├── product/
│   ├── BELT_INTEGRATION_SPEC.md     ← Per-page belt adaptations
│   └── BELT_PERSONALIZATION_SYSTEM.md ← Belt psychology overview

/TOMO/prototype/src/
├── config/belt-system/
│   ├── belt-profiles.ts             ← Psychology per belt
│   ├── feature-adaptations.ts       ← UI/AI config per belt
│   ├── risk-signals.ts              ← Dropout detection
│   └── journal-patterns.ts          ← Text analysis patterns
└── hooks/
    └── useBeltPersonalization.ts    ← React hook for all above
```

---

## Common Tasks

### Task: Generate Post-Session Insight

1. Get belt config: `useBeltPersonalization()` → `chatbot`
2. Build payload with session data (see schema above)
3. Construct system prompt using belt-specific template
4. Call LLM API
5. Validate response against First Principles
6. Display or use fallback if validation fails

**Full spec:** `INSIGHTS_GENERATION_SPEC.md`

### Task: Transcribe Voice Log

1. Record audio (AAC/WAV)
2. Send to AssemblyAI with custom vocabulary
3. Parse transcript for entities (techniques, submissions, partners)
4. Apply confidence thresholds
5. Show review card with extracted data

**Full spec:** `VOICE_TRANSCRIPTION_SPEC.md`

### Task: Detect Dropout Risk

1. Check training gap days
2. Check session frequency trend
3. Check sentiment in recent notes
4. Apply belt-specific multipliers (white belts = higher risk)
5. Trigger intervention if threshold exceeded

**Full spec:** `DATA_AND_AI_BY_PAGE.md` → Insights section

---

## Checklist Before Shipping AI Features

- [ ] Read FIRST_PRINCIPLES.md
- [ ] Using `useBeltPersonalization()` for all belt-specific behavior
- [ ] System prompts include belt-appropriate tone/vocabulary
- [ ] All outputs validated against forbidden patterns
- [ ] Fallback content exists for API failures
- [ ] No gamification language (streak, level up, badge)
- [ ] No technique corrections (suggest asking coach instead)
- [ ] Specific observations, not vague praise

---

## Questions?

| Question | Document |
|----------|----------|
| "What should the AI sound like?" | `FIRST_PRINCIPLES.md`, `CONVERSATION_DESIGN_FOUNDATION.md` |
| "What data do I send to the LLM?" | `INSIGHTS_GENERATION_SPEC.md` |
| "How do belt levels change behavior?" | `BELT_INTEGRATION_SPEC.md` |
| "What's the voice transcription flow?" | `VOICE_TRANSCRIPTION_SPEC.md` |
| "How do I detect dropout risk?" | `DATA_AND_AI_BY_PAGE.md` |

---

*Last updated: January 2026*
