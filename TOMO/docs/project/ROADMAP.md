# TOMO Product Roadmap

**Last Updated:** January 19, 2026
**Current Phase:** Research Complete → UX Cleanup → Development Preparation

---

## Work Log: January 19, 2026

### Research & Foundation Work Completed

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **Belt Progression Research** | `/docs/research/TOMO_Belt_Progression_Requirements_Reference.md` | Definitive reference for belt progression features—technical requirements per belt, coach evaluation criteria, psychology research, feature priorities |
| **Sports Psychology Research** | `/docs/sports-psychology/sports-psychology-research.md` | Meta-analytic findings from elite athlete research—7 psychological pillars, effect sizes, validated instruments |
| **First Principles Document** | `/docs/FIRST_PRINCIPLES.md` | 12 non-negotiable beliefs guiding every product decision |
| **Data Consistency Fix** | `/prototype/src/config/belt-system/belt-profiles.ts` | Fixed purple belt duration: 36-48 months → 18-36 months (aligned with research) |
| **Research README Update** | `/docs/research/README.md` | Added belt progression document to index |

### Key Insights Captured

**From Belt Progression Research:**
- Coach evaluation is continuous, not event-based
- Subjective criteria (attitude, ego management) often MORE important than technical skill
- Process goals produce 10x better results than outcome goals (d = 1.36 vs d = 0.09)
- TOMO's role: Support coach judgment with data—never automate promotion decisions

**From Sports Psychology Research:**
- Reflection predicts elite status at OR = 4.9 (practitioners who reflect are 4.9x more likely to reach elite levels)
- Brief daily capture (under 4 minutes) for compliance; deeper periodic review for insight
- Autonomy support correlates negatively with burnout (r = -0.638)
- High-information feedback beats simple praise

**From First Principles:**
- Reflection is the foundation—TOMO is a reflection tool that happens to store data
- The 90-second window is sacred—voice-first, one question at a time
- Belt psychology shapes everything—different belts need different support
- No gamification—belts are earned, not unlocked

---

## Current State Assessment

### Prototype Status: 26% Complete

| Category | Complete | Total | Status |
|----------|----------|-------|--------|
| Phase 1 Features | 3 | 9 | Dashboard, Voice Logger, Session History done |
| Phase 2 Features | 0 | 4 | Coach features not started |
| Phase 3 Features | 0 | 3 | Gym owner features not started |
| Phase 4 Features | 0 | 4 | Supporting features not started |
| UI Components | 9 | 20 | Core components done, detail components needed |

### What's Working
- Dashboard with belt-specific personalization
- Voice-first session logging (6-phase flow)
- Session history with grouped cards
- Design system with tokens, components, patterns
- Belt personalization engine in code

### Critical Gaps
1. **Session Detail View** - Can't view full session after logging
2. **Edit Mode** - Can't modify logged sessions
3. **Onboarding** - No first-time experience
4. **Belt Progress Screen** - Requirements checklist not built
5. **Technique Library** - Search/browse not built

---

## Roadmap: Phase 1 — UX Cleanup

**Goal:** Complete the core practitioner loop before adding new features.

### Sprint 1: Session Flow Completion

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Session Detail View | Critical | Medium | Tap session card → full view with all fields, coaching insights |
| Edit Mode | Critical | Medium | Inline editing of any session field with staged save |
| Delete Confirmation | High | Low | "Delete this session?" with undo option |
| Session Notes Expansion | Medium | Low | Long-form notes support, markdown rendering |

### Sprint 2: First-Time Experience

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Mic Permission Flow | Critical | Low | Explain why voice, request permission, handle denial gracefully |
| "What to Say" Guidance | Critical | Low | Example prompts, sample session descriptions |
| Belt Selection | Critical | Low | Onboarding asks current belt, stripes |
| Name Collection | High | Low | Progressive profiling starts with name |
| Welcome Tour | Medium | Medium | 3-4 screen walkthrough of core features |

