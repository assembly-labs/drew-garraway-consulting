# Request for Proposal (RFP)
## TOMO - BJJ Training Journal iOS Application Development

**RFP Issue Date:** January 2026
**Client:** Drew Garraway / Assembly Labs, LLC 
**Project:** Convert Web Prototype to Native iOS Application
**Target Platform:** iOS (TestFlight, then App Store)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Current State & Assets](#current-state--assets)
4. [Scope of Work](#scope-of-work)
5. [Technical Requirements](#technical-requirements)
6. [Feature Specifications](#feature-specifications)
7. [Design & Brand Requirements](#design--brand-requirements)
8. [Third-Party Integrations](#third-party-integrations)
9. [Deliverables](#deliverables)
10. [Timeline & Milestones](#timeline--milestones)
11. [Proposal Requirements](#proposal-requirements)
12. [Appendices](#appendices)
    - [A: User Personas](#appendix-a-user-personas)
    - [B: Voice Extraction Sample Prompt](#appendix-b-voice-extraction-sample-prompt)
    - [C: Sample Voice Input → Output](#appendix-c-sample-voice-input--output)
    - [D: Database Architecture & Data Strategy](#appendix-d-database-architecture--data-strategy)
    - [E: File Migration Map](#appendix-e-file-migration-map)

---

## Executive Summary

### The Opportunity

TOMO (meaning "friend" in Japanese) is a voice-first training journal application for Brazilian Jiu-Jitsu (BJJ) practitioners. We have a fully functional web prototype (~51,000 lines of TypeScript/React code) that validates our core value proposition: **capturing training insights at the critical post-training moment when information is fresh but users are exhausted.**

We are seeking a qualified iOS developer or development team to convert this prototype into a production-ready iOS application for TestFlight distribution, with the eventual goal of App Store release.

### Market Context

- **Total Addressable Market:** ~750,000 practitioners in the US; 6 million worldwide
- **Market Growth:** 15% CAGR, projected $1.2B by 2032
- **Competitive Landscape:** Fragmented market with no dominant player; competitors include BJJ Notes ($9.99/mo), BJJBuddy ($5.99/mo), Marune ($8.99/mo)
- **Our Differentiator:** Voice-first logging (no competitor offers this)

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

We have a production-quality web prototype that demonstrates all core functionality. This is not a napkin sketch—it's a semi functional application with polished UI, comprehensive mock data, and thoughtful UX decisions.

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

### Database Schema (Supabase)

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  belt_level TEXT NOT NULL DEFAULT 'white',
  stripes INTEGER DEFAULT 0,
  gym_name TEXT,
  training_start_date DATE,
  target_frequency INTEGER,
  logging_preference TEXT DEFAULT 'voice',
  onboarding_complete BOOLEAN DEFAULT false,
  session_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  training_type TEXT NOT NULL, -- 'gi', 'nogi', 'openmat'
  duration_minutes INTEGER,
  sparring_rounds INTEGER,
  techniques TEXT[],
  submissions_given JSONB,
  submissions_received JSONB,
  worked_well TEXT[],
  struggles TEXT[],
  notes TEXT,
  voice_transcript TEXT,
  energy_level TEXT,
  injury_mentions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technique progress
CREATE TABLE technique_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  technique_id TEXT NOT NULL,
  proficiency TEXT DEFAULT 'learning',
  times_drilled INTEGER DEFAULT 0,
  times_used_live INTEGER DEFAULT 0,
  last_practiced DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, technique_id)
);
```

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
| Encouraging | "100 sessions. That's commitment." | "OMG you're AMAZING! 🎉" |
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
| **Phase 1: Foundation** | Weeks 1 | Expo project, Supabase setup, auth flow working |
| **Phase 2: Core Features** | Weeks 2 | Voice logging, session CRUD, dashboard, profile |
| **Phase 3: Polish** | Weeks 3 | iOS platform features, offline support, testing |
| **Phase 4: TestFlight** | Weeks 3 | App Store Connect, submission, internal testing |

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

## Appendices

### Appendix A: User Personas

Six detailed personas are documented with training stats, psychology profiles, journal voice samples, and risk indicators:

1. **Jake Thompson** (White Belt - Excelling) - The Natural, 26, 87 sessions
2. **David Morrison** (White Belt - At Risk) - The Late Starter, 52, 47 sessions
3. **Marcus Chen** (Blue Belt - Excelling) - The Dedicated Hobbyist, 34, 247 sessions
4. **Ryan Torres** (Blue Belt - At Risk) - The Fading Fire, 31, 156 sessions
5. **Sofia Rodriguez** (Purple Belt - Average) - The Grinder, 28, 612 sessions
6. **Elena Kim** (Brown Belt - Average) - The Veteran, 38, 1,247 sessions

Full persona documentation available in `/docs/personas/PERSONA_PROFILES.md`

### Appendix B: Voice Extraction Sample Prompt

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

### Appendix C: Sample Voice Input → Output

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

### Appendix D: Database Architecture & Data Strategy

This section details the core data model and how each data point powers specific visualizations and insights for users.

---

#### Data Value Map: Why We Collect Each Field

Every field we store must deliver value to the user. Here's the justification for each:

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

#### Core Tables Overview

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

#### Table 1: `profiles` (User Data)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,

  -- Identity
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,

  -- BJJ Journey
  belt_level TEXT NOT NULL DEFAULT 'white',  -- white, blue, purple, brown, black
  stripes INTEGER DEFAULT 0,                  -- 0-4
  training_start_date DATE,                   -- When they started BJJ
  current_belt_date DATE,                     -- When they got current belt
  gym_name TEXT,

  -- Preferences
  logging_preference TEXT DEFAULT 'voice',    -- voice, text
  target_frequency INTEGER,                   -- Sessions per week goal
  training_goals TEXT[],                      -- ['competition', 'fitness', 'self-defense']

  -- Progressive Profiling
  birth_year INTEGER,
  onboarding_complete BOOLEAN DEFAULT false,
  profile_questions_asked JSONB,              -- Track which questions shown

  -- Computed (denormalized for performance)
  total_sessions INTEGER DEFAULT 0,
  total_hours DECIMAL DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `belt_level` + `stripes` | Belt badge with stripe indicators | Header, Profile |
| `training_start_date` | "X years training" stat | Profile, Dashboard |
| `current_belt_date` | "X months at [belt]" | Belt Progress |
| `target_frequency` | Weekly goal progress ring | Dashboard |
| `total_sessions` | Lifetime session counter | Dashboard hero stat |
| `current_streak` | Streak flame indicator | Dashboard |
| `longest_streak` | Personal best streak | Stats detail |

---

#### Table 2: `sessions` (Training Entries)

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,

  -- When
  date DATE NOT NULL,
  day_of_week INTEGER,                        -- 0-6, for pattern analysis
  time_of_day TEXT,                           -- 'morning', 'afternoon', 'evening'

  -- What
  training_type TEXT NOT NULL,                -- 'gi', 'nogi', 'both', 'openmat'
  class_type TEXT,                            -- 'fundamentals', 'advanced', 'competition', 'open_mat'
  duration_minutes INTEGER,

  -- Techniques Covered
  techniques_drilled TEXT[],                  -- Array of technique names
  techniques_attempted_live TEXT[],           -- Techniques tried in sparring

  -- Sparring Summary (denormalized for quick reads)
  did_spar BOOLEAN DEFAULT false,
  sparring_rounds INTEGER,

  -- Qualitative
  energy_level TEXT,                          -- 'high', 'medium', 'low'
  worked_well TEXT[],                         -- What clicked
  struggles TEXT[],                           -- What didn't work
  notes TEXT,                                 -- Free-form notes

  -- Voice Data
  voice_transcript TEXT,                      -- Raw transcript
  audio_url TEXT,                             -- Stored audio file

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_sessions_user_date ON sessions(user_id, date DESC);
CREATE INDEX idx_sessions_training_type ON sessions(user_id, training_type);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `date` | Session history timeline | History |
| `date` (aggregated) | Sessions this week/month/year | Dashboard |
| `date` (streak calc) | Current streak counter | Dashboard |
| `training_type` | Gi vs No-Gi pie chart | Stats |
| `duration_minutes` | Total hours trained | Dashboard, Profile |
| `techniques_drilled` | Technique frequency chart | Technique Library |
| `day_of_week` | "You train most on Tuesdays" | Insights |
| `energy_level` | Energy trend over time | Stats detail |
| `worked_well` / `struggles` | Pattern detection for coaching | Insights |

---

#### Table 3: `sparring_rounds` (Individual Roll Outcomes)

```sql
CREATE TABLE sparring_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,

  -- Opponent (optional)
  partner_name TEXT,
  partner_belt TEXT,                          -- Estimated belt of partner

  -- Outcome
  outcome TEXT NOT NULL,                      -- 'win', 'loss', 'draw', 'flow'

  -- Submissions
  submission_given TEXT,                      -- Technique used to tap partner
  submission_received TEXT,                   -- Technique you got caught with
  position_when_submitted TEXT,               -- 'guard', 'mount', 'back', etc.

  -- Context
  started_standing BOOLEAN,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for aggregations
CREATE INDEX idx_sparring_user ON sparring_rounds(user_id);
CREATE INDEX idx_sparring_session ON sparring_rounds(session_id);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `outcome` (aggregated) | Win/Loss/Draw record | Dashboard |
| `outcome` (over time) | Performance trend line | Stats |
| `submission_given` | "Deadliest Attack" card | Dashboard |
| `submission_given` | Submission breakdown pie | Stats |
| `submission_received` | "Achilles Heel" card | Dashboard |
| `submission_received` | Defense gap analysis | Insights |
| `partner_belt` | Performance vs belt levels | Stats detail |
| `position_when_submitted` | Positional weakness heat map | Stats |

---

#### Table 4: `technique_progress` (Skill Tracking)

```sql
CREATE TABLE technique_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,

  -- Technique Reference
  technique_id TEXT NOT NULL,                 -- Links to technique library
  technique_name TEXT NOT NULL,               -- Denormalized for display
  category TEXT,                              -- 'submission', 'sweep', 'pass', 'escape', 'takedown'

  -- Progress Metrics
  proficiency TEXT DEFAULT 'learning',        -- 'learning', 'developing', 'proficient', 'mastered'
  times_drilled INTEGER DEFAULT 0,
  times_attempted_live INTEGER DEFAULT 0,
  times_successful_live INTEGER DEFAULT 0,

  -- Dates
  first_learned DATE,
  last_practiced DATE,
  last_successful DATE,

  -- User Assessment
  confidence_rating INTEGER,                  -- 1-5 self-rating
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, technique_id)
);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `proficiency` | Technique mastery progress bars | Technique Library |
| `proficiency` (aggregated) | "X techniques at proficient+" | Dashboard |
| `times_drilled` | Drill frequency chart | Technique detail |
| `times_successful_live` / `times_attempted_live` | Success rate % | Technique detail |
| `category` + `proficiency` | Category radar chart | Stats |
| `last_practiced` | "Haven't drilled X in 30 days" | Insights/Nudges |
| `confidence_rating` | Self-assessment trends | Stats |

---

#### Table 5: `injuries` (Body Tracking)

```sql
CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  session_id UUID REFERENCES sessions(id),    -- Optional link to session

  -- Location
  body_part TEXT NOT NULL,                    -- 'knee_left', 'shoulder_right', 'neck', etc.
  body_region TEXT,                           -- 'upper', 'lower', 'core'

  -- Severity & Status
  severity TEXT DEFAULT 'minor',              -- 'minor', 'moderate', 'serious'
  status TEXT DEFAULT 'active',               -- 'active', 'recovering', 'healed'

  -- Timeline
  reported_date DATE NOT NULL,
  estimated_recovery_date DATE,
  healed_date DATE,

  -- Details
  description TEXT,
  affects_training BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `body_part` + `severity` | Body heat map | Stats, Profile |
| `body_part` (frequency) | "Most injured: Left knee (3x)" | Insights |
| `status` | Active injury banner | Dashboard |
| `reported_date` → `healed_date` | Recovery timeline | Stats |
| `affects_training` | Training modification suggestions | Session Logger |

---

#### Table 6: `goals` (User Objectives)

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,

  -- Goal Definition
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT,                             -- 'technique', 'frequency', 'competition', 'custom'

  -- Target
  target_value INTEGER,                       -- e.g., 100 sessions, 5 competitions
  target_technique TEXT,                      -- For technique goals
  target_date DATE,

  -- Progress
  current_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',               -- 'active', 'completed', 'abandoned'
  completed_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `current_value` / `target_value` | Goal progress rings | Dashboard, Profile |
| `status` | Completed goals celebration | Achievements |
| `target_date` | Days remaining countdown | Goal detail |

---

#### Table 7: `belt_promotions` (Journey History)

```sql
CREATE TABLE belt_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,

  -- Promotion Details
  belt_level TEXT NOT NULL,
  stripes INTEGER DEFAULT 0,
  promotion_date DATE NOT NULL,

  -- Context
  promoted_by TEXT,                           -- Coach name
  gym_name TEXT,
  sessions_at_previous INTEGER,               -- How many sessions before promotion
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Powers These Visualizations:**

| Data Point | Visualization | Location |
|------------|---------------|----------|
| `promotion_date` | Belt journey timeline | Belt Progress |
| `promotion_date` (diff) | "X months at blue belt" | Profile, Dashboard |
| `sessions_at_previous` | "Promoted after 150 sessions" | Belt Progress |
| All promotions | Visual belt progression | Belt Progress hero |

---

#### Derived/Aggregated Data (Computed Views)

These are calculated from the base tables, either in real-time or cached:

| Metric | Calculation | Powers |
|--------|-------------|--------|
| **Current Streak** | Consecutive days/weeks with sessions | Dashboard streak flame |
| **This Week Sessions** | COUNT sessions WHERE date in current week | Weekly progress ring |
| **This Month Sessions** | COUNT sessions WHERE date in current month | Monthly stat card |
| **Win Rate** | wins / (wins + losses) from sparring_rounds | Performance stats |
| **Most Used Submission** | MODE of submission_given | "Deadliest Attack" |
| **Most Caught By** | MODE of submission_received | "Achilles Heel" |
| **Gi/No-Gi Split** | Percentage by training_type | Training style chart |
| **Avg Session Duration** | AVG duration_minutes | Stats |
| **Techniques at Proficient+** | COUNT WHERE proficiency IN ('proficient', 'mastered') | Progress indicator |
| **Days Since Last Training** | NOW() - MAX(session.date) | Inactivity nudge |
| **Training Consistency** | Sessions per week over last 8 weeks | Trend chart |

---

#### Key Queries for Visualizations

**Dashboard Hero Stats:**
```sql
SELECT
  total_sessions,
  current_streak,
  (SELECT COUNT(*) FROM sessions WHERE user_id = $1 AND date >= date_trunc('month', NOW())) as this_month,
  (SELECT SUM(duration_minutes)/60.0 FROM sessions WHERE user_id = $1) as total_hours
FROM profiles WHERE id = $1;
```

**Sparring Record:**
```sql
SELECT
  COUNT(*) FILTER (WHERE outcome = 'win') as wins,
  COUNT(*) FILTER (WHERE outcome = 'loss') as losses,
  COUNT(*) FILTER (WHERE outcome = 'draw') as draws
FROM sparring_rounds WHERE user_id = $1;
```

**Deadliest Attack / Achilles Heel:**
```sql
-- Deadliest (most successful submission)
SELECT submission_given, COUNT(*) as count
FROM sparring_rounds
WHERE user_id = $1 AND submission_given IS NOT NULL
GROUP BY submission_given ORDER BY count DESC LIMIT 1;

-- Achilles Heel (most caught by)
SELECT submission_received, COUNT(*) as count
FROM sparring_rounds
WHERE user_id = $1 AND submission_received IS NOT NULL
GROUP BY submission_received ORDER BY count DESC LIMIT 1;
```

**Training Streak Calculation:**
```sql
WITH session_dates AS (
  SELECT DISTINCT date FROM sessions WHERE user_id = $1 ORDER BY date DESC
),
streaks AS (
  SELECT date,
         date - (ROW_NUMBER() OVER (ORDER BY date DESC))::int AS streak_group
  FROM session_dates
)
SELECT COUNT(*) as current_streak
FROM streaks
WHERE streak_group = (SELECT streak_group FROM streaks LIMIT 1);
```

---

#### Data Retention & Privacy

| Data Type | Retention | Notes |
|-----------|-----------|-------|
| Session data | Indefinite | Core product value |
| Voice recordings | 30 days | Delete after transcription verified |
| Transcripts | Indefinite | Useful for search, AI improvements |
| Analytics events | 1 year | PostHog handles |

---

### Appendix E: File Migration Map

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
Drew Garraway, DREW@ASSEMBLYLABS.CO

---

## Document Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial RFP |

---

*This document contains confidential business information. Please treat the contents as proprietary.*
