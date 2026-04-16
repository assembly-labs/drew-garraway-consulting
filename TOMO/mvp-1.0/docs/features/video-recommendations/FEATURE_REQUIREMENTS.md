# FEAT-011: AI-Powered Video Recommendations

**Status:** Speccing
**Priority:** P0
**Created:** 2026-04-13

---

## Problem Statement

BJJ practitioners don't know what to watch. YouTube alone has tens of thousands of instructional videos, and paid platforms (BJJ Fanatics, Danaher, AOJ Online) add thousands more. The volume is overwhelming, and most practitioners either:

1. **Watch randomly** -- clicking whatever the algorithm surfaces, which is rarely matched to their current skill level or training focus.
2. **Don't watch at all** -- because the search cost is too high. Finding a guard retention video appropriate for a 6-month white belt vs. a 3-year blue belt requires knowledge most users don't have.
3. **Watch above their level** -- consuming advanced content they can't apply, which creates frustration and bad habits.

TOMO already knows what the user is working on. We have their techniques drilled, submissions received (weaknesses), lesson topics, belt level, training goals, and (with FEAT-010) their qualitative reflections. We should use that data to cherry-pick the right videos at the right time.

This is the difference between "here are some BJJ videos" and "you got caught in guillotines 3 times this week -- here's a 6-minute guillotine defense video from Danaher that's appropriate for your belt level."

---

## User Stories

- "I got caught in guillotines 3 times this week -- show me defense videos."
- "We're learning half guard this month in class -- show me half guard content for my level."
- "I just started training and have no idea what to watch. Help me."
- "I want to see why this video was recommended, not just a random list."
- "That video wasn't helpful -- stop recommending stuff like that."

---

## Requirements

### Core

1. **AI analyzes training data to generate recommendations.** Inputs: techniques drilled (last 2 weeks), submissions received (weaknesses), lesson topics, belt level, training goals, reflection themes (FEAT-010).
2. **Curated content library.** Recommendations come from a verified, tagged video library -- not open YouTube search. Every video in the library has been reviewed for quality and tagged with metadata.
3. **Videos tagged with structured metadata.** Each video is tagged by: technique(s), position(s), belt-appropriateness (white/blue/purple/brown/black), type (instructional, drill, competition footage, concept), and duration.
4. **Recommendations refresh weekly.** After weekly insight generation, the system generates a fresh set of 3-5 video recommendations. Users can also request on-demand refresh.
5. **Each recommendation includes a reason.** Connected to the user's actual training data. Example: "Recommended because you drilled triangle from closed guard 3 times this week but haven't worked triangle defense."
6. **Feedback loop.** Thumbs up/down on each recommendation. Feedback improves future curation (downvoted technique/instructor/type combinations are deprioritized).

### Content

7. **Belt-filtered.** A white belt never sees brown belt content unless explicitly searching. Belt filtering is automatic and mandatory.
8. **Weakness-prioritized.** Submissions received and recurring problem areas (from reflections) rank higher than general interest.
9. **Classroom-aware.** If the user's recent sessions show a consistent lesson topic (e.g., "half guard week"), recommendations cluster around that topic.
10. **Instructor diversity.** Don't over-index on one instructor. Rotate across the library to expose users to different teaching styles.

---

## Content Strategy

### How We Build the Video Library

**Phase 1: Manual curation (launch)**
- Drew and testers manually curate an initial library of 50-100 high-quality, freely available YouTube videos.
- Focus on the top 20 techniques from the technique tree (most logged by users).
- Each video hand-tagged with technique, position, belt range, type, duration.
- Favor short videos (3-10 minutes). Users are more likely to watch a focused 5-minute drill video than a 45-minute seminar.

**Phase 2: Community-assisted (post-launch)**
- Users can submit videos they found helpful. Submitted videos go into a review queue.
- Accepted videos get tagged and added to the library.
- This crowdsources discovery while maintaining quality control.

**Phase 3: Instructor partnerships (future)**
- Partner with BJJ instructors and platforms to feature their content.
- Revenue potential: affiliate links, sponsored placements, premium content unlocks.
- Respects intellectual property -- we link to content, we don't host it.

### Licensing Considerations

