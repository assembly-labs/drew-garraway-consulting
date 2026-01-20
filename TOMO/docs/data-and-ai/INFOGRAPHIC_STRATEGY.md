# BJJ Progress Tracker: Infographic & Visualization Strategy

> **Last Updated:** January 2026
>
> **Status:** This document reflects the current implementation in the prototype. All modules listed in the "Built" tables are implemented in `/prototype/src/components/features/stats-modules/`.

---

## Philosophy Alignment

Per our [Conversation Design Foundation](./CONVERSATION_DESIGN_FOUNDATION.md), visualizations must:
- **Never gamify** - No "level up", "unlock", or achievement-chasing psychology
- **Focus on consistency over perfection** - Celebrate showing up, not winning
- **Be self-comparative** - Progress is personal, not competitive
- **Respect the coach relationship** - Data informs, coaches guide

**Note:** Belt progression is shown in the **Profile/Bio**, not Stats. The Stats page focuses on training patterns, not promotion milestones.

---

## Built Visualizations by Belt Level

### White Belt Modules (Retention Focus)

| Module | Component | Data Required | Purpose | Confidence |
|--------|-----------|---------------|---------|------------|
| **Weekly Progress Ring** | `WeeklyProgressRing.tsx` | Sessions this week, weekly goal | Apple Watch-style ring showing progress toward weekly session goal | 10 |
| **Calendar Heat Map** | `CalendarHeatMap.tsx` | Session dates (90 days) | GitHub-style consistency visualization showing training rhythm and gaps | 9 |
| **Dashboard Summary Card** | `DashboardSummaryCard.tsx` | Total sessions, hours, belt, streak | Key metrics at-a-glance for immediate "how am I doing?" validation | 9 |
| **Defense Focus** | `DefenseFocus.tsx` | Submissions given/received by type | Toggleable offense/defense bar charts - helps white belts see defensive progress | 8 |

### Blue Belt Modules (Game Development Focus)

| Module | Component | Data Required | Purpose | Confidence |
|--------|-----------|---------------|---------|------------|
| **Session Type Distribution** | `SessionTypeDistribution.tsx` | Session types (gi/nogi/open mat/drilling) | Donut chart showing training mix balance | 9 |
| **Sparring Pattern Analysis** | `SparringPatternAnalysis.tsx` | Submission exchanges (landed vs received) | Horizontal bar charts showing what's working in live rolling | 8 |
| **Achievement Timeline** | `AchievementTimeline.tsx` | Milestones, promotions, PRs | Personal journey markers (first sub, streaks, session counts) | 8 |
| **Technique Pairings** | `TechniquePairings.tsx` | Techniques logged together | Co-occurrence analysis showing which techniques are drilled together | 7 |
| **Blues Detector** | `BluesDetector.tsx` | Session gaps, frequency trend, sentiment | Dropout risk detection with supportive intervention messaging | 9 |

### Purple+ Belt Modules (Systems & Mastery Focus)

| Module | Component | Data Required | Purpose | Confidence |
|--------|-----------|---------------|---------|------------|
| **Session Type Distribution** | `SessionTypeDistribution.tsx` | Session types + comp prep | Same as Blue but with competition prep category | 9 |
| **Sparring Pattern Analysis** | `SparringPatternAnalysis.tsx` | Advanced submission data | Same as Blue with deeper technique granularity | 8 |
| **Achievement Timeline** | `AchievementTimeline.tsx` | Multi-year milestones | Extended timeline showing long-term journey | 8 |
| **Your Journey** | `YourJourney.tsx` | Multi-year session data, submission trends | Long-term progression visualization with yearly comparison | 8 |
| **Technique Mastery** | `TechniqueMastery.tsx` | Technique frequency, outcomes | Specialization depth analysis showing A-game development | 7 |

### All Belts (Universal Modules)

