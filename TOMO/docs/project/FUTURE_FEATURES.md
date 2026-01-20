# TOMO Future Features - Deferred Scope

**Status:** DEFERRED - Phase 4+
**Last Updated:** January 19, 2026
**Source:** Extracted from original product vision (December 2024)

---

## Overview

This document preserves the **Coach** and **Gym Owner** feature scope that was part of the original TOMO product vision. These features have been intentionally deferred to focus the MVP on the **Practitioner** experience.

The deferred features are documented here to:
1. Preserve the original vision for future development
2. Provide clear scope for Phase 4+ planning
3. Inform practitioner features that will eventually connect to coach/owner systems

---

## Deferred User Types

| User Type | Primary Platform | Status | Target Phase |
|-----------|------------------|--------|--------------|
| **Practitioner** | Mobile (iOS/Android) | **ACTIVE** | Phase 1-3 |
| **Coach** | Hybrid (Mobile + Desktop) | DEFERRED | Phase 4A |
| **Gym Owner** | Desktop | DEFERRED | Phase 4B |

---

## Phase 4A: Coach Features

### User Profile

**Coach Profile Requirements:**
- Credentials and belt rank
- Lineage (instructor genealogy)
- Gyms they teach at (multi-gym support)
- Teaching specializations

### Coach Feedback System

**Core Features:**
- Send feedback tied to specific techniques or sessions
- Feedback categories: Strength, Needs Work, Drill Recommendation
- Private messaging between coach and practitioner
- Periodic review summaries
- Focus areas (visible on practitioner dashboard)
- Read receipts for sent feedback

**User Stories:**

| ID | Story |
|----|-------|
| 22 | As a coach, I want to send feedback about a specific technique, so that the student knows exactly what to work on. |
| 23 | As a coach, I want to categorize feedback as strength or needs work, so that students get balanced input. |
| 25 | As a coach, I want to assign focus areas that appear on the student's dashboard, so that they know their priorities. |
| 26 | As a coach, I want to know when a student has read my feedback, so that I can follow up if needed. |
| 41 | As a coach, I want to see aggregate analytics for my students, so that I can improve my teaching. |
| 50 | As a coach, I want to be notified when students complete significant milestones, so that I can acknowledge them. |

### Voice-Assisted Feedback (AI-Powered)

**Core Features:**
- Voice-to-text recording for coaches
- LLM processing that cleans up transcription for clarity
- Automatic extraction and tagging of mentioned techniques
- Suggested categorization (strength, needs work, drill focus)
- Coach review/edit of AI-processed feedback before delivery
- Quick feedback templates triggered by voice
- Batch feedback after class (rapid-fire notes on multiple students)
- Searchable feedback history

**User Stories:**

| ID | Story |
|----|-------|
| 57 | As a coach, I want to record voice feedback on my phone after class, so that I don't have to type while I'm tired. |
| 58 | As a coach, I want my spoken feedback automatically transcribed and cleaned up, so that it reads professionally. |
| 59 | As a coach, I want techniques I mention to be automatically tagged, so that feedback is linked to the curriculum. |
| 60 | As a coach, I want to review AI-processed feedback before it goes to students, so that I maintain control. |
| 61 | As a coach, I want to give quick feedback to multiple students in a batch, so that I can efficiently capture thoughts after class. |
| 62 | As a coach, I want to search past feedback I've given, so that I can maintain consistency and track themes. |

### Coach Interface - Screen Architecture

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

### Technique Endorsement

- Coach can endorse specific techniques that a student has demonstrated proficiency in
- Endorsements appear on practitioner's technique cards
- Endorsements contribute to belt requirements completion

**User Story:**

| ID | Story |
|----|-------|
| 20 | As a coach, I want to endorse specific techniques that a student has demonstrated proficiency in, so that their progress is validated. |

### Curriculum Management

- Coach ability to create custom curriculum for their gym
- IBJJF or standard curriculum as default template
- Customize which techniques are required for each belt

