# TOMO Linear Tasks - iOS Launch Roadmap

**Project:** /tomo-project
**Generated:** January 2026
**Total Tasks:** 35

---

## How to Use This Document

Copy each task into Linear. The format is:
- **Title** - Use as Linear issue title
- **Assignee** - Who owns this task
- **Labels** - Apply these labels in Linear
- **Acceptance Criteria** - Include in description as checklist

---

## Phase 0: Foundation Hardening

> **Goal:** Establish testing, CI/CD, and documentation before building new features.
> **Blocks:** Phase 1, 2, 3 (must complete before backend work)

---

### TOMO-001: Install and configure Vitest testing framework

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Infrastructure` `Claude Code` `Priority: High`

**Description:**
Add Vitest as the testing framework for the TOMO prototype. Vitest is chosen over Jest because it integrates natively with Vite (our build tool) and has faster execution.

**How to execute:** Ask Claude Code:
> "Install Vitest testing framework in the prototype. Follow patterns in DEVELOPMENT_PROTOCOL.md. Create a sample test file to verify setup works."

**Acceptance Criteria:**
- [ ] `vitest` and `@testing-library/react` installed as devDependencies
- [ ] `vitest.config.ts` created with proper TypeScript and React support
- [ ] `npm run test` command works and runs sample test
- [ ] Sample test file exists at `src/__tests__/sample.test.ts`

**Files to modify:**
- `prototype/package.json`
- Create: `prototype/vitest.config.ts`
- Create: `prototype/src/__tests__/sample.test.ts`

---

### TOMO-002: Write unit tests for api.ts service layer

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Testing` `Claude Code` `Priority: High`

**Description:**
Write comprehensive unit tests for `prototype/src/services/api.ts`. This file contains all data persistence logic and is critical to test before migrating to Supabase.

**How to execute:** Ask Claude Code:
> "Write unit tests for services/api.ts. Test all 4 services (profile, sessions, techniqueProgress, submissions). Mock localStorage. Target 80% coverage."

**Acceptance Criteria:**
- [ ] Tests exist for `api.profile.*` methods (get, create, update)
- [ ] Tests exist for `api.sessions.*` methods (list, get, create, update, delete, getStats)
- [ ] Tests exist for `api.techniqueProgress.*` methods
- [ ] Tests exist for `api.submissions.*` methods (including batch create)
- [ ] Tests verify error handling returns proper `ApiResponse` structure
- [ ] All tests pass with `npm run test`
- [ ] Coverage > 80% for `services/api.ts`

**Depends on:** TOMO-001

**Files to create:**
- `prototype/src/__tests__/services/api.test.ts`

---

### TOMO-003: Write unit tests for UserProfileContext

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Testing` `Claude Code` `Priority: High`

**Description:**
Write tests for `prototype/src/context/UserProfileContext.tsx`. This context manages user profile state, progressive profiling, and demo mode.

**How to execute:** Ask Claude Code:
> "Write unit tests for UserProfileContext. Test onboarding, profile updates, session count tracking, nudge questions, and demo mode. Use @testing-library/react renderHook."

**Acceptance Criteria:**
- [ ] Tests for `completeOnboarding()` with various belt levels
- [ ] Tests for `updateProfile()` partial updates
- [ ] Tests for `incrementSessionCount()` and session tracking
- [ ] Tests for `getNextNudgeQuestion()` logic
- [ ] Tests for `skipQuestion()` (respects skip limits)
- [ ] Tests for demo mode `setDemoPersona()` switching
- [ ] All tests pass with `npm run test`

**Depends on:** TOMO-001

**Files to create:**
- `prototype/src/__tests__/context/UserProfileContext.test.tsx`

---

### TOMO-004: Set up GitHub Actions CI pipeline

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Infrastructure` `Claude Code` `Priority: High`

**Description:**
Create a GitHub Actions workflow that runs on every push and PR. Pipeline: build → lint → test.

