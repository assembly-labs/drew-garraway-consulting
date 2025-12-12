# Deployment Guide - Librarian LLM

## 🚀 Production Deployment to drewgarraway.com

This project is configured for deployment at https://drewgarraway.com/librarian-llm/

### URLs
- **Live Demo:** https://drewgarraway.com/librarian-llm/
- **Repository:** https://github.com/assembly-labs/drew-garraway-consulting
- **Project Path:** `/librarian-llm`

## 🔧 Simple Deployment Steps

### Step 1: Build the Project

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/librarian-llm
npm install  # If dependencies not installed
npm run build
```

This creates a `dist/` folder with your production-ready files.

### Step 2: Upload to Your Server

1. Take everything inside the `dist/` folder
2. Upload it to your server's `/librarian-llm/` directory
3. That's it! The app will work at https://drewgarraway.com/librarian-llm/

### Upload Methods:
- **FTP/SFTP:** Use FileZilla or similar to upload `dist/*` to `/librarian-llm/`
- **SSH/SCP:** `scp -r dist/* user@drewgarraway.com:/path/to/librarian-llm/`
- **cPanel:** Use File Manager to upload to the `/librarian-llm/` folder
- **Hosting Dashboard:** Use your hosting provider's file upload interface

## 📋 Prerequisites

1. GitHub account with repository access
2. Node.js 16+ installed locally
3. Git configured on your machine

## 🔧 Deployment Steps

### Step 1: Build the Project

From the librarian-llm directory:

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/librarian-llm
npm install  # If dependencies not installed
npm run build
```

This creates a `dist/` folder with the production build.

### Step 2: Commit Changes

From the repository root:

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting
git add .
git commit -m "Deploy librarian-llm v1.0.0"
git push origin main
```

### Step 3: Configure GitHub Pages

1. Go to: https://github.com/assembly-labs/drew-garraway-consulting/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Choose branch: `main`
4. Choose folder: `/ (root)`
5. Click "Save"

### Step 4: Deploy the Built Files

Since this is a subdirectory project, you'll need to:

1. Copy the contents of `librarian-llm/dist/` to a `docs/librarian-llm/` folder in the repo root
2. OR use GitHub Actions (see below)

```bash
# From repository root
mkdir -p docs/librarian-llm
cp -r librarian-llm/dist/* docs/librarian-llm/
git add docs/
git commit -m "Deploy librarian-llm to GitHub Pages"
git push origin main
```

## 🤖 Automated Deployment with GitHub Actions

Create `.github/workflows/deploy-librarian.yml` in your repository root:

```yaml
name: Deploy Librarian LLM

on:
  push:
    branches: ['main']
    paths:
      - 'librarian-llm/**'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install and Build
        run: |
          cd librarian-llm
          npm ci
          npm run build

      - name: Deploy to GitHub Pages folder
        run: |
          mkdir -p docs/librarian-llm
          cp -r librarian-llm/dist/* docs/librarian-llm/

      - name: Commit and Push
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add docs/
          git diff --quiet && git diff --staged --quiet || git commit -m "Deploy librarian-llm"
          git push
```

## ⚠️ Important Security Notes

### API Key Protection

**WARNING:** GitHub Pages is public static hosting. Your API key will be visible in the browser if included in the code.

#### For Demo/Development:
1. Create a restricted API key in Anthropic Console
2. Set rate limits and usage caps
3. Only use for demonstration purposes

#### For Production:
Consider these alternatives:
1. **Backend Proxy:** Create a simple backend service that holds the API key
2. **Serverless Function:** Use Vercel/Netlify functions to proxy API calls
3. **User-Provided Keys:** Let users input their own API keys

### Current Setup:
The app expects users to provide their own API key via a `.env` file locally. For the GitHub Pages demo, you'll need to:

1. Modify the code to accept API keys via UI input, OR
2. Create a demo-only key with strict limits

## 🧪 Post-Deployment Testing

After deployment, test these features:

- [ ] Page loads at the correct URL
- [ ] Search functionality works (if API key configured)
- [ ] Mobile responsive design
- [ ] Book cards display properly
- [ ] Error messages appear correctly
- [ ] Assets (CSS/JS) load without 404 errors

## 🔄 Updating the Deployment

To update the deployed version:

1. Make changes in the `librarian-llm/` directory
2. Run `npm run build`
3. Copy new build to `docs/librarian-llm/`
4. Commit and push

## 📝 Troubleshooting

### Common Issues:

1. **404 Errors on Assets:**
   - Check that `base` in `vite.config.ts` matches your repository structure
   - Current setting: `/drew-garraway-consulting/librarian-llm/`

2. **Page Not Loading:**
   - Verify GitHub Pages is enabled in repository settings
   - Check that the build was successful
   - Wait 5-10 minutes for GitHub Pages to update

3. **API Not Working:**
   - Remember: API keys in frontend code are visible to users
   - Check browser console for specific error messages
   - Verify API key has proper permissions

## 🎯 Alternative Deployment Options

### Vercel (Recommended for Production)
- Automatic HTTPS
- Environment variable support
- Serverless functions for API key protection

### Netlify
- Similar to Vercel
- Good free tier
- Easy drag-and-drop deployment

### Self-Hosted
- Full control over environment
- Can properly secure API keys
- Requires server management

## 📞 Support

For deployment issues, check:
1. GitHub Pages documentation
2. Vite deployment guide
3. Repository issues section

---

Last updated: October 2024
Version: 1.0.0