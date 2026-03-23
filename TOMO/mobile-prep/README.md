# TOMO Mobile Prep

Pre-built files for the iOS MVP. Created March 8, 2026 — before Phase 1 — so development starts faster once accounts are active.

---

## Context: What Happened

### 1. iOS MVP Reviewer Agent Pass (March 8)

Deployed the iOS MVP Reviewer agent against all four docs in `docs/mvp-1.0/`. Verdict: **GO WITH CHANGES**.

**5 items to resolve before Phase 1:**

| # | Issue | Severity | Resolution |
|---|-------|----------|------------|
| 1 | Edge Function has no auth — anyone could call it and burn API credits | Critical | Fixed: both Edge Functions now verify Supabase JWT |
| 2 | AssemblyAI API key would ship inside the app binary | Critical | Fixed: new `transcribe-audio` Edge Function keeps key server-side |
| 3 | No bundle ID chosen | Blocking | Decided: `com.drewgarraway.tomo` |
| 4 | No iOS deployment target set | Blocking | Decided: iOS 16.0 |
| 5 | PostHog listed in tech stack but no tasks in ship plan | Unclear | Decided: excluded from MVP, add post-TestFlight |

Other findings (non-blocking, handled during build):
- `session_count` can drift after deletes — use live query instead of stored count (done in `supabase.ts`)
- No `updated_at` trigger — added to migration SQL
- Consider expo-router over React Navigation — check default template at project creation
- Test AssemblyAI with real BJJ recordings before Week 4
- Cost estimates and timelines in `TOMO/CLAUDE.md` differ from MVP docs — MVP docs supersede

### 2. Prototype Portability Audit (March 8)

Read every relevant file in `prototype/src/` to determine what ports to React Native.

**Key findings:**
- `data/gyms.ts` — 100% pure TypeScript, zero changes needed, direct copy
- `config/belt-system/` (6 files, ~1,500+ lines) — 100% portable, pure TS
- `types/database.ts` — portable but uses old `training_type` field, needs update for `trainingMode`/`sessionKind` split
- `services/api.ts` — localStorage-based, full rewrite needed for Supabase
- All UI components (20+ files) — full rewrite for React Native (no CSS/HTML in RN), but business logic patterns are reusable
- 8 components not needed for MVP (Dashboard, BeltProgress, TechniqueLibrary, etc. — all deferred to v1.1)

Full audit: `PORTABILITY_AUDIT.md`

### 3. Pre-Built Deliverables (March 8)

Built 14 files covering database, backend, config, types, services, hooks, icons, and utilities — everything that can be prepared without active accounts.

---

## File Inventory

### Infrastructure (paste/deploy when accounts ready)

| File | What it does | Ship Plan Task |
|------|-------------|----------------|
| `supabase-migration.sql` | Complete database: profiles + sessions tables, RLS policies, storage policies, updated_at trigger. Paste into Supabase SQL Editor and the DB is done. | 1.6 |
| `supabase/functions/extract-session/index.ts` | Edge Function: receives transcript, calls Claude Haiku 4.5, validates JSON, returns structured session data. Includes JWT auth and error handling. | 4.5 |
| `supabase/functions/transcribe-audio/index.ts` | Edge Function: receives audio storage path, generates signed URL, sends to AssemblyAI with 180 BJJ terms word_boost, polls for completion. Keeps API key server-side. | 4.4 |
| `app.config.ts` | Expo config template: bundle ID (`com.drewgarraway.tomo`), iOS 16 target, mic permission, expo-audio plugin, Sentry plugin, dark mode, env var placeholders. | 1.1 |
| `ENV_REFERENCE.md` | Every environment variable needed, where to get each one, which go in the app vs server-side. Account signup checklist with URLs and costs. | 1.9 |

### Application Code (copy into Expo project)

| File | What it does | Ship Plan Task |
|------|-------------|----------------|
| `src/types/mvp-types.ts` | All TypeScript types: Profile, Session, Submission, ExtractionResult, TranscriptionResponse, etc. Uses the `trainingMode`/`sessionKind` split. Matches the SQL schema exactly. | — |
| `src/services/supabase.ts` | Supabase client init + typed service helpers: `profileService.get()`, `sessionService.list()`, `audioService.upload()`, `edgeFunctions.transcribe()`, `edgeFunctions.extract()`. Uses live count query instead of stored `session_count`. | 1.10 |
| `src/hooks/useAuth.ts` | Auth context + hook. Tracks 4 states: loading, unauthenticated, needs_onboarding, authenticated. Handles sign in, sign up, sign out, profile refresh. Wraps `AuthProvider` around the app. | 2.1, 2.2 |
| `src/hooks/useVoiceRecorder.ts` | Voice recording hook wrapping expo-audio. 90-second auto-stop, mic permission handling, duration timer (updates every 100ms), formatted time display, cancel/reset support. | 4.2 |
| `src/utils/journal-helpers.ts` | Journal date grouping (Today/Yesterday/This Week/This Month/Earlier), AI narrative summary generator (client-side, no LLM), date/time formatters, training mode/session kind label helpers. | 5.1, 5.6 |
| `src/components/Icons.tsx` | 25 SVG icons converted from web prototype to react-native-svg: navigation (Home, Journal, Profile, Back, Close, Search), chevrons, session logging (Mic, Stop, Timer, Calendar, Keyboard), status (Check, CheckCircle, AlertCircle), actions (Plus, Minus, Edit, Trash, Filter, Logout), BJJ (Sparring, Belt). | 2.6 |
| `design-tokens.ts` | Full design system as RN StyleSheet values: colors (primary, semantic, grayscale, belt, training mode), spacing (4px base), typography presets (heroNumber, headline, body, label), touch targets, shadows, helper functions. | 2.4 |

