# CareerChat Bot

An AI-powered career chatbot that answers questions about Drew Garraway's professional experience, skills, and background.

## Features

- 💬 **Interactive Chat** - Powered by Claude 3.5 Sonnet via Cloudflare Worker proxy
- 🎯 **Smart Filtering** - Client-side keyword filter blocks off-topic questions before API call
- 📄 **Dual Resume Display** - Abbreviated version for users, full version for AI context
- 🔒 **Secure API** - Cloudflare Worker proxy keeps API key server-side
- ⚡ **Token Optimized** - Only sends last 10 messages, max 150 tokens per response
- 📏 **Strict Constraints** - 60-word limit, source citations required
- 🔗 **Shareable URL** - Copy-to-clipboard functionality
- 🎨 **Gradient Design** - Matches drewgarraway.com design system
- 📱 **Fully Responsive** - Mobile and desktop optimized

## Setup

### 1. Install Dependencies

```bash
cd career-chat
npm install
```

### 2. Configure API Key

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Get your Anthropic API key from: https://console.anthropic.com/

3. Add your key to `.env`:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

### 3. Add Your Resume Content

Edit `src/data/resume.md` with your career information in Markdown format.

## Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/career-chat/`

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder, configured for deployment at `/career-chat/` subdirectory.

## Deployment

**📖 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions**

**⚡ See [QUICK_START.md](./QUICK_START.md) for checklist**

### Quick Overview

1. **Deploy Cloudflare Worker** (API proxy)
   - Upload `worker/worker.js`
   - Add secret: `ANTHROPIC_API_KEY`

2. **Deploy Cloudflare Pages** (frontend)
   - Upload `dist/` folder contents
   - Add env var: `VITE_WORKER_URL`

3. **Test deployment**
   - Career question should work
   - Off-topic question should redirect

## Project Structure

```
career-chat/
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ResumeDisplay.tsx
│   │   └── ShareButton.tsx
│   ├── services/            # API and utilities
│   │   ├── claudeApi.ts
│   │   └── markdownParser.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── data/                # Content
│   │   └── resume.md
│   ├── App.tsx              # Main app
│   ├── App.css              # Styling
│   └── index.tsx            # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

## Technology Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **AI:** Anthropic Claude API
- **Styling:** Custom CSS with gradient design system
- **Markdown:** react-markdown with remark-gfm

## Architecture

### Security
- ✅ **API key stored server-side** in Cloudflare Worker environment variables
- ✅ **No client-side API exposure** - all calls proxied through Worker
- ✅ **CORS properly configured** for secure cross-origin requests

### Token Optimization
- ✅ **Client-side keyword filtering** - blocks off-topic questions before API call
- ✅ **Conversation history trimming** - only sends last 10 messages max
- ✅ **Strict token limit** - max_tokens: 150 per response
- ✅ **Resume in system prompt** - sent once, not repeated per message

### Response Constraints
- ✅ **60-word maximum** - enforced by system prompt
- ✅ **Source citations required** - must reference resume sections
- ✅ **Career-only responses** - aggressive topic boundary enforcement
- ✅ **No speculation** - answers only from resume content

## Support

For issues or questions, contact drew@assemblylabs.co
