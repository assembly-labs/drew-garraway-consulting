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

## ACTIVE PRIORITY: Design Audit (2026-03-28)

> **These items take precedence over all other open issues.** Full audit report: `docs/design-reviews/ux-audit-2026-03-28.md`
>
> Work on existing open issues (CR-, UX-, INS-, P3-) is paused until DA-/DS- items are resolved or Drew explicitly requests otherwise.

### DA-001 Insights Screen Not in Tab Bar
**Priority:** P0
**Area:** MainTabNavigator
**Added:** 2026-03-28
**Status:** Open (also tracked as CR-001)

InsightsScreen is fully built (1065 lines) but not wired into the tab navigator. TOMO's core differentiator is invisible to every user. Add as 4th tab.

### DA-002 No Cancel/Back from Entry Phase
**Priority:** P1
**Area:** SessionLoggerScreen (Entry phase)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Added "Cancel" text button top-left, reusing RecordingPhase cancel styles. Navigates to JournalTab.

### DA-003 Review Phase Too Dense for Exhausted Users
**Priority:** P1
**Area:** SessionLoggerScreen (Review phase)
**Added:** 2026-03-28
**Status:** Open

10+ fields visible simultaneously in Review violates the 90-second principle. Restructure into summary card (mode, duration, techniques, notes) + collapsible "Review Details" for secondary fields. Default collapsed.

### DA-004 No Back Navigation in Onboarding
**Priority:** P1
**Area:** Onboarding (screens 2-4)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Back buttons added to AboutYouScreen, YourTrainingScreen, GetStartedScreen. 44x44 touch target, Icons.Back 22px gray400.

### DA-005 14px Font Size Used ~12 Times But Not in Type Scale
**Priority:** P1
**Area:** Multiple screens (JournalScreen, InsightsScreen, GetStartedScreen, YourTrainingScreen)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

All 21 instances of fontSize: 14 remapped across 9 files. Metadata/secondary text to 13px, readable body/descriptions to 15px. Zero instances remain.

### DA-006 WelcomeScreen Kanji Has No fontFamily
**Priority:** P2
**Area:** WelcomeScreen, AuthScreen
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Added `fontFamily: 'Inter'` to WelcomeScreen `logoSubtext`. AuthScreen already had it.

### DA-007 GymChip Reset Button 28px in Exhausted-User Context
**Priority:** P2
**Area:** GymChip component
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Increased to 36x36 with hitSlop 10 (56px total). Close icon bumped from 14 to 16.

### DA-008 "Type Instead" Link Has No Min Touch Target
**Priority:** P2
**Area:** SessionLoggerScreen (Entry phase)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Added `minHeight: 44` and `justifyContent: 'center'` to `textOnlyButton` style.

### DA-009 Offline Banner Hardcoded paddingTop
**Priority:** P2
**Area:** NetworkError.tsx
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Replaced hardcoded 54 with `useSafeAreaInsets().top + 6`. Works on all device types.

### DA-010 Success Message Hollow Positivity
**Priority:** P2
**Area:** SessionLoggerScreen (Success phase)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Changed to "Session logged." (period, lowercase, no exclamation).

### DA-011 Auth Password No Visibility Toggle
**Priority:** P2
**Area:** AuthScreen
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Added Eye/EyeOff icons and password visibility toggle. Works in both signin and signup modes.

### DA-012 Journal Empty State No Direct CTA
**Priority:** P2
**Area:** JournalScreen
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Added gold "Log Your First Session" button that navigates to LogTab via parent navigator.

### DA-013 Session Detail Back Button No Explicit Hit Area
**Priority:** P2
**Area:** SessionDetailScreen
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Already had `width: 44, height: 44` with `alignItems/justifyContent: 'center'`. No change needed.

### DA-014 Inconsistent Header Casing
**Priority:** P3
**Area:** InsightsScreen, JournalScreen
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Changed to "Insights" (title-case) and removed letterSpacing: 1 to match Journal header style.

### DA-015 Stop Recording Button Lacks Visual Weight
**Priority:** P3
**Area:** SessionLoggerScreen (Recording phase)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Changed from red background/white text to gold background/black text+icon. Now reads as the primary action.

### DA-016 Processing Skip Link Too Subtle
**Priority:** P3
**Area:** SessionLoggerScreen (Processing phase)
**Added:** 2026-03-28
**Status:** Open

"Skip to manual entry" in gray during a potentially 150s wait. Delay 10-15s then fade in with gold text.

### DA-017 Weekly Pulse Dots No Accessibility Labels
**Priority:** P3
**Area:** JournalScreen (WeeklyPulse)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Added `accessibilityLabel` ("X of Y sessions this week") to pulseRow, `accessibilityElementsHidden` on individual dots.

### DS-001 Type Scale: No 14px Token
**Priority:** P2
**Area:** Design system (design-tokens.ts)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 28)

Resolved by DA-005: all 21 instances migrated to 13/15. No 14px token needed.

### DS-002 No Reusable DismissibleTag Component
**Priority:** P3
**Area:** Design system (components)
**Added:** 2026-03-28
**Status:** Open

