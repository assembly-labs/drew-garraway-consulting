# BJJ Progress Tracker - Feature & UI Tracker

**Last Updated:** February 8, 2026
**Purpose:** Track design and development status of all features and UI components

---

## Status Legend

| Status | Meaning |
|--------|---------|
| ⬜ Not Started | Feature not yet designed or developed |
| 🟡 Designing | Currently in UX/design discussion phase |
| 🟠 Designed | Design complete, ready for development |
| 🔵 In Development | Currently being built |
| ✅ Complete | Designed and developed |
| 🔄 Needs Revision | Requires design or code updates |

---

## Phase 1: Core Practitioner Features

| # | Feature | Design | Dev | Priority | Notes |
|---|---------|--------|-----|----------|-------|
| 1.1 | **Dashboard** | ✅ | ✅ | Critical | Integrated in App.tsx with real data |
| 1.2 | **Journal Entry** | ⬜ | ⬜ | Critical | Quick entry (<60s) is key UX requirement |
| 1.3 | **Belt Progress** | ⬜ | ⬜ | Critical | IBJJF requirements checklist + coach feedback |
| 1.4 | **Technique Library** | ⬜ | ⬜ | High | Search, filter, proficiency tracking |
| 1.5 | **Profile** | ⬜ | ⬜ | High | Belt history, stats, settings |
| 1.6 | **Sparring Tracker** | ⬜ | ⬜ | High | Integrated into Journal Entry |
| 1.7 | **Goals Manager** | ⬜ | ⬜ | Medium | Short/long-term goal tracking |
| 1.8 | **Injury Tracker** | ⬜ | ⬜ | Medium | 91% injury rate - critical for retention |
| 1.9 | **Competition Tracker** | ⬜ | ⬜ | Low | Optional but accelerates progress |

---

## Phase 2: Coach Features

| # | Feature | Design | Dev | Priority | Notes |
|---|---------|--------|-----|----------|-------|
| 2.1 | **Student Roster** | ⬜ | ⬜ | High | List with progress indicators |
| 2.2 | **Student Detail** | ⬜ | ⬜ | High | Individual progress, feedback history |
| 2.3 | **Feedback Entry** | ⬜ | ⬜ | High | Text/voice with technique tagging |
| 2.4 | **Promotion Pipeline** | ⬜ | ⬜ | Medium | Students approaching requirements |

---

## Phase 3: Gym Owner Features

| # | Feature | Design | Dev | Priority | Notes |
|---|---------|--------|-----|----------|-------|
| 3.1 | **Gym Dashboard** | ⬜ | ⬜ | Medium | Retention, attendance, promotions |
| 3.2 | **Roster Management** | ⬜ | ⬜ | Medium | All members, belt distribution |
| 3.3 | **Coach Management** | ⬜ | ⬜ | Low | Assign coaches to students |

---

## Phase 4: Supporting Features

| # | Feature | Design | Dev | Priority | Notes |
|---|---------|--------|-----|----------|-------|
| 4.1 | **Onboarding Flow** | 🟠 | ⬜ | Critical | 4-screen flow approved 2026-02-08, ready for dev |
| 4.2 | **Settings** | ⬜ | ⬜ | Medium | Privacy, notifications, subscription |
| 4.3 | **Legal/Payment** | ⬜ | ⬜ | Medium | ToS, subscription management |
| 4.4 | **Notifications** | ⬜ | ⬜ | Low | Reminders, coach feedback alerts |

---

## UI Components

