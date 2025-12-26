# Dev Queue: Build Specification

## Overview

Build an internal Kanban-style project management tool that allows non-technical teams to create, prioritize, and approve development tickets. Approved tickets are queued for autonomous execution by Claude Code.

This tool lives inside a project folder, is used internally only, and requires no authentication.

---

## Purpose

1. Give non-technical team members a visual interface to manage feature backlogs
2. Enforce ticket quality so Claude Code receives unambiguous instructions
3. Create a queue of approved work that Claude Code processes without supervision
4. Track what Claude Code has built and its status

---

## Technical Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks, no build step)
- **Data persistence**: Single `BACKLOG.json` file (source of truth)
- **Storage**: LocalStorage for UI state, JSON file for ticket data
- **Hosting**: Runs locally via file:// or simple HTTP server

Why vanilla: Zero dependencies, runs anywhere, easy for Claude Code to modify later.

---

## File Structure

```
/dev-queue
  index.html              # Main application
  styles.css              # All styling
  app.js                  # All application logic
  BACKLOG.json            # Source of truth for all tickets
  README.md               # How to use this tool
  /assets
    drag-handle.svg       # Icon for drag handles
    plus.svg              # Icon for add buttons
```

---

## Data Model

### BACKLOG.json Schema

```json
{
  "meta": {
    "lastUpdated": "2025-01-15T10:30:00Z",
    "version": "1.0"
  },
  "projects": [
    {
      "id": "project-slug",
      "name": "Project Display Name",
      "path": "/path/to/project/root"
    }
  ],
  "tickets": [
    {
      "id": "uuid-string",
      "title": "Short descriptive title",
      "project": "project-slug",
      "status": "backlog",
      "priority": 1,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "createdBy": "Team member name",
      "description": "Detailed description of what to build and why",
      "acceptanceCriteria": [
        "Criterion 1 that must be met",
        "Criterion 2 that must be met"
      ],
      "filesAffected": [
        "/src/components/Header.js",
        "/styles/header.css"
      ],
      "dependencies": ["other-ticket-id"],
      "edgeCases": [
        "What happens when X",
        "Handle empty state for Y"
      ],
      "technicalNotes": "Optional guidance for implementation",
      "comments": [
        {
          "id": "comment-uuid",
          "author": "Name",
          "text": "Comment content",
          "createdAt": "2025-01-15T10:30:00Z"
        }
      ],
      "activityLog": [
        {
          "action": "created",
          "by": "Name",
          "at": "2025-01-15T10:30:00Z"
        },
        {
          "action": "moved",
          "from": "backlog",
          "to": "approved",
          "by": "Name",
          "at": "2025-01-15T11:00:00Z"
        }
      ],
      "claudeOutput": {
        "branch": "feature/ticket-id-short-title",
        "commits": ["abc123", "def456"],
        "completedAt": "2025-01-15T12:00:00Z",
        "summary": "What Claude built"
      }
    }
  ]
}
```

### Status Values (Kanban Columns)

| Status | Meaning |
|--------|---------|
| `backlog` | Ideas, not yet refined |
| `review` | Needs team input before approval |
| `approved` | Specs locked, ready for automation queue |
| `queued` | In line for Claude Code to pick up |
| `in-progress` | Claude Code is actively building |
| `done` | Completed, ready for human review |
| `blocked` | Cannot proceed, needs intervention |

### Priority Values

- `1` = Critical (do first)
- `2` = High
- `3` = Medium
- `4` = Low
- `5` = Nice to have

---

## User Interface

### Layout

```
+------------------------------------------------------------------+
|  DEV QUEUE                                    [+ New Ticket] btn  |
|  [Project Filter ▼]  [Search...]  [My Tickets toggle]            |
+------------------------------------------------------------------+
|                                                                    |
|  BACKLOG    REVIEW     APPROVED    QUEUED    IN PROGRESS    DONE  |
|  (12)       (3)        (5)         (2)       (1)            (24)  |
|                                                                    |
|  +--------+ +--------+ +--------+ +--------+ +--------+ +--------+|
|  | Ticket | | Ticket | | Ticket | | Ticket | | Ticket | | Ticket ||
|  | Card   | | Card   | | Card   | | Card   | | Card   | | Card   ||
|  +--------+ +--------+ +--------+ +--------+ +--------+ +--------+|
|  | Ticket | | Ticket | | Ticket | | Ticket |            | Ticket ||
|  | Card   | | Card   | | Card   | | Card   |            | Card   ||
|  +--------+ +--------+ +--------+ +--------+            +--------+|
|  | Ticket |                                              | Ticket ||
|  | Card   |                                              | Card   ||
|  +--------+                                              +--------+|
|                                                                    |
+------------------------------------------------------------------+
```

