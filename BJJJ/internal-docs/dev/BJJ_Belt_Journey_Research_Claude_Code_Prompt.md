# Claude Code Implementation Plan: BJJ Belt Journey Research for RAG

## Project Overview

**Objective:** Conduct deep research on the practitioner experience at each belt level (white, blue, purple, brown) and produce structured CSV files optimized for RAG retrieval. The output will power personalized AI recommendations within the BJJ Progress Tracker app.

**Integration Context:** This research extends the existing BJJ Progress Tracker project. All outputs must align with the established brand voice, connect to existing feature specifications, AND integrate cleanly with any existing codebase/data structures.

---

## ⚠️ CRITICAL: Pre-Implementation Review Required

**Before creating ANY new files, you MUST complete Phase 0 (Codebase Review & Conflict Analysis).** This project may have existing:
- Database schemas or data models
- RAG pipelines or vector stores
- CSV/JSON data files with established naming conventions
- Frontend components expecting specific data shapes
- API endpoints with defined contracts

**DO NOT proceed to Phase 1 until you have:**
1. Completed the full codebase audit
2. Generated the Conflict Analysis Report
3. Received explicit approval from the project owner on proposed merge strategies

---

## Existing Project Documentation (Read These First)

Before beginning any work, read and internalize these project documentation files:

```
/mnt/project/BJJ_Progress_Tracker_Brand_Voice_Guide.md
/mnt/project/BJJ_Progress_Tracker_Feature_List.md
/mnt/project/BJJ_Coach_Evaluation_and_Student_Progression__What_Digital_Training_Journals_Must_Capture.md
/mnt/project/Journaling_and_Accountability_in_Sports_Training__Evidence-Based_Research_for_BJJ_Progress_Tracking.md
/mnt/project/Brazilian_Jiu-Jitsu_Belt_Curriculum__From_White_Belt_Survival_to_Black_Belt_Mastery.md
/mnt/project/Complete_BJJ_Technique_Library__400__Techniques_from_White_to_Black_Belt.md
```

These establish:
- Brand voice and philosophy (knowledgeable but humble, warm but direct)
- Feature capabilities the app offers
- Technical curriculum by belt level
- Evidence base for journaling and accountability benefits
- Coach evaluation patterns and promotion criteria

---

## PHASE 0: Codebase Review & Conflict Analysis (MANDATORY)

**Estimated effort:** 1 session
**Output:** Conflict Analysis Report requiring owner approval before proceeding
**BLOCKING:** Do not proceed to Phase 1 without explicit approval

### 0.1 Full Codebase Audit

**Task:** Explore the entire project structure to understand what exists.

```bash
# Execute these (or equivalent) to map the codebase:
find . -type f -name "*.py" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.csv" -o -name "*.md"
tree -L 4 --dirsfirst
```

**Document in your report:**
- Overall project structure (monorepo? frontend/backend split?)
- Tech stack identified (React? Next.js? Python? Node?)
- Database type (PostgreSQL? MongoDB? SQLite? Supabase?)
- Existing data directories and their contents
- Any `/data`, `/seeds`, `/fixtures`, `/content` directories
- Existing CSV or JSON files (note their schemas)

### 0.2 Data Model Analysis

**Task:** Identify existing data structures that might conflict with proposed CSVs.

**Look for:**
```
- Database schema files (schema.prisma, models.py, migrations/*)
- TypeScript/JavaScript type definitions (types.ts, interfaces.ts)
- JSON schemas or validation files
- Existing CSV files with belt-related data
- API response shapes in controllers/routes
- Frontend state management (Redux slices, Zustand stores, etc.)
```

**Specific conflicts to check:**
| Proposed CSV | Potential Conflict Areas |
|--------------|-------------------------|
| belt_stage_overview | Existing belt enum/types, user profile schemas |
| belt_skill_acquisition | Technique models, curriculum tables, progress tracking |
| belt_pain_points | User feedback systems, support ticket categories |
| belt_questions_asked | FAQ content, chatbot training data |
| belt_product_interventions | Feature flags, A/B test configs, onboarding flows |
| belt_motivation_psychology | User analytics schemas, engagement tracking |
| belt_dropout_risk_factors | Churn prediction models, alert systems |

