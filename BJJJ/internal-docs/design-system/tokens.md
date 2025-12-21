# BJJ Journal Design System

Based on Alliance BJJ Design Language - Bold, high-contrast, martial arts inspired.

---

## Design Principles

1. **Bold & Strong** - Uppercase headings, heavy weights, high contrast
2. **Black & Gold** - Primary palette reflecting martial arts tradition
3. **Functional** - Clear hierarchy, accessible, mobile-first
4. **Respectful** - Belt colors follow industry standards

---

## Color Tokens

### Primary Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#000000` | Main dark color, headers, text |
| `--color-primary-light` | `#1a1a1a` | Lighter dark variant |
| `--color-primary-dark` | `#0a0a0a` | Deep dark backgrounds |
| `--color-white` | `#FFFFFF` | Light backgrounds, text on dark |

### Accent Colors (Gold/Yellow)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#FCD34D` | Primary accent, highlights, progress |
| `--color-accent-hover` | `#FBBF24` | Hover states |
| `--color-accent-dark` | `#F59E0B` | Active states |
| `--color-accent-text` | `#B8860B` | Text on light backgrounds (7.3:1 contrast) |
| `--color-accent-text-dark` | `#FFD700` | Text on dark backgrounds (10.8:1 contrast) |
| `--color-accent-button` | `#F59E0B` | Button backgrounds (3.5:1 contrast) |

### Grayscale Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gray-50` | `#FAFAFA` | Lightest backgrounds |
| `--color-gray-100` | `#F5F5F5` | Page backgrounds |
| `--color-gray-200` | `#E5E5E5` | Borders, dividers |
| `--color-gray-300` | `#D4D4D4` | Input borders |
| `--color-gray-400` | `#A3A3A3` | Placeholder text |
| `--color-gray-500` | `#6B7280` | Muted text (4.6:1 on white) |
| `--color-gray-600` | `#4B5563` | Secondary text |
| `--color-gray-700` | `#374151` | Primary body text |
| `--color-gray-800` | `#1F2937` | Dark text |
| `--color-gray-900` | `#171717` | Darkest text |

### Belt Colors (Industry Standard)

| Token | Value | Belt |
|-------|-------|------|
| `--color-belt-white` | `#FFFFFF` | White belt |
| `--color-belt-blue` | `#0033A0` | Blue belt |
| `--color-belt-purple` | `#4B0082` | Purple belt |
| `--color-belt-brown` | `#8B4513` | Brown belt |
| `--color-belt-black` | `#000000` | Black belt |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#22C55E` | Success states, confirmations |
| `--color-success-text` | `#15803D` | Success text (high contrast) |
| `--color-warning` | `#F59E0B` | Warning states |
| `--color-warning-text` | `#B45309` | Warning text (high contrast) |
| `--color-error` | `#EF4444` | Error states, destructive |
| `--color-error-text` | `#B91C1C` | Error text (high contrast) |
| `--color-info` | `#3B82F6` | Informational |

### Training Type Colors

| Token | Value | Type |
|-------|-------|------|
| `--color-training-gi` | `#3B82F6` | Gi training |
| `--color-training-nogi` | `#F97316` | No-Gi training |
| `--color-training-openmat` | `#A855F7` | Open mat |
| `--color-training-private` | `#22C55E` | Private lessons |
| `--color-training-competition` | `#EF4444` | Competition prep |

---

## Typography

### Font Families

| Type | Font | Fallbacks |
|------|------|-----------|
| Headings | Montserrat | Arial, Helvetica, sans-serif |
| Body | Open Sans | Arial, Helvetica, sans-serif |

### Type Scale

