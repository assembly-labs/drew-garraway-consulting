# TOMO MVP 1.0 — Issues Tracker

Active bugs, known issues, and feature requests. Move items to CHANGELOG.md when resolved.

---

## How to Use This File

Add new items to the appropriate section. Use this format:

```
### [SHORT-ID] Title
**Priority:** P0 (blocker) / P1 (must fix before TestFlight) / P2 (should fix) / P3 (nice to have)
**Area:** Screen or service affected
**Added:** date
**Status:** Open / In Progress / Blocked / Done

Description of the issue, steps to reproduce, or feature request.
```

When resolved: move the entry to CHANGELOG.md under the appropriate date, mark as **Done** here or delete.

---

## Blockers

### BLOCK-001 Xcode Installation
**Priority:** P0
**Area:** Build tooling
**Added:** 2026-03-08
**Status:** ✅ Done (2026-03-09)

Resolved: macOS 26.3.1 (Tahoe), Xcode 26.3 installed, iOS 26.3.1 simulator runtime installed.

### BLOCK-002 Apple Developer Account
**Priority:** P0
**Area:** Distribution
**Added:** 2026-03-08
**Status:** ✅ Done (2026-03-22, Session 18)

Apple Developer account activated. Team ID: 58GX3PYW3S. App ID registered, EAS configured, first TestFlight build submitted.

---

## Bugs

### BUG-001 Audio Upload Fails on iOS Device
**Priority:** P0
**Area:** Voice Pipeline (useVoiceRecorder.ts)
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 6)

**Root cause:** `recorder.prepareToRecordAsync()` was never called before `recorder.record()`. The native AVAudioRecorder requires prepare → record → stop lifecycle. Without prepare, `startRecording()` silently returned empty — no audio was ever captured, so no file existed to upload. All 6 "upload fix" attempts were chasing the wrong problem.

**Fix:** Added `await recorder.prepareToRecordAsync()` before `recorder.record()` in `useVoiceRecorder.ts`. Audio upload (attempt 4 — base64 → ArrayBuffer) works correctly now that a real file exists.

### BUG-004 AssemblyAI speech_model Deprecated (Again)
**Priority:** P0
**Area:** Edge Function (transcribe-audio)
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 6)

AssemblyAI changed their API: `speech_model: 'universal'` (singular) is now deprecated. Must use `speech_models: ['universal']` (plural, array). Fixed and redeployed.

### BUG-005 Review Screen Fields Not Populated After Voice Pipeline
**Priority:** P0
**Area:** SessionLoggerScreen (review phase) + extract-session Edge Function
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-10, Session 7)

**Root cause:** Claude Haiku wrapped JSON output in markdown code fences (```json ... ```). `JSON.parse()` failed → extraction returned `{ success: false, data: null }` → `applyExtraction(null)` set all fields to empty defaults. **Fix:** Added code fence stripping before JSON.parse in `extract-session/index.ts`. Also fixed `pipelineSucceeded` being set to `true` before checking extraction success.

### BUG-006 pipelineSucceeded Set Before Extraction Checked
**Priority:** P1
**Area:** SessionLoggerScreen
**Added:** 2026-03-10
**Status:** ✅ Done (2026-03-10, Session 7)

`setPipelineSucceeded(true)` was called unconditionally before checking extraction result. Sessions saved with `extraction_status: 'completed'` even when extraction failed. Fix: now checks `extractionResult?.success && extractionResult?.data`.

### BUG-007 sparringRounds Saved as null When 0
**Priority:** P2
**Area:** SessionLoggerScreen (handleSave)
**Added:** 2026-03-10
**Status:** ✅ Done (2026-03-10, Session 7)

`review.sparringRounds || null` treated `0` as falsy. Changed to `?? null`.

### BUG-003 handleSave Stale Closure on Voice Pipeline State
**Priority:** P0
**Area:** SessionLoggerScreen
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 5)

`handleSave` useCallback was missing `audioPath`, `voiceSessionId`, and `pipelineSucceeded` from deps. Voice sessions would save with `audio_path: null`, wrong session ID, and `transcription_status: 'failed'` even when pipeline succeeded. Audio files orphaned in storage.

### BUG-002 sentry.properties Regenerated on Prebuild
**Priority:** P3
**Area:** Build tooling
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-13, Session 13)

