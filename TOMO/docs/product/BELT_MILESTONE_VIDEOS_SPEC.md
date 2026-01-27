# Belt Milestone Videos & Onboarding Flow - Feature Specification

> **Status:** Ready for Development
> **Created:** January 2025
> **Priority:** High - Core retention feature

---

## Overview

Two related features that use curated video content to support users at key moments:

1. **White Belt Onboarding Flow** - Sequential video series for brand new students
2. **Belt Milestone Videos** - Triggered when user achieves a new belt

---

## Feature 1: White Belt Onboarding Flow

### Purpose
Guide brand new BJJ students through their first week with essential cultural and practical knowledge. Reduces overwhelm, builds confidence, increases retention.

### Trigger
- **Event:** User completes account creation with `belt_level: 'white'`
- **Timing:** First video available immediately, subsequent videos unlock daily

### Flow Structure

| Day | Video ID | Topic | Why This Day |
|-----|----------|-------|--------------|
| 1 | NB_001 | How to Tie Your Belt | Immediate practical need |
| 1 | NB_006 | What to Wear to Class | Immediate practical need |
| 2 | NB_002 | BJJ Hygiene Essentials | Before first rolling |
| 3 | NB_003 | What to Expect in Class | Mental preparation |
| 4 | NB_005 | Gym Etiquette | Cultural integration |
| 5 | NB_008 | Rolling Etiquette | Before first live sparring |
| 5 | NB_009 | Tapping and Safety | Critical safety knowledge |
| 6 | NB_012 | Basic Terminology | Understanding instruction |
| 7 | NB_007 | Surviving Your First Months | Long-term mindset |

### Optional/Browse Videos
Available in library but not part of mandatory flow:
- NB_004 - Benefits of BJJ (motivation reinforcement)
- NB_010 - Gi vs No-Gi Explained (when they ask)
- NB_011 - How to Pick a Gym (if shopping around)

### UI/UX

```
┌─────────────────────────────────────────────────┐
│  YOUR FIRST WEEK IN BJJ                         │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Day 1 ✓  [Belt Tying] [What to Wear]          │
│  Day 2 ✓  [Hygiene Essentials]                  │
│  Day 3 ●  [What to Expect] ← WATCH NOW          │
│  Day 4 ○  [Gym Etiquette]                       │
│  Day 5 ○  [Rolling Etiquette] [Tapping]         │
│  Day 6 ○  [Terminology]                         │
│  Day 7 ○  [Surviving First Months]              │
│                                                 │
│  ✓ = Watched  ● = Available  ○ = Locked         │
└─────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface OnboardingProgress {
  user_id: string;
  started_at: string;           // ISO timestamp
  current_day: number;          // 1-7
  videos_watched: string[];     // Video IDs completed
  completed_at: string | null;  // ISO timestamp when all done
}
```

### Notifications
- Day 1: "Welcome to your BJJ journey! Start with the essentials."
- Day 3: "New video unlocked: What to expect in your first class"
- Day 7: "Final onboarding video ready - you've got this!"
- Completion: "Onboarding complete! You're ready to train."

---

## Feature 2: Belt Milestone Videos

### Purpose
When a user logs a belt promotion, celebrate with curated content:
1. **"Life at [Belt]"** - What to expect, common challenges, mindset
2. **"Road to [Next Belt]"** - What to focus on, skills to develop

### Trigger
- **Event:** User updates `belt_level` in profile (or logs promotion in session)
- **Timing:** Videos available immediately after promotion logged

### Video Categories

#### Category A: "Life at This Belt" (Mindset/Experience)
Helps user understand their current phase of the journey.

| Belt | Video ID | Title | Content Focus |
|------|----------|-------|---------------|
| White | BM_W01 | "The White Belt Experience" | Survival mode is normal, everyone gets tapped, focus on defense |
| Blue | BM_B01 | "Welcome to Blue Belt" | Blue belt blues, developing your game, teaching beginners |
| Purple | BM_P01 | "The Purple Belt Journey" | Refining technique, finding your style, coaching role |
| Brown | BM_BR01 | "Brown Belt Mastery" | Polishing details, preparing to teach, legacy mindset |
| Black | BM_BK01 | "Black Belt: The Beginning" | Now the real learning starts, giving back, longevity |

