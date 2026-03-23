# Luka - PAGEONE Accounting & Finance

Professional website for PAGEONE Accounting & Finance services.

## Tech Stack

- Static HTML
- Tailwind CSS v3 (CLI build)
- Alpine.js for interactivity
- GSAP for animations

## Getting Started

```bash
npm install
npm run build:css  # Compile Tailwind
```

## Deployment

Auto-deploys to Cloudflare Pages on push to `main`.

Manual deploy:
```bash
npm run build && wrangler pages deploy . --project-name=luka
```

## Documentation

See `CLAUDE.md` for development guidelines.
