# Dev Queue - Project Status

**Last Updated:** 2025-12-25

---

## Project Overview

**Kill Your PM / Dev Queue** is an internal Kanban tool for managing development tickets that Claude Code processes autonomously.

- **Tech Stack:** Vanilla HTML/CSS/JS (no frameworks, no build step)
- **Data:** `dev-queue/BACKLOG.json` is source of truth
- **Storage:** localStorage for persistence (since file:// can't write)
- **Queue:** `QUEUE.md` generated for Claude Code to read

---

## Completed Features (Original Build)

From `DEV-QUEUE-BUILD-SPEC.md`:

- [x] Kanban board with 7 status columns
- [x] Drag and drop between columns
- [x] Ticket creation form with validation
- [x] Ticket detail modal
- [x] Project management
- [x] Search functionality
- [x] Project/Priority filters
- [x] "My Tickets" toggle
- [x] Keyboard shortcuts (N, /, Esc, ?)
- [x] Activity log per ticket
- [x] Comments on tickets
- [x] QUEUE.md generation for Claude Code
- [x] Dark theme styling
- [x] Validation rules (100+ char description, 2+ acceptance criteria)
- [x] Auto-save with "Saved" indicator

---

## Session: 2025-12-25 - UX Improvements

### What Was Built

1. **View Toggle (Board ↔ Table)**
   - Segmented control in toolbar with board/table icons
   - Keyboard shortcut `V` to toggle views
   - State persists while navigating

2. **Table View**
   - Sortable columns: ID, Title, Project, Priority, Status, Created, Creator
   - Click column headers to sort (toggles asc/desc)
   - Colored priority dots and status dots for quick scanning
   - Click any row to open ticket detail modal
   - Empty state when no tickets match filters

3. **Status Filter**
   - New dropdown in toolbar to filter by any status
   - Works alongside project/priority filters

4. **Filter Pills**
   - Active filters shown as removable pills below toolbar
   - Click × to remove individual filter
   - "Clear all" button to reset all filters
   - Shows: Project, Priority, Status, Search query, My Tickets

5. **Improved Card Design**
   - Colored left border indicates priority (red=critical → gray=nice)
   - Priority shown as colored dot + text label (instead of stars)
   - Simplified footer: `TKT-0001 · DG · Jan 15`
   - Removed drag handle (whole card is draggable)

6. **Column Visual Hierarchy**
   - Queued & In Progress columns have brighter background
   - Done column is slightly muted
   - Blocked column keeps red border treatment

### Files Modified

| File | Changes |
|------|---------|
| `dev-queue/index.html` | Added view toggle, status filter, filter pills container, table view structure, updated keyboard shortcuts modal |
| `dev-queue/styles.css` | Added ~380 lines: view toggle, filter pills, table view, improved cards, column hierarchy |
| `dev-queue/app.js` | Added: view state, status filter, table rendering, sorting logic, filter pills, view toggle events |

### New Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `V` | Toggle view (Board/Table) |

---

## Remaining / Future Work

### From Build Spec (Not Yet Implemented)

- [ ] Auto-backup BACKLOG.json (keep last 5 backups)
- [ ] Inline editing in ticket detail view
- [ ] Reorder cards within columns (priority sort)
- [ ] Backend to persist data to BACKLOG.json file

### Potential Enhancements

- [ ] Bulk operations (multi-select, bulk status change)
- [ ] Export to CSV
- [ ] Analytics/reports (tickets by status, velocity)
- [ ] Due dates on tickets
- [ ] Assignees (not just creator)
- [ ] Labels/tags
- [ ] Dark/light theme toggle
- [ ] Ticket templates
- [ ] Dependencies graph visualization

### UX Polish

- [ ] Loading skeleton while fetching data
- [ ] Optimistic updates with rollback
- [ ] Undo for destructive actions
- [ ] Better mobile fallback message

---

## File Structure

```
kill-your-product-manager/
├── README.md                    # User documentation
├── CLAUDE.md                    # Claude Code instructions
├── DEV-QUEUE-BUILD-SPEC.md     # Original build specification
├── _internal/                   # Internal documentation
│   ├── STATUS.md               # This file - project status
│   └── CHANGELOG.md            # Change history
└── dev-queue/
    ├── index.html              # Main UI
    ├── styles.css              # Dark theme styling (~1500 lines)
    ├── app.js                  # Application logic (~1200 lines)
    ├── BACKLOG.json            # Ticket data store
    ├── QUEUE.md                # Auto-generated queue for Claude
    ├── README.md               # Dev Queue specific docs
    └── assets/
        ├── drag-handle.svg
        └── plus.svg
```

---

## Testing Checklist

### Board View
- [ ] Tickets display in correct columns
- [ ] Drag and drop works between columns
- [ ] Cards show priority color bar
- [ ] Priority dot and label display correctly
- [ ] Footer shows ID, initials, date

### Table View
- [ ] All tickets display in rows
- [ ] Sorting works for each column
- [ ] Sort direction toggles correctly
- [ ] Click row opens detail modal
- [ ] Empty state shows when no tickets

### Filters
- [ ] Project filter works
- [ ] Priority filter works
- [ ] Status filter works
- [ ] Search filter works
- [ ] My Tickets toggle works
- [ ] Filter pills appear when filters active
- [ ] Individual pill removal works
- [ ] Clear all removes all filters

### View Toggle
- [ ] Toggle buttons switch views
- [ ] Active button is highlighted
- [ ] Keyboard shortcut V works
- [ ] Filters persist across view changes

---

## Notes

- The app uses localStorage since `file://` protocol can't write to disk
- QUEUE.md is generated in-memory and logged to console
- To persist data permanently, need a simple backend server
- Minimum viewport is 1024px (internal tool, mobile not required)