#### Category B: "Road to Next Belt" (Technical Focus)
Practical guidance on what to develop for promotion.

| Current Belt | Video ID | Title | Content Focus |
|--------------|----------|-------|---------------|
| White | BM_W02 | "Preparing for Blue Belt" | Defense proficiency, 2+ escapes each position, guard basics |
| Blue | BM_B02 | "The Path to Purple" | Offense development, signature game, competition experience |
| Purple | BM_P02 | "Journey to Brown" | Teaching ability, technical depth, problem-solving |
| Brown | BM_BR02 | "Road to Black Belt" | Mastery demonstration, community contribution, patience |

### UI/UX

```
┌─────────────────────────────────────────────────┐
│  🎉 CONGRATULATIONS ON BLUE BELT!               │
│  ─────────────────────────────────────────────  │
│                                                 │
│  [VIDEO THUMBNAIL]                              │
│  "Welcome to Blue Belt"                         │
│  Understanding your new chapter                 │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ALSO RECOMMENDED:                              │
│  [Thumbnail] "The Path to Purple"               │
│  What to focus on for your next promotion       │
│                                                 │
│  [WATCH LATER]  [WATCH NOW]                     │
└─────────────────────────────────────────────────┘
```

### Data Model

```typescript
interface BeltMilestone {
  user_id: string;
  belt_achieved: BeltLevel;
  achieved_at: string;          // ISO timestamp
  milestone_video_watched: boolean;
  roadmap_video_watched: boolean;
  dismissed: boolean;           // User can dismiss if not interested
}
```

### Notifications
- Immediate: "Congrats on [belt]! We have something special for you."
- 24h later (if not watched): "Your belt milestone video is waiting"
- 1 week later (if not watched): "Quick reminder about your [belt] celebration video"

---

## Video Content Status

### Existing Videos (Ready to Use)

**White Belt Onboarding (NB_):**
| ID | Status | Source |
|----|--------|--------|
| NB_001 | ✅ Ready | Stephan Kesting - Belt Tying |
| NB_002 | ✅ Ready | Chewjitsu - Hygiene |
| NB_003 | ✅ Ready | Chewjitsu - First Class |
| NB_004 | ✅ Ready | Jocko - Benefits of BJJ |
| NB_005 | ✅ Ready | Chewjitsu - Etiquette |
| NB_006 | ✅ Ready | Chewjitsu - What to Wear |
| NB_007 | ✅ Ready | Chewjitsu - Surviving First Months |
| NB_008 | ✅ Ready | Stephan Kesting - Rolling Etiquette |
| NB_009 | ✅ Ready | Stephan Kesting - Tapping Safety |
| NB_010 | ✅ Ready | Chewjitsu - Gi vs No-Gi |
| NB_011 | ✅ Ready | Chewjitsu - Picking a Gym |
| NB_012 | ✅ Ready | Stephan Kesting - Terminology |

**Belt Journey Mindset (BJ_) - Partial Coverage:**
| ID | Status | Can Map To |
|----|--------|------------|
| BJ_002 | ✅ Exists | Jocko - Humility (White belt mindset) |
| BJ_004 | ✅ Exists | Jocko - GOOD (All belts - setbacks) |
| BJ_003 | ✅ Exists | Jocko - Burnout (Blue belt blues) |

### Videos Needed (Content Gaps)

**Belt Milestone Videos (BM_) - Need to Source:**

| ID | Title Needed | Suggested Sources |
|----|--------------|-------------------|
| BM_W01 | "The White Belt Experience" | Chewjitsu, Bernardo Faria |
| BM_W02 | "Preparing for Blue Belt" | Chewjitsu, Stephan Kesting |
| BM_B01 | "Welcome to Blue Belt" | Chewjitsu "Blue Belt Blues" content |
| BM_B02 | "The Path to Purple" | Rob Biernacki, Chewjitsu |
| BM_P01 | "The Purple Belt Journey" | Chewjitsu, Bernardo Faria |
| BM_P02 | "Journey to Brown" | Chewjitsu, higher belt interviews |
| BM_BR01 | "Brown Belt Mastery" | Rener Gracie, Chewjitsu |
| BM_BR02 | "Road to Black Belt" | Jocko, Rener Gracie |
| BM_BK01 | "Black Belt: The Beginning" | Jocko "Black belt is when real learning starts" |

