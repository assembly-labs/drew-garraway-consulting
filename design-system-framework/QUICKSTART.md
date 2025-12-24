# QUICKSTART: Using This Framework

**Start here.** This document walks you through setting up and using the design system framework for your project.

---

## What You're About to Do

You're going to take an idea and turn it into shipped software using a structured 4-phase process:

```
YOUR IDEA
    │
    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  01-CONCEPT    →    02-UX    →    03-UI    →    04-DEVELOPMENT     │
│  (Problem)         (Experience)   (Visual)      (Code)              │
│                                                                     │
│  "Should we        "How does      "How does     "Ship it"          │
│   build this?"      it work?"      it look?"                        │
└─────────────────────────────────────────────────────────────────────┘
    │
    ▼
LAUNCHED PRODUCT
```

Each phase builds on the previous. You'll work with Claude as a collaborative partner throughout.

---

## Before You Begin

**You need:**
- [ ] An idea for a software product (even if rough)
- [ ] Claude Code installed and running
- [ ] 2-3 hours for your first session (Concept phase)

**Helpful to have (but not required):**
- [ ] Notes on who might use this product
- [ ] Competitors or reference products you admire
- [ ] Any existing research or validation

---

## Setup (5 minutes)

### Step 1: Duplicate the Framework

```bash
# Copy the framework to your new project
cp -r design-system-framework my-project-name

# Navigate to your new project
cd my-project-name
```

### Step 2: Initialize Version Control (Recommended)

```bash
git init
git add .
git commit -m "Initial commit: design system framework"
```

### Step 3: Open in Your Editor

```bash
# If using VS Code
code .

# Or your preferred editor
```

### Step 4: Start Claude Code

Open Claude Code in your project directory. Claude will read `CLAUDE.md` and understand how to collaborate with you.

---

## Your First Session: 01-Concept

Your first working session focuses on defining the problem and scope. Here's what to expect:

### Duration
2-3 hours (can be split across multiple sittings)

### What You'll Do
1. Fill out the product brief (`01-concept/brief.md`)
2. Analyze competitors and references
3. Frame the problem clearly
4. Identify risks and assumptions
5. Define MVP scope

### How to Start

Say this to Claude:

```
I'm starting a new project using this design system framework.
Let's begin with Phase 01: Concept.

My idea is: [describe your idea in 1-2 sentences]

Please guide me through the concept phase using 01-concept/SOP.md.
```

Claude will:
- Read the SOP and guide you step-by-step
- Ask clarifying questions
- Help you fill out the templates
- Challenge your assumptions constructively
- Ensure you meet the phase gate criteria before moving on

### Output
By the end, you'll have:
- Completed `brief.md`
- Completed `competitive-analysis.md`
- Completed `problem-framing.md`
- Completed `risks-and-assumptions.md`
- Clear go/no-go decision on proceeding

---

## The Full Journey

| Phase | What Happens | Time Investment |
|-------|--------------|-----------------|
| **01-Concept** | Define problem, users, scope, risks | 2-4 hours |
| **02-UX** | Create personas, flows, wireframes, content | 4-10 hours |
| **03-UI** | Design tokens, components, visual system | 4-8 hours |
| **04-Development** | Build token system, components, ship | Varies |

**Total to MVP:** ~15-30 hours of focused work (much faster than traditional approaches)

---

## Phase Gates: When to Move On

Don't skip phases. Each phase has a gate checklist in its SOP. Only proceed when:

