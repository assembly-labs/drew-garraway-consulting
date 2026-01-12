# Read Out Loud - Claude Context

## What This Is

Text-to-speech PWA that reads documents aloud. Supports TXT, PDF, and DOCX files with adjustable playback speed, multiple voices, and a text library. 100% client-side, no data leaves the device.

## Tech Stack

- **Framework:** Vanilla JavaScript
- **Styling:** Custom CSS (glassmorphism, dark theme)
- **APIs:** Web Speech API
- **Deployment:** PWA (Netlify, Vercel, or Cloudflare)

## Key Files

- `index.html` - Main application
- `js/app.js` - Main application logic
- `js/speech.js` - Text-to-speech functionality
- `js/storage.js` - Local storage management
- `js/fileImport.js` - File import handling
- `sw.js` - Service worker for offline support
- `manifest.json` - PWA manifest

## Commands

No build step required. For local development:

| Command | Purpose |
|---------|---------|
| `python3 -m http.server 8080` | HTTP server (basic testing) |
| `python3 server_https.py` | HTTPS server (required for iOS/PWA) |

## Key Patterns

- Offline-first via service worker caching
- All data stored in localStorage (private, no backend)
- HTTPS required for iOS file imports and PWA installation
- Glassmorphism UI with gradient animations
