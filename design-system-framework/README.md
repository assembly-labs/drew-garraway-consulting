# Design System Framework

A professional 0-to-1 product development framework for building software products with Claude Code.

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
| 02-UX | How does it work? | User flows, wireframes, content |
| 03-UI | How does it look? | Tokens, components, MAGENTA.md |
| 04-Development | How do we build it? | Code, Storybook, shipped product |

---

## Quick Start

### Starting a New Project

```bash
# 1. Copy the framework
cp -r design-system-framework my-new-project
cd my-new-project

# 2. Initialize git (optional)
git init

# 3. Start with Phase 01
# Open 01-concept/SOP.md and follow the process
```

### Working with Claude Code

1. **Read CLAUDE.md** first—it defines how AI collaboration works
2. **Follow each phase's SOP.md** step by step
3. **Pass phase gates** before moving on
4. **Reference upstream artifacts** as you go

---

## Framework Structure

```
design-system-framework/
├── README.md                 # This file
├── PROCESS.md                # Master playbook
├── CLAUDE.md                 # AI collaboration rules
│
├── 01-concept/               # Phase 1: Problem & scope
│   ├── SOP.md                # Standard operating procedure
│   ├── brief.md              # Product brief template
│   ├── competitive-analysis.md
│   ├── problem-framing.md
│   ├── risks-and-assumptions.md
│   └── research/             # User research artifacts
│
├── 02-ux/                    # Phase 2: Experience design
│   ├── SOP.md
│   ├── personas.md
│   ├── user-stories.md
│   ├── information-architecture.md
│   ├── content-strategy.md
│   ├── flows/                # User flow diagrams
│   └── wireframes/           # Structural layouts
│
├── 03-ui/                    # Phase 3: Visual design
│   ├── SOP.md
│   ├── MAGENTA.md            # Visual design source of truth
│   ├── tokens.json           # Design token definitions
│   ├── moodboard/            # Visual references
│   ├── components/           # Component specifications
│   └── motion/               # Animation documentation
│
└── 04-development/           # Phase 4: Implementation
    ├── SOP.md
    ├── code-review-checklist.md
    ├── testing-guide.md
    ├── packages/
    │   ├── tokens/           # Token system in code
    │   └── ui/               # Component library
    ├── storybook/            # Component documentation
    └── apps/
        └── web/              # Application code
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `PROCESS.md` | Master playbook with phase gates |
| `CLAUDE.md` | AI collaboration rules |
| `*/SOP.md` | Step-by-step process for each phase |
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

## Anti-Patterns to Avoid

- Jumping to code before UX is validated
- Using arbitrary colors/sizes instead of tokens
- Skipping Storybook documentation
- Over-engineering before shipping
- Generic AI aesthetic (excessive gradients, gratuitous animations)

---

## Getting Help

- **Process questions:** See `PROCESS.md`
- **AI collaboration:** See `CLAUDE.md`
- **Phase-specific help:** See each phase's `SOP.md`

---

## License

[Your license here]

---

*Build products with intention, not defaults.*
