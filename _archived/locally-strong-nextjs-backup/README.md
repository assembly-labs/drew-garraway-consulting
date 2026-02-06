# Locally Strong

**Rooted in Tradition. Growing with Purpose.**

A modern web platform for a community-focused nonprofit organization supporting local farmers markets, small businesses, and producers.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Content**: MDX for stories, JSON for structured data
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd locally-strong

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
locally-strong/
├── public/                  # Static assets
│   ├── images/
│   ├── videos/
│   └── robots.txt          # Search engine directives
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── donate/
│   │   ├── get-involved/
│   │   │   └── partners/
│   │   ├── policies/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── stories/
│   │   │   ├── [slug]/
│   │   │   └── submit/
│   │   ├── ui/             # Component gallery (dev reference)
│   │   ├── api/            # API routes
│   │   │   ├── contact/
│   │   │   ├── newsletter/
│   │   │   ├── partners/
│   │   │   └── stories/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── forms/          # Form components
│   │   ├── home/           # Homepage sections
│   │   ├── layout/         # Header, Footer, Nav
│   │   ├── stories/        # Story components
│   │   └── ui/             # Reusable UI components
│   ├── content/            # Content files
│   │   ├── stories/        # MDX story files
│   │   ├── about.mdx
│   │   ├── contact.json
│   │   ├── donate.json
│   │   ├── get-involved.json
│   │   ├── home.json
│   │   ├── partners.json
│   │   └── site.json
│   └── lib/                # Utilities and content loaders
│       ├── content.ts
│       ├── stories.ts
│       ├── types.ts
│       └── utils.ts
└── data/                   # Form submission storage (gitignored)
    ├── contact.json
    ├── newsletter.json
    ├── partners.json
    └── submissions.json
```

## Required Assets

### Hero Video

Add a video file at `/public/videos/hero-placeholder.mp4`:

- **Duration:** 10-15 seconds (looping)
- **Resolution:** 1920x1080 or 1280x720
- **Format:** MP4 (H.264)
- **File size:** Under 5MB
- **Content:** Farmers market scenes, local vendors, community

### Hero Poster Image

Replace the placeholder at `/public/images/hero-poster.jpg`:

- **Dimensions:** 1920x1080 minimum
- **Format:** JPG or WebP
- **Content:** Farmers market or community scene
- **File size:** Under 500KB

## Content Management

### Editing Site Content

| Content Type | File Location |
|-------------|---------------|
| Site-wide (nav, footer) | `/src/content/site.json` |
| Homepage | `/src/content/home.json` |
| About page | `/src/content/about.mdx` |
| Get Involved | `/src/content/get-involved.json` |
| Partners | `/src/content/partners.json` |
| Donate | `/src/content/donate.json` |
| Contact | `/src/content/contact.json` |

### Adding New Stories

Create a new `.mdx` file in `/src/content/stories/`:

```mdx
---
title: "Story Title"
slug: "story-slug"
author: "Author Name"
authorRole: "Their Role"
date: "2025-01-15"
excerpt: "One-sentence teaser."
image: "/images/stories/image.jpg"
featured: true
---

Story content here...
```

### Managing Form Submissions

Form submissions are stored in `/data/` as JSON files:
- `submissions.json` - Story submissions
- `newsletter.json` - Newsletter subscribers
- `contact.json` - Contact form messages
- `partners.json` - Partner inquiries

**Note**: These files are for demo/development purposes. In production, integrate with:
- **CRM**: HubSpot, Salesforce
- **Database**: Supabase, PlanetScale
- **Newsletter**: Mailchimp, ConvertKit
- **Forms**: Airtable, Notion

## Design System

### Colors

| Name     | CSS Variable | Hex       | Usage |
|----------|-------------|-----------|-------|
| Forest   | `--forest`  | `#2D5016` | Primary |
| Sage     | `--sage`    | `#7A9E7E` | Secondary |
| Cream    | `--cream`   | `#FAF8F5` | Background |
| Wheat    | `--wheat`   | `#E8DFD0` | Accent background |
| Earth    | `--earth`   | `#8B5E3C` | Accent |
| Charcoal | `--charcoal`| `#1F2937` | Text |

### Typography

- **Headings**: DM Serif Display (400)
- **Body**: Inter (400, 500, 600)

### Component Reference

Visit `/ui` in development to see all components with examples.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/contact` | POST | Contact form submissions |
| `/api/newsletter` | POST | Newsletter signups |
| `/api/stories` | POST | Story submissions |
| `/api/partners` | POST | Partner inquiries |

## Environment Variables

Create a `.env.local` file (see `.env.example`):

```env
# Currently no environment variables required
# Future integrations may need:
# MAILCHIMP_API_KEY=
# STRIPE_SECRET_KEY=
# RESEND_API_KEY=
```

## Accessibility

This site follows WCAG 2.1 AA guidelines:

- Skip to main content link
- Keyboard navigation support
- Screen reader optimized
- Respects `prefers-reduced-motion`
- Proper focus indicators
- Semantic HTML structure
- Form labels and error messages

## Deployment

Deployed via Cloudflare Pages. Push to `main` to trigger automatic deployment.

```bash
npm run build
wrangler pages deploy .next --project-name=locally-strong
```

## Production Readiness Checklist

### Before Launch

- [ ] Replace placeholder content with real text
- [ ] Add real team member bios and photos
- [ ] Add partner logos
- [ ] Add actual hero video
- [ ] Get professional photography
- [ ] Have legal counsel review privacy policy and terms
- [ ] Set up real donation processor (Stripe, PayPal Giving)
- [ ] Integrate newsletter service (Mailchimp, ConvertKit)
- [ ] Set up form submission notifications
- [ ] Configure analytics (Plausible, Fathom, or GA4)
- [ ] Test all forms end-to-end
- [ ] Run Lighthouse audit (aim for 90+ all categories)
- [ ] Test on multiple devices and browsers

### Future Enhancements

- [ ] CMS integration (Sanity, Contentful)
- [ ] Event registration system
- [ ] Vendor portal/dashboard
- [ ] Programs detail pages
- [ ] Events detail pages
- [ ] Search functionality
- [ ] Multi-language support

## License

Private - All rights reserved
