# MVP 1.0 — Session Notes

Running log of planning decisions. Most recent session first.

---

## Session 3 — March 9, 2026

### Context
First time running the app on a real iOS environment. Goal was to get the simulator working and validate the app launches end-to-end.

### Environment Resolved
- **macOS:** 26.3.1 (Tahoe) — not 14.7.6 Sonoma as previously documented
- **Xcode:** 26.3 installed, license accepted
- **iOS Simulator:** 26.3.1 runtime (8.4 GB download), iPhone 17 Pro
- **CocoaPods:** 1.16.2 installed via Homebrew (auto during first build)
- **Expo:** logged in as `dgarraway`

### Issues Hit & Resolved

1. **Expo Go networking failure** — Simulator couldn't reach Metro bundler via LAN IP (`exp://192.168.1.195:8081`) or localhost (`exp://127.0.0.1:8081`). iOS 26 simulator + Expo Go networking appears broken. **Fix:** Switched to `npx expo run:ios` native dev build — bypasses Expo Go entirely.

2. **Expo Go auth required** — When running Metro in background, Expo Go prompted for login but couldn't get input. **Fix:** `npx expo login` in terminal.

3. **Sentry build failure** — Native build compiled all code successfully but failed at "Upload Debug Symbols to Sentry" step. Missing `organization` and `project` config. **Fix:** `SENTRY_DISABLE_AUTO_UPLOAD=true` env var for dev builds. Sentry still captures crashes at runtime — only source map upload is skipped.

4. **Supabase email confirmation** — Sign-up email confirmation link redirected to unreachable URL. **Fix:** Disabled "Confirm email" in Supabase Auth settings. Tracked as LAUNCH-001 to re-enable before public launch.

### App Verified Working
- Auth screen: sign up with email/password ✅
- Onboarding: full 4-screen flow completed ✅
- Journal: empty state, filter pills, FAB, tab bar all rendering correctly ✅
- Design system: dark theme, gold accents, TOMO branding, correct typography ✅

### Package Version Warnings (Non-blocking)
Metro reports these packages should be downgraded for Expo 55 compatibility:
- `@react-native-async-storage/async-storage@3.0.1` → expected `2.2.0`
- `react-native-safe-area-context@5.7.0` → expected `~5.6.2`
- `react-native-screens@4.24.0` → expected `~4.23.0`

No issues observed yet, but may need to pin if problems appear.

### What's Left (Blocked on Apple Developer Account)
1. Apple Sign-In configuration
2. EAS Build for physical device
3. TestFlight submission

