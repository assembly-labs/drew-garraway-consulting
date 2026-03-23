# Onboarding UX Enhancement Checklist

**Created:** 2026-03-22
**Goal:** Elevate onboarding from functional to premium (Apple/Peloton caliber)
**Process:** Work through items top-to-bottom. Each item gets a deep-dive design pass, then implementation.

---

## Tier 1: High Impact — Do These

| # | Enhancement | Screen | Status |
|---|-------------|--------|--------|
| 1 | Belt picker ceremony — color wash, animation, recognition message | About You | Not started |
| 2 | Personalization payoff — chat-style AI intro with typewriter animation | Get Started | ✅ Done (2026-03-22) |
| 3 | Progress bar — animated gold bar replacing "STEP 1 OF 3" text | All screens | ✅ Done (2026-03-22) |
| 4 | Micro-animation stagger — elements fade/slide in on screen entry | All screens | Not started |
| 5 | Welcome screen — cycling typewriter value props, tap to skip | Welcome | ✅ Done (2026-03-22) |
| 6 | Mic permission priming — branded explainer before iOS system dialog | Get Started | Not started |

## Tier 2: Medium Impact — Worth Doing

| # | Enhancement | Screen | Status |
|---|-------------|--------|--------|
| 7 | Onboarding completion celebration — animation + haptic on finish | Transition | Not started |
| 8 | Stripes animated reveal — smooth slide-in after belt selected | About You | Not started |
| 9 | Gym picker redesign — location soft-ask + nearby gyms + inline autocomplete (no modal) | Your Training | ✅ Done (2026-03-22) |
| 10 | Voice vs. Text mini demos — short looping animation in cards | Get Started | Not started |
| 11 | Goals chips with icons — small icons for Competition/Fitness/Hobby/Mental Health | Your Training | Not started |
| 12 | Welcome entrance animation — choreographed logo + tagline reveal | Welcome | Not started |

## Tier 3: Low Priority — Defer

| # | Enhancement | Screen | Status |
|---|-------------|--------|--------|
| 13 | Auth screen visual parity | Auth | Deferred |
| 14 | Sound design | All | Deferred |
| 15 | Custom transition animations | All | Deferred |
| 16 | Back navigation | All | Deferred |
| 17 | Skip/fast-track option | All | Deferred |
| 18 | Experience level reconsideration | Your Training | Deferred |
| 19 | Optional section divider rewording | Your Training | Deferred |
| 20 | Frequency chips visual redesign | Your Training | Deferred |
| 21 | Screen 3 restructuring | Your Training | Deferred |
| 22 | Illustration/visual storytelling | All | Deferred |

---

## Process

For each Tier 1 item:
1. **Design deep-dive** — UX rationale, interaction spec, visual behavior, edge cases
2. **Code impact assessment** — what files change, new dependencies needed, design token additions
3. **Align with Drew** — confirm approach before implementing
4. **Implement** — write the code
5. **Test locally** — verify on device
6. **Update this checklist** — mark complete, note any follow-ups
