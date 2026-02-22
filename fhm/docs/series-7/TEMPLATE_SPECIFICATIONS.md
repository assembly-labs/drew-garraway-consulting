# Series 7 Template Specifications

**Date:** January 6, 2026 **Purpose:** Define reusable templates that combine SIE structural
patterns with FHM brand voice for consistent Series 7 content.

---

## Template Index

1. [Lesson Template](#lesson-template)
2. [Quiz Question Template](#quiz-question-template)
3. [Flashcard Template](#flashcard-template)
4. [Calculation Worksheet Template](#calculation-worksheet-template)
5. [Section CLAUDE.md Template](#section-claudemd-template)
6. [Chapter Meta Template](#chapter-meta-template)
7. [Section Overview Template](#section-overview-template)

---

## Lesson Template

**File:** `templates/lesson-template.md`

```markdown
---
section: [SECTION_NUMBER]
subsection: '[SUBSECTION_NAME]' # Only for Section 3
chapter: [CHAPTER_NUMBER]
lesson: [LESSON_NUMBER]
title: '[LESSON_TITLE]'
description: '[ONE_SENTENCE_DESCRIPTION]'
topics:
  - [TOPIC_1]
  - [TOPIC_2]
  - [TOPIC_3]
estimated_time: [MINUTES]
difficulty: [beginner|intermediate|advanced]
calculation_heavy: [true|false]
last_updated: [YYYY-MM-DD]
---

# [Lesson Title]

## Introduction

[OPENING HOOK - Start with a story, historical moment, or "why this matters." Never start with a
definition. This should be 2-3 paragraphs that capture attention and set context for why this topic
is important.]

[Example for Options:] In April 1973, the Chicago Board Options Exchange opened for business with
just 16 call options on 16 different stocks. The first day's volume was 911 contracts. Today, the
options market trades billions of contracts annually—and understanding options will account for
roughly 25% of your Series 7 exam.

[Second paragraph connecting to exam and practical relevance.]

## Learning Objectives

By the end of this lesson, you'll be able to:

- [Specific, measurable objective using action verbs]
- [Example: "Calculate maximum gain for a covered call position"]
- [Example: "Identify the appropriate investor for a protective put"]
- [4-6 objectives total]

---

## [Main Topic 1]

[Introduction paragraph to this topic]

### [Subtopic 1.1]

[Content with <span class="key-term">key terms</span> marked appropriately. Write in FHM voice:
clear, conversational, knowledgeable without arrogance.]

[Include real numbers and examples:] When an investor buys 1 XYZ Jan 50 call at $3, they're paying
$300 (100 shares × $3) for the right to buy XYZ stock at $50 per share anytime before January
expiration.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>[Concrete example with specific numbers and a realistic scenario.
  Don't use abstract placeholders—use actual dollar amounts, stock symbols
  (even made up ones), and realistic situations.]</p>
</div>

### [Subtopic 1.2]

[Continue content...]

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>[Why does this rule/concept exist? What problem did it solve?
  This is where you connect the "what" to the "why." Example:
  "After the 1929 crash revealed that investors were buying on 10% margin,
  Congress passed the Securities Exchange Act of 1934, giving the Federal
  Reserve authority to set margin requirements. That's why Regulation T
  exists today."]</p>
</div>

---

## [Main Topic 2]

[Content continues...]

[For comparison topics, use tables:]

<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>[Option A]</th>
        <th>[Option B]</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>[Characteristic]</strong></td>
        <td>[Value A]</td>
        <td>[Value B]</td>
      </tr>
      <!-- Add more rows as needed -->
    </tbody>
  </table>
</div>

---

## [Main Topic 3 - if needed]

[Content...]

### Common Misconceptions

[Address 2-3 common wrong beliefs:]

1. **Misconception**: [Common wrong belief]
   - **Reality**: [Correct understanding with explanation]

2. **Misconception**: [Another wrong belief]
   - **Reality**: [Correct understanding]

---

## [Calculations Section - if applicable]

<div class="calculation-box">
  <div class="calculation-box__label">Formula</div>
  <div class="calculation-box__formula">
    [Formula Name] = [Formula Expression]
  </div>
  <p><strong>Where:</strong></p>
  <ul>
    <li>[Variable 1] = [Plain English meaning]</li>
    <li>[Variable 2] = [Plain English meaning]</li>
  </ul>
</div>

### Step-by-Step Example

**Problem:** [Clear problem statement with all given values]

**Solution:**

1. [First step with calculation]
2. [Second step with calculation]
3. [Final answer with units]

<div class="exam-tip">
  <p><strong>Calculation Tip:</strong> [Specific advice for avoiding
  common calculation errors. Example: "Remember that options represent
  100 shares, so always multiply the premium by 100 for actual cost."]</p>
</div>

---

## Test Preparation

<div class="test-tip">
  <p><strong>Test Tip:</strong> [Specific exam strategy for this topic.
  Focus on what the exam specifically tests and how to approach those questions.]</p>
</div>

### Key Points to Remember

1. **[Concept 1]**: [One-sentence summary]
2. **[Concept 2]**: [One-sentence summary]
3. **[Concept 3]**: [One-sentence summary]
4. **[Concept 4]**: [One-sentence summary]

### Exam Traps to Avoid

- [Common trap 1 - what the exam wants you to confuse]
- [Common trap 2]
- [Common trap 3]

### Practice Question Preview

Expect questions that:

- [Type of question you'll likely see]
- [Another question type]
- [Calculation question if applicable]

---

## Summary

[Concise 3-4 sentence summary that reinforces the main points. This should feel like the "takeaway"
a student would remember.]

### Quick Reference

**Key Terms:**

- <span class="key-term">[Term 1]</span>: [Brief definition]
- <span class="key-term">[Term 2]</span>: [Brief definition]
- <span class="key-term">[Term 3]</span>: [Brief definition]

**Formulas** (if applicable):

- [Formula 1]: [What it calculates]
- [Formula 2]: [What it calculates]

**Critical Numbers** (if applicable):

- [Threshold or requirement with number]
- [Another important number to remember]

---

## Next Steps

- Complete the [Lesson X.X Quiz] to test your understanding
- Review [Related Lesson] for connected concepts
- Add key terms to your flashcard deck
- Practice the calculations in the [Calculation Worksheet]

---

_[SUBTLE HUMOR PLACEMENT - Insert one moment of wit somewhere natural in the content above. End of a
section, parenthetical aside, or transition moment. Examples:]_

_"Whether those decisions add value after fees is a debate that has launched a thousand academic
papers and at least one very successful index fund company in Valley Forge, Pennsylvania."_

_"The MSRB created these rules because some creative municipal bond dealers discovered that
political contributions could be remarkably effective marketing expenses."_

---

_This lesson is part of the Series 7 Exam Preparation course by Franklin Hugh Money._
```

---

## Quiz Question Template

**File:** `templates/quiz-template.md`

```markdown
---
quiz_type: '[lesson|chapter|section|comprehensive]'
section: [SECTION_NUMBER]
chapter: [CHAPTER_NUMBER] # If chapter quiz
topic: '[TOPIC_NAME]'
question_count: [NUMBER]
time_limit_minutes: [MINUTES] # Optional
passing_score: [PERCENTAGE]
last_updated: [YYYY-MM-DD]
---

# [Quiz Title]

## Instructions

[Brief instructions appropriate to quiz type. Example:]

This quiz covers [topic/chapter/section]. You should be able to answer these questions after
completing [lesson/chapter/section name].

- Questions: [X]
- Recommended time: [X] minutes
- Passing score: [X]%

---

## Questions

### Question 1

[Clear, specific question stem. Avoid ambiguity. Test one concept.]

Example: An investor buys 1 ABC Jan 50 call at $4. The stock rises to $60 at expiration. What is the
investor's profit?

A) $400 B) $600 C) $1,000 D) $1,400

<details>
<summary>Answer & Explanation</summary>

**Correct Answer: B) $600**

**Explanation:** [Step-by-step explanation in FHM voice]

1. The investor paid $400 for the call ($4 × 100 shares)
2. At expiration, the call has intrinsic value of $1,000 ($60 - $50 = $10 × 100)
3. Profit = Intrinsic value - Premium paid = $1,000 - $400 = **$600**

**Why the other answers are wrong:**

- A) $400: This is just the premium paid, not the profit
- C) $1,000: This is the intrinsic value before subtracting cost
- D) $1,400: This incorrectly adds premium instead of subtracting

**Key Concept:** When calculating profit, always subtract what you paid from what you received.

</details>

---

### Question 2

[Question stem...]

A) [Choice A] B) [Choice B] C) [Choice C] D) [Choice D]

<details>
<summary>Answer & Explanation</summary>

**Correct Answer: [X]) [Answer text]**

**Explanation:** [Explanation in FHM voice...]

**Why the other answers are wrong:**

- [Analysis of each wrong answer]

**Key Concept:** [Testable takeaway]

</details>

---

[Continue pattern for all questions...]

---

## Score Guide

| Score     | Assessment | Recommendation                      |
| --------- | ---------- | ----------------------------------- |
| 90-100%   | Excellent  | Move to next topic                  |
| 80-89%    | Good       | Quick review of missed concepts     |
| 70-79%    | Passing    | Review weak areas before continuing |
| Below 70% | Needs work | Re-read lesson before retaking      |

---

## Questions Missed? Review These:

[Link each question to the specific lesson content it tests]

- Question 1 → [Lesson X.X: Topic Name]
- Question 2 → [Lesson X.X: Topic Name]
- [etc.]
```

---

## Flashcard Template

**File:** `templates/flashcard-template.json`

```json
{
  "deck_meta": {
    "deck_name": "[DECK_NAME]",
    "section": "[SECTION_NUMBER]",
    "subsection": "[SUBSECTION_NAME]",
    "topic": "[TOPIC]",
    "card_count": 0,
    "last_updated": "YYYY-MM-DD"
  },
  "cards": [
    {
      "id": "[TOPIC_ABBREV]-001",
      "front": "[Question - clear, tests one concept]",
      "back": "[Answer - direct first, then explanation if needed]",
      "type": "[term|formula|comparison|rule|calculation]",
      "difficulty": "[easy|medium|hard]",
      "tags": ["[tag1]", "[tag2]"],
      "related_lesson": "[section.chapter.lesson]",
      "memory_aid": "[Optional mnemonic or memory trick]"
    }
  ]
}
```

### Card Type Examples

**Term Card:**

```json
{
  "id": "opt-001",
  "front": "What is the maximum loss for a long call buyer?",
  "back": "The premium paid. Long call buyers can only lose what they paid for the option.",
  "type": "term",
  "difficulty": "easy",
  "tags": ["options", "long-call", "max-loss"],
  "related_lesson": "3.4.1",
  "memory_aid": "Buyers pay premium, that's all they can lose"
}
```

**Formula Card:**

```json
{
  "id": "marg-005",
  "front": "How do you calculate buying power from SMA?",
  "back": "Buying Power = SMA ÷ Reg T (50%). Example: $5,000 SMA = $10,000 buying power.",
  "type": "formula",
  "difficulty": "medium",
  "tags": ["margin", "sma", "buying-power", "formula"],
  "related_lesson": "3.8.2",
  "memory_aid": "SMA doubles because you only need 50%"
}
```

**Comparison Card:**

```json
{
  "id": "opt-020",
  "front": "Long straddle vs. short straddle: Which profits from volatility?",
  "back": "LONG straddle profits from volatility (big moves either direction). SHORT straddle profits from stability (stock stays near strike). Long pays premium, needs movement to recover it.",
  "type": "comparison",
  "difficulty": "medium",
  "tags": ["options", "straddle", "volatility"],
  "related_lesson": "3.4.5",
  "memory_aid": "Long wants Length of movement; Short wants Stillness"
}
```

**Rule Card:**

```json
{
  "id": "muni-015",
  "front": "What is the MSRB G-37 political contribution rule?",
  "back": "Municipal professionals who make political contributions over $250 to officials who can award muni business are banned from doing business with that issuer for 2 years.",
  "type": "rule",
  "difficulty": "hard",
  "tags": ["municipal", "msrb", "political-contributions"],
  "related_lesson": "3.3.6",
  "memory_aid": "$250/2 years = pay to play prohibition"
}
```

---

## Calculation Worksheet Template

**File:** `templates/calculation-worksheet-template.md`

```markdown
---
topic: '[CALCULATION_TOPIC]'
section: [SECTION_NUMBER]
subsection: '[SUBSECTION_NAME]'
difficulty: [beginner|intermediate|advanced]
problem_count: [NUMBER]
last_updated: [YYYY-MM-DD]
---

# [Calculation Topic] Worksheet

## Formula Reference

<div class="formula-box">
  <div class="formula-box__title">[Formula Name]</div>
  <div class="formula-box__formula">[Formula]</div>
  <p><strong>Variables:</strong></p>
  <ul>
    <li>[Variable] = [Meaning]</li>
  </ul>
</div>

[Repeat for each relevant formula]

---

## Worked Example

**Problem:** [Full problem statement with all values]

**Step-by-Step Solution:**

| Step | Action              | Calculation   | Result             |
| ---- | ------------------- | ------------- | ------------------ |
| 1    | [What you're doing] | [Calculation] | [Result]           |
| 2    | [Next step]         | [Calculation] | [Result]           |
| 3    | [Final step]        | [Calculation] | **[Final Answer]** |

**Key Insight:** [What to remember from this example]

---

## Practice Problems

### Level 1: Basic (Problems 1-5)

**Problem 1:** [Problem statement]

<details>
<summary>Show Answer</summary>

**Answer:** [Answer with work shown]

| Step       | Calculation  |
| ---------- | ------------ |
| 1          | [Work]       |
| 2          | [Work]       |
| **Result** | **[Answer]** |

</details>

[Continue for Problems 2-5]

---

### Level 2: Intermediate (Problems 6-10)

[Same format, harder problems]

---

### Level 3: Exam-Style (Problems 11-15)

[Multiple choice format matching actual exam]

**Problem 11:** [Problem statement]

A) [Choice] B) [Choice] C) [Choice] D) [Choice]

<details>
<summary>Show Answer</summary>

**Correct: [X]**

[Full explanation with work]

</details>

---

## Common Mistakes

1. **[Mistake Type]**: [What students often do wrong]
   - **Correct Approach**: [How to do it right]

2. **[Mistake Type]**: [What students often do wrong]
   - **Correct Approach**: [How to do it right]

---

## Quick Reference Card

[Condensed formulas and key numbers for this topic, suitable for memorization]

| Calculation | Formula   | Example         |
| ----------- | --------- | --------------- |
| [Name]      | [Formula] | [Quick example] |

---

_Practice these calculations until they're automatic. The exam doesn't give you much time to
think—you need to recognize the pattern and execute the formula quickly._
```

---

## Section CLAUDE.md Template

**File:** `SECTION_CLAUDE.md` (placed in each section folder)

```markdown
# Section [X]: [Section Name] - AI Collaboration Guide

## Section Overview

**Exam Weight:** [X]% (~[X] questions out of 125) **Primary Focus:** [What this section tests]
**Difficulty Level:** [beginner|intermediate|advanced]

---

## What This Section Covers

[2-3 paragraph overview of the section's content and importance]

### Chapters in This Section

1. **Chapter [X]: [Name]** - [Brief description]
2. **Chapter [X]: [Name]** - [Brief description] [Continue for all chapters]

---

## Content Guidelines

### Voice & Tone

All content must follow **FHM Brand Voice** (see `/design/brand/brand-voice.md`):

- **90/10 Rule**: 90% clear instruction, 10% clever observations
- **Opening hooks**: Start with stories or "why this matters"
- **One humor moment** per lesson, placed naturally
- **Explain the "why"**: Connect rules to their origins
- **Dinner Party Test**: Would this sound natural in conversation?

### Section-Specific Style Notes

[Any special considerations for this section's content. Examples:]

- [For Options] Include visual diagrams for strategies where helpful
- [For Margin] Always show step-by-step calculations
- [For Municipal] Include relevant MSRB rule numbers

---

## File Organization
```

section-[XX]-[name]/ ├── SECTION_CLAUDE.md # This file ├── section-meta.json # Section metadata ├──
section-00-overview.md # Section introduction │ ├── chapters/ │ └── chapter-[XX]-[name]/ │ ├──
chapter-meta.json │ └── lesson-[XX]-[name].md │ ├── practice/ │ ├── quiz-chapter-[XX].md │ └──
section-comprehensive.md │ └── flashcards/ └── section-[XX]-flashcards.json

```

---

## Creating New Content

### Adding a Lesson

1. Check `chapter-meta.json` for existing structure
2. Use `templates/lesson-template.md` as starting point
3. Follow learning progression (simpler → complex)
4. Include all required components (hook, objectives, content, test tips, summary)
5. Update `chapter-meta.json` with new lesson

### Adding Quiz Questions

1. Match question distribution to content coverage
2. Include calculation questions for math topics
3. Write detailed explanations for all answers (right and wrong)
4. Use realistic scenarios

### Adding Flashcards

1. Follow format in `templates/flashcard-template.json`
2. Include formula cards for calculation topics
3. Add memory aids where helpful
4. Tag appropriately for filtering

---

## Quality Checklist

Before finalizing any content:

- [ ] Opens with hook, not definition
- [ ] Includes historical context or "why"
- [ ] Has real-world examples with numbers
- [ ] Contains exactly one subtle humor moment
- [ ] Key terms marked with `<span class="key-term">`
- [ ] Calculations have step-by-step examples
- [ ] Test tips are specific and actionable
- [ ] Summary includes quick reference
- [ ] Links to related content included
- [ ] Flashcards created for key terms

---

## Related Documentation

- **Brand Voice**: `/fhm/design/brand/brand-voice.md`
- **Content Strategy**: `/CONTENT_STRATEGY.md`
- **Folder Structure**: `/SERIES_7_FOLDER_STRUCTURE.md`
- **SIE Examples**: `/fhm/content/sie-exam/chapters/`

---

## Contact

For questions about content in this section, reference the main
`/fhm/content/series-7/CLAUDE.md` file for project-wide guidelines.
```

---

## Chapter Meta Template

**File:** `chapter-meta.json`

```json
{
  "section": 3,
  "subsection": "options",
  "chapter_number": 1,
  "title": "Options Fundamentals",
  "description": "Understanding calls, puts, and the basics of options trading",
  "lessons": [
    {
      "id": "3.4.1.1",
      "number": 1,
      "title": "Options Basics",
      "file": "lesson-01-options-basics.md",
      "topics": ["What is an option", "Calls vs. puts", "Buyers vs. sellers"],
      "estimated_minutes": 25,
      "difficulty": "beginner",
      "calculation_heavy": false,
      "prerequisites": []
    },
    {
      "id": "3.4.1.2",
      "number": 2,
      "title": "Rights and Obligations",
      "file": "lesson-02-rights-obligations.md",
      "topics": ["Buyer rights", "Seller obligations", "Exercise vs. expiration"],
      "estimated_minutes": 20,
      "difficulty": "beginner",
      "calculation_heavy": false,
      "prerequisites": ["3.4.1.1"]
    }
  ],
  "practice_quiz": "quiz-chapter-01.md",
  "flashcard_deck": "options-fundamentals-flashcards.json",
  "learning_objectives": [
    "Define call and put options",
    "Distinguish between buyers and sellers",
    "Explain rights vs. obligations"
  ],
  "prerequisites": ["equity-securities-basics"],
  "estimated_hours": 1.5,
  "exam_weight_estimate": "8-10%",
  "last_updated": "2026-01-06",
  "status": "draft"
}
```

---

## Section Overview Template

**File:** `section-00-overview.md`

```markdown
---
section: [SECTION_NUMBER]
type: 'overview'
title: '[SECTION_TITLE]'
description: '[SECTION_DESCRIPTION]'
last_updated: [YYYY-MM-DD]
---

# Section [X]: [Section Title]

## Welcome

[Opening hook for the section - why this material matters, what it prepares you to do, and its
significance in the exam and in practice as a registered representative.]

[Example for Section 3:] This is where it gets real. Section 3 accounts for 73% of your Series 7
exam—91 questions that will test whether you can actually advise clients on securities. Everything
from options strategies to municipal bond analysis to margin calculations lives here. Master this
section, and you've mastered the exam.

---

## What You'll Learn

This section covers:

### [Subsection/Chapter 1 Name]

[Brief description of what this covers and why it matters]

### [Subsection/Chapter 2 Name]

[Brief description]

[Continue for all major subsections/chapters]

---

## Exam Weight

| Topic             | Approximate Weight | Priority          |
| ----------------- | ------------------ | ----------------- |
| [Topic 1]         | [X]%               | [High/Medium/Low] |
| [Topic 2]         | [X]%               | [High/Medium/Low] |
| **Section Total** | **[X]%**           |                   |

---

## Study Approach

[Recommendations for how to approach this section]

**Recommended order:**

1. [Topic] - Start here because...
2. [Topic] - Then move to...
3. [Topic] - Finally...

**Time allocation:**

- [Topic]: [X] hours (high priority)
- [Topic]: [X] hours (medium priority)
- [Topic]: [X] hours (lower priority)

---

## Calculation Focus

[If applicable, list the calculation types covered in this section]

This section includes significant calculation requirements:

- [Calculation type 1]
- [Calculation type 2]

See the **Formula Sheet** (`/study-tools/formula-sheet.md`) for all formulas in one place.

---

## Prerequisites

Before starting this section, you should be comfortable with:

- [Prerequisite concept 1]
- [Prerequisite concept 2]

---

## Ready to Begin?

Start with **[First Chapter/Lesson Name]** →

---

_Estimated time to complete section: [X] hours_
```

---

## HTML Component Reference

For use within lesson content:

### Key Term

```html
<span class="key-term">Term</span>
```

### Info Box

```html
<div class="info-box">
  <div class="info-box__title">[Title: Example, Note, etc.]</div>
  <p>[Content]</p>
</div>
```

### Test Tip

```html
<div class="test-tip">
  <p><strong>Test Tip:</strong> [Tip content]</p>
</div>
```

### Historical Note

```html
<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>[Historical content explaining "why"]</p>
</div>
```

### Exam Focus (High Priority)

```html
<div class="exam-focus">
  <div class="exam-focus__label">EXAM FOCUS</div>
  <p>[Critical exam content]</p>
</div>
```

### Critical Concept

```html
<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p>[Must-know content]</p>
</div>
```

### Calculation Box

```html
<div class="calculation-box">
  <div class="calculation-box__label">Formula</div>
  <div class="calculation-box__formula">[Formula]</div>
  <p>[Explanation]</p>
</div>
```

### Comparison Table

```html
<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>A</th>
        <th>B</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>[Feature]</td>
        <td>[A value]</td>
        <td>[B value]</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

_These templates ensure consistency across all Series 7 content while maintaining the FHM brand
voice and following SIE structural patterns._
