# TOMO Feature Inventory

**Last Updated:** January 24, 2026
**Purpose:** Complete feature inventory for developer handoff
**Total Features:** 88

---

## Quick Reference

**Belt Access Legend:**
- `All` = All belts
- `W` = White only
- `B` = Blue only
- `B+` = Blue and above
- `P+` = Purple and above

**Status Legend:**
- `Done` = Complete in prototype
- `Partial` = UI exists, integration incomplete
- `Planned` = Designed, not built

---

## 1. Onboarding Flow

**Page:** `/Onboarding` | **Component:** `Onboarding.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 1.1 | Welcome Screen | First impression, sets tone | — | All | Done |
| 1.2 | Name Input | Personalized experience | `user.name` | All | Done |
| 1.3 | Belt Selection | Unlocks all personalization | `user.belt` | All | Done |
| 1.4 | Mic Permission | Enables voice-first logging | `user.loggingPreference` | All | Done |
| 1.5 | Ready Screen | CTA to log first session | — | All | Done |

**Notes:**
- Belt selection uses 80px touch targets, cannot be skipped
- Mic permission explains value, handles denial gracefully (falls back to text)

---

## 2. Stats (Home)

**Page:** `/Dashboard` | **Component:** `Dashboard.tsx`

### 2.1 Core Modules

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 2.1.1 | Hero Metric | Most important stat for belt level | `sessions[]`, `user.belt` | All | Done |
| 2.1.2 | Breakthrough Hero | Auto-celebrates milestones | `sessions[]`, `techniques[]` | All | Done |
| 2.1.3 | AI Callouts (What's Working / Focus Area) | Quick coaching insights | `sessions[]` | All | Done |
| 2.1.4 | Recent Rolls | Shows submissions received | `sessions[].submissionsReceived` | All | Done |
| 2.1.5 | Locked Features Footer | Shows what unlocks next | `user.belt`, `sessionCount` | W, B | Done |

**Hero Metric by Belt:**

| Belt | Primary | Secondary |
|------|---------|-----------|
| White | Session streak | Sessions/week, total |
| Blue | Technique variety | Streak, rounds, time at belt |
| Purple | Sparring rounds | Teaching, variety, sub ratio |
| Brown/Black | Teaching sessions | Rounds, sub ratio |

### 2.2 White Belt Modules

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 2.2.1 | Weekly Progress Ring | Apple Watch-style goal viz | `sessions[]`, `targetFrequency` | W | Done |
| 2.2.2 | Calendar Heat Map | 13-week consistency (no streaks) | `sessions[].date` | W | Done |
| 2.2.3 | Dashboard Summary | Sessions, hours, streak totals | `sessions[]` | W | Done |
| 2.2.4 | Defense Focus Chart | Offense/defense toggle | `submissionsGiven/Received` | W | Done |

### 2.3 Blue+ Belt Modules

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 2.3.1 | Style Profile (Radar) | 6-axis grappling fingerprint | `sessions[]` (20+ required) | B+ | Done |
| 2.3.2 | Session Type Distribution | Gi/nogi/drilling donut chart | `sessions[].trainingType` | B+ | Done |
| 2.3.3 | Sparring Pattern Analysis | Submission exchange rates | `submissionsGiven/Received` | B+ | Done |
| 2.3.4 | Achievement Timeline | Journey milestones | `beltHistory[]`, `sessions[]` | B+ | Done |
| 2.3.5 | Attack Profile Section | Body heat map + vulnerabilities | `submissionsGiven/Received` | B+ | Done |
| 2.3.6 | Tournament Readiness | 4-pillar competition prep | `sessions[]`, frequency | B+ | Done |

**Style Profile Dimensions:** Guard, Passing, Top Control, Back Attacks, Takedowns, Leg Locks

**Attack Profile Sub-components:** `BodyHeatMap`, `DeadliestAttackCard` (50+ subs), `AchillesHeelCard`

### 2.4 Blue Only Modules

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 2.4.1 | Technique Pairings | Co-occurrence drilling analysis | `sessions[].techniquesDrilled` | B | Done |
| 2.4.2 | Blues Detector | Dropout risk intervention | `sessions[]` frequency/sentiment | B | Done |

**Blues Detector Triggers:** Attendance decline 50%+, gap 14+ days, negative sentiment

### 2.5 Purple+ Modules

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 2.5.1 | Your Journey | Multi-year progression view | `sessions[]`, `beltHistory[]` | P+ | Done |
| 2.5.2 | Technique Mastery | Specialization depth by position | `techniqueProgress[]` | P+ | Done |

---

## 3. Session Logger (Recording)

**Page:** `/SessionLogger` | **Components:** `SessionLogger.tsx`, `VoiceFirstLogger.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 3.1 | Training Type Selection | Quick categorization (gi/nogi/open) | `session.trainingType` | All | Done |
| 3.2 | Duration Selection | Log training time (60/90/120) | `session.durationMinutes` | All | Done |
| 3.3 | Sparring Toggle | Indicate if they rolled | `session.didSpar` | All | Done |
| 3.4 | Voice Recording | Talk naturally about session | Audio → transcription | All | Done* |
| 3.5 | AI Processing | Extract structured data from voice | Transcription → fields | All | Done* |
| 3.6 | Review Phase | Confirm/edit extracted data | All session fields | All | Done |
| 3.7 | Submission Picker | Select subs given/received | `submissionsGiven/Received` | B+ | Done |
| 3.8 | Success Confirmation | Belt-specific post-session message | `sessionCount` | All | Done |
| 3.9 | Technique Suggestions | Help name techniques | History, belt level | All | Done |

