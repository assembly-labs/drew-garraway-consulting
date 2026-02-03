# Documentation Flaws: Contradictions, Duplicates & Issues

> **Purpose:** This document tracks inconsistencies, duplications, and contradictions found across TOMO's documentation. Items here should be reviewed and resolved.
>
> **How to use:** Each item includes the affected documents, description, and resolution status.
>
> **Last Audit:** February 1, 2026

---

## Summary

| Category | Total | Resolved | Remaining | Priority |
|----------|-------|----------|-----------|----------|
| Contradictions | 5 | 5 | 0 | High |
| Duplications | 6 | 6 | 0 | Medium |
| Incomplete/Outdated | 4 | 3 | 1 | Medium |
| Naming Inconsistencies | 3 | 0 | 3 | Low |

---

## 1. Contradictions

### C1: Stats Module Visibility - Conflicting Information — RESOLVED

**Affected Documents:**
- `STATS_CURRENT_STATE_PRD.md` (Module Visibility Matrix)
- `DATA_AND_AI_BY_PAGE.md` (Stats Modules by Belt)
- `FEATURES.md` (Section 5: Stats)

**Issue:**
Different documents showed slightly different module visibility rules for belt levels.

**Resolution (Feb 1, 2026):**
- `STATS_CURRENT_STATE_PRD.md` established as the **sole authority** for module visibility and primary metrics per belt
- `DATA_AND_AI_BY_PAGE.md` — inline visibility tables replaced with cross-reference to STATS_CURRENT_STATE_PRD.md; module table now documents only data requirements and AI processing, not visibility
- `FEATURES.md` — Hero Metric by Belt table and Module Visibility Matrix replaced with cross-references to STATS_CURRENT_STATE_PRD.md

---

### C2: Primary Metric by Belt - Inconsistent Definitions — RESOLVED

**Affected Documents:**
- `STATS_CURRENT_STATE_PRD.md` (Hero Metric section)
- `DATA_AND_AI_BY_PAGE.md` (Belt Personalization section)
- `FEATURES.md` (Belt Personalization table)

**Issue:**
Brown/Black belt primary metrics differed between documents.

**Resolution (Feb 1, 2026):**
- `STATS_CURRENT_STATE_PRD.md` is the single authority for hero metrics per belt
- `DATA_AND_AI_BY_PAGE.md` — primary metric definitions removed from belt personalization diagram, replaced with cross-reference
- `FEATURES.md` — "Primary Metric" row removed from Belt Personalization table, replaced with cross-reference

---

### C3: AI Insight Generation - Conflicting Frequency Rules — RESOLVED

**Affected Documents:**
- `INSIGHTS_PRD.md` (Generation Rules)
- `DATA_AND_AI_BY_PAGE.md` (Insights section)

**Issue:**
INSIGHTS_PRD had both "1 per calendar day" and "24h minimum between generations" — contradictory edge case.

**Resolution (Feb 1, 2026):**
- Canonical rule: **1 per calendar day** (simpler, no timestamp math needed)
- `INSIGHTS_PRD.md` — removed "Cooldown: 24h minimum" row from Generation Rules table
- `DATA_AND_AI_BY_PAGE.md` — changed "Max 1 insight per day" to "Max 1 insight per calendar day"

---

### C4: Voice Transcription Service - Conflicting Cost Estimates — RESOLVED

**Affected Documents:**
- `VOICE_TRANSCRIPTION_SPEC.md` (Cost Management section)
- `/TOMO/CLAUDE.md` (Why AssemblyAI section)

**Issue:**
Incorrect pricing: $0.00025/sec = $0.015/min did not match AssemblyAI's actual rate of $0.0062/min.

**Resolution (Feb 1, 2026):**
- `VOICE_TRANSCRIPTION_SPEC.md` — corrected comparison table pricing from "$0.00025/sec ($0.015/min)" to "$0.0062/min (Best) / $0.002/min (Nano)"
- Recalculated all cost projections using correct $0.0062/min rate (TestFlight: ~$1, Launch: ~$12, Growth: ~$120, Scale: ~$1,200)

---

### C5: Belt Content Gating - "Planned" vs "Implemented" — RESOLVED

**Affected Documents:**
- `TECHNIQUES_PRD.md` (Section 6.3: Content Gating)
- `FEATURES.md` (Techniques section)

**Issue:**
TECHNIQUES_PRD said content gating was "Planned", but FEATURES.md implied it was implemented.

**Resolution (Feb 1, 2026):**
- **Code verified:** Content gating is NOT implemented. All content is visible to all belt levels. `useBeltPersonalization()` is imported but only used for belt suggestions, not gating.
- `FEATURES.md` — "Gated Categories" heading changed to "Gated Categories (Planned - Not Implemented)" with explicit status note
- `TECHNIQUES_PRD.md` — Section 7.4 status clarified: "Not implemented. No difficulty-based filtering exists. All content visible to all belts."

---

## 2. Duplications

### D1: Belt Psychology Profiles — RESOLVED

**Authority:** `BELT_PERSONALIZATION_SYSTEM.md`

**Resolution (Feb 1, 2026):** Cross-reference notes added in `INSIGHTS_PRD.md` and `DATA_AND_AI_BY_PAGE.md` pointing to `BELT_PERSONALIZATION_SYSTEM.md` as the canonical source. Content retained but readers directed to authority.

---

### D2: AI Tone Profiles — RESOLVED

**Authority:** `BELT_INTEGRATION_SPEC.md`

**Resolution (Feb 1, 2026):** Cross-reference notes added in `INSIGHTS_PRD.md` and `DATA_AND_AI_BY_PAGE.md` pointing to `BELT_INTEGRATION_SPEC.md` as the canonical source.

