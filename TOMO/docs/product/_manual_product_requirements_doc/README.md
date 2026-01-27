# Manual Product Requirements Documents

> **Purpose:** This folder contains detailed Product Requirements Documents (PRDs) for each major feature area in TOMO. These documents supplement the centralized `FEATURES.md` with deep-dive specifications.

---

## Document Hierarchy

```
/docs/product/
├── FEATURES.md                    ← SINGLE SOURCE OF TRUTH (feature inventory)
├── feature-inventory.html         ← Human-readable HTML version
├── BELT_INTEGRATION_SPEC.md       ← Per-page belt adaptation contracts
├── BELT_PERSONALIZATION_SYSTEM.md ← Belt psychology overview
│
└── _manual_product_requirements_doc/   ← YOU ARE HERE
    ├── README.md                  ← This file
    ├── TECH_DATA_AI_OVERVIEW.md   ← 10,000 ft tech/data/AI view
    ├── FLAWS.md                   ← Known issues across docs
    │
    ├── ONBOARDING_PRD.md          ← Onboarding flow spec
    ├── SESSION_LOGGER_PRD.md      ← Voice & text logging spec
    ├── JOURNAL_PRD.md             ← Session history spec
    ├── JOURNAL_HANDOFF_STATUS.md  ← Journal implementation status
    ├── INSIGHTS_PRD.md            ← AI training feedback spec
    ├── TECHNIQUES_PRD.md          ← Technique library spec
    ├── STATS_CURRENT_STATE_PRD.md ← Dashboard (implemented)
    ├── STATS_FUTURE_STATE_PRD.md  ← Dashboard (planned features)
    └── PROFILE_SETTINGS_PRD.md    ← Profile & settings spec
```

---

## How These Documents Relate

### FEATURES.md vs PRDs

| Document | Scope | Detail Level | Updates |
|----------|-------|--------------|---------|
| `FEATURES.md` | All 88 features across all pages | Summary (status, priority) | Frequently |
| PRDs (this folder) | Deep-dive on single page | Full specification | As needed |

**Rule:** If a feature exists, it MUST be listed in `FEATURES.md`. PRDs provide supplementary detail.

### When to Use Each

| Task | Use This Document |
|------|-------------------|
| "What features exist?" | `FEATURES.md` |
| "What's the status of feature X?" | `FEATURES.md` |
| "How exactly should feature X work?" | Relevant PRD |
| "What data does page Y need?" | Relevant PRD or `DATA_AND_AI_BY_PAGE.md` |
| "How does belt personalization affect page Y?" | `BELT_INTEGRATION_SPEC.md` |
| "What tech/AI powers our features?" | `TECH_DATA_AI_OVERVIEW.md` |

---

## Document Index

### Core PRDs (by Page)

| Document | Page | Status | Key Contents |
|----------|------|--------|--------------|
| **ONBOARDING_PRD.md** | Onboarding | Complete | 4-screen flow, progressive profiling setup |
| **SESSION_LOGGER_PRD.md** | Log Session | Complete | Voice/text modes, data extraction, review flow |
| **JOURNAL_PRD.md** | Journal (History) | Complete | Entry cards, filtering, infinite scroll (planned) |
| **INSIGHTS_PRD.md** | Insights (AI Feedback) | Complete | LLM prompts, insight types, validation rules |
| **TECHNIQUES_PRD.md** | Techniques | Complete | For You/Browse tabs, video library, recommendations |
| **STATS_CURRENT_STATE_PRD.md** | Stats (Dashboard) | Complete | 19 modules, belt visibility matrix |
| **STATS_FUTURE_STATE_PRD.md** | Stats (Dashboard) | Planned | Future modules, retention-focused redesign |
| **PROFILE_SETTINGS_PRD.md** | Profile & Settings | Complete | User data, preferences, demo mode |

### Meta Documents

| Document | Purpose |
|----------|---------|
| **TECH_DATA_AI_OVERVIEW.md** | 10,000 ft view of how tech/data/AI power features |
| **JOURNAL_HANDOFF_STATUS.md** | Implementation status tracker for Journal features |
| **FLAWS.md** | Known contradictions, duplicates, and issues |

---

## For Developers

### Quick Start

1. **Understand the product:** Read `FEATURES.md` first
2. **Understand the tech:** Read `TECH_DATA_AI_OVERVIEW.md`
3. **Working on a page:** Read the relevant PRD
4. **Implementing belt personalization:** Read `BELT_INTEGRATION_SPEC.md`

### Key Code Locations

| Concept | Code Location |
|---------|---------------|
| Belt personalization hook | `/prototype/src/hooks/useBeltPersonalization.ts` |
| Belt config files | `/prototype/src/config/belt-system/` |
| Page components | `/prototype/src/components/features/` |
| Stats modules | `/prototype/src/components/features/stats-modules/` |
| UI components | `/prototype/src/components/ui/` |

### Common Patterns

```typescript
// Belt-aware feature rendering
import { useBeltPersonalization } from '@/hooks';

const MyComponent = () => {
  const { profile, dashboard, chatbot, videoTutorials } = useBeltPersonalization();

  // profile.beltLevel: 'white' | 'blue' | 'purple' | 'brown' | 'black'
  // dashboard.primaryMetric: belt-specific primary stat
  // chatbot.toneProfile: AI tone configuration
  // videoTutorials.difficultyRange: content filtering
};
```

---

## For Product Managers

### Updating Documentation

1. **Feature changes:** Update `FEATURES.md` FIRST, then update relevant PRD
2. **New features:** Add to `FEATURES.md`, create PRD section if needed
3. **Status changes:** Update status in `FEATURES.md`

### Document Ownership

| Document | Owner | Review Cadence |
|----------|-------|----------------|
| FEATURES.md | Product | Weekly |
| PRDs | Product | As features change |
| TECH_DATA_AI_OVERVIEW.md | Engineering | Monthly |
| FLAWS.md | Product + Engineering | As issues found |

---

## For AI Coding Agents

### Before Writing Code

1. Read `/docs/FIRST_PRINCIPLES.md` (12 non-negotiable rules)
2. Read the PRD for the page you're working on
3. Read `BELT_INTEGRATION_SPEC.md` if belt personalization applies
4. Check `FLAWS.md` for known issues that may affect your work

### Implementation Checklist

- [ ] Feature is listed in `FEATURES.md`
- [ ] Belt personalization applied via `useBeltPersonalization()` hook
- [ ] Design follows `/docs/design-system/tokens.md`
- [ ] No emojis in UI
- [ ] Font weight 500+ only
- [ ] Touch targets 44px+ minimum

---

## Related Documentation

| Location | Contents |
|----------|----------|
| `/docs/FIRST_PRINCIPLES.md` | 12 non-negotiable product beliefs |
| `/docs/data-and-ai/` | Voice transcription, AI specs, data flows |
| `/docs/design-system/` | Colors, typography, spacing, components |
| `/docs/personas/` | 6 test user personas |
| `/docs/brand/` | Voice guidelines |

---

## Maintenance Notes

### Known Issues

See `FLAWS.md` for documented contradictions, duplicates, and inconsistencies.

### Sync Requirements

When updating PRDs:
1. Ensure `FEATURES.md` reflects any status changes
2. Update `TECH_DATA_AI_OVERVIEW.md` if tech approach changes
3. Regenerate `feature-inventory.html` if FEATURES.md changes

---

*Last updated: January 25, 2026*