| Module | Component | Data Required | Purpose | Confidence |
|--------|-----------|---------------|---------|------------|
| **Recent Rolls** | `RecentRolls.tsx` | Last 5-10 submissions received | "Watch Out" vulnerability alert with defense coaching suggestions | 8 |
| **Style Fingerprint** | `StyleFingerprint.tsx` (UI component) | Positional strength data | Radar chart showing grappling style archetype (Blue+ with 20+ sessions) | 6 |
| **Tournament Readiness** | `TournamentReadinessCard.tsx` (UI component) | Consistency, technique, sparring, competition history | Competition prep assessment (shown on demand) | 8 |
| **Attack Profile** | `AttackProfile.tsx` | Submission history | Full submission story visualization (Blue+ only) | 7 |
| **Locked Features Footer** | `LockedFeaturesFooter.tsx` | Belt level, session count | Shows features that unlock with progression | 9 |
| **Breakthrough Hero** | `BreakthroughHero.tsx` (UI component) | Achievement data | Celebrates significant milestones when detected | 8 |

---

## Rationale for Belt-Level Progression

### White Belt Focus: Consistency & Defense
- **Calendar Heat Map** addresses the #1 white belt challenge: building the habit of showing up. Research shows habits form in 66 days; visual feedback accelerates this.
- **Weekly Progress Ring** creates psychological drive to "close the ring" without gamification pressure.
- **Defense Focus** helps white belts track defensive improvement - getting tapped less is meaningful progress.
- **Dashboard Summary Card** provides immediate validation without overwhelming detail.

### Blue Belt Focus: Game Development & Retention
- **Session Type Distribution** reveals training balance (gi vs nogi, drilling vs rolling).
- **Sparring Pattern Analysis** shows what's actually working in live rolling vs. drilling.
- **Technique Pairings** identifies natural technique chains developing in their game.
- **Blues Detector** provides supportive intervention during the dangerous blue belt plateau period.
- **Achievement Timeline** marks personal journey milestones to combat "am I progressing?" anxiety.

### Purple+ Belt Focus: Systems & Mastery
- **Your Journey** provides multi-year perspective on development trajectory.
- **Technique Mastery** shows specialization depth and A-game development.
- **Style Fingerprint** (radar chart) enables strategic game planning - identifying weaknesses to address and strengths to build upon.
- Same core modules (Session Type, Sparring Pattern, Achievement Timeline) but with deeper data granularity.

### Universal Design Principles
- **Weekly Progress Ring** works at every level because consistency matters from white to black belt.
- **Recent Rolls** ("Watch Out") helps all practitioners identify defensive vulnerabilities.
- **Dashboard Summary Card** serves all users by providing immediate orientation.

---

## Design Confidence Notes

**High Confidence (9-10) - BUILT:**
- Calendar heat maps, progress rings, dashboard cards, session type donut charts
- These have extensive proven implementations in mobile fitness apps
- All are implemented and production-ready

**Medium-High Confidence (7-8) - BUILT:**
- Sparring pattern analysis, technique pairings, achievement timeline, blues detector
- Adapt existing patterns (skill grids, activity breakdowns) to BJJ-specific data
- Implemented with BJJ-specific taxonomy

**Medium Confidence (6-7) - BUILT WITH CARE:**
- Style Fingerprint radar chart requires 20+ sessions to unlock (data quality gate)
- Technique Mastery requires sufficient technique logging to be meaningful
- Mobile optimization tested and refined

---

## Data Availability (Current Implementation)

**Available Now (Prototype):**
- Session logging (date, duration, type) ✓
- Sparring logs (rounds, outcomes) ✓
- Technique mentions (via voice/text logging) ✓
- Submission tracking (given/received by type) ✓
- Belt/stripe tracking ✓
- Streak and consistency data ✓

**Coming with Backend (MVP):**
- Real voice transcription (AssemblyAI)
- Persistent user data (Supabase)
- Coach feedback entries
- Competition records
- Injury tracking

**Future Consideration:**
- Positional time distribution during sparring
- Partner-specific rolling history
- NLP-extracted feedback themes

---

## Planned Visualizations (Future Roadmap)

### MVP Phase (With Backend)

| Visualization | Priority | Data Required | Notes |
|---------------|----------|---------------|-------|
| **Injury Timeline** | P1 | Injury flags, body part, recovery status | 66% of BJJ athletes injured within 3 years. Critical for retention. |
| **Monthly/Yearly Recap** | P2 | Aggregated session data | "Spotify Wrapped" style - high engagement driver |
| **Goal Progress Bars** | P2 | User-set goals with targets | Research shows visual goal feedback improves outcomes |
| **Training Partner List** | P3 | Partner names from sessions | Shows rolling diversity (same-belt vs higher belt partners) |

