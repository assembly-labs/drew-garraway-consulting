# 02-UX: Standard Operating Procedure

This document is the complete guide for running the UX phase. Follow it step-by-step.

---

## Phase Overview

**Purpose:** Design the experience—how users accomplish their goals—before any visual design.

**Duration:** 2-5 working sessions (4-12 hours total)

**Inputs:**
- Completed `01-concept/brief.md`
- Completed `01-concept/problem-framing.md`
- Research synthesis from `01-concept/research/`

**Outputs:**
- Completed `brand-voice-matrix.md`
- Completed `personas.md`
- Completed `user-stories.md`
- Completed `information-architecture.md`
- Completed `content-strategy.md`
- User flows in `flows/`
- Wireframes in `wireframes/`

**Key Question:** "How does the user accomplish their goal?"

---

## How Claude Participates

In this phase, Claude acts as an **experience design collaborator**:

| Claude Does | Claude Doesn't |
|-------------|----------------|
| Challenge complexity | Introduce visual design |
| Simplify flows | Suggest colors or fonts |
| Advocate for users | Create high-fidelity mockups |
| Draft content strategy | Write final copy |
| Map information architecture | Skip to code |
| Question every screen | Assume implementation details |

**Collaboration mode:** Structure-focused. Output is diagrams, flows, and structured documents—no pixels yet.

---

## Core Principle: Structure Before Style

This phase is about **bones, not skin**:

- What does the user need to do?
- What information do they need?
- What's the simplest path to success?
- What content supports the journey?

If you find yourself thinking about colors, spacing, or components—stop. You're in the wrong phase.

---

## Step-by-Step Process

### Step 0: Brand Voice Development (15-60 min)

**Goal:** Establish the verbal identity that will guide all product communication.

**Input:** Brand adjectives from `01-concept/brief.md`, target user, product personality

**Process:**

1. **Choose your workshop depth**

   Before starting, ask: "Do you want the Light workshop (15-20 min) or the Comprehensive workshop (45-60 min)?"

   - **Light:** Best for MVPs, time-constrained projects, or when voice isn't a primary differentiator
   - **Comprehensive:** Best for consumer products, content-heavy experiences, or when voice is a differentiator

2. **Complete the worksheet**

   Open `brand-voice-worksheet.md` and work through the selected path:

   **Light path covers:**
   - 3 personality words
   - How we sound / don't sound
   - Brand mentor
   - Sample welcome message
   - Words we use / avoid

   **Comprehensive path covers:**
   - Deep personality trait exploration
   - Brand archetype identification
   - Multiple brand mentors
   - Voice dimension ratings
   - Tone spectrum by context
   - Vocabulary and banned words
   - Competitive voice analysis
   - Multiple writing samples

3. **Synthesize into the matrix**

   Use worksheet answers to complete `brand-voice-matrix.md`:
   - Quick reference summary
   - Personality traits with definitions
   - Voice principles
   - Tone spectrum
   - Vocabulary guidelines

4. **Test the voice**

   Write 2-3 sample messages using the new voice matrix:
   - Does it feel right?
   - Would users trust this voice?
   - Is it distinct from competitors?

**Output:** Completed `brand-voice-matrix.md`

**Claude's role:** Facilitate the workshop, ask probing questions, synthesize answers into the matrix, challenge generic choices.

**Quality check:**
- [ ] Voice feels distinct, not generic
- [ ] Personality traits have clear meaning
- [ ] Tone guidance is actionable
- [ ] Sample messages feel authentic

---

### Step 1: Persona Development (60-90 min)

**Goal:** Create actionable user archetypes that guide design decisions.

**Input:** User research from Phase 01, target user from brief

**Process:**

1. **Review research synthesis**
   - What patterns emerged across users?
   - What segments are distinct?

