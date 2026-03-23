# TOMO MVP — Session 2 Implementation Plan

**Date:** March 8, 2026
**Context:** Session 1 built all core screens. Apple Developer account pending (expected by March 12).
**Goal:** Do everything possible while waiting for Apple, so we're ready to build + test the moment it activates.

---

## Current Status (End of Session 1)

### What's Done

| Category | Files | Lines | Status |
|----------|-------|-------|--------|
| **Navigation** | RootNavigator, OnboardingNavigator, MainTabNavigator | 240 | Complete |
| **Auth** | AuthScreen (email sign in/up) | 223 | Complete |
| **Onboarding** | Welcome, AboutYou, YourTraining, GetStarted | 1,328 | Complete |
| **Session Logger** | 5-phase voice pipeline (entry → record → process → review → success) | 1,073 | Complete |
| **Journal** | Date-grouped list, filter pills, session cards, pull-to-refresh | 403 | Complete |
| **Session Detail** | Full view + 7 edit bottom sheets + delete | 906 | Complete |
| **Profile** | Avatar, belt badge, stats, sign out | 221 | Complete |
| **Services** | Supabase client, CRUD helpers, Edge Function callers | 334 | Complete |
| **Hooks** | useAuth (4 states), useVoiceRecorder (expo-audio) | 424 | Complete |
| **Components** | 25 SVG icons | 330 | Complete |
| **Config** | Design tokens, belt system (6 files) | 2,567 | Complete |
| **Data** | 120+ gym database, types, journal helpers | 785 | Complete |
| **Total** | **32 files** | **~8,834** | **TypeScript: 0 errors** |

### Accounts Created
- [x] Supabase — project `whzycopfjvwmsgzfqvig` running, migration deployed, storage bucket created
- [x] Sentry — DSN configured in app.config.ts
- [x] AssemblyAI — API key saved
- [x] Anthropic — API key saved
- [x] Expo — account created
- [ ] **Apple Developer — PENDING activation (expected by March 12)**

### Credentials
- All saved to `/Users/drewgarraway/drew-garraway-consulting/TOMO/credentials.local` (gitignored)

---

## What's Blocked on Apple Developer Account

These tasks CANNOT proceed until the account is active:

1. **Apple Sign-In configuration** — needs Services ID + Key from Apple Developer portal
2. **EAS Build (`eas build --platform ios`)** — needs Apple Developer credentials for signing
3. **Development build on physical device** — needs provisioning profile
4. **TestFlight submission** — needs App Store Connect access
5. **Xcode code signing setup** — needs certificates from Apple

---

## Session 2: What We CAN Do Now (March 8-12)

### Priority 1: Edge Functions (No Apple dependency)

The voice pipeline's server-side is pre-built but not deployed. This work is 100% Supabase-side.

| # | Task | Est. | Details |
|---|------|------|---------|
| 1 | **Grab Supabase service_role key** | 5 min | Settings → API → service_role (secret). Save to credentials.local. Needed for Edge Function deployment. |
| 2 | **Install Supabase CLI** | 10 min | `npm install -g supabase` or `brew install supabase/tap/supabase` |
| 3 | **Link Supabase project** | 5 min | `supabase login` + `supabase link --project-ref whzycopfjvwmsgzfqvig` |
| 4 | **Set Edge Function secrets** | 5 min | `supabase secrets set ASSEMBLYAI_API_KEY=xxx ANTHROPIC_API_KEY=xxx` |
| 5 | **Deploy transcribe-audio** | 15 min | Copy from `mobile-prep/supabase/functions/`, deploy with `supabase functions deploy transcribe-audio` |
| 6 | **Deploy extract-session** | 15 min | Same pattern. Deploy with `supabase functions deploy extract-session` |
| 7 | **Test Edge Functions** | 30 min | cURL tests with sample data to verify both functions work end-to-end |

**Total: ~1.5 hours**

### Priority 2: Phase 3 Polish — Error States & UX (No Apple dependency)

These are all code changes that compile and can be verified via TypeScript. No device needed.

| # | Task | Est. | Status | Details |
|---|------|------|--------|---------|
| 8 | **Toast notification component** | 1 hr | DONE | Animated toast for: session saved, edit saved, session deleted, upload failed. Auto-dismiss after 3s. |
| 9 | **Loading skeletons** | 1.5 hr | DONE | Skeleton placeholders for: journal list, session detail, profile. Pulsing gray rectangles matching card layouts. |
| 10 | **Error boundary component** | 1 hr | DONE | React error boundary wrapping the app. Shows "Something went wrong" with retry button. Sentry error capture. |
| 11 | **Network error state** | 1 hr | DONE | OfflineBanner + NetworkErrorScreen + offline audio queue with auto-retry. |
| 12 | **Empty states polish** | 30 min | DONE | Journal: no sessions + filtered results (no Gi/No-Gi). Profile: loading skeleton. |
| 13 | **Input validation** | 1 hr | DONE | Onboarding: requires name + belt (disabled button). Auth: validates email + password. Session logger: sensible defaults. |
| 14 | **Keyboard handling** | 1 hr | DONE | KeyboardAvoidingView on auth, onboarding, session logger review phase, all edit sheets. |