**How to execute:** Ask Claude Code:
> "Create GitHub Actions CI workflow at .github/workflows/ci.yml. Trigger on push to main and PRs. Run npm ci, build, lint, and test from the prototype directory. Use Node 20."

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` exists and is valid YAML
- [ ] Pipeline triggers on push to `main`
- [ ] Pipeline triggers on pull requests
- [ ] Pipeline runs `npm ci` → `npm run build` → `npm run lint` → `npm run test`
- [ ] Pipeline fails if any step fails

**Depends on:** TOMO-002, TOMO-003

**Files to create:**
- `.github/workflows/ci.yml`

---

### TOMO-005: Create DEVELOPMENT_PROTOCOL.md

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Documentation` `Priority: Medium`

**Description:**
Create a protocol document establishing coding standards for TOMO. Claude Code reads this before every task.

**How to execute:** Start with Claude Code generating a draft, then review and customize:
> "Create DEVELOPMENT_PROTOCOL.md for TOMO. Document the service layer pattern, TypeScript requirements, design system rules, and pre-commit checklist. Reference CLAUDE.md."

**Acceptance Criteria:**
- [ ] File exists at `TOMO/DEVELOPMENT_PROTOCOL.md`
- [ ] Documents the service layer pattern with examples
- [ ] Documents TypeScript strictness requirements
- [ ] Documents design system rules (from CLAUDE.md)
- [ ] Includes pre-commit checklist
- [ ] Includes "how to add a new feature" step-by-step

**Files to create:**
- `TOMO/DEVELOPMENT_PROTOCOL.md`

---

### TOMO-006: Generate Supabase database schema SQL file

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Documentation` `Claude Code` `Priority: Medium`

**Description:**
Create a SQL file defining the complete Supabase database schema based on TypeScript types.

**How to execute:** Ask Claude Code:
> "Generate Supabase SQL schema from prototype/src/types/database.ts. Create docs/deployment/supabase-schema.sql with CREATE TABLE statements, foreign keys, indexes, and RLS policy stubs."

**Acceptance Criteria:**
- [ ] SQL file exists at `docs/deployment/supabase-schema.sql`
- [ ] `profiles` table matches `Profile` interface
- [ ] `sessions` table matches `Session` interface with FK to profiles
- [ ] `technique_progress` table matches `TechniqueProgress` interface
- [ ] `submissions` table matches `SubmissionRecord` interface
- [ ] Indexes for common queries included
- [ ] SQL is valid and runs in Supabase

**Files to create:**
- `docs/deployment/supabase-schema.sql`

---

### TOMO-007: Add Zod input validation schemas

**Assignee:** Drew Garraway
**Labels:** `Phase 0` `Infrastructure` `Claude Code` `Priority: Low`

**Description:**
Add Zod validation to prevent bad data from reaching the database.

**How to execute:** Ask Claude Code:
> "Add Zod validation schemas for all database types. Create prototype/src/schemas/index.ts. Integrate validation into api.ts service methods."

**Acceptance Criteria:**
- [ ] `zod` installed as dependency
- [ ] Schemas exist at `prototype/src/schemas/index.ts`
- [ ] API methods validate input before storage
- [ ] Validation errors return meaningful messages

**Files to create:**
- `prototype/src/schemas/index.ts`

---

## Phase 1: Backend Foundation

> **Goal:** Real database, real user accounts. Data persists across devices.
> **Blocks:** Phase 2, 3, 4

---

### TOMO-008: Create Supabase project and configure environment

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Infrastructure` `Priority: Critical`

**Description:**
Create a new Supabase project. This is a manual task requiring account creation.

**Steps:**
1. Go to supabase.com → Create free account
2. Create new project named "tomo-bjj"
3. Copy Project URL and Anon Key
4. Create `prototype/.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

**Acceptance Criteria:**
- [ ] Supabase project exists
- [ ] Project URL and Anon Key saved
- [ ] `.env.local` created (NOT committed to git)

---

### TOMO-009: Apply database schema to Supabase

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Infrastructure` `Priority: Critical`

**Description:**
Run the SQL schema in Supabase to create tables.

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `docs/deployment/supabase-schema.sql`
3. Click "Run"
4. Verify tables in Table Editor

**Depends on:** TOMO-006, TOMO-008

