# BJJ Video Database Builder for TOMO - Iterative Curation Bot

> **Original project brief provided 2025-02-03.** This is the full specification for the video library aggregation pipeline.

---

## Mission

Build and maintain a comprehensive, high-quality YouTube video database for TOMO's BJJ technique library. This is an iterative, ongoing project - you will run this prompt multiple times to continuously grow and refine the video collection.

## Core Objectives

- Discover relevant, high-quality BJJ instructional videos from YouTube
- Enrich each video with metadata matching TOMO's technique taxonomy
- Filter using quality guardrails before human review
- Present candidates in a review queue for manual approval
- Integrate with Google Forms/Sheets for curation workflow
- Maintain database integrity (no duplicates, broken link checking, updates)

---

## Phase 1: Discovery & Architecture Assessment

**CRITICAL FIRST STEP** - Read these project files thoroughly:

| Brief Reference | Actual TOMO Path |
|-----------------|-----------------|
| `Complete_BJJ_Technique_Library.md` | `docs/domain-knowledge/bjj-techniques/bjj_library/` (14 CSVs, ~375 techniques) |
| `BJJ_Progress_Tracker_Feature_List.md` | `docs/product/_archived/BJJ_Progress_Tracker_Feature_List.md` (archived) |
| `TOMO_Belt_Progression_Requirements_Reference.md` | `docs/research/TOMO_Belt_Progression_Requirements_Reference.md` |
| `The_Pedagogical_DNA_of_Elite_BJJ_Instruction.md` | `docs/brand/instructor-influence-matrix.md` |
| `BJJ_Progress_Tracker_Brand_Voice_Guide.md` | `docs/brand/BRAND_VOICE_GUIDE.md` |
| `Documentation_Frameworks_for_AI-Assisted_App_Development.md` | `docs/development/AGENTIC-DEVELOPMENT-BEST-PRACTICES.md` |

After reading, answer these questions by examining the project:

1. Is there an existing Supabase schema for techniques/videos? Check `/supabase/schemas/` if it exists
2. Is there a Google Form already set up for video curation? Check for any URLs or integration docs
3. What's the current state of the video database (if any)? Check `/src/lib/` or `/src/data/`
4. Are there existing API clients or services for YouTube integration? Check `/src/lib/` or `/src/services/`

Document your findings in a new file: `/docs/video-database-discovery.md`

---

## Phase 2: Database Schema Design

### Required Video Metadata (Based on Project Docs)

Create or update the database schema with these fields:

```typescript
// Core fields
technique_id: string;           // Links to Complete_BJJ_Technique_Library taxonomy
technique_name: string;         // "Scissor Sweep", "Rear Naked Choke", etc.
video_url: string;              // Full YouTube URL
video_id: string;               // YouTube video ID (extracted from URL)
youtube_channel_name: string;   // Channel that posted the video
youtube_channel_id: string;     // For verification/tracking

// Categorization (from Complete_BJJ_Technique_Library.md)
position_category: string;      // "Closed Guard", "Mount", "Back Control", etc.
technique_type: string;         // "Sweep", "Submission", "Escape", "Pass", etc.
belt_level: string[];           // ["white", "blue"] - can apply to multiple belts
gi_applicability: string;       // "gi-only", "no-gi-only", "both"
ibjjf_legal: object;           // {white: true, blue: true, purple: false, ...}

// Instructor credibility (from Pedagogical_DNA.md)
instructor_name: string;        // Verified against trusted instructors list
instructor_credibility: string; // "elite", "verified", "unknown"
teaching_school: string;        // "Danaher", "Gracie", "10th Planet", etc.

// Quality metrics
video_duration_seconds: number;
youtube_view_count: number;
youtube_like_count: number;
youtube_publish_date: string;
video_quality_score: number;    // 1-5 calculated from multiple factors

// Curation workflow
status: string;                 // "candidate", "approved", "rejected", "needs_review"
discovered_date: string;
reviewed_date: string;
approved_by: string;
rejection_reason: string;

// Maintenance
last_verified: string;          // Last time video URL was checked
is_available: boolean;          // Video still exists/public
notes: string;                  // Free-form notes for edge cases

// Optional advanced features
key_points_timestamps: object[];  // [{time: "1:23", description: "Key detail"}]
common_mistakes_addressed: boolean;
prerequisites: string[];        // Technique IDs that should be learned first
related_techniques: string[];   // Technique IDs for related moves
```

