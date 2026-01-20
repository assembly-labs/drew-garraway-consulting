# Product Documentation

> **Purpose:** Feature specifications, architecture, and implementation guides for the TOMO practitioner app.

---

## Active Documents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **`FEATURES.md`** | Complete feature specification with status | Understand what's built vs. planned |
| **`PRODUCT_ARCHITECTURE_OVERVIEW.md`** | Architecture bible - screens, data flow, belt personalization | Before implementing any feature |
| **`BELT_PERSONALIZATION_SYSTEM.md`** | Quick reference for belt adaptation | When adding belt-specific logic |
| **`STATS_MODULE_STRATEGY.md`** | Aspirational stats module design | Understanding the vision |
| **`STATS_MODULE_IMPLEMENTATION.md`** | Realistic implementation guide | Building stats features |

---

## Key Decisions

1. **Practitioner-first** - Coach and Gym Owner features are deferred to Phase 4+
2. **Voice-first logging** - Forms are fallback, not primary
3. **Belt personalization** - Every screen adapts to belt level
4. **90-second capture** - Session logging optimized for exhausted users

---

## Archived Documents

Historical documents are preserved in `_archived/` for reference. See `_archived/ARCHIVE_README.md` for details.

**Do not use archived documents for current development.**

---

## Related Documentation

| Location | Content |
|----------|---------|
| `/docs/project/BACKLOG.md` | Prioritized feature backlog |
| `/docs/project/FUTURE_FEATURES.md` | Deferred Coach/Gym Owner scope |
| `/docs/project/ROADMAP.md` | Development phases |
| `/docs/FIRST_PRINCIPLES.md` | Non-negotiable product beliefs |
| `/docs/research/` | User research and market analysis |