Technique/injury tags with close buttons are built inline in Review + SessionDetail. Extract shared component.

### DS-003 No Named Cancel Link Style
**Priority:** P3
**Area:** Design system (design-tokens.ts)
**Added:** 2026-03-28
**Status:** Open

gray400 / Inter / 15px cancel link pattern appears on 4+ screens inline. Add `typography.cancelLink`.

### DS-004 No Animation Timing Tokens
**Priority:** P3
**Area:** Design system (design-tokens.ts)
**Added:** 2026-03-28
**Status:** Open

Screens use magic numbers (200ms, 250ms, 300ms, etc.) for animations. Add timing tokens.

### DS-005 pressedStyles Tokens Unused
**Priority:** P3
**Area:** Design system (design-tokens.ts)
**Added:** 2026-03-28
**Status:** Open

Token exists but most pressables use inline `opacity: 0.7`. Dark theme should lighten on press, not reduce opacity.

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

## Bugs — Session 25 (2026-03-28)

### BUG-032 Cannot Log Second Session in Same Day
**Priority:** P0
**Area:** SessionLoggerScreen + MainTabNavigator
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 25)

**Symptoms:** After logging and saving a session, tapping Log (+) again showed the old session's data (success screen or stale review fields) instead of a fresh form. Users could not log a second session in the same day.

**Root cause:** 4 compounding issues:
1. React Navigation caches tab screens — `SessionLoggerScreen` never unmounted between visits, so all `useState` values persisted
2. No `useFocusEffect` reset hook existed to clean up state on re-focus
3. The 5-second auto-dismiss timer in `resetAndGoBack` could fire mid-new-session and navigate the user away
4. `autoStarted` ref was never reset, so voice auto-start only worked on first visit

**Fix:** Added `useFocusEffect` that checks `phaseRef.current === 'success'` on focus. If the previous session is done, performs a full state reset (same fields as `resetAndGoBack` but without the navigation call), clears the dismiss timer, and resets `autoStarted`. Active phases (recording, processing, review) are left untouched to protect in-progress work from accidental tab switches.

### BUG-033 Ghost "LogTab" Label Visible Behind Log Button
**Priority:** P2
**Area:** MainTabNavigator
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 25)

Faint "LogTab" text visible behind the gold circle button. Fix: `tabBarItemStyle: { height: 0, overflow: 'visible' }` collapses the tab item's label area to zero.

### BUG-034 Gym Autocomplete Fails on Multi-Word Queries
**Priority:** P2
**Area:** gymService.ts (localTextSearch)
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 25)

Typing "Alliance Paoli" returned 0 results because `String.includes()` checked the full query against each individual field. Fix: split query into words, require all words to match across any combination of fields (name, city, affiliation, aliases).

---

## Bugs — Session 27c (2026-03-28)

### BUG-041 Signup Toast Shows "Check Your Email" Incorrectly
**Priority:** P1
**Area:** AuthScreen + useAuth (signup flow)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27c)

`signUp()` in useAuth.ts discarded the session from `supabase.auth.signUp()`. AuthScreen always showed the "Check your email for a confirmation link" toast even though email confirmation is disabled. New users saw a confusing message before being navigated to onboarding. Fix: `signUp()` returns `{ error, session }`, AuthScreen only shows toast when no session is returned (email confirmation ON fallback).

---

## Bugs — Session 27b (2026-03-28)

### BUG-037 Cancel Button Guard Race in RecordingPhase
**Priority:** P1
**Area:** SessionLoggerScreen (RecordingPhase)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27b)

`cancelRef.current = false` reset synchronously after `Alert.alert()`, before the Alert rendered. A rapid second tap could bypass the guard. Fix: use Alert's `onDismiss` callback instead of synchronous reset.

### BUG-038 Session Detail Concurrent Edit Saves
**Priority:** P1
**Area:** SessionDetailScreen (handleUpdate)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27b)

No in-flight guard on `handleUpdate()`. Rapidly saving from two edit sheets fired parallel API calls, risking data overwrite. Fix: added `isSaving` state flag.

### BUG-039 Session Detail Double Delete
**Priority:** P2
**Area:** SessionDetailScreen (handleDelete)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27b)

No in-flight guard on `handleDelete()`. Could fire two soft-delete requests. Fix: added `isDeleting` state flag.

### BUG-040 Journal Pull-to-Refresh Error State + Concurrency
**Priority:** P2
**Area:** JournalScreen (onRefresh)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27b)

`onRefresh()` didn't clear `error` state, so error UI persisted during refresh. No guard against concurrent pulls. Fix: clear error on refresh, return early if already refreshing.

---

## Bugs — Session 27 (2026-03-28)

### BUG-035 WeeklyPulse Shows Stale Training Target
**Priority:** P1
**Area:** JournalScreen (WeeklyPulse)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27)

`targetFrequency` was fetched once on mount via `profileService.get()`. Navigation focus listener only refreshed sessions, not profile data. Changing target_frequency in ProfileScreen had no effect on JournalScreen until app restart. Fix: focus listener now re-fetches profile data on every tab visit.

