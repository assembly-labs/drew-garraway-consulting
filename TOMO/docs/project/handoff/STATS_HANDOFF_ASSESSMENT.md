# STATS Page Handoff Assessment: Belt-Adaptive Modules

**Version:** 1.0
**Date:** January 21, 2026
**Purpose:** Evaluate documentation readiness for iOS development handoff
**Focus:** STATS page belt-adaptive visualization modules
**Audience:** Product Manager, iOS Development Team

---

## Executive Summary

**Overall STATS Readiness: 72% — READY WITH CAVEATS**

The STATS page documentation is substantially complete for iOS development handoff. Strategy documents are excellent, and a data-realistic implementation guide exists. However, several AI/algorithm specifications need completion before developers can build the intelligence layer.

### Readiness by Belt Level

| Belt Level | Readiness | Blocking Issues |
|------------|-----------|-----------------|
| **White Belt** | 85% | Minor: Milestone message refinement |
| **Blue Belt** | 68% | Medium: Blues Detector sentiment algorithm, Technique pairing logic |
| **Purple Belt** | 62% | Medium: System mastery detection, Teaching impact tracking |

### What's Strong

- **Strategy documentation** is comprehensive (STATS_MODULE_STRATEGY.md)
- **Data-realistic implementation** guide exists (STATS_MODULE_IMPLEMENTATION.md)
- **Belt personalization system** is fully implemented in codebase
- **Module visibility matrix** clearly defines what shows per belt
- **Wireframe specifications** are detailed enough for design handoff

### What's Blocking (Action Required)

1. **Sentiment analysis algorithm** for Blues Detector — No spec for how to detect negative patterns
2. **Technique pairing co-occurrence algorithm** — Logic described but not specified
3. **System mastery detection** — How does AI identify technique "systems" vs isolated techniques?
4. **Teaching impact data flow** — New data collection required, no schema defined

---

## Module Readiness Assessment

### Grading Scale

| Grade | Definition |
|-------|------------|
| **A** (90-100%) | Ready for implementation. Full specs, clear requirements, example outputs. |
| **B** (75-89%) | Mostly ready. Minor gaps or ambiguities that developers can resolve. |
| **C** (60-74%) | Significant gaps. Requires additional specification before build. |
| **D** (<60%) | Not ready. Missing critical specifications or data requirements. |

---

## White Belt Modules

### 1. Journey Timeline

