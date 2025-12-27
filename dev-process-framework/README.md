# Dev Process Framework

A complete development process framework for building products with Claude Code and small teams (1-3 people).

## What's Included

```
dev-process-framework/
├── README.md              # You are here
├── QUICKSTART.md          # 5-minute start guide
├── PROCESS.md             # Full 7-phase process
├── TEAM-WORKFLOW.md       # Git, PRs, collaboration
├── JUNIOR-DEV-GUIDE.md    # How juniors work with Claude Code
├── new-project.sh         # Project starter script
│
├── templates/
│   ├── PRD-TEMPLATE.md          # Product requirements
│   ├── HANDOFF-TEMPLATE.md      # Technical handoff
│   ├── CLAUDE-MD-TEMPLATE.md    # AI context file
│   └── TICKETS-TEMPLATE.md      # Development tickets
│
└── checklists/
    └── PHASE-GATES.md           # Phase transition checklists
```

## Quick Start

### Create a New Project

```bash
# From drew-garraway-consulting directory
./dev-process-framework/new-project.sh my-app-name

# With options
./dev-process-framework/new-project.sh my-app --path ~/Projects
./dev-process-framework/new-project.sh my-app --next    # With Next.js
./dev-process-framework/new-project.sh my-app --vite    # With Vite
```

### What Gets Created

```
my-app-name/
├── CLAUDE.md              # AI context (pre-filled)
├── README.md              # Project overview
├── .gitignore             # Comprehensive rules
├── .env.example           # Environment template
├── docs/                  # All documentation
│   ├── PRD.md
│   ├── PROCESS.md
│   ├── HANDOFF.md
│   ├── TICKETS.md
│   └── [phase folders]
├── prototype/             # Phase 4 code
└── src/                   # Phase 6 production code
```

## The 7-Phase Process

| Phase | Name | Key Output |
|-------|------|------------|
| 0 | Research & Discovery | Market/user research |
| 1 | Strategy & Ideation | PRD, feature list |
| 2 | Brand & Identity | Brand guidelines |
| 3 | Product Design | UX flows, wireframes |
| 4 | UI Design & Prototype | Code prototype |
| 5 | Technical Planning | Handoff doc, tickets |
| 6 | Development & Testing | Production code |
| 7 | Launch & Iterate | Live product |

**Key Principle**: Prototype first (Phase 4), then build production (Phase 6). Don't burn tokens on backend until prototype is validated.

## For Teams

- **1-3 people** typical team size
- **Code-first prototyping** (no Figma required)
- **Junior devs** use Claude Code with internal docs
- **Flexible phases** can overlap as needed
- **Markdown docs** live in repo

## Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | Get started in 5 minutes |
| [PROCESS.md](PROCESS.md) | Full process details |
| [TEAM-WORKFLOW.md](TEAM-WORKFLOW.md) | Git, PRs, collaboration |
| [JUNIOR-DEV-GUIDE.md](JUNIOR-DEV-GUIDE.md) | Working with Claude Code |
| [PHASE-GATES.md](checklists/PHASE-GATES.md) | Phase transition checklists |

## Philosophy

1. **Prototype first** - Validate before investing in backend
2. **CLAUDE.md is key** - AI context updated every phase
3. **Ticket-by-ticket** - Work one task at a time
4. **Junior-friendly** - Clear docs for AI-assisted development
5. **Flexible but structured** - Phases overlap, gates keep quality

## License

Internal use. Created for Drew Garraway Consulting.
