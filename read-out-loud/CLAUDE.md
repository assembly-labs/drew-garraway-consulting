# Read Out Loud - Claude Context

## What This Is

Text-to-speech PWA that reads documents aloud. Supports TXT, PDF, and DOCX files with adjustable playback speed, multiple voices, and a text library. 100% client-side, no data leaves the device.

**Live URL:** https://read-out-loud.pages.dev

## Tech Stack

- **Framework:** Vanilla JavaScript (no build step)
- **Styling:** Custom CSS (glassmorphism, dark theme)
- **APIs:** Web Speech API
- **Deployment:** Cloudflare Pages (auto-deploy on push to main)

## Project Structure

```
read-out-loud/
├── index.html          # Main application
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline support)
├── wrangler.toml       # Cloudflare Pages config
├── _headers            # Cloudflare response headers
├── _redirects          # URL redirects
├── js/
│   ├── app.js          # App orchestration
│   ├── ui.js           # UI interactions
│   ├── speech.js       # Web Speech API wrapper
│   ├── storage.js      # LocalStorage management
│   └── fileImport.js   # PDF/DOCX/TXT parsing
├── css/
│   └── styles.css      # Glassmorphism styles
└── icons/
    ├── icon-192.png    # PWA icon
    ├── icon-512.png    # PWA splash
    └── icon.svg        # Source vector
```

## Commands

No build step required. For local development:

| Command | Purpose |
|---------|---------|
| `python3 -m http.server 8080` | HTTP server (basic testing) |
| `python3 server_https.py` | HTTPS server (required for iOS/PWA) |

Deploy to Cloudflare Pages:
```bash
wrangler pages deploy . --project-name read-out-loud
```

## Key Patterns

- Offline-first via service worker caching
- All data stored in localStorage (private, no backend)
- HTTPS required for iOS file imports and PWA installation
- Glassmorphism UI with gradient animations
- English voices only (filtered and scored by quality)

## External Dependencies

Loaded dynamically from CDN (cached by service worker):
- PDF.js 3.11.174 - PDF text extraction
- Mammoth.js 1.6.0 - DOCX text extraction

## Browser Support

- Chrome 33+, Safari 14+, Edge 79+, iOS Safari 16+
- Firefox: Limited (no Web Speech API)
