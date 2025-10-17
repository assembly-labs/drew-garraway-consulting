# 🌐 Deployed Prototypes

## 🎨 Brand Guidelines

**Visual Theme:** Luxury Tech Gradient
**Color Palette:** Deep Indigo (#1E1B4B) → Rich Purple (#4C1D95) → Vibrant Magenta (#C026D3) → Coral Pink (#FB7185)
**Style:** Modern, sophisticated, energetic
**Reference:** See [STYLE_GUIDE.md](STYLE_GUIDE.md) for complete implementation details

---

## 📊 Deployment Progress

**2 of 5 prototypes deployed** (40% complete)

- ✅ **Librarian LLM** - LIVE at [librarian-llm.netlify.app](https://librarian-llm.netlify.app)
- ✅ **Fuck You Go Train** - LIVE at [fuckyougotrain.netlify.app](https://fuckyougotrain.netlify.app)
- 🔄 **Gym Prototype** - Next to deploy
- ⏳ **NoFomo** - Queued
- ⏳ **Assembly Articles** - Queued

---

## 📖 Documentation

**Before deploying, read these:**
- 🚀 **[Netlify Monorepo Workflow](.github/NETLIFY_MONOREPO_WORKFLOW.md)** - Complete deployment guide (REQUIRED READING)
- 📇 **[Quick Deploy Cards](.github/QUICK_DEPLOY_CARDS.md)** - Copy-paste settings for each prototype
- 📚 **[General Deployment Guide](.github/DEPLOYMENT_GUIDE.md)** - Additional context and troubleshooting

---

## Live Sites

All prototypes are deployed to Netlify with automatic deployments on push to `main` branch.

### Active Prototypes

| Prototype | Description | URL | Directory | Status |
|-----------|-------------|-----|-----------|--------|
| **Librarian LLM** | AI-powered library assistant | [librarian-llm.netlify.app](https://librarian-llm.netlify.app) | `librarian-llm/` | ✅ **LIVE** |
| **Fuck You Go Train** | Fitness motivation app | [fuckyougotrain.netlify.app](https://fuckyougotrain.netlify.app) | `fuckyougotrain/` | ✅ **LIVE** |
| **NoFomo** | Social event tracker | TBD | `nofomo/` | ⏳ Pending |
| **Assembly Articles** | AI article generator | TBD | `assembly-agentic-articles/frontend/` | ⏳ Pending |
| **Gym Prototype** | Gym management system | TBD | `gym/prototype/` | 🔄 Next Up |

## Deployment Information

### How Deployments Work

Each prototype:
- Has its own Netlify site
- Points to the same GitHub repo: `assembly-labs/drew-garraway-consulting`
- Uses a different base directory
- Deploys independently when its files change

### Triggering Deployments

**Automatic:** Push to `main` branch
```bash
git add <prototype-directory>
git commit -m "Update <prototype-name>"
git push origin main
```

**Manual:**
1. Go to Netlify dashboard
2. Select site
3. Click "Trigger deploy" → "Deploy site"

### Build Configuration

Each site uses:
- **Build command:** `npm run build`
- **Publish directory:** `<base-directory>/dist`
- **Node version:** 18-20 (auto-detected)

### Environment Variables

Environment variables are configured per-site in Netlify:
1. Go to site in Netlify dashboard
2. Site configuration → Environment variables
3. Add/edit variables
4. Redeploy to apply changes

## Quick Links

- [Netlify Dashboard](https://app.netlify.com)
- [GitHub Repository](https://github.com/assembly-labs/drew-garraway-consulting)
- [Deployment Guide](.github/DEPLOYMENT_GUIDE.md)

## Status Monitoring

Check site status:
1. Visit the live URL
2. Check Netlify dashboard for build status
3. View build logs if deployment fails

## Troubleshooting

### Build Failed
1. Check Netlify build logs
2. Test build locally: `cd <prototype> && npm run build`
3. Fix errors, commit, push again

### Site Not Updating
1. Verify files were pushed: `git log`
2. Check Netlify detected changes
3. Manually trigger deploy if needed

### Environment Variable Issues
1. Verify variables are set in Netlify (not local .env)
2. For Vite apps, variables must start with `VITE_`
3. Redeploy after adding variables

---

**Last Updated:** 2025-10-16
**Maintained By:** Drew Garraway
