# TOMO Session 11 — Pickup Prompt

**Date:** Continue from 2026-03-11 Session 10
**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/tomo/`
**Read first:** `docs/mvp-1.0/tracking/ISSUES.md` and `docs/mvp-1.0/tracking/CHANGELOG.md`

---

## Where We Are

Voice pipeline is working end-to-end again. Session 10 fixed two critical blockers:

1. **Upload was passing `bytes.buffer` (ArrayBuffer) instead of `bytes` (Uint8Array)** — Hermes silently failed on the raw ArrayBuffer intermittently.
2. **Invalid JWT on edge function calls** — Supabase gateway was rejecting tokens + app wasn't refreshing stale tokens. Redeployed with `--no-verify-jwt` and added `ensureFreshToken()` before all API calls.

**What works now (confirmed by Drew on device):**
- Recording captures audio
- Upload to Supabase Storage succeeds
- Transcription via AssemblyAI returns text
- Extraction via Claude Haiku returns structured data
- Review screen shows: notes field populated, voice transcript visible, some techniques detected
- Save to database works

**What needs work:**
- Extraction quality — Claude Haiku's interpretation of the transcript needs refinement
- Field accuracy — techniques, training mode, session kind, duration, sparring detection could be better
- The extraction prompt and JSON schema may need tuning

---

## Priority 1: Refine Extraction Quality

The extraction edge function is at `supabase/functions/extract-session/index.ts`. Review:

1. **The system prompt** — Is it giving Claude Haiku enough context about BJJ terminology and what each field means?
2. **The JSON schema** — Does it match what the app expects? Are field descriptions clear enough for the model?
3. **Pre-selected values** — When the user fills in entry fields before recording, are these being passed and used correctly?

### Testing approach
1. Record a few test sessions with varied content (techniques, sparring, drilling, etc.)
2. Compare the transcript against what gets extracted
3. Identify patterns where extraction is wrong or incomplete
4. Iterate on the prompt

---

## Priority 2: Field Mapping Accuracy

Check that every field extracted by Claude Haiku correctly maps through:
- `ExtractionResult` type (`mvp-types.ts`)
- `applyExtraction()` in `SessionLoggerScreen.tsx`
- `handleSave()` → database insert

Fields to verify: `trainingMode`, `sessionKind`, `durationMinutes`, `didSpar`, `sparringRounds`, `techniquesDrilled`, `workedWell`, `struggles`, `lessonTopic`, `rawNotes`, `energyLevel`, `mood`, `submissionsGiven`, `submissionsReceived`, `injuries`

---

## Open Issues

| ID | Priority | Description |
|----|----------|-------------|
| BLOCK-002 | P0 | Apple Developer account — expected Mar 12 |
| P2-008 | P2 | No storage DELETE RLS policy |
| P2-010 | P2 | Offline queue not wired into pipeline error path |
| LAUNCH-001 | P1 | Re-enable email confirmation before launch |
| BUG-002 | P3 | sentry.properties regenerated on prebuild |

---

## Key Commands

```bash
# Build to device
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
| `src/hooks/useVoiceRecorder.ts` | Recording hook (expo-audio) |
| `src/services/supabase.ts` | Audio upload, edge function callers, `ensureFreshToken()` |
| `src/screens/SessionLoggerScreen.tsx` | Pipeline orchestration, review, save |
| `src/types/mvp-types.ts` | ExtractionResult, ExtractionResponse types |
| `supabase/functions/transcribe-audio/index.ts` | AssemblyAI transcription edge function |
| `supabase/functions/extract-session/index.ts` | Claude Haiku extraction edge function — **focus of next session** |
