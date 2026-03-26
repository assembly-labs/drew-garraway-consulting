# Session A: GymCard Redesign — Implementation Plan

**Date:** 2026-03-26
**Status:** Ready to build
**Depends on:** Nothing (standalone)
**Blocked by:** Nothing

---

## Goal

Transform the gym card from a functional settings row into an emotional "this is my gym" moment. Remove the drop-in button (moves to Session B). Add session count and affiliation badge.

---

## Before / After

**Before:**
```
┌─────────────────────────────────────┐
│  📍 Alliance HQ                     │
│  Atlanta, GA · Gracie Barra         │
│  Training here 14 months            │
│                                     │
│  [Change Home Gym]  [Log a Drop-In] │
└─────────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────┐
│                                     │
│  Alliance HQ                    ✎   │
│  Atlanta, GA                        │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │ ALLIANCE │  │ 47 sessions      │ │
│  │          │  │ Training 14 mo   │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## Design Decisions

- **Gym name is larger** — Inter-Bold 19px. This is identity, not a label.
- **Edit icon replaces "Change Home Gym" button** — small pencil top-right. Tapping the card header opens ChangeGymSheet. Less noise, same function.
- **Affiliation badge** — if gym has affiliation (Alliance, Gracie Barra, 10th Planet, etc.), show as a small pill in JetBrains Mono uppercase. If none, hide entirely.
- **Session count** — "47 sessions" next to duration. Makes the gym feel earned. Query: count sessions where user_gym_id = this gym.
- **Drop-in button removed** — moves to session logger in Session B.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/GymCard.tsx` | Rewrite layout, remove drop-in button, add affiliation badge + session count |
| `src/components/GymCard.tsx` (props) | Remove `onLogDropIn`, add `sessionCount: number` |
| `src/screens/ProfileScreen.tsx` | Remove `onLogDropIn` prop, fetch session count for primary gym, pass to GymCard |
| `src/services/userGymService.ts` | Add `getSessionCount(userGymId)` method |

---

## New Service Method

```typescript
// userGymService.ts
async getSessionCount(userGymId: string): Promise<number> {
  const { count, error } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_gym_id', userGymId)
    .is('deleted_at', null);
  return count ?? 0;
}
```

---

## ProfileScreen Changes

- Remove `onLogDropIn` prop from `<GymCard>`
- Add `gymSessionCount` state variable (default 0)
- In `loadGymHistory`, after getting primary gym, call `getSessionCount(primary.id)`
- Pass `sessionCount={gymSessionCount}` to `<GymCard>`
- Do NOT remove DropInSheet component definition yet (Session C cleans that up)

---

## Edge Cases

- **0 sessions:** Show "No sessions yet" instead of "0 sessions"
- **No affiliation:** Hide badge entirely
- **No primary gym / null fallback:** Same as today — fallback gym name, no badge, no count
- **New user just onboarded:** Count = 0, duration = "Started this month"

---

## Does NOT Touch

- SessionLoggerScreen (Session B)
- GymHistoryList (Session C)
- DropInSheet component definition stays for now (Session C removes)
- No migration needed
