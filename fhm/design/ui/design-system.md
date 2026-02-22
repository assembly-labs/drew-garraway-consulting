# Franklin Hugh Money Design System

## "An Investment in Knowledge"

---

## 🎨 Color Palette

### Primary Colors

```css
:root {
  /* Primary Institutional Colors */
  --fh-navy: #002d62; /* Institutional Navy */
  --fh-cream: #fffdf7; /* Paper Cream */
  --fh-gray: #54585a; /* Warm Gray */

  /* Secondary Colors */
  --fh-sage: #7c9885; /* Sage Green (Growth) */
  --fh-burgundy: #6b2737; /* Burgundy (Losses) */
  --fh-gold: #b08d57; /* Gold (Achievements) */

  /* Neutral Scale */
  --fh-gray-900: #1a1a1a;
  --fh-gray-800: #2a2a2a;
  --fh-gray-700: #404040;
  --fh-gray-600: #595959;
  --fh-gray-500: #737373;
  --fh-gray-400: #a3a3a3;
  --fh-gray-300: #d4d4d4;
  --fh-gray-200: #e5e5e5;
  --fh-gray-100: #f5f5f5;
  --fh-white: #ffffff;
}
```

### Color Usage

- **Background**: Cream/White
- **Text**: Navy/Gray-900
- **Links**: Navy (hover: underlined)
- **Primary CTAs**: Navy background, cream text
- **Success/Growth**: Sage green
- **Losses/Warnings**: Burgundy
- **Achievements**: Gold accents

---

## 📝 Typography

### Font Stack

```css
:root {
  /* Headlines - Classical Serif */
  --fh-font-display: 'Crimson Pro', 'EB Garamond', Georgia, serif;

  /* Body - Clean Sans */
  --fh-font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Data/Numbers - Precise Mono */
  --fh-font-mono: 'IBM Plex Mono', 'SF Mono', 'Consolas', monospace;
}
```

### Type Scale

```css
/* Mobile First */
.fh-h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.02em;
}
.fh-h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 400;
}
.fh-h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 500;
}
.fh-body {
  font-size: 1rem;
  line-height: 1.75;
  font-weight: 400;
}
.fh-small {
  font-size: 0.875rem;
  line-height: 1.6;
}
.fh-caption {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--fh-gray-600);
}

/* Desktop (min-width: 768px) */
@media (min-width: 768px) {
  .fh-h1 {
    font-size: 3rem;
  }
  .fh-h2 {
    font-size: 2rem;
  }
  .fh-h3 {
    font-size: 1.5rem;
  }
  .fh-body {
    font-size: 1.125rem;
  }
}
```

---

## 📐 Spacing System

### Base Unit: 8px (Harmonious Proportions)

```css
:root {
  --fh-space-xs: 0.25rem; /* 4px */
  --fh-space-sm: 0.5rem; /* 8px */
  --fh-space-md: 1rem; /* 16px */
  --fh-space-lg: 1.5rem; /* 24px */
  --fh-space-xl: 2rem; /* 32px */
  --fh-space-2xl: 3rem; /* 48px */
  --fh-space-3xl: 4rem; /* 64px */
  --fh-space-4xl: 6rem; /* 96px */
}
```

---

## 🎭 Effects & Animations

### Subtle Transitions

```css
:root {
  --fh-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --fh-transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --fh-transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover states are understated */
a {
  transition: color var(--fh-transition-fast);
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

a:hover {
  text-decoration-thickness: 2px;
}
```

### Loading Animation

```css
@keyframes fh-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fh-loading {
  animation: fh-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 🧩 Components

### Buttons

```css
.fh-btn {
  /* Base */
  padding: var(--fh-space-sm) var(--fh-space-lg);
  font-family: var(--fh-font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  border: 1px solid currentColor;
  cursor: pointer;
  transition: all var(--fh-transition-base);
  background: transparent;
  border-radius: 2px;
}

.fh-btn--primary {
  background: var(--fh-navy);
  color: var(--fh-cream);
  border-color: var(--fh-navy);
}

.fh-btn--primary:hover {
  background: var(--fh-gray-900);
  border-color: var(--fh-gray-900);
}

.fh-btn--secondary {
  color: var(--fh-navy);
  border-color: var(--fh-navy);
}

.fh-btn--secondary:hover {
  background: var(--fh-navy);
  color: var(--fh-cream);
}
```

### Cards

```css
.fh-card {
  background: var(--fh-white);
  border: 1px solid var(--fh-gray-200);
  padding: var(--fh-space-xl);
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: box-shadow var(--fh-transition-base);
}

.fh-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.fh-card__header {
  border-bottom: 1px solid var(--fh-gray-200);
  padding-bottom: var(--fh-space-md);
  margin-bottom: var(--fh-space-lg);
}

.fh-card--featured {
  border-left: 3px solid var(--fh-sage);
}
```

### Tables (Financial Data)

```css
.fh-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--fh-font-mono);
  font-size: 0.9rem;
}

