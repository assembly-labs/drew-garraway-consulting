# CLAUDE CODE COLLABORATION PROTOCOL
## Franklin Hugh Money Project

*This document MUST be read at the start of EVERY Claude Code session*

---

## 1. SESSION INITIALIZATION CHECKLIST

### START OF EVERY SESSION:
- [ ] Read this protocol document completely
- [ ] Check `dev/roadmap/current-sprint.md` for active tasks
- [ ] Review `dev/docs/known-issues.md` for known bugs
- [ ] Run `git status` to check current state
- [ ] Review last 3 commits with `git log -3 --oneline`
- [ ] Check `dev/logs/session-log.md` for previous session notes
- [ ] Create TodoWrite list for current session tasks

---

## 2. PROJECT CONTEXT & PHILOSOPHY

### FRANKLIN HUGH MONEY CORE PRINCIPLES:
- **Mission**: Document Drew's journey from SEI certification to financial independence
- **Tone**: Thoughtful, approachable financial documentation with subtle wit
- **Voice**: Clear, modern language with occasional clever observations
- **Privacy**: NOT searchable by search engines (robots.txt blocks all bots)
- **Integration**: Linked from main drewgarraway.com sitemap only

### TECHNICAL PHILOSOPHY:
- Build to scale from day one
- Clean, maintainable code over clever hacks
- Progressive enhancement approach
- Mobile-first responsive design
- Performance is a feature, not an afterthought
- Accessibility is mandatory

---

## 3. CODE STANDARDS & CONVENTIONS

### HTML STANDARDS:
```html
<!-- CORRECT STRUCTURE -->
<article class="fh-card" data-component="lesson-card">
  <header class="fh-card__header">
    <h2 class="fh-card__title">Understanding Compound Interest</h2>
    <time class="fh-card__date" datetime="2024-01-15">Jan 15, 2024</time>
  </header>
  <div class="fh-card__content">
    <!-- Content here -->
  </div>
</article>
```

**Requirements:**
- Semantic HTML5 elements always
- ARIA labels for screen readers
- Meta tags for structure (even though not indexed)
- Component-based architecture
- Data attributes for JS hooks

### CSS CONVENTIONS:
```css
/* Component Structure */
.fh-card { }                    /* Block */
.fh-card__header { }            /* Element */
.fh-card--featured { }          /* Modifier */

/* Custom Properties */
:root {
  --fh-navy: #002D62;           /* Institutional Navy */
  --fh-cream: #FFFDF7;          /* Paper Cream */
  --fh-sage: #7C9885;           /* Sage Green (Growth) */
}
```

**Requirements:**
- BEM methodology for components
- Tailwind CSS for utilities
- Prefix `fh-` for all custom components
- Mobile-first media queries
- CSS Custom Properties for theming

### JAVASCRIPT PATTERNS:
```javascript
// fh-calculator.js
export class FHCalculator {
  constructor(element) {
    if (!element) {
      console.error('FHCalculator: No element provided');
      return;
    }
    this.element = element;
    this.init();
  }

  init() {
    try {
      // Initialization logic
    } catch (error) {
      console.error('FHCalculator initialization failed:', error);
    }
  }
}
```

**Requirements:**
- Vanilla JavaScript (no framework dependencies)
- ES6+ modules
- Error boundaries on all functions
- Progressive enhancement
- Event delegation over direct binding

### FILE NAMING CONVENTIONS:
- HTML pages: `kebab-case.html`
- Components: `fh-component-name.js`
- Styles: `fh-component-name.css`
- Markdown: `YYYY-MM-DD-title.md` (for dated content)
- Assets: `/assets/[images|scripts|styles]/descriptive-name.ext`

---

## 4. DEVELOPMENT WORKFLOW

### BEFORE WRITING CODE:
1. **State the objective** - What are we building/fixing?
2. **Check existing components** - Can we reuse/extend?
3. **Review design system** - Check `design/ui/design-system.md`
4. **Plan implementation** - Break down into steps
5. **Update TodoWrite** - Track all tasks

### WHILE CODING:
1. **HTML First** - Structure before style
2. **Mobile First** - Design for small screens
3. **Progressive Enhancement** - JS enhances, doesn't require
4. **Test Continuously** - Check after each change
5. **Console Clean** - No errors or warnings

### AFTER CODING:
1. **Test all viewports** - Mobile, tablet, desktop
2. **Check accessibility** - Keyboard navigation, screen readers
3. **Validate HTML** - Ensure semantic correctness
4. **Update documentation** - If new component/feature
5. **Commit with clear message** - Use conventional commits
6. **Log session work** - Update session log

---

## 5. CONTENT DEVELOPMENT PROCESS

### CONTENT STRUCTURE:
All content uses Markdown with frontmatter:

```markdown
---
title: "Why Traditional Financial Advisors Can Kiss My Assets"
date: 2024-01-15
category: "rants"
tags: ["investing", "advisors", "fees"]
punk_level: 9
read_time: "7 min"
tldr: "Most advisors are salespeople in suits charging you to underperform index funds"
featured: false
---

Content goes here...
```

