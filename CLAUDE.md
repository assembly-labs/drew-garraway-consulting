# Drew Garraway Consulting - Monorepo Context for Claude

## What This Is

This is a multi-project monorepo containing client work, personal projects, and consulting deliverables. Each project is independent with its own tech stack, deployment, and documentation.

**Before working on any task, identify which project you're in.** If unclear, ask.

---

## Project Directory

### Active Projects

| Project | Directory | Description | Has CLAUDE.md |
|---------|-----------|-------------|---------------|
| **TOMO** | `/TOMO/` | BJJ training journal - voice-first iOS app (Expo) | Yes |
| **Scout** | `/scout/` | AI library discovery system for Tredyffrin Libraries | Yes |
| **Gather** | `/gather/` | Instacart for farmers markets - B2B2C marketplace | Yes |
| **FHM** | `/fhm/` | Franklin Hugh Money - securities exam prep & finance insights | Yes |
| **F_This_App** | `/f_this_app/` | Next.js social game app | Yes |
| **Read Out Loud** | `/read-out-loud/` | Text-to-speech PWA for reading documents | Yes |
| **Kaijutsu Landing** | `/kaijutsu/` | Kaijutsu landing page (logo + HTML only) | No |

### Nested Within Active Projects

| Item | Location | Description |
|------|----------|-------------|
| **TPL** | `/scout/tpl/` | Tredyffrin Libraries printer documentation (GitHub Pages) |
| **Scout Pitch** | `/scout/pitches/scout.html` | Scout pitch deck |
| **Locally Strong** | `/gather/_reference/locally-strong/` | Original nonprofit site — reference for Gather |

### Archived (25+ projects in `_archived/` — ignore unless specifically asked)

---

## Quick Reference: Tech Stacks

| Project | Framework | Build | Styling | Deployment |
|---------|-----------|-------|---------|------------|
| **Root Site** | Static HTML | None | Inline CSS | Cloudflare Pages |
| TOMO | Expo (React Native) | expo run:ios | CSS Variables | TestFlight (pending) |
| Scout | React 18 + TS | Vite | Tailwind | Cloudflare Pages |
| Gather | React 19 + TS | Vite | Tailwind v4 | Cloudflare Pages |
| FHM | Vanilla HTML/CSS/JS | Node scripts | Custom CSS | Cloudflare Pages |
| F_This_App | Next.js 16 + TS | Next.js | Tailwind v4 | Cloudflare Pages |
| Read Out Loud | Vanilla JS | N/A | Custom CSS | Cloudflare Pages |
| TPL | Vanilla HTML | N/A | Custom CSS | GitHub Pages |

---

## Working in This Monorepo

### Step 1: Identify the Project

When you receive a task, first determine which project it belongs to. Look for:
- Directory paths in the request
- Project names mentioned
- Tech stack clues (e.g., "the Next.js app" = F_This_App)
- Feature context (e.g., "BJJ journal" = TOMO, "library search" = Scout)

### Step 2: Read Project-Specific CLAUDE.md

If the project has its own `CLAUDE.md`, read it before making changes:
- `/TOMO/CLAUDE.md` - Comprehensive guide with design system, voice, deployment
- `/gather/CLAUDE.md` - Routing guide: points to PRD, feature specs, brand guide, business model
- `/scout/tpl/CLAUDE.md` - Style requirements, deployment, HTML conversion rules
- `/fhm/CLAUDE.md` - Project overview, brand voice, content guides

### Step 3: Understand Project Conventions

Each project may have different:
- Code style and linting rules
- Deployment processes
- Design systems
- Brand voice guidelines

---

## Directory Structure