2. **Draft primary persona**
   - Give them a name (realistic, not cute)
   - Demographics that matter (not exhaustive)
   - Goals (what they want to achieve)
   - Frustrations (what blocks them)
   - Behaviors (how they act now)
   - Context (when/where they'll use the product)

3. **Add secondary persona (if needed)**
   - Only if truly distinct needs
   - Maximum 2-3 total personas for MVP

4. **Define anti-persona**
   - Who would pull you off course?
   - Why are they explicitly excluded?

5. **Validate against research**
   - Does the persona reflect actual findings?
   - Or is it wishful thinking?

**Output:** Completed `personas.md`

**Claude's role:** Challenge persona assumptions, ensure grounding in research, push for specificity.

**Quality check:**
- [ ] Persona is specific enough to make decisions
- [ ] Persona is grounded in research, not imagination
- [ ] You can ask "Would [Persona] want this?" and answer it

---

### Step 2: User Story Mapping (90-120 min)

**Goal:** Define what users need to do, organized by importance.

**Input:** Personas, MVP scope from brief

**Process:**

1. **Identify epics (major goal areas)**
   - What are the 3-5 major things users do?
   - Each epic represents a user goal, not a feature

2. **Write stories for each epic**
   - Format: "As a [persona], I want to [action] so that [benefit]"
   - Focus on user goals, not system features
   - Bad: "As a user, I want a dashboard"
   - Good: "As a user, I want to see my progress at a glance"

3. **Add acceptance criteria**
   - Format: "Given [context], when [action], then [outcome]"
   - Be specific enough to test
   - Not implementation details

4. **Prioritize using MoSCoW**
   - Must have: Product fails without it
   - Should have: Important but not critical
   - Could have: Nice to have
   - Won't have: Explicitly excluded

5. **Create story map visualization**
   - Horizontal: User journey steps
   - Vertical: Priority (must → could)

**Output:** Completed `user-stories.md`

**Claude's role:** Question scope, push for user-centric framing, challenge "must haves."

**Quality check:**
- [ ] Stories are user goals, not features
- [ ] Acceptance criteria are testable
- [ ] Must haves are truly essential
- [ ] Stories trace back to personas

---

### Step 3: User Flow Design (90-120 min)

**Goal:** Map how users move through the product to accomplish goals.

**Input:** User stories, personas

**Process:**

1. **Identify core flows**
   - What are the 3-5 most important journeys?
   - Start with "must have" user stories

2. **Map each flow**
   - Entry point: Where does the user start?
   - Steps: What actions do they take?
   - Decisions: Where do paths branch?
   - End point: How do they know they're done?
   - Edge cases: What can go wrong?

3. **Simplify relentlessly**
   - Can any step be removed?
   - Can any step be combined?
   - What's the minimum path to success?

4. **Add error and edge cases**
   - What if the user makes a mistake?
   - What if data is missing?
   - What if the system fails?

5. **Document in `flows/` folder**
   - Use consistent notation
   - Include all paths (happy + unhappy)

**Output:** Flow diagrams in `flows/`

**Claude's role:** Question every step, advocate for simplicity, identify missing edge cases.

**Quality check:**
- [ ] Flows start from a clear user need
- [ ] Every step has a purpose
- [ ] Error paths are defined
- [ ] Flows are testable without UI

---

### Step 4: Information Architecture (60-90 min)

**Goal:** Define how content and functionality is organized.

**Input:** User flows, content types, user stories

**Process:**

1. **Inventory content/features**
   - What screens/pages exist?
   - What content types appear?
   - What actions are available?

2. **Group and organize**
   - What belongs together?
   - What's the hierarchy?
   - Use card sorting principles

3. **Define navigation model**
   - Primary nav: Always visible, core areas
   - Secondary nav: Within sections
   - Utility nav: Settings, help, profile

4. **Map URL structure (if web)**
   - Clean, predictable patterns
   - Reflects IA hierarchy

5. **Document page states**
   - Empty state
   - Loading state
   - Populated state
   - Error state

**Output:** Completed `information-architecture.md`

**Claude's role:** Challenge hierarchy, ensure consistency, question navigation complexity.

**Quality check:**
- [ ] User can find anything in 3 clicks/taps
- [ ] Navigation is predictable
- [ ] URL structure makes sense
- [ ] All states are defined

---

### Step 5: Content Strategy (60-90 min)

**Goal:** Define how we communicate with users—voice, tone, patterns.

**Input:** Brand adjectives from brief, personas

**Process:**

1. **Define voice attributes**
   - Voice is consistent (who we are)
   - 3-4 attributes that always apply
   - And what we're never

2. **Define tone variations**
   - Tone adapts to context
   - Onboarding: [How we sound]
   - Errors: [How we sound]
   - Success: [How we sound]
   - Empty states: [How we sound]

3. **Establish writing principles**
   - Clarity over cleverness
   - Specific guidance for this product

4. **Create terminology glossary**
   - What terms do we use?
   - What terms do we avoid?
   - Internal consistency

5. **Document content patterns**
   - Headings: How we title things
   - CTAs: How we prompt action
   - Errors: How we communicate problems
   - Empty states: How we fill the void

**Output:** Completed `content-strategy.md`

**Claude's role:** Draft initial content patterns, challenge jargon, ensure consistency with brand.

**Quality check:**
- [ ] Voice is distinct, not generic
- [ ] Tone guidance is actionable
- [ ] Terminology is consistent
- [ ] Patterns prevent "AI aesthetic" copy

---

### Step 6: Wireframing (120-180 min)

**Goal:** Create low-fidelity layouts that validate structure and flow.

**Input:** All previous outputs

**Process:**

1. **Start with core screens**
   - What are the 5-7 most important screens?
   - Focus on "must have" user stories

2. **Block out content zones**
   - What information appears?
   - What actions are available?
   - What's the hierarchy?

3. **Keep fidelity low**
   - Boxes and lines only
   - No colors, no real images
   - Placeholder text is fine
   - Goal: validate structure, not style

4. **Test against flows**
   - Walk through each flow with wireframes
   - Does the structure support the journey?
   - What's missing?

5. **Document decisions**
   - Why is X above Y?
   - Why this layout, not another?

**Output:** Wireframes in `wireframes/`

**Claude's role:** Describe wireframe structures (ASCII or detailed descriptions), validate against flows.

**Quality check:**
- [ ] Wireframes are low-fidelity (no visual design)
- [ ] Every element has a purpose
- [ ] Flows work with these layouts
- [ ] Core screens are covered

---

### Step 7: Gate Review

**Goal:** Verify readiness to proceed to UI phase.

**Checklist:**

- [ ] Personas documented and grounded in research
- [ ] User stories written for all MVP features
- [ ] User stories prioritized (MoSCoW)
- [ ] Core user flows mapped with edge cases
- [ ] Information architecture defined
- [ ] Content strategy established (voice, tone, patterns)
- [ ] Key screens wireframed
- [ ] No visual design has crept in (no colors, no fonts)
- [ ] You can walk someone through the product without mockups

**If all boxes checked:** Proceed to `03-ui/SOP.md`

**If boxes unchecked:** Address gaps before proceeding

---

## Templates Reference

| Template | Purpose | When to Complete |
|----------|---------|------------------|
| `personas.md` | User archetypes | Step 1 |
| `user-stories.md` | Feature requirements | Step 2 |
| `flows/*.md` | User journeys | Step 3 |
| `information-architecture.md` | Structure | Step 4 |
| `content-strategy.md` | Communication | Step 5 |
| `wireframes/*` | Layout validation | Step 6 |

---

## Common Pitfalls

### "Let's just design it"
No. Structure first. You'll design faster and better if UX is solid.

### "Users will figure it out"
No they won't. If it's not obvious, it's wrong.

### Making personas fictional
Personas should synthesize real research, not imagine ideal users.

### Overloading wireframes with detail
Keep it rough. The goal is validation, not production.

### Ignoring edge cases
The empty state, error state, and loading state ARE the product for many users.

### Writing features, not stories
"Dashboard" is not a user story. "See my progress at a glance" is.

---

## Session Templates

### Session 1: Users & Goals (2 hours)
1. Persona development (60 min)
2. User story mapping - epics (30 min)
3. User story mapping - stories (30 min)

### Session 2: Flows & Structure (2 hours)
1. Core flow mapping (60 min)
2. Edge case flows (30 min)
3. Information architecture (30 min)

### Session 3: Content & Wireframes (2-3 hours)
1. Content strategy (60 min)
2. Wireframing key screens (90-120 min)

### Session 4: Review & Refine (1-2 hours)
1. Walk through complete experience
2. Identify gaps
3. Gate review

---

## Completion Checklist

```
□ Step 1: Personas complete
□ Step 2: User stories mapped and prioritized
□ Step 3: Core flows documented
□ Step 4: Information architecture defined
□ Step 5: Content strategy established
□ Step 6: Key screens wireframed
□ Step 7: Gate review passed
```

**Phase 02 complete. Proceed to Phase 03-UI.**
