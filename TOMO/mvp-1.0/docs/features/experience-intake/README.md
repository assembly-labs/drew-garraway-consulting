# FEAT-001: Experience Intake

**Priority:** P1
**Status:** Exploring (picking approach)
**Added:** 2026-03-29
**Owner:** Drew

---

## The Problem

TOMO currently onboards every user the same way: name, belt, stripes, gym, frequency, goals, experience level. Then the app is empty.

For someone with 3+ months of experience (white belt with stripes through black belt), this creates three problems:

1. **Cold start gap.** TOMO's value is insights from training data. An experienced practitioner has zero data on day one. They won't see value until they've logged 10-20+ sessions manually. That's weeks of friction.

2. **Lost context.** Belt promotions, major injuries, competition results, technique evolution, gym changes. This is the story of their training. Without it, TOMO treats a 6-year purple belt like they just walked in the door.

3. **Trust gap.** If TOMO doesn't acknowledge what they already know, experienced users won't trust it. The chat payoff says "I'll learn your game as we train together" but shows no effort to meet them halfway.

## Approach Decision

**Recommended: Approach B ("The Conversation")** with structured chip fallbacks from Approach A.

After existing onboarding completes, TOMO has a real conversation instead of the generic chat payoff. Belt-adapted questions with chip shortcuts for fast structured input, plus voice/text for users who want to elaborate. Skippable at any point.

Full analysis of all three approaches (with tradeoffs): [STRATEGY.md](STRATEGY.md)

## What Gets Captured

- **Training arc:** When they started, belt promotion timeline, major gyms
- **Technique profile:** Preferred positions, go-to techniques, A-game
- **Competition history:** None / casual / regular competitor
- **Injury context:** Current and past injuries that shape their game
- **Training philosophy:** What they're working on, goals for this chapter

## How It Pays Off

Once we have this data, TOMO can immediately:
- Show relevant technique insights on the Insights tab (once wired up, FEAT-002)
- Personalize session log prompts based on their game
- Acknowledge their history in the Journal empty state
- Seed the technique tree with their known techniques
- Flag injury-relevant warnings during session review

## Files

| File | Purpose |
|------|---------|
| [STRATEGY.md](STRATEGY.md) | Three approaches explored, tradeoffs, recommendation |
| SPEC.md | (future) Screen-by-screen UX spec |
| DATA_MODEL.md | (future) Supabase schema additions |
| TASKS.md | (future) Ordered implementation steps |

## Dependencies

- **FEAT-002 (Insights Tab)** should ship first or alongside. Experience Intake data is most valuable when Insights can display it.
- **Technique Tree** (361 techniques, 12 positions) already built. Experience Intake will reference it for position/technique selection.
- **Belt Personalization System** already built. Intake questions adapt based on belt level.

## Next Steps

1. Pick approach (Approach B recommended, needs Drew's sign-off)
2. Write detailed screen-by-screen spec (SPEC.md)
3. Define schema additions (DATA_MODEL.md)
4. Break into implementation tasks (TASKS.md)
5. Build and ship
