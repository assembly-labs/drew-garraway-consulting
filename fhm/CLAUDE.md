# Franklin Hugh Money - Project Context for Claude

## What This Is

Franklin Hugh Money (FHM) is a personal finance documentation project and securities exam
preparation platform. It chronicles one individual's journey toward financial independence while
providing high-quality study materials.

**Live Site:** https://drewgarraway.com/fhm

---

## Project Structure

```
fhm/
├── index.html             # Home page (manifesto)
├── pages/                 # Deployed HTML pages
│   ├── training/          # Training hub
│   ├── sie/               # SIE exam materials (31 pages)
│   ├── series-7/          # Series 7 materials
│   └── fhm-treasury.html  # Treasury analysis
├── assets/                # Shared CSS and JS
├── content/               # Markdown content source
│   ├── sie-exam/          # SIE source content
│   └── series-7/          # Series 7 source content (has CLAUDE.md)
├── design/                # Design system and brand
│   └── brand/             # Brand voice guidelines
├── dev/                   # Development documentation
├── docs/                  # Project documentation
└── scripts/               # Build and automation scripts
```

---

## Content-Specific Guides

For content creation work, read the appropriate guide:

| Content Area      | Guide Location                     |
| ----------------- | ---------------------------------- |
| **Series 7 Exam** | `/fhm/content/series-7/CLAUDE.md`  |
| **Brand Voice**   | `/fhm/design/brand/brand-voice.md` |

---

## Tech Stack

- **Framework:** Vanilla HTML/CSS/JS
- **Styling:** Custom CSS with institutional design system
- **Fonts:** Crimson Pro (serif), Inter (body), IBM Plex Mono (data)
- **Colors:** Navy (#002D62), Cream (#FFFDF7), Sage (#7C9885)
- **Deployment:** Cloudflare Pages

---

## Development Commands

```bash
# Local development
npm run dev

# Format code
npm run format

# Lint files
npm run lint

# Build (generate flashcards, validate, cache-bust)
npm run build

# Deploy
./deploy.sh
```

---

## Brand Voice Summary

FHM uses an "institutional with personality" voice:

- **90/10 Rule:** 90% clear, useful content; 10% clever observations
- **Conversational Professional:** Smart but not stuffy
- **Clear Before Clever:** Always prioritize understanding
- **The "Why" Behind Everything:** Explain rules, don't just state them

For detailed guidelines, see `/fhm/design/brand/brand-voice.md`.

---

## Audio Files

Audio files live in `assets/audio/` and are organized by type:

```
assets/audio/
├── chapters/          # Chapter deep-dive podcasts (by chapter number)
│   ├── ch1/
│   ├── ch6/
│   └── ...
└── exam-reviews/      # Wrong-answer review podcasts (by score milestone)
    └── Why_Common_Sense_Fails_the_Series_7.m4a
```

### Web Optimization (Required)

All `.m4a` files **must** be optimized for web streaming before deployment. This moves the moov atom
(metadata) to the front of the file so browsers can determine duration and enable seeking without
downloading the entire file first.

**Symptom of un-optimized files:** Audio appears to cut off after ~4 minutes, incorrect duration
shown, or seeking fails on longer files.

**Fix — run on every new audio file before committing:**

```bash
ffmpeg -i input.m4a -c copy -movflags +faststart output.m4a
```

This re-muxes only (no re-encoding, no quality loss, same file size). Verify with:

```bash
afinfo output.m4a | grep optimized
# Should say "optimized" (NOT "not optimized")
```

---

## Screenshot Policy

Course screenshots are copyrighted and must **never** be published online. They are stored locally
for reference only and excluded via `.gitignore`.
