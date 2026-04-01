# TOMO v1.1 Pre-TestFlight Test Plan

## Context

TOMO just received a UX polish pass (Session 29). Before shipping to TestFlight for wider beta, we need to verify the three critical user flows are flawless: onboarding, profile editing, and session logging. There are no automated tests in the project -- this is a structured manual test script Drew walks through on his physical device, gated by a TypeScript compilation check.

**64 test cases across 3 suites. All must pass before shipping.**

---

## Pre-Flight Checklist

| # | Item | How |
|---|------|-----|
| PF-01 | TypeScript clean | `cd tomo && npx tsc --noEmit` -- zero errors |
| PF-02 | Device connected | iPhone via USB, trusted, unlocked |
| PF-03 | Fresh test account | Sign out of existing account. Prepare a fresh email for Suite A |
| PF-04 | Build locally | `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E` |
| PF-05 | Network available | Wi-Fi on. Some tests toggle Airplane Mode |
| PF-06 | Location reset | iOS Settings > Privacy > Location > TOMO > "Ask Next Time" |
| PF-07 | Mic permission reset | iOS Settings > TOMO > toggle Microphone OFF (or not yet granted) |
| PF-08 | Cold start < 3s | Kill app, relaunch, time to first screen |

---

## Suite A: Onboarding to First Journal Entry (21 tests)

### Auth

**A-01: Sign up (happy path)**
- Create account with test email + password
- Expected: Spinner, no error toast, transitions to Welcome screen with typewriter animation
- [ ] Pass

**A-02: Empty field validation**
- Submit with empty email, then empty password
- Expected: Warning toast each time, no navigation, no crash
- [ ] Pass

### Welcome Screen

**A-03: Typewriter animation + tap-to-skip**
- Watch typewriter cycle phrases. Tap mid-type
- Expected: Instantly shows "Let's roll." and cursor stops. Progress bar at step 1/4
- [ ] Pass

**A-04: "Get Started" advances**
- Tap gold button
- Expected: Haptic, slides to "About You", progress bar advances
- [ ] Pass

### About You

**A-05: Continue disabled without name + belt**
- Observe button gray. Type name (still disabled). Select belt (now active)
- Expected: Button gold only when both name has text AND belt selected
- [ ] Pass

**A-06: Belt + stripes + advance**
- Enter "Drew", tap Blue belt, tap 2 stripes, Continue
- Expected: Blue belt gets gold border. "2" stripe highlights. Haptics fire. Transitions to "Your Training"
- [ ] Pass

**A-07: Back navigation**
- Tap back arrow to Welcome, then forward again
- Expected: About You loads fresh (name empty, no belt). Stack nav clears state
- [ ] Pass

### Your Training

**A-08: Enable location -- see nearby gyms**
- Tap "Enable Location" > Allow in iOS prompt
- Expected: Card animates out. Loading spinner. Nearby gym cards appear (name, city, distance). **No "NEAR YOU" label anywhere**
- [ ] Pass

**A-09: Skip location -- "I'll type it myself"**
- Tap skip link
- Expected: Card animates out. Text search appears directly. No iOS prompt. Typing shows autocomplete
- [ ] Pass

**A-10: Deny location at iOS prompt**
- Tap Enable, then Don't Allow
- Expected: Text-only search appears. No crash. No stuck spinner
- [ ] Pass

**A-11: Continue disabled without gym**
- Don't select a gym, check Continue button
- Expected: Gray/disabled
- [ ] Pass

**A-12: Full field selection (new v1.1 changes)**
- Select gym, change frequency to "5+/week", tap "Competition" + "Other" goals, tap "2 - 5yr" experience, Continue
- Expected: "Other" goal chip present and highlights gold. Experience labels are time-based only (< 6 months, 6mo - 2yr, 2 - 5yr, 5+ yr). **No "Not here?" hint visible.** Transitions to GetStarted
- [ ] Pass

