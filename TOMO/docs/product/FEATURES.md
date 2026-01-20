# TOMO Features

**Last Updated:** January 19, 2026

> **What we've built, what we're building, and how it all works.**
>
> For user personas, see `/docs/personas/TOMO_PERSONAS.md`
> For belt integration details, see `/docs/product/BELT_INTEGRATION_SPEC.md`

---

## Feature Status Overview

| Feature | Status | Phase | Notes |
|---------|--------|-------|-------|
| Dashboard | **COMPLETE** | Prototype | Belt-adaptive, production-ready |
| Session Logger | **COMPLETE** | Prototype | Voice-first UI, mock AI processing |
| Session History (Journal) | **COMPLETE** | Prototype | Filterable, belt-adaptive cards |
| Session Detail | **COMPLETE** | Prototype | Full session view with editing |
| Technique Library | **COMPLETE** | Prototype | Curated videos, AI recommendations |
| AI Training Insights | **COMPLETE** | Prototype | Daily insights with typewriter effect |
| Profile Screen | **COMPLETE** | Prototype | Progressive profiling, belt journey |
| Settings | **COMPLETE** | Prototype | Demo mode, preferences |
| Belt Personalization System | **COMPLETE** | Prototype | Full psychology engine |
| Design System | **COMPLETE** | Prototype | Tokens, components, icons |
| Voice-to-Text AI | PLANNED | MVP | Real transcription (AssemblyAI) |
| Injury Tracking | PLANNED | MVP | Quick-flag + pattern detection |
| Coach Share | PLANNED | MVP | AI-generated summary sharing |
| Backend/Auth | PLANNED | MVP | Supabase + Apple Sign-In |
| Payment/Subscription | PLANNED | Post-MVP | Stripe integration |

---

# CURRENT FEATURES (Prototype)

These features are built and production-ready in the web prototype at `bjjj.pages.dev`.

---

## 1. Dashboard

**Status:** Complete | **Location:** `/prototype/src/components/features/Dashboard.tsx`

The Dashboard is the primary stats view, providing belt-adaptive visualizations and insights.

### What It Does

- **Hero Metric** — Large, animated number showing belt-appropriate primary metric (sessions, streak, techniques, sparring rounds)
- **Breakthrough Detection** — Automatically surfaces achievements and milestones
- **Style Fingerprint** — Radar chart showing grappling style (blue belt+ with 20+ sessions)
- **Belt-Adaptive Stats Modules** — Different visualizations based on user's belt level
- **Tournament Readiness** — Competition preparation assessment
- **AI-Generated Callouts** — "What's Working" and "Focus Area" insights

### Belt-Specific Modules

| Belt | Modules Shown |
|------|---------------|
| **White** | Weekly Progress Ring, Calendar Heat Map, Dashboard Summary, Defense Focus |
| **Blue** | Session Type Distribution, Sparring Pattern Analysis, Achievement Timeline, Technique Pairings, Blues Detector |
| **Purple+** | Session Type Distribution, Sparring Pattern Analysis, Achievement Timeline, Your Journey, Technique Mastery |

### Stats Modules Inventory

| Module | Purpose | Belt Level |
|--------|---------|------------|
| `WeeklyProgressRing` | Apple Watch-style weekly goal progress | White |
| `CalendarHeatMap` | GitHub-style training consistency | White |
| `DashboardSummaryCard` | Key metrics at-a-glance | White |
| `DefenseFocus` | Offense/defense bar charts | White |
| `SessionTypeDistribution` | Donut chart of training mix | Blue+ |
| `SparringPatternAnalysis` | Submission exchange rates | Blue+ |
| `AchievementTimeline` | Personal journey milestones | Blue+ |
| `TechniquePairings` | Co-occurrence analysis | Blue |
| `BluesDetector` | Dropout risk intervention | Blue |
| `YourJourney` | Multi-year progression | Purple+ |
| `TechniqueMastery` | Specialization depth | Purple+ |
| `RecentRolls` | Defense coaching | All |
| `AttackProfile` | Full submission story | Blue+ |
| `TournamentReadinessCard` | Competition prep assessment | All |
| `LockedFeaturesFooter` | Coming soon features | All |

