# Onboarding Flow - Product Requirements Document

**Feature:** First-Time User Onboarding
**Status:** Implementation Complete
**Last Updated:** February 8, 2026
**Component:** `Onboarding.tsx`

---

## Overview

### Purpose

Capture essential data to deliver a personalized experience from day 1, while offering optional fields for users willing to share more. Mandatory fields cannot be skipped; optional fields, if skipped, are collected via progressive profiling in later sessions.

### Design Philosophy

1. **Consolidate screens** - Fewer screens, more content per screen
2. **Mandatory vs optional is clear** - Users know what's required
3. **Respect user choice** - Optional fields can be skipped without friction
4. **Large touch targets** - Users may onboard right after training
5. **Progressive disclosure** - Skipped optional fields asked in later sessions

### Success Metrics

| Metric | Target |
|--------|--------|
| Completion rate | >95% |
| Time to complete | <45 seconds (mandatory only), <90 seconds (with optionals) |
| Optional field completion | >40% |
| Drop-off at any screen | <5% |

---

## Revised Flow: 4 Screens

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   WELCOME   │ ──▶ │  ABOUT YOU  │ ──▶ │YOUR TRAINING│ ──▶ │ GET STARTED │
│             │     │             │     │             │     │             │
│  (intro)    │     │ Name*       │     │ Gym*        │     │ Voice/Text* │
│             │     │ Belt*       │     │ Frequency*  │     │ ─────────── │
│             │     │ Stripes*    │     │ ─────────── │     │ Ready CTA   │
│             │     │             │     │ Goals (opt) │     │             │
│             │     │             │     │ Exp (opt)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

* = mandatory
```

**Total screens:** 4 (down from 6)
**Mandatory inputs:** 8 (name, belt, stripes, gender, birthday, gym, frequency, logging preference)
**Optional inputs:** 2 (training goals, experience level)
**Estimated time:** 50-70 seconds (mandatory only), 80-100 seconds (with optionals)

---

## Data Captured

### Mandatory Fields (8)

| Field | Screen | Type | Why Critical |
|-------|--------|------|--------------|
| `name` | About You | text | Personalization in every screen |
| `belt` | About You | enum | Foundation of personalization system |
| `stripes` | About You | number | Refines belt psychology |
| `gender` | About You | enum | Peer comparisons, competition categories (LOCKED after set) |
| `birthDate` | About You | date | Age-based insights, birthday celebrations (LOCKED after set) |
| `gymName` | Your Training | search/select | Gym affiliation is core to BJJ identity |
| `targetFrequency` | Your Training | number | Enables consistency tracking from day 1 |
| `loggingPreference` | Get Started | enum | Determines first session experience |

### Optional Fields (2)

If skipped at onboarding, these are asked via progressive profiling:

| Field | Screen | Type | Fallback Session | Value |
|-------|--------|------|------------------|-------|
| `trainingGoals` | Your Training | multi-select | Session 10 | Affects content emphasis |
| `experienceLevel` | Your Training | enum | Session 3 | Journey context |

### Still Deferred (not at onboarding)

| Field | When Asked | Why Not at Onboarding |
|-------|------------|----------------------|
| `beltPromotionDate` | Session 15 | Too specific, can estimate |
| `trainingStartDate` | Session 3 | Context for journey, not critical upfront |

**Note:** Gender and Birthday were moved to onboarding in Feb 2026 to ensure data completeness from day one. These fields are LOCKED after set.

---

## Screen Specifications

### Screen 1: Welcome

**Purpose:** Set the tone, create first impression.
**Changes from v1:** None - keep as is.

**Layout:**
```
┌────────────────────────────────┐
│                                │
│            TOMO                │
│             友                 │
│                                │
│     Track your journey.        │
│     See your progress.         │
│     Know what's next.          │
│                                │
│        ═══════════             │
│                                │
│     ┌──────────────────┐       │
│     │   GET STARTED    │       │
│     └──────────────────┘       │
│                                │
└────────────────────────────────┘
```

**Interactions:**
- Tap "Get Started" → Navigate to About You

---

### Screen 2: About You

**Purpose:** Capture identity essentials - name, belt, stripes.
**Changes from v1:** Combined Name + Belt + Stripes into single screen.

**Layout:**
```
┌────────────────────────────────┐
│ ←                              │
│                                │
│  About You                     │
│                                │
│  ─────────────────────────     │
│  WHAT SHOULD WE CALL YOU?      │
│  ┌────────────────────────┐    │
│  │ First name             │    │
│  └────────────────────────┘    │
│                                │
│  ─────────────────────────     │
│  WHAT'S YOUR CURRENT BELT?     │
│                                │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐│
│  │Wht ││Blue││Purp││Brwn││Blck││
│  └────┘└────┘└────┘└────┘└────┘│
│                                │
│  HOW MANY STRIPES?             │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐      │
│  │0 │ │1 │ │2 │ │3 │ │4 │      │
│  └──┘ └──┘ └──┘ └──┘ └──┘      │
│                                │
│  ─────────────────────────     │
│  GENDER                        │
│  ┌─────────────┐┌─────────────┐│
│  │    Male     ││   Female    ││
│  └─────────────┘└─────────────┘│
│                                │
│  ─────────────────────────     │
│  BIRTHDAY                      │
│  ┌────────────────────────┐    │
│  │ Select date...         │    │
│  └────────────────────────┘    │
│                                │
│     ┌──────────────────┐       │
│     │     CONTINUE     │       │
│     └──────────────────┘       │
└────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Screen title | Unbounded, 28px, weight 700, white |
| Section labels | JetBrains Mono, 11px, weight 600, uppercase, gray-400 |
| Name input | Full-width, 52px height, 18px text |
| Belt buttons | 56×72px each, flex row with 6px gap |
| Stripe buttons | 44×44px each, flex row with 8px gap |
| Gender buttons | Two-button row, 50% width each, 48px height |
| Birthday input | Native date picker, full-width, 48px height |
| Continue button | Full-width, 56px, disabled until all 5 fields filled |

