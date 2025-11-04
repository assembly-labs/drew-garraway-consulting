# Librarian LLM - Deployment Ready 🚀

## Overview
All four Librarian LLM websites are prepared and ready for deployment. This document provides complete instructions for deploying each component.

## Components Ready for Deployment

### 1. Main Application - Librarian LLM
**Location:** `/librarian-llm/`
**Build Status:** ✅ Production build complete
**Deployment Platform:** Netlify
**Technology:** React + Vite + TypeScript + Tailwind CSS

### 2. Investor Website
**Location:** `/_LIBLLM_investors/`
**Build Status:** ✅ Static HTML ready
**Deployment Platform:** Any static host (Netlify, Vercel, GitHub Pages)
**Technology:** Static HTML + CSS

### 3. Librarian Cohort Website
**Location:** `/_LIBLLM_librarian-cohort/`
**Build Status:** ✅ Static HTML ready
**Deployment Platform:** Any static host (Netlify, Vercel, GitHub Pages)
**Technology:** Static HTML + CSS

### 4. Design System Showcase
**Location:** `/librarian-llm/librarian-llm-design-system/`
**Build Status:** ✅ Static HTML ready
**Deployment Platform:** Any static host (Netlify, Vercel, GitHub Pages)
**Technology:** Static HTML + Tailwind CDN

---

## Deployment Instructions

### Option A: Deploy to Netlify (Recommended)

#### Main Application (librarian-llm)

1. **Prerequisites:**
   - Netlify account
   - GitHub repository connected
   - Claude API key ready

2. **Environment Variables (Netlify Dashboard):**
   ```
   CLAUDE_API_KEY=your-anthropic-api-key-here
   NODE_VERSION=22
   ```

3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

4. **Deploy Steps:**
   ```bash
   # From librarian-llm directory
   git add .
   git commit -m "Production build ready"
   git push origin main
   ```

   Netlify will automatically build and deploy.

#### Static Websites (Investor, Cohort, Design System)

**Method 1: Drag and Drop**
1. Go to https://app.netlify.com/drop
2. Drag the folder containing index.html
3. Site deployed instantly

**Method 2: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy investor site
cd _LIBLLM_investors
netlify deploy --prod --dir .

# Deploy cohort site
cd _LIBLLM_librarian-cohort
netlify deploy --prod --dir .

# Deploy design system
cd librarian-llm/librarian-llm-design-system
netlify deploy --prod --dir .
```

---

### Option B: Deploy to Vercel

#### Main Application
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd librarian-llm
   vercel --prod
   ```

3. **Add Environment Variable:**
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Add `CLAUDE_API_KEY`

#### Static Websites
```bash
# Deploy each static site
vercel --prod
```

---

### Option C: Deploy to GitHub Pages

#### Static Websites Only
(Note: Main app requires serverless functions, use Netlify/Vercel)

1. **Create separate repositories for each site**

2. **Enable GitHub Pages:**
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main / root

3. **Push files:**
   ```bash
   git add .
   git commit -m "Deploy website"
   git push origin main
   ```

---

## Critical Security Notes

### ⚠️ IMPORTANT: API Key Security
1. **NEVER commit `.env` file to git**
   - Already in .gitignore ✅
   - Contains sensitive API key

2. **Production API Key:**
   - Must be set in hosting platform's environment variables
   - Never hardcode in source files
   - Rotate regularly

3. **Check before deploying:**
   ```bash
   # Ensure no secrets in git history
   git ls-files | xargs grep -l "sk-ant"
   ```

---

## Post-Deployment Checklist

### Main Application
- [ ] API key configured in environment variables
- [ ] Claude API connection working
- [ ] Search functionality operational
- [ ] All pages loading correctly
- [ ] Responsive design working
- [ ] Dark/light mode toggle working

### Investor Website
- [ ] All sections visible
- [ ] Animations working
- [ ] Contact information correct
- [ ] Links functional

### Cohort Website
- [ ] Registration form working
- [ ] Content displaying correctly
- [ ] Social links functional

### Design System
- [ ] Day mode colors displaying
- [ ] Night mode colors displaying
- [ ] Interactive components working
- [ ] Typography examples loading

---

## Domain Configuration

### Recommended URL Structure
- Main App: `app.librarianllm.com` or `librarianllm.com`
- Investor Site: `investors.librarianllm.com`
- Cohort Site: `cohort.librarianllm.com`
- Design System: `design.librarianllm.com`

### DNS Settings (Netlify)
```
Type: CNAME
Name: app (or @ for root)
Value: [your-site].netlify.app
```

---

## Monitoring & Maintenance

### Performance Monitoring
- Enable Netlify Analytics
- Set up Google Analytics (optional)
- Monitor API usage in Anthropic dashboard

### Regular Updates
- Update dependencies monthly
- Review and rotate API keys quarterly
- Monitor error logs weekly

---

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
1. Verify API key in environment variables
2. Check Netlify function logs
3. Test with: `npm run test:api`

### Deployment Issues
```bash
# Validate deployment
npm run validate

# Test locally
npm run preview
```

---

## Support Resources

- Netlify Docs: https://docs.netlify.com
- Vercel Docs: https://vercel.com/docs
- Anthropic API: https://docs.anthropic.com
- Project Repository: [Your GitHub URL]

---

## Status Summary

| Component | Build Status | Ready to Deploy | Notes |
|-----------|-------------|-----------------|-------|
| Main App | ✅ Built | ✅ Yes | Requires API key in env vars |
| Investor Site | ✅ Ready | ✅ Yes | Static HTML |
| Cohort Site | ✅ Ready | ✅ Yes | Static HTML |
| Design System | ✅ Ready | ✅ Yes | Static HTML |

---

**Last Updated:** November 3, 2025
**Version:** 1.0.0
**Status:** 🟢 READY FOR PRODUCTION DEPLOYMENT