### Ticket Card (Collapsed View)

```
+----------------------------------+
|  ≡  [Project Tag]    ★★★☆☆      |
|                                  |
|  Ticket Title Here               |
|                                  |
|  "First 80 chars of desc..."     |
|                                  |
|  ✓ 3/5 criteria    💬 2          |
|  [Jane D.]         Jan 15        |
+----------------------------------+
```

Card shows:
- Drag handle (≡)
- Project tag (color coded)
- Priority (stars)
- Title
- Description preview
- Acceptance criteria progress
- Comment count
- Creator avatar/initials
- Date

### Ticket Detail Modal

When a card is clicked, open a full detail modal:

```
+------------------------------------------------------------------+
|  [← Back]                                          [Delete] [X]  |
+------------------------------------------------------------------+
|                                                                    |
|  TICKET TITLE HERE                                                |
|  [Project Tag]  Status: [Review ▼]  Priority: [★★★☆☆ ▼]          |
|                                                                    |
|  Created by Jane D. on Jan 15, 2025                               |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  DESCRIPTION                                          [Edit btn]  |
|  ---------------------------------------------------------------- |
|  Full description text here. This explains what we're building    |
|  and why it matters. Should be detailed enough that someone       |
|  unfamiliar with the project understands the goal.                |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ACCEPTANCE CRITERIA                                  [Edit btn]  |
|  ---------------------------------------------------------------- |
|  ☑ User can click the button                                      |
|  ☐ Button shows loading state                                     |
|  ☐ Error displays if API fails                                    |
|  ☐ Success redirects to dashboard                                 |
|  [+ Add criterion]                                                |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  FILES AFFECTED                                       [Edit btn]  |
|  ---------------------------------------------------------------- |
|  /src/components/SubmitButton.js                                  |
|  /src/api/submit.js                                               |
|  /styles/buttons.css                                              |
|  [+ Add file]                                                     |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  DEPENDENCIES                                         [Edit btn]  |
|  ---------------------------------------------------------------- |
|  → [TICKET-123] Setup API endpoint (Done ✓)                       |
|  → [TICKET-456] Create button component (In Progress)             |
|  [+ Add dependency]                                               |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  EDGE CASES                                           [Edit btn]  |
|  ---------------------------------------------------------------- |
|  • What if the user double-clicks?                                |
|  • What if the API times out?                                     |
|  • What if the user is offline?                                   |
|  [+ Add edge case]                                                |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  TECHNICAL NOTES (optional)                           [Edit btn]  |
|  ---------------------------------------------------------------- |
|  Use the existing useApi hook. Follow the pattern in              |
|  LoginButton.js for loading states.                               |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  COMMENTS                                                         |
|  ---------------------------------------------------------------- |
|  [Avatar] John S. - Jan 16                                        |
|  Should we also handle the case where...                          |
|                                                                    |
|  [Avatar] Jane D. - Jan 16                                        |
|  Good catch, added to edge cases.                                 |
|                                                                    |
|  [Write a comment...]                              [Post btn]     |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ACTIVITY LOG                                                     |
|  ---------------------------------------------------------------- |
|  Jan 16 10:30 - Jane D. moved ticket to Review                    |
|  Jan 15 14:00 - Jane D. created ticket                            |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  CLAUDE OUTPUT (visible when status = done)                       |
|  ---------------------------------------------------------------- |
|  Branch: feature/ticket-123-submit-button                         |
|  Commits: abc123, def456, ghi789                                  |
|  Completed: Jan 17, 2025 at 3:45 PM                               |
|                                                                    |
|  Summary:                                                         |
|  Created SubmitButton component with loading state, error         |
|  handling, and success redirect. Added unit tests.                |
|                                                                    |
+------------------------------------------------------------------+
```

### New Ticket Form

A guided form that enforces quality. Required fields block submission.

