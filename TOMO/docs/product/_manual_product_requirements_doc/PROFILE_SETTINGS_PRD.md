# Profile & Settings - Product Requirements Document

**Last Updated:** March 30, 2026
**Status:** MVP Implementation In Progress
**Components:** `ProfileScreen.tsx`, `Settings.tsx`

---

## Table of Contents

1. [Overview](#overview)
2. [Navigation & Access](#navigation--access)
3. [Profile Page](#profile-page)
4. [Settings Page](#settings-page)
5. [Data Model](#data-model)
6. [Implementation Status](#implementation-status)
7. [Future Considerations](#future-considerations)

---

## Overview

### Purpose

The Profile and Settings pages serve complementary but distinct purposes:

- **Profile**: Identity center—who the user is in their BJJ journey, their training history, and progress visualization
- **Settings**: Control center—how the app behaves, preferences, account management

### User Context

Both pages are accessed in the **relaxed browsing state** (not post-training). Users have unlimited time, can handle complexity, and expect standard UX patterns. This is NOT the exhausted user state.

### Design Philosophy

Per First Principles:
- **Specificity over encouragement**: Show concrete data, not vague positivity
- **Belt psychology shapes everything**: Adapt display based on belt level
- **The flashlight, not the path**: Illuminate progress without prescribing timelines
- **No gamification**: Track progress without trivializing it

---

## Navigation & Access

### Profile Access (Header Avatar)

**Location:** Top-right corner of the main header

**Visual Specification:**
- Size: 44×44px circular button
- Background: `--color-gray-800`
- Border: 3px solid, color matches user's belt level
- Content: User's first initial (uppercase) OR avatar image if set
- Touch target: 44px minimum (meets accessibility requirements)

**Belt Border Colors:**
| Belt | Border Color |
|------|-------------|
| White | `var(--color-belt-white)` / `#FFFFFF` |
| Blue | `var(--color-belt-blue)` / `#0033A0` |
| Purple | `var(--color-belt-purple)` / `#4B0082` |
| Brown | `var(--color-belt-brown)` / `#8B4513` |
| Black | `var(--color-negative)` / Red (stands out on dark UI) |

**Behavior:**
- Tap → Navigate to Profile page
- Long-press → (Future) Quick actions menu

### Settings Access

**Location:** Bottom of Profile page as a prominent button/card

**Visual Specification:**
- Full-width card with settings icon
- "Settings" title with "Preferences, account, and more" subtitle
- Chevron indicator for navigation
- Touch target: 56px+ height

---

## Profile Page

### Page Structure

```
┌─────────────────────────────────────┐
│         PROFILE HEADER              │
│  [Avatar with belt border]          │
│  NAME (uppercase, Unbounded)        │
│  "Training for X years, X months"   │
│  [Belt Badge: Color + Stripes]      │
│  "Stage Name" (from personalization)│
│  "Mindset quote" (italic)           │
├─────────────────────────────────────┤
│    PROFILE COMPLETION (if < 100%)   │
│  [Progress bar] XX%                 │
│  "X items remaining"                │
│  [Complete Profile] button          │
├─────────────────────────────────────┤
│         TRAINING STATS              │
│  Sessions Logged | Weekly Target    │
│  (2-column grid)                    │
├─────────────────────────────────────┤
│        PROFILE DETAILS              │
│  Name                    [Value]    │
│  Belt & Stripes      [Blue 2-str]   │  ← Progression Event
│  Training Since         [+ Add]     │
│  Gym                    [Value]     │
│  Training Goals         [+ Add]     │
│  Target Frequency       [Value]     │
│  Experience Level       [+ Add]     │
│  ─────────────────────────────────  │
│  Birthday              [+ Add] 🔒   │  ← LOCKED after set
│  Gender                [+ Add] 🔒   │  ← LOCKED after set
├─────────────────────────────────────┤
│        [SETTINGS BUTTON]            │
├─────────────────────────────────────┤
│      DEVELOPER TOOLS (dev only)     │
│  [Reset Profile] button             │
└─────────────────────────────────────┘
```

**Legend:**
- `[+ Add]` = Progressive profiling field, not yet captured
- `🔒` = Field becomes LOCKED after initial set (user is warned before entering)

### Profile Fields

#### Field Categories

| Category | Behavior | User Expectation |
|----------|----------|------------------|
| **Freely Editable** | Tap to edit anytime | User can change at will |
| **Progression Event** | Editable, but each change is recorded | Creates historical record for progress tracking |
| **Locked** | No edit option shown | Data integrity - cannot be changed after initial set |
| **Progressive** | Shows "+ Add" until answered | Collected over time via nudges |

#### Complete Field Specification

| Field | Category | Edit UI | Why | Current Status |
|-------|----------|---------|-----|----------------|
| **Name** | Freely Editable | Inline text input | Users change display name | Done |
| **Avatar** | Freely Editable | Image picker / initials | Personalization | Partial (initials only) |
| **Belt** | Progression Event | Selection + date picker | Creates progression record | Planned |
| **Stripes** | Progression Event | Number selector (0-4) + date | Creates progression record | Planned |
| **Gym** | Freely Editable | Gym picker (same as onboarding) | People change gyms | Done |
| **Target Frequency** | Freely Editable | Chip selector (2/4/5) | Goals change | Partial |
| **Logging Preference** | Freely Editable | Toggle (Voice/Text) | Preference changes | Done |
| **Training Goals** | Freely Editable | Multi-select chips (6 options + Other) | Goals evolve | Progressive |
| **Experience Level** | Freely Editable | Chip selector | One-time question | Progressive |
| **Training Start Date** | Freely Editable | Date picker | May remember later | Progressive |
| **Body Weight** | Freely Editable | Number input with lb/kg toggle | Weight changes over time | Optional at onboarding |
| **Birthdate** | **LOCKED** | View only (no edit) | Impacts age-based insights, projections, birthday celebrations. Must be 18+. | **Onboarding (mandatory)** |
| **Gender** | **LOCKED** | View only after set (no edit) | Impacts competition categories + peer comparisons | **Optional at onboarding, progressive at Session 5** |

---

### Locked Fields

#### Birthdate (LOCKED - Captured at Onboarding)

**Format:** Full date (YYYY-MM-DD stored, displayed as "34 years old")

**Why we collect full birthdate:**
- Age-based peer comparisons ("How do I compare to practitioners my age?")
- Age-cohort analytics
- Age-adjusted insights ("For a 45-year-old, training 3x/week is excellent")
- **Birthday celebrations** - Special acknowledgment on user's birthday

**Why it's locked:**
Allowing changes would corrupt historical data integrity. Age impacts analytics, comparisons, and personalized insights throughout the app.

**Collection:** **Mandatory at onboarding** (About You screen). Users must provide birthday before completing onboarding. This ensures 100% data completeness for analytics.

**Display:** Shows age (e.g., "34 years old") in profile, but stores full date for birthday detection.

**Birthday Feature (Future):**
- On user's birthday, show celebration message in app
- Special insight: "Happy Birthday! You've trained X sessions in your [age-1] year of life"
- Optional: birthday badge visible for 24 hours

#### Gender (LOCKED after set - Optional at Onboarding)

**Options:**
- Male
- Female
- (Skip / not provided)

**Why we collect gender:**
- Weight class context (competition users): IBJJF weight classes differ by sex
- Competition category tracking: men's vs women's divisions
- Peer comparisons ("How do I compare to other women at my belt?")
- Gender-specific insights (injury patterns, training frequency norms, recovery context)
- Tone calibration for AI responses

**Why it's optional:**
Not everyone is comfortable sharing gender, and the app works well without it. Making it optional respects user choice. We explain the value clearly: "Helps personalize competition class and training insights."

**Why it's locked after set:**
Gender impacts analytics and peer comparisons across the user's history. Changing it would corrupt comparative data. Users are warned before committing: "Note: this can't be changed later."

**Collection flow:**
1. **Onboarding (About You screen):** Optional. Two chips (Male / Female), neither pre-selected. User can proceed without selecting.
2. **Progressive profiling (Session 5):** If not set at onboarding, we ask: "One quick question: this helps us personalize your training insights. Male or Female?" with a Skip option.
3. **Profile screen:** If still not set, shows "+ Add" with lock icon and note that it locks after set.
4. **After 3 skips:** Stop asking.

**Display:** Only shown on Profile page, never exposed publicly. Shows value with lock icon after set, or "+ Add" if not set.

#### Body Weight (Freely Editable - Optional)

**Storage:** `body_weight_kg` (always in kg internally), `weight_unit_preference` ('lb' or 'kg')

**Why we collect weight:**
- IBJJF competition weight class mapping (immediate value when entered)
- Rolling context: size dynamics affect technique recommendations
- Weight tracking over time for competition prep users
- Future: weight cut tracking for tournament preparation

**Display on Profile:**
```
Body Weight              165 lb (Feather)
```
Shows weight in user's preferred unit with IBJJF class name. If gender is set, shows the correct gendered weight class. If gender is not set, shows both: "Feather (men) / Light (women)".

**Edit:** Tap to edit via inline number input + unit toggle. Changes save immediately. Not locked (weight changes are expected and tracked over time).

**Privacy:** "Only visible to you" note shown during collection and on profile.

#### Injuries / Physical Limitations (Future - FEAT-006)

Not collected at onboarding or via progressive profiling in MVP 1.0. Instead, injuries are tracked per-session during session logging (the `injuries` field on sessions). A persistent injury tracker that aggregates across sessions is planned as FEAT-006 in the features backlog. This will become important for:
- Technique safety recommendations ("avoid neck cranks with your cervical issue")
- Recovery-aware insights ("you've mentioned shoulder pain in 4 of your last 10 sessions")
- Age-adjusted injury context (older practitioners have different recovery profiles)

---

### Belt & Stripe Progression History

> **This is a Profile module, not a standalone page.** Belt progression renders as a simple timeline card within the Profile page. The existing `BeltProgress.tsx` page component should be deprecated in favor of this module.

#### Overview

Belt and stripe changes are **progression events**, not simple edits. When a user updates their belt or stripes in the app, the system creates a timestamped record. These records power:
- Profile page belt progress display (current belt + event history)
- "Time at belt" calculations
- Stats page context (time-at-belt metric in hero area)
- Milestone insights ("1 year at blue belt")

#### Full IBJJF Belt Path

The system tracks the complete IBJJF progression, not just the common 5 belts:

```
White (4 stripes) -> Blue (4 stripes) -> Purple (4 stripes) -> Brown (4 stripes)
-> Black (6 degrees) -> Red/Black coral (7th degree) -> Red/White coral (8th degree)
-> Red (9th-10th degree)
```

**`BeltLevel` type must be extended:**
```typescript
type BeltLevel =
  | 'white' | 'blue' | 'purple' | 'brown'   // Color belts (0-4 stripes each)
  | 'black'                                    // Black belt (0-6 degrees)
  | 'red_black'                                // Coral belt (7th degree)
  | 'red_white'                                // Coral belt (8th degree)
  | 'red';                                     // Red belt (9th-10th degree)
```

**Stripe/degree rules by belt:**

| Belt | Stripe/Degree Range | Term |
|------|---------------------|------|
| White through Brown | 0-4 | "stripes" |
| Black | 0-6 | "degrees" |
| Red/Black | 7 | "7th degree" (single value) |
| Red/White | 8 | "8th degree" (single value) |
| Red | 9-10 | "9th/10th degree" |

> **Practical note:** 99%+ of users will be White through Black. The coral and red belts exist for completeness — they are valid values in the belt selector. No future or aspirational belts are displayed. The module only shows events the user has recorded.

#### How It Works

When a user changes their belt or stripes:
1. User taps the Belt or Stripes field in Profile
2. Bottom sheet opens with current value pre-selected
3. User selects new belt/stripe count
4. **Date picker appears**: "When did you receive this?" (defaults to today)
5. User confirms
6. System creates a `BeltProgressionEvent` record
7. Current profile belt/stripes updated
8. Success confirmation shown

#### Progression Event Data

```typescript
interface BeltProgressionEvent {
  id: string;                    // Unique event ID
  date: string;                  // ISO date when change occurred
  type: 'belt_promotion' | 'stripe_promotion' | 'belt_correction' | 'stripe_correction';

  // Before state
  fromBelt: BeltLevel;
  fromStripes: number;

  // After state
  toBelt: BeltLevel;
  toStripes: number;

  // Metadata
  createdAt: string;             // When record was created
  source: 'user_edit' | 'onboarding' | 'import';
  notes?: string;                // Optional: "Promoted by Professor Garcia"
}
```

#### Event Types

| Type | Trigger | Example |
|------|---------|---------|
| `belt_promotion` | Belt level increased | White → Blue |
| `stripe_promotion` | Stripe count increased (same belt) | Blue 2-stripe → Blue 3-stripe |
| `belt_correction` | Belt level changed (not typical promotion) | Purple → Blue (rare: user error fix) |
| `stripe_correction` | Stripe count changed to fix error | 3 stripes → 2 stripes |

**Note:** Corrections are rare but necessary for data accuracy. The system tracks them differently for analytics (corrections don't count as "promotions" in milestone tracking).

#### Progression Edit Flow (UI)

```
┌─────────────────────────────────────┐
│          Update Your Belt           │
│                                     │
│  Current: [Blue Belt, 2 stripes]    │
│                                     │
│  ─────────────────────────────────  │
│  Select your new belt:              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │White│ │Blue │ │Purp │ │Brown│   │
│  │  ○  │ │  ●  │ │  ○  │ │  ○  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  Stripes: [0] [1] [2] [●3] [4]     │
│                                     │
│  ─────────────────────────────────  │
│  When did you receive this?         │
│  [📅 January 25, 2026        ▼]    │
│                                     │
│  Add a note (optional):             │
│  [Promoted by Professor X    ]      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [Cancel]        [Save Progression] │
└─────────────────────────────────────┘
```

#### Stripe-Only Changes

When only stripes change (common):
1. User taps Stripes field
2. Quick stripe selector appears (0-4)
3. User selects new count
4. If increasing: "When did you get this stripe?" (date picker, defaults to today)
5. If decreasing: System automatically marks as `stripe_correction` (no confirmation needed)
6. Save creates progression event

**Simplicity note:** Corrections don't require explanations or notes. The system simply records the change with the appropriate type for analytics.

#### Initial State (Onboarding) - MANDATORY

**The current belt date is captured during onboarding**, not via progressive profiling. This is mandatory because:
- We need a baseline for all belt progress calculations
- "Time at belt" is a core metric from day one
- Users know when they got their current belt

**Onboarding Screen 2 ("About You") now includes:**
1. Name (text input)
2. Belt (5-button selector)
3. Stripes (0-4 selector)
4. **When did you get this belt?** (date picker, defaults to "I don't remember" option)

If user selects "I don't remember", we use their onboarding date as a proxy (with a flag `dateEstimated: true`).

```typescript
const initialEvent: BeltProgressionEvent = {
  id: generateId(),
  date: onboardingData.currentBeltDate,           // REQUIRED at onboarding
  type: 'belt_promotion',
  fromBelt: 'none',                               // Special value for first entry
  fromStripes: 0,
  toBelt: onboardingData.belt,
  toStripes: onboardingData.stripes,
  createdAt: now,
  source: 'onboarding',
  dateEstimated: !onboardingData.knowsBeltDate,   // Track if date was estimated
};
```

#### Profile Module: Belt Progress

A simple, compact card in the Profile page. Not a standalone page. Not a prefilled timeline.

**How it works:** The module only displays events the user has manually recorded. When the user gets promoted or earns a stripe, they open the app and update their belt/stripes. That action creates a dated `BeltProgressionEvent`. The module is a log of those events — nothing more.

**What it shows:**
- Current belt and stripes
- Time at current belt (calculated from most recent event date)
- List of recorded progression events (date + change + optional note), most recent first
- Empty state if only one event exists (onboarding): just shows current belt and time-at-belt

**What it does NOT show:**
- No future belts, aspirational nodes, or "next belt" projections
- No IBJJF minimum time requirements or "on track" comparisons
- No sparring stats, training volume, or patterns (those belong in Stats)
- No coaching psychology or plateau warnings (those belong in Insights)

**UI behavior:**
- Shows current belt + time-at-belt inline in the Profile
- If the user has 2+ progression events, shows a "View history" link that expands to the full event list

#### Powered Features

The progression event log enables:

| Feature | Location | How It Uses History |
|---------|----------|---------------------|
| **Belt Progress** | Profile page module | Shows recorded progression events and time at current belt |
| **Time at Belt** | Stats hero area | Duration between most recent event date and today |
| **Milestone Insights** | Insights page | "1 year since you got your blue belt!" |

#### Data Integrity Rules

1. **Events are immutable**: Once created, progression events cannot be deleted or modified
2. **Corrections create new events**: If user made an error, a correction event is created, preserving history
3. **Dates can be backdated**: User can enter past dates for promotions they forgot to log
4. **Future dates rejected**: Cannot log a promotion for a future date
5. **Logical validation**: System warns (but allows) unusual progressions (e.g., skipping belts)

### Profile Completion Tracker

**Purpose:** Encourage profile completion through progressive profiling without nagging.

**Calculation Formula:**
```typescript
const fields = [
  // Mandatory at onboarding (6 fields)
  profile.name,
  profile.belt,
  profile.stripes !== null,
  profile.birthDate,                         // LOCKED after onboarding, mandatory, 18+
  profile.gym !== null,
  profile.targetFrequency !== null,
  profile.loggingPreference !== 'undecided',

  // Optional at onboarding / Progressive profiling (6 fields)
  profile.gender,                            // Optional at onboarding, LOCKED after first set
  profile.trainingGoals.length > 0,
  profile.experienceLevel !== null,
  profile.trainingStartDate,
  profile.bodyWeightKg !== null,             // Freely editable
  profile.beltHistory.length > 0,            // Initial belt date
];
const completion = Math.round((completed / fields.length) * 100);
```

**Note:** 13 total fields. 7 captured mandatory at onboarding (~54% complete on day 1), 6 optional/progressive.

**Visual Treatment:**
- Shows when `completion < 100%`
- Gold-tinted card with progress bar
- "X items remaining" subtitle
- "Complete Profile" CTA triggers next nudge question

### Progressive Profiling Schedule

Questions are triggered at session milestones (accelerated schedule):

| Session | Question | Data Captured | Why at this point |
|---------|----------|---------------|-------------------|
| 2 | "How long have you been training?" | `experienceLevel` | Quick context question |
| 3 | "When did you start training?" | `trainingStartDate` | Context for progress |
| 5 | Gender (if not set) + "Why do you train?" | `gender`, `trainingGoals` | Gender personalizes competition/peer context; goals personalize content |
| 5 | "What's your current weight?" (if not set) | `bodyWeightKg` | Competition class + rolling context |

**Note:** Belt date is now captured at onboarding (mandatory), not via progressive profiling.

**Mar 2026 Update:** Birthday is mandatory at onboarding (must be 18+). Gender is optional at onboarding but asked at Session 5 via progressive profiling if skipped. Body weight is optional at onboarding and asked at Session 5 if not entered. Training goals expanded to include Self-Defense and Community.

**Skip Tolerance:** Users can skip each question up to 3 times. After 3 skips, we stop asking that question.

**LOCKED field handling:** For birthdate (set at onboarding) and gender (when first set), users are informed these cannot be changed later:
> "This helps us adjust your insights and projections. Note: this can't be changed later."

**Belt Timing Adjustments:**
| Belt | Adjustment | Rationale |
|------|------------|-----------|
| White | +1 session delay | Slightly more time to build habit |
| Blue | Standard timing | Normal schedule |
| Purple+ | -1 session earlier | Committed practitioners, can ask sooner |

### Belt Personalization (Profile Display)

**Hook:** `useBeltPersonalization()` → `{ profile: beltProfile }`

| Display Element | Source |
|-----------------|--------|
| Stage Name | `beltProfile.stageName` (e.g., "The Survivor", "The Explorer") |
| Journey Quote | `beltProfile.mindsetShift` (e.g., "From survival to exploration") |

### Training Stats Section

**Grid Layout:** 2 columns

| Stat | Data Source | Notes |
|------|-------------|-------|
| Sessions Logged | `profile.sessionCount` | Large number display |
| Weekly Target | `profile.targetFrequency` + "x" | Shows "3x" format |

**Future additions (when available):**
- Total Hours
- Current Streak
- Time at Belt

### Edit Interactions

#### Inline Editing (Simple Fields)
For text fields like Name:
1. Tap field row
2. Field becomes editable input
3. Auto-save on blur or explicit save

#### Sheet Editing (Complex Fields)
For multi-step fields (Gym, Goals):
1. Tap field row
2. Bottom sheet opens with full picker UI
3. Confirm selection to save

#### Progression Editing (Belt & Stripes)
See [Belt & Stripe Progression History](#belt--stripe-progression-history) above.

Belt and stripe edits are special:
1. Tap Belt or Stripes field
2. Bottom sheet opens with selector + date picker
3. User selects new value and when it happened
4. System creates `BeltProgressionEvent` record
5. Updates current profile values
6. Shows success with "Progression saved!"

#### Locked Field Display
For birthdate and gender (after set):
- Show value with lock icon
- No tap/edit interaction
- Tooltip on tap: "This field cannot be changed"

---

## Settings Page

### Page Structure

```
┌─────────────────────────────────────┐
│  ← SETTINGS (header with back)      │
├─────────────────────────────────────┤
│  PREFERENCES                        │
│  ─────────────────────────────────  │
│  Default Logging Method   [V] [T]   │
│  Training Reminders         [====]  │
│  Progress Updates           [====]  │
│  Coach Feedback             [====]  │
├─────────────────────────────────────┤
│  ACCOUNT                            │
│  ─────────────────────────────────  │
│  Export Your Data              →    │
│  Delete Account                →    │
├─────────────────────────────────────┤
│  APP INFO                           │
│  ─────────────────────────────────  │
│  Privacy Policy                →    │
│  Terms of Service              →    │
│  Contact Support               →    │
│  Version                  1.0.0     │
├─────────────────────────────────────┤
│  DEMO MODE (prototype only)         │
│  [Persona switcher grid]            │
├─────────────────────────────────────┤
│  DEVELOPER TOOLS (prototype only)   │
│  [Restart Onboarding]               │
└─────────────────────────────────────┘
```

### Settings Categories

#### Priority Levels

| Priority | Definition | MVP Status |
|----------|------------|------------|
| **Must Have** | Essential for core app functionality | Required |
| **Should Have** | Important but not blocking launch | Phase 2 |
| **Nice to Have** | Polish and enhancement | Future |
| **Dev Only** | Testing/prototype tools | Hide in production |

### MUST HAVE Settings (MVP)

#### 1. Preferences Section

| Setting | Type | Default | Description | Status |
|---------|------|---------|-------------|--------|
| **Default Logging Method** | Toggle chips | `voice` | Voice or Text preference | Done |
| **Training Reminders** | Toggle | `true` | Notifications to log sessions | Done (UI) |
| **Progress Updates** | Toggle | `true` | Weekly summaries, milestones | Done (UI) |
| **Coach Feedback** | Toggle | `true` | When coach leaves feedback | Done (UI) |

> **IMPORTANT: Notification Settings are UI Placeholders Only**
>
> The notification toggle UI is complete and preferences persist via UserProfileContext. However, these toggles do NOT trigger actual notifications. They capture user preferences for future implementation.
>
> **What works:**
> - Toggle UI renders correctly
> - Preference values persist across sessions (saved to localStorage via profile context)
> - Settings survive app refresh
>
> **What does NOT work (requires future implementation):**
> - No push notifications are sent (requires APNs for iOS)
> - No email notifications (requires backend email service)
> - No reminder scheduling (requires backend cron jobs)
>
> **Future Requirements:**
> - iOS: APNs integration via Expo Notifications
> - Backend: Notification scheduling service
> - Email: Transactional email provider (SendGrid, Postmark, etc.)
>
> For MVP, these toggles exist to capture user intent and demonstrate the settings UI pattern.

#### 2. Account Section

| Setting | Type | Action | Status |
|---------|------|--------|--------|
| **Export Your Data** | Button → action | Downloads JSON file with all user data | Done |
| **Delete Account** | Button → confirmation | Permanently removes all data | Done (UI) |

**Export Data Specification:**
```typescript
const exportData = {
  profile: UserProfile,
  sessions: Session[],
  exportedAt: ISO8601 timestamp,
  version: "1.0"
};
// Downloads as "tomo-export.json"
```

**Delete Account Flow:**
1. Tap "Delete Account"
2. Confirmation dialog: "Are you sure you want to delete your account? This cannot be undone."
3. On confirm → Clear all localStorage, redirect to onboarding
4. (Production) → Server-side deletion, Apple account unlinking

#### 3. App Info Section

| Setting | Type | Destination | Status |
|---------|------|-------------|--------|
| **Privacy Policy** | Link | Opens policy document | Done (placeholder) |
| **Terms of Service** | Link | Opens terms document | Done (placeholder) |
| **Contact Support** | Link | Opens email/support form | Done (placeholder) |
| **Version** | Display | Shows "1.0.0 (Prototype)" | Done |

### SHOULD HAVE Settings (Phase 2)

#### 1. Training Defaults

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Default Session Duration** | Chips | `90` | Pre-fill 60/90/120 min |
| **Default Training Type** | Chips | `gi` | Pre-fill Gi/No-Gi/Both |
| **Default Sparring Toggle** | Toggle | `true` | Pre-fill "Did you spar?" |

**Rationale:** Reduces friction in session logging by pre-filling common values.

#### 2. Insights & AI

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Daily Insight Notifications** | Toggle | `true` | Notify when new insight ready |
| **Insight Tone** | Chips | `balanced` | Warm / Balanced / Direct |

**Tone Options:**
- **Warm**: More encouraging, celebration-focused (white belt default)
- **Balanced**: Mix of encouragement and analysis (blue belt default)
- **Direct**: Analytical, data-focused (purple+ default)

#### 3. Units & Locale

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Date Format** | Chips | `system` | System / US / International |
| **Time Format** | Chips | `system` | 12-hour / 24-hour / System |

### NICE TO HAVE Settings (Future)

#### 1. Integrations

| Setting | Description | Dependency |
|---------|-------------|------------|
| **Apple Health Sync** | Sync workouts to Health app | iOS + HealthKit |
| **Calendar Integration** | Add training to calendar | iOS + EventKit |
| **Apple Watch** | Watch app settings | watchOS app |

#### 2. Coach Share (When Feature Ships)

| Setting | Type | Description |
|---------|------|-------------|
| **Enable Coach Share** | Toggle | Allow generating coach summaries |
| **Coach Name** | Text | Display name for coach |
| **Coach Email** | Text | Optional: for sharing |

#### 3. Accessibility

| Setting | Type | Description |
|---------|------|-------------|
| **Text Size** | Slider | Adjust app text size |
| **Reduce Motion** | Toggle | Minimize animations |
| **High Contrast** | Toggle | Increase contrast ratios |

#### 4. Advanced

| Setting | Type | Description |
|---------|------|-------------|
| **Beta Features** | Toggle | Opt-in to experimental features |
| **Analytics Opt-Out** | Toggle | Disable anonymous analytics |
| **Clear Cache** | Button | Clear local cache data |

### DEV ONLY Settings (Hide in Production)

These settings exist for prototype testing and should be hidden or removed in production builds.

#### 1. Demo Mode Section

**Purpose:** Switch between 6 test personas to preview personalization.

**Personas Available:**
| Key | Belt | Name | Risk Level |
|-----|------|------|------------|
| `white-excelling` | White (3 str) | Jake Thompson | Low |
| `white-at-risk` | White (2 str) | David Morrison | High |
| `blue-excelling` | Blue (2 str) | Marcus Chen | Moderate |
| `blue-at-risk` | Blue (1 str) | Ryan Torres | Critical |
| `purple-average` | Purple (1 str) | Sofia Rodriguez | Low |
| `brown-average` | Brown (2 str) | Elena Kim | Low |

**Visual:** 2×3 grid of persona buttons with belt color indicators and risk level badges.

#### 2. Developer Tools Section

| Tool | Action |
|------|--------|
| **Restart Onboarding** | Clears profile, returns to onboarding flow |

**Warning:** "This action cannot be undone" displayed below button.

---

## Data Model

### UserProfile Interface

```typescript
interface UserProfile {
  // ─────────────────────────────────────────────────────────────
  // USER IDENTIFICATION
  // ─────────────────────────────────────────────────────────────
  userId: string;

  // ─────────────────────────────────────────────────────────────
  // CAPTURED AT ONBOARDING - MANDATORY (7 fields)
  // ─────────────────────────────────────────────────────────────
  name: string;
  belt: BeltLevel;                                    // Current belt
  stripes: 0 | 1 | 2 | 3 | 4;                        // Current stripes
  beltHistory: BeltProgressionEvent[];                // Initial entry created at onboarding
  gym: GymSelection | null;
  targetFrequency: number;                            // 2, 4, or 5
  loggingPreference: 'voice' | 'text' | 'undecided';

  // ─────────────────────────────────────────────────────────────
  // CAPTURED AT ONBOARDING - OPTIONAL (progressive if skipped)
  // ─────────────────────────────────────────────────────────────
  trainingGoals: TrainingGoal[];
  experienceLevel: ExperienceLevel | null;

  // ─────────────────────────────────────────────────────────────
  // CAPTURED VIA PROGRESSIVE PROFILING (5 fields)
  // ─────────────────────────────────────────────────────────────
  trainingStartDate: string | null;                   // ISO date (YYYY-MM-DD)

  // LOCKED fields - cannot be changed after first set
  birthDate: string;                                  // ISO date (YYYY-MM-DD) - mandatory at onboarding, must be 18+
  gender: Gender | null;                              // 'male' | 'female' | null - optional at onboarding, LOCKED after first set

  // ─────────────────────────────────────────────────────────────
  // FREELY EDITABLE FIELDS
  // ─────────────────────────────────────────────────────────────
  bodyWeightKg: number | null;                        // Always stored in kg (converted from lb if needed)
  weightUnitPreference: 'lb' | 'kg';                  // User's preferred display unit

  // ─────────────────────────────────────────────────────────────
  // METADATA
  // ─────────────────────────────────────────────────────────────
  onboardingComplete: boolean;
  sessionCount: number;
  createdAt: string;
  lastSessionAt: string | null;

  // ─────────────────────────────────────────────────────────────
  // PROGRESSIVE PROFILING TRACKING
  // Note: birthDate captured mandatory at onboarding
  // Note: gender asked at onboarding (optional), progressive at Session 5 if skipped
  // ─────────────────────────────────────────────────────────────
  skipCounts: {
    trainingStartDate: number;
    currentBeltDate: number;
    trainingGoals: number;
    experienceLevel: number;
    gender: number;                                   // Tracks skips for gender progressive profiling
  };
  lastAskedSession: { [key: string]: number };
}
```

### Belt Progression Types

```typescript
type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

interface BeltProgressionEvent {
  id: string;                                         // Unique event ID
  date: string;                                       // ISO date when change occurred

  // Event classification
  type: 'belt_promotion' | 'stripe_promotion' | 'belt_correction' | 'stripe_correction';

  // Before state
  fromBelt: BeltLevel | 'none';                       // 'none' for first entry
  fromStripes: number;

  // After state
  toBelt: BeltLevel;
  toStripes: number;

  // Metadata
  createdAt: string;                                  // When record was created
  source: 'user_edit' | 'onboarding' | 'import';
  dateEstimated?: boolean;                            // True if user selected "I don't remember" at onboarding
  notes?: string;                                     // Optional: "Promoted by Professor Garcia"
}
```

### Supporting Types

```typescript
interface GymSelection {
  gymId: string;
  gymName: string;
  isCustom: boolean;
  city?: string;
  stateOrCountry?: string;
  affiliation?: string;
}

type TrainingGoal = 'competition' | 'fitness' | 'self_defense' | 'mental' | 'community' | 'hobby';
type ExperienceLevel = 'new' | 'beginner' | 'intermediate' | 'experienced';
type Gender = 'male' | 'female';  // Two options - optional at onboarding, LOCKED after first set
```

### Helper Functions

```typescript
// Get current belt info from history
function getCurrentBelt(history: BeltProgressionEvent[]): { belt: BeltLevel; stripes: number } {
  const latest = history[history.length - 1];
  return { belt: latest.toBelt, stripes: latest.toStripes };
}

// Calculate time at current belt
function getTimeAtCurrentBelt(history: BeltProgressionEvent[]): number {
  const lastBeltChange = history
    .filter(e => e.type === 'belt_promotion')
    .pop();
  if (!lastBeltChange) return 0;
  return daysSince(lastBeltChange.date);
}

// Get user's age from birthdate
function getUserAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  return calculateAge(birthDate);
}

// Check if today is user's birthday
function isBirthday(birthDate: string | null): boolean {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getMonth() === birth.getMonth() &&
         today.getDate() === birth.getDate();
}
```

### Settings Preferences (Future)

```typescript
interface UserPreferences {
  // Logging defaults
  defaultDuration: 60 | 90 | 120;
  defaultTrainingType: 'gi' | 'nogi' | 'both';
  defaultSparring: boolean;

  // Notifications
  trainingReminders: boolean;
  progressUpdates: boolean;
  coachFeedback: boolean;
  insightNotifications: boolean;

  // Display
  insightTone: 'warm' | 'balanced' | 'direct';
  dateFormat: 'system' | 'us' | 'international';
  timeFormat: 'system' | '12h' | '24h';

  // Privacy
  analyticsEnabled: boolean;
}
```

---

## Implementation Status

### Profile Page

| Feature | Status | Notes |
|---------|--------|-------|
| Avatar with belt border | Done | Shows initial or persona image |
| Name display | Done | Uppercase, Unbounded font |
| Belt stage name | Done | From `useBeltPersonalization()` |
| Mindset quote | Done | Italic, from belt profile |
| Profile completion tracker | Done | Progress bar + items remaining |
| Training stats grid | Done | Sessions + frequency |
| Profile details list | Done | Shows all fields |
| Progressive profiling nudges | Done | Via EditSheet |
| Settings access button | Done | Card with chevron |
| Inline field editing | Partial | Some fields only |
| **Belt progression editing** | Planned | Sheet with date picker, creates history event |
| **Stripe progression editing** | Planned | Sheet with date picker, creates history event |
| **Belt history storage** | Planned | Array of BeltProgressionEvent |
| **Birthdate field** | ✅ Done | Captured at onboarding, LOCKED, displayed as age |
| **Gender field** | ✅ Done | Male/Female only, captured at onboarding, LOCKED |
| **Birthday celebration** | Planned | Special message on user's birthday |
| Avatar image upload | Planned | Only initials currently |

### Settings Page

| Feature | Status | Notes |
|---------|--------|-------|
| Logging preference toggle | Done | Voice/Text chips |
| Notification toggles | Done | UI only, preferences persist via profile context (no actual notifications) |
| Export data | Done | Downloads JSON |
| Delete account | Done | Confirmation + localStorage clear |
| Privacy/Terms/Support | Done | Placeholder alerts |
| Version display | Done | "1.0.0 (Prototype)" |
| Demo mode switcher | Done | 6-persona grid |
| Restart onboarding | Done | Full reset with confirmation |
| Session defaults | Planned | Duration/type/sparring |
| Insight tone selector | Planned | Warm/balanced/direct |

---

## Future Considerations

### Profile Enhancements

1. **Avatar Upload**
   - Allow photo upload from camera/library
   - Preset avatar options (silhouettes, belt-themed)
   - Crop and resize tools

2. **Birthday Celebrations**
   - On user's birthday, show special message in Dashboard
   - Insight: "Happy Birthday! You've trained X sessions in your [age] year of life"
   - Optional: temporary birthday badge visible on profile for 24 hours
   - Push notification (if enabled): "Happy birthday from TOMO! You've accomplished X this year"

3. **Training Partner Tracking**
   - "Who do you train with?" field
   - Partner mention in sessions → relationship mapping
   - "Your most frequent partners" insight

4. **Belt Progression Visualizations**
   - Interactive timeline of all belt/stripe promotions
   - "Time to promotion" comparisons (vs. average for belt)
   - Stripe velocity tracking
   - Exportable progression certificates

5. **Achievement Badges** (Non-gamified)
   - Visual badges for milestones (100 sessions, 1-year anniversary)
   - Simple acknowledgments, not "unlocks"
   - Belt anniversary recognition

6. **Public Profile (Optional)**
   - Shareable profile link
   - Choose what's visible
   - Competition record display

### Settings Enhancements

1. **Notification Scheduling**
   - Custom reminder times
   - Rest day awareness (don't remind on off days)
   - Smart reminders based on training patterns

2. **Data Portability**
   - Import from other training apps
   - Bulk session upload
   - CSV export option

3. **Family/Multi-Profile**
   - Switch between profiles (kids/spouse)
   - Profile PIN lock

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `BELT_PERSONALIZATION_SYSTEM.md` | Belt psychology and adaptations |
| `ONBOARDING_PRD.md` | Initial data capture flow |
| `FIRST_PRINCIPLES.md` | Core product beliefs |
| `/personas/PERSONA_PROFILES.md` | Test persona specifications |

---

*This document is the single source of truth for Profile and Settings features. Update this document first when making changes.*
