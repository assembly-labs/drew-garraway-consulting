# BJJ Progress Tracker - Project Status

**Last Updated:** February 8, 2026
**Current Phase:** Research Complete → UX Cleanup → Development Preparation
**Build Status:** ✅ PASSING

---

## Quick Reference

| Item | Value |
|------|-------|
| Mock User | Tony Chen (Blue belt, 2 stripes, 15 months at blue) |
| Tech Stack | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| Deployment | Cloudflare Pages |
| Design | Alliance BJJ-inspired (black/gold) |
| **Next Priority** | Techniques Page Polish, Belt Progress Module, Login/Auth Implementation |
| **Test Locally** | `cd prototype && npm run dev` → http://localhost:5173 |
| **Production URL** | https://bjjj.pages.dev |

---

## Deployment

> **Important:** Pushing to GitHub does NOT auto-deploy. Deployment is manual via wrangler CLI.

### Commands

```bash
cd prototype

# Build only (check for errors)
npm run build

# Deploy to production (requires build first)
npm run deploy

# Full workflow: build + commit + push + deploy
npm run ship
```

### Workflow

1. **Make changes** in `/prototype/src/`
2. **Build** - `npm run build` (catches TypeScript/build errors)
3. **Commit & Push** - `git add . && git commit -m "message" && git push`
4. **Deploy** - `npm run deploy` (pushes to Cloudflare Pages)

Or use `npm run ship` for steps 2-4 in one command.

### Verify Deployment

After `npm run deploy`, you'll see:
```
✨ Deployment complete! Take a peek over at https://[hash].bjjj.pages.dev
```

The production URL https://bjjj.pages.dev updates within seconds.

---

## Session Log

| Date | Work Completed | Next Steps |
|------|----------------|------------|
| **Feb 8, 2026** | **Design Sprint**: Created 3 interactive HTML design reviews (Techniques enhancements, Belt Progress module, Login/Auth). Created Privacy Policy & Terms of Service. Created iOS Payment Strategy document. Updated FEATURE_TRACKER.md (now 26 of 57 items complete = 46%). Created Techniques page strategy document with 4 approaches. | Implement Techniques page enhancements, Build Belt Progress module in Profile |
| **Jan 19, 2026** | **Research & Foundation Sprint**: Created FIRST_PRINCIPLES.md (12 core product beliefs), added sports-psychology-research.md (meta-analytic findings, effect sizes), added TOMO_Belt_Progression_Requirements_Reference.md (belt technical requirements, coach evaluation criteria). Fixed purple belt duration in belt-profiles.ts (36-48 → 18-36 months). Created comprehensive ROADMAP.md with UX cleanup sprints, documentation plan, and implementation phases. | Session Detail View, First-Time Experience, Screen Specifications |
| **Jan 3, 2026** | **Purple/Brown Belt Module Consolidation**: Merged LongGame + SubmissionTrends → YourJourney. Simplified TechniqueMastery (removed depth analysis, handled by AttackProfile). Archived old modules. Same consolidation pattern as white/blue belts. | Continue with session detail view, iOS prep |
| **Dec 21, 2025 (Evening)** | **Voice Logger feature complete**: 6-phase flow (Idle→Recording→Processing→Gap-Fill→Review→Success), audio waveform visualization, smooth transitions, brand voice copy, session count. **Session History**: SessionHistory + SessionCard components, past sessions list grouped by date. **UX Flow**: App auto-opens voice logger on load, post-log navigates to journal history. **Conversation Design**: Created `/conversation-design/` folder with `CONVERSATION_DESIGN_FOUNDATION.md`. **File cleanup**: Removed duplicate .docx, renamed files, added .md extensions. | Session Detail View, Edit Mode, First-Time Experience, Error States |
| Dec 21, 2025 (PM) | Research ingestion: 21 sources analyzed, data-requirements-analysis.md created, sources-bibliography.md created, Dashboard component built, UI components created (Header, TabBar, BeltBadge, StatCard, TrainingBadge, ProgressRing) | Voice Logger feature |
| Dec 21, 2025 (AM) | Session continued - verified build, established session protocol | Start Phase 1 UI screens |
| Dec 21, 2024 | Foundation complete: scaffolding, design system, 11 mock data files, IBJJF v2 curriculum, competitive analysis | UI prototype development |

---

## Project Overview

A digital training journal and progress tracking application for Brazilian Jiu-Jitsu practitioners, coaches, and gym owners. Connects practitioners with coaches for belt promotion transparency, structured feedback, and AI-assisted note-taking.

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Cloudflare Pages

---

## Completed Work

