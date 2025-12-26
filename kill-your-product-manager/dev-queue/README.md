# Dev Queue

Internal tool for managing the development backlog and automating feature development with Claude Code.

## Quick Start

1. Open `index.html` in your browser
2. Create a project (gear icon → Manage Projects)
3. Create your first ticket (+ New Ticket)
4. Drag tickets through the workflow

## Workflow

1. **Backlog** - Ideas and rough tickets
2. **Review** - Needs team discussion
3. **Approved** - Specs are complete and locked
4. **Queued** - Ready for Claude Code
5. **In Progress** - Claude Code is building
6. **Done** - Complete, review the output
7. **Blocked** - Cannot proceed, needs intervention

## Ticket Quality Requirements

Before a ticket can be approved:
- Description must be at least 100 characters
- At least 2 acceptance criteria must exist
- All required fields must be filled

Before a ticket can be queued:
- Must be previously approved
- All dependencies must be marked as Done

## For Claude Code

When tickets are moved to Queued, they're exported to `QUEUE.md`.

Read the queue file and process tickets in order:
```
cat ./dev-queue/QUEUE.md
```

When complete, update the ticket's status to Done and fill in the `claudeOutput` field in `BACKLOG.json`.

## Keyboard Shortcuts

- `N` - New ticket
- `V` - Toggle view (Board/Table)
- `/` - Focus search
- `Esc` - Close modal
- `?` - Show shortcuts

## Data

All data is stored in `BACKLOG.json`. This file is the source of truth.

The file is automatically saved after each change. Look for the "Saved" indicator in the bottom left.

## File Structure

```
/dev-queue
  index.html        # Main application
  styles.css        # All styling
  app.js            # Application logic
  BACKLOG.json      # Source of truth
  QUEUE.md          # Auto-generated queue for Claude Code
  README.md         # This file
  /assets
    drag-handle.svg
    plus.svg
```
