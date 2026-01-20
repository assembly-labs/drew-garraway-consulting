# TOMO Product Architecture Overview

> **Purpose:** This document provides a 10,000ft view of TOMO, then breaks down the product by pages, features, and belt-level variations. Use this as your source of truth for understanding what we're building before moving into development.
>
> **Audience:** Product managers, developers, designers moving from prototyping to development
>
> **Last Updated:** January 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The 10,000ft View](#2-the-10000ft-view)
3. [Site Architecture Map](#3-site-architecture-map)
4. [Page-by-Page Breakdown](#4-page-by-page-breakdown)
5. [Belt Personalization Matrix](#5-belt-personalization-matrix)
6. [Feature Variations by Belt](#6-feature-variations-by-belt)
7. [Data Flow Architecture](#7-data-flow-architecture)
8. [Risk: What Could Go Wrong](#8-risk-what-could-go-wrong)
9. [Development Recommendations](#9-development-recommendations)
10. [Appendix: Technical Reference](#appendix-technical-reference)

---

## 1. Executive Summary

### What is TOMO?

TOMO (友 - "friend" in Japanese) is a **voice-first training journal** for Brazilian Jiu-Jitsu practitioners. It helps users log training sessions at the critical post-training moment when information is fresh but users are exhausted.

### Core Differentiator

Unlike generic fitness apps, TOMO uses a **psychology-based personalization engine** that adapts every feature based on the user's belt level. The app doesn't just show different data—it fundamentally changes:

- **What metrics are shown** (white belts see streak, purple belts see teaching sessions)
- **How we communicate** (encouraging for white, analytical for brown)
- **What content we recommend** (basic escapes vs. advanced leg lock systems)
- **When we intervene** (dropout risk detection varies by belt)

### The Problem We're Solving

| BJJ Problem | TOMO Solution |
|------------|---------------|
| 70-90% of white belts quit within 6 months | Streak-focused metrics, survival framing, dropout risk detection |
| Post-training exhaustion = poor recall | Voice-first logging, 90-second capture window |
| "Blue belt blues" identity crisis | Game development focus, plateau normalization |
| Progress feels invisible | Belt-adaptive visualizations, breakthrough detection |
| Generic apps don't understand BJJ | BJJ-native terminology, technique library, sparring tracking |

### Current Status

| Phase | Status |
|-------|--------|
| Web Prototype | **COMPLETE** - Production at bjjj.pages.dev |
| iOS TestFlight | Not started |
| Backend (Supabase) | Not started |
| Voice Transcription (AssemblyAI) | Not started |

---

## 2. The 10,000ft View

### Product Vision

```
┌─────────────────────────────────────────────────────────────────┐
│                         TOMO ECOSYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    PRACTITIONER APP                      │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│   │  │Dashboard │ │ Journal  │ │Technique │ │ Insights │    │   │
│   │  │  (Stats) │ │(Sessions)│ │ Library  │ │(Coaching)│    │   │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│   │                      │                                   │   │
│   │              ┌───────┴───────┐                          │   │
│   │              │Session Logger │  ← Voice-first entry     │   │
│   │              │ (Voice/Text)  │                          │   │
│   │              └───────────────┘                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │  PERSONALIZATION  │                        │
│                    │      ENGINE       │                        │
│                    │  (Belt-Adaptive)  │                        │
│                    └───────────────────┘                        │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│       ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│       │  WHITE   │    │   BLUE   │    │  PURPLE+ │             │
│       │ Survival │    │ Identity │    │ Systems  │             │
│       │   Mode   │    │  Crisis  │    │ Thinking │             │
│       └──────────┘    └──────────┘    └──────────┘             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     FUTURE EXPANSIONS                           │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │ Coach Portal │  │  Gym Owner   │  │  Community   │         │
│   │              │  │  Dashboard   │  │   Features   │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### User Journey Overview

```
NEW USER                    ACTIVE USER                    RETAINED USER
────────                    ───────────                    ─────────────

Onboarding                  Training Session               Long-term
(Name + Belt)               └─→ Voice Log (90 sec)         └─→ Session History
    │                           │                              └─→ Progress Tracking
    ▼                           ▼                              └─→ Technique Mastery
Dashboard ←─────────────────────┴──────────────────────────────────┘
    │
    ├─→ View Stats (belt-adaptive)
    ├─→ Browse Techniques (belt-filtered)
    ├─→ Read Insights (belt-toned)
    └─→ Track Progress (belt-contextualized)
```

### Core User States

**Critical distinction that affects ALL design decisions:**

| Context | User State | Time Window | Design Approach |
|---------|------------|-------------|-----------------|
| **Session Logging** | EXHAUSTED | 90 seconds | Voice-first, minimal friction, one question at a time |
| **Everything Else** | RELAXED | Unlimited | Rich data, deep exploration, detailed content OK |

This means the Session Logger is designed completely differently from every other screen.

---

## 3. Site Architecture Map

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                  │
│  [← Back]              TOMO              [Demo] [Avatar]        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MAIN CONTENT                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   PRIMARY SCREENS                        │    │
│  │                                                          │    │
│  │   Dashboard ──────► Session History ──────► Session      │    │
│  │   (stats)           (journal)              Detail        │    │
│  │      │                                        │          │    │
│  │      │                                        ▼          │    │
│  │      │                                    Edit Sheet     │    │
│  │      │                                                   │    │
│  │   Technique ──────► Video Player                         │    │
│  │   Library           (UpNextVideos)                       │    │
│  │      │                                                   │    │
│  │   Training ──────► Insight Detail                        │    │
│  │   Feedback                                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  SECONDARY SCREENS                       │    │
│  │                                                          │    │
│  │   Profile ──────► Settings                               │    │
│  │   Screen          (Preferences, Demo Mode)               │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    OVERLAY SCREENS                       │    │
│  │                                                          │    │
│  │   Session Logger ──────► Voice Recording ──────► Review  │    │
│  │   (full-screen)          (capture phase)        (confirm)│    │
│  │                                                          │    │
│  │   Profile Nudge ──────► (Progressive profiling modal)    │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          TAB BAR                                 │
│     [Stats]       [Journal]       [Library]       [Insights]    │
└─────────────────────────────────────────────────────────────────┘
```

### Screen Inventory

| Screen | File | Tab | Purpose | Belt-Adaptive? |
|--------|------|-----|---------|----------------|
| Dashboard | `Dashboard.tsx` | stats | Primary hub - stats, insights, attack profiles | **YES** - metrics, messaging |
| Session History | `SessionHistory.tsx` | journal | Scrolling feed of logged sessions | **YES** - card complexity |
| Session Detail | `SessionDetail.tsx` | journal→ | Full session view with edit capability | **YES** - sections shown |
| Technique Library | `TechniqueLibrary.tsx` | library | Browsable technique catalog | **YES** - categories, difficulty |
| Training Feedback | `TrainingFeedback.tsx` | insights | AI-generated coaching insights | **YES** - tone, focus areas |
| Profile Screen | `ProfileScreen.tsx` | header→ | User profile, training time, completion % | **YES** - profiling questions |
| Settings | `Settings.tsx` | profile→ | Preferences, demo mode, data export | No |
| Session Logger | `VoiceFirstLogger.tsx` | overlay | Voice-first session capture | **YES** - prompts, suggestions |

---

## 4. Page-by-Page Breakdown

### 4.1 Dashboard (stats tab)

**Purpose:** Primary hub showing training statistics and insights

**Components:**
```
Dashboard
├── Hero Stats Section
│   ├── Primary Metric (belt-dependent)
│   ├── Secondary Metrics (2-3, belt-dependent)
│   └── Streak Visualization
│
├── Insights Grid
│   ├── Breakthrough Detection Card
│   ├── Training Pattern Analysis
│   └── Belt-Specific Recommendations
│
├── Attack Profile (blue+)
│   ├── Style Fingerprint (6-axis radar)
│   ├── Deadliest Attack Card
│   └── Achilles Heel Card
│
├── Sparring Overview (purple+)
│   ├── Body Heat Map
│   └── Submission Breakdown
│
└── Quick Actions
    └── "Log Session" Button
```

**Belt Variations:**

| Element | White | Blue | Purple | Brown |
|---------|-------|------|--------|-------|
| Primary Metric | Session Streak | Technique Variety | Sparring Rounds | Teaching Sessions |
| Secondary Metrics | Sessions this week, Total | Streak, Rounds, Time at belt | Teaching, Variety, Sub ratio | Rounds, Sub ratio |
| Attack Profile | Hidden | Shown | Shown | Shown |
| Sparring Grid | Hidden | Hidden | Shown | Shown |
| Insight Focus | Survival | Game Development | Systems | Refinement |
| Celebration | Every 10 sessions | Every 25 | Every 50 | Every 100 |

---

### 4.2 Session History (journal tab)

**Purpose:** Scrollable feed of training sessions

**Components:**
```
Session History
├── Filter Pills
│   ├── All / This Week / This Month
│   └── Gi / NoGi / Both
│
├── Session Cards (JournalEntryCard)
│   ├── Date + Time
│   ├── Training Type Badge
│   ├── Duration
│   ├── Lesson Topic
│   ├── Techniques Drilled (blue+)
│   ├── Sparring Rounds (blue+)
│   ├── Submissions Given/Received (purple+)
│   └── Worked Well / Struggled (blue+)
│
└── Empty State (if no sessions)
    └── Belt-specific encouragement message
```

**Belt Variations:**

| Card Element | White | Blue | Purple+ |
|--------------|-------|------|---------|
| Basic info (date, type, duration) | Shown | Shown | Shown |
| Lesson topic | Shown | Shown | Shown |
| Techniques drilled | Hidden | Shown | Shown |
| Sparring rounds | Hidden | Shown | Shown |
| Submissions breakdown | Hidden | Hidden | Shown |
| Worked well / Struggles | Hidden | Shown | Shown |

---

### 4.3 Session Logger (overlay)

**Purpose:** Capture training details immediately post-session

**Design Philosophy:** This is the ONLY screen where users are exhausted. Every other screen assumes relaxed browsing.

**Components:**
```
Voice First Logger
├── Entry Phase
│   ├── Quick Fields (date, type, duration)
│   └── "Start Recording" Button (primary action)
│
├── Recording Phase
│   ├── Waveform Visualization
│   ├── Belt-Adaptive Prompt (displayed during recording)
│   ├── Timer
│   └── Stop Button
│
├── Review Phase
│   ├── Transcription Display
│   ├── Extracted Data Chips
│   │   ├── Techniques (auto-detected)
│   │   ├── Submissions (auto-parsed)
│   │   └── Struggles/Wins (identified)
│   ├── Edit Fields (tap to modify)
│   └── Save Button
│
└── Success Phase
    ├── Confirmation Animation
    ├── Post-Session Message (belt-specific)
    └── Return to Journal
```

**Belt Variations:**

| Element | White | Blue | Purple | Brown |
|---------|-------|------|--------|-------|
| Prompt Tone | Encouraging | Neutral | Analytical | Analytical |
| Example Prompts | "Did anything feel less chaotic?" | "What techniques did you work on?" | "What systems did you focus on?" | "What did you refine?" |
| Technique Suggestions | 5 (basic) | 10 (intermediate) | 15 (advanced) | 20 (expert) |
| Post-Session Message | "Consistency beats intensity..." | "Keep developing your game..." | "Your depth grows..." | "The final approach continues..." |

---

### 4.4 Technique Library (library tab)

**Purpose:** Browsable technique catalog with video recommendations

**Components:**
```
Technique Library
├── View Toggle
│   ├── "For You" (personalized recommendations)
│   └── "Browse" (category navigation)
│
├── For You View
│   ├── Recommended Videos (belt-filtered)
│   ├── Technique of the Week
│   └── Recently Drilled Techniques
│
├── Browse View
│   ├── Category List
│   │   ├── Guards
│   │   ├── Passes
│   │   ├── Submissions
│   │   ├── Sweeps
│   │   ├── Escapes
│   │   └── Takedowns
│   │
│   └── Technique Cards
│       ├── Name
│       ├── Belt Requirement
│       ├── Video Count
│       └── Proficiency Level
│
└── Video Player (UpNextVideos)
    ├── YouTube Embed
    ├── Video Queue
    └── Related Techniques
```

**Belt Variations:**

| Element | White | Blue | Purple | Brown |
|---------|-------|------|--------|-------|
| Categories Shown | Escapes, Basic Guards, Fundamental Positions | + Guard Systems, Passing, Submission Chains | + Advanced Guards, Leg Locks, Combinations | All Categories |
| Video Difficulty | 1-3 | 2-5 | 4-8 | 6-10 |
| Recommendations/Week | 3 | 5 | 5 | 3 (quality focus) |
| Sample Instructors | Roy Dean, Gracie Barra | Ryan Hall, Stephan Kesting | John Danaher, Gordon Ryan | Craig Jones, Lachlan Giles |

---

### 4.5 Training Feedback (insights tab)

**Purpose:** AI-generated coaching insights based on session data

**Components:**
```
Training Feedback
├── Daily Insight Card
│   ├── Generated 1x/day when new session logged
│   ├── Belt-Appropriate Coaching Message
│   └── Actionable Recommendation
│
├── Pattern Analysis
│   ├── Training Consistency Trends
│   ├── Technique Improvement Tracking
│   └── Sparring Performance Patterns
│
├── Breakthrough Detection
│   ├── Recent Achievements
│   └── Progress Milestones
│
└── Focus Recommendations
    ├── This Week's Focus Area
    └── Suggested Techniques to Review
```

**Belt Variations:**

| Element | White | Blue | Purple | Brown |
|---------|-------|------|--------|-------|
| Tone | Warm, Supportive | Coaching, Direct | Collaborative, Technical | Peer-to-Peer |
| Encouragement Level | High | Moderate | Low | Minimal |
| Topics Emphasized | Survival, escapes, relaxation | Game development, guard work | Systems, teaching insights | Refinement, efficiency |
| Topics Avoided | Competition, leg locks | Advanced competition | None | None |

---

### 4.6 Profile Screen

**Purpose:** User profile, training stats, progressive profiling

**Components:**
```
Profile Screen
├── Profile Header
│   ├── Avatar
│   ├── Name
│   ├── Belt Badge
│   └── Total Training Time
│
├── Profile Completion
│   ├── Completion Percentage
│   ├── Unanswered Questions Indicator
│   └── "Complete Profile" CTA
│
├── Training Stats Summary
│   ├── Time Since Starting
│   ├── Sessions Logged
│   └── Current Streak
│
├── Profile Nudge Modal (if questions available)
│   ├── Question (one at a time)
│   ├── Answer Options
│   └── Skip Button
│
└── Settings Button
```

**Progressive Profiling Schedule:**

| Session # | Question Asked |
|-----------|----------------|
| 3 | Training start date |
| 5 | Stripes count |
| 7 | Gym name |
| 10 | Training goals |
| 12 | Target frequency |
| 15 | Current belt date |
| 18 | Birth year |

Users can skip questions up to 3 times before we stop asking.

---

### 4.7 Settings

**Purpose:** App preferences, demo mode, data management

**Components:**
```
Settings
├── Logging Preferences
│   ├── Voice First (default)
│   ├── Text First
│   └── Ask Each Time
│
├── Notifications
│   ├── Training Reminders
│   └── Weekly Summary
│
├── Data Management
│   ├── Export Data (JSON)
│   └── Clear All Data
│
├── Demo Mode (prototype only)
│   ├── Persona Selector
│   │   ├── white-excelling (Jake)
│   │   ├── white-at-risk (David)
│   │   ├── blue-excelling (Marcus)
│   │   ├── blue-at-risk (Ryan)
│   │   ├── purple-average (Sofia)
│   │   └── brown-average (Elena)
│   └── Exit Demo Mode
│
└── About
    ├── Version
    └── Credits
```

---

## 5. Belt Personalization Matrix

### Overview

The personalization engine adapts 6 different feature areas across 5 belt levels:

```
                    ┌─────────────────────────────────────────────┐
                    │         BELT PERSONALIZATION ENGINE         │
                    └─────────────────────────────────────────────┘
                                         │
         ┌───────────────┬───────────────┼───────────────┬───────────────┐
         ▼               ▼               ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │  WHITE  │    │  BLUE   │    │ PURPLE  │    │  BROWN  │    │  BLACK  │
    │Survival │    │Identity │    │ Systems │    │Refinemt │    │ Mastery │
    │  Mode   │    │ Crisis  │    │Thinking │    │ & Final │    │& Legacy │
    └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
         │               │               │               │               │
         └───────────────┴───────────────┴───────────────┴───────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
              ┌─────┴─────┐        ┌─────┴─────┐        ┌─────┴─────┐
              │ DASHBOARD │        │  SESSION  │        │  CHATBOT  │
              │ADAPTATION │        │  LOGGER   │        │ADAPTATION │
              └───────────┘        │ADAPTATION │        └───────────┘
                                   └───────────┘
              ┌───────────┐        ┌───────────┐        ┌───────────┐
              │   VIDEO   │        │   BELT    │        │PROGRESSIVE│
              │ TUTORIALS │        │ PROGRESS  │        │ PROFILING │
              │ADAPTATION │        │ADAPTATION │        │ADAPTATION │
              └───────────┘        └───────────┘        └───────────┘
```

### Psychology by Belt Level

| Belt | Stage Name | Dropout Risk | Peak Risk Window | Core Psychology |
|------|------------|--------------|------------------|-----------------|
| **WHITE** | Survival Mode | CRITICAL (70-90%) | Months 3-6 | Ego death, analysis paralysis, novelty fading |
| **BLUE** | Identity Crisis | HIGH (50-60%) | Months 0-12 post-promo | Post-goal emptiness, imposter syndrome, 2-4yr timeline |
| **PURPLE** | Systems Thinking | MODERATE | Life circumstances | "Loneliest belt", balancing teaching vs training |
| **BROWN** | Refinement | LOW | None | Almost-there psychology, responsibility mindset |
| **BLACK** | Mastery & Contribution | LOW | None | Teaching identity, physical wear management |

### Feature Adaptation Summary

| Feature Area | WHITE | BLUE | PURPLE | BROWN |
|--------------|-------|------|--------|-------|
| **Primary Metric** | Streak | Technique Variety | Sparring Rounds | Teaching Sessions |
| **Messaging Tone** | Encouraging | Neutral | Analytical | Peer-to-Peer |
| **Video Difficulty** | 1-3 | 2-5 | 4-8 | 6-10 |
| **Technique Suggestions** | 5 | 10 | 15 | 20 |
| **Streak Emphasis** | HIGH | Moderate | Low | Low |
| **Show Timeline Estimates** | NO | Yes | Yes | Yes |
| **Profiling Speed** | Fast | Standard | Delayed | Minimal |

---

## 6. Feature Variations by Belt

### 6.1 Dashboard Adaptations

```
WHITE BELT DASHBOARD                    BLUE BELT DASHBOARD
┌────────────────────────┐             ┌────────────────────────┐
│   SESSION STREAK       │             │  TECHNIQUE VARIETY     │
│      ████ 14           │             │      ████ 23           │
│   (primary focus)      │             │   (primary focus)      │
├────────────────────────┤             ├────────────────────────┤
│ This Week: 3           │             │ Streak: 14 | Rounds: 42│
│ Total: 27              │             │ Time at Belt: 8 months │
├────────────────────────┤             ├────────────────────────┤
│   SURVIVAL SKILLS      │             │   GAME DEVELOPMENT     │
│ □ Mount escape         │             │ ■ Guard retention      │
│ □ Side control survive │             │ ■ Sweep combos         │
│ ■ Basic hip escape     │             │ □ Submission chains    │
└────────────────────────┘             ├────────────────────────┤
                                       │   ATTACK PROFILE       │
                                       │ [Style Fingerprint]    │
                                       │ [Deadliest: Armbar]    │
                                       └────────────────────────┘


PURPLE BELT DASHBOARD                   BROWN BELT DASHBOARD
┌────────────────────────┐             ┌────────────────────────┐
│   SPARRING ROUNDS      │             │  TEACHING SESSIONS     │
│      ████ 156          │             │      ████ 47           │
│   (primary focus)      │             │   (primary focus)      │
├────────────────────────┤             ├────────────────────────┤
│ Teaching: 12 | Variety:│             │ Rounds: 89 | Sub Ratio:│
│ 34 | Sub Ratio: 2.3    │             │ 3.1                    │
├────────────────────────┤             ├────────────────────────┤
│   SYSTEMS MASTERY      │             │   REFINEMENT FOCUS     │
│ [System Map Visual]    │             │ [Efficiency Metrics]   │
├────────────────────────┤             ├────────────────────────┤
│   SPARRING GRID        │             │   SPARRING GRID        │
│ [Body Heat Map]        │             │ [Body Heat Map]        │
│ [Submission Breakdown] │             │ [Submission Breakdown] │
└────────────────────────┘             └────────────────────────┘
```

### 6.2 Session Logger Adaptations

**White Belt Logger:**
```
┌────────────────────────────────────┐
│         LOG YOUR SESSION           │
├────────────────────────────────────┤
│                                    │
│   [🎤 TAP TO START RECORDING]     │
│                                    │
│   "Did anything feel less         │
│    chaotic today?"                 │
│                                    │
│   ─────────────────────────────   │
│                                    │
│   Suggested techniques:            │
│   • Mount escape                   │
│   • Hip escape                     │
│   • Guard recovery                 │
│   • Technical standup              │
│   • Basic posture                  │
│                                    │
└────────────────────────────────────┘

POST-SESSION: "Great work showing up.
Consistency beats intensity—you're
building your foundation."
```

**Purple Belt Logger:**
```
┌────────────────────────────────────┐
│         LOG YOUR SESSION           │
├────────────────────────────────────┤
│                                    │
│   [🎤 TAP TO START RECORDING]     │
│                                    │
│   "What systems did you           │
│    focus on today?"               │
│                                    │
│   ─────────────────────────────   │
│                                    │
│   Suggested techniques:            │
│   • De la Riva retention          │
│   • Berimbolo entries             │
│   • K-guard transitions           │
│   • Leg entanglement escapes      │
│   • Back control systems          │
│   • Heel hook defense             │
│   • (+ 9 more...)                 │
│                                    │
└────────────────────────────────────┘

POST-SESSION: "Logged. Your depth
of understanding grows with each
session."
```

### 6.3 Session Card Adaptations

**White Belt Session Card:**
```
┌────────────────────────────────────┐
│ Today, 7:15 PM            [Gi] ──┐│
├────────────────────────────────────┤
│ 90 minutes                        │
│                                    │
│ Lesson: Guard basics              │
│                                    │
└────────────────────────────────────┘
```

**Blue Belt Session Card:**
```
┌────────────────────────────────────┐
│ Today, 7:15 PM            [Gi] ──┐│
├────────────────────────────────────┤
│ 90 minutes • 5 rounds             │
│                                    │
│ Lesson: Spider guard retention    │
│                                    │
│ Drilled: Spider guard, lasso,     │
│          triangle setup           │
│                                    │
│ ✓ Guard felt solid                │
│ ✗ Passing still weak              │
└────────────────────────────────────┘
```

**Purple Belt Session Card:**
```
┌────────────────────────────────────┐
│ Today, 7:15 PM            [Gi] ──┐│
├────────────────────────────────────┤
│ 90 minutes • 5 rounds             │
│                                    │
│ Lesson: Berimbolo system          │
│                                    │
│ Drilled: Kiss of dragon, crab     │
│          ride, baby bolo          │
│                                    │
│ Sparring:                         │
│  Given: Triangle (2), Armbar (1)  │
│  Received: RNC (1)                │
│                                    │
│ ✓ Back takes improving            │
│ ✗ Top pressure needs work         │
└────────────────────────────────────┘
```

### 6.4 Technique Library Adaptations

**White Belt Categories:**
```
TECHNIQUE LIBRARY - FOR YOU

Recommended This Week:
┌─────────────────────────────────┐
│ "Mount Escape Fundamentals"     │
│ Roy Dean • Beginner • 8 min    │
├─────────────────────────────────┤
│ "How to Survive Side Control"   │
│ Gracie Academy • Beginner • 12m│
├─────────────────────────────────┤
│ "The Hip Escape You Need"       │
│ Stephan Kesting • Beginner • 6m│
└─────────────────────────────────┘

Categories Available:
• Escapes ✓
• Basic Guards ✓
• Fundamental Positions ✓
• Survival Skills ✓

(Guard Systems, Leg Locks locked)
```

**Purple Belt Categories:**
```
TECHNIQUE LIBRARY - FOR YOU

Recommended This Week:
┌─────────────────────────────────┐
│ "Leg Lock Enter System"         │
│ John Danaher • Advanced • 45m  │
├─────────────────────────────────┤
│ "K-Guard Mastery"               │
│ Lachlan Giles • Advanced • 32m │
├─────────────────────────────────┤
│ "Modern Back Attack Systems"    │
│ Gordon Ryan • Advanced • 28m   │
└─────────────────────────────────┘

All Categories Available:
• Escapes • Guards • Passes
• Submissions • Sweeps • Takedowns
• Advanced Guards • Leg Locks ✓
• Combinations • Competition Footage
```

---

## 7. Data Flow Architecture

### State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                     UserProfileContext                          │
│  (Central state hub - persisted to localStorage)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   profile: {                                                    │
│     userId, name, belt, stripes, trainingStartDate,            │
│     gymName, trainingGoals[], targetFrequency,                 │
│     loggingPreference, sessionCount, skipCounts{},             │
│     onboardingComplete                                          │
│   }                                                             │
│                                                                 │
│   methods: {                                                    │
│     completeOnboarding(name, belt)                             │
│     updateProfile(updates)                                      │
│     incrementSessionCount()                                     │
│     getNextNudgeQuestion()                                      │
│     answerQuestion(id, value)                                   │
│     skipQuestion(id)                                            │
│   }                                                             │
│                                                                 │
│   demo: {                                                       │
│     isDemoMode, activeDemoProfile, activePersona,              │
│     switchPersona(key), cycleToNextPersona(), exitDemoMode()   │
│   }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useBeltPersonalization()                      │
│  (Derives belt-specific config from profile)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Returns: {                                                    │
│     profile: BeltPsychologyProfile                             │
│     dashboard: DashboardAdaptation                             │
│     sessionLogger: SessionLoggerAdaptation                     │
│     chatbot: ChatbotAdaptation                                 │
│     videoTutorials: VideoTutorialAdaptation                    │
│     isInRiskWindow: boolean                                    │
│     analyzeJournal(text): JournalAnalysisResult                │
│     getPostSessionMessage(): string                            │
│     getSuggestedPrompts(): string[]                            │
│   }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENTS                                  │
│  (Use hooks to render belt-adaptive UI)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Dashboard.tsx      → useBeltPersonalization().dashboard       │
│   SessionLogger.tsx  → useBeltPersonalization().sessionLogger   │
│   TechniqueLibrary   → useBeltPersonalization().videoTutorials  │
│   TrainingFeedback   → useBeltPersonalization().chatbot         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Model Overview

```
USER PROFILE                    SESSION (Journal Entry)
─────────────                   ───────────────────────
userId: string                  id: string
name: string                    date: string
belt: BeltLevel                 time: string
stripes: 0-4                    training_type: gi|nogi|both
trainingStartDate: date         duration_minutes: number
currentBeltDate: date           lesson_topic: string
gymName: string                 techniques_drilled: string[]
trainingGoals: Goal[]           sparring_rounds: number
targetFrequency: number         submissions_given: Sub[]
birthYear: number               submissions_received: Sub[]
loggingPreference: voice|text   worked_well: string[]
sessionCount: number            struggles: string[]
onboardingComplete: bool        notes: string
```

---

## 8. Risk: What Could Go Wrong

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Spaghetti conditionals** | Belt checks scattered everywhere, hard to maintain | Centralize ALL belt logic in `useBeltPersonalization` hook |
| **Inconsistent adaptations** | Some screens adapt, others don't | Use feature adaptation matrix as source of truth |
| **State sync issues** | Profile changes don't propagate | Single context provider, components subscribe via hook |
| **Hard-coded belt logic** | Changes require editing many files | All belt config lives in `/config/belt-system/` |
| **Unclear feature boundaries** | Developers unsure what to show/hide | This document defines all variations explicitly |

### Product Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Over-personalization** | Users confused why they see different things | Subtle adaptations, no jarring differences |
| **Under-personalization** | Belt system feels like gimmick | Deep adaptations that genuinely help each stage |
| **Wrong psychology assumptions** | Belt profiles don't match real users | Test with 6 personas representing real archetypes |
| **Missing belt progression** | User promotes, app doesn't adapt | Profile update triggers immediate recalculation |

### Development Anti-Patterns to Avoid

```
❌ BAD: Belt check inline in component
─────────────────────────────────────
function Dashboard() {
  const { profile } = useUserProfile();

  if (profile.belt === 'white') {
    return <WhiteBeltDashboard />;
  } else if (profile.belt === 'blue') {
    return <BlueBeltDashboard />;
  }
  // etc...
}

✅ GOOD: Use adaptation config
─────────────────────────────────────
function Dashboard() {
  const { dashboard } = useBeltPersonalization();

  return (
    <DashboardLayout
      primaryMetric={dashboard.primaryMetric}
      secondaryMetrics={dashboard.secondaryMetrics}
      showAttackProfile={dashboard.showAttackProfile}
      insightFocus={dashboard.insightFocus}
    />
  );
}
```

---

## 9. Development Recommendations

### Architecture Principles

1. **Single Source of Belt Logic**
   - All belt-specific configuration lives in `/config/belt-system/`
   - Components NEVER contain `if (belt === 'white')` checks
   - Use `useBeltPersonalization()` hook for ALL belt decisions

2. **Adaptation Over Branching**
   - Don't create separate components per belt (no `WhiteBeltDashboard.tsx`)
   - Create ONE component that adapts based on config
   - Pass belt-specific values as props from the hook

3. **Progressive Enhancement**
   - Start with white belt (simplest) experience
   - Add complexity as belt level increases
   - Components should gracefully handle missing data

4. **Clear Data Contracts**
   - Each feature adaptation has a defined interface
   - Components receive typed config, not raw belt level
   - Changes to adaptations don't require component changes

### Implementation Checklist

Before building any feature, answer these questions:

```
□ What is the PRIMARY purpose for each belt level?
□ What should be SHOWN at each belt level?
□ What should be HIDDEN at each belt level?
□ What is the TONE for each belt level?
□ What METRICS are relevant for each belt level?
□ Is there any RISK DETECTION relevant to this feature?
□ Does this feature need PROGRESSIVE PROFILING data?
```

### File Organization

```
/config/belt-system/
├── types.ts                  # Interface definitions
├── belt-profiles.ts          # Psychology profiles (5 belts)
├── feature-adaptations.ts    # Feature configs (6 features × 5 belts)
├── risk-signals.ts           # Dropout detection
├── journal-patterns.ts       # Text analysis patterns
└── index.ts                  # Central exports

/hooks/
└── useBeltPersonalization.ts # Main hook (combines all above)

/components/features/
├── Dashboard.tsx             # Uses useBeltPersonalization().dashboard
├── SessionLogger.tsx         # Uses useBeltPersonalization().sessionLogger
├── TechniqueLibrary.tsx      # Uses useBeltPersonalization().videoTutorials
└── TrainingFeedback.tsx      # Uses useBeltPersonalization().chatbot
```

### Testing Strategy

1. **Persona-Based Testing**
   - Use 6 pre-built personas to test all belt variations
   - Demo mode allows switching instantly
   - Each persona has pre-populated data

2. **Adaptation Coverage**
   - Every feature adaptation must be visually verifiable
   - Screenshot each screen at each belt level
   - Document expected differences

3. **Edge Cases**
   - New user (no sessions, no profile data)
   - Belt promotion (profile changes mid-session)
   - Demo mode transitions

---

## Appendix: Technical Reference

### Belt Level Enum

```typescript
type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';
```

### Feature Adaptation Interfaces

```typescript
interface DashboardAdaptation {
  primaryMetric: MetricType;
  secondaryMetrics: MetricType[];
  insightFocus: InsightFocusArea;
  visualizationMode: 'survival' | 'breadth' | 'depth' | 'refinement';
  streakEmphasis: 'high' | 'moderate' | 'low';
  showAttackProfile: boolean;
  showSparringGrid: boolean;
  celebrationThreshold: number;
}

interface SessionLoggerAdaptation {
  toneProfile: 'encouraging' | 'neutral' | 'analytical';
  examplePrompts: string[];
  techniqueSuggestionsCount: number;
  postSessionMessage: string;
  skipButtonEmphasis: 'high' | 'moderate' | 'low';
}

interface VideoTutorialAdaptation {
  recommendedCategories: TechniqueCategory[];
  difficultyRange: { min: number; max: number };
  recommendationsPerWeek: number;
  suggestedInstructors: string[];
  playlistName: string;
}

interface ChatbotAdaptation {
  toneProfile: string;
  technicalVocabulary: 'basic' | 'intermediate' | 'advanced' | 'expert';
  encouragementLevel: 'high' | 'moderate' | 'low' | 'minimal';
  avoidTopics: string[];
  emphasizeTopics: string[];
}
```

### Key File Paths

| Purpose | File Path |
|---------|-----------|
| Belt profiles | `/prototype/src/config/belt-system/belt-profiles.ts` |
| Feature adaptations | `/prototype/src/config/belt-system/feature-adaptations.ts` |
| Main hook | `/prototype/src/hooks/useBeltPersonalization.ts` |
| User context | `/prototype/src/context/UserProfileContext.tsx` |
| Test personas | `/prototype/src/data/personas.ts` |
| Mock profiles | `/prototype/src/data/mock-profiles.ts` |

### Related Documentation

| Document | Purpose |
|----------|---------|
| `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` | Deep dive into personalization engine |
| `/docs/product/STATS_MODULE_STRATEGY.md` | Belt-adaptive dashboard modules |
| `/docs/personas/PERSONA_PROFILES.md` | Detailed test persona specs |
| `/docs/brand/BRAND_VOICE_GUIDE.md` | Tone and messaging guidelines |
| `/docs/design-system/tokens.md` | Visual design reference |

---

## Summary

TOMO is a **psychology-informed, belt-adaptive training journal** that adapts every feature based on where the user is in their BJJ journey. The key to maintaining a clean codebase is:

1. **Centralized belt logic** in `/config/belt-system/`
2. **Single hook** (`useBeltPersonalization`) for all adaptations
3. **Config-driven rendering** instead of conditional branching
4. **Clear adaptation matrices** documented in this file

With this architecture, adding a new feature requires:
1. Define its adaptations in `feature-adaptations.ts`
2. Add a getter function in `useBeltPersonalization`
3. Build the component using the config

No scattered `if (belt === 'white')` checks. No separate components per belt. One component, many configurations.

---

*Document generated: January 2025*
*For questions: Reference `/TOMO/CLAUDE.md` for development guidelines*
