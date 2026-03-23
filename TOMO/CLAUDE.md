# TOMO (友) - BJJ Training Journal - Project Context for Claude

---

## Session Tracking (MANDATORY)

> **Every Claude Code session that modifies code MUST update the tracking files before finishing.**

**Location:** `docs/mvp-1.0/tracking/`

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | What changed, why, and how it was verified |
| `ISSUES.md` | Active bugs, blockers, and feature requests |

### At the END of every session:

1. **Update `CHANGELOG.md`** — Add a dated entry with all changes made this session. Include type (Build/Fix/Polish/Refactor/Feature), what changed, why, and how it was tested.
2. **Update `ISSUES.md`** — Add any new bugs or issues discovered. Mark resolved items as Done. Move completed items to the Completed section.
3. **Run `npx tsc --noEmit`** before closing to verify no TypeScript errors.
4. **Recommend testing path** — Tell Drew whether to test locally or deploy to TestFlight (see Testing & Deployment below).

### At the START of every session:

1. **Read `ISSUES.md`** — Check for blockers and open bugs before starting new work.
2. **Read the latest entry in `CHANGELOG.md`** — Understand what was done last.

---

## Testing & Deployment (MANDATORY)

> **Drew is a vibe coder. Always tell him which testing path to use and why.**

### Two Testing Paths

| Path | Command | Speed | When to Use |
|------|---------|-------|-------------|
| **Local Dev** | `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device` | Instant (hot reload) | During development — every code change |
| **TestFlight** | `bash build.sh` | 20-30 min | Milestones only — when testers need a new version |

### When to Recommend LOCAL Testing

Recommend local testing when:
- Any code change was just made (UI, logic, bug fix, feature)
- Drew wants to see/verify changes immediately
- Work is still in progress or experimental
- Only Drew needs to see the result

Say: **"Run this locally to test — no need for TestFlight yet."**

### When to Recommend TESTFLIGHT Deployment

Recommend TestFlight **only** when ALL of these are true:
1. **TypeScript clean** — `npx tsc --noEmit` passes with zero errors
2. **Feature complete** — The change set is a coherent milestone (not half-finished)
3. **Locally tested** — Drew has verified the changes work on his phone
4. **Testers need it** — Other people need to try the new version

Say: **"This looks ready for TestFlight. Want me to run `bash build.sh` to ship it to your testers?"**

### Never Auto-Deploy

- **NEVER** run `build.sh` without Drew's explicit approval
- **NEVER** suggest TestFlight for a single bug fix or small tweak — local test first
- **ALWAYS** confirm the testing path at the end of a session

### TestFlight Deploy Process

Full guide: `docs/mvp-1.0/DEPLOYMENT_GUIDE.md`

```
bash build.sh    # Builds IPA + submits to TestFlight (~20-30 min)
```

- Build number auto-increments
- Internal testers get it within minutes
- External testers may wait 24-48h (first build to a new group only)
- All credentials are pre-configured — no manual steps needed

---

## Project Overview

BJJ Journal is a voice-first training journal app for Brazilian Jiu-Jitsu practitioners. The app helps users log training sessions, track belt progression, and build a personal technique library.

**Core Value Proposition:** Capture training insights at the critical post-training moment when information is fresh but users are exhausted.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 with custom design tokens (design system in `/prototype/src/index.css`)
- **State Management:** React Context (UserProfileContext)
- **Storage:** localStorage (prototype), API-ready patterns
- **No external UI libraries** - custom components only
- **Hosting:** Cloudflare Pages (bjjj.pages.dev)

---

## Archived Files - DO NOT USE

> **CRITICAL FOR AI AGENTS:** Any folder named `_archived/` contains historical documents that are **NOT** for production use.

**Ignore these locations:**
- `/docs/product/_archived/` - Superseded product specs
- `/prototype/src/components/features/_archived/` - Unused component implementations
- `/prototype/src/data/_inactive/` - Spec files not yet integrated

When working on TOMO, **only use active documentation**. If you encounter an `_archived` folder, do not read or reference its contents for current development work.