**Validation:**
- Name: 1-30 characters, trimmed
- Belt: Must select one
- Stripes: Must select one (0-4)
- Gender: Must select Male or Female
- Birthday: Must select a valid date
- "Continue" disabled until all five are valid

**Important:** Gender and Birthday are LOCKED after onboarding. Users cannot change these values later. This is intentional for data integrity in analytics and peer comparisons.

**Interactions:**
- Stripe selector always visible (not conditional on belt selection - simpler UX)
- Tap Continue → Navigate to Your Training

---

### Screen 3: Your Training

**Purpose:** Capture gym (mandatory), training frequency (mandatory), plus optional context.
**Changes from v2:** Gym is now mandatory with searchable picker + manual entry option.
**Data file:** `/prototype/src/data/GYM_DATABASE.md` (documentation), `/prototype/src/data/gyms.ts` (implementation)

**Layout:**
```
┌────────────────────────────────┐
│ ←                              │
│                                │
│  Your Training                 │
│                                │
│  ─────────────────────────     │
│  WHERE DO YOU TRAIN? *         │
│  ┌────────────────────────┐    │
│  │ 🔍 Search gyms...      │    │
│  └────────────────────────┘    │
│                                │
│  (search results or browse)    │
│  ┌────────────────────────┐    │
│  │ Atos HQ                │    │
│  │ San Diego, CA • Atos   │    │
│  └────────────────────────┘    │
│  ┌────────────────────────┐    │
│  │ Alliance Austin        │    │
│  │ Austin, TX • Alliance  │    │
│  └────────────────────────┘    │
│  ┌────────────────────────┐    │
│  │ + Add my gym manually  │    │
│  └────────────────────────┘    │
│                                │
│  ─────────────────────────     │
│  HOW OFTEN DO YOU WANT TO      │
│  TRAIN? *                      │
│                                │
│  ┌────────┐┌────────┐┌────────┐│
│  │ 1-2x   ││ 3-4x   ││  5+    ││
│  │ /week  ││ /week  ││ /week  ││
│  └────────┘└────────┘└────────┘│
│                                │
│  ═══════════════════════════   │
│  TELL US MORE (OPTIONAL)       │
│                                │
│  Why do you train?             │
│  ┌────┐┌────┐┌────┐┌────┐      │
│  │Comp││Fitn││Hobb││Mind││      │
│  └────┘└────┘└────┘└────┘      │
│                                │
│  How long have you trained?    │
│  ┌────┐┌────┐┌────┐┌────┐      │
│  │New ││<1yr││1-3y││ 3y+││      │
│  └────┘└────┘└────┘└────┘      │
│                                │
│     ┌──────────────────┐       │
│     │     CONTINUE     │       │
│     └──────────────────┘       │
└────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Screen title | Unbounded, 28px, weight 700, white |
| Required indicator | " *" after label |
| Gym search input | Full-width, 52px height, search icon, gray-900 bg |
| Gym result cards | Full-width, 56px height, name + location + affiliation |
| Manual entry option | Full-width, 48px, gray-800 bg, "+ Add my gym manually" |
| Frequency chips | 3-up horizontal, 96×56px each |
| Optional divider | Gray-700 line + "TELL US MORE (OPTIONAL)" label |
| Goal chips | Multi-select, 72×40px each |
| Experience chips | Single-select, 72×40px each |

---

### Gym Picker Component

The gym picker is a critical UI component. It has three states:

**State 1: Browse Mode (Default)**
Shows popular gyms grouped by affiliation when search is empty.

```
┌────────────────────────────────┐
│ 🔍 Search gyms...              │
└────────────────────────────────┘

