# Junior Developer Guide: Working with Claude Code

Welcome! This guide will help you work effectively with Claude Code as your AI development partner.

## Your Role

As a junior developer on this team, you will:
- Build features using Claude Code as your coding partner
- Follow established patterns and conventions
- Use internal docs to guide your work
- Ask for help when stuck (human teammates or Claude Code)

You are NOT expected to:
- Know everything
- Write all code from scratch
- Make architecture decisions alone

---

## Before You Start Any Task

### 1. Read the Context Files

**Always read these first:**

| File | What It Tells You |
|------|-------------------|
| `CLAUDE.md` | Project context, conventions, patterns |
| `docs/TICKETS.md` | What needs to be built |
| `docs/HANDOFF.md` | Technical decisions already made |
| `docs/PROCESS.md` | Where we are in the process |

### 2. Pull Latest Code

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-ticket-name
```

### 3. Understand Your Ticket

Before coding, make sure you understand:
- What am I building?
- What files will I need to touch?
- Are there similar patterns I can reference?

---

## How to Work with Claude Code

### Starting a Task

**Good prompt:**
```
I'm a junior developer working on Ticket 4: Product List Page.

Context:
- This is a Next.js project
- See CLAUDE.md for conventions
- Reference prototype: prototype/src/pages/Products.tsx
- Database schema: docs/technical/DATABASE-SCHEMA.md

Please help me build the production product list page.

Start by:
1. Reading the prototype file to understand the UI
2. Creating the API route to fetch products
3. Building the page component

Let's go step by step. What should we do first?
```

**Why this works:**
- States your experience level (Claude adjusts explanations)
- References specific files (Claude has context)
- Asks to go step by step (you can follow along)

### Bad Prompts to Avoid

```
❌ "Build the product page"
   (Too vague - which page? What kind of products?)

