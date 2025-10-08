# Assembly AI Content Platform

An AI-powered content research and publishing platform that streamlines the entire content creation workflow from ideation to multi-platform publishing.

![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)
![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

Assembly AI Content Platform helps content creators, marketers, and businesses produce high-quality, research-backed content efficiently. The platform leverages AI to research topics, generate drafts, and format content for multiple social media platforms.

### Key Features

- **AI-Powered Research**: Automated web research with credibility scoring
- **Content Generation**: Claude AI integration for high-quality content creation
- **Multi-Platform Publishing**: Format once, publish everywhere (LinkedIn, Twitter/X, TikTok)
- **Revision Workflow**: Collaborative editing with feedback loops
- **Dark Mode UI**: Modern, minimalist design system
- **Mock Data Mode**: Full UI demonstration without API keys

## Tech Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis
- **Queue**: BullMQ
- **AI**: Anthropic Claude API
- **Research**: Perplexity API

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS 3.3.0
- **State**: Zustand
- **Editor**: TipTap
- **Routing**: React Router v6
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL 15 (optional for mock mode)
- Redis (optional for mock mode)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/drew-garraway-consulting/assembly-agentic-articles.git
cd assembly-agentic-articles
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Backend (.env):
```env
# Server
PORT=3001
NODE_ENV=development

# Database (optional for mock mode)
DATABASE_URL=postgresql://user:password@localhost:5432/assembly_content

# Redis (optional for mock mode)
REDIS_URL=redis://localhost:6379

# API Keys (optional - uses mock data if not provided)
ANTHROPIC_API_KEY=your_claude_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key

# Security
JWT_SECRET=your_jwt_secret_key
```

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

5. **Set up database** (optional)
```bash
cd ../database
psql -U postgres -f schema.sql
```

6. **Start the backend**
```bash
cd ../backend
npm run dev
```

7. **Start the frontend**
```bash
cd ../frontend
npm start
```

8. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
assembly-agentic-articles/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   └── server.ts       # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   └── App.tsx         # Main app component
│   └── package.json
├── database/               # PostgreSQL schemas
│   └── schema.sql
├── docs-private/           # Documentation
├── RELEASES.md            # Release tracking
├── ROADMAP.md             # Product roadmap
├── CHANGELOG.md           # Change history
└── README.md              # This file
```

## Available Scripts

### Backend

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm run lint       # Run ESLint
npm test          # Run tests
```

### Frontend

```bash
npm start         # Start development server
npm run build     # Build for production
npm test          # Run tests
npm run eject     # Eject from Create React App (caution!)
```

## API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/drafts` | Create new draft |
| GET | `/api/drafts` | List all drafts |
| GET | `/api/drafts/:id` | Get draft by ID |
| POST | `/api/drafts/:id/research` | Conduct research |
| POST | `/api/drafts/:id/generate` | Generate content |
| POST | `/api/drafts/:id/revise` | Request revision |
| POST | `/api/drafts/:id/approve` | Approve draft |
| POST | `/api/drafts/:id/format` | Format for platforms |
| POST | `/api/drafts/:id/publish` | Publish content |

## Features in Detail

### Content Creation Workflow

1. **Idea Input**: Enter a 5-200 character content idea
2. **Research**: AI searches and scores credible sources
3. **Generation**: Claude creates an 800-1000 word draft
4. **Revision**: Edit and refine content (max 2 revisions)
5. **Approval**: Lock content for formatting
6. **Formatting**: Adapt for LinkedIn, Twitter, TikTok
7. **Publishing**: Deploy to selected platforms

### Credibility Scoring

Sources are scored on a 1-10 scale based on:
- Domain authority (edu/gov: 9, tech news: 7, others: 4)
- Recency (< 3 months: 10, decreasing over time)
- Source type (academic: +2, industry: +1.5, news: +1)

### Platform Formatting

- **LinkedIn**: Professional posts with hashtags and source footer
- **Twitter/X**: Thread splitting with 280 character limit
- **TikTok**: Video scripts with timing cues and production notes

## Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Style

- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting
- Conventional commits

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## Deployment

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Start production server
cd backend && NODE_ENV=production npm start
```

### Environment Variables

See `.env.example` files in both backend and frontend directories for required environment variables.

## Documentation

- [Release Tracking](./RELEASES.md) - Current version and feature status
- [Product Roadmap](./ROADMAP.md) - Future features and timeline
- [Changelog](./CHANGELOG.md) - Detailed change history
- [PRD Document](./docs-private/content_agent_prd.md) - Product requirements
- [Design System](./docs-private/assembly-agenct-design-system.pdf) - UI/UX guidelines

## Performance

### Targets
- Page Load: < 2s
- API Response: < 500ms
- Time to Interactive: < 3s
- Lighthouse Score: > 90

### Current Status
- ✅ Frontend loads in ~1.5s
- ✅ Mock API responses < 100ms
- ⏳ Real API integration pending

## Security

- Helmet.js for security headers
- Rate limiting on all endpoints
- Input validation with Zod
- SQL injection prevention
- JWT authentication (coming soon)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/drew-garraway-consulting/assembly-agentic-articles/issues)
- Check the [documentation](./docs-private)
- Review the [roadmap](./ROADMAP.md)

## Acknowledgments

- Design system by Grok
- Built with React and Express
- Powered by Claude AI and Perplexity

---

**Current Version**: v0.1.0-alpha | **Status**: In Development | **Last Updated**: 2025-10-08