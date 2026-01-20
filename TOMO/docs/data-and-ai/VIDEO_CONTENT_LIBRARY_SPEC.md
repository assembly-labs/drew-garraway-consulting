# Video Content Library Specification

> **Purpose:** Define the schema, curation process, and maintenance workflow for TOMO's video content library. This specification ensures video data is structured to support the AI-powered recommendation engine.

**Status:** Active
**Last Updated:** January 2025
**Related Documents:**
- `TECHNIQUE_RECOMMENDATION_ENGINE.md` - How videos are recommended based on journal data
- `/docs/domain-knowledge/bjj-techniques/README.md` - Technique library documentation
- `/prototype/src/data/techniqueVideos.ts` - TypeScript implementation

---

## Executive Summary

The video content library is the fuel for TOMO's personalized learning experience. Unlike a static video catalog, our library is designed to:

1. **Support belt-appropriate filtering** - Only show content appropriate for the user's level
2. **Enable struggle-based matching** - Connect user's journal struggles to helpful videos
3. **Maintain content freshness** - Quarterly updates with new instructional content
4. **Scale independently** - Videos and techniques have a many-to-many relationship

**Key Principle:** Videos are first-class entities with their own identity, not just attachments to techniques.

---

## Data Model Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA MODEL                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   VIDEOS (Master List)              TECHNIQUES (Existing Library)           │
│   ────────────────────              ──────────────────────────              │
│   video_id (unique)                 technique_id (CG_001, etc.)             │
│   youtube_id                        technique_name                          │
│   title                             belt_level                              │
│   instructor                        gi_nogi                                 │
│   duration_seconds                  type, subcategory                       │
│   belt_level_min                    ...                                     │
│   belt_level_max                                                            │
│   difficulty_score                                                          │
│   gi_nogi                                                                   │
│   content_type                                                              │
│   addresses_struggles[]                                                     │
│   teaches_defense_for[]                                                     │
│   tags[]                                                                    │
│           │                                   │                             │
│           └─────────────┬─────────────────────┘                             │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │ TECHNIQUE_VIDEO_MAP │                                        │
│              │ (Many-to-Many)      │                                        │
│              │                     │                                        │
│              │ video_id            │                                        │
│              │ technique_id        │                                        │
│              │ relevance_score     │                                        │
│              └─────────────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Video Schema

### 1.1 Master Video Table (`videos.csv`)

Each video is a unique instructional asset with its own identity.

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `video_id` | string | Yes | Unique identifier: `VID_{NUMBER}` | `VID_001` |
| `youtube_id` | string | Yes | YouTube video ID (11 chars) | `ypi3ie6hKTI` |
| `title` | string | Yes | Video title (as displayed) | `John Danaher Explains Closed Guard Fundamentals` |
| `instructor` | string | Yes | Primary instructor name | `John Danaher` |
| `duration_seconds` | integer | Yes | Video length in seconds | `720` |
| `video_type` | enum | Yes | Content category | `instructional`, `mindset`, `lifestyle` |
| `content_type` | enum | Yes | Pedagogical approach | `concept`, `technique`, `drill`, `troubleshooting`, `system` |
| `belt_level_min` | enum | Yes | Minimum belt for this content | `white`, `blue`, `purple`, `brown`, `black` |
| `belt_level_max` | enum | Yes | Maximum belt relevance | `white`, `blue`, `purple`, `brown`, `black` |
| `difficulty_score` | integer | Yes | Complexity rating 1-10 | `3` |
| `gi_nogi` | enum | Yes | Applicability | `gi`, `nogi`, `both` |
| `position_category` | enum | Yes | Primary position covered | See position codes below |
| `addresses_struggles` | string | No | Pipe-separated struggle categories | `guard_passed\|sweep_defense` |
| `teaches_defense_for` | string | No | Submissions this helps defend | `triangle\|armbar` |
| `tags` | string | No | Pipe-separated search tags | `fundamentals\|beginner\|concepts` |
| `instructor_tier` | integer | Yes | Instructor quality tier (1-3) | `1` |
| `verified` | boolean | Yes | Human-verified metadata | `true` or `false` |
| `added_date` | date | Yes | When added to library | `2025-01-15` |
| `last_verified` | date | No | Last human verification | `2025-01-15` |
| `notes` | string | No | Internal notes for curation | `Great for visual learners` |

