# Open Questions & Pending Decisions

> **Date:** 2025-02-03
> **Status:** Awaiting answers before Run 1 can begin

---

## Decision 1: YouTube API Key

**Status:** PENDING — User is setting this up

**Context:** The YouTube Data API v3 is required for video discovery (`search.list`) and metadata enrichment (`videos.list`). Free tier provides 10,000 units/day (~100 searches + thousands of metadata lookups).

**Needed:** API key from Google Cloud Console with YouTube Data API v3 enabled.

**See:** `youtube-api-setup.md` for step-by-step instructions.

---

## Decision 2: Schema Strategy — Extend Existing or Create New?

**Status:** NEEDS DECISION

**Context:** The production `TechniqueVideo` type (in `prototype/src/types/techniqueVideos.ts`) has core fields but is missing curation workflow fields (status, quality_score, reviewer, etc.) and enriched YouTube metadata (view_count, like_count, channel_id, etc.).

**Options:**

### Option A: Separate Curation Schema (Recommended)

Create a `VideoCurationCandidate` type in `video-library-aggregation/` that has ALL fields (discovery, scoring, review workflow). When videos are approved, they get transformed into the production `TechniqueVideo` format and merged into `techniqueVideos.ts`.

**Pros:**
- Clean separation of concerns
- Curation data doesn't pollute production code
- Can evolve independently
- Review metadata stays in the pipeline

**Cons:**
- Need a sync/transform step
- Two places to define video schemas

### Option B: Extend Production Type

Add all curation fields as optional properties to the existing `TechniqueVideo` interface.

**Pros:**
- Single source of truth
- No transform step

**Cons:**
- Bloats the production type with fields the app never uses
- Curation metadata visible in production code
- Harder to evolve without risking production

---

## Decision 3: Review Workflow — JSON vs. Google Sheets

**Status:** NEEDS DECISION (JSON proposed as default)

**Context:** No Google Sheets integration exists. Building one requires a Google Cloud service account and the Sheets API.

**Proposal:** Start with JSON files in `data/review-queue/`. Each batch is a JSON file the user reviews (can open in VS Code, or I can convert to CSV for spreadsheet review). Add Google Sheets later if the volume justifies it.

**Alternatives:**
- CSV export to `data/review-queue/` (opens easily in any spreadsheet app)
- Direct Google Sheets integration (requires setup)
- Simple markdown tables in review files

---

## Decision 4: Priority Order for Technique Batches

**Status:** NEEDS DECISION

**Context:** Two valid approaches:

### Approach A: Fill Critical Gaps First

Start with positions that have the worst coverage:
1. Leg Entanglements (0% coverage)
2. Open Guard (11% coverage)
3. Turtle, North-South, Knee on Belly (low coverage)
4. Then white belt fundamentals

**Rationale:** Maximizes the impact of early runs. Users exploring these positions currently get nothing.

### Approach B: White Belt First (as specified in brief)

Start with white belt curriculum:
1. Basic escapes (mount, side control, back)
2. Closed guard fundamentals
3. Basic submissions
4. Then expand by belt level

**Rationale:** Matches the belt progression system. White belt users are the largest audience and most likely to churn.

### Approach C: Hybrid

Start with white belt techniques that ALSO have poor coverage:
1. White belt escapes from all positions (fills gaps + serves beginners)
2. White belt closed guard (fix placeholder abuse)
3. Then leg entanglements, open guard (fill remaining gaps)
4. Blue belt expansion

---

## Decision 5: Non-BJJ Videos in Current Database

**Status:** NEEDS DECISION

**Context:** `VIDEO_VERIFICATION.md` flagged 6 non-BJJ videos (Jocko podcasts, JRE clips, motivational content) that are still in the production `techniqueVideos.ts` under "mindset" and "lifestyle" video types.

**Options:**
- **Remove them** — The brief says "instructionals only"; these don't teach technique
- **Keep them** — They serve a different purpose (mindset/motivation); the technique library could have a separate section for these
- **Move them** — Relocate to a separate `mindsetVideos.ts` data file, keep technique videos purely instructional

---

## Decision 6: Technique ID Reconciliation

**Status:** NEEDS INVESTIGATION (Run 1 task)

**Context:** The CSV taxonomy uses prefixed IDs (`CG_001`, `HG_001`) while the production `techniqueVideos.ts` uses slug-style IDs (`closed-guard-armbar`). These need to be mapped to each other.

**Proposed approach:** Create a mapping file `data/technique-id-map.json` during Run 1 that maps CSV IDs to production IDs. This becomes the bridge between the taxonomy and the video database.

---

## Summary: What's Needed Before Run 1

| Item | Status | Blocker? |
|------|--------|----------|
| YouTube API Key | User setting up | Yes |
| Schema strategy decision | Needs decision | Yes (for output format) |
| Review workflow format | JSON proposed | No (can default to JSON) |
| Priority order | Needs decision | No (can default to Hybrid) |
| Non-BJJ video decision | Needs decision | No (won't affect Run 1) |
| Technique ID mapping | Run 1 task | No |
