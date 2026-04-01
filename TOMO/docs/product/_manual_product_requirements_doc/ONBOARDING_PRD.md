# Onboarding Flow - Product Requirements Document

**Feature:** First-Time User Onboarding
**Status:** Implementation In Progress (gender, birthday, weight, expanded goals NOT yet built)
**Last Updated:** March 30, 2026
**Component:** `AboutYouScreen.tsx`, `YourTrainingScreen.tsx`, `GetStartedScreen.tsx`

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
│             │     │ Birthday*   │     │ Goals (opt) │     │             │
│             │     │ ─────────── │     │ Exp (opt)   │     │             │
│             │     │Gender (opt) │     │ Weight(opt) │     │             │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

* = mandatory
```

**Total screens:** 4
**Mandatory inputs:** 6 (name, belt, stripes, birthday, gym, frequency, logging preference)
**Optional inputs:** 4 (gender, training goals, experience level, body weight)
**Estimated time:** 50-70 seconds (mandatory only), 90-120 seconds (with optionals)

---

## Data Captured

### Mandatory Fields (6)

| Field | Screen | Type | Why Critical |
|-------|--------|------|--------------|
| `name` | About You | text | Personalization in every screen |
| `belt` | About You | enum | Foundation of personalization system |
| `stripes` | About You | number | Refines belt psychology |
| `birthDate` | About You | date | Age-based insights, recovery context, birthday celebrations (LOCKED after set). **Must be 18+.** |
| `gymName` | Your Training | search/select | Gym affiliation is core to BJJ identity |
| `targetFrequency` | Your Training | number | Enables consistency tracking from day 1 |
| `loggingPreference` | Get Started | enum | Determines first session experience |

### Optional Fields (4)

If skipped at onboarding, these are asked via progressive profiling:

| Field | Screen | Type | Fallback Session | Value |
|-------|--------|------|------------------|-------|
| `gender` | About You | enum (Male / Female / skip) | Session 5 | Competition categories, peer comparisons, insight tone (LOCKED after set) |
| `trainingGoals` | Your Training | multi-select | Session 10 | Affects content emphasis |
| `experienceLevel` | Your Training | enum | Session 3 | Journey context |
| `bodyWeight` | Your Training | number (lb/kg) | Session 5 | Competition class suggestions, rolling context |

### Still Deferred (not at onboarding)

| Field | When Asked | Why Not at Onboarding |
|-------|------------|----------------------|
| `beltPromotionDate` | Session 15 | Too specific, can estimate |
| `trainingStartDate` | Session 3 | Context for journey, not critical upfront |
| `injuries` | Future (FEAT-006) | Complex input, better collected over time via session logging |

### Design Decisions (March 2026 Update)

**Birthday is mandatory.** Age is foundational to how we personalize insights. Recovery advice for a 22-year-old is different from a 50-year-old. Training projections, injury context, and technique recommendations all adapt based on age. We also enforce a minimum age of 18 to use the app. We're honest about why we collect this: the app tells users upfront that their age helps shape their training insights. Birthday is editable from the Profile screen, but changing it warns the user if it crosses an IBJJF Masters age bracket (30, 36, 41, 46, 51, 56) because that affects competition categories and peer comparisons.

**Gender is mandatory.** We ask for Male or Female at onboarding. Gender directly affects competition weight classes, peer comparisons, and insight personalization. Gender is editable from the Profile screen, but changing it (e.g., Male to Female) triggers a warning explaining that it will recalculate competition class, peer comparisons, and training insights across their entire history.

**Body weight is optional.** Collected on the Your Training screen. Relevant to competition weight class mapping and rolling dynamics. Users can skip and add later from their profile. We show which IBJJF weight class they fall into as immediate value. Weight is freely editable (not locked) because weight changes over time.

**Self-defense added as a training goal.** Self-defense is one of the top 3 reasons people start BJJ, especially women and older beginners. Omitting it was an oversight. Self-defense practitioners have different needs: focus on standup, escapes, and situational awareness over sport-specific guard play.

**Community added as a training goal.** The social/community aspect of BJJ is a major retention driver. Recognizing it helps us understand why users train and tailor their experience accordingly.

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

**Purpose:** Capture identity essentials (name, belt, stripes, birthday) and optionally gender.
**Changes from v4:** Gender changed from mandatory to optional. Birthday remains mandatory with 18+ enforcement. Transparency microcopy added for sensitive fields.

**Layout:**
```
┌────────────────────────────────┐
│ ←                              │
│                                │
│  About You                     │
│  Tell us a little about        │
│  yourself so we can            │
│  personalize your experience.  │
│                                │
│  ─────────────────────────     │
│  FIRST NAME                    │
│  ┌────────────────────────┐    │
│  │ Your first name        │    │
│  └────────────────────────┘    │
│                                │
│  ─────────────────────────     │
│  BELT                          │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐│
│  │Wht ││Blue││Purp││Brwn││Blck││
│  └────┘└────┘└────┘└────┘└────┘│
│                                │
│  STRIPES                       │
│  0 if you don't have any yet   │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐      │
│  │0 │ │1 │ │2 │ │3 │ │4 │      │
│  └──┘ └──┘ └──┘ └──┘ └──┘      │
│                                │
│  ─────────────────────────     │
│  BIRTHDAY                      │
│  Your age helps us adjust      │
│  insights and projections      │
│  to your training.             │
│  ┌────────────────────────┐    │
│  │ [iOS scroll wheel]     │    │
│  └────────────────────────┘    │
│  (Must be 18 or older)         │
│                                │
│  ─────────────────────────     │
│  GENDER (OPTIONAL)             │
│  Helps personalize competition │
│  class and training insights.  │
│  ┌─────────────┐┌─────────────┐│
│  │    Male     ││   Female    ││
│  └─────────────┘└─────────────┘│
│                                │
│     ┌──────────────────┐       │
│     │     CONTINUE     │       │
│     └──────────────────┘       │
└────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Screen title | Unbounded, 28px, weight 800, white |
| Subtitle | Inter, 15px, weight 500, gray-400, 22px line height |
| Section labels | JetBrains Mono, 12px, weight 600, uppercase, gray-500, 2px letter spacing |
| Name input | Full-width, gray-800 bg, gray-700 border, 16px padding, 17px text |
| Belt buttons | 56×72px each, flex row, belt-colored circles with gold selection ring |
| Stripe buttons | 52×52px each, flex row with 8px gap |
| Birthday picker | iOS native scroll wheel (UIDatePicker, mode: date). Tapping the field opens the wheel inline (not modal). Maximum date = today minus 18 years. Minimum date = today minus 100 years. |
| Birthday microcopy | Inter, 13px, weight 500, gray-600, below picker |
| Gender label | JetBrains Mono, 12px, weight 600, gray-500, includes "(OPTIONAL)" in same style |
| Gender microcopy | Inter, 13px, weight 500, gray-600, below label |
| Gender buttons | Two-chip row, gold border when selected, gray-800 bg default. Neither selected by default. |
| Continue button | Full-width, 56px, gold bg, disabled until mandatory fields filled |