**Acceptance Criteria:**
- [ ] All tables created (profiles, sessions, technique_progress, submissions)
- [ ] Foreign keys working
- [ ] Indexes visible

---

### TOMO-010: Configure Row Level Security (RLS) policies

**Assignee:** dev lead
**Labels:** `Phase 1` `Security` `Professional Review` `Priority: Critical`

**Description:**
Configure RLS so users can only access their own data. **SECURITY CRITICAL - requires professional review.**

**Why dev lead:** Incorrect RLS policies could expose user data to other users. This needs expert review.

**Policies needed:**
- Users can only SELECT/INSERT/UPDATE/DELETE their own data
- `auth.uid() = user_id` pattern for all tables

**Acceptance Criteria:**
- [ ] RLS enabled on all tables
- [ ] Policies reviewed by security professional
- [ ] Manual test: User A cannot see User B's data

**Depends on:** TOMO-009

---

### TOMO-011: Install Supabase client and create connection

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Infrastructure` `Claude Code` `Priority: High`

**Description:**
Install Supabase JS client and create configured connection.

**How to execute:** Ask Claude Code:
> "Install @supabase/supabase-js. Create prototype/src/lib/supabase.ts that reads credentials from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Export typed client."

**Depends on:** TOMO-008

**Acceptance Criteria:**
- [ ] `@supabase/supabase-js` installed
- [ ] Client at `prototype/src/lib/supabase.ts`
- [ ] Reads from environment variables
- [ ] Exported for use in services

---

### TOMO-012: Migrate api.ts profileService to Supabase

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Backend` `Claude Code` `Priority: High`

**Description:**
Update profileService to use Supabase instead of localStorage.

**How to execute:** Ask Claude Code:
> "Update profileService in services/api.ts to use Supabase. Keep the same ApiResponse<T> interface. Replace localStorage calls with Supabase queries."

**Depends on:** TOMO-011

**Acceptance Criteria:**
- [ ] All profile methods use Supabase
- [ ] Same `ApiResponse` interface maintained
- [ ] Existing tests pass (with updated mocks)

---

### TOMO-013: Migrate api.ts sessionsService to Supabase

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Backend` `Claude Code` `Priority: High`

**Description:**
Update sessionsService to use Supabase. Largest service with list, get, create, update, delete, getStats.

**How to execute:** Ask Claude Code:
> "Update sessionsService in services/api.ts to use Supabase. Implement pagination with Supabase range queries. Keep ApiResponse<T> interface."

**Depends on:** TOMO-011

**Acceptance Criteria:**
- [ ] All session methods use Supabase
- [ ] Pagination working
- [ ] Stats calculation accurate
- [ ] Tests pass

---

### TOMO-014: Migrate api.ts techniqueProgressService to Supabase

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Backend` `Claude Code` `Priority: Medium`

**Description:**
Update techniqueProgressService to use Supabase.

**Depends on:** TOMO-011

**Acceptance Criteria:**
- [ ] All methods use Supabase
- [ ] `ApiResponse<T>` interface maintained
- [ ] Tests pass

---

### TOMO-015: Migrate api.ts submissionsService to Supabase

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Backend` `Claude Code` `Priority: Medium`

**Description:**
Update submissionsService to use Supabase. Note: createBatch needs Supabase bulk insert.

**Depends on:** TOMO-011

**Acceptance Criteria:**
- [ ] All methods use Supabase
- [ ] `createBatch()` uses efficient bulk insert
- [ ] Tests pass

---

### TOMO-016: Implement Supabase email authentication

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Auth` `Claude Code` `Priority: High`

**Description:**
Replace mock authService with real Supabase Auth.

**How to execute:** Ask Claude Code:
> "Update services/auth.ts to use Supabase Auth. Implement signUp, signIn, signOut, getCurrentUser, onAuthStateChange using supabase.auth methods. Keep same AuthResponse types."

**Depends on:** TOMO-011

**Acceptance Criteria:**
- [ ] Real user accounts created in Supabase
- [ ] Login/logout working
- [ ] Session persists across page refresh

---

### TOMO-017: Create login and signup screens

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `UI` `Claude Code` `Priority: High`

