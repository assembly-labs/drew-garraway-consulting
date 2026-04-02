# FEAT-009: Post-Save Quote Screen -- Design + Implementation

**Date:** 2026-03-31
**Ship tonight:** Yes
**Quote library:** 135 quotes, 48 people, 26 from women athletes (19.3%)

---

## The Feature

After a session is saved, a full-screen quote appears for 4 seconds before auto-navigating to the Journal tab. The quote is from a real martial arts figure, attributed, and selected based on the user's belt level and gender.

---

## Screen Design

```
[Full screen, colors.black (#111111) background]

                    [vertical center]

    "Suffer now and live the rest of
     your life as a champion."

              Muhammad Ali


                    [bottom, 32px from bottom]
                    [ thin progress line ]
```

### Typography
- Quote text: Inter 17px 500wt, colors.gray300 (#d4d4d4), centered, lineHeight 28
- Attribution: JetBrains Mono 12px 600wt, colors.gray500 (#a3a3a3), centered, 12px below quote
- No dash before the name. Just the name.

### Layout
- SafeAreaView, flex 1, justifyContent center, alignItems center
- Quote container: paddingHorizontal 40 (generous margins for readability)
- Attribution: marginTop 12
- No header, no tab bar, no navigation elements visible. Full immersion.

### Progress Indicator
- Thin line at bottom of screen (width of screen - 80px padding, 2px height)
- Starts at 0% width, animates to 100% over 4 seconds
- Color: colors.gold (#F5A623) at 30% opacity
- Position: 32px from bottom of safe area
- Gives the user a subtle sense of time passing without being a countdown

### Transitions
- Appears instantly after the "Session logged." success confirmation (replaces the current success phase auto-dismiss)
- After 4 seconds OR tap anywhere: fade out (200ms Animated.timing, opacity 1 to 0)
- Then navigate to JournalTab

### Interaction
- Tap anywhere on screen dismisses immediately (fade out + navigate)
- No visible button, no "skip" text, no "X"
- The entire screen is one Pressable

---

## Quote Selection Logic

```typescript
function selectQuote(
  belt: BeltLevel,        // from user profile
  gender: string | null,  // from user profile (FEAT-008)
  recentIds: string[],    // last 5 shown quote IDs, stored in AsyncStorage
): Quote
```

### Selection rules (in order):

1. **Belt filter:** Get all quotes where `belt === userBelt` OR `belt === 'global'`
2. **Exclude recent:** Remove any quote whose ID is in `recentIds` (last 5)
3. **Gender weighting:** If user gender is "Female", 50% chance to pick from the `athleteGender === 'female'` subset of the filtered pool
4. **Random pick:** Random selection from remaining candidates
5. **Fallback:** If pool is empty after filters (shouldn't happen with 135 quotes), reset recentIds and pick any

### Recent tracking:
- Store `recentQuoteIds` in AsyncStorage as a JSON array
- After showing a quote, prepend its ID and cap at 5 entries
- This prevents seeing the same quote in consecutive sessions

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| User saves session, quote screen shows | Normal flow. 4 seconds, then Journal. |
| User taps immediately | Fade out + navigate to Journal. Minimum display: ~200ms (the fade). |
| User background the app during quote | Timer pauses. Resumes when app is foregrounded. OR just navigate to Journal on next focus. |
| App killed during quote screen | No issue. Session was already saved. Quote is cosmetic. |
| No matching quotes for belt | Fall back to global-only pool (38+ quotes). |
| AsyncStorage fails to read recentIds | Default to empty array. Random pick. No crash. |
| Very fast session saves (testing) | Each save shows a quote. recentIds prevents repeats for 5 sessions. |
| First session ever | Works normally. recentIds is empty. Any eligible quote. |
| User has no gender set (null) | Standard random selection, no gender weighting. |

---

## Integration Point

**File:** `tomo/src/screens/SessionLoggerScreen.tsx`

The current success phase flow:
1. Session saves successfully
2. Success phase shows "Session logged." with a checkmark
3. After ~2 seconds, auto-navigates to JournalTab via `resetAndGoBack()`

New flow:
1. Session saves successfully
2. Success phase shows "Session logged." with checkmark (keep as-is, same timing)
3. Instead of navigating to JournalTab, transition to the quote screen
4. Quote screen shows for 4 seconds
5. Then navigate to JournalTab

**Implementation approach:** Add a new phase to the session logger: `'quote'`. The phase flow becomes:
```
entry -> recording -> processing -> review -> success -> quote -> (navigate to Journal)
```

OR: Build the quote screen as a standalone component rendered inside the success phase after the checkmark fades. This avoids adding a new phase to the state machine.

**Recommended:** Standalone component approach. Less invasive to the existing 5-phase architecture. The success phase simply renders `<PostSaveQuote />` after the "Session logged." text, and PostSaveQuote handles its own 4-second timer and navigation.

---

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `tomo/src/components/PostSaveQuote.tsx` | The quote screen component |

### Modified Files

| File | Change |
|------|--------|
| `tomo/src/screens/SessionLoggerScreen.tsx` | Render PostSaveQuote in success phase after confirmation |
| `tomo/src/data/quotes.ts` | Already built (135 quotes + selection helpers) |

### PostSaveQuote Component

```typescript
interface PostSaveQuoteProps {
  belt: BeltLevel;
  gender: string | null;
  onComplete: () => void;  // Called when quote screen is done (navigate to Journal)
}
```

**Internal state:**
- `quote`: the selected Quote object
- `fadeAnim`: Animated.Value for fade out
- `progressAnim`: Animated.Value for the bottom progress line (0 to 1 over 4 seconds)

**Lifecycle:**
1. On mount: select quote via `getRandomQuote(belt, recentIds, gender)`
2. Start 4-second timer + progress animation
3. On timer complete OR tap: trigger fade out (200ms)
4. On fade complete: save quote ID to recentIds in AsyncStorage, call `onComplete()`

---

## Build Steps (Tonight)

- [ ] **1. PostSaveQuote component** (30 min)
  - New file `tomo/src/components/PostSaveQuote.tsx`
  - Full screen, centered quote + attribution
  - 4-second timer with gold progress line animation
  - Tap to dismiss (Pressable wrapping entire screen)
  - Fade out transition (200ms)
  - AsyncStorage for recentIds tracking
  - Gender-aware quote selection

- [ ] **2. Wire into SessionLoggerScreen** (15 min)
  - Import PostSaveQuote
  - In the success phase, after "Session logged." shows:
    - Add a short delay (1 second for the checkmark to register)
    - Then render PostSaveQuote full-screen over the success phase
    - PostSaveQuote's `onComplete` calls the existing `resetAndGoBack()`
  - Pass belt and gender from user profile

- [ ] **3. TypeScript check** (5 min)
  - `npx tsc --noEmit` passes

- [ ] **4. Local device test** (15 min)
  - Log a session via voice
  - See "Session logged." confirmation
  - Quote screen appears with attribution
  - Progress line animates
  - Tap to dismiss works
  - Auto-dismiss after 4 seconds works
  - Lands on Journal tab
  - Log another session -- different quote appears
  - Verify quote is belt-appropriate
  - Verify female user sees more female athlete quotes

- [ ] **5. TestFlight build** (20 min)
  - `bash build.sh`

**Total estimated time: ~1.5 hours**

---

## What This Does NOT Include

- Topic-aware selection (sparring quotes after sparring sessions) -- future enhancement
- Sentiment-aware selection (resilience quotes after negative sessions) -- future enhancement
- Favorite/save a quote -- future enhancement
- Share a quote -- future enhancement
- Quote history screen -- future enhancement