*Mock transcription in prototype; AssemblyAI planned for iOS

**Belt-Specific Adaptations:**

| Aspect | White | Blue | Purple+ |
|--------|-------|------|---------|
| Technique suggestions | 5 | 10 | 15-25 |
| Submission picker | Hidden | Shown | Shown |
| Post-session tone | Encouraging | Neutral | Analytical |

**Post-Session Messages:**
- **White:** "Great work showing up. Consistency beats intensity."
- **Blue:** "Session logged. Keep developing your game."
- **Purple+:** "Logged. Your depth of understanding grows."

---

## 4. Session History (Journal)

**Page:** `/SessionHistory` | **Component:** `SessionHistory.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 4.1 | Log New Session Button | Primary CTA | — | All | Done |
| 4.2 | Session Count & Rounds | Quick stats header | `sessions.length`, `sparringRounds` | All | Done |
| 4.3 | Training Type Filter | Filter by gi/nogi | `sessions[].trainingType` | All | Done |
| 4.4 | Grouped Entries | Today/Yesterday/This Week/Earlier | `sessions[].date` | All | Done |
| 4.5 | Journal Entry Cards | Session preview cards | Session data | All | Done |
| 4.6 | Empty State | Belt-specific encouragement | `user.belt` | All | Done |

**Card Complexity by Belt:**

| Belt | Fields Shown |
|------|--------------|
| White | Date, type, duration, topic, notes |
| Blue | + Techniques, rounds, worked/struggles |
| Purple+ | + Submissions given/received |

---

## 5. Session Detail & Edit

**Page:** `/SessionDetail` | **Components:** `SessionDetail.tsx`, `EditSheet.tsx`, `EditSections.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 5.1 | AI Narrative Summary | Natural language session recap | All session fields | All | Done |
| 5.2 | Training Details Edit | Type, duration, sparring | Core fields | All | Done |
| 5.3 | Techniques Edit | Add/remove techniques | `techniquesDrilled[]` | All | Done |
| 5.4 | Sparring Details Edit | Rounds, partners, outcomes | `sparringRounds`, subs | B+ | Done |
| 5.5 | Insights Edit | Worked well / Struggles | `workedWell[]`, `struggles[]` | All | Done |
| 5.6 | Notes Edit | Free-form notes | `notes` | All | Done |
| 5.7 | Energy & Mood Edit | Physical/mental state | `energyLevel`, `mood` (1-5) | All | Done |
| 5.8 | Bottom Sheet Modal | Smooth section editing | Section data | All | Done |

---

## 6. Belt Progress

