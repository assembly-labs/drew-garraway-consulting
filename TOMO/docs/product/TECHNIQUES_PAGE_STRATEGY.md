# Techniques Page Strategy Document

**Created:** February 8, 2026
**Author:** Product Strategy
**Status:** For Review
**Related:** `TECHNIQUES_PRD.md`, `FEATURES.md`, `VIDEO_DATABASE.md`

---

## Executive Summary

The Techniques page is TOMO's **learning hub** - the place users go when they're NOT exhausted, wanting to study and improve. It currently functions well as a video catalog, but it has the potential to become the single most valuable non-logging feature in the app. This document presents four strategic approaches for evolving the Techniques page, each with different tradeoffs.

The core question: **Should the Techniques page be a video library, a personal curriculum, a practice tracker, or a coaching assistant?**

---

## Current State Assessment

### What's Working
- For You / Browse dual-tab structure is clean and intuitive
- Belt-specific suggestions in Browse mode are well-received
- Mindset & Lifestyle section differentiates TOMO from pure technique databases
- YouTube embeds work reliably with good fallback chain
- Log Practice button creates data connection between studying and doing
- 53 unique videos across 169 entries

### What's Weak
- Content gating is absent (white belts see leg lock entries, which can be overwhelming/dangerous)
- Video-technique mapping uses fuzzy title matching (imprecise)
- No sense of progression or "what to learn next"
- Featured Instructors is a dead-end (display only, no interaction)
- No way to save/bookmark content for later
- No memory of what you've watched
- Search results are bare-bones (no thumbnails, no highlighting)
- 68% of techniques lack video coverage (feels sparse when browsing)

### User Behavior Hypothesis
Based on the app's persona system, users likely fall into these patterns:
1. **"What should I work on?"** (60% of visits) - Want personalized guidance
2. **"I want to learn X"** (25% of visits) - Searching for specific content
3. **"I'm just browsing"** (15% of visits) - Exploring, killing time

---

## Strategy A: "The Smart Video Library"

### Philosophy
Treat the Techniques page as the best BJJ video library ever made. Focus on content quality, discoverability, and curation. Don't try to be a curriculum - just be an incredible reference.

### Key Changes
1. **Fix content gating** - Lock advanced content behind belt levels with clear "unlocks at Blue Belt" messaging
2. **Add difficulty badges** - Every technique and video gets a 1-10 difficulty rating visible on cards
3. **Make instructors browsable** - Tap instructor name to see all their videos in one feed
4. **Add bookmarks** - Save videos/techniques for quick access later
5. **Track watch history** - Show "Watched" badges, partially watched progress bars
6. **Enhance search** - Thumbnails, instructor names, highlighted matches
7. **Show related content** - "If you liked this, also watch..." connections

### Effort: Medium (2-3 weeks of prototype work)

### Pros
- Relatively straightforward to implement
- Leverages existing architecture
- Doesn't require new data models
- Users immediately understand the value
- Scales well with more video content

### Cons
- Doesn't differentiate from YouTube itself (users could just search YouTube)
- Passive consumption - watching videos doesn't connect to training behavior
- No personalization beyond belt level
- Doesn't leverage TOMO's unique data (your journal entries, your struggles)

### Who This Serves Best
Casual users who open the app between sessions to watch technique videos. Users who treat TOMO primarily as a curated video player.

### Risk
If the video library isn't significantly better than YouTube search, users have no reason to use it inside TOMO. The curation and belt-filtering need to be genuinely valuable.

---

## Strategy B: "The Personal Curriculum"

### Philosophy
Transform the Techniques page from a passive library into an active learning path. Based on your belt, session history, and stated goals, TOMO builds you a personalized curriculum with clear progression.

### Key Changes
1. **Replace "For You" with "Your Curriculum"** - Instead of random recommendations, show a structured learning path:
   - "This Week's Focus: Closed Guard Escapes" (based on your recent struggles)
   - "3 of 5 techniques practiced" progress bar
   - Weekly rotation based on what the algorithm sees in your journal
2. **Technique Progression Chains** - Show techniques in learning order:
   - "Before you learn Berimbolo, master: DLR Hook → DLR Sweep → Inversion Drill"
   - Visual chain/tree showing prerequisites
3. **Belt Milestone Checklist** - "Core techniques for your belt level"
   - White belt: 25 fundamental techniques (show completion %)
   - Blue belt: 40 intermediate techniques
   - Visual progress toward "belt completeness"