POPULAR GYMS

Alliance
┌────────────────────────────────┐
│ Alliance HQ                    │
│ Atlanta, GA                    │
└────────────────────────────────┘
┌────────────────────────────────┐
│ Alliance Austin                │
│ Austin, TX                     │
└────────────────────────────────┘

Atos
┌────────────────────────────────┐
│ Atos HQ                        │
│ San Diego, CA                  │
└────────────────────────────────┘

... (scrollable)

┌────────────────────────────────┐
│ + My gym isn't listed          │
└────────────────────────────────┘
```

**State 2: Search Mode**
Shows filtered results as user types.

```
┌────────────────────────────────┐
│ 🔍 gracie ba                   │  ← User typing
└────────────────────────────────┘

┌────────────────────────────────┐
│ Gracie Barra HQ                │
│ Irvine, CA • Gracie Barra      │
└────────────────────────────────┘
┌────────────────────────────────┐
│ Gracie Barra Portland          │
│ Portland, OR • Gracie Barra    │
└────────────────────────────────┘
┌────────────────────────────────┐
│ Gracie Barra Denver            │
│ Denver, CO • Gracie Barra      │
└────────────────────────────────┘

┌────────────────────────────────┐
│ + Add "gracie ba" as my gym    │
└────────────────────────────────┘
```

**State 3: Manual Entry Mode**
Opens when user taps "My gym isn't listed" or "Add X as my gym".

```
┌────────────────────────────────┐
│ ←  Add Your Gym                │
│                                │
│  GYM NAME *                    │
│  ┌────────────────────────┐    │
│  │ Gracie Barra Philly    │    │
│  └────────────────────────┘    │
│                                │
│  CITY (OPTIONAL)               │
│  ┌────────────────────────┐    │
│  │ Philadelphia           │    │
│  └────────────────────────┘    │
│                                │
│  STATE/COUNTRY (OPTIONAL)      │
│  ┌────────────────────────┐    │
│  │ PA                     │    │
│  └────────────────────────┘    │
│                                │
│     ┌──────────────────┐       │
│     │    ADD GYM       │       │
│     └──────────────────┘       │
└────────────────────────────────┘
```

**Selected Gym Display:**
Once a gym is selected, it appears as a chip with an "x" to clear:

```
WHERE DO YOU TRAIN? *
┌────────────────────────────────┐
│ Atos HQ, San Diego        ✕    │
└────────────────────────────────┘
```

---

### Gym Data Structure

```typescript
// From database
interface Gym {
  id: string;
  name: string;
  affiliation: string | null;
  city: string;
  stateOrCountry: string;
  isHeadquarters?: boolean;
  aliases?: string[];
}

