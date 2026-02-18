# Gather — Farmers Market Marketplace

"Instacart for farmers markets." Customers browse and order online, pick up at the market. Three-sided platform serving customers, vendors, and market managers.

**Target market:** Berwyn Farmers Market (MVP). Pickup-only, always.

## What's In This Repo

A working **UI prototype** built with React 19 + Vite. Includes customer storefront (browse, search, cart, checkout) and operations dashboard (orders, pick lists, QR check-in). Uses mock data — no backend yet.

## Tech Stack (Prototype)

- React 19 + TypeScript
- Vite + React Router 7
- Tailwind CSS v4
- Lucide icons
- Cloudflare Pages

## Getting Started

```bash
cd prototype
npm install
npm run dev
```

## Project Structure

```
gather/
├── README.md               # This file
├── prototype/              # React prototype app
│   └── src/
│       ├── pages/          # Customer pages (Home, Browse, Cart, Checkout, etc.)
│       ├── pages/ops/      # Ops pages (Dashboard, Orders, PickLists, CheckIn)
│       ├── components/     # Shared and ops-specific components
│       ├── context/        # CartContext, OpsContext
│       └── data/           # Mock products, vendors, categories, orders
├── css/, js/, images/      # Static landing page assets
└── robots.txt
```

Internal documentation (PRD, feature specs, brand guide, business model, research) is kept local-only and not tracked in git.

## Status

Pre-launch. Prototype built, fundraising in progress.
