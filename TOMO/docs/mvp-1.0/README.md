# TOMO MVP 1.0 — iOS TestFlight

**Goal:** Ship the core data loop (Capture > Store > Review > Edit) to TestFlight.
**Started:** March 7, 2026
**Status:** Implementation-ready — feature spec and ship plan complete

---

## What's In This Folder

| Document | Purpose | Status |
|----------|---------|--------|
| `README.md` | This file — index + status tracker | Active |
| `SESSION_NOTES.md` | Running log of planning decisions from each session | Active |
| `FEATURE_SPEC.md` | Exact MVP 1.0 scope — what's in, what's deferred | Complete |
| `SHIP_PLAN.md` | Implementation plan — phases, tasks, dependencies | Complete |

---

## MVP 1.0 Scope

### Core Features (5)

1. **Onboarding** — name, belt, stripes, gym picker, target frequency, logging preference + optional goals/experience
2. **Session Logger** — voice recording > AssemblyAI transcription > Claude Haiku extraction > review/confirm
3. **Journal (Session History)** — list view, grouped by date, tap into detail
4. **Session Detail + Edit** — view full session, edit all fields, date editing, delete
5. **Profile** — view/edit core profile fields (name, belt, gym), logging preference, sign out

### The Product Bet

> Does voice-first logging actually work for exhausted BJJ practitioners?

Everything else (stats, technique library, insights, belt progress) is views on top of this data. No point building dashboards until real sessions are flowing in.

---

## Decisions (All Resolved — March 7, 2026)

### 1. Onboarding Scope — FULL
All fields: name, belt, stripes, gym picker (120+ gyms), target frequency, logging preference, plus optional training goals and experience level. ~60 second onboarding.

### 2. AI Architecture — Two-Model Strategy
- **Extraction (every session):** Claude Haiku 4.5 — $0.001/call, fast, cheap, sufficient for structured parsing
- **Coaching intelligence (future, v1.1+):** Claude Sonnet 4.6 — for open-ended queries requiring reasoning across session history
- **Transcription:** AssemblyAI (not Whisper) — custom vocabulary support for 180 BJJ terms, cheaper ($0.0025/min vs $0.006/min), 30% lower hallucination rate
- Build extraction as a Supabase Edge Function with model as a config variable — easy to swap later
- Edge Function includes JSON validation, error handling, and fallback for malformed responses

### 3. Journal Edit Scope — FULL
Include date/time editing and session deletion. Users need to backdate missed sessions and clean up test entries during TestFlight.

### 4. Session Data Model — Split
- `trainingMode`: gi / nogi / mixed / unknown (what you wore)
- `sessionKind`: class / open_mat / drilling / competition / other (what you did)
- Replaces the old combined `trainingType` field

### 5. No Belt-Based Field Locking
All users can see and edit all session fields. Belt personalization is limited to copy, defaults, and emphasis — never field visibility. This builds trust and simplifies MVP implementation.

### 6. Private Audio Storage
Voice recordings stored in private Supabase bucket. Access via short-lived signed URLs only. No public audio URLs. Retention policy must be finalized before App Store submission.

### 7. Pipeline Metadata
Sessions include internal fields for debugging and quality tracking: `input_method`, `transcription_status`, `extraction_status`, `schema_version`, `edited_after_ai`, `extraction_model`. Not shown in UI.

### 8. Expo Modernization
- Use `npx create-expo-app@latest` and `npx expo ...` (no global CLI install)
- Development builds are the normal workflow, not Expo Go
- Physical device testing required for audio features
- Prefer `expo-audio` over `expo-av` for recording
- Stay in Expo managed workflow

---

## What Already Exists (Assets)

| Asset | Location | Relevance |
|-------|----------|-----------|
| ~180 BJJ vocabulary terms | `docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md` | Direct input to AssemblyAI `word_boost` |
| Full belt curriculum | `docs/domain-knowledge/BJJ_BELT_CURRICULUM.md` | Domain knowledge for extraction layer |
| Voice conversation design | `docs/data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` | UX flow for voice capture |
| 3-tier data capture strategy | `docs/data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` | Capture > Extract > Enrich architecture |
| Session Logger PRD | `docs/product/_manual_product_requirements_doc/SESSION_LOGGER_PRD.md` | Field definitions (note: belt visibility rules in PRD are overridden — MVP has no field locking) |
| Voice transcription spec | `docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md` | AssemblyAI integration, error handling, costs |
| 93-feature inventory | `docs/product/FEATURES.md` | Full product vision (MVP is a subset) |
| iOS deployment plan | `docs/deployment/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md` | Tech stack decisions, phase breakdown |
| Development strategy | `docs/RFP/DEVELOPMENT_STRATEGY_ANALYSIS.md` | Build vs hire analysis, effort estimates |
| Data models | `docs/product/FEATURES.md` (Section 14) | TypeScript interfaces (note: MVP uses updated `trainingMode`/`sessionKind` split) |
| Design system | `docs/design-system/` | Tokens, components, icons (needs RN conversion) |
| 60+ React components | `prototype/src/` | ~70% portable to React Native |
| Belt personalization engine | `prototype/src/config/belt-system/` | Portable for copy/messaging — field visibility rules not used in MVP |

---

## Tech Stack (Decided)

| Layer | Technology |
|-------|------------|
| Mobile App | React Native + Expo (managed workflow) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Apple Sign-In) |
| Voice Transcription | AssemblyAI |
| AI Extraction | Claude Haiku 4.5 (via Supabase Edge Function) |
| AI Coaching (v1.1+) | Claude Sonnet 4.6 |
| Audio Storage | Supabase Storage (private bucket, signed URLs) |
| Crash Reporting | Sentry |
| Analytics | PostHog |
| iOS Builds | Expo EAS (development builds + production builds) |

---

## Estimated Timeline

| Phase | Scope | Weeks |
|-------|-------|-------|
| Phase 1: Foundation | Expo init, Supabase, auth, design system, development build on device | 1-2 |
| Phase 2: Core Screens | Onboarding, logger (voice pipeline), journal, detail+edit, profile | 3-5 |
| Phase 3: Polish | App icon, splash, offline, error states, device testing | 6-7 |
| Phase 4: TestFlight | Production build, submit, distribute to testers | 8 |

---

## How to Continue This Work

**For Claude Code:** Read this README first, then `FEATURE_SPEC.md` for exact scope and data models, then `SHIP_PLAN.md` for implementation tasks. Check `SESSION_NOTES.md` for decision history and rationale.

**For Drew:** All planning decisions are locked. Next step: sign up for prerequisite accounts (Apple Developer first — 48hr activation), then start Phase 1. See `SHIP_PLAN.md` prerequisites checklist and Build Order appendix.
