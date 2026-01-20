# TOMO Prototype Alignment Review

**Review Date:** January 2026
**Purpose:** Compare internal documentation against prototype implementation to identify gaps, misalignments, and unbuilt features for developer handoff.

---

## Executive Summary

The TOMO prototype is **significantly more complete** than the FEATURE_TRACKER.md indicates. Several features marked as "Not Started" or "In Progress" are actually functional in the prototype. However, there are meaningful gaps between the detailed specifications in the docs and what's implemented, particularly around:

1. **Voice transcription** (UI exists, AI backend not connected)
2. **Onboarding goals collection** (skipped in current flow)
3. **Belt personalization depth** (hooks exist but not fully utilized)
4. **Data persistence** (using mock data, no real backend)

---

## Feature-by-Feature Analysis

### 1. Session Logging (VoiceFirstLogger)

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Voice recording UI | Built | None |
| Core fields (type, duration, sparring) | Built | None |
| Tier 2 optional fields | Built | None |
| Recording phase with prompts | Built | None |
| Belt-specific prompts during recording | Built - uses `getSuggestedPrompts()` | None |
| Belt-personalized post-session message | Built - uses `getPostSessionMessage()` | None |
| AI voice transcription processing | UI only - mock data used | **GAP** |
| Review/edit phase | Built | None |
| Submission tracking (given/received) | Built | None |
| Save to backend | Calls API but mock response | **GAP** |

**Gaps to Address:**
- `VoiceFirstLogger.tsx:174-189` - Processing phase uses `MOCK_EXTRACTED_DATA`, not real AI
- No actual microphone recording integration (MediaRecorder API not implemented)
- Whisper/Deepgram transcription not connected

---

### 2. Session History (Journal Feed)

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Scrolling feed of entries | Built | None |
| Filter by training type | Built | None |
| Date grouping (Today, Yesterday, etc.) | Built | None |
| Belt-adaptive card complexity | Built - `JournalEntryCard.tsx:69-82` | None |
| Empty state messaging by belt | Built | None |
| Session detail view | Built (SessionDetail.tsx exists) | None |
| Infinite scroll/pagination | Hardcoded to 6 entries max | **GAP** |

**Gaps to Address:**
- `SessionHistory.tsx:31` - `MAX_VISIBLE_ENTRIES = 6` hardcoded
- "See More" button is non-functional (line 325-367)
- Data is from `mockJournalEntriesV2`, not real backend

---

### 3. Journal Entry Card (Belt Personalization)

**This is well-implemented!**

| Belt Level | Data Shown | Implementation |
|------------|------------|----------------|
| White | Date, type, duration, topic, notes | `dataLevel === 'basic'` |
| Blue | + techniques, sparring, worked/struggles | `dataLevel === 'intermediate'` |
| Purple+ | + submissions given/received | `dataLevel === 'advanced'` |

The `getDataLevel()` function at `JournalEntryCard.tsx:69-82` correctly maps belts to display complexity.

**No gaps** - this matches the BELT_INTEGRATION_SPEC.md specification.

---

### 4. Belt Progress Screen

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Current belt hero display | Built | None |
| Stripes visualization | Built | None |
| Belt stage name (from psychology) | Built - `beltProfile.stageName` | None |
| Mindset shift quote | Built - `beltProfile.mindsetShift` | None |
| Plateau pattern detection | Built - `currentPlateau` displayed | None |
| Plateau breakthrough trigger shown | Built | None |
| IBJJF time requirements | Built | None |
| Time progress bar | Built | None |
| Training volume stats | Built (mock data) | None |
| Belt timeline visualization | Built | None |
| Coach disclaimer by belt | Built - belt-aware messaging | None |
| Technique proficiency scores | NOT built (intentionally per docs) | None |

**No significant gaps** - the component correctly avoids "made-up numbers" as specified in FIRST_PRINCIPLES.md.

---

### 5. Onboarding Flow

**TRACKER DISCREPANCY**: FEATURE_TRACKER.md says "Not Started" but onboarding IS built.

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Welcome screen | Built | None |
| Name collection | Built | None |
| Belt selection | Built | None |
| Mic permission flow | Built | None |
| Voice vs text preference | Built | None |
| "Just trained? Log now" CTA | Built | None |
| Goals collection | NOT built | **GAP** |
| Gym selection | NOT built | **GAP** |
| Training frequency question | NOT built | **GAP** |

**Gaps to Address:**
- Per DATA_AND_AI_BY_PAGE.md, onboarding should collect:
  - "What's your main goal?" (competition, fitness, self-defense)
  - "How often do you train?" (frequency baseline)
  - "What gym do you train at?" (optional)
- Currently only collects name + belt + logging preference

---

### 6. Dashboard

Based on the features index and architecture docs:

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Dashboard screen | Built (Dashboard.tsx) | Needs audit |
| Belt-aware module visibility | Partially - needs review | Possible gap |
| Stats summary card | Built (DashboardSummaryCard.tsx) | None |
| Quick log CTA | Built | None |