**Action:**
- If `/supabase/schemas/` exists, create `technique_videos.sql` following project patterns
- If no Supabase setup yet, create `/docs/proposed-schema.sql` for review
- Generate TypeScript types in `/src/types/video-database.types.ts`

---

## Phase 3: YouTube Discovery Engine with Quality Guardrails

### Trusted Instructor Sources (From Pedagogical_DNA.md)

Prioritize videos from these verified instructors/channels:

**Elite Tier** (auto-approve if technique matches):
- John Danaher
- Gordon Ryan
- Lachlan Giles (Absolute MMA)
- Bernardo Faria (BJJ Fanatics)
- Marcelo Garcia (MGinAction)
- Roger Gracie
- Andre Galvao (Atos BJJ)
- Renzo Gracie
- Caio Terra
- Mikey Musumeci

**Verified Tier** (strong candidates):
- Craig Jones
- Fabio Gurgel (Alliance)
- Eddie Bravo (10th Planet)
- Tom DeBlass
- Garry Tonon
- Keenan Cornelius
- Ryan Hall
- Kit Dale

**Note:** Maintain this list in `/src/data/trusted-instructors.json` with their YouTube channel IDs

### Discovery Strategy

For each technique in the technique library:

1. Search YouTube API (or web scraping if API unavailable) for:
   - Technique name + "tutorial"
   - Technique name + "how to"
   - Technique name + instructor name (from trusted list)
   - Portuguese name + "tutorial" (for authenticity)
   - Japanese name + "tutorial" (for judo throws)

2. **Initial Quality Filters (Automated Guardrails):**

   **MUST PASS (hard requirements):**
   - Video is public and embeddable
   - Duration: 2 minutes to 30 minutes (instructionals, not full matches)
   - Upload date: Within last 10 years (prefer recency, but classics OK)
   - Minimum 1,000 views (signals some validation)
   - Like/dislike ratio > 80% (if available)
   - No copyright strikes visible
   - Title/description mentions the technique name (relevance check)

   **SHOULD PASS (soft scoring):**
   - Instructor is on trusted list (+3 points)
   - Video has chapters/timestamps (+2 points)
   - High production quality (1080p+) (+1 point)
   - Includes gi and no-gi variations (+1 point)
   - Shows common mistakes section (+2 points)
   - View count > 10,000 (+1 point)
   - View count > 100,000 (+2 points)
   - Comments are positive (+1 point)

   Calculate quality_score: hard requirements = eligible, soft points = ranking

3. **Duplicate Detection:**
   - Same video_id already in database -> skip
   - Same technique + same instructor -> flag for review (might be updated version)
   - Same video but different technique tags -> allowed (one video can teach multiple techniques)

4. **Ranking:**
   - Sort candidates by quality_score (high to low)
   - Limit to top 3 videos per technique initially
   - Flag for expansion if technique has <2 quality videos

### Output Format

Create `/data/video-candidates/[technique-name]-candidates.json` for each technique:

```json
{
  "technique_id": "closed-guard-scissor-sweep",
  "technique_name": "Scissor Sweep",
  "discovery_date": "2025-02-03",
  "candidates": [
    {
      "video_url": "https://youtube.com/watch?v=...",
      "video_id": "...",
      "instructor": "Bernardo Faria",
      "channel": "Bernardo Faria BJJ Fanatics",
      "quality_score": 8,
      "duration": "6:23",
      "views": 125000,
      "published": "2023-05-15",
      "guardrails_passed": true,
      "notes": "Elite instructor, shows common mistakes, gi and no-gi",
      "recommended_action": "approve"
    }
  ],
  "total_found": 47,
  "total_after_filters": 3,
  "needs_more_videos": false
}
```

---

## Phase 4: Google Forms Integration

**Investigate existing setup first:**
1. Check project docs for Google Forms URLs or integration notes
2. Look for Google Sheets API credentials in project
3. Check if there's a `/docs/google-integration.md` or similar

**If no existing setup, propose this workflow:**

### Option A: Google Sheets as Review Queue (Recommended)

**Structure:**
```
Sheet: "Video Review Queue"
Columns:
- Technique Name
- Video URL
- Instructor
- Quality Score
- Duration
- Views
- Notes
- Status (Pending/Approved/Rejected)
- Reviewed By
- Review Date
- Action (dropdown: Approve/Reject/Needs More Info)
```

**Process:**
1. Bot exports `/data/video-candidates/*.json` to Google Sheet weekly
2. You review and update Status column
3. Bot reads Sheet, syncs approved videos to Supabase
4. Rejected videos logged with reason for future reference

### Option B: Direct Database with Export

