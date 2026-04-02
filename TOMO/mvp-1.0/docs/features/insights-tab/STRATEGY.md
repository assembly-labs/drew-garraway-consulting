# FEAT-002: Insights Tab -- Strategy

**Created:** 2026-03-30
**Status:** Exploring (awaiting Drew's decision)
**Decision:** Pending

---

## The Core Question

We have a full insights engine ready to deploy. The question isn't *what* to build -- it's **how should insights show up in the user's experience?**

Three dimensions to decide:

1. **Where do insights live?** Own tab vs. woven into existing screens
2. **What's the first impression?** What does a user see on day one, day seven, day thirty?
3. **How do insights feel?** Data dashboard vs. editorial narrative vs. conversational

---

## UX Research Grounding

### User states matter here

From the UX audit and persona research, TOMO users exist in two modes:

- **Exhausted (post-training):** 90-second window, reduced cognition, voice-first logging. Insights are irrelevant in this state -- users want to capture and leave.
- **Relaxed (browsing):** Couch, commute, rest day. Curious about progress. Open to depth, exploration, and reflection. **This is when insights deliver value.**

Insights are a "relaxed state" feature. The user who opens TOMO on a rest day to see what the app noticed about their week -- that's the target moment. Design should reward that curiosity.

### What the personas want from insights

**Alex (white belt, 0-6mo)** -- Needs validation that they're making progress. "You trained 3 times this week -- that's more than 80% of white belts at your stage" matters more than technique analysis. Risk: if insights are too technical or sparse, Alex feels like the app doesn't get them.

**Jake (white belt survivor, 6-18mo)** -- Approaching blue belt. Wants to know their game is developing. "You've drilled half guard sweeps in 4 of your last 6 sessions -- that's becoming your system" is the insight that makes Jake feel seen. Risk: Jake is the most likely to churn if TOMO feels like a dumb log.

**Marcus (blue belt, plateau)** -- Knows he's plateauing. Wants someone to see the patterns he can't. "Your submission rate dropped 20% this month, but your positional control improved -- that usually means you're working new positions instead of falling back on what works. That's how games evolve." Risk: shallow insights feel patronizing. Marcus needs analytical depth.

**Sofia (purple belt, grinder)** -- Already tracks mentally. She's looking for the blind spot -- the thing she hasn't noticed. "You haven't touched your back game in 6 weeks -- every session has been guard-focused" is useful because Sofia was doing it unconsciously. Risk: Sofia will stop checking if insights just confirm what she already knows.

### Cold start is real

A new user has zero sessions. After one week they might have 2-4 sessions. The insights engine has minimum thresholds (1 session for weekly, 5 for monthly, 2 monthly reviews for quarterly). The first-time experience MUST handle this gracefully without making the tab feel empty or pointless.

### The "show your training partner" moment

The strongest signal that insights are working: a user screenshots their weekly debrief and texts it to a training partner. This means the insight was specific enough to be interesting, personal enough to feel earned, and visual enough to be shareable. Every approach should be evaluated against this test.

---

## Approach A: "The Debrief" (Narrative-first, own tab)

Insights live in a dedicated tab. The latest insight plays with a typewriter animation -- text reveals character by character, gold glow trailing behind, like TOMO is composing the observation in real time. Older insights collapse below. Chat follow-up slides in after the text finishes.

### What the user sees

**Day 1 (0 sessions):**
A warm empty state. "Log your first session. After a week of training, your first debrief will appear here." No progress bars, no "building your profile" language -- just a clear promise of what's coming and when.

**Day 7 (3-4 sessions):**
First weekly insight auto-plays with typewriter. The user opens the tab and watches TOMO compose: "Three sessions this week, all gi classes. You drilled closed guard sweeps twice -- that repetition is building your foundation..." The text types out, gold cursor pulsing. When it finishes, a chat input fades in: "Ask about this insight..."

**Day 30 (12+ sessions):**
Monthly review appears above the weekly feed. Tapping it opens a full-page review with typewriter on first view. The monthly review names the user's developing game, evaluates consistency, flags concerns. Weekly insights below now reference the monthly context ("your monthly review flagged half guard as your developing system -- this week you drilled it twice").

**Day 90 (30+ sessions):**
Quarterly assessment at the top. A comprehensive review that feels like sitting down with a black belt. "Q1 2026: You went from a white belt who survived to one who hunts. Your half guard system is the foundation of a real game..." Weighty, strategic, referencing 3 months of data.

### Empty state progression

| Sessions logged | What they see |
|----------------|---------------|
| 0 | "Log your first session. Your first debrief will appear here after a week of training." |
| 1-2 | "Keep going. Your first weekly debrief needs a few more sessions to spot patterns." |
| 3+ (same week) | Weekly insight auto-generates and plays with typewriter |
| 5+ (same month) | Monthly review becomes available |
| 2+ monthly reviews | Quarterly assessment becomes available |

### Strengths

- **Strongest "wow" moment.** The typewriter animation creates anticipation. Users watch their insight being composed, which makes the content feel alive and personal rather than pre-rendered.
- **Matches TOMO's voice-first identity.** Just as users speak their sessions into existence, TOMO speaks its observations back. Text-first, narrative, conversational.
- **The prototype already proved it.** The web prototype's `TrainingFeedback.tsx` validated this design language -- typewriter, glow, chat input. Users responded well.
- **Shareability is high.** A typed-out narrative insight with gold glow on a dark background is visually striking enough to screenshot.
- **Chat follow-up is natural.** After reading an insight, "Ask about this" feels like continuing a conversation, not switching modes.

### Risks

- **Typewriter can feel slow.** A 200-word weekly insight at 20ms/character takes ~25 seconds. Users who open the tab repeatedly will want to skip quickly. Need a prominent skip button and remember which insights have been viewed.
- **Tab may feel empty early on.** Until the first weekly insight generates, the tab is an empty promise. Users who check on day 2-3 might write it off.
- **Engineering complexity for the typewriter port.** React Native doesn't have CSS text-shadow. The glow effect needs adaptation (color interpolation per character or simplified trailing color). The `SCREEN_IMPLEMENTATION_PLAN.md` estimates ~1,130 lines of new/changed code including the rewrite.
- **Over-invests in presentation.** If the insight content quality is mediocre, fancy animation makes it worse -- like a beautifully animated horoscope.

### Implementation complexity: Medium-High
All the backend, services, and types are built. The work is: port typewriter hook (~50 lines), build glow component (~100 lines), rewrite InsightsScreen to use them (~700 lines), wire navigation (~15 lines), deploy edge functions + migration. Estimated 1-2 sessions.

---

## Approach B: "Weekly Check-In" (Focused, own tab, no animation)

Ship the Insights tab with weekly insights only. No typewriter animation, no chat, no monthly/quarterly. Clean cards on a dark background. The most recent week's observations at the top, older weeks below. Simple, fast, focused on proving that TOMO can say something useful.

### What the user sees

**Day 1 (0 sessions):**
Same warm empty state as Approach A.

**Day 7 (3-4 sessions):**
A card appears with 2-3 observations. Each has a type badge (technique, consistency, sparring) and 1-2 sentences. Below: a "Focus Next Week" recommendation. No animation -- the content is just there when they open the tab.

**Day 14 (7+ sessions):**
Two weeks of cards. The newer week is expanded, older week collapsed. Users can compare weeks -- "Last week said focus on guard retention, this week says I drilled it 3 times. Progress."

**Day 30+ (enough data):**
Monthly and quarterly tiers are NOT shown. Instead, as enough data accumulates, we add them in a future update. This keeps scope tight and lets us validate weekly quality first.

### Strengths

- **Fastest to ship.** No typewriter port, no glow component, no chat wiring. Use the existing `InsightsScreen.tsx` as-is (it already renders weekly cards) -- just wire the tab, deploy the weekly edge function, and add the trigger. Could ship in a single session.
- **Lowest risk.** One edge function (Haiku, cheapest model), one generation trigger, minimal new code. If insight quality is poor, the blast radius is small.
- **Validates the core question first.** Before investing in monthly/quarterly/chat, we learn: do users actually read weekly insights? Do they come back to check? Is the content useful? Real usage data beats design speculation.
- **Weekly cadence matches training rhythm.** Most BJJ practitioners train 2-4x/week. A weekly summary is the natural reflection point -- not daily (too granular), not monthly (too delayed).

### Risks

- **No "wow" factor.** Static cards on a dark background won't impress. The insight content has to carry the experience alone. If the Haiku output is generic ("You trained 3 times this week. Good consistency."), users will check once and never return.
- **Underuses what's built.** The monthly, quarterly, chat, typewriter, glow -- all sitting unused. Drew invested significant design and engineering time in the full system. Shipping weekly-only might feel like leaving value on the table.
- **No chat means no depth.** If a weekly insight says something interesting ("Your submission rate dropped this week"), the user can't follow up. They just read it and move on. The conversation is where insights become coaching.
- **Harder to communicate the vision.** Showing this to potential investors, testers, or advisors is less impressive. "We have a weekly summary" vs. "We have a tiered coaching system with conversational follow-up."

### Implementation complexity: Low
Wire the existing InsightsScreen into the tab bar. Deploy one edge function + the database migration. Add a generation trigger after session save. Fix the 6 audit items. Estimated ~0.5 sessions.

---

## Approach C: "The Feed" (Insights woven into Journal)

Don't add a separate tab. Instead, insights appear as special cards in the Journal feed alongside session entries. A weekly debrief card appears at the end of each week. Monthly reviews appear at month boundaries. The Journal becomes a combined timeline of training and reflection.

### What the user sees

**Day 1 (0 sessions):**
Normal Journal empty state. No mention of insights -- the user just starts logging.

**Day 7 (3-4 sessions):**
Scrolling through the Journal, the user sees their logged sessions, then a new card type: "Weekly Debrief - Mar 24-30". Gold left border, sparkle icon, different visual weight than session cards. Tapping opens the full debrief with 2-3 observations and a focus recommendation.

**Day 30 (12+ sessions):**
The Journal feed now has a rhythm: sessions interspersed with weekly debriefs, and a "Monthly Check-In" card at the month boundary. The feed tells the full story of their training journey -- what they did AND what it means.

**Day 90 (30+ sessions):**
A "Quarterly Review" card appears. It's the most visually prominent card type in the feed. Opening it shows the comprehensive assessment. The Journal has become a living document of training and growth.

### Strengths

- **Zero navigation change.** No new tab, no icon debate, no 4-tab layout concerns. Insights just appear where the user already looks. Discovery is organic -- users don't have to know to check a separate tab.
- **Natural context.** Seeing a weekly debrief right after the sessions that informed it creates an immediate connection. "Oh, TOMO noticed the same thing I felt this week." The proximity of data and insight builds trust.
- **Solves the "empty tab" problem.** There's no empty state to manage for insights. New users see sessions. After a week, debriefs start appearing. The experience scales naturally.
- **Engagement through the existing habit loop.** Users already check the Journal after logging a session. Insights appearing there catch users in an existing behavior rather than requiring a new one (checking a separate tab).

### Risks

- **Insights get buried.** If a user logs 5 sessions in a week, the weekly debrief card is 5 items down in the feed. Users who don't scroll past their latest session will miss it entirely. This defeats the purpose.
- **No dedicated home for insights.** Users who want to review their monthly check-in from two months ago have to scroll through dozens of session entries to find it. There's no "insights history" view.
- **Feed gets cluttered.** Mixing session logs, weekly debriefs, monthly reviews, and quarterly assessments in one feed creates visual noise. Each card type needs distinct styling to avoid confusion, and the Journal's current clean session-list design gets complicated.
- **Chat follow-up is awkward.** Opening a chat conversation from within a Journal feed item doesn't have a natural home. Where does the chat live? Inline in the feed? A modal? A separate screen? None feel clean.
- **Harder to add later.** If we start with feed integration and later want a dedicated tab (which users may request), we'd need to either move insights out of the feed (breaking the pattern users learned) or duplicate them in both places (messy).
- **The "show your partner" moment is weaker.** A card buried in a feed of sessions is less shareable than a dedicated screen with prominent insights. The screenshot is cluttered with session entries above and below.

### Implementation complexity: Medium
Requires redesigning the Journal feed to support multiple card types (session vs. insight). New card components, feed data merging, scroll-to-insight navigation. The InsightsScreen as built doesn't apply -- it would need to be decomposed into individual card components embedded in the Journal. Estimated 1-2 sessions, but touches more existing code.

---

## Evaluation Matrix

| Criteria | A: The Debrief | B: Weekly Check-In | C: The Feed |
|----------|:-:|:-:|:-:|
| **"Wow" moment for new users** | Strong | Moderate | Weak |
| **Cold start handling** | Good (clear promise) | Good (clear promise) | Great (no empty state) |
| **Time to first value** | ~7 days | ~7 days | ~7 days |
| **Speed to ship** | 1-2 sessions | 0.5 sessions | 1-2 sessions |
| **Shareability (screenshot test)** | Strong | Moderate | Weak |
| **Scalability (monthly, quarterly, chat)** | Natural (already designed) | Requires future work | Complicated |
| **Risk if insight quality is weak** | High (animation amplifies bad content) | Low (static cards, easy to iterate) | Medium (mixed into trusted feed) |
| **Validates the right question** | "Do users value AI coaching?" | "Is weekly insight content useful?" | "Do users notice insights in context?" |
| **Uses existing code** | Most (with typewriter rewrite) | Most (existing screen as-is) | Least (new card components) |
| **Persona fit: Alex (newcomer)** | Good (feels personal) | OK (feels functional) | Good (discovers naturally) |
| **Persona fit: Marcus (plateau)** | Strong (depth + chat) | Moderate (no chat, no monthly) | Moderate (no dedicated depth) |
| **Persona fit: Sofia (grinder)** | Strong (quarterly strategy) | Weak (weekly only) | Moderate (context helps) |

---

## Recommendation

**Start with Approach B (Weekly Check-In), then graduate to Approach A (The Debrief).**

Here's the reasoning:

### Why not C (The Feed)

It solves discovery but creates bigger problems -- buried insights, cluttered feed, no home for chat, harder to extend to monthly/quarterly. It also means decomposing the existing InsightsScreen into embeddable components, which is more engineering work than just wiring what's built. And the screenshot test fails -- insights in a feed aren't shareable.

### Why not A (The Debrief) first

The typewriter animation is impressive, but it's presentation. If the underlying Haiku weekly output is generic or unhelpful, the animation makes it worse. We'd be polishing a feature we haven't validated. The React Native typewriter port also adds real engineering complexity (glow component, character-level rendering, performance testing on older devices) that delays the first user touchpoint.

### Why B first

**B answers the most important question: does TOMO's weekly insight content actually resonate with users?**

The existing InsightsScreen already renders weekly cards with type badges, titles, body text, and focus recommendations. It handles empty states, pull-to-refresh, and mark-as-viewed. It's built and works. Wiring it to the tab bar, deploying the weekly edge function, and adding a generation trigger is roughly half a session of work.

Once it ships, we watch:
- Do users open the Insights tab more than once?
- Do they open it on non-training days (the "rest day check-in" behavior)?
- Which insight types (technique, consistency, sparring, milestone) get the most views?
- Do users screenshot/share?
- What do testers say about content quality?

If weekly insights land well, Approach A becomes the graduation -- the typewriter animation, chat follow-up, monthly and quarterly tiers. We'd have real usage data to justify the investment and real content quality to make the animation feel earned.

If weekly insights don't land, we learn that before investing in animation, chat, and higher tiers. We iterate on the prompt engineering, the pattern engine's input quality, or the insight types themselves. This is much cheaper to learn at the B stage than the A stage.

### Proposed phasing

| Phase | What ships | Estimated effort |
|-------|-----------|-----------------|
| **Phase 1 (now)** | Insights tab with weekly cards. Tab icon, navigation wiring, DB migration, weekly edge function, generation trigger after session save. Existing InsightsScreen renders the output. | 0.5-1 session |
| **Phase 2 (after validation)** | Typewriter animation, glow text, "new insight" reveal experience. Monthly (Sonnet) edge function deployment. | 1-1.5 sessions |
| **Phase 3 (after monthly validation)** | Chat follow-up (5 exchanges). Quarterly (Opus) edge function. Full debrief experience. | 1-1.5 sessions |
| **Phase 4 (later)** | UCD learning from chat, feedback thumbs, progressive profiling | 1 session |

### What this means for the existing code

- **InsightsScreen.tsx** ships as-is in Phase 1. Gets the typewriter rewrite in Phase 2.
- **All 4 edge functions** are already built. We deploy weekly in Phase 1, monthly in Phase 2, quarterly + chat in Phase 3.
- **Database migration** deploys fully in Phase 1 (all 3 tables). The tables exist even if monthly/quarterly aren't generated yet.
- **SCREEN_IMPLEMENTATION_PLAN.md** becomes the Phase 2 spec (typewriter port, glow component, screen rewrite).
- **INTEGRATION_PLAN.md** maps to Phase 1 tasks (steps 1-8 in that doc).

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-30 | Elevated from "wire the tab" task to feature project | Core differentiator deserves product thinking, not just plumbing |
| 2026-03-30 | Approach B chosen, graduate to A | Drew confirmed. Validate content quality before investing in presentation. |
| 2026-03-30 | Focus on white belt + blue belt content first | Primary personas. Purple/brown/black content deferred. |
| 2026-03-30 | Sports psych research completed | PSYCHOLOGICAL_PROFILES.md -- 15 scenarios, tone matrix, 13 anti-patterns |
| 2026-03-30 | Design prototype built | design-prototype.html -- pixel-accurate to TOMO design tokens. Awaiting Drew's approval. |
| 2026-03-30 | Prompt engineering spec completed | PROMPT_ENGINEERING.md -- full system prompt redesign with motivation routing, age context, belt rules. training_goals already collected but unused -- wire it in Phase 1. |
| 2026-03-30 | FEAT-008 created as dependency | Birthday (mandatory, 18+), gender (onboarding), weight (optional), expanded goals. P0 alongside FEAT-002. |
| 2026-03-30 | SPEC.md + TASKS.md complete | Screen spec, edge function contract, 10 ordered tasks, ~3.5-4 hours estimated. Feature is Ready to build. |
| 2026-03-30 | Visual direction v2 approved | Message style (no cards/badges). Red left border for injuries only. Typewriter animation from onboarding chat payoff (25ms/char) on first view. No tab bar iconography in prototypes. |
| 2026-03-30 | FEAT-008 shipped | Birthday (mandatory), gender (mandatory), weight (optional), expanded goals all live in TestFlight. Insights prompt can now use all profile data. |
| 2026-03-30 | Dev specs split | SPEC_FRONTEND.md + SPEC_BACKEND.md created. Output schema simplified to paragraphs array with isWatch flag. Ready for development. |
| 2026-03-30 | Front-end built | TrendUp icon, 4-tab nav, useInsightTypewriter hook, parseBold utility, InsightsScreen rewrite (1,200 lines), insights-service dedup fix, new V2 types. TSC clean. Code review passed. |
| 2026-03-30 | Pre-insight gate | No insights until account is 7+ days old. Typewriter message explains what's coming. Two variants: 0 sessions vs has-sessions-but-too-new. |
| 2026-03-30 | Edge cases documented | 16 scenarios covered. Key addition: "This Week So Far" client-side feature bridges the gap between weekly AI debriefs. Tab is never empty after first session. |
