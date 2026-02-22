# Known Issues & Bug Tracker

## Franklin Hugh Money Project

---

## 🐛 Active Bugs

### HIGH SEVERITY

_No high severity bugs currently_

### MEDIUM SEVERITY

_No medium severity bugs currently_

### LOW SEVERITY

_No low severity bugs currently_

---

## ⚠️ Known Limitations

### Browser Support

- **Issue**: CSS Grid not fully supported in IE11
- **Impact**: Layout may break for <1% of users
- **Decision**: Won't fix - IE11 not target audience

### Performance

- **Issue**: Large images may slow initial load
- **Workaround**: Implement lazy loading
- **Status**: Planned for Sprint 2

---

## 🔧 Workarounds

### Mobile Safari Issues

```javascript
// Fix for 100vh on iOS
.fh-hero {
  height: 100vh;
  height: -webkit-fill-available;
}
```

### Chrome Autofill Styling

```css
/* Override Chrome's aggressive autofill */
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px var(--fh-color-black) inset !important;
  -webkit-text-fill-color: var(--fh-color-punk) !important;
}
```

---

## 📋 Bug Report Template

### New Bug Report

**Date Found**: YYYY-MM-DD **Severity**: High/Medium/Low **Browser/Device**: **Description**:
**Steps to Reproduce**:

1.
2.

**Expected Behavior**: **Actual Behavior**: **Screenshot/Error**: **Workaround**: **Status**:
Open/In Progress/Won't Fix/Resolved

---

## ✅ Resolved Issues

### 2024-12-05 Session

#### 1. Deployment Not Updating

**Date Found**: 2024-12-05 **Severity**: High **Description**: Changes to HTML files weren't
appearing on live site **Root Cause**: File location mismatch - site serves from repository root,
not from `fhm/public/` **Resolution**:

- Files must be copied to root directory for deployment
- Renamed `treasury-analysis.html` → `franklin-hugh-money-treasury.html` to match live URL
  **Lesson**: Always verify deployment structure matches local development structure

#### 2. Duplicate Text in Treemap Visualization

**Date Found**: 2024-12-05 **Severity**: Medium **Description**: "Federal Reserve" and other labels
appeared twice in treemap **Root Cause**: Plotly was displaying both label and text when
`texttemplate` was used incorrectly **Resolution**: Use `textinfo: 'text'` with complete formatted
text, remove `texttemplate`

```javascript
// CORRECT:
textinfo: 'text',  // Only show custom text
text: labels.map(k => `${k}<br>$${data[k].toFixed(1)}T<br>${percentages[k].toFixed(1)}%`)
```

#### 3. Persistent "Loading visualization..." Messages

**Date Found**: 2024-12-05 **Severity**: Medium **Description**: Loading messages remained visible
after charts rendered **Root Cause**: Simple `innerHTML = ''` wasn't properly clearing DOM elements
**Resolution**:

- Use `querySelector('.loading').remove()` at start of each chart function
- Added failsafe to remove all loading elements after 500ms

```javascript
// Remove loading message immediately
const loadingDiv = container.querySelector('.loading');
if (loadingDiv) {
  loadingDiv.remove();
}
```

#### 4. Duplicate Nodes in Sankey Diagram

**Date Found**: 2024-12-05 **Severity**: Low **Description**: Category nodes appeared twice in
Sankey flow diagram **Root Cause**: Subcategory nodes (individual countries) were added only for
Foreign holders **Resolution**: Removed subcategory nodes to maintain consistent three-level
hierarchy

---

## 📚 Important Development Notes

### Deployment Structure (CRITICAL)

**The live site serves files from the repository ROOT directory, not from subdirectories!**

- **Development Location**: `fhm/public/`
- **Deployment Location**: Repository root (`/`)
- **Required Action**: Copy files from `public/` to root after changes

Example workflow:

```bash
# After editing in fhm/public/
cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html
cp public/index.html ../franklin-hugh-money.html

# Then commit and push from root
cd ..
git add franklin-hugh-money*.html
git commit -m "Update Franklin Hugh Money pages"
git push ssh main
```

### Plotly.js Gotchas

1. **Treemap text**: Use either `textinfo: 'label+text'` OR `textinfo: 'text'` with complete text,
   never both with texttemplate
2. **Loading states**: Always clear containers before rendering charts
3. **Sankey diagrams**: Keep node hierarchy consistent across all branches

---

_Last Updated: 2024-12-05_