**Active documentation locations:**
- `/docs/product/` (excluding `_archived/`)
- `/docs/project/`
- `/docs/research/`
- `/docs/design-system/`
- `/docs/personas/`

---

## CRITICAL: Data Integrity Rules

> **NEVER FABRICATE DATA.** This is a non-negotiable rule.

### What This Means:

1. **External IDs must be verified** - YouTube video IDs, API keys, URLs, database IDs, or any external reference must be confirmed to exist before adding to the codebase. Never generate plausible-looking IDs.

2. **If you can't verify, don't add it** - If a data source cannot be validated through web search, API, or direct confirmation, do NOT add it. Flag it for manual verification instead.

3. **Document uncertainty** - If data quality is uncertain, add a comment like `// NEEDS_VERIFICATION: [reason]` so it can be reviewed.

4. **Prefer gaps over fabrication** - It's better to have incomplete data than fake data. Leave fields empty or use explicit placeholders like `PLACEHOLDER_NEEDS_REAL_ID` rather than inventing values.

### Video Database Specific Rules:

For `/prototype/src/data/techniqueVideos.ts`:
- Every `youtube_id` must link to a real, working YouTube video
- The video content must actually teach the technique it's assigned to
- Verify by fetching the video page or using YouTube Data API
- If unable to verify, mark with `youtube_id: 'NEEDS_VERIFICATION'`

### Why This Matters:

Fabricated data causes:
- Broken user experiences (dead links, 404s)
- Lost trust in the product
- Wasted debugging time
- Potential legal/copyright issues with misattributed content

---

## Development Process (PROTOTYPE PHASE)

> **IMPORTANT:** This process is for the prototype phase only. It will change when we move to App Store deployment or backend development.

### Where Code Lives

```
LOCAL (your laptop)  →  REMOTE (GitHub)  →  PRODUCTION (live site)
    npm run dev           git push            wrangler deploy
   localhost:5173                            bjjj.pages.dev
```

### One-Command Deploy: `npm run ship`

**This is the standard workflow.** From the `/prototype` directory:

```bash
npm run ship
```

This single command runs the full pipeline:
1. **Build** - Compiles TypeScript, catches errors
2. **Lint** - Runs ESLint, catches code quality issues
3. **Commit** - Stages all changes, auto-generates timestamped commit
4. **Push** - Pushes to `main` branch on GitHub
5. **Deploy** - Deploys to Cloudflare Pages via Wrangler
6. **Confirm** - Prints success message with live URL

**If any step fails, the pipeline stops.** Broken code never reaches production.

### Custom Commit Messages

When you need a descriptive commit message instead of auto-generated:

```bash
npm run ship:m "Add new feature" && git push origin main && npm run deploy
```

### All Available Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server at localhost:5173 |
| `npm run build` | Compile TypeScript + Vite build |
| `npm run lint` | Run ESLint checks |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy `dist/` to bjjj.pages.dev |
| `npm run ship` | **Full pipeline:** build → lint → commit → push → deploy |
| `npm run ship:m "msg"` | Build + lint + commit with custom message (then push/deploy manually) |

### Local Testing

1. Run `npm run dev` to start local server
2. Test changes at http://localhost:5173
3. When satisfied, run `npm run ship` to deploy

### Testing Belt Personalization

1. Go to Profile (tap avatar top-right)
2. Tap "Settings" at bottom
3. Use Demo Mode belt switcher
4. Select White / Blue / Purple / Brown
5. Navigate app to see personalized content

---

## Belt Personalization System (PRIORITY)

> **Built Dec 2024** - Use this system to personalize ALL user-facing features.

A comprehensive belt-aware personalization engine exists at `/prototype/src/config/belt-system/`. **Leverage this in all new feature work.**

**Key Documentation:**
- **Integration Spec:** `/docs/product/BELT_INTEGRATION_SPEC.md` — Per-page contracts, implementation status, code patterns
- **Psychology System:** `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` — Full belt profiles, risk signals, journal patterns

### Quick Access
```typescript
import { useBeltPersonalization } from '@/hooks';

const { profile, dashboard, chatbot, videoTutorials, analyzeJournal } = useBeltPersonalization();
```

