# SIE Framework Discovery Document

**Date:** January 6, 2026
**Purpose:** Document the existing SIE exam framework structure, patterns, and approach for replication in Series 7 prep materials.

---

## 1. Framework Location

The SIE exam framework is located within the **Franklin Hugh Money (FHM)** project:

```
/fhm/content/sie-exam/          # Source content (Markdown)
/fhm/pages/sie/                 # Generated HTML pages
/fhm/assets/                    # Shared CSS, JS, data, audio
```

---

## 2. Complete Folder Structure

```
fhm/
├── README.md                           # Project overview
├── index.html                          # FHM homepage
├── package.json                        # Node.js dependencies
├── deploy.sh                           # Deployment script
│
├── assets/
│   ├── audio/
│   │   └── chapters/                   # Audio podcasts by chapter
│   │       ├── ch7/
│   │       ├── ch8/
│   │       ├── ch10/
│   │       └── ch11/
│   ├── css/
│   │   ├── main.css                    # Global styles
│   │   ├── sie-chapter.css             # Chapter page styles
│   │   ├── sie-flashcards.css          # Flashcard component styles
│   │   └── sie-navigation.css          # Navigation component styles
│   ├── data/
│   │   └── flashcards.json             # Flashcard database (116 cards)
│   └── js/
│       ├── flashcards/
│       │   ├── flashcard-data.js       # Flashcard data loader
│       │   ├── flashcard-progress.js   # Progress tracking
│       │   ├── flashcard-session.js    # Session management
│       │   └── flashcard-ui.js         # UI components
│       ├── night-mode.js               # Auto dark mode (5pm-9am)
│       ├── sie-chapter.js              # Chapter page functionality
│       └── sie-navigation-component.js # Navigation component
│
├── content/
│   ├── CONTENT_STRATEGY.md             # Story-based learning approach
│   ├── LEARNING_ENHANCEMENTS.md        # Learning methodology
│   ├── README.md                       # Content overview
│   ├── STRUCTURE.md                    # Folder organization
│   ├── STORY_QUICK_REFERENCE.md        # Story database reference
│   ├── SIE-exam-material-by-importance-weight.md
│   ├── story-database.json             # Historical stories for content
│   │
│   └── sie-exam/
│       ├── README.md                   # SIE content workflow (5-phase)
│       ├── README_ORGANIZATION.md      # Organization system
│       │
│       ├── raw-notes/                  # Original study notes
│       │   ├── chapter-05-money-markets.md
│       │   └── chapter-05-municipal-debt.md
│       │
│       ├── templates/
│       │   └── section-template.md     # Standard section format
│       │
│       └── chapters/
│           ├── chapter-05-debt-securities/
│           │   ├── chapter-meta.json
│           │   ├── section-01-municipal-debt.md
│           │   └── section-02-money-markets.md
│           │
│           ├── chapter-06-packaged-products/
│           │   ├── chapter-meta.json
│           │   ├── section-01-investment-company-basics.md
│           │   ├── section-02-fund-management-structure.md
│           │   ├── section-03-buying-selling-fund-shares.md
│           │   ├── section-04-expenses-share-classes.md
│           │   ├── section-05-distributions-prohibited-practices.md
│           │   └── section-06-other-packaged-products.md
│           │
│           ├── chapter-07-trading-markets/
│           │   ├── chapter-meta.json
│           │   ├── section-00-chapter-one-pager.md
│           │   └── section-01-types-of-trading-markets.md
│           │
│           ├── chapter-08-trade-processing/
│           │   ├── chapter-meta.json
│           │   ├── section-01-order-tickets-and-prohibited-practices.md
│           │   ├── section-02-trade-clearing-and-settlement.md
│           │   └── section-03-distribution-dates.md
│           │
│           ├── chapter-10-individual-accounts-suitability/
│           │   ├── chapter-meta.json
│           │   ├── chapter-10-individual-accounts-suitability.md
│           │   ├── section-01-customer-accounts-individuals.md
│           │   └── section-02-suitability-account-maintenance.md
│           │
│           ├── chapter-11-other-account-types/
│           │   ├── chapter-meta.json
│           │   ├── section-01-margin-accounts.md
│           │   ├── section-02-fiduciary-accounts.md
│           │   └── section-03-joint-business-options.md
│           │
│           └── chapter-12-retirement-annuities-muni-funds/
│               ├── chapter-meta.json
│               ├── section-01-retirement-plans.md
│               ├── section-02-variable-annuities.md
│               └── section-03-municipal-fund-securities.md
│
├── design/
│   ├── brand/
│   │   ├── brand-voice.md              # Voice & tone guidelines
│   │   └── manifesto.md                # Brand philosophy
│   ├── navigation-architecture.md
│   └── ui/
│       └── design-system.md            # Visual design system
│
├── dev/
│   ├── CLAUDE_COLLABORATION_PROTOCOL.md
│   ├── architecture/
│   │   ├── content-architecture.md
│   │   ├── scalability-plan.md
│   │   └── tech-stack.md
│   ├── docs/
│   │   ├── DEPLOYMENT_GUIDE.md
│   │   ├── QUICK_REFERENCE.md
│   │   ├── README.md
│   │   ├── RESTORE_POINTS.md
│   │   ├── RESTRUCTURE_LOG.md
│   │   ├── clean-design-principles.md
│   │   ├── interactive-overlay-system.md
│   │   └── known-issues.md
│   └── roadmap/
│       └── current-sprint.md
│
├── docs/
│   ├── ADDING_NEW_CONTENT.md           # Content creation guide
│   ├── CODEBASE_AUDIT.md
│   ├── CONTENT_ORGANIZATION_GUIDE.md
│   ├── CONTENT_SYSTEM_SUMMARY.md
│   └── DEPLOYMENT_CHECKLIST.md
│
├── internal/
│   ├── local-development.md
│   └── sie-flashcard-implementation-plan.md
│
├── pages/sie/
│   ├── sie-audio-library.html          # Audio podcast page
│   ├── sie-cramming.html               # Cramming tools
│   ├── sie-exam-simulation.html        # Exam simulator
│   ├── sie-flashcards.html             # Flashcard practice
│   ├── sie-formula-flashcards.html     # Formula-specific flashcards
│   ├── sie-high-yield-drill.html       # High-yield topic drill
│   ├── sie-practice-exam.html          # Practice exams
│   ├── sie-problem-areas.html          # Weak area focus
│   ├── sie-quiz.html                   # Chapter quizzes
│   ├── sie-study-materials.html        # Main study hub
│   │
│   ├── sie-chapter-5.html              # Chapter pages...
│   ├── sie-chapter-5-money-markets.html
│   ├── sie-chapter-5-municipal.html
│   ├── sie-chapter-6-*.html            # (6 section pages)
│   ├── sie-chapter-7-*.html
│   ├── sie-chapter-8-*.html
│   ├── sie-chapter-10-*.html
│   ├── sie-chapter-11-*.html
│   └── sie-chapter-12-*.html
│
├── scripts/
│   └── hooks/
│
└── tests/
```