**Search Terms for Finding Content:**
- "white belt tips bjj"
- "blue belt blues" / "blue belt advice"
- "what to expect purple belt bjj"
- "brown belt to black belt journey"
- "black belt meaning jiu jitsu"
- Chewjitsu channel has excellent belt-specific content

---

## Technical Implementation

### Database Schema Additions

```sql
-- Onboarding progress tracking
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_day INTEGER DEFAULT 1,
  videos_watched TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

-- Belt milestone tracking
CREATE TABLE belt_milestones (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  belt_achieved TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  milestone_video_watched BOOLEAN DEFAULT FALSE,
  roadmap_video_watched BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, belt_achieved)
);
```

### API Endpoints

```typescript
// Onboarding
GET  /api/onboarding/progress      // Get user's onboarding state
POST /api/onboarding/watch/:videoId // Mark video as watched
POST /api/onboarding/skip          // Skip onboarding entirely

// Belt Milestones
GET  /api/milestones/pending       // Get unwatched milestone videos
POST /api/milestones/watch/:videoId // Mark milestone video watched
POST /api/milestones/dismiss/:belt  // Dismiss milestone prompt
```

### Event Triggers

```typescript
// In UserProfileContext or similar
function onBeltChange(oldBelt: BeltLevel, newBelt: BeltLevel) {
  if (isPromotion(oldBelt, newBelt)) {
    // Create milestone record
    createBeltMilestone(userId, newBelt);

    // Show celebration modal
    showMilestoneModal(newBelt);

    // Queue notification
    scheduleNotification(userId, 'belt_milestone', { belt: newBelt });
  }
}

function onAccountCreate(user: User) {
  if (user.belt_level === 'white') {
    // Initialize onboarding
    createOnboardingProgress(user.id);

    // Show onboarding prompt
    showOnboardingWelcome();
  }
}
```

---

## Implementation Phases

### Phase 1: Content Sourcing (No Code)
- [ ] Find and add BM_W01, BM_W02 (white belt milestone videos)
- [ ] Find and add BM_B01, BM_B02 (blue belt milestone videos)
- [ ] Find and add BM_P01, BM_P02 (purple belt milestone videos)
- [ ] Find and add BM_BR01, BM_BR02 (brown belt milestone videos)
- [ ] Find and add BM_BK01 (black belt milestone video)

### Phase 2: Onboarding Flow (MVP)
- [ ] Create OnboardingProgress component
- [ ] Add database table for progress tracking
- [ ] Implement day-by-day unlock logic
- [ ] Add "Skip Onboarding" option
- [ ] Test flow with new account creation

### Phase 3: Belt Milestones (MVP)
- [ ] Create BeltMilestoneModal component
- [ ] Add database table for milestone tracking
- [ ] Hook into belt change events
- [ ] Implement celebration UI
- [ ] Add notification system

### Phase 4: Polish
- [ ] Add progress indicators
- [ ] Implement reminder notifications
- [ ] Add analytics tracking
- [ ] A/B test different video orderings
- [ ] Gather user feedback

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding completion rate | >70% | Users who watch all 7 days |
| Milestone video watch rate | >50% | Users who watch within 7 days of promotion |
| Day 30 retention (onboarded) | +15% | vs non-onboarded users |
| Session frequency post-milestone | +10% | 30 days before vs after promotion |

---

## Notes

- **Chewjitsu (Nick Albin)** is the best source for belt-specific mindset content
- Keep videos under 10 minutes for engagement
- Allow users to skip/dismiss - don't force content
- Consider A/B testing video order in onboarding
- Track drop-off points to identify friction

---

## Related Documents

- [VIDEO_ENRICHMENT_WORKFLOW.md](./VIDEO_ENRICHMENT_WORKFLOW.md) - How to add videos
- [BELT_PERSONALIZATION_SYSTEM.md](./BELT_PERSONALIZATION_SYSTEM.md) - Belt psychology profiles
- [techniqueVideos.ts](/prototype/src/data/techniqueVideos.ts) - Video database
