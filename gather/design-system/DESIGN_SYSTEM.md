# Gather Design System

## Brand Identity

### Tagline
**"Good things from good people"**

### Voice
- Warm, neighborly, approachable
- Direct but not corporate
- Celebrates community over commerce
- Uses "neighbors" instead of "customers/users"

---

## Colors

### Primary: Sage Green

The core brand color - represents growth, freshness, nature.

| Token | Hex | Usage |
|-------|-----|-------|
| `--sage-900` | `#1C3A13` | Footer background, darkest accents |
| `--sage-800` | `#234116` | Dark headings |
| `--sage-700` | `#2D5016` | Primary text on light backgrounds |
| `--sage-600` | `#3A6A1F` | Subheadings, labels |
| `--sage-500` | `#4A7C28` | Primary brand color, buttons, links |
| `--sage-400` | `#66A043` | Hover states |
| `--sage-300` | `#81C784` | Borders, dividers |
| `--sage-200` | `#A5D6A7` | Light backgrounds |
| `--sage-100` | `#C8E6C9` | Very light backgrounds |
| `--sage-50` | `#E8F5E9` | Section backgrounds, cards |

### Secondary: Golden Hour

Warmth, sunshine, harvest time.

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold-900` | `#E65100` | Urgent/warning accents |
| `--gold-800` | `#EF6C00` | Dark gold |
| `--gold-700` | `#F57C00` | Emphasis |
| `--gold-600` | `#FB8C00` | Strong accent |
| `--gold-500` | `#FF9800` | Secondary brand color |
| `--gold-400` | `#FFA726` | Highlights |
| `--gold-300` | `#FFB74D` | Warm accents |
| `--gold-200` | `#FFCC80` | Light gold |
| `--gold-100` | `#FFE082` | Soft backgrounds |
| `--gold-50` | `#FFF9C4` | Very soft backgrounds |

### Supporting Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--mint-500` | `#3DDC97` | Success, positive, "good" |
| `--coral-500` | `#FF6B6B` | Error, warning, "problem" |
| `--honey-500` | `#FFD93D` | Attention, highlight |
| `--sky-500` | `#4ECDC4` | Info, neutral accent |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `--dash-text` | `#37352F` | Primary text (Notion-style) |
| `--dash-muted` | `#787774` | Secondary text, captions |
| `--dash-border` | `#E3E2E0` | Borders, dividers |
| `--dash-hover` | `#F7F6F3` | Hover backgrounds |

### Gradients

```css
/* Primary brand gradient - golden to green */
--gradient-golden: linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%);

/* Soft version for backgrounds */
--gradient-golden-soft: linear-gradient(120deg, #FFF59D 0%, #A5D6A7 50%, #81C784 100%);

/* Dawn - for hero sections */
--gradient-dawn: linear-gradient(135deg, #F6F9FC 0%, #E8F5E9 50%, #FFF9C4 100%);

/* Harvest - warm CTAs */
--gradient-harvest: linear-gradient(135deg, #FFCC80 0%, #FFB74D 25%, #81C784 75%, #66BB6A 100%);

/* Field - deep green */
--gradient-field: linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%);
```

---

## Typography

### Font Families

| Usage | Font | Fallback |
|-------|------|----------|
| Headings | DM Sans | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif |
| Body | Inter | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif |

### Font Sizes

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| Hero | clamp(2rem, 5vw, 3.5rem) | 1.1 | Main hero headlines |
| H1 | clamp(1.75rem, 4vw, 3rem) | 1.2 | Section titles |
| H2 | 1.75rem | 1.2 | Subsection titles |
| H3 | 1.375rem | 1.3 | Card titles |
| H4 | 1.125rem | 1.4 | Small headings |
| Body | 1rem | 1.6 | Default text |
| Small | 0.9375rem | 1.5 | Captions, labels |
| XS | 0.875rem | 1.4 | Metadata, badges |
| XXS | 0.75rem | 1.4 | Eyebrows, tags |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Emphasized text |
| Semibold | 600 | Buttons, labels |
| Bold | 700 | Headings, numbers |

---

## Spacing

