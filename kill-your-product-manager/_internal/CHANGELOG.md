# Dev Queue - Changelog

All notable changes to this project are documented in this file.

---

## [Unreleased]

### Added
- View toggle (Board/Table) in toolbar
- Table view with sortable columns
- Status filter dropdown in toolbar
- Filter pills showing active filters
- Keyboard shortcut `V` to toggle views
- Column visual hierarchy (queued/in-progress brighter, done muted)

### Changed
- Ticket cards now have colored left border for priority (instead of stars only)
- Priority display changed from stars to colored dot + label
- Card footer simplified to: ID · Initials · Date
- Removed drag handle icon (whole card is draggable)

### Fixed
- Search now also matches ticket ID

---

## [1.0.0] - 2025-01-XX (Original Build)

### Added
- Kanban board with 7 status columns (Backlog, Review, Approved, Queued, In Progress, Done, Blocked)
- Drag and drop between columns
- Ticket creation form with validation:
  - Title (required)
  - Project (required, dropdown)
  - Priority (required, radio buttons)
  - Description (required, 100+ characters)
  - Acceptance Criteria (required, 2+ items)
  - Files Affected (optional, dynamic list)
  - Edge Cases (optional, dynamic list)
  - Technical Notes (optional)
  - Creator name (required, remembered)
- Ticket detail modal with:
  - Status dropdown
  - Priority display
  - Full description
  - Acceptance criteria list
  - Files affected
  - Dependencies with status badges
  - Edge cases
  - Technical notes
  - Comments section
  - Activity log
  - Claude Output section (when done)
- Project management:
  - Create project (slug, name, path)
  - Delete project (only if no tickets)
- Filtering:
  - By project (dropdown)
  - By priority (dropdown)
  - By creator ("My Tickets" toggle)
  - By search (title, description, criteria)
- Keyboard shortcuts:
  - `N` - New ticket
  - `/` - Focus search
  - `Esc` - Close modal
  - `?` - Show shortcuts
- Validation rules:
  - Description must be 100+ characters for Approved status
  - 2+ acceptance criteria for Approved status
  - Dependencies must be Done for Queued status
- Auto-save to localStorage
- "Saved" indicator in bottom-left
- Toast notifications for success/error
- Confirm modal for destructive actions
- Welcome modal for first-run
- Dark theme with CSS variables
- QUEUE.md generation for Claude Code
- Activity log tracking all ticket changes
- Comment system on tickets
- Horizontal scrolling board

### Technical Details
- Vanilla JavaScript (IIFE pattern)
- No build tools or frameworks
- CSS custom properties for theming
- HTML5 drag and drop API
- localStorage for persistence
- Responsive minimum viewport: 1024px

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2025-01 | Original build from DEV-QUEUE-BUILD-SPEC.md |
| 1.1.0 | 2025-12-25 | UX improvements: table view, filter pills, improved cards |