| # | Component | Design | Dev | Used In |
|---|-----------|--------|-----|---------|
| C.1 | **Header** | ✅ | ✅ | All screens |
| C.2 | **TabBar** | ✅ | ✅ | Navigation |
| C.3 | **BeltBadge** | ✅ | ✅ | Dashboard, Profile, Roster |
| C.4 | **StatCard** | ✅ | ✅ | Dashboard, Profile |
| C.5 | **TrainingBadge** | ✅ | ✅ | Journal, Dashboard |
| C.6 | **ProgressRing** | ✅ | ✅ | Dashboard, Belt Progress |
| C.7 | **Card** | ✅ | ✅ | Base container (CSS) |
| C.8 | **Button** | ✅ | ✅ | All screens (CSS) |
| C.9 | **Form Elements** | ✅ | ✅ | Journal Entry, Settings (CSS) |
| C.10 | **TechniqueCard** | ⬜ | ⬜ | Technique Library |
| C.11 | **SessionCard** | ⬜ | ⬜ | Journal list view |
| C.12 | **RequirementItem** | ⬜ | ⬜ | Belt Progress |
| C.13 | **SparringRoundCard** | ⬜ | ⬜ | Journal Entry |
| C.14 | **GoalCard** | ⬜ | ⬜ | Dashboard, Goals |
| C.15 | **FeedbackCard** | ⬜ | ⬜ | Belt Progress, Profile |
| C.16 | **Modal** | ⬜ | ⬜ | Confirmations, Quick Add |
| C.17 | **Toast/Alert** | ⬜ | ⬜ | Save confirmations |
| C.18 | **EmptyState** | ⬜ | ⬜ | No data scenarios |
| C.19 | **LoadingState** | ⬜ | ⬜ | Async operations |
| C.20 | **SearchInput** | ⬜ | ⬜ | Technique Library |

---

## Entry Flows (Critical UX)

| # | Flow | Design | Dev | Target Time | Notes |
|---|------|--------|-----|-------------|-------|
| E.1 | **Quick Log** | ⬜ | ⬜ | 30 seconds | Date, type, duration, energy |
| E.2 | **Standard Session** | ⬜ | ⬜ | 60 seconds | + techniques, sparring summary |
| E.3 | **Detailed Session** | ⬜ | ⬜ | 3-5 minutes | + notes, specific rounds, reflections |
| E.4 | **Technique Drill Log** | ⬜ | ⬜ | 15 seconds | Quick rep count for technique |
| E.5 | **Sparring Round Log** | ⬜ | ⬜ | 20 seconds | Partner, outcome, context |

---

## Data Visualizations

| # | Visualization | Design | Dev | Used In |
|---|---------------|--------|-----|---------|
| V.1 | **Belt Progress Ring** | ✅ | ✅ | Dashboard |
| V.2 | **Category Progress Bars** | ✅ | ✅ | Dashboard, Belt Progress |
| V.3 | **Training Calendar** | ⬜ | ⬜ | Dashboard, Profile |
| V.4 | **Position Heat Map** | ⬜ | ⬜ | Belt Progress |
| V.5 | **Sparring Win/Loss Chart** | ⬜ | ⬜ | Profile |
| V.6 | **Submission Breakdown** | ⬜ | ⬜ | Profile |
| V.7 | **Training Streak Display** | ✅ | ✅ | Dashboard |
| V.8 | **Goal Progress Tracker** | ⬜ | ⬜ | Dashboard, Goals |

---

## Progress Summary

| Category | Total | Complete | In Progress | Not Started |
|----------|-------|----------|-------------|-------------|
| Phase 1 Features | 9 | 1 | 0 | 8 |
| Phase 2 Features | 4 | 0 | 0 | 4 |
| Phase 3 Features | 3 | 0 | 0 | 3 |
| Phase 4 Features | 4 | 0 | 0 | 4 |
| UI Components | 20 | 9 | 0 | 11 |
| Entry Flows | 5 | 0 | 0 | 5 |
| Visualizations | 8 | 3 | 0 | 5 |
| Design System | 1 | 1 | 0 | 0 |

**Overall: 54 items | 14 complete (26%) | 0 in progress | 40 not started**

---

## Design System Page

**Location:** `internal-docs/design-system/index.html`
**Access:** Open `index.html` directly in browser (no dev server needed)

