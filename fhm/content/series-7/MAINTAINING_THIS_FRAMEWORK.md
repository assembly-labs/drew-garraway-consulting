# Maintaining This Framework
## Series 7 Exam Prep - Maintenance Guide

---

## How to Add Lessons

### Step 1: Navigate to the Correct Location

```
series-7/
├── section-XX-name/
│   └── chapters/ (or subsections/ for Section 3)
│       └── chapter-XX-name/
│           └── [PUT NEW LESSONS HERE]
```

### Step 2: Copy the Template

```bash
cp templates/lesson-template.md lesson-XX-topic-name.md
```

### Step 3: Fill in Content

1. **Frontmatter**: Update all metadata fields
2. **Introduction**: Write an opening hook (story or "why it matters")
3. **Learning Objectives**: 4-6 bullet points
4. **Core Content**: Follow the template structure
5. **Test Preparation**: Key points and exam traps
6. **Summary**: Quick reference with key terms and numbers

### Step 4: Apply FHM Voice

- [ ] No definitions in opening paragraphs
- [ ] Historical context included
- [ ] Real-world examples with numbers
- [ ] One subtle humor moment
- [ ] "Why" behind rules explained
- [ ] Key terms wrapped in `<span class="key-term">`

### Step 5: Update Navigation

1. Update section's `chapter-meta.json` with new lesson
2. Add to progress tracker if needed

---

## How to Create Quizzes

### Step 1: Copy Template

```bash
cp templates/quiz-template.md quiz-chapter-XX.md
```

### Step 2: Write Questions

- Use FINRA-style multiple choice (4 options)
- Include calculation questions for math topics
- Write realistic scenarios
- Match difficulty to lesson content

### Step 3: Write Explanations

**Every question needs:**
- The correct answer stated clearly
- Explanation of WHY it's correct
- Explanation of why EACH wrong answer is wrong
- Memory aid or test tip if relevant

---

## How to Add Flashcards

### Step 1: Copy Template

```bash
cp templates/flashcard-template.json chapter-XX-flashcards.json
```

### Step 2: Create Cards

Each flashcard needs:
- `id`: Unique identifier (e.g., "s7-options-001")
- `front`: Question or term
- `back`: Answer in FHM voice
- `type`: "term", "formula", "concept", or "comparison"
- `difficulty`: "beginner", "intermediate", "advanced"
- `tags`: Array of relevant topics

### Step 3: Include Memory Aids

For calculation topics, add memory aids:
- Mnemonics (like "CALl UP, PUT DOWN")
- Visual patterns
- Association tricks

---

## Adding Practice Exams

### Step 1: Create Exam Folder

```bash
mkdir practice-exams/exam-XX
```

### Step 2: Create Three Files

1. **questions.md**: 30 questions proportioned by weight
   - Section 1: 3 questions (10%)
   - Section 2: 3 questions (10%)
   - Section 3: 22 questions (73%)
   - Section 4: 2 questions (7%)

2. **answers.md**: Answer key with quick explanations

3. **explanations.md**: Detailed explanations for every question

---

## Template Usage

| Template | Use For |
|----------|---------|
| `lesson-template.md` | New lessons |
| `quiz-template.md` | Chapter/section quizzes |
| `flashcard-template.json` | Digital flashcards |
| `calculation-worksheet-template.md` | Drill sheets for math topics |

---

## Consistency Guidelines

### File Naming

- All lowercase
- Use kebab-case (hyphens between words)
- Include number prefix: `lesson-01-`, `chapter-02-`
- Descriptive but concise: `options-basics` not `introduction-to-the-basics-of-options`

### Frontmatter

Always include:
- section, chapter, lesson numbers
- title and description
- topics array
- estimated_time (in minutes)
- difficulty level
- calculation_heavy (true/false)
- last_updated date

### HTML Components

Use consistently:
- `<span class="key-term">` for first use of terms
- `<div class="info-box">` for examples and analogies
- `<div class="test-tip">` for exam advice
- `<div class="historical-note">` for context stories
- `<div class="calculation-box">` for formulas
- `<div class="critical-concept">` for "memorize this" content

---

## Quality Checklist

Before publishing any content:

### Content Quality
- [ ] Opens with hook, not definition
- [ ] Historical context included
- [ ] Real-world examples with numbers
- [ ] One humor moment (no more)
- [ ] "Why" behind rules explained
- [ ] Passes Dinner Party Test

### Technical Quality
- [ ] Frontmatter complete and accurate
- [ ] All HTML components properly closed
- [ ] Links work (internal and cross-references)
- [ ] Calculations have step-by-step examples
- [ ] Consistent formatting throughout

### Exam Relevance
- [ ] Content matches FINRA outline
- [ ] Test tips are accurate
- [ ] Key terms highlighted
- [ ] Calculation formulas correct
- [ ] Exam traps noted

---

## Updating Study Tools

### Progress Tracker
- Add new lessons/chapters as they're created
- Keep section percentages accurate

### Formula Sheet
- Add new formulas as topics are covered
- Include memory aids for complex calculations

### Study Schedule
- Adjust if new major sections are added
- Keep timeline realistic (8-10 weeks)

---

## Version Control

When making updates:
1. Make changes in a feature branch
2. Test content renders correctly
3. Update `last_updated` in frontmatter
4. Commit with descriptive message
5. Push to branch

---

## Resources

- **Brand Voice**: `/fhm/design/brand/brand-voice.md`
- **SIE Examples**: `/fhm/content/sie-exam/chapters/`
- **Framework Docs**: `/SERIES_7_FRAMEWORK_COMPLETE.md`
- **Content Strategy**: `/CONTENT_STRATEGY.md`

---

*Keep this framework consistent. When in doubt, reference the SIE patterns and FHM brand voice.*
