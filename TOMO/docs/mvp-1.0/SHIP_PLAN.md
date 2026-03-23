# TOMO MVP 1.0 — Ship Plan

**Last Updated:** March 7, 2026 (revised)
**Target:** iOS TestFlight with 5-10 testers
**Timeline:** 8 weeks
**Builder:** Drew (vibe coder) + Claude Code
**Feature Spec:** See `FEATURE_SPEC.md` for exact scope

---

## Prerequisites (Do Before Week 1)

These take time to activate. Start immediately.

- [ ] **Apple Developer Account** — developer.apple.com, $99/year, up to 48hrs to activate
- [ ] **Supabase account** — supabase.com (free)
- [ ] **AssemblyAI account** — assemblyai.com ($50 free credit)
- [ ] **Anthropic API account** — console.anthropic.com (for Claude Haiku extraction)
- [ ] **Expo account** — expo.dev (free)
- [ ] **Sentry account** — sentry.io (free tier)
- [ ] **Install Xcode** — Mac App Store (~12GB download, takes a while)
- [ ] **Install Node.js 18+** — nodejs.org
- [ ] **Physical iPhone** — real device testing is required, not optional

**Note:** Do NOT globally install `expo-cli`. All Expo commands use `npx expo ...` or `npx create-expo-app@latest`.

---

## Expo Setup Guidance

### SDK and Project Creation

Use a current, explicitly chosen Expo SDK. At time of writing, target **SDK 52+** (or whatever is current stable when starting). Create the project with:

```bash
npx create-expo-app@latest tomo
```

This creates a TypeScript project with the current stable SDK. Pin the SDK version in `app.json` and do not leave it implicit.

### Development Builds vs Expo Go

**Expo Go is for earliest smoke testing only.** This app requires device audio recording, microphone permissions, and real iOS behavior. The normal development workflow is:

1. Use Expo Go briefly to verify basic navigation and layout
2. Switch to **development builds** as soon as audio recording is needed
3. Use `npx expo run:ios` or generate a dev build via EAS for physical device testing
4. All real feature testing happens on a development build on a physical iPhone

### Build Pipeline

The real path to TestFlight:

```
create app → configure deps → run locally (simulator) →
validate on physical device (dev build) →
connect iOS signing / EAS → produce internal build →
ship to TestFlight
```

### Audio Recording Library

**Preferred:** `expo-audio` (current Expo audio API)
**Fallback:** `expo-av` (legacy, still works but deprecated for new projects)

If `expo-audio` does not support a needed recording feature at implementation time, use `expo-av` temporarily and document why. Keep the project in Expo managed workflow — do not eject or add custom native code unless there is a clear blocker.

### iOS Configuration

