# [Project Name]

> Copy this template to your project's root as `CLAUDE.md` and update for each phase.

## Overview

[One sentence: what this project is]

## Current Phase

**Phase [X]: [Phase Name]**

See `docs/PROCESS.md` for phase details.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [e.g., Next.js 14 with App Router] |
| Language | [e.g., TypeScript] |
| Styling | [e.g., Tailwind CSS] |
| Database | [e.g., PostgreSQL + Prisma] |
| Auth | [e.g., Supabase Auth] |
| Hosting | [e.g., Vercel] |

---

## Folder Structure

```
src/
├── app/              # [Description]
├── components/       # [Description]
│   ├── ui/          # [Description]
│   └── features/    # [Description]
├── lib/             # [Description]
├── types/           # [Description]
└── styles/          # [Description]
```

---

## Conventions

### File Naming
- Files: `kebab-case.ts` (e.g., `user-profile.ts`)
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Folders: `kebab-case/`

### Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use async/await over .then()
- Add types to all function parameters

### Component Patterns
- Server components by default
- Add `'use client'` only when needed
- Props interface above component
- Export at bottom of file

### API Patterns
- All endpoints return `{ data, error }`
- Use Zod for validation
- Handle errors with try/catch
- Return appropriate HTTP status codes

---

## Important Files

| File | Purpose |
|------|---------|
| `docs/PRD.md` | Product requirements |
| `docs/HANDOFF.md` | Technical decisions |
| `docs/TICKETS.md` | Development tasks |
| `prisma/schema.prisma` | Database schema |

---

## Current Focus

Working on: **[Current ticket or task]**

Files involved:
- `[file path]`
- `[file path]`

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Check linting
npm run db:push  # Push schema to database
npm run db:seed  # Seed database
```

---

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=
NEXTAUTH_SECRET=
[others]
```

See `.env.example` for all variables.

---

## Patterns to Follow

### Creating a new page
```typescript
// src/app/[route]/page.tsx
export default async function PageName() {
  // Fetch data
  // Return JSX
}
```

### Creating an API route
```typescript
// src/app/api/[route]/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: 'Failed' }, { status: 500 });
  }
}
```

### Creating a component
```typescript
// src/components/[ComponentName].tsx
interface ComponentNameProps {
  // props
}

export function ComponentName({ }: ComponentNameProps) {
  return (
    // JSX
  );
}
```

---

## Do NOT

- [ ] Use `any` type
- [ ] Commit `.env` files
- [ ] Skip error handling
- [ ] Use inline styles (use Tailwind)
- [ ] Create files outside the folder structure
- [ ] [Project-specific don'ts]

---

## Getting Help

1. Check existing patterns in codebase
2. Read `docs/` for context
3. Ask Claude Code with specific file references
4. Ask team in Slack/Discord if stuck 30+ min

---

## Recent Decisions

| Date | Decision | Reason |
|------|----------|--------|
| [Date] | [Decision] | [Why] |

---

*Last updated: [Date]*
