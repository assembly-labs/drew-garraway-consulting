# How to Use the Features System

A guide for Drew (and Claude) on how to use the features backlog, issue tracker, and changelog together to plan, build, and ship TOMO features.

---

## The Three Docs and When to Use Each

| Doc | What it tracks | Location |
|-----|----------------|----------|
| **Features Backlog** | What we're building next | `docs/features/README.md` |
| **Issues Tracker** | Bugs, polish, design audit items | `docs/mvp-1.0/tracking/ISSUES.md` |
| **Changelog** | What shipped, per session | `docs/mvp-1.0/tracking/CHANGELOG.md` |

**Simple rule:** Features = planned work. Issues = broken/rough things. Changelog = shipped things.

---

## Workflows

### 1. "I have an idea for a new feature"

**Steps:**
1. Add a row to `features/README.md` with a FEAT- ID, one-line summary, and priority
2. If it's a **minor feature** (< 1 session of work), that's enough. The row is the spec.
3. If it's a **major feature** (multi-session, needs research/strategy), create a subfolder:

```
docs/features/<feature-name>/
  README.md      -- Overview, status, decision log
  STRATEGY.md    -- Approaches considered, tradeoffs, recommendation
  SPEC.md        -- Screen-by-screen UX spec (once approach is picked)
  DATA_MODEL.md  -- Database/schema changes needed
  TASKS.md       -- Ordered implementation steps
```

You don't need all files on day one. Start with README.md and STRATEGY.md. Add the rest as the feature matures.

---

### 2. "I want to explore a design direction"

This is the **Exploring** phase. Here's what happens:

1. Open (or create) the feature's `STRATEGY.md`
2. Research the problem. Document what you find.
3. Write 2-3 approaches with tradeoffs (never just one)
4. Add a recommendation with reasoning
5. Update the feature's status to **Exploring** in the backlog
6. Talk it through with Drew. Pick a direction.
7. Once decided, update STRATEGY.md with the decision and move status to **Speccing**

**Example:** The Experience Intake feature went through this exact process. Three approaches (Timeline, Conversation, Journal Seed), tradeoffs documented, Approach B recommended.

---

### 3. "We picked an approach, now I need to spec it out"

This is the **Speccing** phase:

1. Create `SPEC.md` in the feature subfolder
2. Write screen-by-screen UX spec:
   - What the user sees
   - What inputs are available (chips, voice, text)
   - What TOMO says (exact copy)
   - What data gets captured
   - What happens on skip
3. Create `DATA_MODEL.md` if the feature needs schema changes:
   - New tables or columns
   - Migration SQL
   - How data maps to existing types
4. Create `TASKS.md` with ordered implementation steps:
   - Each task should be ~1 session of work or less
   - Mark dependencies between tasks
   - Include "done when" criteria for each
5. Update status to **Ready** in the backlog

---

### 4. "I'm ready to build"

This is the **In Progress** phase:

1. Update backlog status to **In Progress**
2. Open the feature's `TASKS.md` and start working through tasks in order
3. Follow normal session workflow:
   - Build the thing
   - Test locally
   - Update `CHANGELOG.md` at end of session
   - Update `ISSUES.md` if bugs come up
   - Check off completed tasks in `TASKS.md`
4. When all tasks are done, update backlog status to **Shipped**

---

### 5. "I found a bug" or "This screen feels off"

**Don't put this in the features backlog.** Bugs and polish go in `ISSUES.md`:

1. Add entry to `docs/mvp-1.0/tracking/ISSUES.md`
2. Use the existing format: SHORT-ID, Priority, Area, Description
3. Prefixes: `BUG-` for bugs, `DA-` for design audit, `DS-` for design system, `CR-` for code review items

---

### 6. "I shipped something"

At the **end of every coding session:**

1. Add dated entry to `docs/mvp-1.0/tracking/CHANGELOG.md`
2. Mark resolved items as Done in `ISSUES.md`
3. If a feature shipped, update its status in `features/README.md` and move to the Completed table

---

### 7. "I'm starting a new Claude Code session"

At the **start of every session**, Claude reads:

1. `features/README.md` -- What's the current priority?
2. `ISSUES.md` -- Any blockers or open bugs?
3. Latest `CHANGELOG.md` entry -- What happened last session?
4. If working on a specific feature: that feature's subfolder

This is already in CLAUDE.md as a mandatory step.

---

## Feature Lifecycle

```
Idea --> Exploring --> Speccing --> Ready --> In Progress --> Shipped
 |          |            |          |           |              |
 |     STRATEGY.md   SPEC.md    TASKS.md   CHANGELOG.md    Done!
 |                   DATA_MODEL.md
 |
 Row in features/README.md (minor features stop here)
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Feature ID | FEAT-NNN | FEAT-001 |
| Feature subfolder | kebab-case | `experience-intake/` |
| Strategy/spec files | SCREAMING_SNAKE.md | `STRATEGY.md` |
| Bug IDs | BUG-NNN | BUG-005 |
| Design audit IDs | DA-NNN | DA-001 |

---

## Tips

- **Don't over-document minor features.** A row in the backlog table is fine for anything that takes less than a session to build.
- **STRATEGY.md is the most important file for major features.** It captures *why* you chose an approach, which matters months later when you've forgotten the context.
- **Keep the backlog short.** If it grows past ~15 items, some of those items aren't real priorities. Move them to a "Future" section or delete them.
- **Features and Issues don't overlap.** If something is broken, it's an issue. If something doesn't exist yet, it's a feature. Cross-reference when needed (e.g., "FEAT-002 will resolve DA-001").