**Structure:**
1. Bot populates Supabase technique_videos with status: "candidate"
2. Export candidates to CSV weekly
3. You review in spreadsheet of choice
4. Re-import approved rows
5. Bot updates statuses

**Action:** Create `/docs/google-integration-proposal.md` explaining both options with pros/cons

---

## Phase 5: Iterative Execution Plan

### First Run (Discovery Sprint)

```
# You'll execute this prompt multiple times. Here's the sequence:

# Run 1: Architecture Discovery
- Read all project files
- Document current state
- Propose schema and integrations
- Get your approval on approach

# Run 2-5: Technique Coverage (White Belt Focus)
- Process techniques from technique library
- Start with white belt requirements (escapes, closed guard, basic submissions)
- Discover ~50-100 videos
- Generate review queue
- Wait for your approval batch

# Run 6-10: Technique Coverage (Blue Belt)
- Half guard, open guards, passing, takedowns
- Discover ~100-150 videos
- Batch review

# Run 11-15: Advanced Techniques (Purple+)
- Advanced guards, leg locks, berimbolo, etc.
- Discover ~100-150 videos

# Run 16+: Maintenance & Expansion
- Verify existing videos (broken links)
- Add new instructors
- Update with latest instructionals
- Fill gaps (techniques with <2 videos)
```

### Each Run Checklist

**Before you start:**
- [ ] Read run-reports/ for what's been done
- [ ] Check what techniques have been processed already
- [ ] Review any notes from previous runs

**During execution:**
- [ ] Process next batch of techniques (10-20 per run)
- [ ] Apply quality guardrails
- [ ] Generate candidate files
- [ ] Update progress log
- [ ] Create summary report

**After completion:**
- [ ] Write run report to `run-reports/run-[N]-[date].md`
- [ ] Create `data/review-queue/batch-[N]-[date].json` for approval
- [ ] Generate summary: "Found X videos for Y techniques, Z passed guardrails"
- [ ] List any techniques with insufficient videos (<2 quality candidates)

---

## Phase 6: Maintenance & Quality Assurance

### Broken Link Detection

```javascript
// Pseudocode for monthly maintenance
for each approved video:
  check if video_id still accessible
  if not:
    status = "unavailable"
    last_verified = today
    flag for replacement
```

### Continuous Improvement

- Track which techniques have <2 approved videos
- Prioritize finding more for those techniques
- Monitor new uploads from trusted instructors
- Update instructor credibility as new channels emerge

---

## Output Format for Each Run

Create `run-reports/run-[N]-[date].md`:

```markdown
# Video Discovery Run #[N] - [Date]

## Summary
- Techniques processed: [list]
- Videos discovered: [total]
- Videos passed guardrails: [count]
- Ready for review: [count]

## Techniques with Strong Coverage (3+ videos)
- [technique]: [count] videos

## Techniques Needing More Videos (<2 videos)
- [technique]: [count] videos

## Top Quality Videos This Run
1. [Technique] - [Instructor] - [URL] - Score: [X]

## Issues/Notes
- [Any problems encountered]
- [Recommendations for next run]

## Next Steps
- Review batch at `data/review-queue/batch-[N]-[date].json`
- Approve/reject videos
- Run next batch focusing on: [techniques]
```

---

## Key Constraints & Best Practices

### Do NOT:
- Auto-approve videos without flagging for review
- Include competition footage (we want instructionals)
- Include videos in non-English without English subtitles (accessibility)
- Include videos from unknown instructors unless quality_score is exceptional
- Process the same technique batch twice (check progress log)
- Include clickbait titles ("THIS SWEEP BROKE MY OPPONENT")

### DO:
- Prefer videos that show both gi and no-gi applications
- Prefer videos that address common mistakes
- Prefer videos with clear audio and multiple camera angles
- Include videos from female instructors (representation matters)
- Flag videos that teach variations of the same technique
- Document your decisions in progress logs
- Ask clarifying questions if technique taxonomy is unclear

---

## Success Metrics

### After 10 runs, you should have:
- [ ] 300-500 candidate videos discovered
- [ ] Coverage for all white belt techniques (2+ videos each)
- [ ] Coverage for most blue belt techniques (1+ video each)
- [ ] Trusted instructor database established
- [ ] Quality guardrails validated and refined
- [ ] Review workflow operational
- [ ] Maintenance system for broken links

### Long-term goal:
- 1,000+ approved videos
- 2-5 videos per technique across 375+ techniques
- Representation from all major teaching schools
- Monthly maintenance runs to keep fresh
