# TOMO Development Backlog

Features that have been designed, approved, and documented. Ready for implementation.

---

## Ready for Development

### Onboarding Flow
- **Approved:** 2026-02-08
- **Prototype:** [2026-02-08-onboarding-flow.html](../prototypes/approved/2026-02-08-onboarding-flow.html)
- **Docs:**
  - [Feature Spec](../documentation/feature-specs/ONBOARDING.md)
  - [User Guide](../documentation/user-guides/guide-onboarding.md)
  - [Technical](../documentation/technical/tech-onboarding.md)
- **Complexity:** M (updates to existing component, ~200 lines changed)
- **Priority:** P1 (blocks first-time user experience)
- **Summary:** 4-screen first-time user onboarding with text step counter, pre-selected voice preference, and settings note.

**Implementation notes:**
- Existing `Onboarding.tsx` needs updates to match approved prototype
- Add step counter ("1 of 3" format)
- Pre-select Voice with "Recommended" badge
- Add "You can change this later in Settings" note
- Show success section immediately on Screen 4

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
