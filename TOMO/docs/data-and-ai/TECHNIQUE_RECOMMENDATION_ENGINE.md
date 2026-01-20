# Technique Recommendation Engine

> **Purpose:** Define how journal entry data drives personalized video recommendations on the Techniques page. This specification enables developers to implement an AI-powered recommendation system that surfaces relevant content based on each user's training history, struggles, and belt level.

**Status:** Active
**Last Updated:** January 2025
**Related Documents:**
- `JOURNAL_DATA_CAPTURE_STRATEGY.md` - How we collect the input data
- `VOICE_LOGGING_CONVERSATION_DESIGN.md` - Voice-to-structured data flow
- `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` - Belt-level adaptations
- `/prototype/src/data/techniqueVideos.ts` - Current video library

---

## Executive Summary

The Technique Recommendation Engine transforms raw journal data into personalized video recommendations. Unlike static content libraries, our system learns from each user's training patterns, struggles, and progression to surface the most relevant instructional content.

**Core Principle:** Show users what they need, not what's popular.

**Primary Input:** Structured data extracted from voice journal entries
**Primary Output:** Ranked list of video recommendations with personalized context

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RECOMMENDATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   JOURNAL ENTRY                    USER PROFILE                             │
│   ─────────────                    ────────────                             │
│   • techniques_drilled[]           • belt_level                             │
│   • struggles[]                    • training_history[]                     │
│   • submissions_received[]         • technique_progress[]                   │
│   • submissions_given[]            • injury_status[]                        │
│   • positions_mentioned[]          • training_goals[]                       │
│   • energy_level                   • gi/nogi_preference                     │
│           │                                │                                │
│           └──────────────┬─────────────────┘                                │
│                          ▼                                                  │
│              ┌─────────────────────┐                                        │
│              │   SIGNAL EXTRACTOR  │                                        │
│              │   (AI Processing)   │                                        │
│              └──────────┬──────────┘                                        │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │   RECOMMENDATION    │                                        │
│              │   SCORING ENGINE    │◄──── VIDEO LIBRARY                     │
│              └──────────┬──────────┘      (metadata + tags)                 │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │   DIVERSITY &       │                                        │
│              │   FRESHNESS FILTER  │                                        │
│              └──────────┬──────────┘                                        │
│                         ▼                                                   │
│              ┌─────────────────────┐                                        │
│              │   OUTPUT:           │                                        │
│              │   • Hero Video      │                                        │
│              │   • Level Up (4-6)  │                                        │
│              │   • Support (0-3)   │                                        │
│              └─────────────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Input Signals

### 1.1 Primary Signals (from Journal Entries)

These signals are extracted from the user's recent journal entries (last 30 days weighted, all-time considered).

| Signal | Source Field | Weight | Recommendation Impact |
|--------|--------------|--------|----------------------|
| **Recent Struggles** | `struggles[]` | 1.0x | Surface instructional videos addressing the specific struggle |
| **Submissions Received** | `submissions_received[]` | 0.9x | Surface defense/escape videos for techniques user gets caught with |
| **Techniques Practiced** | `techniques_drilled[]` | 0.7x | Surface variations and follow-ups (not basics they already know) |
| **Submissions Given** | `submissions_given[]` | 0.5x | Surface advanced setups and combinations to deepen strength |
| **Positions Mentioned** | Extracted from transcript | 0.6x | Surface position-specific content matching training focus |

### 1.2 Secondary Signals (from User Profile)

| Signal | Source | Impact |
|--------|--------|--------|
| **Belt Level** | `profiles.belt_level` | Hard filter - only show belt-appropriate content |
| **Training Type** | `profiles.gi_nogi_preference` | Prefer matching gi/nogi content |
| **Training Goals** | `profiles.training_goals[]` | Boost competition content for competitors |
| **Time at Belt** | `profiles.current_belt_date` | Early-belt vs late-belt content selection |
| **Active Injuries** | `injuries.status = 'active'` | Filter out content requiring injured body parts |

### 1.3 Temporal Signals (Decay and Freshness)

| Signal | Calculation | Impact |
|--------|-------------|--------|
| **Recency Decay** | Days since struggle mentioned | Recent struggles weighted higher (decay: 0.9^days) |
| **Repetition Boost** | Times struggle mentioned in 30 days | Repeated struggles get priority |
| **Technique Staleness** | Days since last practiced | Flag techniques not practiced in 30+ days |
| **Video Freshness** | Has user seen this video? | Deprioritize previously watched videos |