| Token | Size | Pixels |
|-------|------|--------|
| `--text-xs` | 0.75rem | 12px |
| `--text-sm` | 0.875rem | 14px |
| `--text-base` | 1rem | 16px |
| `--text-lg` | 1.125rem | 18px |
| `--text-xl` | 1.25rem | 20px |
| `--text-2xl` | 1.5rem | 24px |
| `--text-3xl` | 1.875rem | 30px |
| `--text-4xl` | 2.25rem | 36px |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | 1.2 | Headings |
| `--leading-normal` | 1.6 | Body text |
| `--leading-relaxed` | 1.76 | Mobile body (+10%) |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.025em | Tight headlines |
| `--tracking-normal` | 0 | Default |
| `--tracking-wide` | 0.025em | Subheadings |
| `--tracking-wider` | 0.05em | H1 headings |
| `--tracking-widest` | 0.1em | Labels, caps |

### Heading Styles

All headings use:
- Font: Montserrat
- Weight: 700 (Bold)
- Transform: UPPERCASE
- Line-height: 1.2

---

## Spacing System

Based on 4px unit for consistency.

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-xs` | 4px | 4px |
| `--space-sm` | 8px | 8px |
| `--space-md` | 16px | 16px |
| `--space-lg` | 24px | 24px |
| `--space-xl` | 32px | 32px |
| `--space-2xl` | 48px | 48px |
| `--space-3xl` | 64px | 64px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Inputs, small buttons |
| `--radius-md` | 8px | Cards, buttons |
| `--radius-lg` | 12px | Large cards |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | Floating elements |

---

## Components

### Buttons

```css
.btn              /* Base button */
.btn-primary      /* Gold/yellow accent */
.btn-dark         /* Black button */
.btn-outline      /* Outlined button */
.btn-success      /* Green success */
.btn-danger       /* Red destructive */
.btn-sm           /* Small size */
.btn-lg           /* Large size */
```

### Cards

```css
.card             /* Base card container */
.card-header      /* Card header section */
.card-title       /* Card title text */
```

### Forms

```css
.form-group       /* Form field wrapper */
.form-label       /* Field label */
.form-input       /* Text input */
.form-select      /* Select dropdown */
.form-textarea    /* Multiline input */
```

### Badges

```css
/* Belt badges */
.belt-badge       /* Base belt badge */
.belt-white       /* White belt color */
.belt-blue        /* Blue belt color */
.belt-purple      /* Purple belt color */
.belt-brown       /* Brown belt color */
.belt-black       /* Black belt color */
.belt-stripes     /* Stripe container */
.belt-stripe      /* Individual stripe */

/* Training type badges */
.training-badge   /* Base training badge */
.training-gi      /* Gi class */
.training-nogi    /* No-Gi class */
.training-openmat /* Open mat */
.training-private /* Private lesson */
.training-competition /* Competition */

/* Status badges */
.status-badge     /* Base status badge */
.status-success   /* Green success */
.status-warning   /* Yellow warning */
.status-error     /* Red error */
```

### Stats

```css
.stat-card        /* Stat card container */
.stat-label       /* Stat label text */
.stat-value       /* Stat value (large number) */
```

### Progress

```css
.progress-bar     /* Progress bar container */
.progress-fill    /* Progress bar fill */
```

### Navigation

```css
.tab-bar          /* Mobile tab bar */
.tab-item         /* Tab bar item */
.tab-item.active  /* Active tab */
.tab-icon         /* Tab icon */
```

---

## Utility Classes

```css
/* Text alignment */
.text-center
.text-right

/* Text styling */
.text-muted       /* Muted gray text */
.text-small       /* Small text */
.text-large       /* Large text */
.text-uppercase   /* Uppercase text */
.font-bold        /* Bold weight */
.font-heading     /* Montserrat font */
```

---

## Dark Mode

Dark mode is automatically applied via `prefers-color-scheme: dark`.

### Dark Mode Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--dark-bg-primary` | `#0F0F0F` | Main background |
| `--dark-bg-secondary` | `#1A1A1A` | Card backgrounds |
| `--dark-bg-tertiary` | `#252525` | Hover states |
| `--dark-border` | `#353535` | Border color |

---

## Accessibility

- All color combinations meet WCAG 2.1 AA standards
- Focus states use 2px outline with accent color
- Interactive elements have visible hover/focus states
- Text contrast ratios noted in token tables