### Sprint 3: Belt Progress Screen

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Requirements Display | Critical | Medium | IBJJF-style checklist with self-assessment |
| Progress Visualization | High | Medium | Radar chart or progress bars by category |
| Belt History Timeline | Medium | Low | Visual journey from start to current |
| Coach Feedback Section | Medium | Medium | Display coach notes (placeholder for V2) |

### Sprint 4: Technique Library

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Browse by Position | High | Medium | Filter techniques by position (guard, mount, etc.) |
| Search | High | Medium | Search by name, tags, belt level |
| Proficiency Tracking | Medium | High | Self-rate: learning / developing / proficient |
| Video Placeholders | Low | Low | Thumbnail + "Video coming soon" |

### Sprint 5: Polish & Error States

| Task | Priority | Effort | Description |
|------|----------|--------|-------------|
| Network Error Handling | High | Medium | Offline mode messaging, retry logic |
| Empty States | High | Low | No sessions, no techniques, no goals |
| Loading States | Medium | Low | Skeletons for async operations |
| Toast Notifications | Medium | Low | Save confirmations, error alerts |
| 404/NotFound | Low | Low | Graceful routing failures |

---

## Roadmap: Phase 2 — Documentation for Development

**Goal:** Create comprehensive specs that enable any developer to build TOMO.

### Documentation Inventory

| Document | Status | Location | Needs |
|----------|--------|----------|-------|
| First Principles | Complete | `/docs/FIRST_PRINCIPLES.md` | — |
| Belt Progression Requirements | Complete | `/docs/research/TOMO_Belt_Progression_Requirements_Reference.md` | — |
| Sports Psychology Research | Complete | `/docs/sports-psychology/sports-psychology-research.md` | — |
| User Personas | Complete | `/docs/personas/PERSONA_PROFILES.md` | Review for consistency |
| Design System | Complete | `/docs/design-system/` | Sync with prototype CSS |
| Brand Voice | Complete | `/docs/brand/BRAND_VOICE_GUIDE.md` | — |
| Belt Personalization System | Complete | `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` | — |
| iOS Deployment Plan | Draft | `/docs/deployment/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md` | Update tech stack decisions |
| Feature Tracker | Outdated | `/docs/project/FEATURE_TRACKER.md` | Update status, add new features |
| Project Status | Outdated | `/docs/project/PROJECT_STATUS.md` | Update with today's work |

### Documentation To Create

| Document | Priority | Description |
|----------|----------|-------------|
| **Screen Specifications** | Critical | Detailed specs for each screen: purpose, user state, components, interactions, edge cases |
| **Data Model Specification** | Critical | Complete schema for Supabase—tables, relationships, RLS policies |
| **API Specification** | Critical | Endpoints, authentication, error handling |
| **Voice Transcription Spec** | High | AssemblyAI integration, custom vocabulary, fallback handling |
| **Onboarding Flow Spec** | High | Step-by-step screens, progressive profiling schedule |
| **Coach Features Spec** | Medium | Roster, feedback, promotion pipeline requirements |
| **Testing Strategy** | Medium | Unit tests, integration tests, user acceptance criteria |

### Documentation Sprint Plan

**Week 1: Screen Specifications**
- Dashboard spec
- Session Logger spec
- Session History spec
- Session Detail spec
- Profile spec

**Week 2: Data & API**
- Complete data model with all tables
- API endpoint specifications
- Authentication flow documentation
- RLS policy documentation

**Week 3: Supporting Specs**
- Onboarding flow spec
- Voice transcription spec
- Belt Progress screen spec
- Technique Library spec

**Week 4: Review & Consolidate**
- Cross-reference all docs for consistency
- Update CLAUDE.md with new doc locations
- Create developer quickstart guide

---

## Roadmap: Phase 3 — Implementation Planning

**Goal:** Define the technical architecture and development approach.

### Technology Stack (Confirmed)

