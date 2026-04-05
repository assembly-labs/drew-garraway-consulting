# TOMO MVP 1.0 — User Testing Guide

**Tester:** Drew
**Device:** Andrew's iPhone (4), iOS 26.3.1
**Started:** March 9, 2026
**Build type:** Development build (free provisioning, Metro required)

---

## How to Run the App

The dev build requires Metro bundler running on your Mac (same WiFi as phone).

```bash
cd /Users/drewgarraway/drew-garraway-consulting/TOMO/tomo
npx expo start
```

Then open TOMO on your phone. If the app shows a red error about "no script URL", Metro isn't running or your phone isn't on the same WiFi.

To rebuild after code changes:
```bash
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E
```

---

## What to Test

### 1. Auth Flow
- [ ] Sign up with email/password
- [ ] Sign out from Profile
- [ ] Sign back in with same credentials
- [ ] Try signing up with invalid email — should show error
- [ ] Try signing in with wrong password — should show error

### 2. Onboarding
- [ ] Welcome screen loads
- [ ] About You: enter name, select belt, select stripes
- [ ] Your Training: search/select gym, pick frequency, optionally set goals + experience
- [ ] Get Started: choose voice or text preference, mic permission prompt appears
- [ ] Completing onboarding lands on Journal (empty state)

### 3. Voice Pipeline (Core Product Bet)
- [ ] Tap + button to start new session
- [ ] Select training mode (Gi/No-Gi/Mixed), session kind, duration, sparring toggle
- [ ] Tap Record — mic permission granted, recording starts
- [ ] Speak a session description naturally (e.g., "Did an hour of gi class today, worked on knee slice passing, rolled 3 rounds, got caught in a triangle but hit an armbar from closed guard")
- [ ] Recording stops (auto at 90s or tap stop)
- [ ] Processing screen shows while transcription + extraction run
- [ ] Review screen: AI-extracted fields appear (techniques, submissions, duration, etc.)
- [ ] Edit any extracted fields that are wrong
- [ ] Save session
- [ ] Session appears in Journal

### 4. Text-Only Path
- [ ] Tap + button, then "Type instead"
- [ ] Fill in fields manually
- [ ] Save session
- [ ] Session appears in Journal

### 5. Journal
- [ ] Sessions listed, grouped by date
- [ ] Filter pills work (All / Gi / No-Gi)
- [ ] Session count updates
- [ ] Pull-to-refresh works
- [ ] Tap session card opens Session Detail

### 6. Session Detail + Edit
- [ ] All fields display correctly
- [ ] Tap a section to edit (bottom sheet opens)
- [ ] Edit training details (mode, kind, duration, sparring)
- [ ] Edit techniques (add/remove chips)
- [ ] Edit sparring details (rounds, submissions)
- [ ] Edit insights + notes
- [ ] Edit energy + mood
- [ ] Edit date/time
- [ ] Save edits — toast confirmation
- [ ] Delete session — confirmation dialog, removed from journal

### 7. Profile
- [ ] Shows name, belt, gym correctly from onboarding
- [ ] Tap to edit name — bottom sheet, save works
- [ ] Tap to edit belt/stripes
- [ ] Tap to edit gym
- [ ] Toggle logging preference (voice/text)
- [ ] Privacy policy link works
- [ ] Sign out works

### 8. Error States + Edge Cases
- [ ] Turn off WiFi — offline banner appears
- [ ] Try recording while offline — should queue or show error
- [ ] Kill and reopen app — stays logged in
- [ ] Very short recording (< 3 seconds) — handled gracefully
- [ ] Empty session (no fields filled) — prevented or warned

---

## Bug Reporting

When you find a bug, note:
1. What screen you were on
2. What you tapped / did
3. What happened vs what you expected
4. Screenshot if possible

Bring these to the next Claude Code session and we'll fix them.

---

## Known Limitations (Dev Build)

- **Requires Metro running on Mac** — app won't load JS without it
- **Same WiFi required** — phone and Mac must be on same network
- **Free provisioning expires in 7 days** — will need to rebuild after that
- **No Apple Sign-In** — email/password only until Apple Developer account activates
- **Sentry source map upload disabled** — crashes still captured, but stack traces won't be symbolicated
- **No push notifications** — v1.1+ feature

---

## Next Steps After Testing

| # | Task | Blocked On | Est. |
|---|------|------------|------|
| 1 | Fix bugs found during testing | Testing results | Varies |
| 2 | Apple Sign-In setup | Apple Developer (~Mar 12) | 2-3 hrs |
| 3 | EAS init + build config | Apple Developer | 1-2 hrs |
| 4 | Production build | Apple Developer + EAS | 1-2 hrs |
| 5 | App Store Connect listing | Apple Developer | 1 hr |
| 6 | TestFlight submission | Production build | 1 hr |
| 7 | Distribute to 5-10 testers | TestFlight approval | 1 hr |