Changed `'@sentry/react-native'` plugin in `app.config.ts` from bare string to array form with `organization: 'assembly-labs'` and `project: 'react-native'`. Prebuild now writes the correct values to `sentry.properties` on every run. `SENTRY_DISABLE_AUTO_UPLOAD=true` env var still needed for dev builds to suppress upload (expected).

---

## P1 — Must Fix Before TestFlight

### P1-001 Deploy Edge Functions
**Priority:** P1
**Area:** Backend (Supabase)
**Added:** 2026-03-08
**Status:** ✅ Done (2026-03-09, Session 4)

Both edge functions deployed via `npx supabase functions deploy`. Hardened with CORS on all responses, speech_model fix, try/catch, timeout reduction.

### P1-002 Apple Sign-In
**Priority:** P1
**Area:** Auth
**Added:** 2026-03-08
**Status:** Open — deferred to v1.1 (not needed for MVP TestFlight)

Required for App Store public release. Needs Supabase Auth config + Apple Developer portal setup. Email auth works for TestFlight.

### P1-003 EAS Build Configuration
**Priority:** P1
**Area:** Build
**Added:** 2026-03-08
**Status:** ✅ Done (2026-03-22, Session 18)

EAS fully configured. Local builds working with `--non-interactive`. First production IPA built and submitted to TestFlight. See `docs/mvp-1.0/DEPLOYMENT_GUIDE.md` for full CI/CD process.

---

## P1 — Found in Session 4 QA Audit

### P1-004 Silent Failures on Save/Update/Delete
**Priority:** P1
**Area:** Services layer (supabase.ts)
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 5)

`sessionService.update()` and `softDelete()` now throw on error (matching `create()`). Try/catch blocks in SessionDetailScreen now properly catch failures and show error toasts. Note: `profileService.update()` still returns null — lower risk since profile edits are non-critical.

### P1-005 Session Count Always Shows 0
**Priority:** P1
**Area:** Profile screen
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 5)

ProfileScreen now calls `sessionService.getCount()` directly on mount and on screen focus, instead of reading stale `profile.session_count`.

### P1-006 Journal Date Grouping Off by One Day
**Priority:** P1
**Area:** journal-helpers.ts
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 5)

Changed `new Date(session.date)` to `new Date(session.date + 'T00:00:00')` in `groupSessionsByDate()` to force local timezone parsing.

---

## Bugs — Session 10 (2026-03-11)

### BUG-028 Upload Passed ArrayBuffer Instead of Uint8Array
**Priority:** P0
**Area:** supabase.ts (audioService.upload)
**Added:** 2026-03-11
**Status:** ✅ Done (2026-03-11, Session 10)

`bytes.buffer` (raw ArrayBuffer) passed to Supabase storage client instead of `bytes` (Uint8Array). Hermes misinterprets raw ArrayBuffers intermittently. Fix: pass `bytes` directly.

### BUG-029 Invalid JWT on Edge Function Calls
**Priority:** P0
**Area:** supabase.ts (edgeFunctions), Edge Function deployment
**Added:** 2026-03-11
**Status:** ✅ Done (2026-03-11, Session 10)

Two causes: (1) Gateway-level JWT verification rejecting tokens before function code ran — redeployed with `--no-verify-jwt`. (2) Stale session tokens — added `ensureFreshToken()` before all API calls.

---

## Bugs — Session 8 Code Audit (2026-03-11)

### BUG-008 Audio File Deleted Before Upload Confirmed
**Priority:** P0
**Area:** supabase.ts (audioService.upload)
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

Local audio file was deleted immediately after base64 read, before Supabase upload completed. Upload failure = irrecoverable data loss. Offline queue retries also failed (file gone). Fix: removed premature delete; cleanup now happens after session save via `cleanupFile()`.

### BUG-009 Race Condition: Rapid Start/Stop Corrupts State
**Priority:** P0
**Area:** useVoiceRecorder.ts, SessionLoggerScreen.tsx
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

No guards against double-tap on Record/Stop/Save. Could fire duplicate pipelines or duplicate DB inserts. Fix: `isRecording` guard, `stoppingRef`, `processingRef`, `savingRef`.

### BUG-010 Offline Queue `as any` Bypasses Type Safety
**Priority:** P0
**Area:** offline-queue.ts, mvp-types.ts
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