**Page:** `/BeltProgress` | **Component:** `BeltProgress.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 6.1 | Belt History Timeline | Visual promotion timeline | `beltHistory[]` | All | Done |
| 6.2 | Time at Current Belt | Duration at level | `currentBeltDate` | All | Done |
| 6.3 | Session Volume at Belt | Sessions logged at belt | `sessions[]` filtered | All | Done |
| 6.4 | IBJJF Timeline Reference | Minimum time context | Static requirements | B+ | Done |
| 6.5 | Techniques at Belt | Aggregate techniques practiced | `techniquesDrilled[]` | All | Done |
| 6.6 | Struggles Log | Common struggles at belt | `struggles[]` | All | Done |
| 6.7 | Plateau Guidance | Symptoms + breakthrough strategies | `currentPlateau` | All | Partial |

**Critical:** Display includes "Belt promotions are your coach's decision—this is for context only."

**Plateau Phases:**
- White 3-6mo: "Novelty wears off"
- White 6-9mo: "Techniques don't work"
- Blue 0-6mo: "Skill didn't change overnight"
- Blue mid: "Flat learning curve"
- Purple early: "Old techniques don't work"

---

## 7. Technique Library (Tutorials)

**Page:** `/TechniqueLibrary` | **Component:** `TechniqueLibrary.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 7.1 | View Toggle | Switch For You / Browse | `viewMode` | All | Done |
| 7.2 | "For You" Recommendations | Personalized video suggestions | `sessions[]`, belt config | All | Done |
| 7.3 | Position Categories | Browse by position | Technique taxonomy | All | Done |
| 7.4 | Mindset Categories | Mental game content | Video library | All | Done |
| 7.5 | Priority Instructors | World-class instruction | Curated library | All | Done |
| 7.6 | Technique Progress | Proficiency tracking | `techniqueProgress[]` | All | Done |
| 7.7 | Video Embeds | Watch in-app | YouTube IDs | All | Done |
| 7.8 | Search | Find techniques/videos | Names, titles | All | Done |

**Belt-Specific Recommendations:**

| Belt | Difficulty | Defense Priority | Recs/Week |
|------|------------|------------------|-----------|
| White | 1-3 | 2x weight | 3 |
| Blue | 2-5 | Balanced | 5 |
| Purple+ | 4-10 | None | 3-5 |

**Gated Categories:**
- Leg Locks: Hidden from White
- Advanced Systems: Hidden from White/Blue

**Position Categories:** Closed Guard, Half Guard, Open Guard, Mount, Side Control, Back Control, Guard Passing, Takedowns, Submissions, Turtle, Clinch

**Mindset Categories:** Belt Journey, Mental Game, Age & Longevity, Lifestyle, Injury & Recovery

---

## 8. Training Feedback (AI Insights)

**Page:** `/TrainingFeedback` | **Component:** `TrainingFeedback.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 8.1 | Daily Insight Generation | One insight/day when conditions met | `sessions[]`, dates | All | Done |
| 8.2 | Typewriter Animation | Engaging text reveal | Insight text | All | Done |
| 8.3 | Belt-Personalized Tone | Language matches belt | `chatbot.*` config | All | Partial |
| 8.4 | Video Suggestions | Related technique videos | Insight topic | All | Done |
| 8.5 | Coach Deferral | Reminder coach is authority | — | All | Done |
| 8.6 | Risk-Aware Messaging | Intervention when risk detected | Risk signals | All | Planned |

**Tone by Belt:**

| Belt | Tone | Encouragement | Depth |
|------|------|---------------|-------|
| White | Warm/supportive | High | 1-2 sentences |
| Blue | Coaching/balanced | Moderate | Paragraphs |
| Purple+ | Peer/analytical | Minimal | Detailed |

**Risk Messages:**
- **White:** "We noticed you've been away. Everything okay?"
- **Blue:** "Blue belt blues are real. This is part of the path."
- **Purple+:** "Your skills don't disappear. We're here when ready."

---

## 9. Profile

**Page:** `/ProfileScreen` | **Component:** `ProfileScreen.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 9.1 | Profile Avatar | Visual identity with belt border | `name`, `belt` | All | Done |
| 9.2 | Completion Tracker | % complete + missing fields | All profile fields | All | Done |
| 9.3 | Progressive Profiling | Contextual questions at milestones | `sessionCount`, schedule | All | Done |
| 9.4 | Editable Fields | Update profile anytime | All profile fields | All | Done |
| 9.5 | Belt Journey Viz | Promotion timeline | `beltHistory[]` | All | Done |
| 9.6 | Training Stats Summary | Sessions, hours, streak, tenure | `sessions[]` | All | Done |
| 9.7 | Settings Access | Navigate to settings | — | All | Done |

**Progressive Profiling Schedule:**

| Session | Question |
|---------|----------|
| 3 | Training start date |
| 5 | Stripes count |
| 7 | Gym name |
| 10 | Training goals |
| 12 | Target frequency |
| 15 | Current belt date |
| 18 | Birth year |

**Belt Timing Adjustments:**
- White: +2 sessions delay
- Purple+: -2 sessions early

**Skip Tolerance:** White/Blue = 3, Purple+ = 2

---

## 10. Settings

**Page:** `/Settings` | **Component:** `Settings.tsx`

