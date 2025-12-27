# Archived Projects

These projects are archived but their code remains intact and buildable.

## Archived Projects

| Project | Description | Stack |
|---------|-------------|-------|
| `accountable` | Habit tracking app | Vite + React |
| `alliance-bjj-app` | BJJ gym management | React Native/Expo + Static prototype |
| `CAP` | Championship Athletic Prospects | Next.js 14 + Supabase |
| `cleaning-services-by-amanda` | Cleaning services site | Static HTML |
| `fuckyougotrain` | Fitness app | Vite + React |
| `nofomo` | FOMO tracker app | Vite + React |
| `zero-chill-tracker` | Chill/stress tracker | Vite + React |

## How to Restore a Project for Deployment

If you need to deploy updates to an archived project:

### 1. Move the project out of archive

```bash
# From the repo root
git mv _archived/PROJECT_NAME ./PROJECT_NAME
```

### 2. Update Cloudflare Pages (if needed)

If the project was deployed to Cloudflare Pages before archiving:

1. Go to Cloudflare Dashboard > Pages
2. Find the project
3. Update the build configuration:
   - **Root directory**: Change from `_archived/PROJECT_NAME` to `PROJECT_NAME`
4. Trigger a new deployment

### 3. Install dependencies and build

```bash
cd PROJECT_NAME
npm install
npm run build
```

### 4. Deploy

```bash
# For Cloudflare Pages projects with wrangler.toml:
npx wrangler pages deploy dist

# Or push to trigger automatic deployment if connected to GitHub
git add .
git commit -m "Restore PROJECT_NAME from archive"
git push
```

### 5. Re-archive when done (optional)

```bash
git mv PROJECT_NAME _archived/PROJECT_NAME
git commit -m "Re-archive PROJECT_NAME"
git push
```

## Notes

- All projects retain their original configuration files
- `wrangler.toml` files are present for Cloudflare Pages deployment
- Environment variables must be configured in Cloudflare dashboard
- Private documentation has been moved offline and is NOT in this archive