### 1. Project Scaffolding
- [x] React + TypeScript + Vite setup
- [x] Tailwind CSS v4 configured (@tailwindcss/vite plugin)
- [x] Cloudflare Pages deployment config (wrangler.toml)
- [x] Folder structure: `prototype/`, `internal-docs/research/`, `internal-docs/design-system/`

### 2. Design System (`prototype/src/index.css`)
- [x] Alliance BJJ-inspired design tokens
- [x] Color palette: Black/gold primary, belt colors, training types
- [x] Typography: Montserrat (headings) + Open Sans (body)
- [x] Component classes: buttons, cards, forms, badges, stats, progress bars, tabs

### 3. Mock Data (`prototype/src/data/`)

| File | Content | Status |
|------|---------|--------|
| `users.ts` | 5 practitioners, 2 coaches, 1 gym owner. **Mock user: Tony Chen** (Blue belt, 2 stripes) | Complete |
| `techniques.ts` | 50 techniques covering all positions and belt levels | Complete |
| `journal.ts` | 7 training session entries with sparring, techniques, AI parsing demo | Complete |
| `progress.ts` | Belt history, requirements, position mastery, milestones, goals, IBJJF progress tracking | Complete |
| `feedback.ts` | Coach feedback, focus areas, periodic reviews, voice transcripts | Complete |
| `competitions.ts` | Match records, prep checklists | Complete |
| `gym.ts` | 2 gyms, schedules, roster, retention metrics | Complete |
| `media.ts` | 18 technique videos, thumbnails, gallery images, player state | Complete |
| `legal.ts` | Terms of Service, Privacy Policy, Waiver, Cookie Policy | Complete |
| `payments.ts` | 4 subscription plans, test cards, transactions, invoices, promo codes | Complete |
| `belt-criteria.ts` | **IBJJF v2 curriculum** - see below | Complete |
| `index.ts` | Central export for all data modules | Complete |

### 4. IBJJF Belt Criteria System (`belt-criteria.ts`)

**v2 Implementation (December 2024):**

| Section | Content |
|---------|---------|
| Curriculum Pillars | Sport, Self-Defense, Conceptual |
| Conceptual Principles | Frames, Levers, Wedges, Posture/Base, Position Hierarchy, Chain Attacks |
| Guard Systems | 12 guards with belt-level progression (Closed → DLR → X-Guard → Deep Half) |
| Guard Retention | 5 universal principles |
| Passing Systems | 10 techniques (pressure vs speed) + situation-based recommendations |
| Takedowns | Wrestling (single/double/arm drag), Judo (5 throws with Japanese names), Clinch, Guard Pull |
| Leg Lock Rules | IBJJF legality by belt (2021 heel hook rule for brown/black no-gi) |
| Ashi Garami Positions | 7 positions in 3 categories + heel hook mechanics |
| Gracie Combatives | 36 techniques, 5-stage Punch Block Series |
| Academy Curricula | Gracie University, Gracie Barra, Alliance, 10th Planet, Pedro Sauer |
| Belt Definitions | Updated with Roger Gracie quote, Roy Dean "Words→Sentences" insight |
| Youth Belts | Grey, Yellow, Orange, Green with transition rules |
| Black Belt Degrees | 1st-10th degree with Coral/Red belt progression |

### 5. Research Documents (`internal-docs/research/`)

| Document | Content |
|----------|---------|
| `ui-strategy.md` | Screen architecture, UI components, navigation patterns, prototype priorities |
| `competitive-analysis.md` | SWOT analysis of BJJ Notes, BJJBuddy, Marune, Track to Black, GrapplingAI, gym software |

### 6. Design System Docs (`internal-docs/design-system/`)

| Document | Content |
|----------|---------|
| `tokens.md` | Complete design token documentation |

### 7. Source Documents (`internal-docs/BJJ Ranking Criteria/`)

| Document | Purpose |
|----------|---------|
| `BJJ_Belt_Ranking_Criteria_IBJJF.docx` | v1 IBJJF criteria (incorporated) |
| `BJJ_Belt_Curriculum_Reference.md` | v2 comprehensive curriculum (renamed from artifact) |

### 8. Conversation Design (`/conversation-design/`)

| Document | Purpose | Status |
|----------|---------|--------|
| `CONVERSATION_DESIGN_FOUNDATION.md` | Principles, voice, tone, question frameworks | Complete |
| `features/bjj-voice-logging-system.md` | Voice logging feature spec | Complete |

### 9. Voice Logger Feature (`prototype/src/components/features/`)

| Component | Description | Status |
|-----------|-------------|--------|
| `VoiceLogger.tsx` | 6-phase voice recording flow | Complete |
| `SessionHistory.tsx` | Past sessions list grouped by date | Complete |
| `SessionCard.tsx` | Compact session card for history | Complete |

