# TOMO Development Backlog

Features that have been designed, approved, and documented. Ready for implementation.

---

## Ready for Development

*No features currently in queue.*

---

## Completed

### Session Logger Data Alignment
- **Completed:** 2026-02-08
- **Complexity:** M
- **Summary:** Fixed data alignment between UI and database, added new capture fields

**Changes implemented:**
1. Fixed field mapping: `techniques` → `techniques_drilled`
2. Added `did_spar` field to session save
3. Added `worked_well` and `struggles` reflection fields to ReviewPhase
4. Added `lesson_topic` text input ("What Did Coach Teach?")
5. Added `energy_level` 1-5 picker ("How Did You Feel Today?")
6. Added collapsible voice transcript display at top of ReviewPhase
7. Updated database types to include `energy_level` field
8. All fields now properly flow from UI → state → database

**Files changed:**
- `prototype/src/types/database.ts` - Added energy_level to interfaces
- `prototype/src/components/features/VoiceFirstLogger.tsx` - Updated save function
- `prototype/src/components/features/voice-logger/ReviewPhase.tsx` - Added new UI fields
- `prototype/src/services/api.ts` - Handle energy_level in session creation

---

### Onboarding Flow
- **Completed:** 2026-02-08
- **Complexity:** M
- **Summary:** 4-screen first-time user onboarding with text step counter, pre-selected voice preference, and settings note.

**Original spec:**
- **Prototype:** [2026-02-08-onboarding-flow.html](../prototypes/approved/2026-02-08-onboarding-flow.html)
- **Docs:**
  - [Feature Spec](../documentation/feature-specs/ONBOARDING.md)
  - [User Guide](../documentation/user-guides/guide-onboarding.md)
  - [Technical](../documentation/technical/tech-onboarding.md)

**Implementation notes:**
- Existing `Onboarding.tsx` updated to match approved prototype
- Added step counter ("1 of 3" format)
- Pre-selected Voice with "Recommended" badge
- Added "You can change this later in Settings" note
- Success section shown immediately on Screen 4

---

## How to Use This Backlog

### For Designers
When a design is approved, the docs-writer subagent automatically adds it here with:
- Link to approved prototype
- Links to all documentation
- Complexity estimate (S/M/L/XL)
- Suggested priority (P1/P2/P3)

### For Developers
1. Pick a feature from this list
2. Read the feature spec for requirements
3. Read the technical doc for implementation guidance
4. Reference the prototype for visual design
5. When complete, move the entry to `completed.md`

### Priority Guide
- **P1** - Critical for MVP / blocking other work
- **P2** - Important for user experience
- **P3** - Nice to have / future enhancement

### Complexity Guide
- **S** - Single component, < 100 lines, few hours
- **M** - 2-3 components, 100-300 lines, 1-2 days
- **L** - Multiple components, new data models, 3-5 days
- **XL** - New feature area, backend work, 1+ week

---

## Template

When adding a feature:

```markdown
### [Feature Name]
- **Approved:** YYYY-MM-DD
- **Prototype:** [file.html](../prototypes/approved/file.html)
- **Docs:**
  - [Feature Spec](../documentation/feature-specs/FEATURE_NAME.md)
  - [User Guide](../documentation/user-guides/guide-feature-name.md)
  - [Technical](../documentation/technical/tech-feature-name.md)
- **Complexity:** S / M / L / XL
- **Priority:** P1 / P2 / P3
- **Summary:** One-line description

---
```
