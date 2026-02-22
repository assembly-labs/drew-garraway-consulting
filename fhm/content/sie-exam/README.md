# SIE Exam Study Materials

This directory contains all study materials for the Securities Industry Essentials (SIE) Exam.

## Content Creation Workflow

Adding a new chapter follows a **5-phase process**. Do not skip Phase 2.

```
PHASE 1: Extract    → Raw facts from screenshots/notes
PHASE 2: Transform  → Apply brand voice, add stories & context (CRITICAL)
PHASE 3: Structure  → Format with components & templates
PHASE 4: Generate   → Create HTML files
PHASE 5: Deploy     → Update navigation, validate, publish
```

### Phase 2 is Non-Negotiable

Raw textbook content is not publishable. Every section must be transformed with:

1. **Opening hook** - Start with a story or "why it matters," not a definition
2. **Historical context** - The story behind the regulation or product
3. **Real-world examples** - Concrete numbers and scenarios
4. **Observational humor** - One subtle, well-placed moment per section
5. **The "why"** - Explain why rules exist, not just what they are

See `/docs/ADDING_NEW_CONTENT.md` for the complete transformation guide. See
`/design/brand/brand-voice.md` for voice and tone requirements.

---

## Structure

- **`raw-notes/`** - Original study notes from textbooks, screenshots, and personal studying
- **`chapters/`** - Transformed, web-ready markdown content
- **`templates/`** - Section and chapter templates to follow
- **`practice/`** - Practice questions, flashcards, and test prep materials

## Chapter List

1. **Capital Markets** - Primary vs. secondary markets, market participants
2. **Equity Securities** - Common stock, preferred stock, ADRs
3. **Debt Securities** - Corporate bonds, Treasury securities
4. **Investment Companies** - Mutual funds, ETFs, pooled investments
5. **Municipal Debt** ✅ - GO bonds, revenue bonds, tax implications
6. **Packaged Products** ✅ - Mutual funds, ETFs, REITs, hedge funds, DPPs
7. **Customer Accounts** - Account types, registration, suitability
8. **Prohibited Activities** - Compliance and ethics
9. **Trading & Settlement** - Trade execution and settlement processes
10. **Regulatory Framework** - SEC, FINRA, regulations
11. **Economics & Analysis** - Economic indicators, fundamental analysis
12. **Packaged Products** - UITs, REITs, other vehicles
13. **Direct Participation Programs** - Limited partnerships, tax shelters
14. **Retirement Plans** - IRAs, 401(k)s, qualified plans
15. **Rules & Regulations** - Compliance requirements
16. **Other Securities Products** - Additional products and concepts

## Status

- ✅ Chapter 5: Complete (Municipal Debt, Money Markets)
- ✅ Chapter 6: Complete (Packaged Products - 6 sections)
- ⏳ Other chapters: Coming soon

## File Naming Convention

- Raw notes: `chapter-XX-topic-name.md` (e.g., `chapter-05-municipal-debt.md`)
- Study guides: Same convention, will be processed for web
- Practice: `chapter-XX-practice.md` or `chapter-XX-flashcards.md`

## Content Style Guide

### Raw Notes

- Can be informal, personal study notes
- Include all important concepts from source materials
- Mark key terms and test tips

### Study Guides (Web-Ready)

- Written in Franklin Hugh brand voice
- Include historical context where relevant
- One subtle humor element per chapter
- Clear, conversational explanations
- Test tips highlighted appropriately

### Practice Materials

- Multiple choice questions matching SIE format
- Flashcards for key terms
- Practice scenarios for application

## Adding New Chapters

### Step-by-Step Process

**Phase 1: Extract Raw Content**

1. Receive screenshots or source materials
2. Extract all factual content into `raw-notes/chapter-XX-topic.md`
3. Capture key terms, definitions, formulas, regulations

**Phase 2: Transform Content (CRITICAL)** 4. Research historical context for major topics 5. Write
engaging opening hooks for each section 6. Add real-world examples with concrete numbers 7. Include
one subtle humor moment per section 8. Explain the "why" behind every regulation 9. Apply brand
voice throughout (see `/design/brand/brand-voice.md`)

**Phase 3: Structure & Format** 10. Create chapter folder: `chapters/chapter-XX-[title]/` 11. Create
section files following `templates/section-template.md` 12. Create `chapter-meta.json` with
metadata 13. Apply HTML components (key-term, info-box, historical-note, test-tip)

**Phase 4: Generate HTML** 14. Generate HTML files in `/public/` 15. Apply styling and navigation
component 16. Verify all components render correctly

**Phase 5: Deploy** 17. Update `sie-navigation-config.js` with new sections 18. Update
`sie-study-materials.html` with chapter card and progress badge 19. Run `npm run validate` to check
for sync errors 20. Run `npm run cache-bust` for version strings 21. Copy files to repo root (live
site serves from root, not `/public/`) 22. Git commit and push

### Quality Gates

Before publishing, content must:

- [ ] Pass the "Dinner Party Test" (sounds natural in conversation)
- [ ] Have opening hook, not definition
- [ ] Include historical context
- [ ] Contain real-world examples
- [ ] Have exactly one humor moment per section
- [ ] Explain "why" behind rules
- [ ] Include all required HTML components

---

_Last updated: December 2024_
