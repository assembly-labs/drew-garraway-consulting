# TOMO Session 7 — Pickup Prompt

**Date:** Continue from 2026-03-09 Session 6
**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/tomo/`
**Read first:** `docs/mvp-1.0/tracking/ISSUES.md` and `docs/mvp-1.0/tracking/CHANGELOG.md`

---

## Where We Are

The voice pipeline is nearly end-to-end. Session 6 found and fixed the two critical blockers:

1. **Recording was never starting** — `prepareToRecordAsync()` was missing before `recorder.record()`. The native AVAudioRecorder silently no-oped for 6 sessions. Fixed.
2. **AssemblyAI API changed** — `speech_model` (singular) deprecated, now requires `speech_models` (plural array). Fixed and edge function redeployed.

**What works now:**
- Recording captures real audio (expo-audio with prepareToRecordAsync)
- File exists after stop (verified by FileSystem.getInfoAsync)
- Upload to Supabase Storage succeeds (base64 → ArrayBuffer)
- Signed URL generation works
- AssemblyAI receives the audio (got a 400 error before the API fix, proving the full upload path works)
- Edge function deployed with `speech_models: ['universal']` fix

**What needs testing:**
- Full pipeline after the speech_models fix: Record → Upload → Transcribe → Extract → Review populated
- Drew's last test showed the processing screen, then review screen with empty fields (because transcription was failing)

---

## Priority 1: Test Voice Pipeline End-to-End

1. Build to device: `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E`
2. Record a short voice note (10-15 seconds about a BJJ session)
3. Watch Metro logs for the pipeline steps:
   - `[Recorder] Recording started, URI will be: ...`
   - `[Recorder] Recording stopped, URI: ...`
   - `[Recorder] File exists: true size: <bytes>`
   - `[Audio] Uploading from: ... to: ...`
   - `[Audio] Upload succeeded`
   - `[Pipeline] Step 2: Transcribing audio...`
   - `[Pipeline] Step 2 done. Success: true`
   - `[Pipeline] Step 3: Extracting...`
   - `[Pipeline] Step 3 done. Success: true`
4. Verify Review screen is populated with extracted data

**If review fields are empty but pipeline logged success:**
- Check `extractionResult.data` in the logs (add `console.log('[Pipeline] Extraction data:', JSON.stringify(extractionResult?.data))` before `applyExtraction`)
- Compare field names in `ExtractionResult` type (`mvp-types.ts:210-226`) with `applyExtraction()` mapping (`SessionLoggerScreen.tsx:229-244`)
- Check if edge function response shape matches `ExtractionResponse` type

---

## Priority 2: Make Transcript Always Visible on Review Screen

Drew wants the voice transcript always visible at the bottom of the Review Session screen (not hidden in a collapsible). This helps validate what the voice-to-text captured.

**Current code:** `SessionLoggerScreen.tsx` lines 747-765 — collapsible `showTranscript` toggle.

**Change to:** Always-visible section at the very bottom of the review ScrollView, above the Save button. Style it as a distinct section with a `VOICE TRANSCRIPT` label and the full transcript text in a lighter color. No toggle needed.

---

## Priority 3: Save + Verify in Journal

After a successful voice pipeline run:
1. Save the session
2. Check that it appears in the Journal screen with correct data
3. Tap into SessionDetail and verify all fields populated correctly
4. Check that `transcript`, `audio_path`, `transcription_status: 'completed'`, `extraction_status: 'completed'` are saved

---

## Open Issues (from ISSUES.md)

| ID | Priority | Description |
|----|----------|-------------|
| BUG-005 | P0 | Review fields not populated — likely fixed by BUG-004, needs re-test |
| P2-008 | P2 | No storage DELETE RLS policy (audio files accumulate) |
| P2-010 | P2 | Offline queue updates nonexistent sessions |
| P2-011 | P2 | Show transcript always visible at bottom of review |
| BUG-002 | P3 | sentry.properties regenerated on prebuild |
| LAUNCH-001 | P1 | Re-enable email confirmation before launch |

---

## Key Commands

```bash
# Build to device (ALWAYS use this, never Xcode Play button)
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E

# TypeScript check
npx tsc --noEmit

# Deploy edge functions
npx supabase functions deploy transcribe-audio --no-verify-jwt
npx supabase functions deploy extract-session --no-verify-jwt
```

---

## Key Files

| File | What It Does |
|------|-------------|
| `src/hooks/useVoiceRecorder.ts` | Recording hook (expo-audio). Must call prepareToRecordAsync() before record(). |
| `src/services/supabase.ts` | Audio upload (base64 → ArrayBuffer), edge function callers |
| `src/screens/SessionLoggerScreen.tsx` | Pipeline orchestration, review phase, save logic |
| `src/types/mvp-types.ts` | ExtractionResult, ExtractionResponse, TranscriptionResponse types |
| `supabase/functions/transcribe-audio/index.ts` | AssemblyAI transcription edge function |
| `supabase/functions/extract-session/index.ts` | Claude Haiku extraction edge function |
