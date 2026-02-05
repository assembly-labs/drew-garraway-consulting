# File Reference Map

> Maps the file paths referenced in the original project brief to their actual locations in the TOMO project.

---

## Brief References → Actual TOMO Paths

All paths are relative to `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/`.

| Brief Reference | Actual Path | Notes |
|-----------------|-------------|-------|
| `Complete_BJJ_Technique_Library.md` | `docs/domain-knowledge/bjj-techniques/bjj_library/` | Not a single file; 14 CSVs containing ~375 techniques |
| `BJJ_Progress_Tracker_Feature_List.md` | `docs/product/_archived/BJJ_Progress_Tracker_Feature_List.md` | Archived. Active equivalent: `docs/product/FEATURES.md` |
| `TOMO_Belt_Progression_Requirements_Reference.md` | `docs/research/TOMO_Belt_Progression_Requirements_Reference.md` | Exact match, active |
| `The_Pedagogical_DNA_of_Elite_BJJ_Instruction.md` | `docs/brand/instructor-influence-matrix.md` | Different name, same concept |
| `BJJ_Progress_Tracker_Brand_Voice_Guide.md` | `docs/brand/BRAND_VOICE_GUIDE.md` | Different name, same concept |
| `Documentation_Frameworks_for_AI-Assisted_App_Development.md` | `docs/development/AGENTIC-DEVELOPMENT-BEST-PRACTICES.md` | Different name, closest equivalent |
| `/supabase/schemas/` | Does not exist | Schema lives in `prototype/src/types/database.ts` (TypeScript only) |
| `/src/data/` | `prototype/src/data/` | Prefix with `prototype/` |
| `/src/lib/` | `prototype/src/services/` | Different directory name |
| `/src/types/` | `prototype/src/types/` | Prefix with `prototype/` |

---

## Key Active Files for Video Pipeline

### Technique Data
| File | Purpose |
|------|---------|
| `docs/domain-knowledge/bjj-techniques/bjj_library/*.csv` | Master technique taxonomy (14 position files) |
| `docs/domain-knowledge/bjj-techniques/technique_videos.csv` | Existing video-to-technique mappings (25 rows) |
| `docs/domain-knowledge/bjj-techniques/video_enrichment_template.csv` | Enrichment template (18 rows) |
| `prototype/src/data/techniqueVideos.ts` | Production video database (169 entries, 53 unique) |
| `prototype/src/data/techniques.ts` | Production technique library (mock data) |

### Types & Schema
| File | Purpose |
|------|---------|
| `prototype/src/types/database.ts` | Supabase-ready TypeScript types (502 lines) |
| `prototype/src/types/techniqueVideos.ts` | TechniqueVideo interface definition |

### Product Docs
| File | Purpose |
|------|---------|
| `docs/product/_manual_product_requirements_doc/VIDEO_DATABASE.md` | Video database PRD |
| `docs/data-and-ai/VIDEO_VERIFICATION.md` | Verified videos list + verification process |
| `docs/product/BELT_PERSONALIZATION_SYSTEM.md` | Belt-aware feature adaptation |
| `docs/product/FEATURES.md` | Active feature overview |

### Brand & Instructor Reference
| File | Purpose |
|------|---------|
| `docs/brand/BRAND_VOICE_GUIDE.md` | TOMO voice/tone for descriptions |
| `docs/brand/instructor-influence-matrix.md` | 10 elite instructors with pedagogy profiles |

### Research
| File | Purpose |
|------|---------|
| `docs/research/TOMO_Belt_Progression_Requirements_Reference.md` | Belt-by-belt curriculum requirements |
| `docs/research/USER_PERSONAS_AND_RESEARCH.md` | User personas and market research |

---

## Technique ID Systems

Two ID conventions exist and need reconciliation:

| System | Format | Example | Used In |
|--------|--------|---------|---------|
| CSV taxonomy | Prefix + number | `CG_001` | `bjj_library/*.csv` |
| Production | Kebab-case slug | `closed-guard-armbar` | `techniqueVideos.ts`, `techniques.ts` |

A mapping between these two systems is needed for the pipeline to work. This will be created during Run 1.
