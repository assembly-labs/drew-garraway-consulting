# Documentation Flaws: Contradictions, Duplicates & Issues

> **Purpose:** This document tracks inconsistencies, duplications, and contradictions found across TOMO's documentation. Items here should be reviewed and resolved.
>
> **How to use:** Each item includes the affected documents, description, and recommended resolution.
>
> **Last Audit:** January 25, 2026

---

## Summary

| Category | Count | Priority |
|----------|-------|----------|
| Contradictions | 5 | High |
| Duplications | 6 | Medium |
| Incomplete/Outdated | 4 | Medium |
| Naming Inconsistencies | 3 | Low |

---

## 1. Contradictions

### C1: Stats Module Visibility - Conflicting Information

**Affected Documents:**
- `STATS_CURRENT_STATE_PRD.md` (Module Visibility Matrix)
- `DATA_AND_AI_BY_PAGE.md` (Stats Modules by Belt)
- `FEATURES.md` (Section 5: Stats)

**Issue:**
Different documents show slightly different module visibility rules for belt levels. For example:

| Module | STATS_CURRENT_STATE_PRD | DATA_AND_AI_BY_PAGE |
|--------|-------------------------|---------------------|
| TechniquePairings | Blue belt only | Not mentioned |
| BluesDetector | Blue belt only | Conditional on risk signals |
| YourJourney | Purple+ | Purple+ |

**Recommendation:**
- Establish `STATS_CURRENT_STATE_PRD.md` as the authoritative source for module visibility
- Update `DATA_AND_AI_BY_PAGE.md` to reference the PRD rather than duplicate
- Ensure `FEATURES.md` matches the PRD

**Severity:** Medium

---

### C2: Primary Metric by Belt - Inconsistent Definitions

**Affected Documents:**
- `STATS_CURRENT_STATE_PRD.md` (Hero Metric section)
- `DATA_AND_AI_BY_PAGE.md` (Belt Personalization section)
- `/config/belt-system/feature-adaptations.ts` (code)

**Issue:**
Brown/Black belt primary metrics differ between documents:

| Document | Brown Belt | Black Belt |
|----------|------------|------------|
| STATS_CURRENT_STATE_PRD | "Teaching sessions" | "Teaching sessions" |
| DATA_AND_AI_BY_PAGE | "teaching_sessions" (brown) | Not specified |
| FEATURES.md | "Teaching Frequency" | "Legacy metrics" |

**Recommendation:**
- Define canonical primary metrics per belt in ONE location
- Code and docs should reference that single source

**Severity:** Medium

---

### C3: AI Insight Generation - Conflicting Frequency Rules

**Affected Documents:**
- `INSIGHTS_PRD.md` (Generation Rules)
- `DATA_AND_AI_BY_PAGE.md` (Insights section)

**Issue:**
Both documents define insight generation frequency, but with subtle differences:

| Rule | INSIGHTS_PRD | DATA_AND_AI_BY_PAGE |
|------|--------------|---------------------|
| Max frequency | 1 per calendar day | 1 per day |
| Trigger | New session since last insight | New session logged since last |
| Cooldown | 24h minimum between generations | Not mentioned |

The 24h cooldown rule is only in INSIGHTS_PRD. If a user logs at 11pm and again at 7am the next day, which rule applies?

**Recommendation:**
- Clarify: is it "calendar day" or "24 hours"?
- Remove duplicate rules from DATA_AND_AI_BY_PAGE, reference INSIGHTS_PRD instead

**Severity:** Low (edge case)

---

### C4: Voice Transcription Service - Conflicting Cost Estimates

**Affected Documents:**
- `VOICE_TRANSCRIPTION_SPEC.md` (Cost Management section)
- `/TOMO/CLAUDE.md` (Why AssemblyAI section)

**Issue:**
Different pricing figures quoted:

| Document | Price/min |
|----------|-----------|
| VOICE_TRANSCRIPTION_SPEC | $0.00025/sec = $0.015/min (incorrect math) |
| VOICE_TRANSCRIPTION_SPEC | $0.0062/min (Best tier) |
| CLAUDE.md | $0.0062/min (Best tier), $0.002/min (Nano) |

The $0.00025/sec calculation is wrong ($0.00025 × 60 = $0.015, but spec also says $0.0062/min in same document).

**Recommendation:**
- Remove the incorrect per-second pricing
- Standardize on $0.0062/min (Best) and $0.002/min (Nano)

