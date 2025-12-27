# Phase Gate Checklists

Use these checklists before transitioning between phases.

---

## Phase 0 → Phase 1: Research Complete

**Gate Question**: Is this a real problem worth solving?

### Checklist

- [ ] Market research documented (`docs/research/MARKET-ANALYSIS.md`)
- [ ] Competitor analysis complete (`docs/research/COMPETITOR-ANALYSIS.md`)
- [ ] User research conducted (`docs/research/USER-RESEARCH.md`)
- [ ] Problem statement clear (`docs/research/PROBLEM-STATEMENT.md`)
- [ ] Team aligned on problem definition
- [ ] Decision: Proceed or pivot?

### Exit Criteria
We proceed if we can answer "yes" to:
- Is this a real problem people have?
- Is the market large enough?
- Can we differentiate from competitors?

---

## Phase 1 → Phase 2: Strategy Defined

**Gate Question**: Is the solution viable and differentiated?

### Checklist

- [ ] Vision and mission defined (`docs/strategy/VISION.md`)
- [ ] Value proposition clear (`docs/strategy/VALUE-PROP.md`)
- [ ] Target audience defined (`docs/strategy/TARGET-AUDIENCE.md`)
- [ ] Success metrics set (`docs/strategy/SUCCESS-METRICS.md`)
- [ ] PRD drafted (`docs/PRD.md`)
- [ ] Feature list prioritized (`docs/FEATURE-LIST.md`)
- [ ] Team aligned on what we're building

### Exit Criteria
We proceed if we can answer "yes" to:
- Can we clearly articulate what we're building?
- Do we know who it's for?
- Do we know what success looks like?

---

## Phase 2 → Phase 3: Brand Established

**Gate Question**: Is the brand cohesive and differentiated?

### Checklist

- [ ] Brand voice defined (`docs/brand/BRAND-VOICE.md`)
- [ ] Visual identity defined (`docs/brand/VISUAL-IDENTITY.md`)
- [ ] Color palette selected
- [ ] Typography selected
- [ ] Design tokens created (if applicable)
- [ ] Team aligned on brand direction

### Exit Criteria
We proceed if we can answer "yes" to:
- Does the brand feel consistent?
- Does it differentiate from competitors?
- Can we apply it consistently to designs?

---

## Phase 3 → Phase 4: UX Defined

**Gate Question**: Do the flows make sense for target users?

### Checklist

- [ ] User flows documented (`docs/design/USER-FLOWS.md`)
- [ ] Information architecture clear (`docs/design/INFORMATION-ARCHITECTURE.md`)
- [ ] Wireframes/descriptions complete (`docs/design/WIREFRAMES.md`)
- [ ] Features prioritized for prototype (`docs/FEATURE-LIST.md`)
- [ ] Team aligned on UX approach

### Exit Criteria
We proceed if we can answer "yes" to:
- Can users accomplish their goals?
- Is the flow intuitive?
- Have we validated with potential users?

---

## Phase 4 → Phase 5: Prototype Validated

**Gate Question**: Does the prototype validate the concept with users?

### Checklist

- [ ] Prototype code complete (`/prototype/`)
- [ ] All MVP screens implemented
- [ ] Mock data in place (`prototype/src/mocks/`)
- [ ] Prototype deployable/shareable
- [ ] Tested with at least 3-5 target users
- [ ] Feedback documented
- [ ] Critical issues addressed
- [ ] Feature list finalized (locked for MVP)

### Exit Criteria
We proceed if we can answer "yes" to:
- Do users understand the product?
- Can users complete core flows?
- Is the feedback generally positive?
- Are we confident in the feature list?

---

## Phase 5 → Phase 6: Technical Plan Ready

**Gate Question**: Is the plan clear enough for any developer + Claude Code to execute?

### Checklist

- [ ] Architecture documented (`docs/technical/ARCHITECTURE.md`)
- [ ] Database schema defined (`docs/technical/DATABASE-SCHEMA.md`)
- [ ] API spec complete (`docs/technical/API-SPEC.md`)
- [ ] Handoff document complete (`docs/HANDOFF.md`)
- [ ] Development tickets created (`docs/TICKETS.md`)
- [ ] Tech stack decisions finalized
- [ ] Environment variables documented
- [ ] Team aligned on approach

### Exit Criteria
We proceed if we can answer "yes" to:
- Could a new developer start building from these docs?
- Are all technical decisions made?
- Is the work broken into clear tickets?

---

## Phase 6 → Phase 7: MVP Complete

**Gate Question**: Does the MVP work correctly with real data?

### Checklist

- [ ] All MVP features implemented
- [ ] All pages connected to real data
- [ ] Authentication working end-to-end
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Basic testing complete
- [ ] Deployed to staging
- [ ] Tested on staging environment

### Exit Criteria
We proceed if we can answer "yes" to:
- Do all features work as expected?
- Is error handling graceful?
- Is performance acceptable?
- Is the staging environment stable?

---

## Phase 7: Launch Readiness

**Gate Question**: Are we ready for users?

### Checklist

- [ ] Production environment configured
- [ ] Monitoring/alerting set up
- [ ] Analytics implemented
- [ ] Error tracking configured
- [ ] Backup/recovery tested
- [ ] Security review complete
- [ ] Legal requirements met (privacy policy, terms)
- [ ] GTM materials ready
- [ ] Support process defined
- [ ] Team aligned on launch plan

### Exit Criteria
We launch if we can answer "yes" to:
- Can we handle users without breaking?
- Will we know if something goes wrong?
- Do we have a plan to respond to issues?

---

## How to Use This Document

1. **Before starting a phase transition**, review the relevant checklist
2. **Check off items** as they're completed
3. **If any items are blocked**, discuss with team before proceeding
4. **Document the gate decision** in team chat/meeting notes
5. **Move forward** only when checklist is complete and gate question is "yes"

---

## Phase Transition Template

When transitioning phases, post this in Slack/Discord:

```
📍 Phase Transition: [Phase X] → [Phase Y]

✅ Gate Question: [Question]
✅ Answer: Yes/No

Checklist Status:
- [x] Item 1
- [x] Item 2
- [ ] Item 3 (blocked by: reason)

Decision: Proceed / Wait / Pivot

Next Steps:
1. [Action]
2. [Action]
```
