# Drew Garraway Consulting - Monorepo Context for Claude

## What This Is

This is a multi-project monorepo containing client work, personal projects, and consulting deliverables. Each project is independent with its own tech stack, deployment, and documentation.

**Before working on any task, identify which project you're in.** If unclear, ask.

---

## Project Directory

| Project | Directory | Description | Has CLAUDE.md |
|---------|-----------|-------------|---------------|
| **TOMO** | `/TOMO/` | BJJ training journal - voice-first mobile app | Yes |
| **TOMO_voice** | `/TOMO_voice/` | Voice-first BJJ transcription app | Yes |
| **Scout** | `/scout/` | AI library discovery system for Tredyffrin Libraries | Yes |
| **FHM** | `/fhm/` | Franklin Hugh Money - securities exam prep & finance insights | Yes |
| **CareerChat** | `/career-chat/` | AI career chatbot about Drew's background | Yes |
| **F_This_App** | `/f_this_app/` | Next.js social game app | Yes |
| **Mikey-real** | `/Mikey-real/` | PA flashcard PWA with offline support | Yes |
| **Cool Curriculum** | `/cool-curriculum/` | AI lesson planner for K-4 educators | Yes |
| **Prompt Property** | `/prompt-property/` | AI assistant for property managers | Yes |
| **TPL** | `/tpl/` | Tredyffrin Libraries printer documentation | Yes |
| **Gather** | `/gather/` | Instacart for farmers markets - B2B2C marketplace | Yes |
| **Read Out Loud** | `/read-out-loud/` | Text-to-speech PWA for reading documents | Yes |
| **Agency** | `/agency/` | Agency Brewing brand assets and style guide | Yes |
| **Locally Strong** | `/locally-strong/` | Nonprofit website for local community empowerment | Yes |
| **Alliance Small Kids** | `/alliance-small-kids-class/` | Alliance BJJ kids curriculum proposal (ages 4-8) | Yes |
| **Luka** | `/luka/` | PAGEONE Accounting & Finance website | Yes |

---

## Quick Reference: Tech Stacks

| Project | Framework | Build | Styling | Deployment |
|---------|-----------|-------|---------|------------|
| **Root Site** | Static HTML | None | Inline CSS | Cloudflare Pages |
| TOMO | React 19 + TS | Vite | CSS Variables | Cloudflare Pages |
| TOMO_voice | React 19 + TS | Vite | CSS Variables | Cloudflare Pages |
| Scout | React 18 + TS | Vite | Tailwind | Cloudflare Pages |
| FHM | Vanilla HTML/CSS/JS | Node scripts | Custom CSS | Cloudflare Pages |
| CareerChat | React 18 + TS | Vite | Custom CSS | Cloudflare Pages |
| F_This_App | Next.js 16 + TS | Next.js | Tailwind v4 | Cloudflare Pages |
| Mikey-real | React 19 + TS | Vite | Tailwind v4 | Cloudflare Pages |
| Cool Curriculum | React 19 + TS | CRA | Tailwind | TBD |
| Prompt Property | Vanilla JS | N/A | CSS3 | TBD |
| TPL | Vanilla HTML | N/A | Custom CSS | GitHub Pages |
| Gather | Next.js 14 | Next.js | Tailwind | TBD |
| Read Out Loud | Vanilla JS | N/A | Custom CSS | Cloudflare Pages |
| Agency | Static HTML | N/A | Custom CSS | N/A |
| Locally Strong | Static HTML | Tailwind CLI | Tailwind | Cloudflare Pages |
| Alliance Small Kids | Static HTML | N/A | Inline CSS | Cloudflare Pages |
| Luka | Static HTML | Tailwind CLI | Tailwind + Alpine.js + GSAP | Cloudflare Pages |

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
- `/gather/CLAUDE.md` - Complete context: product, personas, architecture, brand, business model
- `/tpl/CLAUDE.md` - Style requirements, deployment, HTML conversion rules
- `/fhm/CLAUDE.md` - Project overview, brand voice, content guides

### Step 3: Understand Project Conventions

Each project may have different:
- Code style and linting rules
- Deployment processes
- Design systems
- Brand voice guidelines

---

## Directory Structure Overview