### Physical Device Build — Completed
- Built and deployed to Andrew's iPhone (4) via `npx expo run:ios --device 00008120-001E30192270201E`
- Signing: Drew Garraway (Personal Team), Apple Development cert, Xcode Managed Profile
- Required: Developer Mode on iPhone + trust developer in Settings
- Key learning: must build via `npx expo run:ios --device`, NOT Xcode Play button (Xcode builds don't embed Metro URL)
- Metro must be running on same WiFi for dev builds to load JS

### Device Build Command (for future sessions)
```bash
cd /Users/drewgarraway/drew-garraway-consulting/TOMO/tomo
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E
```

### Bugs Found During Testing
1. **Recording failed on iOS** — needed `AudioModule.setAudioModeAsync({ allowsRecording: true })` before recording. FIXED.
2. **Audio upload fails** — file:// URI from expo-audio can't be read by `fetch()` or `XMLHttpRequest` on iOS. 3rd attempt uses `ExpoFile` from expo-file-system (implements Blob). **UNTESTED — resume here next session.**

### What's Left (Not blocked)
1. ~~Physical device build~~ ✅
2. **Test audio upload fix** (ExpoFile approach) — RESUME HERE
3. If upload works: test full voice pipeline (transcribe → extract → review)
4. Session CRUD testing (create via text path, edit, delete)
5. User testing on device (Drew testing over several days)
6. Sentry org/project config

---

## Session 2 — March 8, 2026

### Context
Session 1 built all 32 files (~8,834 lines) with 0 TypeScript errors. Session 2 focused on polish, resilience, and missing features while waiting for Apple Developer account activation.

### Completed (Session 2)

**New Components & Screens:**
- `NetworkError.tsx` — OfflineBanner (auto-show when offline) + NetworkErrorScreen (full-screen retry)
- `PrivacyPolicyScreen.tsx` — In-app scrollable privacy policy (dark theme, accessible from Profile)
- `privacy-policy.html` — Standalone HTML version for App Store listing
- `Skeleton.tsx` — Loading skeletons for Journal, SessionDetail, Profile (pulsing animated bars)
- `offline-queue.ts` — AsyncStorage-backed queue for failed audio uploads with automatic retry on reconnect

**Auth Enhancements:**
- Password reset flow via `supabase.auth.resetPasswordForEmail()`
- "Forgot password?" link on sign-in screen
- Replaced all `Alert.alert` calls with toast notifications across auth, onboarding, and session screens
- Offline queue cleared on sign out (prevents data leaks between users)

**Profile Screen — Full Edit Support:**
- Tap-to-edit: name, belt, stripes, gym, training frequency, logging preference
- 5 bottom sheet edit modals (same pattern as SessionDetail)
- Privacy policy link with Shield icon + in-app navigation
- Version text (TOMO v1.0.0)

**Session Detail — New Edit Sheets:**
- Edit Training Details: mode (Gi/No-Gi/Mixed), session type (5 options), duration (6 presets), sparring toggle
- Edit Date: DateTimePicker with 90-day limit, dark theme
- Audio file cleanup on session soft-delete

**Sentry Integration:**
- `Sentry.init()` in App.tsx (disabled in dev, 0.2 trace sample rate)
- `Sentry.wrap(App)` for crash reporting
- ErrorBoundary wired to `Sentry.captureException()`
- Plugin added to app.config.ts

**Haptic Feedback (expo-haptics):**
- `haptics.ts` utility: light/medium/heavy/success/warning/error/selection
- Wired into: all onboarding chip selections, session logger entry chips, journal filter pills, session save/delete, profile save, record start/stop

**Press State Feedback:**
- Comprehensive audit across all screens (~50+ Pressable components)
- Pattern: `style={({ pressed }) => [styles.x, pressed && { opacity: 0.7 }]}`
- Covers: onboarding (belts, stripes, frequency, goals, experience, gym picker, voice/text toggle), session logger (entry chips, review chips, tags, save/cancel), session detail (all sections, edit sheets), journal (filter pills, session cards), profile (all rows, edit sheets), auth (submit, forgot password, toggle mode)

**Offline Resilience:**
- OfflineBanner shows when offline (NetInfo listener)
- Failed audio uploads queued to AsyncStorage for retry
- Queue processed automatically when connectivity returns
- Queue cleared on sign out

**Audits Completed:**
- Typography: All fontWeight values >= 500 (no violations)
- Touch targets: All interactive elements meet 44px+ minimum
- Input validation: Onboarding requires name + belt, auth validates email + password, session logger has sensible defaults
- Keyboard handling: KeyboardAvoidingView on all text input screens

### TypeScript Status
0 errors after all changes.

### What's Left (Blocked on Apple Developer)
1. Apple Sign-In configuration
2. EAS Build setup + first dev build
3. Physical device testing
4. TestFlight submission

### What's Left (Not blocked, lower priority)
- Edge Function deployment (needs Supabase CLI setup)
- App icon design (1024x1024)
- Splash screen
- ~~Xcode install~~ — downloading (macOS 26.3.1 Tahoe confirmed)

---

## Session 1 (revision pass) — March 7, 2026

### Refinements Applied

After the initial planning session, a systematic review was done to harden the plan for implementation. The following changes were made across all docs:

**Data model: Split trainingType into two fields**
- `trainingMode`: gi / nogi / mixed / unknown — what you wore
- `sessionKind`: class / open_mat / drilling / competition / other — what you did
- The old `trainingType` field mixed these concepts (e.g. "openmat" is a session kind, not a mode). Splitting them now prevents confusion later and enables better filtering/analytics.
- Updated everywhere: TypeScript interface, SQL schema, extraction prompt, entry screen UI, review screen, edit screen, journal cards.

**Removed belt-based field locking**
- Previous plan: white belts see struggles, rounds, subs greyed out. Blue+ see all fields.
- New plan: all users see and edit all fields. Belt personalization is copy/tone/defaults only.
- Rationale: builds trust during TestFlight. Users should see all their data. We don't have enough tester feedback to know if hiding fields helps or confuses. Evaluate post-TestFlight.

**Private audio storage**
- Previous plan: upload to Supabase Storage, get public URL, send to AssemblyAI.
- New plan: private bucket with RLS. Generate short-lived signed URL (15 min expiry) for AssemblyAI.
- Rationale: user voice recordings should never be publicly accessible. Basic privacy hygiene.
- Added retention policy note: must finalize before App Store submission.

**Hardened extraction layer**
- Previous plan: `JSON.parse(message.content[0].text)` with no error handling.
- New plan: Edge Function includes `validateExtraction()`, try/catch for parse and API errors, structured error response, and user-facing fallback (empty form + transcript for manual entry).
- Added `ExtractionResponse` interface with `success`, `data`, `error`, and `metadata` fields.
- User is never blocked by AI failure — they can always fill fields manually.

**Pipeline metadata fields added to sessions table**
- `input_method`: 'voice' | 'text'
- `transcription_status`: 'pending' | 'completed' | 'failed' | 'skipped'
- `extraction_status`: 'pending' | 'completed' | 'failed' | 'skipped'
- `edited_after_ai`: boolean — tracks if user modified AI-extracted data
- `schema_version`: integer — enables future migrations
- `extraction_model`: string — which model version was used
- `transcription_error` / `extraction_error`: error messages for debugging
- These are internal fields for debugging and quality tracking. Not shown in UI.

**Simplified MVP Profile**
- Removed: total hours, streaks, member since, target frequency display, training goals display
- Kept: name, belt, stripes, gym, logging preference toggle, privacy policy, terms, sign out
- The underlying data model still stores target_frequency, training_goals, etc. — they're just not surfaced in the MVP Profile UI. Stats widgets ship with v1.1 Dashboard.

**Expo modernization**
- Replaced `npm install -g expo-cli` with `npx create-expo-app@latest` and `npx expo ...` commands
- Replaced `expo-av` references with `expo-audio` (preferred) with expo-av as documented fallback
- Moved device testing earlier — development build in Week 2, not just "Install Expo Go"
- Expo Go is for earliest smoke testing only. Development builds are the normal workflow.
- Added iOS microphone permission config (`NSMicrophoneUsageDescription` in app.json)
- Added `expo-audio` plugin configuration
- Explicit SDK version pinning recommended

**Renamed `audioUrl` to `audioPath`**
- Field now stores a private storage path (e.g. `userId/sessionId.aac`), not a public URL
- Reflects the private bucket architecture

**Cross-doc consistency pass**
- All four docs now agree on: field names, data model, storage architecture, belt locking policy, Expo setup, profile scope
- Session Logger PRD in main docs still references belt visibility rules — the README notes this is overridden in MVP
- Old FEATURES.md data models use `trainingType` — the README notes MVP uses the updated split

---

## Session 1 (continued) — March 7, 2026

### All Decisions Resolved

**Onboarding:** Full — name, belt, stripes, gym picker (120+ gyms), target frequency, logging preference, optional goals + experience level.

**AI Extraction:** Claude Haiku 4.5 via Supabase Edge Function. Two-model architecture decided:
- Haiku 4.5 for extraction (every session, ~$0.001/call)
- Sonnet 4.6 for coaching intelligence (v1.1+, user-initiated queries requiring reasoning across session history)
- Model is a config variable in the Edge Function — easy to swap

**Transcription:** AssemblyAI confirmed over Whisper. Key reasons:
- Custom vocabulary (`word_boost`) with 180 BJJ terms — Whisper has no equivalent without fine-tuning
- Cheaper ($0.0025/min vs $0.006/min)
- 30% lower hallucination rate (critical for tired, mumbling users)

**Edit scope:** Full — includes date/time editing (last 90 days, no future dates) and soft delete with confirmation dialog.

### Documents Created
- `FEATURE_SPEC.md` — complete spec with data models, SQL schemas, extraction prompt, API examples
- `SHIP_PLAN.md` — 4 phases, 65+ tasks, dependency graph, risk register, ~112 hours estimated
- `TOMO_MVP_PLAN.md` on Desktop — NotebookLM-ready overview of entire plan

### Cost Analysis Completed
- Development: ~$99 (just Apple Developer Account, everything else free tier)
- TestFlight (10 users): ~$1.12/month
- At 1,000 users: ~$200-250/month (AssemblyAI + Haiku + Supabase Pro)
- Coaching intelligence (Sonnet) adds ~$50-150/month at 1,000 users but is a Pro subscription feature

### Next Step
Drew needs to sign up for accounts (Apple Developer first — 48hr activation) then start Phase 1 with Claude Code.

---

## Session 1 — March 7, 2026

### Context
Drew wants to ship TOMO MVP 1.0 to iOS TestFlight ASAP. We reviewed all existing product docs (FEATURES.md, PRDs, voice transcription spec, belt curriculum, development strategy analysis, iOS deployment plan) to understand the full scope, then narrowed to a tight MVP.

### Key Decision: MVP Scope
Drew identified the most important features for TestFlight:
- **Onboarding** — get user set up
- **Profile** — manage user data
- **Data ingestion with voice-to-text** — the core product bet
- **Journal page with editing** — review and correct captured data

**Rationale:** This is the core data loop — Capture > Store > Review > Edit. Everything else (stats dashboards, technique library, insights, belt progress visualization) is just views on top of this data. Ship the loop first, validate voice-first logging works, then layer on features.

### Strategic Assessment

**What's strong:**
- ~180 BJJ vocabulary terms already defined for AssemblyAI `word_boost`
- Full 3-tier data capture architecture designed (Capture > Extract > Enrich)
- Session Logger PRD is complete with field definitions
- Voice transcription spec covers integration, error handling, offline queue, costs
- Belt personalization engine is pure TypeScript — 100% portable to React Native
- ~70% of prototype React code is portable

### Example: What the AI Extraction Layer Must Handle

User says after training:
> "Did about an hour and a half today, gi class. Coach taught knee slice passing, I drilled it with Marcus. Rolled three rounds, got caught in a triangle, but I hit an armbar from closed guard which felt great. Shoulder is a little sore."

AI must extract:
```json
{
  "durationMinutes": 90,
  "trainingMode": "gi",
  "sessionKind": "class",
  "techniquesDrilled": ["knee slice pass"],
  "didSpar": true,
  "sparringRounds": 3,
  "submissionsReceived": [{"type": "triangle choke", "count": 1}],
  "submissionsGiven": [{"type": "armbar", "count": 1}],
  "workedWell": ["armbar from closed guard"],
  "struggles": [],
  "injuries": ["shoulder soreness"],
  "energyLevel": null
}
```