### 0.3 RAG/AI Integration Analysis

**Task:** Identify existing AI/LLM infrastructure.

**Look for:**
- Vector database setup (Pinecone, Weaviate, Chroma, pgvector)
- Embedding generation code
- Document chunking strategies
- Existing prompt templates
- LangChain, LlamaIndex, or similar framework usage
- OpenAI/Anthropic API integration patterns

**Document:**
- How is content currently ingested for RAG?
- What chunking strategy is used?
- What metadata schema exists for vectors?
- How would new CSVs need to be processed to match?

### 0.4 Naming Convention Analysis

**Task:** Document existing naming patterns to ensure consistency.

**Check for:**
- File naming (snake_case, kebab-case, camelCase)
- Column/field naming conventions
- ID formats (UUID, incremental, composite)
- Date formats (ISO 8601, Unix timestamps)
- Enum value conventions (uppercase, lowercase, etc.)

### 0.5 Generate Conflict Analysis Report

**Create file:** `/mnt/user-data/outputs/belt_journey_research/CONFLICT_ANALYSIS_REPORT.md`

**Report Template:**

```markdown
# BJJ Belt Journey Research: Conflict Analysis Report

**Generated:** [DATE]
**Status:** AWAITING APPROVAL

---

## 1. Codebase Overview

### Project Structure
[Describe overall structure]

### Tech Stack
- Frontend: [identified tech]
- Backend: [identified tech]
- Database: [identified tech]
- AI/RAG: [identified tech]

### Existing Data Files
| File Path | Type | Relevance to This Project |
|-----------|------|---------------------------|
| [path] | [csv/json/etc] | [how it relates] |

---

## 2. Identified Conflicts

### 🔴 Critical Conflicts (Must Resolve Before Proceeding)
| Conflict | Existing Structure | Proposed Structure | Impact |
|----------|-------------------|-------------------|--------|
| [describe] | [what exists] | [what we want] | [consequences] |

### 🟡 Moderate Conflicts (Should Resolve)
| Conflict | Existing Structure | Proposed Structure | Impact |
|----------|-------------------|-------------------|--------|

### 🟢 Minor Conflicts (Nice to Resolve)
| Conflict | Existing Structure | Proposed Structure | Impact |
|----------|-------------------|-------------------|--------|

---

## 3. Proposed Merge Strategies

### Strategy A: [Name]
**Description:** [approach]
**Pros:** 
**Cons:**
**Files Affected:**
**Estimated Effort:**

### Strategy B: [Name]
**Description:** [approach]
**Pros:**
**Cons:**
**Files Affected:**
**Estimated Effort:**

---

## 4. Schema Alignment Recommendations

### Proposed Changes to CSV Schemas
| Original Proposed Column | Recommended Change | Reason |
|-------------------------|-------------------|--------|
| [column] | [change] | [why - to match existing] |

### Proposed Changes to Existing Codebase
| File | Change | Reason |
|------|--------|--------|
| [file] | [change] | [why - to accommodate new data] |

---

## 5. RAG Integration Plan

### Ingestion Pipeline
[How new CSVs will be processed]

### Metadata Schema Alignment
[How new data fits existing vector metadata]

### Chunking Strategy
[Recommended approach for these CSVs]

---

## 6. Recommended File Locations

Based on existing project structure, recommended output locations:

| Proposed Location | Recommended Location | Reason |
|-------------------|---------------------|--------|
| /belt_journey_research/csv/ | [recommended] | [why] |

---

## 7. Questions for Project Owner

Before proceeding, please clarify:

1. [Question about ambiguous structure]
2. [Question about preferred approach]
3. [Question about priority/scope]

---

## 8. Approval Checklist

**Project owner must confirm:**

- [ ] Reviewed codebase overview
- [ ] Approved conflict resolution strategy (A/B/other)
- [ ] Approved schema modifications (if any)
- [ ] Approved file locations
- [ ] Answered outstanding questions
- [ ] Authorized proceeding to Phase 1

**Owner Approval:** _________________ **Date:** _________

---

## 9. Post-Approval Action Items

Upon approval, Claude Code will:
1. [First action]
2. [Second action]
3. [Continue to Phase 1]
```

