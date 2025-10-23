# Text Reader - Production Deployment Guide

## Deployment Options

### Option 1: GitHub Pages (Recommended - Free)
✅ Best for: Static PWAs, Free hosting, HTTPS included
❌ Limitations: No server-side processing, static files only

### Option 2: Vercel (Easiest)
✅ Best for: Zero-config deployment, automatic HTTPS, fast CDN
❌ Limitations: Commercial use may require paid plan

### Option 3: Netlify (Feature-rich)
✅ Best for: Form handling, serverless functions, split testing
❌ Limitations: Build minutes limited on free tier

### Option 4: Custom Server (Full control)
✅ Best for: Custom backend, full control, own domain
❌ Limitations: Requires server management, SSL setup

---

## Recommended: GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed locally
- Repository initialized

---

## Step-by-Step Deployment

### 1. Prepare for Deployment

#### 1.1 Update File Paths
Your app currently uses absolute paths (`/css/styles.css`). For GitHub Pages, you may need relative paths.

**Check `index.html`:**
```html
<!-- Current (works for both) -->
<link rel="stylesheet" href="/css/styles.css">

<!-- If issues arise, use relative -->
<link rel="stylesheet" href="css/styles.css">
```

#### 1.2 Verify All Assets

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/_read_out_loud

# Check all required files exist
ls -la icons/icon-192.png icons/icon-512.png
ls -la css/ js/
ls -la index.html manifest.json
```

**Required files:**
- ✓ `index.html`
- ✓ `manifest.json`
- ✓ `icons/icon-192.png`
- ✓ `icons/icon-512.png`
- ✓ `css/styles.css`
- ✓ `js/*.js` (all JavaScript files)

#### 1.3 Add Service Worker (Optional but Recommended)

Create `service-worker.js` for offline support:

```javascript
// Will create this file separately
```

---

### 2. Deploy to GitHub Pages

#### 2.1 Create/Update Repository

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/_read_out_loud

# If not already a git repo
git init

# Add all files
git add .
git commit -m "Initial commit - Text Reader PWA"

# Create repo on GitHub (if not exists)
# Then push
git remote add origin https://github.com/YOUR-USERNAME/text-reader.git
git branch -M main
git push -u origin main
```

#### 2.2 Enable GitHub Pages

1. Go to: `https://github.com/YOUR-USERNAME/text-reader/settings/pages`
2. Source: **Deploy from a branch**
3. Branch: **main** → **/ (root)**
4. Click **Save**

#### 2.3 Wait for Deployment

- Check Actions tab for build status
- Usually takes 1-3 minutes
- Site will be live at: `https://YOUR-USERNAME.github.io/text-reader/`

---

### 3. Configure Custom Domain (Optional)

#### 3.1 Add CNAME File

```bash
echo "textreader.yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

#### 3.2 Update DNS Records

Add these records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | textreader | YOUR-USERNAME.github.io |

Or for apex domain (yourdomain.com):

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

#### 3.3 Enable HTTPS

In GitHub Pages settings:
- ✓ Check "Enforce HTTPS"
- Wait for SSL certificate provisioning (can take 24 hours)

---

### 4. Vercel Deployment (Alternative)

#### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 4.2 Deploy

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/_read_out_loud
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set root directory: ./
# - No build command needed (static files)
# - Output directory: ./
```

#### 4.3 Production Deployment

```bash
vercel --prod
```

**Result:** App live at `https://text-reader.vercel.app` (or custom domain)

---

### 5. Post-Deployment Testing

#### 5.1 Test Production URL

Visit your deployed URL and verify:

- [ ] **Page loads correctly**
  - No 404 errors
  - CSS and JS load
  - Icons display

- [ ] **PWA Installation**
  - Install prompt appears
  - Can add to home screen
  - Manifest loads correctly

- [ ] **Core Features**
  - File import works
  - Text-to-speech plays
  - Library saves data
  - Settings persist

- [ ] **HTTPS**
  - Lock icon in browser
  - No mixed content warnings
  - Service worker registers

#### 5.2 Test on Mobile Devices

**iOS Safari:**
```
https://YOUR-USERNAME.github.io/text-reader/
```

- [ ] Add to Home Screen
- [ ] Launch as standalone app
- [ ] Test file import
- [ ] Test offline mode

**Android Chrome:**
- [ ] Install PWA prompt
- [ ] Test all features

#### 5.3 Lighthouse Audit

Run Lighthouse in Chrome DevTools:

```bash
# Target scores
PWA: 100/100
Performance: 90+/100
Accessibility: 90+/100
Best Practices: 90+/100
SEO: 90+/100
```

---

### 6. Monitoring & Analytics (Optional)

#### 6.1 Add Google Analytics