### 1.2 Field Definitions

#### video_type
| Value | Description | Use Case |
|-------|-------------|----------|
| `instructional` | Technical BJJ instruction | Core technique learning |
| `mindset` | Psychology, motivation, mental game | At-risk user support, belt journey |
| `lifestyle` | Training frequency, injury prevention, longevity | Older users, injury recovery |

#### content_type
| Value | Description | When to Recommend |
|-------|-------------|-------------------|
| `concept` | Explains principles, not specific moves | User needs understanding, not steps |
| `technique` | Step-by-step technique breakdown | User learning new technique |
| `drill` | Repetition exercises, solo or partner | User wants to improve existing technique |
| `troubleshooting` | Fixes common problems | User struggling with specific issue |
| `system` | Complete positional system | User ready for game development |

#### belt_level_min / belt_level_max
Videos can span multiple belt levels. A "fundamentals" video might be:
- `belt_level_min: white` (appropriate from day one)
- `belt_level_max: purple` (still valuable through purple)

A "berimbolo system" video might be:
- `belt_level_min: purple` (not appropriate for white/blue)
- `belt_level_max: black` (valuable through black belt)

#### difficulty_score (1-10)
| Score | Description | Examples |
|-------|-------------|----------|
| 1-2 | Absolute fundamentals | Posture, base, basic escapes |
| 3-4 | White belt curriculum | Scissor sweep, armbar from guard |
| 5-6 | Blue belt development | Half guard systems, passing concepts |
| 7-8 | Purple belt systems | Leg lock entries, advanced guards |
| 9-10 | Elite/competition level | Berimbolo, advanced leg lock defense |

#### position_category
| Code | Position |
|------|----------|
| `closed_guard` | Closed Guard |
| `half_guard` | Half Guard |
| `open_guard` | Open Guard (includes butterfly, DLR, spider, etc.) |
| `mount` | Mount |
| `side_control` | Side Control |
| `back_control` | Back Control |
| `north_south` | North-South |
| `turtle` | Turtle |
| `takedowns` | Standing Takedowns |
| `clinch` | Clinch / Standing Grappling |
| `guard_passing` | Guard Passing |
| `knee_on_belly` | Knee on Belly |
| `submissions` | Submissions (cross-positional) |
| `leg_entanglements` | Leg Locks / Ashi Garami |
| `transitions` | Position Transitions |
| `mindset` | Mental Game / Psychology |
| `lifestyle` | Training Lifestyle / Longevity |

#### addresses_struggles
Maps to the struggle taxonomy in `TECHNIQUE_RECOMMENDATION_ENGINE.md`:

| Struggle Category | Description |
|-------------------|-------------|
| `guard_passed` | Getting passed, can't retain guard |
| `sweep_defense` | Getting swept, can't maintain top |
| `submission_defense_choke` | Getting choked |
| `submission_defense_arm` | Getting armbarred, kimura'd |
| `submission_defense_leg` | Getting leg locked |
| `mount_escape` | Can't escape mount |
| `side_control_escape` | Can't escape side control |
| `back_escape` | Can't escape back control |
| `takedown_defense` | Getting taken down |
| `no_attacks` | Can't submit anyone |
| `timing_issues` | Too slow, missing opportunities |
| `cardio_fatigue` | Gassing out |

#### instructor_tier
| Tier | Instructors | Quality Multiplier |
|------|-------------|-------------------|
| 1 | John Danaher, Gordon Ryan, Lachlan Giles | 1.3x |
| 2 | Craig Jones, Gustavo Gasperin, Keenan Cornelius, Firas Zahabi | 1.2x |
| 3 | Other verified instructors (Stephan Kesting, Jocko Willink, etc.) | 1.0x |

---

## Part 2: Technique-Video Mapping

### 2.1 Mapping Table (`technique_video_map.csv`)

