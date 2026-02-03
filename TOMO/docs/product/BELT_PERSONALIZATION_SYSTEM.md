# Belt Personalization System - LEVERAGE THIS

> **IMPORTANT**: This system was built on Dec 27, 2024 based on comprehensive practitioner journey research. It should be used to enhance ALL user-facing features.

## What Was Built

A complete belt-aware personalization engine at `/prototype/src/config/belt-system/` that adapts app behavior based on user's belt level, training history, and journal content.

## Priority Integration Points

### 1. Chatbot/AI Responses
**Location**: `config/belt-system/feature-adaptations.ts` → `chatbotAdaptation`

Use this to personalize AI responses:
- **Tone** - Supportive for white belts, peer-level for brown/black
- **Vocabulary** - Basic → Expert based on belt
- **Topics to emphasize** - Survival skills (white) → Systems thinking (purple) → Legacy (brown)
- **Topics to avoid** - Don't discuss advanced leg locks with white belts

```typescript
const { chatbot } = useBeltPersonalization();
// chatbot.toneProfile, chatbot.technicalVocabulary, chatbot.emphasizeTopics
```

### 2. Video/Instructional Suggestions
**Location**: `config/belt-system/feature-adaptations.ts` → `videoTutorialAdaptation`

Use this to recommend appropriate content:
- **Categories** - Escapes for white, guard systems for blue, advanced concepts for purple+
- **Difficulty range** - 1-3 for white, 4-8 for purple, 7-10 for brown/black
- **Defense priority** - White belts need defense-first content

```typescript
const { videoTutorials } = useBeltPersonalization();
// videoTutorials.recommendedCategories, videoTutorials.difficultyRange
```

### 3. Dashboard Personalization
**Location**: `config/belt-system/feature-adaptations.ts` → `dashboardAdaptation`

Customize what metrics and insights users see:
- **Primary metric** - Streak for white, technique variety for blue, teaching for brown
- **Celebration thresholds** - Every 10 sessions (white) → Every 100 (brown)
- **Insight focus** - Survival → Game development → Systems → Refinement

### 4. Session Logger Messages
**Location**: `config/belt-system/feature-adaptations.ts` → `sessionLoggerAdaptation`

Belt-appropriate prompts and post-session messages:
- Encouraging tone for white belts, analytical for purple+
- Different suggested prompts per belt level

### 5. Risk Detection & Interventions
**Location**: `config/belt-system/risk-signals.ts`

> **Risk Signals:** See [TECH_DATA_AI_OVERVIEW.md](./_manual_product_requirements_doc/TECH_DATA_AI_OVERVIEW.md) for canonical risk signal definitions, thresholds, and belt-specific risk modifiers. The code at `/prototype/src/config/belt-system/risk-signals.ts` is the source of truth for implementation.

Proactively detect dropout risk:
- Attendance decline, extended gaps, negative sentiment
- Belt-specific risk modifiers (white/blue have higher risk)
- Intervention messages tailored to each belt's psychology

### 6. Journal Analysis
**Location**: `config/belt-system/journal-patterns.ts`

Analyze journal text for insights:
- Detect "got smashed" moments → provide belt-appropriate encouragement
- Identify breakthroughs → celebrate appropriately
- Flag injury mentions → suggest recovery guidance

## Quick Start for Next Session

```typescript
import { useBeltPersonalization } from '@/hooks';

function MyComponent() {
  const {
    profile,        // Psychology profile for user's belt
    dashboard,      // Dashboard adaptations
    sessionLogger,  // Session logger adaptations
    chatbot,        // AI/chatbot adaptations
    videoTutorials, // Video recommendation settings
    isInRiskWindow, // Is user at dropout risk?
    analyzeJournal, // Analyze journal text
  } = useBeltPersonalization();

  // Use these to personalize everything
}
```

## Research Foundation

This system is based on `/internal-docs/dev/research-practioner-journey.md` which documents:
- 70-90% white belt dropout rate (peak at 3-6 months)
- 50% blue belt dropout rate (first year post-promotion)
- Psychological stages at each belt
- Motivation evolution from external → intrinsic
- Common struggles and breakthrough triggers

## Files Created

```
prototype/src/config/belt-system/
├── index.ts              # Central exports
├── types.ts              # Type definitions
├── belt-profiles.ts      # Psychology profiles per belt
├── feature-adaptations.ts # Feature behavior configs
├── risk-signals.ts       # Dropout detection
└── journal-patterns.ts   # Text analysis patterns

prototype/src/hooks/
├── index.ts              # Hook exports
└── useBeltPersonalization.ts  # React hook
```

## Next Actions

When we resume coding:
1. [ ] Integrate `useBeltPersonalization()` into Dashboard component
2. [ ] Add chatbot adaptation to any AI/response generation
3. [ ] Use video adaptations for technique recommendations
4. [ ] Implement risk detection in session tracking
5. [ ] Add journal analysis after session logging

---

*This system transforms static features into personalized experiences that meet practitioners where they are in their journey.*