`SessionUpdate` type was missing 8 pipeline fields. `as any` cast hid this — fields could be silently dropped by DB. Fix: expanded type, removed cast.

### BUG-013 Voice-Preference Users Get Hardcoded Defaults
**Priority:** P1
**Area:** SessionLoggerScreen.tsx
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

When `prefersVoice` skips entry phase, default values (`gi/class/90min`) were sent as pre-selected to extraction edge function, overriding AI output. Fix: `skippedEntry` flag, pass `undefined` when entry was skipped.

### BUG-014 Submissions Extracted But Never Saved
**Priority:** P1
**Area:** SessionLoggerScreen.tsx
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

`submissionsGiven`/`submissionsReceived` extracted by AI but never mapped to ReviewFields or included in session insert. Fix: added to full pipeline.

### BUG-015 Injuries Extracted But Never Saved
**Priority:** P1
**Area:** SessionLoggerScreen.tsx
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

Same pattern as BUG-014 for `injuries` array. Fix: added to full pipeline.

### BUG-016 Processing Phase Has No Timeout
**Priority:** P1
**Area:** SessionLoggerScreen.tsx
**Added:** 2026-03-11
**Status:** Done (2026-03-11, Session 8)

If edge functions hang, user sees infinite spinner with no escape. Fix: 150s `Promise.race` timeout + "Skip to manual entry" cancel button.

---

## P2 — Should Fix

### P2-008 No Storage DELETE RLS Policy
**Priority:** P2
**Area:** Supabase Storage
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-13, Session 13)

Added DELETE policy to `storage.objects` for `audio-recordings` bucket. Policy enforces ownership via `(storage.foldername(name))[1] = auth.uid()`. Migration: `supabase/migrations/20260313000001_storage_delete_rls.sql`. Applied to live DB via `db push`.

### P2-009 Null Crash Risk on Array Fields
**Priority:** P2
**Area:** SessionDetailScreen, JournalScreen, journal-helpers.ts
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-09, Session 5)

Added `(field ?? [])` null guards across SessionDetailScreen (display + edit sheet props), JournalScreen (session card), and journal-helpers.ts (narrative generator). All array field accesses are now null-safe.

### P2-010 Offline Queue Updates Nonexistent Sessions
**Priority:** P2
**Area:** offline-queue.ts, SessionLoggerScreen.tsx
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-13, Session 13)

Fixed in `SessionLoggerScreen.tsx` — `handleSave` now calls `offlineQueue.enqueue()` after successfully creating the session record when the voice pipeline failed. Session exists in DB before the queue entry is written, so `processQueue()` can reliably update it. Local audio file is preserved (not cleaned up) when queuing for retry. `OfflineBanner` already called `processQueue()` on reconnect — no changes needed there.

### P2-011 Show Transcript at Bottom of Review Screen (Always Visible)
**Priority:** P2
**Area:** SessionLoggerScreen (review phase)
**Added:** 2026-03-09
**Status:** ✅ Done (2026-03-10, Session 7)

Removed collapsible toggle. Transcript now always visible below Notes, above Save button. Cleaned up dead `showTranscript` state and `transcriptToggle` style.

---

## Bugs — Session 13 (2026-03-13)

### BUG-030 Offline Queue Missing Submissions + Injuries Fields
**Priority:** P2
**Area:** offline-queue.ts (processQueue)
**Added:** 2026-03-13
**Status:** ✅ Done (2026-03-13, Session 13)

BUG-014 and BUG-015 (`submissions_given`, `submissions_received`, `injuries`) were fixed in `SessionLoggerScreen.tsx` during Session 8 but the same fix was never applied to `offline-queue.ts → processQueue()`. The retry path was missing all 3 fields, so any session that failed on first attempt and retried via the offline queue would silently lose that data. Fix: added `submissions_given`, `submissions_received`, and `injuries` to the `sessionService.update()` call in `processQueue()`.

---

## P1 — Session 12 (2026-03-12)

### DEPLOY-001 Redeploy extract-session Edge Function (v2 Schema)
**Priority:** P1
**Area:** Backend (Supabase Edge Function)
**Added:** 2026-03-12
**Status:** ✅ Done (2026-03-13, Session 13)

Redeployed via `npx supabase functions deploy extract-session --project-ref whzycopfjvwmsgzfqvig --no-verify-jwt`. Confirmed live.

