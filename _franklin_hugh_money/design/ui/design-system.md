# Franklin Hugh Money Design System
## "Building Wealth with Attitude"

---

## 🎨 Color Palette

### Primary Colors
```css
:root {
  /* Core Punk Colors */
  --fh-black: #0A0A0A;        /* Deep Black */
  --fh-white: #FAFAFA;        /* Off White */
  --fh-punk: #00FF00;         /* Neon Green (Primary Action) */

  /* Accent Colors */
  --fh-rebel: #FF1493;        /* Hot Pink (Emphasis) */
  --fh-anarchy: #00FFFF;      /* Electric Blue (Links) */
  --fh-danger: #FF0040;       /* Blood Red (Warnings) */

  /* Grays */
  --fh-gray-900: #1A1A1A;
  --fh-gray-800: #2A2A2A;
  --fh-gray-700: #404040;
  --fh-gray-600: #595959;
  --fh-gray-500: #737373;
  --fh-gray-400: #A3A3A3;
  --fh-gray-300: #D4D4D4;
  --fh-gray-200: #E5E5E5;
  --fh-gray-100: #F5F5F5;
}
```

### Color Usage
- **Background**: Black/Gray-900
- **Text**: White/Gray-100
- **Links**: Anarchy (electric blue)
- **CTAs**: Punk (neon green)
- **Emphasis**: Rebel (hot pink)
- **Warnings**: Danger (blood red)

---

## 📝 Typography

### Font Stack
```css
:root {
  /* Headings - Bold & Aggressive */
  --fh-font-display: 'Bebas Neue', 'Impact', sans-serif;

  /* Body - Clean & Readable */
  --fh-font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Code/Numbers - Monospace */
  --fh-font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

### Type Scale
```css
/* Mobile First */
.fh-h1 { font-size: 2.5rem; line-height: 1.1; }    /* 40px */
.fh-h2 { font-size: 2rem; line-height: 1.2; }      /* 32px */
.fh-h3 { font-size: 1.5rem; line-height: 1.3; }    /* 24px */
.fh-h4 { font-size: 1.25rem; line-height: 1.4; }   /* 20px */
.fh-body { font-size: 1rem; line-height: 1.6; }    /* 16px */
.fh-small { font-size: 0.875rem; line-height: 1.5; } /* 14px */

/* Desktop (min-width: 768px) */
@media (min-width: 768px) {
  .fh-h1 { font-size: 4rem; }     /* 64px */
  .fh-h2 { font-size: 3rem; }     /* 48px */
  .fh-h3 { font-size: 2rem; }     /* 32px */
  .fh-h4 { font-size: 1.5rem; }   /* 24px */
}
```

---

## 📐 Spacing System

### Base Unit: 8px
```css
:root {
  --fh-space-xs: 0.25rem;   /* 4px */
  --fh-space-sm: 0.5rem;    /* 8px */
  --fh-space-md: 1rem;      /* 16px */
  --fh-space-lg: 1.5rem;    /* 24px */
  --fh-space-xl: 2rem;      /* 32px */
  --fh-space-2xl: 3rem;     /* 48px */
  --fh-space-3xl: 4rem;     /* 64px */
  --fh-space-4xl: 6rem;     /* 96px */
}
```

---

## 🎭 Effects & Animations

### Glitch Effect
```css
@keyframes fh-glitch {
  0%, 100% { text-shadow: 2px 2px var(--fh-punk), -2px -2px var(--fh-rebel); }
  25% { text-shadow: -2px 2px var(--fh-anarchy), 2px -2px var(--fh-punk); }
  50% { text-shadow: 2px -2px var(--fh-rebel), -2px 2px var(--fh-anarchy); }
  75% { text-shadow: -2px -2px var(--fh-punk), 2px 2px var(--fh-rebel); }
}

.fh-glitch {
  animation: fh-glitch 0.3s infinite;
}

.fh-glitch-hover:hover {
  animation: fh-glitch 0.3s infinite;
}
```

### Neon Glow
```css
.fh-neon {
  text-shadow:
    0 0 10px var(--fh-punk),
    0 0 20px var(--fh-punk),
    0 0 30px var(--fh-punk),
    0 0 40px var(--fh-punk);
}

