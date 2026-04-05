# iOS Handoff Readiness Assessment: Data & AI Features

**Date:** January 20, 2026
**Purpose:** Evaluate documentation completeness for iOS development handoff
**Audience:** Product Manager, iOS Development Team

---

## Executive Summary

**Overall Readiness: 65% — NOT READY FOR HANDOFF**

The TOMO data-and-ai documentation provides excellent *strategy* and *philosophy*, but lacks the critical *implementation specifications* needed for iOS developers to build the AI-powered features, particularly the **Insights page**.

### What's Strong
- First Principles document is exceptional — clear product philosophy
- Belt personalization system is fully designed and partially implemented
- Voice logging conversation design is comprehensive
- Data capture strategy is well-documented

### What's Missing (Blocking Handoff)
1. **No LLM integration spec** — How does user data + system prompts = AI response?
2. **No system prompt templates** — What exact prompts generate insights?
3. **No API contract** — What's the request/response format?
4. **No data payload spec** — What user data gets sent to the LLM?
5. **No example generations** — What should good/bad outputs look like?

---

## Documentation Status by Area

### Existing Documents (Reviewed)

| Document | Status | Completeness | Notes |
|----------|--------|--------------|-------|
| `FIRST_PRINCIPLES.md` | Ready | 100% | Excellent foundation. Required reading for all developers. |
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Ready | 85% | Clear strategy, missing NLP pipeline details |
| `CONVERSATION_DESIGN_FOUNDATION.md` | Ready | 80% | Good persona/tone guidelines, needs LLM prompt translation |
| `VOICE_LOGGING_CONVERSATION_DESIGN.md` | Ready | 75% | Solid spec, extraction prompt needs refinement |
| `INFOGRAPHIC_STRATEGY.md` | Ready | 90% | Comprehensive visualization recommendations |
| `BELT_INTEGRATION_SPEC.md` | Ready | 85% | Detailed per-page contracts, some TODOs remain |

### Missing Documents (Blocking)

| Document | Priority | Impact | Description |
|----------|----------|--------|-------------|
| `INSIGHTS_GENERATION_SPEC.md` | **P0 - CRITICAL** | Insights page broken | How LLM generates personalized insights from user data |
| `AI_EXTRACTION_SPEC.md` | P1 | Voice logging degraded | NLP pipeline for entity extraction, confidence scoring |
| `VOICE_TRANSCRIPTION_SPEC.md` | P1 | Voice logging broken | AssemblyAI integration, custom vocabulary, accuracy requirements |
| `LLM_INTEGRATION_ARCHITECTURE.md` | P1 | All AI features | Overall architecture for AI service calls |
| `PERSONALIZATION_ENGINE.md` | P2 | Personalization limited | Data flow from capture to insight generation |
| `RISK_DETECTION_SIGNALS.md` | P2 | Re-engagement broken | Dropout prediction, intervention triggers |

---

## Critical Gap Analysis: Insights Page

### Current State
The prototype's Insights page (`TrainingFeedback.tsx`) uses **hardcoded responses** that feel great during demos. However, there is **no specification** for how to generate these dynamically using:
1. User's belt level
2. User's session history
3. User's journal entries
4. First Principles alignment
5. Belt-appropriate tone and vocabulary

### What Developers Need

#### 1. System Prompt Templates
**Missing:** No documented system prompts for insight generation.

The prototype's `chatbotAdaptation` in `feature-adaptations.ts` defines tone, vocabulary, and topics — but there's no document showing **how these translate to actual LLM prompts**.

**Required:** A document specifying system prompts like:
```
You are TOMO, a BJJ training assistant embodying "The Dedicated Training Partner."

USER CONTEXT:
- Belt: {{belt_level}} ({{stripes}} stripes)
- Sessions logged: {{session_count}}
- Days since last training: {{days_gap}}
- Current focus areas: {{focus_techniques}}

TONE CONFIGURATION:
- Warmth: {{warmth_level}}
- Directness: {{directness_level}}
- Encouragement: {{encouragement_level}}
- Technical vocabulary: {{vocabulary_level}}

CONSTRAINTS:
- NEVER gamify (no "level up", "unlock", "streak broken")
- NEVER replace coach advice ("ask your coach about...")
- ALWAYS use specifics over vague praise
- {{belt_specific_constraints}}

TASK: Generate a {{insight_type}} insight based on the user's recent training data...
```

#### 2. Data Payload Specification
**Missing:** No schema for what user data gets passed to the LLM.

