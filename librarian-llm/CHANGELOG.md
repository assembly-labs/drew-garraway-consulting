# Changelog

All notable changes to the Librarian LLM project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CHANGELOG.md to track all feature additions and changes (2025-10-07)
- Theme Toggle (Dark Mode / Light Mode) with system preference detection and localStorage persistence (2025-10-07)

### Changed
- Organized historical documentation: Moved deprecated deployment guides and old code files to `docs-archive/` for preservation (2025-10-07)

### Fixed
- Netlify deployment configuration: Fixed Vite base path from `/librarian-llm/` to `/` to resolve asset loading errors (2025-10-07)
- Standardized environment variable naming: Changed from `CLAUDE_API_KEY` to `claude_api_key` to match Netlify configuration (2025-10-07)
- Updated all documentation to reflect correct environment variable naming convention (2025-10-07)

## [1.0.0] - 2024-10-07

### Added
- Natural language search for library books using Claude AI
- Multi-turn conversational interface with context retention
- Rich book information display (covers, formats, availability)
- Mobile-responsive design for phones, tablets, and desktops
- Accessibility features (keyboard navigation, screen reader support)
- Mock catalog with 69 diverse books for demonstration
- Smart retry logic for transient API errors
- Enhanced error messages with troubleshooting suggestions
- Conversation memory indicator for visual context feedback
- Advanced book matching and recommendation extraction
- React + TypeScript + Vite foundation
- TailStack integration for styling
- Claude 3 Haiku integration for fast, efficient AI responses
- Environment variable configuration for API keys
- Development and production build scripts
- Netlify deployment configuration
- Comprehensive documentation (README, DEPLOYMENT, TESTING)

### Infrastructure
- Vite build system
- TypeScript for type safety
- ESLint for code quality
- Netlify CLI for deployment
- React Query for API state management

---

## How to Use This Changelog

When adding a new feature:

1. Add it under `## [Unreleased]` in the appropriate section:
   - `### Added` - New features
   - `### Changed` - Changes to existing functionality
   - `### Deprecated` - Soon-to-be removed features
   - `### Removed` - Removed features
   - `### Fixed` - Bug fixes
   - `### Security` - Security improvements

2. Include the date in parentheses: `(2025-10-07)`

3. When releasing a version, move items from Unreleased to a new version section

Example entry:
```markdown
### Added
- Book rating system with 5-star reviews (2025-10-15)
- Export search history to PDF (2025-10-15)
```
