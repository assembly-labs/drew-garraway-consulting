# STATS Page iOS Handoff Assessment

**Date:** January 2026
**Purpose:** Evaluate documentation readiness for iOS development handoff
**Focus:** Belt-adaptive STATS modules and AI/algorithm requirements

---

## Executive Summary

### Overall Readiness: 65% Ready

The TOMO project has **excellent conceptual documentation** for belt-adaptive STATS modules, but is missing **critical implementation specifications** needed for iOS development handoff.

| Category | Readiness | Notes |
|----------|-----------|-------|
| Product Vision & UX | 90% | Comprehensive strategy docs exist |
| Belt Psychology Research | 95% | Deep understanding of user needs per belt |
| Module Specifications | 75% | Good wireframes, missing component contracts |
| Data Collection Strategy | 80% | Solid framework, some gaps in extraction |
| AI/Algorithm Specifications | 25% | **Critical gap** - most specs marked TODO |
| Data Flow Architecture | 30% | **Critical gap** - no pipeline diagrams |

### Bottom Line

**Developers can understand WHAT to build, but not HOW to build the AI/data features.**

---

## What's Documented Well

### 1. Belt Personalization System (Excellent)

The belt-system code at `/prototype/src/config/belt-system/` is production-ready:

- `belt-profiles.ts` - Psychology profiles per belt level
- `feature-adaptations.ts` - Dashboard, chatbot, video, session logger adaptations
- `risk-signals.ts` - Dropout risk detection patterns
- `journal-patterns.ts` - Text analysis patterns
- `useBeltPersonalization()` hook - React integration ready

**For iOS:** This TypeScript code can be directly translated to Swift/Kotlin.

### 2. STATS Module Strategy (Good)

`STATS_MODULE_STRATEGY.md` provides:

- 14+ belt-adaptive module specifications
- Module visibility matrix (what to show/hide per belt)
- Wireframe mockups with ASCII art
- Data requirements per module
- Messaging guidelines per belt

### 3. Four Pillars Framework (Excellent)

`data-requirements-analysis.md` defines:

- Technical Proficiency (35%) - techniques, drilling, proficiency
- Sparring Performance (30%) - outcomes, submissions, partner context
- Consistency (20%) - frequency, mat hours, streaks
- Character (15%) - teaching, attitude, community

### 4. Data Capture Strategy (Good)

`JOURNAL_DATA_CAPTURE_STRATEGY.md` provides:

- Three-tier pyramid (Capture → Extract → Enrich)
- 90-second rule for post-training logging
- Voice/text extraction targets
- Persona-specific adaptations

---

## Critical Gaps for Development

### Gap 1: AI/NLP Pipeline Specification (BLOCKING)

**Status:** `AI_EXTRACTION_SPEC.md` is marked **TODO**

**What's Missing:**

```
Journal Entry (voice/text)
        ↓
   [??? HOW ???]
        ↓
Structured Data (techniques, outcomes, sentiment)
```

**Required Specifications:**

| Spec Needed | Priority | Notes |
|-------------|----------|-------|
| NLP entity extraction rules | P0 | How to identify technique names in text |
| Technique name fuzzy matching algorithm | P0 | "kimura" vs "kimmy" vs "shoulder lock" |
| Outcome parsing rules | P0 | "got tapped twice" → submissionsReceived: 2 |
| Sentiment analysis approach | P1 | Keyword-based vs LLM-based? |
| Confidence scoring algorithm | P1 | When to auto-accept vs prompt user |
| Position/posture detection | P2 | Inferring position from technique context |

**Recommendation:** Create `AI_EXTRACTION_SPEC.md` with:
- Input/output contracts
- Processing rules for each entity type
- Fallback behaviors when confidence is low
- Example inputs → expected outputs

### Gap 2: Module Component Contracts (HIGH)

The wireframes show WHAT modules look like, but iOS developers need:

```typescript
// Example of what's missing:
interface SurvivalScoreProps {
  currentAvgDuration: number;  // Where does this come from?
  previousAvgDuration: number; // Calculated how?
  escapeSuccessRate: number;   // We don't capture escapes!
  percentileRank: number;      // Against what population?
}
```

**For Each Module, Developers Need:**

1. **Data Source Mapping** - Which fields from session logs populate this?
2. **Calculation Logic** - Formulas for derived metrics
3. **Fallback Behavior** - What to show when data is insufficient?
4. **Update Frequency** - Real-time vs. daily aggregation?