### Belt Personalization (Dashboard)

**Hook:** `useBeltPersonalization()` → `{ dashboard, profile }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Primary Metric | `session_streak` | `technique_variety` | `sparring_rounds` |
| Streak Emphasis | HIGH | MEDIUM | LOW |
| Show Competition | NO | YES | YES |
| Insight Focus | "survival_skills" | "game_development" | "systems_thinking" |
| Celebrate Every | 10 sessions | 25 sessions | 50 sessions |

**Integration Status:** 85% complete. Missing celebration thresholds.

**See:** `/docs/product/BELT_INTEGRATION_SPEC.md#1-dashboard-stats`

---

## 2. Session Logger (Voice-First)

**Status:** Complete | **Location:** `/prototype/src/components/features/VoiceFirstLogger.tsx`

Voice-first session logging designed for exhausted users in the 90-second post-training window.

### What It Does

- **Core Field Entry** — Quick taps for training type, duration, sparring (Y/N)
- **Voice Recording** — Capture details via speech (mock AI in prototype)
- **AI Extraction** — Processes voice to structured data (mocked)
- **Review Screen** — Same form filled with extracted data, fully editable
- **Submission Picker** — Visual picker for logging taps given/received
- **Success Confirmation** — Belt-personalized message

### User Flow

```
Entry Screen          →  Recording        →  Processing    →  Review        →  Success
[Type/Duration/Sparring]  [Voice capture]     [AI extract]      [Edit form]      [Confirmation]
```

### Data Captured

| Field | Input Method | Required |
|-------|--------------|----------|
| Training type (Gi/No-Gi/Open Mat) | Tap | Yes |
| Duration | Tap | Yes |
| Sparring (Y/N) | Tap | Yes |
| Techniques drilled | Voice/Text | No |
| Submissions given | Voice/Picker | No |
| Submissions received | Voice/Picker | No |
| Struggles | Voice/Text | No |
| What worked well | Voice/Text | No |
| Notes | Voice/Text | No |

### Design Principles

- **56-80px touch targets** for primary actions
- **One question at a time** during voice prompts
- **Skip always available** for non-critical fields
- **Belt-personalized prompts** based on user level

### Belt Personalization (Session Logger)

**Hook:** `useBeltPersonalization()` → `{ sessionLogger, getPostSessionMessage }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Prompt Style | Encouraging | Neutral | Analytical |
| Technique Suggestions | 5 | 10 | 15-20 |
| Show Submissions | NO | YES | YES |
| Show Positional Time | NO | NO | YES |
| Default Duration | 60 min | 90 min | 90-120 min |

**Post-Session Messages:**
- White: "Great work showing up. Consistency beats intensity."
- Blue: "Session logged. Keep developing your game."
- Purple+: "Logged. Your depth of understanding grows."

**Integration Status:** 40% complete. Post-session message works. Field visibility not gated.

**See:** `/docs/product/BELT_INTEGRATION_SPEC.md#4-session-logger`

---

## 3. Session History (Journal)

**Status:** Complete | **Location:** `/prototype/src/components/features/SessionHistory.tsx`

Scrolling feed of saved journal entries with belt-adaptive card complexity.

### What It Does

- **Chronological Feed** — Grouped by Today, Yesterday, This Week, Earlier
- **Filtering** — All / Gi / No-Gi toggle
- **Belt-Adaptive Cards** — Card complexity scales by belt level
- **Tap to Detail** — Opens full session view

### Card Complexity by Belt

| Belt | Fields Shown |
|------|--------------|
| **White** | Date, type, duration, lesson topic, notes |
| **Blue** | + Techniques drilled, sparring rounds, worked well/struggles |
| **Purple+** | + Submissions given/received |

### Belt Personalization (Session History)