4. **Weekly Assignments** - AI-generated practice suggestions based on journal analysis:
   - "You mentioned struggling with guard retention 3 times this month. This week: focus on framing and hip movement."
   - 3 videos assigned per week, personalized
5. **Content gating as progression** - Instead of hard locks, show techniques as "locked" until prerequisites are met (by logging practice in earlier techniques)

### Effort: High (4-6 weeks, requires new data models and algorithm work)

### Pros
- Deeply personalized - no other BJJ app does this
- Creates a reason to come back daily (check your curriculum)
- Connects studying to doing (journal mentions unlock new content)
- Gamification-adjacent without being gamified (progression, not points)
- Strong differentiation from YouTube
- Generates high engagement metrics

### Cons
- Complex to implement correctly
- Risk of feeling prescriptive ("don't tell me what to learn")
- Requires sufficient video coverage to fill curriculum paths
- Algorithm needs tuning to avoid feeling generic
- Could conflict with what a user's coach is teaching
- The coach deferral principle makes this tricky - we're essentially becoming a curriculum planner

### Who This Serves Best
Disciplined practitioners who want structured improvement. Users who don't have a clear curriculum at their gym. Self-directed learners.

### Risk
**HIGH - Coach conflict.** If TOMO says "learn X this week" and the coach says "we're working on Y," the user is caught in the middle. Our First Principles say we NEVER contradict the coach. This strategy requires very careful framing: "Suggestions based on your journal - always follow your coach's guidance."

---

## Strategy C: "The Practice Tracker"

### Philosophy
Shift the Techniques page from consumption (watching videos) to action (tracking what you actually practice). Make it a training log for techniques, separate from session logging.

### Key Changes
1. **Flip the hierarchy** - Lead with YOUR techniques, not the video library:
   - "Your Techniques" section at top showing techniques you've practiced
   - Sorted by recency, with proficiency indicators
   - "48 techniques practiced" hero metric
2. **Quick-log practice** - One-tap "I drilled this today" from any technique card
   - Don't require a full session log
   - Can log practice of specific techniques independently
   - Builds a practice history timeline for each technique
3. **Proficiency auto-advancement** - Based on practice frequency:
   - 1-5 practices: Learning
   - 6-15 practices: Developing
   - 16-30 practices: Proficient
   - 31+: Advanced
   - Auto-updates, no manual selection needed
4. **Technique heatmap** - Visual showing which positions you practice most/least
   - Identifies blind spots: "You haven't practiced any takedowns in 3 months"
   - Connects to Dashboard's Style Fingerprint
5. **Practice streaks per technique** - "You've practiced armbar 3 sessions in a row"
   - Micro-celebration for deliberate practice
6. **Video library becomes secondary** - Available via "Watch Tutorial" button on each technique, but not the primary view

### Effort: Medium-High (3-4 weeks, builds on existing Log Practice + Practice Tracking)

### Pros
- Leverages existing Log Practice infrastructure (already persists to localStorage)
- Creates unique data that no other app has
- Drives behavior change (encouraging deliberate practice)
- Strong cross-feature synergy (practice data feeds Dashboard, Insights)
- The data becomes incredibly valuable for the Coach Share feature later
- Aligns with research: deliberate practice predicts expertise (Ericsson, 1993)

### Cons
- Video library becomes less prominent (which is our current main value)
- Requires users to actively log practices (friction)
- Proficiency auto-advancement could feel inaccurate
- "48 techniques" metric could feel meaningless early on
- Less passive/browse-friendly - requires active engagement

### Who This Serves Best
Dedicated practitioners who already do deliberate practice. Users who want to track their technical development over time. Competition-focused athletes.

### Risk
If users don't consistently log practices, the technique data is sparse and the page feels empty. Need strong empty states and gentle onboarding into the practice tracking habit.

---

## Strategy D: "The Hybrid" (Recommended)

### Philosophy
Combine the best elements of all three strategies into a layered experience that serves different user intents. Use the existing For You / Browse structure but enhance each layer significantly.

### Key Changes

#### Layer 1: "For You" Tab (Active Learning)
**Keep the existing structure but make it smarter and more actionable.**

- **Hero Section: "This Week's Focus"**
  - AI-generated based on journal analysis (last 10 sessions)
  - Shows 1 focus area with 2-3 recommended videos
  - "You mentioned guard retention in 3 of your last 5 sessions"
  - Rotates weekly, never repeats the same focus two weeks in a row
  - Coach deferral: "Based on your journal - always follow your coach's lead"

