# AI Lesson Planner

AI-powered lesson material generator for K-4 educators. Creates differentiated, standards-aligned worksheets, quizzes, and activities using Claude AI.

## 🚀 Features

- ✅ **Real AI Generation** - Powered by Anthropic Claude Sonnet 4
- ✅ **Student Profiles** - Create reusable profiles for differentiation (no PII)
- ✅ **Rate Limiting** - 3 regenerations per 10 minutes to conserve API costs
- ✅ **Draft Editing** - Inline editing for all AI-generated content
- ✅ **Print-Friendly** - Professional worksheet templates optimized for printing
- ✅ **Library** - Save and organize materials with search/filter
- ✅ **localStorage Persistence** - All data saved locally (no backend required)

## 📋 Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env.local` file in the project root:

```bash
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
```

**⚠️ Important:** Never commit `.env.local` to git - it's already in `.gitignore`

### 3. Start Both Servers

**You need TWO terminal windows running simultaneously:**

**Terminal 1 - Proxy Server (Port 3001):**
```bash
npm run server
```

You should see:
```
🚀 Proxy server running on http://localhost:3001
📡 Accepting requests from http://localhost:3000
🔑 API key configured: Yes ✅
```

**Terminal 2 - React App (Port 3000):**
```bash
npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3000
```

### 4. Open in Browser

Navigate to: **http://localhost:3000**

## 🎓 Quick Start Guide

### 1. Create a Student Profile

1. Click **"Profiles"** in the header
2. Click **"Create New Profile"**
3. Fill out the form:
   - Name: e.g., "Visual Learners"
   - Grade: Select grade level(s)
   - Interests: Choose themes (animals, sports, etc.)
   - Reading Level: Below/On/Above grade
4. Click **"Save Profile"**

### 2. Generate Your First Lesson

1. Go to **Dashboard**
2. Click **"Create New Lesson Material"**
3. Enter a prompt:
   ```
   Create a worksheet about addition with regrouping for 2nd graders who love animals. Include 5 problems with space to show work.
   ```
4. (Optional) Click **"Select Student Profiles"** to differentiate
5. Click **"Generate Draft"**
6. Wait 15-20 seconds for AI generation

### 3. Review & Edit

1. Review the AI-generated content
2. Click any field to edit inline
3. Use **"Regenerate"** if needed (3 times per 10 minutes)
4. Click **"Looks Good - Continue"**

### 4. Save to Library

1. Review the visual template
2. Click **"Save to Library"**
3. Access saved materials anytime from the Library page

## 🏗️ Architecture

### Why Two Servers?

**Problem:** Browsers block direct API calls to Anthropic due to CORS policy (security feature)

**Solution:** Proxy server architecture

```
Browser (localhost:3000)
    ↓ Calls proxy (no CORS!)
Proxy Server (localhost:3001)
    ↓ Forwards request with API key
Anthropic API
    ↓ Returns AI content
Proxy → Browser
```

**Benefits:**
- ✅ No CORS errors
- ✅ API key stays secure on server
- ✅ Works locally without a full backend

## 📁 Project Structure

```
ai-lesson-planner/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── shared/        # Button, Modal, LoadingSpinner, Header
│   │   ├── profiles/      # ProfileForm, ProfileCard
│   │   ├── creation/      # PromptBuilder, ProfileSelector, RateLimitWarning
│   │   └── templates/     # (Future: Visual templates)
│   ├── contexts/
│   │   └── AppContext.js  # Global state management
│   ├── pages/
│   │   ├── Dashboard.js   # Landing page
│   │   ├── CreateMaterial.js  # Prompt builder
│   │   ├── DraftReview.js     # AI generation & editing
│   │   ├── VisualEditor.js    # Mock visual template
│   │   ├── ProfileManager.js  # Profile CRUD
│   │   └── Library.js         # Saved materials
│   ├── utils/
│   │   ├── llm.js         # LLM API integration
│   │   └── rateLimit.js   # Rate limiting logic
│   └── styles/
│       └── templates.css  # Print-friendly styles
├── server.js              # Proxy server for API calls
├── .env.local            # API keys (not committed)
└── package.json
```

## 🔧 Available Scripts

- **`npm start`** - Start React dev server (port 3000)
- **`npm run server`** - Start proxy server (port 3001)
- **`npm run build`** - Create production build
- **`npm test`** - Run tests

## 🐛 Troubleshooting

### CORS Errors / "Failed to fetch"

**Problem:** Proxy server not running or crashed

**Solution:**
```bash
# Check if proxy is running
ps aux | grep "node server.js" | grep -v grep

# If not, restart it
npm run server
```

### Port Already in Use

**Problem:** Something else is using port 3000 or 3001

**Solution:**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3002 npm start
```

### API Key Not Working

**Problem:** "API key not configured" error

**Solution:**
1. Check `.env.local` exists in project root
2. Verify format: `REACT_APP_ANTHROPIC_API_KEY=sk-ant-api03-...`
3. Restart both servers
4. Check API key is valid at https://console.anthropic.com/

### Generation Takes Too Long / Times Out

**Problem:** Network issues or API rate limits

**Solution:**
1. Check your internet connection
2. Verify API key has available credits
3. Check Anthropic status: https://status.anthropic.com/

## ⚠️ Known Limitations (MVP)

1. **Stage 2 is Mock** - Visual generation uses template, not AI
2. **No Authentication** - Session is browser-based only
3. **Client-Side API Key** - Not production-secure (prototype only)
4. **No Backend** - Everything runs client-side
5. **localStorage Only** - ~5-10MB limit, no multi-device sync
6. **Dev Dependencies** - Some known vulnerabilities (dev only, not production)

## 🚀 Production Deployment Considerations

For a production-ready app, you'll need:

1. **Backend Server** - Move proxy to real backend (Express, FastAPI, etc.)
2. **Database** - Replace localStorage with Supabase/PostgreSQL
3. **Authentication** - Add Auth0, Clerk, or Supabase Auth
4. **API Security** - Store API keys in environment variables on server
5. **Stage 2 Implementation** - Real visual generation with image AI
6. **Rate Limiting** - Server-side rate limiting per user
7. **Export Functionality** - PDF generation with proper library
8. **Update Dependencies** - Fix security vulnerabilities

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `REACT_APP_PROXY_URL` | Proxy server URL (defaults to localhost:3001) | No |

## 🤝 Contributing

This is a prototype/MVP. For production use:
1. Move API calls to backend
2. Implement proper authentication
3. Add database for persistence
4. Build real Stage 2 visual generation
5. Add comprehensive error handling

## 📄 License

Private project - All rights reserved

## 🙏 Credits

- Built with React + Tailwind CSS
- AI powered by Anthropic Claude Sonnet 4
- Icons from Lucide React
- Built by Claude Code

---

**Questions?** Check the troubleshooting section above or open an issue.
