# Team Workflow Guide

How we collaborate on code with a small team (1-3 people) using Claude Code.

## Git Branching Strategy

```
main (production - protected)
  │
  └── develop (integration - default branch)
        │
        ├── feature/user-auth
        ├── feature/dashboard
        ├── fix/login-bug
        └── prototype/v1
```

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/short-description` | `feature/user-auth` |
| Bug fix | `fix/short-description` | `fix/login-redirect` |
| Prototype | `prototype/version` | `prototype/v1` |
| Docs | `docs/short-description` | `docs/api-spec` |
| Experiment | `experiment/short-description` | `experiment/new-layout` |

### Branch Rules

| Branch | Who Creates | Who Merges | Requirements |
|--------|-------------|------------|--------------|
| `main` | Auto from develop | Lead only | All tests pass, reviewed |
| `develop` | Protected | Any team member | 1 approval, tests pass |
| `feature/*` | Anyone | Author after review | PR reviewed |
| `prototype/*` | Anyone | Author | No review needed |

---

## Pull Request Process

### Creating a PR

1. **Push your branch**
   ```bash
   git push -u origin feature/your-feature
   ```

2. **Create PR with this template**:
   ```markdown
   ## What
   [One sentence: what does this PR do?]

   ## Why
   [Why is this change needed? Reference ticket if applicable]

   ## Ticket
   Closes #[ticket-number] or "See TICKETS.md #3"

   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] Tested on mobile

   ## Screenshots
   [If UI changes, add before/after screenshots]

   ## Notes for Reviewer
   [Anything specific to look at?]
   ```

3. **Request review** from at least one teammate

### Reviewing a PR

**What to check:**

| Area | Questions |
|------|-----------|
| **Logic** | Does the code do what it claims? |
| **Patterns** | Does it follow our existing patterns? |
| **Edge cases** | What happens with empty data? Errors? |
| **Security** | Any exposed secrets? Unvalidated input? |
| **Performance** | Any obvious performance issues? |
| **Readability** | Could a junior dev understand this? |

**Review comments:**

- Be specific and constructive
- Suggest solutions, not just problems
- Use "nit:" for minor style issues
- Use "blocking:" for must-fix issues

### Merging

1. All conversations resolved
2. At least 1 approval (or Lead approval for critical changes)
3. All CI checks pass
4. Squash merge to keep history clean

---

## Commit Messages

### Format

```
type: short description

[optional body explaining why]

[optional footer with ticket reference]
```

### Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that doesn't fix bug or add feature |
| `test` | Adding tests |
| `chore` | Build process, dependencies |

### Examples

```
feat: add user login page

fix: prevent crash on empty cart

docs: update API documentation

refactor: simplify auth middleware

chore: update dependencies
```

---

## Working with Claude Code as a Team

### Before Starting Work

1. **Pull latest changes**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   ```

2. **Read CLAUDE.md** to understand current context

3. **Check TICKETS.md** for what to work on

### During Work

1. **One ticket at a time** - Don't mix multiple features
2. **Commit frequently** - Small, atomic commits
3. **Update CLAUDE.md** if you establish new patterns
4. **Ask in Slack/Discord** if you're unsure about something

### After Work

1. **Push your branch**
2. **Create PR**
3. **Update TICKETS.md** to mark in-progress or done
4. **Notify team** in Slack/Discord

---

## Communication

### Daily Async Standup (Slack/Discord)

Post by 10am:
```
**Yesterday:** [what you completed]
**Today:** [what you're working on]
**Blockers:** [anything blocking you]
```

### When to Ask for Help

- **Stuck for 30+ minutes** on the same issue
- **Unsure about architecture** decisions
- **Found a security concern**
- **Need to change established patterns**

### Where to Communicate

| Topic | Channel |
|-------|---------|
| Quick questions | Slack/Discord #dev |
| PR discussions | GitHub PR comments |
| Architecture decisions | Meeting or #dev-decisions |
| Bug reports | GitHub Issues |

---

## File Ownership

### Who Owns What

| Area | Owner | Others Can |
|------|-------|------------|
| `/docs/brand/*` | Designer | Read, suggest |
| `/docs/technical/*` | Lead (or senior) | Contribute with review |
| `/src/components/ui/*` | Designer | Use, minor fixes |
| `/src/api/*` | Lead (or senior) | Contribute with review |
| `CLAUDE.md` | Everyone | Update as needed |
| `TICKETS.md` | Lead | Everyone marks progress |

### Making Changes to Owned Files

If you need to change someone else's owned file:
1. Discuss with owner first (Slack/Discord)
2. Create PR and request their review
3. Wait for their approval before merging

---

## Conflict Resolution

### Code Conflicts

1. Pull latest develop into your branch
   ```bash
   git checkout develop
   git pull
   git checkout your-branch
   git merge develop
   ```

2. Resolve conflicts locally

3. Test everything still works

4. Push and update PR

### Design/Architecture Conflicts

1. **State your case** in writing (Slack or PR comment)
2. **Lead makes final call** if no consensus
3. **Document the decision** in relevant docs
4. **Move on** - No relitigating decided issues

---

## Weekly Sync

**When**: Once per week, 30 minutes

**Agenda**:
1. Demo what was built (5 min each)
2. Review blockers (5 min)
3. Plan next week's priorities (10 min)
4. Update TICKETS.md together (5 min)

**Output**: Updated TICKETS.md with next week's priorities

---

## Emergency Procedures

### Production is Down

1. **Notify team immediately** in Slack/Discord
2. **Lead takes point** (or most senior available)
3. **Rollback if needed**: `git revert` the breaking commit
4. **Fix forward** only after stable
5. **Post-mortem** within 24 hours

### Security Issue Found

1. **Do not discuss in public channels**
2. **DM the Lead** immediately
3. **Do not push fix** until reviewed
4. **Coordinate disclosure** if user data affected