---

## Part 2: Signal Extraction

### 2.1 Struggle Pattern Detection

When processing journal entries, extract and categorize struggles into actionable recommendation triggers.

**Struggle Categories:**

| Category | Example Phrases | Recommendation Action |
|----------|-----------------|----------------------|
| **Position Loss** | "kept getting passed", "couldn't maintain mount" | Surface retention/maintenance videos |
| **Escape Failure** | "stuck in side control", "couldn't escape mount" | Surface escape instructionals |
| **Submission Defense** | "got triangled", "caught in armbar" | Surface specific submission defense |
| **Timing Issues** | "too slow", "missed the sweep" | Surface drilling/timing concepts |
| **Strength Imbalance** | "got muscled", "overpowered" | Surface technique-over-strength concepts |
| **Cardio/Fatigue** | "gassed out", "tired in third round" | Surface conditioning/pacing content |

### 2.2 Technique Mention Extraction

Map mentioned techniques to the canonical technique library for accurate matching.

**Technique Normalization Examples:**

| User Says | Canonical Technique | Position Category |
|-----------|--------------------|--------------------|
| "knee slice", "knee cut" | `knee_slice_pass` | guard_passing |
| "triangle", "triangle choke" | `triangle_choke` | submissions |
| "RNC", "rear naked" | `rear_naked_choke` | back_control |
| "DLR", "de la riva" | `de_la_riva_guard` | open_guard |
| "scissor sweep" | `scissor_sweep` | closed_guard |

**AI Extraction Prompt (for technique normalization):**

```
Given this journal transcript, extract all BJJ techniques mentioned and map them
to canonical technique IDs from our library.

Return JSON array:
[
  {
    "mentioned": "knee cut pass",
    "canonical_id": "knee_slice_pass",
    "context": "drilled" | "used_live" | "struggled_against" | "got_caught_by"
  }
]

If a technique is not in our library, return canonical_id: null and we'll flag
for manual review.

Transcript:
{transcript}

Technique Library:
{technique_list}
```

---

## Part 3: Scoring Algorithm

### 3.1 Base Score Calculation

Each video in the library receives a relevance score for the current user.

```
BASE_SCORE =
    (struggle_match_score × 1.0) +
    (defense_need_score × 0.9) +
    (position_relevance_score × 0.6) +
    (technique_depth_score × 0.5) +
    (belt_appropriateness × 1.0) +    // Binary: 0 or 1
    (gi_nogi_match × 0.3)
```

### 3.2 Struggle Match Scoring

```python
def calculate_struggle_match_score(video, user_struggles):
    score = 0

    for struggle in user_struggles:
        # Check if video addresses this struggle
        if video.addresses_struggle(struggle.category):
            # Weight by recency (decay over 30 days)
            days_ago = (today - struggle.date).days
            recency_weight = 0.9 ** min(days_ago, 30)

            # Weight by frequency
            frequency_weight = min(struggle.mention_count / 3, 1.5)

            score += recency_weight * frequency_weight

    return min(score, 3.0)  # Cap at 3.0
```

### 3.3 Defense Need Scoring

```python
def calculate_defense_need_score(video, submissions_received):
    score = 0

    for sub in submissions_received:
        if video.teaches_defense_for(sub.technique):
            # Count how many times user got caught
            catch_count = sub.count_last_30_days

            # More catches = higher priority
            score += min(catch_count * 0.5, 2.0)

    return score
```

### 3.4 Belt Appropriateness (Hard Filter)

```python
def is_belt_appropriate(video, user_belt):
    belt_order = ['white', 'blue', 'purple', 'brown', 'black']
    user_index = belt_order.index(user_belt)

    # Video has min/max belt level
    min_index = belt_order.index(video.belt_level_min)
    max_index = belt_order.index(video.belt_level_max)

    return min_index <= user_index <= max_index
```

### 3.5 Temporal Adjustments

```python
def apply_temporal_adjustments(base_score, video, user):
    adjusted = base_score

    # Penalize recently watched videos
    if user.has_watched(video.id):
        days_since_watch = (today - user.last_watched(video.id)).days
        if days_since_watch < 7:
            adjusted *= 0.3  # Heavy penalty for recent watches
        elif days_since_watch < 30:
            adjusted *= 0.7  # Moderate penalty

    # Boost videos for stale techniques (not practiced in 30+ days)
    if video.technique in user.stale_techniques:
        adjusted *= 1.3

    return adjusted
```

