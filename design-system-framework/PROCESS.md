# PROCESS.md — The 0-to-1 Playbook

This document is the master guide for taking a product from idea to shipped software. It defines the journey, the phases, and the gates between them.

**For step-by-step usage instructions, see [QUICKSTART.md](QUICKSTART.md).**

---

## Philosophy

### Why This Process Exists

Most products fail not from bad code, but from building the wrong thing. This process front-loads the hard thinking:

1. **Concept** ensures you're solving a real problem for real people
2. **UX** ensures the solution is usable and valuable before pixels are pushed
3. **UI** ensures the visual layer expresses brand and enhances usability
4. **Development** ensures clean implementation of validated designs

Each phase de-risks the next. Skip a phase, inherit its risks.

### Core Beliefs

- **Diverge, then converge.** Explore options before committing to solutions.
- **Make it real to make it better.** Artifacts > discussions. Prototypes > specs.
- **Constraints enable creativity.** Tokens, systems, and rules free you from endless micro-decisions.
- **Good enough to ship beats perfect in progress.** Iterate after launch, not before.

---

## The Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   IDEA                                                                      │
│     │                                                                       │
│     ▼                                                                       │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐ │
│   │ 01-CONCEPT  │────▶│   02-UX     │────▶│   03-UI     │────▶│ 04-DEV   │ │
│   │             │     │             │     │             │     │          │ │
│   │ What & Why  │     │ How it      │     │ How it      │     │ How it   │ │
│   │             │     │ works       │     │ looks       │     │ ships    │ │
│   └─────────────┘     └─────────────┘     └─────────────┘     └──────────┘ │
│         │                   │                   │                   │       │
│         ▼                   ▼                   ▼                   ▼       │
│     Problem             Experience          Visual              Working    │
│     Definition          Blueprint           System              Product    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Summaries

### 01-Concept: What & Why

**Duration:** 1-3 sessions
**Question answered:** "Should we build this?"

You start with an idea. You leave with conviction. This phase validates that the problem is real, the users exist, and the solution has merit.

**Key Activities:**
- Write the product brief (one-liner, users, problem, solution)
- Analyze competitors and references
- Frame the problem clearly
- Identify risks and assumptions

**You're done when:** You can explain in 30 seconds what you're building, for whom, and why it matters.

---

### 02-UX: How It Works

**Duration:** 2-5 sessions
**Question answered:** "What does the user do?"

You have a validated concept. Now map the experience. This phase designs the structure, flow, and content of the product without visual design.

**Key Activities:**
- Develop brand voice (Light or Comprehensive workshop)
- Define user personas
- Write user stories
- Map user flows and journeys
- Define information architecture
- Create content strategy (informed by brand voice)
- Sketch wireframes

**You're done when:** Someone could build a prototype from your flows and wireframes alone.

---

### 03-UI: How It Looks

**Duration:** 2-4 sessions
**Question answered:** "What does the user see?"

You have a working experience. Now give it a face. This phase creates the visual system that will be implemented—tokens, components, and interaction patterns.

**Key Activities:**
- Gather visual references (moodboard)
- Define design tokens (color, type, spacing, etc.)
- Write MAGENTA.md (visual design source of truth)
- Design key components
- Define motion and interaction principles

**You're done when:** A developer could implement any screen using only your tokens and component specs.

---

### 04-Development: How It Ships

**Duration:** Ongoing
**Question answered:** "How do we build it?"

You have a visual system. Now make it real. This phase implements the design system and builds the product.

**Key Activities:**
- Set up token system in code
- Build component library
- Create Storybook stories
- Implement screens/features
- Test and iterate

**You're done when:** The product is in users' hands.

---

## Phase Gates

You cannot proceed to the next phase until these criteria are met:

### Gate 1: Concept → UX

- [ ] Product brief is complete
- [ ] Problem statement is specific and validated
- [ ] Target user is clearly defined
- [ ] Competitive landscape is understood
- [ ] Scope is locked (MVP defined)
- [ ] Stakeholder alignment achieved

### Gate 2: UX → UI

- [ ] Brand voice matrix is complete
- [ ] Personas are documented
- [ ] User stories cover core functionality
- [ ] Primary user flows are mapped
- [ ] Information architecture is defined
- [ ] Content strategy exists (references brand voice matrix)
- [ ] Wireframes approved for key screens
- [ ] No major UX questions remain open

### Gate 3: UI → Development

- [ ] MAGENTA.md is complete
- [ ] tokens.json is finalized
- [ ] Key components are designed and documented
- [ ] Motion principles are defined
- [ ] Accessibility approach is documented
- [ ] Visual design approved for key screens

### Gate 4: Development → Launch

