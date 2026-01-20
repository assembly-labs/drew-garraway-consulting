# Request for Proposal (RFP)
## TOMO - BJJ Training Journal iOS Application Development

**RFP Issue Date:** January 2025
**Client:** Drew Garraway / Assembly Labs, LLC
**Project:** Convert Web Prototype to Native iOS Application
**Target Platform:** iOS (TestFlight, then App Store)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State & Assets](#current-state--assets)
3. [Scope of Work](#scope-of-work)
4. [Technical Requirements](#technical-requirements)
5. [Feature Overview](#feature-overview)
6. [Design Requirements](#design-requirements)
7. [Third-Party Integrations](#third-party-integrations)
8. [Deliverables](#deliverables)
9. [Timeline & Milestones](#timeline--milestones)
10. [Proposal Requirements](#proposal-requirements)

---

## Executive Summary

### The Project

TOMO is a voice-first training journal application for Brazilian Jiu-Jitsu practitioners. We have a fully functional web prototype that validates our core concept. We are seeking a qualified iOS developer or team to convert this prototype into a production-ready iOS application for TestFlight distribution.

### Core Concept

BJJ practitioners need to log training sessions immediately post-training when details are fresh—but they're physically and mentally exhausted. Voice-first input solves this: users speak naturally, AI extracts structured data. No typing required.

### What We Have

- Production-quality web prototype (~51,000 lines of TypeScript/React)
- Complete design system with 95+ icons
- 8 feature screens fully implemented
- API service layer ready for backend integration

### What We Need

- Native iOS application (React Native/Expo)
- Backend infrastructure (Supabase)
- Real voice recording and transcription
- AI-powered data extraction from voice
- TestFlight submission

---

## Current State & Assets

### Live Prototype

**URL:** https://bjjj.pages.dev
**Stack:** React 18, TypeScript, Vite, CSS Variables

Explore the prototype to understand the full scope. All screens, flows, and interactions are implemented with mock data.

### Codebase Statistics

| Metric | Value |
|--------|-------|
| Lines of Code | ~51,000 |
| React Components | 60+ |
| Feature Screens | 8 complete |
| UI Components | 20+ reusable primitives |
| Icons | 95+ SVG icons |
| Documentation | 30+ markdown files |

### What's Built (Web Prototype)

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard | Complete | Stats, sessions, insights |
| Voice Logger | Complete (mocked) | Full flow implemented, uses mock transcription |
| Session History | Complete | Filterable list with detail views |
| Session Detail | Complete | View and edit capability |
| Belt Progress | Complete | Visual progression tracking |
| Technique Library | Complete | Searchable catalog |
| Profile/Settings | Complete | User preferences, demo mode |
| Onboarding | Complete | Progressive profiling system |

### What Needs to Be Built

| Category | Status |
|----------|--------|
| Native iOS App | Not started |
| Backend/Database | Not started |
| User Authentication | Not started |
| Real Voice Recording | Not started |
| Voice Transcription (AssemblyAI) | Not started |
| AI Data Extraction | Not started |
| Offline Sync | Not started |

---

## Scope of Work

### In Scope

**Phase 1: Foundation**
- React Native project setup with Expo
- Supabase backend (database, auth, storage)
- Email + Apple Sign-In authentication
- Database schema and migrations
- Navigation structure

**Phase 2: Core Features**
- Voice recording with native audio (expo-av)
- AssemblyAI integration for transcription
- AI extraction of structured session data
- Session CRUD operations
- Dashboard with real statistics
- Session history with database queries
- User profile with data persistence
- Belt personalization integration

**Phase 3: Polish & Platform**
- iOS-specific UI refinements
- Microphone permission handling
- App icons and splash screen
- Offline caching with sync queue
- Crash reporting (Sentry)
- Analytics (PostHog)
- Performance optimization

**Phase 4: TestFlight Submission**
- App Store Connect setup
- TestFlight configuration
- Build and submission via EAS
- Internal testing coordination

### Out of Scope

- Coach/instructor features
- Gym owner/admin features
- Social/community features
- Competition tracking
- Video content creation
- Android version (may discuss as add-on)
- Marketing website

---

## Technical Requirements

### Technology Stack

| Layer | Technology |
|-------|------------|
| Mobile Framework | React Native + Expo |
| Database/Auth | Supabase |
| Voice Transcription | AssemblyAI |
| Build/Deploy | Expo EAS |
| Crash Reporting | Sentry |
| Analytics | PostHog |

### iOS Requirements

- **Minimum iOS Version:** iOS 15.0
- **Target Devices:** iPhone (no iPad required for MVP)
- **Permissions Required:** Microphone, Network, Apple Sign-In

### Performance Targets

| Metric | Target |
|--------|--------|
| Cold start time | < 3 seconds |
| Voice to transcription | < 10 seconds |
| Session save latency | < 2 seconds |
| Crash rate | < 1% |
| App size | < 50MB |

### Database

Database schema exists in the prototype codebase. Core tables:
- User profiles (extends Supabase auth)
- Training sessions
- Technique progress tracking

Schema documentation will be provided to selected vendor.

### Voice Processing

```
User speaks → Native audio recording
    → Upload to AssemblyAI → Transcription
    → AI extraction → Structured JSON
    → User review/edit → Save to database
```

AI extraction prompts and custom vocabulary lists will be provided to selected vendor.

---

## Feature Overview

### 1. Voice Logger (Critical Path)

The voice logger is the core feature. Users speak naturally; the system extracts structured data.

**Flow:**
1. Tap "Log Training" → Open voice logger
2. Tap mic → Begin recording (waveform visualization)
3. User speaks for 30-120 seconds
4. Tap stop → Processing indicator
5. Show extracted data summary for review
6. User can edit any field
7. Save → Success confirmation

**Key Requirement:** Maximum 1 follow-up question. Users are exhausted post-training. Sparse data is better than abandonment.

### 2. Dashboard

Personalized statistics view showing:
- Session count and streaks
- Recent sessions
- Training insights
- Belt-aware metrics (personalization engine exists in prototype)

### 3. Session History

- Chronological session list
- Filter by training type (Gi/No-Gi/Open Mat)
- Search capability
- Tap to view/edit details

### 4. Profile & Progressive Profiling

Instead of lengthy onboarding, the app collects profile data gradually over ~20 sessions. System prompts for additional info at session milestones. Users can skip questions.

### 5. Belt Personalization

Complete personalization engine exists in prototype. Adapts content, metrics, and messaging based on user's belt level. Integration required.

---

## Design Requirements

### Design System

Complete design system exists with tokens, components, and 95+ icons.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#111111` | Primary background |
| Text | `#FFFFFF` | Primary text |
| Accent | `#F5A623` | Gold accent color |
| Positive | `#22c55e` | Success, wins |
| Negative | `#ef4444` | Errors, losses |

### Typography

| Type | Font | Weight |
|------|------|--------|
| Hero Numbers | Unbounded | 800-900 |
| Headlines | Unbounded | 700-800 |
| Body | Inter | 500+ |
| Labels | JetBrains Mono | 500-600 |

### Critical Rules

1. **No emojis** - Use provided SVG icons only
2. **12px minimum font size** - Readability for exhausted users
3. **Font weight 500+ only** - No thin fonts on dark backgrounds
4. **56-80px touch targets** - For session logging (exhausted users)
5. **44px minimum touch targets** - For browsing modes
6. **Semantic colors** - Green = positive, Red = negative (never swap)

---

## Third-Party Integrations

### Required

| Service | Purpose |
|---------|---------|
| Apple Developer | App Store access |
| Supabase | Database + Auth |
| AssemblyAI | Voice transcription |
| Expo EAS | Build and submit |

### Recommended

| Service | Purpose |
|---------|---------|
| Sentry | Crash reporting |
| PostHog | Product analytics |

---

## Deliverables

### Source Code

1. React Native (Expo) project with TypeScript
2. Supabase database schema and migrations
3. Complete API integration
4. Voice recording and transcription pipeline
5. AI extraction integration
6. All UI components adapted for native

### Documentation

1. Setup and deployment guide
2. Environment configuration
3. Testing procedures

### App Store Assets

1. App icons (all required sizes)
2. Splash screen
3. App Store screenshots (6.5" and 5.5")
4. App Store description copy

### Testing

1. Manual testing on iPhone SE, 14, 15 Pro Max
2. Voice transcription accuracy testing
3. Offline/online sync testing
4. Performance profiling results

---

## Timeline & Milestones

### Proposed Timeline: 10-12 Weeks

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Foundation | ~2 weeks | Expo project, Supabase, auth working |
| Core Features | ~4 weeks | Voice, sessions, dashboard, profile |
| Polish | ~3 weeks | iOS polish, offline, testing |
| TestFlight | ~2 weeks | Submission, internal testing |

### Milestone Acceptance

**Phase 1 Complete:**
- User can sign up with email
- User can sign in with Apple
- Database tables created with RLS policies
- Basic navigation working

**Phase 2 Complete:**
- Voice recording captures audio
- Transcription works with >85% accuracy on BJJ terms
- AI extracts structured data
- Sessions save/load from database
- Dashboard shows real statistics

**Phase 3 Complete:**
- App works offline, syncs when online
- Crash reporting active
- Tested on multiple iPhone sizes
- Performance meets targets

**Phase 4 Complete:**
- App available on TestFlight
- 5-10 internal testers onboarded
- No critical bugs in core flows

---

## Proposal Requirements

### What We Need From You

**1. Company/Developer Profile**
- Experience with React Native and Expo
- Experience with Supabase or similar BaaS
- iOS App Store submission experience
- Portfolio of relevant apps

**2. Technical Approach**
- Voice processing pipeline approach
- Offline sync strategy
- Testing methodology

**3. Project Plan**
- Proposed timeline with milestones
- Team composition (if applicable)
- Communication cadence

**4. Cost Estimate**
- Fixed price or time-and-materials
- Breakdown by phase
- Assumptions or exclusions

**5. References**
- 2-3 references for similar projects
- Links to apps in the App Store

---

## Next Steps

1. Review the live prototype at https://bjjj.pages.dev
2. Submit proposal with required information
3. Selected candidates will receive access to full codebase and documentation

---

## Contact

**Drew Garraway**
Assembly Labs, LLC
DREW@ASSEMBLYLABS.CO

---

*This document contains confidential business information. Please treat the contents as proprietary.*