**Hook:** `useBeltPersonalization()` → `{ profile }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Card Complexity | Simple | Standard | Full |
| Show Techniques | NO | YES | YES |
| Show Submissions | NO | NO | YES |
| Filter Options | Type only | Type, sparring | Type, sparring, position |

**Integration Status:** 10% complete. Hook imported but not used.

**See:** `/docs/product/BELT_INTEGRATION_SPEC.md#5-session-history-journal`

---

## 4. Session Detail

**Status:** Complete | **Location:** `/prototype/src/components/features/SessionDetail.tsx`

Full view of a single training session with section-based editing.

### What It Does

- **Full Session Display** — All captured data in organized sections
- **Section Editing** — Edit individual sections via bottom sheet
- **Navigation** — Back to journal, delete session

### Edit Sections

| Section | Editable Fields |
|---------|-----------------|
| Overview | Type, duration, sparring |
| Techniques | Techniques drilled |
| Sparring | Submissions given/received |
| Notes | Struggles, what worked, notes |

---

## 5. Technique Library

**Status:** Complete | **Location:** `/prototype/src/components/features/TechniqueLibrary.tsx`

Browse, search, and learn BJJ techniques with curated video instruction.

### What It Does

- **"For You" View** — AI-personalized video recommendations based on:
  - Recent journal mentions
  - Belt-appropriate content
  - Defense focus (what you're getting caught with)
- **"Browse" View** — Category-based technique exploration
- **Embedded Videos** — YouTube integration with priority instructors
- **Mindset Content** — Belt journey, mental game, injury recovery topics

### Video Categories

**Technical Positions:**
- Closed Guard, Half Guard, Open Guard
- Mount, Side Control, Back Control
- Guard Passing, Takedowns, Turtle, Clinch
- Submissions

**Mindset & Lifestyle:**
- Belt Journey (white to black psychology)
- Mental Game (competition, ego, flow)
- Age & Longevity (training over 40)
- Lifestyle (work-life balance)
- Injury & Recovery

### Priority Instructors

Videos curated from: John Danaher, Gordon Ryan, Lachlan Giles, Craig Jones

### Belt Personalization (Technique Library)

**Hook:** `useBeltPersonalization()` → `{ videoTutorials, profile }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Difficulty Range | 1-3 | 2-5 | 4-10 |
| Prioritize Defense | YES | NO | NO |
| Include Conceptual | NO | YES | YES |
| Weekly Recommendations | 3 | 5 | 3 (quality) |
| Show Leg Locks | NO | Basic | YES |
| Show Advanced Systems | NO | NO | YES |

**"For You" Algorithm:**
1. Get recent journal entries (last 10 sessions)
2. Extract techniques mentioned + struggles
3. Apply belt difficulty filter
4. If prioritizeDefense: weight defensive content 2x
5. Return top N videos where N = weeklyRecommendationCount

**Integration Status:** 40% complete. Basic filtering works. Difficulty gating not implemented.

**See:** `/docs/product/BELT_INTEGRATION_SPEC.md#3-techniques-page`

---

## 6. AI Training Insights

**Status:** Complete | **Location:** `/prototype/src/components/features/TrainingFeedback.tsx`

Auto-generated AI coaching insights based on session history.

### What It Does

- **Daily Insight Generation** — One insight per day when tab is opened
- **Session-Gated** — Only generates if new session logged since last insight
- **Typewriter Effect** — Engaging reveal animation
- **Belt-Personalized** — Content adapted to user's level
- **Recommended Videos** — Links to relevant technique videos
- **Coach Deferral** — Always prompts to validate with their coach

### Brand Voice

"The Dedicated Training Partner" — Knowledgeable but humble, warm but direct.

### Belt Personalization (AI Insights)

**Hook:** `useBeltPersonalization()` → `{ chatbot, profile, analyzeJournal }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Tone | Warm, supportive | Coaching, balanced | Peer, analytical |
| Encouragement | HIGH | MODERATE | MINIMAL |
| Vocabulary | Basic | Intermediate | Advanced |
| Response Depth | Simple | Moderate | Detailed |

**Topics to Emphasize:**
- White: Survival, escapes, relaxation, when to tap
- Blue: Game development, combinations, plateau normalization
- Purple+: Systems thinking, teaching methodology, refinement

**Topics to Avoid:**
- White: Advanced leg locks, berimbolo, competition strategy
- Blue: (none)
- Purple+: (none)

**Risk-Aware Messaging:** When risk signals detected (extended gap, negative sentiment), show belt-appropriate intervention:
- White: "We noticed you've been away. Everything okay?"
- Blue: "Blue belt blues are real. This is part of the path."
- Purple+: "Your skills don't disappear. We're here when you're ready."

**Integration Status:** 70% complete. Tone works. Risk messaging not implemented.

**See:** `/docs/product/BELT_INTEGRATION_SPEC.md#2-insights-page`

---

## 7. Profile Screen

**Status:** Complete | **Location:** `/prototype/src/components/features/ProfileScreen.tsx`

User profile with progressive profiling and belt journey visualization.

### What It Does

- **Profile Completion Tracker** — Visual progress toward complete profile
- **Progressive Profiling Nudges** — Asks for data over time, not all at once
- **Belt Journey Display** — Visual belt progression with stripes
- **Training Stats Summary** — Total sessions, hours, time training
- **Settings Access** — Link to settings page

### Progressive Profiling Schedule

| Session | Question Asked |
|---------|----------------|
| 3 | Training start date |
| 5 | Stripes count |
| 7 | Gym name |
| 10 | Training goals |
| 12 | Target frequency |
| 15 | Current belt date |
| 18 | Birth year |

Users can skip questions up to 3 times before we stop asking.

### Belt Personalization (Profile)

**Hook:** `useBeltPersonalization()` → `{ profiling, profile }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Question Timing | Delayed (+2 sessions) | Standard | Early (-2 sessions) |
| Question Style | Friendly | Friendly | Professional |
| Skip Tolerance | 3 | 3 | 2 |

**Priority Questions by Belt:**
- White: trainingStartDate, targetFrequency (habit focus)
- Blue: gymName, goals, stripes (identity focus)
- Purple+: currentBeltDate (refinement focus)

**Integration Status:** 50% complete. Profiling works. Timing not belt-adapted.

**See:** `/docs/product/BELT_INTEGRATION_SPEC.md#8-profile--settings`

---

## 8. Settings

**Status:** Complete | **Location:** `/prototype/src/components/features/Settings.tsx`

App settings and preferences.

### What It Does

- **Demo Mode Toggle** — Switch between demo personas for testing
- **Belt Switcher** — Change belt level to see personalization
- **Persona Selector** — Load specific test profiles
- **Reset Profile** — Clear all user data
- **About/Version** — App info

---

## 9. Belt Personalization System

**Status:** Complete (engine) / Partial (integration) | **Location:** `/prototype/src/config/belt-system/`

Comprehensive engine for belt-aware personalization across all features.

### What It Does

- **Belt Psychology Profiles** — Struggles, motivations, plateaus per belt (5 profiles)
- **Feature Adaptations** — Dashboard metrics, session logger prompts, chatbot tone (6 adaptation types)
- **Risk Detection** — Dropout warning signs with belt-specific interventions (12 signals)
- **Journal Analysis** — Detect ego challenges, breakthroughs, injuries in text (18 patterns)

### Configuration Files

| File | Purpose |
|------|---------|
| `belt-profiles.ts` | Psychology profiles per belt |
| `feature-adaptations.ts` | Feature behavior by belt |
| `risk-signals.ts` | Dropout detection rules |
| `journal-patterns.ts` | Text analysis patterns |
| `types.ts` | TypeScript definitions |

### Usage

```typescript
import { useBeltPersonalization } from '@/hooks';

const { profile, dashboard, chatbot, videoTutorials, analyzeJournal } = useBeltPersonalization();
```

### Integration Status by Feature

| Feature | Uses System | Depth | Notes |
|---------|-------------|-------|-------|
| Dashboard | YES | 85% | Missing celebration thresholds |
| Session Logger | YES | 40% | Field visibility not gated |
| Session History | IMPORTED | 10% | Hook imported, not used |
| Technique Library | YES | 40% | Difficulty filtering missing |
| AI Insights | YES | 70% | Risk messaging missing |
| Belt Progress | YES | 30% | Plateau guidance missing |
| Profile | YES | 50% | Timing not adapted |
| Risk Detection | DESIGNED | 0% | Spec complete, not built |
| Re-engagement | DESIGNED | 0% | Spec complete, not built |

**Full Integration Spec:** `/docs/product/BELT_INTEGRATION_SPEC.md`

---

## 10. Design System

**Status:** Complete | **Location:** `/docs/design-system/` + `/prototype/src/index.css`

Comprehensive design system with tokens, components, and icons.

### What It Does

- **Design Tokens** — Colors, typography, spacing, shadows
- **Component Library** — Buttons, cards, badges, inputs
- **Icon Library** — 95+ SVG lineart icons
- **Interactive Browser** — HTML preview at `#design-system`

### Key Principles

- **No emojis** — SVG lineart icons only
- **Dark theme** — `#111111` background with gold accents
- **Large typography** — Hero numbers up to 180px
- **Font weight 500+** — Nothing lighter on dark backgrounds
- **12px minimum** — Font size floor

---

## 11. UI Components

**Status:** Complete | **Location:** `/prototype/src/components/ui/`

Reusable UI primitives.

| Component | Purpose |
|-----------|---------|
| `Icons.tsx` | 95+ SVG icons |
| `StatCard.tsx` | Stat display card |
| `BeltBadge.tsx` | Belt level badge |
| `TrainingBadge.tsx` | Gi/No-Gi badge |
| `ProgressRing.tsx` | Circular progress |
| `Toast.tsx` | Notification toasts |
| `ErrorState.tsx` | Error displays |
| `EmptyState.tsx` | Empty state displays |
| `Skeleton.tsx` | Loading skeletons |
| `SubmissionPicker.tsx` | Submission selection UI |
| `YouTubeEmbed.tsx` | Video player |
| `StyleFingerprint.tsx` | Radar chart |
| `BreakthroughHero.tsx` | Achievement display |
| `TournamentReadinessCard.tsx` | Competition prep |
| `BodyHeatMap.tsx` | Body region visualization |

---

# PLANNED FEATURES (MVP)

These features are specified and ready for implementation.

---

## 12. Voice-to-Text AI Recording

**Status:** Planned | **Priority:** MVP Phase 1

Real voice transcription replacing mock AI in the prototype.

### Specification

| Aspect | Detail |
|--------|--------|
| **Provider** | AssemblyAI |
| **Why AssemblyAI** | 24% better accuracy on proper nouns (BJJ terminology), 30% lower hallucination rate |
| **Custom Vocabulary** | BJJ-specific terms (kimura, de la Riva, berimbolo, etc.) |
| **Pricing** | $0.0062/min (Best tier) or $0.002/min (Nano tier) |
| **Free Credits** | $50 (~135 hours for testing) |

### User Flow

Same as current prototype, but with real transcription:

```
User taps Record → Audio captured → AssemblyAI transcription →
AI extraction to structured data → Review screen → Save
```

### Implementation Notes

- Use expo-av for voice recording in React Native
- Stream audio to AssemblyAI for real-time transcription
- Configure custom vocabulary for BJJ terms
- Handle offline: queue recordings for later processing

---

## 13. Injury Tracking

**Status:** Planned | **Priority:** MVP Phase 1

Quick-flag injury tracking with pattern detection.

### Why MVP

- Injuries are the **#1 reason people quit BJJ**
- 91% of practitioners sustain at least one injury
- No BJJ app systematically tracks injuries
- This is a retention lever hiding in plain sight

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| Respect 90-second window | One-tap flag, not detailed form |
| Don't catastrophize | "Something bothering you?" not "Report injury" |
| Pattern detection | Same body part 3x in 8 weeks = proactive alert |
| Return support | After gap + injury flag: "Welcome back. How'd it feel?" |

### User Flow

**After Session Logging:**
```
[Session logged]

"Anything feel off today?"

[Nothing major]  [Something's bothering me]
                        ↓
            [Body part: Neck | Shoulder | Knee | Fingers | Ribs | Back | Other]
```

**Pattern Detection (3+ flags in 8 weeks):**
```
"Your shoulder has come up in 3 of your last 6 sessions.
Recurring issues often have root causes—worth investigating?"
```

**Return After Injury:**
```
"Welcome back. Last time you mentioned [shoulder].
How'd it feel today?"

[Better]  [Same]  [Worse]
```

### Data Model

| Field | Type | Required |
|-------|------|----------|
| `body_part` | enum | If flagged |
| `session_id` | FK | Yes (auto) |
| `created_at` | timestamp | Yes (auto) |
| `notes` | text | No |

### Integration Points

- Session Logger: Optional injury flag after save
- Dashboard: Surface recurring injury patterns
- Coach Share: Include injury patterns in summary
- Re-engagement: Injury-aware return messaging

---

## 14. Coach Share

**Status:** Planned | **Priority:** MVP Phase 1

AI-generated training summary to share with coach.

### Why MVP

- Coach-athlete relationship β=0.556 with performance
- Two staff interactions/month reduces churn 33%
- Practitioners rarely know how to start progress conversations
- This feature creates the bridge

### What the Coach Receives

AI-generated summary containing:

**1. Training Overview**
```
Training Summary for [Name]
Period: Last 30/60/90 days
Belt: Blue (2 stripes)

Sessions logged: 24 (avg 3x/week)
Consistency: Strong (longest gap: 5 days)
```

**2. Focus Areas**
```
Techniques mentioned most frequently:
- Half guard retention (12 mentions)
- Kimura from closed guard (8 mentions)
- Mount escapes (6 mentions)
```

**3. Patterns & Observations**
```
Positive trends:
- Guard retention mentioned as "improving" in 4 of last 6 sessions

Areas of struggle:
- "Getting passed on left side" noted 5 times

Physical notes:
- Shoulder mentioned in 3 sessions (possible recurring issue)
```

**4. Suggested Conversation Starters**
```
Based on this data, you might discuss:
- Left-side guard retention—recurring vulnerability
- Shoulder concern—worth checking on recovery status
```

### User Flow

```
Profile → "Share with Coach"

"Generate a training summary to share with your coach."

[Last 30 days]  [Last 60 days]  [Last 90 days]

[Generate Summary]
        ↓
[Preview - editable]
        ↓
[Send via Email]  [Copy to Clipboard]
```

### Privacy Controls

| Data | Included by Default | User Can Remove |
|------|---------------------|-----------------|
| Session frequency | Yes | Yes |
| Technique focus | Yes | Yes |
| Injury patterns | Yes | Yes |
| Emotional sentiment | No (opt-in) | N/A |
| Raw journal entries | No (summarized) | N/A |

### What Coach Share Does NOT Do

- **Not a report card** — No grades or scores
- **Not a promotion request** — Not for "Am I ready?"
- **Not automated** — User must initiate each share
- **Not surveillance** — Coach cannot access without user generating

---

## 15. Backend & Authentication

**Status:** Planned | **Priority:** MVP Phase 1

Supabase backend with authentication.

### Technology Stack

| Layer | Technology |
|-------|------------|
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Sign-In Methods | Email + Apple Sign-In |
| Storage | Supabase Storage (voice recordings) |

### Database Schema (Core Tables)

```sql
-- Users
users (
  id uuid PRIMARY KEY,
  email text,
  name text,
  belt text,
  stripes integer,
  gym_name text,
  training_start_date date,
  created_at timestamp
)

-- Sessions (Journal Entries)
sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  date date,
  training_type text,
  duration_minutes integer,
  sparring boolean,
  techniques_drilled text[],
  submissions_given jsonb,
  submissions_received jsonb,
  notes text,
  created_at timestamp
)

-- Injuries
injuries (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  session_id uuid REFERENCES sessions,
  body_part text,
  notes text,
  created_at timestamp
)
```

---

## 16. Stats & Data Visualizations

**Status:** Planned Enhancement | **Priority:** MVP Phase 2

Enhanced data visualizations for the Stats tab.

### Current (Prototype)

All stats modules use mock data. Ready for real data integration.

### MVP Enhancements

- Connect all modules to real session data
- Add time-range filtering (7d, 30d, 90d, all time)
- Add export functionality (PDF summary)
- Animate transitions between data states

---

## 17. Profile & Settings Enhancements

**Status:** Planned | **Priority:** MVP Phase 2

### Profile Additions

- Profile photo upload
- Coach connection (optional coach email)
- Training goals editor
- Belt promotion history

### Settings Additions

- Notification preferences
- Privacy controls
- Data export
- Account deletion

---

## 18. Payment & Subscription

**Status:** Planned | **Priority:** Post-MVP

### Pricing Model (Proposed)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Basic logging, 30-day history, limited stats |
| **Pro** | $9.99/mo | Unlimited history, all stats, AI insights, Coach Share |
| **Annual** | $79.99/yr | Pro features, 2 months free |

### Implementation

- Stripe for payment processing
- RevenueCat for subscription management
- Supabase for entitlement storage

---

# FEATURE DEVELOPMENT PHASES

## Phase 1: MVP Foundation

| Feature | Priority | Effort |
|---------|----------|--------|
| Backend setup (Supabase) | P0 | M |
| Authentication (Email + Apple) | P0 | M |
| Voice transcription (AssemblyAI) | P0 | M |
| Injury tracking | P0 | S |
| Coach Share | P0 | M |
| Connect stats to real data | P1 | L |

## Phase 2: Enhancement

| Feature | Priority | Effort |
|---------|----------|--------|
| Profile photo upload | P1 | S |
| Notification system | P1 | M |
| Data export | P2 | S |
| Time-range filtering | P2 | M |

## Phase 3: Monetization

| Feature | Priority | Effort |
|---------|----------|--------|
| Payment integration | P1 | L |
| Subscription management | P1 | M |
| Premium feature gating | P1 | M |

---

# IMPLEMENTATION NOTES

## API Service Layer

The prototype includes an API abstraction layer ready for backend swap:

**Location:** `/prototype/src/services/api.ts`

```typescript
// Current: localStorage
// Future: Swap to Supabase with zero component changes
export const api = {
  sessions: {
    create: async (data) => { /* localStorage now, Supabase later */ },
    list: async () => { /* localStorage now, Supabase later */ },
    update: async (id, data) => { /* ... */ },
    delete: async (id) => { /* ... */ },
  },
  // ... other resources
};
```

## Type Definitions

Types are designed to match planned Supabase schema:

**Location:** `/prototype/src/types/database.ts`

## Mock Data

All mock data is centralized for easy replacement:

**Location:** `/prototype/src/data/`

| File | Purpose |
|------|---------|
| `journal.ts` | Mock training stats and entries |
| `journal-entries.ts` | V2 journal entry format |
| `techniques.ts` | Technique library data |
| `techniqueVideos.ts` | Curated video catalog |
| `stats-modules.ts` | Belt-specific stats data |
| `submissions.ts` | Submission statistics |
| `competitions.ts` | Competition history |
| `mock-profiles.ts` | Demo persona profiles |

---

*Last updated: January 19, 2026*

---

## Related Documentation

- **Belt Integration Spec:** `/docs/product/BELT_INTEGRATION_SPEC.md` — Developer guide for belt personalization
- **Belt Psychology System:** `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` — Full psychology profiles
- **AI/Data Strategy:** `/docs/data-and-ai/` — Voice logging, conversation design, visualizations
- **Feature Backlog:** `/docs/project/BACKLOG.md` — Prioritized tasks including belt integration
- **User Personas:** `/docs/personas/TOMO_PERSONAS.md` — Test profiles by belt level