```
drew-garraway-consulting/
├── Active Projects
│   ├── TOMO/                    # BJJ training journal (iOS Expo app)
│   ├── scout/                   # Library discovery AI
│   │   ├── tpl/                 # Tredyffrin printer help site
│   │   └── pitches/             # Scout pitch deck
│   ├── gather/                  # Farmers market platform
│   │   └── _reference/          # Locally Strong (predecessor site)
│   ├── fhm/                     # Personal finance site
│   ├── f_this_app/              # Social game app
│   ├── read-out-loud/           # Text-to-speech PWA
│   └── kaijutsu/                # Landing page only
│
├── Supporting
│   ├── _archived/               # 25+ archived projects (ignore)
│   └── docs/                    # Repo-level docs
│
├── Root Static Site
│   ├── index.html               # drewgarraway.com landing
│   ├── sitemap.xml
│   └── robots.txt
│
└── Configuration
    ├── .eslintrc.base.json      # Shared ESLint config
    └── .prettierrc.base.json    # Shared Prettier config
```

---

## Common Patterns Across Projects

### Styling Preferences
- **No emojis** in UI unless user explicitly requests
- **Dark themes** preferred for apps (TOMO, F_This_App)
- **Accessibility** - WCAG 2.1 AA minimum
- **Touch targets** - 44px minimum for interactive elements

### Code Preferences
- TypeScript for all React projects
- Functional components with hooks
- Explicit types, avoid `any`
- Descriptive variable names

### Deployment
- Most projects auto-deploy on push to `main`
- Check individual project README or CLAUDE.md for specific commands

---

## Deployment Architecture

All projects use **Cloudflare Pages** with automatic deployments via GitHub integration, with **GitHub Actions** providing quality gates on pull requests.

### Deployment Flow

```
PR opened → GitHub Actions (build/test/lint) → Pass → Merge → Cloudflare auto-deploy → Live
```

### CI/CD Configuration

Quality checks are defined in `.github/workflows/pr-checks.yml`:

| Project | Checks Run |
|---------|------------|
| TOMO | build, lint |
| Scout | build, lint |
| F_This_App | build, lint |
| Gather | build, lint |
| FHM | build, lint |

### Manual Deployment

```bash
# Scout
cd scout && npm run deploy

# F This App
cd f_this_app && npm run build && npm run pages:build && npm run pages:deploy

# FHM
cd fhm && npm run build && wrangler pages deploy public --project-name=fhm

# Root site
wrangler pages deploy _site --project-name=drewgarraway
```

---

## Workflow Commands

When the user asks to "test", "review", "stage", "launch", etc., follow these processes:

### "Test" / "Run Tests"

1. Identify the project
2. Run the project's test command:
   ```bash
   cd <project> && npm run test
   ```
3. If no test script exists, run type checking:
   ```bash
   npm run build  # catches TypeScript errors
   ```
4. Report results clearly

### "Review" / "Code Review"

1. Run `git status` and `git diff` to see all changes
2. Check for TypeScript errors, lint issues, test failures
3. Summarize changes and flag any concerns
4. If all checks pass, confirm ready for PR

### "Stage" / "Staging" / "Preview"

1. Create a feature branch if not already on one
2. Commit changes with descriptive message
3. Push to remote — Cloudflare auto-creates preview URL
4. Share the preview URL with user

### "Launch" / "Deploy" / "Ship" / "Go Live"

1. Ensure all changes are committed
2. Verify CI checks pass
3. Merge PR to `main` — triggers auto-deploy
4. Share production URL with user

### "Commit" / "Save"

1. Run `git status` and `git diff` to review
2. Stage relevant files
3. Create commit with descriptive message
4. Do NOT push unless explicitly asked

---

## When Unsure

If you can't determine which project a task belongs to, ask:

> "This monorepo contains multiple projects. Which project should I work in?
> - TOMO (BJJ journal)
> - Scout (library search)
> - Gather (farmers market)
> - FHM (finance education)
> - F_This_App (social game)
> - Read Out Loud (text-to-speech)
> - Or the root site (drewgarraway.com)?"

---

## Project-Specific Instructions

| Project | Key Docs |
|---------|----------|
| TOMO | `/TOMO/CLAUDE.md`, `/TOMO/docs/` |
| Scout | `/scout/README.md`, `/scout/tpl/CLAUDE.md` |
| Gather | `/gather/README.md`, `/gather/docs/` (local-only) |
| FHM | `/fhm/CLAUDE.md` |
| Others | Check `README.md` in project directory |