### Post-MVP Considerations

| Visualization | Priority | Data Required | Notes |
|---------------|----------|---------------|-------|
| **Weight Class Tracking** | P2 (competitors) | Weigh-in data | Critical for the 20-30% who compete |
| **Competition Countdown** | P2 (competitors) | Competition dates, prep checklist | Dedicated pre-comp view |
| **Rest Day Intelligence** | P3 | Training load metrics | Prevents overtraining, distinguishes planned rest from dropout |
| **Position Transition Flow** | P4 | Detailed position logging | Sankey diagram - complex but powerful for purple+ |

### Not Planned (Philosophy Conflicts)

| Visualization | Reason Not Included |
|---------------|---------------------|
| ~~Belt Progression Checklist~~ | Gamifies promotion. Belt progress belongs in Profile, not Stats. |
| ~~Coach Feedback Sentiment Trend~~ | Quantifying coach relationship feels transactional. |
| ~~Leaderboards/Rankings~~ | "Progress is personal, not comparative" |
| ~~Achievement Badges~~ | Feels like gamification. AchievementTimeline is milestone-based, not badge-collecting. |

---

## Implementation Status Summary

### Fully Built (Prototype)

| Priority | Module | Belt | Status |
|----------|--------|------|--------|
| Core | WeeklyProgressRing | White | ✅ Production |
| Core | CalendarHeatMap | White | ✅ Production |
| Core | DashboardSummaryCard | White | ✅ Production |
| Core | DefenseFocus | White | ✅ Production |
| Core | SessionTypeDistribution | Blue+ | ✅ Production |
| Core | SparringPatternAnalysis | Blue+ | ✅ Production |
| Core | AchievementTimeline | Blue+ | ✅ Production |
| Core | TechniquePairings | Blue | ✅ Production |
| Core | BluesDetector | Blue | ✅ Production |
| Core | YourJourney | Purple+ | ✅ Production |
| Core | TechniqueMastery | Purple+ | ✅ Production |
| Core | RecentRolls | All | ✅ Production |
| Core | StyleFingerprint | Blue+ (20+ sessions) | ✅ Production |
| Core | TournamentReadinessCard | All | ✅ Production |
| Core | AttackProfile | Blue+ | ✅ Production |
| Core | BreakthroughHero | All | ✅ Production |
| Core | LockedFeaturesFooter | All | ✅ Production |

### Next Priority (MVP with Backend)

| Priority | Module | Dependency |
|----------|--------|------------|
| P1 | Injury Timeline | Injury tracking feature |
| P2 | Monthly/Yearly Recap | 12+ months of data |
| P2 | Goal Progress Bars | Goal setting feature |
| P3 | Training Partner List | Partner logging |

---

## Visualization Philosophy: Less is More on Mobile

The research consistently shows that **information overload reduces engagement** on mobile devices. The current implementation follows this principle:

**White Belt Dashboard:** 4 modules (retention focus)
- Weekly Progress Ring
- Calendar Heat Map
- Dashboard Summary Card
- Defense Focus

**Blue Belt Dashboard:** 5 modules (game development)
- Session Type Distribution
- Sparring Pattern Analysis
- Achievement Timeline
- Technique Pairings
- Blues Detector

**Purple+ Belt Dashboard:** 5 modules (systems & mastery)
- Session Type Distribution
- Sparring Pattern Analysis
- Achievement Timeline
- Your Journey
- Technique Mastery

**All Belts (Universal):**
- Recent Rolls ("Watch Out" section)
- Style Fingerprint (Blue+ with 20+ sessions)
- Tournament Readiness (on-demand)
- Attack Profile (Blue+)
- Breakthrough Hero (when achievements detected)

**Progressive disclosure** allows users to see more detail by tapping into any visualization, but the default view shows 4-5 belt-appropriate modules.

**Special Purpose Views:**
- Tournament Readiness: Expanded on user request
- Style Fingerprint: Unlocks at Blue belt with 20+ sessions
- Locked Features Footer: Shows what unlocks with progression
