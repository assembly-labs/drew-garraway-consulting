# BJJ Journal - Internal Documentation

> **Purpose:** Central index for all internal strategy, research, and planning documents.

**Last Updated:** December 2024

---

## Quick Navigation

| I need to... | Go to... |
|--------------|----------|
| Understand user personas | `/personas/` |
| Check data/AI strategy | `/data-and-ai/` |
| Review design system | `/design-system/` |
| See research findings | `/research/` |
| Understand BJJ curriculum | `/domain-knowledge/` |
| Check brand voice | `/brand/` |
| Review project status | `/project/` |

---

## Folder Structure

```
internal-docs/
├── README.md                    # This file - master index
│
├── personas/                    # User personas and psychology
│   ├── PERSONA_PROFILES.md      # 6 detailed test personas
│   └── README.md
│
├── data-and-ai/                 # Data capture & AI strategy
│   ├── JOURNAL_DATA_CAPTURE_STRATEGY.md
│   ├── CONVERSATION_DESIGN_FOUNDATION.md
│   ├── VOICE_LOGGING_CONVERSATION_DESIGN.md
│   ├── AI_EXTRACTION_SPEC.md         (TODO)
│   ├── VOICE_TRANSCRIPTION_SPEC.md   (TODO)
│   └── README.md
│
├── research/                    # Market & user research
│   ├── USER_PERSONAS_AND_RESEARCH.md  # Persona + research synthesis
│   ├── competitive-analysis.md        # Competitor landscape
│   ├── data-requirements-analysis.md  # Four pillars framework
│   ├── journaling-and-accountability-research.md
│   ├── sources-bibliography.md
│   └── README.md
│
├── design-system/               # Visual design tokens & components
│   ├── tokens.md                # Color, typography, spacing
│   ├── styles.css               # Production CSS
│   ├── index.html               # Interactive browser
│   └── README.md
│
├── brand/                       # Voice, tone, philosophy
│   ├── BRAND_VOICE_GUIDE.md
│   ├── instructor-influence-matrix.md
│   └── README.md
│
├── domain-knowledge/            # BJJ-specific reference
│   ├── BJJ_BELT_CURRICULUM.md   # Techniques by belt
│   ├── bjj-techniques/          # Technique library data
│   └── README.md
│
├── product/                     # Features & UI strategy
│   ├── UI_STRATEGY.md
│   ├── STATS_MODULE_STRATEGY.md
│   ├── STATS_MODULE_IMPLEMENTATION.md
│   └── README.md
│
└── project/                     # Project management
    ├── PROJECT_STATUS.md
    ├── FEATURE_TRACKER.md
    ├── IOS_DEPLOYMENT_CHECKLIST.md
    ├── IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md
    └── README.md
```

---

## Document Status Key

| Status | Meaning |
|--------|---------|
| **Active** | Current, maintained, source of truth |
| **Draft** | In progress, not yet authoritative |
| **TODO** | Placeholder, needs creation |
| **Deprecated** | Outdated, kept for reference only |

---

## Key Documents by Topic

### Understanding Our Users

| Document | Location | Status |
|----------|----------|--------|
| Persona Profiles (6 test users) | `/personas/PERSONA_PROFILES.md` | Active |
| User Research Synthesis | `/research/USER_PERSONAS_AND_RESEARCH.md` | Active |
| Exhausted User State | `/research/USER_PERSONAS_AND_RESEARCH.md#the-exhausted-user` | Active |

### Data & AI Strategy

| Document | Location | Status |
|----------|----------|--------|
| Journal Data Capture Strategy | `/data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` | Active |
| Conversation Design Foundation | `/data-and-ai/CONVERSATION_DESIGN_FOUNDATION.md` | Active |
| Voice Logging Conversation Design | `/data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` | Active |
| Four Pillars Framework | `/research/data-requirements-analysis.md` | Active |
| AI Extraction Spec | `/data-and-ai/AI_EXTRACTION_SPEC.md` | TODO |

### Design & UI

| Document | Location | Status |
|----------|----------|--------|
| Design Tokens | `/design-system/tokens.md` | Active |
| UI Strategy | `/product/UI_STRATEGY.md` | Active |
| Stats Module Strategy | `/product/STATS_MODULE_STRATEGY.md` | Active |

### BJJ Domain Knowledge

| Document | Location | Status |
|----------|----------|--------|
| Belt Curriculum Reference | `/domain-knowledge/BJJ_BELT_CURRICULUM.md` | Active |
| Technique Library | `/domain-knowledge/bjj-techniques/` | Active |

### Project Status

| Document | Location | Status |
|----------|----------|--------|
| Project Status | `/project/PROJECT_STATUS.md` | Active |
| Feature Tracker | `/project/FEATURE_TRACKER.md` | Active |
| iOS Deployment | `/project/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md` | Active |

---

## Cross-References

These documents reference each other frequently:

```
PERSONA_PROFILES.md
        ↓
        ↓ informs
        ↓
JOURNAL_DATA_CAPTURE_STRATEGY.md ←→ data-requirements-analysis.md
        ↓
        ↓ drives
        ↓
Belt Personalization System (/prototype/src/config/belt-system/)
        ↓
        ↓ renders
        ↓
Dashboard Stats, Voice Logger, Chatbot
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Strategy docs | `SCREAMING_SNAKE_CASE.md` | `JOURNAL_DATA_CAPTURE_STRATEGY.md` |
| Research docs | `kebab-case.md` | `competitive-analysis.md` |
| Folders | `kebab-case` | `data-and-ai/` |
| Legacy (don't create new) | Mixed | `BJJ_Belt_Curriculum_Reference.md` |

---

## Maintenance

When adding documents:

1. Add to appropriate folder
2. Update this README
3. Add to folder's README
4. Link related documents
5. Set status (Active/Draft/TODO)