### Concept → UX
- [ ] Brief is complete and specific
- [ ] Problem is validated (you have confidence it's real)
- [ ] MVP scope is locked
- [ ] Risks are identified

### UX → UI
- [ ] Personas exist and are grounded in research
- [ ] Core user flows are mapped
- [ ] Wireframes cover key screens
- [ ] Brand voice matrix is complete
- [ ] Content strategy is defined

### UI → Development
- [ ] `MAGENTA.md` is complete
- [ ] `tokens.json` is finalized
- [ ] Key components are specified
- [ ] Visual design is approved

### Development → Launch
- [ ] All components built and in Storybook
- [ ] Core flows implemented
- [ ] Accessibility tested
- [ ] Ready for users

---

## Working with Claude: What to Expect

### Claude's Role Changes by Phase

| Phase | Claude Acts As |
|-------|----------------|
| 01-Concept | Strategic thinking partner — challenges assumptions, asks hard questions |
| 02-UX | Experience design collaborator — advocates for users, proposes flows |
| 03-UI | Visual design assistant — presents options, documents decisions |
| 04-Development | Implementation partner — writes code, follows specs exactly |

### The Collaboration Model

**You decide:**
- Strategic direction
- Subjective choices (colors, personality, scope)
- Go/no-go on phases

**Claude decides:**
- File structure and syntax
- Implementation details
- Objective technical choices

**You approve, Claude proposes:**
- Design options (Claude presents 2-3, you choose)
- Copy and content (Claude drafts, you refine)
- Component APIs (Claude designs, you validate)

### How to Get the Best Results

1. **Be honest about uncertainty.** Say "I'm not sure" rather than guessing.
2. **Answer Claude's questions.** The templates work when filled in thoughtfully.
3. **Push back when needed.** Claude should challenge you, and you can challenge Claude.
4. **Take breaks.** Phases are designed to be completable in sessions, not marathons.

---

## Key Documents Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `QUICKSTART.md` | How to use the framework | Now (you're here) |
| `PROCESS.md` | Deep dive on phases and gates | When you want full context |
| `CLAUDE.md` | AI collaboration rules | Claude reads this automatically |
| `*/SOP.md` | Step-by-step process per phase | When starting each phase |

---

## Troubleshooting

### "I don't know how to answer these questions"

That's normal. Start with what you know. Claude will help you explore the unknowns. The templates have guidance for each section.

### "This feels like a lot of work before coding"

It is. But it's less work than building the wrong thing and rebuilding. Each phase de-risks the next.

### "Can I skip a phase?"

Not recommended. If you're confident about UX (you've done user research), you might move faster through 02-UX. But don't skip the artifacts—they're the foundation for what follows.

### "My project is simple, do I need all this?"

Scale the depth, not the phases. A simple project might complete all phases in a day. But still touch each phase—the forcing function of the templates catches blind spots.

### "I got stuck in a phase"

Tell Claude: "I'm stuck on [specific thing]. Can you help me work through this?" Claude can break down complex decisions, offer frameworks, or suggest a lighter approach.

---

## Next Step

**Start now:**

1. Open `01-concept/SOP.md`
2. Tell Claude you're ready to begin Phase 01
3. Have your idea ready to describe

```
Claude, let's begin Phase 01: Concept.
Please guide me through the SOP.

My idea is: [your idea here]
```

---

## Quick Reference: Session Starters

Copy-paste these to start each phase:

### Starting 01-Concept
```
I'm ready to start Phase 01: Concept using this design system framework.
Please guide me through 01-concept/SOP.md step by step.
My idea is: [describe your product idea]
```

### Starting 02-UX
```
Phase 01: Concept is complete. I'm ready to move to Phase 02: UX.
Before we begin, I'll need to choose between the Light or Comprehensive
brand voice workshop. Please guide me through 02-ux/SOP.md.
```

### Starting 03-UI
```
Phase 02: UX is complete. I'm ready to move to Phase 03: UI.
Please guide me through 03-ui/SOP.md. Here's my moodboard/references: [link or describe]
```

### Starting 04-Development
```
Phase 03: UI is complete. I'm ready to move to Phase 04: Development.
Please guide me through 04-development/SOP.md.
My tech stack preference is: [React/Vue/Svelte/etc.]
```

---

*The framework is here to help, not constrain. Adapt as needed, but don't skip the thinking.*