### CONTENT CATEGORIES:
- **journal/** - Personal finance journey updates
- **lessons/** - Educational content with attitude
- **tools/** - Calculators and interactive features
- **rants/** - Industry critiques and observations

### CONTENT GUIDELINES:
- Write in Drew's authentic voice
- Balance education with irreverence
- Include real numbers/examples
- Add "Punk Take" sections for controversial views
- Cite sources but add commentary
- Use profanity sparingly but effectively

---

## 6. BUG PREVENTION STRATEGIES

### DEFENSIVE CODING CHECKLIST:
- [ ] Null/undefined checks on all variables
- [ ] Optional chaining (?.) for object access
- [ ] Try/catch blocks for risky operations
- [ ] Fallbacks for all features
- [ ] Edge case handling

### COMMON PITFALLS TO AVOID:
- [ ] Forgetting mobile viewport meta tag
- [ ] Missing alt text on images
- [ ] Broken internal links
- [ ] JavaScript-dependent critical content
- [ ] Inline styles instead of classes
- [ ] Forgetting to test with JS disabled

### TESTING REQUIREMENTS:
Before marking any task complete, test:
- [ ] Chrome, Firefox, Safari (desktop)
- [ ] iOS Safari, Chrome (mobile)
- [ ] JavaScript disabled scenario
- [ ] Slow 3G network simulation
- [ ] Keyboard-only navigation
- [ ] Screen reader compatibility

---

## 7. GIT WORKFLOW

### COMMIT MESSAGE FORMAT:
```
type: description

feat: add FU Money calculator to tools section
fix: correct mobile layout for journey timeline
docs: update session log for 2024-01-15
style: adjust punk color scheme contrast
refactor: simplify calculator validation logic
```

### TYPES:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code change that neither fixes nor adds
- `test:` Adding missing tests
- `chore:` Maintain

### BRANCH STRATEGY:
```
main (production)
├── dev (active development)
└── feature/[name] (optional for large features)
```

---

## 8. SESSION DOCUMENTATION

### END OF SESSION REQUIREMENTS:

1. **Create session log** in `dev/logs/YYYY-MM-DD-session.md`:

```markdown
# Session Log: YYYY-MM-DD

## Completed Tasks:
- [x] Built FU Money calculator component
- [x] Added mobile responsive styles
- [x] Fixed navigation bug on iOS

## In Progress:
- [ ] Journey timeline component (70% complete)

## Next Session Priority:
1. Complete journey timeline
2. Add content for first three lessons
3. Test calculator on all browsers

## Notes:
- Calculator performs well but needs input validation
- Consider adding animation to timeline
- Remember to update robots.txt

## Commits Made:
- abc123: feat: add FU Money calculator
- def456: fix: iOS navigation issue
```

2. **Update** `dev/roadmap/current-sprint.md`
3. **Update** `dev/docs/known-issues.md` if bugs found
4. **Final commit** with session summary

---

## 9. QUALITY ASSURANCE CHECKLIST

### CODE QUALITY:
- [ ] Zero console errors
- [ ] HTML validates (W3C)
- [ ] CSS follows BEM conventions
- [ ] JS has error handling
- [ ] Mobile responsive (320px minimum)
- [ ] Accessibility tested

### CONTENT QUALITY:
- [ ] Tone matches brand voice
- [ ] No spelling/grammar errors
- [ ] All links functional
- [ ] Images optimized (<100kb ideally)
- [ ] Metadata complete

### PROJECT INTEGRITY:
- [ ] robots.txt blocking all bots
- [ ] Sitemap updated for new pages
- [ ] Navigation reflects new content
- [ ] Build process runs clean
- [ ] No sensitive data exposed

---

## 10. EMERGENCY PROTOCOLS

### IF SOMETHING BREAKS:
1. **DON'T PANIC** - Most things are fixable
2. **Git status** - What changed?
3. **Check last working commit** - When did it work?
4. **Review browser console** - What's the error?
5. **Check session logs** - What was done recently?
6. **Revert if necessary** - `git revert [commit]`
7. **Document in** `known-issues.md`

### NEVER DO:
- Force push to main branch
- Delete without backup
- Skip testing "small" changes
- Ignore console warnings
- Commit API keys or secrets
- Use inline styles for layout
- Assume it works without testing

---

## 11. QUICK REFERENCE

### KEY FILES:
- **Design System**: `/design/ui/design-system.md`
- **Current Sprint**: `/dev/roadmap/current-sprint.md`
- **Known Issues**: `/dev/docs/known-issues.md`
- **Brand Guide**: `/design/brand/manifesto.md`
- **Component Library**: `/src/components/`
- **Session Logs**: `/dev/logs/`

### USEFUL COMMANDS:
```bash
# Check current status
git status

# See recent changes
git log -5 --oneline

# Test local server
python -m http.server 8000

# Find TODOs
grep -r "TODO" --include="*.js" --include="*.html"

# Check for console.log
grep -r "console.log" --include="*.js"
```

---

## 12. PROJECT MANTRA

**"Building wealth with a middle finger to the establishment"**

Every line of code should embody:
- **Rebellion** against traditional finance
- **Authenticity** in presentation
- **Education** through irreverence
- **Quality** in execution

---

*Last Updated: 2024-12-05*
*Version: 1.0*