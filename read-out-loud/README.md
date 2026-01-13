# Read Out Loud

Text-to-speech PWA that reads documents aloud. Supports TXT, PDF, and DOCX files. 100% client-side, no data leaves your device.

**Live:** https://read-out-loud.pages.dev

## Features

- Text-to-speech with two engine options:
  - **Browser** (default) - Free, works offline
  - **Google Cloud TTS** - Premium neural voices (WaveNet, Neural2)
- Multiple voice options with speed control (0.5x - 2.5x)
- File import: TXT, PDF, DOCX
- Text library with local storage
- Installable PWA with offline support
- Dark glassmorphism UI

## Google Cloud TTS Setup (Optional)

Get premium-quality voices with 1M characters/month FREE:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project and enable **Cloud Text-to-Speech API**
3. Create an API key (APIs & Services > Credentials > Create Credentials > API Key)
4. Restrict the key:
   - API restrictions: Cloud Text-to-Speech API only
   - Website restrictions: `https://read-out-loud.pages.dev/*`, `http://localhost/*`
5. In the app: Click Settings (gear icon) > Select "Google Cloud" > Paste your API key

Your API key is stored locally in your browser - never sent anywhere except Google's API.

## Local Development

```bash
# Basic HTTP server
python3 -m http.server 8080
# Open: http://localhost:8080

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

Hosted on Cloudflare Pages with auto-deploy on push to main.

```bash
# Manual deploy
wrangler pages deploy . --project-name read-out-loud

# Or just push to main
git add . && git commit -m "Deploy" && git push
```

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
| PDF won't load | Needs internet first time (CDN libraries) |
| Google TTS not working | Check API key restrictions, ensure TTS API is enabled |
