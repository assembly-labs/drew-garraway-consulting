# Gym Picker Redesign — Interaction Spec

**Date:** 2026-03-22
**Status:** Draft — needs Drew's approval before implementation
**Checklist Item:** Onboarding UX Enhancement #9 (Tier 2, elevated to active)

---

## Problem Statement

The current gym picker opens a full-screen modal with search, 120 static results, and a custom entry sub-form. Most users will never find their gym in the database — they'll hit "My gym isn't listed" and fill out 3 fields manually. That's 7 interactions for what should be 1.

---

## Design Goals

1. Gym selection should feel like typing a text message, not operating a search engine
2. Location permission should feel like a helpful shortcut, not a data grab
3. The gym database should be invisible infrastructure — users don't know it exists
4. Zero modals. Everything happens inline on the onboarding screen.
5. Every path (location granted, denied, skipped) should feel equally good

---

## User Flows

### Flow Overview

```
User reaches "YOUR GYM" section
         │
         ▼
┌─────────────────────┐
│  Location Soft Ask   │  "Find gyms near you"
│  [Enable] / [Skip]  │
└────────┬────────────┘
         │
    ┌────┴─────┐
    ▼          ▼
 GRANTED    SKIPPED/DENIED
    │          │
    ▼          ▼
 Nearby     Text input
 gym cards   with autocomplete
 + text      from static DB
 input
    │          │
    ▼          ▼
 Tap card    Type gym name
 OR type     (autocomplete or
 custom      freeform)
    │          │
    └────┬─────┘
         ▼
   Gym selected ✓
   Continue enabled
```

---

## State-by-State Spec

### State 1: Location Soft Ask (Initial)

**What the user sees:**

```
YOUR GYM

┌─────────────────────────────────────┐
│                                     │
│   📍  Find gyms near you            │
│                                     │
│   We'll show nearby BJJ gyms so     │
│   you can pick yours in one tap.    │
│                                     │
│   ┌───────────────────────────┐     │
│   │     Enable Location       │     │
│   └───────────────────────────┘     │
│                                     │
│   I'll type it myself               │
│                                     │
└─────────────────────────────────────┘
```

**Visual specs:**
- Card: `gray800` background, `gray700` border, `radius.xl` corners, `spacing.lg` padding
- Location pin: Use existing `Icons.MapPin` (or add one), 24px, `colors.gold`
- Headline: Inter-SemiBold, 17px, `colors.white`
- Description: Inter, 14px, `colors.gray400`, line-height 20
- "Enable Location" button: `colors.gold` background, Inter-Bold, 15px, `colors.black` text, full-width within card padding, `radius.xl`, 48px height
- "I'll type it myself": Inter, 14px, `colors.gray500`, centered below card, `spacing.md` top margin, tappable (44px touch target via padding)

**Interactions:**
- "Enable Location" → `haptics.medium()` → triggers iOS location permission dialog
  - If granted → transition to State 2a
  - If denied → transition to State 2b
- "I'll type it myself" → `haptics.light()` → transition to State 2b
- Card has no pressed state (children handle their own)

**Notes:**
- This is a **pre-permission primer**. It explains the value before iOS fires the system dialog.
- The system dialog text should be configured in `app.config.ts`:
  `NSLocationWhenInUseUsageDescription: "TOMO uses your location to find BJJ gyms near you."`
- We only request "When In Use" — not "Always". Background tracking is a future feature.

---

### State 2a: Location Granted — Nearby Gyms

**What the user sees:**

```
YOUR GYM

  NEAR YOU
  ┌─────────────────────────────────┐
  │  10th Planet Philadelphia    ✓  │
  │  Philadelphia, PA · 0.3 mi     │
  ├─────────────────────────────────┤
  │  Renzo Gracie Philly            │
  │  Philadelphia, PA · 1.1 mi     │
  ├─────────────────────────────────┤
  │  Balance Studios                │
  │  Philadelphia, PA · 2.4 mi     │
  └─────────────────────────────────┘

  Not here? Type your gym name
  ┌─────────────────────────────┐
  │  Search or add your gym      │
  └─────────────────────────────┘
```

