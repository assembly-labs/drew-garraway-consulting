# Video Content Review Checklist

**Purpose:** Workflow for human content review of the video library
**Owner:** Content Curator
**Last Updated:** January 21, 2026

---

## Overview

The video library contains ~53 unique videos that power personalized recommendations. Each video needs human review to populate:

- `difficulty_score` (1-10)
- `addresses_struggles[]` (what problems this video helps with)
- `teaches_defense_for[]` (what submissions this video defends against)
- `tags[]` (searchable keywords)
- `verified` flag (mark true when review complete)

---

## Priority Order

Review videos in this order based on user traffic patterns and belt-level needs:

### Priority 1: White Belt Survival (Review First)

These videos are most critical for new users (highest churn risk):

| Position | Videos | Why Priority |
|----------|--------|--------------|
| Side Control Escapes | 5 videos | #1 white belt struggle |
| Mount Escapes | 7 videos | #2 white belt struggle |
| Back Escapes | 6 videos | Critical survival skill |
| Closed Guard Basics | 15 videos | Safe position for beginners |

### Priority 2: Blue Belt Development

| Position | Videos | Why Priority |
|----------|--------|--------------|
| Half Guard | 6 videos | Game development position |
| Guard Passing | 9 videos | Offensive growth |
| Open Guard | 3 videos | Guard variety |
| Takedowns | 4 videos | Standing confidence |

### Priority 3: Purple+ Advancement

| Position | Videos | Why Priority |
|----------|--------|--------------|
| Submissions | 12 videos | Finish rate improvement |
| Leg Locks | 2 videos | Modern game |
| Advanced concepts | Various | Systems thinking |

### Priority 4: Mindset & Lifestyle

| Category | Videos | Why Priority |
|----------|--------|--------------|
| Belt Journey | 7 videos | Dropout prevention |
| Mental Game | 7 videos | Competition prep |
| Age & Longevity | 6 videos | Retention for older users |
| Lifestyle | 6 videos | Work-life balance |
| Injury & Recovery | 5 videos | Return to training |

---

## Review Process

### For Each Video:

#### Step 1: Watch the Video (or skim key sections)

- [ ] Note the primary technique(s) covered
- [ ] Identify what problems this video solves
- [ ] Assess the teaching style and clarity
- [ ] Check if there are any issues (audio, age-restriction, etc.)

#### Step 2: Assign Difficulty Score (1-10)

| Score | Level | Description | Typical Belt |
|-------|-------|-------------|--------------|
| 1-2 | Fundamental | First-week survival concepts | White |
| 3-4 | Basic | Core building blocks | White-Blue |
| 5-6 | Intermediate | Systems, combinations | Blue-Purple |
| 7-8 | Advanced | Expert details, complex entries | Purple-Brown |
| 9-10 | Expert | Competition-level, innovative | Brown-Black |

**Question to ask:** "What belt level would benefit most from this content?"

#### Step 3: Map Struggle Categories

Select which struggles this video helps address:

```
[ ] guard_retention       - Keeping guard, avoiding passes
[ ] guard_passing         - Successfully passing guard
[ ] mount_escape          - Escaping from mount
[ ] side_control_escape   - Escaping from side control
[ ] back_escape           - Escaping from back control
[ ] submission_defense    - General submission defense
[ ] sweep_timing          - Timing and execution of sweeps
[ ] takedown_defense      - Defending takedowns
[ ] top_pressure          - Maintaining top control
[ ] submission_finish     - Finishing submissions
[ ] half_guard_retention  - Half guard specific retention
[ ] underhook_battle      - Winning underhook fights
[ ] framing               - Proper frame creation
[ ] posture               - Posture in guard
[ ] leg_lock_defense      - Defending leg attacks
```

#### Step 4: Map Defense Content (if applicable)

If the video teaches submission defense, select which submissions:

```
[ ] armbar
[ ] triangle
[ ] kimura
[ ] americana
[ ] guillotine
[ ] rear_naked_choke
[ ] heel_hook
[ ] ankle_lock
[ ] toe_hold
[ ] kneebar
[ ] darce
[ ] anaconda
[ ] north_south_choke
[ ] omoplata
```

#### Step 5: Add Tags (3-5 keywords)

Examples:
- `fundamentals, guard, danaher, white-belt`
- `half-guard, sweeps, underhook, blue-belt`
- `leg-locks, defense, saddle, purple-belt`

#### Step 6: Verify Belt Level Range