// User-entered gym
interface CustomGym {
  id: string;           // Generated UUID
  name: string;
  affiliation: null;
  city?: string;
  stateOrCountry?: string;
  isCustom: true;
}

// What we store in profile
type GymSelection = {
  gymId: string;        // Either database ID or custom UUID
  gymName: string;      // Display name
  isCustom: boolean;    // True if user-entered
};
```

---

### Training Goal Options (Multi-select)

| Value | Label | Stored As |
|-------|-------|-----------|
| competition | Compete | `trainingGoals: ['competition']` |
| fitness | Fitness | `trainingGoals: ['fitness']` |
| hobby | Hobby | `trainingGoals: ['hobby']` |
| mental | Mental | `trainingGoals: ['mental']` |

*User can select multiple (e.g., "Fitness" + "Hobby")*

### Experience Level Options (Single-select)

| Value | Label | Maps To |
|-------|-------|---------|
| new | Brand new | `experienceLevel: 'new'` |
| beginner | < 1 year | `experienceLevel: 'beginner'` |
| intermediate | 1-3 years | `experienceLevel: 'intermediate'` |
| experienced | 3+ years | `experienceLevel: 'experienced'` |

---

### Validation

| Field | Rule | Blocks Continue? |
|-------|------|------------------|
| Gym | MUST select or enter one | Yes |
| Frequency | MUST select one | Yes |
| Training goals | 0-4 selections OK | No |
| Experience | 0-1 selection OK | No |

**"Continue" enabled when:** Gym selected AND Frequency selected

### Interactions

- Tap search input → Keyboard opens, browse mode switches to search mode
- Type in search → Results filter in real-time
- Tap gym result → Gym selected, shows as chip, search collapses
- Tap chip "x" → Clears selection, returns to search/browse
- Tap "My gym isn't listed" → Opens manual entry modal
- Tap frequency chip → Selected (gold border, single-select)
- Tap goal chip → Toggle (multi-select)
- Tap experience chip → Select (single-select)
- Tap Continue → Navigate to Get Started

---

### Screen 4: Get Started

**Purpose:** Capture logging preference and launch user into app.
**Changes from v1:** Combined Mic Permission + Ready into single screen.

**Layout:**
```
┌────────────────────────────────┐
│                                │
│  Almost there!                 │
│                                │
│  ─────────────────────────     │
│  HOW DO YOU WANT TO LOG        │
│  SESSIONS?                     │
│                                │
│  ┌──────────────────────────┐  │
│  │  🎤  Voice               │  │
│  │  Just talk after class   │  │
│  │  60 seconds, hands-free  │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │  ⌨️  Text                │  │
│  │  Type your notes         │  │
│  │  Traditional journaling  │  │
│  └──────────────────────────┘  │
│                                │
│  ═══════════════════════════   │
│                                │
│         ┌─────────┐            │
│         │    ✓    │            │
│         └─────────┘            │
│                                │
│    You're all set, {name}!     │
│                                │
│  ┌──────────────────────────┐  │
│  │   LOG YOUR FIRST SESSION │  │
│  └──────────────────────────┘  │
│                                │
│      Explore the app first     │
│                                │
└────────────────────────────────┘
```

**UI Behavior:**

This screen has **two states**:

**State 1: Choosing logging preference**
- Voice and Text cards are prominent
- Bottom section (checkmark + CTAs) is hidden or dimmed

**State 2: After preference selected**
- Selected card shows gold border
- Unselected card fades slightly
- Bottom section animates in (checkmark + "You're all set" + CTAs)

**UI Elements:**

| Element | Spec |
|---------|------|
| Screen title | Unbounded, 24px, weight 700, white |
| Preference cards | Full-width, 80px height, include icon + title + subtitle |
| Voice icon | Mic SVG, 24px, gold |
| Text icon | Keyboard SVG, 24px, gray-400 |
| Checkmark | 64×64px green circle with white check |
| Success message | Unbounded, 24px, weight 700, includes `{name}` |
| Primary CTA | Full-width, 56px, gold background |
| Secondary CTA | Text link, gray-400, underline on hover |

**Interactions:**
- Tap Voice → Set `loggingPreference: 'voice'`, show success state
- Tap Text → Set `loggingPreference: 'text'`, show success state
- Tap "Log your first session" → Complete onboarding, navigate to Session Logger
- Tap "Explore the app first" → Complete onboarding, navigate to Dashboard

**Animation:**
- Success section: `fadeIn 300ms + slideUp 200ms`
- Checkmark: `scale(0→1) 300ms spring`

---

## Data Model

### UserProfile (Updated)

```typescript
interface UserProfile {
  // Captured at onboarding - MANDATORY
  userId: string;
  name: string;
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: 0 | 1 | 2 | 3 | 4;
  gender: 'male' | 'female';            // LOCKED after onboarding
  birthDate: string;                    // ISO date, LOCKED after onboarding
  gym: GymSelection;                    // Required - selected or manually entered
  targetFrequency: number;              // 2, 4, or 5
  loggingPreference: 'voice' | 'text';
  onboardingComplete: boolean;
  sessionCount: number;

