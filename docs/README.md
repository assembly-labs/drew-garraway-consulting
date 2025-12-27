# Docs - Portfolio Documentation

Central documentation and deployment guides for the consulting portfolio.

## Contents

- `CLOUDFLARE_MIGRATION.md` - Cloudflare migration guide
- `DEPLOYED_SITES.md` - List of deployed sites
- `DEPLOY_FIX_INSTRUCTIONS.md` - Deployment troubleshooting
- `LOCAL_DEVELOPMENT.md` - Local dev setup
- `STYLE_GUIDE.md` - Code style guidelines

## Shared Configs

Base ESLint and Prettier configs are available at the repository root:

- `/.eslintrc.base.json` - Base ESLint rules (extend in subprojects)
- `/.prettierrc.base.json` - Base Prettier formatting rules

To use in a subproject, extend the base config:

```json
// .eslintrc.json
{
  "extends": ["../.eslintrc.base.json"]
}
```

## Tech Stack

- Markdown documentation
- Vite + TypeScript (for any tooling)

## Status

Actively maintained.
