# TOMO (友) - BJJ Training Journal - Project Context for Claude

## Project Overview

BJJ Journal is a voice-first training journal app for Brazilian Jiu-Jitsu practitioners. The app helps users log training sessions, track belt progression, and build a personal technique library.

**Core Value Proposition:** Capture training insights at the critical post-training moment when information is fresh but users are exhausted.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Variables + Inline Styles (design system in `/prototype/src/index.css`)
- **State Management:** React Context (UserProfileContext)
- **Storage:** localStorage (prototype), API-ready patterns
- **No external UI libraries** - custom components only
- **Hosting:** Cloudflare Pages (bjjj.pages.dev)

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

See `/BELT_PERSONALIZATION_SYSTEM.md` for full documentation.

---

## Project Structure

```
/prototype/src/
├── components/
│   ├── features/          # Feature components (screens)
│   │   ├── Dashboard.tsx
│   │   ├── SessionLogger.tsx    # Unified voice/text logging
│   │   ├── VoiceLogger.tsx
│   │   ├── TextLogger.tsx       # Type-to-log alternative
│   │   ├── SessionHistory.tsx
│   │   ├── SessionDetail.tsx
│   │   ├── SessionCard.tsx
│   │   ├── BeltProgress.tsx
│   │   ├── TechniqueLibrary.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ProfileNudge.tsx     # Progressive profiling
│   │   ├── Onboarding.tsx
│   │   ├── EditSheet.tsx        # Reusable bottom sheet
│   │   ├── EditSections.tsx     # Section-specific editors
│   │   └── Settings.tsx         # App settings screen
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── TabBar.tsx
│   └── ui/                # Reusable UI primitives
│       ├── index.ts       # Central exports for all UI components
│       ├── BeltBadge.tsx  # Belt color with stripes
│       ├── StatCard.tsx   # Metric display card
│       ├── ProgressRing.tsx # Circular progress indicator
│       ├── TrainingBadge.tsx # Training type badge (gi/nogi)
│       ├── ErrorState.tsx # Error state displays
│       ├── EmptyState.tsx # Empty state displays
│       ├── NotFound.tsx   # 404 fallback screen
│       ├── Skeleton.tsx   # Loading skeleton components
│       ├── Toast.tsx      # Toast notification system
│       └── Icons.tsx      # Icon components
├── config/
│   ├── app.ts             # App config, feature flags, API settings
│   └── belt-system/       # Belt personalization engine (IMPORTANT)
│       ├── index.ts       # Central exports
│       ├── types.ts       # Type definitions
│       ├── belt-profiles.ts    # Psychology profiles per belt
│       ├── feature-adaptations.ts  # How features adapt by belt
│       ├── risk-signals.ts     # Dropout risk detection
│       └── journal-patterns.ts # Journal text analysis
├── hooks/
│   ├── index.ts           # Hook exports
│   └── useBeltPersonalization.ts  # Belt personalization React hook
├── context/
│   └── UserProfileContext.tsx   # Profile state + progressive profiling
├── data/                  # Mock data (FPO content)
│   ├── techniques.ts      # 50 techniques with full details
│   ├── progress.ts        # Belt requirements, milestones
│   ├── journal.ts         # Session entries
│   ├── users.ts           # User profiles
│   └── belt-criteria.ts   # IBJJF requirements
├── services/              # API abstraction layer (Supabase-ready)
│   ├── index.ts           # Service exports
│   ├── api.ts             # Profile, Sessions, TechniqueProgress CRUD
│   └── auth.ts            # Authentication service (mock for prototype)
├── types/                 # TypeScript type definitions
│   ├── index.ts           # Type exports
│   ├── database.ts        # Supabase schema types (Profile, Session, etc.)
│   ├── auth.ts            # Authentication types
│   └── journal.ts         # Legacy journal types
├── utils/                 # Utility functions
│   └── index.ts           # Date, color, validation, accessibility helpers
├── App.tsx                # Main app with routing
└── index.css              # Design system CSS variables
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
> The authoritative design system lives in `/internal-docs/design-system/`. All UI decisions MUST reference these files:
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
> 1. Reference `/internal-docs/design-system/tokens.md` for correct values
> 2. Use existing CSS classes from `/internal-docs/design-system/styles.css`
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

See `/internal-docs/design-system/tokens.md` for complete reference. Key values:

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

See `/internal-docs/design-system/icons.html` for the full 95+ icon library.

### Propagation: Design System → Code

When the design system is updated:
1. Update `/internal-docs/design-system/styles.css` first
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

### Progressive Profiling
Instead of long onboarding, we collect profile data over ~20 sessions:

**Critical (required at onboarding):**
- Name
- Belt level

**Deferred (asked via nudges at session milestones):**
- Session 3: Training start date
- Session 5: Stripes count
- Session 7: Gym name
- Session 10: Training goals
- Session 12: Target frequency
- Session 15: Current belt date
- Session 18: Birth year

Users can skip questions up to 3 times before we stop asking.

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

> **Canonical Source:** `/internal-docs/personas/PERSONA_PROFILES.md`

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

### Next Phase: iOS TestFlight
See `/internal-docs/IOS_DEPLOYMENT_CHECKLIST.md` for full plan.

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

See `/internal-docs/research/USER_PERSONAS_AND_RESEARCH.md` for:
- Detailed user personas
- Market research data
- BJJ demographic statistics
- Persona-driven conversation design examples
- Training frequency benchmarks by age

---

## iOS TestFlight Deployment

### Deployment Documents
- **Full Plan:** `/internal-docs/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md`
- **Checklist:** `/internal-docs/IOS_DEPLOYMENT_CHECKLIST.md`

### Technology Decisions
| Layer | Technology | Status |
|-------|------------|--------|
| Mobile App | React Native + Expo | Not started |
| Database | Supabase (PostgreSQL) | Not started |
| Authentication | Supabase Auth (Email + Apple) | Not started |
| Voice Transcription | AssemblyAI | Not started |
| Crash Reporting | Sentry | Not started |
| Analytics | PostHog | Not started |
| iOS Builds | Expo EAS | Not started |
| Web Hosting | Cloudflare Pages | **Active** (bjjj.pages.dev) |

### Why AssemblyAI for Voice Transcription
- **24% better accuracy** on proper nouns (critical for BJJ terminology like "kimura", "de la Riva")
- **30% lower hallucination rate** than Whisper (important when users are exhausted/mumbling)
- **Custom vocabulary** support for BJJ-specific terms
- **$50 free credits** (~135 hours of transcription for testing)
- **Pricing:** $0.0062/min (Best tier) or $0.002/min (Nano tier)
- **99.95% uptime SLA** for production reliability

### iOS Deployment Checklist

#### Phase 0: Prerequisites
- [ ] Purchase Apple Developer Account ($99/year)
- [ ] Create App Store Connect listing
- [ ] Create Supabase account
- [ ] Create AssemblyAI account ($50 free credits)

#### Phase 1: Foundation (Weeks 1-3)
- [ ] Set up Supabase project with database schema
- [ ] Configure Supabase authentication
- [ ] Initialize Expo project with TypeScript
- [ ] Connect Expo app to Supabase
- [ ] Basic auth flow working (sign up, log in, log out)

#### Phase 2: Core Features (Weeks 4-7)
- [ ] Integrate expo-av for voice recording
- [ ] Connect to AssemblyAI for transcription
- [ ] Configure custom vocabulary for BJJ terms
- [ ] Migrate Dashboard to native
- [ ] Migrate SessionLogger with real voice
- [ ] Migrate SessionHistory with database
- [ ] Migrate ProfileScreen with persistence
- [ ] Connect progressive profiling to backend

#### Phase 3: Polish (Weeks 8-10)
- [ ] Configure iOS app icons (1024x1024)
- [ ] Create splash screen
- [ ] Implement Apple Sign-In
- [ ] Add offline caching with AsyncStorage
- [ ] Implement sync queue for offline sessions
- [ ] Set up Sentry crash reporting
- [ ] Add PostHog analytics
- [ ] Test on multiple iPhone sizes

#### Phase 4: TestFlight (Weeks 11-12)
- [ ] Write App Store description
- [ ] Create screenshots (6.5" and 5.5")
- [ ] Run EAS build for iOS
- [ ] Submit to TestFlight
- [ ] Distribute to internal testers (5-10)
- [ ] Set up feedback collection
- [ ] Monitor crashes and iterate

### Key Metrics for TestFlight Success
- App installs on iOS 15+
- Onboarding < 2 minutes
- Voice transcription > 85% accuracy for BJJ terms
- Crash rate < 1%
- Cold start < 3 seconds
- 5+ testers complete 3+ sessions each

### Cost Estimates
| Phase | Monthly Cost |
|-------|--------------|
| Development | ~$18/month |
| TestFlight (10 users) | ~$28/month |
| Launch (100 users) | ~$58/month |
| Growth (1000 users) | ~$133/month |