In `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 6.2 Error Tracking

Consider:
- Sentry (error tracking)
- LogRocket (session replay)
- Plausible (privacy-friendly analytics)

---

### 7. Continuous Deployment

#### 7.1 Automatic Deployment

**GitHub Pages:** Deploys automatically on push to main branch

**Vercel:** Connect GitHub repo for auto-deployment
1. Go to https://vercel.com/dashboard
2. Import Git Repository
3. Select your repo
4. Every push → automatic deployment

#### 7.2 Deployment Workflow

```bash
# Development workflow
1. Make changes locally
2. Test with: python3 server_https.py
3. Test on iOS device
4. Commit and push:
   git add .
   git commit -m "Description of changes"
   git push
5. Wait for automatic deployment
6. Test production URL
```

---

### 8. Update Manifest for Production

Update `manifest.json` with production URLs:

```json
{
  "name": "Text Reader - Free Text-to-Speech",
  "short_name": "Text Reader",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#1E1E1E",
  "theme_color": "#1E1E1E",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**For subdirectory deployment** (e.g., `username.github.io/text-reader/`):

```json
{
  "start_url": "/text-reader/",
  "scope": "/text-reader/",
  "icons": [
    {
      "src": "/text-reader/icons/icon-192.png",
      ...
    }
  ]
}
```

---

### 9. Environment-Specific Configuration

Create a config file to handle local vs production:

**`js/config.js`:**
```javascript
const CONFIG = {
  // Auto-detect environment
  isProduction: window.location.hostname !== 'localhost',

  // Base path for assets
  basePath: window.location.hostname === 'localhost'
    ? '/'
    : '/text-reader/', // Adjust if needed

  // API endpoints (if you add backend later)
  apiUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api'
    : 'https://api.yourdomain.com'
};

window.CONFIG = CONFIG;
```

---

### 10. Pre-Launch Checklist

#### Content
- [ ] App name finalized
- [ ] Icons generated (192x192, 512x512)
- [ ] Manifest complete
- [ ] Readme/About page
- [ ] Privacy policy (if collecting data)
- [ ] Terms of service

#### Technical
- [ ] All features tested locally
- [ ] iOS testing complete
- [ ] HTTPS enabled
- [ ] Service worker working
- [ ] Offline mode functional
- [ ] No console errors
- [ ] Lighthouse scores good

#### Legal & Marketing
- [ ] Domain name registered (if custom)
- [ ] Google Search Console setup
- [ ] Social media cards (`og:image`, etc.)
- [ ] Analytics configured
- [ ] Backup strategy in place

---

### 11. Rollback Procedure

If deployment breaks:

#### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push

# Or rollback to specific commit
git reset --hard COMMIT_HASH
git push --force
```

#### Vercel
1. Go to Deployments tab
2. Find working deployment
3. Click "..." → "Promote to Production"

---

### 12. Performance Optimization

Before final deployment:

#### Minify Assets
```bash
# Install tools
npm install -g uglify-js clean-css-cli html-minifier

# Minify JavaScript
uglifyjs js/app.js -o js/app.min.js

# Minify CSS
cleancss css/styles.css -o css/styles.min.css

# Update HTML references
```

#### Optimize Images
```bash
# Install ImageOptim or use online tools
# Compress icon files without quality loss
```

#### Enable Compression
Most hosts (GitHub Pages, Vercel) enable gzip automatically.

---

### 13. Going Live

#### Final Steps
1. ✅ Complete all testing
2. ✅ Update URLs in manifest
3. ✅ Push to main branch
4. ✅ Wait for deployment
5. ✅ Test production URL
6. ✅ Submit to PWA directories (optional)

#### Promote Your App
- [ ] Share on social media
- [ ] Submit to PWA galleries:
  - https://appsco.pe
  - https://pwa-directory.appspot.com
- [ ] Add to Product Hunt
- [ ] Create demo video

---

## Deployment Comparison

| Feature | GitHub Pages | Vercel | Netlify | Custom |
|---------|--------------|--------|---------|--------|
| **Cost** | Free | Free tier | Free tier | $$$ |
| **HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto | Manual |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free | Included |
| **Build Time** | 1-3 min | < 1 min | < 1 min | Instant |
| **CDN** | ✅ Yes | ✅ Yes | ✅ Yes | Optional |
| **Serverless** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Ease of Setup** | Medium | Easy | Easy | Hard |

**Recommendation for this project:** GitHub Pages or Vercel

---

## Support & Maintenance

### Monitoring
- Check analytics weekly
- Review error logs
- Monitor uptime (uptimerobot.com)

### Updates
- Update dependencies monthly
- Test on new iOS versions
- Refresh SSL certificates (auto on most hosts)

### User Feedback
- Create feedback form
- Monitor social media
- Track feature requests

---

## Emergency Contacts

**Service Status Pages:**
- GitHub: https://www.githubstatus.com
- Vercel: https://www.vercel-status.com
- Netlify: https://www.netlifystatus.com

**Support:**
- GitHub Pages: https://docs.github.com/pages
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support

---

## Next Steps

1. Complete local testing (see [TESTING.md](TESTING.md))
2. Choose deployment platform
3. Deploy to production
4. Test production deployment
5. Share with users!

**Questions?** Check documentation or file an issue.