.fh-neon-pink {
  text-shadow:
    0 0 10px var(--fh-rebel),
    0 0 20px var(--fh-rebel),
    0 0 30px var(--fh-rebel);
}
```

### Transitions
```css
:root {
  --fh-transition-fast: 150ms ease-in-out;
  --fh-transition-base: 250ms ease-in-out;
  --fh-transition-slow: 350ms ease-in-out;
}
```

---

## 🧩 Components

### Buttons
```css
.fh-btn {
  /* Base */
  padding: var(--fh-space-sm) var(--fh-space-lg);
  font-family: var(--fh-font-display);
  font-size: 1.125rem;
  text-transform: uppercase;
  border: 2px solid currentColor;
  cursor: pointer;
  transition: all var(--fh-transition-fast);
  position: relative;
  overflow: hidden;
}

.fh-btn--primary {
  background: var(--fh-black);
  color: var(--fh-punk);
  border-color: var(--fh-punk);
}

.fh-btn--primary:hover {
  background: var(--fh-punk);
  color: var(--fh-black);
  box-shadow: 0 0 20px var(--fh-punk);
}

.fh-btn--rebel {
  background: var(--fh-black);
  color: var(--fh-rebel);
  border-color: var(--fh-rebel);
}
```

### Cards
```css
.fh-card {
  background: var(--fh-gray-900);
  border: 1px solid var(--fh-gray-800);
  padding: var(--fh-space-lg);
  position: relative;
}

.fh-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--fh-punk);
}

.fh-card--featured {
  border-color: var(--fh-punk);
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
}
```

### Forms
```css
.fh-input {
  background: var(--fh-black);
  border: 2px solid var(--fh-gray-700);
  color: var(--fh-white);
  padding: var(--fh-space-sm) var(--fh-space-md);
  font-family: var(--fh-font-mono);
  transition: all var(--fh-transition-fast);
}

.fh-input:focus {
  outline: none;
  border-color: var(--fh-punk);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}
```

---

## 📱 Breakpoints

```css
/* Mobile First */
:root {
  --fh-screen-sm: 640px;   /* Small devices */
  --fh-screen-md: 768px;   /* Tablets */
  --fh-screen-lg: 1024px;  /* Desktop */
  --fh-screen-xl: 1280px;  /* Large desktop */
  --fh-screen-2xl: 1536px; /* XL desktop */
}

/* Usage */
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
```

---

## 🎪 Special Elements

### ASCII Art Headers
```css
.fh-ascii {
  font-family: var(--fh-font-mono);
  white-space: pre;
  line-height: 1;
  color: var(--fh-punk);
}
```

### Progress Bars
```css
.fh-progress {
  height: 4px;
  background: var(--fh-gray-800);
  position: relative;
  overflow: hidden;
}

.fh-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--fh-punk), var(--fh-anarchy));
  transition: width var(--fh-transition-slow);
}

.fh-progress__glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--fh-punk));
  animation: slide 2s infinite;
}
```

### Data/Money Display
```css
.fh-money {
  font-family: var(--fh-font-mono);
  font-size: 2rem;
  color: var(--fh-punk);
  font-weight: bold;
  letter-spacing: 0.05em;
}

.fh-money::before {
  content: '$';
  opacity: 0.5;
}

.fh-money--large {
  font-size: 3rem;
}
```

---

## 🚨 Utility Classes

### Text Utilities
```css
.fh-uppercase { text-transform: uppercase; }
.fh-bold { font-weight: 700; }
.fh-mono { font-family: var(--fh-font-mono); }
.fh-punk-text { color: var(--fh-punk); }
.fh-rebel-text { color: var(--fh-rebel); }
```

### Layout Utilities
```css
.fh-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--fh-space-md);
}

.fh-grid {
  display: grid;
  gap: var(--fh-space-lg);
}

.fh-flex {
  display: flex;
}

.fh-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 🎯 Component Examples

### Hero Section
```html
<section class="fh-hero">
  <h1 class="fh-h1 fh-glitch-hover">
    FRANKLIN HUGH MONEY
  </h1>
  <p class="fh-tagline fh-neon">
    Building Wealth with a Middle Finger to the Establishment
  </p>
  <button class="fh-btn fh-btn--primary">
    Start Your Journey
  </button>
</section>
```

### Lesson Card
```html
<article class="fh-card fh-card--lesson">
  <header class="fh-card__header">
    <span class="fh-badge">Lesson 01</span>
    <h3 class="fh-h3">Why Your Bank Hates You</h3>
  </header>
  <div class="fh-card__content">
    <p>Traditional banking is designed to keep you poor...</p>
  </div>
  <footer class="fh-card__footer">
    <span class="fh-punk-text">5 min read</span>
    <span class="fh-money">+$1,337</span>
  </footer>
</article>
```

---

*Last Updated: 2024-12-05*
*Design System v1.0*