| # | Feature | Value | Data | Access | Status |
|---|---------|-------|------|--------|--------|
| 10.1 | Logging Preference | Voice/text mode | `loggingPreference` | All | Done |
| 10.2 | Notification Toggles | Control alerts | Notification prefs | All | Done* |
| 10.3 | Data Export | Export as JSON | All user data | All | Done |
| 10.4 | Demo Mode Toggle | Enable testing mode | Demo flag | All | Done |
| 10.5 | Persona Switcher | Switch test personas | Persona profiles | All | Done |
| 10.6 | Persona Info Display | See active persona details | Active persona | All | Done |
| 10.7 | Profile Reset | Clear all data | — | All | Done |
| 10.8 | App Information | Version, legal, support | App version | All | Done |

*UI complete; actual notifications planned for iOS

**Test Personas:**

| Key | Name | Belt | Status |
|-----|------|------|--------|
| white-excelling | Jake Thompson | W (3 str) | Thriving |
| white-at-risk | David Morrison | W (2 str) | Struggling |
| blue-excelling | Marcus Chen | B (2 str) | Progressing |
| blue-at-risk | Ryan Torres | B (1 str) | Declining |
| purple-average | Sofia Rodriguez | P (1 str) | Stable |
| brown-average | Elena Kim | Br (2 str) | Refined |

---

## 11. Cross-Cutting Systems

These systems affect multiple pages.

### 11.1 Belt Personalization Engine

**Location:** `/prototype/src/config/belt-system/`

| File | Purpose |
|------|---------|
| `belt-profiles.ts` | Psychology profiles (5 belts) |
| `feature-adaptations.ts` | Feature behavior by belt |
| `risk-signals.ts` | Dropout detection (11 signals) |
| `journal-patterns.ts` | Pattern matching in entries |
| `types.ts` | TypeScript definitions |

**Usage:**
```typescript
const { profile, dashboard, sessionLogger, chatbot, videoTutorials } = useBeltPersonalization();
```

### 11.2 Risk Detection

**11 Signals Tracked:**

| Signal | W | B | P+ |
|--------|---|---|-----|
| Gap 14+ days | 1.8x | 1.5x | 0.8x |
| Attendance -30% | 1.6x | 1.4x | 0.9x |
| Negative sentiment | 1.7x | 1.3x | 0.7x |
| Injury mention | 1.5x | 1.2x | 0.6x |
| Streak break | 1.4x | 1.2x | 0.9x |
| Technique stagnation | 0.8x | 1.4x | 1.0x |
| Sparring avoidance | 1.6x | 1.4x | 1.0x |

### 11.3 Journal Pattern Analysis

**9 Pattern Categories:** Ego challenge, Progress, Plateau, Injury, Social, Technique, Competition, Motivation, Teaching

### 11.4 UI Components

**Location:** `/prototype/src/components/ui/`

| Category | Components |
|----------|------------|
| Core | `BeltBadge`, `TrainingBadge`, `StatCard`, `ProgressRing`, `Icons` (95+) |
| States | `EmptyState`, `ErrorState`, `NotFound`, `Skeleton` (6 variants), `Toast` |
| BJJ | `SubmissionPicker`, `BodyHeatMap`, `StyleFingerprint`, `BreakthroughHero`, `TournamentReadinessCard` |
| Media | `YouTubeEmbed`, `VideoThumbnail` |

### 11.5 Data Models

```typescript
interface UserProfile {
  userId, name, belt, stripes, beltPromotionDate,
  trainingStartDate, targetFrequency, gymName,
  trainingGoals[], birthYear, sessionCount, loggingPreference
}

interface Session {
  id, userId, date, trainingType, durationMinutes,
  techniquesDrilled[], didSpar, sparringRounds,
  submissionsGiven[], submissionsReceived[],
  struggles[], workedWell[], notes, energyLevel?, mood?
}
```

---

## Summary

### By Page

| Page | Features | Status |
|------|----------|--------|
| Onboarding | 5 | Done |
| Stats | 19 | Done |
| Session Logger | 9 | Done |
| Session History | 6 | Done |
| Session Detail | 8 | Done |
| Belt Progress | 7 | Partial |
| Technique Library | 8 | Done |
| Training Feedback | 6 | Partial |
| Profile | 7 | Done |
| Settings | 8 | Done |
| Cross-Cutting | 5 | Partial |
| **TOTAL** | **88** | |

### By Belt Access

| Access | Count |
|--------|-------|
| All belts | 58 |
| Blue+ | 18 |
| White only | 4 |
| Blue only | 3 |
| Purple+ | 5 |

---

*Cross-reference: `BACKLOG.md`, `BELT_PERSONALIZATION_SYSTEM.md`, `FEATURE_TRACKER.md`*
