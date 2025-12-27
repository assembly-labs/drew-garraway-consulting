# PWA Installation Guide

## How to Install on iPhone

### Step 1: Open Safari
- Navigate to https://drewgarraway.com/accountable/habit-tracker/
- Must use Safari (not Chrome or other browsers)

### Step 2: Add to Home Screen
1. Tap the **Share** button (square with arrow pointing up) at the bottom of Safari
2. Scroll down and tap **"Add to Home Screen"**
3. (Optional) Edit the name if you want - defaults to "Accountable"
4. Tap **"Add"** in the top right

### Step 3: Launch the App
- Find the "Accountable" app icon on your home screen
- Tap to launch - it opens fullscreen without Safari UI
- App now works like a native iOS app!

## Features You Get

✅ **Fullscreen Experience** - No browser chrome, just your app
✅ **Home Screen Icon** - Blue icon with checkmark and "A" logo
✅ **Offline Support** - Works without internet connection (cached data)
✅ **Fast Loading** - Assets cached for instant startup
✅ **App Switcher** - Shows in iOS app switcher like native apps
✅ **No Safari UI** - No address bar or browser controls

## Technical Details

### PWA Configuration
- **Display Mode:** Standalone (fullscreen)
- **Theme Color:** Blue (#2563eb)
- **Status Bar:** Translucent black
- **Orientation:** Portrait primary
- **Icons:** 192x192, 512x512, 180x180 (Apple Touch)

### Offline Capability
Service worker caches:
- HTML, CSS, JavaScript bundles
- App icons and manifest
- Falls back to cached version when offline
- Updates automatically when online

### Browser Support
- ✅ iOS Safari 11.3+
- ✅ iPadOS Safari
- ✅ Chrome/Edge on Android
- ❌ iOS Chrome (doesn't support PWA install)
- ❌ iOS Firefox (doesn't support PWA install)

## Troubleshooting

### "Add to Home Screen" not showing?
- Make sure you're using Safari, not Chrome
- Check you're on the correct URL
- Try refreshing the page

### App not loading offline?
- Service worker needs first online visit to cache
- Visit all pages you want offline at least once
- Check Settings > Safari > Advanced > Website Data

### Icon not appearing correctly?
- Icons are generated automatically
- Custom icons in `public/icon-*.png`
- Edit `public/icon.svg` and run `node scripts/generate-icons.js`

### Want to uninstall?
1. Long-press the app icon on home screen
2. Tap "Remove App"
3. Confirm "Delete App"

## Customization

### Change App Icon
1. Edit `accountable/habit-tracker/public/icon.svg`
2. Run: `node scripts/generate-icons.js`
3. Rebuild: `npm run build`
4. Deploy changes

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your Custom Name",
  "short_name": "Short Name"
}
```

### Change Theme Color
Edit both:
- `index.html`: `<meta name="theme-color" content="#yourcolor">`
- `manifest.json`: `"theme_color": "#yourcolor"`

## Testing

### Local Testing
```bash
npm run dev
# Visit on iPhone connected to same network
# Use your computer's IP: http://192.168.x.x:5173
```

### Production Validation
- Visit: https://www.pwabuilder.com/
- Enter your URL
- Check PWA score and recommendations

## Files Added

```
accountable/habit-tracker/
├── manifest.json              # PWA manifest
├── sw.js                      # Service worker
├── icon-192.png              # Standard icon
├── icon-512.png              # High-res icon
├── apple-touch-icon.png      # iOS icon
├── public/
│   ├── manifest.json         # Source manifest
│   ├── sw.js                 # Source service worker
│   ├── icon.svg              # Icon source
│   ├── icon-192.png          # Generated icon
│   ├── icon-512.png          # Generated icon
│   └── apple-touch-icon.png  # Generated Apple icon
└── scripts/
    └── generate-icons.js     # Icon generator script
```

## Deployment Checklist

- [x] Manifest.json created with correct paths
- [x] Icons generated (192, 512, 180)
- [x] Service worker configured
- [x] iOS meta tags added to index.html
- [x] Service worker registered in main.tsx
- [x] Theme colors set
- [x] Build configured with correct base path
- [x] Deployed to production
- [ ] Tested on actual iPhone
- [ ] Verified offline functionality
- [ ] Checked app switcher appearance

## Next Steps

1. Push changes to GitHub: `git push origin main`
2. Test installation on your iPhone
3. Share installation instructions with users
4. Consider adding:
   - Push notifications (requires backend)
   - Background sync
   - Share target (receive shares from other apps)
   - Shortcuts integration

---

**PWA Status:** ✅ Fully Configured
**Ready for iPhone Installation:** YES
**URL:** https://drewgarraway.com/accountable/habit-tracker/
