# Development Process: 0 to 1

A flexible, phase-based process for building products with Claude Code and a small team.

## Team Structure

- **Designer**: Brand, UX, visual direction
- **Dev Lead** (optional): Architecture, code review, technical decisions
- **Junior Devs**: Build with Claude Code using internal docs
- **Everyone**: Uses Claude Code as a development partner

## Process Overview

```
Phase 0: Research ──────────────────────────────────────────────┐
    ↓                                                           │
Phase 1: Strategy & Ideation                                    │
    ↓                                                           │
Phase 2: Brand & Identity                                       │
    ↓                                                           │
Phase 3: Product Design (UX/Flows)                              │ Flexible:
    ↓                                                           │ Phases can
Phase 4: UI Design & Code Prototype                             │ overlap
    ↓                                                           │
Phase 5: Technical Planning (Handoff)                           │
    ↓                                                           │
Phase 6: Development & Testing                                  │
    ↓                                                           │
Phase 7: Launch & Iterate ──────────────────────────────────────┘

GTM Track: Runs parallel from Phase 2 onward
```

## Phase Details

### Phase 0: Research & Discovery

**Goal**: Understand the problem, market, and users.

**Activities**:
- Market research
- Competitor analysis
- User interviews/surveys
- Problem validation

**Outputs**:
- `docs/research/MARKET-ANALYSIS.md`
- `docs/research/COMPETITOR-ANALYSIS.md`
- `docs/research/USER-RESEARCH.md`
- `docs/research/PROBLEM-STATEMENT.md`

**Gate Question**: Is this a real problem worth solving?

**Claude Code Role**: Analyze data, summarize findings, draft competitor comparisons.

---

### Phase 1: Strategy & Ideation

**Goal**: Define what we're building and why.

**Activities**:
- Vision and mission definition
- Value proposition
- Target audience
- Success metrics
- Feature brainstorming

**Outputs**:
- `docs/strategy/VISION.md`
- `docs/strategy/VALUE-PROP.md`
- `docs/strategy/TARGET-AUDIENCE.md`
- `docs/strategy/SUCCESS-METRICS.md`
- `docs/PRD.md` (Product Requirements Document)

**Gate Question**: Is the solution viable and differentiated?

**Claude Code Role**: Help articulate vision, challenge assumptions, draft PRD.

---

### Phase 2: Brand & Identity

**Goal**: Establish brand voice, visual identity, design foundations.

**Activities**:
- Brand voice and tone
- Color palette, typography
- Logo concepts
- Design tokens/variables
- Content guidelines

**Outputs**:
- `docs/brand/BRAND-VOICE.md`
- `docs/brand/VISUAL-IDENTITY.md`
- `src/styles/design-tokens.css` (or Tailwind config)

**Gate Question**: Is the brand cohesive and differentiated?

**Claude Code Role**: Generate copy variations, document guidelines, create CSS variables.

---

### Phase 3: Product Design (UX/Flows)

**Goal**: Define user journeys and information architecture.

**Activities**:
- User flow mapping
- Information architecture
- Wireframe descriptions
- Feature prioritization

**Outputs**:
- `docs/design/USER-FLOWS.md`
- `docs/design/INFORMATION-ARCHITECTURE.md`
- `docs/design/WIREFRAMES.md` (text descriptions or ASCII)
- `docs/FEATURE-LIST.md` (prioritized)

**Gate Question**: Do the flows make sense for target users?

**Claude Code Role**: Document flows, create text wireframes, organize IA.

---

### Phase 4: UI Design & Code Prototype

**Goal**: Build clickable, visual prototype in code.

**Activities**:
- Component design (in code)
- Page layouts (in code)
- Mock data setup
- Interactive prototype
- Internal testing

**Outputs**:
- `/prototype/` folder with working code
- `prototype/src/mocks/` - all mock data
- `prototype/CLAUDE.md` - prototype-specific context
- Clickable prototype on staging URL

**Gate Question**: Does the prototype validate the concept with users?

**Claude Code Role**: Build all prototype code, components, mock data.

**Important**: This is CODE-FIRST. No Figma. Build directly in React/HTML.

---

### Phase 5: Technical Planning (Handoff)

**Goal**: Plan production architecture, create development tickets.

**Activities**:
- Tech stack decisions
- Database schema design
- API contract definition
- Development ticket creation
- Handoff document

**Outputs**:
- `docs/technical/ARCHITECTURE.md`
- `docs/technical/DATABASE-SCHEMA.md`
- `docs/technical/API-SPEC.md`
- `docs/HANDOFF.md`
- `docs/TICKETS.md` (numbered development tickets)

**Gate Question**: Is the technical plan clear enough for any developer + Claude Code to execute?

**Claude Code Role**: Draft schemas, API specs, create tickets, write handoff doc.

---

### Phase 6: Development & Testing

**Goal**: Build production application.

**Activities**:
- Project setup
- Core feature development
- API implementation
- Testing
- Code review