This table creates the many-to-many relationship between videos and techniques.

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `video_id` | string | Yes | References videos.csv | `VID_001` |
| `technique_id` | string | Yes | References technique library | `CG_001` |
| `relevance_score` | decimal | Yes | How directly this video teaches the technique (0.0-1.0) | `0.9` |
| `is_primary` | boolean | Yes | Is this the main video for this technique? | `true` |

### 2.2 Relevance Score Guidelines

| Score | Meaning | Example |
|-------|---------|---------|
| 1.0 | Video is specifically about this technique | "How to Do the Scissor Sweep" → CG_001 |
| 0.8-0.9 | Video covers this technique as main content | "Closed Guard Sweeps" covers CG_001, CG_002, CG_003 |
| 0.5-0.7 | Video mentions/demonstrates technique | "Guard Fundamentals" briefly shows scissor sweep |
| 0.3-0.4 | Video covers related concepts | "Posture Breaking" helps with sweep setups |
| 0.1-0.2 | Tangentially related | "Half Guard" video mentions closed guard transition |

---

## Part 3: Curation Criteria

### 3.1 Video Quality Requirements

**Must Have:**
- [ ] Clear audio (instructor audible throughout)
- [ ] Good video quality (720p minimum)
- [ ] Instructor demonstrates technique, not just explains
- [ ] No excessive watermarks or distracting overlays
- [ ] Under 15 minutes (prefer 5-12 minute videos)
- [ ] Still available on YouTube (not deleted/private)

**Should Have:**
- [ ] Multiple angles shown
- [ ] Common mistakes addressed
- [ ] Partner of appropriate skill for demonstrations
- [ ] Good lighting on the mat

**Nice to Have:**
- [ ] Slow-motion replays
- [ ] On-screen text highlighting key points
- [ ] Competition footage examples

### 3.2 Instructor Approval List

Only add videos from approved instructors to maintain quality consistency.

**Tier 1 (Always Approved):**
- John Danaher
- Gordon Ryan
- Lachlan Giles

**Tier 2 (Approved):**
- Craig Jones
- Gustavo Gasperin (MMA Leech)
- Keenan Cornelius
- Firas Zahabi
- Bernardo Faria

**Tier 3 (Case-by-Case):**
- Stephan Kesting
- Jocko Willink (mindset only)
- Chewy (Chewjitsu)
- Knight Jiu-Jitsu
- Jon Thomas

**Not Approved:**
- Random academy promotional videos
- User-generated content without credentials
- Videos with excessive ads/sponsorship content
- Clickbait titles that don't deliver

### 3.3 Content Balance Targets

Maintain balanced coverage across positions and belt levels.

**By Position (Target Distribution):**
| Position | Target % | Min Videos |
|----------|----------|------------|
| Guard (closed + half + open) | 30% | 25 |
| Guard Passing | 15% | 12 |
| Top Positions (mount, side, back, etc.) | 25% | 20 |
| Submissions | 15% | 12 |
| Takedowns/Clinch | 10% | 8 |
| Mindset/Lifestyle | 5% | 5 |

**By Belt Level:**
| Belt | Target % | Min Videos |
|------|----------|------------|
| White (min) | 40% | 30 |
| Blue (min) | 70% | 50 |
| Purple (min) | 90% | 70 |
| Brown/Black (min) | 100% | 80 |

---

## Part 4: Quarterly Update Process

### 4.1 Update Schedule

| Quarter | Focus | Deadline |
|---------|-------|----------|
| Q1 (Jan-Mar) | Guard content refresh | March 15 |
| Q2 (Apr-Jun) | Top position content | June 15 |
| Q3 (Jul-Sep) | Submissions & leg locks | September 15 |
| Q4 (Oct-Dec) | Mindset & full audit | December 15 |

### 4.2 Update Workflow

```
Week 1: Content Gap Analysis
├── Review analytics: which struggles have no matching videos?
├── Review user feedback: what content is requested?
├── Check for new instructor content on YouTube
└── Identify videos to remove (deleted, low quality, outdated)

Week 2: Curation
├── Search approved instructors for new content
├── Evaluate against quality criteria
├── Watch full video before adding
└── Document why each video was selected

Week 3: Metadata Tagging
├── Assign all required fields
├── Map to techniques (technique_video_map.csv)
├── Assign addresses_struggles and teaches_defense_for
└── Peer review metadata accuracy

Week 4: Validation & Release
├── Run validation scripts
├── Update TypeScript files
├── Test in prototype
└── Deploy to production
```

