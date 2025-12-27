# Development Tickets: [Project Name]

> Copy this template to `docs/TICKETS.md` after technical planning.

## Status Legend

| Status | Meaning |
|--------|---------|
| 🔴 Blocked | Waiting on something |
| ⚪ Todo | Not started |
| 🟡 In Progress | Currently being worked on |
| 🟢 Done | Complete and merged |
| ⏸️ On Hold | Paused for now |

---

## Current Sprint

### Ticket 1: Project Setup
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/project-setup`

**Tasks**:
- [ ] Initialize Next.js with TypeScript
- [ ] Set up Prisma with database
- [ ] Configure Tailwind (copy from prototype)
- [ ] Create folder structure per CLAUDE.md
- [ ] Create CLAUDE.md with production context
- [ ] Set up environment variables
- [ ] Verify dev server runs

**Acceptance Criteria**:
- `npm run dev` starts without errors
- Database connection works
- Tailwind classes render correctly

---

### Ticket 2: Authentication
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/auth`
**Depends On**: Ticket 1

**Tasks**:
- [ ] Configure auth provider
- [ ] Create signup page (from prototype)
- [ ] Create login page (from prototype)
- [ ] Add auth middleware
- [ ] Create protected route wrapper
- [ ] Test auth flow end-to-end

**Acceptance Criteria**:
- User can sign up with email/password
- User can log in
- User can log out
- Protected pages redirect to login
- Session persists on refresh

---

### Ticket 3: [Core Feature 1]
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/[feature-name]`
**Depends On**: Ticket 2

**Tasks**:
- [ ] Create database model
- [ ] Create API endpoints (GET, POST, PUT, DELETE)
- [ ] Migrate page from prototype
- [ ] Connect to real API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test CRUD operations

**Acceptance Criteria**:
- [Specific acceptance criteria]

---

### Ticket 4: [Core Feature 2]
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/[feature-name]`
**Depends On**: Ticket 2

**Tasks**:
- [ ] ...

**Acceptance Criteria**:
- ...

---

### Ticket 5: [Core Feature 3]
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/[feature-name]`
**Depends On**: [Dependencies]

**Tasks**:
- [ ] ...

**Acceptance Criteria**:
- ...

---

### Ticket 6: Polish & Edge Cases
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/polish`
**Depends On**: Tickets 3-5

**Tasks**:
- [ ] Add error boundaries
- [ ] Add empty states
- [ ] Add confirmation dialogs for destructive actions
- [ ] Test edge cases (empty data, long text, etc.)
- [ ] Mobile responsiveness check
- [ ] Cross-browser testing
- [ ] Fix any bugs found

**Acceptance Criteria**:
- No console errors
- No unhandled errors crash the app
- Works on mobile
- Works in Chrome, Safari, Firefox

---

### Ticket 7: Testing
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/testing`
**Depends On**: Ticket 6

**Tasks**:
- [ ] Write unit tests for utilities
- [ ] Write integration tests for API routes
- [ ] Write E2E tests for critical flows
- [ ] Achieve [X]% code coverage
- [ ] All tests passing

**Acceptance Criteria**:
- `npm run test` passes
- Critical user flows covered

---

### Ticket 8: Deployment
**Status**: ⚪ Todo
**Assignee**: [Name]
**Branch**: `feature/deployment`
**Depends On**: Ticket 7

**Tasks**:
- [ ] Set up production environment variables
- [ ] Configure CI/CD pipeline
- [ ] Deploy to staging
- [ ] Test all flows on staging
- [ ] Performance audit
- [ ] Security audit
- [ ] Deploy to production
- [ ] Verify production works

**Acceptance Criteria**:
- Staging environment fully functional
- Production environment fully functional
- CI/CD automatically deploys on merge

---

## Backlog (Post-MVP)

### Ticket 9: [Nice-to-Have Feature]
**Status**: ⏸️ On Hold
**Priority**: P1

**Tasks**:
- [ ] ...

---

### Ticket 10: [Another Feature]
**Status**: ⏸️ On Hold
**Priority**: P2

**Tasks**:
- [ ] ...

---

## Completed

_Move tickets here when done_

---

## Notes

### Blockers
- [Date]: [Blocker description] - [Who's handling]

### Decisions Made
- [Date]: [Decision] - [Rationale]

### Scope Changes
- [Date]: [Change] - [Why]