**Validation:**
- Name: 1-30 characters, trimmed
- Belt: Must select one
- Stripes: Must select one (0-4), visible immediately (not conditional on belt)
- Birthday: Must select a valid date. **Must be 18 or older.** If under 18, show inline error: "You must be 18 or older to use TOMO." Continue stays disabled.
- Gender: Optional. Can proceed without selecting.
- "Continue" enabled when: name + belt + stripes + valid 18+ birthday

**Age Enforcement:**
- Calculated at validation time: `today - selectedDate >= 18 years`
- No upfront age gate or "are you 18?" checkbox. The date picker naturally enforces this.
- If user selects a date that makes them under 18, a gentle inline message appears below the picker in `colors.negative` (red): "You must be 18 or older to use TOMO."
- The Continue button remains disabled until a valid 18+ date is selected.

**Transparency Microcopy:**
- Below the BIRTHDAY label: "Your age helps us adjust insights and projections to your training." (Inter, 13px, gray-600)
- Below the GENDER label: "Helps personalize competition class and training insights." (Inter, 13px, gray-600)
- These are always visible, not hidden behind info icons. Honesty is the design principle.

**Locked Fields:**
- Birthday is LOCKED after onboarding. Cannot be changed later. Users see it on their Profile screen with a lock icon.
- Gender is LOCKED after it is set (either at onboarding or via progressive profiling at Session 5). If skipped at onboarding, it can be set once later, then locks.
- A small note appears when gender is first selected (either onboarding or progressive): "Note: this can't be changed later." (Inter, 12px, gray-500, appears below the selected chip for 3 seconds then fades)

