# 01-Concept: Standard Operating Procedure

This document is the complete guide for running the Concept phase. Follow it step-by-step.

---

## Phase Overview

**Purpose:** Transform a vague idea into a validated, scoped product concept.

**Duration:** 1-3 working sessions (2-6 hours total)

**Inputs:** An idea, however rough

**Outputs:**
- Completed `brief.md`
- Completed `competitive-analysis.md`
- Completed `problem-framing.md`
- Completed `risks-and-assumptions.md`
- Any research artifacts in `research/`

**Key Question:** "Should we build this, and what exactly is 'this'?"

---

## How Claude Participates

In this phase, Claude acts as a **strategic thinking partner**:

| Claude Does | Claude Doesn't |
|-------------|----------------|
| Ask probing questions | Propose UI solutions |
| Challenge assumptions | Jump to features |
| Identify risks | Write any code |
| Suggest research methods | Skip to visual design |
| Help frame problems | Make final decisions |
| Synthesize competitive insights | Assume user needs |

**Collaboration mode:** High dialogue, low artifact production. This phase is mostly conversation with documentation as output.

---

## Step-by-Step Process

### Step 1: Intake (30-60 min)

**Goal:** Capture the raw idea and initial context.

**Process:**

1. Start with the one-liner prompt:
   > "In one sentence, what are you building?"

2. Follow up with context questions:
   - Where did this idea come from?
   - What triggered the urgency to build it now?
   - Have you tried solving this problem other ways?
   - Who else has this problem besides you?

3. Capture initial references:
   - What existing products do you admire? Why?
   - What do you hate? Why?
   - Show me examples of good and bad.

4. Understand constraints:
   - Timeline? Budget? Technical constraints?
   - Solo or team? Skills available?
   - Platform requirements?

**Output:** Rough notes, enough to start `brief.md`

**Claude's role:** Ask the intake questions, push for specificity, capture answers.

---

### Step 2: Problem Definition (30-45 min)

**Goal:** Articulate the problem clearly before jumping to solutions.

**Process:**

1. Use the problem statement formula:
   > "[User type] struggles to [action/goal] because [obstacle], which results in [negative outcome]."

2. Validate with the "5 Whys":
   - Why is this a problem? → Answer
   - Why? → Deeper answer
   - Why? → Even deeper
   - Why? → Root cause emerging
   - Why? → Root cause identified

3. Distinguish problem from solution:
   - "I want to build an app that..." ← This is a solution
   - "Users can't easily..." ← This is a problem

   Always anchor to the problem. Solutions are hypotheses.

4. Scope the problem:
   - What's the core problem vs. adjacent problems?
   - What problems are we explicitly NOT solving?

**Output:** Draft of `problem-framing.md`

**Claude's role:** Challenge vague problem statements, push for specificity, help distinguish symptoms from root causes.

---

### Step 3: User Definition (30-45 min)

**Goal:** Define who we're building for with enough specificity to make decisions.

**Process:**

1. Start broad, then narrow:
   - Who has this problem?
   - Who has it worst?
   - Who would pay (time/money) to solve it?
   - Who is reachable?

2. Create a proto-persona:
   - Demographics (age, occupation, context)
   - Behaviors (what they do now)
   - Goals (what they want)
   - Frustrations (what blocks them)

3. Define the anti-persona:
   - Who are we NOT building for?
   - What user type would pull us off course?

4. Validate access:
   - Can we reach these users for feedback?
   - Do we have insight into their needs?

**Output:** User section of `brief.md`, input for `02-ux/personas.md`

**Claude's role:** Push for specificity, challenge assumptions about users, suggest ways to validate.

---

### Step 4: Competitive Analysis (45-90 min)

**Goal:** Understand the landscape to inform positioning and learn from others.

**Process:**

1. **Direct competitors:** Products solving the same problem
   - List 3-5 direct competitors
   - For each: What they do well, what they do poorly
   - Screenshot key screens, note patterns

2. **Indirect competitors:** Products solving adjacent problems
   - How do users solve this today without a dedicated tool?
   - What workarounds exist?

3. **Reference products:** Products to learn from (even if unrelated)
   - What specifically do you admire?
   - What patterns or approaches are worth stealing?

4. **Anti-patterns:** What to actively avoid
   - What feels wrong in existing solutions?
   - What visual or UX patterns are overdone?

5. **Synthesize insights:**
   - What opportunity exists?
   - Where is the gap?
   - What's table stakes vs. differentiator?

**Output:** Completed `competitive-analysis.md`

**Claude's role:** Help analyze competitors (via web search if needed), identify patterns, synthesize insights, challenge assumptions about differentiation.

---

### Step 5: Solution Hypothesis (30-45 min)

**Goal:** Form a hypothesis about how to solve the problem.

**Process:**

