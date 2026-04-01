# Experience Onboarding Design Session

Copy everything below the line into a new Claude Code conversation.

---

## Context

Read these files before responding:
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/CLAUDE.md`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/mvp-1.0/tracking/ISSUES.md`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/mvp-1.0/tracking/CHANGELOG.md`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/screens/onboarding/AboutYouScreen.tsx`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/screens/onboarding/YourTrainingScreen.tsx`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/screens/onboarding/GetStartedScreen.tsx`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/screens/ProfileScreen.tsx`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/tomo/src/screens/SessionLoggerScreen.tsx`
- `/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/TOMO/docs/product/BELT_PERSONALIZATION_SYSTEM.md`

## Your Role

You are a senior product designer specializing in mobile UX for fitness/training apps. You understand BJJ culture deeply. You know that a purple belt who downloads TOMO for the first time has 4-8 years of training, hundreds of sessions, a developed game with go-to techniques, competition history, injury history, training partners, and hard-won insights. TOMO knows none of this. The app starts them at zero, same as a day-one white belt. That's insulting and useless.

## The Problem

TOMO currently onboards every user the same way: name, belt, stripes, gym, frequency, goals, experience level, logging preference. That's it. Then the app is empty. No sessions, no techniques, no insights, no training arc.

For someone with 3+ months of experience (white belt with stripes through black belt), this creates three problems:

1. **Cold start gap.** TOMO's value proposition is insights from your training data. An experienced practitioner has zero data on day one. The app can't show them anything useful until they've logged 10-20+ sessions manually. That's weeks of friction before they see value.

2. **Lost context.** An experienced practitioner's journey matters. Their belt promotions, major injuries, competition results, technique evolution, gym changes -- this is the story of their training. Without it, TOMO treats a 6-year purple belt like they just walked in the door.

3. **Trust gap.** If TOMO doesn't acknowledge what they already know, experienced users won't trust it to understand what they're doing. The chat payoff says "I'll learn your game as we train together" but shows no effort to meet them where they are.

## What We Need

Design an "Experience Intake" flow that lives somewhere in the onboarding or early app experience for users who select 6mo+ experience (or any belt above fresh white). This flow should:

- **Capture their training arc** -- not every session, but the shape of their journey. When did they start? Belt promotion timeline. Major gyms. Key milestones.
- **Seed their technique profile** -- what's their A-game? What positions do they play? What do they hit most? This gives TOMO enough to start showing relevant insights immediately.
- **Acknowledge their history** -- competition record, injuries that shaped their game, training philosophy. This builds trust and lets TOMO personalize from session one.
- **Feel conversational, not like a form.** This is TOMO (友, friend). The intake should feel like telling a new training partner about yourself, not filling out a medical questionnaire.
- **Be completable in 3-5 minutes** but skippable at any point. More detail = better cold start, but never gate access.
- **Work within TOMO's existing design language** -- dark theme, gold accents, voice-optional, large touch targets, Inter/Unbounded/JetBrains Mono typography.

## Constraints

- Drew is a vibe coder. Explain your thinking step by step. Propose before implementing.
- TOMO is voice-first but this flow might be better as structured input (chips, selections, timelines) since it's reflective, not post-training.
- The existing onboarding is 4 screens and takes ~60 seconds. The experience intake should feel like a natural extension, not a separate app.
- Data captured here needs to map to TOMO's existing Supabase schema or propose clean schema additions.
- No AI/ML jargon in the UI. TOMO is a training partner, not a platform.

## Deliverables

1. **Flow map** -- screens, branching logic, skip points
2. **Screen-by-screen UX spec** -- what each screen asks, how input works, what TOMO says
3. **Data model** -- what gets stored, how it seeds insights
4. **Cold-start payoff** -- how TOMO uses this data immediately (first Journal view, first Insights view, first session log)
5. **Edge cases** -- what if they skip everything? What if they're a black belt with 20 years? What about someone returning after a long break?

Start by presenting 2-3 high-level approaches (not just one) with tradeoffs. Then we'll pick a direction together before going deep.
