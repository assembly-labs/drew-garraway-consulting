# Read Out Loud

Text-to-speech PWA that reads documents aloud. Supports TXT, PDF, and DOCX files. 100% client-side, no data leaves your device.

## Features

- Text-to-speech using Web Speech API
- Multiple voice options with speed control (0.5x - 2.5x)
- File import: TXT, PDF, DOCX
- Text library with local storage
- Installable PWA with offline support
- Dark glassmorphism UI

## Local Development

```bash
# HTTPS server (required for iOS/PWA features)
python3 server_https.py
# Open: https://localhost:8443
```

### Testing on iOS

1. Both devices on same WiFi
2. Run `python3 server_https.py` - note the IP address shown
3. On iPhone Safari: `https://[YOUR-IP]:8443`
4. Accept security warning (Advanced > Proceed)
5. Install PWA: Share > Add to Home Screen

## Deployment

Deploy to any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages).

```bash
git add . && git commit -m "Deploy" && git push
```

Config files included for Vercel, Netlify, and Cloudflare.

## Browser Support

- Chrome 33+
- Safari 14+
- Edge 79+
- iOS Safari 16+

Firefox has limited support (no Web Speech API).

## Troubleshooting

| Issue | Solution |
|-------|----------|
| File import fails on iOS | Use HTTPS (`server_https.py`) |
| PWA won't install | Must use Safari, check HTTPS |
| No audio | Check silent switch on iOS |
| PDF won't load | Needs internet (CDN) |