- **Your Recent Techniques (NEW)**
  - Horizontal scroll of techniques you've recently practiced or mentioned in journal
  - Each card shows: technique name, proficiency dot, "Last practiced: 3 days ago"
  - Tapping opens technique detail with videos
  - If empty: "Log your first session to see personalized technique suggestions"

- **Level Up Videos (existing, enhanced)**
  - Add "Watched" badges to videos you've seen
  - Add bookmark icon to save for later

- **Saved Techniques (NEW)**
  - If user has bookmarked any techniques, show them here
  - Quick access to their study list

- **Support Section (existing, keep for at-risk personas)**

#### Layer 2: "Browse" Tab (Discovery)
**Keep the library structure but add interactivity and gating.**

- **Difficulty Filter Bar (NEW)**
  - Horizontal pills at top: "All" | "Fundamentals" | "Intermediate" | "Advanced"
  - Filters the position grid below
  - Badge on each position card showing difficulty range

- **Belt Suggestions (existing, keep)**

- **Position Grid (existing, enhanced)**
  - Add technique count badges: "Closed Guard (12)"
  - Add subtle lock icon overlay on gated categories
  - Tapping locked category shows bottom sheet: "Leg Locks are available at Blue Belt and above"
  - Add "New" badge on categories with recently added videos

- **Mindset Categories (existing, keep)**

- **Featured Instructors (enhanced)**
  - Make tappable - opens filtered view of that instructor's videos
  - Add small instructor avatar/icon

#### Layer 3: Technique Detail (Learning + Tracking)
**Enhance the detail view to be both educational and trackable.**

- **Video Section (existing, enhanced)**
  - Add "Watched" indicator
  - Add bookmark icon
  - Show watch progress for partially viewed videos

- **Your Progress (existing, enhanced)**
  - Make proficiency tappable (4 chips: Learning / Developing / Proficient / Advanced)
  - Show practice count with history: "Drilled 12x (last: 2 days ago)"
  - Auto-suggest proficiency based on practice count (but user can override)

- **Related Techniques (NEW)**
  - Horizontal scroll below the video
  - Shows 3-5 related techniques from the `relatedTechniques` field
  - Each card: name, position, belt dot, proficiency dot

- **Key Points + Common Mistakes (existing, keep)**

#### Layer 4: Search (existing, enhanced)
- Add video thumbnails to results
- Highlight matched text in gold
- Show instructor name in technique results
- Add "Instructors" section to search results
- Recent searches (last 5)

### Implementation Priority

| Phase | Feature | Effort | Impact |
|-------|---------|--------|--------|
| **Phase 1** (1 week) | Content gating + lock overlays | Low | High - prevents overwhelming new users |
| **Phase 1** (1 week) | Proficiency chips (tappable) | Low | Medium - users can track progress |
| **Phase 1** (1 week) | Related techniques section | Low | Medium - enables exploration |
| **Phase 2** (1 week) | Bookmarking system | Medium | Medium - users save study material |
| **Phase 2** (1 week) | Enhanced search (thumbnails + highlights) | Medium | Medium - better discoverability |
| **Phase 2** (1 week) | Featured instructors tap-to-filter | Low | Low-Medium - adds depth |
| **Phase 3** (2 weeks) | "This Week's Focus" hero (journal analysis) | High | High - core personalization |
| **Phase 3** (1 week) | "Your Recent Techniques" section | Medium | Medium - bridges journal to library |
| **Phase 3** (1 week) | Video watch tracking | Medium | Low-Medium - completeness |
| **Phase 4** (1 week) | Difficulty filter bar | Medium | Medium - belt-appropriate content |

### Total Effort: ~10-12 weeks if done sequentially, ~6-8 weeks with parallel work

### Pros
- Serves all three user intents (guided, searching, browsing)
- Incremental - each phase adds value independently
- Doesn't require massive architecture changes
- Maintains the browse/discovery feel while adding smart personalization
- Content gating in Phase 1 is the highest-value, lowest-effort win
- Respects coach deferral principle throughout
- Each enhancement can be A/B tested independently

### Cons
- Could feel like "feature soup" if not carefully designed
- Phase 3 requires journal analysis algorithm (complex)
- 10-12 weeks is significant time investment
- Risk of scope creep (each feature could grow)

---

## Competitive Comparison

How does each strategy compare to existing BJJ apps?