---

## Part 4: Recommendation Output Structure

### 4.1 Output Categories

| Category | Count | Selection Criteria |
|----------|-------|-------------------|
| **Hero Video** | 1 | Highest scoring video addressing primary struggle |
| **Level Up** | 4-6 | Next highest scoring videos, diversity enforced |
| **Support** | 0-3 | For at-risk users only; psychological/motivational content |

### 4.2 Hero Video Selection

The hero video is the single most relevant recommendation. Selection criteria:

1. Must score > 2.0 on relevance scale
2. Must address user's #1 struggle (if identifiable)
3. Must be from priority instructor list (Danaher, Gordon, Lachlan, Craig, Gasperin)
4. If no high-scoring video, fall back to belt-appropriate fundamentals

**Hero Video Output Structure:**

```typescript
interface HeroVideoRecommendation {
  video: TechniqueVideo;
  headline: string;           // "Your Guard Needs This"
  oneLiner: string;           // Personalized hook based on user data
  personalizedReason: string; // Why this video matters for THIS user
  category: 'technique' | 'mindset' | 'lifestyle';
  triggerSignal: string;      // Which journal data triggered this
}
```

### 4.3 Level Up Videos Selection

Level Up videos provide breadth of recommendations. Selection rules:

1. Top 6 scoring videos (after hero) with diversity filter applied
2. Maximum 2 videos per position category
3. Maximum 2 videos per instructor
4. At least 1 video addressing a different struggle than hero

### 4.4 Support Videos (At-Risk Users Only)

For users showing dropout risk signals, include psychological support content.

**Trigger conditions:**
- 7+ days since last training session
- Declining session frequency (3+ weeks trending down)
- Negative sentiment detected in recent entries
- Explicit frustration language ("thinking about quitting", "not sure anymore")

**Support video categories:**
- Belt journey psychology
- Plateau navigation
- Injury recovery mindset
- Motivation and consistency

---

## Part 5: Personalization Copy Generation

### 5.1 AI Prompt for Personalized Headlines

Generate personalized copy that speaks directly to the user's situation.

**Prompt Template:**

```
You are generating personalized video recommendation copy for a BJJ training app.

USER CONTEXT:
- Belt: {belt_level}
- Recent struggles: {struggles_list}
- Submissions received often: {submissions_received}
- Current training focus: {current_focus}
- Days since last training: {days_gap}

VIDEO BEING RECOMMENDED:
- Title: {video_title}
- Instructor: {video_instructor}
- Teaches: {video_topic}
- Position: {video_position}

TRIGGER REASON:
This video is being recommended because: {trigger_reason}

Generate three pieces of copy:

1. HEADLINE (3-5 words, punchy, action-oriented)
   Examples: "Your Guard Needs This", "Stop Getting Triangled", "Escape the Crush"

2. ONE-LINER (10-15 words, speaks to their specific situation)
   Examples: "You've mentioned half guard struggles 3 times. This is the fix."

3. PERSONALIZED_REASON (1-2 sentences, explains the "why" with empathy)
   Examples: "You're getting caught in triangles from closed guard. This defense
   uses frames you already know from side control escapes."

VOICE GUIDELINES:
- Confident, not arrogant
- Conversational, not formal
- Specific, not vague (reference their actual data)
- Grounded, not hype ("This will help" not "This will transform your game!")
- No emojis
- No gamification language ("unlock", "level up", "achieve")

Output JSON:
{
  "headline": "...",
  "oneLiner": "...",
  "personalizedReason": "..."
}
```

### 5.2 Fallback Copy Patterns

When AI generation fails or for MVP implementation, use these templates:

**For Struggle-Based Recommendations:**
```
Headline: "Fix Your {position}"
One-liner: "You've mentioned {struggle} {count} times recently. Start here."
Reason: "{instructor} breaks down {topic} in a way that addresses exactly what you're describing."
```

**For Defense Recommendations:**
```
Headline: "Stop Getting {submission}"
One-liner: "{submission} keeps catching you. This is the escape that works."
Reason: "You've been caught in {submission} {count} times this month. This defense uses timing, not strength."
```

