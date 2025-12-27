# Deployment Guide - Can't Stop Won't Stop

## 🚀 Deploy to Netlify

### Option 1: GitHub Integration (Recommended)
1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Option 2: Drag & Drop
1. Run `npm run build` locally
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist/` folder to Netlify

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

## ✅ Pre-Deployment Checklist

- [x] All dependencies installed (`npm install`)
- [x] Build succeeds (`npm run build`)
- [x] `netlify.toml` configured
- [x] `public/_redirects` for SPA routing
- [x] Mobile-optimized viewport meta tags
- [x] LocalStorage for data persistence

## 🧪 Local Testing

```bash
# Development server
npm run dev
# Opens at http://localhost:3000

# Preview production build
npm run build
npm run preview
```

## 📱 Test on Mobile

1. Run `npm run dev`
2. Find your local IP (e.g., `192.168.1.100`)
3. Visit `http://YOUR_IP:3000` from your phone
4. Make sure you're on the same WiFi network

## 🔧 Environment Variables

None needed for MVP! Everything runs client-side.

If you add a backend later:
- Create `.env.production` for API URLs
- Add to Netlify dashboard under "Environment variables"

## 📊 Post-Deployment

After deploying:
1. Test the pause button easter egg 😈
2. Complete a workout
3. Check History page
4. Try inputting 69 reps (easter egg)
5. Test on mobile device

## 🐛 Troubleshooting

**404 on refresh?**
- Verify `_redirects` file exists in `public/`
- Check Netlify build logs for routing config

**White screen?**
- Check browser console for errors
- Verify all imports are correct
- Test `npm run build` locally first

**Timer not working?**
- Test in incognito (some extensions block timers)
- Check console for JavaScript errors

## 🎯 Performance

Current build size:
- Total: ~216 KB (gzipped: ~68 KB)
- CSS: 16 KB
- JS: 200 KB

Excellent for mobile - loads in <2s on 4G.

## 🔐 Security

- No backend = No API keys to expose
- LocalStorage only (user data never leaves browser)
- All client-side = No server vulnerabilities

---

**Deploy it. Use it. Don't stop. Won't stop.** 💪
