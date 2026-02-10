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
| 1.2 | **Journal Entry** | ✅ | 🔵 | Critical | Voice logger enhanced Feb 2026: lesson topic, energy level, transcript display |
| 1.3 | **Belt Progress** | 🟡 | ⬜ | Critical | Design review created Feb 2026. IBJJF requirements checklist + coach feedback |
| 1.4 | **Technique Library** | 🟡 | ⬜ | High | Enhancement mockups created Feb 2026, existing prototype functional. Search, filter, proficiency tracking |
| 1.5 | **Profile** | 🔵 | 🔵 | High | Gender/birthDate captured at onboarding, belt history planned |
| 1.6 | **Sparring Tracker** | ⬜ | ⬜ | High | Integrated into Journal Entry (see 1.2) |
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
| 4.1 | **Onboarding Flow** | ✅ | ✅ | Critical | 4-screen flow with gender/birthday implemented 2026-02-08 |
| 4.2 | **Settings** | ✅ | ✅ | Medium | Notification toggles (UI only), logging preference, data export |
| 4.3 | **Legal/Payment** | 🟠 | 🟡 | Medium | Privacy Policy & ToS created. iOS payment via StoreKit/RevenueCat designed Feb 2026 |
| 4.4 | **Notifications** | ⬜ | ⬜ | Low | Reminders, coach feedback alerts |
| 4.5 | **Authentication** | 🟠 | ⬜ | High | Login/signup with Apple, Google, Email designed Feb 2026 |
| 4.6 | **Privacy Policy** | ✅ | ⬜ | Medium | Generic text created, needs legal review |
| 4.7 | **Terms of Service** | ✅ | ⬜ | Medium | Generic text created, needs legal review |

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
| C.10 | **TechniqueCard** | ✅ | ✅ | Implemented in TechniqueLibrary.tsx |
| C.11 | **SessionCard** | ✅ | ✅ | Implemented in SessionCard.tsx and JournalEntryCard.tsx |
| C.12 | **RequirementItem** | ⬜ | ⬜ | Belt Progress |
| C.13 | **SparringRoundCard** | ⬜ | ⬜ | Journal Entry |
| C.14 | **GoalCard** | ⬜ | ⬜ | Dashboard, Goals |
| C.15 | **FeedbackCard** | ⬜ | ⬜ | Belt Progress, Profile |
| C.16 | **Modal** | ✅ | ✅ | EditSheet.tsx bottom sheet modal |
| C.17 | **Toast/Alert** | ✅ | ✅ | Toast.tsx component |
| C.18 | **EmptyState** | ✅ | ✅ | EmptyState.tsx component |
| C.19 | **LoadingState** | ✅ | ✅ | Skeleton.tsx component (6 variants) |
| C.20 | **SearchInput** | ✅ | ✅ | In TechniqueLibrary.tsx |

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
| Phase 1 Features | 9 | 1 | 4 | 4 |
| Phase 2 Features | 4 | 0 | 0 | 4 |
| Phase 3 Features | 3 | 0 | 0 | 3 |
| Phase 4 Features | 7 | 2 | 4 | 1 |
| UI Components | 20 | 16 | 0 | 4 |
| Entry Flows | 5 | 0 | 0 | 5 |
| Visualizations | 8 | 3 | 0 | 5 |
| Design System | 1 | 1 | 0 | 0 |

**Overall: 57 items | 23 complete (40%) | 8 in progress | 26 not started**

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
| Feb 08, 2026 | Session Logger | Added lesson topic field | Enables insight correlation with coach curriculum |
| Feb 08, 2026 | Session Logger | Added energy level 1-5 picker | Enables fatigue pattern detection in insights |
| Feb 08, 2026 | Session Logger | Added collapsible transcript display | Users can verify AI extraction accuracy |
| Feb 08, 2026 | Session Logger | Fixed data alignment (techniques_drilled, worked_well, struggles) | Database fields now properly captured |
| Feb 08, 2026 | Onboarding | Gender and Birthday mandatory at onboarding | Ensures 100% data completeness for analytics |
| Feb 08, 2026 | Onboarding | Gender limited to Male/Female only | Simplified options per product decision |
| Feb 08, 2026 | Profile | Gender and birthDate now locked fields | Cannot be changed after onboarding |
| Feb 08, 2026 | Settings | Notification preferences persist | Saved via UserProfileContext (UI only - no actual notifications) |
| Feb 08, 2026 | Profile | Removed gender/birthDate from progressive profiling | Moved to onboarding for guaranteed capture |
| Feb 08, 2026 | Belt Progress | Module within Profile (not standalone page), event-sourced promotion history | Keeps profile as hub, avoids navigation sprawl |
| Feb 08, 2026 | Techniques | 8 enhancement mockups designed (content gating, difficulty filter, proficiency update, related techniques, instructor filter, bookmarks, enhanced search, watch tracking) | Comprehensive design review for technique library polish |
| Feb 08, 2026 | Legal | Privacy Policy and Terms of Service created | Generic text for App Store submission, needs legal review |
| Feb 08, 2026 | Auth | Login/signup designed with Apple Sign-In, Google, and email options | SSO-first approach for iOS, email as fallback |
| Feb 08, 2026 | Payment | iOS App Store via StoreKit + RevenueCat (no custom payment) | Apple-native payment reduces compliance burden |
| | | | |

---

## Next Up for Design Discussion

1. **Journal Entry** - The core daily interaction
2. **Belt Progress** - IBJJF requirements visualization
3. **Technique Library** - Search and proficiency tracking
4. **Entry Flows** - Quick vs detailed logging UX
