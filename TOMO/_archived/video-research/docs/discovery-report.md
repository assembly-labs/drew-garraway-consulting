# Phase 1: Discovery Report

> **Date:** 2025-02-03
> **Status:** Complete
> **Next step:** Resolve open questions (see `open-questions.md`), obtain YouTube API key, then begin Run 1

---

## 1. Architecture Assessment Answers

### Q: Is there an existing Supabase schema for techniques/videos?

**No.** There is no `/supabase/` directory. The database schema exists only as TypeScript types:

- `prototype/src/types/database.ts` (502 lines) — Defines tables for `profiles`, `sessions`, `technique_progress`, `submissions`, `practice_logs`, `technique_catalog`
- `prototype/src/types/techniqueVideos.ts` — Defines the `TechniqueVideo` interface used by the current video database

No SQL migration files exist. Supabase is planned for the iOS/TestFlight phase but not yet set up.

### Q: Is there a Google Form already set up for video curation?

**No.** Zero Google Forms or Sheets integration exists anywhere in the project. No API credentials, no URLs, no integration docs.

### Q: What's the current state of the video database?

**It exists but has significant quality problems.**

| Metric | Value |
|--------|-------|
| Total video entries | 169 |
| Unique YouTube video IDs | ~53 |
| Placeholder reuse rate | ~49% |
| Worst offender | `ypi3ie6hKTI` (Danaher Closed Guard) mapped to 22 techniques |
| Second worst | `tyI3aszI4qo` (Gordon Ryan Mount) mapped to 13 techniques |
| Technique coverage | ~115/361 techniques (~31.9%) |
| Leg Entanglements coverage | 0% |
| Open Guard coverage | ~11% |
| Video types used | 3 of 6 (instructional, mindset, lifestyle) |

**Location:** `prototype/src/data/techniqueVideos.ts`

**Additional video data:**
- `docs/domain-knowledge/bjj-techniques/technique_videos.csv` — 25-row CSV with enriched metadata for a small subset
- `docs/domain-knowledge/bjj-techniques/video_enrichment_template.csv` — Template with 18 enriched entries
- `docs/data-and-ai/VIDEO_VERIFICATION.md` — 47 verified videos, 6 non-BJJ videos flagged for removal

### Q: Are there existing API clients or services for YouTube integration?

**No.** No YouTube API client, no API keys stored, no service layer for video fetching. The verification process documented in `VIDEO_VERIFICATION.md` uses the noembed API (`https://noembed.com/embed?url=...`) for basic availability checks but nothing more.

---

## 2. Existing Technique Taxonomy

### Source Files

14 CSV files in `docs/domain-knowledge/bjj-techniques/bjj_library/`:

| File | Position | Techniques |
|------|----------|------------|
| `guard_closed.csv` | Closed Guard | ~30 |
| `guard_open.csv` | Open Guard | ~45 |
| `guard_half.csv` | Half Guard | ~30 |
| `guard_passing.csv` | Guard Passing | ~30 |
| `mount.csv` | Mount | ~20 |
| `side_control.csv` | Side Control | ~25 |
| `back_control.csv` | Back Control | ~20 |
| `turtle.csv` | Turtle | ~18 |
| `knee_on_belly.csv` | Knee on Belly | ~15 |
| `north_south.csv` | North-South | ~15 |
| `standing_takedowns.csv` | Takedowns | ~25 |
| `standing_clinch.csv` | Clinch | ~20 |
| `leg_entanglements.csv` | Leg Entanglements | ~18 |
| `submissions_master.csv` | All Submissions | ~50 |

**Total: ~375 techniques** (some overlap with submissions_master.csv referencing techniques from position files)

### CSV Schema

Each CSV contains:
- `technique_id` — Prefixed ID (e.g., `CG_001`, `HG_001`, `OG_001`)
- `name` — Technique name
- `belt_level` — White/Blue/Purple/Brown/Black
- `gi_nogi` — Gi/No-Gi/Both
- `description` — Short description
- `key_points` — Teaching cues
- `common_mistakes` — What to watch for

### ID Prefix Convention