**Description:**
Create auth screens following design system.

**How to execute:** Ask Claude Code:
> "Create Login.tsx and Signup.tsx components in features/. Follow design system (docs/design-system/). Include email/password fields, validation, loading states, error messages."

**Depends on:** TOMO-016

**Acceptance Criteria:**
- [ ] Login at `/login`, Signup at `/signup`
- [ ] Form validation
- [ ] Loading and error states
- [ ] Follows design system

---

### TOMO-018: Add authentication routing and protected routes

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Infrastructure` `Claude Code` `Priority: High`

**Description:**
Protect app routes, redirect unauthenticated users to login.

**How to execute:** Ask Claude Code:
> "Update App.tsx to protect routes. Redirect unauthenticated users to /login. Redirect authenticated users from /login to /. Show loading state while checking auth."

**Depends on:** TOMO-017

**Acceptance Criteria:**
- [ ] Unauthenticated → redirected to /login
- [ ] Authenticated → can access app
- [ ] Auth state persists

---

### TOMO-019: Write localStorage to Supabase migration script

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Infrastructure` `Claude Code` `Priority: Low`

**Description:**
One-time script to migrate existing prototype data to Supabase.

**Acceptance Criteria:**
- [ ] Reads from localStorage
- [ ] Uploads to Supabase
- [ ] Shows progress/status

---

### TOMO-020: End-to-end test of Supabase integration

**Assignee:** Drew Garraway
**Labels:** `Phase 1` `Testing` `Priority: High`

**Description:**
Manual testing of complete flow with real backend.

**Test checklist:**
1. [ ] Create new account
2. [ ] Log training session
3. [ ] View session in history
4. [ ] Log out and back in
5. [ ] Data still exists
6. [ ] Access from different browser

**Depends on:** TOMO-012 through TOMO-018

---

## Phase 2: Voice Integration

> **Goal:** Real voice transcription using AssemblyAI

---

### TOMO-021: Create AssemblyAI account and configure API

**Assignee:** Drew Garraway
**Labels:** `Phase 2` `Infrastructure` `Priority: High`

**Description:**
Set up AssemblyAI for voice transcription ($50 free credits).

**Steps:**
1. Go to assemblyai.com → Create account
2. Copy API key from dashboard
3. Add to `.env.local`: `VITE_ASSEMBLYAI_KEY=your-key`

**Acceptance Criteria:**
- [ ] Account created
- [ ] API key saved
- [ ] Free credits available

---

### TOMO-022: Configure BJJ custom vocabulary in AssemblyAI

**Assignee:** Drew Garraway
**Labels:** `Phase 2` `Infrastructure` `Priority: Medium`

**Description:**
Add BJJ terms to AssemblyAI custom vocabulary for better recognition.

**Terms to add:** kimura, armbar, triangle, guillotine, omoplata, americana, de la Riva, closed guard, mount, side control, back control, half guard, butterfly guard, spider guard, sweep, submission, tap, escape, bridge, shrimp, hip escape, technical standup, etc.

**Acceptance Criteria:**
- [ ] 50+ BJJ terms configured
- [ ] Test shows improved accuracy

---

### TOMO-023: Implement audio recording in VoiceFirstLogger

**Assignee:** Drew Garraway
**Labels:** `Phase 2` `Feature` `Claude Code` `Priority: High`

**Description:**
Add real audio recording using Web Audio API.

**How to execute:** Ask Claude Code:
> "Add audio recording to VoiceFirstLogger.tsx. Use getUserMedia and MediaRecorder APIs. Handle permission requests gracefully. Show recording indicator. Store audio blob for upload."

**Acceptance Criteria:**
- [ ] Microphone permission requested
- [ ] Recording indicator visible
- [ ] Audio blob captured
- [ ] Permission denied handled gracefully

---

### TOMO-024: Create AssemblyAI transcription service

**Assignee:** Drew Garraway
**Labels:** `Phase 2` `Feature` `Claude Code` `Priority: High`

**Description:**
Service to upload audio and get transcription from AssemblyAI.