| Feature | YouTube | BJJ Notes | Marune | TOMO (Current) | Strategy A | Strategy B | Strategy C | Strategy D |
|---------|---------|-----------|--------|-----------------|------------|------------|------------|------------|
| Video library | Best | None | Some | Good | Great | Good | Fair | Great |
| Personalization | Algorithmic | None | None | Belt-based | Belt-based | Deep | Practice-based | Layered |
| Practice tracking | None | Manual | Manual | Basic | None | Implicit | Core | Enhanced |
| Curriculum/Path | None | None | None | None | None | Core | None | Light |
| Coach deferral | N/A | N/A | N/A | Yes | Yes | Risky | Yes | Yes |
| Differentiation | N/A | Low | Low | Medium | Low | High | High | High |

---

## Recommendation

**Strategy D (The Hybrid)** is the recommended approach for these reasons:

1. **Incremental delivery** - Phase 1 features (content gating, proficiency chips, related techniques) can ship in 1-2 weeks and deliver immediate value
2. **No architecture risk** - Builds on existing data models and components
3. **Respects the coach** - Never prescribes curriculum, only suggests based on the user's own journal data
4. **Covers all user intents** - Browsers, searchers, and guided learners all benefit
5. **Unique market position** - The "This Week's Focus" feature (Phase 3) uses journal data in a way no competitor can match
6. **Data flywheel** - More practice logs = better recommendations = more engagement = more data

### Start with Phase 1
The highest-ROI move right now is **content gating**. It's low effort, high impact, and solves a real UX problem (white belts seeing advanced content they shouldn't attempt). Combined with proficiency chips and related techniques, Phase 1 transforms the Techniques page from a flat catalog into an adaptive learning tool.

---

## Appendix: "This Week's Focus" Algorithm (Phase 3)

```
1. Pull last 10 journal entries
2. Extract:
   - Techniques mentioned (all, by frequency)
   - Struggles mentioned (keyword analysis)
   - Positions mentioned (closed guard, mount, etc.)
   - Energy levels (average)
3. Identify patterns:
   - Recurring struggle → suggest technique to address it
   - Technique mentioned 3+ times → suggest progression/variation
   - Position gap → suggest exploration of underused position
   - Low energy pattern → suggest lighter/conceptual content
4. Select 1 focus area (rotate weekly, don't repeat within 4 weeks)
5. Match 2-3 videos from library to focus area
6. Generate one-line context: "You mentioned [X] in 3 of your last 5 sessions"
7. Always append: "Based on your journal - always follow your coach's lead"
```

---

## Appendix: Content Gating Rules

| Category | White | Blue | Purple | Brown | Black |
|----------|-------|------|--------|-------|-------|
| Closed Guard | Full | Full | Full | Full | Full |
| Half Guard | Full | Full | Full | Full | Full |
| Open Guard | Basic only | Full | Full | Full | Full |
| Mount | Full | Full | Full | Full | Full |
| Side Control | Full | Full | Full | Full | Full |
| Back Control | Full | Full | Full | Full | Full |
| Guard Passing | Basic only | Full | Full | Full | Full |
| Takedowns | Basic only | Full | Full | Full | Full |
| Turtle | Full | Full | Full | Full | Full |
| Clinch | Full | Full | Full | Full | Full |
| Submissions | No leg locks | Basic legs | Full | Full | Full |
| Leg Entanglements | Locked | Basic | Full | Full | Full |
| Advanced Systems | Locked | Locked | Full | Full | Full |

**"Locked" behavior:** Category card shows lock icon. Tapping opens bottom sheet explaining when it unlocks. Videos are hidden. Technique names still visible (so users know what exists).

**"Basic only" behavior:** Shows beginner techniques (difficulty 1-3). Advanced techniques within the category are locked with "Unlocks with more experience" message.

---

## Appendix: Bookmarking System Design

### Data Model
```typescript
interface Bookmark {
  id: string;
  user_id: string;
  item_type: 'technique' | 'video';
  item_id: string;          // technique_id or youtube_id
  created_at: string;       // ISO timestamp
}
```

### Storage
- Prototype: localStorage key `bjj-bookmarks`
- Production: Supabase `bookmarks` table

### UI Placement
- Bookmark icon (outline) on technique cards in Position Detail
- Bookmark icon (outline) on video cards in For You and Technique Detail
- Filled icon when bookmarked
- "Saved" section in For You tab (only shows if user has bookmarks)
- "Saved (X)" count in tab if bookmarks exist

### Interaction
- Tap bookmark icon → instant save, subtle toast "Saved"
- Tap again → remove, subtle toast "Removed"
- No confirmation dialogs (low-stakes action)

---

*This document should be reviewed alongside the design mockups in `/docs/design-reviews/techniques-enhancements.html`*
