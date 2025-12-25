# Documentation Index

This directory contains documentation for the Franklin Hugh Money SIE study site.

---

## Quick Start

**New to the project?** Start here:
- 📋 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - File locations and common tasks

**Need to understand recent changes?** Read:
- 📊 [RESTRUCTURE_LOG.md](./RESTRUCTURE_LOG.md) - Complete change log from Dec 24, 2024

**Need to undo changes?** See:
- ⏮️ [RESTORE_POINTS.md](./RESTORE_POINTS.md) - Git restore points and revert instructions

---

## Documentation Files

### RESTRUCTURE_LOG.md
**Complete change log** from Dec 24, 2024 restructure.

**Contains**:
- Overview of all changes (CSS extraction, tests, file reorg, ESM, content strategy)
- Before/after project structure
- Detailed file-by-file changes
- Git commit details (`ab70b06`, `ffbff65`)
- Step-by-step revert instructions
- Dependencies added
- Breaking changes
- Rationale for each change

**When to read**: Understanding what changed and why.

### QUICK_REFERENCE.md
**Fast lookup cheat sheet** for day-to-day work.

**Contains**:
- TL;DR summary of changes
- File location changes (before → after)
- Common task commands
- Import syntax changes (CommonJS → ESM)
- Path changes in HTML
- Story database quick lookup
- Key numbers (42 tests, 16KB CSS, etc.)

**When to read**: "Where did file X move to?" or "How do I run tests?"

### RESTORE_POINTS.md
**Git restore points** and rollback instructions.

**Contains**:
- Timeline of key commits
- How to restore to any previous state
- Key file states at each commit
- Specific restore scenarios
- Backup manifest (what can be deleted)
- Emergency full restore commands

**When to read**: "I need to undo this" or "What was it like before?"

### DEPLOYMENT_GUIDE.md
**Deployment instructions** (pre-existing).

**Contains**:
- How to deploy to GitHub Pages
- Environment setup
- Build process
- Troubleshooting

**When to read**: Deploying the site.

---

## Git Commits Reference

| Commit | Date | Description |
|--------|------|-------------|
| `fbb1654` | Before Dec 24 | Original structure (before restructure) |
| `ab70b06` | Dec 24, 2024 | Restructure: CSS, tests, file reorg, ESM, audio |
| `ffbff65` | Dec 24, 2024 | Content strategy: story database + UX docs |
| `f80789f` | Dec 24, 2024 | This documentation |

---

## File Structure Overview

```
franklin-hugh-money/
├── dev/
│   └── docs/
│       ├── README.md                    # This file
│       ├── QUICK_REFERENCE.md           # Fast lookup
│       ├── RESTRUCTURE_LOG.md           # Complete change log
│       ├── RESTORE_POINTS.md            # Revert instructions
│       └── DEPLOYMENT_GUIDE.md          # Deploy instructions
├── content/
│   ├── story-database.json              # 40+ historical stories
│   ├── CONTENT_STRATEGY.md              # UX research rationale
│   ├── STORY_QUICK_REFERENCE.md         # Story lookup table
│   └── LEARNING_ENHANCEMENTS.md         # Learning science roadmap
├── pages/
│   ├── franklin-hugh-money-treasury.html
│   └── sie/
│       └── sie-chapter-*.html           # All chapter files
├── assets/
│   ├── css/
│   │   ├── main.css                     # Shared styles (16KB)
│   │   ├── sie-chapter.css
│   │   └── sie-navigation.css
│   ├── js/
│   │   └── sie-navigation-config.js
│   └── audio/
│       └── chapters/
│           └── ch8/
│               └── *.m4a
├── tests/
│   ├── navigation-config.test.js        # 24 tests
│   └── cache-bust.test.js               # 18 tests
├── scripts/
│   ├── cache-bust.js                    # ESM
│   ├── setup.js                         # ESM
│   └── validate-content.js              # ESM
├── index.html
├── package.json                         # "type": "module"
└── vitest.config.js                     # Test config
```

---

## Common Tasks

### Find documentation
```bash
ls dev/docs/
# Shows: README.md, QUICK_REFERENCE.md, RESTRUCTURE_LOG.md, etc.
```

### Run tests
```bash
npm test
# Shows: 42 passing tests
```

### View git history
```bash
git log --oneline --since="2024-12-24"
# Shows: Recent commits
```

### Check what changed
```bash
git diff fbb1654..HEAD --stat
# Shows: All files changed since before restructure
```

### Revert everything
```bash
git revert f80789f  # Remove this documentation
git revert ffbff65  # Remove content strategy
git revert ab70b06  # Remove restructure
```

---

## Documentation Principles

This documentation follows these principles:

1. **Reversibility**: Every change can be undone
2. **Traceability**: Git commits referenced throughout
3. **Clarity**: Examples and commands, not just prose
4. **Completeness**: Before/after states documented
5. **Accessibility**: Fast lookup + detailed reference both available

---

## Questions?

- **"Where did file X go?"** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **"What changed?"** → [RESTRUCTURE_LOG.md](./RESTRUCTURE_LOG.md)
- **"How do I undo this?"** → [RESTORE_POINTS.md](./RESTORE_POINTS.md)
- **"How do I deploy?"** → [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **"What stories can I use?"** → [../content/STORY_QUICK_REFERENCE.md](../content/STORY_QUICK_REFERENCE.md)
- **"How should I write content?"** → [../content/CONTENT_STRATEGY.md](../content/CONTENT_STRATEGY.md)

---

**Last Updated**: December 24, 2024
**Maintained By**: Auto-generated during restructure
**Related Commits**: `ab70b06`, `ffbff65`, `f80789f`
