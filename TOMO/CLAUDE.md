# TOMO (友) - BJJ Training Journal - Project Context for Claude

---

## Session Tracking (MANDATORY)

> **Every Claude Code session that modifies code MUST update the tracking files before finishing.**

**Location:** `mvp-1.0/docs/tracking/` (bugs + changelog) and `mvp-1.0/docs/features/` (planned features)

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | What changed, why, and how it was verified |
| `ISSUES.md` | Active bugs, blockers, and feature requests |
| `mvp-1.0/docs/features/README.md` | **Features backlog** - prioritized list of planned features |
| `mvp-1.0/docs/features/<name>/` | Major feature subfolders (strategy, spec, tasks) |

### At the END of every session:

1. **Update `CHANGELOG.md`** - Add a dated entry with all changes made this session. Include type (Build/Fix/Polish/Refactor/Feature), what changed, why, and how it was tested.
2. **Update `ISSUES.md`** - Add any new bugs or issues discovered. Mark resolved items as Done. Move completed items to the Completed section.
3. **Run `npx tsc --noEmit`** before closing to verify no TypeScript errors.
4. **Recommend testing path** - Tell Drew whether to test locally or deploy to TestFlight (see Testing & Deployment below).

### At the START of every session:

1. **Read `ISSUES.md`** - Check for blockers and open bugs before starting new work.
2. **Read the latest entry in `CHANGELOG.md`** - Understand what was done last.

### Work Priority (Active as of March 28, 2026)

> **Design Audit items (DA-/DS- prefixes) take precedence over all other open issues.**

A full UX audit was conducted on 2026-03-28. Findings are in `ISSUES.md` under "ACTIVE PRIORITY: Design Audit". Full report at `mvp-1.0/docs/design-reviews/ux-audit-2026-03-28.md`.

**When picking work, follow this order:**
1. DA- items (P0/P1 first, then P2)
2. DS- items (design system gaps)
3. Features backlog (`mvp-1.0/docs/features/README.md`) - FEAT- items by priority
4. Existing CR-/UX-/INS- items (paused until DA/DS resolved or Drew says otherwise)
5. P3 polish

DA/DS priority override stays in effect until Drew removes it or all DA-/DS- items are resolved. The features backlog is the source of truth for planned work beyond bug fixes.

---

## Testing & Deployment (MANDATORY)

> **Drew is a vibe coder. Always tell him which testing path to use and why.**

### Two Testing Paths

| Path | Command | Speed | When to Use |
|------|---------|-------|-------------|
| **Local Dev** | `cd mvp-1.0/app && SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device` | Instant (hot reload) | During development - every code change |
| **TestFlight** | `cd mvp-1.0/app && bash build.sh` | 20-30 min | Milestones only - when testers need a new version |

### When to Recommend LOCAL Testing

Recommend local testing when:
- Any code change was just made (UI, logic, bug fix, feature)
- Drew wants to see/verify changes immediately
- Work is still in progress or experimental
- Only Drew needs to see the result

Say: **"Run this locally to test - no need for TestFlight yet."**

### When to Recommend TESTFLIGHT Deployment

Recommend TestFlight **only** when ALL of these are true:
1. **TypeScript clean** - `npx tsc --noEmit` passes with zero errors
2. **Feature complete** - The change set is a coherent milestone (not half-finished)
3. **Locally tested** - Drew has verified the changes work on his phone
4. **Testers need it** - Other people need to try the new version

Say: **"This looks ready for TestFlight. Want me to run `bash build.sh` to ship it to your testers?"**

### Never Auto-Deploy

- **NEVER** run `build.sh` without Drew's explicit approval
- **NEVER** suggest TestFlight for a single bug fix or small tweak - local test first
- **ALWAYS** confirm the testing path at the end of a session

### TestFlight Deploy Process

Full guide: `mvp-1.0/docs/DEPLOYMENT_GUIDE.md`

```
cd mvp-1.0/app && bash build.sh    # Builds IPA + submits to TestFlight (~20-30 min)
```

- Build number auto-increments
- Internal testers get it within minutes
- External testers may wait 24-48h (first build to a new group only)
- All credentials are pre-configured - no manual steps needed

---

## Release Notes (MANDATORY)