| Prefix | Position |
|--------|----------|
| CG_ | Closed Guard |
| OG_ | Open Guard |
| HG_ | Half Guard |
| GP_ | Guard Passing |
| MT_ | Mount |
| SC_ | Side Control |
| BC_ | Back Control |
| TT_ | Turtle |
| KB_ | Knee on Belly |
| NS_ | North-South |
| ST_ | Standing Takedowns |
| CL_ | Standing Clinch |
| LE_ | Leg Entanglements |
| SM_ | Submissions Master |

---

## 3. Existing Video Type Definition

From `prototype/src/types/techniqueVideos.ts`:

```typescript
interface TechniqueVideo {
  technique_id: string;
  video_type: 'instructional' | 'breakdown' | 'competition' | 'drilling' | 'mindset' | 'lifestyle';
  youtube_id: string;
  instructor: string;
  title: string;
  duration_seconds: number;
  // Optional enrichment fields
  belt_relevance?: string[];
  gi_nogi?: 'gi' | 'nogi' | 'both';
  key_timestamps?: { time: number; label: string }[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}
```

**Gap vs. proposed schema:** The existing type is missing:
- `youtube_channel_name`, `youtube_channel_id`
- `instructor_credibility`, `teaching_school`
- `youtube_view_count`, `youtube_like_count`, `youtube_publish_date`
- `video_quality_score`
- All curation workflow fields (`status`, `discovered_date`, `reviewed_date`, etc.)
- `ibjjf_legal`, `position_category`, `technique_type`
- `is_available`, `last_verified`
- `prerequisites`, `related_techniques`

---

## 4. Trusted Instructor Reference

From `docs/brand/instructor-influence-matrix.md` (10 instructors profiled):

| Instructor | Pedagogy Type | Style Focus |
|------------|--------------|-------------|
| John Danaher | Systems/Constraint-based | No-Gi, Leg locks |
| Andre Galvao | High-performance methodology | Gi + No-Gi |
| Roger Gracie | Pure fundamentals | Gi |
| Renzo Gracie | Philosophy + adaptability | Gi + No-Gi |
| Fabio Gurgel | Team-building | Gi |
| Leo Vieira | Tactical evolution | Gi + No-Gi |
| Mikey Musumeci | Micro-detail instruction | Gi + No-Gi |
| Tom DeBlass | Motivational pedagogy | No-Gi |
| Mayssa Bastos | Precision technique | Gi + No-Gi |
| Darragh O'Conaill | Conceptual clarity | No-Gi |

**Note:** The brief's trusted instructor lists include additional names (Gordon Ryan, Lachlan Giles, Bernardo Faria, Marcelo Garcia, Craig Jones, Eddie Bravo, Garry Tonon, Keenan Cornelius, Ryan Hall, Kit Dale, Caio Terra) that are NOT in the current instructor matrix but should be added to the pipeline's trusted list.

---

## 5. Existing Product Requirements

`docs/product/_manual_product_requirements_doc/VIDEO_DATABASE.md` contains a detailed PRD with:

- Coverage targets by position category
- Quality scoring criteria
- Instructor curation strategy
- Belt-level video recommendations
- Integration with the technique library UI

This PRD overlaps significantly with the project brief and should be treated as the product-side source of truth.

---

## 6. Verified Videos Status

From `docs/data-and-ai/VIDEO_VERIFICATION.md`:

- **47 videos verified** as real, accessible BJJ instructional content
- **6 videos flagged for removal** (non-BJJ: Jocko podcasts, JRE clips, motivational content)
- Verification method: noembed API (`https://noembed.com/embed?url=https://www.youtube.com/watch?v={id}`)
- Last verification date: documented in the file

---

## 7. Key Risks & Concerns

1. **Placeholder abuse is the #1 data quality issue.** Before adding new videos, we should clean up existing reuse (53 unique videos pretending to cover 169 technique slots).

2. **No YouTube API access yet.** Need API key before discovery runs can begin. Free tier gives ~100 searches/day (sufficient for 10-20 techniques per run).

3. **Schema divergence.** The curation pipeline needs fields the production `TechniqueVideo` type doesn't have. Recommend a separate curation schema that feeds into the production type after approval.

4. **No automated testing.** Video verification relies on manual noembed checks. Should build into the pipeline.

5. **CSV technique IDs vs. production IDs.** The CSV taxonomy uses prefixed IDs (`CG_001`) while the production `techniqueVideos.ts` uses slug-style IDs (`closed-guard-armbar`). Need a mapping layer.
