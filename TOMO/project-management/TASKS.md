# Tasks

**Last updated:** 2026-04-02

Statuses: `backlog` | `ready` | `in-progress` | `blocked` | `done` | `cut`

Tracks: `app` | `studio`

---

## App Track

### Features (references mvp-1.0/docs/features/README.md)

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-001 | Build Insights Tab (FEAT-002) | ready | P0 | FEAT-008 (done) | Weekly insight generation, message-style render, typewriter effect. See insights-tab/ subfolder for full spec. |
| T-002 | Review Phase Redesign (FEAT-003) | backlog | P1 | none | Summary card + collapsible details. 90-second principle respected. |
| T-003 | Experience Intake (FEAT-001) | backlog | P1 | none | Conversational intake for experienced practitioners. Solves cold-start. |
| T-004 | Processing Skip Upgrade (FEAT-004) | backlog | P2 | none | Gold "skip to manual" link after 10-15s delay. |

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
| T-030 | Write weekly insight prompt templates | backlog | P0 | T-001 | Prompt templates that generate personalized weekly insights per belt/goals/frequency |
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