Every TestFlight build MUST have a release page at traintomo.com/updates/YYYY-MM-DD.

### When to create
After `build.sh` succeeds and the build is submitted to TestFlight.

### How to create
1. Read this session's CHANGELOG.md entry for what shipped
2. Create `site/updates/YYYY-MM-DD/index.html` following the template at `site/updates/_template.html`
3. Write user-facing descriptions (not developer changelog). Translate technical changes into user value.
4. Update `site/updates/index.html` to include the new release in the listing
5. Deploy: `wrangler pages deploy TOMO/site/ --project-name=traintomo --branch=main --commit-dirty=true`
6. Verify: `curl -sL "https://traintomo.com/updates/YYYY-MM-DD" | grep "<title>"`

### Content rules
- Write for users/testers, not developers
- Use benefit language: "You can now..." not "We refactored..."
- Skip refactors, build changes, and infra unless they improve reliability
- Include a "Why this matters" callout for the headline feature
- Badge categories: Intelligence, UX, Design, Polish, Fix
- No developer jargon (no file paths, no function names, no TypeScript)
- BJJ terminology welcome — users are practitioners

### Template reference
See `site/updates/_template.html` for the HTML pattern.

---

## Project Overview

TOMO is a voice-first training journal app for Brazilian Jiu-Jitsu practitioners. The app helps users log training sessions, track belt progression, and build a personal technique library.

**Core Value Proposition:** Capture training insights at the critical post-training moment when information is fresh but users are exhausted.

## Tech Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Mobile App | React Native + Expo (managed workflow) | Live on TestFlight |
| Database | Supabase (PostgreSQL) | Active |
| Auth | Supabase Auth (Email + Apple Sign-In) | Active |
| Voice Transcription | AssemblyAI (180 BJJ terms word_boost) | Active |
| AI Extraction | Claude Haiku 4.5 (via Edge Function) | Active |
| Audio Storage | Supabase Storage (private bucket, signed URLs) | Active |
| Crash Reporting | Sentry | Active |
| iOS Builds | Expo EAS (local builds) | Active |

---

## Archived Files - DO NOT USE

> **CRITICAL FOR AI AGENTS:** Any folder named `_archived/` contains historical documents that are **NOT** for production use.

**Ignore these locations:**
- `_archived/prototype/` - Old web prototype (bjjj.pages.dev). Replaced by the iOS app.
- `_archived/mobile-prep/` - Migration templates used during initial iOS setup.
- `_archived/ux-exploration/` - Pre-MVP UX design workspace.
- `docs/product/_archived/` - Superseded product specs.

When working on TOMO, **only use active files inside `mvp-1.0/`**. If you encounter an `_archived` folder, do not read or reference its contents for current development work.

**Active locations:**
- `mvp-1.0/app/src/` - All source code
- `mvp-1.0/design/` - Brand assets, icons, screen reference
- `mvp-1.0/docs/` - Tracking, features, deployment, design system
- `docs/` - Foundational docs (brand voice, research, personas, legal)

---

## CRITICAL: Data Integrity Rules

> **NEVER FABRICATE DATA.** This is a non-negotiable rule.

1. **External IDs must be verified** - YouTube video IDs, API keys, URLs, database IDs, or any external reference must be confirmed to exist before adding to the codebase. Never generate plausible-looking IDs.

2. **If you can't verify, don't add it** - If a data source cannot be validated through web search, API, or direct confirmation, do NOT add it. Flag it for manual verification instead.

3. **Document uncertainty** - If data quality is uncertain, add a comment like `// NEEDS_VERIFICATION: [reason]` so it can be reviewed.

4. **Prefer gaps over fabrication** - It's better to have incomplete data than fake data. Leave fields empty or use explicit placeholders like `PLACEHOLDER_NEEDS_REAL_ID` rather than inventing values.

---

## CRITICAL: Schema Migration Rules

> **NEVER tighten schema constraints before the corresponding app build is live for every tester.**

Supabase migrations run against prod instantly, but new TestFlight builds take 24-48h to reach external testers (Apple review gate). If you add a `NOT NULL`, `CHECK`, or other tightening constraint to a column before every tester has the app build that populates it, older builds will hit the constraint, fail the write, and strand users.