**Required:** Document specifying the data structure sent with each insight request:
```typescript
interface InsightGenerationPayload {
  // User profile
  user: {
    beltLevel: BeltLevel;
    stripes: number;
    daysAtBelt: number;
    totalSessions: number;
    sessionCount30Days: number;
    trainingStartDate: Date;
  };

  // Recent activity
  recentSessions: {
    date: Date;
    duration: number;
    trainingType: 'gi' | 'nogi';
    sparring: boolean;
    techniques: string[];
    struggles: string[];
    wins: string[];
    notes: string;
  }[];

  // Aggregated patterns
  patterns: {
    averageSessionsPerWeek: number;
    mostCommonTechniques: string[];
    recurringStruggles: string[];
    submissionsGiven: { technique: string; count: number }[];
    submissionsReceived: { technique: string; count: number }[];
    trainingGapDays: number[];
  };

  // Context
  insightType: 'post_session' | 'weekly_summary' | 'monthly_reflection' | 'pattern_detection';
  triggerContext: string;
}
```

#### 3. Example Generations (Acceptance Criteria)
**Missing:** No examples of expected LLM outputs.

**Required:** Examples showing good vs. bad outputs:

**WHITE BELT — Post-Session Insight (GOOD)**
```
Input: Jake (white belt, 3 stripes) logged his 47th session.
He mentioned struggling with mount escapes and getting triangled.

Output: "47 sessions in — that's real consistency, Jake. Mount escapes
take time; even upper belts get caught there. You mentioned triangles
catching you. Worth asking your coach about posture in closed guard
— that's usually where triangles start. Keep showing up."
```

**WHITE BELT — Post-Session Insight (BAD - Violates First Principles)**
```
Output: "Amazing work crushing it today! 47 sessions — you're on fire!
Here's a quick hack: when in mount, just shrimp to the side and
bridge simultaneously. You'll escape every time! Keep dominating!"

Violations:
- "crushing it", "on fire", "dominating" = empty hype (Principle 9)
- "quick hack" = no shortcuts exist (Principle 6)
- "escape every time" = false promise (Principle 6)
- Giving technique advice without seeing them = not our role (Principle 7)
```

**BLUE BELT — Weekly Summary (GOOD)**
```
Input: Marcus (blue belt, 2 stripes) trained 4 times this week.
Logged half guard work in 3 sessions, got swept from there twice.

Output: "Solid week — 4 sessions, mostly focused on half guard.
Your notes show you're getting swept from there, specifically
when losing the underhook. That's exactly what blue belt is for:
identifying these patterns. The sweep problem usually lives in
your knee shield positioning or hip angle. Worth drilling the
recovery sequence with a partner."
```

#### 4. Belt-Specific Prompt Variations
**Missing:** No documentation of how prompts differ by belt.

**Required:** Clear per-belt prompt fragments:

| Belt | System Prompt Addition |
|------|------------------------|
| White | "Keep responses simple (1-2 sentences). Lead with encouragement. Use basic position names only. Never mention submissions the user hasn't logged. Always suggest asking their coach." |
| Blue | "Balance encouragement with analysis. Reference technique connections. If plateau detected, normalize it ('The blue belt blues are real'). Suggest broadening their game." |
| Purple | "Treat as peer. Lead with data/pattern observation. Use full BJJ vocabulary. Discuss systems and chains. Minimal encouragement — they know they're doing well." |
| Brown | "Professional peer tone. Focus on refinement and efficiency. Acknowledge teaching responsibilities. Discuss conceptual understanding." |

#### 5. Insight Type Specifications
**Missing:** No breakdown of different insight types and their requirements.

**Required:** Document each insight type:

| Insight Type | Trigger | Data Required | Output Format | Principles Emphasized |
|--------------|---------|---------------|---------------|----------------------|
| Post-Session | Session saved | Last session data, belt profile | 2-3 sentences | Principle 1 (Reflection), 9 (Specificity) |
| Weekly Summary | 7 days since last summary | Week's sessions, technique frequency | Paragraph with metrics | Principle 9 (Specificity), 3 (Process) |
| Pattern Detection | Pattern threshold met | 30-day data, recurring elements | Pattern observation + suggestion | Principle 4 (Helpful), 11 (Flashlight) |
| Gap Re-engagement | 7+ day training gap | Gap duration, last session, belt | Warm, non-judgmental return | Principle 12 (No Gamification), 6 (Difficulty) |
| Struggle Pattern | Same struggle 3+ times | Struggle mentions, context | Observation + coach referral | Principle 7 (Amplify Coaches) |

---

## Alignment with First Principles

Every AI-generated insight must pass the First Principles checklist:

### Automated Validation Rules