**Visual specs:**
- "NEAR YOU" label: Same as field labels (JetBrains Mono-SemiBold, 12px, `colors.gray500`, 2px letter-spacing)
- Gym cards: `gray800` background, `gray700` border between items (not around), `radius.lg` corners on container
- Gym name: Inter-SemiBold, 16px, `colors.white`
- Gym meta (city, state, distance): Inter, 13px, `colors.gray500`
- Selected state: `goldDim` background, gold left border (3px), checkmark icon (18px, `colors.gold`) on right
- Unselected: standard `gray800`, no checkmark
- "Not here?" text: Inter, 13px, `colors.gray500`, `spacing.md` top margin
- Text input: Same styling as name input on About You screen (gray800 bg, gray700 border, Inter 17px)

**Data source:**
- Query Supabase `gyms` table: nearest 5 gyms within 25 miles of user coordinates
- Sort by distance ascending
- Show distance rounded to 1 decimal (miles)
- If fewer than 2 results within 25 miles, expand radius to 50 miles
- If still 0 results, skip straight to State 2b (text input only) with message: "No gyms found nearby — type your gym name below"

**Interactions:**
- Tap a gym card → `haptics.light()` → card highlights with gold, gym is selected, Continue button enables
- Tap a different card → previous deselects, new one selects
- Tap the text input → keyboard opens, user can type (same behavior as State 2b)
- If user types in the text input, nearby gym selection clears (typing = they want something else)
- If user selects a nearby gym then taps text input, the nearby selection clears

**Transition from State 1:**
- The soft-ask card collapses upward (height animates to 0, ~300ms ease-out)
- Nearby gym list fades in below (opacity 0→1, ~200ms, 100ms delay after card collapse)
- Loading state: While fetching nearby gyms (should be <1s), show a subtle skeleton/pulse in the card area

**What gets stored when a nearby gym is selected:**
```typescript
{
  gymId: gym.id,           // from Supabase gyms table
  gymName: gym.name,
  gymIsCustom: false,
  gymCity: gym.city,
  gymState: gym.state,
  gymAffiliation: gym.affiliation,
  gymLat: gym.lat,         // NEW — for future geofencing
  gymLng: gym.lng,         // NEW
}
```

---

### State 2b: Location Skipped/Denied — Text Input with Autocomplete

**What the user sees:**

```
YOUR GYM

  ┌─────────────────────────────┐
  │  Search or add your gym      │
  └─────────────────────────────┘
```

After typing "grac":

```
YOUR GYM

  ┌─────────────────────────────┐
  │  grac                        │
  └─────────────────────────────┘

  ┌─────────────────────────────┐
  │  Gracie Barra Philadelphia   │
  │  Philadelphia, PA            │
  ├─────────────────────────────┤
  │  Gracie Barra Denver         │
  │  Denver, CO                  │
  ├─────────────────────────────┤
  │  Gracie University           │
  │  Torrance, CA                │
  └─────────────────────────────┘
```

After selecting or typing a custom name:

```
YOUR GYM

  ┌─────────────────────────────┐
  │  Gracie Barra Philadelphia ✓ │
  └─────────────────────────────┘
```

**Visual specs:**
- Text input: Same as all other text inputs in onboarding (gray800, gray700 border, Inter 17px, white text, gray600 placeholder)
- Autocomplete dropdown: Appears directly below the input, no gap. `gray800` background, `gray700` borders between items, `radius.lg` bottom corners (top corners blend with input). Max 4 results.
- Autocomplete items: Same styling as nearby gym cards (name in white, meta in gray500)
- When a gym is selected (from autocomplete or custom text entered): input shows the gym name with a subtle checkmark on the right side, text color stays white
- Input remains editable — tapping it again clears the selection and reopens for typing

**Autocomplete behavior:**
- Source: Supabase `gyms` table (full text search) with fallback to local `gyms.ts` if offline
- Trigger: After 2+ characters typed
- Debounce: 200ms after last keystroke
- Max results: 4
- Sort: If location was granted in a previous attempt, sort by distance. Otherwise sort by relevance (name match quality).
- If 0 results: No dropdown, no error. The typed text IS the gym name (custom gym).

**Custom gym handling:**
- If the user types a name that doesn't match any autocomplete result and moves on (taps Continue, or taps another field), treat the typed text as a custom gym name
- No extra fields (city, state) during onboarding — that's friction. We can ask later or infer from location.
- Custom gyms are stored with `gymIsCustom: true`

**What gets stored for autocomplete selection:**
```typescript
{
  gymId: gym.id,
  gymName: gym.name,
  gymIsCustom: false,
  gymCity: gym.city,
  gymState: gym.state,
  gymAffiliation: gym.affiliation,
  gymLat: gym.lat,
  gymLng: gym.lng,
}
```

