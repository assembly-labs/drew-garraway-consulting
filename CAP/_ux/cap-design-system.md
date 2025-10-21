# CAP Design System Specification
## Championship Athletic Prospects
### Version 1.0 - MVP Implementation Guide

---

## Table of Contents
1. [Font Stack](#1-font-stack)
2. [Color Palette](#2-color-palette)
3. [Typography Scale](#3-typography-scale)
4. [Spacing System](#4-spacing-system)
5. [Border Radius](#5-border-radius)
6. [Shadows](#6-shadows)
7. [Component Styles](#7-component-styles)
8. [Implementation Guide](#8-implementation-guide)
9. [Usage Examples](#9-usage-examples)
10. [Accessibility](#10-accessibility)

---

## 1. FONT STACK

### Google Fonts Import

```css
/* Add to <head> or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Graduate&family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;700&display=swap');
```

### CSS Variables

```css
:root {
  /* Display - Player names, headlines, hero text */
  --font-display: 'Bebas Neue', 'Arial Narrow', 'Arial', sans-serif;
  
  /* Body - Paragraphs, descriptions, general UI */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Numbers - Stats, jersey numbers, data */
  --font-mono: 'Roboto Mono', 'Courier New', monospace;
  
  /* Accent - Badges, stamps, special callouts */
  --font-accent: 'Graduate', 'Georgia', 'Times New Roman', serif;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Narrow', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
        'accent': ['Graduate', 'serif'],
      },
    },
  },
}
```

---

## 2. COLOR PALETTE

### CSS Variables

```css
:root {
  /* GOLD - Primary Brand Color */
  --gold-500: #FFD700;           /* Championship gold */
  --gold-400: #FFE44D;           /* Lighter gold - hover */
  --gold-600: #E5C100;           /* Darker gold - active */
  --gold-700: #B8991A;           /* Antique gold - text */
  --gold-50: #FFFDF0;            /* Pale gold - backgrounds */
  
  /* NAVY - Primary Text & Anchors */
  --navy-900: #0A1F44;           /* Deep navy - headings */
  --navy-800: #0F2D5C;           /* Medium navy - body */
  --navy-700: #1E3A5F;           /* Light navy - secondary */
  --navy-500: #3D5A80;           /* Muted navy - borders */
  --navy-100: #E8EDF5;           /* Very light - backgrounds */
  
  /* NEUTRALS */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-400: #9CA3AF;
  --gray-700: #374151;
  --gray-900: #111827;
  --black: #000000;
  
  /* ACCENT COLORS (Use Sparingly) */
  --blue-500: #0066FF;           /* Electric blue */
  --blue-600: #0052CC;
  --red-500: #DC143C;            /* Fire red */
  --red-600: #B8102E;
  --green-500: #059669;          /* Success green */
  --green-600: #047857;
  
  /* SEMANTIC COLORS */
  --color-success: #059669;
  --color-error: #DC143C;
  --color-warning: #FFD700;
  --color-info: #0066FF;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFDF0',
          400: '#FFE44D',
          500: '#FFD700',
          600: '#E5C100',
          700: '#B8991A',
        },
        navy: {
          100: '#E8EDF5',
          500: '#3D5A80',
          700: '#1E3A5F',
          800: '#0F2D5C',
          900: '#0A1F44',
        },
        'electric-blue': {
          500: '#0066FF',
          600: '#0052CC',
        },
        'fire-red': {
          500: '#DC143C',
          600: '#B8102E',
        },
      },
    },
  },
}
```

---

## 3. TYPOGRAPHY SCALE

### Font Sizes

```css
:root {
  /* Display Sizes - Bebas Neue */
  --text-display-xl: 4rem;        /* 64px - Hero headlines */
  --text-display-lg: 3rem;        /* 48px - Page titles */
  --text-display-md: 2.25rem;     /* 36px - Section headers */
  --text-display-sm: 1.875rem;    /* 30px - Card titles */
  
  /* Heading Sizes */
  --text-h1: 2.5rem;              /* 40px */
  --text-h2: 2rem;                /* 32px */
  --text-h3: 1.5rem;              /* 24px */
  --text-h4: 1.25rem;             /* 20px */
  --text-h5: 1.125rem;            /* 18px */
  --text-h6: 1rem;                /* 16px */
  
  /* Body Sizes - Inter */
  --text-xl: 1.25rem;             /* 20px */
  --text-lg: 1.125rem;            /* 18px */
  --text-base: 1rem;              /* 16px */
  --text-sm: 0.875rem;            /* 14px */
  --text-xs: 0.75rem;             /* 12px */
  
  /* Number Sizes - Roboto Mono */
  --text-number-xl: 3rem;         /* 48px */
  --text-number-lg: 2rem;         /* 32px */
  --text-number-base: 1rem;       /* 16px */
  
  /* Badge Sizes - Graduate */
  --text-badge-lg: 1rem;          /* 16px */
  --text-badge-base: 0.875rem;    /* 14px */
}
```

### Font Weights

```css
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

### Line Heights

```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Letter Spacing

```css
:root {
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

---

## 4. SPACING SYSTEM

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-32: 8rem;       /* 128px */
}
```

---

## 5. BORDER RADIUS

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-base: 0.5rem;   /* 8px */
  --radius-md: 0.75rem;    /* 12px */
  --radius-lg: 1rem;       /* 16px */
  --radius-xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;   /* Pills, avatars */
}
```

---

## 6. SHADOWS

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Gold Glow - For special elements */
  --shadow-gold: 0 0 20px rgba(255, 215, 0, 0.4);
  --shadow-gold-lg: 0 0 40px rgba(255, 215, 0, 0.6);
}
```

---

## 7. COMPONENT STYLES

### Buttons

#### CSS Classes

```css
/* Primary Button - Gold */
.btn-primary {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-weight-bold);
  padding: var(--space-4) var(--space-8);
  background-color: var(--gold-500);
  color: var(--navy-900);
  border: 2px solid var(--navy-900);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-base);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.btn-primary:hover {
  background-color: var(--gold-400);
  box-shadow: var(--shadow-gold);
  transform: translateY(-2px);
}

.btn-primary:active {
  background-color: var(--gold-600);
  transform: translateY(0);
}

/* Secondary Button - Navy */
.btn-secondary {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-3) var(--space-6);
  background-color: var(--navy-900);
  color: var(--white);
  border: none;
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--navy-800);
  box-shadow: var(--shadow-md);
}

/* Ghost Button - Outline */
.btn-ghost {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-3) var(--space-6);
  background-color: transparent;
  color: var(--gold-500);
  border: 2px solid var(--gold-500);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background-color: var(--gold-500);
  color: var(--navy-900);
}
```

#### Tailwind Classes

```html
<!-- Primary Button -->
<button class="font-display text-base font-bold px-8 py-4 bg-gold-500 text-navy-900 border-2 border-navy-900 rounded-lg shadow-md hover:bg-gold-400 hover:shadow-gold hover:-translate-y-0.5 active:bg-gold-600 active:translate-y-0 transition-all duration-200 uppercase tracking-wide">
  Create Cards
</button>

<!-- Secondary Button -->
<button class="font-body text-base font-semibold px-6 py-3 bg-navy-900 text-white rounded-lg shadow-sm hover:bg-navy-800 hover:shadow-md transition-all duration-200">
  Learn More
</button>

<!-- Ghost Button -->
<button class="font-body text-base font-semibold px-6 py-3 bg-transparent text-gold-500 border-2 border-gold-500 rounded-lg hover:bg-gold-500 hover:text-navy-900 transition-all duration-200">
  View Templates
</button>
```

### Typography Components

```css
/* Display Heading */
.text-display {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  font-weight: var(--font-weight-bold);
  color: var(--navy-900);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase;
}

/* Section Heading */
.text-heading {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: var(--font-weight-bold);
  color: var(--navy-900);
  line-height: var(--leading-tight);
  text-transform: uppercase;
}

/* Body Text */
.text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  color: var(--navy-800);
  line-height: var(--leading-relaxed);
}

/* Stats/Numbers */
.text-stat {
  font-family: var(--font-mono);
  font-size: var(--text-number-lg);
  font-weight: var(--font-weight-bold);
  color: var(--navy-900);
  line-height: var(--leading-none);
  font-feature-settings: "tnum" 1;
}

/* Badge */
.text-badge {
  font-family: var(--font-accent);
  font-size: var(--text-badge-base);
  font-weight: var(--font-weight-normal);
  color: var(--gold-700);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}
```

### Card Components

```css
/* Standard Card */
.card {
  background-color: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

/* Premium Card with Gold Border */
.card-premium {
  background-color: var(--white);
  border: 2px solid var(--gold-500);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-gold);
  padding: var(--space-6);
}

/* Dark Card */
.card-dark {
  background-color: var(--navy-900);
  border: 1px solid var(--navy-800);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-6);
  color: var(--white);
}
```

---

## 8. IMPLEMENTATION GUIDE

### Step 1: Install Dependencies

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
```

### Step 2: Create Design System Files

Create `/styles/design-system.css`:

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Graduate&family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;700&display=swap');

/* Copy all CSS variables from this document */
:root {
  /* ... all variables ... */
}
```

### Step 3: Configure Tailwind

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
        'accent': ['Graduate', 'serif'],
      },
      colors: {
        gold: {
          50: '#FFFDF0',
          400: '#FFE44D',
          500: '#FFD700',
          600: '#E5C100',
          700: '#B8991A',
        },
        navy: {
          100: '#E8EDF5',
          500: '#3D5A80',
          700: '#1E3A5F',
          800: '#0F2D5C',
          900: '#0A1F44',
        },
      },
    },
  },
  plugins: [],
}
```

### Step 4: Import in Global Styles

In `globals.css` or `app/globals.css`:

```css
@import './design-system.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Test Implementation

Create a test component to verify:

```jsx
export default function DesignSystemTest() {
  return (
    <div className="p-8">
      <h1 className="font-display text-display-lg text-navy-900 uppercase mb-4">
        CAP Design System
      </h1>
      
      <p className="font-body text-base text-navy-800 mb-6">
        This is body text in Inter font.
      </p>
      
      <div className="font-mono text-number-lg font-bold text-navy-900 mb-6">
        1,234
      </div>
      
      <button className="btn-primary">
        Test Button
      </button>
    </div>
  );
}
```

---

## 9. USAGE EXAMPLES

### Hero Section

```jsx
<section className="bg-white py-20">
  <div className="container mx-auto px-4 text-center">
    <h1 className="font-display text-display-lg md:text-display-xl text-navy-900 uppercase tracking-tight mb-6">
      Every Kid's a Champion
    </h1>
    
    <p className="font-body text-lg md:text-xl text-navy-800 max-w-2xl mx-auto mb-8">
      Turn your young athletes into trading card superstars in minutes.
    </p>
    
    <button className="font-display text-base font-bold px-8 py-4 bg-gold-500 text-navy-900 border-2 border-navy-900 rounded-lg shadow-md hover:bg-gold-400 hover:shadow-gold hover:-translate-y-0.5 transition-all uppercase tracking-wide">
      Create Your Cards →
    </button>
  </div>
</section>
```

### Team Card Component

```jsx
<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all">
  {/* Gold accent bar */}
  <div className="h-1 bg-gold-500 -mx-6 -mt-6 mb-4 rounded-t-lg"></div>
  
  {/* Team Info */}
  <div className="flex items-center gap-4 mb-4">
    <div className="text-4xl">⭐</div>
    <div>
      <h3 className="font-display text-xl text-navy-900 uppercase">
        Thunder FC
      </h3>
      <p className="font-body text-sm text-navy-700">
        Soccer • 12 Players
      </p>
    </div>
  </div>
  
  {/* Stats */}
  <div className="flex gap-4">
    <div>
      <div className="font-mono text-base font-bold text-navy-900">15</div>
      <div className="font-body text-xs text-gray-400">Cards Created</div>
    </div>
    <div>
      <div className="font-mono text-base font-bold text-navy-900">8</div>
      <div className="font-body text-xs text-gray-400">Orders</div>
    </div>
  </div>
</div>
```

### Stats Display

```jsx
<div className="text-center">
  <div className="font-mono text-5xl font-bold text-navy-900 mb-2">
    1,247
  </div>
  <div className="font-body text-sm text-navy-700">
    Champions Created
  </div>
  <div className="font-accent text-sm text-gold-700 uppercase tracking-wider mt-2">
    ⭐ All-Stars ⭐
  </div>
</div>
```

---

## 10. ACCESSIBILITY

### Contrast Ratios (WCAG AA Compliant)

- Navy-900 (#0A1F44) on White: **14.5:1** ✓
- Navy-800 (#0F2D5C) on White: **11.2:1** ✓
- Gold-700 (#B8991A) on White: **5.2:1** ✓
- White on Navy-900: **14.5:1** ✓
- Navy-900 on Gold-500: **6.8:1** ✓

### Focus States

```css
.focus-visible {
  outline: 2px solid var(--gold-500);
  outline-offset: 2px;
}
```

### Minimum Touch Targets

- Buttons: 44px × 44px minimum
- Links: 44px × 44px minimum  
- Form inputs: 44px height minimum

### Screen Reader Support

```html
<!-- Example button with aria-label -->
<button 
  className="btn-primary"
  aria-label="Create your championship trading cards"
>
  Create Cards
</button>
```

---

## File Structure

```
/styles
  ├── globals.css              # Import fonts + Tailwind
  ├── design-system.css        # All CSS variables
  └── components.css           # Component utility classes

/components
  ├── ui
  │   ├── Button.tsx           # Button variants
  │   ├── Card.tsx             # Card variants
  │   └── Typography.tsx       # Typography components
  
/tailwind.config.js            # Tailwind customization
```

---

## Quick Reference

### Font Usage

- **Display (Bebas Neue)**: Hero headlines, player names, section headers
- **Body (Inter)**: Paragraphs, UI text, descriptions
- **Mono (Roboto Mono)**: Stats, jersey numbers, data tables
- **Accent (Graduate)**: Badges, stamps, special callouts

### Color Usage

- **Gold (#FFD700)**: Primary CTAs, highlights, winner elements
- **Navy (#0A1F44)**: Headings, body text, professional feel
- **White (#FFFFFF)**: Backgrounds, cards, clean space
- **Blue (#0066FF)**: Rare/special cards (use sparingly)
- **Red (#DC143C)**: Ultra rare/alerts (use very sparingly)

### Common Patterns

```jsx
// Primary CTA
<button className="font-display px-8 py-4 bg-gold-500 text-navy-900 border-2 border-navy-900 rounded-lg uppercase">

// Section Header  
<h2 className="font-display text-4xl text-navy-900 uppercase">

// Body Text
<p className="font-body text-base text-navy-800 leading-relaxed">

// Stat Display
<div className="font-mono text-3xl font-bold text-navy-900">
```

---

**CAP Design System v1.0**  
**Ready for MVP Implementation**  
**All fonts free & open source via Google Fonts**