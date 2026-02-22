# Series 7 Exam Prep Framework - Complete

## Project Summary

The Series 7 General Securities Representative Exam Prep Framework has been successfully built,
following the established SIE exam framework patterns while adapting to the Series 7's unique
structure and heavier calculation focus.

---

## What's Ready

### ✅ Complete Folder Structure

```
fhm/content/series-7/
├── CLAUDE.md                    # Main AI collaboration guide
├── README.md                    # User-facing framework guide
├── section-01-seeks-business/   # 9% of exam (11 questions)
│   ├── SECTION_CLAUDE.md
│   ├── section-00-overview.md
│   └── chapters/
│       └── chapter-01-prospecting-customers/
│           └── lesson-01-types-of-customers.md
├── section-02-opens-accounts/   # 11% of exam (14 questions)
│   ├── SECTION_CLAUDE.md
│   └── chapters/
├── section-03-provides-info/    # 73% of exam (91 questions) ⭐ CRITICAL
│   ├── SECTION_CLAUDE.md
│   ├── section-00-overview.md
│   └── subsections/
│       ├── 01-equity-securities/
│       ├── 02-debt-securities/
│       ├── 03-municipal-bonds/
│       ├── 04-options/          # 25-30% - Most heavily tested
│       │   ├── SUBSECTION_CLAUDE.md
│       │   ├── subsection-overview.md
│       │   └── chapters/
│       │       └── chapter-01-options-fundamentals/
│       │           └── lesson-01-options-basics.md
│       ├── 05-investment-companies/
│       ├── 06-variable-products/
│       ├── 07-retirement-plans/
│       ├── 08-margin-accounts/
│       ├── 09-dpps/
│       ├── 10-other-products/
│       └── 11-analysis-economics/
├── section-04-processes-transactions/  # 7% of exam (9 questions)
│   ├── SECTION_CLAUDE.md
│   └── chapters/
├── templates/
│   ├── lesson-template.md
│   ├── quiz-template.md
│   ├── flashcard-template.json
│   └── calculation-worksheet-template.md
├── study-tools/
│   ├── study-schedule.md        # 10-week detailed plan
│   ├── formula-sheet.md         # All calculation formulas
│   └── progress-tracker.md      # Completion tracking
└── practice-exams/
    └── exam-01/
        ├── questions.md         # 30 questions (proportioned by weight)
        ├── answers.md           # Answer key with scoring
        └── explanations.md      # Detailed explanations
```

### ✅ Instruction Files (CLAUDE.md)

| File                                                  | Purpose                               | Lines |
| ----------------------------------------------------- | ------------------------------------- | ----- |
| `series-7/CLAUDE.md`                                  | Master guide for all Series 7 content | 300+  |
| `section-01-seeks-business/SECTION_CLAUDE.md`         | Section 1 specifics                   | 150+  |
| `section-02-opens-accounts/SECTION_CLAUDE.md`         | Section 2 specifics                   | 150+  |
| `section-03-provides-info/SECTION_CLAUDE.md`          | Section 3 specifics                   | 200+  |
| `section-04-processes-transactions/SECTION_CLAUDE.md` | Section 4 specifics                   | 150+  |
| `subsections/04-options/SUBSECTION_CLAUDE.md`         | Options-specific guide                | 250+  |

### ✅ Template Files

| Template                            | Purpose                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `lesson-template.md`                | Standard lesson structure with hooks, objectives, content, calculations |
| `quiz-template.md`                  | 10-question quiz with explanations                                      |
| `flashcard-template.json`           | JSON format for digital flashcards                                      |
| `calculation-worksheet-template.md` | Drill sheets for calculation practice                                   |

### ✅ Initial Content

**Section 1: Seeks Business**

- Section overview (exam weight, key topics, study strategy)
- Lesson: Types of Customers (retail vs institutional, Do-Not-Call rules)

**Section 3: Provides Information (Options Focus)**

- Section overview (73% of exam, 11 subsections, calculation priority)
- Options subsection overview (formulas, memory aids, strategies)
- Lesson: Options Basics (calls, puts, rights, obligations)

### ✅ Study Tools

| Tool                  | Description                                     |
| --------------------- | ----------------------------------------------- |
| `study-schedule.md`   | 10-week study plan with daily/weekly breakdowns |
| `formula-sheet.md`    | All calculation formulas with examples          |
| `progress-tracker.md` | Completion tracking by section and subsection   |

### ✅ Practice Exam 1