**A-13: Experience deselect toggle**
- Select "2 - 5yr", then tap again
- Expected: Chip deselects back to gray (toggle behavior)
- [ ] Pass

### Get Started

**A-14: Voice preference + mic primer**
- Voice pre-selected. Tap "Start Logging"
- Expected: Profile saves (spinner). Branded mic primer appears. Tap Enable > iOS mic dialog > Allow. Chat payoff starts
- [ ] Pass

**A-15: Text preference -- no mic primer**
- Select Text. Tap "Start Logging"
- Expected: No mic dialog at all. Straight to chat payoff
- [ ] Pass

**A-16: Skip mic from primer**
- Choose Voice. Start Logging. On primer, tap skip
- Expected: Primer dismisses. Chat payoff. No OS mic prompt
- [ ] Pass

**A-17: Chat payoff -- 5 bubbles (v1.1 change)**
- Watch the payoff sequence
- Expected: TOMO avatar + "TOMO" label. Exactly **5 chat bubbles** type sequentially. Bubble 1 has name/belt/stripes/gym. Bubble 3 coaches what to say. Bubble 4 gives an example. Typing indicator between bubbles. "Start Training" fades in after last bubble
- [ ] Pass

**A-18: "Start Training" completes onboarding**
- Tap Start Training
- Expected: Haptic. Main tab nav loads. Journal tab visible with empty state. Tab bar: Journal, gold Log button, Profile
- [ ] Pass

**A-19: Swipe-back gesture blocked on GetStarted**
- Before tapping Start Logging, swipe from left edge
- Expected: Nothing happens (`gestureEnabled: false`). Back arrow button still works
- [ ] Pass

### First Session (end-to-end)

**A-20: Voice path -- full flow**
- Tap gold Log button. Record 10+ seconds. Stop. Wait for processing. Review. Save
- Expected: Recording shows **gold ring with kanji** (not red circle). Opacity pulse. Timer counts. Processing shows bars. Review editable. Save shows success with "1 session total". **Done button visible**. Auto-dismiss after 5s OR tap Done
- [ ] Pass

**A-21: Session appears in Journal**
- After success dismisses, check Journal
- Expected: Session card under "Today". Empty state gone. Weekly pulse shows 1 dot
- [ ] Pass

---

## Suite B: Profile Editing (13 tests)

Pre-condition: Completed account with 1+ sessions.

**B-01: Profile loads with correct data**
- Tap Profile tab
- Expected: Avatar with belt-colored border. Correct name, belt badge + stripes. Info card: Belt, Training Target, Logging Pref, Sessions (1). Gym card. "TOMO v1.0.0"
- [ ] Pass

**B-02: Edit name**
- Tap edit icon. Change to "TestName". Save
- Expected: Sheet dismisses. Name updates. Success toast + haptic
- [ ] Pass

**B-03: Empty name validation**
- Edit name, clear field, tap Save
- Expected: Save disabled or validation error. Whitespace-only also fails
- [ ] Pass

**B-04: Edit belt + stripes**
- Tap Belt row. Change to Purple, 1 stripe. Save
- Expected: Badge updates. Avatar border changes to purple. Toast + haptic
- [ ] Pass

**B-05: Edit training frequency**
- Tap Training Target. Change value. Save
- Expected: Row updates. Weekly pulse tracker reflects new target on next Journal visit
- [ ] Pass

**B-06: Edit logging preference**
- Tap Logging Pref. Toggle Voice/Text. Save
- Expected: Pref updates. Next Log tap behavior changes accordingly (voice auto-records, text shows entry)
- [ ] Pass

**B-07: Change home gym**
- Tap "Change Gym". Search different gym. Select + save
- Expected: Gym card updates. Previous gym in history list. "Home gym updated" toast
- [ ] Pass

**B-08: Cancel edit sheet without saving**
- Open any edit sheet. Make changes. Tap Cancel
- Expected: Sheet dismisses. No changes. No haptic/toast
- [ ] Pass