**For Technique Deepening:**
```
Headline: "Level Up Your {technique}"
One-liner: "You're drilling {technique}. Here's the next layer."
Reason: "You've logged {technique} {count} times. This video adds the details that make it work against resisting opponents."
```

---

## Part 6: Diversity and Freshness Rules

### 6.1 Diversity Constraints

To prevent repetitive recommendations:

| Rule | Constraint |
|------|------------|
| **Position Diversity** | Max 2 videos per position category per recommendation set |
| **Instructor Diversity** | Max 2 videos per instructor per set |
| **Category Balance** | At least 1 defense + 1 offense video in Level Up |
| **Content Type Mix** | Mix instructional, conceptual, and troubleshooting videos |

### 6.2 Freshness Rules

| Rule | Implementation |
|------|----------------|
| **Watch History** | Track video views per user; penalize recently watched |
| **Recommendation History** | Track what was recommended; rotate after 3 consecutive shows |
| **New Content Boost** | Videos added in last 30 days get 1.2x boost |
| **Seasonal Relevance** | Boost competition content before typical competition seasons |

### 6.3 Content Rotation Schedule

```
Daily: Hero video can change based on new journal entry
Weekly: Level Up videos rotate to show variety
Monthly: Full recommendation refresh if no new journal data
Quarterly: New content added to library triggers re-scoring
```

---

## Part 7: Edge Cases and Fallbacks

### 7.1 New User (No Journal Data)

**Fallback Strategy:**
1. Use belt-level defaults from `BELT_PERSONALIZATION_SYSTEM.md`
2. Show "Getting Started at {belt}" curriculum videos
3. After 3 sessions, begin personalization

**Default Recommendations by Belt:**

| Belt | Hero Video Topic | Level Up Focus |
|------|------------------|----------------|
| White | Survival fundamentals | Escapes, basic positions, guard retention |
| Blue | Game development | Half guard, open guard, passing systems |
| Purple | Systems thinking | Leg locks, advanced guards, combinations |
| Brown | Refinement | Detail work, efficiency, teaching concepts |

### 7.2 Sparse Journal Data

If user journals but provides minimal detail:

1. Weight position mentions heavily (even vague ones)
2. Use class type as signal (fundamentals class → basics content)
3. Ask progressive profiling question: "What are you working on?"

### 7.3 No Matching Videos

If no videos score above threshold for a detected struggle:

1. Log the gap for content team review
2. Show closest match with caveat: "We're adding more {topic} content soon"
3. Fall back to belt-appropriate fundamentals

### 7.4 Conflicting Signals

If user shows struggles in multiple areas:

1. Prioritize by recency (most recent struggle wins hero spot)
2. Distribute others across Level Up
3. If 5+ distinct struggles, recommend "foundations" content

---

## Part 8: Implementation Notes

### 8.1 MVP Implementation (Phase 1)

For initial iOS release, implement a simplified version:

```
MVP Scope:
├── Belt-level filtering (required)
├── Simple struggle-to-video mapping (lookup table)
├── Static personalized copy templates (not AI-generated)
├── Basic watch history tracking
└── Manual video curation (not algorithmic scoring)
```

**MVP Data Model:**

```typescript
// Simple mapping table
const struggleToVideoMap: Record<string, string[]> = {
  'guard_passed': ['GP_001', 'GP_002', 'OG_019'],
  'triangled': ['CG_008', 'SM_TRI_001'],
  'side_control_escape': ['SC_001', 'SC_016'],
  // ... etc
};
```

### 8.2 Full Implementation (Phase 2)

After MVP validation, implement full scoring engine:

```
Full Implementation:
├── AI-powered signal extraction
├── Real-time scoring algorithm
├── AI-generated personalized copy
├── A/B testing framework for recommendations
├── Feedback loop (did user watch? did they struggle less?)
└── Content gap detection for editorial team
```

### 8.3 Required Video Metadata

For the algorithm to work, each video needs:

