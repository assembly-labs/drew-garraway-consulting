# Session Log

Append-only record of work sessions. Most recent at top.

---

## 2026-04-08 -- Session 41: ONB-001 Onboarding Payoff Dead-End (Rachel bug)

**What happened:**
- External tester Rachel (rmgb2000@gmail.com) reported being stuck on the onboarding payoff screen. Tapping "Start Training" did nothing.
- Visual diagnosis: her payoff screen showed only 3 chat bubbles, but the current code shows 5. Proof she was on a pre-Mar-31 TestFlight build.
- Root cause traced: her old build didn't send `birth_date` during profile upsert. The Mar 30 FEAT-008 migration made `profiles.birth_date NOT NULL`, so her insert was rejected by Postgres. `profileService.create` swallowed the error with `console.error` and returned null. `handleStart` ignored the null and transitioned to the payoff screen anyway. On "Start Training" tap, `refreshProfile` found no profile row, so `authState` stayed `needs_onboarding` and she was trapped.
- Contributing cause: Apple's TestFlight external review lag (24-48h). Her external tester group never received the post-FEAT-008 app build even though it had been submitted. The DB migration and the app that understood it shipped out of sync.
- Code fix shipped via PR #40 (merged to main):
  - `profileService.create` throws on error, reports to Sentry
  - `handlePayoffComplete` re-verifies profile after refresh, bounces with toast if it didn't land
  - New migration drops `NOT NULL` on `birth_date` (keeps 18+ trigger)
  - Added "CRITICAL: Schema Migration Rules" section to TOMO/CLAUDE.md (two-phase pattern + pre-push checklist)
- Production actions executed directly:
  - Migration `20260408000000` applied to prod Supabase via `supabase db push`
  - Rachel's orphaned auth user deleted via admin API (zero collateral data)
  - Stuck-user discovery query confirmed Rachel was the only affected account

**Decisions made:**
- D-103 (new): Drop `NOT NULL` on `profiles.birth_date` rather than rolling back the whole FEAT-008 migration. Keeps the 18+ enforcement trigger intact while unblocking older clients.
- D-104 (new): All future schema-tightening migrations follow the two-phase pattern (permissive first, tighten in a follow-up migration after full tester rollout).
- Local device test skipped at Drew's explicit request. TestFlight hotfix build deferred pending Drew's approval.

**Risks updated:**
- R-007 (new): Schema-tightening migrations running ahead of app builds for external testers. Mitigated by the new CLAUDE.md rule + Sentry reporting on profile save failures. Status: mitigated.

**Next action:**
- ~~Drew sends Rachel the instructions to delete + reinstall + re-signup~~ **Done** (Drew confirmed message sent)
- ~~Cut TestFlight hotfix build when Drew approves~~ **Done** (shipped 2026-04-08 22:08 UTC from main)
- Consider moving Rachel and other external testers to internal testing to bypass Apple review lag going forward (T-009, backlog)

**TestFlight build details:**
- Source: `main` branch after PRs #40 and #41 merged
- Submission ID: `6f90d77c-1415-4675-951e-734071b2ea40`
- EAS submission URL: https://expo.dev/accounts/dgarraway/projects/tomo/submissions/6f90d77c-1415-4675-951e-734071b2ea40
- App Store Connect: https://appstoreconnect.apple.com/apps/6760957435/testflight/ios
- Apple processing: 5-10 min after submission, then available to internal testers
- External tester availability: 24-48h (Apple review gate)
- IPA size: 17.5 MB

**Session outcome:** ONB-001 fully closed. Code fix, DB migration, documentation, process rules, and TestFlight hotfix all shipped in a single session. Rachel unblocked via schema fix (she can use her existing build); the new hotfix will reach her after Apple review but she doesn't need it to get past the onboarding bug.

---

## 2026-04-04 -- Session 38: Insights Prompt Enhancement + Sports Psychology Research

**What happened:**
- Conducted deep sports psychology research (228-athlete motivation study, 30K-member habit study, 1,140-athlete injury study, BJJ practitioner behavior patterns)
- Wrote comprehensive research doc: `mvp-1.0/docs/features/insights-tab/SPORTS_PSYCHOLOGY_RESEARCH.md`
- Identified 10 strategic opportunities to enhance Insights feature with psychology-informed design
- Enhanced `generate-weekly` edge function system prompt with 5 immediate improvements:
  - Submission defense trending as a priority observation
  - Negative space rule (never mention what's missing from a session)
  - Repetition validation (depth over breadth when same techniques drilled 3+ weeks)
  - Experimentation-under-pressure framing (trying new things + more taps = growth)
  - Belt-specific observation limits and upper belt rules (purple/brown/black)
- Deployed updated edge function to Supabase (--no-verify-jwt)
- Verified DB migration already applied, TypeScript clean
- Submitted TestFlight build (build 2, submitted to Apple)
- Saved memory note for future sessions

**Decisions made:**
- Prompt-only enhancements ship now (zero code cost, immediate quality lift)
- Mood rating, pre-session intentions, plateau detection, competition routing deferred to future feature (FEAT-009)
- Monthly/quarterly insights remain Phase 2/3 -- weekly is enough for current tester count
- Research doc stored permanently alongside feature docs, not in conversation memory

**Next action:**
- Drew tests Insights tab on TestFlight (log a session, check the debrief)
- When ready for FEAT-009, read `insights-tab/INSIGHTS_INTELLIGENCE.md` for pickup prompt

---

## 2026-04-02 -- Session 37: Shake-to-Report Bug Reporter

**What happened:**
- Built shake-to-report feedback system for beta testers
- New component: `ShakeBugReporter.tsx` wired into App.tsx
- Shake phone from any screen to open feedback modal with Bug/Idea categories
- Auto-captures screenshot on shake, shows thumbnail preview in modal
- Submits to Sentry with screenshot attachment, user context, and feedback type tags
- Added `react-native-shake` and `react-native-view-shot` dependencies
- TypeScript clean, ready for native rebuild

**Decisions made:**
- Chose Sentry User Feedback over Instabug or custom solution (already have Sentry SDK integrated)
- Two feedback types only: Bug and Idea (not three -- "frustration" is the same as bug)
- Shake gesture activation (not a floating button or settings screen link)

**What's NOT done yet:**
- Needs native rebuild to test on device (new native packages)
- Sentry sends only work in production (not dev mode) -- will validate on TestFlight
- No on-device test yet

**Next action:**
- Native rebuild on Drew's phone to verify shake detection and modal flow
- Then a TestFlight build to validate Sentry receives the reports with screenshots

---

## 2026-04-02 -- Session 36: Project Management Setup

**What happened:**
- Cleared garrawaydrew@gmail.com from Supabase (auth user, profile, 2 sessions, 1 gym) for fresh end-to-end retest
- Created project-management/ folder with PM bot (CLAUDE.md, TASKS.md, DECISIONS.md, SESSION_LOG.md, RISKS.md)
- Consolidated existing tracking (ISSUES.md, features backlog, CHANGELOG.md) into PM structure
- Seeded TASKS.md with app track (features, design audit, App Store prep) and studio track (insights content, coaching copy, technique library)
- Seeded DECISIONS.md with 3 open decisions and 3 resolved ones
- Seeded RISKS.md with 6 active risks

**Decisions made:**
- PM folder will be 5 files (CLAUDE.md, TASKS.md, DECISIONS.md, SESSION_LOG.md, RISKS.md) -- no ROADMAP or README (existing tracking covers it)
- PM reads from existing tracking files, doesn't replace them

**Next action:**
- Retest app end-to-end with fresh garrawaydrew@gmail.com account (onboarding through session logging)
