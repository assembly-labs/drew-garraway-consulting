# Decisions

**Last updated:** 2026-04-08

Statuses: `open` | `decided` | `revisiting`

---

## Open Decisions

| ID | Question | Options | Recommendation | Deadline | Status |
|----|----------|---------|----------------|----------|--------|
| D-001 | When do we submit to the App Store? | (a) After insights tab ships, (b) After beta feedback round, (c) After design audit complete | TBD | TBD | open |
| D-002 | Do we need a public beta (TestFlight link) before App Store? | (a) Yes, wider beta first, (b) No, go straight to App Store | TBD | TBD | open |
| D-003 | Monetization model for V1? | (a) Free, (b) Freemium, (c) Paid upfront, (d) Decide post-launch | TBD | Before App Store submission | open |

---

## Decided

| ID | Question | Decision | Date | Reasoning |
|----|----------|----------|------|-----------|
| D-100 | Insights approach? | Approach B (weekly first) | 2026-03-30 | Simpler to build, more actionable for users, can add daily/monthly later |
| D-101 | User profile fields for V1? | Birthday (mandatory), gender (mandatory), weight (optional), expanded goals | 2026-03-30 | Feeds insight personalization, age gating, IBJJF weight class context |
| D-102 | Onboarding style? | Full upfront (~60 seconds) | Pre-TestFlight | Gets all data needed for personalization immediately, avoids progressive profiling complexity |
| D-103 | How to fix the ONB-001 stuck-user bug without breaking FEAT-008? | Drop `NOT NULL` on `profiles.birth_date` only; keep the 18+ enforcement trigger | 2026-04-08 | Full migration rollback would lose legitimate age validation for new signups. Dropping only the NOT NULL lets older clients save profiles (they pass null, which bypasses the trigger via null-safe semantics) while new clients still get 18+ validation. Backwards-compatible, reversible, no code change needed in the insights engine. |
| D-104 | Prevent future "schema tighter than app build" bugs? | Adopt two-phase migration pattern as a hard rule | 2026-04-08 | Every tightening change (NOT NULL, CHECK, FK) must ship in two phases: (a) permissive migration + app build rollout, (b) tightening migration after all testers are on the compatible build. Documented in TOMO/CLAUDE.md under "CRITICAL: Schema Migration Rules" with a pre-push checklist. Enforced at review time, not runtime. |
