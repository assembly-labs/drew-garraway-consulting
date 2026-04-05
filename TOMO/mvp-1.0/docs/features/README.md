# TOMO Features Backlog

**Last Updated:** 2026-04-04
**Purpose:** Prioritized list of planned features. Major features get their own subfolder with strategy docs, specs, and task breakdowns.

---

## How This Works

This is the **single source of truth** for "what are we building next?"

- **Major features** get a subfolder (e.g., `experience-intake/`) with their own README, strategy doc, spec, and tasks
- **Minor features** are rows in the table below with a one-line description
- **Bugs and polish** live in `docs/mvp-1.0/tracking/ISSUES.md` (not here)
- **Shipped work** lives in `docs/mvp-1.0/tracking/CHANGELOG.md` (not here)

### Priority Levels

| Level | Meaning |
|-------|---------|
| **P0** | Blocker. Must ship before anything else. |
| **P1** | High priority. Next up after P0s are clear. |
| **P2** | Should build. Queued behind P1s. |
| **P3** | Nice to have. Build when there's room. |

### Status Values

| Status | Meaning |
|--------|---------|
| **Exploring** | Research/strategy phase. Picking an approach. |
| **Speccing** | Approach picked. Writing detailed spec + tasks. |
| **Ready** | Spec complete. Ready to build. |
| **In Progress** | Actively being built. |
| **Shipped** | Live in TestFlight. Move to CHANGELOG.md. |

---

## Active Backlog

| ID | Feature | Priority | Status | Subfolder | Summary |
|----|---------|----------|--------|-----------|---------|
| FEAT-001 | **Experience Intake** | **P1** | Exploring | [experience-intake/](experience-intake/) | Conversational intake for experienced practitioners. Solves cold-start, lost context, and trust gap for anyone with 6mo+ training. |
| FEAT-002 | **Insights Tab** | **P0** | Shipped | [insights-tab/](insights-tab/) | Weekly debriefs with psychology-informed prompts. Belt-adapted tone, defense trending, experimentation validation. Shipped Session 38. |
| FEAT-009 | **Insights Intelligence** | **P2** | Exploring | [insights-tab/](insights-tab/) | Mood tracking, pre-session intentions, plateau detection, competition routing, feedback fading. Pickup: `INSIGHTS_INTELLIGENCE.md` |
| FEAT-008 | **User Profile Expansion** | **P0** | Shipped | -- | Birthday (mandatory, 18+), gender (mandatory), body weight (optional), expanded training goals (self-defense, community). Both editable from Profile with smart warnings (age bracket / gender switch). Shipped to TestFlight Mar 30. |
| FEAT-003 | **Review Phase Redesign** | **P1** | Open | -- | Review phase shows 10+ fields simultaneously. Violates 90-second principle. Needs summary card + collapsible details. (Also DA-003 in ISSUES.md) |
| FEAT-004 | **Processing Skip Upgrade** | **P2** | Open | -- | "Skip to manual entry" link is too subtle during 150s wait. Delay 10-15s then fade in with gold text. (Also DA-016 in ISSUES.md) |
| FEAT-005 | **Competition Tracker** | **P3** | Open | -- | Track competition results, weight class, match outcomes. Low priority but feeds into technique insights. |
| FEAT-006 | **Injury Tracker** | **P3** | Open | -- | Persistent injury tracking across sessions. 91% of practitioners report injuries. Affects technique recommendations. |
| FEAT-007 | **Coach Integration** | **P3** | Open | -- | Student roster, feedback entry, promotion pipeline. Phase 2 feature set. |

---

## Completed Features

Move features here when they ship to TestFlight with a date and link to the CHANGELOG entry.

| ID | Feature | Shipped | CHANGELOG Entry |
|----|---------|---------|-----------------|
| FEAT-002 | Insights Tab | 2026-04-04 | CHANGELOG.md: Session 38 |
| FEAT-008 | User Profile Expansion | 2026-03-30 | CHANGELOG.md: Session 32 |

---

## Relationship to Other Tracking Docs

| Doc | What it tracks | When to use it |
|-----|----------------|----------------|
| **This file** (`features/README.md`) | Planned features, what's next | Starting a new feature, checking priorities |
| `mvp-1.0/tracking/ISSUES.md` | Bugs, polish, design audit items | Fixing something broken or rough |
| `mvp-1.0/tracking/CHANGELOG.md` | What shipped, per session | End of every coding session |
| `project/BACKLOG.md` | Legacy backlog (Jan 2026) | Reference only, superseded by this file |
