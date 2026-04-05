# Decisions

**Last updated:** 2026-04-02

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