This exact bug happened with `profiles.birth_date NOT NULL` in the FEAT-008 migration (2026-03-30). External tester Rachel was stuck on the onboarding payoff screen for 7 days because her TestFlight build predated the migration. See CHANGELOG Session 41 (2026-04-08) and ISSUES.md ONB-001 for the full postmortem.

### Rules for every schema change

1. **New fields start nullable.** Always. Add the column with no constraints, ship the app build that populates it, wait for full tester rollout, THEN add `NOT NULL` in a follow-up migration.

2. **Two-phase tightening.** Splitting a schema change into (a) permissive migration + app build, (b) tightening migration is the default. One-shot strict migrations are only acceptable when every client is guaranteed to be on a compatible build (e.g. new installs only, cold cache).

3. **Check external TestFlight approval before tightening.** App Store Connect → TestFlight → External Testing → verify the target build is "Ready to Test" for all external groups. "Waiting for Review" or "In Review" means testers are still on the old build.

4. **Write failures must be loud, not silent.** Any service method that hits the database must throw on error and report to Sentry. Returning null on failure hides migration-mismatch bugs for days. See `profileService.create` for the reference pattern.

5. **Every migration needs a rollback plan** documented in the migration file header. If the constraint tightens, the rollback is usually `DROP NOT NULL` / `DROP CONSTRAINT`.

### Before running `supabase db push` against prod

- [ ] Is this migration additive or tightening?
- [ ] If tightening, are ALL testers on a compatible app build?
- [ ] Does the corresponding app code handle both old and new shapes during the rollout window?
- [ ] Is there a rollback SQL snippet in the migration file header?
- [ ] Are related service methods throwing on errors (not swallowing them)?

---

## Project Structure

```
TOMO/
├── CLAUDE.md                        # This file
├── credentials.local                # API keys (gitignored)
│
├── mvp-1.0/                         # ALL active work lives here
│   ├── app/                         # iOS codebase (React Native + Expo)
│   │   ├── src/
│   │   │   ├── screens/             # All app screens
│   │   │   │   ├── SessionLoggerScreen.tsx    # 5-phase voice logger
│   │   │   │   ├── JournalScreen.tsx          # Session list
│   │   │   │   ├── SessionDetailScreen.tsx    # View/edit saved session
│   │   │   │   ├── InsightsScreen.tsx         # Weekly insights
│   │   │   │   ├── ProfileScreen.tsx          # User profile + settings
│   │   │   │   ├── AuthScreen.tsx             # Sign in / sign up
│   │   │   │   └── onboarding/                # 4 onboarding screens
│   │   │   ├── components/          # Reusable UI (Icons, Toast, GymChip, etc.)
│   │   │   ├── hooks/               # useAuth, useVoiceRecorder, useInsightTypewriter
│   │   │   ├── services/            # Supabase client, insights engine, offline queue
│   │   │   ├── config/              # Design tokens, belt system
│   │   │   ├── data/                # BJJ dictionary, quotes, gym database
│   │   │   ├── types/               # TypeScript definitions
│   │   │   ├── utils/               # Helpers (haptics, logger, text)
│   │   │   └── navigation/          # Tab navigator, onboarding navigator
│   │   ├── supabase/                # Migrations + edge functions
│   │   ├── assets/                  # App icon, splash, fonts
│   │   ├── build.sh                 # TestFlight build script
│   │   ├── app.config.ts            # Expo configuration
│   │   └── eas.json                 # EAS build profiles
│   │
│   ├── design/                      # Visual design assets
│   │   ├── brand/                   # Logos, mark, guidelines
│   │   ├── icons/                   # SVG icon library
│   │   ├── style-guide/             # Design tokens, typography
│   │   └── screens/                 # Screen reference + HTML mockups
│   │
│   └── docs/                        # MVP-specific documentation
│       ├── tracking/                # ISSUES.md + CHANGELOG.md
│       ├── features/                # Feature backlog + feature subfolders
│       ├── design-reviews/          # UX audit reports
│       ├── design-system/           # Token reference, interactive browsers
│       ├── insights/                # Insights feature architecture
│       ├── beta-launch/             # Alliance Paoli onboarding
│       ├── data-and-ai/             # AI strategy, voice pipeline
│       └── DEPLOYMENT_GUIDE.md      # TestFlight deployment
│
├── docs/                            # Foundational docs (version-independent)
│   ├── brand/                       # Voice, tone guidelines
│   ├── research/                    # User research, competitive analysis
│   ├── personas/                    # User profiles
│   ├── domain-knowledge/            # BJJ curriculum, belt criteria
│   ├── product/                     # Belt personalization, feature concepts
│   ├── legal/                       # Privacy policy, terms
│   ├── development/                 # Dev practices
│   ├── project/                     # Project status, roadmap
│   ├── RFP/                         # Business documents
│   └── FIRST_PRINCIPLES.md          # Non-negotiable product beliefs
│
└── _archived/                       # Historical reference only
    ├── prototype/                   # Web prototype (bjjj.pages.dev)
    └── ...                          # See _archived/README.md
```

