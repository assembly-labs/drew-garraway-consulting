# Deployment Guide - Scout (AI Library Assistant)

This guide covers build, test, and deployment procedures for Scout, your AI-powered library discovery assistant.

## Prerequisites

- Node.js 18+ and npm installed
- Git for version control
- Access to Cloudflare Pages (deployment is automated via GitHub Actions)
- Environment variables configured in Cloudflare dashboard

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root for local development:

```bash
# Required for AI chat functionality
CLAUDE_API_KEY=your-api-key-here

# Optional: Override default model
# VITE_CLAUDE_MODEL=claude-3-haiku-20240307
```

**Important**: Never commit `.env` files to version control. The `.gitignore` already excludes them.

For production, set `CLAUDE_API_KEY` in Cloudflare Pages dashboard under Settings > Environment Variables.

## Pre-Deployment Checklist

### 1. Code Quality Checks

```bash
# Install dependencies
npm install

# Type checking - MUST PASS
npm run type-check

# Build test - MUST PASS
npm run build

# Development server test
npm run dev
# Navigate to http://localhost:5173 and verify:
# - Catalog loads with diverse materials
# - Search/chat functionality works
# - All item types display correctly
```

### 2. Catalog Validation

Before deploying, validate the catalog JSON:

```bash
# Check JSON syntax
npx prettier --check public/data/catalog.json
```

### 3. Build Verification

After building, verify the output:

```bash
# Build the project
npm run build

# Check build output
ls -la dist/

# Verify assets are created
ls -la dist/assets/

# Check file sizes (should be reasonable)
du -sh dist/
```

**Never commit the `dist/` directory** - it's built during deployment.

## Deployment

### Automatic Deployment (Recommended)

Scout deploys automatically via GitHub Actions when you push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The workflow (`.github/workflows/deploy-scout.yml`) will:
1. Install dependencies
2. Build the project
3. Deploy to Cloudflare Pages

### Manual Deployment

If needed, you can deploy manually using wrangler:

```bash
npm run build
npx wrangler pages deploy dist --project-name=scout-library-assistant
```

## Post-Deployment Verification

### Functional Testing

After deployment, verify at [https://searchwithscout.com](https://searchwithscout.com):

- [ ] Homepage loads without errors
- [ ] Catalog displays all item types (books, DVDs, games, equipment, etc.)
- [ ] Chat/search functionality works
- [ ] Item cards show correct information for each type
- [ ] "View Details" and "Place Hold" buttons work
- [ ] Dark mode toggle functions
- [ ] Mobile responsive design works

### Performance Checks

```bash
# Test with Lighthouse
npx lighthouse https://searchwithscout.com --view
```

### Error Monitoring

Check browser console for:
- No 404 errors for assets
- No CORS issues with API calls
- No TypeScript/JavaScript errors

## Rollback Procedures

If issues are discovered post-deployment:

1. Go to Cloudflare Pages dashboard
2. Navigate to the Scout project > Deployments
3. Find the previous working deployment
4. Click "..." > "Rollback to this deployment"

Or via CLI:
```bash
npx wrangler pages deployment list --project-name=scout-library-assistant
# Note the deployment ID of the working version
npx wrangler pages deployment rollback <deployment-id> --project-name=scout-library-assistant
```

## Troubleshooting Common Issues

### Issue: Build fails with type errors
**Cause:** Type mismatches in catalog or components
**Solution:** Run `npm run type-check` locally and fix all errors before deploying

### Issue: Images not loading in production
**Cause:** Mixed HTTP/HTTPS or CORS issues
**Solution:** Ensure all image URLs use HTTPS and are from allowed domains

### Issue: API calls failing
**Cause:** Missing or incorrect environment variable
**Solution:** Verify `CLAUDE_API_KEY` is set in Cloudflare Pages dashboard

### Issue: Catalog not updating after deployment
**Cause:** Browser cache or CDN cache
**Solution:**
1. Clear browser cache
2. Wait for Cloudflare cache to update (usually a few minutes)
3. Force cache purge in Cloudflare dashboard if needed

## Maintenance Tasks

### Weekly
- Review error logs
- Check API usage and costs
- Verify all item images still load

### Monthly
- Update dependencies: `npm update`
- Review and add new catalog items
- Security audit: `npm audit`

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code or commits
2. **User Input**: All user input is sanitized through React
3. **Dependencies**: Regularly update with `npm audit fix`
4. **HTTPS**: Cloudflare Pages provides HTTPS by default

## Summary

The deployment process for Scout:

1. **Prepare**: Check types, validate catalog, build locally
2. **Deploy**: Push to main (automatic) or use wrangler CLI (manual)
3. **Verify**: Test all functionality in production
4. **Monitor**: Watch for errors and performance issues
5. **Maintain**: Regular updates and security patches

Remember: The application supports diverse materials beyond books. Ensure testing covers all item types (books, DVDs, games, equipment, comics, things) to verify the polymorphic components work correctly in production.
