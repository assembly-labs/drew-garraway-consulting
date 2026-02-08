# Gather Brand Guide — Complete Reference for Development

> **Purpose:** Single-source-of-truth for all design, voice, and implementation decisions across the Gather platform. Reference this file when building any UI, writing any copy, or making any product decision.

---

## 1. Brand Identity

### Tagline
**Good things from good people.**

### Philosophy
Gather exists to make it easier for neighbors to take care of each other through local food. We believe you deserve to know what's in your food and who grew it. No mystery ingredients. No corporate shareholders. Just good people making good things for their neighbors.

### Core Values
| Value | Expression |
|---|---|
| **You're special just the way you are** | Every farmer, maker, and shopper matters. Their craft matters. Their choice to shop local matters. |
| **Neighbors taking care of neighbors** | Choosing each other over corporations. Quiet, powerful, happening every weekend at market. |
| **Knowing is caring** | When you know who grew your tomatoes, you know they're not covered in stuff that hurts our streams. |
| **The gentle revolution** | Every time someone chooses the farmer down the road over the supermarket chain, that's the revolution. Quiet, steady, powerful. |

### Brand Personality: "Mr. Rogers with a farmers market booth"
- Warm, welcoming, affirming
- Polite rebels — not angry, just not participating in systems that hurt neighbors and land
- Building something better, one tomato at a time
- Your neighbor who grows their own food and shares the extras
- A friend who knows corporate food is weird and local food is normal

---

## 2. Voice & Tone

### How We Sound

**Warm and personal.** We talk to people like neighbors, not customers. First person plural ("we"), second person ("you"), specific and concrete.

**Gently rebellious.** We don't shout. We state simple truths that implicitly contrast with industrial food without attacking anyone directly.

**Affirming.** We tell people they're doing something good by choosing local. We celebrate the farmer, the maker, the shopper.

### Voice Do's and Don'ts

