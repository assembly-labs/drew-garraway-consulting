# TOMO Feature Documentation

**Last Updated:** January 25, 2026
**Total Features:** 93 across 11 pages
**Status:** Prototype complete at bjjj.pages.dev

> This is the single source of truth for all TOMO features. For belt personalization deep-dive, see `BELT_INTEGRATION_SPEC.md`. For stats module vision, see `STATS_MODULE_STRATEGY.md`.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Onboarding Flow](#1-onboarding-flow)
3. [Session Logger](#2-session-logger-journaling)
4. [Session History (Journal)](#3-session-history-journal-page)
5. [Session Detail & Edit](#4-session-detail--edit)
6. [Stats (Dashboard)](#5-stats-dashboard)
7. [Technique Library](#6-technique-library)
8. [Training Feedback (Insights)](#7-training-feedback-insights-page)
9. [Belt Progress](#8-belt-progress)
10. [Profile](#9-profile)
11. [Settings](#10-settings)
12. [Cross-Cutting Systems](#11-cross-cutting-systems)
13. [AI, Data & Technology](#12-ai-data--technology)
14. [Planned Features (MVP)](#13-planned-features-mvp)
15. [Data Models](#14-data-models)

---

## Quick Reference

### Status Legend

| Symbol | Meaning |
|--------|---------|
| Done | Complete in prototype |
| Partial | UI exists, integration incomplete |
| Planned | Designed, not built |

### Belt Access Legend

| Code | Meaning |
|------|---------|
| All | All belt levels |
| W | White belt only |
| B | Blue belt only |
| B+ | Blue and above |
| P+ | Purple and above |

### Feature Count by Page

| Page | Features | Status |
|------|----------|--------|
| Onboarding | 4 | Done |
| Session Logger | 11 | Done |
| Session History | 9 | Done |
| Session Detail | 9 | Done |
| Stats (Dashboard) | 19 | Done |
| Technique Library | 8 | Done |
| Training Feedback | 6 | Partial |
| Belt Progress (Profile Module) | 3 | Partial |
| Profile | 7 | Done |
| Settings | 8 | Done |
| Cross-Cutting | 5 | Partial |
| **TOTAL** | **93** | |

---

## 1. Onboarding Flow

**Component:** `Onboarding.tsx`
**Purpose:** Capture essential data + optional context to unlock personalization from day 1
**Full Spec:** `_manual_product_requirements_doc/ONBOARDING_PRD.md`

### Features (4 Screens)

| # | Feature | Description | Data Captured | Required | Status |
|---|---------|-------------|---------------|----------|--------|
| 1.1 | Welcome Screen | Sets tone, explains value proposition | — | — | Done |
| 1.2 | About You Screen | Name + belt + stripes (combined) | `name`, `belt`, `stripes` | Yes | Done |
| 1.3 | Your Training Screen | Frequency + optional context | `targetFrequency` + optionals | Mixed | Done |
| 1.4 | Get Started Screen | Logging preference + ready CTAs | `loggingPreference` | Yes | Done |

### User Flow (Consolidated)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   WELCOME   │ ──▶ │  ABOUT YOU  │ ──▶ │YOUR TRAINING│ ──▶ │ GET STARTED │
│             │     │             │     │             │     │             │
│  (intro)    │     │ Name*       │     │ Gym*        │     │ Voice/Text* │
│             │     │ Belt*       │     │ Frequency*  │     │ ─────────── │
│             │     │ Stripes*    │     │ ─────────── │     │ Ready CTAs  │
│             │     │             │     │ Goals (opt) │     │             │
│             │     │             │     │ Exp (opt)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

* = mandatory
```

### Data Captured at Onboarding

**Mandatory (6 fields - cannot skip):**

| Field | Screen | Type | Why Critical |
|-------|--------|------|--------------|
| `name` | About You | text | Personalization in every screen |
| `belt` | About You | enum | Foundation of personalization system |
| `stripes` | About You | number (0-4) | Refines belt psychology |
| `gym` | Your Training | search/select | Gym affiliation is core to BJJ identity |
| `targetFrequency` | Your Training | number (2/4/5) | Enables consistency tracking from day 1 |
| `loggingPreference` | Get Started | enum | Determines first session experience |

**Optional (2 fields - skip → asked later):**

| Field | Screen | Type | If Skipped |
|-------|--------|------|------------|
| `trainingGoals` | Your Training | multi-select | Asked at Session 10 |
| `experienceLevel` | Your Training | enum | Asked at Session 3 |

### Gym Picker Feature

The gym picker uses a database of **120+ popular BJJ gyms** organized by affiliation:
- **Search mode**: Type to filter gyms in real-time
- **Browse mode**: Scroll through gyms grouped by affiliation (Alliance, Atos, Gracie Barra, etc.)
- **Manual entry**: "My gym isn't listed" opens form for custom entry
- **Data file**: `/prototype/src/data/GYM_DATABASE.md` (documentation), `/prototype/src/data/gyms.ts` (implementation)

### Design Notes

- **4 screens** (consolidated from 6) - faster completion
- **6 mandatory inputs** - blocks progress until answered
- **2 optional inputs** - clearly marked, can skip without friction
- Completable in **<60 seconds** (mandatory only), **<90 seconds** (with optionals)
- Optional section has clear "TELL US MORE (OPTIONAL)" divider
- If optional fields skipped, asked via progressive profiling later

### Still Deferred to Progressive Profiling

| Field | When Asked | Why Not at Onboarding |
|-------|------------|----------------------|
| `trainingStartDate` | Session 3 | Can derive from experienceLevel |
| `beltPromotionDate` | Session 15 | Too specific, can estimate |
| `birthYear` | Session 18 | Feels invasive upfront |

---

## 2. Session Logger (Journaling)

**Components:** `SessionLogger.tsx`, `VoiceFirstLogger.tsx`
**Purpose:** Capture training details at the critical post-training moment

### The 90-Second Window

Users are exhausted post-training: depleted glucose, elevated cortisol, 20-40% reduced decision-making capacity. This is the ONLY moment details are fresh—and the WORST moment to ask for effort.

**Design mandates:**
- Voice-first (speaking is easier than typing when exhausted)
- One question at a time
- 56-80px touch targets for primary actions
- Skip always available for non-critical fields

### Features

| # | Feature | Description | Data Captured | Access | Status |
|---|---------|-------------|---------------|--------|--------|
| 2.1 | Training Type Selection | Quick categorization | `session.trainingType` (gi/nogi/open) | All | Done |
| 2.2 | Duration Selection | Log training time | `session.durationMinutes` (60/90/120) | All | Done |
| 2.3 | Sparring Toggle | Indicate if they rolled | `session.didSpar` | All | Done |
| 2.4 | Voice Recording | Talk naturally about session | Audio → transcription | All | Done* |
| 2.5 | AI Processing | Extract structured data from voice | Transcription → fields | All | Done* |
| 2.6 | Review Phase | Confirm/edit extracted data | All session fields | All | Done |
| 2.7 | Submission Picker | Visual picker for subs given/received | `submissionsGiven/Received` | B+ | Done |
| 2.8 | Technique Suggestions | Help name techniques | Based on history + belt | All | Done |
| 2.9 | Success Confirmation | Belt-personalized message | `sessionCount` | All | Done |
| 2.10 | "What's Clicking" / "What Needs Work" | Explicit capture of session wins and struggles as chips in the Review Phase, pre-populated from AI extraction and user-editable (max 5 per section) | `workedWell[]`, `struggles[]` | All | Planned |
| 2.11 | Post-Save Summary Card | Mini journal entry card shown on Success screen after save, previewing how the session will appear in the Journal (auto-dismiss after 3 seconds or tap to continue) | Session summary data | All | Planned |

*Mock transcription in prototype; AssemblyAI planned for iOS

### User Flow

```
Entry Screen          →  Recording        →  Processing    →  Review        →  Success
[Type/Duration/Spar]     [Voice capture]     [AI extract]     [Edit form]      [Message]
```

### Data Captured

| Field | Input Method | Required |
|-------|--------------|----------|
| Training type | Tap | Yes |
| Duration | Tap | Yes |
| Sparring Y/N | Tap | Yes |
| Techniques drilled | Voice/Text | No |
| Submissions given | Voice/Picker | No |
| Submissions received | Voice/Picker | No |
| Struggles | Voice/Text | No |
| What worked well | Voice/Text | No |
| Notes | Voice/Text | No |

### Belt Personalization

**Hook:** `useBeltPersonalization()` → `{ sessionLogger, getPostSessionMessage }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Prompt Style | Encouraging | Neutral | Analytical |
| Technique Suggestions | 5 | 10 | 15-25 |
| Show Submission Picker | NO | YES | YES |
| Show Positional Time | NO | NO | YES |
| Default Duration | 60 min | 90 min | 90-120 min |

**Post-Session Messages:**

| Belt | Message |
|------|---------|
| White | "Great work showing up. Consistency beats intensity—you're building your foundation." |
| Blue | "Session logged. Keep developing your game." |
| Purple+ | "Logged. Your depth of understanding grows with each session." |

**Integration Status:** 40% — Post-session message works. Field visibility not belt-gated yet.

---

## 3. Session History (Journal Page)

**Component:** `SessionHistory.tsx`
**Purpose:** Browse and filter logged training sessions

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 3.1 | Log New Session Button | Primary CTA | — | All | Done |
| 3.2 | Session Count & Rounds | Quick stats header | `sessions.length`, `sparringRounds` | All | Done |
| 3.3 | Training Type Filter | Filter by gi/nogi | `sessions[].trainingType` | All | Done |
| 3.4 | Grouped Entries | Today/Yesterday/This Week/Earlier | `sessions[].date` | All | Done |
| 3.5 | Journal Entry Cards | Session preview cards | Session data | All | Done |
| 3.6 | Empty State | Belt-specific encouragement | `user.belt` | All | Done |
| 3.7 | Infinite Scroll | Lazy loading with month-grouped sticky headers, replacing fixed entry limit (initial load 10, load 10 more at 200px from bottom) | `sessions[]`, `sessions[].date` | All | Planned |
| 3.8 | Delete Session | Soft delete via overflow menu in SessionDetail (sets `deleted_at` timestamp); requires confirmation dialog, navigates back to Journal with toast | `session.deleted_at` | All | Planned |
| 3.9 | Backdate Session | "Add a past session" link below Log Session CTA; opens date picker (last 30 days, no future dates, default yesterday) then launches standard VoiceFirstLogger flow with selected date pre-filled | `session.date`, `session.createdAt` | All | Planned |

### Card Complexity by Belt

| Belt | Fields Shown |
|------|--------------|
| White | Date, type, duration, topic, notes |
| Blue | + Techniques, rounds, worked/struggles |
| Purple+ | + Submissions given/received |

**Visual Example:**

```
WHITE BELT CARD                    PURPLE BELT CARD
┌──────────────────────┐           ┌──────────────────────┐
│ Today, 7:15 PM  [Gi] │           │ Today, 7:15 PM  [Gi] │
│ 90 minutes           │           │ 90 min • 5 rounds    │
│                      │           │                      │
│ Lesson: Guard basics │           │ Focus: Berimbolo     │
└──────────────────────┘           │ Given: Triangle (2)  │
                                   │ Received: RNC (1)    │
                                   └──────────────────────┘
```

**Integration Status:** 10% — Hook imported but card complexity not implemented.

---

## 4. Session Detail & Edit

**Components:** `SessionDetail.tsx`, `EditSheet.tsx`, `EditSections.tsx`
**Purpose:** View full session details with section-based editing

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 4.1 | AI Narrative Summary | Natural language session recap | All session fields | All | Done |
| 4.2 | Training Details Edit | Type, duration, sparring | Core fields | All | Done |
| 4.3 | Techniques Edit | Add/remove techniques | `techniquesDrilled[]` | All | Done |
| 4.4 | Sparring Details Edit | Rounds, partners, outcomes | `sparringRounds`, subs | B+ | Done |
| 4.5 | Insights Edit | Worked well / Struggles | `workedWell[]`, `struggles[]` | All | Done |
| 4.6 | Notes Edit | Free-form notes | `notes` | All | Done |
| 4.7 | Energy & Mood Edit | Physical/mental state | `energyLevel`, `mood` | All | Done |
| 4.8 | Bottom Sheet Modal | Smooth section editing | Section data | All | Done |
| 4.9 | Date/Time Editing | Edit session date and time in edit mode via date/time pickers; date limited to past only (last 90 days), changing date moves entry to correct position in history with confirmation prompt | `session.date`, `session.time` | All | Planned |

### Edit Flow

- Tap any section to open edit sheet
- Changes are staged until explicit save
- Large touch targets maintained for potential post-training edits

---

## 5. Stats (Dashboard)

**Component:** `Dashboard.tsx`
**Purpose:** Belt-adaptive statistics and training insights

The dashboard fundamentally changes based on belt level—not just what data is shown, but what story the data tells.

### 5.1 Core Modules (All Belts)

| # | Module | Purpose | Data Required | Status |
|---|--------|---------|---------------|--------|
| 5.1.1 | Hero Metric | Most important stat for belt level | `sessions[]`, `user.belt` | Done |
| 5.1.2 | Breakthrough Hero | Auto-celebrates milestones | `sessions[]`, achievements | Done |
| 5.1.3 | AI Callouts | "What's Working" / "Focus Area" | `sessions[]` | Done |
| 5.1.4 | Recent Rolls | Shows submissions received | `submissionsReceived[]` | Done |
| 5.1.5 | Locked Features Footer | Shows what unlocks next | `user.belt`, `sessionCount` | Done |

**Hero Metric by Belt:** See [STATS_CURRENT_STATE_PRD.md](_manual_product_requirements_doc/STATS_CURRENT_STATE_PRD.md) for the authoritative hero metric definitions per belt level.

### 5.2 White Belt Modules

| # | Module | Purpose | Status |
|---|--------|---------|--------|
| 5.2.1 | Weekly Progress Ring | Apple Watch-style goal progress | Done |
| 5.2.2 | Calendar Heat Map | 13-week consistency (NOT streak-based) | Done |
| 5.2.3 | Dashboard Summary | Sessions, hours, streak totals | Done |
| 5.2.4 | Defense Focus Chart | Offense/defense toggle | Done |

**Design rationale:** White belts are in survival mode. They need to see that showing up is valuable. No competition stats, no win/loss ratios—these would be demoralizing at this stage.

### 5.3 Blue+ Belt Modules

| # | Module | Purpose | Status |
|---|--------|---------|--------|
| 5.3.1 | Style Profile (Radar) | 6-axis grappling fingerprint | Done |
| 5.3.2 | Session Type Distribution | Gi/nogi/drilling donut chart | Done |
| 5.3.3 | Sparring Pattern Analysis | Submission exchange rates | Done |
| 5.3.4 | Achievement Timeline | Journey milestones | Done |
| 5.3.5 | Attack Profile Section | Body heat map + vulnerabilities | Done |
| 5.3.6 | Tournament Readiness | 4-pillar competition prep | Done |

**Style Profile Dimensions:** Guard, Passing, Top Control, Back Attacks, Takedowns, Leg Locks

**Attack Profile Sub-components:** `BodyHeatMap`, `DeadliestAttackCard` (requires 50+ subs), `AchillesHeelCard`

### 5.4 Blue Only Modules

| # | Module | Purpose | Status |
|---|--------|---------|--------|
| 5.4.1 | Technique Pairings | Co-occurrence drilling analysis | Done |
| 5.4.2 | Blues Detector | Dropout risk intervention | Done |

**Blues Detector Triggers:** Attendance decline 50%+, gap 14+ days, negative sentiment in journal

### 5.5 Purple+ Modules

| # | Module | Purpose | Status |
|---|--------|---------|--------|
| 5.5.1 | Your Journey | Multi-year progression view | Done |
| 5.5.2 | Technique Mastery | Specialization depth by position | Done |

### Module Visibility Matrix

> **Authoritative source:** See [STATS_CURRENT_STATE_PRD.md](_manual_product_requirements_doc/STATS_CURRENT_STATE_PRD.md) for the complete module visibility matrix by belt level (White/Blue/Purple/Brown/Black). That document is the single source of truth for which modules are visible at each belt.

### Belt Personalization (Dashboard)

**Hook:** `useBeltPersonalization()` → `{ dashboard, profile }`

> **Primary Metric by Belt:** See [STATS_CURRENT_STATE_PRD.md](_manual_product_requirements_doc/STATS_CURRENT_STATE_PRD.md) for authoritative definitions.

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Streak Emphasis | HIGH | MEDIUM | LOW |
| Show Competition Stats | NO | YES | YES |
| Insight Focus | "survival_skills" | "game_development" | "systems_thinking" |
| Celebration Threshold | Every 10 sessions | Every 25 | Every 50 |

**Integration Status:** 85% — Missing celebration thresholds.

---

## 6. Technique Library

**Component:** `TechniqueLibrary.tsx`
**Purpose:** Browse, search, and learn BJJ techniques with curated video instruction

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 6.1 | View Toggle | Switch For You / Browse | `viewMode` | All | Done |
| 6.2 | "For You" Recommendations | Personalized video suggestions | `sessions[]`, belt config | All | Done |
| 6.3 | Position Categories | Browse by position | Technique taxonomy | All | Done |
| 6.4 | Mindset Categories | Mental game content | Video library | All | Done |
| 6.5 | Priority Instructors | World-class instruction | Curated library | All | Done |
| 6.6 | Technique Progress | Proficiency tracking + Log Practice | `techniqueProgress[]` | All | Done |
| 6.7 | Video Embeds | Watch in-app | YouTube IDs | All | Done |
| 6.8 | Search | Find techniques/videos | Names, titles | All | Done |

### Position Categories

Closed Guard, Half Guard, Open Guard, Mount, Side Control, Back Control, Guard Passing, Takedowns, Submissions, Turtle, Clinch

### Mindset Categories

Belt Journey, Mental Game, Age & Longevity, Lifestyle, Injury & Recovery

### Priority Instructors

John Danaher, Gordon Ryan, Lachlan Giles, Craig Jones

### "For You" Algorithm

```
1. Get recent journal entries (last 10 sessions)
2. Extract techniques mentioned + struggles
3. Apply belt difficulty filter
4. If prioritizeDefense: weight defensive content 2x
5. Return top N videos where N = weeklyRecommendationCount
```

### Belt Personalization (Technique Library)

**Hook:** `useBeltPersonalization()` → `{ videoTutorials, profile }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Difficulty Range | 1-3 | 2-5 | 4-10 |
| Prioritize Defense | YES | NO | NO |
| Include Conceptual | NO | YES | YES |
| Weekly Recommendations | 3 | 5 | 3 (quality focus) |

### Gated Categories (Planned - Not Implemented)

| Category | White | Blue | Purple+ |
|----------|-------|------|---------|
| Basic Guards | YES | YES | YES |
| Advanced Guards | NO | YES | YES |
| Leg Locks | NO | Basic | YES |
| Advanced Systems | NO | NO | YES |

**Current Status:** Not implemented. All content is visible to all belt levels. The table above represents the planned design.

**Integration Status:** 65% — Belt suggestions work (recommended positions per belt). Log Practice button persists to localStorage (`bjj-practice-logs`), updates TechniqueProgress, shows toast feedback. See `/docs/data-and-ai/PRACTICE_TRACKING.md` for data spec. Content gating and difficulty filtering not implemented.

---

## 7. Training Feedback (Insights Page)

**Component:** `TrainingFeedback.tsx`
**Purpose:** AI-generated coaching insights based on session history

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 7.1 | Daily Insight Generation | One insight/day when conditions met | `sessions[]`, dates | All | Done |
| 7.2 | Typewriter Animation | Engaging text reveal | Insight text | All | Done |
| 7.3 | Belt-Personalized Tone | Language matches belt | `chatbot.*` config | All | Partial |
| 7.4 | Video Suggestions | Related technique videos | Insight topic | All | Done |
| 7.5 | Coach Deferral | Reminder coach is authority | — | All | Done |
| 7.6 | Risk-Aware Messaging | Intervention when risk detected | Risk signals | All | Planned |

### Brand Voice: "The Dedicated Training Partner"

- Knowledgeable but humble
- Warm but direct
- Supportive but honest
- Always defers to the user's coach as the real authority

### Belt Personalization (Insights)

**Hook:** `useBeltPersonalization()` → `{ chatbot, profile, analyzeJournal }`

| Adaptation | White | Blue | Purple+ |
|------------|-------|------|---------|
| Tone | Warm, supportive | Coaching, balanced | Peer, analytical |
| Encouragement Level | HIGH | MODERATE | MINIMAL |
| Technical Vocabulary | Basic | Intermediate | Advanced |
| Response Depth | 1-2 sentences | Paragraph | Detailed analysis |

### Topics by Belt

| Belt | Emphasize | Avoid |
|------|-----------|-------|
| White | Survival, escapes, relaxation, when to tap | Advanced leg locks, berimbolo, competition strategy |
| Blue | Game development, combinations, plateau normalization | None |
| Purple+ | Systems thinking, teaching methodology, refinement | None |

### Risk-Aware Messaging

When dropout risk signals are detected:

| Belt | Message |
|------|---------|
| White | "We noticed you've been away. Everything okay?" |
| Blue | "Blue belt blues are real. This is part of the path." |
| Purple+ | "Your skills don't disappear. We're here when you're ready." |

**Integration Status:** 70% — Tone works. Risk messaging not implemented.

---

## 8. Belt Progress (Profile Module)

> **Not a standalone page.** Belt progress is a simple module within the Profile page. The existing `BeltProgress.tsx` page component should be deprecated.
>
> **Detailed spec:** See [PROFILE_SETTINGS_PRD.md](/_manual_product_requirements_doc/PROFILE_SETTINGS_PRD.md) — "Belt & Stripe Progression History" section.

**Location:** Profile page module
**Purpose:** Record belt and stripe changes as the user manually updates the app. Event-sourced — only shows what the user has recorded, no future projections or comparisons.

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 8.1 | Belt Progress Display | Current belt + time at belt + recorded event history | `beltProgressionEvents[]` | All | Planned (redesign) |
| 8.2 | Time at Current Belt | Duration since most recent progression event | Most recent event date | All | Done |
| 8.3 | Belt/Stripe Edit | Tap to update belt or stripes, creates dated event | Profile edit flow | All | Planned |

### Supported Belt Levels

Full IBJJF path: White, Blue, Purple, Brown, Black, Red/Black, Red/White, Red.

### Critical Display Note

Always include: **"Belt promotions are your coach's decision—this is for context only."**

---

## 9. Profile

**Component:** `ProfileScreen.tsx`
**Purpose:** User profile with progressive profiling and journey visualization

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 9.1 | Profile Avatar | Visual identity with belt border | `name`, `belt` | All | Done |
| 9.2 | Completion Tracker | % complete + missing fields | All profile fields | All | Done |
| 9.3 | Progressive Profiling | Contextual questions at milestones | `sessionCount`, schedule | All | Done |
| 9.4 | Editable Fields | Update profile anytime | All profile fields | All | Done |
| 9.5 | Belt Journey Viz | Promotion timeline | `beltHistory[]` | All | Done |
| 9.6 | Training Stats Summary | Sessions, hours, streak, tenure | `sessions[]` | All | Done |
| 9.7 | Settings Access | Navigate to settings | — | All | Done |

### Progressive Profiling

Instead of long onboarding, we collect profile data over ~20 sessions:

| Session | Question Asked |
|---------|----------------|
| 3 | Training start date |
| 5 | Stripes count |
| 7 | Gym name |
| 10 | Training goals |
| 12 | Target frequency |
| 15 | Current belt date |
| 18 | Birth year |

### Belt Timing Adjustments

| Belt | Adjustment | Skip Tolerance |
|------|------------|----------------|
| White | +2 sessions delay | 3 skips |
| Blue | Standard | 3 skips |
| Purple+ | -2 sessions early | 2 skips |

**Rationale:** White belts need more time to build the habit before we ask questions. Purple+ practitioners are committed and can handle earlier asks.

**Integration Status:** 50% — Profiling works. Belt timing not adapted.

---

## 10. Settings

**Component:** `Settings.tsx`
**Purpose:** App preferences, demo mode, data management

### Features

| # | Feature | Description | Data Used | Access | Status |
|---|---------|-------------|-----------|--------|--------|
| 10.1 | Logging Preference | Voice/text mode toggle | `loggingPreference` | All | Done |
| 10.2 | Notification Toggles | Control alerts | Notification prefs | All | Done* |
| 10.3 | Data Export | Export as JSON | All user data | All | Done |
| 10.4 | Demo Mode Toggle | Enable testing mode | Demo flag | All | Done |
| 10.5 | Persona Switcher | Switch test personas | Persona profiles | All | Done |
| 10.6 | Persona Info Display | See active persona details | Active persona | All | Done |
| 10.7 | Profile Reset | Clear all data | — | All | Done |
| 10.8 | App Information | Version, legal, support | App version | All | Done |

*UI complete; actual notifications planned for iOS

### Test Personas

| Key | Name | Belt | Archetype | Status |
|-----|------|------|-----------|--------|
| white-excelling | Jake Thompson | W (3 str) | The Natural | Thriving |
| white-at-risk | David Morrison | W (2 str) | The Late Starter | Struggling |
| blue-excelling | Marcus Chen | B (2 str) | The Dedicated Hobbyist | Progressing |
| blue-at-risk | Ryan Torres | B (1 str) | The Fading Fire | Declining |
| purple-average | Sofia Rodriguez | P (1 str) | The Grinder | Stable |
| brown-average | Elena Kim | Br (2 str) | The Veteran | Refined |

---

## 11. Cross-Cutting Systems

These systems affect multiple pages throughout the app.

### 11.1 Belt Personalization Engine

**Location:** `/prototype/src/config/belt-system/`

| File | Purpose |
|------|---------|
| `belt-profiles.ts` | Psychology profiles (5 belts) |
| `feature-adaptations.ts` | Feature behavior by belt |
| `risk-signals.ts` | Dropout detection (11 signals) |
| `journal-patterns.ts` | Pattern matching in entries |
| `types.ts` | TypeScript definitions |

**Usage:**

```typescript
import { useBeltPersonalization } from '@/hooks';

const {
  profile,        // Psychology profile for user's belt
  dashboard,      // Dashboard adaptations
  sessionLogger,  // Session logger adaptations
  chatbot,        // AI/chatbot adaptations
  videoTutorials, // Video recommendation settings
  isInRiskWindow, // Is user at dropout risk?
  analyzeJournal, // Analyze journal text for patterns
} = useBeltPersonalization();
```

### 11.2 Risk Detection System

**11 Signals Tracked with Belt Multipliers:**

| Signal | White | Blue | Purple+ |
|--------|-------|------|---------|
| Gap 14+ days | 1.8x | 1.5x | 0.8x |
| Attendance -30% | 1.6x | 1.4x | 0.9x |
| Negative sentiment | 1.7x | 1.3x | 0.7x |
| Injury mention | 1.5x | 1.2x | 0.6x |
| Streak break | 1.4x | 1.2x | 0.9x |
| Technique stagnation | 0.8x | 1.4x | 1.0x |
| Sparring avoidance | 1.6x | 1.4x | 1.0x |

**Interpretation:** Higher multiplier = higher risk at that belt. White belts are most vulnerable to gaps and attendance decline. Blue belts are uniquely vulnerable to technique stagnation (plateau).

### 11.3 Journal Pattern Analysis

**9 Pattern Categories:** Ego challenge, Progress, Plateau, Injury, Social, Technique, Competition, Motivation, Teaching

Used for:
- Detecting breakthrough moments
- Identifying recurring struggles
- Triggering risk interventions
- Generating insights

### 11.4 UI Component Library

**Location:** `/prototype/src/components/ui/`

| Category | Components |
|----------|------------|
| Core | `BeltBadge`, `TrainingBadge`, `StatCard`, `ProgressRing`, `Icons` (95+) |
| States | `EmptyState`, `ErrorState`, `NotFound`, `Skeleton` (6 variants), `Toast` |
| BJJ-Specific | `SubmissionPicker`, `BodyHeatMap`, `StyleFingerprint`, `BreakthroughHero`, `TournamentReadinessCard` |
| Media | `YouTubeEmbed`, `VideoThumbnail` |

---

## 12. AI, Data & Technology

### How AI Is Used

| Feature | AI Role | Current State |
|---------|---------|---------------|
| **Voice Transcription** | Convert speech to text | Mock (AssemblyAI planned) |
| **Session Extraction** | Parse transcription into structured fields | Mock logic |
| **Daily Insights** | Generate coaching observations from patterns | Template-based |
| **Breakthrough Detection** | Identify milestone achievements | Rule-based |
| **Risk Detection** | Calculate dropout probability | Algorithm-based |
| **Video Recommendations** | Match content to user needs | Rule-based filtering |

### Data Philosophy

1. **Reflection over collection** — We capture data to facilitate reflection, not build a database
2. **Process over outcome** — Focus on what you're working on, not belt timelines
3. **Specificity over encouragement** — "Triangle improved 40%" beats "Great job!"
4. **Belt-appropriate depth** — White belts see simple stats; purple belts see systems

### Technology Stack

| Layer | Current (Prototype) | Planned (iOS) |
|-------|---------------------|---------------|
| Framework | React 18 + TypeScript | React Native + Expo |
| Build | Vite | Expo EAS |
| Styling | CSS Variables | CSS Variables |
| State | React Context + localStorage | React Context + Supabase |
| Auth | Mock | Supabase Auth + Apple Sign-In |
| Database | localStorage | Supabase (PostgreSQL) |
| Voice | Mock | AssemblyAI |
| Hosting | Cloudflare Pages | App Store |

### Why AssemblyAI for Voice

- **24% better accuracy** on proper nouns (critical for BJJ terminology)
- **30% lower hallucination rate** than Whisper (important for exhausted users)
- **Custom vocabulary** support for BJJ-specific terms
- **$50 free credits** (~135 hours of testing)

---

## 13. Planned Features (MVP)

### 13.1 Real Voice Transcription

**Status:** Planned | **Priority:** MVP Phase 1

Replace mock transcription with AssemblyAI:
- Use expo-av for voice recording
- Stream to AssemblyAI for real-time transcription
- Configure custom vocabulary (kimura, de la Riva, berimbolo, etc.)
- Handle offline: queue recordings for later processing

### 13.2 Injury Tracking

**Status:** Planned | **Priority:** MVP Phase 1

Quick-flag injury tracking with pattern detection:

```
After Session:
"Anything feel off today?"
[Nothing major]  [Something's bothering me]
                        ↓
            [Neck] [Shoulder] [Knee] [Fingers] [Ribs] [Back] [Other]
```

**Pattern Detection:** Same body part 3x in 8 weeks → proactive alert

**Why MVP:** Injuries are #1 reason people quit BJJ. No BJJ app systematically tracks this.

### 13.3 Coach Share

**Status:** Planned | **Priority:** MVP Phase 1

AI-generated training summary to share with coach:

- Training overview (sessions, consistency)
- Focus areas (techniques mentioned most)
- Patterns & observations (trends, struggles)
- Suggested conversation starters

**Privacy:** User must initiate each share. Coach cannot access without user generating.

### 13.4 Backend & Authentication

**Status:** Planned | **Priority:** MVP Phase 1

- Supabase for database and auth
- Email + Apple Sign-In
- Real data persistence
- Sync across devices

### 13.5 Payment & Subscription

**Status:** Planned | **Priority:** Post-MVP

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Basic logging, 30-day history, limited stats |
| Pro | $9.99/mo | Unlimited history, all stats, AI insights, Coach Share |
| Annual | $79.99/yr | Pro features, 2 months free |

---

## 14. Data Models

### User Profile

```typescript
interface UserProfile {
  // Captured at onboarding - MANDATORY
  userId: string;
  name: string;
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: 0 | 1 | 2 | 3 | 4;
  gym: GymSelection;                    // Selected from database or manually entered
  targetFrequency: number;              // 2, 4, or 5 (representing 1-2x, 3-4x, 5+ per week)
  loggingPreference: 'voice' | 'text';
  onboardingComplete: boolean;
  sessionCount: number;

  // Captured at onboarding - OPTIONAL (if skipped, asked via progressive profiling)
  trainingGoals?: string[];             // ['competition', 'fitness', 'hobby', 'mental']
  experienceLevel?: 'new' | 'beginner' | 'intermediate' | 'experienced';  // Fallback: Session 3

  // Captured via progressive profiling only
  trainingStartDate?: string;           // Can derive from experienceLevel
  beltPromotionDate?: string;           // Session 15
  birthYear?: number;                   // Session 18
}

interface GymSelection {
  gymId: string;                        // Database ID or generated UUID for custom
  gymName: string;                      // Display name
  isCustom: boolean;                    // True if user-entered
  city?: string;                        // Optional
  stateOrCountry?: string;              // Optional
  affiliation?: string;                 // From database (Alliance, Atos, etc.)
}
```

### Session (Journal Entry)

```typescript
interface Session {
  id: string;
  userId: string;
  date: string;
  trainingType: 'gi' | 'nogi' | 'both' | 'openmat';
  durationMinutes: number;
  techniquesDrilled: string[];
  didSpar: boolean;
  sparringRounds?: number;
  submissionsGiven?: Submission[];
  submissionsReceived?: Submission[];
  struggles?: string[];
  workedWell?: string[];
  notes?: string;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  mood?: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

interface Submission {
  type: string;
  count: number;
}
```

### Belt History

```typescript
interface BeltPromotion {
  belt: BeltLevel;
  date: string;
  stripes?: number;
}
```

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `BELT_INTEGRATION_SPEC.md` | Developer guide for belt personalization integration |
| `BELT_PERSONALIZATION_SYSTEM.md` | Quick reference for belt system |
| `STATS_MODULE_STRATEGY.md` | Vision for belt-adaptive stats modules |
| `STATS_MODULE_IMPLEMENTATION.md` | Buildable stats module plan |
| `/docs/personas/PERSONA_PROFILES.md` | Detailed test persona specifications |
| `/docs/design-system/tokens.md` | Visual design reference |
| `/docs/FIRST_PRINCIPLES.md` | Non-negotiable product beliefs |

---

*Last updated: January 25, 2026*
