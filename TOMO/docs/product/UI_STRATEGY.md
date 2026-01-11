# BJJ Progress Tracker - UI Strategy

## Overview

This document outlines the UI design strategy for the BJJ Progress Tracker application, mapping features from the product spec to concrete UI components and screens.

---

## User Types & Primary Flows

### 1. Practitioner (Primary User)
The main mobile experience - tracking training, viewing progress, receiving feedback.

### 2. Coach
Hybrid mobile/desktop - giving feedback, managing students, reviewing progress.

### 3. Gym Owner
Primarily desktop - administrative dashboard, metrics, roster management.

---

## Screen Architecture

### Practitioner Mobile App

```
├── Home (Dashboard)
│   ├── Training streak & stats
│   ├── Belt progress summary
│   ├── Recent coach feedback (unread badge)
│   ├── Quick actions (New Entry, View Calendar)
│   └── Focus areas from coach
│
├── Journal
│   ├── Entry List (chronological)
│   ├── New Entry Form
│   │   ├── Training type selector
│   │   ├── Duration input
│   │   ├── Techniques drilled (searchable)
│   │   ├── Sparring log
│   │   ├── Notes (natural language → AI parsing)
│   │   ├── Energy/mood ratings
│   │   └── Privacy toggle
│   └── Entry Detail View
│
├── Progress
│   ├── Belt Timeline (visual journey)
│   ├── Requirements Checklist
│   ├── Position Mastery Heat Map
│   ├── Milestones & Badges
│   └── Goals Management
│
├── Techniques
│   ├── Browse by Position
│   ├── Browse by Belt Level
│   ├── Search
│   ├── Technique Detail
│   │   ├── Description & key points
│   │   ├── Video placeholder
│   │   ├── Related techniques
│   │   └── My proficiency status
│   └── My Technique Log
│
├── Calendar
│   ├── Month view (training days highlighted)
│   ├── Day detail (sessions, classes)
│   └── Attendance stats
│
├── Competition
│   ├── Competition History
│   ├── Match Records
│   ├── Upcoming Events
│   ├── Prep Checklists
│   └── Post-comp Reflection
│
├── Feedback
│   ├── All Feedback (from coaches)
│   ├── Focus Areas (current assignments)
│   ├── Periodic Reviews
│   └── Feedback Detail
│
└── Profile
    ├── Belt & stripe display
    ├── Training stats
    ├── Gym affiliations
    ├── Privacy settings
    └── Goals summary
```

### Coach Interface

```
├── Dashboard
│   ├── Students requiring feedback
│   ├── Recent student activity
│   ├── Promotion candidates
│   └── Quick feedback shortcuts
│
├── Students
│   ├── Student List (by belt/name)
│   ├── Student Detail
│   │   ├── Progress summary
│   │   ├── Recent journal entries
│   │   ├── Feedback history
│   │   ├── Goals
│   │   └── Quick actions
│   └── Batch Feedback Mode
│
├── Feedback
│   ├── Give Feedback
│   │   ├── Select student
│   │   ├── Link to technique/session
│   │   ├── Category selector
│   │   ├── Voice input (AI-assisted)
│   │   └── Review before send
│   ├── Assign Focus Areas
│   └── Write Periodic Review
│
├── Curriculum
│   ├── Technique Library (view/customize)
│   ├── Belt Requirements (edit)
│   └── Class Plans
│
└── Analytics
    ├── Student progress overview
    ├── Class attendance
    └── Feedback given
```

### Gym Owner Dashboard

```
├── Overview
│   ├── Key metrics (members, retention, attendance)
│   ├── Alerts (at-risk members, payments)
│   └── Quick actions
│
├── Roster
│   ├── All Members (sortable/filterable)
│   ├── By Belt Level
│   ├── Member Detail
│   └── Add/Remove Member
│
├── Promotions
│   ├── Pipeline View (ready/close/progressing)
│   ├── Promotion History
│   └── Schedule Ceremony
│
├── Analytics
│   ├── Retention Metrics
│   ├── Attendance Patterns
│   ├── Belt Distribution
│   ├── Growth Trends
│   └── Coach Activity
│
├── Schedule
│   ├── Weekly Calendar
│   ├── Class Management
│   └── Instructor Assignment
│
├── Curriculum
│   ├── Master Curriculum
│   ├── Coach Assignments
│   └── Consistency Audit
│
└── Settings
    ├── Gym Profile
    ├── Coach Management
    └── Integrations
```

