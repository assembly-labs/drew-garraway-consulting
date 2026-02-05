# Luka Financial - Project Context for Claude

## What This Is

Luka is a high-converting financial services website for a wealth management and financial planning firm. It's designed to establish trust, communicate expertise, and convert visitors into qualified leads through a consultative approach.

## Tech Stack

| Aspect | Technology |
|--------|------------|
| Framework | Static HTML (no build framework) |
| Build | Tailwind CSS CLI |
| Styling | Tailwind CSS v3.4 (utility-first) |
| Interactivity | Alpine.js (lightweight reactivity) |
| Animations | GSAP + ScrollTrigger (scroll-based) |
| Fonts | Google Fonts (Playfair Display + Inter) |
| Deployment | Cloudflare Pages |

## Project Structure

```
luka/
├── css/
│   ├── input.css          # Tailwind source (edit this)
│   └── style.css          # Compiled output (do not edit)
├── js/
│   └── main.js            # Alpine components, GSAP animations, scroll behavior
├── images/                # Image assets (headshots, icons, etc.)
├── index.html             # Main landing page
├── package.json
├── tailwind.config.js
└── CLAUDE.md
```

## Development

```bash
# Install dependencies
npm install

# Start dev server with CSS watch
npm run dev

# Build CSS for production
npm run build

# Just watch CSS changes
npm run watch:css
```

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `navy-900` | `#0d1424` | Primary text, dark backgrounds |
| `navy-800` | `#1a2847` | Primary buttons, headings |
| `navy-600` | `#33508e` | Secondary text |
| `navy-50` | `#f0f3f9` | Light backgrounds, icon containers |
| `gold-500` | `#d4982e` | Accent, eyebrow text, decorative elements |
| `gold-400` | `#e2b04a` | Highlights on dark backgrounds |
| `cream` | `#FAFAF8` | Page background |
| `ivory` | `#F5F5F0` | Alternate section background |

### Typography

- **Headings:** Playfair Display (serif) - conveys tradition and trust
- **Body:** Inter (sans-serif) - clean readability
- **Eyebrow/overline:** Inter uppercase, letter-spaced, gold-600

### Components

| Component | Class | Description |
|-----------|-------|-------------|
| Container | `.container-lg` / `.container-md` / `.container-sm` | Max-width wrappers |
| Section | `.section` / `.section-lg` | Vertical padding |
| Button | `.btn .btn-primary` | Navy filled button |
| Button | `.btn .btn-secondary` | White outlined button |
| Button | `.btn .btn-gold` | Gold accent button |
| Card | `.card .card-hover` | White card with hover lift |
| Form Input | `.form-input` | Styled input field |
| Eyebrow | `.eyebrow` | Uppercase overline label |
| Divider | `.divider` | Short gold accent line |

### Animations

- **Scroll reveal:** `.reveal` class with Intersection Observer (adds `.is-visible`)
- **Stagger children:** `.stagger` inside `.reveal` for sequential entrance
- **GSAP enhancements:** Hero entrance, stat counters, card entrances, divider line
- **Reduced motion:** All animations respect `prefers-reduced-motion: reduce`

## Accessibility

- WCAG 2.1 AA minimum
- Skip navigation link
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation (Escape closes mobile nav)
- 44px+ touch targets
- 16px+ form inputs (prevents iOS zoom)
- Reduced motion support
- Safe area insets for notched devices

## Conversion Strategy

### CTA Hierarchy
1. **Primary:** "Schedule a Conversation" (hero + nav + contact form)
2. **Secondary:** "Learn Our Approach" (hero)
3. **Footer:** Quick links to all sections

### Trust Signals
- Credentials bar (CFP, Series 65, Fiduciary, SEC)
- Client testimonials with names and roles
- Stats (years experience, AUM, retention rate)
- Privacy messaging on contact form
- Regulatory disclosure in footer

### Form
- Alpine.js reactive form with client-side validation
- Minimal required fields (first name, last name, email)
- Loading state and success message
- Form submission is simulated - needs real endpoint

## Deployment

```bash
# Build CSS
npm run build

# Auto-deploy: push to main on GitHub, Cloudflare Pages handles the rest
git push origin main

# Manual deploy
npm run build && wrangler pages deploy . --project-name=luka
```

## SEO

- Schema.org `FinancialService` structured data
- Open Graph and Twitter Card meta tags
- Semantic heading hierarchy (single h1)
- Descriptive meta description
- Clean URL structure

## Notes

- **Images:** Headshot placeholder needs real photo. Replace the SVG placeholder in the About section.
- **Form backend:** Contact form currently simulates submission. Connect to Formspree, Cloudflare Worker, or similar.
- **Pages:** Currently single-page. Can expand to multi-page (about.html, services.html, etc.) as needed.
- **Analytics:** Add tracking script (e.g., Plausible, Fathom) before launch.