- 30 questions proportioned by exam weight
- Section 1: 3 questions (10%)
- Section 2: 3 questions (10%)
- Section 3: 22 questions (73%)
- Section 4: 2 questions (7%)
- Complete answer key with scoring
- Detailed explanations for every question

---

## How to Use It

### For Content Authors

1. **Read the CLAUDE.md files** before creating content
   - Start with `/fhm/content/series-7/CLAUDE.md`
   - Then read the section-specific file for your topic
   - For options: also read the subsection CLAUDE.md

2. **Use the templates**
   - Copy from `/fhm/content/series-7/templates/`
   - Fill in all bracketed placeholders
   - Follow the 90/10 rule (90% clarity, 10% wit)

3. **Follow the file naming conventions**
   - Lessons: `lesson-XX-name-of-topic.md`
   - Quizzes: `quiz-XX-topic.md`
   - Flashcards: `flashcards-topic.json`

### For Students

1. **Follow the 10-week study schedule** in `study-tools/study-schedule.md`
2. **Focus on Section 3** - it's 73% of your exam
3. **Master calculations first** - use the formula sheet and calculation worksheets
4. **Take practice exams** to gauge readiness (aim for 80%+ before the real exam)

---

## How to Extend

### Adding a New Lesson

```bash
# 1. Navigate to the appropriate chapter
cd fhm/content/series-7/section-XX-name/chapters/chapter-XX-name/

# 2. Copy the template
cp ../../templates/lesson-template.md lesson-XX-topic-name.md

# 3. Fill in the content following CLAUDE.md guidelines
```

### Adding a New Practice Exam

```bash
# 1. Create the exam folder
mkdir -p fhm/content/series-7/practice-exams/exam-02

# 2. Create three files:
# - questions.md (30 questions proportioned by weight)
# - answers.md (answer key with scoring)
# - explanations.md (detailed explanations)
```

### Adding Flashcards

```bash
# 1. Navigate to the appropriate chapter
cd fhm/content/series-7/section-XX/chapters/chapter-XX/

# 2. Copy the template
cp ../../templates/flashcard-template.json flashcards-topic.json

# 3. Fill in the flashcard data
```

---

## Current Status (Updated February 2026)

### Published HTML Chapters (18 of 19)

The content pipeline has shifted from the original section-based model to a **chapter-based model**
matching the Kaplan textbook structure. Content flows through a 4-phase pipeline: **INTAKE → EXTRACT
→ TRANSFORM → PUBLISH**.

| Chapter | Title                               | HTML      | Markdown | Status      |
| ------- | ----------------------------------- | --------- | -------- | ----------- |
| Ch 1    | Equities                            | Published | Complete | Live        |
| Ch 2    | Debt Fundamentals                   | Published | Complete | Live        |
| Ch 3    | Additional Bond Features            | Published | Complete | Live        |
| Ch 4    | Corporate & Government Debt         | Published | Complete | Live        |
| Ch 5    | Municipal Debt & Money Market       | Published | Complete | Live        |
| Ch 6    | Packaged Products                   | Published | Complete | Live        |
| Ch 7    | Trading Markets                     | Published | Complete | Live        |
| Ch 8    | Trade Processing                    | Published | Complete | Live        |
| Ch 9    | Options Fundamentals                | Published | Complete | Live        |
| Ch 10   | Index Options & Advanced Strategies | Published | Complete | Live        |
| Ch 11   | Individual Customer Accounts        | Published | Complete | Live        |
| Ch 12   | Other Account Types                 | Published | Complete | Live        |
| Ch 13   | _(Pending)_                         | —         | —        | Not started |
| Ch 14   | Primary Market                      | Published | Complete | Live        |
| Ch 15   | Securities Exchange Act             | Published | Complete | Live        |
| Ch 16   | SRO Rules                           | Published | Complete | Live        |
| Ch 17   | Investment Analysis                 | Published | Complete | Live        |
| Ch 18   | Taxation                            | Published | Complete | Live        |
| Ch 19   | Suitability                         | Published | Complete | Live        |

### Study Tools (All Published)

| Tool             | Status                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Formula Sheet    | Published (comprehensive: options T-chart, spreads, straddles, bond yield seesaw, YTM approximation) |
| Flashcards       | Published (280 cards)                                                                                |
| Study Schedule   | Published                                                                                            |
| Progress Tracker | Published                                                                                            |
| Common Mistakes  | Published                                                                                            |
| Exam Day Prep    | Published                                                                                            |
| Practice Exam    | Published (30 questions)                                                                             |
| Audio Library    | Published                                                                                            |