**Voice Logger Phases:**
1. **Idle** — CTA with mic button, brand voice prompt
2. **Recording** — Audio waveform visualization, timer, cancel option
3. **Processing** — AI extraction spinner, conversational copy
4. **Gap-Fill** — Single follow-up question (Gi/No-Gi) if needed
5. **Review** — Dark theme summary card, edit/save buttons
6. **Success** — Session count, motivational message

**UX Flow:**
- App auto-opens voice logger on first load
- After save → navigates to Session History (Journal tab)
- Dashboard "Log Training" button opens voice logger
- Journal tab "Log" button opens voice logger

### 10. Design Reviews (Feb 2026)
- [x] Techniques page enhancement mockups (8 features)
- [x] Belt Progress module design (Profile integration)
- [x] Login/Auth screens (Email + Apple + Google)
- [x] iOS Payment Strategy (StoreKit + RevenueCat)
- [x] Privacy Policy (generic text)
- [x] Terms of Service (generic text)

---

## What's Left: Design & Develop Prototype

### Phase 1: Core UI Screens

| Screen | Description | Status |
|--------|-------------|--------|
| **Dashboard** | Training summary, recent sessions, next goals, streak | ✅ Complete |
| **Voice Logger** | Voice-first session logging with AI extraction | ✅ Complete |
| **Session History** | Past sessions list with cards | ✅ Complete |
| **Session Detail** | Full view of single session, edit capability | ✅ Complete |
| **Belt Progress** | Requirements checklist, coach feedback, promotion readiness | 🟡 Designing (Design review created) |
| **Technique Library** | Browse/search techniques, video placeholders | ✅ Complete (needs polish, design review created) |
| **Profile** | Belt history, stats, milestones, settings | ✅ Complete (belt progress module designed) |
| **Login/Auth** | Authentication screens for email + SSO | 🟡 Designing |
| **Legal Pages** | Privacy Policy & Terms of Service | ✅ Designed |

### Immediate Next Steps (Voice Logger Polish)

| Task | Priority | Description |
|------|----------|-------------|
| **Session Detail View** | High | Tap session card → full detail view with all fields |
| **Edit Mode** | High | Inline editing of extracted session data |
| **First-Time Experience** | High | Mic permission request, "what to say" guidance |
| **Type-to-Log Fallback** | Medium | Alternative text input for users who prefer typing |
| **Error States** | Medium | Mic access denied, recording failure, network issues |
| **Discard Confirmation** | Medium | "Discard this session?" when canceling with data |

### Phase 2: Coach Features

| Screen | Description |
|--------|-------------|
| **Student Roster** | List of assigned students with progress indicators |
| **Student Detail** | Individual progress, feedback history, focus areas |
| **Feedback Entry** | Text/voice feedback with technique tagging |
| **Promotion Pipeline** | Students approaching belt requirements |

### Phase 3: Gym Owner Features

| Screen | Description |
|--------|-------------|
| **Gym Dashboard** | Retention metrics, attendance, promotion pipeline |
| **Roster Management** | All members, belt distribution, at-risk students |
| **Coach Management** | Assign coaches to students |

### Phase 4: Additional Features

| Feature | Description |
|---------|-------------|
| **Competition Tracker** | Match records, prep checklists |
| **Onboarding Flow** | Account setup, gym selection, goal setting |
| **Settings** | Privacy, notifications, subscription |
| **Legal/Payment** | ToS acceptance, subscription management |

---

## Build Status

```
Last Build: December 21, 2024
Status: PASSING
Output: dist/ folder ready for Cloudflare deployment
```

**To run locally:**
```bash
cd prototype
npm install
npm run dev
```

**To build:**
```bash
cd prototype
npm run build
```

---

## Key Decisions Made

1. **Design System:** Alliance BJJ-inspired (black/gold, Montserrat/Open Sans)
2. **Mock User:** Tony Chen - Blue belt, 2 stripes, 15 months at blue
3. **Pricing Strategy:** Free, Practitioner ($9.99), Coach ($29.99), Gym ($99.99)
4. **IBJJF Curriculum:** v2 comprehensive system with Roy Dean/Roger Gracie insights
5. **No Logo:** Using Alliance BJJ style but not their logo

---

## Session Protocol

### At Start of Session:
```
1. Read /internal-docs/PROJECT_STATUS.md
2. Run: cd prototype && npm run build
3. Report build status to user
4. Review "Next Priority" in Quick Reference
```