### 0.6 STOP AND WAIT

**After generating the Conflict Analysis Report:**

1. Present the report to the project owner
2. Explicitly state: "Phase 0 complete. Please review the Conflict Analysis Report and provide approval before I proceed to Phase 1."
3. **DO NOT proceed until you receive explicit approval**
4. If owner requests changes to the approach, update schemas/plans accordingly
5. Document any approved changes in an `APPROVED_CHANGES.md` file

---

---

## Phase Summary

| Phase | Name | Blocking? | Output |
|-------|------|-----------|--------|
| **0** | Codebase Review & Conflict Analysis | **YES - requires approval** | CONFLICT_ANALYSIS_REPORT.md |
| 1 | Foundation & Existing Knowledge Extraction | After Phase 0 approval | Draft CSVs from existing docs |
| 2 | Web Research - White & Blue Belt | After Phase 1 | Complete W/B belt rows |
| 3 | Web Research - Purple & Brown Belt | After Phase 2 | Complete P/Br belt rows |
| 4 | Product Intervention Mapping | After Phase 3 | Feature × belt mappings |
| 5 | Narrative Synthesis & QA | After Phase 4 | Final validated deliverables |

---

## Output Directory Structure

**Note:** Final directory structure may be modified based on Phase 0 findings. The structure below is the *proposed* default—adjust based on existing codebase conventions.

Create all outputs in: `/mnt/user-data/outputs/belt_journey_research/`

```
belt_journey_research/
├── csv/
│   ├── belt_stage_overview.csv
│   ├── belt_skill_acquisition.csv
│   ├── belt_pain_points.csv
│   ├── belt_questions_asked.csv
│   ├── belt_product_interventions.csv
│   ├── belt_motivation_psychology.csv
│   └── belt_dropout_risk_factors.csv
├── narratives/
│   └── belt_journey_narratives.md
├── sources/
│   └── research_sources.md
└── README.md
```

---

## CSV Schemas (Strict Adherence Required)

### 1. belt_stage_overview.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| stage_name | string | Evocative name for this phase (e.g., "Survival Mode", "The Refinement Phase") |
| typical_duration_months_min | integer | Minimum typical time at this belt |
| typical_duration_months_max | integer | Maximum typical time at this belt |
| primary_focus | string | Core developmental focus (50 words max) |
| mindset_shift | string | Key psychological transition happening (50 words max) |
| identity_markers | string | How practitioners at this level describe themselves (50 words max) |
| technical_priorities | string | Top 3-5 technique categories to develop |
| relationship_to_coach | string | How coach relationship typically functions |
| competition_relevance | string | Role of competition at this stage |
| source | string | Citation or "synthesis" |

### 2. belt_skill_acquisition.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| skill_category | string | e.g., "guard retention", "submission chains", "pressure passing" |
| acquisition_pattern | string | How this skill typically develops (75 words max) |
| common_plateau | string | Where practitioners get stuck (50 words max) |
| plateau_duration_weeks | string | Typical duration (range, e.g., "4-12") |
| breakthrough_trigger | string | What typically unlocks progress (50 words max) |
| measurable_indicator | string | Observable sign of improvement |
| app_tracking_opportunity | string | How app could measure/surface this |
| source | string | Citation or "synthesis" |

### 3. belt_pain_points.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| pain_point_id | string | Unique ID (e.g., "white_pp_001") |
| pain_point_category | string | technical, psychological, social, logistical, information |
| title | string | Brief title (5-10 words) |
| description | string | Detailed description (75 words max) |
| emotional_impact | string | How this makes practitioners feel (25 words max) |
| frequency | string | rare, occasional, common, nearly_universal |
| dropout_risk_contribution | string | none, low, moderate, high, critical |
| existing_solutions | string | How practitioners currently cope |
| app_opportunity | string | How BJJ Progress Tracker addresses this |
| source | string | Citation or "synthesis" |

