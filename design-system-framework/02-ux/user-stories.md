# User Stories

> **Status:** Template — Fill in during 02-UX phase
>
> **Instructions:** Write stories from the user's perspective, not the system's. Focus on goals and outcomes, not features. Every story should connect to a persona.

---

## Story Format

### User Story Format
```
As a [persona name],
I want to [action/capability]
so that [benefit/outcome].
```

### Acceptance Criteria Format (Gherkin)
```
Given [context/precondition],
When [action/trigger],
Then [expected outcome].
```

---

## Story Writing Principles

1. **User goals, not features**
   - Bad: "As a user, I want a dashboard"
   - Good: "As a user, I want to see my progress at a glance"

2. **Specific personas, not generic users**
   - Bad: "As a user..."
   - Good: "As [Primary Persona Name]..."

3. **Outcomes, not solutions**
   - Bad: "...so that I can click a button"
   - Good: "...so that I can make an informed decision"

4. **Testable acceptance criteria**
   - Bad: "The system should be fast"
   - Good: "The page loads in under 2 seconds"

---

## Story Map Overview

*Horizontal axis: User journey steps. Vertical axis: Priority.*

```
Journey:    [Step 1]        [Step 2]        [Step 3]        [Step 4]
            ─────────────────────────────────────────────────────────
Must Have   │ Story 1.1 │   │ Story 2.1 │   │ Story 3.1 │   │ Story 4.1 │
            ├───────────┤   ├───────────┤   ├───────────┤   ├───────────┤
Should Have │ Story 1.2 │   │ Story 2.2 │   │           │   │ Story 4.2 │
            ├───────────┤   ├───────────┤   │           │   ├───────────┤
Could Have  │           │   │ Story 2.3 │   │           │   │           │
            └───────────┘   └───────────┘   └───────────┘   └───────────┘
```

---

## Epic 1: [Epic Name - e.g., "Onboarding"]

*[Brief description of this epic and what user goal it serves]*

**Persona:** [Primary persona this epic serves]
**User goal:** [What the user is trying to accomplish]

---

### Story 1.1: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

**Edge Cases:**
- [ ] What happens if [edge case]?
- [ ] What happens if [edge case]?

**Dependencies:**
- [Story X.X must be complete first]

**Notes:**
[Any additional context or design considerations]

---

### Story 1.2: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

**Edge Cases:**
- [ ] What happens if [edge case]?

**Dependencies:**
- [Dependencies if any]

**Notes:**
[Additional context]

---

### Story 1.3: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

**Edge Cases:**
- [ ] [Edge case]

---

## Epic 2: [Epic Name - e.g., "Core Functionality"]

*[Brief description of this epic]*

**Persona:** [Persona this epic serves]
**User goal:** [User's objective]

---

### Story 2.1: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

**Edge Cases:**
- [ ] [Edge case]
- [ ] [Edge case]

---

### Story 2.2: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

---

### Story 2.3: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

---

## Epic 3: [Epic Name - e.g., "Settings & Preferences"]

*[Brief description]*

**Persona:** [Persona]
**User goal:** [Goal]

---

### Story 3.1: [Story Title]

**User Story:**
> As a [persona name],
> I want to [action]
> so that [benefit].

**Priority:** Must Have / Should Have / Could Have

**Acceptance Criteria:**

- [ ] **Given** [context],
      **When** [action],
      **Then** [outcome]

---

## Epic 4: [Epic Name]

*[Add more epics as needed]*

---

## Story Priority Summary

### Must Have (MVP)

| ID | Story | Epic | Persona |
|----|-------|------|---------|
| 1.1 | [Title] | [Epic] | [Persona] |
| 2.1 | [Title] | [Epic] | [Persona] |
| 3.1 | [Title] | [Epic] | [Persona] |

**MVP Validation:**
- [ ] User can complete core task with only these stories
- [ ] Stories cover happy path for primary persona
- [ ] No story is actually a "nice to have" in disguise

---

### Should Have (v1.1)

| ID | Story | Epic | Persona |
|----|-------|------|---------|
| 1.2 | [Title] | [Epic] | [Persona] |
| 2.2 | [Title] | [Epic] | [Persona] |

---

### Could Have (Backlog)

| ID | Story | Epic | Persona |
|----|-------|------|---------|
| 1.3 | [Title] | [Epic] | [Persona] |
| 2.3 | [Title] | [Epic] | [Persona] |

---

### Won't Have (Explicitly Excluded)

| Story Idea | Why Excluded |
|------------|--------------|
| [Feature/capability] | [Reason - e.g., "Anti-persona need"] |
| [Feature/capability] | [Reason] |
| [Feature/capability] | [Reason] |

---

## Story Dependencies

```
[Story 1.1] ──────┐
                  ├──▶ [Story 2.1] ──────▶ [Story 2.2]
[Story 1.2] ──────┘

[Story 3.1] (independent)
```

---

## Cross-Cutting Concerns

Stories that affect multiple epics:

### Authentication/Authorization
- [ ] How do stories handle logged-in vs. logged-out states?

### Error Handling
- [ ] Each story should address error states

### Loading States
- [ ] Each story should address loading states

### Empty States
- [ ] Each story should address empty/no-data states

### Accessibility
- [ ] Each story should be achievable via keyboard
- [ ] Each story should work with screen readers

---

## Story Estimation Reference

*Optional: Add relative sizing if useful*

| Size | Definition | Examples |
|------|------------|----------|
| S | Few hours, straightforward | [Story X] |
| M | 1-2 days, some complexity | [Story Y] |
| L | 3-5 days, significant work | [Story Z] |
| XL | 1+ week, should be split | [None - split these] |

---

## Validation Checklist

Before proceeding, verify:

- [ ] Every story references a specific persona
- [ ] Stories are goals, not features
- [ ] Acceptance criteria are testable
- [ ] Priorities are honest (Must Haves are truly essential)
- [ ] Edge cases are identified
- [ ] Dependencies are mapped
- [ ] Cross-cutting concerns are addressed

---

*User stories complete. Proceed to `flows/` for user flow mapping.*
