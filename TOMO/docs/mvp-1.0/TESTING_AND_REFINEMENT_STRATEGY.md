# TOMO MVP 1.0 — Testing & Product Refinement Strategy

**Date:** 2026-03-12
**Status:** Voice pipeline working end-to-end. Apple Developer account expected imminently.
**Goal:** Ship a polished, reliable TestFlight build to 5-10 BJJ practitioners.

---

## Current Product State

The core loop works: Record → Upload → Transcribe → Extract → Review → Save → Journal. 11 sessions of development, 29+ bugs fixed. But "works" and "ready for testers" are different things. This strategy covers the gap.

---

## Part 1: UI Gaps to Fix Before Testing

> **Status: ALL 7 FIXED (Session 12, 2026-03-12)**
> Plus data model v1.1 applied — energy/mood removed entirely, warmed_up + instructor added.

### Critical (All Done)

| # | Gap | Status |
|---|-----|--------|
| 1 | **Injuries not shown anywhere** | ✅ Done — injury tags on review + detail + edit sheet |
| 2 | **Submissions not shown on review screen** | ✅ Done — subs given/received with add/remove |
| 3 | **Training mode/kind/duration not editable on review** | ✅ Done — tappable badges with inline selectors |
| 4 | **Submissions not editable in SessionDetail** | ✅ Done — EditSubmissionsSheet added |

### Should Fix (All Done)

| # | Gap | Status |
|---|-----|--------|
| 5 | **Training mode label bug** | ✅ Done — shows "Other" not "Mixed" |
| 6 | **Sparring rounds null guard** | ✅ Done — `?? 0` guard added |
| 7 | **Energy/mood no "not set" state** | ✅ N/A — energy/mood removed from data model (v1.1) |

### Additional v1.1 Changes (Session 12)

| Change | Details |
|--------|---------|
| **Review screen reordered** | Mode → Duration → Warm-up → Techniques → Spar? → Rounds → Subs Landed → Got Caught → Injuries → Instructor → Session Type → Lesson Topic → Notes |
| **warmed_up field added** | Yes/No toggle on review + display/edit on detail |
| **instructor field added** | Text input on review + display/edit on detail |
| **Session type moved** | From badge row to dedicated chip selector |
| **"Did You Spar?" toggle** | Standalone Yes/No — clears spar data when set to No |
| **Fields removed** | worked_well, struggles, energy_level, mood (deferred to v1.1+) |

---

## Part 2: Extraction Quality Testing

The extraction prompt was rewritten in Session 11 but hasn't been tested with real voice input yet. This is the core product bet — if extraction is bad, users will stop using voice.

### Test Protocol

**Record 5-6 test sessions covering varied scenarios:**

| Test # | Scenario | What to Say | What to Check |
|--------|----------|-------------|---------------|
| 1 | **Simple gi class** | "Had a good gi class tonight, about an hour. Coach taught collar chokes from mount. Drilled for 20 minutes then rolled 3 rounds." | trainingMode=gi, sessionKind=class, duration=60, techniquesDrilled includes collar chokes, didSpar=true, sparringRounds=3 |
| 2 | **No-gi open mat** | "Did open mat today, no-gi. About 90 minutes. Got 5 rounds in. Hit a guillotine and a heel hook. Got caught in a darce though." | trainingMode=nogi, sessionKind=open_mat, duration=90, sparringRounds=5, submissionsGiven has guillotine + heel hook, submissionsReceived has darce |
| 3 | **Drilling only** | "Just drilled today for an hour. Worked on single leg takedowns and knee slice passing. No rolling." | sessionKind=drilling, duration=60, didSpar=false, techniques has single leg + knee slice |
| 4 | **Injury session** | "Rough class today. Hour and a half, gi. Got smashed the whole time, couldn't escape side control. My elbow is really sore from that armbar." | injuries has elbow, submissionsReceived has armbar, notes captures the frustration |
| 5 | **Minimal info** | "Good class today. Hour. Worked on guard stuff." | Should extract what it can, leave rest null/empty. Not hallucinate details. |
| 6 | **Voice-preference user** | Skip entry screen, just record. "No-gi class, about two hours. We worked on leg locks. Did some positional sparring from ashi garami." | All fields come from extraction only. trainingMode=nogi, lessonTopic=leg locks, techniques includes ashi garami |

### Quality Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Field accuracy** | >80% of fields correct without editing | Compare review screen to what you actually said |
| **rawNotes quality** | Reads like a journal entry, not a transcript copy | Subjective — should be 1-3 concise sentences |
| **No hallucination** | 0 invented details | Check every populated field against what was said |
| **Technique capture** | >90% of mentioned techniques extracted | Count techniques said vs. extracted |
| **Submission direction** | 100% correct (given vs received) | Verify each submission is in the right array |
| **Instructor extraction** | Populated when instructor/coach mentioned | Check tests 1, 6 specifically |
| **Warm-up extraction** | Populated when warm-up mentioned | Check tests 1, 3 specifically |
| **Graceful on minimal input** | No crashes, no hallucination | Check test 5 |

### If Quality Is Poor

1. **Check the transcript first** — if AssemblyAI is mangling the audio, the extraction prompt can't fix that. Check `word_boost` coverage.
2. **Log extraction input/output** — add `console.log` of the full transcript sent to Claude and the JSON returned.
3. **Iterate the prompt** — add more examples, clarify ambiguous fields, adjust language.
4. **Consider upgrading model** — Haiku 4.5 is fast and cheap. If accuracy is consistently poor, test with Sonnet (more expensive but better reasoning). The model is a config variable in the edge function.

---

## Part 3: End-to-End Test Flows

Before any tester touches the app, run through every user flow manually on the physical device.

