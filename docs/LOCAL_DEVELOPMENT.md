# Local Development Guide

Quick reference for running each project locally.

---

## Quick Start by Project

| Project | Command | Port | Requires API Key |
|---------|---------|------|------------------|
| Scout | `npm run dev` | 5173 | Yes (Claude) |
| No FOMO | `npm run dev` | 5173 | Yes (Polygon) |
| Zero Chill | `npm run dev` | 5173 | No |
| Career Chat | `npm run dev` | 5173 | Yes (Anthropic) |
| Accountable | `npm run dev` | 5173 | No |
| BJJJ | `npm run dev` | 5173 | No |
| fuckyougotrain | `npm run dev` | 5173 | No |
| CAP | `npm run dev` | 3000 | Yes (multiple) |
| Cool Curriculum | See below | 3000+3001 | Yes (Anthropic) |
| Assembly Articles | See below | 3000+3001 | Yes (Claude, Perplexity) |
| Franklin Hugh Money | `python3 -m http.server 8000 --directory public` | 8000 | No |
| Alliance Prototype | Open HTML directly | N/A | No |

---

## Project-Specific Setup

### Static Sites (Simple)

These projects just need `npm install && npm run dev`:

```bash
# Any of these:
cd scout && npm install && npm run dev
cd nofomo && npm install && npm run dev
cd zero-chill-tracker && npm install && npm run dev
cd career-chat && npm install && npm run dev
cd accountable/habit-tracker && npm install && npm run dev
cd BJJJ/prototype && npm install && npm run dev
cd fuckyougotrain && npm install && npm run dev
```

### Scout (with Cloudflare Functions)

```bash
cd scout
npm install

# Option 1: Frontend only (no API)
npm run dev

# Option 2: Full local with Cloudflare Functions
wrangler secret put CLAUDE_API_KEY  # Set API key first
npm run dev:local
```

**Environment:**
- `CLAUDE_API_KEY` - Anthropic API key (set via wrangler secret)

### CAP (Next.js + Supabase)

```bash
cd CAP
npm install

# Start Supabase locally (requires Docker)
npx supabase start

# Run development server
npm run dev
```

**Environment (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
SUPABASE_SERVICE_KEY=<from supabase start output>
STRIPE_SECRET_KEY=sk_test_...
REPLICATE_API_TOKEN=r8_...
ANTHROPIC_API_KEY=sk-ant-...
```

### Cool Curriculum (Two Servers)

Requires **two terminal windows**:

**Terminal 1 - Backend Proxy:**
```bash
cd cool-curriculum/ai-lesson-planner
npm install
npm run server
# Runs on port 3001
```

**Terminal 2 - Frontend:**
```bash
cd cool-curriculum/ai-lesson-planner
npm start
# Runs on port 3000
```

**Environment (.env):**
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

### Assembly Agentic Articles (Full Stack)

Requires **Docker + two terminals**:

**Start Database:**
```bash
cd assembly-agentic-articles
docker-compose up -d  # PostgreSQL + Redis
```

**Terminal 1 - Backend:**
```bash
cd assembly-agentic-articles/backend
npm install
npm run dev
# Runs on port 3001
```

**Terminal 2 - Frontend:**
```bash
cd assembly-agentic-articles/frontend
npm install
npm start
# Runs on port 3000
```

**Environment (backend/.env):**
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/assembly_content
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...
JWT_SECRET=your_secret
```

### Franklin Hugh Money (Static HTML)

No build step required:

```bash
cd franklin-hugh-money

# Option 1: Python (recommended)
python3 -m http.server 8000 --directory public

# Option 2: Node.js
npx serve public -l 8000
```

Open http://localhost:8000

### Alliance BJJ (HTML Prototype)

No server required - just open files directly:

```bash
# Open in browser
open alliance-bjj-app/prototype/owner/dashboard.html
open alliance-bjj-app/prototype/member/home.html
```

### Alliance BJJ Mobile (Expo)

```bash
cd alliance-bjj-app/alliance-mobile
npm install
npm start

# Then:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web
```

---

## Testing Cloudflare Functions Locally

For projects with Cloudflare Pages Functions:

```bash
# Build first
npm run build

# Run with functions
wrangler pages dev dist

# Or with live reload
wrangler pages dev -- npm run dev
```

### Setting Secrets Locally

```bash
# Create .dev.vars file in project root
echo "CLAUDE_API_KEY=sk-ant-..." > .dev.vars

# Or use wrangler
wrangler secret put CLAUDE_API_KEY
```

---

## Port Reference

| Port | Used By |
|------|---------|
| 3000 | CAP, Cool Curriculum (frontend), Assembly (frontend) |
| 3001 | Cool Curriculum (proxy), Assembly (backend) |
| 5173 | All Vite projects (Scout, NoFomo, Zero Chill, etc.) |
| 8000 | Franklin Hugh Money |
| 8788 | Wrangler Pages dev |
| 54321 | Supabase local |

---

## Deployment Commands (Cloudflare)

```bash
# Build and deploy to Cloudflare Pages
npm run build
wrangler pages deploy dist

# Or use npm script (if configured)
npm run deploy
```

### First-time Cloudflare Setup

```bash
# Login to Cloudflare
wrangler login

# Create Pages project
wrangler pages project create <project-name>

# Set secrets
wrangler secret put CLAUDE_API_KEY

# Deploy
wrangler pages deploy dist
```

---

## Testing

### Projects with Vitest

| Project | Test Command | Watch Mode |
|---------|--------------|------------|
| Scout | `npm run test:run` | `npm run test` |
| No FOMO | `npm run test:run` | `npm run test` |
| Zero Chill | `npm run test:run` | `npm run test` |
| Career Chat | `npm run test:run` | `npm run test` |

### Running Tests

```bash
cd <project>

# Run tests once
npm run test:run

# Watch mode (re-runs on file changes)
npm run test

# With coverage report
npm run test:coverage
```

### Writing Tests

Tests are located in `src/` alongside the code they test:
- `src/App.test.tsx` - Tests for App component
- `src/components/Button.test.tsx` - Tests for Button component

Example test:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

---

## Setup Scripts

For complex projects, use the setup scripts:

```bash
# Setup everything (simple projects only)
bash scripts/setup-all.sh

# Individual complex projects
bash scripts/setup-cap.sh           # CAP with Supabase
bash scripts/setup-assembly.sh      # Assembly with Docker
bash scripts/setup-cool-curriculum.sh  # Cool Curriculum
```

---

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Wrangler Not Found

```bash
# Install globally
npm install -g wrangler

# Or use npx
npx wrangler pages dev dist
```

### Environment Variables Not Loading

- Vite projects: Must prefix with `VITE_`
- Create React App: Must prefix with `REACT_APP_`
- Cloudflare: Use `.dev.vars` file or `wrangler secret put`
