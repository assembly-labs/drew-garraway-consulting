# Video Library Aggregation

Iterative curation pipeline for building TOMO's BJJ technique video database.

## What This Is

A structured, multi-run workflow for discovering, verifying, and curating YouTube instructional videos mapped to TOMO's 375+ technique taxonomy. Each "run" processes a batch of techniques, discovers candidate videos, applies quality guardrails, and queues them for human review.

## Folder Structure

```
video-library-aggregation/
├── README.md                  # This file
├── PROJECT_BRIEF.md           # Full original project brief/prompt
├── docs/
│   ├── discovery-report.md    # Phase 1: What exists in TOMO today
│   ├── open-questions.md      # Pending decisions before Run 1
│   ├── file-reference-map.md  # Maps brief's file references → actual TOMO paths
│   └── youtube-api-setup.md   # How to get and configure YouTube Data API key
├── data/
│   ├── video-candidates/      # Per-technique candidate JSON files
│   └── review-queue/          # Batch files for human approval
└── run-reports/               # Per-run summary reports
```

## How It Works

### The Run Cycle

1. **Read progress** — Check `run-reports/` for what's been done
2. **Pick technique batch** — Next 10-20 techniques by priority
3. **Discover videos** — YouTube API search + trusted instructor channels
4. **Apply guardrails** — Duration, views, instructor credibility, relevance
5. **Generate candidates** — Write to `data/video-candidates/`
6. **Queue for review** — Write batch to `data/review-queue/`
7. **Log the run** — Write report to `run-reports/`
8. **Human reviews** — Approve/reject in review queue
9. **Integrate** — Approved videos sync to `prototype/src/data/techniqueVideos.ts`

### Priority Order

| Priority | Position Category | Current Coverage | Target |
|----------|-------------------|-----------------|--------|
| P0 | Leg Entanglements | 0% | 2+ videos/technique |
| P0 | Open Guard | 11% | 2+ videos/technique |
| P1 | White belt escapes | Placeholder-heavy | Real, unique videos |
| P1 | Closed Guard | Has videos, many reused | Deduplicate |
| P2 | Half Guard, Mount, Side Control | Partial | Fill gaps |
| P3 | Purple+ techniques | Minimal | 1+ video/technique |

### Quality Guardrails

**Hard requirements (must pass):**
- Video is public and available
- Duration: 2-30 minutes (instructionals, not full matches)
- Minimum 1,000 views
- Title/description mentions the technique
- Uploaded within last 10 years

**Soft scoring (ranking):**
- Trusted instructor (+3)
- Has chapters/timestamps (+2)
- Shows common mistakes (+2)
- 1080p+ quality (+1)
- Gi and no-gi variations (+1)
- 10K+ views (+1), 100K+ views (+2)

## Key Rules

- **NEVER fabricate YouTube IDs** — Every video must be verified via API or noembed
- **Prefer gaps over fake data** — `NEEDS_VERIFICATION` over invented IDs
- **Quality over quantity** — 3 great videos per technique beats 10 mediocre ones
- **Instructionals only** — No competition footage, no clickbait
- **English required** — Or has English subtitles (accessibility)

## Current Status

**Phase:** Pre-Run 1 (Discovery & Architecture complete, awaiting YouTube API key)

See `docs/discovery-report.md` for full codebase assessment.
See `docs/open-questions.md` for decisions needed before proceeding.