### Priority 3: Visual Polish (No Apple dependency)

| # | Task | Est. | Status | Details |
|---|------|------|--------|---------|
| 15 | **App icon design** | 1 hr | TODO | 1024x1024 icon. TOMO kanji (友) on dark background with gold accent. |
| 16 | **Splash screen** | 30 min | TODO | Simple dark background + TOMO logo. |
| 17 | **Typography audit** | 1 hr | DONE | All fontWeight values >= 500. No violations found. |
| 18 | **Touch target audit** | 30 min | DONE | All interactive elements meet 44px+ minimum. Primary actions at 56-80px. |
| 19 | **Press states** | 30 min | DONE | ~50+ Pressable components audited. All have visual feedback (opacity). |
| 20 | **Haptic feedback** | 30 min | DONE | expo-haptics wired into onboarding, session logger, journal, session detail, profile. |

### Priority 4: Missing Features from SHIP_PLAN

| # | Task | Est. | Status | Details |
|---|------|------|--------|---------|
| 21 | **Profile edit** | 2 hr | DONE | 5 bottom sheet edit modals: name, belt/stripes, gym, frequency, logging preference. |
| 22 | **Edit date/time on session** | 1.5 hr | DONE | DateTimePicker with 90-day limit, dark theme. |
| 23 | **Edit training details** | 1 hr | DONE | Mode/kind/duration/sparring bottom sheet in SessionDetail. |
| 24 | **FAB on Journal** | 30 min | SKIPPED | Redundant — center tab button already provides prominent "+" access. |
| 25 | **Privacy policy page** | 1 hr | DONE | In-app PrivacyPolicyScreen + standalone HTML for App Store listing. |

### Priority 5: Install Xcode (Can start anytime)

| # | Task | Est. | Details |
|---|------|------|---------|
| 26 | **Download Xcode** | ~1 hr download | Mac App Store. ~12GB. Start this early — it's a big download. |
| 27 | **Install Xcode CLI tools** | 10 min | `xcode-select --install` after Xcode installs |
| 28 | **Accept Xcode license** | 5 min | `sudo xcodebuild -license accept` |

**Total: ~1.5 hours (mostly waiting)**

---

## Recommended Session Order

### Session 2A (next session, ~3 hours)
1. Start Xcode download in background (#26)
2. Edge Functions: grab service_role key, install CLI, deploy both functions, test (#1-7)
3. Toast notification component (#8)

### Session 2B (~3 hours)
4. Loading skeletons (#9)
5. Error boundary (#10)
6. Network error state (#11)
7. Input validation (#13)

### Session 2C (~3 hours)
8. Keyboard handling (#14)
9. Profile edit (#21)
10. FAB on Journal (#24)
11. Edit training details on SessionDetail (#23)

### Session 2D (~3 hours)
12. App icon + splash screen (#15-16)
13. Typography audit (#17)
14. Touch target + press state audit (#18-19)
15. Haptic feedback (#20)
16. Edit date/time (#22)

### Session 2E (after Apple activates, ~4 hours)
17. Apple Sign-In setup
18. EAS configuration + first development build
19. Physical device testing
20. Fix any device-specific issues

---

## After Apple Activates (March 12+)

Once the Apple Developer account is active, the critical path is:

1. **Apple Sign-In** — Configure in Apple Developer portal + Supabase (2 hrs)
2. **EAS setup** — `eas login`, `eas build:configure`, link Apple credentials (1 hr)
3. **First dev build** — `eas build --platform ios --profile development` (30 min + build time)
4. **Physical device test** — Install dev build, test all flows end-to-end (3 hrs)
5. **Voice pipeline device test** — Record real BJJ sessions, verify transcription + extraction (2 hrs)
6. **Fix device issues** — Audio, permissions, layout on real hardware (2-4 hrs)
7. **Production build** — `eas build --platform ios --profile production` (30 min + build time)
8. **TestFlight submission** — Upload to App Store Connect, add testers (1 hr)

**Estimated time from Apple activation to TestFlight: 2-3 focused sessions (~10-12 hours)**

---

## Total Remaining Work Estimate (Updated March 8, 2026)

| Category | Hours | Apple Required? | Status |
|----------|-------|-----------------|--------|
| Edge Functions | 1.5 | No | TODO |
| Phase 3 Polish | 7 | No | **DONE** |
| Visual Polish | 4 | No | **MOSTLY DONE** (icon + splash TODO) |
| Missing Features | 6 | No | **DONE** |
| Xcode Install | 1.5 | No | TODO |
| Apple Sign-In + EAS + Device Testing | 10-12 | **Yes** | BLOCKED |
| **Remaining** | **~15 hours** | |

At ~3 hours per session, that's **~5 sessions** to TestFlight (down from 10).
With Apple activating by March 12, realistic TestFlight target: **March 18-22**.
