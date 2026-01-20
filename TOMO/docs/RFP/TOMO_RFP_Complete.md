# TOMO - iOS Development RFP

---

**Request for Proposal**
**BJJ Training Journal iOS Application**

---

| | |
|---|---|
| **Client** | Drew Garraway / Assembly Labs, LLC |
| **Project** | Convert Web Prototype to Native iOS Application |
| **Target** | iOS TestFlight, then App Store |
| **Issue Date** | January 2026 |
| **Live Prototype** | https://bjjj.pages.dev |

---

## Table of Contents

**Part 1: Context**
- [Understanding BJJ & The Problem We Solve](#part-1-understanding-bjj--the-problem-we-solve)

**Part 2: Request for Proposal**
- [Executive Summary](#executive-summary)
- [Project Overview](#project-overview)
- [Current State & Assets](#current-state--assets)
- [Scope of Work](#scope-of-work)
- [Technical Requirements](#technical-requirements)
- [Feature Specifications](#feature-specifications)
- [Design & Brand Requirements](#design--brand-requirements)
- [Third-Party Integrations](#third-party-integrations)
- [Deliverables](#deliverables)
- [Timeline & Milestones](#timeline--milestones)
- [Proposal Requirements](#proposal-requirements)

**Appendices**
- [A: User Personas](#appendix-a-user-personas)
- [B: Voice Extraction Sample](#appendix-b-voice-extraction-sample)
- [C: Database Architecture](#appendix-c-database-architecture--data-strategy)
- [D: File Migration Map](#appendix-d-file-migration-map)

---

# Part 1: Understanding BJJ & The Problem We Solve

## What is Brazilian Jiu-Jitsu?

BJJ is a grappling martial art focused on ground fighting and submissions. Two people try to control each other and force a "tap" (submission) through joint locks or chokes. No striking—it's often called "human chess."

**The learning curve is brutal.** You'll spend your first 6-12 months getting crushed by everyone, forgetting techniques you just learned, and questioning if you're improving at all. Belt progression takes years (blue belt: 1-2 years, black belt: 10+ years).

**The reward is deep.** Practitioners describe it as addictive problem-solving with your body. Every roll is a puzzle. Every training partner exposes different weaknesses.

---

## The Developer Metaphor

**Training BJJ without journaling is like coding without version control.**

Imagine writing code for months with no git history. You can't:
- See what changed between working and broken states
- Identify patterns in your bugs
- Remember why you made certain decisions
- Prove to yourself you've actually improved

That's what most BJJ practitioners do. They train 3x/week, learn dozens of techniques, get submitted hundreds of times—and remember almost none of it. Months later, they can't articulate what they've learned or what keeps failing.

---

## Why Journaling Matters

Research shows self-reflection predicts 90% of variance in skill acquisition. Logging creates:

- **Pattern recognition**: "I keep getting caught in triangles from closed guard"
- **Progress visibility**: "I've trained 147 sessions this year" (vs. feeling like you've done nothing)
- **Retention**: Writing reinforces memory of techniques drilled
- **Coaching data**: Your coach can see what you're struggling with

---

## Why Our App Matters

**The problem**: After training, users are exhausted. Sweaty hands, depleted grip, cognitive fatigue. They have maybe 90 seconds of willingness before they just want to go home.

**Every competitor requires typing.** That's why most training journals get abandoned.

**Our solution**: Voice-first logging. Users talk naturally for 60 seconds. AI extracts structured data—techniques, sparring outcomes, struggles, injuries. Done.

Think of it as **dictation → AST parsing**. Raw voice input gets transformed into structured, queryable training data that powers dashboards, insights, and progress visualization.

---

## The One-Liner

> **TOMO is git for your BJJ journey—automatic commit messages from voice, with a dashboard that shows your diff over time.**

---

# Part 2: Request for Proposal

## Executive Summary

### The Opportunity

TOMO (meaning "friend" in Japanese) is a voice-first training journal application for Brazilian Jiu-Jitsu (BJJ) practitioners. We have a fully functional web prototype (~51,000 lines of TypeScript/React code) that validates our core value proposition: **capturing training insights at the critical post-training moment when information is fresh but users are exhausted.**

We are seeking a qualified iOS developer or development team to convert this prototype into a production-ready iOS application for TestFlight distribution, with the eventual goal of App Store release.

### Market Context

| Metric | Value |
|--------|-------|
| **US Practitioners** | ~750,000 |
| **Worldwide** | ~6 million |
| **Market Growth** | 15% CAGR |
| **Projected Market Size** | $1.2B by 2032 |
| **Competitors** | BJJ Notes ($9.99/mo), BJJBuddy ($5.99/mo), Marune ($8.99/mo) |
| **Our Differentiator** | Voice-first logging (no competitor offers this) |

### Key Differentiator

Every competitor requires manual typing after training. Our users are:
- Physically drained post-training (elevated heart rate, depleted grip strength)
- Cognitively fatigued (20-40% reduced decision-making capacity)
- Time-constrained (90-second willingness window)
- Often still in the gym parking lot with sweaty hands

**Voice-first input solves this problem.** Users talk naturally; AI extracts structured data. No other BJJ app offers this.

---

## Project Overview

### Product Vision

TOMO is "The Dedicated Training Partner" - a knowledgeable, warm, and grounded companion that helps practitioners see their journey clearly. We believe **every practitioner deserves to see their journey clearly—because understanding where you've been is how you know where to go next.**

### Core Value Propositions

1. **Voice-First Logging:** Capture session details in under 2 minutes with natural speech
2. **AI-Powered Extraction:** Automatically parse techniques, sparring outcomes, and insights from voice
3. **Belt-Aware Personalization:** Content and coaching adapted to user's belt level and psychology
4. **Progress Visualization:** Clear metrics, streaks, and insights that reveal growth
5. **Consistency Over Completeness:** A sparse log today beats an abandoned app tomorrow

### User Types (MVP)

| User Type | Description | Priority |
|-----------|-------------|----------|
| **Practitioners** | BJJ students (white through brown belt) tracking training | Primary |
| **Coaches** | Instructors providing feedback (future phase) | Secondary |
| **Gym Owners** | Academy administrators (future phase) | Tertiary |

**MVP Focus:** Individual practitioners only. Coach and gym owner features are out of scope for initial release.

---

## Current State & Assets

### What You'll Be Working With

We have a production-quality web prototype that demonstrates all core functionality. This is not a napkin sketch—it's a semi-functional application with polished UI, comprehensive mock data, and thoughtful UX decisions.

#### Prototype Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~51,000 |
| React Components | 60+ components |
| Screen Flows | 8 complete feature screens |
| Mock Data | 11 comprehensive data files |
| Documentation | 30+ markdown files |
| Design System | Complete token system with 95+ icons |

#### Live Prototype

**URL:** https://bjjj.pages.dev
**Tech Stack:** React 18, TypeScript, Vite, CSS Variables

#### Repository Structure

```
/prototype/src/
├── components/
│   ├── features/          # 15+ feature components
│   │   ├── Dashboard.tsx
│   │   ├── SessionLogger.tsx
│   │   ├── VoiceFirstLogger.tsx
│   │   ├── SessionHistory.tsx
│   │   ├── SessionDetail.tsx
│   │   ├── BeltProgress.tsx
│   │   ├── TechniqueLibrary.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── Settings.tsx
│   │   └── stats-modules/   # 15+ stat visualization modules
│   ├── layout/            # Header, TabBar
│   └── ui/                # 20+ reusable UI primitives
├── config/
│   ├── app.ts             # Feature flags, app config
│   └── belt-system/       # Complete personalization engine
├── hooks/                 # Custom React hooks
├── context/               # UserProfileContext (state management)
├── data/                  # 11 mock data files
├── services/              # API abstraction layer (Supabase-ready)
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions

/docs/
├── design-system/         # Complete design tokens, CSS, icons
├── product/               # Feature specs, belt personalization
├── project/               # Status tracking, feature tracker
├── deployment/            # iOS deployment plans
├── personas/              # 6 detailed user personas
├── research/              # Market research, competitive analysis
├── brand/                 # Voice guidelines, brand philosophy
└── data-and-ai/           # Voice logging specs, conversation design
```

### What's Already Built (Web Prototype)

#### Core Features - Complete

| Feature | Status | Description |
|---------|--------|-------------|
| **Dashboard** | Complete | Training stats, recent sessions, insights grid, streak display |
| **Voice Logger** | Complete (mocked) | 6-phase flow: Idle→Recording→Processing→Gap-Fill→Review→Success |
| **Session History** | Complete | Chronological session list with filters |
| **Session Detail** | Complete | Full session view with edit capability |
| **Belt Progress** | Complete | Visual progression tracking |
| **Technique Library** | Complete | Searchable technique catalog (50+ techniques) |
| **Profile/Settings** | Complete | User profile, preferences, demo mode |
| **Onboarding** | Complete | Progressive profiling system |

#### UI Components - Complete

| Component | Purpose |
|-----------|---------|
| Icons | 95+ SVG lineart icons |
| StatCard | Data display cards |
| BeltBadge | Belt level indicator |
| ProgressRing | Circular progress visualization |
| Toast | Notification system |
| Skeleton | Loading states |
| ErrorState | Error handling UI |
| EmptyState | No-data scenarios |

#### Infrastructure - Complete (Supabase-Ready)

| Layer | Status | Notes |
|-------|--------|-------|
| TypeScript Types | Ready | Match planned database schema |
| API Service Layer | Ready | Abstracted for easy backend swap |
| Auth Service | Mocked | Ready for Supabase Auth |
| Feature Flags | Ready | Toggle features on/off |

### What Needs to Be Built

| Category | Status | Description |
|----------|--------|-------------|
| Backend API | Not Started | Real data persistence |
| Database | Not Started | User data storage |
| User Authentication | Not Started | Sign up, login, Apple Sign-In |
| Native Mobile App | Not Started | React Native/Expo conversion |
| Real Voice Recording | Not Started | Native audio capture |
| Voice Transcription | Not Started | AssemblyAI integration |
| AI Extraction | Not Started | Parse structured data from transcript |
| Push Notifications | Not Started | Engagement reminders |
| Offline Sync | Not Started | Work without connectivity |

---

## Scope of Work

### In Scope

#### Phase 1: Foundation

- Set up React Native project with Expo
- Configure Supabase backend (database, auth, storage)
- Implement SSO, email + Apple Sign-In authentication
- Create database schema and migrations
- Basic navigation structure

#### Phase 2: Core Features

- Voice recording with native audio (expo-av)
- AssemblyAI integration for transcription
- AI extraction of structured session data
- Session CRUD operations (create, read, update, delete)
- Dashboard with real statistics
- Session history with database queries
- User profile with progressive profiling
- Belt personalization system integration

#### Phase 3: Polish & Platform

- iOS-specific UI polish
- Microphone permission handling
- App icons and splash screen
- Offline caching with sync queue
- Crash reporting (Sentry)
- Analytics (PostHog)
- Performance optimization

#### Phase 4: TestFlight Submission

- App Store Connect setup
- TestFlight configuration
- Build and submission via EAS
- Internal testing coordination

### Out of Scope (Future Phases)

- Coach features (student roster, feedback system)
- Gym owner features (retention metrics, roster management)
- Social/community features
- Competition tracking
- Technique video content creation
- Android version (may discuss as add-on)
- Marketing website development

---

## Technical Requirements

### Recommended Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Mobile Framework** | React Native + Expo | ~70% code reuse from prototype; faster development |
| **Database/Auth** | Supabase | PostgreSQL + Auth + Storage in one platform |
| **Voice Transcription** | AssemblyAI | 24% better accuracy on proper nouns; critical for BJJ terms |
| **Build/Deploy** | Expo EAS | Handles iOS builds and App Store submission |
| **Crash Reporting** | Sentry | Industry standard, free tier |
| **Analytics** | PostHog | Privacy-friendly, free tier |

### Voice Processing Pipeline

```
User speaks → Native audio recording (expo-av)
    → Upload to AssemblyAI → Transcription
    → AI extraction (GPT-4 class) → Structured JSON
    → User review/edit → Save to database
```

### AssemblyAI Integration

**Why AssemblyAI over OpenAI Whisper:**
- 24% better accuracy on proper nouns (critical for "kimura", "berimbolo", "de la Riva")
- 30% lower hallucination rate (important when users mumble post-training)
- Custom vocabulary support for BJJ-specific terms
- $50 free credits for testing (~135 hours of transcription)
- 99.95% uptime SLA

**Custom Vocabulary Examples:**
- Techniques: kimura, americana, armbar, triangle, omoplata, berimbolo
- Positions: guard, mount, side control, half guard, turtle, back control
- Systems: de la Riva, spider guard, lasso, x-guard, knee shield
- Training types: gi, no-gi, open mat, fundamentals class

### iOS Requirements

- **Minimum iOS Version:** iOS 15.0
- **Target Devices:** iPhone (no iPad required for MVP)
- **Permissions Required:**
  - Microphone (voice recording)
  - Network (API calls)
  - Apple Sign-In

### Performance Targets

| Metric | Target |
|--------|--------|
| Cold start time | < 3 seconds |
| Voice recording to transcription | < 10 seconds |
| Session save latency | < 2 seconds |
| Crash rate | < 1% |
| App size | < 50MB |

---

## Feature Specifications

### 1. Voice Logger (Critical Path)

The voice logger is the core differentiator. Users speak naturally; the system extracts structured data.

#### User Flow

```
1. Tap "Log Training" → Open voice logger
2. Tap mic → Begin recording (waveform visualization)
3. User speaks naturally for 30-120 seconds
4. Tap to stop → "Processing your session..."
5. AssemblyAI transcribes audio
6. AI extracts structured data
7. Show summary card for review
8. User can edit any field
9. Tap save → Session logged
10. Success screen with session count
```

#### AI Extraction Targets

| Field | Source | Priority |
|-------|--------|----------|
| Duration | "90 minutes", "hour and a half" | High |
| Training type | "gi class", "no-gi" | High |
| Sparring | "rolled five times", "six rounds" | High |
| Techniques | Named moves (armbar, knee slice, etc.) | Medium |
| Submissions given | "tapped him with", "got the choke" | Medium |
| Submissions received | "got caught in", "he got me with" | Medium |
| What worked | "felt good", "clicked" | Medium |
| Struggles | "kept getting", "couldn't" | Medium |
| Partners | Names in context | Low |
| Injuries | "knee sore", "shoulder tight" | Low |

#### Critical UX Requirement

**Maximum 1 follow-up question.** Users have 90 seconds of willingness. If the AI can't extract something, infer it or skip it. A sparse entry is better than abandonment.

### 2. Dashboard

Personalized stats view adapted to user's belt level.

#### Belt-Specific Metrics

| Belt | Primary Focus | Key Metrics |
|------|---------------|-------------|
| White | Survival, consistency | Streak, session count, defense focus |
| Blue | Game development | Technique variety, sparring performance |
| Purple | Systems thinking | Position mastery, teaching hours |
| Brown | Refinement | Submission depth, legacy metrics |

### 3. Session History

Chronological list of past sessions with filtering.

#### Features
- Sessions grouped by date
- Filter by training type (Gi/No-Gi/Open Mat)
- Search by notes or techniques
- Tap to view full detail
- Edit capability for any session

### 4. Progressive Profiling

Instead of lengthy onboarding, collect profile data over ~20 sessions.

#### Collection Schedule

| Milestone | Data Collected |
|-----------|----------------|
| Onboarding | Name, belt level |
| Session 3 | Training start date |
| Session 5 | Stripes count |
| Session 7 | Gym name |
| Session 10 | Training goals |
| Session 12 | Target frequency |
| Session 15 | Current belt date |
| Session 18 | Birth year |

Users can skip questions up to 3 times before we stop asking.

### 5. Belt Personalization System

Complete personalization engine already built in prototype.

#### What It Provides
- **Psychology Profiles:** Struggles, motivations, plateaus per belt
- **Feature Adaptations:** Dashboard metrics, chatbot tone, video recommendations
- **Risk Detection:** Dropout warning signs with belt-specific interventions
- **Journal Analysis:** Detect ego challenges, breakthroughs, injuries in text

---

## Design & Brand Requirements

### Design System

A complete design system exists with tokens, components, and guidelines.

#### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-black` | `#111111` | Primary background |
| `--color-white` | `#FFFFFF` | Primary text |
| `--color-gold` | `#F5A623` | Accent color |
| `--color-positive` | `#22c55e` | Wins, success, streaks |
| `--color-negative` | `#ef4444` | Losses, errors |

#### Typography

| Type | Font | Weight | Usage |
|------|------|--------|-------|
| Hero Numbers | Unbounded | 800-900 | Large stats (72px+) |
| Headlines | Unbounded | 700-800 | Page titles |
| Body | Inter | 500+ | All body text |
| Labels | JetBrains Mono | 500-600 | Metadata, badges |

#### Critical Rules

1. **NO EMOJIS** - Use SVG icons only (95+ icons provided)
2. **12px Minimum Font Size** - Users are exhausted; ensure readability
3. **Font Weight 500+ Only** - No thin fonts on dark backgrounds
4. **56-80px Touch Targets** - For session logging (exhausted users)
5. **44px Minimum Touch Targets** - For browsing modes
6. **Semantic Colors** - GREEN = positive, RED = negative (never swap)

### Brand Voice

TOMO speaks like "The Dedicated Training Partner" - a purple belt who's been training for six years. Not the loudest person in the room, but the one everyone trusts.

#### Voice Attributes

| Attribute | Example | Avoid |
|-----------|---------|-------|
| Confident | "Your guard retention improved 23%." | "Maybe your guard got better?" |
| Conversational | "Haven't trained in a couple weeks?" | "ALERT: Streak broken!" |
| Encouraging | "100 sessions. That's commitment." | "OMG you're AMAZING!" |
| Clear | "3 techniques left for blue belt." | "You're making great progress!" |
| Grounded | "Most spend 2-3 years at blue." | "Unlock purple in 6 months!" |

#### Copy Non-Negotiables

- Never gamify belt progression (no "unlock" or "level up")
- Never contradict a user's coach
- Never promise faster promotions
- Never use empty hype language
- Be specific over vague (numbers > adjectives)

---

## Third-Party Integrations

### Required Services

| Service | Purpose | Cost Estimate |
|---------|---------|---------------|
| **Apple Developer** | App Store access | $99/year |
| **Supabase** | Database + Auth | Free → $25/mo at scale |
| **AssemblyAI** | Voice transcription | ~$1.85/user/month (100 sessions) |
| **Expo EAS** | Build and submit | Free tier available |

### Recommended Services

| Service | Purpose | Cost Estimate |
|---------|---------|---------------|
| **Sentry** | Crash reporting | Free tier (5K events) |
| **PostHog** | Product analytics | Free tier (1M events) |

### Future Considerations (Not MVP)

| Service | Purpose | When Needed |
|---------|---------|-------------|
| RevenueCat | Subscription management | Monetization phase |
| OneSignal | Push notifications | Engagement phase |

---

## Deliverables

### Source Code

1. React Native (Expo) project with TypeScript
2. Supabase database schema and migrations
3. Complete API integration
4. Voice recording and transcription pipeline
5. AI extraction prompts and integration
6. All UI components adapted for native

### Documentation

1. Setup and deployment guide
2. API documentation
3. Environment configuration guide
4. Testing procedures

### App Store Assets

1. App icons (all required sizes)
2. Splash screen
3. App Store screenshots (6.5" and 5.5")
4. App Store description copy
5. Privacy policy URL

### Testing

1. Manual testing on multiple iPhone sizes (SE, 14, 15 Pro Max)
2. Voice transcription accuracy testing with BJJ terminology
3. Offline/online sync testing
4. Performance profiling results

---

## Timeline & Milestones

### Proposed Timeline: 10-12 Weeks

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: Foundation** | Weeks 1-3 | Expo project, Supabase setup, auth flow working |
| **Phase 2: Core Features** | Weeks 4-7 | Voice logging, session CRUD, dashboard, profile |
| **Phase 3: Polish** | Weeks 8-10 | iOS platform features, offline support, testing |
| **Phase 4: TestFlight** | Weeks 11-12 | App Store Connect, submission, internal testing |

### Milestone Acceptance Criteria

#### Phase 1 Complete When:
- [ ] User can sign up with email
- [ ] User can sign in with Apple
- [ ] User can log out
- [ ] Database tables created with RLS policies
- [ ] Basic navigation working

#### Phase 2 Complete When:
- [ ] Voice recording captures audio
- [ ] AssemblyAI transcribes with >85% accuracy on BJJ terms
- [ ] AI extracts structured data from transcript
- [ ] Sessions save to and load from database
- [ ] Dashboard shows real user statistics
- [ ] Profile data persists across sessions

#### Phase 3 Complete When:
- [ ] App works offline, syncs when online
- [ ] Crash reporting active
- [ ] Microphone permissions handled gracefully
- [ ] App tested on iPhone SE, 14, 15 Pro Max
- [ ] Performance meets targets (< 3s cold start)

#### Phase 4 Complete When:
- [ ] App available on TestFlight
- [ ] 5-10 internal testers onboarded
- [ ] No critical bugs blocking core flows
- [ ] Known issues documented

---

## Proposal Requirements

### What We Need From You

1. **Company/Developer Profile**
   - Years of experience with React Native and Expo
   - Experience with Supabase or similar BaaS
   - iOS App Store submission experience
   - Portfolio of relevant apps (fitness, voice, journaling)

2. **Technical Approach**
   - How you would approach the voice processing pipeline
   - Strategies for offline sync
   - Testing methodology

3. **Project Plan**
   - Proposed timeline with milestones
   - Team composition (if applicable)
   - Communication and reporting cadence

4. **Cost Estimate**
   - Fixed price or time-and-materials
   - Breakdown by phase
   - Any assumptions or exclusions

5. **References**
   - 2-3 references for similar projects
   - Links to apps in the App Store

---

# Appendices

## Appendix A: User Personas

Six detailed personas are documented with training stats, psychology profiles, journal voice samples, and risk indicators:

| Persona | Belt | Archetype | Age | Sessions | Status |
|---------|------|-----------|-----|----------|--------|
| Jake Thompson | White (3 stripe) | The Natural | 26 | 87 | Thriving |
| David Morrison | White (2 stripe) | The Late Starter | 52 | 47 | At Risk |
| Marcus Chen | Blue (2 stripe) | The Dedicated Hobbyist | 34 | 247 | Progressing |
| Ryan Torres | Blue (1 stripe) | The Fading Fire | 31 | 156 | Critical Risk |
| Sofia Rodriguez | Purple (1 stripe) | The Grinder | 28 | 612 | Stable |
| Elena Kim | Brown (2 stripe) | The Veteran | 38 | 1,247 | Refined |

Full persona documentation available in repository at `/docs/personas/PERSONA_PROFILES.md`

---

## Appendix B: Voice Extraction Sample

### AI Prompt

```
You are extracting structured data from a BJJ practitioner's voice note.

Extract the following fields. If a field cannot be determined, leave it null.
Be aggressive about inferring—it's better to extract something than nothing.

Fields:
- duration_minutes (integer or null)
- training_type (enum: "gi", "nogi", "both", null)
- sparring (boolean or null)
- sparring_rounds (integer or null)
- techniques (array of strings)
- submissions_given (array of {technique, partner?})
- submissions_received (array of {technique, partner?})
- worked_well (array of strings)
- struggled_with (array of strings)
- training_partners (array of strings)
- injuries (array of {body_part, severity?, notes?})
- energy_level (enum: "high", "medium", "low", null)
- notes (string, anything else notable)

Transcript:
{transcript}

Output valid JSON only.
```

### Sample Input → Output

**User speaks:**
> "Tuesday night, maybe hour and a half. Worked on knee slice passing, the version where you control the far arm. Rolled five rounds—got swept a lot from half guard, couldn't maintain the underhook. Tapped Jake with a collar choke, Sarah caught me in a triangle. Knee feels a little tight but nothing serious."

**Extracted Data:**
```json
{
  "duration_minutes": 90,
  "training_type": "gi",
  "sparring": true,
  "sparring_rounds": 5,
  "techniques": ["knee slice pass (far arm control)"],
  "submissions_given": [{"technique": "collar choke", "partner": "Jake"}],
  "submissions_received": [{"technique": "triangle", "partner": "Sarah"}],
  "worked_well": [],
  "struggled_with": ["half guard top", "underhook retention"],
  "training_partners": ["Jake", "Sarah"],
  "injuries": [{"body_part": "knee", "severity": "minor", "notes": "tight"}],
  "energy_level": null,
  "notes": null
}
```

---

## Appendix C: Database Architecture & Data Strategy

### Data Value Map: Why We Collect Each Field

Every field we store must deliver value to the user:

**User Profile Data**
| Field | User Value |
|-------|------------|
| `name` | Enables personalized greetings ("Hey Jake") instead of generic app experience |
| `belt_level` | Core personalization axis—adapts dashboard, coaching tone, content difficulty |
| `stripes` | Shows micro-progress within belt; motivation between promotions |
| `training_start_date` | Powers "X years training" identity badge; builds pride in journey length |
| `current_belt_date` | Shows investment at current level; normalizes time-at-belt expectations |
| `gym_name` | Community connection; enables future gym-based features |
| `target_frequency` | Creates accountability; powers "3 of 4 sessions this week" progress rings |
| `training_goals` | Tailors content—competition prep vs fitness vs self-defense messaging |
| `total_sessions` | Core achievement metric; "247 sessions" creates sense of accomplishment |
| `current_streak` | Drives consistency without gamification; "don't break the chain" motivation |
| `longest_streak` | Personal record to beat; aspirational goal |

**Session Data**
| Field | User Value |
|-------|------------|
| `date` | Foundation of all time-based insights; enables history, trends, streaks |
| `training_type` | Helps users balance gi/nogi training; "You're 80% gi—consider more nogi" |
| `duration_minutes` | Quantifies effort; powers "142 hours on the mat this year" pride stat |
| `techniques_drilled` | Tracks skill development focus; identifies neglected technique areas |
| `sparring_rounds` | Quantifies live training volume; correlates with skill development |
| `energy_level` | Correlates performance with physical state; identifies burnout patterns |
| `worked_well` | Captures wins to reference later; builds confidence over time |
| `struggles` | Identifies recurring problems for targeted improvement suggestions |
| `voice_transcript` | Enables search through past sessions; AI coaching improvements |

**Sparring Data**
| Field | User Value |
|-------|------------|
| `outcome` | Win/loss record shows competitive progress; validates improvement |
| `submission_given` | Identifies signature moves ("Your guillotine is money"); builds identity |
| `submission_received` | Identifies defensive gaps ("You get triangled a lot—here's why") |
| `partner_belt` | Contextualizes performance—losing to purple belt is different than white belt |
| `position_when_submitted` | Pinpoints positional weaknesses for focused drilling |

**Technique Progress**
| Field | User Value |
|-------|------------|
| `proficiency` | Visual progress bars show mastery journey; satisfying progression |
| `times_drilled` | Validates effort put into specific techniques; effort = results |
| `times_successful_live` | Real performance data; proves technique works under pressure |
| `last_practiced` | Prevents skill decay; "You haven't drilled armbars in 30 days" nudges |

**Injury Tracking**
| Field | User Value |
|-------|------------|
| `body_part` | Heat map visualization shows wear patterns; injury prevention |
| `severity` | Enables training modification suggestions; smart recovery guidance |
| `status` | Tracks recovery progress; celebrates return to full health |

**Goals**
| Field | User Value |
|-------|------------|
| `target_value` | Clear finish line creates motivation; "12 more sessions to 100" |
| `current_value` | Progress visibility; satisfying movement toward goal |
| `target_date` | Creates urgency; "23 days to hit your goal" |

**Belt Promotions**
| Field | User Value |
|-------|------------|
| `promotion_date` | Journey timeline visualization; celebrate milestones |
| `sessions_at_previous` | Benchmarking—"You trained 156 sessions before blue belt" |
| `promoted_by` | Honors lineage; connects achievement to coach relationship |

---

### Core Tables Overview

| Table | Purpose | Key Visualizations Powered |
|-------|---------|---------------------------|
| `profiles` | User identity, belt level, preferences | Belt badge, personalization engine |
| `sessions` | Training log entries | Dashboard stats, history, streaks |
| `sparring_rounds` | Individual roll outcomes | Win/loss record, submission stats |
| `technique_progress` | Proficiency tracking per technique | Technique mastery charts, recommendations |
| `injuries` | Body area tracking over time | Body heat map, recovery insights |
| `goals` | User-defined objectives | Goal progress rings, milestone tracking |
| `belt_promotions` | Belt/stripe history | Journey timeline, time-at-belt stats |

---

### Database Schema

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  belt_level TEXT NOT NULL DEFAULT 'white',
  stripes INTEGER DEFAULT 0,
  training_start_date DATE,
  current_belt_date DATE,
  gym_name TEXT,
  logging_preference TEXT DEFAULT 'voice',
  target_frequency INTEGER,
  training_goals TEXT[],
  birth_year INTEGER,
  onboarding_complete BOOLEAN DEFAULT false,
  profile_questions_asked JSONB,
  total_sessions INTEGER DEFAULT 0,
  total_hours DECIMAL DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  day_of_week INTEGER,
  time_of_day TEXT,
  training_type TEXT NOT NULL,
  class_type TEXT,
  duration_minutes INTEGER,
  techniques_drilled TEXT[],
  techniques_attempted_live TEXT[],
  did_spar BOOLEAN DEFAULT false,
  sparring_rounds INTEGER,
  energy_level TEXT,
  worked_well TEXT[],
  struggles TEXT[],
  notes TEXT,
  voice_transcript TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sparring rounds
CREATE TABLE sparring_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  partner_name TEXT,
  partner_belt TEXT,
  outcome TEXT NOT NULL,
  submission_given TEXT,
  submission_received TEXT,
  position_when_submitted TEXT,
  started_standing BOOLEAN,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technique progress
CREATE TABLE technique_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  technique_id TEXT NOT NULL,
  technique_name TEXT NOT NULL,
  category TEXT,
  proficiency TEXT DEFAULT 'learning',
  times_drilled INTEGER DEFAULT 0,
  times_attempted_live INTEGER DEFAULT 0,
  times_successful_live INTEGER DEFAULT 0,
  first_learned DATE,
  last_practiced DATE,
  last_successful DATE,
  confidence_rating INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, technique_id)
);

-- Injuries
CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  session_id UUID REFERENCES sessions(id),
  body_part TEXT NOT NULL,
  body_region TEXT,
  severity TEXT DEFAULT 'minor',
  status TEXT DEFAULT 'active',
  reported_date DATE NOT NULL,
  estimated_recovery_date DATE,
  healed_date DATE,
  description TEXT,
  affects_training BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT,
  target_value INTEGER,
  target_technique TEXT,
  target_date DATE,
  current_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Belt promotions
CREATE TABLE belt_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  belt_level TEXT NOT NULL,
  stripes INTEGER DEFAULT 0,
  promotion_date DATE NOT NULL,
  promoted_by TEXT,
  gym_name TEXT,
  sessions_at_previous INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Appendix D: File Migration Map

| Web Prototype File | Native Equivalent | Migration Complexity |
|-------------------|-------------------|---------------------|
| `App.tsx` | `App.tsx + Navigation` | Medium |
| `Dashboard.tsx` | `screens/Dashboard.tsx` | Low |
| `SessionLogger.tsx` | `screens/SessionLogger.tsx` | High (voice) |
| `VoiceFirstLogger.tsx` | `components/VoiceLogger.tsx` | High (native audio) |
| `SessionHistory.tsx` | `screens/SessionHistory.tsx` | Low |
| `SessionCard.tsx` | `components/SessionCard.tsx` | Low |
| `ProfileScreen.tsx` | `screens/ProfileScreen.tsx` | Low |
| `Settings.tsx` | `screens/Settings.tsx` | Medium |
| `UserProfileContext.tsx` | `context/UserContext.tsx` | Medium |
| `index.css` | `theme/tokens.ts + StyleSheet` | Medium |
| `belt-system/*` | `config/belt-system/*` | Low |

---

## Contact Information

**Drew Garraway**
Assembly Labs, LLC
DREW@ASSEMBLYLABS.CO

---

## Document Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial RFP |

---

*This document contains confidential business information. Please treat the contents as proprietary.*