---

### 7. Technique Library

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Technique browsing | Built (TechniqueLibrary.tsx) | Needs audit |
| Belt-filtered recommendations | Unknown | **NEEDS AUDIT** |
| Video integration | Built (UpNextVideos.tsx) | None |

---

### 8. Profile Screen

| Documented | Prototype Status | Gap? |
|------------|------------------|------|
| Profile display | Built (ProfileScreen.tsx) | None |
| Belt editing | Unknown | Needs audit |
| Settings access | Built (Settings.tsx) | None |
| Profile nudge cards | Built (ProfileNudge.tsx) | None |

---

## Critical Backend/Integration Gaps

### Voice Transcription Pipeline

**Documented in:** `data-and-ai/VOICE_TRANSCRIPTION_SPEC.md`

| Component | Status |
|-----------|--------|
| MediaRecorder API integration | NOT built |
| Audio file upload to backend | NOT built |
| Whisper/Deepgram transcription | NOT built |
| LLM extraction (techniques, subs, etc.) | NOT built |
| Structured data return to UI | Mock only |

**The entire voice-to-data pipeline is mocked.** The UI flow exists but audio never leaves the device.

### Data Persistence

**All data is mock:**
- `mockJournalEntriesV2` - fake session data
- `mockBeltHistory` - fake promotion history
- `mockTrainingStats` - fake stats

**API layer exists** (`services/api.ts`) but returns mock responses or may error.

### User Authentication

- No login/logout
- No user creation
- `userId` is hardcoded in UserProfileContext

---

## Documentation vs Tracker Discrepancies

Several items in FEATURE_TRACKER.md are **incorrect**:

| Feature | Tracker Says | Reality |
|---------|--------------|---------|
| Onboarding Flow | "Not Started" | **BUILT** |
| Voice-First Logger | "In Progress" | **BUILT** (UI complete) |
| Belt Personalization Hook | "Completed" | Correct |
| Session History | "Completed" | Mostly correct |

**Recommendation:** Update FEATURE_TRACKER.md to reflect actual state.

---

## Gaps Organized by Priority

### P0 - Critical for MVP (Blocks Functionality)

1. **Voice transcription backend** - App's core differentiator doesn't work
2. **Data persistence** - Sessions aren't actually saved
3. **User authentication** - Can't have real users

### P1 - Important for User Experience

4. **Onboarding goals collection** - Documented but not built
5. **Real session history from backend** - Currently mock
6. **Belt change capability** - User should be able to update belt
7. **Pagination/infinite scroll** - Hardcoded to 6 sessions

### P2 - Nice to Have / Polish

8. **Training frequency in onboarding** - For better personalization
9. **Gym selection** - Optional per docs
10. **More belt-specific UI variations** - Some documented variations not implemented

---

## Alignment Strengths

The prototype does several things **well** that match documentation:

1. **Belt personalization hooks** - `useBeltPersonalization` is comprehensive
2. **Journal card complexity scaling** - Exactly matches spec
3. **Belt Progress screen** - Honest data only, no made-up metrics
4. **Design system** - CSS variables match tokens.md
5. **Voice-first UX flow** - Recording UI is intuitive
6. **Post-session messaging** - Belt-specific encouragement works
7. **Plateau detection** - Shows warning when patterns detected

---

## Recommendations for Developer Handoff

1. **Update FEATURE_TRACKER.md** - Current state is misleading
2. **Document the mock data locations** - So dev knows what to replace
3. **Prioritize voice backend** - This is the product's core value
4. **Create API contract document** - Specify expected backend endpoints
5. **Keep the belt personalization system** - It's well-architected
6. **Extend onboarding** - Add goals collection before any backend work

---

## Files to Review for Each Gap

| Gap | Key Files |
|-----|-----------|
| Voice transcription | `VoiceFirstLogger.tsx`, `services/api.ts` |
| Data persistence | `services/api.ts`, `context/UserProfileContext.tsx` |
| Onboarding goals | `Onboarding.tsx` |
| Session pagination | `SessionHistory.tsx` |
| Belt updating | `ProfileScreen.tsx`, `Settings.tsx` |

---

## Appendix: Component Locations

```
/TOMO/prototype/src/components/features/
├── VoiceFirstLogger.tsx    # Voice logging (mock AI)
├── SessionHistory.tsx      # Journal feed
├── JournalEntryCard.tsx    # Belt-adaptive cards
├── SessionDetail.tsx       # Single session view
├── BeltProgress.tsx        # Progress tracking
├── Onboarding.tsx          # Setup flow (incomplete)
├── Dashboard.tsx           # Home screen
├── TechniqueLibrary.tsx    # Technique browsing
├── ProfileScreen.tsx       # User profile
├── Settings.tsx            # App settings
└── stats-modules/          # Analytics components
```

---

*This review was conducted by comparing `/TOMO/docs/` documentation against `/TOMO/prototype/src/` implementation.*