## Screen Reference

All screens are documented with named elements and workflows at:
- `mvp-1.0/design/screens/index.html` - Element names for every screen
- `mvp-1.0/design/screens/mockups.html` - Visual mockups of every screen
- `mvp-1.0/design/screens/workflows.md` - How screens connect

Use these names when requesting UI changes (e.g., "On the **Review Phase**, change the **Save Session Button** color").

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
- **Stats/Techniques/Journal:** Longer content OK - users are browsing leisurely

## Design System

> **Source of Truth:** `mvp-1.0/docs/design-system/`
>
> | File | Purpose |
> |------|---------|
> | `tokens.md` | Complete design token reference (colors, typography, spacing) |
> | `styles.css` | Production-ready CSS with all tokens and components |
> | `index.html` | Interactive design system browser (open in browser) |
> | `icons.html` | Full icon library (95+ icons) |
>
> **When making UI changes, Claude MUST:**
> 1. Reference `tokens.md` for correct values
> 2. Reference `mvp-1.0/app/src/config/design-tokens.ts` for React Native values
> 3. Never invent new colors, spacing, or typography values

### Design Principles (Non-Negotiable)

1. **NO EMOJIS** - Use SVG lineart icons from `Icons.tsx` only
2. **Dark Theme** - `#111111` background with gold accents
3. **Large Typography** - Hero numbers up to 144-180px
4. **Semantic Colors** - GREEN = positive, RED = negative (never swap)
5. **Unbounded + Inter + JetBrains Mono** - Unbounded for headlines/numbers, Inter for body, JetBrains Mono for labels
6. **Font Weight 500+ Only** - Weight 400 is PROHIBITED (too thin for dark backgrounds)
7. **12px Minimum Font Size** - Nothing smaller, ever

### Quick Token Reference

See `mvp-1.0/docs/design-system/tokens.md` for complete reference. Key values:

**Colors:** `#111111` (background), `#F5A623` (gold accent), `#22c55e` (positive), `#ef4444` (negative)

**Typography:** Unbounded 700-800 (headlines), Inter 500+ (body), JetBrains Mono 500-600 (labels)

**Spacing (4px base):** xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48

**Touch Targets:** Primary 56-80px, Secondary 44px minimum

### Icon Usage

```tsx
import { Icons } from '../components/Icons';

<Icons.Check size={24} />
<Icons.Trophy size={24} color={colors.gold} />
```

### Propagation: Design System to Code

When the design system is updated:
1. Update `mvp-1.0/docs/design-system/tokens.md` first (source of truth)
2. Update `mvp-1.0/app/src/config/design-tokens.ts` (React Native implementation)
3. This file (CLAUDE.md) reflects the summary, not the source

**The design system is the source. Code implements it. Never the reverse.**

## User States: Context-Aware Design

### Understanding User Context by Feature

**CRITICAL:** Users exist in different states depending on what they're doing. Design must match their context.

| Feature Area | User State | Time Tolerance | Design Approach |
|--------------|------------|----------------|-----------------|
| **Session Logging** | EXHAUSTED | 90 seconds max | Minimal friction, voice-first, one question at a time |
| **Stats/Dashboard** | RELAXED | Unlimited | Rich data, deep dives, multiple visualizations welcome |
| **Journal/History** | RELAXED | Unlimited | Full entries, filtering, exploration encouraged |
| **Profile/Settings** | RELAXED | Moderate | Standard forms, can handle complexity |

---