```
+------------------------------------------------------------------+
|  CREATE NEW TICKET                                          [X]  |
+------------------------------------------------------------------+
|                                                                    |
|  TITLE *                                                          |
|  [Short, descriptive title for this feature        ]              |
|  Example: "Add dark mode toggle to settings"                      |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  PROJECT *                                                        |
|  [Select project ▼]                                               |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  PRIORITY *                                                       |
|  ( ) Critical  ( ) High  (•) Medium  ( ) Low  ( ) Nice to have   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  DESCRIPTION *                                                    |
|  [                                                    ]           |
|  [  Describe what to build and why it matters.       ]           |
|  [  Be specific. Assume the reader has no context.   ]           |
|  [                                                    ]           |
|  Minimum 100 characters required.                                 |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ACCEPTANCE CRITERIA *                                            |
|  What must be true for this ticket to be complete?                |
|                                                                    |
|  ☐ [Criterion 1                                      ] [×]        |
|  ☐ [Criterion 2                                      ] [×]        |
|  [+ Add another criterion]                                        |
|                                                                    |
|  Minimum 2 criteria required.                                     |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  FILES AFFECTED (optional but recommended)                        |
|  Which files will Claude need to read or modify?                  |
|                                                                    |
|  [/path/to/file.js                                   ] [×]        |
|  [+ Add another file]                                             |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  EDGE CASES (optional but recommended)                            |
|  What should Claude watch out for?                                |
|                                                                    |
|  [What if the user...                                ] [×]        |
|  [+ Add another edge case]                                        |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  TECHNICAL NOTES (optional)                                       |
|  Any implementation guidance or patterns to follow?               |
|                                                                    |
|  [                                                    ]           |
|  [                                                    ]           |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  YOUR NAME *                                                      |
|  [                                        ]                       |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|                              [Cancel]  [Create Ticket]            |
|                                                                    |
+------------------------------------------------------------------+
```

### Project Management Panel

Accessible via settings icon. Allows adding/editing projects.

```
+------------------------------------------------------------------+
|  MANAGE PROJECTS                                            [X]  |
+------------------------------------------------------------------+
|                                                                    |
|  [yous-site]        /projects/yous          [Edit] [Delete]      |
|  YOUS Website                                                     |
|                                                                    |
|  [assembly]         /projects/assembly      [Edit] [Delete]      |
|  Assembly Labs                                                    |
|                                                                    |
|  [drew-site]        /projects/drewgarraway  [Edit] [Delete]      |
|  Drew Garraway Site                                               |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ADD NEW PROJECT                                                  |
|                                                                    |
|  Slug:  [project-slug  ]  (lowercase, no spaces)                 |
|  Name:  [Display Name  ]                                          |
|  Path:  [/path/to/root ]                                          |
|                                                                    |
|                                        [Add Project]              |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Functionality Requirements

### Drag and Drop

- Tickets can be dragged between columns
- Drag changes status automatically
- Activity log records the move
- Visual feedback during drag (card lifts, column highlights)
- Cards can be reordered within columns (affects priority sort)

### Validation Rules

**Ticket cannot move to "Approved" unless:**
- Description is at least 100 characters
- At least 2 acceptance criteria exist
- All required fields are filled

**Ticket cannot move to "Queued" unless:**
- Status was previously "Approved"
- No blocking dependencies (all dependencies must be "Done")

**Show warning toast when validation fails.**

### Search and Filter

- Search searches: title, description, acceptance criteria
- Filter by project (dropdown)
- Filter by creator ("My Tickets" toggle)
- Filter by priority
- Filters can combine

### Auto-Save

- All changes save to BACKLOG.json immediately
- No save button needed
- Show subtle "Saved" indicator after changes

### Ticket ID Generation

- Format: `TKT-XXXX` where XXXX is incrementing number
- Store current counter in `meta.ticketCounter`
- Display ID on cards and in detail view

### Keyboard Shortcuts

- `N` = New ticket
- `Esc` = Close modal
- `/` = Focus search
- `?` = Show shortcuts help

---

## Visual Design

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --bg-card: #242424;
  --bg-card-hover: #2a2a2a;
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
  
  /* Accent */
  --accent-primary: #6366f1;
  --accent-hover: #818cf8;
  
  /* Status colors */
  --status-backlog: #6b7280;
  --status-review: #f59e0b;
  --status-approved: #10b981;
  --status-queued: #6366f1;
  --status-progress: #3b82f6;
  --status-done: #22c55e;
  --status-blocked: #ef4444;
  
  /* Priority colors */
  --priority-critical: #ef4444;
  --priority-high: #f97316;
  --priority-medium: #eab308;
  --priority-low: #22c55e;
  --priority-nice: #6b7280;
  
  /* Borders */
  --border-subtle: #333333;
  --border-strong: #444444;
}
```

### Typography

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

