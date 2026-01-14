# TOMO Voice - Project Context for Claude

## What This Is

TOMO Voice is a mobile-first voice-to-text web app for recording BJJ training notes. It uses OpenAI Whisper for transcription and is designed for quick, post-training voice memos.

**Primary use case:** Recording BJJ technique notes with mixed English + Brazilian Portuguese terminology (berimbolo, de la riva, ashi garami, kimura, etc.)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | CSS Variables (TOMO design system) |
| Backend | Cloudflare Pages Functions |
| Transcription | OpenAI Whisper API |
| Deployment | Cloudflare Pages |

---

## Project Structure

```
TOMO_voice/
├── src/
│   ├── components/       # React components
│   │   ├── Icons.tsx
│   │   ├── RecordButton.tsx
│   │   ├── TranscriptionCard.tsx
│   │   ├── Toast.tsx
│   │   └── PermissionScreen.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useAudioRecorder.ts
│   │   └── useTranscriptions.ts
│   ├── services/         # API services
│   │   └── transcription.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   └── index.css         # TOMO design system
├── functions/            # Cloudflare Pages Functions
│   └── api/
│       └── transcribe.ts # OpenAI Whisper proxy
├── public/
├── wrangler.toml
├── package.json
└── CLAUDE.md
```

---

## Design System

This project inherits the TOMO design system. Key tokens:

### Colors
- Background: `#111111` (--color-black)
- Text: `#FFFFFF` (--color-white)
- Accent: `#F5A623` (--color-gold)
- Recording: `#ef4444` (--color-negative)
- Success: `#22c55e` (--color-positive)

### Typography
- Headlines: Unbounded (700-800 weight)
- Body: Inter (500+ weight - weight 400 is PROHIBITED)
- Labels: JetBrains Mono
- Minimum font size: 12px

### Design Rules (Non-Negotiable)
1. **NO EMOJIS** - Use SVG icons only
2. **Dark theme only** - #111111 background
3. **Font weight 500+** - Never use weight 400
4. **44px minimum touch targets** - 80px for primary actions
5. **Mobile-first** - Max width 430px

---

## Commands

```bash
# Development
npm run dev           # Start Vite dev server
npm run dev:cf        # Start with Cloudflare Pages Functions (build first)

# Build
npm run build         # Build for production

# Deploy
npm run deploy        # Build and deploy to Cloudflare Pages

# Lint
npm run lint          # Run ESLint
```

---

## Environment Variables

Set via Cloudflare dashboard or wrangler:

```bash
# Set OpenAI API key as a secret
wrangler pages secret put OPENAI_API_KEY
```

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for Whisper | Yes |

---

## Local Development

1. Build the frontend: `npm run build`
2. Start with Pages Functions: `npm run dev:cf`
3. For frontend-only dev: `npm run dev`

Note: The `/api/transcribe` endpoint requires the OpenAI API key. For local testing with the full flow, you need to set the secret locally:

```bash
echo "OPENAI_API_KEY=sk-..." > .dev.vars
```

---

## Deployment

### First-time setup

1. Create the Cloudflare Pages project:
   ```bash
   wrangler pages project create tomo-voice
   ```

2. Set the OpenAI API key:
   ```bash
   wrangler pages secret put OPENAI_API_KEY --project-name=tomo-voice
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Custom Domain

After first deploy, add custom domain in Cloudflare dashboard:
- Go to Pages > tomo-voice > Custom domains
- Add `voice.drewgarraway.com`

---

## Cost Estimates

| Service | Usage | Cost |
|---------|-------|------|
| OpenAI Whisper | ~6-7 min/day | ~$1.20/month |
| Cloudflare Pages | Free tier | $0 |
| **Total** | | **~$1-2/month** |

---

## Audio Recording Notes

- Safari uses `audio/mp4`, Chrome uses `audio/webm`
- MediaRecorder API handles format detection automatically
- iOS requires user gesture to start recording
- Recording state persists until explicitly stopped

---

## Related Projects

- **TOMO** (`/TOMO/`) - Main BJJ training journal app
- Design system source: `/TOMO/docs/design-system/`
