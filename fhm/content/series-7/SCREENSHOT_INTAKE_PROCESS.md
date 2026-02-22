# Series 7 Screenshot Intake Process

## Overview

This document defines the workflow for converting study material screenshots into FHM-branded Series
7 content.

---

## The 4-Phase Workflow

### Phase 1: INTAKE (Quick Triage)

**Goal:** Categorize and save screenshots without timeout **Time per image:** ~30 seconds

1. User sends 1-3 screenshots max at a time
2. I quickly identify:
   - **Section** (1-4)
   - **Subsection** (for Section 3 only)
   - **Topic/Chapter**
3. Create folder if needed
4. Note key topics covered in intake log

**Output:** Organized folder structure + intake log entry

---

### Phase 2: EXTRACT (Raw Markdown)

**Goal:** Convert image content to accurate raw notes **Voice:** Neutral, factual - NO brand voice
yet

1. Read the image carefully
2. Extract ALL facts, figures, formulas, rules
3. Save to `raw-notes/[topic].md`
4. Format with clear headers and bullet points

**Output:** `/raw-notes/[section]-[topic].md`

---

### Phase 3: TRANSFORM (Apply FHM Voice)

**Goal:** Convert raw notes to FHM-branded content **Reference:** `/fhm/design/brand/brand-voice.md`

Apply in order:

1. **Opening Hook** - Story, stat, or "why it matters" (never a definition)
2. **Historical Context** - Why does this rule/concept exist?
3. **Real-World Examples** - Specific numbers, scenarios
4. **One Humor Moment** - Exactly one subtle wit per lesson
5. **Test Tips** - What to watch for on the exam
6. **The "Why"** - Explain reasoning behind rules

**Output:** `/chapters/[chapter]/lesson-XX-[topic].md`

---

### Phase 4: PUBLISH (HTML Generation)

**Goal:** Convert to deployable HTML

1. Generate HTML from markdown
2. Add components (info boxes, test tips, calculation boxes)
3. Create flashcards JSON
4. Add quiz questions
5. Update chapter navigation

**Output:** `/fhm/pages/series-7/[chapter]/[lesson].html`

---

## Folder Structure

```
content/series-7/
├── SCREENSHOT_INTAKE_PROCESS.md    # This file
├── INTAKE_LOG.md                   # Running log of processed screenshots
│
├── raw-notes/                      # Phase 2 output (factual extraction)
│   ├── section-01/
│   ├── section-02/
│   ├── section-03/
│   │   ├── options/
│   │   ├── municipal-bonds/
│   │   ├── margin-accounts/
│   │   └── [other subsections]/
│   └── section-04/
│
├── section-01-seeks-business/      # Phase 3+ output (transformed content)
├── section-02-opens-accounts/
├── section-03-provides-info/
│   └── subsections/
│       ├── 01-equity-securities/
│       ├── 02-debt-securities/
│       ├── 03-municipal-bonds/
│       ├── 04-options/             # PRIORITY: 25-30% of exam
│       ├── 05-investment-companies/
│       ├── 06-variable-products/
│       ├── 07-retirement-plans/
│       ├── 08-margin-accounts/     # PRIORITY: Complex calculations
│       ├── 09-dpps/
│       ├── 10-other-products/
│       └── 11-analysis-economics/
└── section-04-processes-transactions/
```

---

## Section 3 Subsection Reference

Section 3 is 73% of the exam. Here's the breakdown:

| #   | Subsection           | Exam Weight | Priority |
| --- | -------------------- | ----------- | -------- |
| 04  | Options              | 25-30%      | HIGHEST  |
| 03  | Municipal Bonds      | 15-20%      | HIGH     |
| 08  | Margin Accounts      | 10-15%      | HIGH     |
| 02  | Debt Securities      | 10-12%      | MEDIUM   |
| 01  | Equity Securities    | 8-10%       | MEDIUM   |
| 07  | Retirement Plans     | 5-8%        | MEDIUM   |
| 06  | Variable Products    | 5-7%        | LOWER    |
| 05  | Investment Companies | 5-7%        | LOWER    |
| 09  | DPPs                 | 2-3%        | LOWER    |
| 10  | Other Products       | 2-3%        | LOWER    |
| 11  | Analysis & Economics | 3-5%        | LOWER    |

---

## Quick Categorization Guide

When I receive a screenshot, I'll identify:

### By Keywords/Topics

**Section 1 (9%) - Seeks Business:**

- Prospecting, cold calling, advertising
- Communications with public, retail communications
- FINRA Rule 2210, institutional communications

**Section 2 (11%) - Opens Accounts:**

- Account types, new account forms
- KYC, customer profiles, suitability
- Reg BI, fiduciary duty

**Section 3 (73%) - Provides Info & Recommendations:**

- Any product information (stocks, bonds, options, funds)
- Calculations (yield, margin, options P&L)
- Tax treatment, suitability recommendations

**Section 4 (7%) - Processes Transactions:**

- Order types, execution
- Settlement, clearing
- Confirmations, record-keeping

---

## Intake Session Format

When processing screenshots, I'll respond with:

```
## Intake: [Brief Description]

**Classification:**
- Section: [1-4]
- Subsection: [if Section 3]
- Topic: [specific topic]

**Key Concepts Identified:**
- [bullet list of main topics]

**Saved to:** `raw-notes/[path]/[filename].md`

**Ready for Phase 2?** [Yes - extract now / No - send more images first]
```

---

## Commands

Use these to guide the workflow:

- **"Intake these screenshots"** → Phase 1 only (quick categorize)
- **"Extract [topic]"** → Phase 2 (create raw markdown)
- **"Transform [topic]"** → Phase 3 (apply FHM voice)
- **"Publish [topic]"** → Phase 4 (generate HTML)
- **"Full process [topic]"** → All phases for one topic

---

## Anti-Timeout Strategy

1. **Max 3 images per message** - More risks timeout
2. **Phase 1 is FAST** - Just categorize, don't extract
3. **Phase 2 is THOROUGH** - One topic at a time
4. **Batch similar content** - Process all options images together
5. **Checkpoint often** - Save progress between phases

---

## Quality Checklist (Phase 3)

Before marking content as transformed:

- [ ] Opens with hook, not definition
- [ ] Has historical/contextual explanation
- [ ] Includes real-world examples with numbers
- [ ] Contains exactly ONE subtle humor moment
- [ ] Explains "why" behind every rule
- [ ] Passes Dinner Party Test (sounds natural)
- [ ] Calculations have step-by-step examples
- [ ] Key terms highlighted
- [ ] Test tips included

---

_Process created: January 2025_ _For Series 7 exam preparation content_
