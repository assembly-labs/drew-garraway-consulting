# Tasks

**Last updated:** 2026-04-08 (Session 41)

Statuses: `backlog` | `ready` | `in-progress` | `blocked` | `done` | `cut`

Tracks: `app` | `studio`

---

## App Track

### Features (references mvp-1.0/docs/features/README.md)

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-001 | Build Insights Tab (FEAT-002) | done | P0 | FEAT-008 (done) | Weekly insight generation, message-style render, typewriter effect. Shipped Session 38. |
| T-006 | Insights Intelligence (FEAT-009) | backlog | P2 | T-001 (done) | Mood rating, pre-session intentions, plateau detection, competition routing. See insights-tab/INSIGHTS_INTELLIGENCE.md |
| T-002 | Review Phase Redesign (FEAT-003) | backlog | P1 | none | Summary card + collapsible details. 90-second principle respected. |
| T-003 | Experience Intake (FEAT-001) | backlog | P1 | none | Conversational intake for experienced practitioners. Solves cold-start. |
| T-004 | Processing Skip Upgrade (FEAT-004) | backlog | P2 | none | Gold "skip to manual" link after 10-15s delay. |
| T-005 | Shake-to-Report Bug Reporter | done | P1 | none | Shake to open feedback modal (Bug/Idea), auto-screenshot, submit to Sentry. Needs native rebuild + on-device test. |
| T-007 | ONB-001 code fix merged | done | P0 | none | profileService.create throws + Sentry, handlePayoffComplete guard, migration drops birth_date NOT NULL, CLAUDE.md schema rules. Merged via PR #40 (2026-04-08, Session 41). Migration applied to prod + Rachel's orphaned user deleted. |
| T-008 | TestFlight hotfix build (ONB-001) | done | P0 | T-007 | Shipped to TestFlight 2026-04-08 at 22:08 UTC from main. Submission ID `6f90d77c-1415-4675-951e-734071b2ea40`. Built after PRs #40 and #41 merged. Internal testers get it in ~10 min after Apple processing; external testers get it after Apple review (24-48h). |
| T-009 | Move external testers to internal testing | backlog | P1 | T-008 | Bypass Apple's 24-48h external review lag so schema/app sync issues are contained. Requires adding testers to App Store Connect team (Apple ID invite). Cap is 100 internal testers. |

### Design Audit (references mvp-1.0/docs/tracking/ISSUES.md, DA-/DS- prefixes)

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-010 | Resolve open DA- items (P0/P1) | ready | P0 | none | All P0/P1 design audit items from ISSUES.md resolved |
| T-011 | Resolve open DS- items (design system gaps) | ready | P1 | none | All design system gaps from ISSUES.md resolved |

### App Store Prep

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-020 | App Store screenshots (6.7" and 6.5") | backlog | P1 | T-001 | 5-8 screenshots per device size, approved by Drew |
| T-021 | App Store description and metadata | backlog | P1 | none | Title, subtitle, description, keywords, category |
| T-022 | Privacy policy hosted URL | backlog | P1 | none | Live URL, covers all data TOMO collects |
| T-023 | App review test account | done | -- | none | apple@assemblylabs.co configured |
| T-024 | App Store icon (1024x1024) | backlog | P1 | none | Final icon exported and uploaded |
| T-025 | Age rating questionnaire | backlog | P2 | none | Completed in App Store Connect |

---

## Studio Track

### Insights Content

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-030 | Write weekly insight prompt templates | done | P0 | T-001 | Psychology-informed prompt with belt routing, defense trending, experimentation validation. Shipped Session 38. |
| T-031 | Write "watch" item coaching copy | backlog | P1 | T-001 | Copy for flagged items (overtraining, plateau, inconsistency, etc.) |

### Onboarding + Coaching Copy

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-040 | Review and polish onboarding screen copy | backlog | P2 | none | All 4 onboarding screens read naturally, match brand voice |
| T-041 | Belt-specific welcome messaging | backlog | P3 | none | Different tone/content for white vs blue vs purple+ onboarding |

### Technique Library

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-050 | Audit technique tree data (361 techniques) | backlog | P2 | none | All techniques verified, no duplicates, positions correct |
| T-051 | Write technique descriptions for top 50 | backlog | P3 | T-050 | Short descriptions for the 50 most-logged techniques |

---

## Backlog (Post-Launch)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T-100 | Competition Tracker (FEAT-005) | backlog | Track comp results, weight class, match outcomes |
| T-101 | Injury Tracker (FEAT-006) | backlog | Persistent injury tracking across sessions |
| T-102 | Coach Integration (FEAT-007) | backlog | Student roster, feedback, promotion pipeline |
| T-103 | PostHog analytics integration | backlog | Add after App Store launch |
| T-104 | Android build | backlog | After iOS is stable and validated |
