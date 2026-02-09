# Onboarding Flow

## Overview

A 4-screen first-time user experience that captures essential data to deliver a personalized TOMO experience from day one. The flow balances mandatory data collection with optional progressive profiling, respecting user choice while building a complete profile over time.

## User Stories

### Primary

- As a **new user**, I want to set up my profile quickly so that I can start logging training sessions.
- As a **white belt**, I want TOMO to know my belt level so that it personalizes content for my experience level.
- As a **practitioner**, I want to specify my gym so that my training context is captured.

### Secondary

- As a **competitive athlete**, I want to indicate my training goals so that TOMO emphasizes relevant metrics.
- As a **hobbyist**, I want to skip optional questions so that I can get started faster.

## Requirements

### Functional

- [ ] 4-screen flow: Welcome, About You, Your Training, Get Started
- [ ] Collect 6 mandatory fields: name, belt, stripes, gym, frequency, logging preference
- [ ] Offer 2 optional fields: training goals (multi-select), experience level (single-select)
- [ ] Validate all mandatory fields before allowing progression
- [ ] Preserve entered data on back navigation
- [ ] Display step counter: "1 of 3", "2 of 3", "3 of 3" (Welcome has no counter)
- [ ] Gym picker with search, browse, and manual entry modes
- [ ] Voice preference pre-selected with "Recommended" badge
- [ ] Success state with personalized message using user's name
- [ ] Two exit paths: "Log Your First Session" or "Explore the app first"

### Non-Functional

- [ ] **Performance:** Screen transitions < 200ms
- [ ] **Accessibility:** WCAG AA compliance, 4.5:1 contrast ratio minimum
- [ ] **Touch targets:** 56px minimum for primary actions, 44px for secondary
- [ ] **Completion time:** < 60 seconds for mandatory fields, < 90 seconds with optionals

## UI/UX Specifications

- **Prototype:** `../prototypes/approved/2026-02-08-onboarding-flow.html`

### Key Design Decisions

1. **Text step counter over dots** - "1 of 3" is informative without feeling gamified. Aligns with TOMO's "no gamification" principle.

2. **Voice pre-selected** - Voice logging is TOMO's differentiator. Pre-selecting with "Recommended" badge guides users toward the optimal experience while allowing choice.

3. **Optional section divider** - Clear visual separation ("TELL US MORE (OPTIONAL)") respects user time and sets expectations.

4. **Consolidated screens** - 4 screens instead of 6 reduces friction. Each screen has a clear purpose.

5. **Gym as mandatory** - Gym affiliation is core to BJJ identity. Making it required ensures complete profiles.

### Screen Breakdown

| Screen | Purpose | Mandatory Fields | Optional Fields |
|--------|---------|------------------|-----------------|
| Welcome | Brand intro, set tone | None | None |
| About You | Identity essentials | Name, Belt, Stripes | None |
| Your Training | Training context | Gym, Frequency | Goals, Experience |
| Get Started | Logging preference, launch | Logging Preference | None |

## Belt Personalization

The belt selected during onboarding activates TOMO's personalization system:

| Belt | Adaptation |
|------|------------|
| White | Survival framing, consistency celebration, foundational content |
| Blue | Identity support, plateau acknowledgment, technique expansion |
| Purple | Depth focus, systems tracking, teaching tools |
| Brown | Refinement metrics, game development, mentorship features |
| Black | Legacy tracking, student management, mastery insights |

## Edge Cases

- **30+ character name**: Truncate display with ellipsis, store full name
- **Black belt stripes**: Display as "degrees" in UI, store as stripes (0-4)
- **Custom gym entry**: Generate UUID, store with `isCustom: true` flag
- **Back navigation**: All entered data persists, validation state restored
- **App kill mid-flow**: Restart from Welcome (no partial saves)
- **Force quit after preference selected**: Consider onboarding complete

## Success Metrics

| Metric | Target |
|--------|--------|
| Completion rate | > 95% |
| Time to complete (mandatory only) | < 60 seconds |
| Time to complete (with optionals) | < 90 seconds |
| Optional field completion rate | > 40% |
| Drop-off at any screen | < 5% |
| Voice preference selection rate | > 70% |

## Open Questions

*None - design approved and ready for implementation.*

---

*Approved: 2026-02-08*
*Prototype: 2026-02-08-onboarding-flow.html*
