# Practice Tracking - Data Specification

**Last Updated:** January 25, 2026
**Status:** Implementation Ready
**Component:** `TechniqueLibrary.tsx` → Log Practice button

---

## Overview

Practice tracking captures **deliberate practice events** from the Technique Library. This is distinct from Session Logging:

| Aspect | Session Logging | Practice Tracking |
|--------|-----------------|-------------------|
| **When** | After full training session | Anytime (home, gym, quick drill) |
| **Context** | User is exhausted | User is relaxed, learning |
| **Data Captured** | Full session details | Single technique focus |
| **Time Required** | 60-90 seconds | 2 seconds (one tap) |
| **Primary Value** | Training history | Technique-specific progress |

---

## Data Model

### PracticeLog

```typescript
interface PracticeLog {
  id: string;                    // UUID
  userId: string;                // User who logged
  techniqueId: string;           // Technique practiced (links to Technique)
  techniqueName: string;         // Denormalized for quick display
  position: Position;            // Technique's position category
  timestamp: string;             // ISO 8601 datetime
  source: 'technique_library' | 'session_logger' | 'quick_add';
  notes?: string;                // Optional quick note
}
```

### Storage (Prototype)

```typescript
// localStorage key
const PRACTICE_LOGS_KEY = 'tomo_practice_logs';

// Structure
interface StoredPracticeLogs {
  logs: PracticeLog[];
  lastUpdated: string;
}
```

### Storage (Production - Supabase)

```sql
CREATE TABLE practice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  technique_id VARCHAR(50) NOT NULL,
  technique_name VARCHAR(255) NOT NULL,
  position VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'technique_library',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_practice_logs_user_id ON practice_logs(user_id);
CREATE INDEX idx_practice_logs_technique_id ON practice_logs(technique_id);
CREATE INDEX idx_practice_logs_timestamp ON practice_logs(timestamp);
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER ACTION                                   │
│  User taps "Log Practice" on Technique Detail page                  │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA CAPTURE                                    │
│  1. Create PracticeLog entry with timestamp                         │
│  2. Link to technique via techniqueId                               │
│  3. Store source = 'technique_library'                              │
│  4. Persist to localStorage (prototype) / Supabase (production)     │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    DERIVED DATA UPDATES                              │
│  1. Increment TechniqueProgress.timesDrilled                        │
│  2. Update TechniqueProgress.lastDrilled to today                   │
│  3. Recalculate proficiency if threshold reached                    │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        AI / INSIGHTS                                 │
│  Practice logs feed into:                                           │
│  - "For You" recommendations (weight recently practiced techniques) │
│  - Daily insights ("You've drilled triangles 12x this week!")       │
│  - Style Fingerprint (shows deliberate practice areas)              │
│  - Technique Mastery module (proficiency progression)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Proficiency Auto-Update Rules

Practice logs contribute to automatic proficiency progression:

| Current Level | Threshold | Next Level |
|---------------|-----------|------------|
| `learning` | 10 practice logs | `developing` |
| `developing` | 25 practice logs | `proficient` |
| `proficient` | 50 practice logs | `advanced` |

**Note:** These are suggestions, not promotions. User/coach can override.

### Implementation

```typescript
function updateProficiencyFromPractice(
  techniqueId: string,
  currentProgress: TechniqueProgress
): TechniqueProgress {
  const newTimesDrilled = currentProgress.timesDrilled + 1;

  let newProficiency = currentProgress.proficiency;
  if (newTimesDrilled >= 50 && currentProgress.proficiency === 'proficient') {
    newProficiency = 'advanced';
  } else if (newTimesDrilled >= 25 && currentProgress.proficiency === 'developing') {
    newProficiency = 'proficient';
  } else if (newTimesDrilled >= 10 && currentProgress.proficiency === 'learning') {
    newProficiency = 'developing';
  }

  return {
    ...currentProgress,
    timesDrilled: newTimesDrilled,
    lastDrilled: new Date().toISOString().split('T')[0],
    proficiency: newProficiency,
  };
}
```

---

## AI Integration Points

### 1. For You Recommendations

```typescript
// Weight recently practiced techniques in recommendations
function getForYouVideos(userId: string): VideoRecommendation[] {
  const recentPractice = getPracticeLogs(userId, { days: 14 });

  // Techniques practiced recently get lower priority (already working on it)
  // Related techniques get higher priority (build on momentum)
  const recentTechniqueIds = new Set(recentPractice.map(p => p.techniqueId));

  // Boost related techniques, not the same ones
  return recommendations.map(rec => ({
    ...rec,
    score: recentTechniqueIds.has(rec.techniqueId)
      ? rec.score * 0.5  // Reduce - already practicing
      : getRelatedScore(rec, recentTechniqueIds) // Boost if related
  }));
}
```

### 2. Daily Insights

Practice logs enable specific insights:

| Pattern | Insight Generated |
|---------|-------------------|
| 10+ logs on same technique (7 days) | "Deep focus on [technique] - consider testing it in sparring" |
| Practice across 3+ positions (7 days) | "Well-rounded drilling this week - hitting guards, passing, and submissions" |
| First practice log for technique | "Starting your [technique] journey - consistency is key" |
| 7-day practice streak | "You've practiced every day this week - impressive commitment" |

### 3. Style Fingerprint Enhancement

Practice logs add a "Deliberate Practice" dimension to the radar chart:

```typescript
// Current dimensions (from sparring)
const STYLE_DIMENSIONS = ['Guard', 'Passing', 'Top Control', 'Back Attacks', 'Takedowns', 'Leg Locks'];

