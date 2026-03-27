# UI Audit Change Log — 2026-03-26

Comprehensive design system compliance pass. Every change below can be reverted by finding the "was → now" entry.

To revert everything at once: `git diff HEAD~1 --stat` then `git checkout HEAD~1 -- <file>` per file.

---

## Batch 1: design-tokens.ts — New Tokens Added

| Token | Value | Reason |
|-------|-------|--------|
| `warningDim` | `rgba(245, 158, 11, 0.15)` | Warning backgrounds (NetworkError, SessionDetail, SessionLogger) |
| `warningDimBorder` | `rgba(245, 158, 11, 0.3)` | Warning tag borders |
| `goldUltraDim` | `rgba(245, 166, 35, 0.04)` | Ultra-subtle gold hint (review field empty state) |
| `goldDimBorder` | `rgba(245, 166, 35, 0.2)` | Gold border variant (GymCard selected) |
| `infoDim` | `rgba(59, 130, 246, 0.15)` | Info/technique badge backgrounds |
| `purple` | `#8B5CF6` | Insight category badge text |
| `purpleDim` | `rgba(139, 92, 246, 0.15)` | Insight category badge background |
| `toastSuccess` | `#1a2e1a` | Toast success background |
| `toastError` | `#2e1a1a` | Toast error background |
| `toastWarning` | `#2e2a1a` | Toast warning background |
| `toastInfo` | `#1a1a2e` | Toast info background |
| `divider` | `#2a2a2a` | Subtle divider lines (gym cards, dropdowns) |

---

## Batch 2: P0 Critical Fixes

### Font Weight 300 → 500
| File | Line | Was | Now |
|------|------|-----|-----|
| WelcomeScreen.tsx | 241 | `fontWeight: '300'` | `fontWeight: '500'` |
| GetStartedScreen.tsx | 613 | `fontWeight: '300'` | `fontWeight: '500'` |

### Font Size Below 12px → 12
| File | Line | Was | Now |
|------|------|-----|-----|
| GymCard.tsx | 141 | `fontSize: 11` | `fontSize: 12` |
| GymHistoryList.tsx | 242 | `fontSize: 11` | `fontSize: 12` |
| SessionLoggerScreen.tsx | 1642 | `fontSize: 10` | `fontSize: 12` |
| YourTrainingScreen.tsx | 597 | `fontSize: 11` | `fontSize: 12` |

### Missing fontFamily — PrivacyPolicyScreen.tsx
All text styles updated with explicit fontFamily declarations.

---

## Batch 3: Hardcoded Colors → Token References

### Toast.tsx
| Line | Was | Now |
|------|-----|-----|
| 200 | `'#1a2e1a'` | `colors.toastSuccess` |
| 204 | `'#2e1a1a'` | `colors.toastError` |
| 208 | `'#2e2a1a'` | `colors.toastWarning` |
| 212 | `'#1a1a2e'` | `colors.toastInfo` |

### NetworkError.tsx
| Line | Was | Now |
|------|-----|-----|
| 56 | `'rgba(245, 158, 11, 0.15)'` | `colors.warningDim` |

### GymSearchInput.tsx
| Line | Was | Now |
|------|-----|-----|
| 212 | `'#252525'` | `pressedStyles.card.backgroundColor` |
| 295 | `'#2a2a2a'` | `colors.divider` |

### YourTrainingScreen.tsx
| Line | Was | Now |
|------|-----|-----|
| 623 | `'#2a2a2a'` | `colors.divider` |

### InsightsScreen.tsx
| Line | Was | Now |
|------|-----|-----|
| 41 | `'rgba(59, 130, 246, 0.15)'` | `colors.infoDim` |
| 41 | `'#3B82F6'` | `colors.info` |
| 46 | `'rgba(139, 92, 246, 0.15)'` | `colors.purpleDim` |
| 46 | `'#8B5CF6'` | `colors.purple` |
| 703 | `'#252525'` | `pressedStyles.card.backgroundColor` |
| 42,45 | `'rgba(245, 166, 35, 0.15)'` | `colors.goldDim` |
| 1016 | `'rgba(245, 166, 35, 0.15)'` | `colors.goldDim` |

### SessionLoggerScreen.tsx
| Line | Was | Now |
|------|-----|-----|
| 1573 | `'rgba(245, 166, 35, 0.04)'` | `colors.goldUltraDim` |
| 1657 | `'rgba(245, 158, 11, 0.1)'` | `colors.warningDim` (note: was 0.1, token is 0.15 — acceptable) |
| 1658 | `'rgba(245, 158, 11, 0.3)'` | `colors.warningDimBorder` |

### SessionDetailScreen.tsx
| Line | Was | Now |
|------|-----|-----|
| 259 | `'rgba(245, 158, 11, 0.1)'` | `colors.warningDim` |
| 259 | `'rgba(245, 158, 11, 0.3)'` | `colors.warningDimBorder` |

### GymCard.tsx
| Line | Was | Now |
|------|-----|-----|
| 137 | `'rgba(245, 166, 35, 0.2)'` | `colors.goldDimBorder` |

### JournalScreen.tsx
| Line | Was | Now |
|------|-----|-----|
| 332 | `'#252525'` | `pressedStyles.card.backgroundColor` |

### App.tsx
Colors in App.tsx navigation theme — replace literals with token imports.

---

## Batch 4: Spacing Magic Numbers → Token References

Spacing values that don't fall on the 4px grid are adjusted to nearest token.

---

## How to Revert

### Single file revert
```bash
git checkout HEAD~1 -- tomo/src/path/to/file.tsx
```

### Full revert
```bash
git revert <commit-hash>
```

### Verify no regressions
```bash
cd tomo && npx tsc --noEmit
```