### During Session:
```
- Update Session Log as work is completed
- Keep "What's Left" section current
- Note any blockers or decisions in this file
```

### At End of Session:
```
1. Update Session Log with work completed
2. Update Quick Reference "Next Priority"
3. Verify build: npm run build
4. Commit changes if requested
```

### File Location:
```
/internal-docs/PROJECT_STATUS.md
```

---

## Change Log

### January 19, 2026

**Research & Foundation Sprint:**
- Created `/docs/FIRST_PRINCIPLES.md` - 12 non-negotiable product beliefs
- Created `/docs/sports-psychology/sports-psychology-research.md` - meta-analytic findings from elite athlete research
- Added `/docs/research/TOMO_Belt_Progression_Requirements_Reference.md` - belt technical requirements, coach evaluation criteria
- Fixed purple belt duration in `belt-profiles.ts`: 36-48 months → 18-36 months (aligned with research)
- Updated `/docs/research/README.md` with new document
- Created `/docs/project/ROADMAP.md` - comprehensive roadmap with UX cleanup sprints, documentation plan, implementation phases

**Key Research Findings Integrated:**
- Process goals produce 10x better results than outcome goals (d = 1.36 vs d = 0.09)
- Reflection predicts elite status at OR = 4.9
- Autonomy support correlates negatively with burnout (r = -0.638)
- Coach subjective criteria (attitude, ego) often more important than technical skill

### January 3, 2026

**Purple/Brown Belt Stats Module Consolidation:**
- Merged `LongGame.tsx` + `SubmissionTrends.tsx` → `YourJourney.tsx`
- Simplified `TechniqueMastery.tsx` (removed depth analysis section, already in AttackProfile)
- Archived LongGame and SubmissionTrends to `_archived/` folder
- Updated Dashboard.tsx to use YourJourney
- Updated index.ts exports

**Module Reduction Summary:**
| Belt | Before | After |
|------|--------|-------|
| White | 3 → 2 | JourneyTimeline, ConsistencyScore → YourProgress |
| Blue | 4 → 2 | YourStyle, VulnerabilityMap → AttackProfile |
| Purple+ | 3 → 2 | LongGame, SubmissionTrends → YourJourney |

**Principle Applied:** Show each insight ONCE, in the best possible way.

### December 21, 2025 (Evening Session)

**Conversation Design:**
- Created `/conversation-design/` folder
- Created `CONVERSATION_DESIGN_FOUNDATION.md` - principles, voice, tone, question frameworks
- Links to brand voice guide as source of truth

**Voice Logger Feature:**
- Created `VoiceLogger.tsx` - 6-phase flow (Idle→Recording→Processing→Gap-Fill→Review→Success)
- Added audio waveform visualization during recording
- Added smooth fade transitions between phases
- Added Gap-Fill phase for missing training type
- Updated copy to match brand voice ("How'd training go? Just talk—I'm listening.")
- Added session count to success message ("Session #48 Logged")
- Added cancel button during recording
- Dark theme throughout all phases

**Session History:**
- Created `SessionHistory.tsx` - past sessions grouped by date
- Created `SessionCard.tsx` - compact card with training type, technique preview, stats
- Sessions show submission counts (✓/✗), injury indicators

**UX Flow Updates:**
- App auto-opens voice logger on first load
- Post-log completion navigates to Journal (Session History)
- Dashboard "Log Training" opens voice logger
- Journal "Log" button opens voice logger

**File Cleanup:**
- Deleted `BJJ_Progress_Tracker_Feature_List.docx` (duplicate)
- Renamed `v2_122125_compass_artifact_*.md` → `BJJ_Belt_Curriculum_Reference.md`
- Added `.md` extension to research files

### December 21, 2025 (PM)
- Research ingestion: 21 sources analyzed
- Created `data-requirements-analysis.md`, `sources-bibliography.md`
- Built Dashboard component with all sections
- Created UI components (Header, TabBar, BeltBadge, StatCard, TrainingBadge, ProgressRing)

### December 21, 2025 (AM)
- Updated PROJECT_STATUS.md with session protocol and quick reference

### December 21, 2024 (Initial Session)
- `prototype/src/data/users.ts` - Changed mock user to Tony Chen
- `prototype/src/data/media.ts` - Updated profile reference to Tony Chen
- `prototype/src/data/belt-criteria.ts` - Complete v2 IBJJF curriculum implementation
- `prototype/src/data/progress.ts` - Added IBJJF progress tracking interfaces
- `prototype/src/data/index.ts` - Added belt-criteria export
- `internal-docs/research/competitive-analysis.md` - Created competitor SWOT analysis
- `internal-docs/PROJECT_STATUS.md` - Created this status document