### 4. belt_questions_asked.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| question_id | string | Unique ID (e.g., "white_q_001") |
| question_category | string | technique, progression, training_approach, mindset, social, competition |
| example_question | string | Actual question practitioners ask |
| underlying_need | string | What they really need (not just the surface question) |
| ideal_answer_approach | string | How app should respond (tone, depth, specificity) |
| relevant_app_feature | string | Which feature addresses this |
| source | string | Citation, forum link, or "synthesis" |

### 5. belt_product_interventions.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| intervention_id | string | Unique ID |
| feature_name | string | From BJJ_Progress_Tracker_Feature_List.md |
| user_need_addressed | string | Specific need this solves at this belt level |
| value_proposition | string | Why this matters to this belt level (50 words max) |
| example_use_case | string | Concrete scenario (75 words max) |
| ai_personalization_opportunity | string | How AI/LLM enhances this feature for this belt |
| video_instructional_opportunity | string | What customized video content serves this need |
| priority_for_belt | string | critical, high, medium, low |
| source | string | Logical derivation from research |

### 6. belt_motivation_psychology.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| motivation_id | string | Unique ID |
| motivation_type | string | intrinsic, extrinsic, social, mastery, identity, health |
| description | string | How this motivation manifests (50 words max) |
| strength_at_belt | string | weak, moderate, strong, dominant |
| trajectory | string | increasing, stable, decreasing, variable |
| retention_impact | string | How this affects likelihood to continue training |
| churn_risk_signal | string | Warning sign when this motivation fails |
| app_reinforcement_strategy | string | How app can support this motivation |
| source | string | Citation or "synthesis" |

### 7. belt_dropout_risk_factors.csv

| Column | Type | Description |
|--------|------|-------------|
| belt_level | string | white, blue, purple, brown |
| risk_factor_id | string | Unique ID |
| risk_category | string | injury, plateau, life_circumstances, social, psychological, financial |
| title | string | Brief title |
| description | string | Detailed description (75 words max) |
| warning_signs | string | Observable indicators this risk is emerging |
| time_to_dropout | string | How quickly this leads to quitting (weeks/months) |
| intervention_window | string | When intervention is most effective |
| app_detection_method | string | How app could identify this risk |
| app_intervention_strategy | string | What app should do when detected |
| evidence_strength | string | strong, moderate, anecdotal |
| source | string | Citation or "synthesis" |

---

## Implementation Phases

### PHASE 1: Foundation & Existing Knowledge Extraction

**⚠️ PREREQUISITE:** Phase 0 Conflict Analysis Report must be approved before starting this phase.

**Estimated effort:** 1 session
**Output:** Draft CSVs populated with existing project knowledge

**Tasks:**
1. Read all 6 project files thoroughly
2. Extract all belt-level-specific information already present
3. Create initial CSV files with this existing knowledge
4. Identify gaps requiring external research
5. Create `research_gaps.md` documenting what needs external sourcing

**Checkpoint:** All CSVs exist with 30-50% of rows populated from existing docs. Gap analysis complete.

---

### PHASE 2: Web Research - White & Blue Belt Journey
**Estimated effort:** 1-2 sessions
**Output:** Comprehensive research on white and blue belt experience

**Research Queries to Execute:**
```
White Belt:
- "white belt BJJ experience first year" 
- "BJJ white belt struggles reddit"
- "why do white belts quit BJJ"
- "white belt BJJ psychology"
- "first 6 months BJJ learning curve"
- "BJJ beginner plateau"
- "white belt to blue belt journey"

Blue Belt:
- "blue belt blues BJJ"
- "blue belt quit rate BJJ"
- "blue belt plateau BJJ"
- "hardest part of blue belt BJJ"
- "blue belt identity crisis BJJ"
- "blue belt to purple belt timeline"
- "blue belt BJJ psychology motivation"
```

