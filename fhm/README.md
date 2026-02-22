# Franklin Hugh Money

> An Investment in Knowledge

## What is This?

Franklin Hugh Money is a personal finance documentation project chronicling one individual's journey
toward financial independence. Named after Benjamin Franklin and Hugh (a family name that completes
the acronym rather conveniently), it documents the patient accumulation of wealth through index fund
investing.

## Project Status

**Phase 2: Training Programs** (Current)

- Site structure and navigation ✅
- Training hub with SIE and Series 7 ✅
- SIE exam materials (~80% complete) ✅
- Series 7 framework (in progress)
- Insights section (Treasury Analysis) ✅

## Site Navigation

```
Home → Philosophy, Introduction
  │
  ├── Training → Training Programs Hub
  │   ├── SIE Exam Prep (31 pages, mostly complete)
  │   └── Series 7 Exam Prep (framework ready)
  │
  └── Insights → Financial Analysis
      └── Treasury Market Analysis
```

## Quick Start

### Local Development

1. **Simple Python Server** (Recommended):

```bash
npm run dev
# or
python3 -m http.server 8000
```

Then visit: http://localhost:8000

2. **Node.js Server** (Alternative):

```bash
npm install
npm run serve
```

### Development Commands

```bash
# Format code
npm run format

# Lint files
npm run lint

# Build (generate flashcards, validate, cache-bust)
npm run build

# Deploy
./deploy.sh
```

## Project Structure

```
fhm/
├── index.html             # Home page (manifesto)
├── pages/                 # Deployed HTML pages
│   ├── training/          # Training hub
│   │   └── index.html     # Training programs landing
│   ├── sie/               # SIE exam materials (31 pages)
│   │   ├── sie-study-materials.html
│   │   ├── sie-chapter-*.html
│   │   └── [flashcards, quizzes, tools]
│   ├── series-7/          # Series 7 materials
│   │   └── series-7-study-materials.html
│   └── fhm-treasury.html  # Treasury analysis (Insights)
├── assets/                # Shared CSS and JS
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript modules
├── content/               # Markdown content source
│   ├── sie-exam/          # SIE source content
│   └── series-7/          # Series 7 source content
├── design/                # Design system and brand
│   ├── brand/             # Brand voice and guidelines
│   └── ui/                # Design system
├── dev/                   # Development documentation
├── docs/                  # Project documentation
└── scripts/               # Build and automation scripts
```

## Key Features

- **Not Indexed**: Blocked from search engines via robots.txt
- **Linked Only**: Accessible via drewgarraway.com sitemap
- **Institutional Design**: Clean, professional aesthetic with subtle personality
- **Real Journey**: Actual financial progress documentation
- **Educational**: Complex concepts explained clearly

## Technology Stack

- **Current**: Vanilla HTML/CSS/JS
- **Styling**: Custom CSS with institutional design system
- **Fonts**: Crimson Pro (serif display), Inter (body), IBM Plex Mono (data)
- **Colors**: Navy (#002D62), Cream (#FFFDF7), Sage (#7C9885)
- **Hosting**: Cloudflare Pages (planned)

## Development Philosophy

1. **Build to Scale**: Start simple but architect for growth
2. **Document Everything**: Comprehensive documentation for AI collaboration
3. **Thoughtful Voice**: Clear, approachable writing with occasional wit
4. **Real Numbers**: Actual financial data (anonymized as needed)
5. **Progressive Enhancement**: Works without JavaScript

## Working with Claude Code

This project is designed for AI pair programming. Before each session:

1. Claude reads `/dev/CLAUDE_COLLABORATION_PROTOCOL.md`
2. Checks `/dev/roadmap/current-sprint.md`
3. Reviews `/dev/docs/known-issues.md`
4. Creates session plan with TodoWrite
5. Documents work in `/dev/logs/YYYY-MM-DD-session.md`

## Roadmap

### Phase 1: Foundation ✅

- Project structure
- Design system
- Manifesto page
- Documentation

### Phase 2: Content Engine (Next)

- Static site generator setup
- Markdown content system
- First 10 pieces of content
- Journey tracker

### Phase 3: Interactive Tools

- F.U. Money calculator
- Investment trackers
- Fee impact visualizers

### Phase 4: Community

- Comments system
- Newsletter
- Premium content

## Contributing

This is a personal project, but if you're interested in the journey:

- Visit: https://drewgarraway.com/fhm
- Follow the main site: https://drewgarraway.com

## Legal

This is not financial advice. Simply one person's documented journey toward financial independence
through index fund investing.

---

_"An investment in knowledge pays the best interest."_ – Benjamin Franklin

_Franklin Hugh Money - Building wealth through patient investing._
