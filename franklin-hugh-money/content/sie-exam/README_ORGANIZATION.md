# SIE Exam Content Organization System

## 🎯 Purpose

This organization system ensures that all SIE exam content is:
- **Consistently structured** across all chapters and sections
- **Easy to maintain** and update
- **Simple to extend** with new content
- **Automatically integrated** with navigation

---

## 📁 Current Content Map

### ✅ Organized Content (New Structure)

```
chapter-05-debt-securities/
├── section-01-municipal-debt.md     [✓ Migrated]
├── section-02-money-markets.md      [✓ Migrated]
└── chapter-meta.json                [✓ Created]
```

### 📋 Pending Organization

Chapters to be organized when content is provided:

```
□ Chapter 1: Securities Markets
  □ Section 1.1: Primary & Secondary Markets
  □ Section 1.2: Market Participants

□ Chapter 2: Economic Factors
  □ Section 2.1: Economic Indicators
  □ Section 2.2: Monetary & Fiscal Policy

□ Chapter 3: Trading Securities
  □ Section 3.1: Types of Orders
  □ Section 3.2: Trade Settlement

□ Chapter 4: Investment Companies
  □ Section 4.1: Mutual Funds
  □ Section 4.2: ETFs and UITs

□ Chapter 6: Options
  □ Section 6.1: Options Basics
  □ Section 6.2: Options Strategies

□ Chapter 7: Retirement Plans
  □ Section 7.1: Qualified Plans
  □ Section 7.2: IRAs

□ Chapter 8: Customer Accounts
  □ Section 8.1: Account Types
  □ Section 8.2: Account Opening

□ Chapter 9: Prohibited Activities
  □ Section 9.1: Prohibited Practices

□ Chapter 10: Securities Act of 1933
  □ Section 10.1: Registration & Exemptions

□ Chapter 11: Securities Exchange Act of 1934
  □ Section 11.1: Exchange Act Provisions

□ Chapter 12: FINRA Rules
  □ Section 12.1: Conduct & Suitability

□ Chapter 13: Other Regulations
  □ Section 13.1: Additional Regulations

□ Chapter 14: Communications
  □ Section 14.1: Communications with Public

□ Chapter 15: Ethics
  □ Section 15.1: Ethical Practices

□ Chapter 16: Review & Practice
  □ Section 16.1: Final Review
```

---

## 🔄 How to Add New Content

### Option 1: Provide Raw Content

Simply provide your content with these markers:

```
CHAPTER: 6
SECTION: 1
TITLE: Options Basics

CONTENT:
[Your content here in any format]

KEY POINTS:
- Point 1
- Point 2
```

### Option 2: Use the Template

Fill out the section template at:
`content/sie-exam/templates/section-template.md`

### Option 3: Submit Existing Files

If you have existing HTML or MD files, they will be:
1. Converted to the standard format
2. Placed in the correct folder
3. Integrated with navigation

---

## 🎨 What Happens to Your Content

### Step 1: Content Processing
```
Your Input → Markdown Formatting → Standardized Structure
```

### Step 2: File Creation
```
Creates: chapter-XX-[name]/section-YY-[title].md
Updates: chapter-meta.json
```

### Step 3: HTML Generation
```
Markdown → HTML Template → Styled Output
Location: public/sie/chapters/XX-[name]/YY-[title].html
```

### Step 4: Navigation Integration
```
Updates: sie-navigation-config.js
Result: Automatic prev/next links, dropdown menu, progress tracking
```

---

## 📊 Content Status Dashboard

### Completed Sections
| Chapter | Section | Title | Status | HTML |
|---------|---------|-------|--------|------|
| 5 | 5.1 | Municipal Debt | ✅ Complete | ✅ |
| 5 | 5.2 | Money Markets | ✅ Complete | ✅ |

### Navigation System
| Component | Status | Location |
|-----------|--------|----------|
| Navigation Config | ✅ Created | `sie/assets/js/sie-navigation-config.js` |
| Navigation Component | ✅ Created | `sie/assets/js/sie-navigation-component.js` |
| Navigation Styles | ✅ Created | `sie/assets/css/sie-navigation.css` |

---

## 🚀 Quick Commands

### Check Current Structure
```bash
# View content organization
tree content/sie-exam/chapters/

# List all sections
find content/sie-exam/chapters -name "*.md"
```

### Add New Content
```bash
# Create new chapter folder
mkdir -p content/sie-exam/chapters/chapter-06-options

# Copy template for new section
cp content/sie-exam/templates/section-template.md \
   content/sie-exam/chapters/chapter-06-options/section-01-basics.md
```

### Generate HTML (when scripts are ready)
```bash
# Build specific section
npm run build:section 06 01

# Build entire chapter
npm run build:chapter 06
```

---

## 📝 File Naming Reference

### Markdown Source Files
```
Pattern: section-{number:02d}-{kebab-case-title}.md
Example: section-01-municipal-debt.md
```

### HTML Output Files
```
Pattern: {chapter:02d}-{section:02d}-{kebab-case-title}.html
Example: 05-01-municipal-debt.html
```

### Navigation IDs
```
Pattern: {chapter}.{section}
Example: 5.1, 5.2, 6.1
```

---

## 🎯 Benefits of This System

### For Content Creation
- ✅ Clear templates to follow
- ✅ Consistent formatting
- ✅ Automatic navigation
- ✅ No manual linking required

### For Maintenance
- ✅ Single source of truth
- ✅ Easy to update
- ✅ Version control friendly
- ✅ Clear file locations

### For Users
- ✅ Consistent experience
- ✅ Smooth navigation
- ✅ Progress tracking
- ✅ Mobile responsive

---

## 📚 Related Documentation

- [CONTENT_ORGANIZATION_GUIDE.md](../../CONTENT_ORGANIZATION_GUIDE.md) - Full system documentation
- [ADDING_NEW_CONTENT.md](../../docs/ADDING_NEW_CONTENT.md) - Content submission guide
- [section-template.md](../templates/section-template.md) - Content template

---

## ⚡ Next Steps

1. **For New Content**: Follow the format in ADDING_NEW_CONTENT.md
2. **For Existing Content**: It will be migrated to the new structure
3. **For Questions**: Refer to the guides or examples in Chapter 5

---

Last Updated: January 2024
System Version: 1.0.0