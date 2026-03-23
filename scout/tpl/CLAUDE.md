# Claude Code Instructions

## Project Context

Documentation project for Tredyffrin Township Libraries' Toshiba e-STUDIO 2525AC copier. Creates patron-facing guides, staff documentation, and print signage.

## Key Directories

- `docs/` - Markdown source files (edit these)
- `printer-help/` - Deployable HTML output (served at drewgarraway.com/tpl/printer-help/)
- `printer-help/assets/` - CSS, images, fonts
- `reference/` - Toshiba PDF manuals for fact-checking

## Deployment

Auto-deploys via GitHub Pages when pushed to main branch.

URLs will be:
- `/tpl/printer-help/` (index)
- `/tpl/printer-help/quick-start`
- `/tpl/printer-help/faq`
- `/tpl/printer-help/signs`
- `/tpl/printer-help/staff-guide`

## Style Requirements

- Follow TTL brand colors from `printer-help/assets/css/variables.css`
- Use Poppins for headings, Lato for body text
- Maintain WCAG 2.1 AA accessibility
- No emojis in documentation
- Use line-art SVG icons when icons are needed

## When Converting MD to HTML

1. Use `printer-help/_template.html` as base
2. Apply semantic HTML (`<article>`, `<section>`, proper heading hierarchy)
3. Add `.steps` class to numbered instruction lists
4. Add `.callout` class for tips/warnings
5. Test print styles for signage documents

## Naming Conventions

- MD files: `NN-descriptive-name.md` (numbered for ordering)
- HTML files: `descriptive-name.html` (no numbers)
- CSS classes: kebab-case
- CSS variables: `--category-name`