### What It Provides
- **Belt Psychology Profiles** - Struggles, motivations, plateaus per belt
- **Feature Adaptations** - Dashboard, session logger, chatbot, video recommendations
- **Risk Detection** - Dropout warning signs with belt-specific interventions
- **Journal Analysis** - Detect ego challenges, breakthroughs, injuries in text

### Priority Integration Points
1. **Chatbot/AI responses** - Use `chatbot.toneProfile`, `chatbot.technicalVocabulary`
2. **Video suggestions** - Use `videoTutorials.recommendedCategories`
3. **Dashboard metrics** - Use `dashboard.primaryMetric`, `dashboard.insightFocus`
4. **Post-session messages** - Use `sessionLogger.postSessionMessage`

See `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` for full documentation.

---

## Project Structure

```
/prototype/src/
├── components/
│   ├── features/          # Feature components (screens)
│   │   ├── Dashboard.tsx
│   │   ├── SessionLogger.tsx    # Primary logger (wraps VoiceFirstLogger)
│   │   ├── VoiceFirstLogger.tsx # Active voice logging implementation
│   │   ├── SessionHistory.tsx
│   │   ├── SessionDetail.tsx
│   │   ├── BeltProgress.tsx
│   │   ├── TechniqueLibrary.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── Settings.tsx
│   │   └── _archived/     # Unused alternative loggers
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── TabBar.tsx
│   └── ui/                # Reusable UI primitives
│       ├── Icons.tsx      # 95+ SVG icons
│       ├── StatCard.tsx, BeltBadge.tsx, ProgressRing.tsx
│       ├── ErrorState.tsx, EmptyState.tsx, Skeleton.tsx
│       └── Toast.tsx, NotFound.tsx
├── config/
│   ├── app.ts             # App config, feature flags
│   └── belt-system/       # Belt personalization engine
├── hooks/
│   └── useBeltPersonalization.ts
├── context/
│   └── UserProfileContext.tsx
├── data/                  # Mock data
│   ├── techniques.ts, progress.ts, journal.ts, users.ts
│   └── _inactive/         # Spec files not yet integrated
├── services/              # API abstraction (Supabase-ready)
├── types/                 # TypeScript definitions
├── utils/                 # Helper functions
├── App.tsx
└── index.css              # Design system CSS

/docs/                     # All documentation
├── design-system/         # Source of truth for UI
├── product/               # Feature specs, belt personalization
├── project/               # Status, feature tracker
├── deployment/            # iOS plans, GTM
├── personas/              # User profiles
├── research/              # Market research
└── brand/                 # Voice guidelines
```

## Brand Voice: "The Dedicated Training Partner"

Our app speaks like a knowledgeable, warm, and grounded training partner:

- **Knowledgeable** - Understands BJJ terminology and culture
- **Warm** - Supportive without being patronizing
- **Direct** - Clear, concise communication
- **Grounded** - Honest feedback, no false praise
- **Supportive** - Celebrates progress, encourages consistency

### Writing Style
- Use active voice
- Use BJJ terminology naturally
- Celebrate consistency over perfection
- Never use hollow superlatives ("Amazing job!")
- **Session logging:** Ultra-concise (90-second window)
- **Stats/Techniques/Journal:** Longer content OK—users are browsing leisurely

## Design System

> **CRITICAL: Source of Truth**
>
> The authoritative design system lives in `/docs/design-system/`. All UI decisions MUST reference these files:
>
> | File | Purpose |
> |------|---------|
> | `tokens.md` | Complete design token reference (colors, typography, spacing) |
> | `styles.css` | Production-ready CSS with all tokens and components |
> | `index.html` | Interactive design system browser (open in browser) |
> | `icons.html` | Full icon library (95+ icons) |
> | `typography.html` | Typography demonstrations |
>
> **When making UI changes, Claude MUST:**
> 1. Reference `/docs/design-system/tokens.md` for correct values
> 2. Use existing CSS classes from `/docs/design-system/styles.css`
> 3. Never invent new colors, spacing, or typography values

### Design Principles (Non-Negotiable)

