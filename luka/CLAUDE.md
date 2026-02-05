# Luka / PAGEONE Accounting & Finance - Project Context for Claude

## What This Is

PAGEONE is a high-converting website for an accounting and finance firm. The project directory is `luka/` but the brand is **PAGEONE Accounting & Finance**. It's designed to establish trust, communicate expertise, and convert visitors into qualified leads through a consultative approach targeting small businesses, startups, contractors, and professional services firms.

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
├── images/                # Image assets
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
| `gold-500` | `#d4982e` | Accent, eyebrow text, logo highlight |
| `gold-400` | `#e2b04a` | Highlights on dark backgrounds |
| `gold-50` | `#fdf9ef` | Value prop icon backgrounds |
| `cream` | `#FAFAF8` | Page background |
| `ivory` | `#F5F5F0` | Alternate section background |

### Typography

- **Headings:** Playfair Display (serif) - conveys tradition and trust
- **Body:** Inter (sans-serif) - clean readability
- **Eyebrow/overline:** Inter uppercase, letter-spaced, gold-600

### Logo

The PAGEONE logo is text-based: "PAGE" in navy-900 + "ONE" in gold-500 (gold-400 on dark backgrounds).

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
- **GSAP enhancements:** Hero entrance, card entrances, How It Works steps, divider line
- **Reduced motion:** All animations respect `prefers-reduced-motion: reduce`

## Page Sections

1. **Hero** - "Clear books. Confident decisions." + dual CTAs (Schedule a Call, Get a Quote)
2. **Value Props Bar** - Free Consultation, No Long-Term Contracts, Tailored Solutions
3. **Services** - 6 cards: Bookkeeping, Tax, Fractional CFO, Reporting, Budgeting, 1099
4. **Trusted By** - Industry cards: Small Businesses, Startups, Contractors, Professional Services
5. **How It Works** - 3 steps: Discover, Clean Up, Optimize (dark navy background)
6. **Testimonials** - 3 client quotes (Sarah Johnson, Michael Chen, Amanda Roberts)
7. **Who We Help** - 6 client types in grid
8. **Contact** - Alpine.js form with validation + trust messaging
9. **Footer** - Services, quick links, contact info, legal

## Accessibility

- WCAG 2.1 AA minimum
- Skip navigation link
- Semantic HTML5 elements (`article`, `blockquote`, `footer` inside blockquotes)
- ARIA labels on interactive elements
- Keyboard navigation (Escape closes mobile nav)
- 44px+ touch targets
- 16px+ form inputs (prevents iOS zoom)
- Reduced motion support
- Safe area insets for notched devices

## Conversion Strategy

### CTA Hierarchy
1. **Primary:** "Schedule a Call" (hero + nav + footer)
2. **Secondary:** "Get a Quote" (hero + mobile nav)
3. **Form:** "Get Started" (contact section)

### Trust Signals
- Value props bar (Free Consultation, No Contracts, Tailored Solutions)
- Client testimonials with names and company names
- Trusted By industry section
- How It Works process transparency
- Contact form trust messaging (free, no contracts, 24hr response)

### Form
- Alpine.js reactive form with client-side validation
- Minimal required fields (first name, last name, email)
- Service interest dropdown matches actual offerings
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

- Schema.org `AccountingService` structured data
- Open Graph and Twitter Card meta tags
- Semantic heading hierarchy (single h1)
- Descriptive meta description
- Clean URL structure

## Notes

- **Form backend:** Contact form currently simulates submission. Connect to Formspree, Cloudflare Worker, or similar.
- **Contact info:** Phone and email in footer are placeholders (XXX, your@email.com). Replace before launch.
- **Pages:** Currently single-page. Can expand to multi-page (about.html, services.html, etc.) as needed.
- **Analytics:** Add tracking script (e.g., Plausible, Fathom) before launch.
- **Images:** No images are currently used. Add team photos, office imagery, or stock photos as needed.
