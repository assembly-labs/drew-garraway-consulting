# Series 7 Exam Preparation Framework

## AI Collaboration Guide

---

## Overview

This is the Series 7 exam preparation framework, built using the same organizational patterns as the
SIE exam materials and following Franklin Hugh Money brand voice guidelines.

**Exam Details:**

- 125 questions, 225 minutes
- Passing score: 72%
- Four main sections weighted by importance
- Heavy focus on products, recommendations, and calculations

---

## Screenshot Policy (CRITICAL)

**Course screenshots are copyrighted and must NEVER be published online.**

| What       | Policy                                                  |
| ---------- | ------------------------------------------------------- |
| Storage    | Local only in `chapters/ch-XX-*/screenshots/` folders   |
| Git        | All `screenshots/` folders excluded via `.gitignore`    |
| Purpose    | Personal study reference to create original FHM content |
| Publishing | NEVER commit, push, or deploy screenshot files          |
| Deployment | Screenshots will NOT appear on Cloudflare/GitHub        |

### Workflow with Screenshots

1. Process screenshots using `SCREENSHOT_INTAKE_PROMPT.md`
2. Read screenshots to extract concepts and information
3. Transform into original FHM-voice content (never copy verbatim)
4. Publish only original content, never the source screenshots

---

## Framework Structure

The project uses a **chapter-based content pipeline** matching the Kaplan textbook structure
(Chapters 1-19). Content flows through 4 phases: **INTAKE → EXTRACT → TRANSFORM → PUBLISH**.

```
series-7/
├── CLAUDE.md                    # This file - main instructions
├── README.md                    # User-facing guide
│
├── chapters/                    # Chapter-based content pipeline
│   ├── ch-01-equities/
│   │   ├── screenshots/         # Source screenshots (gitignored, NEVER publish)
│   │   ├── raw-notes.md         # INTAKE: extracted facts from source material
│   │   └── content/
│   │       └── chapter-01-equities.md  # TRANSFORM: FHM-voice markdown
│   ├── ch-02-debt-fundamentals/
│   ├── ...                      # Ch 3-12, 14-19 (Ch 13 pending)
│   └── ch-19-suitability/
│
├── templates/                   # Reusable content templates
├── study-tools/                 # Progress tracking, formulas, schedules
├── practice-exams/              # Full practice exams
└── resources/                   # Glossary, cheat sheets, references
```

### Published HTML Pages (in `/fhm/pages/series-7/`)

18 of 19 chapters published. All connected via prev/next navigation chain. Study tools: formula
sheet, flashcards, progress tracker, study schedule, common mistakes, exam prep, practice exam,
audio library.

### Content Pipeline Status

| Chapter  | Status                   |
| -------- | ------------------------ |
| Ch 1-12  | Published                |
| Ch 13    | Pending source materials |
| Ch 14-19 | Published                |

---

## Brand Voice: Franklin Hugh Money

**All content must follow FHM brand voice.** Reference: `/fhm/design/brand/brand-voice.md`

### The 90/10 Rule

- **90%** clear, useful exam content
- **10%** clever observations that reward attention

### Voice Characteristics

- **Conversational Professional**: Smart but not stuffy
- **Modern Language**: Current without being trendy
- **Quietly Confident**: Knowledgeable without arrogance
- **Clear Before Clever**: Always prioritize understanding

### Opening Hooks (CRITICAL)

**Never start a lesson with a definition.** Start with:

- A story or historical moment
- A "why this matters" statement
- A compelling fact or statistic

**Bad:** "A call option is a contract that gives the buyer the right to purchase..."

**Good:** "In April 1973, the Chicago Board Options Exchange opened for business with just 16 call
options on 16 different stocks. The first day's volume was 911 contracts. Today, the options market
trades billions of contracts annually..."

### One Humor Per Lesson

Each lesson gets exactly ONE moment of wit:

- Placed naturally (end of section, parenthetical, transition)
- Observational or self-deprecating
- Never forced or excessive

**Example:** "Whether those decisions add value after fees is a debate that has launched a thousand
academic papers and at least one very successful index fund company in Valley Forge, Pennsylvania."

### The "Why" Behind Everything

Don't just state rules—explain why they exist:

- "Regulation T exists because in 1929, investors bought on 10% margin..."
- "The MSRB created G-37 because political contributions became a form of pay-to-play..."

---

## Content Creation Workflow

### Phase 1: Extract

- Collect source material (FINRA outlines, study notes)
- Save to `raw-notes/[topic]-notes.md`
- Capture all facts, formulas, regulations

### Phase 2: Transform (CRITICAL)

- Write opening hook (story or "why it matters")
- Add historical context
- Include real-world examples with specific numbers
- Insert one subtle humor moment
- Explain the "why" behind every rule
- Apply FHM voice throughout

### Phase 3: Structure

- Use appropriate template from `templates/`
- Add frontmatter metadata
- Format with HTML components
- Create cross-references