---

### D3: Journal Data Model — RESOLVED

**Authority:** Code at `/prototype/src/types/database.ts`

**Resolution (Feb 1, 2026):** Cross-reference notes added in `SESSION_LOGGER_PRD.md` and `JOURNAL_PRD.md` directing readers to code as the source of truth for field names and types.

---

### D4: Video Recommendation Logic — RESOLVED

**Authority:** `TECHNIQUES_PRD.md`

**Resolution (Feb 1, 2026):** Cross-reference note added in `DATA_AND_AI_BY_PAGE.md` pointing to `TECHNIQUES_PRD.md` for the authoritative recommendation algorithm.

---

### D5: Risk Signal Definitions — RESOLVED

**Authority:** Code at `/config/belt-system/risk-signals.ts`, docs at `TECH_DATA_AI_OVERVIEW.md`

**Resolution (Feb 1, 2026):** Cross-reference notes added in `INSIGHTS_PRD.md`, `DATA_AND_AI_BY_PAGE.md`, and `BELT_PERSONALIZATION_SYSTEM.md` pointing to `TECH_DATA_AI_OVERVIEW.md` and code as authoritative sources.

---

### D6: Breakthrough Detection — RESOLVED

**Authority:** `STATS_CURRENT_STATE_PRD.md`

**Resolution (Feb 1, 2026):** Cross-reference note added in `DATA_AND_AI_BY_PAGE.md` pointing to `STATS_CURRENT_STATE_PRD.md` for canonical breakthrough type definitions.

---

## 3. Incomplete/Outdated

### I1: JOURNAL_HANDOFF_STATUS.md - Likely Outdated — OPEN

**Document:** `JOURNAL_HANDOFF_STATUS.md`

**Issue:**
This document tracks planned features with "Not Started" status. With Tony joining as developer, this document's role needs to be clarified: is it still a useful handoff document, or should it be archived in favor of the updated JOURNAL_PRD.md + FEATURES.md?

**Recommendation:**
- Decision deferred until Tony starts. The document may serve as a useful onboarding reference for him.
- Features it tracks (infinite scroll, delete, backdate) are now properly listed in FEATURES.md as "Planned."

**Severity:** Low (no longer causing confusion since FEATURES.md is updated)

---

### I2: STATS_FUTURE_STATE_PRD.md - Timeline References — RESOLVED

**Document:** `STATS_FUTURE_STATE_PRD.md`

**Resolution (Feb 1, 2026):** Removed all timeline/effort estimates ("Estimated Effort: 2 sprints", day-count effort columns) from all 4 implementation phases. Priority labels (P0, P1) and dependency information retained.

---

### I3: Missing Component Specs — RESOLVED (Decision: Not Needed)

**Documents:** Multiple PRDs

**Issue:**
JOURNAL_HANDOFF_STATUS.md referenced component specs (Infinite Scroll, Delete Flow, Date Picker, Overflow Menu) that didn't exist.

**Resolution (Feb 1, 2026):** Decision: Detailed component specs are not needed for the prototype phase. The PRDs (JOURNAL_PRD.md, SESSION_LOGGER_PRD.md) contain sufficient specification for implementation. Tony will work from PRDs + code, not standalone component specs.

---

### I4: FEATURES.md vs Reality - Potential Drift — RESOLVED

**Document:** `FEATURES.md`

**Resolution (Feb 1, 2026):**
- Audited FEATURES.md against all PRDs
- Added 6 missing planned features: "What's Clicking"/"What Needs Work", Post-Save Summary Card, Infinite Scroll, Delete Session, Backdate Session, Date/Time Editing
- Updated feature counts (87 → 93)
- Injury Tracking confirmed already present

---

## 4. Naming Inconsistencies — ACKNOWLEDGED (Not Blocking)

The following naming inconsistencies exist across documentation. They are documented here for awareness but are intentional at this stage — code uses one name, user-facing UI uses another. Tony should follow this convention:

| Concept | User-Facing (docs, UI) | Code (components) |
|---------|------------------------|-------------------|
| Session history page | **Journal** | `SessionHistory.tsx` |
| Main dashboard page | **Stats** | `Dashboard.tsx` |
| AI coaching page | **Insights** | `TrainingFeedback.tsx` |

**Rule for documentation:** Use the user-facing name. When referencing code, use format "Journal (`SessionHistory.tsx`)" for clarity.

---

## Process Recommendations

### Prevent Future Issues

1. **Single Source of Truth Discipline**
   - When a concept exists in multiple places, designate ONE as authoritative
   - Other documents should link, not duplicate
   - Authorities established in this audit:
     - Module visibility / hero metrics: `STATS_CURRENT_STATE_PRD.md`
     - Belt psychology: `BELT_PERSONALIZATION_SYSTEM.md`
     - AI tone profiles: `BELT_INTEGRATION_SPEC.md`
     - Data models: Code at `/prototype/src/types/database.ts`
     - Risk signals: `TECH_DATA_AI_OVERVIEW.md` + code
     - Video recommendations: `TECHNIQUES_PRD.md`
     - Breakthrough detection: `STATS_CURRENT_STATE_PRD.md`
     - Insight generation rules: `INSIGHTS_PRD.md`

2. **Update Cascade Process**
   - When updating a PRD, check if FEATURES.md needs update
   - When updating belt system, check all pages that use it

3. **Quarterly Documentation Audit**
   - Review all PRDs against codebase
   - Update status fields
   - Archive obsolete documents

4. **Documentation Review in PRs**
   - If PR changes a feature, require doc update
   - Use checklist: "Does FEATURES.md reflect this change?"

---

*Last updated: February 1, 2026*
*Previous audit: January 25, 2026*
