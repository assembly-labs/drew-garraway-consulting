# Session Log

Append-only record of work sessions. Most recent at top.

---

## 2026-04-13 -- Session 40: Security Hardening (Edge Functions + PostGIS RLS)

**What happened:**
- Ran full security audit of TOMO's Supabase backend (RLS, API keys, Edge Functions, storage, auth)
- Audit found 0 critical, 0 high, 2 medium issues — overall posture rated "strong for TestFlight beta"
- Fixed SEC-006: Sanitized error responses in all 6 authenticated Edge Functions (23 instances across extract-session, transcribe-audio, generate-weekly, generate-monthly, generate-quarterly, chat-with-insight)
- Raw Claude API output, PostgreSQL error messages, AssemblyAI errors, and env variable names were being returned to clients — all now replaced with generic messages, details logged server-side only
- Deployed all 6 updated functions to production via `supabase functions deploy`
- Investigated SEC-005 (PostGIS `spatial_ref_sys` RLS lint warning) — confirmed every possible fix path is blocked by `supabase_admin` table ownership. REVOKE workaround from March is effective. Lint warning is cosmetic only.
- Created migration file `20260412000001_spatial_ref_sys_rls.sql` for documentation
- Confirmed PostGIS is required — gym finder uses `ST_Distance`, `ST_DWithin`, GIST spatial index

**Decisions made:**
- SEC-005: Accept lint warning as cosmetic. Free-tier support is unresponsive, REVOKE already blocks access. Not filing ticket.
- Error sanitization: Keep error codes (`insight_parse_failed`, `storage_failed`) for future client-side handling but strip all internal details. Client doesn't currently check these codes (verified via grep).
- No policies added to `spatial_ref_sys` — the existing REVOKE is more restrictive than a permissive SELECT policy would be.

**Tasks completed:**
- SEC-006: Edge Function error sanitization — done (23 fixes, 6 deploys)
- SEC-005: Investigated, mitigated, documented — closed as cosmetic

**Impact:**
- Prevents information disclosure attacks (CWE-209) — an attacker probing error responses can no longer learn the AI provider, database schema, or internal architecture
- Zero UX impact — users see the same behavior, just cleaner error messages if something fails
- Server-side logging preserved — debugging capability unchanged (Supabase Dashboard > Edge Functions > Logs)

**Next action:**
- Pre-public-launch: enable email confirmation (Supabase Auth settings)
- Pre-public-launch: add rate limiting to insight generation Edge Functions

---

## 2026-04-12 -- Session 39: Journal Edit Enhancement (6 Phases)

**What happened:**
- Built shared autocomplete hook (`useAutocompleteSuggestions.ts`) combining 3 sources: user history from Supabase, 361-technique tree, and static BJJ dictionary — with priority scoring
- Built reusable `AutocompleteTagInput` component with suggestion dropdown, "Recently Used" section, position badges, and "Add as custom" row
- Wired autocomplete into EditTechniquesSheet and EditSubmissionsSheet — submissions now show position-inferred suggestions from logged techniques
- Collapsed empty sections into compact "+ Add" gold links (topic, injuries, instructor, warm-up)
- Standardized all edit icons to 16px/gray500
- Added content-aware save toasts ("Scissor Sweep added", "Warm-up → Yes", etc.)
- Refactored ReviewPhase to use shared hook (no behavior change, regression-safe)
- TypeScript clean (zero errors)

**Decisions made:**
- Injuries sheet kept as plain TextInput (too varied for useful autocomplete)
- Technique autocomplete prioritizes history > tree > static with prefix/substring scoring
- EditSubmissionsSheet uses `matchLoggedTechniques()` to infer positions and suggest relevant submissions
- SheetWrapper gained `scrollable` prop instead of changing all sheets

**Tasks completed:**
- T-066 (JRN-007): Hide empty sections — done
- T-009: Journal Edit Enhancement — done (new task, created and closed same session)

**Next action:**
- Local device test to verify all 6 phases work on-device
- Then tester feedback before considering TestFlight

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