---

## 3. Content Creation Workflow

The SIE framework uses a **5-Phase Content Pipeline**:

### Phase 1: Extract
- Receive screenshots or source materials
- Extract all factual content into `raw-notes/chapter-XX-topic.md`
- Capture key terms, definitions, formulas, regulations

### Phase 2: Transform (CRITICAL - Cannot Skip)
- Research historical context for major topics
- Write engaging opening hooks for each section
- Add real-world examples with concrete numbers
- Include one subtle humor moment per section
- Explain the "why" behind every regulation
- Apply brand voice throughout

### Phase 3: Structure & Format
- Create chapter folder: `chapters/chapter-XX-[title]/`
- Create section files following `templates/section-template.md`
- Create `chapter-meta.json` with metadata
- Apply HTML components (key-term, info-box, historical-note, test-tip)

### Phase 4: Generate HTML
- Generate HTML files in `/pages/sie/`
- Apply styling and navigation component
- Verify all components render correctly

### Phase 5: Deploy
- Update navigation config
- Update study materials page
- Run validation
- Git commit and push

---

## 4. File Types & Patterns

### Markdown Content Files
**Pattern:** `section-{number:02d}-{kebab-case-title}.md`
```
section-01-municipal-debt.md
section-02-money-markets.md
```

**Frontmatter:**
```yaml
---
chapter: 6
section: 1
title: "Investment Company Basics"
description: "Understanding the three types of investment companies"
topics:
  - Types of Investment Companies
  - Management Companies
estimated_time: 25
difficulty: beginner
last_updated: 2024-12-12
---
```

