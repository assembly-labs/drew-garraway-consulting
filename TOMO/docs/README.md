# TOMO - Internal Documentation Index

> **Purpose:** Central index for all internal strategy, research, and planning documents.

**Last Updated:** January 2025

---

## Quick Navigation

| I need to... | Go to... |
|--------------|----------|
| Understand the product philosophy | `FIRST_PRINCIPLES.md` |
| Learn how to use these docs | `CLAUDE.md` |
| Understand user personas | `personas/` |
| Check data/AI/visualization strategy | `data-and-ai/` |
| Review design system | `design-system/` |
| See research findings | `research/` |
| Understand BJJ curriculum | `domain-knowledge/` |
| Check brand voice | `brand/` |
| Review project status | `project/` |
| iOS deployment plans | `deployment/` |
| Investor/partner materials | `RFP/` |

---

## Folder Structure

```
docs/
├── FIRST_PRINCIPLES.md          # Non-negotiable product beliefs
├── CLAUDE.md                    # Guide for using this knowledge base
├── README.md                    # This file - master index
│
├── brand/                       # Voice, tone, philosophy
├── data-and-ai/                 # Data capture, AI strategy & visualization
├── deployment/                  # iOS TestFlight plans
├── design-reviews/              # Design iteration snapshots and feedback
├── design-system/               # Visual design tokens & components
├── development/                 # Development practices & standards
├── domain-knowledge/            # BJJ-specific reference material
├── personas/                    # User personas and psychology
├── product/                     # Features & UI strategy
├── project/                     # Project status, tasks & roadmaps
├── research/                    # Market, user & psychology research
└── RFP/                         # Investor/partner materials
```

---

## Folder Descriptions

### `brand/`
**Purpose:** Brand voice, tone, and communication philosophy.

Contains guidelines for how TOMO speaks to users, including the "Dedicated Training Partner" voice, writing style rules, and instructor influence patterns.

### `data-and-ai/`
**Purpose:** Data capture strategy, AI processing, and data visualization.

Everything related to how we collect data from exhausted users, process it with AI, and visualize it through charts and infographics. Includes the 90-second rule, voice conversation design, and infographic strategy.

### `deployment/`
**Purpose:** iOS TestFlight deployment plans and checklists.

Technical documentation for deploying to iOS, including TestFlight setup, EAS build configuration, and deployment checklists.

### `design-reviews/`
**Purpose:** Design iteration history and feedback records.

Snapshots of design decisions, UI feedback sessions, and iteration history. Useful for understanding why certain design choices were made.

### `design-system/`
**Purpose:** Visual design tokens, CSS components, and interactive previews.

The source of truth for all UI decisions: colors, typography, spacing, icons, and component styles. Includes interactive HTML browsers for exploring the system.

### `development/`
**Purpose:** Development practices and coding standards.

Best practices for development workflows, including agentic development patterns and coding conventions.

### `domain-knowledge/`
**Purpose:** BJJ-specific reference material.

Belt curriculum documentation, technique libraries, and BJJ terminology. Required context for building features that understand the sport.

### `personas/`
**Purpose:** User personas and psychological profiles.

Six detailed test personas representing different user archetypes. Used for testing personalization and understanding user motivations.

### `product/`
**Purpose:** Product features, architecture, and UI strategy.

High-level product decisions including the belt personalization system, stats module strategy, and feature specifications.

### `project/`
**Purpose:** Project status, task tracking, and roadmaps.

Project status, feature completion tracking, Linear issue tracking, test plans, sprint planning, and development roadmaps.

### `research/`
**Purpose:** Market research, competitive analysis, user studies, and sports psychology.

All research documents including market analysis, competitive landscape, user interviews, data requirements analysis, and sports psychology foundations (habit formation, motivation, training consistency).

### `RFP/`
**Purpose:** Investor and partner materials.

Request for Proposal documents, development contracts, and business-facing documentation.

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

### Foundation

| Document | Location | Status |
|----------|----------|--------|
| First Principles | `FIRST_PRINCIPLES.md` | Active |
| Knowledge Base Guide | `CLAUDE.md` | Active |

### Understanding Our Users

| Document | Location | Status |
|----------|----------|--------|
| Persona Profiles (6 test users) | `personas/PERSONA_PROFILES.md` | Active |
| User Research Synthesis | `research/USER_PERSONAS_AND_RESEARCH.md` | Active |
| Sports Psychology Research | `research/sports-psychology-research.md` | Active |

### Data & AI Strategy

| Document | Location | Status |
|----------|----------|--------|
| Journal Data Capture Strategy | `data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` | Active |
| Conversation Design Foundation | `data-and-ai/CONVERSATION_DESIGN_FOUNDATION.md` | Active |
| Voice Logging Conversation Design | `data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` | Active |
| Four Pillars Framework | `research/data-requirements-analysis.md` | Active |

### Design & UI

| Document | Location | Status |
|----------|----------|--------|
| Design Tokens | `design-system/tokens.md` | Active |
| UI Strategy | `product/UI_STRATEGY.md` | Active |
| Stats Module Strategy | `product/STATS_MODULE_STRATEGY.md` | Active |
| Infographic Strategy | `data-and-ai/INFOGRAPHIC_STRATEGY.md` | Active |

### Product

| Document | Location | Status |
|----------|----------|--------|
| Product Architecture | `product/PRODUCT_ARCHITECTURE_OVERVIEW.md` | Active |
| Belt Personalization System | `product/BELT_PERSONALIZATION_SYSTEM.md` | Active |
| Feature List | `product/BJJ_Progress_Tracker_Feature_List.md` | Active |

### BJJ Domain Knowledge

| Document | Location | Status |
|----------|----------|--------|
| Belt Curriculum Reference | `domain-knowledge/BJJ_BELT_CURRICULUM.md` | Active |
| Technique Library | `domain-knowledge/bjj-techniques/` | Active |

### Project Status

| Document | Location | Status |
|----------|----------|--------|
| Project Status | `project/PROJECT_STATUS.md` | Active |
| Feature Tracker | `project/FEATURE_TRACKER.md` | Active |
| Test Plan | `project/TEST_PLAN.md` | Active |

### Deployment

| Document | Location | Status |
|----------|----------|--------|
| iOS TestFlight Plan | `deployment/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md` | Active |
| iOS Deployment Checklist | `deployment/IOS_DEPLOYMENT_CHECKLIST.md` | Active |

### Business / RFP

| Document | Location | Status |
|----------|----------|--------|
| Complete RFP | `RFP/TOMO_RFP_Complete.md` | Active |
| RFP Lite | `RFP/TOMO_RFP_Lite.md` | Active |
| iOS Development RFP | `RFP/RFP_iOS_Development.md` | Active |
| Development Strategy Analysis | `RFP/DEVELOPMENT_STRATEGY_ANALYSIS.md` | Active |

---

## Cross-References

These documents reference each other frequently:

```
FIRST_PRINCIPLES.md
        ↓
        ↓ guides
        ↓
PERSONA_PROFILES.md
        ↓
        ↓ informs
        ↓
JOURNAL_DATA_CAPTURE_STRATEGY.md ←→ data-requirements-analysis.md
        ↓
        ↓ drives
        ↓
Belt Personalization System (prototype/src/config/belt-system/)
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

---

## Maintenance

When adding documents:

1. Add to appropriate folder
2. Update this README
3. Update `CLAUDE.md` if adding new folders
4. Link related documents
5. Set status (Active/Draft/TODO)
