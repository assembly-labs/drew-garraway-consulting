# Design System Framework

A professional 0-to-1 product development framework for building software products with Claude Code.

---

## Start Here

**New to this framework?** Read **[QUICKSTART.md](QUICKSTART.md)** first.

It will walk you through setup and your first session.

---

## What This Is

This framework provides a complete, repeatable process for taking software products from idea to shipped code. It's designed for human-AI collaboration, with clear SOPs, templates, and quality gates at each phase.

**This is not a design system.** This is a framework for *creating* design systems and products.

---

## The Process

```
IDEA → 01-CONCEPT → 02-UX → 03-UI → 04-DEVELOPMENT → PRODUCT
         │            │         │            │
         ▼            ▼         ▼            ▼
      Problem      Experience  Visual     Working
      Definition   Blueprint   System     Product
```

| Phase | Question | Outcome |
|-------|----------|---------|
| 01-Concept | Should we build this? | Validated problem, defined scope |
| 02-UX | How does it work? | Brand voice, user flows, wireframes, content |
| 03-UI | How does it look? | Tokens, components, MAGENTA.md |
| 04-Development | How do we build it? | Code, Storybook, shipped product |

---

## Framework Structure

```
design-system-framework/
├── QUICKSTART.md             ← START HERE
├── README.md                 # This file
├── PROCESS.md                # Master playbook
├── CLAUDE.md                 # AI collaboration rules
│
├── 01-concept/               # Phase 1: Problem & scope
│   ├── SOP.md
│   ├── brief.md
│   ├── competitive-analysis.md
│   ├── problem-framing.md
│   ├── risks-and-assumptions.md
│   └── research/
│
├── 02-ux/                    # Phase 2: Experience design
│   ├── SOP.md
│   ├── brand-voice-worksheet.md  ← Light or Comprehensive
│   ├── brand-voice-matrix.md
│   ├── personas.md
│   ├── user-stories.md
│   ├── information-architecture.md
│   ├── content-strategy.md
│   ├── flows/
│   └── wireframes/
│
├── 03-ui/                    # Phase 3: Visual design
│   ├── SOP.md
│   ├── MAGENTA.md
│   ├── tokens.json
│   ├── moodboard/
│   ├── components/
│   └── motion/
│
└── 04-development/           # Phase 4: Implementation
    ├── SOP.md
    ├── code-review-checklist.md
    ├── testing-guide.md
    ├── packages/
    │   ├── tokens/
    │   └── ui/
    ├── storybook/
    └── apps/
        └── web/
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| **[QUICKSTART.md](QUICKSTART.md)** | How to use this framework (start here) |
| `PROCESS.md` | Master playbook with phase gates |
| `CLAUDE.md` | AI collaboration rules |
| `*/SOP.md` | Step-by-step process for each phase |
| `02-ux/brand-voice-matrix.md` | Voice source of truth |
| `03-ui/MAGENTA.md` | Visual design source of truth |
| `03-ui/tokens.json` | Design token definitions |

---

## Principles

1. **Never skip phases.** Each phase de-risks the next.
2. **Tokens, not magic numbers.** Every visual value is a token.
3. **Options, then decisions.** Human approves, AI proposes.
4. **Artifacts > discussions.** Make it real to make it better.
5. **Done > perfect.** Ship, then iterate.

---

## Next Step

**[Read QUICKSTART.md →](QUICKSTART.md)**

---

*Build products with intention, not defaults.*