### MIGRATE-001 Run v2 Migration on Supabase
**Priority:** P1
**Area:** Database
**Added:** 2026-03-12
**Status:** ✅ Done (2026-03-13, Session 13)

Migration applied via `supabase db push --linked --include-all`. Verified: `warmed_up` and `instructor` columns exist, `energy_level` column does not exist. Migration file copied to `supabase/migrations/20260313000000_v2_schema.sql`.

---

## Bugs — Session 17 (2026-03-17)

### BUG-031 extract-session Returns "Invalid JWT" (401) After Redeploy
**Priority:** P0
**Area:** Edge Function deployment (extract-session)
**Added:** 2026-03-17
**Status:** ✅ Done (2026-03-17, Session 17)

**Symptoms:** `extract-session` returned `{"code":401,"message":"Invalid JWT"}` while `transcribe-audio` worked perfectly with the same token. JWT had 3434s remaining (not expired). Both functions on same Supabase project.

**Root cause:** `extract-session` was redeployed today without the `--no-verify-jwt` flag, resetting gateway-level JWT verification to `true`. This is a repeat of BUG-029 — the Supabase API gateway rejects the JWT before the function code runs. `transcribe-audio` still had `verify_jwt: false` from its March 12 deploy.

**Evidence from `supabase functions list`:**
| Function | verify_jwt | Last Deployed |
|---|---|---|
| transcribe-audio | **false** | 2026-03-12 |
| extract-session | **true** | 2026-03-18 (today UTC) |

**Fix:** Redeployed with `npx supabase functions deploy extract-session --no-verify-jwt`. Confirmed deployed as v13.

**Prevention:** No `config.toml` exists in the project, so JWT settings aren't persisted — they rely on remembering the deploy flag. Should create `supabase/config.toml` with `[functions.extract-session] verify_jwt = false` to make this declarative. Also consider upgrading Supabase CLI from v2.75.0 to v2.78.1 (fixes known bug #4059 where JWT settings are silently ignored on redeploy).

---

## Security — Session 20 (2026-03-25)

### SEC-001 Onboarding Flash on Slow Load
**Priority:** P1
**Area:** Auth (useAuth.ts)
**Added:** 2026-03-25
**Status:** ✅ Done (2026-03-25, Session 20)

On slow network loads, onboarding screens (WelcomeScreen typewriter animation) briefly flashed for returning users. Root cause: profile fetch from Supabase took time, leaving `profile` null → authState evaluated to `needs_onboarding`. Fix: cached `onboarding_complete` flag in AsyncStorage, read instantly on launch before network call. Cache cleared on sign out.

### SEC-002 Missing Insight Tables on Live DB
**Priority:** P0
**Area:** Database (Supabase)
**Added:** 2026-03-25
**Status:** ✅ Done (2026-03-25, Session 20)

`insights`, `insight_conversations`, and `user_context` tables did not exist on the live Supabase instance — migration `20260322100000_insights_tables.sql` was never applied. All 3 returned 404 via PostgREST. Applied via `supabase db push`. All 3 now have RLS enabled and verified.

### SEC-003 Missing DELETE Policies on profiles/sessions
**Priority:** P2
**Area:** Database (Supabase RLS)
**Added:** 2026-03-25
**Status:** ✅ Done (2026-03-25, Session 20)

No DELETE policy existed on `profiles` or `sessions` tables. While RLS blocked unauthorized reads/writes, hard DELETE was theoretically possible. Added service_role-only DELETE policies via migration `20260325000000_security_hardening.sql`.

### SEC-004 Edge Function config.toml Missing 4 Functions
**Priority:** P2
**Area:** Edge Functions (Supabase)
**Added:** 2026-03-25
**Status:** ✅ Done (2026-03-25, Session 20)

`supabase/config.toml` only declared `verify_jwt = false` for `transcribe-audio` and `extract-session`. Missing entries for `generate-weekly`, `generate-monthly`, `generate-quarterly`, `chat-with-insight`. Any redeploy of those functions would reset JWT verification to `true` (repeat of BUG-029/BUG-031). All 6 now declared.

### SEC-005 spatial_ref_sys RLS (PostGIS System Table)
**Priority:** P2
**Area:** Database (Supabase — PostGIS)
**Added:** 2026-03-25
**Status:** Blocked — Supabase support ticket filed

