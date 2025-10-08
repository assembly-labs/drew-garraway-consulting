# Changelog

All notable changes to the Assembly AI Content Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Work in Progress
- API integration between frontend and backend
- User authentication system
- Real API key integration (Claude, Perplexity)
- Database connection setup
- Production deployment pipeline

---

## [0.1.0-alpha] - 2025-10-08

### Added

#### Backend Infrastructure
- Express.js server with TypeScript configuration
- PostgreSQL database schema with all required tables
- RESTful API endpoints with Zod validation
- CORS, Helmet, and rate limiting middleware
- Graceful shutdown handlers

#### Database Schema
- `users` table with authentication fields
- `content_drafts` table for draft management
- `research_sources` table for source tracking
- `platform_content` table for formatted content
- `user_edits` table for revision history
- `calendar_events` table for scheduling
- Automatic timestamp triggers
- Proper indexes for performance

#### Core Services
- **ResearchService**: Web research with mock fallback
- **ClaudeService**: AI content generation with mock data
- **ContentService**: Workflow orchestration
- **CredibilityScorer**: Source credibility scoring (1-10 scale)
- **PlatformFormatter**: Multi-platform content formatting
  - LinkedIn posts with hashtags
  - Twitter/X thread splitting (280 char limit)
  - TikTok video scripts with timing

#### Frontend Application
- React 18 with TypeScript
- TailwindCSS 3.3.0 for styling
- Dark theme design system (#0D1117 background)
- Zustand for state management
- React Router for navigation

#### UI Components
- **Layout**: Sidebar navigation with stats
- **Dashboard**: Stats cards and drafts table
- **IdeaInput**: Character-limited input with validation
- **ResearchPanel**: Collapsible source cards with credibility badges
- **ContentEditor**: TipTap rich text editor with toolbar
- **PlatformPreview**: Multi-platform preview with copy functionality
- **CreateContent**: Complete workflow orchestration
- **DraftDetail**: Individual draft viewing/editing

#### Design System
- Dark minimalist theme from design PDF
- Inter font family
- CSS variables for theming
- Custom color palette:
  - Primary: #0D1117
  - Secondary: #161B22
  - Accent: #58A6FF
  - Success: #238636
  - Error: #F85149
- Component styles for forms, buttons, cards, tables

#### Development Features
- Mock data system for UI demonstration
- Hot reload development environment
- TypeScript strict mode
- ESLint and Prettier configuration

### Fixed
- TailwindCSS PostCSS plugin compatibility with CRA
- CSS compilation errors with custom classes
- Border width utilities (border-3 → border-4)
- Circular dependencies in utility classes
- Hover state implementations using CSS variables

### Changed
- Downgraded TailwindCSS to v3.3.0 for Create React App compatibility
- Replaced @apply directives with direct CSS variable usage
- Updated postcss.config.js for standard plugin format

### Security
- Helmet.js for security headers
- Rate limiting on API endpoints
- Input validation with Zod schemas
- SQL injection prevention with parameterized queries

---

## [0.0.1] - 2025-10-07

### Added
- Initial project setup
- Repository structure
- PRD documentation
- Design system PDF
- Basic git configuration

---

## Version History

| Version | Date | Status | Type |
|---------|------|--------|------|
| 0.1.0-alpha | 2025-10-08 | Current | Alpha Release |
| 0.0.1 | 2025-10-07 | Released | Initial Setup |

---

## Coming Soon

### [0.2.0-beta] - Planned
- User authentication with JWT
- Database persistence layer
- User profiles and settings
- Content ownership and permissions
- Session management

### [0.3.0-beta] - Planned
- Real Anthropic Claude API integration
- Perplexity research API implementation
- API key management system
- Enhanced error handling
- Rate limiting and quota management

### [0.4.0-beta] - Planned
- LinkedIn OAuth and publishing
- Twitter/X API integration
- Publishing queue with BullMQ
- Scheduled publishing feature
- Analytics tracking

### [0.5.0-rc] - Planned
- Production deployment setup
- CI/CD pipeline
- Monitoring and logging
- Performance optimization
- Security audit completion

---

## Upgrade Guide

### From 0.0.1 to 0.1.0-alpha
1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up PostgreSQL database (optional for mock mode)
5. Configure environment variables (see .env.example)
6. Run backend: `cd backend && npm run dev`
7. Run frontend: `cd frontend && npm start`

---

*For detailed release information, see [RELEASES.md](./RELEASES.md)*
*For future planning, see [ROADMAP.md](./ROADMAP.md)*