**Outputs**:
- Production codebase in `/src/` (or `/app/`)
- `CLAUDE.md` updated for production context
- Passing test suite
- Deployed staging environment

**Gate Question**: Does the MVP work correctly with real data?

**Claude Code Role**: Write all code, tests, documentation. Primary builder.

**Workflow**:
1. Work ticket-by-ticket (from TICKETS.md)
2. Each ticket = one PR
3. PR requires review before merge
4. Update CLAUDE.md as patterns emerge

---

### Phase 7: Launch & Iterate

**Goal**: Ship to users, gather feedback, iterate.

**Activities**:
- Production deployment
- Monitoring setup
- GTM execution
- User feedback collection
- Iteration planning

**Outputs**:
- Live production URL
- Monitoring dashboards
- `docs/CHANGELOG.md`
- `docs/ITERATION-BACKLOG.md`

**Gate Question**: Are metrics trending in the right direction?

**Claude Code Role**: Deployment scripts, monitoring setup, bug fixes, iterations.

---

## GTM Track (Parallel)

Runs alongside Phases 2-7:

| During Phase | GTM Activity |
|--------------|--------------|
| Phase 2 (Brand) | GTM strategy draft |
| Phase 3-4 (Design) | Landing page copy, waitlist |
| Phase 5-6 (Dev) | Launch prep, content creation |
| Phase 7 (Launch) | Execute GTM plan |

**Outputs**:
- `docs/gtm/GTM-STRATEGY.md`
- `docs/gtm/LAUNCH-PLAN.md`
- `docs/gtm/CONTENT-CALENDAR.md`

---

## Folder Structure

```
project/
├── CLAUDE.md                 # AI context (updated each phase)
├── README.md                 # Project overview
├── package.json
│
├── docs/
│   ├── PROCESS.md            # This document
│   ├── PRD.md                # Product requirements
│   ├── FEATURE-LIST.md       # Prioritized features
│   ├── HANDOFF.md            # Technical handoff
│   ├── TICKETS.md            # Development tickets
│   ├── CHANGELOG.md          # Version history
│   │
│   ├── research/
│   │   ├── MARKET-ANALYSIS.md
│   │   ├── COMPETITOR-ANALYSIS.md
│   │   └── USER-RESEARCH.md
│   │
│   ├── strategy/
│   │   ├── VISION.md
│   │   ├── VALUE-PROP.md
│   │   └── SUCCESS-METRICS.md
│   │
│   ├── brand/
│   │   ├── BRAND-VOICE.md
│   │   └── VISUAL-IDENTITY.md
│   │
│   ├── design/
│   │   ├── USER-FLOWS.md
│   │   ├── WIREFRAMES.md
│   │   └── INFORMATION-ARCHITECTURE.md
│   │
│   ├── technical/
│   │   ├── ARCHITECTURE.md
│   │   ├── DATABASE-SCHEMA.md
│   │   └── API-SPEC.md
│   │
│   └── gtm/
│       ├── GTM-STRATEGY.md
│       └── LAUNCH-PLAN.md
│
├── prototype/                # Phase 4 output
│   ├── CLAUDE.md
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── mocks/
│   └── package.json
│
└── src/                      # Phase 6 production code
    ├── components/
    ├── pages/
    ├── lib/
    └── api/
```

---

## Working with Claude Code

### Every Team Member Should:

1. **Read CLAUDE.md first** - Understand current context
2. **Reference existing patterns** - "Build it like UserCard.tsx"
3. **Work in tickets** - One ticket = one focused task
4. **Update docs** - If you learn something, document it

### Prompting Patterns:

**Starting a task:**
```
I'm working on Ticket 3: User Authentication

Context:
- Handoff doc: docs/HANDOFF.md
- Database schema: docs/technical/DATABASE-SCHEMA.md
- Prototype reference: prototype/src/pages/Login.tsx

Please implement the login API endpoint following our patterns.
```

**Referencing prototype:**
```
Build the production Dashboard page.

Reference: prototype/src/pages/Dashboard.tsx

Changes needed:
- Replace mock data with real API calls
- Add loading states
- Add error handling
```

---

## Phase Transitions

Before moving to the next phase:

1. [ ] All phase outputs complete
2. [ ] Gate question answered "yes"
3. [ ] CLAUDE.md updated with new context
4. [ ] Team aligned on next phase priorities

See `docs/checklists/PHASE-GATES.md` for detailed checklists.

---

## Quick Reference

| Phase | Key Output | Claude Code's Job |
|-------|------------|-------------------|
| 0 | Research docs | Analyze, summarize |
| 1 | PRD | Draft, refine |
| 2 | Brand guidelines | Generate copy, CSS |
| 3 | User flows | Document, organize |
| 4 | Code prototype | Build everything |
| 5 | Technical spec | Schema, API, tickets |
| 6 | Production code | Build everything |
| 7 | Live product | Deploy, monitor, fix |