### 4.3 Content Gap Detection

Query to identify gaps (pseudo-code):

```sql
-- Struggles with no matching videos
SELECT struggle_category, COUNT(*) as user_mentions
FROM journal_struggles
WHERE struggle_category NOT IN (
  SELECT DISTINCT unnest(string_to_array(addresses_struggles, '|'))
  FROM videos
)
GROUP BY struggle_category
ORDER BY user_mentions DESC;

-- Belt levels with low coverage
SELECT belt_level_min, COUNT(*) as video_count
FROM videos
WHERE video_type = 'instructional'
GROUP BY belt_level_min
HAVING COUNT(*) < 10;

-- Positions with no videos
SELECT pc.position_code
FROM position_categories pc
LEFT JOIN videos v ON v.position_category = pc.position_code
WHERE v.video_id IS NULL;
```

---

## Part 5: Validation Rules

### 5.1 Schema Validation

Run before any data import:

```python
def validate_video(video: dict) -> list[str]:
    errors = []

    # Required fields
    required = ['video_id', 'youtube_id', 'title', 'instructor',
                'duration_seconds', 'video_type', 'content_type',
                'belt_level_min', 'belt_level_max', 'difficulty_score',
                'gi_nogi', 'position_category', 'instructor_tier',
                'verified', 'added_date']
    for field in required:
        if field not in video or not video[field]:
            errors.append(f"Missing required field: {field}")

    # Enum validation
    valid_video_types = ['instructional', 'mindset', 'lifestyle']
    if video.get('video_type') not in valid_video_types:
        errors.append(f"Invalid video_type: {video.get('video_type')}")

    valid_belts = ['white', 'blue', 'purple', 'brown', 'black']
    if video.get('belt_level_min') not in valid_belts:
        errors.append(f"Invalid belt_level_min: {video.get('belt_level_min')}")
    if video.get('belt_level_max') not in valid_belts:
        errors.append(f"Invalid belt_level_max: {video.get('belt_level_max')}")

    # Belt level logic
    belt_order = {'white': 0, 'blue': 1, 'purple': 2, 'brown': 3, 'black': 4}
    if belt_order.get(video.get('belt_level_min'), 0) > belt_order.get(video.get('belt_level_max'), 4):
        errors.append("belt_level_min cannot be higher than belt_level_max")

    # Difficulty score range
    if not (1 <= video.get('difficulty_score', 0) <= 10):
        errors.append(f"difficulty_score must be 1-10: {video.get('difficulty_score')}")

    # YouTube ID format (11 characters)
    if len(video.get('youtube_id', '')) != 11:
        errors.append(f"Invalid youtube_id length: {video.get('youtube_id')}")

    return errors
```

### 5.2 YouTube Availability Check

Periodic check that videos still exist:

```bash
#!/bin/bash
# check_youtube_availability.sh

while IFS=, read -r video_id youtube_id title; do
    status=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtube_id}")

    if [ "$status" != "200" ]; then
        echo "UNAVAILABLE: $video_id ($youtube_id) - $title"
    fi
done < <(tail -n +2 videos.csv | cut -d',' -f1,2,3)
```

### 5.3 Referential Integrity

Ensure all mappings are valid:

```python
def validate_mappings(videos_csv, techniques_csv, mapping_csv):
    video_ids = set(row['video_id'] for row in videos_csv)
    technique_ids = set(row['technique_id'] for row in techniques_csv)

    errors = []
    for row in mapping_csv:
        if row['video_id'] not in video_ids:
            errors.append(f"Invalid video_id in mapping: {row['video_id']}")
        if row['technique_id'] not in technique_ids:
            errors.append(f"Invalid technique_id in mapping: {row['technique_id']}")

    return errors
```

---

## Part 6: File Locations

### 6.1 Data Files

| File | Location | Purpose |
|------|----------|---------|
| `videos.csv` | `/docs/domain-knowledge/bjj-techniques/videos.csv` | Master video list |
| `technique_video_map.csv` | `/docs/domain-knowledge/bjj-techniques/technique_video_map.csv` | Many-to-many mapping |
| `bjj_library/*.csv` | `/docs/domain-knowledge/bjj-techniques/bjj_library/` | Technique definitions |