- **YouTube embeds are free** -- YouTube's embed API is designed for this use case. We link/embed, never download or re-host.
- **Paid platform content** (BJJ Fanatics, etc.) can be recommended with affiliate links but requires the user to have their own subscription. We surface the recommendation; they access it on the platform.
- **Never re-host or redistribute video content.** TOMO is a recommendation layer, not a content platform.

---

## Data Model

### New table: `video_library`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | |
| `url` | text | NOT NULL, UNIQUE | Video URL (YouTube, BJJ Fanatics, etc.) |
| `title` | text | NOT NULL | Video title |
| `instructor` | text | NULL | Instructor/creator name |
| `technique_tags` | text[] | NULL | Techniques covered (from technique tree) |
| `position_tags` | text[] | NULL | Positions covered |
| `belt_min` | text | NULL | Minimum belt level (white/blue/purple/brown/black) |
| `belt_max` | text | NULL | Maximum belt level |
| `type` | text | NULL, CHECK IN ('instructional','drill','competition','concept','breakdown') | Content type |
| `duration_seconds` | integer | NULL | Video length |
| `source` | text | NULL | Platform (youtube, bjj_fanatics, aoj, etc.) |
| `thumbnail_url` | text | NULL | Thumbnail for display |
| `verified` | boolean | NOT NULL, default false | Has been reviewed for quality |
| `submitted_by` | uuid | NULL, FK → auth.users | User who submitted (Phase 2) |
| `created_at` | timestamptz | NOT NULL, default now() | |

**RLS policy:** Read access for all authenticated users. Write access restricted to admin (or submitted_by for submissions).

### New table: `video_recommendations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | |
| `user_id` | uuid | FK → auth.users, NOT NULL | |
| `video_id` | uuid | FK → video_library, NOT NULL | |
| `reason` | text | NOT NULL | Why this was recommended (human-readable) |
| `insight_id` | uuid | NULL, FK → insights | Linked weekly insight (if generated alongside) |
| `source_data` | jsonb | NULL | Snapshot of training data that triggered this rec |
| `status` | text | NOT NULL, default 'unseen', CHECK IN ('unseen','seen','watched','dismissed') | |
| `feedback` | text | NULL, CHECK IN ('helpful','not_helpful') | User feedback |
| `created_at` | timestamptz | NOT NULL, default now() | |

**RLS policy:** Users can only read/write their own recommendations.

**Indexes:**
- `idx_video_recs_user_created` on (user_id, created_at DESC)
- `idx_video_recs_status` on (user_id, status) WHERE status = 'unseen'
- `idx_video_library_technique` using GIN on (technique_tags)
- `idx_video_library_belt` on (belt_min, belt_max)

---

## AI Pipeline

### Edge Function: `recommend-videos`

**Trigger:** Called after weekly insight generation, or on-demand from the app.

**Inputs:**
- User's belt level and training goals
- Sessions from the last 14 days (techniques, positions, submissions received)
- Recent reflections (tags and summaries, from FEAT-010)
- Current weekly insight (themes, watch items)
- Previous recommendations and their feedback (last 30 days)

**Process:**

1. **Identify training focus areas.** From session data, extract:
   - Top techniques drilled (frequency-ranked)
   - Weaknesses (submissions received, positions lost)
   - Lesson topics (class descriptions, instructor mentions)
   - Reflection themes (frustration areas, coach feedback topics)

2. **Query video library.** Filter by:
   - Belt range includes user's belt
   - Verified = true
   - Technique or position tags overlap with focus areas
   - Not previously recommended in last 30 days (unless feedback was "helpful")
   - Not from downvoted instructors (if pattern exists in feedback)

3. **Rank candidates.** Score by:
   - Weakness relevance (highest weight -- if the user is getting submitted, defense videos rank first)
   - Classroom alignment (matches current lesson topics)
   - Technique gap (drilled a technique but never watched instruction on it)
   - Instructor diversity (penalize same instructor twice in one batch)
   - Duration preference (shorter videos rank higher for first-time recommendations)

4. **Generate reasons.** For each selected video, write a 1-sentence reason connecting it to the user's data. Example: "You've been working closed guard sweeps -- this video covers the hip bump sweep with a detail most white belts miss."

5. **Return 3-5 recommendations.** Store in `video_recommendations` table.