  // Captured at onboarding - OPTIONAL (if skipped, asked via progressive profiling)
  trainingGoals?: string[];             // ['competition', 'fitness', 'hobby', 'mental']
  experienceLevel?: 'new' | 'beginner' | 'intermediate' | 'experienced';

  // Captured via progressive profiling only
  trainingStartDate?: string;           // Can derive from experienceLevel if needed
  beltPromotionDate?: string;           // Session 15
}

interface GymSelection {
  gymId: string;                        // Database ID or generated UUID for custom
  gymName: string;                      // Display name
  isCustom: boolean;                    // True if user-entered
  city?: string;                        // Optional for custom gyms
  stateOrCountry?: string;              // Optional for custom gyms
  affiliation?: string;                 // From database, null for custom
}
```

### Onboarding State

```typescript
interface OnboardingState {
  step: 'welcome' | 'about' | 'training' | 'start';

  // Mandatory (all required to complete)
  name: string;
  belt: BeltLevel | null;
  stripes: number | null;
  gender: 'male' | 'female' | null;     // LOCKED after set
  birthDate: string | null;             // ISO date, LOCKED after set
  gym: GymSelection | null;             // Now mandatory
  targetFrequency: number | null;
  loggingPreference: 'voice' | 'text' | null;

  // Optional (can be null/empty)
  trainingGoals: string[];              // Empty array if none selected
  experienceLevel: string | null;       // null if not selected
}
```

---

## Progressive Profiling Fallback

When optional fields are skipped at onboarding:

| Field | Fallback Session | Question |
|-------|------------------|----------|
| `trainingGoals` | Session 10 | "Quick question: Why do you train?" |
| `experienceLevel` | Session 3 | "How long have you been training?" |

**Note:** Gym is now mandatory at onboarding (no fallback needed).

If already answered at onboarding, these questions are skipped in progressive profiling.

---

## Edge Cases

### Validation Rules

| Field | Rule | Error State |
|-------|------|-------------|
| Name | 1-30 chars required | Continue disabled |
| Belt | Must select one | Continue disabled |
| Stripes | Must select one | Continue disabled |
| Gender | Must select Male or Female | Continue disabled |
| Birthday | Must select valid date | Continue disabled |
| Gym | Must select from list OR enter manually | Continue disabled |
| Frequency | Must select one | Continue disabled |
| Logging pref | Must select one | CTAs hidden |
| Training goals | 0-4 selections OK | N/A (optional) |
| Experience | 0-1 selection OK | N/A (optional) |

### Navigation

| Scenario | Behavior |
|----------|----------|
| Back from About You | Return to Welcome |
| Back from Your Training | Return to About You |
| Back from Get Started | Return to Your Training |
| Kill app mid-onboarding | Restart from Welcome |
| Force quit on Get Started after preference | Consider complete |

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Screen reader | All elements have aria-labels |
| Font scaling | Layouts accommodate 200% text |
| Color contrast | WCAG AA (4.5:1 minimum) |
| Touch targets | Mandatory: 56px min, Optional: 44px min |
| Focus states | Visible on all interactive elements |
| Optional indicators | Both visual (divider) and text ("optional") |

---

## Testing Checklist

### Mandatory Flow
- [x] Cannot proceed from About You without name
- [x] Cannot proceed from About You without belt
- [x] Cannot proceed from About You without stripes
- [x] Cannot proceed from About You without gender
- [x] Cannot proceed from About You without birthday
- [x] Cannot proceed from Your Training without gym
- [x] Cannot proceed from Your Training without frequency
- [x] Cannot complete without logging preference
- [x] All combinations of belt + stripes work

### Gym Picker
- [ ] Search filters gyms in real-time
- [ ] Can select gym from search results
- [ ] Can select gym from browse mode
- [ ] Can enter custom gym via manual entry
- [ ] Manual entry requires gym name, city/state optional
- [ ] Selected gym appears as chip with clear button
- [ ] Clearing gym returns to search/browse state
- [ ] Gym affiliation displays correctly
- [ ] Search matches aliases (e.g., "AOJ" finds "Art of Jiu-Jitsu")

### Optional Fields
- [ ] Can skip all optional fields and complete
- [ ] Can select multiple training goals
- [ ] Can select experience level
- [ ] Optional fields persist if filled

### Edge Cases
- [ ] Back navigation preserves all entered data
- [ ] 30+ char name truncates gracefully
- [ ] Custom gym name with special characters works
- [ ] Rapid tapping doesn't break state
- [ ] Long gym names display correctly

---

## Comparison: v1 vs v2 vs v3 vs v4

| Aspect | v1 (6 screens) | v2 (4 screens) | v3 (4 screens + gym) | v4 (current) |
|--------|----------------|----------------|----------------------|--------------|
| Screens | 6 | 4 | 4 | **4** |
| Mandatory inputs | 5 | 5 | 6 | **8** |
| Optional inputs | 0 | 3 | 2 | **2** |
| Est. time (mandatory) | 45-60s | 30-45s | 45-60s | **50-70s** |
| Est. time (with optionals) | N/A | 60-90s | 75-90s | **80-100s** |
| Gym captured | No | Optional | Mandatory | **Mandatory** |
| Gender captured | No | No | No | **Mandatory** |
| Birthday captured | No | No | No | **Mandatory** |
| Data captured | 5 fields | 5-8 fields | 6-8 fields | **8-10 fields** |

**v4 Changes (Feb 2026):**
- Added Gender (Male/Female only) as mandatory field on "About You" screen
- Added Birthday as mandatory field on "About You" screen
- Both fields are LOCKED after onboarding (cannot be changed)
- Removed Gender and Birthday from progressive profiling schedule

---

## Related Documents

- `/docs/product/FEATURES.md` - Update Section 1
- `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` - Belt psychology
- `/docs/personas/PERSONA_PROFILES.md` - Test personas
- `/prototype/src/components/features/Onboarding.tsx` - Implementation

---

*Last updated: January 25, 2026*
