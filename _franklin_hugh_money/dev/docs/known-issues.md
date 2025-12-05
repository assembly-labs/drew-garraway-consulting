# Known Issues & Bug Tracker
## Franklin Hugh Money Project

---

## 🐛 Active Bugs

### HIGH SEVERITY
*No high severity bugs currently*

### MEDIUM SEVERITY
*No medium severity bugs currently*

### LOW SEVERITY
*No low severity bugs currently*

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
**Date Found**: YYYY-MM-DD
**Severity**: High/Medium/Low
**Browser/Device**:
**Description**:
**Steps to Reproduce**:
1.
2.

**Expected Behavior**:
**Actual Behavior**:
**Screenshot/Error**:
**Workaround**:
**Status**: Open/In Progress/Won't Fix/Resolved

---

## ✅ Resolved Issues

### Archive
*Issues resolved in previous sprints will be moved here*

---

*Last Updated: 2024-12-05*