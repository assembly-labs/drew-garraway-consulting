# Scout - AI-Powered Library Discovery System

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/assembly-labs/drew-garraway-consulting/tree/main/scout)
[![Status](https://img.shields.io/badge/status-production%20ready-green)](https://searchwithscout.com/)
[![Demo](https://img.shields.io/badge/demo-live-orange)](https://searchwithscout.com/)

Scout is your AI library assistant - a conversational AI for discovering library materials including books, DVDs, games, equipment, and more through our "Library of Things" program. Built with React, TypeScript, and Claude AI.

🔗 **[Live Demo](https://searchwithscout.com/)** | 📂 **[Repository](https://github.com/assembly-labs/drew-garraway-consulting/tree/main/scout)**

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
   # claude_api_key=your-api-key-here
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

- ✅ **Natural Language Search**: Ask for any library materials using conversational queries
- ✅ **Library of Things**: Discover books, DVDs, games, 3D printers, tools, and more
- ✅ **Multi-turn Conversations**: Maintain context across multiple questions
- ✅ **Rich Item Information**: Cover images, formats, availability, special requirements
- ✅ **Mobile Responsive**: Works on phones, tablets, and desktops
- ✅ **Accessibility**: Keyboard navigation and screen reader support
- ✅ **Diverse Catalog**: 90+ items including books, media, equipment, and unique materials
- ✅ **Smart Retry Logic**: Automatic retry for transient errors
- ✅ **Enhanced Error Messages**: Helpful troubleshooting suggestions
- ✅ **Conversation Memory Indicator**: Visual feedback for context length
- ✅ **Polymorphic Components**: Intelligent display of different material types
- ✅ **Dark Mode Toggle**: Switch between light and dark themes with persistent preference

## 🎯 Example Queries

Try these example searches:

**Books & Media:**
- "I want something funny for the beach"
- "Books like Educated by Tara Westover"
- "Do you have Planet Earth on DVD?"
- "Comics for teenagers"

**Library of Things:**
- "Can I borrow a 3D printer?"
- "Do you have video games for PS5?"
- "I need to test my home for radon"
- "Board games for family game night"
- "Tools for home improvement"

## 🏗️ Project Structure

```
scout/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app component
├── docs/                # Technical documentation
├── cohort-recruitment/  # Library recruitment materials
├── public/
│   └── data/
│       └── catalog.json # Mock book catalog
└── package.json         # Dependencies
```

## 📚 Documentation

- **[Library of Things Guide](docs/LIBRARY_OF_THINGS_GUIDE.md)** - Complete technical guide to the diverse materials system
- **[Adding New Materials](docs/ADDING_NEW_MATERIALS.md)** - Step-by-step instructions for adding new item types
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Comprehensive deployment and maintenance procedures

## 🚢 Deployment

This project is deployed on **Netlify** with serverless functions for secure API key management.

### Quick Deploy:
```bash
npm run build
npm run deploy  # or git push origin main for auto-deploy
```
Netlify automatically builds and deploys when you push to GitHub.

### Detailed Instructions:
See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for complete setup and deployment guide.

### Live Demo:
🔗 **[https://searchwithscout.com](https://searchwithscout.com)** *(live demo)*

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
3. **Equipment inquiry**: "Can I borrow a 3D printer?"
4. **Media request**: "Nature documentaries on DVD"
5. **Complex request**: "Activities for a rainy day with kids"
6. **Library of Things**: "Do you have tools I can borrow?"

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `claude_api_key` | Claude API key (for local dev only, managed by Netlify function in production) | Yes |
| `VITE_ENV` | Environment (development/production) | No |

⚠️ **Security Note:** API key is stored securely in Netlify environment variables for production. For local development, use `.env` file (never commit to version control). See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for full deployment guide.

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
- ✅ Shows conversational search for all library materials
- ✅ Demonstrates "Library of Things" capabilities
- ✅ Uses real AI (Claude) for recommendations
- ✅ Supports diverse materials (books, DVDs, games, equipment, etc.)
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