Supabase advisory flags `spatial_ref_sys` (PostGIS system table) as "rls_disabled_in_public". Table is owned by `supabase_admin` — no user-accessible role can ALTER it, REVOKE grants on it, or SET ROLE to the owner. Contains zero user data (EPSG coordinate reference definitions only). Exhaustively tried: ALTER TABLE, REVOKE, SET ROLE, pg_class UPDATE, SECURITY DEFINER function, ALTER EXTENSION SET SCHEMA — all blocked by permissions. Support ticket filed requesting Supabase run the fix as `supabase_admin`.

---

## Onboarding UX — Remaining Enhancements

### UX-001 Belt Picker Ceremony
**Priority:** P2
**Area:** Onboarding (AboutYouScreen)
**Added:** 2026-03-22
**Status:** Open

Belt selection is the most identity-defining moment in the app but feels like a form field. Needs color wash, animation, and/or recognition when user selects their belt. Multiple concepts explored (carousel, ladder, unfurl) — none locked. Revisit with fresh approach.

### UX-002 Micro-Animation Stagger
**Priority:** P3
**Area:** Onboarding (all screens)
**Added:** 2026-03-22
**Status:** Open

Elements load instantly on each screen. Should fade/slide in with 50-100ms stagger delays. One reusable animated wrapper component applied to all screens. Pure polish.

### UX-003 Mic Permission Priming
**Priority:** P2
**Area:** Onboarding (GetStartedScreen) or first session
**Added:** 2026-03-22
**Status:** ✅ Done (2026-03-25, Session 21)

Branded primer modal in GetStartedScreen shows after profile save when voice preference is selected. "Enable Microphone" triggers iOS system dialog; "Maybe Later" defers to first recording attempt. Skipped entirely for text preference or already-granted users.

### UX-005 Profile Gym Edit Missing Autocomplete + Stale Metadata
**Priority:** P2
**Area:** ProfileScreen (EditGymSheet)
**Added:** 2026-03-25
**Status:** ✅ Done (2026-03-25, Session 21b)

Profile gym edit was a bare TextInput saving only `gym_name`. Switching gyms left stale `gym_city`, `gym_state`, `gym_affiliation`, `gym_id`, `gym_is_custom` from onboarding. Fix: extracted `GymSearchInput` shared component with debounced autocomplete, used in both onboarding and profile. Profile now saves all 6 gym fields on edit.

### UX-004 Gym Scraper Database
**Priority:** P2
**Area:** Backend (Supabase `gyms` table)
**Added:** 2026-03-22
**Status:** Open — separate project kicked off

The gym picker's Supabase path (`find_nearby_gyms`, `search_gyms` RPCs) works but the `gyms` table doesn't exist yet. Falls back to local 120-gym list. A separate scraper project was started to populate 3,000+ US BJJ gyms with coordinates. See prompt in session notes.

---

## Pre-Launch Reminders

### LAUNCH-001 Re-enable Email Confirmation
**Priority:** P1
**Area:** Auth (Supabase)
**Added:** 2026-03-09
**Status:** Open

Email confirmation was disabled in Supabase (Auth → Sign In / Providers → Confirm email = OFF) to unblock dev/TestFlight testing. Must re-enable before public launch or wider testing audiences.

---

## Insights UX Backlog

### INS-001 Chat Input Always Visible
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

Don't hide chat input until typewriter completes. Show it dimmed with "Finish reading or ask now..." placeholder. If user starts typing, auto-skip the animation. Curiosity should never be blocked.

### INS-002 Tap-to-Skip Instead of Header Button
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

Make the entire insight text area tappable to skip the typewriter animation. No dedicated Skip button needed. Follows Instagram stories / onboarding pattern. Keeps header clean, works in thumb zone.

### INS-003 Tier Filter Pills
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

Replace the single long scroll with tier filter pills at the top: [Weekly] [Monthly] [Quarterly]. Each pill shows that tier's featured insight + history. Reduces scroll depth, gives one-tap access to any tier. Follows Journal screen's gi/nogi pill pattern.

### INS-004 Keyboard-Aware Chat
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

When chat input is focused and keyboard opens, collapse the insight to title-only with a "Show full insight" toggle. Prevents insight text from scrolling off screen while user types questions about it.

### INS-005 Soft Landing at 5 Exchanges
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