**How to execute:** Ask Claude Code:
> "Create services/transcription.ts. Implement uploadAudio(blob), transcribe(url), getTranscription(id), and combined transcribeAudio(blob). Use AssemblyAI upload→submit→poll pattern."

**Depends on:** TOMO-021

**Acceptance Criteria:**
- [ ] Service at `services/transcription.ts`
- [ ] Upload, submit, poll working
- [ ] Custom vocabulary parameter included
- [ ] Error handling

---

### TOMO-025: Integrate transcription into VoiceFirstLogger

**Assignee:** Drew Garraway
**Labels:** `Phase 2` `Feature` `Claude Code` `Priority: High`

**Description:**
Connect recording to transcription service.

**Depends on:** TOMO-023, TOMO-024

**Acceptance Criteria:**
- [ ] Recording → transcription automatic
- [ ] Loading state during transcription
- [ ] Result editable before save
- [ ] Saved to session.voice_transcript

---

### TOMO-026: Test voice transcription with BJJ terminology

**Assignee:** Drew Garraway
**Labels:** `Phase 2` `Testing` `Priority: High`

**Description:**
Test transcription accuracy with real BJJ terms.

**Test phrases:**
- "I drilled kimuras from closed guard"
- "Got caught in a triangle but escaped"
- "Worked on de la Riva sweeps"
- "Hit an armbar from mount"

**Acceptance Criteria:**
- [ ] >85% accuracy on BJJ terms
- [ ] Usable without major corrections
- [ ] <10s latency for 30s audio

---

## Phase 3: React Native / iOS

> **Goal:** Native iOS app on TestFlight

---

### TOMO-027: Purchase Apple Developer Account

**Assignee:** Drew Garraway
**Labels:** `Phase 3` `Infrastructure` `Priority: Critical`

**Description:**
Buy Apple Developer Program membership ($99/year).

**Steps:**
1. Go to developer.apple.com
2. Enroll in Apple Developer Program
3. Pay $99
4. Wait for approval

**Acceptance Criteria:**
- [ ] Account approved
- [ ] Can access App Store Connect

---

### TOMO-028: Initialize Expo project with TypeScript

**Assignee:** dev lead
**Labels:** `Phase 3` `Infrastructure` `Professional Help` `Priority: Critical`

**Description:**
Create Expo project for iOS app. **Requires professional setup** - many platform-specific gotchas.

**Why dev lead:** Initial Expo/React Native setup has many configuration pitfalls. Getting it right from the start saves significant debugging time.

**Requirements:**
- Expo SDK 50+
- TypeScript
- Expo Router
- EAS Build config

**Acceptance Criteria:**
- [ ] Project at `TOMO/mobile/`
- [ ] Runs in Expo Go on iOS
- [ ] EAS configured

---

### TOMO-029: Set up Expo Router navigation structure

**Assignee:** dev lead
**Labels:** `Phase 3` `Infrastructure` `Professional Help` `Priority: High`

**Description:**
Configure tab navigation matching web app. **Dev lead recommended** for proper Expo Router patterns.

**Depends on:** TOMO-028

**Acceptance Criteria:**
- [ ] 5-tab navigator
- [ ] Placeholder screens
- [ ] Navigation working

---

### TOMO-030: Connect React Native app to Supabase

**Assignee:** Drew Garraway
**Labels:** `Phase 3` `Infrastructure` `Claude Code` `Priority: High`

**Description:**
Configure Supabase client for React Native with SecureStore.

**How to execute:** Ask Claude Code:
> "Configure Supabase client for React Native in mobile/. Use expo-secure-store for auth token storage. Share same database as web app."

**Depends on:** TOMO-028

**Acceptance Criteria:**
- [ ] Supabase client configured
- [ ] SecureStore for tokens
- [ ] Same data as web

---

### TOMO-031: Implement Apple Sign-In

**Assignee:** dev lead
**Labels:** `Phase 3` `Auth` `Professional Help` `Priority: High`

**Description:**
Add Apple Sign-In. **Required for iOS apps with social login.** Professional help recommended due to Apple's specific requirements.

**Why dev lead:** Apple has strict requirements for Sign-In with Apple. Apps can be rejected for incorrect implementation.