### Flow 1: First-Time User (Onboarding → First Session)
1. Sign up with new email
2. Complete onboarding (all 4 screens)
3. Tap + to log first session
4. Record a voice note
5. Review extracted fields — are they correct?
6. Save session
7. Verify it appears in Journal
8. Tap into SessionDetail — all fields rendered?
9. Edit a field — does it save?
10. Delete the session — does it disappear?

### Flow 2: Voice-Preference User
1. Set logging preference to "voice" in profile
2. Tap + — should skip entry phase and go straight to recording
3. Record session describing training mode, techniques, sparring
4. Verify review screen has correct training mode (AI-extracted, not default)
5. Save and check detail

### Flow 3: Text-Only User
1. Tap + → tap "Type instead"
2. Fill in fields manually
3. Save — verify `input_method: 'text'`, `transcription_status: 'skipped'`
4. Check Journal and Detail

### Flow 4: Pipeline Failure
1. Record in airplane mode (or very short recording)
2. Verify app falls through to manual review with toast warning
3. Fill fields manually and save
4. Verify `transcription_status: 'failed'` in saved session

### Flow 5: Edit + Delete
1. Open a saved session
2. Edit training mode, add a technique, change notes
3. Save — verify `edited_after_ai: true`
4. Delete session — verify soft delete, disappears from Journal

### Flow 6: Multi-Session Journal
1. Log 3+ sessions with different dates/modes
2. Verify Journal groups by date correctly
3. Test Gi / No-Gi filter
4. Verify session count on Profile screen

---

## Part 4: Apple Developer Account Unblock

Expected Mar 12 (today). Once activated:

### Immediate (1 session, ~2 hours)
1. **EAS init** — `eas init`, link to Apple Developer account
2. **EAS build config** — set up `eas.json` with development + preview + production profiles
3. **First EAS dev build** — verify it installs on device without Xcode
4. **Apple Sign-In** — configure in Apple Developer portal + Supabase Auth

### Before TestFlight (1 session, ~2 hours)
5. **App Store Connect listing** — create app, set bundle ID, category
6. **Privacy policy** — host at a URL (Cloudflare Pages)
7. **Production EAS build** — `eas build --platform ios --profile production`
8. **Submit to TestFlight** — upload build, write "What to Test"
9. **Add testers** — email invites via TestFlight

---

## Part 5: Pre-TestFlight Checklist

Everything that must be true before the first tester touches the app:

### Code Quality
- [ ] `npx tsc --noEmit` — 0 errors
- [x] All extraction fields visible somewhere in UI (v1.1: 11 fields)
- [x] Training mode/kind/duration editable on review screen
- [x] Submissions + injuries visible on review and detail screens
- [x] Label consistency (no "Mixed" vs "Other" mismatch)
- [x] Null guards on all nullable fields in rendering

### Pipeline Reliability
- [ ] 5+ successful voice pipeline runs on device (varied content)
- [ ] Extraction accuracy >80% on test recordings
- [ ] Pipeline failure falls through to manual entry gracefully
- [ ] No silent data loss (audio files, extracted fields)
- [ ] `ensureFreshToken()` working (no more JWT errors)

### Data Integrity
- [ ] All fields save to DB correctly (check via Supabase dashboard)
- [ ] Edit → save works (verify `updated_at` changes)
- [ ] Delete → soft delete works (verify `deleted_at` set)
- [ ] Session count updates on Profile
- [ ] Date grouping correct in Journal (no off-by-one)

### Infrastructure
- [ ] Apple Sign-In working (or email-only auth with clear plan)
- [ ] LAUNCH-001: Email confirmation — decide: leave off for TestFlight, re-enable for launch
- [ ] P2-008: Storage DELETE RLS policy deployed (or documented as known limitation)
- [ ] Edge functions deployed with `--no-verify-jwt`
- [ ] Sentry capturing errors (verify in dashboard)

### UX Polish
- [ ] App icon + splash screen (not Expo defaults)
- [ ] All fonts render correctly (no system font fallbacks)
- [ ] Touch targets 56px+ on primary actions
- [ ] Haptic feedback on save, delete, record start/stop
- [ ] Toast notifications on all save/error actions
- [ ] Loading skeletons on data-fetching screens

---

## Part 6: TestFlight Success Metrics

From SHIP_PLAN.md, adapted with current context:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| App installs on iOS 16+ | 100% of invited testers | TestFlight dashboard |
| Download → first session | < 3 minutes | Observe during onboarding |
| Voice transcription accuracy (BJJ terms) | > 85% | Manual review of 20+ transcripts |
| AI extraction edit rate | < 30% of fields edited | `edited_after_ai` column in DB |
| Crash rate | < 1% | Sentry dashboard |
| Cold start time | < 3 seconds | Stopwatch test |
| 3+ sessions logged per tester | 5 of 10 testers | DB query |
| Pipeline failure rate | < 5% | `transcription_status = 'failed'` count |

---

## Execution Order

**Phase A — UI fixes (1 session, ~3 hours)** ✅ DONE (Session 12)
All 7 gaps fixed + v1.1 data model changes (warmed_up, instructor, field reorder, removed deferred fields).

**Phase B — Extraction testing (1 session, ~2 hours)**
Run the 6 test scenarios. Iterate prompt if needed. Requires device.

**Phase C — End-to-end flows (1 session, ~2 hours)**
Run all 6 test flows on device. Fix anything that breaks.

**Phase D — Apple account setup (1 session, ~2 hours)**
EAS, Apple Sign-In, App Store Connect. Blocked until account activates.

**Phase E — TestFlight submission (1 session, ~2 hours)**
Production build, submit, add testers, write instructions.

**Total: ~5 sessions (11-15 hours) from here to testers' hands.**