### Gap 3: Data Flow Architecture (HIGH)

**Missing: End-to-end data flow diagram**

```
Session Logged → ??? → Dashboard Modules Updated
```

Questions unanswered:
- Is processing client-side or server-side?
- What triggers recalculation of stats?
- How are aggregations stored (pre-computed vs. on-demand)?
- Offline support - what's available without connectivity?

---

## Belt-by-Belt STATS Module Readiness

### White Belt Modules

| Module | Strategy Defined | Implementation Spec | Data Available | Ready? |
|--------|------------------|---------------------|----------------|--------|
| **Survival Score** | Yes | Partial | NO - Round duration not captured | Not buildable as designed |
| **Journey Timeline** | Yes | Yes | YES | Ready |
| **Consistency Score** | Yes | Yes | YES | Ready |
| **Foundations Progress** | Yes | Yes | YES - via technique matching | Ready with caveats |

**Gap:** The original "Survival Score" requires:
- Round-by-round duration (not captured)
- Escape attempts/successes (not captured)

**Recommendation:** Use "Consistency Score" as documented in `STATS_MODULE_IMPLEMENTATION.md` instead. This is already specified with realistic data.

### Blue Belt Modules

| Module | Strategy Defined | Implementation Spec | Data Available | Ready? |
|--------|------------------|---------------------|----------------|--------|
| **Game DNA** | Yes | Simplified as "Your Style" | Partial - submission data only | Buildable (simplified) |
| **Technique Web** | Yes | Simplified as "Technique Pairings" | YES - co-occurrence | Ready |
| **Pressure Meter** | Yes | No | NO - partner belt deprecated | Not buildable |
| **Hole Finder** | Yes | Simplified as "Vulnerability Map" | Partial | Buildable (simplified) |
| **Blues Detector** | Yes | Yes | YES | Ready |
| **Roll Context** | Yes | Deferred | NO - optional field | Not buildable yet |

**Gaps:**

1. **Game DNA / Your Style** - Needs specification for:
   - How to categorize submission types (neck/arm/leg)
   - Archetype detection algorithm ("guard player" vs "top player")
   - Minimum data threshold before showing

2. **Blues Detector** - Needs specification for:
   - Sentiment keyword list (partially exists)
   - Attendance decline calculation
   - Intervention trigger thresholds
   - Dismissal/snooze behavior

### Purple Belt Modules

| Module | Strategy Defined | Implementation Spec | Data Available | Ready? |
|--------|------------------|---------------------|----------------|--------|
| **System Mastery** | Yes | No | NO - user-defined systems | Not buildable |
| **Teaching Impact** | Yes | Deferred | NO - optional field | Not buildable yet |
| **Efficiency Matrix** | Yes | Simplified as "Submission Trends" | Partial | Buildable (simplified) |
| **Long Game** | Yes | Yes | YES | Ready |
| **Technique Mastery** | Yes | Yes | YES | Ready |

**Gaps:**

1. **System Mastery** - Concept is powerful but requires:
   - User-defined "system" creation flow
   - Technique grouping UI
   - No current data model for systems

2. **Teaching Impact** - Requires new data collection:
   - "Did you teach?" toggle in session logging
   - Student tracking (who did you help?)

---

## Data Collection: What We Have vs. What Modules Need

### Currently Collected (High Confidence)

| Field | Modules It Powers |
|-------|-------------------|
| Session date/time | Journey Timeline, Long Game, Consistency |
| Duration minutes | Consistency, Long Game |
| Training type (gi/nogi) | Your Style, Trends |
| Techniques drilled | Foundations, Technique Mastery, Pairings |
| Submissions given/received | Your Style, Vulnerability Map, Trends |
| Worked well / struggles | Insight callouts |
| Notes (free text) | Blues Detector (sentiment) |
| Belt level | All module filtering |
| Session count | Journey Timeline, Consistency |

### NOT Collected (Module Blockers)

| Missing Field | Modules Blocked | Recommendation |
|---------------|-----------------|----------------|
| Round duration | Survival Score | Use Consistency Score instead |
| Escape attempts | Survival Score | Use Consistency Score instead |
| Partner belt level | Pressure Meter | Cannot build - deprecate module |
| Round outcomes (W/L) | Pressure Meter | Cannot build - deprecate module |
| Roll context | Roll Context | Add as optional field (low friction) |
| Teaching indicator | Teaching Impact | Add as optional toggle |
| Position time breakdown | Game DNA | Infer from submissions instead |