Based on 4px unit.

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |
| `--space-24` | 6rem | 96px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements, tags |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large cards |
| `--radius-2xl` | 24px | Hero sections |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 2px 4px -1px rgba(0,0,0,0.06) | Subtle lift |
| `--shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) | Cards |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | Elevated cards |
| `--shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1) | Modals, dropdowns |
| `--shadow-2xl` | 0 25px 50px -12px rgba(0,0,0,0.25) | Hero elements |

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Default easing |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Smooth transitions |
| `--ease-spring` | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Bouncy interactions |
| `--duration-fast` | 150ms | Micro-interactions |
| `--duration-base` | 200ms | Default transitions |
| `--duration-slow` | 300ms | Complex animations |

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--gradient-golden);
  color: white;
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  min-height: 48px;
  box-shadow: 0 4px 20px rgba(255, 183, 77, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 183, 77, 0.4);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: white;
  color: var(--sage-700);
  border: 2px solid var(--sage-500);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  min-height: 48px;
}

.btn-secondary:hover {
  background: var(--sage-50);
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--dash-border);
  transition: all var(--duration-base) var(--ease-out);
}

.card:hover {
  border-color: var(--sage-300);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

### Badges

```css
/* Success badge */
.badge-success {
  background: rgba(61, 220, 151, 0.15);
  color: var(--mint-500);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-weight: 600;
}

/* Warning badge */
.badge-warning {
  background: rgba(255, 107, 107, 0.15);
  color: var(--coral-500);
}

/* Stat badge (golden) */
.stat-badge {
  background: var(--gradient-golden);
  color: white;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
}
```

### Form Inputs

```css
.input {
  width: 100%;
  padding: var(--space-4);
  border: 2px solid var(--dash-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color var(--duration-base) var(--ease-out);
}

.input:focus {
  outline: none;
  border-color: var(--sage-500);
}

.input:hover:not(:focus) {
  border-color: var(--sage-300);
}
```

---

## Layout

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

### Section
```css
section {
  padding: var(--space-20) 0;
}

@media (min-width: 768px) {
  section {
    padding: var(--space-24) 0;
  }
}
```

### Grid Patterns
```css
/* 2-column on tablet, 3-column on desktop */
.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1200px | Desktops |

---

## Accessibility

### Touch Targets
- Minimum 48px for all interactive elements
- 44px minimum on mobile

### Color Contrast
- Text on white: Use `--sage-700` or darker (4.5:1 ratio)
- Text on sage-50: Use `--sage-800` or darker
- White text: Only on `--sage-600` or darker, or gradients

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Icons

Use simple, friendly iconography. Recommended libraries:
- Lucide React (primary)
- Heroicons (alternative)

Style: Outlined, 24px default, 2px stroke.

---

## Photography Style

- Real products, real vendors, real markets
- Natural lighting (golden hour preferred)
- Warm color grading
- Focus on hands, produce, people interacting
- Never stock photos that feel corporate

---

## CSS Custom Properties (Copy-Paste)

```css
:root {
  /* Primary Greens */
  --sage-900: #1C3A13;
  --sage-800: #234116;
  --sage-700: #2D5016;
  --sage-600: #3A6A1F;
  --sage-500: #4A7C28;
  --sage-400: #66A043;
  --sage-300: #81C784;
  --sage-200: #A5D6A7;
  --sage-100: #C8E6C9;
  --sage-50: #E8F5E9;

  /* Golden Hour */
  --gold-900: #E65100;
  --gold-800: #EF6C00;
  --gold-700: #F57C00;
  --gold-600: #FB8C00;
  --gold-500: #FF9800;
  --gold-400: #FFA726;
  --gold-300: #FFB74D;
  --gold-200: #FFCC80;
  --gold-100: #FFE082;
  --gold-50: #FFF9C4;

  /* Supporting */
  --mint-500: #3DDC97;
  --coral-500: #FF6B6B;
  --honey-500: #FFD93D;
  --sky-500: #4ECDC4;

  /* Neutrals */
  --dash-text: #37352F;
  --dash-muted: #787774;
  --dash-border: #E3E2E0;
  --dash-hover: #F7F6F3;

  /* Gradients */
  --gradient-dawn: linear-gradient(135deg, #F6F9FC 0%, #E8F5E9 50%, #FFF9C4 100%);
  --gradient-golden: linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%);
  --gradient-golden-soft: linear-gradient(120deg, #FFF59D 0%, #A5D6A7 50%, #81C784 100%);
  --gradient-harvest: linear-gradient(135deg, #FFCC80 0%, #FFB74D 25%, #81C784 75%, #66BB6A 100%);
  --gradient-field: linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%);

  /* Typography */
  --font-primary: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 4px -1px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25);

  /* Transitions */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
}
```