### The Exhausted User (Session Logging ONLY)

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

### The Relaxed User (Journal, Insights, Profile)

**When users browse these pages, they are:**
- At home, on the couch, or commuting
- Curious about their progress
- Not time-pressured
- Wanting depth, detail, and insight

### Browse Mode Design Principles

1. **Rich visualizations welcome:** Charts, graphs, timelines
2. **Deep information hierarchies:** Multiple sections, expandable details
3. **Long-form content OK:** Coaching text, historical analysis
4. **Standard touch targets:** 44px minimum is fine for relaxed browsing

## Key Patterns

### Onboarding (MVP 1.0)
MVP uses **full upfront onboarding** (~60 seconds), not progressive profiling:
- Screen 1: Welcome
- Screen 2: Name, belt, stripes, birthday, gender
- Screen 3: Gym picker, target frequency, optional goals + experience
- Screen 4: Logging preference (voice/text), mic permission, chat payoff

See `mvp-1.0/docs/FEATURE_SPEC.md` for exact onboarding spec.

### Session Logging Flow
1. User taps Log Button (gold + in tab bar)
2. Entry Phase: training mode, kind, duration, spar toggle
3. Recording Phase: voice capture with timer and prompts
4. Processing Phase: transcription + AI extraction
5. Review Phase: editable form with all extracted fields
6. Success Phase: post-save quote (4 seconds), then back to Journal List

### Section-Based Editing
When editing saved sessions:
- Use `EditSheet` (bottom sheet modal)
- Section-specific edit components
- Staged changes with save/discard
- Large touch targets for fatigued users

## User Personas

> **Canonical Source:** `docs/personas/PERSONAS.md`

| Key | Name | Belt | Age | Archetype | Status |
|-----|------|------|-----|-----------|--------|
| `white-excelling` | Jake Thompson | White (3 str) | 26 | The Natural | Thriving |
| `white-at-risk` | David Morrison | White (2 str) | 52 | The Late Starter | Struggling |
| `blue-excelling` | Marcus Chen | Blue (2 str) | 34 | The Dedicated Hobbyist | Progressing |
| `blue-at-risk` | Ryan Torres | Blue (1 str) | 31 | The Fading Fire | Declining |
| `purple-average` | Sofia Rodriguez | Purple (1 str) | 28 | The Grinder | Stable |
| `brown-average` | Elena Kim | Brown (2 str) | 38 | The Veteran | Refined |

## Key MVP Decisions

- **Bundle ID:** `com.drewgarraway.tomo`
- **iOS target:** 16.0
- **Data model:** `trainingMode` + `sessionKind` (not old `trainingType`)
- **Onboarding:** Full upfront (~60 seconds), not progressive profiling
- **Belt personalization:** Copy/tone/defaults only - no field locking in MVP
- **Audio:** Private bucket, signed URLs, never publicly accessible
- **PostHog:** Excluded from MVP, add post-TestFlight
- **API keys:** All server-side via Edge Functions, none in app binary

## Development Guidelines

### Component Patterns
- Functional components with hooks
- Props interfaces at top of file
- React Native StyleSheet (not CSS)
- Design tokens from `src/config/design-tokens.ts`

### State Management
- `useAuth` hook for user profile and auth state
- Local state for UI-only concerns
- Supabase for all persistent data

### Naming Conventions
- Components: PascalCase (`SessionLoggerScreen.tsx`)
- Functions: camelCase (`handleSave`)
- Types/Interfaces: PascalCase (`interface SessionData`)
- Design tokens: camelCase object (`colors.gold`, `spacing.md`)

### Code Style
- Explicit types, avoid `any`
- Descriptive variable names
- Comments for complex logic only
- Keep components focused (single responsibility)

## Research Documents

See `docs/research/USER_PERSONAS_AND_RESEARCH.md` for:
- Detailed user personas
- Market research data
- BJJ demographic statistics
- Persona-driven conversation design examples
- Training frequency benchmarks by age

## Key Metrics for TestFlight Success

- App installs on iOS 16+
- Download to first session < 3 minutes
- Voice transcription > 85% accuracy for BJJ terms
- Crash rate < 1%
- Cold start < 3 seconds
- 5+ testers complete 3+ sessions each
- AI extraction edit rate < 30%