**Interactions:**
- Stripe selector always visible (not conditional on belt selection)
- Birthday picker: tap the field to expand the iOS scroll wheel inline. Scroll to select month, day, year.
- Gender chips: tap to select, tap again to deselect (since it's optional). Neither is pre-selected.
- Tap Continue: navigate to Your Training, passing all values (gender may be null)

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

| Value | Label | Stored As | Personalization Impact |
|-------|-------|-----------|----------------------|
| competition | Competition | `trainingGoals: ['competition']` | Tournament prep content, match analysis, weight management tips |
| fitness | Fitness | `trainingGoals: ['fitness']` | Conditioning emphasis, consistency tracking, physical benchmarks |
| self_defense | Self-Defense | `trainingGoals: ['self_defense']` | Standup/takedown focus, escape techniques, situational awareness drills |
| mental | Mental Health | `trainingGoals: ['mental']` | Stress relief framing, mindfulness integration, consistency encouragement |
| community | Community | `trainingGoals: ['community']` | Social aspects, open mat recommendations, gym culture content |
| hobby | Hobby | `trainingGoals: ['hobby']` | Fun-first tone, exploration over optimization, low-pressure framing |

*User can select multiple (e.g., "Fitness" + "Self-Defense"). Stored as lowercase string array.*

**Self-Defense goal context:** Self-defense is one of the top 3 reasons people start BJJ, especially women and older beginners. Self-defense practitioners have different training needs than sport practitioners: emphasis on standup, escapes from common attacks, awareness of size/strength differentials, and practical application over competition-specific positions. Our insights should adapt accordingly.

**Community goal context:** The social/community aspect of training is a major retention driver in BJJ. Users who select this care about the gym culture, training partners, and the social bonds formed through training. Our insights can acknowledge this by referencing training consistency with partners, open mat participation, and the social side of the journey.

### Experience Level Options (Single-select)

| Value | Label | Maps To |
|-------|-------|---------|
| new | < 6 months | `experienceLevel: 'new'` |
| beginner | 6mo - 2yr | `experienceLevel: 'beginner'` |
| intermediate | 2 - 5yr | `experienceLevel: 'intermediate'` |
| experienced | 5+ yr | `experienceLevel: 'experienced'` |

### Body Weight (Optional)

**Location:** Your Training screen, below the optional divider, after Experience Level.

**UI:**
```
┌────────────────────────────────┐
│  BODY WEIGHT (OPTIONAL)        │
│  Helps suggest your            │
│  competition weight class.     │
│  Only visible to you.          │
│                                │
│  ┌──────────┐  ┌────┐┌────┐   │
│  │  165     │  │ lb ││ kg │   │
│  └──────────┘  └────┘└────┘   │
│                                │
│  → Feather (Pena) class        │  ← instant feedback when weight entered
└────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Label | JetBrains Mono, 12px, weight 600, gray-500, includes "(OPTIONAL)" |
| Microcopy | Inter, 13px, weight 500, gray-600, below label |
| Privacy note | "Only visible to you." in same microcopy style |
| Weight input | Numeric input, gray-800 bg, gray-700 border, 17px text, 80px wide |
| Unit toggle | Two chips (lb / kg), default lb, single-select, 44px height |
| Weight class hint | Inter, 13px, weight 500, gold color, appears after weight entered. Shows IBJJF weight class based on entered weight + gender (if provided). If no gender, shows both male and female class. |

**Validation:**
- Numeric only, 50-400 lb range (or 23-180 kg)
- Unit toggle switches the displayed value (converts automatically)
- No validation error shown, just constrains input range
- Empty is valid (field is optional)

**Storage:**
- Stored as `body_weight_kg` (always in kg, converted from lb if needed)
- `weight_unit_preference` stored separately ('lb' or 'kg') for display

**Editability:** Freely editable from Profile screen (weight changes over time, not locked)

**IBJJF Weight Class Mapping:**
When weight is entered, show the corresponding IBJJF Gi weight class as instant feedback. This gives users immediate value from entering their weight. See IBJJF weight class tables in the data model section below.

---

### Validation

| Field | Rule | Blocks Continue? |
|-------|------|------------------|
| Gym | MUST select or enter one | Yes |
| Frequency | MUST select one | Yes |
| Training goals | 0-6 selections OK | No |
| Experience | 0-1 selection OK | No |
| Body weight | Empty or valid number OK | No |

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

### UserProfile (Updated March 2026)

```typescript
interface UserProfile {
  // Captured at onboarding - MANDATORY
  userId: string;
  name: string;
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: 0 | 1 | 2 | 3 | 4;
  birthDate: string;                    // ISO date (YYYY-MM-DD), LOCKED after onboarding, must be 18+
  gym: GymSelection;                    // Required - selected or manually entered
  targetFrequency: number;              // 2, 4, or 5
  loggingPreference: 'voice' | 'text';
  onboardingComplete: boolean;
  sessionCount: number;

  // Captured at onboarding - OPTIONAL (if skipped, asked via progressive profiling)
  gender: 'male' | 'female' | null;    // LOCKED after first set (onboarding or Session 5)
  trainingGoals?: string[];             // ['competition', 'fitness', 'self_defense', 'mental', 'community', 'hobby']
  experienceLevel?: 'new' | 'beginner' | 'intermediate' | 'experienced';
  bodyWeightKg?: number | null;         // Always stored in kg (converted from lb if needed)
  weightUnitPreference?: 'lb' | 'kg';  // User's preferred display unit

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

type TrainingGoal = 'competition' | 'fitness' | 'self_defense' | 'mental' | 'community' | 'hobby';
```

### Onboarding State

```typescript
interface OnboardingState {
  step: 'welcome' | 'about' | 'training' | 'start';

  // Mandatory (all required to complete)
  name: string;
  belt: BeltLevel | null;
  stripes: number | null;
  birthDate: string | null;             // ISO date, LOCKED after set, must be 18+
  gym: GymSelection | null;             // Mandatory
  targetFrequency: number | null;
  loggingPreference: 'voice' | 'text' | null;

  // Optional (can be null/empty)
  gender: 'male' | 'female' | null;     // LOCKED after first set
  trainingGoals: string[];              // Empty array if none selected
  experienceLevel: string | null;       // null if not selected
  bodyWeightKg: number | null;          // null if not entered
  weightUnitPreference: 'lb' | 'kg';   // default 'lb'
}
```

### IBJJF Weight Classes (Reference Data)

Used for instant weight class feedback when body weight is entered.

**Adult Male (Gi):**

| Class | Name | Max Weight |
|-------|------|-----------|
| Rooster | Galo | 57.5 kg / 126.8 lb |
| Light Feather | Pluma | 64.0 kg / 141.1 lb |
| Feather | Pena | 70.0 kg / 154.3 lb |
| Light | Leve | 76.0 kg / 167.6 lb |
| Middle | Medio | 82.3 kg / 181.4 lb |
| Medium Heavy | Meio Pesado | 88.3 kg / 194.7 lb |
| Heavy | Pesado | 94.3 kg / 207.9 lb |
| Super Heavy | Super Pesado | 100.5 kg / 221.6 lb |
| Ultra Heavy | Pesadissimo | No limit |

**Adult Female (Gi):**

| Class | Name | Max Weight |
|-------|------|-----------|
| Rooster | Galo | 48.5 kg / 106.9 lb |
| Light Feather | Pluma | 53.5 kg / 117.9 lb |
| Feather | Pena | 58.5 kg / 128.9 lb |
| Light | Leve | 64.0 kg / 141.1 lb |
| Middle | Medio | 69.0 kg / 152.1 lb |
| Medium Heavy | Meio Pesado | 74.0 kg / 163.1 lb |
| Heavy | Pesado | 79.3 kg / 174.8 lb |
| Super Heavy | Super Pesado | No limit |

If gender is not provided, show both: "Feather (men) / Light (women)"

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
| Birthday | Must select valid date, must be 18+ | Continue disabled. If under 18: inline red text "You must be 18 or older to use TOMO." |
| Gender | Optional (Male / Female / skip) | N/A (optional) |
| Gym | Must select from list OR enter manually | Continue disabled |
| Frequency | Must select one | Continue disabled |
| Logging pref | Must select one | CTAs hidden |
| Training goals | 0-6 selections OK | N/A (optional) |
| Experience | 0-1 selection OK | N/A (optional) |
| Body weight | Empty or valid number (50-400 lb / 23-180 kg) | N/A (optional) |

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
- [ ] Cannot proceed from About You without birthday (18+ enforcement)
- [ ] CAN proceed from About You without gender (optional)
- [x] Cannot proceed from Your Training without gym
- [x] Cannot proceed from Your Training without frequency
- [x] Cannot complete without logging preference
- [x] All combinations of belt + stripes work

### Age Enforcement
- [ ] Under-18 birthday shows inline error message
- [ ] Continue button stays disabled for under-18
- [ ] Exactly 18 today is allowed
- [ ] Date picker max date is today minus 18 years

### Gender (Optional)
- [ ] Can proceed without selecting gender
- [ ] Selecting gender shows "can't be changed later" note briefly
- [ ] Gender value passes through to profile as null if skipped

### Body Weight (Optional)
- [ ] Can proceed without entering weight
- [ ] lb/kg toggle works and converts value
- [ ] Weight class hint appears after entering weight
- [ ] Weight class adapts to gender selection (if provided)
- [ ] Weight class shows both male/female if no gender selected

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

## Comparison: v1 vs v2 vs v3 vs v4 vs v5

| Aspect | v1 (6 screens) | v2 (4 screens) | v3 (4 screens + gym) | v4 | v5 (current) |
|--------|----------------|----------------|----------------------|----|--------------|
| Screens | 6 | 4 | 4 | 4 | **4** |
| Mandatory inputs | 5 | 5 | 6 | 8 | **6** |
| Optional inputs | 0 | 3 | 2 | 2 | **4** |
| Est. time (mandatory) | 45-60s | 30-45s | 45-60s | 50-70s | **50-70s** |
| Est. time (with optionals) | N/A | 60-90s | 75-90s | 80-100s | **90-120s** |
| Gym captured | No | Optional | Mandatory | Mandatory | **Mandatory** |
| Gender captured | No | No | No | Mandatory | **Optional** |
| Birthday captured | No | No | No | Mandatory | **Mandatory (18+)** |
| Body weight | No | No | No | No | **Optional** |
| Training goals | No | Optional | Optional | Optional | **Optional (expanded)** |
| Data captured | 5 fields | 5-8 fields | 6-8 fields | 8-10 fields | **6-10 fields** |

**v5 Changes (Mar 2026):**
- Gender changed from mandatory to optional (respects user choice, LOCKED after first set)
- Birthday stays mandatory with 18+ age enforcement
- Body weight added as optional field on Your Training screen (with IBJJF weight class feedback)
- Training goals expanded: added Self-Defense and Community options
- Transparency microcopy added to all sensitive fields (birthday, gender, weight)
- "Only visible to you" privacy note on weight field

---

## Related Documents

- `/docs/product/FEATURES.md` - Update Section 1
- `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` - Belt psychology
- `/docs/personas/PERSONA_PROFILES.md` - Test personas
- `/prototype/src/components/features/Onboarding.tsx` - Implementation

---

*Last updated: January 25, 2026*
