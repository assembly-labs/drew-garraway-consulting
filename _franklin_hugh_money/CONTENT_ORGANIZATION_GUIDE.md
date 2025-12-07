# SIE Course Content Organization Guide

## 📚 Overview

This document defines the organizational structure for all SIE exam study materials. Follow this guide when adding new chapters, sections, or updating existing content.

---

## 🗂️ Folder Structure

```
_franklin_hugh_money/
├── content/                        # Source content (markdown)
│   └── sie-exam/
│       ├── chapters/               # Organized by chapter
│       │   ├── chapter-01-securities-markets/
│       │   │   ├── section-01-primary-secondary.md
│       │   │   ├── section-02-participants.md
│       │   │   └── chapter-meta.json
│       │   ├── chapter-02-economic-factors/
│       │   │   ├── section-01-indicators.md
│       │   │   ├── section-02-policy.md
│       │   │   └── chapter-meta.json
│       │   ├── chapter-05-debt-securities/
│       │   │   ├── section-01-municipal-debt.md
│       │   │   ├── section-02-money-markets.md
│       │   │   └── chapter-meta.json
│       │   └── ...
│       ├── templates/              # Reusable content templates
│       └── config/                 # Course configuration
│
├── public/                         # Compiled HTML (production-ready)
│   ├── sie/                       # All SIE course files
│   │   ├── chapters/              # HTML chapter files
│   │   │   ├── 01-securities-markets/
│   │   │   │   ├── 01-primary-secondary.html
│   │   │   │   └── 02-participants.html
│   │   │   ├── 05-debt-securities/
│   │   │   │   ├── 01-municipal-debt.html
│   │   │   │   └── 02-money-markets.html
│   │   │   └── ...
│   │   ├── assets/                # Shared assets
│   │   │   ├── css/
│   │   │   │   ├── sie-base.css
│   │   │   │   ├── sie-navigation.css
│   │   │   │   └── sie-components.css
│   │   │   ├── js/
│   │   │   │   ├── sie-navigation-config.js
│   │   │   │   ├── sie-navigation-component.js
│   │   │   │   └── sie-utilities.js
│   │   │   └── images/
│   │   └── index.html             # SIE course home
│   │
│   └── index.html                 # Site home
│
├── build/                         # Build scripts and tools
│   ├── scripts/
│   │   ├── generate-chapter.js   # Convert MD to HTML
│   │   ├── update-navigation.js  # Update nav config
│   │   └── validate-structure.js # Validate organization
│   └── templates/
│       ├── chapter-template.html
│       └── section-template.html
│
└── docs/                          # Documentation
    ├── CONTENT_ORGANIZATION_GUIDE.md (this file)
    ├── ADDING_NEW_CONTENT.md
    └── STYLE_GUIDE.md
```

---

## 📝 Naming Conventions

### Chapters
- **Folder**: `chapter-{number:02d}-{kebab-case-title}/`
- **Example**: `chapter-05-debt-securities/`

### Sections
- **Markdown**: `section-{number:02d}-{kebab-case-title}.md`
- **HTML**: `{chapter-number:02d}-{section-number:02d}-{kebab-case-title}.html`
- **Examples**:
  - Source: `section-01-municipal-debt.md`
  - Output: `05-01-municipal-debt.html`

### Navigation IDs
- **Format**: `{chapter}.{section}`
- **Example**: `5.1` for Chapter 5, Section 1

---

## 📄 Content Templates

### Section Markdown Template (`/content/sie-exam/templates/section-template.md`)

```markdown
---
chapter: 5
section: 1
title: "Municipal Debt"
description: "Understanding municipal bonds and tax-exempt securities"
topics:
  - General Obligation Bonds
  - Revenue Bonds
  - Tax Treatment
estimated_time: 45
difficulty: intermediate
last_updated: 2024-01-15
---

# Section Title

## Introduction
[Engaging intro paragraph with key concepts]

## Learning Objectives
- Objective 1
- Objective 2
- Objective 3

## Content Sections

### Topic 1
[Content with key terms marked as `key-term`]

### Topic 2
[Content...]

## Key Takeaways
- Point 1
- Point 2
- Point 3

## Test Tips
- Important exam points
- Common mistakes to avoid
```

### Chapter Metadata (`chapter-meta.json`)

```json
{
  "number": 5,
  "title": "Debt Securities",
  "description": "Municipal bonds, money markets, and corporate debt",
  "sections": [
    {
      "id": "5.1",
      "title": "Municipal Debt",
      "file": "section-01-municipal-debt.md",
      "locked": false
    },
    {
      "id": "5.2",
      "title": "Money Market Instruments",
      "file": "section-02-money-markets.md",
      "locked": false
    }
  ],
  "prerequisites": ["chapter-04"],
  "estimated_hours": 3.5,
  "last_updated": "2024-01-15"
}
```

---

## 🔄 Content Pipeline

### Step 1: Write Content
1. Create markdown file in appropriate chapter folder
2. Use section template
3. Include all metadata in frontmatter

### Step 2: Generate HTML
```bash
# Run build script
npm run build:chapter 05 01

# This will:
# 1. Read the markdown
# 2. Apply the HTML template
# 3. Inject navigation component
# 4. Output to public/sie/chapters/
```

