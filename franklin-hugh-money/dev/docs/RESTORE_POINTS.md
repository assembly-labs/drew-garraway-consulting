# Restore Points

This file documents key git commits that represent stable states of the project.

---

## Git Commit Timeline

### Before Restructure: `fbb1654`
**Date**: Before Dec 24, 2024
**State**: Original structure
- Chapter files in root directory
- Inline CSS in HTML files
- CommonJS scripts
- No tests
- No content strategy

**To restore**:
```bash
git checkout fbb1654
# or to create new branch from this point:
git checkout -b restore-original fbb1654
```

### After Restructure: `ab70b06`
**Date**: Dec 24, 2024
**State**: Reorganized structure
- ✅ CSS extracted to main.css
- ✅ Tests added (42 passing)
- ✅ Files in pages/sie/ structure
- ✅ ESM modules
- ✅ Audio file added
- ❌ No content strategy yet

**To restore**:
```bash
git checkout ab70b06
```

### After Content Strategy: `ffbff65`
**Date**: Dec 24, 2024
**State**: Full enhancement (CURRENT)
- ✅ Everything from ab70b06
- ✅ Story database (40+ entries)
- ✅ Content strategy docs
- ✅ Learning science roadmap

**Current state** (no action needed):
```bash
git checkout main
```

---

## Key File States

### Original index.html (Before CSS Extraction)
**Commit**: `fbb1654`
**Location**: `index.html`
**State**: ~200 lines of inline `<style>` tags

**View**:
```bash
git show fbb1654:franklin-hugh-money/index.html
```

**Restore**:
```bash
git checkout fbb1654 -- franklin-hugh-money/index.html
```

### Original scripts/cache-bust.js (Before ESM)
**Commit**: `fbb1654`
**Location**: `scripts/cache-bust.js`
**State**: CommonJS with `require()`

**View**:
```bash
git show fbb1654:franklin-hugh-money/scripts/cache-bust.js
```

**Restore**:
```bash
git checkout fbb1654 -- franklin-hugh-money/scripts/cache-bust.js
```

### Original file locations (Before Reorganization)
**Commit**: `fbb1654`
**Location**: Root directory

**View all chapter files**:
```bash
git ls-tree fbb1654 -- franklin-hugh-money/ | grep "sie-chapter"
```

**Restore all to root**:
```bash
# This is complex - use full revert instead
git revert ab70b06
```

---

## Package.json States

### Before: `fbb1654`
```json
{
  "name": "franklin-hugh-money",
  "version": "1.0.0",
  "devDependencies": {
    "eslint": "^8.x",
    "html-validate": "^8.x"
  }
}
```

### After: `ab70b06` (CURRENT)
```json
{
  "name": "franklin-hugh-money",
  "version": "1.0.0",
  "type": "module",
  "devDependencies": {
    "eslint": "^8.x",
    "html-validate": "^8.x",
    "vitest": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0",
    "jsdom": "^25.0.0"
  }
}
```

**View diff**:
```bash
git diff fbb1654..ab70b06 -- franklin-hugh-money/package.json
```

---

## Restore Scenarios

### Scenario 1: "I want the exact original structure"
```bash
git checkout fbb1654
# or create a new branch:
git checkout -b original-structure fbb1654
```

### Scenario 2: "I want the reorganization but not the content strategy"
```bash
git checkout ab70b06
# or revert just the content strategy:
git revert ffbff65
```

### Scenario 3: "I want everything except tests"
```bash
# Start from current state
rm -rf tests/
rm vitest.config.js
npm uninstall vitest @vitest/coverage-v8 jsdom
# Remove test scripts from package.json
git add .
git commit -m "Remove test infrastructure"
```

### Scenario 4: "I want to keep structure but restore inline CSS"
```bash
# This requires manual work:
# 1. Get original index.html CSS
git show fbb1654:franklin-hugh-money/index.html > /tmp/original-index.html
# 2. Extract <style> block from /tmp/original-index.html
# 3. Paste into current index.html
# 4. Remove <link> to main.css
# 5. Delete assets/css/main.css
```

---

## Backup Manifest

### Files that can be safely deleted (created in this session)

```bash
# Tests
tests/navigation-config.test.js
tests/cache-bust.test.js
vitest.config.js

# CSS
assets/css/main.css

# Content strategy
content/story-database.json
content/CONTENT_STRATEGY.md
content/STORY_QUICK_REFERENCE.md
content/LEARNING_ENHANCEMENTS.md

# Documentation
dev/docs/RESTRUCTURE_LOG.md
dev/docs/QUICK_REFERENCE.md
dev/docs/RESTORE_POINTS.md (this file)

# Audio (if unwanted)
assets/audio/chapters/ch8/Trading_Rules_and_Settlement_Mechanics.m4a
```

To delete all:
```bash
rm -rf tests/ content/ vitest.config.js assets/css/main.css
rm dev/docs/RESTRUCTURE_LOG.md dev/docs/QUICK_REFERENCE.md dev/docs/RESTORE_POINTS.md
rm assets/audio/chapters/ch8/Trading_Rules_and_Settlement_Mechanics.m4a
git add .
git commit -m "Remove Dec 24 enhancements"
```

### Files that were modified (can be reverted via git)

```bash
# Core files
index.html
package.json
assets/js/sie-navigation-config.js

# Scripts
scripts/cache-bust.js
scripts/setup.js
scripts/validate-content.js

# Config
.eslintrc.json
.gitignore
.prettierrc
```

To revert all modified files:
```bash
git checkout fbb1654 -- franklin-hugh-money/index.html
git checkout fbb1654 -- franklin-hugh-money/package.json
git checkout fbb1654 -- franklin-hugh-money/scripts/
# ... etc
```

### Files that were moved (need manual restoration)

See `dev/docs/RESTRUCTURE_LOG.md` section "Files Moved" for complete list.

Quick restoration:
```bash
# Move all chapter files back to root
mv pages/sie/sie-*.html .
mv pages/franklin-hugh-money-treasury.html .
rm -rf pages/

# Then update all internal paths in HTML files
# (This is tedious - easier to use git revert)
```

---

## Verification After Restore

### Check file structure
```bash
ls -la | grep sie-chapter
# Should show chapter files in expected location

ls -la pages/sie/
# Should exist or not exist based on restore point
```

### Check tests
```bash
npm test
# Should pass if tests exist, or error if removed
```

### Check CSS
```bash
grep -r "main.css" *.html
# Should find references if CSS extracted, or not if inline
```

### Check module type
```bash
grep '"type"' package.json
# Should show "module" if ESM, nothing if CommonJS
```

---

## Emergency Full Restore

If everything breaks and you need to start over:

```bash
# Nuclear option - restore to before any changes
git reset --hard fbb1654
git push origin main --force  # WARNING: Destructive!

# Safer option - revert commits
git revert ffbff65  # Remove content strategy
git revert ab70b06  # Remove restructure
git push origin main  # Preserves history
```

---

## Contacts for Help

- **Git history**: `git log --oneline --graph --all`
- **Specific file history**: `git log --follow -- path/to/file`
- **Compare states**: `git diff fbb1654..ffbff65 -- franklin-hugh-money/`
- **This documentation**: `dev/docs/`

---

**Created**: Dec 24, 2024
**Last Updated**: Dec 24, 2024
**Git commits documented**: `fbb1654`, `ab70b06`, `ffbff65`