**Severity:** Low (confusing but not blocking)

---

### C5: Belt Content Gating - "Planned" vs "Implemented"

**Affected Documents:**
- `TECHNIQUES_PRD.md` (Section 6.3: Content Gating)
- `FEATURES.md` (Techniques section)

**Issue:**
TECHNIQUES_PRD says content gating is "Planned" and "Not implemented", but FEATURES.md lists belt-specific content filtering as a feature. It's unclear if this is working or not.

**Recommendation:**
- Verify in code whether content gating exists
- Update both documents to match reality
- If partial, document what works vs. what's planned

**Severity:** Medium

---

## 2. Duplications

### D1: Belt Psychology Profiles - Defined in Multiple Places

**Affected Documents:**
- `BELT_PERSONALIZATION_SYSTEM.md` (full psychology profiles)
- `INSIGHTS_PRD.md` (Belt Personalization section)
- `DATA_AND_AI_BY_PAGE.md` (Belt Personalization sections)
- `/config/belt-system/belt-profiles.ts` (code)

**Issue:**
Belt psychology information (struggles, motivations, dropout risks) is repeated in 4+ locations. Changes require multiple updates.

**Recommendation:**
- Single source of truth: `BELT_PERSONALIZATION_SYSTEM.md` for documentation
- Other documents should REFERENCE, not duplicate
- Code implements from documentation

**Severity:** Medium (maintenance burden)

---

### D2: AI Tone Profiles - Duplicated Definitions

**Affected Documents:**
- `INSIGHTS_PRD.md` (Belt Tone Profiles table)
- `DATA_AND_AI_BY_PAGE.md` (Tone Profiles section)
- `BELT_INTEGRATION_SPEC.md` (chatbot adaptations)
- `/config/belt-system/feature-adaptations.ts` (code)

**Issue:**
AI tone profiles (warm_supportive, coaching_balanced, peer_analytical) defined in multiple places with slight variations.

**Recommendation:**
- Define in `BELT_INTEGRATION_SPEC.md` only
- Other docs reference that single source

**Severity:** Medium

---

### D3: Journal Data Model - Repeated in Multiple PRDs

**Affected Documents:**
- `SESSION_LOGGER_PRD.md` (Session data model)
- `JOURNAL_PRD.md` (JournalEntry model)
- `FEATURES.md` (Data Models section)
- `/prototype/src/types/database.ts` (code)

**Issue:**
Session/JournalEntry data model defined in multiple places. Field names and types may drift.

**Recommendation:**
- Code (`database.ts`) is source of truth for types
- Documentation should reference code, not duplicate

**Severity:** Medium

---

### D4: Video Recommendation Logic - Duplicated

**Affected Documents:**
- `TECHNIQUES_PRD.md` (Belt Personalization section)
- `DATA_AND_AI_BY_PAGE.md` (Techniques section)

**Issue:**
Both documents describe the "For You" recommendation algorithm with slightly different emphasis.

**Recommendation:**
- TECHNIQUES_PRD.md is authoritative for Techniques page
- DATA_AND_AI_BY_PAGE.md should summarize and link

**Severity:** Low

---

### D5: Risk Signal Definitions - Multiple Locations

**Affected Documents:**
- `INSIGHTS_PRD.md` (mentions risk detection)
- `DATA_AND_AI_BY_PAGE.md` (Cross-Cutting: Risk Detection System)
- `BELT_PERSONALIZATION_SYSTEM.md` (risk signals)
- `/config/belt-system/risk-signals.ts` (code)

**Issue:**
Risk signal thresholds and definitions in multiple places.

**Recommendation:**
- Code is source of truth
- Single documentation location: `DATA_AND_AI_BY_PAGE.md` Risk Detection section

**Severity:** Medium

---

### D6: Breakthrough Detection - Duplicated

**Affected Documents:**
- `STATS_CURRENT_STATE_PRD.md` (Breakthrough Hero section)
- `DATA_AND_AI_BY_PAGE.md` (Stats AI Processing)

**Issue:**
Breakthrough types and detection logic described in both places.

**Recommendation:**
- STATS_CURRENT_STATE_PRD.md is authoritative for Dashboard
- DATA_AND_AI_BY_PAGE.md should reference, not duplicate

**Severity:** Low

---

## 3. Incomplete/Outdated

### I1: JOURNAL_HANDOFF_STATUS.md - Likely Outdated