Configure in `app.json` / `app.config.js`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSMicrophoneUsageDescription": "TOMO uses your microphone to record voice session logs after training."
      }
    },
    "plugins": [
      "expo-audio"
    ]
  }
}
```

---

## Phase 1: Foundation (Weeks 1-2)

**Goal:** App running on physical device with auth + database + design system.

### Week 1: Project Setup + Backend

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 1.1 | Create Expo project | `npx create-expo-app@latest tomo`, verify SDK version, configure `app.json` | Node.js | 0.5 |
| 1.2 | Configure project structure | Set up folder structure: `/src/screens`, `/src/components`, `/src/services`, `/src/config`, `/src/hooks`, `/src/types` | 1.1 | 1 |
| 1.3 | Install core dependencies | React Navigation, expo-audio, @supabase/supabase-js, @sentry/react-native | 1.1 | 1 |
| 1.4 | Set up React Navigation | Bottom tab navigator (Journal, Log, Profile) + stack navigators for each tab | 1.3 | 2 |
| 1.5 | Create Supabase project | New project on supabase.com, note URL + anon key | Supabase account | 0.5 |
| 1.6 | Deploy database schema | Create `profiles` and `sessions` tables with RLS policies (SQL from FEATURE_SPEC.md). Includes pipeline metadata columns. | 1.5 | 1 |
| 1.7 | Configure Supabase Auth | Enable email auth + Apple Sign-In provider | 1.5, Apple Dev Account | 2 |
| 1.8 | Create private storage bucket | `audio-recordings` bucket, **private** (not public), configure storage RLS policies for per-user access | 1.5 | 1 |
| 1.9 | Environment config | Create `.env` with SUPABASE_URL, SUPABASE_ANON_KEY, ASSEMBLYAI_KEY | 1.5 | 0.5 |
| 1.10 | Supabase client service | `/src/services/supabase.ts` — initialize client, export typed helpers | 1.6, 1.9 | 1 |

### Week 2: Auth + Design System + Device Validation

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 2.1 | Auth screens | Sign Up, Log In, Forgot Password screens | 1.4, 1.7 | 3 |
| 2.2 | Auth state management | Auth context provider, session persistence, auto-redirect | 2.1 | 2 |
| 2.3 | Apple Sign-In | Configure expo-apple-authentication, connect to Supabase Auth | 2.1, Apple Dev Account | 3 |
| 2.4 | Port design tokens | Convert CSS variables to React Native StyleSheet constants: colors, spacing, typography | 1.2 | 2 |
| 2.5 | Core UI components | Port from prototype: Button, Badge (belt + training type) | 2.4 | 2 |
| 2.6 | Icon system | Convert SVG icons to react-native-svg components (start with ~20 most-used) | 2.4 | 2 |
| 2.7 | Sentry setup | Install @sentry/react-native, configure DSN, verify error capture | 1.3 | 1 |
| 2.8 | Development build + device test | Generate first development build via EAS or `npx expo run:ios`. Verify app launches on physical iPhone, auth works end-to-end. Do NOT rely solely on Expo Go. | All above | 2 |

**Phase 1 Checkpoint:** App runs on physical iPhone via development build. Can sign up, log in, see empty tab screens. Design system looks like TOMO.

---

## Phase 2: Core Screens (Weeks 3-5)

**Goal:** All 5 MVP features working end-to-end.

### Week 3: Onboarding + Profile

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 3.1 | Onboarding flow router | Detect first launch (no profile), redirect to onboarding stack | Phase 1 | 1 |
| 3.2 | Welcome screen | Logo, value prop, "Get Started" CTA | 3.1 | 1 |
| 3.3 | About You screen | Name input, belt picker, stripes picker | 3.1 | 2 |
| 3.4 | Your Training screen | Gym picker (search + browse by affiliation + manual entry), frequency picker, optional goals + experience | 3.1 | 4 |
| 3.5 | Port gym database | Convert `prototype/src/data/gyms.ts` to React Native compatible format | 3.4 | 1 |
| 3.6 | Get Started screen | Voice/text toggle, mic permission request, "Start Logging" CTA | 3.1 | 2 |
| 3.7 | Save profile to Supabase | Write all onboarding fields to `profiles` table, set `onboarding_complete = true` | 3.2-3.6, 1.10 | 1 |
| 3.8 | Profile screen (minimal) | Display name, belt, stripes, gym. Logging preference toggle. Privacy policy link, terms link, sign out. No stats widgets. | 1.10 | 2 |
| 3.9 | Profile edit | Tap-to-edit fields (name, belt, stripes, gym), save to Supabase, toast confirmation | 3.8 | 2 |

### Week 4: Session Logger (Voice Pipeline)

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 4.1 | Entry screen | Training mode selector (gi/nogi/mixed), session kind selector (class/open mat/drilling/etc), duration picker (60/90/120), sparring toggle, Record button, "Type instead" link | Phase 1 | 3 |
| 4.2 | Voice recording | expo-audio (or expo-av fallback) audio capture, waveform visualization, timer, 90s auto-stop, save to local file. Test on physical device. | 4.1 | 4 |
| 4.3 | Audio upload (private) | Upload recording to **private** Supabase Storage bucket, generate signed URL (15 min expiry) for AssemblyAI | 4.2, 1.8 | 2 |
| 4.4 | AssemblyAI transcription | Send signed audio URL to AssemblyAI API with BJJ word_boost, poll for completion, handle errors | 4.3 | 3 |
| 4.5 | Deploy extraction Edge Function | Supabase Edge Function: receives transcript, calls Claude Haiku 4.5, validates JSON output, returns structured result with error handling (see FEATURE_SPEC.md for hardened implementation) | 1.5, Anthropic account | 3 |
| 4.6 | Call extraction from app | Send transcript + pre-selected fields to Edge Function, handle success and failure responses, populate review form or show fallback | 4.4, 4.5 | 2 |
| 4.7 | Processing screen | Loading animation while transcription + extraction run (3-8 seconds) | 4.4 | 1 |
| 4.8 | Review screen | Display all extracted fields in editable form. All fields visible and editable for all users (no belt-based locking). Show extraction failure fallback (empty form + transcript). Transcript collapsible at bottom. | 4.6 | 4 |
| 4.9 | Submission picker | Reusable component for selecting submission types + counts (given/received) | 4.8 | 2 |
| 4.10 | Save session | Write session to Supabase `sessions` table with pipeline metadata (input_method, transcription_status, extraction_status, schema_version, extraction_model). Increment `session_count` in profile. Show success screen. | 4.8 | 2 |
| 4.11 | Text-only path | Skip recording, show review screen with empty fields for manual entry. Sets `input_method = 'text'`, `transcription_status = 'skipped'`, `extraction_status = 'skipped'`. | 4.8 | 1 |
| 4.12 | Success screen | Belt-personalized message, "View in Journal" CTA | 4.10 | 1 |
| 4.13 | Device validation: voice pipeline | Test full voice pipeline on physical iPhone: record → upload → transcribe → extract → review → save. Fix any device-specific issues. | 4.1-4.12 | 2 |

**This is the hardest week.** Tasks 4.2-4.6 are the voice pipeline — three external services chained together. Budget extra time here. The text-only path (4.11) works independently and can ship even if voice is blocked.

### Week 5: Journal + Session Detail

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 5.1 | Journal list screen | Query sessions from Supabase, group by date (Today/Yesterday/This Week/Earlier), pull-to-refresh | 1.10 | 3 |
| 5.2 | Session card component | Training mode badge, session kind label, duration, topic preview, sparring indicator. Same card for all users. | 5.1 | 2 |
| 5.3 | Training mode filter | Toggle filter: All / Gi / No-Gi | 5.1 | 1 |
| 5.4 | Empty state | Encouragement message + "Log Your First Session" CTA when no sessions exist | 5.1 | 1 |
| 5.5 | Session detail screen | Navigate from card tap. Header (date/mode/kind/duration), AI narrative summary, all field sections visible for all users. | 5.1 | 3 |
| 5.6 | AI narrative summary | Generate natural language recap from session fields (client-side template, no LLM needed) | 5.5 | 1 |
| 5.7 | Bottom sheet edit modal | Reusable bottom sheet component. Tap section → sheet slides up with edit form. | 5.5 | 3 |
| 5.8 | Edit: training details | Mode, kind, duration, sparring toggle in bottom sheet | 5.7 | 1 |
| 5.9 | Edit: techniques | Add/remove technique chips | 5.7 | 2 |
| 5.10 | Edit: sparring details | Rounds picker, submission picker (reuse from 4.9) | 5.7 | 1 |
| 5.11 | Edit: insights + notes | Worked well, struggles, free-form notes text fields | 5.7 | 1 |
| 5.12 | Edit: energy + mood | 1-5 picker | 5.7 | 0.5 |
| 5.13 | Edit: date + time | Date picker (last 90 days), time picker, confirmation dialog, reposition in journal | 5.7 | 2 |
| 5.14 | Save edits | Update session in Supabase, set `edited_after_ai = true`, toast confirmation | 5.8-5.13 | 1 |
| 5.15 | Delete session | "Delete Session" button at bottom, confirmation dialog, soft delete (`deleted_at`), navigate back with toast | 5.5 | 1 |
| 5.16 | Floating action button | "Log Session" FAB on Journal screen for quick access | 5.1 | 1 |

**Phase 2 Checkpoint:** Full app working on physical device. Can onboard, record voice session, see it transcribed and extracted, browse journal, edit any session, delete sessions. Extraction failures are handled gracefully.

---

## Phase 3: Polish (Weeks 6-7)

**Goal:** Production-quality feel. Handle edge cases. Ready for real humans.

### Week 6: Error States + Offline

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 6.1 | Loading skeletons | Skeleton placeholder components for journal list, session detail, profile | Phase 2 | 2 |
| 6.2 | Error states | Network error screen, permission denied screen, generic error boundary | Phase 2 | 2 |
| 6.3 | Toast notifications | Success/error/warning toast component. Use for: session saved, edit saved, session deleted, upload failed. | Phase 2 | 1 |
| 6.4 | Offline detection | Network status listener, show banner when offline | Phase 2 | 1 |
| 6.5 | Offline audio queue | Save recordings to AsyncStorage when offline. Process queue when connection restores. Status indicator: "1 session pending upload" | 6.4 | 3 |
| 6.6 | Input validation | Onboarding field validation, session form validation, prevent empty saves | Phase 2 | 2 |
| 6.7 | Keyboard handling | KeyboardAvoidingView on all forms, auto-dismiss on tap outside | Phase 2 | 1 |

### Week 7: Visual Polish + Testing

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 7.1 | App icon | Design 1024x1024 icon, configure in app.json | — | 2 |
| 7.2 | Splash screen | Design splash screen, configure in app.json | — | 1 |
| 7.3 | Typography pass | Verify Unbounded (headlines), Inter (body), weight 500+ minimum across all screens | Phase 2 | 2 |
| 7.4 | Touch target audit | Verify all primary actions are 56-80px, all secondary actions are 44px+ | Phase 2 | 1 |
| 7.5 | Device testing: iPhone SE | Test on smallest screen. Fix any layout overflow or truncation. | Phase 2 | 2 |
| 7.6 | Device testing: iPhone 15 Pro Max | Test on largest screen. Fix any spacing or scaling issues. | Phase 2 | 1 |
| 7.7 | Voice pipeline end-to-end test | Record 10 real BJJ session descriptions on physical device, verify transcription accuracy and extraction quality. Test extraction failure fallback. | Phase 2 | 3 |
| 7.8 | Haptic feedback | Add subtle haptics on save, delete, record start/stop | Phase 2 | 1 |
| 7.9 | Transition animations | Screen transitions, bottom sheet animations, card press states | Phase 2 | 2 |

**Phase 3 Checkpoint:** App feels finished. Handles bad connections, edge cases, and different screen sizes gracefully. Voice pipeline tested with real BJJ recordings.

---

## Phase 4: TestFlight (Week 8)

**Goal:** App in testers' hands.

| # | Task | Description | Dependencies | Est. Hours |
|---|------|-------------|-------------|------------|
| 8.1 | App Store Connect listing | Create app listing: name (TOMO), bundle ID, category (Health & Fitness), primary language | Apple Dev Account | 1 |
| 8.2 | App metadata | App description, keywords, support URL, privacy policy URL | 8.1 | 1 |
| 8.3 | Privacy policy | Host privacy policy at a URL (can use existing `docs/legal/PRIVACY_POLICY.md` converted to HTML on Cloudflare) | — | 1 |
| 8.4 | Configure EAS | `eas.json` configuration for iOS builds, link Apple Developer credentials, configure signing | Apple Dev Account, Expo account | 1 |
| 8.5 | Production EAS build | Run `eas build --platform ios --profile production` (or preview profile). This should NOT be the first build — dev builds should have happened in Phase 1-2. | 8.4 | 1 |
| 8.6 | Fix build issues | Address any production build failures (common: missing native deps, signing issues). May take multiple builds. | 8.5 | 3 |
| 8.7 | Submit to TestFlight | Upload build to App Store Connect, fill "What to Test" description | 8.5 | 1 |
| 8.8 | TestFlight review | Apple reviews TestFlight builds (typically 24-48 hours). Monitor for issues. | 8.7 | 0 (waiting) |
| 8.9 | Add testers | Add 5-10 tester email addresses. Each receives install invitation via TestFlight app. | 8.8 | 0.5 |
| 8.10 | Tester instructions | Write brief guide: what to test, how to give feedback, known limitations | 8.9 | 1 |
| 8.11 | Feedback channel | Set up Slack channel or simple form for tester feedback. Key questions: voice accuracy, edit flow, repeat usage intent. | 8.9 | 1 |
| 8.12 | Monitor first 48 hours | Watch Sentry for crashes, check Supabase dashboard for usage, review pipeline metadata (extraction_status, edited_after_ai) for AI quality signal. | 8.9 | 2 |

**Phase 4 Checkpoint:** App is live on TestFlight. Real BJJ practitioners are logging sessions with their voice.

---

## Dependency Graph

```
Prerequisites (accounts, installs, physical iPhone)
    |
    v