### Phase 4: Review

Quality checklist before publishing:

- [ ] Opens with hook, not definition
- [ ] Has historical/contextual story
- [ ] Includes real-world examples
- [ ] Contains one subtle humor element
- [ ] Explains "why" behind rules
- [ ] Passes Dinner Party Test
- [ ] Calculations have step-by-step examples
- [ ] Key terms highlighted
- [ ] Test tips included

---

## File Naming Conventions

| Type              | Pattern                   | Example                            |
| ----------------- | ------------------------- | ---------------------------------- |
| Section folder    | `section-XX-kebab-name/`  | `section-03-provides-info/`        |
| Subsection folder | `XX-kebab-name/`          | `04-options/`                      |
| Chapter folder    | `chapter-XX-kebab-name/`  | `chapter-01-options-fundamentals/` |
| Lesson file       | `lesson-XX-kebab-name.md` | `lesson-01-options-basics.md`      |
| Quiz file         | `quiz-[scope].md`         | `quiz-chapter-01.md`               |
| Flashcard file    | `[topic]-flashcards.json` | `options-terms-flashcards.json`    |
| Meta file         | `[scope]-meta.json`       | `chapter-meta.json`                |

---

## HTML Components

Use these components in lesson content:

### Key Term

```html
<span class="key-term">Term</span>
```

### Info Box

```html
<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>Content...</p>
</div>
```

### Test Tip

```html
<div class="test-tip">
  <p><strong>Test Tip:</strong> Content...</p>
</div>
```

### Historical Note

```html
<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>Content explaining "why"...</p>
</div>
```

### Calculation Box

```html
<div class="calculation-box">
  <div class="calculation-box__label">Formula</div>
  <div class="calculation-box__formula">Formula here</div>
</div>
```

### Critical Concept

```html
<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p>Content...</p>
</div>
```

---

## Content Priorities

Weight content creation by exam importance:

| Priority | Topic                | Exam Weight  | Notes                  |
| -------- | -------------------- | ------------ | ---------------------- |
| 1        | Options              | 25-30%       | Most calculation-heavy |
| 2        | Municipal Bonds      | 15-20%       | Heavy MSRB rules       |
| 3        | Margin Accounts      | 10-15%       | Complex calculations   |
| 4        | Debt Securities      | 10-12%       | Yield calculations     |
| 5        | Equity Securities    | 8-10%        | Foundation             |
| 6        | Retirement Plans     | 5-8%         | Contribution limits    |
| 7        | Variable Products    | 5-7%         | Moderate               |
| 8        | Investment Companies | 5-7%         | Moderate               |
| 9        | Section 1 & 4        | 16% combined | Lower priority         |

---

## Adding New Content

### Adding a Lesson

1. Navigate to appropriate chapter folder
2. Copy `templates/lesson-template.md`
3. Rename following convention: `lesson-XX-topic-name.md`
4. Fill in all sections using FHM voice
5. Update `chapter-meta.json` with new lesson
6. Create corresponding flashcards
7. Add quiz questions

### Adding Quiz Questions

1. Use `templates/quiz-template.md` format
2. Include detailed explanations for ALL answers
3. Match difficulty to lesson content
4. Use realistic scenarios

### Adding Flashcards

1. Use `templates/flashcard-template.json` format
2. Include formula cards for calculation topics
3. Add memory aids where helpful
4. Tag appropriately for filtering

---

## Quality Standards

### The Dinner Party Test

Would this sound natural if you were explaining it to a smart friend at dinner? If it sounds like a
textbook, rewrite it.

### The Intelligence Test

Assume readers are intelligent. Don't over-explain obvious things. Connect dots, don't spell out
every implication.

### The Value Test

Every paragraph should teach something. No filler, no padding.

### The Sincerity Test

Is this genuinely helpful for passing the exam? Would you want to study from this?

---

## Related Documentation

- **Brand Voice**: `/fhm/design/brand/brand-voice.md`
- **Content Strategy**: `/CONTENT_STRATEGY.md`
- **Folder Structure**: `/SERIES_7_FOLDER_STRUCTURE.md`
- **Template Specs**: `/TEMPLATE_SPECIFICATIONS.md`
- **SIE Examples**: `/fhm/content/sie-exam/chapters/`

---

## Differences from SIE

1. **Four-Section Organization** - Follows FINRA's official outline vs. chapter-based
2. **Subsection Layer** - Section 3 needs extra depth for 11 major topic areas
3. **Calculation Focus** - More worksheets for margin, options, bonds
4. **Deeper Options Coverage** - 8+ chapters vs. SIE's lighter coverage
5. **Formula Sheet Priority** - Central study tool for this calculation-heavy exam

---

_This framework is designed for Drew's Series 7 exam preparation, following the successful SIE
framework pattern with adaptations for the Series 7's increased depth and complexity._