---

## Key UI Components

### 1. Belt Progress Indicator
```
┌─────────────────────────────────────┐
│  [====BLUE BELT====] ○ ○ ● ●       │
│  2 stripes • 15 months             │
│  ━━━━━━━━━━━━━━━━━░░░░░ 68%        │
│  6-9 months to purple              │
└─────────────────────────────────────┘
```

**States:**
- Current belt with stripe indicators
- Time at belt
- Progress percentage (visual bar)
- Estimated time to next promotion

### 2. Training Session Card
```
┌─────────────────────────────────────┐
│  Dec 20, 2024               [GI]   │
│  ─────────────────────────────────  │
│  90 min • 2 techniques • 3 rolls   │
│  ─────────────────────────────────  │
│  Energy: ●●●●○  Mood: ●●●○○        │
└─────────────────────────────────────┘
```

### 3. Technique Card
```
┌─────────────────────────────────────┐
│  Armbar from Guard                  │
│  Closed Guard • Submission          │
│  ─────────────────────────────────  │
│  [●●●○○] Developing                 │
│  Drilled 45x • Coach verified ✓     │
└─────────────────────────────────────┘
```

### 4. Coach Feedback Card
```
┌─────────────────────────────────────┐
│  Prof. Ricardo Silva      Dec 19   │
│  ─────────────────────────────────  │
│  [STRENGTH] Toreando Pass          │
│  ─────────────────────────────────  │
│  "Your toreando pass is looking    │
│  sharp. The hip pressure detail    │
│  you picked up today is exactly    │
│  what separates good passers..."   │
│                              [Read] │
└─────────────────────────────────────┘
```

### 5. Position Mastery Heat Map
```
┌─────────────────────────────────────┐
│         POSITION MASTERY            │
│  ─────────────────────────────────  │
│  Closed Guard    [████████░░] 78%  │
│  Back Control    [████████░░] 85%  │
│  Mount           [███████░░░] 71%  │
│  Half Guard      [███████░░░] 72%  │
│  Side Control    [██████░░░░] 65%  │
│  Open Guard      [██████░░░░] 62%  │
│  Turtle          [█████░░░░░] 60%  │
│  Standing        [████░░░░░░] 50%  │
└─────────────────────────────────────┘
```

### 6. Sparring Round Entry
```
┌─────────────────────────────────────┐
│  vs Jake M. (White 3 stripe)        │
│  [WIN] Submission - Armbar          │
│  ─────────────────────────────────  │
│  "Caught him from closed guard"     │
└─────────────────────────────────────┘
```

### 7. Requirements Checklist
```
┌─────────────────────────────────────┐
│  PURPLE BELT REQUIREMENTS           │
│  ─────────────────────────────────  │
│  ✓ Escapes (5/5) - Verified        │
│  ✓ Sweeps (4/4) - Verified         │
│  ○ Guard Passes (3/5)               │
│  ○ Submissions (6/8)                │
│  ○ Takedowns (2/3)                  │
│  ○ Time at Belt (15/18 mo)          │
│  ○ Attendance (178/200)             │
│  ○ Competitions (2/3)               │
│  ○ Teaching (0/1)                   │
└─────────────────────────────────────┘
```

### 8. Goal Card
```
┌─────────────────────────────────────┐
│  🎯 Earn Purple Belt                │
│  Target: Sep 2025                   │
│  ━━━━━━━━━━━━━░░░░░░░░░ 68%        │
│  [Coach visible]                    │
└─────────────────────────────────────┘
```

### 9. Milestone Badge
```
┌───────────┐
│    🥋     │
│ Blue Belt │
│ Sep 2023  │
└───────────┘
```

