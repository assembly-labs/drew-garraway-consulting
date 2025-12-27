# Quickstart Guide

Get a new project up and running in 5 minutes.

---

## Option 1: Use the Script (Recommended)

```bash
# From the drew-garraway-consulting directory
./scripts/new-project.sh my-project-name

# Or specify a path
./scripts/new-project.sh my-project-name --path ~/Projects

# Or initialize with a framework
./scripts/new-project.sh my-project-name --next    # Next.js
./scripts/new-project.sh my-project-name --vite    # Vite + React
```

This creates everything automatically and initializes git.

---

## Option 2: Manual Setup

### 1. Create Project Folder

```bash
mkdir my-project && cd my-project
```

### 2. Copy Templates

```bash
# From drew-garraway-consulting
cp docs/templates/CLAUDE-MD-TEMPLATE.md my-project/CLAUDE.md
cp docs/templates/PRD-TEMPLATE.md my-project/docs/PRD.md
cp docs/templates/HANDOFF-TEMPLATE.md my-project/docs/HANDOFF.md
cp docs/templates/TICKETS-TEMPLATE.md my-project/docs/TICKETS.md
cp docs/PROCESS.md my-project/docs/PROCESS.md
cp docs/TEAM-WORKFLOW.md my-project/docs/TEAM-WORKFLOW.md
cp docs/JUNIOR-DEV-GUIDE.md my-project/docs/JUNIOR-DEV-GUIDE.md
cp docs/checklists/PHASE-GATES.md my-project/docs/checklists/PHASE-GATES.md
```

### 3. Create Folder Structure

```bash
mkdir -p docs/{research,strategy,brand,design,technical,gtm,checklists}
mkdir -p prototype/src/{components,pages,mocks}
mkdir -p src/{components/ui,components/features,lib,types,styles}
```

---

## After Creating a Project

### Step 1: Update CLAUDE.md

Open `CLAUDE.md` and fill in:
- Project overview (one sentence)
- Current phase
- Tech stack decisions

### Step 2: Start Phase 0 (Research)

Fill out these docs:
- `docs/research/MARKET-ANALYSIS.md`
- `docs/research/COMPETITOR-ANALYSIS.md`
- `docs/research/USER-RESEARCH.md`

### Step 3: Move Through Phases

Follow `docs/PROCESS.md` and use `docs/checklists/PHASE-GATES.md` before each transition.

---

## Quick Reference: The 7 Phases

| Phase | What You Do | Key Output |
|-------|-------------|------------|
| 0. Research | Understand problem & market | Research docs |
| 1. Strategy | Define what to build | PRD, Feature List |
| 2. Brand | Establish identity | Brand guidelines |
| 3. Product Design | Map user flows | UX docs, wireframes |
| 4. Prototype | Build code prototype | `/prototype/` |
| 5. Technical Plan | Plan production build | HANDOFF.md, TICKETS.md |
| 6. Development | Build production app | `/src/` |
| 7. Launch | Ship & iterate | Live product |

---

## Quick Reference: Key Files

| File | Purpose | Update When |
|------|---------|-------------|
| `CLAUDE.md` | AI context | Every phase |
| `docs/PRD.md` | Product requirements | Phase 1 |
| `docs/FEATURE-LIST.md` | Feature priorities | Phase 1, 4 |
| `docs/HANDOFF.md` | Technical decisions | Phase 5 |
| `docs/TICKETS.md` | Development tasks | Phase 5-6 |

---

## Quick Reference: Claude Code Prompts

### Starting a new phase:
```
I'm starting Phase [X] for [project-name].

Context:
- CLAUDE.md has the project overview
- Previous phase outputs are in docs/[phase-folder]/

Help me complete Phase [X] by [specific task].
```

### Working on a ticket:
```
I'm working on Ticket [N] from docs/TICKETS.md.

Context:
- Technical decisions: docs/HANDOFF.md
- Prototype reference: prototype/src/pages/[Page].tsx

Please implement [specific feature].
```

### Junior dev starting work:
```
I'm a junior developer on this project.

Please read:
1. CLAUDE.md (project context)
2. docs/TICKETS.md (my assigned ticket)
3. docs/JUNIOR-DEV-GUIDE.md (how I should work)

Then help me start Ticket [N].
```

---

## Quick Reference: Git Workflow

```bash
# Start of day
git checkout develop && git pull

# Start a ticket
git checkout -b feature/ticket-N-description

# While working
git add . && git commit -m "feat: description"

# When done
git push -u origin feature/ticket-N-description
# Then create PR on GitHub
```

---

## Quick Reference: Phase Gate Check

Before moving to the next phase, ask:

1. [ ] Are all phase outputs complete?
2. [ ] Can I answer the gate question "yes"?
3. [ ] Is CLAUDE.md updated?
4. [ ] Is the team aligned?

See `docs/checklists/PHASE-GATES.md` for detailed checklists.

---

## Troubleshooting

### "Script not found"
```bash
chmod +x scripts/new-project.sh
```

### "Template not found"
Make sure you're running from the `drew-garraway-consulting` directory.

### "Permission denied"
```bash
sudo chmod +x scripts/new-project.sh
```

### "Command not found: npx"
Install Node.js from https://nodejs.org

---

## Getting Help

1. **Process questions**: Read `docs/PROCESS.md`
2. **Git questions**: Read `docs/TEAM-WORKFLOW.md`
3. **Claude Code questions**: Read `docs/JUNIOR-DEV-GUIDE.md`
4. **Phase transitions**: Read `docs/checklists/PHASE-GATES.md`

---

## Links to Detailed Docs

- [Full Process Guide](PROCESS.md)
- [Team Workflow](TEAM-WORKFLOW.md)
- [Junior Dev Guide](JUNIOR-DEV-GUIDE.md)
- [Phase Gates Checklist](checklists/PHASE-GATES.md)
- [PRD Template](templates/PRD-TEMPLATE.md)
- [Handoff Template](templates/HANDOFF-TEMPLATE.md)
- [CLAUDE.md Template](templates/CLAUDE-MD-TEMPLATE.md)
- [Tickets Template](templates/TICKETS-TEMPLATE.md)