| Layer | Technology | Status |
|-------|------------|--------|
| Mobile App | React Native + Expo | Decision made |
| Database | Supabase (PostgreSQL) | Decision made |
| Authentication | Supabase Auth (Email + Apple) | Decision made |
| Voice Transcription | AssemblyAI | Decision made |
| Crash Reporting | Sentry | Decision made |
| Analytics | PostHog | Decision made |
| iOS Builds | Expo EAS | Decision made |
| Web Prototype | Cloudflare Pages | Active |

### Implementation Phases

**Phase 3A: Foundation (Weeks 1-3)**
- Supabase project setup with database schema
- Authentication configuration (email + Apple Sign-In)
- Expo project initialization
- Basic auth flow working

**Phase 3B: Core Features (Weeks 4-7)**
- Voice recording with expo-av
- AssemblyAI transcription integration
- BJJ custom vocabulary configuration
- Dashboard migration to native
- Session Logger with real voice
- Session History with database
- Profile with persistence

**Phase 3C: Polish (Weeks 8-10)**
- iOS app icons and splash screen
- Offline caching with AsyncStorage
- Sync queue for offline sessions
- Sentry crash reporting
- PostHog analytics
- Multi-device testing

**Phase 3D: TestFlight (Weeks 11-12)**
- App Store description and screenshots
- EAS build for iOS
- TestFlight submission
- Internal tester distribution (5-10 users)
- Feedback collection setup
- Crash monitoring and iteration

### Key Metrics for TestFlight Success

| Metric | Target |
|--------|--------|
| App installs on iOS 15+ | 100% |
| Onboarding completion | < 2 minutes |
| Voice transcription accuracy (BJJ terms) | > 85% |
| Crash rate | < 1% |
| Cold start time | < 3 seconds |
| Testers completing 3+ sessions | 5+ users |

---

## Roadmap: Phase 4 — Future Development

> **Note:** These are post-TestFlight features requiring additional research, design, and ideation. Sequencing TBD based on user feedback and business priorities.

---

### Phase 4A: Coach App

**Vision:** A companion app (or app mode) for coaches to track students, provide feedback, and manage promotion pipelines.

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| **Student Roster** | High | Needs Design | List view with progress indicators, attendance trends, risk flags |
| **Student Detail View** | High | Needs Design | Individual progress dashboard, belt journey, technique proficiency |
| **Voice/Text Feedback** | High | Needs Design | Quick feedback entry tagged to student + technique, stored for review |
| **Promotion Pipeline** | Medium | Needs Design | Students approaching requirements, coach notes, readiness indicators |
| **Class Attendance** | Medium | Needs Ideation | Check-in system, attendance patterns, dropout risk detection |
| **Curriculum Management** | Low | Needs Ideation | Academy-specific technique curriculum, class planning tools |

**Onboarding Considerations (Coach):**
- Coach verification flow (gym affiliation, credentials)
- Student invite/connection mechanism
- Permission model (what coaches see vs. private practitioner data)
- Multi-coach academies (head instructor vs. assistant roles)

**Open Questions:**
- Separate app vs. role switcher in main app?
- Pricing model for coach features?
- How do students opt-in to coach visibility?

---

### Phase 4B: Social Connect

**Vision:** Build community without creating toxic comparison. Connect practitioners for accountability, training partners, and shared learning.

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| **Training Partner Finder** | High | Needs Design | Find partners at similar belt/size/schedule in your area |
| **Accountability Buddies** | High | Needs Ideation | Pair practitioners for mutual motivation, check-ins |
| **Session Sharing** | Medium | Needs Design | Opt-in sharing of session summaries (not stats) with select friends |
| **Technique Discussion** | Medium | Needs Ideation | Threaded discussions on specific techniques, Q&A |
| **Open Mat Coordination** | Medium | Needs Ideation | Find open mats, coordinate meetups across gyms |
| **Journey Milestones** | Low | Needs Design | Celebrate promotions, session streaks with community (opt-in) |
| **Mentor Matching** | Low | Needs Ideation | Connect white belts with upper belts for guidance |

