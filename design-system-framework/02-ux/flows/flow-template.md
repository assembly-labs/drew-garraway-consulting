# User Flow: [Flow Name]

> **Status:** Template — Copy this file for each flow you document

---

## Flow Overview

**Flow name:** [e.g., "New User Onboarding"]
**Primary persona:** [From personas.md]
**Related user stories:** [Story IDs]
**Priority:** Must Have / Should Have / Could Have

---

## Flow Purpose

**User goal:** [What the user is trying to accomplish]

**Entry point(s):** [Where the user starts this flow]

**Success criteria:** [How the user knows they're done]

---

## Flow Diagram

*Use ASCII or describe the flow visually. Keep it simple.*

```
┌─────────────────┐
│   Entry Point   │
│   [Screen/Trigger]│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Step 1       │
│  [Description]  │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│   Step 2a       │  │   Step 2b       │
│  [If condition] │  │  [If condition] │
└────────┬────────┘  └────────┬────────┘
         │                    │
         └──────────┬─────────┘
                    │
                    ▼
         ┌─────────────────┐
         │   Step 3        │
         │  [Description]  │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   Success       │
         │  [End state]    │
         └─────────────────┘
```

---

## Step-by-Step Detail

### Step 1: [Step Name]

**Screen/Component:** [What the user sees]

**User action:** [What the user does]

**System response:** [What happens]

**Data required:** [What information is needed]

**Next step:** [Where they go next]

---

### Step 2: [Step Name]

**Screen/Component:** [What the user sees]

**User action:** [What the user does]

**System response:** [What happens]

**Branching logic:**
- If [condition A]: → Go to [Step X]
- If [condition B]: → Go to [Step Y]

**Next step:** [Where they go next]

---

### Step 3: [Step Name]

**Screen/Component:** [What the user sees]

**User action:** [What the user does]

**System response:** [What happens]

**Next step:** [End / Success state]

---

## Edge Cases & Error Paths

### Edge Case 1: [Description]

**Trigger:** [What causes this edge case]

**Flow:**
```
[Current Step] ─── [Condition] ───▶ [Edge Case Handler] ───▶ [Recovery]
```

**Resolution:** [How user gets back on track]

---

### Edge Case 2: [Description]

**Trigger:** [What causes this edge case]

**Flow:**
```
[Current Step] ─── [Condition] ───▶ [Edge Case Handler] ───▶ [Recovery]
```

**Resolution:** [How user gets back on track]

---

### Error Path: [Error Type]

**Trigger:** [What causes the error]

**User sees:** [Error message/screen]

**Recovery options:**
1. [Option 1]
2. [Option 2]

---

## States

### Empty State
**When:** [Condition]
**What user sees:** [Description]
**Primary action:** [CTA]

### Loading State
**When:** [Condition]
**What user sees:** [Description]
**Duration expectation:** [Typical time]

### Success State
**When:** [Condition]
**What user sees:** [Description]
**Next actions available:** [Options]

### Error State
**When:** [Condition]
**What user sees:** [Description]
**Recovery action:** [CTA]

---

## Data & Validation

### Required Data

| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| [Field 1] | [Type] | [Rules] | [Message if invalid] |
| [Field 2] | [Type] | [Rules] | [Message if invalid] |
| [Field 3] | [Type] | [Rules] | [Message if invalid] |

### Data Dependencies

- [Step X] requires [data from Step Y]
- [This flow] requires [data from another flow]

---

## Metrics & Analytics

**Track:**
- [ ] Flow start
- [ ] Each step completion
- [ ] Drop-off points
- [ ] Time to complete
- [ ] Error occurrences
- [ ] Success rate

**Key events:**
| Event | Trigger | Data to Capture |
|-------|---------|-----------------|
| [Event 1] | [When] | [What data] |
| [Event 2] | [When] | [What data] |

---

## Accessibility Considerations

- [ ] All steps completable via keyboard
- [ ] Focus management between steps
- [ ] Progress communicated to screen readers
- [ ] Error messages associated with fields
- [ ] Loading states announced

---

## Open Questions

- [ ] [Question about this flow]
- [ ] [Question about this flow]

---

## Related Flows

- [Related Flow 1] - [How it connects]
- [Related Flow 2] - [How it connects]

---

## Validation Checklist

- [ ] Flow has clear entry and exit points
- [ ] Every step has a purpose
- [ ] Edge cases are documented
- [ ] Error paths lead to recovery
- [ ] Data requirements are clear
- [ ] Accessibility is addressed

---

*Flow documented. Create wireframes for key screens in `wireframes/`*