❌ "Fix the bug"
   (What bug? Where? What's happening?)

❌ "Make it work"
   (What's not working? What should it do?)
```

### Good Prompts to Use

```
✅ "I'm getting this error: [paste error].
    The relevant code is in src/pages/Products.tsx lines 45-60.
    What's wrong and how do I fix it?"

✅ "I need to add a delete button to ProductCard.tsx.
    It should call DELETE /api/products/[id] and refresh the list.
    Show me how to implement this following our existing patterns."

✅ "I'm confused about how the auth middleware works.
    Can you explain what happens in src/middleware.ts
    when a user visits a protected page?"
```

---

## When You're Stuck

### Try This First (15 minutes)

1. **Read the error message carefully** - it often tells you what's wrong
2. **Check the referenced files** - is the file path correct? Does the function exist?
3. **Ask Claude Code** - "I'm getting [error], what does this mean?"
4. **Check existing patterns** - how did we solve similar problems before?

### Ask for Human Help If

- You've been stuck for **30+ minutes**
- Claude Code seems to be going in circles
- You're unsure about an **architecture decision**
- Something feels **security-sensitive**
- You're about to **delete or modify someone else's code significantly**

### How to Ask for Help

**In Slack/Discord:**
```
🔴 Stuck on: [brief description]
📁 File: [which file]
🔍 Tried: [what you've tried]
❓ Question: [specific question]
```

**Example:**
```
🔴 Stuck on: Products API returning 500 error
📁 File: src/app/api/products/route.ts
🔍 Tried: Checked database connection, it works in other endpoints
❓ Question: Could it be a Prisma schema issue? Not sure how to debug.
```

---

## Understanding the Codebase

### File Structure Cheat Sheet

```
src/
├── app/                    # Pages and API routes (Next.js App Router)
│   ├── page.tsx           # Home page (/)
│   ├── dashboard/
│   │   └── page.tsx       # Dashboard page (/dashboard)
│   └── api/               # API routes
│       └── products/
│           └── route.ts   # /api/products endpoint
│
├── components/            # Reusable UI components
│   ├── ui/               # Basic components (Button, Input, etc.)
│   └── features/         # Feature-specific components
│
├── lib/                  # Utility functions
│   ├── db.ts            # Database connection
│   ├── auth.ts          # Auth helpers
│   └── utils.ts         # General helpers
│
└── types/               # TypeScript types
```

### Finding Things

| I need to find... | Look in... |
|-------------------|------------|
| A page component | `src/app/[route]/page.tsx` |
| An API endpoint | `src/app/api/[route]/route.ts` |
| A reusable component | `src/components/` |
| A utility function | `src/lib/` |
| TypeScript types | `src/types/` |
| How something works | Ask Claude Code to explain it |

---

## Common Tasks

### Adding a New Page

```
I need to add a new page at /settings.

Looking at existing pages like src/app/dashboard/page.tsx,
please create src/app/settings/page.tsx following the same pattern.

The page should:
- Be a server component
- Fetch user settings from the database
- Display a settings form
```

### Adding a New API Endpoint

```
I need to add a DELETE endpoint for products.

Reference: src/app/api/products/route.ts (the GET and POST handlers)

Please add a DELETE handler in a new file:
src/app/api/products/[id]/route.ts

It should:
- Check if user is authenticated
- Delete the product by ID
- Return appropriate success/error responses
```

### Fixing a Bug

```
There's a bug: When I click "Save" on the profile form, nothing happens.

Relevant files:
- src/components/features/ProfileForm.tsx (the form)
- src/app/api/user/route.ts (the API endpoint)

The form submits but I don't see any network request in DevTools.
Can you help me debug this?
```

### Understanding Existing Code

```
I need to understand how authentication works in this project.

Please read these files and explain:
- src/middleware.ts
- src/lib/auth.ts
- src/app/api/auth/[...nextauth]/route.ts

Explain like I'm a junior developer who knows React but is new to NextAuth.
```

---

## Git Workflow for Juniors

### Daily Workflow

```bash
# 1. Start of day - get latest code
git checkout develop
git pull origin develop

# 2. Create branch for your ticket
git checkout -b feature/ticket-4-product-list

# 3. Work on your code...

# 4. Commit frequently (every hour or after completing something)
git add .
git commit -m "feat: add product list API endpoint"

# 5. Push at end of day (or when done)
git push -u origin feature/ticket-4-product-list

# 6. Create PR on GitHub
```

### Commit Message Cheat Sheet

```bash
git commit -m "feat: add product list page"      # New feature
git commit -m "fix: handle empty cart error"     # Bug fix
git commit -m "docs: update API documentation"   # Documentation
git commit -m "style: format code"               # Formatting
git commit -m "refactor: simplify auth logic"    # Refactoring
```

### If You Mess Up Git

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Discard all local changes:**
```bash
git checkout .
```

**Get help:**
```
Tell Claude Code: "I accidentally [what happened] in git.
How do I undo this? I want to [desired outcome]."
```

---

## Safety Rules

### Never Do These Without Asking Lead

- [ ] Delete or rename database tables
- [ ] Change authentication logic
- [ ] Modify environment variables
- [ ] Push directly to `main` or `develop`
- [ ] Install new major dependencies
- [ ] Change CI/CD configuration

### Always Do These

- [ ] Test your changes locally before pushing
- [ ] Run `npm run build` to check for errors
- [ ] Check for TypeScript errors (red squiggles)
- [ ] Create a PR (never merge your own PRs)
- [ ] Ask if you're unsure

---

## Learning Tips

### Get Better with Claude Code

1. **Be specific** - More detail = better results
2. **Reference files** - "Like the pattern in X file"
3. **Ask to explain** - "Explain this code to me"
4. **Go step by step** - Don't try to build everything at once
5. **Verify output** - Don't blindly copy-paste, understand it

### When Claude Code Gets It Wrong

Claude Code isn't perfect. If something seems wrong:

1. **Question it** - "Are you sure about this? It seems like..."
2. **Ask for alternatives** - "What's another way to do this?"
3. **Reference docs** - "According to the Next.js docs, shouldn't it be..."
4. **Ask a human** - When in doubt, check with a teammate

### Build Your Skills

| Week 1-2 | Understand the codebase, do small fixes |
| Week 3-4 | Build small features with guidance |
| Month 2 | Build features more independently |
| Month 3+ | Start helping review others' PRs |

---

## Quick Reference Card

```
STARTING A TASK
□ Read CLAUDE.md
□ Read ticket in TICKETS.md
□ Pull latest code
□ Create feature branch
□ Find reference patterns

WORKING ON TASK
□ Work step by step
□ Commit frequently
□ Test as you go
□ Ask for help if stuck 30+ min

FINISHING A TASK
□ Run npm run build
□ Test manually
□ Push branch
□ Create PR
□ Request review
□ Update TICKETS.md

WHEN STUCK
1. Read error message
2. Ask Claude Code
3. Check existing patterns
4. Ask teammate (after 30 min)
```

---

## Getting Help

| Need | Where |
|------|-------|
| Quick code question | Claude Code |
| Stuck for 30+ min | Slack/Discord #dev |
| Architecture question | Lead or senior dev |
| Process question | This doc or PROCESS.md |
| Git help | Claude Code or teammate |

Welcome to the team! Don't be afraid to ask questions - everyone was a junior once.
