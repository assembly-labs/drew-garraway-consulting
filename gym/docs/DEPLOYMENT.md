# Deployment Guide

## Netlify Deployment Options

### Option 1: Drag & Drop (Fastest - 2 minutes)

Perfect for quick testing and first deployment.

**Steps:**
1. Build the app locally:
   ```bash
   cd prototype
   npm run build
   ```
   This creates a `dist/` folder with optimized files.

2. Go to https://app.netlify.com/drop

3. Drag the entire `prototype/dist` folder onto the page

4. Netlify will deploy instantly and give you a URL like:
   `https://random-name-123456.netlify.app`

5. **Test it at the gym!**

**Pros:** Instant, no setup
**Cons:** Manual process each time, random URL

---

### Option 2: GitHub Auto-Deploy (Recommended)

Set this up once, then every `git push` automatically deploys.

**Initial Setup (5 minutes):**

1. **Push your code to GitHub** (if not already there):
   ```bash
   git add .
   git commit -m "Setup Netlify deployment"
   git push origin main
   ```

2. **Log in to Netlify**: https://app.netlify.com

3. **Click "Add new site"** → "Import an existing project"

4. **Choose GitHub** and authorize Netlify to access your repos

5. **Select your repository**: `drew-garraway-consulting/cantstopwontstop`

6. **Configure build settings:**
   - **Base directory:** `prototype`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

   (Should auto-detect from `netlify.toml`)

7. **Click "Deploy site"**

8. **Wait 1-2 minutes** for first build

9. **Done!** You'll get a URL like: `https://cantstopwontstop.netlify.app`

**After Setup:**
- Every `git push` → Auto-deploys in ~1 minute
- Pull requests → Get preview URLs for testing
- Easy rollback to previous versions

---

### Customizing Your Site Name

By default, Netlify gives you a random name. To customize:

1. Go to **Site settings** → **Domain management**
2. Click **Options** → **Edit site name**
3. Change to something like: `cantstopwontstop`
4. Your URL becomes: `https://cantstopwontstop.netlify.app`

---

### Using Your Bluehost Domain (Optional)

If you want to use your own domain later:

1. In Netlify: **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `cantstopwontstop.com`)
4. Netlify provides DNS records to add in Bluehost
5. Go to Bluehost DNS settings and add those records
6. Netlify auto-provisions SSL certificate (HTTPS)
7. Wait 24-48 hours for DNS propagation

You can keep both the Netlify subdomain and custom domain active.

---

### Environment Variables

If you need to add secrets (API keys, etc.) later:

1. In Netlify: **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add key-value pairs
4. Trigger a new deploy to apply

Currently, the app uses local storage only, so no environment variables needed yet.

---

## Testing Before Deploy

**Build and preview locally:**
```bash
cd prototype
npm run build
npm run preview
```

**Test on mobile before deploying:**
```bash
npm run preview:mobile
```
Visit the displayed IP on your phone to test the production build.

---

## Monitoring & Analytics

### Netlify Dashboard
- Deploy logs and build times
- Traffic overview
- Error monitoring

### Google Analytics (Optional - Free)

**To add Google Analytics:**

1. Create account at https://analytics.google.com
2. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
3. Add to `prototype/index.html` before `</head>`:

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

4. Deploy and start tracking!

**What you'll see:**
- Page views
- Active users
- Device types (mobile vs desktop)
- Session duration
- Geographic location

---

## Troubleshooting

### Build fails on Netlify
- Check build logs in Netlify dashboard
- Make sure `package.json` has all dependencies
- Try building locally first: `npm run build`

### Site loads but looks broken
- Check browser console for errors
- Verify `base` path in `vite.config.ts` is `./`
- Check redirects in `netlify.toml`

### Changes not appearing
- Hard refresh: Cmd/Ctrl + Shift + R
- Check you're deploying the right branch
- Wait 1-2 minutes for CDN cache to clear

---

## Quick Reference

| Task | Command |
|------|---------|
| Local dev | `npm run dev` |
| Local dev (mobile) | `npm run dev:mobile` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Type check | `npm run type-check` |
| Clean build | `npm run clean` |

**Netlify Dashboard:** https://app.netlify.com