### 6.2 Implementation Files

| File | Location | Purpose |
|------|----------|---------|
| `techniqueVideos.ts` | `/prototype/src/data/techniqueVideos.ts` | TypeScript video data |
| `types/techniqueVideos.ts` | `/prototype/src/types/techniqueVideos.ts` | TypeScript type definitions |

---

## Part 7: Migration from Legacy Format

### 7.1 Legacy Format (technique_videos.csv)

The previous format stored videos as children of techniques:

```csv
technique_id,video_type,youtube_id,instructor,title,duration_seconds
CG_001,instructional,ypi3ie6hKTI,John Danaher,Closed Guard Fundamentals,720
CG_002,instructional,ypi3ie6hKTI,John Danaher,Closed Guard Fundamentals,720
```

**Problems:**
- Same video duplicated for multiple techniques
- No unique video identity
- Missing recommendation-critical fields (belt_level, addresses_struggles, etc.)

### 7.2 Migration Steps

1. **Extract unique videos** by youtube_id
2. **Assign video_id** (VID_001, VID_002, etc.)
3. **Infer metadata** from technique associations where possible
4. **Create mapping table** from original technique_id associations
5. **Flag for human review** fields that couldn't be inferred

### 7.3 Inferred vs. Human-Required Fields

| Field | Can Infer? | How |
|-------|------------|-----|
| `video_id` | Yes | Auto-generate |
| `youtube_id` | Yes | From legacy data |
| `title` | Yes | From legacy data |
| `instructor` | Yes | From legacy data |
| `duration_seconds` | Yes | From legacy data |
| `video_type` | Yes | From legacy data |
| `content_type` | Partial | Default to 'technique' for instructional |
| `belt_level_min` | Partial | From lowest technique belt_level |
| `belt_level_max` | Partial | From highest technique belt_level |
| `difficulty_score` | No | Requires human review |
| `gi_nogi` | Partial | From video title keywords |
| `position_category` | Yes | From technique_id prefix |
| `addresses_struggles` | No | Requires human review |
| `teaches_defense_for` | No | Requires human review |
| `tags` | Partial | From position + belt level |
| `instructor_tier` | Yes | From instructor name lookup |
| `verified` | No | Set to false until human review |

---

## Appendix A: Content Review Checklist

For each video requiring human verification:

```markdown
## Video Review: [video_id]

**YouTube:** https://www.youtube.com/watch?v=[youtube_id]
**Title:** [title]
**Instructor:** [instructor]

### Quick Check (2 min)
- [ ] Video still available on YouTube
- [ ] Audio quality acceptable
- [ ] Video quality acceptable (720p+)
- [ ] No excessive ads/sponsorship

### Metadata Verification (5 min)
- [ ] `belt_level_min` is appropriate: ___
- [ ] `belt_level_max` is appropriate: ___
- [ ] `difficulty_score` (1-10): ___
- [ ] `gi_nogi` correct: ___
- [ ] `content_type` accurate: ___

### Struggle Mapping (5 min)
Which struggles does this video address? (check all that apply)
- [ ] guard_passed
- [ ] sweep_defense
- [ ] submission_defense_choke
- [ ] submission_defense_arm
- [ ] submission_defense_leg
- [ ] mount_escape
- [ ] side_control_escape
- [ ] back_escape
- [ ] takedown_defense
- [ ] no_attacks
- [ ] timing_issues
- [ ] cardio_fatigue

### Defense Mapping (2 min)
Does this teach defense for specific submissions?
- [ ] triangle
- [ ] armbar
- [ ] kimura
- [ ] americana
- [ ] guillotine
- [ ] rear_naked_choke
- [ ] heel_hook
- [ ] knee_bar
- [ ] toe_hold
- [ ] Other: ___

### Tags (1 min)
Suggested tags: ___

### Reviewer
- Reviewed by: ___
- Date: ___
- Set `verified: true`
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2025 | Initial specification |

---

*This document should be updated whenever the video schema changes or new curation criteria are established.*