### Chapter Metadata (chapter-meta.json)
```json
{
  "number": 6,
  "title": "Packaged Products",
  "description": "Coverage of mutual funds, ETFs, REITs...",
  "sections": [
    {
      "id": "6.1",
      "title": "Investment Company Basics",
      "file": "section-01-investment-company-basics.md",
      "locked": false,
      "topics": ["..."],
      "estimated_minutes": 25
    }
  ],
  "prerequisites": ["chapter-05"],
  "estimated_hours": 2.5,
  "learning_objectives": ["..."],
  "exam_weight": "10-12%",
  "last_updated": "2024-12-12",
  "status": "published"
}
```

### Flashcard Data (flashcards.json)
```json
{
  "id": "opt-001",
  "front": "A call option gives the buyer the right to do what?",
  "back": "Buy the underlying stock at the strike price",
  "chapter": "options",
  "section": 1,
  "weight": 1.0,
  "source": "manual",
  "tags": ["options", "high-yield"]
}
```

---

## 5. HTML Components

### Key Term
```html
<span class="key-term">Municipal Bond</span>
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
  <p><strong>Test Tip:</strong> Remember this...</p>
</div>
```

### Historical Note
```html
<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>After the 1929 crash...</p>
</div>
```

### Comparison Table
```html
<div class="comparison-table">
  <table>
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

### Critical Concept (Exam Focus)
```html
<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <table>...</table>
</div>
```

### Exam Focus Box
```html
<div class="exam-focus">
  <div class="exam-focus__label">EXAM FOCUS - HIGH PRIORITY</div>
  <p>This topic was marked WEAK on your practice exam...</p>
