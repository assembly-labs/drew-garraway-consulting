# CLAUDE.md - Instructions for Claude Code

This file tells Claude Code how to work with the Kill Your PM project.

---

## Project Overview

**Kill Your PM** is an internal Kanban tool for managing development tickets that Claude Code processes autonomously.

- **Frontend**: Vanilla HTML/CSS/JS (no build step, no frameworks)
- **Data**: `dev-queue/BACKLOG.json` is the source of truth
- **Queue**: `dev-queue/QUEUE.md` contains tickets ready for processing

---

## Processing the Queue

When asked to process tickets, follow this workflow:

### 1. Read the queue

```bash
cat dev-queue/QUEUE.md
```

### 2. Process tickets in order

Tickets are sorted by priority (Critical → Nice to have). Process the first unhandled ticket.

Each ticket contains:
- **Title** and **ID** (e.g., `TKT-0042`)
- **Project path** (where to work)
- **Description** (what to build and why)
- **Acceptance Criteria** (checkable outcomes)
- **Files Affected** (where to look/modify)
- **Edge Cases** (what to handle)
- **Technical Notes** (implementation guidance)

### 3. Do the work

1. Navigate to the project path
2. Read the affected files to understand context
3. Implement the feature/fix according to acceptance criteria
4. Handle the edge cases mentioned
5. Follow any technical notes provided
6. Create a feature branch: `feature/TKT-XXXX-short-description`
7. Commit your changes with clear messages

### 4. Update BACKLOG.json

After completing a ticket, update its entry in `dev-queue/BACKLOG.json`:

```json
{
  "status": "done",
  "claudeOutput": {
    "branch": "feature/TKT-0042-dark-mode-toggle",
    "commits": ["abc123", "def456"],
    "completedAt": "2025-01-15T15:45:00Z",
    "summary": "Brief description of what was built"
  }
}
```

### 5. Move to next ticket

Continue processing tickets until the queue is empty or you're told to stop.

---

## File Structure

```
kill-your-product-manager/
├── README.md              # User documentation
├── CLAUDE.md              # You are reading this
├── DEV-QUEUE-BUILD-SPEC.md # Original build specification
└── dev-queue/
    ├── index.html         # Main UI (vanilla HTML)
    ├── styles.css         # Dark theme styles
    ├── app.js             # Application logic (vanilla JS)
    ├── BACKLOG.json       # All ticket data
    ├── QUEUE.md           # Tickets ready for processing
    ├── README.md          # Dev Queue specific docs
    └── assets/
        ├── drag-handle.svg
        └── plus.svg
```

---

## BACKLOG.json Schema

```json
{
  "meta": {
    "lastUpdated": "ISO timestamp",
    "version": "1.0",
    "ticketCounter": 42
  },
  "projects": [
    {
      "id": "project-slug",
      "name": "Display Name",
      "path": "/path/to/project"
    }
  ],
  "tickets": [
    {
      "id": "TKT-0042",
      "title": "Feature title",
      "project": "project-slug",
      "status": "queued",
      "priority": 1,
      "description": "What to build...",
      "acceptanceCriteria": ["Criterion 1", "Criterion 2"],
      "filesAffected": ["/src/file.js"],
      "edgeCases": ["Handle empty state"],
      "technicalNotes": "Use existing pattern...",
      "claudeOutput": null
    }
  ]
}
```

---

## Status Values

| Status | Meaning |
|--------|---------|
| `backlog` | Not ready for work |
| `review` | Needs team discussion |
| `approved` | Specs complete, not yet queued |
| `queued` | Ready for Claude to process |
| `in-progress` | Claude is actively working |
| `done` | Complete |
| `blocked` | Needs human help |

---

## Priority Values

| Priority | Label |
|----------|-------|
| 1 | Critical (do first) |
| 2 | High |
| 3 | Medium |
| 4 | Low |
| 5 | Nice to have |

---

## Code Style for dev-queue/

When modifying the Dev Queue app itself:

- **No frameworks** - vanilla HTML/CSS/JS only
- **No build step** - must work with `file://` or simple HTTP server
- **Dark theme** - use CSS variables defined in `:root`
- **Comments** - add JSDoc-style comments for functions
- **State** - all state flows through `BACKLOG.json`

---

## Common Tasks

### Add a new feature to Dev Queue

1. Read `DEV-QUEUE-BUILD-SPEC.md` for design context
2. Modify `index.html` for new UI elements
3. Add styles to `styles.css`
4. Add logic to `app.js`
5. Test by opening `index.html` in browser

### Debug data issues

1. Check browser console for errors
2. Inspect localStorage: `localStorage.getItem('devqueue_backlog')`
3. Compare with `BACKLOG.json` on disk

### Reset the app

Delete localStorage and reload:
```javascript
localStorage.removeItem('devqueue_backlog');
localStorage.removeItem('devqueue_user');
location.reload();
```

---

## Important Notes

- The app uses localStorage for persistence since `file://` can't write to disk
- `QUEUE.md` is generated in-memory and logged to console
- Always preserve existing ticket data when updating `BACKLOG.json`
- Test changes in browser before committing