**Prompt template (simplified):**

```
You are a BJJ coach recommending training videos. Given this practitioner's recent training data, select the most relevant videos from the library and explain why each one matters for their development.

Practitioner:
- Belt: {belt} ({stripes} stripes)
- Goals: {goals}
- Recent techniques: {techniques_last_14_days}
- Weaknesses (submissions received): {submissions_received}
- Lesson topics: {lesson_topics}
- Reflection themes: {reflection_tags}
- Previous feedback: {liked_instructors, disliked_types}

Video library candidates:
{filtered_video_list}

Select 3-5 videos. For each, provide:
1. video_id
2. A 1-sentence reason connected to their training data
3. Priority (high/medium/low based on relevance)
```

---

## UX Flow

### Where Recommendations Surface

**Primary: Insights tab — "Watch This" section.**
After the weekly insight text, a new section: "Recommended for You" with 3-5 video cards. This is the natural placement -- the user just read about their training patterns, now here's actionable content to address them.

**Secondary: Session detail — contextual recommendation.**
On a session where the user logged submissions received, a subtle link: "Videos to help with {technique} defense." Shows 1-2 relevant videos inline.

**Future: Dedicated "Learn" tab.**
If video recommendations gain traction, they could graduate to their own tab with browsing, search, and saved favorites. Not in initial release.

### Video Card Design

Each recommendation card shows:
- Thumbnail (from video)
- Title
- Instructor name
- Duration badge
- Belt range badge (e.g., "White - Blue")
- **Reason text** (the AI-generated connection to their training)
- Thumbs up / thumbs down buttons
- Tap to open video (in-app browser or YouTube app)

### Feedback Flow

- Thumbs up: "Got it -- we'll recommend more like this."
- Thumbs down: Optional 1-tap reason picker: "Too advanced", "Not relevant", "Already knew this", "Poor quality."
- Feedback is stored and used in the next recommendation cycle.

---

## Success Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Video watch rate** | % of recommendations where user taps to watch | 40% within first month |
| **Recommendation relevance** | Ratio of thumbs up to total feedback given | > 70% positive |
| **Engagement lift** | Weekly active sessions for users with video recs vs. without | +10% WAU |
| **Repeat engagement** | Users who watch 2+ recommended videos per week | 25% of active users |
| **Technique improvement signal** | Users who watch defense videos and subsequently log fewer submissions in that technique | Directional signal (hard to measure precisely) |
| **Library growth** | Videos added to library per month (Phase 2 community submissions) | 20+ per month after Phase 2 |

---

## Open Questions

1. **In-app playback vs. external redirect?** In-app WebView keeps users in the app but is a worse video experience. External redirect (YouTube app) is better UX but loses the user. Leaning external with a "back to TOMO" deep link.
2. **How many recommendations per week?** 3-5 feels right. Too many creates decision fatigue. Too few feels thin. Should this be configurable?
3. **Paid content handling.** If we recommend a BJJ Fanatics video and the user doesn't have a subscription, that's a dead end. Options: (a) only recommend free content initially, (b) mark paid content clearly with a badge, (c) use affiliate links. Leaning (a) for launch, (b) for Phase 2.
4. **Cold start.** New users with < 3 sessions have minimal training data. Options: (a) belt-based starter pack ("Top 5 videos every new white belt should watch"), (b) wait until enough data exists. Leaning (a).
5. **Video library seed.** Who curates the initial 50-100 videos? Drew? Testers? A combination? Need a curation sprint before this feature can launch.

---

## Dependencies

- FEAT-010 (Reflections) -- reflection tags feed into the recommendation engine. Video recs work without reflections but are significantly better with them.
- Technique tree (361 techniques) -- video tags reference technique tree entries for matching.
- Weekly insight generation pipeline -- video recs hook into the same cadence.
- Supabase migrations for `video_library` and `video_recommendations` tables.
- Initial video library curation (manual effort, not code).

## Out of Scope (for initial release)

- Hosting or re-distributing video content
- User-uploaded technique videos
- Instructor accounts or dashboards
- Monetization (affiliate links, sponsored content)
- Personalized drill programs built from videos
- Video bookmarking or playlists (future "Learn" tab feature)