### Step 3: Update Navigation
```bash
# Update navigation config
npm run update:navigation

# This will:
# 1. Scan all chapters
# 2. Update sie-navigation-config.js
# 3. Verify all links
```

---

## 🎨 Component Organization

### Shared Components Location
```
public/sie/assets/
├── css/
│   ├── sie-base.css           # Base styles, typography
│   ├── sie-navigation.css     # Navigation component styles
│   ├── sie-components.css     # Reusable UI components
│   └── sie-print.css          # Print-friendly styles
├── js/
│   ├── sie-navigation-config.js    # Course structure
│   ├── sie-navigation-component.js # Navigation logic
│   ├── sie-section-tracker.js      # Progress tracking
│   └── sie-quiz-component.js       # Quiz functionality
└── images/
    └── [chapter-specific images]
```

### Component Usage in HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Shared Styles -->
    <link rel="stylesheet" href="../../assets/css/sie-base.css">
    <link rel="stylesheet" href="../../assets/css/sie-navigation.css">
    <link rel="stylesheet" href="../../assets/css/sie-components.css">
</head>
<body>
    <!-- Content -->

    <!-- Shared Scripts -->
    <script src="../../assets/js/sie-navigation-config.js"></script>
    <script src="../../assets/js/sie-navigation-component.js"></script>
    <script>
        const navigation = new SIENavigationComponent('05-01-municipal-debt.html');
    </script>
</body>
</html>
```

---

## 📋 Adding New Content Checklist

### For a New Section:
- [ ] Create markdown file in correct chapter folder
- [ ] Follow naming convention: `section-XX-title.md`
- [ ] Include all required frontmatter
- [ ] Write content following style guide
- [ ] Run build script to generate HTML
- [ ] Update chapter-meta.json
- [ ] Update sie-navigation-config.js
- [ ] Test navigation between sections
- [ ] Verify mobile responsiveness

### For a New Chapter:
- [ ] Create chapter folder: `chapter-XX-title/`
- [ ] Create chapter-meta.json
- [ ] Add sections as markdown files
- [ ] Run build script for all sections
- [ ] Update main navigation config
- [ ] Add to course index page
- [ ] Test full chapter flow
- [ ] Update progress calculations

---

## 🚀 Quick Commands

```bash
# Create new chapter structure
npm run create:chapter --number=06 --title="Options"

# Add new section to existing chapter
npm run create:section --chapter=06 --section=01 --title="Options Basics"

# Build single section
npm run build:section 06 01

# Build entire chapter
npm run build:chapter 06

# Build all chapters
npm run build:all

# Validate structure
npm run validate:structure

# Update navigation
npm run update:navigation
```

---

## 📊 Current Structure Status

### ✅ Completed
- Chapter 5, Section 1: Municipal Debt
- Chapter 5, Section 2: Money Market Instruments
- Navigation system
- Base styles and components

### 🚧 In Progress
- Migration of existing content to new structure
- Build scripts

### 📅 Planned
- Chapters 1-4, 6-16
- Quiz components
- Progress tracking
- Print styles

---

## 🔍 File Path Examples

### Source → Output Mapping
```
content/sie-exam/chapters/chapter-05-debt-securities/section-01-municipal-debt.md
→ public/sie/chapters/05-debt-securities/01-municipal-debt.html

content/sie-exam/chapters/chapter-05-debt-securities/section-02-money-markets.md
→ public/sie/chapters/05-debt-securities/02-money-markets.html
```

### Navigation References
```javascript
// In sie-navigation-config.js
{
    number: 5,
    title: "Debt Securities",
    sections: [
        {
            id: "5.1",
            title: "Municipal Debt",
            file: "05-debt-securities/01-municipal-debt.html",
            locked: false
        },
        {
            id: "5.2",
            title: "Money Market Instruments",
            file: "05-debt-securities/02-money-markets.html",
            locked: false
        }
    ]
}
```

---

## 📚 Style Guide Highlights

### Content Tone
- Professional but approachable
- Include relevant humor where appropriate
- Use real-world examples
- Explain "why" not just "what"

### Formatting
- **Key Terms**: Use `<span class="key-term">term</span>`
- **Test Tips**: Use dedicated test-tip boxes
- **Examples**: Use info-box components
- **Tables**: Use comparison-table class

### Section Length
- Target: 1500-2500 words per section
- Break into 6-10 subsections
- Include 2-3 visual elements (tables, diagrams)
- End with summary and key points

---

## 🔗 Related Documentation

- [ADDING_NEW_CONTENT.md](./docs/ADDING_NEW_CONTENT.md) - Step-by-step guide
- [STYLE_GUIDE.md](./docs/STYLE_GUIDE.md) - Writing and formatting standards
- [BUILD_SCRIPTS.md](./build/README.md) - Build system documentation
- [NAVIGATION_SYSTEM.md](./docs/NAVIGATION_SYSTEM.md) - Navigation implementation details

---

## 📞 Questions?

If you need clarification on organization:
1. Check this guide first
2. Review existing examples in Chapter 5
3. Run validation script to check structure
4. Follow established patterns

Last Updated: January 2024