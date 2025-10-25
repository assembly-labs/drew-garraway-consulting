# Deployment Guide - Library of Things Application

This guide covers build, test, and deployment procedures for the Library of Things application with its expanded catalog system.

## Prerequisites

- Node.js 18+ and npm installed
- Git for version control
- Access to deployment platform (Netlify, Vercel, or similar)
- Environment variables configured

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Required for AI chat functionality
VITE_ANTHROPIC_API_KEY=your-api-key-here

# Optional: Override default model
# VITE_CLAUDE_MODEL=claude-3-haiku-20240307
```

⚠️ **Important**: Never commit `.env` files to version control. The `.gitignore` already excludes them.

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

# Validate all items have required fields
node -e "
const catalog = require('./public/data/catalog.json');
const errors = [];

catalog.forEach((item, index) => {
  // Check required fields
  if (!item.id) errors.push(\`Item \${index}: missing id\`);
  if (!item.itemType) errors.push(\`Item \${index}: missing itemType\`);
  if (!item.title) errors.push(\`Item \${index}: missing title\`);
  if (!item.cover) errors.push(\`Item \${index}: missing cover\`);
  if (!item.formats || !Array.isArray(item.formats)) {
    errors.push(\`Item \${index}: missing or invalid formats\`);
  }
  if (!item.description) errors.push(\`Item \${index}: missing description\`);

  // Validate itemType
  const validTypes = ['book', 'dvd', 'game', 'equipment', 'comic', 'audiovisual', 'thing'];
  if (!validTypes.includes(item.itemType)) {
    errors.push(\`Item \${index}: invalid itemType '\${item.itemType}'\`);
  }
});

if (errors.length > 0) {
  console.error('Catalog validation failed:');
  errors.forEach(e => console.error('  -', e));
  process.exit(1);
} else {
  console.log('✅ Catalog validation passed:', catalog.length, 'items');
}
"
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

⚠️ **Never commit the `dist/` or `assets/` directories** - they may contain bundled secrets.

## Deployment Methods

### Option 1: Netlify (Recommended)

#### Initial Setup

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize Netlify in project:**
   ```bash
   netlify init
   ```

4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add `VITE_ANTHROPIC_API_KEY` in Netlify dashboard

#### Deploy

```bash
# Production deployment
npm run build
netlify deploy --prod --dir=dist

# Preview deployment (for testing)
netlify deploy --dir=dist
```

### Option 2: Vercel

#### Initial Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login and link project:**
   ```bash
   vercel
   ```

3. **Configure environment:**
   ```bash
   vercel env add VITE_ANTHROPIC_API_KEY
   ```

#### Deploy

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

### Option 3: Manual Deployment

If deploying to a traditional web server:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Copy dist contents to server:**
   ```bash
   # Example using SCP
   scp -r dist/* user@server:/var/www/library-app/
   ```

3. **Configure web server (nginx example):**
   ```nginx
   server {
     listen 80;
     server_name library.example.com;
     root /var/www/library-app;

     location / {
       try_files $uri $uri/ /index.html;
     }

     # Cache static assets
     location /assets/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
   ```

## Post-Deployment Verification

### 1. Functional Testing

After deployment, verify:

- [ ] Homepage loads without errors
- [ ] Catalog displays all item types (books, DVDs, games, equipment, etc.)
- [ ] Chat/search functionality works with API key
- [ ] Item cards show correct information for each type
- [ ] "View Details" and "Place Hold" buttons work
- [ ] Dark mode toggle functions
- [ ] Mobile responsive design works

### 2. Performance Checks

```bash
# Test with Lighthouse
npx lighthouse https://your-deployed-url --view

# Check bundle size
curl -s -o /dev/null -w "Total size: %{size_download} bytes\n" https://your-deployed-url
```

### 3. Error Monitoring

Check browser console for:
- No 404 errors for assets
- No CORS issues with API calls
- No TypeScript/JavaScript errors

## Rollback Procedures

If issues are discovered post-deployment:

### Netlify Rollback
```bash
# List deployments
netlify deploy --list

# Rollback to previous
netlify rollback
```

### Vercel Rollback
```bash
# Via dashboard or CLI
vercel rollback
```

### Manual Rollback
Keep previous build artifacts:
```bash
# Before deploying new version
mv /var/www/library-app /var/www/library-app.backup
# Deploy new version
# If issues, restore:
mv /var/www/library-app /var/www/library-app.failed
mv /var/www/library-app.backup /var/www/library-app
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Type check
      run: npm run type-check

    - name: Validate catalog
      run: |
        node -e "
        const catalog = require('./public/data/catalog.json');
        console.log('Catalog has', catalog.length, 'items');
        const types = [...new Set(catalog.map(i => i.itemType))];
        console.log('Item types:', types.join(', '));
        "

    - name: Build
      run: npm run build
      env:
        VITE_ANTHROPIC_API_KEY: ${{ secrets.VITE_ANTHROPIC_API_KEY }}

    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting Common Issues

### Issue: "Property 'itemType' is missing"
**Cause:** Old catalog format without itemType field
**Solution:** Ensure all items in catalog.json have `"itemType": "book|dvd|game|equipment|comic|audiovisual|thing"`

### Issue: Build fails with type errors
**Cause:** Type mismatches in catalog or components
**Solution:** Run `npm run type-check` locally and fix all errors before deploying

### Issue: Images not loading in production
**Cause:** Mixed HTTP/HTTPS or CORS issues
**Solution:** Ensure all image URLs use HTTPS and are from allowed domains

### Issue: API calls failing
**Cause:** Missing or incorrect environment variable
**Solution:** Verify `VITE_ANTHROPIC_API_KEY` is set in deployment environment

### Issue: Catalog not updating after deployment
**Cause:** Browser cache or CDN cache
**Solution:**
1. Clear browser cache
2. Purge CDN cache if applicable
3. Add version query param to catalog fetch: `/data/catalog.json?v=${Date.now()}`

## Maintenance Tasks

### Weekly
- Review error logs
- Check API usage and costs
- Verify all item images still load

### Monthly
- Update dependencies: `npm update`
- Review and add new catalog items
- Test rollback procedures

### Quarterly
- Performance audit with Lighthouse
- Security audit: `npm audit`
- Review and update documentation

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code or commits
2. **User Input**: All user input is sanitized through React
3. **Dependencies**: Regularly update with `npm audit fix`
4. **HTTPS**: Always deploy with HTTPS enabled
5. **CSP Headers**: Configure Content Security Policy headers

Example CSP for Netlify (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; img-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
```

## Monitoring and Analytics

### Add monitoring (optional):

```javascript
// In src/main.tsx
if (import.meta.env.PROD) {
  // Add error tracking
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to monitoring service
  });

  // Track performance
  if ('reportWebVitals' in window) {
    reportWebVitals(console.log);
  }
}
```

## Summary

The deployment process for the Library of Things application:

1. **Prepare**: Check types, validate catalog, build locally
2. **Deploy**: Use Netlify/Vercel CLI or CI/CD pipeline
3. **Verify**: Test all functionality in production
4. **Monitor**: Watch for errors and performance issues
5. **Maintain**: Regular updates and security patches

Remember: The application now supports diverse materials beyond books. Ensure testing covers all item types (books, DVDs, games, equipment, comics, things) to verify the polymorphic components work correctly in production.