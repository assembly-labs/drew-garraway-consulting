# 🚀 DEPLOYMENT INSTRUCTIONS - NETLIFY ONLY

## Quick Deploy Steps

### 1. Push to GitHub:
```bash
git add .
git commit -m "Deploy: Librarian LLM with dark mode and secure API"
git push origin main
```

### 2. Netlify Auto-Deploy:
- Already connected to your GitHub repo
- Will automatically build and deploy when you push
- Watch the deploy progress at: https://app.netlify.com

### 3. Verify Deployment:
- Check your Netlify URL (e.g., https://librarian-llm.netlify.app)
- Test search functionality (should connect to Claude API)
- Test dark mode toggle (should persist on refresh)
- Verify API calls go through `/api/claude-chat` (check Network tab)

---

## Configuration Summary

### Build Settings:
- **Base directory:** `librarian-llm`
- **Build command:** `npm run build`
- **Publish directory:** `librarian-llm/dist`
- **Functions directory:** `librarian-llm/netlify/functions`

### Environment Variables:
- **Key:** `claude_api_key` (lowercase)
- **Value:** Your Anthropic API key
- **Location:** Netlify Dashboard → Site Settings → Environment Variables

### Vite Configuration:
- **Base path:** `/` (root - no subdirectory)
- **Build output:** `dist/`
- **Source maps:** Enabled for debugging

---

## Custom Domain Setup (Optional)

To use `drewgarraway.com/librarian-llm`:

### Option A: Subdomain (Recommended)
1. Create subdomain: `librarian.drewgarraway.com`
2. Add CNAME record pointing to `[your-site].netlify.app`
3. Configure in Netlify: Site Settings → Domain Management

### Option B: Path-based Routing
1. Use Netlify's redirect rules
2. More complex - requires proxy configuration
3. Subdomain approach is simpler and cleaner

---

## Deployment Verification Checklist

After deployment, verify:

- [ ] Site loads at Netlify URL
- [ ] Search functionality works (returns book results)
- [ ] Dark mode toggle works and persists
- [ ] No API key visible in source code (check DevTools)
- [ ] Network requests go to `/api/claude-chat`
- [ ] Mobile responsive layout works
- [ ] No console errors in browser
- [ ] Build succeeded in Netlify dashboard

---

## Troubleshooting

### If deployment fails:
1. Check Netlify build logs for errors
2. Verify `claude_api_key` environment variable is set
3. Ensure all dependencies are in package.json
4. Check that functions directory path is correct

### If API calls fail:
1. Verify environment variable name is `claude_api_key` (lowercase)
2. Check that API key is valid and not revoked
3. Look at Function logs in Netlify dashboard
4. Test locally with `npm run dev:netlify`

---

## Important Notes

- **GitHub Pages deployment has been removed** in favor of Netlify
- **Base path is now `/`** (not `/librarian-llm/`)
- **API key is secure** in Netlify environment variables
- **Automatic deployments** trigger on push to main branch

---

## Support

- **Netlify Docs:** https://docs.netlify.com
- **Build Issues:** Check Netlify Dashboard → Deploys → Build Log
- **Function Issues:** Check Netlify Dashboard → Functions → Logs
- **Environment Variables:** Site Settings → Environment Variables

---

*Last Updated: October 7, 2025*
*Deployment Strategy: Netlify with Serverless Functions*