**Depends on:** TOMO-030

**Acceptance Criteria:**
- [ ] Apple Sign-In button
- [ ] Authenticates with Supabase
- [ ] Works on real device

---

### TOMO-032: Port design tokens to React Native

**Assignee:** Drew Garraway
**Labels:** `Phase 3` `UI` `Claude Code` `Priority: High`

**Description:**
Convert CSS tokens to React Native StyleSheet format.

**How to execute:** Ask Claude Code:
> "Create mobile/src/theme/index.ts. Port all colors, typography, and spacing from docs/design-system/ to React Native format."

**Depends on:** TOMO-028

**Acceptance Criteria:**
- [ ] Theme file created
- [ ] All design tokens ported
- [ ] Components can import theme

---

### TOMO-033: Port Dashboard screen to React Native

**Assignee:** Drew Garraway
**Labels:** `Phase 3` `UI` `Claude Code` `Priority: High`

**Description:**
Recreate Dashboard in React Native.

**How to execute:** Ask Claude Code:
> "Port Dashboard.tsx to React Native at mobile/src/screens/Dashboard.tsx. Use Supabase client and theme tokens. Match web design. Add pull-to-refresh."

**Depends on:** TOMO-030, TOMO-032

**Acceptance Criteria:**
- [ ] Stats from Supabase
- [ ] Matches web design
- [ ] Pull-to-refresh working

---

### TOMO-034: Port SessionLogger screen to React Native

**Assignee:** Drew Garraway
**Labels:** `Phase 3` `Feature` `Claude Code` `Priority: High`

**Description:**
Recreate voice logger in React Native with expo-av.

**Depends on:** TOMO-030, TOMO-032

**Acceptance Criteria:**
- [ ] Voice recording with expo-av
- [ ] AssemblyAI integration
- [ ] Session saved to Supabase

---

### TOMO-035: Build and submit to TestFlight

**Assignee:** dev lead
**Labels:** `Phase 3` `Deployment` `Professional Help` `Priority: Critical`

**Description:**
Build iOS app and submit to TestFlight. **Professional review recommended** before submission.

**Why dev lead:** First TestFlight submission has many gotchas (provisioning profiles, entitlements, App Store Connect setup). Getting help saves rejection cycles.

**Depends on:** All Phase 3 tasks

**Acceptance Criteria:**
- [ ] EAS build successful
- [ ] Uploaded to App Store Connect
- [ ] TestFlight review passed
- [ ] Installable on real device

---

## Summary Tables

### Tasks by Assignee

| Assignee | Count | Task IDs |
|----------|-------|----------|
| **Drew Garraway** | 30 | 001-009, 011-027, 030, 032-034 |
| **dev lead** | 5 | 010, 028, 029, 031, 035 |

### Tasks by Phase

| Phase | Count | Focus |
|-------|-------|-------|
| Phase 0 | 7 | Testing, CI/CD, Documentation |
| Phase 1 | 13 | Supabase backend, Authentication |
| Phase 2 | 6 | Voice transcription |
| Phase 3 | 9 | React Native, iOS |

### dev lead Tasks (Professional Help Needed)

| Task | Why Professional Help |
|------|----------------------|
| TOMO-010 | RLS security policies - data privacy critical |
| TOMO-028 | Expo initial setup - many platform gotchas |
| TOMO-029 | Expo Router patterns - framework expertise |
| TOMO-031 | Apple Sign-In - Apple-specific requirements |
| TOMO-035 | TestFlight submission - provisioning complexity |

---

## Recommended Linear Labels

**Phase Labels:**
- `Phase 0` `Phase 1` `Phase 2` `Phase 3`

**Type Labels:**
- `Infrastructure` `Feature` `Testing` `Documentation` `UI` `Backend` `Auth` `Security` `Deployment`

**Execution Labels:**
- `Claude Code` - Execute via Claude Code prompt
- `Manual` - Requires human action
- `Professional Review` - Needs expert review

**Priority Labels:**
- `Priority: Critical` `Priority: High` `Priority: Medium` `Priority: Low`
