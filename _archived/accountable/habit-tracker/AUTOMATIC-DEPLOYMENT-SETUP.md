# 🚀 Automatic Deployment Setup for Cloudflare Pages

## Current Setup Status
✅ **Manual deployment is working**
❌ **Automatic deployment needs to be configured**

## Option 1: GitHub Integration (Recommended)
This will automatically deploy every time you push to GitHub.

### Steps to Setup:

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to: Workers & Pages → Your Pages → `accountable-habit-tracker`

2. **Connect GitHub Repository**
   - Click "Settings" → "Builds & deployments"
   - Click "Connect to GitHub"
   - Authorize Cloudflare to access your GitHub
   - Select repository: `assembly-labs/drew-garraway-consulting`

3. **Configure Build Settings**
   ```
   Framework preset: None
   Build command: cd accountable/habit-tracker && npm install && npm run build
   Build output directory: accountable/habit-tracker/dist
   Root directory: /
   Production branch: main
   ```

4. **Environment Variables**
   - None needed for this project

5. **Save and Deploy**
   - Click "Save and Deploy"
   - Future pushes to `main` will auto-deploy

## Option 2: GitHub Actions (Alternative)

Create `.github/workflows/deploy.yml` in the repository root:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
    paths:
      - 'accountable/habit-tracker/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install and Build
        working-directory: ./accountable/habit-tracker
        run: |
          npm ci
          npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: accountable-habit-tracker
          directory: ./accountable/habit-tracker/dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN`: Create at https://dash.cloudflare.com/profile/api-tokens
- `CLOUDFLARE_ACCOUNT_ID`: Found in Cloudflare dashboard

## Option 3: Manual Deploy Command (Current Method)

Run from the `accountable/habit-tracker` folder:
```bash
npm run deploy:production
```

Or directly:
```bash
npm run build
npx wrangler pages deploy dist --project-name=accountable-habit-tracker --branch=main
```

## Important Considerations

### Project Structure
```
drew-garraway-consulting/ (GitHub repo root)
├── accountable/
│   └── habit-tracker/ (Your app - gets deployed)
├── other-projects/
└── drewgarraway.com files
```

### Why Separate Deployment?
- Your habit tracker is in a subfolder of the main repo
- Cloudflare Pages deployment is configured for just this app
- Main domain (drewgarraway.com) can be hosted elsewhere
- This keeps the habit tracker independent and on Pages' free tier

### URLs After Setup
- **Cloudflare Pages URL:** https://accountable-habit-tracker.pages.dev
- **Custom Domain (optional):** You could add a subdomain like `habits.drewgarraway.com`

### To Add Custom Domain:
1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add domain: `habits.drewgarraway.com` (or your choice)
4. Follow DNS configuration instructions

## Testing Deployment
After setting up automatic deployment:
1. Make a small change to any file in `accountable/habit-tracker/`
2. Commit and push to GitHub
3. Check Cloudflare Pages dashboard for deployment status
4. Visit your URLs to confirm update

## Troubleshooting
- **Build fails:** Check build command includes `cd accountable/habit-tracker`
- **Wrong files deployed:** Verify build output directory is `accountable/habit-tracker/dist`
- **Not triggering:** Ensure GitHub integration has correct permissions