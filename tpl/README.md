# Tredyffrin Libraries - Copier Documentation

User guides, staff documentation, and print-ready signage for the **Toshiba e-STUDIO 2525AC** multifunction copier at Tredyffrin Township Libraries.

## Project Structure

```
tpl/
├── printer-help/        # Live site (auto-deploys via GitHub Pages)
│   ├── index.html
│   ├── quick-start.html
│   ├── faq.html
│   ├── signs.html
│   ├── staff-guide.html
│   └── assets/
│       ├── css/
│       └── images/
├── docs/                # Source Markdown files
│   ├── STYLE-GUIDE.md   # Design system documentation
│   └── *.md             # Source content
└── reference/           # Toshiba PDF manuals
```

## Live Site

**URL:** [drewgarraway.com/tpl/printer-help/](https://drewgarraway.com/tpl/printer-help/)

| Page | URL |
|------|-----|
| Home | `/tpl/printer-help/` |
| Quick Start | `/tpl/printer-help/quick-start` |
| FAQ | `/tpl/printer-help/faq` |
| Signs | `/tpl/printer-help/signs` |
| Staff Guide | `/tpl/printer-help/staff-guide` |

## Documentation

| Document | Audience | Purpose |
|----------|----------|---------|
| Quick Start | Patrons | Step-by-step copy, scan, print instructions |
| FAQ | Patrons | Common questions and troubleshooting |
| Signs | Staff | Ready-to-print signage (7 signs) |
| Staff Guide | Staff | Detailed technical reference |

## Style Guide

See `docs/STYLE-GUIDE.md` for:
- Color palette
- Typography
- Component classes
- Print styles
- Accessibility guidelines

## Accessibility

All documentation follows WCAG 2.1 AA guidelines.
