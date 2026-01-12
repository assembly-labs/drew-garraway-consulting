# Scout - Claude Context

## What This Is

AI-powered library discovery assistant for Tredyffrin Libraries. Conversational search for books, DVDs, games, equipment, and "Library of Things" items. Live at [searchwithscout.com](https://searchwithscout.com).

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** TanStack Query
- **AI:** Claude API (Haiku)
- **Deployment:** Netlify (with serverless functions)

## Key Directories

- `src/components/` - React components
- `src/hooks/` - Custom hooks
- `src/types/` - TypeScript types
- `public/data/catalog.json` - Library catalog data
- `netlify/functions/` - Serverless API functions
- `docs/` - Technical documentation

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build |
| `npm run deploy` | Build and deploy to Netlify |
| `npm run lint` | TypeScript type check |
| `npm run test` | Run tests |

## Environment Variables

- `claude_api_key` - Required for local dev (production uses Netlify env vars)

## Key Patterns

- Catalog lives in `public/data/catalog.json` - polymorphic items (books, equipment, media)
- API key secured via Netlify serverless function in production
- Dark mode toggle with persistent preference
- Mobile-first responsive design
