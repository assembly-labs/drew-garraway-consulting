# Tredyffrin Libraries Style Guide

Visual design system based on [tredyffrinlibraries.org](https://www.tredyffrinlibraries.org/). WCAG 2.1 AA compliant.

---

## Folder Structure

```
assets/
├── css/
│   ├── variables.css   # Design tokens (colors, fonts, spacing)
│   ├── main.css        # Main stylesheet
│   └── print.css       # Print-optimized styles
├── images/
│   ├── ttl-logo.svg    # Full logo
│   ├── tredy-icon.svg  # Favicon/icon
│   ├── tpl-branding.png
│   └── photos/         # Copier reference photos
└── fonts/              # Reserved for local fonts
```

---

## Color Palette

### Primary Blues
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#015e8a` | Main brand color, links |
| `--color-primary-dark` | `#015379` | Hover states |
| `--color-primary-light` | `#017ab2` | Focus rings |
| `--color-primary-bg` | `#dbeaff` | Light backgrounds |

### Secondary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-teal` | `#00966c` | Secondary buttons |
| `--color-gold` | `#f99a32` | Warnings, accents |
| `--color-plum` | `#673147` | Visited links |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#218739` | Success states |
| `--color-error` | `#c41e3a` | Error states |
| `--color-warning` | `#f99a32` | Warning states |

### Neutrals
| Token | Range |
|-------|-------|
| `--color-gray-900` to `--color-gray-50` | Dark to light grays |

---

## Typography

### Fonts
- **Headings**: Poppins (500-700 weight)
- **Body**: Lato (400-700 weight)
- **Monospace**: System monospace stack

### Scale
| Token | Size |
|-------|------|
| `--text-xs` | 12px |
| `--text-sm` | 14px |
| `--text-base` | 16px |
| `--text-lg` | 18px |
| `--text-xl` | 20px |
| `--text-2xl` | 24px |
| `--text-3xl` | 30px |
| `--text-4xl` | 36px |

---

## Components

### Buttons

```html
<a href="#" class="btn btn-primary">Primary Action</a>
<a href="#" class="btn btn-secondary">Secondary Action</a>
<a href="#" class="btn btn-outline">Outline Style</a>
```

Size variants: `.btn-sm`, `.btn-lg`

### Callouts

```html
<div class="callout">
  Default information callout.
</div>

<div class="callout callout-warning">
  Warning message.
</div>

<div class="callout callout-success">
  Success message.
</div>

<div class="callout callout-error">
  Error message.
</div>
```

### Cards

```html
<div class="card">
  Basic card with border.
</div>

<div class="card card-elevated">
  Elevated card with shadow.
</div>
```

### Numbered Steps

```html
<ol class="steps">
  <li>First step instruction</li>
  <li>Second step instruction</li>
  <li>Third step instruction</li>
</ol>
```

### Keyboard Keys

```html
Press <kbd>Ctrl</kbd> + <kbd>P</kbd> to print.
```

---

## Print Styles

### Sign Classes

```html
<div class="sign">
  <h1>Sign Title</h1>
  <p>Sign content goes here.</p>
</div>

<div class="sign sign-large">
  Large format sign.
</div>
```

### Quick Reference Cards

```html
<div class="quick-ref">
  <h3>Quick Reference</h3>
  <ol>
    <li>Step one</li>
    <li>Step two</li>
  </ol>
</div>
```

### Page Breaks

```html
<div class="page-break"></div>
<div class="page-break-before">Starts on new page</div>
<div class="avoid-break">Keep together</div>
```

### Two-Column Print Layout

```html
<div class="print-columns">
  <div>Column 1 content</div>
  <div>Column 2 content</div>
</div>
```

---

## Accessibility Features

### Focus States
All interactive elements have visible focus indicators using `--focus-ring-color` and `--focus-ring-width`.

### Skip Link
Template includes a skip-to-content link for keyboard navigation.

### Reduced Motion
Animations are disabled when `prefers-reduced-motion: reduce` is set.

### High Contrast
Border and focus styles are enhanced when `prefers-contrast: high` is active.

### Semantic HTML
- Use appropriate heading hierarchy (h1-h6)
- Use `<main>`, `<header>`, `<footer>`, `<nav>` landmarks
- Include `alt` text on images
- Use `aria-label` for icon-only buttons

---

## Using the Template

1. Copy `html/_template.html`
2. Replace placeholders:
   - `{{TITLE}}` - Browser tab title
   - `{{DESCRIPTION}}` - Meta description
   - `{{PAGE_TITLE}}` - Header subtitle
   - `{{CONTENT}}` - Page content

---

## Color Contrast Ratios

All text colors meet WCAG AA requirements:
- `--color-primary` on white: 5.2:1
- `--color-gray-900` on white: 12.6:1
- `--color-white` on `--color-primary`: 5.2:1