**Design Principles (Non-Negotiable):**
- **No leaderboards** - Never rank practitioners against each other
- **No public stats** - Stats are private; only share qualitative reflections
- **Opt-in everything** - Social features are additive, not default
- **Belt-appropriate** - White belts see community differently than purple belts
- **Coach primacy** - Social never contradicts or replaces coach relationship

**Onboarding Considerations (Social):**
- Privacy defaults (private by default, opt-in to share)
- Connection requests (training partner, accountability buddy)
- Academy affiliation (same gym vs. cross-gym connections)
- Content moderation strategy

**Open Questions:**
- How to prevent comparison/competition from social features?
- Moderation model for discussions?
- Integration with existing BJJ communities (Reddit, Facebook groups)?

---

### Phase 4C: Instructor Consultation Sessions

**Vision:** In-app access to sports psychology-informed coaching sessions—like having a sports psych consultant who understands BJJ.

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| **Guided Reflection Sessions** | High | Needs Design | Structured 10-15 min reflection protocols based on sports psych research |
| **Plateau Breakthrough Program** | High | Needs Ideation | Multi-session program for practitioners stuck at a belt level |
| **Pre-Competition Mental Prep** | Medium | Needs Design | Visualization, arousal regulation, pre-performance routines |
| **Injury Recovery Support** | Medium | Needs Ideation | Mental strategies for return-to-mat after injury |
| **Goal-Setting Workshops** | Medium | Needs Design | Process goal frameworks, SMART adaptation for BJJ |
| **Blue Belt Blues Intervention** | High | Needs Design | Targeted support for the highest-dropout phase |
| **Live Consultation Booking** | Low | Needs Ideation | Book sessions with certified sports psych professionals |

**Research Foundation:**
These features draw directly from our sports psychology research:
- Process goals (d = 1.36) over outcome goals (d = 0.09)
- Reflection predicts elite status (OR = 4.9)
- Self-determination theory (autonomy, competence, relatedness)
- Mental toughness interventions (d = 0.80)
- Pre-performance routines (g = 0.64-0.70)

**Delivery Formats (Needs Ideation):**
- Audio-guided sessions (like meditation apps)
- Text-based interactive protocols
- Video content with reflection prompts
- AI-assisted coaching conversations
- Live human consultation (premium tier?)

**Onboarding Considerations (Consultation):**
- Assessment of current mental skills baseline
- Personalized program recommendations by belt + struggles
- Integration with session logging (reflect on what you just trained)
- Progress tracking through consultation programs

**Open Questions:**
- AI-driven vs. human-delivered vs. hybrid?
- Certification/credentialing for any human consultants?
- How to measure effectiveness of mental skills interventions?
- Pricing model (included vs. premium tier)?

---

### Phase 4D: Gym Owner Dashboard

**Vision:** Analytics and management tools for academy owners to improve retention and student outcomes.

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| **Retention Dashboard** | High | Needs Design | Churn prediction, at-risk student alerts, retention trends |
| **Belt Distribution** | Medium | Needs Design | Visual breakdown of student population by belt |
| **Attendance Analytics** | Medium | Needs Ideation | Class attendance patterns, peak times, instructor performance |
| **Coach Management** | Low | Needs Ideation | Assign coaches to students, track coach-student ratios |
| **Revenue Correlation** | Low | Needs Ideation | Connect engagement metrics to membership retention |

**Onboarding Considerations (Gym Owner):**
- Gym verification and setup
- Coach invitation flow
- Student bulk import or gradual enrollment
- Privacy compliance (GDPR, data ownership)

---