**User Stories:**

| ID | Story |
|----|-------|
| 8 | As a coach, I want to customize which techniques are required for each belt at my gym, so that the curriculum reflects my teaching philosophy. |

---

## Phase 4B: Gym Owner Features

### Gym Owner Dashboard

**Core Features:**
- Roster management
- Aggregate student progress views
- Promotion pipeline (who's close to next belt)
- Retention metrics
- Class attendance patterns
- Coach performance/activity tracking
- Curriculum management across multiple coaches

**User Stories:**

| ID | Story |
|----|-------|
| 42 | As a gym owner, I want to see all students organized by belt level, so that I can manage my roster effectively. |
| 43 | As a gym owner, I want to see which students are close to promotion, so that I can plan belt ceremonies. |
| 44 | As a gym owner, I want to see retention metrics, so that I can identify and address student drop-off. |
| 45 | As a gym owner, I want to see which classes have the best attendance, so that I can optimize scheduling. |
| 46 | As a gym owner, I want to ensure all coaches are using a consistent curriculum, so that students get a unified experience. |

### Gym Owner Interface - Screen Architecture

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

## Phase 4C: Practitioner Learning Features

> **Added:** January 19, 2026

### White Belt Flashcards

**Purpose:** Help white belts learn BJJ terminology and recognize techniques through spaced repetition flashcards.

**Why This Matters:**
- White belts experience "technique overload" - hearing dozens of new terms per class
- Vocabulary barrier contributes to feeling lost and considering quitting
- Voice logging works better when users know technique names
- Supports the "survival" phase by building mental vocabulary

**Core Features:**
- Flashcard deck organized by position (guard, mount, side control, etc.)
- Each card: Technique name + visual (photo/illustration) + brief description
- Spaced repetition algorithm (SM-2 or similar)
- Progress tracking: "You know 47 of 120 white belt techniques"
- Integration with session logging: "You drilled kimura today - review it?"
- Optional quiz mode before belt progress assessment

**Card Content:**
| Category | Example Cards |
|----------|---------------|
| Positions | Closed guard, mount, side control, back control, half guard |
| Escapes | Hip escape (shrimp), bridge and roll, elbow-knee escape |
| Sweeps | Scissor sweep, hip bump, flower sweep |
| Submissions | Armbar, triangle, rear naked choke, kimura, americana |
| Concepts | Posture, base, frames, grips, pressure |

**Belt Personalization:**
- White belt: Core 50-100 fundamental techniques
- Blue belt: Expanded deck with variations and chains
- Purple+: Deck becomes reference, not learning tool

**User Stories:**

| ID | Story |
|----|-------|
| F1 | As a white belt, I want to learn technique names through flashcards, so that I can follow along in class. |
| F2 | As a white belt, I want to see pictures of techniques, so that I can recognize them when I see them. |
| F3 | As a white belt, I want the app to remind me to review techniques I'm forgetting, so that I retain vocabulary. |
| F4 | As a white belt, I want to review techniques I drilled today, so that the names stick in my memory. |

**Technical Considerations:**
- Could leverage existing Technique Library taxonomy
- Spaced repetition requires local storage of review schedule
- Images need to be curated/licensed or illustrated
- Consider integration with video tutorials (tap flashcard → watch technique)

**First Principles Alignment:**
- #2 (Capture Important Data, Easily) - Knowing names makes voice logging easier
- #4 (Be Helpful) - Practical tool that solves real white belt problem
- #5 (Belt Psychology) - Designed specifically for white belt survival phase
- #6 (Respect the Difficulty) - Acknowledges vocabulary barrier is real

**Complexity:** M
**Target Phase:** 4C or could be earlier if demand is high

---

## Phase 4D: Social / Community Features

**Core Features:**
- Training partner connections
- Teammate progress visibility (opt-in)
- Gym leaderboards (attendance, rolls, etc.)
- Kudos/props system for teammates
- Shared technique notes between training partners

**User Stories:**

| ID | Story |
|----|-------|
| 52 | As a practitioner, I want to connect with my regular training partners, so that I can coordinate rolls. |
| 53 | As a practitioner, I want to opt-in to showing my progress, so that my teammates can see my journey. |
| 54 | As a practitioner, I want to see gym leaderboards for attendance, so that I'm motivated by healthy competition. |
| 55 | As a practitioner, I want to give props to teammates who hit milestones, so that I can encourage them. |
| 56 | As a practitioner, I want to share technique notes with my regular training partner, so that we can learn together. |

---

## Integration Points with Practitioner App

When Phase 4 features are built, they will connect to the practitioner app through:

| Practitioner Feature | Coach/Owner Connection |
|---------------------|------------------------|
| Session logging | Coach sees recent entries (with permission) |
| Technique progress | Coach can endorse techniques |
| Belt progress | Coach reviews for promotion readiness |
| Focus areas | Coach assigns, practitioner sees on dashboard |
| Goals | Coach visibility (practitioner opt-in) |
| Feedback display | Coach sends, practitioner receives |

### Practitioner Features Already Designed for Coach Integration

These practitioner features were designed with future coach integration in mind:

1. **Privacy toggle on journal entries** - Allows practitioner to control what coach sees
2. **Coach-visible goals** - Opt-in visibility for goal sharing
3. **Feedback section in session detail** - Placeholder for coach feedback display
4. **Belt progress requirements** - Will display coach endorsements when available

---

## Technical Considerations

### Permission Model

```
Practitioner
└── Affiliates with Gym
    └── Coach can see:
        ├── Coach-visible journal entries
        ├── Technique progress (always)
        ├── Belt progress (always)
        ├── Goals (if shared)
        └── Attendance (always)
```

### Data Architecture

The current Supabase schema should be extended for Phase 4:

**New Tables:**
- `coaches` - Coach profiles and credentials
- `gym_owners` - Owner profiles and gym associations
- `coach_feedback` - Feedback entries from coach to practitioner
- `technique_endorsements` - Coach verification of technique proficiency
- `focus_areas` - Coach-assigned focus areas
- `gym_roster` - Member associations and roles

### API Endpoints (Future)

```
/api/coach/students           # Coach's student roster
/api/coach/feedback           # Send/receive feedback
/api/coach/endorsements       # Endorse techniques
/api/owner/roster             # Gym member management
/api/owner/analytics          # Retention, attendance metrics
/api/owner/promotions         # Promotion pipeline
```

---

## First Principles Alignment

These deferred features must align with TOMO's First Principles when implemented:

| Principle | Coach/Owner Application |
|-----------|------------------------|
| #7 Amplify Coaches, Never Replace | Coach app provides tools, doesn't automate decisions |
| #8 Connection Matters | Strengthens coach-student relationship |
| #9 Specificity Over Encouragement | Coach feedback is specific, not generic praise |
| #11 Flashlight, Not the Path | Shows data to coach, doesn't prescribe actions |

---

## Estimated Scope

| Phase | Features | Complexity |
|-------|----------|------------|
| 4A: Coach Core | Feedback system, student view, endorsements | L |
| 4A: Coach Voice | AI-assisted voice feedback | M |
| 4B: Owner Dashboard | Roster, analytics, promotions | L |
| 4C: Practitioner Learning | White belt flashcards, spaced repetition | M |
| 4D: Social | Training partners, leaderboards, kudos | M |

---

## References

- Original feature list: `/docs/product/_archived/BJJ_Progress_Tracker_Feature_List.md`
- Original UI strategy: `/docs/product/_archived/UI_STRATEGY.md`
- Current practitioner features: `/docs/product/FEATURES.md`
- Project roadmap: `/docs/project/ROADMAP.md`

---

*This document will be updated as Phase 4 planning begins.*
