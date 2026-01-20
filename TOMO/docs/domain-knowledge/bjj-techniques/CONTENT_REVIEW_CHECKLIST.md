# Video Content Review Checklist

> **Purpose:** Track human review progress for video metadata that couldn't be automatically inferred.

**Created:** January 2025
**Total Videos:** 53
**Estimated Review Time:** 12-18 hours (15-20 min per video)

---

## Review Priority

Review videos in this order to maximize impact:

### Priority 1: High-Traffic Positions (20 videos)
Core positions that most users will need.

| video_id | instructor | position | title | reviewed |
|----------|------------|----------|-------|----------|
| VID_027 | Lachlan Giles | side_control | The Best Way To Escape Side Control | [ ] |
| VID_041 | John Danaher | closed_guard | John Danaher Explains Closed Guard Fundamentals | [ ] |
| VID_037 | Gordon Ryan | mount | Early Hand Fighting From Mount | [ ] |
| VID_031 | Lachlan Giles | back_control | Escaping The Back - Pay Attention To The Leg Work | [ ] |
| VID_023 | John Danaher | half_guard | How To Build The Perfect Half Guard Game For No Gi | [ ] |
| VID_012 | Lachlan Giles | guard_passing | Understanding Guard Passing - Concepts And Heuristics | [ ] |
| VID_019 | John Danaher | guard_passing | 5 Tips To Pass ANY Guard | [ ] |
| VID_013 | Gordon Ryan | clinch | How To Do The Perfect Front Headlock And Turtle Escapes | [ ] |
| VID_018 | Gordon Ryan | open_guard | The Most Basic Principles Of Butterfly And Open Guard | [ ] |
| VID_016 | John Danaher | submissions | How To Do The Perfect Triangle Choke Even If You Have Short Legs | [ ] |

### Priority 2: Mindset/Lifestyle (6 videos)
Critical for at-risk user support.

| video_id | instructor | category | title | reviewed |
|----------|------------|----------|-------|----------|
| VID_043 | Jocko Willink | mindset | GOOD - Turning Setbacks Into Opportunities | [ ] |
| VID_046 | Jocko Willink | mindset | Overcoming Burnout - Where Discipline Comes From | [ ] |
| VID_048 | Firas Zahabi | lifestyle | Training Frequency And Flow - Joe Rogan Podcast | [ ] |
| VID_044 | Jocko Willink | mindset | Discipline Equals Freedom | [ ] |
| VID_047 | Jocko Willink | mindset | Humility And Self Confidence In Jiu Jitsu | [ ] |
| VID_045 | Jocko Willink | mindset | BJJ Competition Mindset And Training Tips | [ ] |

### Priority 3: Remaining Videos (27 videos)
Review as time permits.

---

## Review Process

For each video:

### Step 1: Quick Check (2 min)
- [ ] Open YouTube: `https://www.youtube.com/watch?v={youtube_id}`
- [ ] Verify video is still available
- [ ] Confirm audio/video quality is acceptable
- [ ] Note if video has been removed or made private

### Step 2: Watch & Assess (10-15 min)
- [ ] Watch video at 1.5x speed
- [ ] Note what techniques/concepts are covered
- [ ] Assess difficulty level
- [ ] Identify what struggles this addresses

### Step 3: Fill Metadata

**difficulty_score (1-10):**
| Score | Meaning | Examples |
|-------|---------|----------|
| 1-2 | Absolute fundamentals | Basic posture, survival concepts |
| 3-4 | White belt curriculum | Scissor sweep, armbar from guard |
| 5-6 | Blue belt development | Half guard systems, passing concepts |
| 7-8 | Purple belt systems | Leg lock entries, advanced guards |
| 9-10 | Elite/competition | Berimbolo, advanced leg lock systems |

**addresses_struggles (pick all that apply):**
- `guard_passed` - Helps with guard retention
- `sweep_defense` - Helps maintain top position
- `submission_defense_choke` - Defends against chokes
- `submission_defense_arm` - Defends against arm attacks
- `submission_defense_leg` - Defends against leg locks
- `mount_escape` - Helps escape mount
- `side_control_escape` - Helps escape side control
- `back_escape` - Helps escape back control
- `takedown_defense` - Helps defend takedowns
- `no_attacks` - Helps develop offensive game
- `timing_issues` - Addresses timing/speed problems
- `cardio_fatigue` - Addresses conditioning/pacing

**teaches_defense_for (pick all that apply):**
- `triangle`
- `armbar`
- `kimura`
- `americana`
- `guillotine`
- `rear_naked_choke`
- `heel_hook`
- `knee_bar`
- `toe_hold`

**tags (add relevant tags):**
- Belt levels: `white-belt`, `blue-belt`, `purple-belt`, etc.
- Focus: `fundamentals`, `concepts`, `competition`, `self-defense`
- Style: `pressure`, `speed`, `flexibility`, `technique-over-strength`
- Training: `drill`, `flow`, `positional-sparring`

### Step 4: Update CSV
1. Open `videos.csv` in spreadsheet application
2. Find the row by `video_id`
3. Fill in: `difficulty_score`, `addresses_struggles`, `teaches_defense_for`, `tags`
4. Set `verified` to `true`
5. Set `last_verified` to today's date (YYYY-MM-DD)
6. Save as CSV (UTF-8)

---

## Spreadsheet Template

For easier review, you can copy this to Google Sheets and review there before updating the CSV.

| video_id | youtube_link | instructor | title | difficulty_score | addresses_struggles | teaches_defense_for | tags | verified | notes |
|----------|--------------|------------|-------|------------------|---------------------|---------------------|------|----------|-------|
| VID_001 | https://www.youtube.com/watch?v=-zgwLkCoWDw | John Danaher | The Importance Of BJJ Fundamentals | | | | | [ ] | |
| ... | | | | | | | | | |

---

## Progress Tracking

### Completed Reviews: 0 / 53

**Priority 1 (High-Traffic):** 0 / 10
**Priority 2 (Mindset):** 0 / 6
**Priority 3 (Remaining):** 0 / 27

### Last Updated: [DATE]

---

## Notes

- Videos can address multiple struggles (use pipe `|` to separate in CSV)
- If a video is no longer available, mark in notes and set `verified` to `unavailable`
- Prioritize accuracy over speed - this data powers recommendations
- When in doubt about difficulty, err on the lower side
- Use instructor tier as a quality signal (Tier 1 = highest quality)

---

## Questions?

Contact Drew Garraway or refer to `/docs/data-and-ai/VIDEO_CONTENT_LIBRARY_SPEC.md` for full documentation.
