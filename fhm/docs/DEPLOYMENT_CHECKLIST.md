# Deployment Checklist

Pre-deployment sweep to catch common errors before pushing to production.

## Before Creating New Content

### Content Quality Gate (Phase 2 Validation)

New chapter content must pass transformation requirements before HTML generation:

- [ ] **Opening hooks** - Each section starts with a story or "why it matters," NOT a definition
- [ ] **Historical context** - At least one historical story per chapter explaining why regulations exist
- [ ] **Real-world examples** - Concrete numbers and scenarios (not abstract explanations)
- [ ] **Brand voice** - Sounds like "educated friend over coffee," not a textbook
- [ ] **Humor placement** - Exactly one subtle, well-placed observation per section
- [ ] **The "why"** - Explains reasons behind rules, not just what they are

**Reference:** `/docs/ADDING_NEW_CONTENT.md` (Phase 2: Content Transformation)

---

## Before Every Deployment

### 1. Content Sync Check
When adding new chapters or sections:

- [ ] **Update `sie-study-materials.html`**
  - Add new chapter card with correct number and title
  - Update progress badge ("X of 16 Chapters Available")
  - Ensure chapter links point to correct HTML files
  - Mark chapter as "Study Now" (not "Coming Soon")

- [ ] **Update `sie-navigation-config.js`**
  - Add new sections to the correct chapter
  - Set `locked: false` for available content
  - Verify file names match actual HTML files

- [ ] **Verify all new HTML files exist**
  - Check that all referenced files are in `public/`
  - Ensure files are copied to repo root for deployment

### 2. Cache Busting
- [ ] Run `npm run cache-bust` (or let pre-commit hook handle it)
- [ ] Verify HTML files have updated `?v=` query strings
- [ ] Check that CSS/JS hashes match between source and deployed files

### 3. File Sync Check
Ensure `public/` files match repo root:

```bash
# Quick diff check
diff public/sie-study-materials.html ../sie-study-materials.html
diff public/sie-navigation-config.js ../sie-navigation-config.js
```

### 4. Link Validation
- [ ] All chapter links work (no 404s)
- [ ] Navigation between sections works
- [ ] "Back to Study Materials" links work

### 5. Common Errors to Watch For

| Error | How to Catch |
|-------|--------------|
| Wrong chapter number | Review `sie-study-materials.html` chapter order |
| Duplicate meta tags | Search for repeated `<meta` tags in HTML |
| Old cache-bust timestamps | Look for `?v=` with 10-digit numbers (old system) |
| Missing chapter in nav | Check `sie-navigation-config.js` sections array |
| "Coming Soon" on live content | Search for `chapter-card--coming` class on chapters that should be available |
| Progress badge out of date | Count actual available chapters vs badge number |

## After Adding New Content

When creating a new chapter (e.g., Chapter 7):

1. Create HTML files in `public/`:
   - `sie-chapter-7-*.html` for each section

2. Update these files:
   - `public/sie-study-materials.html` - Add chapter card
   - `public/sie-navigation-config.js` - Add chapter to navigation

3. Copy to repo root:
   - All new `sie-chapter-7-*.html` files
   - Updated `sie-study-materials.html`
   - Updated `sie-navigation-config.js`

4. Run deployment:
   ```bash
   ./deploy.sh
   ```

## Quick Validation Script

Run this to check for common issues:

```bash
# Check chapter count matches badge
echo "Chapters marked available:"
grep -c "chapter-card--available" public/sie-study-materials.html

# Check for duplicate meta tags
echo "Cache-control meta tags (should be 0-1):"
grep -c "Cache-Control" public/sie-study-materials.html

# Check navigation config has Chapter 6
echo "Chapter 6 in nav config:"
grep -A5 '"number": 6' public/sie-navigation-config.js | head -6
```

## Deployment Commands

```bash
# Full deployment (runs cache-bust automatically)
./deploy.sh

# Manual cache-bust check
npm run cache-bust:check

# Sync single file to repo root
cp public/sie-study-materials.html ../sie-study-materials.html
```

---

**Remember:** The live site serves from the **repo root**, not from `fhm/public/`. Always copy updated files to both locations.
