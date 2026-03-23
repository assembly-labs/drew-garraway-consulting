# TOMO Session 15 — Pickup Prompt

**Date:** 2026-03-14 (written end of Session 14)
**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/tomo/`

> **Tell Claude:** "Read `docs/mvp-1.0/SESSION_15_PROMPT.md` then start working through the next steps."

---

## What Was Done in Session 14

Two Review Screen UX improvements:

1. **Transcript panel moved to top** — was buried at the bottom of the scroll. Now a collapsed card at the very top of the ScrollView. Shows 2 preview lines when collapsed; full text on expand. Tap the card header (ChevronDown/Up) to toggle. `gray800` background, `gray500` label, `Inter` 14px text.

2. **Empty field highlighting** — fields the AI left blank get a 3px gold left border + `rgba(245,166,35,0.04)` tint. Disappears reactively as user fills in content. Applied to: `warmedUp`, `techniquesDrilled`, `sparringRounds` (when `didSpar`), `submissionsGiven` (when `didSpar`), `submissionsReceived` (when `didSpar`), `injuries`, `instructor`, `lessonTopic`, `notes`.

Both changes are in `src/screens/SessionLoggerScreen.tsx`. TypeScript clean (0 errors).

---

## Current State

- **All P1/P2 bugs resolved.** Codebase clean.
- **Data model v1.1:** Fully deployed. `warmed_up`, `instructor` in DB.
- **Voice pipeline:** Recording ✅ → Upload ✅ → Transcription ✅ → Extraction ✅ → Review populated ✅ → Save ✅
- **Review screen UX:** Transcript at top (collapsed) ✅ | Empty field highlighting ✅
- **Blocked on:** Apple Developer account (pending) for Apple Sign-In, EAS builds, TestFlight

---

## Next Steps (In Priority Order)

### 1. Device Testing — Review Screen Visual QA (NOT BLOCKED)
Build to physical device and do a real voice session end-to-end. Verify:
- Transcript card renders at top, collapses/expands correctly
- Gold border appears on empty fields immediately on review load
- Border disappears as each field is filled in
- Submission fields (Landed/Got Caught) don't highlight when `didSpar` is false
- Session saves correctly with all fields

**Build command:**
```bash
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E
```

### 2. Extraction Quality Testing — 6 Scenarios (NOT BLOCKED)
Run 6 test recordings through the full voice pipeline and verify AI extraction quality:
1. Gi class, no sparring, 3 techniques mentioned
2. No-Gi open mat, sparring with submission wins/losses
3. Competition prep drilling session
4. Short session with injury mention
5. Session with instructor named
6. Ambiguous/rambling speech (worst case)

Check edit rate: target < 30% of fields requiring user correction.

### 3. Apple Sign-In Setup (BLOCKED on Apple Developer account)
Once account is approved:
- Supabase Auth config — enable Apple provider
- Apple Developer portal — App ID + Sign In with Apple capability
- `app.config.ts` — add `usesAppleSignIn: true`
- Auth screen — wire up `signInWithApple()` button

### 4. EAS Build Configuration (BLOCKED)
After Apple Developer account:
- `eas build --platform ios --profile development`
- First dev build to physical device via EAS
- Then production build + TestFlight submission

### 5. P3-004 Terms of Service Screen (NOT BLOCKED)
No ToS screen exists yet. Required before wider TestFlight distribution.

---

## Open Issues (from ISSUES.md)

- `BLOCK-002` — Apple Developer account (pending, not blocking local work)
- `LAUNCH-001` — Re-enable email confirmation before public launch
- `P3-001` — App icon + splash screen (Expo defaults currently)
- `P3-004` — Terms of Service screen
- `P3-005` — Accessibility labels (VoiceOver) — transcript card toggle + field containers need `accessibilityLabel`

---

## Key Files

- `src/screens/SessionLoggerScreen.tsx` — main screen (ReviewPhase ~line 685)
- `src/config/design-tokens.ts` — color tokens, spacing, radius
- `docs/mvp-1.0/tracking/ISSUES.md` — open bugs
- `docs/mvp-1.0/tracking/CHANGELOG.md` — history

---

## Session End Requirements (reminder for Session 15)

Before ending the session:
1. Update `docs/mvp-1.0/tracking/CHANGELOG.md` with a dated Session 15 entry
2. Update `docs/mvp-1.0/tracking/ISSUES.md` — close anything resolved, add new bugs
3. Run `npx tsc --noEmit` — must be clean
4. Update this file → `SESSION_16_PROMPT.md` with current state and next steps
