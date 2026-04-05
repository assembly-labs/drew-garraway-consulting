# TOMO System Architecture Review -- March 31, 2026

**Reviewer:** System Architect (Opus)
**Scope:** Full codebase -- services, hooks, screens, types, edge functions, migrations, config

---

## Critical (fix before next TestFlight)

### C-1: Memory Leak -- Audio Upload Triples File in Memory
**File:** `supabase.ts:351-363`
Audio upload reads file to base64, then decodes to Uint8Array. File exists 3x in memory (disk + base64 + Uint8Array). Peak ~4x file size. OOM risk on longer recordings or low-memory devices.
**Fix:** Add size guard. Long-term, use `expo-file-system` `uploadAsync` which streams directly.

### C-2: Race Condition -- Gym Changeover Not Atomic
**File:** `userGymService.ts:70-88`
Changing primary gym unsets old, then inserts new in two separate network calls. App crash between them = zero primary gyms.
**Fix:** Wrap in Supabase RPC (server-side transaction) or add recovery block.

### C-3: Offline Queue -- File URI May Be Stale on Retry
**File:** `offline-queue.ts:74-81`
Stores file path for later retry but never validates file still exists. iOS can purge files. Item retries forever with a missing file.
**Fix:** Check `FileSystem.getInfoAsync()` before retry. If gone, remove from queue, mark session as failed.

### C-4: Sessions RLS -- Soft-Delete Inconsistency
**File:** `rls_policies.sql:40`
SELECT policy filters `deleted_at IS NULL` but UPDATE policy doesn't. Offline queue can update soft-deleted sessions the user can't see.
**Fix:** Add `deleted_at IS NULL` to UPDATE policy too, or remove from SELECT and filter client-side.

---

## High Priority (fix this week)

### H-1: 30 `getUser()` Calls Per Session Save
Every service method calls `supabase.auth.getUser()` (network call). One session save = 6 auth round-trips (300-1200ms overhead).
**Fix:** Cache user ID from `onAuthStateChange` in a shared module. Service methods use cached ID.

### H-2: `sessionInsert: any` Type Escape
**File:** `SessionLoggerScreen.tsx:435`
Core data write bypasses TypeScript. Field typos would silently drop data.
**Fix:** Type as `SessionInsert`.

### H-3: No 401 Retry for Insight Edge Functions
**File:** `insights-service.ts:207-273`
Insight generation doesn't call `ensureFreshToken()` or retry on 401. Token expiry bug will hit insight generation.
**Fix:** Add `ensureFreshToken()` and 401 retry pattern matching the session pipeline.

### H-4: `navigation as any` Casts
**File:** `SessionLoggerScreen.tsx:566, 594`
Cross-tab navigation uses `as any`, losing type safety. Route renames would crash at runtime.
**Fix:** Use `CompositeNavigationProp` type.

### H-5: Duplicate Reset Logic (22 setState calls x2)
**File:** `SessionLoggerScreen.tsx:216-243, 533-562`
Full state reset duplicated in two places. Adding a state variable requires updating both.
**Fix:** Extract `fullReset()` function.

### H-6: Journal Loads ALL Sessions on Every Focus
**File:** `JournalScreen.tsx:89-97`
No pagination. At 1,000 sessions, app freezes.
**Fix:** Add `.limit(50).range()` pagination. Only re-fetch if stale.

---

## Medium Priority (fix this month)

### M-1: Insights Engine -- 893 Lines, Zero Tests
Pure functions driving AI prompt construction with no tests. Week boundary bugs would affect every user.
**Fix:** Unit tests for `getWeekBounds`, `filterSessions`, `computeTechniqueFrequency`, `calculateStreak`, `calculateAdherence`.

### M-2: SessionLoggerScreen -- 2,051 Lines
One file contains 5 phases, all handlers, all styles. Changes to one phase risk breaking another.
**Fix:** Extract each phase into its own component.

### M-3: `BeltLevel` Type Defined in Two Places
`mvp-types.ts` and `quotes.ts` define different `BeltLevel` types that will conflict.
**Fix:** Rename quotes version to `QuoteBeltGroup`.

### M-4: Missing `sessions(user_id, date)` Index
No composite index for the most common query pattern. Sequential scan at scale.
**Fix:** `CREATE INDEX idx_sessions_user_date ON sessions(user_id, date DESC);`

### M-5: InsightsScreen Uses ScrollView for Older Weeks
All weekly insights render into DOM regardless of visibility. 52+ per year.
**Fix:** Use `FlatList` or `SectionList` for older weeks.

### M-6: CORS Wildcard on All Edge Functions
`Access-Control-Allow-Origin: *` on JWT-protected functions.
**Fix:** Restrict to Supabase project URL or document rationale.

### M-7: `user_context` RLS Blocks Client Writes
Only SELECT policy for authenticated users. `userContextService.upsert()` will silently fail.
**Fix:** Add INSERT/UPDATE RLS policy or route through edge function.

---

## Low Priority (backlog)

- L-1: Mixed `console.error` and `logger` usage (58 instances)
- L-2: Avatar signed URL 1-hour TTL with no refresh
- L-3: No expiry on offline queue items (retry forever)
- L-4: Missing `updated_at` trigger on profiles/sessions tables
- L-5: Duplicate "BELT COLOR HELPER" comment in design-tokens.ts
- L-6: Typography tokens only has `body` preset, missing headline/label/hero

---

## Scalability

| Users | What breaks |
|-------|------------|
| 100 | Nothing |
| 1,000 | Journal pagination (H-6), autocomplete query, audio storage costs ~$10/mo |
| 10,000 | 30x getUser calls (H-1), missing index (M-4), AssemblyAI ~$600/mo |

**Cost at 1,000 users (4 sessions/week):** ~$100-110/month (Supabase $25, AssemblyAI $60, Anthropic $9, Storage $10)

---

## What's Strong (preserve these)

1. **Service layer separation** -- supabase.ts / insights-service.ts / insights-engine.ts split is clean
2. **Token refresh strategy** -- ensureFreshToken() with debounce + 401 retry is battle-tested
3. **Offline-first design** -- AsyncStorage queue with connectivity retry
4. **RLS coverage** -- all tables have ownership filters, audio path validation in edge functions
5. **Edge function auth** -- JWT verification, API keys server-side only
6. **Voice recorder safeguards** -- three ref-based guards prevent double-stop/double-pipeline/double-save
7. **Auth state machine** -- four states, cached onboarding flag, no route flickering
8. **Soft delete pattern** -- consistent `deleted_at` usage across all session queries
9. **Error boundary** -- Sentry integration with dev-mode error details
10. **Insights type system** -- tiered model with distinct I/O types per tier