| Do | Don't |
|---|---|
| "Real food from real neighbors" | "Leveraging synergies in local food ecosystems" |
| "You deserve to know what's in your food" | "Our platform enables supply chain transparency" |
| "Good things don't need 37 ingredients" | "We optimize ingredient simplicity metrics" |
| Use contractions (you're, it's, that's) | Sound corporate or stiff |
| Reference specific, tangible things (tomatoes, streams, Saturday mornings) | Use abstract marketing language |
| Acknowledge the reader's goodness | Be preachy or lecture |

### Tone by Audience

**Market Managers — "You're the neighborhood helper"**
- Affirm their mission: "You're creating a place where neighbors take care of each other"
- Acknowledge their burden: "Let us handle the paperwork so you can keep building this good thing"
- Key messages: "You make the neighborhood better," "Building something corporations can't buy"

**Vendors/Farmers — "You're the real deal"**
- Respect their choice: "You could have chosen the easy path. But you didn't."
- Practical support: "Your good work deserves good support"
- Key messages: "You're feeding neighbors, not shareholders," "No middlemen, no nonsense"

**Customers/Shoppers — "You're making the neighborhood better"**
- Celebrate their choice: "You're saying no to food that traveled 1,500 miles and yes to food from 5 miles away"
- Key messages: "You deserve to know who grew your food," "Every purchase is a small act of rebellion (the gentle kind)"

### The Gentle Rebellion — What We Stand Against (Softly)

We say: → We mean:
- "Food with ingredients you can pronounce" → No mystery chemicals
- "Grown in ways that help our water stay clean" → No pesticides poisoning waterways
- "Actually local, not 'locally sourced'" → Not corporate greenwashing
- "Where farmers earn fair prices" → Not systems that make farmers broke and CEOs rich
- "Good things cost what they cost" → Cheap isn't more important than clean

### The Ingredient Test
When talking about food: "Bread with 5 ingredients, not 45." "You can pronounce everything in it." "Made by people, not factories."

### Handling Objections
- **"Is this anti-corporate?"** → "We're not anti-anything. We're pro-neighbor."
- **"Sounds political"** → "Choosing to support your neighbors isn't political. It's just being a good neighbor."
- **"Why does local matter?"** → "Because Tom's tomatoes shouldn't travel 1,500 miles when Tom lives 5 miles away."

---

## 3. Copy Templates

### Website Hero
```
Gather
Good things from good people

You know what's nice? Knowing where your food comes from.
Not some factory. Not some corporation. From neighbors who care
about good soil and clean water.

Browse what's fresh. Reserve your favorites. Pick up Saturday.
Support the gentle revolution.

Won't you be our neighbor?
```

### Email Template
```
Subject: Hello, neighbor

You're special. You know that?

You chose to support neighbors over corporations. To care about
where your food comes from. To believe that good things are worth
a little extra effort.

Gather makes that effort easier. See what your neighbors are growing.
Reserve the good stuff. Pick up Saturday.

No mystery ingredients. No corporate middlemen.
Just good food from good people.

Won't you join us?
```

### Social Post Examples

Gentle:
- "It's a beautiful day to buy carrots from your neighbor"
- "Good things grown by good people who live nearby"

With edge:
- "Your tomatoes shouldn't need a passport"
- "Ingredients: strawberries. That's it. That's the list."
- "Know your farmer > mystery supply chains"

Both:
- "Mr. Rogers would definitely shop at farmers markets"
- "Be the neighbor who supports neighbors, not corporations"

---

## 4. Design System — Foundation

### Three Experiences, One System

```
Manager Dashboard  → Notion-clean, data-dense, keyboard-first
Consumer Marketplace → Instacart-fresh, image-forward, thumb-first
Vendor Portal      → WhatsApp-simple, big-touch, offline-first
```

### Target Users

| Role | Age | Profile | Tech Reference | Core Need |
|---|---|---|---|---|
| **Manager** (primary) | 25–40 | Millennial small business owners | Square, Stripe, Shopify, Notion | Professional tools that save time |
| **Consumer** (secondary) | 25–44 | Affluent millennials, $96K+ HHI | Instacart, DoorDash | Convenience without losing freshness |
| **Vendor** (tertiary) | 35–65 | Small farmers, limited tech | Square, WhatsApp Business | Simple, reliable, works offline |

---

## 5. Color System

### Core Palette

```css
/* Primary Greens — From deep earth to fresh growth */
--sage-900: #1C3A13;
--sage-800: #234116;
--sage-700: #2D5016;   /* Primary action color for dashboard */
--sage-600: #3A6A1F;
--sage-500: #4A7C28;   /* Primary accent */
--sage-400: #66A043;
--sage-300: #81C784;
--sage-200: #A5D6A7;
--sage-100: #C8E6C9;
--sage-50:  #E8F5E9;

/* Golden Hour — Sunshine and warmth */
--gold-900: #E65100;
--gold-800: #EF6C00;
--gold-700: #F57C00;
--gold-600: #FB8C00;
--gold-500: #FF9800;
--gold-400: #FFA726;
--gold-300: #FFB74D;
--gold-200: #FFCC80;
--gold-100: #FFE082;
--gold-50:  #FFF9C4;

/* Supporting / Semantic */
--mint-500:         #3DDC97;   /* Success */
--coral-500:        #FF6B6B;   /* Error / Urgent */
--honey-500:        #FFD93D;   /* Warning */
--sky-500:          #4ECDC4;   /* Info */
--snap-blue:        #0077BE;   /* SNAP/EBT official */
--organic-green:    #6B8E23;   /* USDA Organic badge */
```

### Gradients

```css
/* Morning Market — Fresh starts (hero backgrounds, loading states) */
--gradient-dawn: linear-gradient(135deg, #F6F9FC 0%, #E8F5E9 50%, #FFF9C4 100%);

/* Golden Hour — Peak market energy (CTA buttons, highlights) */
--gradient-golden: linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%);
--gradient-golden-vivid: linear-gradient(135deg, #FFD54F 0%, #66BB6A 50%, #43A047 100%);
--gradient-golden-soft: linear-gradient(120deg, #FFF59D 0%, #A5D6A7 50%, #81C784 100%);

/* Harvest Sun — Abundance */
--gradient-harvest: linear-gradient(135deg, #FFCC80 0%, #FFB74D 25%, #81C784 75%, #66BB6A 100%);

/* Field Fresh — Pure green (logos, brand marks) */
--gradient-field: linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%);
--gradient-field-light: linear-gradient(135deg, #A5D6A7 0%, #81C784 50%, #66BB6A 100%);

/* Sunshine — Pure warmth (badges, highlights) */
--gradient-sunshine: linear-gradient(135deg, #FFF176 0%, #FFD54F 50%, #FFB300 100%);

/* Meadow — Natural */
--gradient-meadow: linear-gradient(160deg, #C5E1A5 0%, #9CCC65 30%, #7CB342 60%, #558B2F 100%);

/* Citrus — Energy (vendor success states) */
--gradient-citrus: linear-gradient(135deg, #FFF9C4 0%, #F9FBE7 25%, #C5E1A5 75%, #AED581 100%);
```

### Layer-Specific Palettes

```css
/* Manager Dashboard — Notion-inspired, neutral + sage accent */
--dash-bg:      #FFFFFF;
--dash-sidebar:  #FBFBFA;
--dash-border:   #E3E2E0;
--dash-hover:    #F7F6F3;
--dash-text:     #37352F;
--dash-muted:    #787774;
--dash-accent:   var(--sage-500);

/* Consumer Marketplace — Warm cream base */
--market-bg:     #FFFEF7;
--market-card:   #FFFFFF;
--market-accent: var(--sage-500);
--market-price:  var(--sage-700);
--market-fresh:  var(--mint-500);

/* Vendor Portal — High contrast for outdoor/field use */
--vendor-bg:       #FFFFFF;
--vendor-primary:  var(--sage-700);
--vendor-success:  #00A86B;
--vendor-text:     #000000;
--vendor-disabled: #CCCCCC;
```

---

## 6. Typography

### Font Stacks

```css
/* Manager Dashboard — Clean professional */
--font-dash: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Consumer Marketplace — Friendly readable */
--font-market: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

/* Vendor Portal — System native (fastest load, most familiar) */
--font-vendor: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace for data tables, codes, metrics */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
```

### Type Scales

**Manager Dashboard — Dense data display**

| Token | Size | Use |
|---|---|---|
| `--text-display` | 30px / 1.875rem | Page titles, big metrics |
| `--text-title` | 20px / 1.25rem | Section headers, card titles |
| `--text-body` | 14px / 0.875rem | Default body text |
| `--text-label` | 12px / 0.75rem | Form labels, table headers |
| `--text-micro` | 11px / 0.6875rem | Timestamps, metadata |

**Consumer Marketplace — Comfortable reading**

| Token | Size | Use |
|---|---|---|
| `--text-hero` | 40px / 2.5rem | Landing page hero |
| `--text-display` | 32px / 2rem | Section headlines |
| `--text-title` | 24px / 1.5rem | Card titles, product names |
| `--text-body` | 16px / 1rem | Default body text |
| `--text-small` | 14px / 0.875rem | Secondary info, vendor names |
| `--text-micro` | 12px / 0.75rem | Badges, labels |

**Vendor Portal — Large touch-friendly**

| Token | Size | Use |
|---|---|---|
| `--text-title` | 20px / 1.25rem | Screen titles |
| `--text-body` | 18px / 1.125rem | Default body, list items |
| `--text-button` | 16px / 1rem | Button labels |
| `--text-small` | 14px / 0.875rem | Helper text |

### Font Weights

```
--weight-normal:   400
--weight-medium:   500
--weight-semibold: 600
--weight-bold:     700
```

### Line Heights

```
--leading-tight:   1.25–1.3   (headings)
--leading-normal:  1.5–1.6    (body text)
--leading-relaxed: 1.75       (marketplace long-form)
```

---

## 7. Spacing & Layout

### Base Scale (4px unit)

```css
--space-0:  0;
--space-1:  0.25rem;   /*  4px */
--space-2:  0.5rem;    /*  8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-7:  1.75rem;   /* 28px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

### Layout Containers

| Context | Max Width | Notes |
|---|---|---|
| Dashboard | 1440px | Dense data, full width sidebar |
| Marketplace | 1200px | Comfortable product browsing |
| Vendor Portal | 600px | Single-column mobile-first |

### Breakpoints (Mobile First)

```css
--screen-xs:  475px;   /* Large phones */
--screen-sm:  640px;   /* Small tablets */
--screen-md:  768px;   /* Tablets */
--screen-lg:  1024px;  /* Desktop */
--screen-xl:  1280px;  /* Large desktop */
--screen-2xl: 1536px;  /* Wide monitors */
```

### Product Grid

```css
/* Auto-fill responsive grid */
.product-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
```

---

## 8. Borders, Shadows & Radii

### Border Radius

```css
--radius-none: 0;
--radius-xs:   2px;
--radius-sm:   4px;    /* Inputs, small elements */
--radius-md:   8px;    /* Cards, buttons, modals */
--radius-lg:   12px;   /* Product cards, large panels */
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-full: 9999px; /* Pills, search bars, avatars */
```

### Shadows

```css
--shadow-xs:    0 1px 2px 0 rgba(0,0,0,0.05);
--shadow-sm:    0 2px 4px -1px rgba(0,0,0,0.06);
--shadow-md:    0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg:    0 10px 15px -3px rgba(0,0,0,0.1);
--shadow-xl:    0 20px 25px -5px rgba(0,0,0,0.1);
--shadow-2xl:   0 25px 50px -12px rgba(0,0,0,0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.06);
```

---

## 9. Component Specifications

### 9.1 Buttons

**Base requirements:** All buttons must meet 44px minimum touch target. Use `min-height: 44px` (dashboard/marketplace) or `min-height: 56px` (vendor portal).

**Dashboard Buttons**

| Variant | Background | Color | Border | Use |
|---|---|---|---|---|
| Primary | `--sage-700` | white | none | Save, Submit, Confirm |
| Secondary | white | `--sage-700` | `1px solid --dash-border` | Cancel, Back, Alternative action |
| Ghost | transparent | `--dash-text` | none | Inline actions, less emphasis |

Hover: `translateY(-1px)` + `--shadow-md`. Active: `scale(0.98)`.

**Marketplace Buttons**

| Variant | Background | Use |
|---|---|---|
| Primary CTA | `--gradient-golden` | Browse, Shop Now, Checkout |
| Add to Cart | `--mint-500` | Product cards, quick add |

Primary gets `box-shadow: 0 4px 20px rgba(255, 183, 77, 0.3)`.

**Vendor Buttons**

| Variant | Background | Min Height | Use |
|---|---|---|---|
| Primary | `--vendor-success` (#00A86B) | 56px | Accept Order, Mark Complete |
| Secondary | white + `2px solid --vendor-primary` | 56px | Reject, Secondary actions |

**Button States (all platforms)**
```
Default → Hover (lift/glow) → Active (scale down) → Focus (ring) → Disabled (0.5 opacity) → Loading (spinner)
```

Loading state: text becomes transparent, centered 20px spinner appears.

### 9.2 Form Inputs

| Platform | Padding | Min Height | Border | Focus Ring |
|---|---|---|---|---|
| Dashboard | `8px 12px` | 36px | `1px solid --dash-border` | `0 0 0 3px rgba(74,124,40,0.1)` |
| Marketplace | `12px 16px` | 48px | `2px solid transparent` + shadow | `0 0 0 4px rgba(129,199,132,0.1)` |
| Vendor | `16px` | 56px | `2px solid --dash-border` | Solid `--vendor-primary` border |

**Input States:** Default → Focus (sage border) → Valid (mint border) → Invalid (coral border) → Disabled (muted background)

### 9.3 Cards

**Dashboard Card:** White background, `1px solid --dash-border`, `--radius-md`, `--space-5` padding. Metric cards show large number in `--sage-700` with uppercase `--text-label` above.

**Product Card (Marketplace):**
- `--radius-lg`, `--shadow-sm`, white background
- Image: `aspect-ratio: 4/3`, `object-fit: cover`
- Badge: absolute top-left, `--gradient-sunshine` background, uppercase micro text
- Vendor name in `--dash-muted`, product name in `--text-body` semibold
- Price in `--sage-700` bold, unit in `--dash-muted`
- Hover: `translateY(-2px)` + `--shadow-md`

**Vendor Order Card:**
- `2px solid --dash-border`, `--radius-lg`
- Urgent state: coral border + pink gradient background
- Complete state: success border + citrus gradient background
- Action buttons in 2-column grid

### 9.4 Navigation

**Dashboard Sidebar:**
- 240px wide, `--dash-sidebar` background, full height
- Logo uses `--gradient-field` with background-clip text
- Nav items: `--radius-md`, `--space-2` vertical padding
- Active: white background + `--shadow-sm` + `--sage-700` text
- Hover: `--dash-hover` background

**Marketplace Header:**
- Sticky top, white with `backdrop-filter: blur(10px)`
- Search bar: `--radius-full`, `--dash-hover` background, expands on focus
- Search icon positioned left at `--space-4`

**Vendor Bottom Nav:**
- Fixed bottom, white, `border-top: 1px solid --dash-border`
- Items: flex column, icon (24px) + micro label
- Active: `--vendor-primary` color

### 9.5 Tables (Dashboard)

- White background, `1px solid --dash-border`, `--radius-md`
- Header: `--dash-sidebar` background, uppercase `--text-label`, `--dash-muted` color
- Rows: `--dash-border` bottom border, hover `--dash-hover`
- Body: max-height 400px with overflow scroll
- Cells: `--space-3` vertical + `--space-4` horizontal padding

### 9.6 Modals

- Overlay: `rgba(0,0,0,0.5)` + `backdrop-filter: blur(4px)`
- Modal: white, `--radius-lg`, max-width 500px, `--shadow-2xl`
- Header/footer separated by `--dash-border`
- Footer buttons right-aligned with `--space-3` gap

### 9.7 Toast Notifications

- Fixed bottom-right, white, `--radius-md`, `--shadow-lg`
- 4px left border colored by type: mint (success), coral (error), honey (warning)
- Slides up on appear with 300ms animation
- Max width 400px

### 9.8 Loading States

**Skeleton loaders:** Animated shimmer gradient sweeping left-to-right, 1.5s cycle. Dashboard uses neutral colors, marketplace uses green-tinted gradient.

**Spinners:** 40px circle spinner with `--sage-500` top border, or 3-dot pulse animation.

**Empty states:** Centered layout with large faded icon, title, description (max-width 400px), and CTA button.

---

## 10. Animation & Motion

```css
/* Durations */
--duration-fast:   150ms;
--duration-base:   200ms;
--duration-slow:   300ms;
--duration-slower:  500ms;

/* Easings */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

**Standard interactions:**
- `hover-lift`: `translateY(-2px)` on hover
- `hover-scale`: `scale(1.02)` on hover
- `hover-glow`: `box-shadow: 0 0 20px rgba(129,199,132,0.3)` on hover

**Reduced motion:** Respect `prefers-reduced-motion: reduce` — collapse all animations to 0.01ms.

---

## 11. Icons

Use **Lucide React** for all icons. Key icon sets by function:

| Category | Icons |
|---|---|
| Navigation | Home, Store, Users, ShoppingBag, Calendar, Settings, Menu, X, Chevrons |
| Actions | Plus, Edit2, Trash2, Save, Search, Filter, Download, Upload, Share2 |
| Status | CheckCircle, XCircle, AlertTriangle, Info, Clock, TrendingUp/Down |
| Commerce | CreditCard, DollarSign, Receipt, Package, Truck |
| Communication | Mail, Phone, MessageCircle, Bell, Send |

**Sizes:** xs=16px, sm=20px, md=24px, lg=32px, xl=48px

---

## 12. Accessibility

### Focus States
- Keyboard: `outline: 2px solid --sage-500; outline-offset: 2px` on `:focus-visible`
- Mouse: no outline on `:focus:not(:focus-visible)`

### Screen Reader
- Use `.sr-only` class for visually hidden labels
- All interactive elements need accessible names
- All images need alt text

### Touch Targets
- Dashboard/Marketplace: 44px minimum
- Vendor Portal: 56px minimum

### Color Contrast
- All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- `--dash-text` (#37352F) on white = 12.6:1
- `--sage-700` (#2D5016) on white = 9.8:1

---

## 13. Platform-Specific Guidelines

### Manager Dashboard
- Dense information display — minimize whitespace, maximize data density
- Keyboard shortcuts (Cmd+K for search)
- Batch actions on tables (select multiple → bulk action)
- Export functionality always visible
- Professional neutral palette with sage accents
- Font: Inter at 14px body

### Consumer Marketplace
- Image-first design — product photos dominate
- One-thumb reachability on mobile
- Instant add-to-cart without page navigation
- Visual freshness cues (green badges, "harvested today" labels)
- Warm appetizing colors — cream background, golden accents
- Font: DM Sans at 16px body

### Vendor Portal
- Huge touch targets — 56px minimum button height
- High contrast text — black on white
- Offline-first indicators (sync status, queued actions)
- Simple binary choices — Accept/Reject, Yes/No
- Success celebration animations (checkmark, confetti)
- Font: System native at 18px body

---

## 14. CSS Reset & Base Styles

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-dash);
  color: var(--dash-text);
  background: var(--dash-bg);
  line-height: 1.5;
}

img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

button, input, select, textarea {
  font: inherit;
}
```

---

## 15. Design Tokens (JSON)

```json
{
  "color": {
    "sage": {
      "50": "#E8F5E9", "100": "#C8E6C9", "200": "#A5D6A7",
      "300": "#81C784", "400": "#66A043", "500": "#4A7C28",
      "600": "#3A6A1F", "700": "#2D5016", "800": "#234116", "900": "#1C3A13"
    },
    "gold": {
      "50": "#FFF9C4", "100": "#FFE082", "200": "#FFCC80",
      "300": "#FFB74D", "400": "#FFA726", "500": "#FF9800",
      "600": "#FB8C00", "700": "#F57C00", "800": "#EF6C00", "900": "#E65100"
    },
    "semantic": {
      "success": "#3DDC97",
      "error": "#FF6B6B",
      "warning": "#FFD93D",
      "info": "#4ECDC4"
    }
  },
  "gradient": {
    "golden": "linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%)",
    "field": "linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%)",
    "dawn": "linear-gradient(135deg, #F6F9FC 0%, #E8F5E9 50%, #FFF9C4 100%)",
    "sunshine": "linear-gradient(135deg, #FFF176 0%, #FFD54F 50%, #FFB300 100%)"
  },
  "space": {
    "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem",
    "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem",
    "12": "3rem", "16": "4rem", "20": "5rem"
  },
  "radius": {
    "xs": "2px", "sm": "4px", "md": "8px", "lg": "12px",
    "xl": "16px", "2xl": "24px", "full": "9999px"
  },
  "font": {
    "dashboard": "'Inter', system-ui, sans-serif",
    "marketplace": "'DM Sans', system-ui, sans-serif",
    "vendor": "system-ui, sans-serif",
    "mono": "'JetBrains Mono', 'SF Mono', monospace"
  }
}
```

---

## 16. Tailwind Config Extension

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#E8F5E9', 100: '#C8E6C9', 200: '#A5D6A7',
          300: '#81C784', 400: '#66A043', 500: '#4A7C28',
          600: '#3A6A1F', 700: '#2D5016', 800: '#234116', 900: '#1C3A13'
        },
        gold: {
          50: '#FFF9C4', 100: '#FFE082', 200: '#FFCC80',
          300: '#FFB74D', 400: '#FFA726', 500: '#FF9800',
          600: '#FB8C00', 700: '#F57C00', 800: '#EF6C00', 900: '#E65100'
        },
        mint: { 500: '#3DDC97' },
        coral: { 500: '#FF6B6B' },
        honey: { 500: '#FFD93D' },
        sky: { 500: '#4ECDC4' },
        dash: {
          bg: '#FFFFFF', sidebar: '#FBFBFA', border: '#E3E2E0',
          hover: '#F7F6F3', text: '#37352F', muted: '#787774'
        },
        market: { bg: '#FFFEF7', card: '#FFFFFF' },
        vendor: { success: '#00A86B' }
      },
      backgroundImage: {
        'gradient-golden': 'linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%)',
        'gradient-field': 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%)',
        'gradient-dawn': 'linear-gradient(135deg, #F6F9FC 0%, #E8F5E9 50%, #FFF9C4 100%)',
        'gradient-sunshine': 'linear-gradient(135deg, #FFF176 0%, #FFD54F 50%, #FFB300 100%)',
        'gradient-harvest': 'linear-gradient(135deg, #FFCC80 0%, #FFB74D 25%, #81C784 75%, #66BB6A 100%)',
        'gradient-citrus': 'linear-gradient(135deg, #FFF9C4 0%, #F9FBE7 25%, #C5E1A5 75%, #AED581 100%)'
      },
      fontFamily: {
        dash: ['Inter', 'system-ui', 'sans-serif'],
        market: ['DM Sans', 'system-ui', 'sans-serif'],
        vendor: ['system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace']
      },
      borderRadius: {
        xs: '2px', sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px'
      }
    }
  }
}
```

---

## 17. React Component Patterns

### Dashboard Button

```jsx
export const DashButton = ({ variant = 'primary', children, ...props }) => (
  <button className={`btn dash-btn-${variant}`} {...props}>
    {children}
  </button>
)
```

### Product Card

```jsx
export const ProductCard = ({ image, vendor, name, price, unit, badge, onAdd }) => (
  <div className="product-card">
    <div className="product-card-image-wrapper">
      <img src={image} alt={name} className="product-card-image" />
      {badge && <span className="product-card-badge">{badge}</span>}
    </div>
    <div className="product-card-content">
      <p className="product-card-vendor">{vendor}</p>
      <h3 className="product-card-name">{name}</h3>
      <div className="product-card-footer">
        <div>
          <span className="product-card-price">${price}</span>
          <span className="product-card-unit">/{unit}</span>
        </div>
        <button className="market-btn-add" onClick={onAdd}>Add</button>
      </div>
    </div>
  </div>
)
```

### App Router Structure

```jsx
export function App() {
  const userRole = getUserRole()
  switch(userRole) {
    case 'manager':  return <DashboardLayout />
    case 'customer': return <MarketplaceLayout />
    case 'vendor':   return <VendorLayout />
    default:         return <MarketplaceLayout />
  }
}
```

---

## 18. Quick Reference — Decision Matrix

**"What color do I use?"**
- Primary action → `--sage-700` (dashboard) or `--gradient-golden` (marketplace)
- Success/confirm → `--mint-500` or `--vendor-success`
- Error/destructive → `--coral-500`
- Warning → `--honey-500`
- Muted/secondary text → `--dash-muted`
- Price display → `--sage-700`

**"What font size?"**
- Dashboard body → 14px
- Marketplace body → 16px
- Vendor body → 18px
- Any heading → one step up from body on the relevant scale

**"How much padding?"**
- Tight/dense (dashboard cells) → `--space-2` to `--space-3`
- Standard (cards, modals) → `--space-4` to `--space-5`
- Breathing room (sections) → `--space-8` to `--space-12`
- Page-level → `--space-16` to `--space-24`

**"What radius?"**
- Small inline elements → `--radius-sm` (4px)
- Cards, buttons, inputs → `--radius-md` (8px)
- Product cards, large panels → `--radius-lg` (12px)
- Search bars, pills, avatars → `--radius-full`

**"What shadow?"**
- Resting card → `--shadow-sm`
- Hover card → `--shadow-md`
- Modal/dropdown → `--shadow-2xl`
- CTA button → custom warm shadow `rgba(255,183,77,0.3)`
