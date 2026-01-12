# Mikey-real (PA Flashcards) - Claude Context

## What This Is

PWA flashcard app for PA exam preparation. Features quiz modes, progress tracking, formula reference, spaced repetition, and offline support.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS v4
- **State:** Dexie (IndexedDB) + React Context
- **Deployment:** PWA (installable, works offline)

## Key Directories

- `src/pages/` - Route pages (Dashboard, Quiz, Progress, etc.)
- `src/components/` - Shared components
- `src/data/questions.ts` - Question bank
- `src/lib/db.ts` - Dexie database schema
- `src/context/` - App state context
- `src/hooks/` - Custom hooks (useSwipe, etc.)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Key Patterns

- Offline-first: all data persisted in IndexedDB via Dexie
- PWA configured via vite-plugin-pwa
- Touch gestures supported (swipe navigation)
- Questions stored in `src/data/questions.ts`
