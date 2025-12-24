# Alliance BJJ App - Design Tokens

## How to Update Design Tokens

1. **Open** `design-system/index.html` in a browser to see the current design
2. **Edit** the CSS variables in `design-system/styles.css` (the `:root` section at the top)
3. **Refresh** the browser to preview your changes
4. **Ask Claude Code:** "Sync the design system to theme.js"
5. Claude will update `alliance-mobile/constants/theme.js` to match

---

## Colors

### Core Palette
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#000000` | Primary brand, buttons, text |
| `primaryLight` | `#333333` | Hover states, secondary emphasis |
| `background` | `#F5F5F5` | Screen backgrounds |
| `surface` | `#FFFFFF` | Cards, modals |
| `surfaceSecondary` | `#FAFAFA` | Disabled inputs, subtle backgrounds |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `text.primary` | `#000000` | Main text |
| `text.secondary` | `#737373` | Secondary labels, captions |
| `text.muted` | `#A5A5A5` | Placeholder, disabled text |
| `text.inverse` | `#FFFFFF` | Text on dark backgrounds |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `border` | `#E5E5E5` | Card borders, dividers |
| `divider` | `#E5E5E5` | Section dividers |

### Status Colors
| Token | Background | Text |
|-------|------------|------|
| `success` | `#D4EDDA` | `#155724` |
| `error` | `#F8D7DA` | `#721C24` |
| `warning` | `#FFF3CD` | `#856404` |
| `info` | `#D1ECF1` | `#0C5460` |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `danger` | `#DC3545` | Destructive actions, errors |
| `link` | `#0066CC` | Links, interactive text |

### Belt Colors
| Belt | Value |
|------|-------|
| White | `#FFFFFF` |
| Blue | `#0066CC` |
| Purple | `#6F42C1` |
| Brown | `#8B4513` |
| Black | `#000000` |

---

## Typography

### Font Sizes
| Token | Size | Usage |
|-------|------|-------|
| `xs` | 10px | Fine print |
| `sm` | 12px | Captions, badges |
| `md` | 14px | Secondary text |
| `lg` | 16px | Body text, buttons |
| `xl` | 18px | Card titles |
| `2xl` | 20px | Section headings |
| `3xl` | 24px | Screen titles |
| `4xl` | 28px | Large headings |
| `5xl` | 32px | Hero numbers |

### Font Weights
| Token | Weight | Usage |
|-------|--------|-------|
| `regular` | 400 | Body text |
| `medium` | 500 | Buttons, labels |
| `semibold` | 600 | Section headers |
| `bold` | 700 | Titles, emphasis |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Icon gaps, small padding |
| `md` | 12px | Default padding |
| `lg` | 16px | Section padding |
| `xl` | 20px | Large gaps |
| `2xl` | 24px | Screen padding |
| `3xl` | 32px | Section margins |
| `4xl` | 40px | Large sections |
| `5xl` | 48px | Hero spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0 | No rounding |
| `sm` | 4px | Tags, small elements |
| `md` | 6px | Buttons, inputs |
| `lg` | 8px | Cards |
| `xl` | 12px | Status badges |
| `2xl` | 16px | Large cards |
| `full` | 9999px | Avatars, circles |

---

## Component Styles

### Buttons
- **Primary**: Black background, white text, 6px radius
- **Secondary**: White background, gray border, black text
- **Danger**: White background, red border, red text

### Cards
- White background
- 1px border (#E5E5E5)
- 8px border radius
- 16px padding

### Badges
- Status badges: 12px radius, 6px/12px padding
- Use status colors for success/error states

### Inputs
- White background
- 1px border (#E5E5E5)
- 6px border radius
- 12px padding

---

## Usage in Code

```javascript
// Import individual tokens
import { colors, spacing, typography } from '../constants';

// Use in styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
});
```

```javascript
// Import pre-built component styles
import { componentStyles } from '../constants';

// Use directly
<View style={componentStyles.card}>
  <Text style={componentStyles.sectionHeader}>Title</Text>
</View>
```

```javascript
// Import helper functions
import { getBeltColor, getStatusStyle } from '../constants';

// Get belt color by name
const beltColor = getBeltColor('blue'); // Returns #0066CC

// Get status style object
const { container, text } = getStatusStyle('success');
```