```typescript
interface TechniqueVideo {
  // Existing fields
  technique_id: string;
  youtube_id: string;
  title: string;
  instructor: string;
  duration_seconds: number;
  position_category: PositionCategory;

  // Required new fields for recommendation engine
  belt_level_min: BeltLevel;        // 'white' | 'blue' | etc.
  belt_level_max: BeltLevel;
  difficulty_score: number;          // 1-10
  gi_nogi: 'gi' | 'nogi' | 'both';
  content_type: 'instructional' | 'conceptual' | 'troubleshooting' | 'drill';

  // For matching
  addresses_struggles: string[];     // ['guard_passed', 'sweep_defense']
  teaches_defense_for: string[];     // ['triangle', 'armbar']
  teaches_technique: string;         // canonical technique ID
  prerequisites: string[];           // technique IDs user should know first
  related_techniques: string[];      // for "watch next"

  // For diversity
  tags: string[];                    // ['fundamentals', 'competition', 'no-gi']
}
```

### 8.4 Analytics Events

Track these events to improve recommendations:

| Event | Data | Purpose |
|-------|------|---------|
| `video_recommended` | video_id, trigger_signal, position | Track what we recommend |
| `video_clicked` | video_id, position_in_list | Measure engagement |
| `video_watched` | video_id, watch_percentage | Completion rates |
| `struggle_mentioned_again` | struggle_type, days_since_video | Did video help? |

---

## Part 9: Content Library Requirements

### 9.1 Minimum Video Coverage

For the recommendation engine to function, maintain minimum coverage:

| Position Category | Min Videos | Belt Coverage |
|-------------------|------------|---------------|
| Closed Guard | 15 | White through Brown |
| Half Guard | 15 | Blue through Brown |
| Open Guard | 20 | Blue through Brown |
| Guard Passing | 20 | White through Brown |
| Mount | 10 | White through Purple |
| Side Control | 15 | White through Brown |
| Back Control | 10 | White through Purple |
| Takedowns | 10 | White through Brown |
| Submissions | 25 | By submission type |
| Mindset | 15 | Belt-specific psychology |

### 9.2 Quarterly Content Update Process

```
Quarterly Content Review:
├── Week 1: Analytics review - which struggles have no matching videos?
├── Week 2: Content gap prioritization
├── Week 3: Video curation from approved instructors
├── Week 4: Metadata tagging and QA
└── Release: Deploy new videos with recommendation engine update
```

### 9.3 Instructor Priority

Videos from these instructors receive quality boost:

| Tier | Instructors | Quality Multiplier |
|------|-------------|-------------------|
| 1 | John Danaher, Gordon Ryan, Lachlan Giles | 1.3x |
| 2 | Craig Jones, Gustavo Gasperin, Keenan Cornelius | 1.2x |
| 3 | Other verified black belts | 1.0x |

---

## Part 10: Success Metrics

### 10.1 Recommendation Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Click-through rate | > 40% | Clicked hero / sessions with recommendations |
| Watch completion | > 60% | Watched > 75% of video / clicks |
| Struggle resolution | > 30% | Struggle not mentioned for 14+ days after video |
| User satisfaction | > 4.2/5 | Periodic survey on recommendation relevance |

### 10.2 System Health Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Coverage rate | > 85% | < 70% of struggles have matching video |
| Diversity score | > 0.7 | Same video recommended > 3 sessions in row |
| Freshness score | > 0.6 | > 50% of recommendations are > 30 days watched |

---

## Appendix A: Example Recommendation Scenarios

### Scenario 1: White Belt, Early Stage

**User Profile:**
- Belt: White (3 months)
- Recent struggles: "getting stuck in side control", "can't escape mount"
- Submissions received: Americana (2x), Kimura (1x)

**Recommendation Output:**

```json
{
  "heroVideo": {
    "video_id": "SC_001",
    "headline": "Escape the Crush",
    "oneLiner": "Side control struggles came up twice this week. Start with frames.",
    "personalizedReason": "You mentioned getting stuck in side control. This escape uses frames and hip movement - the fundamental concepts that open up everything else."
  },
  "levelUpVideos": [
    {
      "video_id": "MT_ESC_001",
      "headline": "Mount Survival",
      "oneLiner": "Mount escapes use the same frames you'll learn for side control."
    },
    {
      "video_id": "SM_AME_DEF_001",
      "headline": "Stop the Americana",
      "oneLiner": "You've been caught twice. Here's the defense."
    },
    {
      "video_id": "CG_001",
      "headline": "Build Your Safe Space",
      "oneLiner": "Closed guard is where you recover. Learn to love the bottom."
    }
  ]
}
```

### Scenario 2: Blue Belt, Working on Guard