**Grade: A (95%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | Uses `session_count`, `training_start_date` |
| Milestone definitions | Complete | 8 milestones from first class to 1 year |
| Messages/copy | Complete | Belt-appropriate messaging defined |
| Visual design | Complete | Wireframe in strategy doc |
| Component spec | Complete | `JourneyTimeline.tsx` defined |
| AI/Algorithm needs | None | Pure data display, no ML required |

**Implementation Notes:**
- All data already collected
- Milestones are static thresholds
- Dropout cliff messaging is contextual based on `daysActive`

**Remaining Work:**
- None — ready to build

---

### 2. Consistency Score

**Grade: A (92%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `session_count`, session dates, `target_frequency` |
| Streak calculation | Complete | Standard calendar-based streak logic |
| Messages/copy | Complete | Encouragement messaging defined |
| Visual design | Complete | Wireframe in implementation doc |
| Component spec | Complete | `ConsistencyScore.tsx` defined |
| AI/Algorithm needs | None | Pure calculation, no ML required |

**Implementation Notes:**
- Replaces the aspirational "Survival Score" (which required unavailable data)
- Focuses on what we CAN measure: showing up

**Remaining Work:**
- Finalize exact streak tolerance (same day? 48 hours?)

---

### 3. Foundations Progress

**Grade: B (82%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `techniquesDrilled[]` history |
| Foundations checklist | Complete | 20 techniques in 5 categories |
| Matching logic | Partial | Fuzzy matching rules not specified |
| Visual design | Complete | Progress bar wireframe defined |
| Component spec | Complete | `FoundationsProgress.tsx` defined |
| AI/Algorithm needs | Minor | Fuzzy technique name matching |

**Implementation Notes:**
- Scans all historical `techniquesDrilled` against a static curriculum
- Requires fuzzy string matching for variations ("armbar" vs "arm bar")

**Gaps to Address:**
- [ ] Define fuzzy matching thresholds (Levenshtein distance? Soundex?)
- [ ] Document all technique name variations to match
- [ ] Specify handling of partial matches ("closed guard sweep" → "Closed Guard"?)

---

### 4. Module Hiding Logic (White Belt)

**Grade: A (98%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Hide list | Complete | Sparring Grid, Deadliest Attack, Achilles Heel, Tournament Readiness |
| Visibility matrix | Complete | Table in strategy doc |
| Implementation hook | Complete | `useBeltPersonalization().dashboard.showCompetitionStats` |

**Remaining Work:**
- None — logic already exists in codebase

---

## Blue Belt Modules

### 4. Your Style (Game DNA)

**Grade: B (78%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `submissionsGiven[]`, `submissionsReceived[]`, `techniquesDrilled[]` |
| Style labels | Complete | 4 archetypes defined |
| Body focus mapping | Partial | Need technique → body region map |
| Visual design | Complete | Wireframe with attack zones |
| Component spec | Complete | `YourStyle.tsx` defined |
| AI/Algorithm needs | Minor | Style archetype classification |

**Gaps to Address:**
- [ ] Complete `TECHNIQUE_BODY_MAP` with all submissions:
  ```typescript
  // Example structure needed:
  const TECHNIQUE_BODY_MAP = {
    'Triangle': 'neck',
    'Armbar': 'arms',
    'Heel Hook': 'legs',
    // ... all techniques
  };
  ```
- [ ] Define exact ratio thresholds for style labels
- [ ] Specify minimum sample size before showing (e.g., 10 submissions)

---

### 5. Vulnerability Map

**Grade: B (80%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `submissionsReceived[]` |
| Body region mapping | Same gap | Shares TECHNIQUE_BODY_MAP need |
| Suggestion logic | Complete | General suggestions per body region |
| Visual design | Complete | Heat map wireframe |
| Component spec | Complete | `VulnerabilityMap.tsx` defined |
| AI/Algorithm needs | None | Pure aggregation |

**Gaps to Address:**
- [ ] Same TECHNIQUE_BODY_MAP as Your Style
- [ ] Define "focus area" detection threshold (e.g., >40% in one region)

---

### 6. Technique Pairings

**Grade: C (68%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `techniquesDrilled[]` per session with dates |
| Co-occurrence logic | Described | "Same session" pairing, but algorithm not specified |
| Visual design | Complete | Wireframe in implementation doc |
| Component spec | Complete | `TechniquePairings.tsx` defined |
| AI/Algorithm needs | Medium | Co-occurrence matrix calculation |

**Gaps to Address:**
- [ ] **Specify co-occurrence algorithm:**
  ```typescript
  // NEEDS SPECIFICATION:
  interface CoOccurrenceConfig {
    minimumSessions: number;       // How many sessions before showing?
    significanceThreshold: number; // What % co-occurrence is "significant"?
    maxPairingsToShow: number;     // Top N pairings per technique
    normalization: 'jaccard' | 'conditional' | 'raw_count';
  }
  ```
- [ ] Define which techniques are "primary" (worth showing pairings for)
- [ ] Specify messaging logic for system detection

---

### 7. Blues Detector

**Grade: C (65%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Risk signals | Complete | 4 signal types defined |
| Thresholds | Complete | Attendance drop, gap days, etc. |
| Intervention messages | Complete | 2 example banners |
| Sentiment analysis | **MISSING** | No algorithm specification |
| Component spec | Complete | `BluesDetector.tsx` defined |
| AI/Algorithm needs | **HIGH** | Sentiment detection from journal text |

**Critical Gap — Sentiment Analysis:**

The spec mentions detecting "negative sentiment" in journal notes but provides NO specification for how to do this. Options:

| Approach | Pros | Cons | Recommended |
|----------|------|------|-------------|
| **Keyword matching** | Simple, fast, no API cost | Low accuracy, false positives | MVP |
| **LLM classification** | High accuracy | API cost per entry, latency | Post-MVP |
| **Local ML model** | No API cost, fast | Complex, training data needed | Future |

**Required Specification (Missing):**
```typescript
// NEEDS DEFINITION:
interface SentimentDetectionSpec {
  approach: 'keyword' | 'llm' | 'local_ml';

  // If keyword-based:
  keywords: {
    negative: string[];
    positive: string[];
  };
  threshold: number; // How many negative keywords trigger alert?

  // If LLM-based:
  prompt: string;
  model: string;
  confidenceThreshold: number;

  // Detection rules:
  lookbackPeriod: number; // How many recent entries to analyze?
  triggerCount: number;   // How many negative entries before alert?
}
```

**Recommendation:**
1. **MVP:** Use keyword matching (list already exists in STATS_MODULE_IMPLEMENTATION.md)
2. **V2:** Upgrade to LLM-based classification using same pipeline as extraction

---

## Purple Belt Modules

### 8. The Long Game

**Grade: A (90%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | All sessions with dates |
| Aggregation logic | Complete | Year-over-year grouping |
| Lifetime totals | Complete | Sessions, hours, rounds, techniques |
| Visual design | Complete | Line chart wireframe |
| Component spec | Complete | `LongGame.tsx` defined |
| AI/Algorithm needs | None | Pure aggregation |

**Remaining Work:**
- Define year boundary handling (calendar year vs training anniversary)

---

### 9. Submission Trends

**Grade: B (85%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `submissionsGiven[]`, `submissionsReceived[]` with dates |
| Trend calculation | Complete | Month-over-month comparison |
| Visual design | Complete | Sparkline wireframe |
| Component spec | Complete | `SubmissionTrends.tsx` defined |
| AI/Algorithm needs | None | Pure calculation |

**Remaining Work:**
- Define minimum data threshold before showing trends
- Specify "most improved" calculation method

---

### 10. Technique Mastery

**Grade: B (82%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | Complete | `TechniqueProgress` with proficiency levels |
| Proficiency levels | Complete | learning → developing → proficient → advanced |
| Drill count thresholds | Partial | Not explicitly defined |
| Visual design | Complete | Tiered list wireframe |
| Component spec | Complete | `TechniqueMastery.tsx` defined |
| AI/Algorithm needs | Minor | Proficiency promotion logic |

**Gaps to Address:**
- [ ] Define exact drill counts for proficiency transitions:
  ```typescript
  const PROFICIENCY_THRESHOLDS = {
    learning: 1,        // First time drilled
    developing: ???,    // NEEDS DEFINITION
    proficient: ???,    // NEEDS DEFINITION
    advanced: ???,      // NEEDS DEFINITION
  };
  ```

---

### 11. System Mastery (DEFERRED)

**Grade: D (45%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | **MISSING** | Requires user-defined systems or AI detection |
| System definition | Conceptual | "Half guard system" idea but no schema |
| Detection algorithm | **MISSING** | How does AI identify a "system"? |
| Visual design | Complete | Flow chart wireframe |
| Component spec | Named only | `SystemMastery.tsx` |
| AI/Algorithm needs | **HIGH** | System detection is core feature |

**Why It's Deferred:**

This module requires either:
1. **User-defined systems:** User explicitly creates "My Half Guard System" and adds techniques — requires new UI, new data model
2. **AI-detected systems:** ML identifies technique clusters that form systems — requires training data, model development

**Workaround Implemented:**
- Use `TechniquePairings` as a proxy for system building
- Shows co-occurrence patterns without claiming to detect "systems"

**If We Want to Build This:**
```typescript
// NEEDS FULL SPECIFICATION:
interface SystemMasterySpec {
  // Option 1: User-defined
  systemSchema: {
    id: string;
    name: string;
    entryTechniques: string[];
    coreTechniques: string[];
    finishingTechniques: string[];
  };

  // Option 2: AI-detected
  clusteringAlgorithm: 'kmeans' | 'hierarchical' | 'graph_community';
  minimumTechniques: number;
  coOccurrenceThreshold: number;
  validationPrompt: string; // LLM to validate detected systems
}
```

---

### 12. Teaching Impact (DEFERRED)

**Grade: C (55%)**

| Aspect | Status | Notes |
|--------|--------|-------|
| Data requirements | **NEW FIELD** | Requires `didTeach`, `studentsHelped[]` |
| Schema change | Documented | Optional toggle proposed |
| Visual design | Complete | Contribution summary wireframe |
| Component spec | Named only | `TeachingImpact.tsx` |
| AI/Algorithm needs | None | Pure aggregation once data exists |

**Why It's Deferred:**

Requires new data collection:
- Add "Did you help teach?" toggle to session logger
- Add optional "Who did you help?" field
- Track: `teachingSessionCount`, `studentsHelped[]`, `techniquesTaught[]`

**Implementation Path:**
1. Add optional toggle to session logger (low friction)
2. Track basic counts first, expand later
3. Build module once data accumulates (Month 2+)

---

## Cross-Cutting Concerns

### Belt Personalization Hook

**Grade: A (95%)**

The `useBeltPersonalization()` hook is fully implemented and provides:

```typescript
const {
  profile,        // Psychology profile
  dashboard,      // Dashboard config including modules
  sessionLogger,  // Session logger adaptations
  chatbot,        // AI response config
  videoTutorials, // Content recommendations
  isInRiskWindow, // Risk detection
  analyzeJournal, // Journal text analysis
} = useBeltPersonalization();
```

**Status:** Ready for use. iOS developers can mirror this pattern.

---

### Module Visibility Matrix

**Grade: A (92%)**

Complete matrix exists in STATS_MODULE_STRATEGY.md showing exactly which modules appear for each belt level.

**Implementation:** Extend `dashboard.modules` in feature-adaptations.ts to include boolean flags for each module.

---

## AI/Algorithm Specification Gaps

### Summary Table

| Algorithm | Module(s) | Priority | Effort | Status |
|-----------|-----------|----------|--------|--------|
| Fuzzy technique matching | Foundations Progress | P1 | Low | **NEEDS SPEC** |
| Technique → Body region map | Your Style, Vulnerability Map | P1 | Low | **NEEDS DATA** |
| Co-occurrence calculation | Technique Pairings | P1 | Medium | **NEEDS SPEC** |
| Sentiment detection | Blues Detector | P0 | Medium | **NEEDS SPEC** |
| Proficiency thresholds | Technique Mastery | P2 | Low | **NEEDS DEFINITION** |
| System detection | System Mastery | P3 | High | **DEFERRED** |

### Required Specifications (Before Handoff)

1. **Sentiment Detection Algorithm** (P0)
   - Define keyword lists
   - Define detection thresholds
   - Document escalation path to LLM

2. **Technique Co-occurrence Algorithm** (P1)
   - Define calculation method
   - Define significance thresholds
   - Define visualization rules

3. **Technique Body Region Map** (P1)
   - Complete mapping for all techniques
   - Define fallback for unknown techniques

4. **Fuzzy Matching Specification** (P1)
   - Algorithm choice (Levenshtein, Soundex, etc.)
   - Threshold values
   - Known variations list

---

## Recommended Action Plan

### Before Handoff (1-2 days)

| Task | Owner | Effort |
|------|-------|--------|
| Complete TECHNIQUE_BODY_MAP | Product | 2 hours |
| Specify sentiment detection algorithm (keyword-based MVP) | Product | 1 hour |
| Define co-occurrence thresholds | Product | 1 hour |
| Specify fuzzy matching approach | Engineering | 2 hours |
| Define proficiency drill thresholds | Product | 30 min |

### During Development (Can Parallel)

| Task | Sprint |
|------|--------|
| Implement white belt modules | Sprint 1 |
| Implement blue belt modules (except System Mastery) | Sprint 2 |
| Implement purple belt modules (except Teaching Impact) | Sprint 3 |
| Add teaching data collection | Sprint 4 |
| Build deferred modules | Sprint 5+ |

---

## Files to Include in Handoff Package

| File | Purpose |
|------|---------|
| `STATS_MODULE_STRATEGY.md` | Full strategy with wireframes |
| `STATS_MODULE_IMPLEMENTATION.md` | Data-realistic build guide |
| `BELT_PERSONALIZATION_SYSTEM.md` | Personalization overview |
| `BELT_INTEGRATION_SPEC.md` | Per-page integration contracts |
| `AI_EXTRACTION_SPEC.md` | Entity extraction for journal data |
| `prototype/src/config/belt-system/` | Working reference implementation |

---

## Conclusion

The STATS page documentation is **substantially ready** for iOS development handoff. The strategic vision is clear, the data constraints are understood, and a realistic implementation path exists.

**Key Actions Before Handoff:**
1. Create TECHNIQUE_BODY_MAP (2 hours)
2. Specify sentiment detection keywords (1 hour)
3. Define co-occurrence thresholds (1 hour)

**Modules Ready to Build Now:**
- Journey Timeline (White)
- Consistency Score (White)
- Foundations Progress (White, pending fuzzy match spec)
- Your Style (Blue, pending body map)
- Vulnerability Map (Blue, pending body map)
- The Long Game (Purple)
- Submission Trends (Purple)
- Technique Mastery (Purple)

**Modules Requiring Additional Work:**
- Technique Pairings (algorithm spec needed)
- Blues Detector (sentiment spec needed)

**Modules Deferred:**
- System Mastery (requires new data model)
- Teaching Impact (requires new data collection)

---

*Document created: January 21, 2026*
*Next review: After algorithm specifications complete*