h1 { font-size: 24px; font-weight: 600; }
h2 { font-size: 18px; font-weight: 600; }
h3 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
```

### Card Styling

- Rounded corners (8px)
- Subtle border
- Slight shadow on hover
- Smooth transitions (150ms)
- Project tag is pill-shaped with project-specific color

### Column Styling

- Fixed width columns (280px)
- Horizontal scroll if needed
- Column header shows count
- Drop zone highlights on drag

### Responsive Behavior

- Minimum viewport: 1024px wide
- Below that, show message to use larger screen
- This is an internal tool, mobile not required

---

## Claude Code Integration

### Queue File Export

When a ticket moves to "Queued", also append to a `QUEUE.md` file that Claude Code reads:

```markdown
# Claude Code Queue

## Next Up

### TKT-0042: Add dark mode toggle
**Project:** yous-site
**Path:** /projects/yous

**Description:**
Add a dark mode toggle to the settings page. When enabled, the site should 
use a dark color scheme. Preference should persist in localStorage.

**Acceptance Criteria:**
- [ ] Toggle switch appears on settings page
- [ ] Clicking toggle switches between light and dark mode
- [ ] Preference persists across page refreshes
- [ ] System preference is detected on first visit

**Files Affected:**
- /src/components/Settings.js
- /src/hooks/useTheme.js
- /styles/themes.css

**Edge Cases:**
- User has system preference set to dark but manually chose light - respect manual choice
- Transition between modes should not flash

**Technical Notes:**
Use CSS custom properties for theming. See existing color variables in global.css.

---

### TKT-0043: ...
```

### Output Recording

Claude Code should update the ticket's `claudeOutput` field when complete:

```json
{
  "claudeOutput": {
    "branch": "feature/TKT-0042-dark-mode-toggle",
    "commits": ["a1b2c3d", "e4f5g6h"],
    "completedAt": "2025-01-17T15:45:00Z",
    "summary": "Implemented dark mode toggle with localStorage persistence and system preference detection. Added CSS custom properties for theming."
  }
}
```

The UI should display this in the ticket detail view when status is "Done".

---

## Error Handling

### File Operations

- If BACKLOG.json doesn't exist, create it with empty structure
- If BACKLOG.json is malformed, show error and backup corrupt file
- Auto-backup BACKLOG.json before each write (keep last 5 backups)

### User Errors

- Show toast notifications for validation errors
- Confirm before deleting tickets
- Confirm before deleting projects with tickets

---

## Initial State

### Default BACKLOG.json

```json
{
  "meta": {
    "lastUpdated": null,
    "version": "1.0",
    "ticketCounter": 0
  },
  "projects": [],
  "tickets": []
}
```

### First Run Experience

If no projects exist:
1. Show welcome message
2. Prompt to create first project
3. Then prompt to create first ticket

---

## README.md Content

```markdown
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

## For Claude Code

When tickets are moved to Queued, they're exported to `QUEUE.md`. 

Run Claude Code with:
\`\`\`
claude-code --queue ./dev-queue/QUEUE.md
\`\`\`

## Data

All data is stored in `BACKLOG.json`. This file is the source of truth.
Backup files are created automatically in `/backups`.
```

---

## Build Instructions for Claude Code

1. Create the file structure as specified
2. Build `index.html` with semantic HTML structure
3. Build `styles.css` with all styling (dark theme, responsive columns)
4. Build `app.js` with:
   - State management (load/save JSON)
   - Kanban board rendering
   - Drag and drop functionality
   - Modal system for ticket details
   - Form validation
   - Search and filtering
   - Keyboard shortcuts
   - Toast notifications
5. Create `BACKLOG.json` with default empty state
6. Create `README.md` with usage instructions
7. Create placeholder SVG icons

**Quality Bar:**
- Clean, readable code with comments
- Smooth animations and transitions
- No console errors
- Works immediately when opened in browser
- Matches the visual design spec exactly

---

## Success Criteria

The tool is complete when:

1. ✓ Non-technical user can create a detailed ticket without guidance
2. ✓ Tickets can be dragged between all columns
3. ✓ Validation prevents incomplete tickets from being queued
4. ✓ Search and filters work correctly
5. ✓ BACKLOG.json updates in real-time
6. ✓ QUEUE.md generates correctly for Claude Code
7. ✓ Activity log tracks all changes
8. ✓ Comments can be added to tickets
9. ✓ Projects can be created and managed
10. ✓ UI matches the dark theme design spec
