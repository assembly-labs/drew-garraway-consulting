# Locally Strong

A simple static website for a nonprofit focused on strengthening local communities by empowering small businesses, farmers, and producers.

## Tech Stack

- **HTML**: Static HTML pages
- **CSS**: Tailwind CSS (compiled via CLI)
- **JavaScript**: Vanilla JS for interactivity
- **Deployment**: Cloudflare Pages

## Project Structure

```
locally-strong/
├── css/
│   ├── input.css       # Tailwind source file
│   └── style.css       # Compiled CSS (generated)
├── js/
│   └── main.js         # Mobile nav, forms, interactions
├── stories/
│   ├── index.html      # Stories listing
│   └── *.html          # Individual story pages
├── index.html          # Homepage
├── about.html          # About page
├── contact.html        # Contact page
├── donate.html         # Donation page
├── get-involved.html   # Get involved page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of use
├── package.json
└── tailwind.config.js
```

## Development

```bash
# Install dependencies
npm install

# Download free stock media (video & images)
./scripts/download-media.sh

# Start dev server (CSS watch + local server on port 8080)
npm run dev

# Build CSS for production
npm run build
```

Dev server runs at http://localhost:8080

## Media Files

Stock media (video, images) are not committed to git due to size. Run the download script after cloning:

```bash
./scripts/download-media.sh
```

All media is free from [Pexels.com](https://pexels.com) - no attribution required for commercial use.

## Deployment

The site deploys to Cloudflare Pages. Connect the repository and configure:

- **Build command**: `npm run build`
- **Build output directory**: `/` (root)
- **Root directory**: `locally-strong`

## Design System

### Colors
- **Forest**: #2D5016 (primary green)
- **Sage**: #8FAE7C (light green)
- **Cream**: #FAF8F5 (background)
- **Wheat**: #E8DFD0 (warm neutral)
- **Earth**: #8B4513 (accent brown)
- **Charcoal**: #2C2C2C (text)

### Fonts
- **Heading**: DM Serif Display (serif)
- **Body**: Inter (sans-serif)

## Forms

Forms use placeholder handlers in `main.js`. For production, integrate with:
- **Contact/Newsletter**: Formspree, Cloudflare Workers, or similar
- **Donations**: Stripe, PayPal Giving, or Every Action

## Content

All content is placeholder. Update:
- Organization details (name, address, contact)
- Team member information
- Partner logos
- Story content and images
- Donation integration