- [ ] All components built and in Storybook
- [ ] Core user flows are implemented
- [ ] Accessibility tested (keyboard, contrast, screen reader)
- [ ] Cross-browser/device testing complete
- [ ] Performance acceptable
- [ ] Error states handled

---

## Artifacts by Phase

### 01-Concept
| Artifact | Purpose |
|----------|---------|
| `SOP.md` | Concept phase process guide |
| `brief.md` | Product definition in one page |
| `competitive-analysis.md` | What exists, what we learn from it |
| `problem-framing.md` | The problem stated clearly |
| `risks-and-assumptions.md` | What could go wrong |
| `research/*` | User research, interviews, data |

### 02-UX
| Artifact | Purpose |
|----------|---------|
| `SOP.md` | UX phase process guide |
| `brand-voice-worksheet.md` | Voice discovery exercises |
| `brand-voice-matrix.md` | Voice source of truth |
| `personas.md` | Who we're designing for |
| `user-stories.md` | What users need to do |
| `information-architecture.md` | How content is organized |
| `content-strategy.md` | How we communicate |
| `flows/*` | User flow diagrams |
| `wireframes/*` | Structural layouts |

### 03-UI
| Artifact | Purpose |
|----------|---------|
| `SOP.md` | UI phase process guide |
| `MAGENTA.md` | Visual design source of truth |
| `tokens.json` | Design token definitions |
| `moodboard/*` | Visual references |
| `components/*` | Component specifications |
| `motion/*` | Animation documentation |

### 04-Development
| Artifact | Purpose |
|----------|---------|
| `SOP.md` | Development phase process guide |
| `packages/tokens/*` | Token system in code |
| `packages/ui/*` | Component library |
| `apps/web/*` | Application code |
| `storybook/*` | Storybook configuration & stories |
| `code-review-checklist.md` | PR review guidelines |
| `testing-guide.md` | Testing patterns & requirements |

---

## Roles: Human vs. Claude

| Activity | Human | Claude |
|----------|-------|--------|
| Strategic decisions | Decides | Advises |
| Problem definition | Owns | Challenges, refines |
| User research | Conducts | Synthesizes |
| Brand voice | Answers questions | Facilitates workshop, synthesizes |
| UX decisions | Approves | Proposes options |
| Visual direction | Chooses | Presents options |
| Token values | Approves | Proposes |
| Component design | Approves | Designs |
| Code implementation | Reviews | Writes |
| Quality standards | Sets | Enforces |

---

## Starting a New Project

**See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.**

Quick version:

### Step 1: Copy the Framework
```bash
cp -r design-system-framework my-new-project
cd my-new-project
git init
```

### Step 2: Begin Phase 01
Open `01-concept/SOP.md` and follow the process. Start with `brief.md`.

### Step 3: Work Through Phases
- Complete each phase fully before moving on
- Use the phase gate checklists to verify readiness
- Reference `CLAUDE.md` for collaboration norms

### Step 4: Iterate
After launch, continue using the framework:
- New features start at the appropriate phase (not always 01)
- Token and component changes go through 03 → 04
- Major pivots may require returning to 01

---

## Time Investment (Rough Guide)

| Phase | Solo | With Claude |
|-------|------|-------------|
| 01-Concept | 4-8 hours | 2-4 hours |
| 02-UX | 10-24 hours | 5-12 hours |
| 03-UI | 8-16 hours | 4-8 hours |
| 04-Dev | Varies | Varies |

These are rough estimates. Complex products take longer. The goal isn't speed—it's building the right thing.

---

## Common Mistakes

### Skipping Concept
"We already know what to build." → You build the wrong thing, or the right thing for the wrong users.

### Skipping Brand Voice
"We'll figure out the tone later." → Inconsistent copy, generic messaging, lack of personality.

### Rushing UX
"Let's just start designing." → You create beautiful screens that don't connect into a usable product.

### Skipping Tokens
"We'll systematize later." → You end up with 47 shades of gray and inconsistent spacing everywhere.

### Not Using Storybook
"We'll document later." → Components drift, props become unclear, the system fragments.

### Treating Phases as Waterfall
This is iterative within phases. You can loop back within a phase. You just shouldn't skip phases.

---

## Principles to Remember

1. **Every artifact earns its place.** If a document isn't being used, delete it.
2. **Constraints compound.** A decision in Phase 01 simplifies hundreds of decisions later.
3. **The system is the product.** Users experience the system, not individual screens.
4. **Perfect is the enemy of shipped.** Done is better than perfect. You can iterate.
5. **The process serves the product.** If the process isn't helping, adapt it.

---

## Next Step

If you're starting a new project, proceed to [QUICKSTART.md](QUICKSTART.md).

If you're learning the framework, read through each phase's SOP to understand the full process.