### Reference Docs

| File | What it contains |
|------|-----------------|
| `PORTABILITY_AUDIT.md` | File-by-file analysis of prototype code: what copies directly (~1,500 lines), what needs minor updates, what needs full rewrite, what's not needed for MVP |
| `ENV_REFERENCE.md` | Environment variable reference + account signup checklist |

---

## How to Use These Files

### Step 1: Sign up for accounts (Drew — do this first)
1. **Apple Developer Account** — developer.apple.com, $99/year, up to 48 hours to activate
2. **Supabase** — supabase.com (free, instant)
3. **AssemblyAI** — assemblyai.com ($50 free credit, instant)
4. **Anthropic** — console.anthropic.com (pay-as-you-go, instant)
5. **Expo** — expo.dev (free, instant)
6. **Sentry** — sentry.io (free tier, instant)

### Step 2: Set up Supabase (5 minutes)
1. Create a new Supabase project
2. Go to SQL Editor, paste `supabase-migration.sql`, run it
3. Go to Storage, create bucket `audio-recordings`, set to **Private**
4. Go to Auth Settings, enable Email auth + Apple Sign-In

### Step 3: Create Expo project
```bash
npx create-expo-app@latest tomo
cd tomo
```

### Step 4: Copy pre-built files into project
```bash
# Config
cp mobile-prep/app.config.ts tomo/app.config.ts
cp mobile-prep/design-tokens.ts tomo/src/config/design-tokens.ts

# Types, services, hooks, utils, icons
cp mobile-prep/src/types/mvp-types.ts tomo/src/types/
cp mobile-prep/src/services/supabase.ts tomo/src/services/
cp mobile-prep/src/hooks/useAuth.ts tomo/src/hooks/
cp mobile-prep/src/hooks/useVoiceRecorder.ts tomo/src/hooks/
cp mobile-prep/src/utils/journal-helpers.ts tomo/src/utils/
cp mobile-prep/src/components/Icons.tsx tomo/src/components/

# Portable prototype code (direct copy, no changes)
cp prototype/src/data/gyms.ts tomo/src/data/
cp -r prototype/src/config/belt-system/ tomo/src/config/belt-system/
```

### Step 5: Install dependencies
```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-svg expo-audio expo-constants
```

### Step 6: Fill in config values
- Open `app.config.ts`, replace all `TODO_REPLACE` values with your Supabase URL, key, Sentry DSN

### Step 7: Deploy Edge Functions (Phase 2)
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set ASSEMBLYAI_API_KEY=...
supabase functions deploy extract-session
supabase functions deploy transcribe-audio
```

---

## Decisions Baked Into These Files

| Decision | Value | Rationale |
|----------|-------|-----------|
| Bundle ID | `com.drewgarraway.tomo` | Standard reverse-domain format |
| iOS deployment target | 16.0 | Drops ~3% of users, simplifies dev |
| PostHog | Excluded from MVP | Not worth setup for 10 testers — just ask them |
| API keys in app | None | Both AssemblyAI and Anthropic keys stay server-side in Edge Functions |
| Edge Function auth | JWT verification | Prevents unauthorized API usage |
| `updated_at` management | Postgres trigger | Auto-updates, no risk of forgetting in app code |
| `session_count` | Live query, not stored value | Stays accurate after soft deletes |
| Audio recording library | expo-audio (preferred) | expo-av as documented fallback if needed |
| Navigation | Check default template | If expo-router is default, use it; otherwise React Navigation |

---

## What's NOT in This Folder

These are things that can't be built until accounts exist or the Expo project is created:

- Actual Expo project (`npx create-expo-app`)
- React Navigation / expo-router setup
- Screen components (Onboarding, Logger, Journal, Detail, Profile)
- EAS build configuration
- Apple Sign-In setup
- Sentry initialization
- Real device testing
