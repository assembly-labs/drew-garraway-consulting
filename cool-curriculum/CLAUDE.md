# Cool Curriculum - Claude Context

## What This Is

AI-powered lesson material generator for K-4 educators. Teachers input topics and get customized lesson plans, activities, and materials.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build:** Create React App
- **Styling:** Tailwind CSS
- **Backend:** Express server (for Claude API proxy)
- **AI:** Claude API

## Key Directories

- `ai-lesson-planner/src/` - React frontend
- `ai-lesson-planner/server.js` - Express API server

## Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start React dev server |
| `npm run server` | Start Express backend |
| `npm run build` | Production build |
| `npm run test` | Run tests |

## Environment Variables

- Claude API key required for `server.js`

## Key Patterns

- Frontend and backend run separately (need both for full functionality)
- Express server proxies Claude API calls
- localStorage used for saving generated lessons
