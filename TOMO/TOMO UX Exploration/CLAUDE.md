# TOMO UX Exploration Workspace

This is the centralized workspace for UX design exploration, prototyping, and feature documentation for TOMO.

---

## Purpose

This folder manages the complete lifecycle from feature idea to development task:

1. **Design** - UX specialist creates HTML prototypes
2. **Review** - You review prototypes in browser
3. **Approve** - Approved designs move to `prototypes/approved/`
4. **Document** - Docs bot writes comprehensive documentation
5. **Queue** - Features added to development backlog

---

## Folder Structure

```
TOMO UX Exploration/
├── CLAUDE.md                    # You are here
├── agents/
│   ├── ux-designer.md           # UX specialist subagent
│   └── docs-writer.md           # Documentation bot subagent
├── prototypes/
│   ├── in-review/               # Current designs for review
│   └── approved/                # Approved designs
├── documentation/
│   ├── feature-specs/           # Product specifications
│   ├── user-guides/             # End-user documentation
│   └── technical/               # Developer documentation
└── development-tasks/
    ├── backlog.md               # Features ready for development
    └── completed.md             # Implemented features
```

---

## How to Use the Subagents

### UX Designer

Invoke when you want to design a new feature:

```
Design a [feature name] that [description of what it does]
```

The UX designer will:
1. Read TOMO's design system and first principles
2. Research existing patterns in the prototype
3. Create a standalone HTML file in `prototypes/in-review/`
4. Ask for your feedback

### Docs Writer

Invoke after approving a design:

```
Approved! [or] LGTM
```

The docs writer will:
1. Move the prototype to `prototypes/approved/`
2. Write feature spec, user guide, and technical doc
3. Add the feature to `development-tasks/backlog.md`

---

## Design Rules (Quick Reference)

From `/docs/design-system/tokens.md` and `/docs/FIRST_PRINCIPLES.md`:

### Visual Design

| Rule | Value |
|------|-------|
| Background | `#111111` (dark) |
| Accent | `#F5A623` (gold) |
| Positive | `#22c55e` (green) |
| Negative | `#ef4444` (red) |
| Headlines | Unbounded, 700-800 weight |
| Body | Inter, 500 weight (minimum) |
| Labels | JetBrains Mono, 500-600 weight |
| Min font size | 12px |
| Touch targets | 56-80px primary, 44px minimum |

### Non-Negotiable Principles

1. **NO EMOJIS** - SVG icons only
2. **Reflection is the foundation** - Every feature should facilitate reflection
3. **90-second window** - Session logging must be ultra-fast
4. **Process over outcome** - Focus on training quality, not belt promotions
5. **Belt psychology matters** - Adapt to white/blue/purple/brown differently
6. **No gamification** - No streaks, achievements, or "level up" language
7. **Amplify coaches, never replace** - We're the training partner, not the instructor

### Two User States

| Context | State | Design |
|---------|-------|--------|
| Session Logging | EXHAUSTED | 90 sec max, voice-first, huge targets, skip always available |
| Everything Else | RELAXED | Rich data OK, exploration encouraged, standard UX |

---

## File Naming Conventions

### Prototypes
```
YYYY-MM-DD-feature-name.html
```
Example: `2026-02-08-training-partners.html`

### Documentation
```
feature-specs/FEATURE_NAME.md
user-guides/guide-feature-name.md
technical/tech-feature-name.md
```

---

## Key Documentation References

When designing, ALWAYS reference these files:

| Document | Path | Purpose |
|----------|------|---------|
| Design Tokens | `/docs/design-system/tokens.md` | Authoritative color, typography, spacing |
| First Principles | `/docs/FIRST_PRINCIPLES.md` | Product beliefs that don't change |
| Personas | `/docs/personas/PERSONA_PROFILES.md` | 6 user profiles with psychology |
| Belt System | `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` | Belt-specific adaptations |
| Brand Voice | `/docs/brand/BRAND_VOICE_GUIDE.md` | How TOMO speaks |
| Main Context | `/CLAUDE.md` | Full project context |

---

## PRDs Available for Design

Located in `/docs/product/_manual_product_requirements_doc/`:

- `ONBOARDING_PRD.md` - First-time user experience
- `SESSION_LOGGER_PRD.md` - Voice/text session capture
- `STATS_CURRENT_STATE_PRD.md` - Current dashboard metrics
- `STATS_FUTURE_STATE_PRD.md` - Future dashboard vision
- `TECHNIQUES_PRD.md` - Technique library
- `JOURNAL_PRD.md` - Training history
- `INSIGHTS_PRD.md` - AI-powered insights
- `PROFILE_SETTINGS_PRD.md` - User profile and preferences

Also see:
- `/docs/project/FUTURE_FEATURES.md` - Planned features
- `/docs/project/FEATURE_TRACKER.md` - Implementation status

---

## Workflow Diagram

```
Request Feature
       │
       ▼
┌──────────────────┐
│   UX Designer    │ Creates HTML prototype
│   (ux-designer)  │ → prototypes/in-review/
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Browser Review  │ Open HTML, review on mobile viewport
└──────────────────┘
       │
       ├── Feedback → Revise → Loop back
       │
       ▼
┌──────────────────┐
│    Approved!     │ Move to prototypes/approved/
└──────────────────┘
       │
       ▼
┌──────────────────┐
│   Docs Writer    │ Creates 3 docs + backlog entry
│   (docs-writer)  │ → documentation/ + development-tasks/
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Ready for Dev    │ Pick from backlog.md
└──────────────────┘
```

---

## Getting Started

1. Review the PRDs in `/docs/product/_manual_product_requirements_doc/`
2. Pick a feature to design
3. Ask Claude to design it using the UX designer
4. Review the HTML prototype in your browser
5. Approve or request changes
6. Once approved, docs are auto-generated
7. Feature is queued in `development-tasks/backlog.md`

---

*Created: 2026-02-08*
