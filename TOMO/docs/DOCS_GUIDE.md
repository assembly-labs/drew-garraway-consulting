# TOMO Docs - Internal Knowledge Base Guide

> **This folder is internal IP.** Strategy, research, personas, and product thinking live here. Not for public disclosure.

---

## Purpose

This is the project brain for TOMO. Use it to:

- **Build features** - Read product specs, understand user psychology, check design system
- **Make decisions** - Reference First Principles before any product/design choice
- **Research** - Find market data, competitive analysis, sports psychology foundations
- **Plan** - GTM strategy, iOS deployment, RFP materials for investors/partners

---

## Start Here

| Before you... | Read this first |
|---------------|-----------------|
| Make any product decision | `FIRST_PRINCIPLES.md` |
| Build a user-facing feature | `personas/PERSONA_PROFILES.md` |
| Write UI copy or messaging | `brand/BRAND_VOICE_GUIDE.md` |
| Touch the design system | `design-system/tokens.md` |
| Work on voice logging | `data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` |

---

## Folder Structure

```
docs/
├── FIRST_PRINCIPLES.md      # Non-negotiable beliefs (READ FIRST)
├── DOCS_GUIDE.md                # This file
├── README.md                # Document index
│
├── brand/                   # Voice, tone, messaging
│   ├── BRAND_VOICE_GUIDE.md
│   └── instructor-influence-matrix.md
│
├── data-and-ai/             # Voice capture, data strategy & visualization
│   ├── JOURNAL_DATA_CAPTURE_STRATEGY.md
│   ├── CONVERSATION_DESIGN_FOUNDATION.md
│   ├── VOICE_LOGGING_CONVERSATION_DESIGN.md
│   ├── INFOGRAPHIC_STRATEGY.md
│   └── index.html           # Infographic preview
│
├── deployment/              # iOS TestFlight plans
│   ├── IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md
│   └── IOS_DEPLOYMENT_CHECKLIST.md
│
├── design-system/           # Visual design tokens & components
│   ├── tokens.md            # Colors, typography, spacing
│   ├── styles.css           # Production CSS
│   ├── index.html           # Interactive browser
│   ├── icons.html           # Icon library
│   └── typography.html      # Font specimens
│
├── domain-knowledge/        # BJJ-specific reference
│   ├── BJJ_BELT_CURRICULUM.md
│   └── bjj-techniques/      # Technique data
│
├── personas/                # User psychology & test profiles
│   └── PERSONA_PROFILES.md  # 6 detailed personas
│
├── product/                 # Feature specs & strategy
│   ├── PRODUCT_ARCHITECTURE_OVERVIEW.md
│   ├── BELT_PERSONALIZATION_SYSTEM.md
│   ├── UI_STRATEGY.md
│   ├── STATS_MODULE_STRATEGY.md
│   └── BJJ_Progress_Tracker_Feature_List.md
│
├── project/                 # Status, tasks & planning
│   ├── PROJECT_STATUS.md
│   ├── FEATURE_TRACKER.md
│   ├── ROADMAP.md
│   ├── LINEAR_TASKS.md
│   ├── PRODUCT_REVIEW_AND_LAUNCH_ROADMAP.html
│   └── TEST_PLAN.md
│
├── research/                # Market, user & psychology research
│   ├── USER_PERSONAS_AND_RESEARCH.md
│   ├── competitive-analysis.md
│   ├── data-requirements-analysis.md
│   ├── market-research-go-decision.md
│   ├── sports-psychology-research.md
│   └── sources-bibliography.md
│
├── RFP/                     # Investor/partner materials
│   ├── TOMO_RFP_Complete.md
│   ├── TOMO_RFP_Lite.md
│   ├── RFP_iOS_Development.md
│   └── CONTRACT_iOS_Development_DRAFT.md
│
└── development/             # Dev practices
    └── AGENTIC-DEVELOPMENT-BEST-PRACTICES.md
```

---

## How Docs Relate to Code

```
docs/                           →  prototype/src/
─────────────────────────────────────────────────────
FIRST_PRINCIPLES.md             →  All decisions
personas/PERSONA_PROFILES.md    →  Belt personalization system
design-system/tokens.md         →  index.css, design-tokens.ts
brand/BRAND_VOICE_GUIDE.md      →  All user-facing copy
product/BELT_PERSONALIZATION_SYSTEM.md → config/belt-system/
data-and-ai/VOICE_LOGGING_*.md  →  VoiceFirstLogger.tsx
```

**The relationship:** Docs define *what* and *why*. Code implements *how*.

---

## Task-Specific Guides

### Building a New Feature

1. Read `FIRST_PRINCIPLES.md` - Does this feature align?
2. Read `personas/PERSONA_PROFILES.md` - Who is this for? What state are they in?
3. Read `product/UI_STRATEGY.md` - How does this fit the product architecture?
4. Check `design-system/tokens.md` - Use existing patterns
5. Build in `prototype/src/`

### Writing Copy or Messaging

1. Read `brand/BRAND_VOICE_GUIDE.md` - Tone, vocabulary, anti-patterns
2. Read `FIRST_PRINCIPLES.md` #9 (Specificity Over Encouragement)
3. Check persona belt level - messaging adapts to psychology

### Updating the Design System

1. Update `design-system/tokens.md` first (source of truth)
2. Update `design-system/styles.css`
3. Sync to `prototype/src/index.css`
4. Update `prototype/src/config/design-tokens.ts` if tokens changed

### Research & Ideation

1. Check `research/` for existing data before new research (includes sports psychology)
2. Add new research to appropriate folder with clear naming
3. Update this DOCS_GUIDE.md if adding new folders

---

## Document Conventions

| Type | Naming | Example |
|------|--------|---------|
| Strategy/spec docs | `SCREAMING_SNAKE_CASE.md` | `FIRST_PRINCIPLES.md` |
| Research docs | `kebab-case.md` | `competitive-analysis.md` |
| Folders | `kebab-case` | `design-system/` |

---

## What NOT to Put Here

- Code (goes in `prototype/`)
- Node modules or dependencies
- Generated files
- Temporary notes (use Linear or delete after use)

---

## Maintenance

When adding documents:
1. Put in the appropriate folder
2. Follow naming conventions
3. Update `README.md` index
4. Update this file if adding new folders or major docs

---

*Last updated: January 2025*
