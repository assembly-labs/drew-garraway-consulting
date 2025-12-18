# Prompt Property Manager QA Checklists

**Version:** 1.0
**Last Updated:** December 16, 2024
**Purpose:** Standardized quality assurance checklists for different stages of development

---

## Quick Reference: When to Use Each Checklist

| Stage | Checklist | Time Required |
|-------|-----------|---------------|
| Before PR | [Pre-PR Checklist](#pre-pr-checklist) | 10-15 min |
| PR Review | [Code Review Checklist](#code-review-checklist) | 15-30 min |
| Before Merge | [Pre-Merge Checklist](#pre-merge-checklist) | 5-10 min |
| Before Release | [Pre-Release Checklist](#pre-release-checklist) | 1-2 hours |
| After Deploy | [Post-Deploy Checklist](#post-deploy-checklist) | 15-30 min |

---

## Pre-PR Checklist

**When:** Before creating any pull request
**Who:** Developer creating the PR

### Code Quality

```markdown
- [ ] Code follows patterns in `/docs/DEVELOPMENT.md`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] No `console.log` statements
- [ ] No commented-out code
- [ ] No `// TODO` without associated issue
- [ ] No `any` types without justification
- [ ] Functions are under 50 lines
- [ ] Files are under 300 lines
```

### Testing

```markdown
- [ ] Unit tests written for new code
- [ ] Unit tests pass: `npm run test`
- [ ] E2E tests written (if user-facing)
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Coverage meets targets (80%+)
```

### Accessibility

```markdown
- [ ] `data-testid` on interactive elements
- [ ] `aria-label` on buttons/inputs
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
```

### Visual

```markdown
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1920px)
- [ ] No visual regressions
```

### Build

```markdown
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`
```

---

## Code Review Checklist

**When:** Reviewing a pull request
**Who:** PR reviewer

### Functionality

```markdown
- [ ] Code does what the PR description claims
- [ ] Edge cases are handled
- [ ] Error states are handled
- [ ] Loading states are handled
- [ ] Empty states are handled
```

### Code Quality

```markdown
- [ ] Code is readable and understandable
- [ ] Naming is clear and consistent
- [ ] No unnecessary complexity
- [ ] No code duplication (DRY)
- [ ] Follows existing patterns
- [ ] Types are correct (no implicit any)
```

### Testing

```markdown
- [ ] Tests cover the changes
- [ ] Tests are meaningful (not just for coverage)
- [ ] Tests follow naming conventions
- [ ] No skipped tests without justification
```

### Security

```markdown
- [ ] No hardcoded secrets/keys
- [ ] No sensitive data in logs
- [ ] User input is validated
- [ ] API calls have error handling
```

### Performance

```markdown
- [ ] No obvious performance issues
- [ ] No unnecessary re-renders
- [ ] Large lists are virtualized (if applicable)
- [ ] Images are optimized (if applicable)
```

### Accessibility

```markdown
- [ ] Interactive elements are keyboard accessible
- [ ] ARIA labels are present and correct
- [ ] Color contrast is sufficient
- [ ] Focus management is correct
```

---

## Pre-Merge Checklist

**When:** After approval, before merging
**Who:** Developer merging the PR

```markdown
- [ ] PR has required approvals
- [ ] All CI checks pass
- [ ] Branch is up to date with target branch
- [ ] No merge conflicts
- [ ] Commit messages follow convention
- [ ] PR description is complete
- [ ] Related issues are linked
```

---

## Pre-Release Checklist

**When:** Before deploying to production
**Who:** Release manager / QA lead

### Automated Checks

```markdown
- [ ] All CI pipelines pass
- [ ] Unit test coverage meets targets
- [ ] E2E tests pass on all browsers
- [ ] Build succeeds
- [ ] No security vulnerabilities (npm audit)
```

### Critical User Flows

Test each flow manually:

```markdown
### Chat Functionality
- [ ] Can type and send a message
- [ ] Response appears within 10 seconds
- [ ] Multi-turn conversation maintains context
- [ ] Citations appear with responses
- [ ] Disclaimer is visible
- [ ] Clear chat works
- [ ] Conversation persists on refresh (localStorage)

### Quick Questions
- [ ] All categories display
- [ ] Clicking category populates input
- [ ] Question gets answered correctly

### Escalation Flow
- [ ] Triggered for ambiguous questions
- [ ] "Send to Manager" button appears
- [ ] Mock confirmation displays
- [ ] Can dismiss and continue chatting

### Error Handling
- [ ] Graceful handling of API timeout
- [ ] Error message is user-friendly
- [ ] Can retry after error
- [ ] App doesn't crash on error
```

### Cross-Browser Testing

```markdown
### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari (iPhone)
- [ ] Android Chrome (Pixel/Samsung)
```

### Responsive Design

```markdown
- [ ] Mobile (375px) - iPhone SE
- [ ] Mobile (390px) - iPhone 14
- [ ] Tablet Portrait (768px) - iPad
- [ ] Tablet Landscape (1024px) - iPad
- [ ] Desktop (1280px) - Laptop
- [ ] Desktop (1920px) - Monitor
- [ ] Large Desktop (2560px) - 4K
```

### Accessibility Testing

```markdown
### Automated
- [ ] axe DevTools shows no violations
- [ ] Lighthouse accessibility score 90+
- [ ] WAVE shows no errors

### Manual
- [ ] Complete app using keyboard only
- [ ] Test with VoiceOver (Mac) or NVDA (Windows)
- [ ] Test at 200% zoom
- [ ] Test with high contrast mode
```

### Performance

```markdown
- [ ] Initial load under 3 seconds (3G)
- [ ] Time to interactive under 5 seconds
- [ ] Lighthouse performance score 80+
- [ ] No memory leaks in long session
```

### Security

```markdown
- [ ] No API keys in client bundle
- [ ] HTTPS enforced
- [ ] No sensitive data in localStorage
- [ ] CSP headers configured (if applicable)
```

### Legal/Compliance

```markdown
- [ ] Disclaimer visible on policy responses
- [ ] "Not legal advice" message present
- [ ] Demo mode indicator (if applicable)
```

---

## Post-Deploy Checklist

**When:** Immediately after deployment
**Who:** Developer who deployed

### Smoke Tests (5 minutes)

```markdown
- [ ] App loads without errors
- [ ] No console errors
- [ ] Can send a chat message
- [ ] Response is received
- [ ] Navigation works
```

### Monitoring (15 minutes)

```markdown
- [ ] Check error tracking (if configured)
- [ ] Check API response times
- [ ] Check for any 4xx/5xx errors
- [ ] Monitor for user reports
```

### Verification

```markdown
- [ ] Correct version deployed (check build hash/version)
- [ ] Environment variables are correct
- [ ] All features work as expected
- [ ] No visual regressions
```

### Communication

```markdown
- [ ] Notify team of successful deploy
- [ ] Update release notes (if applicable)
- [ ] Close related issues/PRs
```

---

## Bug Report Verification Checklist

**When:** Verifying a bug fix
**Who:** QA or developer

```markdown
- [ ] Bug is reproducible with steps in ticket
- [ ] Fix addresses the root cause
- [ ] Regression test added
- [ ] Original bug no longer occurs
- [ ] No new bugs introduced
- [ ] Works across browsers/devices
- [ ] Ready for merge
```

---

## Feature Verification Checklist

**When:** Verifying a new feature
**Who:** QA or product owner

```markdown
- [ ] Feature matches acceptance criteria
- [ ] All user story scenarios work
- [ ] Edge cases handled
- [ ] Error states handled
- [ ] Accessible via keyboard
- [ ] Works on mobile
- [ ] Performance acceptable
- [ ] Documentation updated
```

---

## Rollback Checklist

**When:** Rolling back a problematic deployment
**Who:** On-call developer

```markdown
### Immediate Actions
- [ ] Identify the issue
- [ ] Confirm rollback is needed
- [ ] Rollback via Cloudflare dashboard
- [ ] Verify previous version is live
- [ ] Notify team

### Post-Rollback
- [ ] Document what went wrong
- [ ] Create issue for the bug
- [ ] Plan fix and re-deployment
- [ ] Conduct post-mortem (if significant)
```

---

## Weekly Maintenance Checklist

**When:** Weekly (recommend Monday)
**Who:** Tech lead or designated developer

```markdown
### Dependencies
- [ ] Check for npm updates: `npm outdated`
- [ ] Review security alerts: `npm audit`
- [ ] Update patch versions if safe
- [ ] Test after updates

### Code Health
- [ ] Review open PRs (shouldn't be stale)
- [ ] Review open issues
- [ ] Check for TODO comments to address
- [ ] Review tech debt backlog

### Documentation
- [ ] PRD still accurate?
- [ ] Development docs still accurate?
- [ ] README still accurate?

### Testing
- [ ] Run full E2E suite
- [ ] Review test coverage trends
- [ ] Address flaky tests
```

---

## Printable Quick QA Card

Cut out and keep handy:

```
┌─────────────────────────────────────────┐
│         QUICK QA CHECKLIST              │
├─────────────────────────────────────────┤
│ BEFORE PR:                              │
│ □ npm run lint                          │
│ □ npm run type-check                    │
│ □ npm run test                          │
│ □ npm run build                         │
│ □ Test on mobile                        │
│ □ Test keyboard nav                     │
├─────────────────────────────────────────┤
│ BEFORE RELEASE:                         │
│ □ All CI green                          │
│ □ E2E tests pass                        │
│ □ Cross-browser tested                  │
│ □ Accessibility verified                │
│ □ Performance acceptable                │
├─────────────────────────────────────────┤
│ AFTER DEPLOY:                           │
│ □ App loads                             │
│ □ Core flow works                       │
│ □ No console errors                     │
│ □ Team notified                         │
└─────────────────────────────────────────┘
```