| Principle | Validation Rule | Fail Examples |
|-----------|-----------------|---------------|
| 1. Reflection First | Must include a question or reflection prompt | Pure statement with no invitation to think |
| 2. Easy Capture | N/A for insights (applies to logging) | — |
| 3. Process Over Outcome | No belt timeline mentions, no "promotion in X months" | "You're on track for blue belt!" |
| 4. Be Helpful | Must contain actionable observation | "Great job!" (vague, unhelpful) |
| 5. Belt Psychology | Tone matches belt level | Analytical tone for white belt |
| 6. Respect Difficulty | No "hacks", "secrets", "shortcuts" | "Try this one weird trick..." |
| 7. Amplify Coaches | For technique advice, suggest asking coach | "Your armbar grip is wrong, do X instead" |
| 8. Connection | Acknowledge training partners when present | Ignoring logged partner data |
| 9. Specificity | Include specific numbers/patterns | "You're doing great!" |
| 10. Two User States | N/A for insights (applies to UI design) | — |
| 11. Flashlight, Not Path | Observe without prescribing | "You should focus on X" |
| 12. No Gamification | No "streak", "level up", "achievement" | "Don't break your streak!" |

### Required: Validation Service
Developers need a specification for a validation layer that checks generated insights against these rules before displaying to users.

---

## Recommended Action Plan

### Phase 1: Critical Documentation (Before Handoff)
**Timeline: 1-2 weeks**

1. **Create `INSIGHTS_GENERATION_SPEC.md`** — P0
   - System prompt templates by belt level
   - Data payload specification
   - Example generations with acceptance criteria
   - First Principles validation rules
   - Error handling and fallback content

2. **Create `LLM_INTEGRATION_ARCHITECTURE.md`** — P1
   - API contract (request/response formats)
   - Rate limiting and cost considerations
   - Caching strategy
   - Error handling
   - Model selection (GPT-4o, Claude, etc.)

3. **Complete `AI_EXTRACTION_SPEC.md`** — P1
   - Entity extraction pipeline
   - BJJ-specific NER (technique names, positions)
   - Confidence scoring thresholds
   - Human-in-the-loop correction patterns

### Phase 2: Supporting Documentation (Can parallel with dev)
**Timeline: 2-3 weeks**

4. **Complete `VOICE_TRANSCRIPTION_SPEC.md`** — P1
   - AssemblyAI API integration
   - Custom vocabulary list (200+ BJJ terms)
   - Accuracy requirements and testing
   - Fallback for poor transcription

5. **Create `PERSONALIZATION_ENGINE.md`** — P2
   - Data flow diagrams
   - Caching strategy for user patterns
   - Real-time vs. batch processing

6. **Create `RISK_DETECTION_SIGNALS.md`** — P2
   - Signal definitions and thresholds
   - Intervention message templates
   - Re-engagement notification strategy

---

## Appendix: Existing System That Works (Reference)

### Belt Personalization Hook
The prototype has a working React hook that provides all the configuration data. iOS developers should mirror this pattern:

```typescript
const {
  profile,        // Psychology profile for user's belt
  dashboard,      // Dashboard adaptations
  chatbot,        // AI/chatbot adaptations (tone, vocabulary, topics)
  analyzeJournal, // Journal text analysis function
} = useBeltPersonalization();
```

### Chatbot Adaptation Data (Already Defined)
From `feature-adaptations.ts` — this data exists and is production-ready:

```typescript
chatbot: {
  toneProfile: { primary: 'supportive', warmth: 'high', directness: 'gentle' },
  responseDepth: 'simple',
  technicalVocabulary: 'basic',
  encouragementLevel: 'high',
  avoidTopics: ['advanced leg locks', 'berimbolo', ...],
  emphasizeTopics: ['survival', 'escapes', 'relaxation', ...],
}
```

**What's missing:** The document that shows how to CONVERT this configuration INTO actual LLM prompts that generate insights.

---

## Conclusion

The TOMO project has exceptional product strategy documentation. The First Principles document is best-in-class. The belt personalization system design is comprehensive.

**However, the project is NOT ready for iOS handoff** because:

1. **No LLM prompt specifications** — Developers won't know what prompts to send
2. **No data payload specs** — Developers won't know what user data to include
3. **No example outputs** — Developers won't know what "correct" looks like
4. **No validation rules** — Developers can't ensure First Principles compliance

**Recommendation:** Create the `INSIGHTS_GENERATION_SPEC.md` document before handoff. This single document will bridge the gap between "what the AI should feel like" (which is documented) and "how to make the AI do that" (which is not).

---

*Document created: January 20, 2026*
*Next review: After INSIGHTS_GENERATION_SPEC.md is complete*