</div>
```

---

## 6. Section Template Structure

Each section follows this pattern:

1. **Frontmatter** (YAML metadata)
2. **Introduction** (2-3 paragraphs with hook, not definition)
3. **Learning Objectives** (4-5 measurable objectives)
4. **Main Topics** (3-5 major sections with subtopics)
   - Visual elements (tables, info boxes)
   - Historical notes where relevant
   - Key terms highlighted inline
5. **Common Misconceptions** (optional)
6. **Test Preparation**
   - Test tips
   - Key points to remember
   - Practice question previews
7. **Summary**
   - Quick reference
   - Key terms list
   - Formulas (if applicable)
8. **Next Steps** (navigation to related content)

---

## 7. Educational Methodology

### Story-Based Learning ("Regulations are Monuments to Past Failures")
- Every rule exists because something went wrong
- Connect facts to memorable stories
- 22x more memorable than facts alone

### The "Why First" Approach
Before explaining a rule, explain why it exists.

**Instead of:** "Regulation T requires 50% initial margin"

**Do:** "In 1929, investors bought stocks with just 10% down. When prices fell, margin calls cascaded, accelerating the crash. That's why Regulation T now requires 50%."

### Story Density Guidelines
| Content Type | Story Density |
|--------------|---------------|
| Chapter intro | 1 compelling hook |
| Major section | 0-1 historical notes |
| Concept explanation | Brief inline references |
| Summary | Reinforce key stories |

### Active Recall Through Components
- Flashcards (JSON database with spaced repetition)
- Practice quizzes
- Exam simulations
- High-yield drills
- Problem area focus

---

## 8. Content Length Guidelines

| Content Type | Target | Min | Max |
|--------------|--------|-----|-----|
| Section | 1,500-2,500 words | 1,000 | 3,500 |
| Subsection | 200-400 words | - | 500 |
| Paragraph | 3-5 sentences | - | 7 |

---

## 9. Technology Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (no framework)
- **Fonts:**
  - Crimson Pro (serif display headers)
  - Inter (body text)
  - IBM Plex Mono (data/code)
- **Colors:**
  - Institutional Navy: #002D62
  - Warm Gray: #54585A
  - Paper Cream: #FFFDF7
  - Sage Green: #7C9885
  - Burgundy: #6B2737
  - Gold: #B08D57
- **Features:**
  - Night mode (automatic 5pm-9am)
  - Progress tracking (localStorage)
  - Mobile responsive
  - No search engine indexing

---

## 10. Quality Gates

Content must pass before publishing:

- [ ] **Dinner Party Test** - Sounds natural in conversation
- [ ] Opens with hook, not definition
- [ ] Includes historical context
- [ ] Contains real-world examples
- [ ] Has exactly one humor moment per section
- [ ] Explains "why" behind rules
- [ ] Includes all required HTML components

---

## 11. Key Patterns for Replication

### Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Chapter folder | `chapter-XX-kebab-name/` | `chapter-06-packaged-products/` |
| Section file | `section-XX-kebab-name.md` | `section-01-investment-company-basics.md` |
| HTML page | `sie-chapter-X-kebab-name.html` | `sie-chapter-6-investment-company-basics.html` |
| Meta file | `chapter-meta.json` | (same for all chapters) |

### Study Tools Pattern
```
├── study-materials.html     # Hub page
├── flashcards.html          # Flashcard system
├── practice-exam.html       # Full practice tests
├── quiz.html               # Chapter quizzes
├── audio-library.html      # Podcast content
├── high-yield-drill.html   # Priority topics
├── problem-areas.html      # Weak spots
├── formula-flashcards.html # Formulas only
└── exam-simulation.html    # Timed simulation
```

---

## 12. Questions for Drew

1. **Chapter Numbering:** The SIE uses chapters 5-12. Should Series 7 follow the official FINRA outline numbers (1-4) or use sequential numbering (1-n)?

2. **Scope Overlap:** Many SIE topics overlap with Series 7 (e.g., options, munis). Should we reference/link to SIE content or recreate it with Series 7 depth?

3. **Study Time Target:** SIE recommends 1-2 months study. Series 7 typically needs 2-3 months. How should pacing be structured?

4. **Interactive Features:** The SIE has flashcards, quizzes, and audio. Which features are highest priority for Series 7?

5. **Calculation Focus:** Series 7 is more calculation-heavy (margin, options). Should we add a dedicated calculation drill tool?

---

## 13. Recommended Series 7 Adaptations

Based on the SIE framework analysis, here are recommended adaptations:

### Structure Changes
- Add deeper subsection nesting for complex topics (options strategies)
- Create dedicated formula/calculation section
- Add margin account calculation worksheets
- More extensive municipal bond coverage

### Content Depth
- Longer sections for complex topics (options could be 10+ sections)
- More practice questions per section
- Case study scenarios

### New Components Needed
- Calculation step-by-step boxes
- Strategy comparison charts
- Customer scenario decision trees
- Margin calculation worksheets

---

*Document prepared for Drew's review before proceeding to Phase 2: Planning*

---

**Next Steps:**
1. Drew reviews this discovery document
2. Drew reviews FHM_BRAND_ANALYSIS.md
3. Confirm/clarify questions above
4. Proceed to Series 7 folder structure planning
