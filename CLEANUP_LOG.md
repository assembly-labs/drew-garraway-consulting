# Codebase Cleanup Log

**Date:** 2026-02-05
**Performed by:** Claude Code

## Summary

Comprehensive cleanup of the drew-garraway-consulting repository to reduce disk usage and improve organization.

## Changes Made

### 1. Homepage Footer Update
- **File:** `index.html`
- Removed Calendly "Book a Call" CTA and phone consultation verbiage
- Simplified to email-only contact: `drew@assemblylabs.co`
- Removed Calendly CSS/JS dependencies

### 2. Archived Node Modules Deleted (~1.5GB saved)
Removed `node_modules/` directories from archived projects:
- `_archived/CAP/node_modules/` (407MB)
- `_archived/fuckyougotrain/node_modules/` (62MB)
- `_archived/nofomo/node_modules/` (125MB)
- `_archived/zero-chill-tracker/node_modules/` (94MB)
- `_archived/alliance-bjj-app/alliance-mobile/node_modules/` (309MB)
- `_archived/accountable/habit-tracker/node_modules/` (178MB)

### 3. Build Artifacts Deleted
- `_archived/CAP/.next/` - Next.js build cache

### 4. Duplicate Project Archived
- Moved `locally-strong-nextjs-backup/` to `_archived/locally-strong-nextjs-backup/`
- Deleted its `node_modules/` (518MB) and `.next/` folders before archiving
- The static `locally-strong/` remains as the active version

## Disk Space Savings

| Location | Before | After | Saved |
|----------|--------|-------|-------|
| `_archived/` | 1.6GB | 396MB | ~1.2GB |
| `locally-strong-nextjs-backup/` | 626MB | (archived, cleaned) | ~600MB |
| **Total Saved** | | | **~1.8GB** |

## Verification Performed

- Main site files (`index.html`, `CNAME`) intact
- No broken internal references found
- No localhost URLs in production HTML files
- `.gitignore` already properly configured for `node_modules/`, `.env`, `dist/`, `.next/`
- Only `.env.example` files tracked in git (correct behavior)

## Active Projects (not modified)

These projects retain their `node_modules/` as they may be in active development:
- `scout/` (292MB)
- `f_this_app/` (617MB)
- `career-chat/` (105MB)
- `fhm/` (102MB)
- `Mikey-real/` (234MB)
- `locally-strong/` (64MB)
- `luka/` (64MB)
- `cool-curriculum/ai-lesson-planner/` (484MB)

## Recommendations for Future

1. Consider running `npm ci` instead of committing `node_modules/` for active projects
2. Periodically clean archived projects of build artifacts
3. The `_archived/` folder can be further reduced by deleting source code if no longer needed

## Files Changed in This Commit

- `index.html` - Footer CTA update
- `CLEANUP_LOG.md` - This file (new)
- Various deletions of untracked files (node_modules, .next)

---

# Agent Swarm Analysis Report

## Security Audit

### CRITICAL - Exposed API Keys (ROTATE IMMEDIATELY)

1. **Google Cloud API Key** - `read-out-loud/js/googleTTS.js:45`
   - Key: `AIzaSyCoSmPdMc6cgri3PWm3nx7BZ0ZA2PV49Bg`
   - Action: Rotate this key in Google Cloud Console

2. **Anthropic API Key** - `cool-curriculum/ai-lesson-planner/.env.local:5`
   - Full Claude API key exposed in committed .env.local
   - Action: Rotate key, add .env.local to .gitignore

### Medium Priority
- `career-chat/src/services/claudeApi.ts:21` - localhost:8787 fallback (OK for dev)
- `cool-curriculum/ai-lesson-planner/server.js:14` - hardcoded CORS localhost

---

## Code Quality Findings

### TODOs in Active Code (2 items)
- `f_this_app/src/app/(main)/game/[gameId]/page.tsx:220` - "TODO: Show toast with reason"
- `f_this_app/src/app/(main)/game/[gameId]/stats/page.tsx:193` - "TODO: Compare with last week"

### Console.log Statements
- 12 instances in `f_this_app/` - All are error handlers (appropriate)
- Minimal debug code found elsewhere

---

## HTML/CSS Issues

### Missing Alt Text (Accessibility)
- `TOMO/docs/product/video-review.html` - 16+ YouTube thumbnails missing alt attributes

### Inline Styles (Maintainability)
- `kids-sports/index.html` - 15+ inline styles
- `prompt-property/prompt-property/demos.html` - 4+ inline styles
- `scout/library-process-docs/patron-portal-fixed.html` - 15+ inline styles

---

## Project Inventory (17 Active Projects)

| Project | Type | Status | Deploy |
|---------|------|--------|--------|
| Scout | React 18 + Vite | PRODUCTION | Cloudflare |
| TOMO | React 19 + Vite | MVP Complete | Cloudflare |
| F This App | Next.js 16 | Production | Cloudflare |
| FHM | Static HTML | Production | Cloudflare |
| CareerChat | React 18 + Vite | Production | Cloudflare |
| Read Out Loud | PWA | Production | Cloudflare |
| Gather | Next.js 14 | MVP Dev | Vercel |
| Mikey-real | React 19 PWA | MVP Complete | Cloudflare |
| Cool Curriculum | React 19 | MVP WIP | TBD |
| Luka | Static + Alpine | Production | Cloudflare |
| Prompt Property | Static | MVP Complete | Vercel |
| Locally Strong | Static + Tailwind | Production | Cloudflare |

---

## Optimization Opportunities

### Large Files (Consider CDN/External Storage)
- `fhm/assets/audio/` - 300+ MB of audio files
- `locally-strong/images/hero-video.mp4` - 6.8MB

### Source Maps in Production (Remove)
- `cool-curriculum/ai-lesson-planner/build/` - 2.6MB of .map files
- `f_this_app/.next/` - 100+ source maps

### Orphaned Images (Can Delete)
- `locally-strong/images/` - 10 unused stock images

---

## Project-Specific Notes

### TOMO (BJJ Journal)
- **Status**: Production-ready for web, preparing for iOS
- **Quality**: 8.5/10 - Excellent documentation, clean code
- **Issue**: Video database has heavy duplication (works but needs curation)

### Scout (Library AI)
- **Status**: Production
- **Quality**: 8.2/10 - Clean TypeScript, good architecture
- **Issue**: Only 1 test file, in-memory cache lost on restart

### F This App (Social Game)
- **Status**: Production with caveats
- **Quality**: 7.5/10 - Good foundation, security concerns
- **CRITICAL**: Dev mode bypass vulnerability in middleware.ts:35-38
- **Issue**: Missing input validation, no toast notifications

---

## Recommendations Summary

### Immediate Actions
1. Rotate exposed API keys (Google Cloud, Anthropic)
2. Fix dev mode bypass in f_this_app middleware
3. Add .env.local to .gitignore globally

### Short-term
1. Add alt text to TOMO video thumbnails
2. Implement toast notifications in f_this_app
3. Add input validation across projects

### Long-term
1. Move large audio files to CDN
2. Remove source maps from production builds
3. Add comprehensive test coverage
