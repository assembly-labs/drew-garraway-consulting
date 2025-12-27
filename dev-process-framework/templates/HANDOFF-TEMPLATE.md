# Development Handoff: [Project Name]

> Copy this template to `docs/HANDOFF.md` after prototype is approved.

## Prototype Location

`/prototype/` - This is the source of truth for UI/UX.

**Prototype URL**: [staging URL if deployed]

---

## What We're Building

[1-2 sentences from PRD summarizing the product]

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | [e.g., Next.js 14] | [Why] |
| Database | [e.g., PostgreSQL + Prisma] | [Why] |
| Auth | [e.g., Supabase Auth] | [Why] |
| Hosting | [e.g., Vercel] | [Why] |
| Styling | [e.g., Tailwind CSS] | [Why] |
| State | [e.g., Zustand] | [Why] |
| Payments | [e.g., Stripe] | [Why - if applicable] |

---

## Database Schema

```prisma
// Copy your Prisma schema here or describe tables

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Add relationships
}

model [Entity] {
  id        String   @id @default(cuid())
  // Add fields
}
```

---

## API Endpoints

All endpoints return: `{ data: T | null, error: string | null }`

### Authentication

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/signup` | POST | Create account | No |
| `/api/auth/login` | POST | Login | No |
| `/api/auth/logout` | POST | Logout | Yes |

### Core Entities

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/[entity]` | GET | List all | Yes |
| `/api/[entity]` | POST | Create one | Yes |
| `/api/[entity]/[id]` | GET | Get one | Yes |
| `/api/[entity]/[id]` | PUT | Update one | Yes |
| `/api/[entity]/[id]` | DELETE | Delete one | Yes |

---

## Prototype to Production Mapping

| Prototype File | Production Location | Notes |
|----------------|---------------------|-------|
| `prototype/src/pages/Home.tsx` | `src/app/page.tsx` | Add real auth check |
| `prototype/src/pages/Dashboard.tsx` | `src/app/dashboard/page.tsx` | Replace mock data |
| `prototype/src/mocks/users.json` | `prisma.user.findMany()` | Database query |
| `prototype/src/components/Button.tsx` | `src/components/ui/Button.tsx` | Keep same styling |

---

## Environment Variables Required

```bash
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# External Services (if applicable)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Other
[ADD_OTHERS]=
```

---

## Third-Party Integrations

| Service | Purpose | Docs Link | Setup Notes |
|---------|---------|-----------|-------------|
| [Service] | [Purpose] | [URL] | [Notes] |

---

## Development Tickets

### Ticket 1: Project Setup
- [ ] Initialize Next.js with TypeScript
- [ ] Set up Prisma with database
- [ ] Configure Tailwind (copy from prototype)
- [ ] Create folder structure
- [ ] Create CLAUDE.md
- [ ] Set up environment variables

### Ticket 2: Authentication
- [ ] Configure auth provider
- [ ] Create signup page
- [ ] Create login page
- [ ] Add auth middleware
- [ ] Create protected routes

### Ticket 3: Database & Models
- [ ] Create Prisma schema
- [ ] Run migrations
- [ ] Create seed data (optional)
- [ ] Add database utility functions

### Ticket 4: [Core Feature 1]
- [ ] Create API endpoints
- [ ] Migrate page from prototype
- [ ] Connect to real data
- [ ] Add loading/error states

### Ticket 5: [Core Feature 2]
- [ ] Create API endpoints
- [ ] Migrate page from prototype
- [ ] Connect to real data
- [ ] Add loading/error states

### Ticket 6: [Core Feature 3]
- [ ] ...

### Ticket 7: Polish & Testing
- [ ] Add error boundaries
- [ ] Test all flows manually
- [ ] Mobile responsiveness check
- [ ] Performance check
- [ ] Fix edge cases

### Ticket 8: Deployment
- [ ] Set up production environment
- [ ] Configure CI/CD
- [ ] Deploy to staging
- [ ] Test on staging
- [ ] Deploy to production

---

## Success Criteria

Before launch, verify:

- [ ] All prototype screens working with real data
- [ ] Authentication flow complete
- [ ] All CRUD operations work correctly
- [ ] Error states handled gracefully
- [ ] Loading states feel smooth
- [ ] Mobile responsive
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Loads in < 3 seconds

---

## Start Command

To begin development:

```
Read this document, then start with Ticket 1.

When Ticket 1 is complete, create a PR and move to Ticket 2.

Work ticket-by-ticket. Don't skip ahead.
```