### BUG-036 handleCancelRecording File Leak + Race Condition
**Priority:** P1
**Area:** SessionLoggerScreen (recording cancel)
**Added:** 2026-03-28
**Status:** Done (2026-03-28, Session 27)

`handleCancelRecording` called `stopRecording()` + `reset()` instead of `cancelRecording()`. Three problems: (1) every cancelled recording leaked a `.m4a` file to documentDirectory, (2) unnecessary file copy work, (3) `stoppingRef` guard could block cancel if auto-stop was racing. Fix: switched to `cancelRecording()` which bypasses stoppingRef, skips file copy, resets atomically.

---

## Session 25 Code Review — Open Items (2026-03-28)

### CR-001 Insights Screen Not in Tab Bar
**Priority:** P1
**Area:** MainTabNavigator
**Added:** 2026-03-28
**Status:** Open

InsightsScreen is fully built (weekly/monthly/quarterly cards, empty states, skeleton loading, NEW badges, chat service) but is unreachable — not wired into the tab navigator. Biggest user-facing gap in the app.

### CR-002 No Notes Field in Review Phase
**Priority:** P2
**Area:** SessionLoggerScreen (review phase)
**Added:** 2026-03-28
**Status:** Open

`review.notes` state exists and gets saved to DB, but no TextInput is rendered in the Review phase UI. Users can't add free-text notes like "Coach showed a detail on the underhook."

### CR-003 Missing 75-Minute Duration Option
**Priority:** P2
**Area:** SessionLoggerScreen (entry + review phases)
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 26b)

Added 75-min chip to entry (60/75/90/120), review (30/45/60/75/90/120), and edit sheet. Edit sheet also gets a Custom chip (15–300 min, number-pad input). Dropped 130.

### CR-004 No Cancel Button on Recording Phase
**Priority:** P2
**Area:** SessionLoggerScreen (recording phase)
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 26b)

Cancel text link top-left of recording screen. <3s = instant cancel, 3+s = confirm dialog. Resets to entry, discards audio, re-enables voice auto-start.

### CR-005 Gym Name Not Shown on Session Detail
**Priority:** P2
**Area:** SessionDetailScreen
**Added:** 2026-03-28
**Status:** Open

Session stores `user_gym_id` but detail screen doesn't display which gym the session was logged at. Multi-gym users can't tell where they trained.

### CR-006 Insight Generation Not Triggered
**Priority:** P2
**Area:** Insights service layer
**Added:** 2026-03-28
**Status:** Open

`insightGenerationService` has `generateWeekly`, `generateMonthly`, `generateQuarterly` methods but nothing calls them — no cron, no background task, no client-side trigger. Insights will never appear unless generation is wired up.

### CR-007 Success Phase Has No Manual Done Button
**Priority:** P3
**Area:** SessionLoggerScreen (success phase)
**Added:** 2026-03-28
**Status:** Open

Auto-dismisses after 5 seconds with no manual "Done" button. If user is reading the success message, the auto-dismiss can feel jarring.

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

## Cleanup — Session 25d (2026-03-28)

### CLEAN-001 Dead Code Removal
**Priority:** P3
**Area:** Multiple files
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 25d)

Removed ~137 lines of dead code: `energyLabel()` (journal-helpers.ts), `Icons.Search` (Icons.tsx), `chipStyles` (design-tokens.ts), `fontFamilies` (design-tokens.ts), 7 unused `typography` entries (design-tokens.ts), dead `typography` import (InsightsScreen.tsx).

### CLEAN-002 Duplicate Base64 Decode Consolidated
**Priority:** P3
**Area:** supabase.ts
**Added:** 2026-03-28
**Status:** ✅ Done (2026-03-28, Session 25d)

Identical base64-to-Uint8Array decode logic was copy-pasted in `audioService.upload()` and `avatarService.upload()`. Extracted shared `decodeBase64ToBytes()` helper. Both services now call it. ~25 net lines removed.

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

### FEAT-004 Training Frequency Tracker (Weekly Pulse) — ✅ 2026-03-28 (Session 26)
Compact dot strip on JournalScreen above filter pills. Gold dots for completed sessions, empty for remaining. Shows "X of Y" with target, or "X sessions this week" without. Handles exceeded targets with bonus dots.

### FEAT-005 Gym Name on Session Detail — ✅ 2026-03-28 (Session 26)
MapPin icon + gym name below the mode/kind/duration row on SessionDetailScreen. Looks up `user_gym_id` via userGymService, falls back to profile gym_name. Truncates with ellipsis. Hidden when no gym data.

### CR-003 Duration Options Update — ✅ 2026-03-28 (Session 26b)
Entry: 60/75/90/120. Review: 30/45/60/75/90/120. Edit sheet: same presets + Custom chip (15–300 min, number-pad). Dropped 130.

### CR-004 Cancel Button on Recording — ✅ 2026-03-28 (Session 26b)
Cancel text (Inter 15px, gray400) top-left of recording phase. <3s instant cancel, 3+s confirm dialog. Discards audio, resets to entry, re-enables voice auto-start. Double-tap protected.