Show "1 question remaining" warning after 4th exchange. After 5th, deliver the close message as a typewritten Tomo response, not a static banner. Input transitions to "Start a new conversation on your next insight" state instead of hard disable.

### INS-006 Generate CTA Instead of Auto-Generation
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

When no insight exists for current period but user is eligible, show "You logged 3 sessions this week. Ready for your debrief?" with a gold [Generate Weekly Insight] button. Makes generation user-initiated, saves AI cost, feels intentional.

### INS-007 Only First Chat Response Gets Typewriter
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

Subsequent bot responses in a conversation use 200ms fade-in instead of full typewriter animation. Prevents conversation from feeling slow by exchange 3-4.

### INS-008 Coach Deferral Shown Contextually
**Priority:** P2 (enhancement)
**Area:** Insights screen (`insights-ux`)
**Added:** 2026-03-23
**Status:** Open

Show the "your coach knows your game better" footer on first 3 visits only (track with counter). After that, only surface it when insights touch injury, technique correction, or competition readiness. Prevents banner blindness.

---

## P3 — Nice to Have

### P3-001 App Icon + Splash Screen
**Priority:** P3
**Area:** Branding
**Added:** 2026-03-08
**Status:** Open

Custom app icon and branded splash screen. Currently using Expo defaults.

### P3-002 Typography Audit — Font Family Pass
**Priority:** P3
**Area:** UI (global)
**Added:** 2026-03-08
**Status:** ✅ Done (2026-03-11, Session 9)

Full font family pass across all 9 screens + 2 navigators. All text styles now have explicit `fontFamily` set to exact registered variant names. Design tokens updated with weight-aware lookups, shared chip/pressed styles, and RN font name documentation. (Initial fontWeight audit done Session 2; full family pass completed Session 9.)

### P3-003 Haptic Feedback
**Priority:** P3
**Area:** UX
**Added:** 2026-03-08
**Status:** ✅ Done (2026-03-08, Session 2)

Haptics on all onboarding chips, logger entry chips, journal filters, save/delete, profile save, record start/stop. See Completed section.

### P3-004 Terms of Service Screen
**Priority:** P3
**Area:** Onboarding
**Added:** 2026-03-08
**Status:** Open

Feature spec mentions ToS but no screen exists yet.

### P3-005 Accessibility Labels
**Priority:** P3
**Area:** UI (global)
**Added:** 2026-03-08
**Status:** Open

Add accessibilityLabel to all interactive elements for VoiceOver support. Session 14 touched ReviewPhase field containers but did not add labels — good candidate to sweep transcript card toggle and empty-field containers when this is addressed.

---

## Completed

### BUG-005 Review Fields Empty (Extraction Parse Failure) — ✅ 2026-03-10 (Session 7)
Claude Haiku wrapped JSON in code fences → JSON.parse failed → empty review. Fix: strip code fences before parsing. Edge function redeployed.

### BUG-006 pipelineSucceeded Set Prematurely — ✅ 2026-03-10 (Session 7)
Was set to `true` before checking extraction result. Now checks `extractionResult?.success`.

### BUG-007 sparringRounds 0 Saved as null — ✅ 2026-03-10 (Session 7)
`||` changed to `??` for nullish coalescing.

### P2-011 Transcript Always Visible — ✅ 2026-03-10 (Session 7)
Removed collapsible toggle. Always renders on review screen.

### BUG-001 Audio Recording + Upload — ✅ 2026-03-09 (Session 6)
Root cause: `prepareToRecordAsync()` never called before `record()`. Native AVAudioRecorder silently no-oped. Fix: added prepare step. Audio upload (base64 → ArrayBuffer) now works.

### BUG-004 AssemblyAI speech_model Deprecated — ✅ 2026-03-09 (Session 6)
`speech_model: 'universal'` → `speech_models: ['universal']`. Edge function redeployed.

### BLOCK-001 Xcode Installation — ✅ 2026-03-09
macOS 26.3.1 (Tahoe), Xcode 26.3, iOS 26.3.1 simulator runtime. Native build succeeded.

### P2-001 Toast Notifications — ✅ 2026-03-08 (Session 2)
Replaced all `Alert.alert` calls with toast notifications across auth, onboarding, and session screens.

### P2-002 Loading Skeletons — ✅ 2026-03-08 (Session 2)
Skeleton loading states for Journal, SessionDetail, Profile.

