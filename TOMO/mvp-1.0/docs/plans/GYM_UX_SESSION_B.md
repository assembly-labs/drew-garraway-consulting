# Session B: Session Logger Gym Chip — Implementation Plan

**Date:** 2026-03-26
**Status:** Ready to build (after Session A)
**Depends on:** Session A (drop-in button removed from GymCard)

---

## Goal

Surface the user's current gym in the session logger so they always know which gym a session is being tagged to. Make it tappable to override for drop-ins. This is where the drop-in flow lives now (moved from ProfileScreen).

---

## Design

### Entry Phase (text preference users)

The gym chip sits below the "Log Your Training" title, before the training mode chips:

```
  Log Your Training

  ┌──────────────────────────────┐
  │  📍 Alliance HQ          ✕  │
  └──────────────────────────────┘

  TRAINING MODE
  [Gi]  [No-Gi]  [Other]
  ...
```

- Gray pill with MapPin icon and gym name
- Tap the pill → opens a bottom sheet gym picker (reuses GymSearchInput)
- Selecting a different gym changes the chip text and overrides `user_gym_id` for THIS session only
- The "✕" resets back to home gym (only visible when overridden)
- If no gym is set, chip shows "Add your gym" in gray — tap opens picker

### Recording Phase (voice preference users)

Minimal — just the gym name as a small label above the recording timer:

```
        📍 Alliance HQ

        [  🎤  ]
        02:34
        Describe your session...

        [Stop Recording]
```

- Not tappable during recording (don't interrupt the flow)
- Gray text, small (13px), just contextual awareness

### Review Phase

Same chip as Entry Phase, shown at the top of the review form:

```
  Review Your Session

  ┌──────────────────────────────┐
  │  📍 Alliance HQ          ✕  │
  └──────────────────────────────┘

  TRAINING MODE
  [Gi]  [No-Gi]
  ...
```

- Still tappable — user can change gym even at review time
- This is the last chance to fix it before save

### Processing / Success Phases

- No gym chip shown (processing is a loading state, success auto-dismisses)

---

## State Management

### In the main `SessionLoggerScreen` component:

```typescript
// Gym override state (null = use primary gym, set = override for this session)
const [gymOverride, setGymOverride] = useState<SelectedGym | null>(null);
const [showGymPicker, setShowGymPicker] = useState(false);

// The gym ID that will be saved with the session
const effectiveGymId = gymOverride
  ? null  // Drop-in gym — we need to create a user_gyms entry first
  : primaryGymIdRef.current;

// The gym name shown in the chip
const effectiveGymName = gymOverride?.name
  ?? primaryGymName  // new: store primary gym name alongside ID
  ?? profile?.gym_name
  ?? null;
```

### On save (handleSave):

```typescript
// If gym was overridden, create a drop-in entry in user_gyms first
let saveGymId = primaryGymIdRef.current;
if (gymOverride) {
  const dropIn = await userGymService.addDropIn(gymOverride);
  saveGymId = dropIn?.id ?? null;
}

const sessionInsert = {
  ...existingFields,
  user_gym_id: saveGymId,
};
```

This means drop-in entries are created at session save time, not ahead of time. Clean — the drop-in only exists if a session was actually logged there.

---

## New Component: `GymChip`

Small, reusable component used in EntryPhase and ReviewPhase:

```typescript
interface GymChipProps {
  gymName: string | null;
  isOverridden: boolean;
  onPress: () => void;
  onReset: () => void;  // clear override back to home gym
}
```

- Renders as a pressable pill
- Shows MapPin icon + gym name
- When `isOverridden`, shows a small "✕" to the right and uses a subtle gold border
- When not overridden, gray border, gray text — just context

---

## New Component: `GymPickerSheet`

Bottom sheet modal wrapping GymSearchInput:

```typescript
interface GymPickerSheetProps {
  visible: boolean;
  onSelect: (gym: SelectedGym) => void;
  onClose: () => void;
}
```

- Title: "Training somewhere else today?"
- Subtitle: "Your home gym won't change."
- Uses existing `GymSearchInput` with autoFocus
- On select: calls `onSelect(gym)`, closes sheet

This is essentially the same as `DropInSheet` from ProfileScreen but recontextualized for the session logger. Session C will remove the old one.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/GymChip.tsx` | **NEW** — small pressable gym pill component |
| `src/components/GymPickerSheet.tsx` | **NEW** — bottom sheet gym picker for session override |
| `src/screens/SessionLoggerScreen.tsx` | Add gym state, pass GymChip to Entry/Review/Recording phases, handle override in handleSave |
| `src/services/userGymService.ts` | No changes (addDropIn already exists) |

---

## Props Threading

The gym chip needs to be passed into each phase component:

### EntryPhase
```typescript
function EntryPhase({
  entry, setEntry, onRecord, onTextOnly,
  gymName, isGymOverridden, onGymPress, onGymReset,  // NEW
}: { ... })
```

### RecordingPhase
```typescript
function RecordingPhase({
  duration, pulseAnim, onStop,
  gymName,  // NEW — display only, not tappable
}: { ... })
```

### ReviewPhase
```typescript
function ReviewPhase({
  review, setReview, transcript, saving, onSave, onCancel,
  gymName, isGymOverridden, onGymPress, onGymReset,  // NEW
}: { ... })
```

---

## Edge Cases

- **No gym set at all:** Chip shows "Add your gym" — tapping opens picker, selection sets override for this session AND creates the drop-in entry (or we could prompt them to set a home gym — but that's scope creep, keep it simple)
- **User changes gym in picker then changes back:** Reset clears override, back to home gym
- **Voice flow auto-skips entry:** Recording phase shows gym name read-only. User can change in review phase after pipeline completes.
- **Offline:** GymSearchInput falls back to local gyms.ts — works fine

---

## What This Does NOT Touch

- GymCard.tsx (Session A handles that)
- GymHistoryList.tsx (Session C)
- ProfileScreen DropInSheet (Session C removes it)
- No migration needed
- No new Supabase queries beyond existing `addDropIn`

---

## Interaction Summary

| Phase | Gym Visible? | Tappable? | Can Override? |
|-------|-------------|-----------|---------------|
| Entry | Yes (chip) | Yes | Yes |
| Recording | Yes (label) | No | No |
| Processing | No | — | — |
| Review | Yes (chip) | Yes | Yes |
| Success | No | — | — |
