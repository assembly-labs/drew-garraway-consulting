# Personalization: User Context Document (UCD)

## Overview

The UCD is a living JSON document that gets injected into every AI prompt. It grows richer as the user logs more sessions and interacts with insights. This is how we "pre-train" without fine-tuning.

## UCD Growth Phases

| Phase | Sessions | What's Known |
|-------|----------|-------------|
| Onboarding | 0 | name, belt, stripes, gym, goals, experience, target frequency |
| Early | 1-9 | + training frequency actual, mode preference, first techniques |
| Developing | 10-24 | + style identity, top submissions, vulnerabilities, injury history |
| Established | 25-49 | + consistency patterns, sentiment trends, chat preferences |
| Mature | 50+ | + technique evolution, game system, plateau history, breakthroughs |

## Variable Inventory

### Static Variables (from profile)

| Variable | Type | Source | When Available |
|----------|------|--------|---------------|
| name | string | Onboarding (mandatory) | Session 0 |
| belt | BeltLevel | Onboarding (mandatory) | Session 0 |
| stripes | number | Onboarding (mandatory) | Session 0 |
| age | number (computed) | Onboarding (mandatory, from birthDate) | Session 0 |
| gym | string | Onboarding (mandatory) | Session 0 |
| targetFrequency | number | Onboarding (mandatory) | Session 0 |
| gender | 'male' / 'female' / null | Onboarding (optional) or Session 5 | Session 0 or 5 |
| trainingGoals | string[] | Onboarding (optional) | Session 0 or 10 |
| experienceLevel | string | Onboarding (optional) | Session 0 or 3 |
| bodyWeightKg | number / null | Onboarding (optional) | Session 0 or 5 |

### Computed Variables (pattern engine)

| Variable | Computation | Meaningful At |
|----------|------------|--------------|
| styleIdentity | Top 3 techniques by frequency -> named system | 10+ sessions |
| topSubmissions | Submissions given, ranked by count | 5+ sparring sessions |
| vulnerabilities | Submissions received, ranked by count | 5+ sparring sessions |
| avgFrequency | 4-week rolling average sessions/week | 4+ weeks |
| modePreference | Gi vs nogi percentage | 10+ sessions |
| injuryHistory | Recurring body parts + frequency + first mentioned date | Any injury |
| consistencyPattern | Streak history, gap patterns, adherence rate | 4+ weeks |
| breakthroughLog | Techniques where user reported "clicked" or similar | When detected |
| plateauHistory | Periods flagged by sentiment + patterns | When detected |
| sparringIntensity | Avg rounds/session, trend direction | 5+ sparring sessions |
| techniqueDepthVsBreadth | Specialist vs generalist diversity score | 10+ sessions |
| submissionRatioTrend | Direction of ratio over last 3 months | 3+ months |

### Learned Variables (from chat interactions)

| Variable | How Captured | Example |
|----------|-------------|---------|
| chatPreferences | Analyze question types across conversations | "Asks for specific drills over concepts" |
| responsePreference | Track feedback thumbs on insight types | "Values technique insights over consistency" |
| coachRelationship | Journal mentions of coach, privates, etc. | "Active coaching relationship" |

### Future Variables (schema-ready, not collected yet)

| Variable | Source | Notes |
|----------|--------|-------|
| competitionHistory | Journal detection or manual | Changes sparring framing |
| lineage | Gym affiliation | Terminology adaptation (Gracie vs 10P vs Danaher) |
| injuryProfile | Aggregated from session injuries (FEAT-006) | Persistent injury tracking for safety-aware recommendations |

## UCD JSON Structure

```typescript
interface UserContextDocument {
  version: number;
  sessionsAnalyzed: number;
  lastRebuilt: string; // ISO timestamp

  // Static
  profile: {
    name: string;
    belt: BeltLevel;
    stripes: number;
    age: number;                    // Computed from birthDate
    gender: 'male' | 'female' | null;
    gym: string;
    monthsTraining: number;
    trainingGoals: string[] | null;  // includes 'self_defense', 'community'
    experienceLevel: string | null;
    targetFrequency: number;
    bodyWeightKg: number | null;
  };

  // Computed
  patterns: {
    styleIdentity: string | null; // "Half guard player with armbar finish"
    topSubmissions: { type: string; count: number }[] | null;
    vulnerabilities: { type: string; count: number }[] | null;
    avgFrequency: number | null;
    modePreference: { gi: number; nogi: number } | null; // percentages
    injuryHistory: { bodyPart: string; occurrences: number; firstMentioned: string; lastMentioned: string }[];
    consistencyPattern: { avgStreak: number; longestStreak: number; adherenceRate: number } | null;
    breakthroughLog: { technique: string; date: string }[];
    plateauHistory: { period: string; resolved: boolean }[];
    sparringIntensity: { avgRounds: number; trend: 'increasing' | 'decreasing' | 'stable' } | null;
    techniqueProfile: 'specialist' | 'generalist' | 'developing' | null;
    submissionRatioTrend: 'improving' | 'declining' | 'stable' | null;
  };

  // Learned
  preferences: {
    chatStyle: string | null; // "prefers specific drills"
    insightPreference: string | null; // "values technique over consistency"
    coachRelationship: string | null;
  };

  // Changelog
  recentChanges: { date: string; field: string; oldValue: any; newValue: any; reason: string }[];
}
```

## Rebuild Rules

- **Trigger:** after each new session is saved
- Compute all patterns from full session history
- Compare to current UCD
- Only update if "meaningful change" detected:
  - New technique enters top 5
  - Submission ratio shifts >0.2
  - New recurring injury (2+ mentions in 3 weeks)
  - Style identity changes (top techniques shift)
  - Belt or stripe change
  - Consistency pattern shift (adherence rate change >10%)
- Log every change to `recentChanges` (capped at last 20 changes)
- Increment version on update

## Serialization for Prompts

The UCD is serialized to natural language for injection (~200-400 tokens):

```
Name: Drew
Age: 32, Male
Belt: Blue (2 stripes), 8 months training
Weight: 75 kg (Leve class)
Gym: Gracie Barra Center City
Goal: Competition, fitness
Style: Half guard player -- sweep -> knee slice pass -> armbar
Top submissions: armbar (23x), triangle (8x)
Vulnerability: RNC (12x received), back defense is primary gap
Training: 3.4 sessions/week (target: 4), 72% gi
Injury: recurring left shoulder (first noted Feb 2026, 6 mentions)
Recent breakthrough: knee slice pass (March)
Plateau: February week 3 (resolved)
Preference: asks for specific drills over conceptual explanations
```

**Age/gender/weight in serialization:**
- Age is always included (mandatory field): "Age: 32" or "Age: 45"
- Gender is included if set: "Age: 32, Male" or just "Age: 32" if null
- Weight is included if set: "Weight: 75 kg (Leve class)" with IBJJF class name
- These enable age-adjusted insights ("At 45, prioritizing recovery between sessions is smart"), gendered competition context, and weight-class-aware advice

## Privacy

- UCD is stored per-user with RLS (only the user's row accessible)
- No UCD data is ever shared between users
- UCD is never sent to third parties -- only to Anthropic via edge functions
- Future: allow users to view/export/delete their UCD

## Iteration Plan

1. **Phase 1:** Static profile data only (belt, gym, goals)
2. **Phase 2:** Add computed patterns after weekly Haiku ships
3. **Phase 3:** Add learned preferences after chat ships
4. **Phase 4:** Add future variables via progressive profiling
5. **Ongoing:** Tune serialization format based on insight quality feedback