```
drew-garraway-consulting/
├── Active Projects
│   ├── TOMO/                    # BJJ training journal
│   ├── TOMO_voice/              # Voice-first BJJ journal (new)
│   ├── scout/                   # Library discovery AI
│   ├── fhm/                     # Personal finance site
│   ├── career-chat/             # Career chatbot
│   ├── f_this_app/              # Social game app
│   ├── Mikey-real/              # Flashcard PWA
│   ├── cool-curriculum/         # Lesson planner
│   ├── prompt-property/         # Property assistant
│   ├── gather/                  # Farmers market platform
│   ├── tpl/                     # Printer documentation
│   ├── read-out-loud/           # Text-to-speech PWA
│   ├── agency/                  # Agency Brewing brand guide
│   ├── alliance-small-kids-class/ # BJJ kids curriculum
│   └── luka/                    # Financial services website
│
├── Supporting Directories
│   ├── _archived/               # Previous versions (ignore)
│   ├── docs/                    # Repo-level docs
│   ├── scripts/                 # Repo-level automation
│   ├── pitches/                 # Business pitches
│   └── roofing/                 # Roofing checklist deliverable
│
├── Root Static Site
│   ├── index.html               # drewgarraway.com landing
│   ├── products.html
│   ├── resume.html
│   └── contact.html
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

### How It Works

**Pull Requests:**
1. Open a PR to `main`
2. GitHub Actions runs build/test/lint for changed projects
3. PR is blocked if checks fail
4. Merge when checks pass

**Deployments:**
1. Merge PR to `main`
2. Cloudflare Pages auto-detects changes
3. Builds and deploys to production

### Deployment Flow

```
PR opened → GitHub Actions (build/test/lint) → ✓ Pass → Merge → Cloudflare auto-deploy → Live
                                             → ✗ Fail → Fix issues → Re-run
```

### CI/CD Configuration

Quality checks are defined in `.github/workflows/pr-checks.yml`:

| Project | Checks Run |
|---------|------------|
| TOMO | build, lint |
| Scout | build, lint |
| Career-Chat | build, test, lint |
| F_This_App | build, lint |
| Mikey-real | build, lint |
| Cool Curriculum | build |
| Gather | build, lint |
| Luka | build |
| FHM | build, lint |

**Key features:**
- Only runs checks for projects with changes (fast)
- Runs checks in parallel
- Uses npm caching for speed
- Cancels in-progress runs when new commits are pushed

### Production Deploys

- Deploys complete in ~1-2 minutes after merge
- No cache purging needed - Cloudflare handles automatically
- Check deployment status in the Cloudflare Pages dashboard

### Manual Deployment

Each project can also be deployed manually (requires wrangler CLI):

```bash
# TOMO
cd TOMO/prototype && npm run build && wrangler pages deploy dist --project-name=bjjj

# Scout
cd scout && npm run deploy

# F This App
cd f_this_app && npm run build && npm run pages:build && npm run pages:deploy

# FHM
cd fhm && npm run build && wrangler pages deploy public --project-name=fhm

# Root site
wrangler pages deploy _site --project-name=drewgarraway

# Luka
cd luka && npm run build && wrangler pages deploy . --project-name=luka
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
2. Check for:
   - TypeScript errors (`npm run build`)
   - Lint issues (`npm run lint`)
   - Test failures (`npm run test`)
3. Summarize changes and flag any concerns
4. If all checks pass, confirm ready for PR

### "Stage" / "Staging" / "Preview"

1. Create a feature branch if not already on one:
   ```bash
   git checkout -b feature/<name>
   ```
2. Commit changes with descriptive message
3. Push to remote:
   ```bash
   git push -u origin <branch>
   ```
4. Open a PR to `main` - Cloudflare auto-creates preview URL
5. Share the preview URL with user

### "Launch" / "Deploy" / "Ship" / "Go Live"

1. Ensure all changes are committed
2. Verify CI checks pass:
   - If on feature branch: merge PR to `main`
   - If on `main`: push triggers auto-deploy
3. Confirm deployment in Cloudflare Pages dashboard
4. Share production URL with user

### "Commit" / "Save"

1. Run `git status` to see changes
2. Run `git diff` to review what changed
3. Stage relevant files
4. Create commit with descriptive message
5. Do NOT push unless explicitly asked

### "Push" / "PR" / "Pull Request"

1. Ensure changes are committed
2. Push to remote branch
3. If PR requested, create via `gh pr create`
4. Share PR URL with user

---

## When Unsure

If you can't determine which project a task belongs to, ask:

> "This monorepo contains multiple projects. Which project should I work in?
> - TOMO (BJJ journal)
> - Scout (library search)
> - FHM (finance education)
> - [other project]
> - Or are you working on the root site?"

---

## Project-Specific Instructions

For detailed instructions, read the project's own documentation:

| Project | Key Docs |
|---------|----------|
| TOMO | `/TOMO/CLAUDE.md`, `/TOMO/docs/design-system/` |
| Scout | `/scout/README.md` |
| FHM | `/fhm/CLAUDE.md`, `/fhm/content/series-7/CLAUDE.md` |
| TPL | `/tpl/CLAUDE.md` |
| Luka | `/luka/CLAUDE.md` |
| Others | Check `README.md` in project directory |
