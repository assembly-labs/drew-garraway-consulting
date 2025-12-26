# Kill Your Product Manager

**Stop waiting. Start shipping.**

An internal tool that lets non-technical teams write feature specs and queue them for autonomous execution by Claude Code. No standups. No sprint planning. No bottlenecks.

## The Problem

Traditional product management creates friction:
- Developers wait for specs
- PMs wait for estimates
- Everyone waits for meetings
- Features die in backlogs

## The Solution

Dev Queue is a Kanban-style tool where anyone can:
1. Write a detailed ticket (enforced quality)
2. Get team approval
3. Queue it for Claude Code
4. Claude builds it autonomously

You describe *what* you want. Claude figures out *how*.

---

## Quick Start

### 1. Open the app

```bash
cd dev-queue
open index.html
```

Or with a local server (recommended):
```bash
cd dev-queue
python3 -m http.server 8000
# Open http://localhost:8000
```

### 2. Create a project

Click the gear icon → Add a project with:
- **Slug**: `my-project` (lowercase, no spaces)
- **Name**: `My Project`
- **Path**: `/path/to/your/project/root`

### 3. Create your first ticket

Click **+ New Ticket** and fill in:
- **Title**: Short, descriptive
- **Description**: 100+ characters explaining what and why
- **Acceptance Criteria**: At least 2 checkable outcomes
- **Files Affected**: Which files Claude should look at
- **Edge Cases**: What to watch out for

### 4. Move tickets through the workflow

| Column | Meaning |
|--------|---------|
| **Backlog** | Ideas, rough concepts |
| **Review** | Needs team discussion |
| **Approved** | Specs locked, ready to build |
| **Queued** | In line for Claude Code |
| **In Progress** | Claude is building |
| **Done** | Complete, review the output |
| **Blocked** | Needs human intervention |

### 5. Let Claude Code work

When tickets are in "Queued", they're exported to `QUEUE.md`. Point Claude Code at this file:

```bash
claude "Read ./dev-queue/QUEUE.md and process the first ticket. When done, update BACKLOG.json with your output."
```

---

## Ticket Quality Rules

Before a ticket can be **Approved**:
- Description must be ≥100 characters
- At least 2 acceptance criteria

Before a ticket can be **Queued**:
- Must have been Approved first
- All dependencies must be Done

This ensures Claude gets unambiguous instructions every time.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New ticket |
| `V` | Toggle view (Board/Table) |
| `/` | Focus search |
| `Esc` | Close modal |
| `?` | Show shortcuts |

---

## File Structure

```
kill-your-product-manager/
├── README.md               # You are here
├── CLAUDE.md               # Instructions for Claude Code
├── DEV-QUEUE-BUILD-SPEC.md # Original build specification
├── _internal/              # Internal documentation
│   ├── STATUS.md           # Project status and roadmap
│   └── CHANGELOG.md        # Version history
└── dev-queue/
    ├── index.html          # Main application
    ├── styles.css          # Dark theme styling
    ├── app.js              # Application logic
    ├── BACKLOG.json        # Source of truth (all tickets)
    ├── QUEUE.md            # Auto-generated queue for Claude
    ├── README.md           # Dev Queue specific docs
    └── assets/             # Icons
```

---

## How Claude Code Integration Works

1. **You** drag a ticket to "Queued"
2. **Dev Queue** exports ticket details to `QUEUE.md`
3. **Claude Code** reads `QUEUE.md` and processes tickets in priority order
4. **Claude Code** updates `BACKLOG.json` with results:
   - Branch name
   - Commit hashes
   - Completion timestamp
   - Summary of what was built
5. **You** review the output and drag to "Done"

---

## Philosophy

This tool exists because:

- **Specs should be self-serve.** Anyone with context can write what needs to be built.
- **Quality should be enforced.** Bad specs waste everyone's time, especially Claude's.
- **Automation should be invisible.** Queue it and forget it.
- **Humans review, machines build.** You focus on *what*, Claude handles *how*.

---

## Data

All data lives in `BACKLOG.json`. This is your source of truth.

The app auto-saves to localStorage on every change. The "Saved" indicator appears in the bottom-left corner.

To persist data permanently, you'll need to either:
1. Manually copy localStorage data to `BACKLOG.json`
2. Run a simple backend to handle saves (future enhancement)

---

## Next Steps

1. Open the app and create your first project
2. Write 3-5 tickets for features you've been putting off
3. Approve and queue them
4. Let Claude Code rip through them
5. Never schedule another sprint planning meeting

**Kill your PM. Ship your product.**