**Files:**
- `index.html` - Main design system showcase
- `styles.css` - All design tokens and component styles
- `script.js` - Tab switching and interactivity

| Section | Status | Contents |
|---------|--------|----------|
| Foundations | ✅ | Colors, Typography, Spacing, Border Radius, Shadows |
| Components | ✅ | Buttons, Cards, Belt Badges, Training Badges, Stat Cards, Progress Ring, Progress Bars, Status Badges, Form Elements |
| Patterns | ✅ | Card Headers, List Items, Empty States, Alerts, Metric Displays, Action Footers, Selection Pills |

---

## Design Decisions Log

Record key UX decisions as we make them:

| Date | Feature | Decision | Rationale |
|------|---------|----------|-----------|
| Dec 21, 2025 | Design System | 3-tab organization (Foundations, Components, Patterns) | Clear hierarchy, easy navigation |
| Dec 21, 2025 | Design System | Accessible via header "DS" button | Quick access during development |
| Dec 21, 2025 | Dashboard | Hero card with streak counter | Immediate motivation visible |
| Dec 21, 2025 | Dashboard | 4-pillar progress display | Aligns with research on promotion criteria |
| Dec 21, 2025 | Navigation | 5-tab bottom bar | Mobile-first, thumb-friendly |
| Dec 21, 2025 | Responsive | Mobile-first CSS approach | Most users log sessions on phones after class |
| Dec 21, 2025 | Responsive | min-width breakpoints: 768px (tablet), 1024px (desktop) | Progressive enhancement from mobile base |
| Dec 21, 2025 | Touch | 44px minimum touch targets | Apple/Google accessibility guidelines |
| Dec 21, 2025 | Touch | Disable hover transform on touch devices | Prevents sticky hover states on mobile |
| Dec 21, 2025 | Entry Flows | "Fat-fingered & exhausted" user state | Users log sessions post-training with sweaty hands |
| Dec 21, 2025 | Entry Flows | 56-80px touch targets for entry flows | Standard 44px too small for exhausted users |
| Dec 21, 2025 | Entry Flows | 16px minimum gap between targets | Prevent mis-taps with sweaty/shaky fingers |
| Dec 21, 2025 | Entry Flows | Tap-first philosophy: reduce typing to near-zero | Presets over text input, taps over keyboards |
| Dec 21, 2025 | Entry Flows | 3-tap quick log: Type → Duration → Save | <10 second session logging for impatient users |
| Dec 21, 2025 | Entry Flows | Auto-save drafts, undo support | Error prevention for fatigued decision-making |
| Dec 21, 2025 | Brand Voice | "Purple belt training partner" archetype | Knowledgeable but humble, still learning |
| Dec 21, 2025 | Brand Voice | Specific over vague: "47 sessions" not "great progress" | Data-driven feedback builds trust |
| Dec 21, 2025 | Brand Voice | No gamification language (unlock, level up, achievement) | Respect belt promotion as earned, not unlocked |
| Dec 21, 2025 | Brand Voice | Never contradict user's coach | Amplify coaches, never replace them |
| Dec 21, 2025 | Brand Voice | Six instructor pedagogy influences documented | Systems, Fundamentals, High-Performance, Precision, Motivational, Adaptive |
| Dec 21, 2025 | Design System | Added "Voice & Copy" tab | Visual reference for copy guidelines during development |
| Feb 08, 2026 | Onboarding | Text step counter over dots | "1 of 3" is informative without feeling gamified |
| Feb 08, 2026 | Onboarding | Voice pre-selected with "Recommended" badge | Guide users toward optimal experience while allowing choice |
| Feb 08, 2026 | Onboarding | 4-screen consolidated flow | Fewer screens, more content per screen, <60s completion |
| | | | |

---

## Next Up for Design Discussion

1. **Journal Entry** - The core daily interaction
2. **Belt Progress** - IBJJF requirements visualization
3. **Technique Library** - Search and proficiency tracking
4. **Entry Flows** - Quick vs detailed logging UX