1. **NO EMOJIS** - Use SVG lineart icons from `Icons.tsx` only
2. **Dark Theme** - `#111111` background with gold accents
3. **Large Typography** - Hero numbers up to 144-180px
4. **Semantic Colors** - GREEN = positive, RED = negative (never swap)
5. **Full-Bleed Sections** - Minimal rounded corners, gradient backgrounds
6. **Unbounded + Inter + JetBrains Mono** - Unbounded for headlines/numbers, Inter for body, JetBrains Mono for labels
7. **Font Weight 500+ Only** - Weight 400 is PROHIBITED (too thin for dark backgrounds)
8. **12px Minimum Font Size** - Nothing smaller, ever

### Quick Token Reference

See `/docs/design-system/tokens.md` for complete reference. Key values:

**Primary Colors:**
- `--color-black`: `#111111` (background)
- `--color-gold`: `#F5A623` (accent)
- `--color-positive`: `#22c55e` (wins, success)
- `--color-negative`: `#ef4444` (losses, errors)

**Typography:**
- Hero Numbers: Unbounded, weight 800-900 (for stats 72px+)
- Headlines: Unbounded, weight 700-800 (page titles, section headers)
- Body: Inter, weight 500 (Medium) - REQUIRED MINIMUM
- Labels: JetBrains Mono, weight 500-600

**Spacing (4px base unit):**
- `--space-xs`: 4px | `--space-sm`: 8px | `--space-md`: 16px
- `--space-lg`: 24px | `--space-xl`: 32px | `--space-2xl`: 48px

**Touch Targets:**
- Primary actions: 56-80px minimum
- Secondary actions: 44px minimum

### Component Classes

Use existing classes from the design system. Key patterns:

```css
/* Stat displays */
.stat-cell, .stat-cell--positive, .stat-cell--negative
.stat-label, .stat-value

/* Buttons */
.btn, .btn-primary, .btn-dark, .btn-outline
.btn-positive, .btn-negative

/* Badges */
.belt-badge, .belt-white, .belt-blue, .belt-purple, .belt-brown
.training-badge, .training-gi, .training-nogi

/* Callouts */
.callout, .callout--positive, .callout--negative

/* Forms */
.form-group, .form-label, .form-input, .form-textarea
```

### Icon Usage

```tsx
import { Icons } from '@/components/ui/Icons';

<Icons.Check size={24} />
<Icons.Trophy size={24} color="var(--color-gold)" />
```

See `/docs/design-system/icons.html` for the full 95+ icon library.

### Propagation: Design System → Code

When the design system is updated:
1. Update `/docs/design-system/styles.css` first
2. Sync changes to `/prototype/src/index.css`
3. Update `/prototype/src/config/design-tokens.ts` if tokens change
4. This file (CLAUDE.md) reflects the summary, not the source

**The design system is the source. Code implements it. Never the reverse.**

## User States: Context-Aware Design

### Understanding User Context by Feature

**CRITICAL:** Users exist in different states depending on what they're doing. Design must match their context.

| Feature Area | User State | Time Tolerance | Design Approach |
|--------------|------------|----------------|-----------------|
| **Session Logging** | EXHAUSTED | 90 seconds max | Minimal friction, voice-first, one question at a time |
| **Stats/Dashboard** | RELAXED | Unlimited | Rich data, deep dives, multiple visualizations welcome |
| **Techniques Library** | RELAXED | Unlimited | Detailed content, searchable, comprehensive |
| **Journal/History** | RELAXED | Unlimited | Full entries, filtering, exploration encouraged |
| **Profile/Settings** | RELAXED | Moderate | Standard forms, can handle complexity |

---

### The Exhausted User (Session Logging ONLY)

**This principle applies ONLY to the session logging flow—when users are capturing data immediately post-training.**

**Physical/cognitive state during logging:**
- Physically exhausted, elevated heart rate
- Cognitively fatigued (20-40% reduced decision-making)
- Sweaty, possibly still in gym parking lot
- Motivated but with 90-second tolerance window
- Hands may be swollen, grip depleted

### Session Logging Design Mandates

