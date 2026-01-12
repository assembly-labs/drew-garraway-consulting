# F This App - Claude Context

## What This Is

Social game app where friends track and "curse" each other for swearing. Features player groups, leaderboards, weekly recaps, and a playful competitive element.

## Tech Stack

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Build:** Next.js
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Cloudflare Pages (via next-on-pages)

## Key Directories

- `src/app/` - Next.js App Router pages
- `src/components/ui/` - Reusable UI components
- `src/components/game/` - Game-specific components
- `src/lib/` - Utilities and Supabase client

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run pages:deploy` | Deploy to Cloudflare |

## Environment Variables

- Supabase credentials required (see `.env.example`)

## Key Patterns

- App Router with route groups: `(auth)` for login/signup, `(main)` for authenticated pages
- Dynamic routes for games: `/game/[gameId]/`
- Dark theme UI