**What gets stored for custom text entry:**
```typescript
{
  gymId: null,
  gymName: "My Local Gym",  // whatever they typed
  gymIsCustom: true,
  gymCity: null,             // infer later from location if available
  gymState: null,
  gymAffiliation: null,
  gymLat: null,
  gymLng: null,
}
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Location permission already granted from a previous app session | Skip State 1 entirely, go straight to State 2a |
| Location permission previously denied (system-level) | Skip State 1, go straight to State 2b. Don't ask again — iOS won't show the dialog twice. |
| Location takes >3 seconds to resolve | Show skeleton/loading for up to 5 seconds, then fall back to State 2b with the text input |
| Supabase query fails (offline, timeout) | Fall back to local `gyms.ts` autocomplete. No error shown to user. |
| User selects a nearby gym, then changes mind | Tapping the text input clears the nearby selection. Tapping a different gym card switches. |
| User types in text field, gets autocomplete match, selects it, then edits | Editing clears the selection, re-opens autocomplete |
| Gym name is very long | Truncate with ellipsis in the card. Full name stored in data. |
| User on iPad or large screen | Same layout, cards are full-width within padding. No special handling. |

---

## Schema Changes Required

### Supabase `profiles` table — add columns:

```sql
ALTER TABLE profiles ADD COLUMN gym_lat DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN gym_lng DOUBLE PRECISION;
ALTER TABLE profiles ADD COLUMN location_permission TEXT
  CHECK (location_permission IN ('granted', 'denied', 'skipped'))
  DEFAULT 'skipped';
```

### TypeScript types — update `Profile`:

```typescript
// Add to Profile interface
gym_lat: number | null;
gym_lng: number | null;
location_permission: 'granted' | 'denied' | 'skipped';
```

### OnboardingStackParamList — update GetStarted params:

```typescript
// Add to GetStarted params
gymLat?: number;
gymLng?: number;
locationPermission: 'granted' | 'denied' | 'skipped';
```

---

## New Dependencies

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `expo-location` | Get user coordinates | ~50KB (already in Expo SDK, just needs install) |

No other new packages. All animations use built-in `Animated` API.

---

## Files That Change

| File | Change |
|------|--------|
| `screens/onboarding/YourTrainingScreen.tsx` | Major rewrite of gym section. Remove Modal. Add location soft ask, nearby gyms, inline autocomplete. |
| `types/mvp-types.ts` | Add `gym_lat`, `gym_lng`, `location_permission` to Profile types |
| `navigation/OnboardingNavigator.tsx` | Add new params to `GetStarted` route |
| `screens/onboarding/GetStartedScreen.tsx` | Pass new gym fields through to profile save |
| `config/design-tokens.ts` | No changes expected — existing tokens cover all new UI |
| `data/gyms.ts` | Keep as offline fallback, no changes |
| `app.config.ts` | Add `NSLocationWhenInUseUsageDescription` |
| `services/profileService.ts` | Save new gym fields |

### New files:
| File | Purpose |
|------|--------|
| `services/gymService.ts` | Supabase gym query (nearby + text search) with local fallback |
| `hooks/useLocation.ts` | Wrapper around expo-location: permission check, request, get coordinates |

---

## What This Replaces

The entire gym picker Modal (lines 290-413 in current `YourTrainingScreen.tsx`) gets deleted. The `showGymPicker`, `gymSearch`, `showCustomGym`, `customGymName`, `customGymCity`, `customGymState` state variables all go away. Replaced by:

- `locationState`: 'asking' | 'loading' | 'granted' | 'denied' | 'skipped'
- `nearbyGyms`: Gym[] (from Supabase query)
- `selectedGym`: Gym | null
- `gymSearchText`: string
- `autocompleteResults`: Gym[]

Net effect: Less code, less state, fewer screens within screens.

---

## Open Questions for Drew

1. **Distance unit:** Miles or kilometers? (Assuming miles for US-first audience)
2. **Nearby radius:** 25 miles default — too wide? Too narrow?
3. **Should we store user's coordinates in the profile?** Useful for future features but more sensitive data. Current spec only stores gym coordinates.
4. **Offline first run:** If the user has no internet during onboarding, should the gym field be required at all? Could make it optional and prompt later.