**User Profile:**
- Belt: Blue (18 months)
- Recent focus: "working on half guard", "drilling knee shield"
- Struggles: "getting passed from butterfly"
- Submissions received: Heel hook (1x)

**Recommendation Output:**

```json
{
  "heroVideo": {
    "video_id": "HG_016",
    "headline": "Half Guard Masterclass",
    "oneLiner": "You're building half guard. Here's the system that ties it together.",
    "personalizedReason": "Half guard has been your focus. Lachlan's system connects knee shield to underhook recovery to back takes - the complete picture."
  },
  "levelUpVideos": [
    {
      "video_id": "OG_BF_001",
      "headline": "Stop Getting Passed",
      "oneLiner": "Butterfly guard retention - your passing problem solved."
    },
    {
      "video_id": "SM_028",
      "headline": "Heel Hook Defense",
      "oneLiner": "You got caught once. Don't let it happen again."
    },
    {
      "video_id": "HG_SW_001",
      "headline": "Sweep from Knee Shield",
      "oneLiner": "Your knee shield drilling pays off when you add this sweep."
    }
  ]
}
```

### Scenario 3: Blue Belt, At Risk (21 days since training)

**User Profile:**
- Belt: Blue (2 years)
- Days since training: 21
- Last entry sentiment: Negative ("frustrated", "teammates getting promoted")
- Risk signals: Declining frequency, explicit frustration

**Recommendation Output:**

```json
{
  "heroVideo": {
    "video_id": "BJ_004",
    "headline": "When Everything Falls Apart",
    "oneLiner": "21 days away. Jocko's answer: GOOD. Now what?",
    "personalizedReason": "Time off happens. This 3-minute clip has brought people back from darker places. The mat will be there when you're ready."
  },
  "levelUpVideos": [
    {
      "video_id": "BJ_003",
      "headline": "The Plateau is Real",
      "oneLiner": "Blue belt is where most quit. This is about showing up anyway."
    },
    {
      "video_id": "HG_KS_001",
      "headline": "Something Familiar",
      "oneLiner": "Knee shield passing. Satisfying, fundamental, ready when you return."
    }
  ],
  "supportVideos": [
    {
      "video_id": "LB_005",
      "headline": "One Session at a Time",
      "oneLiner": "Forget 4x a week. Can you do one? Start there."
    },
    {
      "video_id": "MG_002",
      "headline": "Everyone's Timeline is Different",
      "oneLiner": "Including yours. Comparison is theft."
    }
  ]
}
```

---

## Appendix B: Struggle Category Taxonomy

Complete mapping of struggle language to recommendation categories:

| Struggle Category | Trigger Phrases | Video Categories to Surface |
|-------------------|-----------------|----------------------------|
| `guard_passed` | "got passed", "couldn't retain", "guard got smashed" | Guard retention, open guard, half guard recovery |
| `sweep_defense` | "got swept", "couldn't base", "lost balance" | Base and posture, sweep counters, pressure passing |
| `submission_defense_choke` | "got choked", "couldn't breathe", "neck crank" | Choke defense, posture, hand fighting |
| `submission_defense_arm` | "got armbarred", "americana", "kimura" | Arm defense, elbow discipline, grip breaks |
| `submission_defense_leg` | "heel hook", "knee bar", "leg lock" | Leg lock defense, boot position, escapes |
| `mount_escape` | "stuck in mount", "couldn't escape mount" | Mount escapes, elbow-knee, trap and roll |
| `side_control_escape` | "stuck in side", "couldn't get out" | Side control escapes, frames, reguarding |
| `back_escape` | "gave up back", "couldn't escape back" | Back escapes, hand fighting, turning in |
| `takedown_defense` | "got taken down", "couldn't sprawl" | Sprawls, underhooks, clinch defense |
| `cardio_fatigue` | "gassed", "tired", "no energy" | Pacing, breathing, conditioning |
| `strength_differential` | "overpowered", "too strong", "muscled" | Technique over strength, leverage, timing |
| `timing_issues` | "too slow", "missed it", "late" | Drilling methodology, reaction training |
| `no_attacks` | "couldn't submit", "no offense" | Attack chains, setups, finishing details |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2025 | Initial specification |

---

*This document should be reviewed and updated whenever the video library structure changes or new signal types are identified from user journal patterns.*
