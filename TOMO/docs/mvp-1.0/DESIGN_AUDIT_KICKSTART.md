# TOMO MVP 1.0 -- Design Audit Kickstart Prompt

**Paste this into a new Claude Code session to resume design audit work.**

---

## Project

TOMO is a voice-first BJJ training journal for iOS, built with React Native + Expo, backed by Supabase. It's live on TestFlight with real users. Drew is a vibe coder -- explain step-by-step, propose before implementing.

## Read These Files (In Order)

### 1. Project rules and design system
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/CLAUDE.md`

### 2. Design audit report (full findings, recommendations, implementation notes)
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/design-reviews/ux-audit-2026-03-28.md`

### 3. Issue tracker (DA-/DS- items are active priority)
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/mvp-1.0/tracking/ISSUES.md`

### 4. Latest changelog entry
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/mvp-1.0/tracking/CHANGELOG.md` (read the first entry only)

### 5. Feature spec (data models, screen specs, pipeline architecture)
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/mvp-1.0/FEATURE_SPEC.md`

### 6. Design tokens (the actual code values)
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/config/design-tokens.ts`

## App Source Code

All source lives at `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/`:

```
src/
├── screens/
│   ├── AuthScreen.tsx
│   ├── InsightsScreen.tsx          # Fully built, not wired into nav (DA-001)
│   ├── JournalScreen.tsx           # Main tab, session list + WeeklyPulse
│   ├── SessionLoggerScreen.tsx     # Voice pipeline: Entry > Record > Process > Review > Success
│   ├── SessionDetailScreen.tsx     # View/edit/delete sessions
│   ├── ProfileScreen.tsx           # Profile editing, sign out
│   ├── PrivacyPolicyScreen.tsx
│   └── onboarding/
│       ├── WelcomeScreen.tsx
│       ├── AboutYouScreen.tsx      # Name, belt, stripes
│       ├── YourTrainingScreen.tsx  # Gym, frequency, goals
│       └── GetStartedScreen.tsx    # Logging preference, mic permission
├── navigation/
│   ├── RootNavigator.tsx           # Auth state routing
│   ├── MainTabNavigator.tsx        # 3 tabs: Journal, Log, Profile (Insights missing)
│   └── OnboardingNavigator.tsx     # 4-screen onboarding stack
├── components/
│   ├── Icons.tsx                   # 95+ SVG icons
│   ├── GymSearchInput.tsx          # Shared gym autocomplete
│   ├── GymChip.tsx                 # Gym override chip (DA-007)
│   ├── NetworkError.tsx            # Offline banner (DA-009)
│   ├── Toast.tsx, Skeleton.tsx, ErrorBoundary.tsx, MicPermissionPrimer.tsx
│   └── GymCard.tsx, GymHistoryList.tsx, GymPickerSheet.tsx, OnboardingProgressBar.tsx
├── services/
│   ├── supabase.ts                 # All Supabase client calls
│   ├── gymService.ts, userGymService.ts
│   ├── insights-engine.ts, insights-service.ts, user-context.ts
│   └── offline-queue.ts
├── hooks/
│   ├── useAuth.ts, useVoiceRecorder.ts, useLocation.ts
├── config/
│   ├── design-tokens.ts            # Colors, spacing, typography, shadows
│   └── belt-system/                # Belt personalization engine
├── types/
│   ├── mvp-types.ts, insights-types.ts, technique-tree-types.ts
├── data/
│   ├── gyms.ts, bjj-dictionary.ts, technique-tree.ts
└── utils/
    ├── journal-helpers.ts, haptics.ts, logger.ts
```

## What To Work On

**DA-/DS- items are the active priority.** Check ISSUES.md for current status of each item. Work P0 first, then P1, then P2, then DS-, then P3.

Summary of open items by priority:

| Priority | IDs | Count |
|----------|-----|-------|
| P0 | DA-001 (Insights tab) | 1 |
| P1 | DA-002, DA-003, DA-004, DA-005 | 4 |
| P2 | DA-006 through DA-013, DS-001 | 9 |
| P3 | DA-014 through DA-017, DS-002 through DS-005 | 8 |

Ask Drew which items to tackle this session. If he says "just go," start with DA-001 (wiring Insights into the tab bar) and work down the priority list.

## Rules

- Never commit directly to main, staging, or dev
- Always run `npx tsc --noEmit` before finishing
- Update CHANGELOG.md and ISSUES.md at end of session
- Tell Drew whether to test locally or deploy to TestFlight
- Device build command: `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E`
- Edge functions MUST deploy with `--no-verify-jwt` (caused P0 outages 3 times)
- No emojis, no em dashes in content, no developer jargon
- "Session Logged!" is wrong -- "Session logged." is right (brand voice)