### Navigation

All 18 chapter pages are connected in a continuous prev/next chain:

```
Ch 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 14 → 15 → 16 → 17 → 18 → 19 → Hub
```

All chapters are accessible from the Series 7 Study Materials hub page.

### Next Steps

1. **Chapter 13** — Content pending from source materials
2. **Additional practice exams** — Currently 1 of target 5
3. **Expand flashcard decks** — Currently 280 cards of target 530-670

---

## Differences from SIE Framework

| Aspect       | SIE Framework     | Series 7 Framework                       |
| ------------ | ----------------- | ---------------------------------------- |
| Structure    | 20 chapters, flat | 4 sections with nested subsections       |
| Exam weight  | Even distribution | 73% in Section 3                         |
| Calculations | Moderate          | Heavy (options, margin, bonds)           |
| Products     | Basic overview    | Deep dive (can recommend)                |
| Options      | Not covered       | 25-30% of exam                           |
| Margin       | Basic concepts    | Complex calculations                     |
| Templates    | Section-based     | Lesson-based with calculation worksheets |
| Study tools  | Basic schedule    | Formula sheet, calculation drills        |

### Key Adaptations

1. **Nested structure** for Section 3's 11 subsections
2. **SUBSECTION_CLAUDE.md** for topics like Options that need extra guidance
3. **Calculation worksheet template** for drill practice
4. **Formula sheet** with all Series 7 calculations
5. **Heavier focus on "why"** - Series 7 candidates need to understand products to recommend them

---

## Quality Verification

### Structure Check ✅

- [x] All 4 sections have folders
- [x] Section 3 has all 11 subsections
- [x] Templates folder exists with 4 templates
- [x] Study tools folder exists with 3 tools
- [x] Practice exams folder exists with exam 01

### Content Check ✅

- [x] All CLAUDE.md files follow FHM brand voice
- [x] Templates are complete and usable
- [x] Initial lessons follow the template structure
- [x] Practice exam has proportioned questions
- [x] Explanations include "why others are wrong"

### FHM Brand Voice Check ✅

- [x] 90/10 rule applied (clarity over wit)
- [x] Opening hooks (never start with definitions)
- [x] Historical context for regulations
- [x] Real-world examples with specific numbers
- [x] One subtle humor moment per lesson

---

## Statistics

| Metric                       | Count |
| ---------------------------- | ----- |
| Published HTML chapter pages | 18    |
| Completed markdown chapters  | 18    |
| Flashcards generated         | 280   |
| Study tool pages             | 8     |
| Practice exam questions      | 30    |
| CLAUDE.md instruction files  | 6     |
| Template files               | 4     |

---

## Files Created

### Root Level

- `fhm/content/series-7/CLAUDE.md`
- `fhm/content/series-7/README.md`

### Section 1

- `section-01-seeks-business/SECTION_CLAUDE.md`
- `section-01-seeks-business/section-00-overview.md`
- `section-01-seeks-business/chapters/chapter-01-prospecting-customers/lesson-01-types-of-customers.md`

### Section 2

- `section-02-opens-accounts/SECTION_CLAUDE.md`

### Section 3

- `section-03-provides-info/SECTION_CLAUDE.md`
- `section-03-provides-info/section-00-overview.md`
- `subsections/04-options/SUBSECTION_CLAUDE.md`
- `subsections/04-options/subsection-overview.md`
- `subsections/04-options/chapters/chapter-01-options-fundamentals/lesson-01-options-basics.md`

### Section 4

- `section-04-processes-transactions/SECTION_CLAUDE.md`

### Templates

- `templates/lesson-template.md`
- `templates/quiz-template.md`
- `templates/flashcard-template.json`
- `templates/calculation-worksheet-template.md`

### Study Tools

- `study-tools/study-schedule.md`
- `study-tools/formula-sheet.md`
- `study-tools/progress-tracker.md`

### Practice Exams

- `practice-exams/exam-01/questions.md`
- `practice-exams/exam-01/answers.md`
- `practice-exams/exam-01/explanations.md`

---

## Ready for Production

The Series 7 Exam Prep Framework is ready for content expansion. The structure, templates, and
initial content provide a solid foundation that follows FHM brand guidelines while adapting to the
Series 7's unique requirements.

**Start with Options** - it's 25-30% of the exam and takes the longest to master.

---

_Framework completed: 2026-01-06_ _Content pipeline operational: 2026-02-15_ _18 of 19 chapters
published_
