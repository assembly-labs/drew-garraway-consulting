# TOMO Session 13 — Pickup Prompt

**Date:** 2026-03-13
**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/tomo/`

> **Tell Claude:** "Read `docs/mvp-1.0/SESSION_13_PROMPT.md` then start working through the next steps."

---

## Current Status (end of Session 12, Mar 12)

- Voice pipeline works end-to-end on device (record → transcribe → extract → review → save)
- Data model updated to **v1.1** — added `warmed_up` + `instructor`, removed `energy_level`/`mood`/`worked_well`/`struggles`
- Review screen fully reordered to match your priority list
- All 7 UI rendering gaps from the UX audit are fixed
- TypeScript clean (0 errors), device build succeeded
- **Code is ready. Backend needs to catch up.**

---

## Step-by-Step: What to Do Next

### Step 1: Run the v2 Migration on Supabase (5 min)
The database still has the old columns. Run this migration to match the new code:

**File:** `mobile-prep/migration-v2-schema.sql`

What it does:
- Adds `warmed_up BOOLEAN` and `instructor TEXT` columns
- Drops `energy_level`, `mood`, `worked_well`, `struggles`
- Updates `training_mode` CHECK constraint (removes 'mixed'/'unknown')
- Sets default `schema_version` to 2

**How:** Go to Supabase dashboard → SQL Editor → paste the file contents → run. Or use CLI:
```bash
# From tomo/ directory
npx supabase db push  # if using migrations
# OR paste migration-v2-schema.sql into Supabase SQL Editor
```

### Step 2: Redeploy the Extraction Edge Function (2 min)
The extraction function has been updated with warmedUp + instructor in the prompt and SCHEMA_VERSION=2, but it hasn't been deployed yet.

```bash
cd /Users/drewgarraway/drew-garraway-consulting/TOMO/tomo
npx supabase functions deploy extract-session --no-verify-jwt
```

### Step 3: Test Extraction Quality on Device (45-60 min)
This is the big one. Record 5-6 test sessions with varied content and check if the AI gets it right.

Full test scenarios are in `docs/mvp-1.0/TESTING_AND_REFINEMENT_STRATEGY.md` Part 2.

Quick version — record these on device:

| # | Say This | Check These Fields |
|---|----------|--------------------|
| 1 | Simple gi class, 60 min, coach taught collar chokes, 3 rounds | mode=gi, kind=class, duration=60, techniques, sparringRounds=3 |
| 2 | No-gi open mat, 90 min, hit a guillotine, got caught in a darce | mode=nogi, kind=open_mat, subsGiven, subsReceived |
| 3 | Just drilled for an hour, single legs and knee slice, no rolling, warmed up first | kind=drilling, didSpar=false, warmedUp=true |
| 4 | Rough gi class, 90 min, elbow sore from armbar | injuries, subsReceived |
| 5 | "Good class today. Hour. Guard stuff." | Should NOT hallucinate details |
| 6 | Skip entry, just record: "No-gi, two hours, Professor Mike, leg locks, positional sparring" | instructor=Mike, all fields from AI only |

**If extraction is bad:** check transcript first (is AssemblyAI mangling audio?), then iterate the prompt.

### Step 4: Check Apple Developer Account
Was expected Mar 12. If activated:
- EAS init + build config
- Apple Sign-In setup
- App Store Connect listing
- TestFlight submission

If still blocked, skip to Step 5.

### Step 5: P2 Fixes (if time)
- **P2-008:** Add storage DELETE RLS policy to Supabase
- **P2-010:** Wire offline queue into pipeline error path
- Remove `any` casts on `sessionInsert` and `profileService.update`

---

## Files Changed in Session 12 (for reference)

| File | What Changed |
|------|-------------|
| `src/types/mvp-types.ts` | Added warmed_up, instructor. Removed 4 deferred fields. |
| `src/screens/SessionLoggerScreen.tsx` | Review UI reordered, instructor input, spar toggle, session type selector |
| `src/screens/SessionDetailScreen.tsx` | Instructor + warm-up sections, edit sheets, removed energy/mood |
| `src/services/offline-queue.ts` | Field mapping updated |
| `src/utils/journal-helpers.ts` | Removed deferred field references |
| `supabase/functions/extract-session/index.ts` | SCHEMA_VERSION=2, prompt updated |
| `mobile-prep/migration-v2-schema.sql` | NEW — v2 migration |
| `docs/mvp-1.0/FEATURE_SPEC.md` | PRD updated to v1.1 |
| `docs/data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` | Updated for v1.1 fields |
| `docs/data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` | Updated for v1.1 fields |
| `docs/mvp-1.0/TESTING_AND_REFINEMENT_STRATEGY.md` | Phase A marked done, tests updated |
| `docs/mvp-1.0/tracking/CHANGELOG.md` | Session 12 entry |
| `docs/mvp-1.0/tracking/ISSUES.md` | DEPLOY-001, MIGRATE-001 added |

---

## Open Issues

| ID | Priority | Status | Description |
|----|----------|--------|-------------|
| DEPLOY-001 | P1 | Open | Redeploy extract-session edge function with v2 prompt |
| MIGRATE-001 | P1 | Open | Run migration-v2-schema.sql on Supabase |
| BLOCK-002 | P0 | Pending | Apple Developer account |
| P2-008 | P2 | Open | No storage DELETE RLS policy |
| P2-010 | P2 | Open | Offline queue not wired into pipeline error path |
| LAUNCH-001 | P1 | Open | Re-enable email confirmation before launch |
| BUG-002 | P3 | Open | sentry.properties regenerated on prebuild |

---

## Key Commands

```bash
# Build to device
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E

# Build to device (Metro already running)
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E --no-bundler

# TypeScript check
npx tsc --noEmit

# Deploy edge functions
npx supabase functions deploy transcribe-audio --no-verify-jwt
npx supabase functions deploy extract-session --no-verify-jwt

# Start Metro (if not running)
npx expo start --port 8081
```

---

## Deep Dive Docs (if needed)

| Doc | What's In It |
|-----|-------------|
| `docs/mvp-1.0/TESTING_AND_REFINEMENT_STRATEGY.md` | Full test plan: 6 extraction scenarios, 6 E2E flows, pre-TestFlight checklist |
| `docs/mvp-1.0/FEATURE_SPEC.md` | PRD v1.1 — full field spec, extraction schema, review screen layout |
| `docs/mvp-1.0/tracking/CHANGELOG.md` | What changed each session |
| `docs/mvp-1.0/tracking/ISSUES.md` | All open bugs and tasks |
