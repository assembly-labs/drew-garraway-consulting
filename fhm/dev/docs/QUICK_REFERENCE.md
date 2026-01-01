# Quick Reference: Dec 24, 2024 Restructure

## What Changed (TL;DR)

✅ **CSS extracted** from inline → `assets/css/main.css`
✅ **Tests added**: 42 passing Vitest tests
✅ **Files reorganized**: Chapters moved to `pages/sie/`
✅ **Scripts modernized**: CommonJS → ESM modules
✅ **Audio added**: Trading_Rules_and_Settlement_Mechanics.m4a
✅ **Content strategy**: Story database + UX docs created

**Commits**: `ab70b06` (restructure), `ffbff65` (content strategy)

---

## File Locations Cheat Sheet

### Before → After

| Before | After |
|--------|-------|
| `sie-chapter-8-trade-processing.html` | `pages/sie/sie-chapter-8-trade-processing.html` |
| `sie-study-materials.html` | `pages/sie/sie-study-materials.html` |
| Inline CSS in `index.html` | `assets/css/main.css` |
| No tests | `tests/*.test.js` (42 tests) |
| CommonJS scripts | ESM scripts with `import` |
| No story database | `content/story-database.json` |

### New Files You Should Know About

```
assets/css/main.css              # Shared styles (~16KB)
tests/navigation-config.test.js  # Navigation tests (24)
tests/cache-bust.test.js         # Cache busting tests (18)
content/story-database.json      # 40+ historical stories
content/CONTENT_STRATEGY.md      # UX research rationale
content/STORY_QUICK_REFERENCE.md # Quick lookup table
content/LEARNING_ENHANCEMENTS.md # Learning science roadmap
vitest.config.js                 # Test configuration
```

---

## Common Tasks

### Run tests
```bash
npm test
```

### Revert everything
```bash
git revert ffbff65  # Remove content strategy
git revert ab70b06  # Remove restructure
git push origin main
```

### Revert just content strategy
```bash
git revert ffbff65
git push origin main
# or manually: rm -rf content/ && git add . && git commit
```

### Find a moved file
- **All SIE chapters**: `pages/sie/sie-chapter-*.html`
- **Treasury page**: `pages/franklin-hugh-money-treasury.html`
- **Audio files**: `assets/audio/chapters/ch8/*.m4a`

### Update a chapter
1. Edit in `pages/sie/sie-chapter-X-*.html`
2. Reference stories from `content/story-database.json`
3. Run `npm test` to verify
4. Commit changes

---

## Import Syntax Changed

### Before (CommonJS)
```javascript
const fs = require('fs');
const path = require('path');
```

### After (ESM)
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

---

## Path Changes in HTML

### Before
```html
<link rel="stylesheet" href="assets/css/sie-chapter.css">
<a href="sie-study-materials.html">Study Materials</a>
```

### After
```html
<!-- From pages/sie/sie-chapter-X.html -->
<link rel="stylesheet" href="../../assets/css/sie-chapter.css">
<a href="sie-study-materials.html">Study Materials</a>
```

---

## Story Database Usage

### Finding stories by chapter
```javascript
// content/story-database.json
{
  "chapters": {
    "8": {
      "stories": [
        {
          "id": "gamestop-2021",
          "title": "GameStop and the T+1 Push",
          "memorableDetail": "Robinhood raised $3.4B in 48 hours..."
        }
      ]
    }
  }
}
```

### Quick lookup
See `content/STORY_QUICK_REFERENCE.md` for one-liners by chapter.

---

## If Something Breaks

1. **Check tests**: `npm test` (should show 42 passing)
2. **Check paths**: All HTML files updated with correct relative paths
3. **Check git**: `git status` to see what changed
4. **See full log**: `dev/docs/RESTRUCTURE_LOG.md`

---

## Key Numbers

- **42** tests passing
- **32** files changed in restructure commit
- **16KB** main.css file size
- **40+** stories in database
- **14** SIE chapter files moved
- **2** main commits: `ab70b06`, `ffbff65`

---

**For detailed revert instructions, see**: `dev/docs/RESTRUCTURE_LOG.md`
