# Experience Intake: Strategy & Approach Analysis

**Date:** 2026-03-29
**Status:** Exploring. Approach B recommended. Awaiting Drew's decision.

---

## Context

TOMO's current onboarding is 4 screens, ~60 seconds:

1. **Welcome** - branding splash
2. **About You** - name, belt, stripes
3. **Your Training** - gym, frequency, goals, experience level
4. **Get Started** - voice/text preference, mic permission, chat payoff

After that, the app is empty for everyone. The experience intake solves the cold-start problem for users with 6mo+ training experience.

---

## Three Approaches Considered

### Approach A: "The Timeline" - Structured screens after onboarding

**How it works:** When the user selects 6mo+ experience on YourTraining, TOMO adds 2-3 screens between YourTraining and GetStarted. Structured input: chips, sliders, multi-select. Same visual language as existing onboarding.

**Screens:**
1. **Your Journey** - "When did you start?" (year picker) + belt promotion timeline (tap each belt earned, approximate year). Optional: "Any major gym changes?"
2. **Your Game** - "What positions do you play?" (guard/half guard/mount/back/side control chips) + "Go-to techniques" (searchable multi-select from technique tree). Optional: "Any competition experience?"
3. **Your Body** - "Any injuries that affect your training?" (common BJJ injuries as chips: knee/shoulder/neck/back/fingers + custom). Optional: "Currently dealing with anything?"

Each screen has "Skip" in the top right.

**Tradeoffs:**

| Pro | Con |
|-----|-----|
| Structured data maps cleanly to Supabase | Feels like a medical intake form |
| Built on existing onboarding patterns | Belt timeline UI is fiddly on mobile |
| Chip-based input is fast, no typing needed | Adds screens to a 4-screen flow, users may bail |
| Predictable 2-3 minute addition | "Your Body" screen feels clinical |

---

### Approach B: "The Conversation" - TOMO asks, you talk (RECOMMENDED)

**How it works:** After existing onboarding completes, instead of the generic chat payoff, TOMO has a real conversation. Questions adapt based on belt level and experience. Users can respond via voice, text, or tap chip shortcuts.

**Question flow (adapts to belt):**
1. "How long have you been training?" (if not captured) / "When'd you get your [belt]?"
2. "What's your A-game? Positions you like to play?"
3. "Any competitions?" (blue+ only)
4. "Dealing with any injuries I should know about?"
5. "Anything else? Training philosophy, goals for this chapter?"

Each question shows chip shortcuts underneath (e.g., "Guard player" / "Top game" / "I play everywhere"). "Skip" always available.

**Tradeoffs:**

| Pro | Con |
|-----|-----|
| Feels like TOMO. Conversational, warm, matches brand | Voice responses need AI extraction (same pipeline complexity) |
| Voice lets experienced users dump rich context fast | Harder to get clean structured data from natural language |
| Extends the chat payoff (already built) instead of adding screens | Conversation pacing tricky: too many Qs = interrogation |
| Chip shortcuts give structured data reliability as fallback | More engineering work than Approach A |

---

### Approach C: "The Journal Seed" - Post-onboarding progressive capture

**How it works:** Onboarding stays as-is. After first launch, Journal screen shows a gold-bordered card: "Tell TOMO about your journey." Tapping opens a focused flow. Card persists until completed or dismissed 3 times.

**Tradeoffs:**

| Pro | Con |
|-----|-----|
| Zero friction added to onboarding | Weakest cold-start payoff (first views still empty) |
| Built independently, doesn't touch onboarding code | ~15-30% completion rate for optional post-onboarding tasks |
| Users fill in when ready | Doesn't solve trust gap at first impression |

---

## Recommendation: Approach B with A's Structure

**The hybrid:** TOMO's chat payoff becomes the intake. Conversational warmth from B, structured data reliability from A.

1. The chat payoff becomes the intake. TOMO asks 3-4 belt-adapted questions.
2. Each question has chip shortcuts underneath for fast structured input (like Approach A), but also accepts voice/text for elaboration.
3. Chips map directly to database fields. Voice responses get extracted for bonus context.
4. If the user skips everything, the generic payoff plays. No harm done.

**Why this wins:**
- TOMO is a training partner. The first conversation should demonstrate that.
- Chips give us clean structured data for the database without relying on voice extraction.
- Voice input lets experienced users share rich context that chips can't capture.
- The skip path means we never gate access or add friction for users who aren't interested.
- The chat payoff UI is already built. We're extending it, not building from scratch.

---

## Open Questions

1. **How many questions before it feels like too much?** 3 seems right. 5 is probably the max before it feels like an interrogation.
2. **Do we store voice responses as raw text?** Could be useful for future analysis. Adds a `intake_transcript` column.
3. **What if someone skips intake but wants to do it later?** Could add a "Tell TOMO about your journey" option in Profile. Low priority.
4. **How does this interact with FEAT-002 (Insights Tab)?** Intake data should seed the first Insights view. These features are better shipped together.