1. **Touch targets:** 56-80px minimum for primary actions
2. **One question at a time:** Don't overwhelm
3. **Voice-first:** Typing is a fallback, not primary
4. **Skip always available:** Never force non-critical input
5. **Instant feedback:** Show what was captured immediately
6. **Generous defaults:** Pre-fill when possible
7. **Forgiving input:** Parse natural language, don't require formats

---

### The Relaxed User (Stats, Techniques, Journal)

**When users browse Stats, Techniques, or Journal pages, they are:**
- At home, on the couch, or commuting
- Curious about their progress
- Not time-pressured
- Wanting depth, detail, and insight
- Able to handle complexity and exploration

### Browse Mode Design Principles

1. **Rich visualizations welcome:** Charts, graphs, timelines—users want to explore
2. **Deep information hierarchies:** Multiple sections, expandable details
3. **Dense data displays:** Show more, not less—users are engaged
4. **Progressive disclosure optional:** Users can handle seeing everything
5. **Long-form content OK:** Coaching text, technique descriptions, historical analysis
6. **Standard touch targets:** 44px minimum is fine for relaxed browsing

## Key Patterns

### Onboarding (MVP 1.0)
MVP uses **full upfront onboarding** (~60 seconds), not progressive profiling:
- Screen 1: Welcome
- Screen 2: Name, belt, stripes
- Screen 3: Gym picker, target frequency, optional goals + experience
- Screen 4: Logging preference (voice/text), mic permission

Progressive profiling (collecting data over ~20 sessions) is a **v1.1+ consideration**.
See `docs/mvp-1.0/FEATURE_SPEC.md` for exact onboarding spec.

### Session Logging Flow
1. User taps "Log Session"
2. SessionLogger opens (respects preference: voice or text)
3. Voice: Conversational prompts, one at a time
4. Text: Single textarea, smart parsing, confirmation chips
5. Review screen with edit capability
6. Success confirmation
7. Increment session count for progressive profiling

### Section-Based Editing
When editing saved sessions:
- Use `EditSheet` (bottom sheet modal)
- Section-specific edit components in `EditSections.tsx`
- Staged changes with save/discard
- Large touch targets for fatigued users

## User Personas

> **Canonical Source:** `/docs/personas/PERSONA_PROFILES.md`

### Primary Personas (6 Test Profiles)

| Key | Name | Belt | Age | Archetype | Status |
|-----|------|------|-----|-----------|--------|
| `white-excelling` | Jake Thompson | White (3 str) | 26 | The Natural | Thriving |
| `white-at-risk` | David Morrison | White (2 str) | 52 | The Late Starter | Struggling |
| `blue-excelling` | Marcus Chen | Blue (2 str) | 34 | The Dedicated Hobbyist | Progressing |
| `blue-at-risk` | Ryan Torres | Blue (1 str) | 31 | The Fading Fire | Declining |
| `purple-average` | Sofia Rodriguez | Purple (1 str) | 28 | The Grinder | Stable |
| `brown-average` | Elena Kim | Brown (2 str) | 38 | The Veteran | Refined |

### User State During Session Logging
When logging a session (immediately post-training):
- Decision fatigue is real
- Fine motor control is reduced
- Attention span is minimal
- Wants to be DONE, not engaged

**Note:** This state does NOT apply to Stats, Techniques, or Journal browsing. See "User States: Context-Aware Design" above.

## MVP Status

### Web Prototype: ✅ COMPLETE (Production Ready)

**Core Features:**
- **Dashboard** - Stats, recent sessions, insights grid
- **Session Logging** - Voice and text logging with smart parsing
- **Session History** - Filterable list with detail views
- **Belt Progress** - Visual progression tracking
- **Technique Library** - Searchable technique catalog
- **Profile/Settings** - Progressive profiling, preferences

**UI Components:**
- **Error States** - Network, validation, permission, generic variants
- **Empty States** - Sessions, techniques, goals, search variants
- **Loading Skeletons** - Dashboard, session cards, stat cards
- **Toast Notifications** - Success, error, warning, info types
- **404 NotFound** - Fallback screen with navigation

**Infrastructure (iOS-Ready):**
- **API Service Layer** - Abstracts localStorage, swap to Supabase with zero changes
- **Auth Service** - Mock auth, ready for Supabase Auth + Apple Sign-In
- **Type Definitions** - Match planned Supabase database schema
- **Utility Functions** - Date, color, validation, accessibility helpers