**B-09: Avatar upload + remove**
- Edit Profile > tap avatar > Choose from Library > select photo > Save. Then: Edit again > tap avatar > Remove Photo > Save
- Expected: Upload shows photo with belt border. Remove reverts to initial letter. Both show toast
- [ ] Pass

**B-10: Gym history + notes**
- After B-07, scroll to gym history. Tap notes icon on previous gym. Add notes. Save
- Expected: History timeline visible. Notes persist
- [ ] Pass

**B-11: Sign out + sign back in**
- Tap Sign Out. Confirm alert. Sign in with same creds
- Expected: Returns to Auth. Sign-in loads same profile, all edits preserved. No re-onboarding
- [ ] Pass

**B-12: Privacy Policy navigation**
- Tap Privacy Policy. View. Navigate back
- Expected: Page loads. Back returns to Profile. No crash
- [ ] Pass

**B-13: Profile skeleton on cold start**
- Kill app. Relaunch. Immediately tap Profile
- Expected: Skeleton renders briefly before full profile. No broken/empty flash
- [ ] Pass

---

## Suite C: Session Logging (30 tests)

### Entry Phase

**C-01: All field selections**
- Set pref to Text. Tap Log. Try each chip in every group
- Expected: Each highlights gold. Haptic per tap. One selection per group. **75-min chip present**. Defaults: Gi / Class / 90 / Spar=null
- [ ] Pass

**C-02: Record button**
- Fill entry, tap Record
- Expected: Recording phase. **Gold ring + kanji + opacity pulse**. Timer at 0:00. Stop button. Cancel top-left. Gym label above ring
- [ ] Pass

**C-03: "Type instead"**
- Tap "Type instead"
- Expected: Jumps to review. Fields pre-filled from entry. Input method = text
- [ ] Pass

### Recording Phase

**C-04: Voice auto-start**
- Set pref to Voice. Navigate to Journal. Tap Log
- Expected: Recording starts immediately (skips entry). Timer running. If mic denied, falls back to entry
- [ ] Pass

**C-05: Cancel < 3 seconds**
- Start recording. Cancel within 2s
- Expected: Instant discard, no confirmation dialog. Returns to entry
- [ ] Pass

**C-06: Cancel >= 3 seconds**
- Record 4+ seconds. Cancel
- Expected: Alert: "Discard this recording?" with Keep/Discard options. Both work correctly
- [ ] Pass

**C-07: Cancel double-tap guard**
- Record 4+ seconds. Rapid double-tap Cancel
- Expected: Only one alert. `cancelRef` prevents second
- [ ] Pass

**C-08: 90-second auto-stop**
- Let recording run 90 seconds
- Expected: Auto-stops at 1:30. Transitions to processing. No crash
- [ ] Pass

**C-09: Stop Recording (happy path)**
- Record 15-30 seconds of training description. Stop
- Expected: Haptic. Processing phase with animated bars + status text
- [ ] Pass

**C-10: Stop double-tap guard**
- Double-tap Stop rapidly
- Expected: Single pipeline execution. No duplicates
- [ ] Pass

### Processing Phase

**C-11: Skip to manual entry**
- During processing, tap skip link
- Expected: Review phase with empty/default fields. Warning toast
- [ ] Pass

**C-12: Pipeline timeout (150s)**
- Toggle Airplane Mode during processing. Wait ~2.5 min
- Expected: Timeout fires. Warning toast. Review with empty fields. No infinite spinner
- [ ] Pass

### Review Phase

**C-13: All fields visible and editable**
- After successful pipeline, check every field on review
- Expected: All populated from AI. Each field tappable/editable. Techniques as chips with X. Add via autocomplete
- [ ] Pass

**C-14: Technique autocomplete**
- Type "arm" in techniques field
- Expected: Dropdown with BJJ terms (Armbar, Arm Triangle). Tap adds chip. Input clears. No duplicates in suggestions
- [ ] Pass