**Document:** `JOURNAL_HANDOFF_STATUS.md`

**Issue:**
This document tracks planned features and "Not Started" status items. It may not reflect current implementation state.

**Questions:**
- Has infinite scroll been implemented?
- Has delete session been implemented?
- Has backdate session been implemented?

**Recommendation:**
- Audit against codebase
- Update status or archive document

**Severity:** Medium

---

### I2: STATS_FUTURE_STATE_PRD.md - Timeline References

**Document:** `STATS_FUTURE_STATE_PRD.md`

**Issue:**
Contains time estimates ("Estimated Effort: 2 sprints") which violate the principle of "planning without timelines."

**Recommendation:**
- Remove time estimates
- Keep implementation phases as ordered priorities without dates

**Severity:** Low (style issue)

---

### I3: Missing Component Specs

**Documents:** Multiple PRDs

**Issue:**
JOURNAL_HANDOFF_STATUS.md references needed "Component Specifications" that don't exist:
- Infinite Scroll (SessionHistory)
- Delete Flow (SessionDetail)
- Date Picker (new component)
- Overflow Menu (SessionDetail)

**Recommendation:**
- Either create the specs or remove references
- Document decision on whether detailed specs are needed

**Severity:** Medium (if dev handoff is imminent)

---

### I4: FEATURES.md vs Reality - Potential Drift

**Document:** `FEATURES.md`

**Issue:**
FEATURES.md claims to be the "single source of truth" but may not have been updated when PRDs added new planned features (e.g., Journal PRD added 6 new features).

**Recommendation:**
- Audit FEATURES.md against all PRDs
- Add any missing features with "Planned" status
- Establish update process when PRDs change

**Severity:** High (defeats purpose of SSOT)

---

## 4. Naming Inconsistencies

### N1: "Journal" vs "Session History" vs "Journal History"

**Affected Documents:** Multiple

**Issue:**
The same page is called different things:
- "Journal" (tab name in app)
- "Session History" (component name: `SessionHistory.tsx`)
- "Journal History" (some docs)

**Recommendation:**
- User-facing: "Journal"
- Code/component: "SessionHistory"
- Documentation should use "Journal" consistently

**Severity:** Low (confusing but not blocking)

---

### N2: "Stats" vs "Dashboard"

**Affected Documents:** Multiple

**Issue:**
The same page is called:
- "Stats" (tab name in app)
- "Dashboard" (component name: `Dashboard.tsx`)

**Recommendation:**
- User-facing: "Stats"
- Code/component: "Dashboard"
- Documentation should use "Stats (Dashboard)" when clarity needed

**Severity:** Low

---

### N3: "Insights" vs "Training Feedback" vs "AI Feedback"

**Affected Documents:** Multiple

**Issue:**
The same page is called:
- "Insights" (some docs)
- "Training Feedback" (component name: `TrainingFeedback.tsx`)
- "AI Feedback" (some UI text)

**Recommendation:**
- User-facing: "Insights" (simpler)
- Code/component: "TrainingFeedback"
- Documentation should use "Insights" consistently

**Severity:** Low

---

## Resolution Priority

### High Priority (Fix Soon)

| ID | Issue | Impact |
|----|-------|--------|
| I4 | FEATURES.md may not be in sync | Defeats single source of truth |
| C5 | Content gating unclear if implemented | Dev confusion |

### Medium Priority (Fix When Convenient)

| ID | Issue | Impact |
|----|-------|--------|
| C1 | Stats module visibility conflicts | Potential implementation bugs |
| C2 | Primary metric inconsistencies | Confused developers |
| D1-D6 | Various duplications | Maintenance burden |
| I1 | JOURNAL_HANDOFF possibly outdated | Misleading status |
| I3 | Missing component specs | Incomplete handoff |

### Low Priority (Address Eventually)

| ID | Issue | Impact |
|----|-------|--------|
| C3 | Insight frequency edge case | Rare scenario |
| C4 | Pricing math error | Confusing but not critical |
| I2 | Timeline references | Style violation |
| N1-N3 | Naming inconsistencies | Readability |

---

## Process Recommendations

### Prevent Future Issues

1. **Single Source of Truth Discipline**
   - When a concept exists in multiple places, designate ONE as authoritative
   - Other documents should link, not duplicate

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

*This document should be updated whenever new flaws are discovered or existing ones are resolved.*