// Practice logs contribute to understanding what user is ACTIVELY working on
// vs what they naturally gravitate to in sparring
function getDeliberatePracticeProfile(practiceLogs: PracticeLog[]): PositionDistribution {
  return practiceLogs.reduce((acc, log) => {
    acc[log.position] = (acc[log.position] || 0) + 1;
    return acc;
  }, {});
}
```

---

## Belt Personalization

Practice tracking behavior adjusts by belt:

| Belt | Celebration Threshold | Proficiency Message |
|------|----------------------|---------------------|
| White | Every 5 practices | "Building muscle memory - keep drilling!" |
| Blue | Every 10 practices | "Refining your technique - good work" |
| Purple+ | Every 25 practices | "Practice logged" |

```typescript
function getPracticeMessage(belt: BeltLevel, techniqueCount: number): string {
  const messages = {
    white: {
      threshold: 5,
      message: (count: number) => `${count} drills on this technique! Building muscle memory.`
    },
    blue: {
      threshold: 10,
      message: (count: number) => `${count} drills logged. Your ${getTechniqueName()} is developing.`
    },
    purple: {
      threshold: 25,
      message: () => 'Practice logged.'
    }
  };
  // ...
}
```

---

## Privacy Considerations

Practice logs are:
- **Private by default** - Only user can see
- **Not shared with coaches** unless user explicitly exports
- **Included in data export** (Settings > Export Data)
- **Deleted on profile reset** (Settings > Reset Profile)

---

## Metrics & Analytics

### User Engagement Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Practice log rate | % of technique views that result in log | >15% |
| Repeat practice rate | % of techniques practiced 2+ times | >40% |
| Practice diversity | Unique techniques practiced / week | 5+ |
| Practice streak | Consecutive days with practice logs | Track for badges |

### Data Quality Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Logs per session | Practice logs / training sessions | 0.5-2.0 |
| Position coverage | Positions with practice logs | All 11 |
| Spam detection | Multiple logs on same technique in <1 min | Flag for review |

---

## Implementation Checklist

### Phase 1: Basic Persistence (Prototype)

- [x] Log Practice button exists
- [x] Toast feedback on tap
- [ ] Create PracticeLog entry on tap
- [ ] Store in localStorage
- [ ] Update TechniqueProgress.timesDrilled
- [ ] Update TechniqueProgress.lastDrilled
- [ ] Display updated count in UI

### Phase 2: Derived Data

- [ ] Auto-update proficiency based on thresholds
- [ ] Show proficiency change notification
- [ ] Track practice streak

### Phase 3: AI Integration

- [ ] Include practice logs in For You algorithm
- [ ] Generate practice-based insights
- [ ] Add practice data to Style Fingerprint

### Phase 4: Production (iOS)

- [ ] Supabase table creation
- [ ] Real-time sync
- [ ] Offline queue for practice logs
- [ ] Cross-device sync

---

## Related Documentation

| Document | Relationship |
|----------|--------------|
| `DATA_AND_AI_BY_PAGE.md` | Techniques page data flow |
| `INSIGHTS_GENERATION_SPEC.md` | How insights use practice data |
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Comparison with session logging |
| `/docs/product/TECHNIQUES_PRD.md` | Feature specification |
| `/docs/product/FEATURES.md` | Feature 6.6 (Technique Progress) |

---

*Document created: January 25, 2026*