**C-15: Submission duplicate handling**
- Add "Triangle" twice
- Expected: Single chip with count=2, not two chips. Jiggle animation on duplicate add
- [ ] Pass

**C-16: Gym override (drop-in)**
- Tap gym chip. Search different gym. Select. Save session
- Expected: Chip shows new gym. Reset button visible. Saves with overridden `user_gym_id`
- [ ] Pass

**C-17: Save session (happy path)**
- Edit fields as desired. Tap Save
- Expected: Spinner on button. Haptic on success. Transitions to success phase. No double-save
- [ ] Pass

**C-18: Save double-tap guard**
- Rapid double-tap Save
- Expected: Single session created. Verify in Supabase: one row only
- [ ] Pass

**C-19: Cancel from review**
- On review, tap Cancel
- Expected: State resets. Navigates to Journal. No session saved
- [ ] Pass

### Success Phase (v1.1 changes)

**C-20: Done button (immediate tap)**
- After save, tap Done immediately (within 5s)
- Expected: Navigates to Journal. Auto-dismiss timer cancelled. **Stay on Journal 10+ seconds -- no unexpected navigation**
- [ ] Pass

**C-21: Auto-dismiss (wait 5s)**
- After save, don't tap anything. Wait 5 seconds
- Expected: Auto-navigates to Journal. Session visible in list
- [ ] Pass

**C-22: Done vs auto-dismiss race condition**
- After save, wait ~4.5s then tap Done
- Expected: No crash. Navigation happens once. `clearTimeout` in `onDone` prevents double-fire
- [ ] Pass

**C-23: Session count accuracy**
- Note total sessions before. Save new one. Check success count
- Expected: "You've logged N sessions total" where N = previous + 1
- [ ] Pass

### Full Paths

**C-24: Text-only end-to-end**
- Pref=Text. Entry: Gi, Open Mat, 75 min, Yes spar. Type instead. Add techniques, notes, rounds manually. Save
- Expected: No voice pipeline. `input_method: 'text'`, `transcription_status: 'skipped'`. Success screen correct
- [ ] Pass

### Edge Cases

**C-25: Tab switch mid-recording**
- Start recording. Tap Journal tab. Tap Log tab again
- Expected: Recording still active. Timer still counting. No data loss
- [ ] Pass

**C-26: Tab switch after success (useFocusEffect reset)**
- On success screen, tap Journal tab, then Log tab
- Expected: Logger resets to initial state. Previous session data cleared. Timer killed
- [ ] Pass

**C-27: Network loss during save**
- Complete review. Airplane Mode ON. Tap Save
- Expected: Error toast: "Could not save your session. Please try again." Save re-enables. Turn off Airplane Mode, retry works
- [ ] Pass

**C-28: Network loss during voice pipeline**
- Record session. Airplane Mode before stopping. Stop. Skip or wait for timeout. Fill manually. Save (with network back)
- Expected: Pipeline fails gracefully. Manual entry works. Audio queued for offline retry if local file exists
- [ ] Pass

**C-29: Gold ring visual confirmation (v1.1)**
- Enter recording phase
- Expected: Gold-bordered ring with kanji. Opacity pulse (not scale). **No red circle anywhere**
- [ ] Pass

**C-30: Entry phase cancel**
- On entry, tap Cancel top-left
- Expected: Navigates to Journal. No data saved
- [ ] Pass

---

## Ship Decision

| Criteria | Result |
|---|---|
| `npx tsc --noEmit` | [ ] Pass |
| Suite A: ___/21 | |
| Suite B: ___/13 | |
| Suite C: ___/30 | |
| **Total: ___/64** | |
| P0 blockers? | [ ] Yes / [ ] No |

**Ship if:** 64/64 pass + TypeScript clean. Run `bash build.sh` with Drew's approval.

**If any fail:** Document failure, classify as P0 (blocker) / P1 (fix before ship) / P2 (acceptable for beta). Fix P0/P1 before shipping.
