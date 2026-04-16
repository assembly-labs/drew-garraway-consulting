# Tasks

**Last updated:** 2026-04-13 (Session 40)

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
| T-007 | Insights ENH-01 through ENH-10 | done | P1 | T-001 (done) | 10 intelligence enhancements shipped to TestFlight Apr 11-12. Plateau detection, historical comparison, technique linking, Tell Me More chat. See INSIGHTS_ENHANCEMENTS.md. |
| T-008 | Reflections Feature (FEAT-010) | backlog | P1 | none | Freeform voice/text reflections -- session-attached + standalone. Needs spec, DB migration, build. Pitch approved Apr 12. See features/reflections/PITCH.html |
| T-009 | Journal Edit Enhancement (autocomplete + UX) | done | P1 | none | Technique autocomplete in edit sheets, empty section collapse, content-aware toasts, icon visibility fix. 6 phases shipped Session 39. |
| T-070 | Review CEO Product Audit | ready | P0 | none | Drew reviews `docs/CEO_AUDIT_REPORT.md` and `site/internal/product-audit/index.html`. Acceptance: Drew provides written feedback on audit findings, data gaps, and opportunity priorities. |
| T-071 | Write Feature Requirement: Free-Form Reflections Journal (FEAT-010 expansion) | ready | P0 | none | Full FRD expanding FEAT-010 pitch into complete requirement doc. See `features/reflections/FEATURE_REQUIREMENTS.md`. |
| T-072 | Write Feature Requirement: AI Video Recommendations (FEAT-011) | ready | P0 | none | Full FRD for AI-powered video curation. See `features/video-recommendations/FEATURE_REQUIREMENTS.md`. |

### Journal UX Audit (references mvp-1.0/docs/tracking/ISSUES.md, JRN- prefixes)

| ID | Task | Status | Priority | Dependencies | Acceptance Criteria |
|----|------|--------|----------|-------------|-------------------|
| T-060 | Journal search (JRN-001) | backlog | P1 | none | Users can search sessions by technique, notes, instructor, topic. Results update as you type. |
| T-061 | Fix "Earlier" date grouping (JRN-002) | backlog | P1 | none | Sessions older than this month grouped by month ("March 2026", "February 2026") instead of one "Earlier" bucket. |
| T-062 | Display mood on SessionDetail (JRN-003) | backlog | P1 | none | mood_rating shown in session detail header. Visual matches 5-dot pattern from success phase. |
| T-063 | Session card richness indicators (JRN-004) | backlog | P1 | none | Cards show subtle icons for: has notes, has mood, has injuries. Visual weight reflects content depth. |
| T-064 | Ship narrative summary on SessionDetail (JRN-005) | backlog | P1 | none | generateNarrativeSummary() rendered at top of detail screen as human-readable "at a glance" text. |
| T-065 | Audio playback on SessionDetail (JRN-006) | backlog | P1 | none | Play button near transcript section. Uses signed URL from audioService. Plays original voice recording. |
| T-066 | Hide empty sections on SessionDetail (JRN-007) | done | P1 | none | Empty sections collapsed into "+ Add" gold links. Shipped Session 39. |
| T-067 | Expand journal filters (JRN-008) | backlog | P2 | none | Add session kind filter (class/open mat/comp). Consider sparring toggle and date range as progressive disclosure. |

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