1. Brainstorm approaches:
   - Given the problem and users, what are 3-5 ways to solve it?
   - Don't filter yet—capture all ideas.

2. Evaluate approaches:
   - Which aligns best with user needs?
   - Which is feasible given constraints?
   - Which is differentiated from competitors?

3. Select primary approach:
   - Commit to one direction (can pivot later)
   - Articulate why this approach over others

4. State the hypothesis:
   > "We believe that [solution approach] will solve [problem] for [users] because [rationale]."

**Output:** Solution section of `brief.md`

**Claude's role:** Facilitate brainstorming, evaluate trade-offs, help articulate the hypothesis without pushing a preferred solution.

---

### Step 6: Scope Definition (30-45 min)

**Goal:** Define MVP—what's in v1, what's deferred.

**Process:**

1. List all potential features/capabilities
   - Don't filter yet—capture everything

2. Categorize using MoSCoW:
   - **Must have:** Core functionality, product doesn't work without it
   - **Should have:** Important but not critical for v1
   - **Could have:** Nice to have, low priority
   - **Won't have (this time):** Explicitly out of scope for v1

3. Validate MVP:
   - Can someone get value from just the "Must haves"?
   - Does it solve the core problem?
   - Is it buildable in reasonable time?

4. Document deferral rationale:
   - Why is each "Won't have" deferred?
   - What would trigger adding it later?

**Output:** Scope section of `brief.md`

**Claude's role:** Challenge scope creep, advocate for smaller MVP, help prioritize ruthlessly.

---

### Step 7: Risk Identification (20-30 min)

**Goal:** Surface risks and assumptions that could invalidate the concept.

**Process:**

1. List assumptions:
   - What are we assuming about users?
   - What are we assuming about the problem?
   - What are we assuming about the solution?
   - What are we assuming about the market?

2. Assess risk:
   - For each assumption: What if we're wrong?
   - Which assumptions are most critical?

3. Plan validation:
   - How can we test critical assumptions?
   - What would cause us to pivot or stop?

**Output:** Completed `risks-and-assumptions.md`

**Claude's role:** Surface assumptions the human might not see, stress-test the concept, suggest validation approaches.

---

### Step 8: Brief Finalization (15-30 min)

**Goal:** Complete and review the product brief.

**Process:**

1. Complete all sections of `brief.md`
2. Review for consistency
3. Read aloud—does it make sense?
4. The "30-second test": Can you explain it in 30 seconds?

**Output:** Finalized `brief.md`

**Claude's role:** Review for completeness, flag inconsistencies, help refine language.

---

### Step 9: Gate Review

**Goal:** Verify readiness to proceed to UX phase.

**Checklist:**

- [ ] `brief.md` is complete—all sections filled
- [ ] Problem statement is specific (not vague)
- [ ] Target user is clearly defined (not "everyone")
- [ ] At least 3 competitors/references analyzed
- [ ] MVP scope is defined and realistic
- [ ] Critical assumptions are documented
- [ ] You can explain the product in 30 seconds
- [ ] You're excited to keep going (gut check)

**If all boxes checked:** Proceed to `02-ux/SOP.md`

**If boxes unchecked:** Address gaps before proceeding

---

## Templates Reference

| Template | Purpose | When to Complete |
|----------|---------|------------------|
| `brief.md` | Product definition | Throughout, finalize at end |
| `competitive-analysis.md` | Landscape understanding | Step 4 |
| `problem-framing.md` | Problem clarity | Step 2 |
| `risks-and-assumptions.md` | Risk awareness | Step 7 |

---

## Common Pitfalls

### "We already know the users"
No you don't. Even if you're the user, you're not the only user. Do the persona work.

### "Let's just start building"
Building is expensive. Thinking is cheap. Spend more time here to save time later.

### "The MVP needs X feature"
If you can launch without it, it's not MVP. Be ruthless.

### "We're different from competitors"
Maybe. Prove it. Articulate the specific differentiation.

### "Everyone will want this"
No product is for everyone. Narrow focus beats broad appeal.

---

## Session Templates

### Kickoff Session Agenda (90 min)
1. Intake questions (30 min)
2. Problem definition (30 min)
3. User definition (30 min)

### Deep Dive Session Agenda (90 min)
1. Competitive analysis (60 min)
2. Solution hypothesis (30 min)

### Finalization Session Agenda (60 min)
1. Scope definition (30 min)
2. Risk identification (15 min)
3. Brief review (15 min)

---

## Completion Checklist

```
□ Step 1: Intake complete
□ Step 2: Problem definition complete
□ Step 3: User definition complete
□ Step 4: Competitive analysis complete
□ Step 5: Solution hypothesis complete
□ Step 6: Scope definition complete
□ Step 7: Risk identification complete
□ Step 8: Brief finalized
□ Step 9: Gate review passed
```

**Phase 01 complete. Proceed to Phase 02-UX.**
