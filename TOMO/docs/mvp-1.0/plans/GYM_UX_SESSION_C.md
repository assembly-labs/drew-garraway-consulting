# Session C: ProfileScreen Cleanup + Gym History Enhancement — Implementation Plan

**Date:** 2026-03-26
**Status:** Ready to build (after Session B)
**Depends on:** Session A (drop-in removed from GymCard) + Session B (drop-in moved to logger)

---

## Goal

Clean up the ProfileScreen now that drop-in logging has moved to the session logger. Enhance GymHistoryList to show session counts per gym. Remove dead code.

---

## Changes

### 1. Remove DropInSheet from ProfileScreen

Session B moved the drop-in flow to the session logger. The `DropInSheet` component definition and all references in ProfileScreen are now dead code.

**Remove:**
- `DropInSheet` function component (~25 lines)
- `editSheet === 'dropin'` render block
- `setEditSheet('dropin')` references (GymCard's `onLogDropIn` prop is already gone from Session A)

### 2. GymHistoryList — Add Session Counts

Currently each gym entry shows name, location, and date range. Add a session count per gym to make history feel earned.

**Before:**
```
  Alliance HQ
  Atlanta, GA
  Jan 2024 – Sep 2025
```

**After:**
```
  Alliance HQ                    124
  Atlanta, GA
  Jan 2024 – Sep 2025
```

The count is right-aligned on the name row, small and gray — it's supplementary, not the headline.

### 3. GymHistoryList — Show Expanded Drop-In Details

Currently drop-ins show as a collapsed count: "2 drop-in visits". Expand to show the gym name and date for each:

```
  Drop-in visits (3)
  ─────────────────
  Renzo Gracie NYC · Mar 15, 2026
  AOJ · Jan 8, 2026
  Atos HQ · Dec 20, 2025
```

Each row is tappable to add notes (same as home gyms).

---

## Files to Modify

| File | Change |
|------|--------|
| `src/screens/ProfileScreen.tsx` | Remove DropInSheet component + render block + dead references |
| `src/components/GymHistoryList.tsx` | Add session count per gym, expand drop-in details |
| `src/components/GymHistoryList.tsx` (props) | Add `sessionCounts: Record<string, number>` prop |
| `src/services/userGymService.ts` | Add `getSessionCountsByGym()` — returns counts for all user_gyms in one query |
| `src/screens/ProfileScreen.tsx` | Fetch session counts, pass to GymHistoryList |

---

## New Service Method

```typescript
// userGymService.ts
async getSessionCountsByGym(): Promise<Record<string, number>> {
  // Single query: group sessions by user_gym_id, count each
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data, error } = await supabase
    .from('sessions')
    .select('user_gym_id')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .not('user_gym_id', 'is', null);

  if (error || !data) return {};

  // Count in JS (Supabase JS client doesn't support GROUP BY)
  const counts: Record<string, number> = {};
  for (const row of data) {
    if (row.user_gym_id) {
      counts[row.user_gym_id] = (counts[row.user_gym_id] ?? 0) + 1;
    }
  }
  return counts;
}
```

---

## GymHistoryList Props Change

```typescript
interface GymHistoryListProps {
  gyms: UserGym[];
  sessionCounts: Record<string, number>;  // NEW — keyed by user_gym.id
  onEditNotes: (gym: UserGym) => void;
}
```

---

## Edge Cases

- **No sessions at any gym:** Counts all 0, don't show "0" — just omit the number
- **Sessions without user_gym_id (pre-migration):** Not counted — acceptable
- **Many drop-ins (10+):** Show first 5 with "Show all" expand link
- **Drop-in with 0 sessions:** Possible if drop-in was logged but no session saved. Still show it (it's part of history).

---

## What This Does NOT Touch

- GymCard.tsx (Session A)
- SessionLoggerScreen (Session B)
- No migration needed
- No new tables

---

## Dead Code Removed

- `DropInSheet` component (~25 lines)
- `editSheet === 'dropin'` conditional render (~15 lines)
- Any `onLogDropIn` references that survived Session A
