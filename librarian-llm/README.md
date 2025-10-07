# Librarian LLM - AI-Powered Library Book Discovery

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/assembly-labs/drew-garraway-consulting/tree/main/librarian-llm)
[![Status](https://img.shields.io/badge/status-production%20ready-green)](https://drewgarraway.com/librarian-llm/)
[![Demo](https://img.shields.io/badge/demo-live-orange)](https://drewgarraway.com/librarian-llm/)

A conversational AI prototype for discovering library books using natural language queries. Built with React, TypeScript, and Claude AI.

🔗 **[Live Demo](https://drewgarraway.com/librarian-llm/)** | 📂 **[Repository](https://github.com/assembly-labs/drew-garraway-consulting/tree/main/librarian-llm)**

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (you have v24.9.0 ✅)
- Claude API key from [Anthropic Console](https://console.anthropic.com/)
- **Note:** Currently configured to use Claude 3 Haiku (March 2024) - a fast, efficient model perfect for prototyping

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Claude API key:**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your Claude API key
   # claude_api_key=sk-ant-api03-YOUR-KEY-HERE
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## ✅ Features

- ✅ **Natural Language Search**: Ask for books using conversational queries
- ✅ **Multi-turn Conversations**: Maintain context across multiple questions
- ✅ **Rich Book Information**: Cover images, formats, availability status
- ✅ **Mobile Responsive**: Works on phones, tablets, and desktops
- ✅ **Accessibility**: Keyboard navigation and screen reader support
- ✅ **Mock Catalog**: 69 diverse books for demonstration
- ✅ **Smart Retry Logic**: Automatic retry for transient errors
- ✅ **Enhanced Error Messages**: Helpful troubleshooting suggestions
- ✅ **Conversation Memory Indicator**: Visual feedback for context length
- ✅ **Improved Book Matching**: Advanced recommendation extraction
- ✅ **Dark Mode Toggle**: Switch between light and dark themes with persistent preference

## 🎯 Example Queries

Try these example searches:
- "I want something funny for the beach"
- "Books like Educated by Tara Westover"
- "Mystery novels set in Paris"
- "Science books for a curious 12-year-old"
- "Do you have that in audiobook?"

## 🏗️ Project Structure

```
librarian-llm/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app component
├── public/
│   └── data/
│       └── catalog.json # Mock book catalog
└── package.json         # Dependencies
```

## 🚢 Deployment

### Option A: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variable in Vercel dashboard:
   - Go to project settings
   - API key is now managed by Netlify serverless function (see DEPLOYMENT_NETLIFY.md)

### Option B: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag the `dist` folder to deploy
   - Add environment variable in site settings

## 🧪 Testing

### Local Testing Checklist

- [ ] Search for books using natural language
- [ ] Test follow-up questions
- [ ] Check mobile responsiveness
- [ ] Test keyboard navigation
- [ ] Verify error handling

### Demo Scenarios

1. **First-time user**: "I just finished Educated and loved it"
2. **Format preference**: "Do you have that in audiobook?"
3. **No results**: "Books about underwater basket weaving"
4. **Unclear query**: "Something good"
5. **Complex request**: "Gift for my 12-year-old who likes science and funny books"

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `claude_api_key` | Claude API key (for local dev only, managed by Netlify function in production) | Yes |
| `VITE_ENV` | Environment (development/production) | No |

⚠️ **Security Note:** API key is stored securely in Netlify environment variables for production. For local development, use `.env` file (never commit to version control). See DEPLOYMENT_NETLIFY.md for full deployment guide.

## 📝 Development

### Run development server:
```bash
npm run dev
```

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

### Type check:
```bash
npm run lint
```

## 🤝 For Pilot Libraries

This is a **prototype demonstration**, not production software. It:
- ✅ Shows conversational search capabilities
- ✅ Uses real AI (Claude) for recommendations
- ✅ Works on mobile and desktop
- ❌ Does NOT connect to real library systems
- ❌ Does NOT scale beyond demo usage

For production implementation timeline and costs, please contact the development team.

## 📞 Support

- **Technical Issues**: Create an issue in this repository
- **API Key Issues**: Check [Anthropic Console](https://console.anthropic.com/)
- **Deployment Help**: See deployment section above

## 📄 License

This is a prototype for demonstration purposes. All rights reserved.

---

**Built with ❤️ for libraries and their patrons**