Confirm that `belt_level_min` and `belt_level_max` are appropriate:
- Is this video too advanced for the minimum belt?
- Would higher belts benefit, or is it too basic?

#### Step 7: Mark as Verified

Set `verified=true` in videos.csv

---

## Progress Tracking Template

Copy this template to track your review progress:

```markdown
## Content Review Progress - [Your Name]

### Session 1 - [Date]
**Videos Reviewed:** 5
**Time Spent:** 45 minutes

| Video ID | Title | Difficulty | Struggles | Status |
|----------|-------|------------|-----------|--------|
| VID_001 | Closed Guard Fundamentals | 2 | guard_retention, posture | Done |
| VID_002 | Half Guard Game | 4 | half_guard_retention, sweep_timing | Done |
| VID_003 | Side Control Escape | 2 | side_control_escape, framing | Done |
| VID_004 | Back Escape | 2 | back_escape | Done |
| VID_005 | Mount Hand Fighting | 3 | mount_escape, framing | Done |

**Notes:**
- VID_001 is excellent for absolute beginners
- VID_002 might be too advanced for early white belts

---

### Session 2 - [Date]
...
```

---

## Quality Checklist

Before marking a video as verified, confirm:

- [ ] Difficulty score assigned (1-10)
- [ ] At least one struggle category mapped
- [ ] Defense mappings added (if submission defense content)
- [ ] 3-5 relevant tags added
- [ ] Belt range verified as appropriate
- [ ] YouTube video still accessible (not deleted/private)
- [ ] No audio/video quality issues noted

---

## Batch Update Process

### Updating videos.csv

1. Open `videos.csv` in a spreadsheet application
2. Filter to `verified=false` rows
3. Update the following columns:
   - `difficulty_score`: Integer 1-10
   - `addresses_struggles`: Pipe-delimited (e.g., `guard_retention|posture`)
   - `teaches_defense_for`: Pipe-delimited (e.g., `armbar|triangle`)
   - `tags`: Comma-delimited (e.g., `fundamentals,guard,white-belt`)
   - `verified`: Change to `true`
   - `updated_at`: Update to current ISO timestamp
4. Save as CSV (UTF-8 encoding)
5. Run validation script before deploying

### Validation Command

```bash
# From /docs/domain-knowledge/bjj-techniques/
python3 -c "
import csv
with open('videos.csv') as f:
    reader = csv.DictReader(f)
    errors = []
    for row in reader:
        if row['verified'] == 'true':
            if not row['difficulty_score']:
                errors.append(f\"{row['video_id']}: missing difficulty_score\")
            if not row['addresses_struggles']:
                errors.append(f\"{row['video_id']}: missing addresses_struggles\")
    if errors:
        print('Validation errors:')
        for e in errors:
            print(f'  - {e}')
    else:
        print('All verified videos have required fields')
"
```

---

## Review Guidelines

### Difficulty Score Calibration

**Anchor Videos (for reference):**

| Score | Example Video | Why |
|-------|---------------|-----|
| 1 | Basic hip escape | First-day technique |
| 3 | Scissor sweep | Fundamental sweep, timing needed |
| 5 | Knee slice pass | Requires understanding of pressure |
| 7 | Berimbolo | Complex movement, timing-critical |
| 9 | Modern leg lock system | Expert-level concepts |

### When Unsure About Struggles

Ask: "If a user said they're struggling with X, would this video help?"

- If yes, add that struggle category
- Multiple struggles OK (most videos help with 1-3 struggles)
- For general technique videos, use the most relevant category

### Tags Best Practices

- Use lowercase
- Include belt level if clearly targeted (`white-belt`, `blue-belt`, etc.)
- Include instructor name as tag
- Include position name
- Include technique type (`sweep`, `escape`, `pass`, `submission`)

---

## Quarterly Review Reminder

Every quarter, re-review:

1. **Availability** - Run link checker on all videos
2. **Relevance** - Are any videos outdated?
3. **Gaps** - What positions/belts need more content?
4. **Quality** - Any videos that should be replaced?

---

## Questions?

If you encounter issues during review:

1. Note the video_id and issue
2. Add to "Review Issues" section below
3. Discuss with team during next sync

### Review Issues Log

| Date | Video ID | Issue | Resolution |
|------|----------|-------|------------|
| - | - | - | - |

---

*This checklist is part of the TOMO video library maintenance process.*
*See /docs/data-and-ai/VIDEO_CONTENT_LIBRARY_SPEC.md for full schema documentation.*