### P2-003 Error Boundary — ✅ 2026-03-08 (Session 2)
ErrorBoundary wired to Sentry.captureException().

### P2-004 Keyboard Handling — ✅ 2026-03-08 (Session 2)
KeyboardAvoidingView on all text input screens.

### P2-005 Profile Edit Screen — ✅ 2026-03-08 (Session 2)
Tap-to-edit: name, belt, stripes, gym, training frequency, logging preference. 5 bottom sheet edit modals.

### P2-006 FAB on Journal — ✅ 2026-03-08 (Session 2)
Gold FAB (+) button on Journal screen. Confirmed visible in simulator 2026-03-09.

### P2-007 Edit Training Details — ✅ 2026-03-08 (Session 2)
Edit mode, session type, duration, sparring toggle, date/time via bottom sheets.

### P3-002 Typography Audit — ✅ 2026-03-08 (Session 2)
All fontWeight values >= 500, no violations.

### P3-003 Haptic Feedback — ✅ 2026-03-08 (Session 2)
Haptics on all onboarding chips, logger entry chips, journal filters, save/delete, profile save, record start/stop.

### ENV-001 Sentry Auto-Upload Fix — ✅ 2026-03-09 (Session 3)
Native build failed on Sentry source map upload (missing org/project). Fixed by setting `SENTRY_DISABLE_AUTO_UPLOAD=true` for dev builds.

### ENV-002 Expo Go Networking Fix — ✅ 2026-03-09 (Session 3)
Expo Go couldn't connect to Metro on LAN IP or localhost in iOS 26 simulator. Solved by using `npx expo run:ios` native dev build instead.

### ENV-003 Expo Login Required — ✅ 2026-03-09 (Session 3)
Expo Go required authentication. Resolved by running `npx expo login`.

### AUTH-001 Supabase Email Confirmation — ✅ 2026-03-09 (Session 3)
Email confirmation link redirected to unreachable URL. Disabled email confirmation in Supabase for dev/TestFlight. See LAUNCH-001 to re-enable.

### DEVICE-001 Code Signing for Physical Device — ✅ 2026-03-09 (Session 3)
`expo run:ios --device` failed with "No code signing certificates." Fixed by opening Xcode workspace, setting Team to "Drew Garraway (Personal Team)" with auto-managed signing. Certificate: Apple Development (garrawaydrew@gmail.com).

### DEVICE-002 No Script URL on Device — ✅ 2026-03-09 (Session 3)
Building from Xcode Play button produced app that couldn't find Metro ("no script URL provided"). Fix: must build via `npx expo run:ios --device` instead of Xcode directly — Expo CLI embeds the correct Metro connection URL.

### DEVICE-003 Developer Trust Required — ✅ 2026-03-09 (Session 3)
First device install required: (1) Enable Developer Mode on iPhone, (2) Trust developer certificate in Settings → General → VPN & Device Management.

### P1-001 Deploy Edge Functions — ✅ 2026-03-09 (Session 4)
Both edge functions deployed with CORS fix, speech_model fix, timeout reduction, try/catch wrappers.

### PIPELINE-001 AssemblyAI speech_model Required — ✅ 2026-03-09 (Session 4)
AssemblyAI changed their API to require `speech_model` parameter. Added `speech_model: 'universal'` to transcript request.

### PIPELINE-002 Edge Function CORS on Errors — ✅ 2026-03-09 (Session 4)
Error responses (401, 400, 403, 500, 502) were missing CORS headers, causing silent failures. Fixed by adding `corsHeaders` constant to all responses.

### PIPELINE-003 Edge Function Timeout — ✅ 2026-03-09 (Session 4)
Polling loop ran 3 minutes (60 × 3s), exceeding Supabase free-tier 150s limit. Reduced to 45 attempts (~135s).

### PIPELINE-004 Audio Path Not Saved to Session — ✅ 2026-03-09 (Session 4)
Audio upload used one UUID, session record got a different server-generated UUID. Now uses same `voiceSessionId` for both, and `audio_path` is included in create call.

### PIPELINE-005 Pipeline Status Always "completed" — ✅ 2026-03-09 (Session 4)
`transcription_status` and `extraction_status` were always set to `completed` even when pipeline failed. Now correctly set to `failed` on error.