### Phase 4E: Advanced Features (V2+)

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| **Competition Tracking** | Medium | Needs Design | Tournament results, competition goals, match video review |
| **Video Technique Library** | Medium | Needs Ideation | Curated technique videos, belt-appropriate recommendations |
| **Offline-First Architecture** | High | Needs Technical Design | Full functionality without connectivity, smart sync |
| **Android Support** | High | Needs Technical Planning | React Native already cross-platform, needs testing/polish |
| **Apple Watch Companion** | Low | Needs Ideation | Quick session logging, heart rate during rolls |
| **Integration APIs** | Low | Needs Technical Design | Connect with gym management software (Zen Planner, etc.) |
| **AI Training Recommendations** | Medium | Needs Ideation | "Based on your recent sessions, focus on..." |
| **Injury Prevention Insights** | Medium | Needs Ideation | Pattern detection for overtraining, injury risk |

---

### Ideation Backlog (Needs Research)

Features requiring significant research and user validation before design:

| Idea | Research Needed | Potential Value |
|------|-----------------|-----------------|
| **Voice Journaling Beyond Sessions** | User interviews on broader journaling habits | Expand beyond post-training capture |
| **Family/Supporter Mode** | Research on BJJ family dynamics | Parents/partners stay connected to journey |
| **Gi vs. No-Gi Specialization** | User segmentation analysis | Tailor experience to training style |
| **Seminar/Camp Logging** | User interviews on special training events | Capture learning from visiting instructors |
| **Lineage Tracking** | Cultural significance research | Track instructor lineage, BJJ family tree |
| **Belt Ceremony Features** | Emotional milestone research | Commemorate promotions meaningfully |
| **Cross-Training Integration** | User interviews on supplementary training | Track wrestling, judo, strength work |
| **Nutrition/Weight Tracking** | Competition prep research | Support weight management for competitors |
| **Sleep/Recovery Correlation** | Sports science research | Connect recovery to training quality |

---

### Onboarding Evolution by Phase

| Phase | Onboarding Focus |
|-------|------------------|
| **V1 (TestFlight)** | Belt selection, name, mic permissions, first session guidance |
| **V1.5 (Post-Feedback)** | Progressive profiling, gym affiliation, training goals |
| **Coach App** | Coach verification, student connection, permission model |
| **Social Connect** | Privacy settings, connection preferences, community guidelines |
| **Consultation** | Mental skills assessment, program recommendations |
| **Gym Owner** | Gym setup, coach invitation, compliance acknowledgment |

---

### Sequencing Principles

1. **Practitioner-first** — Core practitioner experience must be excellent before expanding to coaches/gyms
2. **Feedback-driven** — TestFlight feedback determines Phase 4 priorities
3. **Research-backed** — New features require evidence base (sports psych, user research)
4. **Revenue-aware** — Consider monetization potential when sequencing
5. **Complexity-conscious** — Each phase adds complexity; be deliberate about what ships

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Jan 19, 2026 | Purple belt duration: 18-36 months | Aligned with research; purple typically shorter than blue |
| Jan 19, 2026 | First Principles doc created | Needed single source of truth for product decisions |
| Jan 19, 2026 | Sports psychology research added | Evidence base for feature decisions (effect sizes, validated instruments) |
| Jan 19, 2026 | Belt progression research added | Technical requirements per belt for feature design |

---

## Next Actions

### Immediate (This Week)
1. Update PROJECT_STATUS.md with Jan 19 work
2. Update FEATURE_TRACKER.md with current status
3. Begin Session Detail View implementation
4. Begin Screen Specifications documentation

### Short-Term (Next 2 Weeks)
1. Complete Sprint 1 (Session Flow Completion)
2. Complete Sprint 2 (First-Time Experience)
3. Create Data Model Specification
4. Create API Specification

### Medium-Term (Next Month)
1. Complete all UX Cleanup sprints
2. Complete all documentation
3. Begin React Native/Expo setup
4. Begin Supabase configuration

---

*This roadmap is a living document. Update as decisions are made and work is completed.*