**Accessibility:**
- Keyboard navigation (arrow keys in TabBar)
- ARIA labels on all interactive elements
- Focus states for buttons
- Screen reader support

### Next Phase: iOS TestFlight (MVP 1.0)
See `docs/mvp-1.0/` for the current implementation plan (supersedes old deployment docs).
Pre-built files ready in `mobile-prep/` — see `mobile-prep/README.md`.

## Development Guidelines

### Component Patterns
- Functional components with hooks
- Props interfaces at top of file
- Inline styles using CSS variables
- No external CSS files per component

### State Management
- Use `UserProfileContext` for profile data
- Local state for UI-only concerns
- Mock data in `/data/` directory

### Naming Conventions
- Components: PascalCase (`BeltProgress.tsx`)
- Functions: camelCase (`handleSave`)
- CSS variables: kebab-case (`--color-primary`)
- Types/Interfaces: PascalCase (`interface SessionData`)

### Code Style
- Explicit types, avoid `any`
- Descriptive variable names
- Comments for complex logic only
- Keep components focused (single responsibility)

## Testing Notes

The prototype uses mock data throughout. Key mock files:
- `mockTechniques` - 50 BJJ techniques
- `mockTechniqueProgress` - User's proficiency data
- `mockBeltHistory` - Promotion timeline
- `mockJournalEntries` - Training sessions
- `mockProgressSummary` - Belt progress stats

## Research Documents

See `/docs/research/USER_PERSONAS_AND_RESEARCH.md` for:
- Detailed user personas
- Market research data
- BJJ demographic statistics
- Persona-driven conversation design examples
- Training frequency benchmarks by age

---

## iOS MVP 1.0 — TestFlight (Active Plan)

> **Source of truth:** `docs/mvp-1.0/` (README, FEATURE_SPEC, SHIP_PLAN, SESSION_NOTES)
> **Pre-built files:** `mobile-prep/` (README has full inventory and setup guide)
> **Old deployment docs:** `docs/deployment/` — SUPERSEDED, kept for reference only

### Technology Decisions (Decided March 7, 2026)
| Layer | Technology | Status |
|-------|------------|--------|
| Mobile App | React Native + Expo (managed workflow) | Pre-built config ready |
| Database | Supabase (PostgreSQL) | Migration SQL ready |
| Auth | Supabase Auth (Email + Apple Sign-In) | Auth hook ready |
| Voice Transcription | AssemblyAI (180 BJJ terms word_boost) | Edge Function ready |
| AI Extraction | Claude Haiku 4.5 (via Edge Function) | Edge Function ready |
| Audio Storage | Supabase Storage (private bucket, signed URLs) | RLS policies ready |
| Crash Reporting | Sentry | Config in app.config.ts |
| iOS Builds | Expo EAS | Not started |
| Web Hosting | Cloudflare Pages | **Active** (bjjj.pages.dev) |

### Key MVP Decisions
- **Bundle ID:** `com.drewgarraway.tomo`
- **iOS target:** 16.0
- **Data model:** `trainingMode` + `sessionKind` (not old `trainingType`)
- **Onboarding:** Full upfront (~60 seconds), not progressive profiling
- **Belt personalization:** Copy/tone/defaults only — no field locking in MVP
- **Audio:** Private bucket, signed URLs, never publicly accessible
- **PostHog:** Excluded from MVP, add post-TestFlight
- **API keys:** All server-side via Edge Functions, none in app binary

### Cost Estimates (Updated March 7, 2026)
| Phase | Monthly Cost |
|-------|--------------|
| Development | ~$99 one-time (Apple Developer Account) |
| TestFlight (10 users) | ~$1.12/month |
| Growth (1,000 users) | ~$200-250/month |

### Key Metrics for TestFlight Success
- App installs on iOS 16+
- Download to first session < 3 minutes
- Voice transcription > 85% accuracy for BJJ terms
- Crash rate < 1%
- Cold start < 3 seconds
- 5+ testers complete 3+ sessions each
- AI extraction edit rate < 30%