### 10. Focus Area Banner
```
┌─────────────────────────────────────┐
│  📌 CURRENT FOCUS                   │
│  Guard Passing Fundamentals         │
│  Assigned by Prof. Ricardo          │
│  "Master toreando, knee cut, and    │
│  double under passes."              │
│                    [Mark Complete]  │
└─────────────────────────────────────┘
```

---

## Navigation Patterns

### Mobile Bottom Tab Bar
```
┌─────────────────────────────────────┐
│  [Home] [Journal] [+] [Progress] [Profile]
└─────────────────────────────────────┘
```
- Home: Dashboard overview
- Journal: Training log
- (+): Quick add new entry (prominent FAB style)
- Progress: Belt tracking, techniques
- Profile: Settings, stats

### Coach/Owner Sidebar (Desktop)
```
┌────────────┐
│ Dashboard  │
│ Students   │
│ Feedback   │
│ Curriculum │
│ Analytics  │
│ Settings   │
└────────────┘
```

---

## Key Interactions

### 1. Natural Language Journal Entry
```
User types: "Great class today, drilled armbars and
triangles. Got tapped by Sarah with a heel hook but
caught Tommy with an RNC."

→ AI extracts:
  - Techniques: Armbar, Triangle, Heel Hook, RNC
  - Sparring: Loss to Sarah (Heel Hook), Win vs Tommy (RNC)

→ User reviews and confirms extracted data
→ Auto-populates technique log and sparring record
```

### 2. Voice Feedback (Coach)
```
Coach speaks: "Marcus had a good class, his toreando
is improving but he needs to work on the underhook
for knee cut."

→ AI transcribes and cleans up
→ Extracts techniques: Toreando, Knee Cut
→ Suggests category: needs-work
→ Coach reviews, edits if needed, sends
```

### 3. Progress Celebration
```
When user completes milestone:
→ Animated badge unlock
→ Confetti effect
→ "Share with teammates" option
→ Added to milestone collection
```

---

## Design Tokens Applied

### Colors
- **Primary actions**: `--color-accent-button` (gold)
- **Belt colors**: Use belt-specific colors for badges
- **Training types**: `--color-training-gi`, `--color-training-nogi`, etc.
- **Feedback categories**:
  - Strength: `--color-success`
  - Needs work: `--color-warning`
  - Drill focus: `--color-info`

### Typography
- **Screen titles**: H2, uppercase, Montserrat
- **Card titles**: H4, uppercase
- **Body text**: Open Sans, regular
- **Stats**: `stat-value` class (large, bold, accent color)

### Spacing
- Card padding: `--space-lg` (24px)
- Section gaps: `--space-xl` (32px)
- List item gaps: `--space-md` (16px)

---

## Responsive Breakpoints

| Breakpoint | Target | Primary Use |
|------------|--------|-------------|
| < 768px | Mobile | Practitioner app |
| 768-1024px | Tablet | Coach on-the-go |
| > 1024px | Desktop | Gym owner dashboard, Coach feedback |

---

## Priority Screens for Prototype

### Phase 1: Core Practitioner Experience
1. ✅ Home Dashboard
2. Journal Entry List + New Entry
3. Progress Overview (belt, requirements)
4. Technique Browser
5. Profile

### Phase 2: Feedback Loop
6. Coach Feedback View
7. Focus Areas
8. Goals Management

### Phase 3: Advanced Features
9. Competition Tracking
10. Position Mastery Heat Map
11. Milestones & Badges

### Phase 4: Coach/Owner
12. Coach Student List
13. Give Feedback Form
14. Owner Dashboard
15. Roster Management

---

## Mock Data Reference

All mock data is centralized in:
```
/prototype/src/data/
├── index.ts        # Central exports
├── users.ts        # Practitioners, coaches, owners
├── techniques.ts   # Technique library, curriculum
├── journal.ts      # Training sessions, sparring
├── progress.ts     # Belt tracking, goals, milestones
├── feedback.ts     # Coach feedback, focus areas
├── competitions.ts # Match history, prep
└── gym.ts          # Gym info, schedules, roster
```

### Current User for Prototype
- **Marcus Chen** - Blue belt, 2 stripes
- Training since March 2022
- 247 total sessions
- Working toward purple belt (68% complete)