.fh-table th {
  text-align: left;
  font-weight: 600;
  padding: var(--fh-space-sm);
  border-bottom: 2px solid var(--fh-gray-300);
  font-family: var(--fh-font-body);
}

.fh-table td {
  padding: var(--fh-space-sm);
  border-bottom: 1px solid var(--fh-gray-200);
}

.fh-table__positive {
  color: var(--fh-sage);
}

.fh-table__negative {
  color: var(--fh-burgundy);
}
```

### Forms

```css
.fh-input {
  width: 100%;
  padding: var(--fh-space-sm) var(--fh-space-md);
  font-family: var(--fh-font-body);
  font-size: 1rem;
  border: 1px solid var(--fh-gray-300);
  background: var(--fh-white);
  transition: border-color var(--fh-transition-fast);
  border-radius: 2px;
}

.fh-input:focus {
  outline: none;
  border-color: var(--fh-navy);
  box-shadow: 0 0 0 3px rgba(0, 45, 98, 0.1);
}

.fh-label {
  display: block;
  margin-bottom: var(--fh-space-xs);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--fh-gray-700);
}
```

---

## 📱 Breakpoints

```css
/* Mobile First Approach */
:root {
  --fh-screen-sm: 640px; /* Small devices */
  --fh-screen-md: 768px; /* Tablets */
  --fh-screen-lg: 1024px; /* Desktop */
  --fh-screen-xl: 1280px; /* Large desktop */
  --fh-screen-2xl: 1536px; /* XL desktop */
}

/* Standard Media Queries */
@media (min-width: 768px) {
} /* Tablet and up */
@media (min-width: 1024px) {
} /* Desktop and up */
```

---

## 📊 Data Visualization

### Charts & Graphs

```css
.fh-chart {
  width: 100%;
  height: 300px;
  border: 1px solid var(--fh-gray-200);
  background: var(--fh-white);
  padding: var(--fh-space-lg);
}

.fh-chart__title {
  font-family: var(--fh-font-display);
  font-size: 1.125rem;
  margin-bottom: var(--fh-space-md);
  color: var(--fh-gray-900);
}

.fh-chart__legend {
  font-size: 0.75rem;
  color: var(--fh-gray-600);
  display: flex;
  gap: var(--fh-space-lg);
  margin-top: var(--fh-space-md);
}
```

### Portfolio Display

```css
.fh-portfolio {
  font-family: var(--fh-font-mono);
  font-size: 1.5rem;
  color: var(--fh-navy);
  font-weight: 500;
  letter-spacing: 0.025em;
}

.fh-portfolio__change--positive {
  color: var(--fh-sage);
}

.fh-portfolio__change--negative {
  color: var(--fh-burgundy);
}

.fh-portfolio__label {
  font-family: var(--fh-font-body);
  font-size: 0.75rem;
  color: var(--fh-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

---

## 🚨 Utility Classes

### Text Utilities

```css
.fh-text-center {
  text-align: center;
}
.fh-text-muted {
  color: var(--fh-gray-600);
}
.fh-font-serif {
  font-family: var(--fh-font-display);
}
.fh-font-mono {
  font-family: var(--fh-font-mono);
}
.fh-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

### Layout Utilities

```css
.fh-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 var(--fh-space-lg);
}

.fh-prose {
  max-width: 65ch;
  margin: 0 auto;
}

.fh-grid {
  display: grid;
  gap: var(--fh-space-xl);
}

.fh-flex {
  display: flex;
  gap: var(--fh-space-md);
}

.fh-section {
  padding: var(--fh-space-3xl) 0;
}
```

---

## 🎯 Component Examples

### Page Header

```html
<header class="fh-header">
  <div class="fh-container">
    <h1 class="fh-h1">Franklin Hugh Money</h1>
    <p class="fh-subtitle">An Investment in Knowledge</p>
    <nav class="fh-nav">
      <a href="/philosophy">Philosophy</a>
      <a href="/portfolio">Portfolio</a>
      <a href="/quarterly">Quarterly Letters</a>
    </nav>
  </div>
</header>
```

### Portfolio Card

```html
<article class="fh-card">
  <header class="fh-card__header">
    <h3 class="fh-h3">Q4 2024 Performance</h3>
  </header>
  <div class="fh-card__content">
    <div class="fh-portfolio">
      <span class="fh-portfolio__label">Portfolio Value</span>
      <div>$47,832</div>
      <div class="fh-portfolio__change--positive">+3.2%</div>
    </div>
  </div>
</article>
```

### Data Table

```html
<table class="fh-table">
  <thead>
    <tr>
      <th>Asset</th>
      <th>Allocation</th>
      <th>Performance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>VTSAX</td>
      <td>60%</td>
      <td class="fh-table__positive">+12.3%</td>
    </tr>
    <tr>
      <td>VTIAX</td>
      <td>40%</td>
      <td class="fh-table__negative">-2.1%</td>
    </tr>
  </tbody>
</table>
```

---

_Last Updated: 2024-12-05_ _Design System v2.0 - Institutional Edition_