Phase 1: Foundation
    |-- 1.1-1.4: Expo project + navigation
    |-- 1.5-1.8: Supabase (DB, auth, private storage)
    |-- 1.9-1.10: Connect app to Supabase
    +-- 2.1-2.8: Auth + design system + DEVELOPMENT BUILD on device
         |
         v
Phase 2: Core Screens
    |-- Week 3: Onboarding + Profile (3.1-3.9)
    |         |
    |-- Week 4: Voice Pipeline (4.1-4.13)  <-- HIGHEST RISK
    |         |
    +-- Week 5: Journal + Detail + Edit (5.1-5.16)
         |
         v
Phase 3: Polish
    |-- Week 6: Error states + offline (6.1-6.7)
    +-- Week 7: Visual polish + testing (7.1-7.9)
         |
         v
Phase 4: TestFlight
    +-- Week 8: Production build + submit + distribute (8.1-8.12)
```

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Voice pipeline integration complexity (audio + AssemblyAI + Haiku) | High | Medium | Text-only path works independently. Ship text-only if voice blocks. Add voice in fast follow. |
| expo-audio recording issues on device | Medium | Medium | Fall back to expo-av (legacy but stable). Test on physical iPhone early (Week 2). |
| AssemblyAI BJJ term accuracy below 85% | Medium | Low | 180-term word_boost list already written. Test early in Week 4. Tune boost weights if needed. |
| AI extraction returns malformed JSON | Medium | Medium | Edge Function includes validation + try/catch. Fallback shows empty form + transcript for manual entry. |
| Apple Sign-In configuration | Medium | Medium | Follow Expo docs exactly. Budget 3 hours. Can ship with email-only auth and add Apple later. |
| EAS build failures | Medium | High (first build) | Generate development builds in Week 2, not Week 8. Surface issues early. |
| Supabase RLS misconfiguration | High | Low | Copy SQL from FEATURE_SPEC.md. Test by attempting cross-user data access. |
| Gym picker complexity (120+ gyms, search, manual entry) | Low | Medium | Can simplify to text-only input for MVP if search UI takes too long. Add browse later. |

---

## Success Criteria

| Metric | Target |
|--------|--------|
| App installs on iOS 15+ | 100% |
| Download to first session | < 3 minutes |
| Voice transcription accuracy (BJJ terms) | > 85% |
| Crash rate | < 1% |
| Cold start time | < 3 seconds |
| Testers completing 3+ sessions | 5 out of 10 |
| Edit rate on AI-extracted fields | < 30% |
| Extraction failure rate | < 5% |

---

## What Comes After TestFlight (v1.1 Planning)

Based on tester feedback, likely additions:

1. **Stats Dashboard** — white belt view first (weekly progress ring, calendar heat map, session count hero)
2. **Coaching Intelligence** — route open-ended queries to Claude Sonnet 4.6 (separate Edge Function)
3. **Injury Tracking** — body part picker after each session, pattern detection
4. **Profile Stats** — total hours, streaks, member since, progress widgets
5. **Progressive Profiling** — milestone questions at session 3, 5, 7, 10, etc.
6. **Technique Library** — browse by position, curated videos (existing prototype has this built)
7. **Push Notifications** — training reminders based on target frequency
8. **Audio retention policy** — finalize before public App Store submission
9. **Belt-based field personalization** — evaluate whether hiding/emphasizing fields by belt helps UX

---

## Total Estimated Hours

| Phase | Hours |
|-------|-------|
| Phase 1: Foundation | ~22 |
| Phase 2: Core Screens | ~55 |
| Phase 3: Polish | ~22 |
| Phase 4: TestFlight | ~13 |
| **Total** | **~112 hours** |

At ~15 hours/week of focused development time, that's ~8 weeks.
With Claude Code accelerating boilerplate, realistic range is **6-8 weeks**.