**Sources to Prioritize:**
- Reddit r/bjj threads (high signal for real practitioner experience)
- BJJ Fanatics blog articles
- Grapplearts content (Stephan Kesting)
- Bernardo Faria content
- Academic sports psychology research on martial arts
- BJJ Heroes articles
- Jiu Jitsu Times articles

**Tasks:**
1. Execute searches, capture relevant content
2. Synthesize findings into CSV rows
3. Document all sources in research_sources.md
4. Flag any conflicting information for resolution

**Checkpoint:** White and blue belt rows complete across all CSVs. Sources documented.

---

### PHASE 3: Web Research - Purple & Brown Belt Journey
**Estimated effort:** 1-2 sessions
**Output:** Comprehensive research on purple and brown belt experience

**Research Queries to Execute:**
```
Purple Belt:
- "purple belt BJJ experience"
- "purple belt plateau BJJ"
- "purple belt to brown belt journey"
- "purple belt teaching BJJ"
- "purple belt game development BJJ"
- "purple belt dropout rate"

Brown Belt:
- "brown belt BJJ experience journey"
- "brown belt to black belt timeline"
- "brown belt pressure expectations BJJ"
- "brown belt teaching responsibilities"
- "brown belt game refinement"
- "almost black belt psychology"
```

**Tasks:**
1. Execute searches, capture relevant content
2. Synthesize findings into CSV rows
3. Note: Less content exists for upper belts—rely more on synthesis and expert content
4. Cross-reference with existing technique library for technical accuracy

**Checkpoint:** Purple and brown belt rows complete. All CSVs fully populated.

---

### PHASE 4: Product Intervention Mapping
**Estimated effort:** 1 session
**Output:** Complete belt_product_interventions.csv with all 69 user stories mapped

**Tasks:**
1. Open BJJ_Progress_Tracker_Feature_List.md
2. For each of the 13 feature categories, map to belt-specific needs
3. Create intervention entries showing how each feature serves each belt differently
4. Specifically address AI/LLM opportunities:
   - Natural language note parsing → technique gap identification
   - Pattern recognition → plateau detection
   - Personalized curriculum → weakness-based video recommendations
   - Coach feedback synthesis → progress narrative generation
5. Document video instructional opportunities:
   - Position-specific content based on logged weaknesses
   - Belt-appropriate technique progressions
   - "What to work on next" personalized playlists

**Checkpoint:** Every app feature mapped to every belt level with specific value propositions.

---

### PHASE 5: Narrative Synthesis & Quality Assurance
**Estimated effort:** 1 session
**Output:** belt_journey_narratives.md + quality-checked CSVs

**Tasks:**
1. Write 300-500 word narrative for each belt level capturing the gestalt
2. Cross-check all CSVs for:
   - Consistent belt_level values
   - No empty required fields
   - Proper ID formatting
   - Source citations present
3. Validate against brand voice guide:
   - Language is "knowledgeable but humble"
   - No gamification language ("level up", "unlock")
   - Respects difficulty of BJJ
4. Create README.md explaining the dataset

**Checkpoint:** All files complete, validated, ready for RAG ingestion.

---

## Quality Standards

### Each CSV Row Must Be:
- **Self-contained:** Understandable without other rows
- **Specific:** No vague generalities; concrete details
- **Sourced:** Citation or clear "synthesis" marker
- **Belt-appropriate:** Clearly relevant to that belt level
- **Brand-aligned:** Matches BJJ Progress Tracker voice

### Avoid:
- Hallucinated statistics (if no source, say "synthesis" or "anecdotal")
- Generic advice that applies to all belts equally
- Gamification language
- Overpromising app capabilities
- Dismissive tone about struggles

