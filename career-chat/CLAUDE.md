# CareerChat - Claude Context

## What This Is

AI chatbot that answers questions about Drew Garraway's career background, experience, and skills. Uses resume data as context for conversational responses.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Custom CSS
- **AI:** Claude API via Cloudflare Worker
- **Deployment:** Cloudflare Pages

## Key Directories

- `src/components/` - Chat UI components
- `src/data/` - Resume content (resume.md, resume-abbreviated.md)
- `src/services/` - Claude API and markdown parsing
- `worker/` - Cloudflare Worker for API proxy

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |

## Key Patterns

- Resume data lives in `src/data/resume.md` - update this when career info changes
- Cloudflare Worker proxies Claude API calls (keeps API key secure)
- Uses react-markdown for rendering AI responses
