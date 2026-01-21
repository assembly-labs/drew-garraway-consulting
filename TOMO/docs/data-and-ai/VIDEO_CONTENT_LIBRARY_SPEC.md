# Video Content Library Specification

**Version:** 1.0
**Date:** January 21, 2026
**Status:** Active
**Purpose:** Define the video library structure, curation criteria, and maintenance process

---

## Table of Contents

1. [Overview](#overview)
2. [Video Schema](#video-schema)
3. [Video-Technique Mapping](#video-technique-mapping)
4. [Position Categories](#position-categories)
5. [Curation Criteria](#curation-criteria)
6. [Priority Instructors](#priority-instructors)
7. [Validation Rules](#validation-rules)
8. [Maintenance Process](#maintenance-process)
9. [Data Storage](#data-storage)

---

## Overview

### What This Document Covers

The video content library is a curated collection of BJJ instructional videos that powers:
- **"For You" recommendations** — Personalized video suggestions
- **Technique browsing** — Category-based exploration
- **Struggle-matched learning** — Videos that address specific training difficulties

### Library Statistics

| Metric | Count |
|--------|-------|
| Total videos | ~270 |
| Unique techniques covered | ~120 |
| Position categories | 19 (14 technical + 5 mindset) |
| Priority instructors | 4 |
| Featured instructors | 6+ |

### Key Files

```
/docs/domain-knowledge/bjj-techniques/
├── videos.csv                # Master video library (deduplicated)
└── technique_video_map.csv   # Video-to-technique relationships

/prototype/src/
├── data/
│   └── techniqueVideos.ts    # Video catalog and helper functions
└── types/
    └── techniqueVideos.ts    # Type definitions
```

---

## Video Schema

### Master Video Record (videos.csv)

The `videos.csv` file is the deduplicated master list of all videos in the library. Each YouTube video appears exactly once.

```typescript
interface Video {
  video_id: string;             // Unique ID: VID_001, VID_002, etc.
  youtube_id: string;           // YouTube video ID (11 characters)
  video_type: VideoType;        // 'instructional' | 'quicktip' | 'competition' | 'chain' | 'mindset' | 'lifestyle'
  instructor: string;           // Instructor name
  title: string;                // Video title (human-readable)
  duration_seconds: number;     // Video length in seconds

  // Belt appropriateness
  belt_level_min: BeltLevel;    // Minimum belt for recommendation
  belt_level_max: BeltLevel;    // Maximum belt for recommendation

  // Classification
  gi_nogi: 'gi' | 'nogi' | 'both';
  position_category: PositionCategory;

  // Recommendation metadata (filled during content review)
  difficulty_score: number | null;      // 1-10 scale
  addresses_struggles: string[];        // Struggle categories this video helps with
  teaches_defense_for: string[];        // Submission types this video defends against
  tags: string[];                       // Searchable tags

  // Status
  verified: boolean;            // Has been reviewed by content curator
  created_at: string;           // ISO timestamp
  updated_at: string;           // ISO timestamp
}

type VideoType =
  | 'instructional'  // Full technique breakdown (5-15 min)
  | 'quicktip'       // Short tip or detail (1-3 min)
  | 'competition'    // Competition footage with analysis
  | 'chain'          // Technique combination/chain
  | 'mindset'        // Mental game content
  | 'lifestyle';     // Training lifestyle content

type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
```

### videos.csv Schema

```csv
video_id,youtube_id,video_type,instructor,title,duration_seconds,belt_level_min,belt_level_max,gi_nogi,position_category,difficulty_score,addresses_struggles,teaches_defense_for,tags,verified,created_at,updated_at
VID_001,ypi3ie6hKTI,instructional,John Danaher,John Danaher Explains Closed Guard Fundamentals,720,white,black,both,closed_guard,2,guard_retention|posture,armbar|triangle,"fundamentals,guard,danaher",true,2026-01-21T00:00:00Z,2026-01-21T00:00:00Z
VID_002,Ze10eulM1xg,instructional,John Danaher,How To Build The Perfect Half Guard Game For No Gi,900,blue,black,nogi,half_guard,4,half_guard_retention|sweep_timing,guard_pass,"half-guard,sweeps,nogi",true,2026-01-21T00:00:00Z,2026-01-21T00:00:00Z
```

### Field Definitions

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| video_id | Yes | string | Must match `VID_\d{3}` pattern |
| youtube_id | Yes | string | Must be 11 characters, alphanumeric + dash/underscore |
| video_type | Yes | enum | Must be valid VideoType |
| instructor | Yes | string | Non-empty, max 100 characters |
| title | Yes | string | Non-empty, max 200 characters |
| duration_seconds | Yes | integer | Positive integer, max 7200 (2 hours) |
| belt_level_min | Yes | enum | Must be valid BeltLevel |
| belt_level_max | Yes | enum | Must be >= belt_level_min |
| gi_nogi | Yes | enum | 'gi' \| 'nogi' \| 'both' |
| position_category | Yes | enum | Must be valid PositionCategory |
| difficulty_score | No | integer | 1-10 or null |
| addresses_struggles | No | string | Pipe-delimited struggle categories |
| teaches_defense_for | No | string | Pipe-delimited submission types |
| tags | No | string | Comma-delimited tags |
| verified | Yes | boolean | true \| false |
| created_at | Yes | string | ISO 8601 timestamp |
| updated_at | Yes | string | ISO 8601 timestamp |

### Struggle Categories (addresses_struggles)

```
guard_retention       - Keeping guard, avoiding passes
guard_passing         - Successfully passing guard
mount_escape          - Escaping from mount
side_control_escape   - Escaping from side control
back_escape           - Escaping from back control
submission_defense    - General submission defense
sweep_timing          - Timing and execution of sweeps
takedown_defense      - Defending takedowns
top_pressure          - Maintaining top control
submission_finish     - Finishing submissions
half_guard_retention  - Half guard specific retention
underhook_battle      - Winning underhook fights
framing               - Proper frame creation
posture               - Posture in guard
leg_lock_defense      - Defending leg attacks
```

### Submission Types (teaches_defense_for)

```
armbar            - Armbar defense
triangle          - Triangle choke defense
kimura            - Kimura defense
americana         - Americana defense
guillotine        - Guillotine defense
rear_naked_choke  - RNC defense
heel_hook         - Heel hook defense
ankle_lock        - Ankle lock defense
toe_hold          - Toe hold defense
kneebar           - Kneebar defense
darce             - D'arce choke defense
anaconda          - Anaconda choke defense
north_south_choke - North-south choke defense
omoplata          - Omoplata defense
```

### Legacy TechniqueVideo Interface (Deprecated)

```typescript
/**
 * @deprecated Use Video interface instead.
 * Kept for backward compatibility during transition.
 */
interface TechniqueVideo {
  technique_id: string;       // Position prefix + number (e.g., "CG_001")
  video_type: VideoType;
  youtube_id: string;
  instructor: string;
  title: string;
  duration_seconds: number;
}
```

---

## Video-Technique Mapping

### Many-to-Many Relationship

A single video may cover multiple techniques, and a single technique may have multiple videos. This relationship is captured in `technique_video_map.csv`.

### technique_video_map.csv Schema

```csv
video_id,technique_id,relevance_score,is_primary
VID_001,CG_001,95,true
VID_001,CG_002,80,false
VID_001,CG_003,75,false
VID_002,HG_001,95,true
VID_002,HG_016,85,false
```

### VideoTechniqueMapping Interface

```typescript
interface VideoTechniqueMapping {
  video_id: string;           // References videos.csv video_id
  technique_id: string;       // References bjj_library technique_id
  relevance_score: number;    // 1-100, how relevant video is to technique
  is_primary: boolean;        // True if this is the main technique covered
}
```

### Field Definitions

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| video_id | Yes | string | Must exist in videos.csv |
| technique_id | Yes | string | Must exist in bjj_library CSVs |
| relevance_score | Yes | integer | 1-100 |
| is_primary | Yes | boolean | true \| false |

### Relevance Score Guidelines

| Score Range | Meaning |
|-------------|---------|
| 90-100 | Video is primarily about this technique |
| 70-89 | Technique is a major focus of the video |
| 50-69 | Technique is covered as part of a larger topic |
| 30-49 | Technique is briefly mentioned or shown |
| 1-29 | Technique is only tangentially related |

### Rules

1. Each video must have at least one mapping with `is_primary=true`
2. Each video can have at most 5 mappings (prevents over-mapping)
3. A technique can have unlimited video mappings
4. Relevance score >= 50 required for recommendation eligibility

---

## Position Categories

### Technical Positions (14)

| Prefix | Category | Description | Typical Video Count |
|--------|----------|-------------|---------------------|
| CG | Closed Guard | Bottom closed guard offense/defense | 20-30 |
| HG | Half Guard | Bottom half guard systems | 15-20 |
| OG | Open Guard | Butterfly, spider, DLR, etc. | 20-25 |
| MT | Mount | Top mount attacks, bottom mount escapes | 15-20 |
| SC | Side Control | Top control, bottom escapes | 20-25 |
| BC | Back Control | Taking back, attacking back, escaping | 15-20 |
| NS | North-South | North-south position attacks/escapes | 5-10 |
| TT | Turtle | Turtle attacks and escapes | 10-15 |
| TD | Takedowns | Wrestling, judo throws, guard pulls | 15-20 |
| CL | Clinch | Standing clinch, head/arm positions | 15-20 |
| GP | Guard Passing | Pressure, speed, technique passing | 25-30 |
| KB | Knee on Belly | KOB attacks and escapes | 5-10 |
| SM | Submissions | Submission-specific videos (cross-position) | 30-40 |
| TR | Transitions | Position-to-position movement | 10-15 |

### Mindset & Lifestyle (5)

| Prefix | Category | Description | Typical Video Count |
|--------|----------|-------------|---------------------|
| BJ | Belt Journey | Psychology at each belt level | 5-10 |
| MG | Mental Game | Competition anxiety, ego, flow state | 5-10 |
| AL | Age & Longevity | Training over 40, injury prevention | 5-10 |
| LB | Lifestyle | Work-life balance, motivation, consistency | 5-10 |
| IR | Injury & Recovery | Coming back from injury, prehab | 5-10 |

### Position Name Mapping

```typescript
const positionNames: Record<PositionCategory, string> = {
  // Technical
  closed_guard: 'Closed Guard',
  half_guard: 'Half Guard',
  open_guard: 'Open Guard',
  mount: 'Mount',
  side_control: 'Side Control',
  back_control: 'Back Control',
  north_south: 'North-South',
  turtle: 'Turtle',
  takedowns: 'Takedowns',
  clinch: 'Clinch',
  guard_passing: 'Guard Passing',
  knee_on_belly: 'Knee on Belly',
  submissions: 'Submissions',
  transitions: 'Transitions',
  // Mindset
  belt_journey: 'Belt Journey',
  mental_game: 'Mental Game',
  age_longevity: 'Age & Longevity',
  lifestyle: 'Lifestyle',
  injury_recovery: 'Injury & Recovery',
};
```

---

## Curation Criteria

### Video Selection Requirements

**Must Have:**
1. **Verified YouTube ID** — Video must be accessible and not age-restricted
2. **Clear instruction** — Audio/video quality must be watchable
3. **BJJ-focused** — Content directly applicable to BJJ training
4. **Appropriate length** — 3-20 minutes for instructional (quicktips: 1-5 min)

**Should Have:**
1. **Priority instructor** — From approved instructor list
2. **Systematic approach** — Concepts explained, not just moves shown
3. **Multiple angles** — Key details visible
4. **No excessive promotion** — Educational content, not infomercials

**Must Not Have:**
1. **Copyrighted music issues** — May cause regional blocks
2. **Age restrictions** — Must be viewable by all users
3. **Outdated information** — Pre-modern rule sets (unless historical)
4. **Dangerous techniques** — Without proper safety context

### Difficulty Ratings (1-10)

| Rating | Level | Description | Typical Belt |
|--------|-------|-------------|--------------|
| 1-2 | Fundamental | Basic survival, first-week concepts | White |
| 3-4 | Basic | Core techniques, building blocks | White-Blue |
| 5-6 | Intermediate | Systems, combinations, strategy | Blue-Purple |
| 7-8 | Advanced | Complex entries, expert details | Purple-Brown |
| 9-10 | Expert | Competition-level, innovative concepts | Brown-Black |

### Belt-Appropriate Difficulty Ranges

| Belt | Difficulty Range | Focus |
|------|------------------|-------|
| White | 1-3 | Survival, fundamentals |
| Blue | 2-5 | Game development, breadth |
| Purple | 4-8 | Systems, depth |
| Brown | 6-10 | Refinement, expert details |
| Black | 1-10 | All content, teaching perspective |

---

## Priority Instructors

### Tier 1: Primary (10-point scoring bonus)

| Instructor | Specialty | Why Priority |
|------------|-----------|--------------|
| **John Danaher** | Systems, concepts | Gold standard for systematic teaching |
| **Gordon Ryan** | Modern competition | GOAT-level demonstration, current meta |
| **Lachlan Giles** | Accessible teaching | Clear explanations, high production |
| **Craig Jones** | Leg locks | Expert-level leg lock instruction |

### Tier 2: Featured (5-point scoring bonus)

| Instructor | Specialty | Notes |
|------------|-----------|-------|
| **Jocko Willink** | Mindset, discipline | Mental game and lifestyle |
| **Firas Zahabi** | Training philosophy | Longevity, sustainable training |
| **Gustavo Gasperin** | Fundamentals | Clear, beginner-friendly |
| **Stephan Kesting** | Fundamentals | Comprehensive basics |

### Instructor Selection Rationale

**Why These Instructors:**
1. **Proven track record** — Competition success and/or teaching reputation
2. **Modern approach** — Techniques that reflect current best practices
3. **Clear communication** — Ability to explain concepts, not just demonstrate
4. **Consistent quality** — Reliable video production standards
5. **BJJ philosophy alignment** — Process-focused, not outcome-obsessed

**Exclusion Criteria:**
- Excessive self-promotion
- Outdated techniques without context
- Poor audio/video quality
- Controversial conduct issues

---

## Validation Rules

### videos.csv Validation

Run these validations before importing or deploying video data:

```typescript
interface VideoValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

function validateVideos(videos: Video[]): VideoValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const seenYoutubeIds = new Set<string>();
  const seenVideoIds = new Set<string>();

  for (const video of videos) {
    // Required field checks
    if (!video.video_id?.match(/^VID_\d{3,4}$/)) {
      errors.push({ video_id: video.video_id, message: 'Invalid video_id format' });
    }
    if (!video.youtube_id?.match(/^[\w-]{11}$/)) {
      errors.push({ video_id: video.video_id, message: 'Invalid youtube_id format' });
    }
    if (video.duration_seconds <= 0 || video.duration_seconds > 7200) {
      errors.push({ video_id: video.video_id, message: 'Duration out of range (1-7200)' });
    }

    // Belt level consistency
    const beltOrder = ['white', 'blue', 'purple', 'brown', 'black'];
    const minIdx = beltOrder.indexOf(video.belt_level_min);
    const maxIdx = beltOrder.indexOf(video.belt_level_max);
    if (minIdx === -1 || maxIdx === -1) {
      errors.push({ video_id: video.video_id, message: 'Invalid belt level' });
    } else if (minIdx > maxIdx) {
      errors.push({ video_id: video.video_id, message: 'belt_level_min > belt_level_max' });
    }

    // Difficulty score range
    if (video.difficulty_score !== null && (video.difficulty_score < 1 || video.difficulty_score > 10)) {
      errors.push({ video_id: video.video_id, message: 'difficulty_score must be 1-10' });
    }

    // Uniqueness checks
    if (seenVideoIds.has(video.video_id)) {
      errors.push({ video_id: video.video_id, message: 'Duplicate video_id' });
    }
    seenVideoIds.add(video.video_id);

    if (seenYoutubeIds.has(video.youtube_id)) {
      errors.push({ video_id: video.video_id, message: 'Duplicate youtube_id' });
    }
    seenYoutubeIds.add(video.youtube_id);

    // Warnings for unverified content
    if (!video.verified) {
      warnings.push({ video_id: video.video_id, message: 'Video not yet verified' });
    }
    if (!video.difficulty_score) {
      warnings.push({ video_id: video.video_id, message: 'Missing difficulty_score' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

### technique_video_map.csv Validation

```typescript
function validateMappings(
  mappings: VideoTechniqueMapping[],
  validVideoIds: Set<string>,
  validTechniqueIds: Set<string>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const videoMappingCounts = new Map<string, number>();
  const videoPrimaryFlags = new Map<string, boolean>();

  for (const mapping of mappings) {
    // Reference checks
    if (!validVideoIds.has(mapping.video_id)) {
      errors.push({ video_id: mapping.video_id, message: 'video_id not in videos.csv' });
    }
    if (!validTechniqueIds.has(mapping.technique_id)) {
      errors.push({ video_id: mapping.video_id, message: `technique_id ${mapping.technique_id} not found` });
    }

    // Relevance score range
    if (mapping.relevance_score < 1 || mapping.relevance_score > 100) {
      errors.push({ video_id: mapping.video_id, message: 'relevance_score must be 1-100' });
    }

    // Track mappings per video
    const count = (videoMappingCounts.get(mapping.video_id) || 0) + 1;
    videoMappingCounts.set(mapping.video_id, count);

    if (mapping.is_primary) {
      if (videoPrimaryFlags.has(mapping.video_id)) {
        warnings.push({ video_id: mapping.video_id, message: 'Multiple is_primary=true mappings' });
      }
      videoPrimaryFlags.set(mapping.video_id, true);
    }
  }

  // Check each video has exactly one primary
  for (const [videoId, hasPrimary] of videoPrimaryFlags) {
    if (!hasPrimary) {
      errors.push({ video_id: videoId, message: 'No is_primary=true mapping' });
    }
  }

  // Check mapping limits
  for (const [videoId, count] of videoMappingCounts) {
    if (count > 5) {
      warnings.push({ video_id: videoId, message: `Too many mappings (${count} > 5)` });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
```

### YouTube Availability Check

```typescript
async function checkYouTubeAvailability(videos: Video[]): Promise<AvailabilityReport> {
  const unavailable: string[] = [];
  const ageRestricted: string[] = [];
  const regionBlocked: string[] = [];

  for (const video of videos) {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtube_id}&format=json`
      );

      if (!response.ok) {
        unavailable.push(video.video_id);
      }
    } catch (e) {
      unavailable.push(video.video_id);
    }
  }

  return {
    totalChecked: videos.length,
    unavailable,
    ageRestricted,
    regionBlocked,
    availabilityRate: (videos.length - unavailable.length) / videos.length,
  };
}
```

### Pre-Deployment Checklist

```markdown
## Pre-Deployment Video Validation

- [ ] Run `validateVideos()` with zero errors
- [ ] Run `validateMappings()` with zero errors
- [ ] Run YouTube availability check (>95% available)
- [ ] All new videos have `verified=true`
- [ ] All new videos have `difficulty_score` set
- [ ] Belt level ranges are appropriate for content
- [ ] No duplicate YouTube IDs
- [ ] technique_video_map has primary for each video
```

---

## Maintenance Process

### Adding New Videos

1. **Identify need** — Gap in coverage or new quality content
2. **Verify video** — Check availability, quality, appropriateness
3. **Assign technique_id** — Use existing ID if updating, new ID if novel
4. **Extract metadata** — Title, duration, instructor
5. **Rate difficulty** — 1-10 scale
6. **Add to catalog** — Update `techniqueVideos.ts`
7. **Test rendering** — Verify video loads in app

### Video Addition Checklist

```markdown
- [ ] YouTube video accessible (not private/deleted)
- [ ] Audio quality acceptable
- [ ] Video quality 720p+
- [ ] No age restriction
- [ ] Instructor verified
- [ ] Technique ID assigned
- [ ] Duration recorded (seconds)
- [ ] Difficulty rated (1-10)
- [ ] Tags added (optional)
- [ ] Added to techniqueVideos.ts
- [ ] Tested in dev environment
```

### Removing/Replacing Videos

**Removal Triggers:**
- Video deleted or made private
- Copyright claim blocking access
- Content became controversial
- Better alternative found

**Replacement Process:**
1. Mark existing video as deprecated (comment, don't delete)
2. Find replacement video meeting criteria
3. Update `youtube_id` with new video
4. Test rendering
5. Remove deprecated entry after verification

### Quarterly Review Checklist

```markdown
## Q[X] Video Library Review

### Availability Check
- [ ] Run automated link checker on all youtube_ids
- [ ] Document any broken/unavailable videos
- [ ] Find replacements for unavailable content

### Coverage Assessment
- [ ] Identify position categories with <5 videos
- [ ] Identify belt levels with gaps
- [ ] Prioritize additions for next quarter

### Quality Review
- [ ] Sample 10% of videos for quality check
- [ ] Note any that need replacement
- [ ] Update difficulty ratings if needed

### Instructor Review
- [ ] Check for new content from priority instructors
- [ ] Evaluate any new instructors for inclusion

### Metrics Review
- [ ] Most-viewed videos (add similar)
- [ ] Least-viewed videos (evaluate for removal)
- [ ] User feedback on recommendations
```

---

## Data Storage

### Current Storage: TypeScript Arrays

```typescript
// /prototype/src/data/techniqueVideos.ts

export const techniqueVideos: TechniqueVideo[] = [
  {
    technique_id: 'CG_001',
    video_type: 'instructional',
    youtube_id: 'ypi3ie6hKTI',
    instructor: 'John Danaher',
    title: 'John Danaher Explains Closed Guard Fundamentals',
    duration_seconds: 720
  },
  // ... more videos
];
```

### Future: CSV/Database

For easier maintenance, consider migrating to:

**Option A: CSV File**
```
/prototype/src/data/videos.csv
```
- Easier bulk editing
- Version control friendly
- Imported at build time

**Option B: Supabase Table**
```sql
CREATE TABLE technique_videos (
  id SERIAL PRIMARY KEY,
  technique_id VARCHAR(10) NOT NULL,
  video_type VARCHAR(20) NOT NULL,
  youtube_id VARCHAR(11) NOT NULL,
  instructor VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  duration_seconds INTEGER NOT NULL,
  difficulty INTEGER,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
- Dynamic updates without deploys
- Query flexibility
- Analytics capability

### Helper Functions

```typescript
// Get all videos for a technique
export function getVideosForTechnique(techniqueId: string): TechniqueVideoSet;

// Get mindset/lifestyle videos
export function getMindsetVideos(): TechniqueVideo[];
export function getMindsetVideosByCategory(category: string): TechniqueVideo[];

// Get videos by instructor
export function getVideosByInstructor(instructor: string): TechniqueVideo[];

// Get technique IDs with videos
export function getTechniqueIdsWithVideos(): string[];

// Check if technique has videos
export function hasVideos(techniqueId: string): boolean;

// Get video statistics
export function getVideoStats(): {
  totalVideos: number;
  techniquesWithVideos: number;
  byInstructor: Record<string, number>;
};

// Map technique ID to position
export function getTechniquePosition(techniqueId: string): PositionCategory;
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `TECHNIQUE_RECOMMENDATION_ENGINE.md` | How videos are recommended |
| `DATA_AND_AI_BY_PAGE.md` | How videos appear in Techniques page |
| `BELT_INTEGRATION_SPEC.md` | Belt-level content filtering |

---

*Document Version: 1.0*
*Last Updated: January 21, 2026*
*Author: TOMO Product Team*