### Row Count Targets:
| CSV | Minimum Rows |
|-----|--------------|
| belt_stage_overview | 4 (one per belt) |
| belt_skill_acquisition | 40 (10 per belt) |
| belt_pain_points | 32 (8 per belt) |
| belt_questions_asked | 40 (10 per belt) |
| belt_product_interventions | 52 (13 features × 4 belts) |
| belt_motivation_psychology | 24 (6 per belt) |
| belt_dropout_risk_factors | 20 (5 per belt) |

---

## Final Deliverables Checklist

### Phase 0 Deliverables (Approval Required)
```
[ ] /belt_journey_research/CONFLICT_ANALYSIS_REPORT.md
[ ] Owner approval received and documented
[ ] /belt_journey_research/APPROVED_CHANGES.md (if schema modifications needed)
```

### Phase 1-5 Deliverables (Post-Approval)
```
[ ] /belt_journey_research/csv/belt_stage_overview.csv
[ ] /belt_journey_research/csv/belt_skill_acquisition.csv
[ ] /belt_journey_research/csv/belt_pain_points.csv
[ ] /belt_journey_research/csv/belt_questions_asked.csv
[ ] /belt_journey_research/csv/belt_product_interventions.csv
[ ] /belt_journey_research/csv/belt_motivation_psychology.csv
[ ] /belt_journey_research/csv/belt_dropout_risk_factors.csv
[ ] /belt_journey_research/narratives/belt_journey_narratives.md
[ ] /belt_journey_research/sources/research_sources.md
[ ] /belt_journey_research/README.md
[ ] All CSVs validated (no empty required fields)
[ ] All sources documented
[ ] Brand voice compliance verified
[ ] Schema alignment with existing codebase verified
```

---

## Success Criteria

The research is complete when:

1. **Codebase-Aligned:** New data structures integrate cleanly with existing schemas, naming conventions, and data pipelines without breaking changes.

2. **RAG-Ready:** An LLM can retrieve specific, accurate information by querying "What are the pain points for blue belts?" and get precise, self-contained rows.

3. **Product-Actionable:** Product team can use belt_product_interventions.csv to prioritize features by belt segment.

4. **AI-Trainable:** Narratives + CSVs provide sufficient context for AI assistant to have informed, belt-appropriate conversations.

5. **Evidence-Based:** Claims are sourced or clearly marked as synthesis/anecdotal.

6. **Brand-Consistent:** All content aligns with BJJ Progress Tracker brand voice guide.

7. **No Technical Debt:** Implementation doesn't create merge conflicts, duplicate data sources, or schema inconsistencies that require future cleanup.

---

## Notes for Claude Code

- **🛑 PHASE 0 IS MANDATORY:** Do not skip the codebase review. Do not proceed to Phase 1 without explicit owner approval on the Conflict Analysis Report.
- **Approval Gate:** After Phase 0, you MUST stop and wait. Present findings, ask for approval, and only continue when the owner says "approved" or equivalent.
- **Adapt to Findings:** If Phase 0 reveals existing schemas, naming conventions, or data structures, modify the proposed CSV schemas to align. Consistency with existing codebase trumps the default schemas in this document.
- **Token Management:** Each phase is designed to be completable in one session. If approaching limits, save progress and document where you stopped.
- **Web Search:** Use extensively in Phases 2-3. Prioritize Reddit, established BJJ educators, and academic sources.
- **Existing Files:** The project files contain substantial research already—extract before searching externally.
- **CSV Format:** Use proper CSV escaping for any cells containing commas or quotes. Match any existing CSV conventions found in Phase 0.
- **Incremental Saves:** Save CSVs after completing each belt level within a phase.
- **Conflict Documentation:** If you discover new conflicts during Phases 1-5, document them and flag for owner review before proceeding.

---

## Quick Reference: Approval Gates

| Checkpoint | Action Required |
|------------|-----------------|
| After Phase 0 | **STOP.** Present Conflict Analysis Report. Wait for explicit approval. |
| During any phase | If new conflicts discovered, flag and wait for guidance. |
| After Phase 5 | Final review with owner before marking complete. |

---

*This prompt created for BJJ Progress Tracker project. December 2024.*
