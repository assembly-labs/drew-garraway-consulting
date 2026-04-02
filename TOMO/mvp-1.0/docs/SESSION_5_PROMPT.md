# TOMO Session 5 — Pickup Prompt

## Project
TOMO MVP 1.0 — iOS TestFlight. BJJ voice-first training journal.

## Read these files first
1. `docs/mvp-1.0/tracking/ISSUES.md` — all open bugs and blockers
2. `docs/mvp-1.0/tracking/CHANGELOG.md` — Session 4 entry has full context
3. `tomo/src/services/supabase.ts` — the audio upload code (attempt 4)
4. `tomo/src/screens/SessionLoggerScreen.tsx` — the pipeline orchestration

## Where we left off

The voice pipeline has 4 steps: **Record → Upload → Transcribe → Extract**

- **Record:** Works on physical iPhone.
- **Upload:** Attempt 4 deployed but UNTESTED. Uses legacy `FileSystem.readAsStringAsync()` to read the recorded audio as base64, then `atob()` → `Uint8Array` → `ArrayBuffer` → Supabase Storage upload. Previous 3 attempts all failed on iOS (`fetch()`, `XMLHttpRequest`, `ExpoFile` class).
- **Transcribe:** Edge function redeployed with `speech_model: 'universal'` fix (AssemblyAI API changed). CORS headers added to all responses. Should work now but untested since upload still blocks it.
- **Extract:** Edge function redeployed with CORS fix, `max_tokens` bumped to 1024. Should work but untested.

**The pipeline fallback works** — when any step fails, app correctly falls through to manual review screen with a warning toast.

## What to do this session

### Priority 1: Get voice pipeline working end-to-end
1. Start Metro: `cd tomo && npx expo start`
2. Have Drew test the audio upload (record → stop → watch console logs)
3. Look for `[Audio] File info:`, `[Audio] Read base64`, `[Audio] Upload succeeded` logs
4. If upload fails: debug using the console logs, try alternative approaches
5. If upload works: transcription and extraction should follow automatically
6. If full pipeline works: celebrate, then test it 2-3 more times

### Priority 2: Fix P1 bugs (if pipeline works)
- **P1-004:** Make service methods throw on error instead of returning null
- **P1-005:** Fix session count on Profile (use `getCount()` or DB trigger)
- **P1-006:** Fix journal date grouping (append `T00:00:00` to date strings)

### Priority 3: Session CRUD testing
- Create a session via text path (skip voice)
- View it in Journal
- Edit fields in SessionDetail
- Delete it
- Log any bugs found

### Priority 4: Fix P2 bugs
- **P2-008:** Add storage DELETE RLS policy
- **P2-009:** Add null guards on array fields in SessionDetailScreen
- **P2-010:** Redesign offline queue (create session first, then retry pipeline)

## Key context
- Drew = vibe coder — explain step-by-step, keep it simple
- App is on Drew's physical iPhone (dev build, not TestFlight)
- Metro must be running on Mac (same WiFi as phone)
- Apple Developer account expected ~Mar 12 (blocks TestFlight, Apple Sign-In, EAS builds)
- Device build command: `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E`
- Edge functions are DEPLOYED and LIVE on Supabase project `whzycopfjvwmsgzfqvig`
- `npx tsc --noEmit` — 0 errors as of end of Session 4

## If upload attempt 4 fails

The base64 approach (`FileSystem.readAsStringAsync` → `atob` → `Uint8Array`) is the most reliable iOS file reading method. If it still fails, check:

1. Does `FileSystem.getInfoAsync(uri)` return `exists: true`? If not, the expo-audio temp file may be getting cleaned up before upload runs. Fix: copy file to a persistent location first.
2. Does `readAsStringAsync` succeed? If not, check the URI format — expo-audio may return a URI that the legacy FileSystem API can't read.
3. Does the Supabase upload succeed with the ArrayBuffer? If not, try wrapping in `new Blob([bytes], { type: 'audio/mp4' })`.
4. Nuclear option: Upload base64 string directly to a custom edge function that decodes server-side.

## Files changed in Session 4
- `tomo/supabase/functions/transcribe-audio/index.ts`
- `tomo/supabase/functions/extract-session/index.ts`
- `mobile-prep/supabase/functions/` (synced copies)
- `tomo/src/services/supabase.ts`
- `tomo/src/screens/SessionLoggerScreen.tsx`
- `tomo/package.json` (added expo-file-system)