---

## Algorithm Specifications Needed

### 1. Technique Fuzzy Matching

**Purpose:** Match user input to technique library

**Spec Needed:**
```
Input: "worked on armbar from guard"
Output: { technique: "Armbar", position: "Closed Guard", confidence: 0.92 }
```

- Synonym dictionary (kimura = double wristlock = chicken wing)
- Position inference from context
- Confidence scoring
- Handling ambiguous inputs

### 2. Game Archetype Detection

**Purpose:** Classify user's style for "Your Style" module

**Spec Needed:**
```
Input: Last 30 sessions with submissions data
Output: { archetype: "guard_player", confidence: 0.78 }
```

- Archetype definitions and thresholds
- Minimum data requirements
- How to handle insufficient data

### 3. Blues Detector Sentiment Analysis

**Purpose:** Detect dropout risk from journal text

**Spec Needed:**
```
Input: "Frustrated today, felt like I suck"
Output: { sentiment: "negative", riskSignal: true, keywords: ["frustrated", "suck"] }
```

- Keyword lists (negative, positive)
- Scoring algorithm
- Threshold for triggering intervention
- False positive handling

### 4. Foundations Progress Matching

**Purpose:** Track white belt curriculum coverage

**Spec Needed:**
```
Input: User's technique history
Output: { escapes: 3/4, guards: 2/4, submissions: 4/6, ... }
```

- Canonical technique list (exists partially)
- Fuzzy matching to user's logged techniques
- Status determination (touched vs. proficient)

---

## Recommended Pre-Handoff Actions

### Priority 0 (Must Have for Development)

1. **Create `AI_EXTRACTION_SPEC.md`**
   - Define NLP pipeline architecture
   - Document entity extraction rules
   - Provide example input/output pairs

2. **Create Data Flow Diagram**
   - Show journey from session log to dashboard
   - Define where AI processing happens
   - Specify offline vs. online capabilities

3. **Complete Module Component Contracts**
   - For each buildable module, document:
     - Props/inputs
     - Data source mapping
     - Calculation formulas
     - Fallback behaviors

### Priority 1 (Important)

4. **Finalize Module Scope**
   - Confirm which modules are in iOS v1
   - Mark unbuildable modules as deferred
   - Update visibility matrix

5. **Specify Algorithm Details**
   - Technique fuzzy matching rules
   - Game archetype detection logic
   - Blues detector thresholds

### Priority 2 (Nice to Have)

6. **Create Test Data Scenarios**
   - Example user journeys (white belt 3 months in, blue belt plateau)
   - Expected module outputs for each scenario

---

## Quick Reference: What's Ready vs. Not

### Ready for iOS Development

- Journey Timeline (white belt)
- Consistency Score (white/all)
- Foundations Progress (white)
- Technique Pairings (blue)
- Blues Detector (blue) - needs sentiment spec
- Long Game (purple+)
- Technique Mastery (purple+)
- Submission Trends (purple+)

### Needs More Specification

- Your Style (blue) - archetype algorithm
- Vulnerability Map (blue) - body region mapping

### Cannot Build with Current Data

- Survival Score - requires round duration
- Pressure Meter - requires partner belt
- System Mastery - requires user-defined systems
- Teaching Impact - requires new data field
- Roll Context - requires new data field

---

## Appendix: Document Reference

| Document | Location | Status |
|----------|----------|--------|
| Belt Personalization System | `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` | Active |
| STATS Module Strategy | `/docs/product/STATS_MODULE_STRATEGY.md` | Active |
| STATS Module Implementation | `/docs/product/STATS_MODULE_IMPLEMENTATION.md` | Active |
| Data Requirements Analysis | `/docs/research/data-requirements-analysis.md` | Active |
| Journal Data Capture | `/docs/data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` | Active |
| Infographic Strategy | `/docs/data-and-ai/INFOGRAPHIC_STRATEGY.md` | Active |
| AI Extraction Spec | `/docs/data-and-ai/AI_EXTRACTION_SPEC.md` | **TODO** |
| Voice Transcription Spec | `/docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md` | **TODO** |
| Personalization Engine | `/docs/data-and-ai/PERSONALIZATION_ENGINE.md` | **TODO** |
| Risk Detection Signals | `/docs/data-and-ai/RISK_DETECTION_SIGNALS.md` | **TODO** |

---

*This assessment is based on documentation review as of January 2026. Update as specifications are completed.*
