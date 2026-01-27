# TOMO Video Database - Product Requirements Document

**Version:** 1.0
**Created:** January 2025
**Status:** Active Development

---

## 1. Overview

### 1.1 Purpose

The video database powers TOMO's technique learning experience, providing curated instructional content personalized to each user's belt level, training goals, and learning history.

### 1.2 User Context

Videos are consumed during the **relaxed state** - when users are browsing at home, on the couch, or commuting. This is NOT post-training exhaustion. Users want:

- **Depth and exploration** - not quick hits
- **Multiple videos per technique** - different instructors, angles, concepts
- **Belt-appropriate difficulty** - progressively harder content as they advance
- **Personalized recommendations** - based on their training struggles and goals

### 1.3 Core Value Proposition

> "The right video, for the right technique, at the right time in your journey."

---

## 2. Current State Analysis

### 2.1 Database Metrics

| Metric | Current Value | Target |
|--------|---------------|--------|
| Total video entries | 169 | 400+ |
| Unique YouTube videos | 53 | 200+ |
| Technique coverage | 31.9% (115/361) | 75%+ |
| Placeholder reliance | 49% | <10% |
| Video types used | 3 of 6 | 6 of 6 |

### 2.2 Critical Gaps

| Position | Coverage | Priority |
|----------|----------|----------|
| Leg Entanglements | 0% | P0 - Critical |
| Open Guard | 11% | P0 - Critical |
| Submissions | 26% | P1 - High |
| Half Guard | 27% | P1 - High |
| Takedowns | 28% | P1 - High |

See: [VIDEO_COVERAGE_AUDIT.md](./VIDEO_COVERAGE_AUDIT.md) for complete analysis.

---

## 3. Data Model

### 3.1 Enriched Video Schema

```typescript
interface TechniqueVideo {
  // === CORE FIELDS (required) ===
  technique_id: string;        // References technique catalog
  video_type: VideoType;       // instructional | quicktip | competition | chain | mindset | lifestyle
  youtube_id: string;          // YouTube video ID
  instructor: string;          // Instructor name
  title: string;               // Video title
  duration_seconds: number;    // Video length

  // === ENRICHMENT FIELDS (optional) ===
  difficulty_level?: 1-10;     // Maps to belt progression
  belt_prerequisite?: BeltLevel; // Minimum belt to benefit
  gi_nogi?: 'gi' | 'nogi' | 'both';
  concepts?: ConceptTag[];     // Conceptual tags for discovery
  related_techniques?: string[]; // Technique IDs that chain well
  prerequisites?: string[];    // YouTube IDs to watch first
  quality_score?: 1-5;         // Production/teaching quality

  // === CLIP FIELDS (optional) ===
  timestamp_start?: number;    // Start time (for clips)
  timestamp_end?: number;      // End time (for clips)

  // === METADATA FIELDS (optional) ===
  language?: string;           // ISO code (en, pt)
  has_subtitles?: boolean;
  source_channel?: string;     // YouTube channel name
}
```

### 3.2 Video Types

| Type | Description | Target Length | Current Count | Target |
|------|-------------|---------------|---------------|--------|
| `instructional` | Full technique breakdown | 5-15 min | 138 | 250+ |
| `quicktip` | Single detail or tip | 1-3 min | 0 | 60+ |
| `competition` | Match footage or breakdown | 3-10 min | 0 | 40+ |
| `chain` | Flow/drill connecting techniques | 3-8 min | 0 | 30+ |
| `mindset` | Mental game, psychology | 3-15 min | 14 | 25+ |
| `lifestyle` | Longevity, recovery, balance | 5-20 min | 17 | 30+ |

### 3.3 Difficulty Level Mapping

| Level | Belt Stage | Description |
|-------|------------|-------------|
| 1-2 | White belt fundamentals | Basic positions, survival |
| 3-4 | White/Blue transition | First attacks, guard basics |
| 5-6 | Blue belt | Systems, combinations |
| 7-8 | Purple belt | Advanced guards, leg locks |
| 9-10 | Brown/Black | Refinement, innovation |

### 3.4 Concept Tags

```typescript
type ConceptTag =
  | 'weight_distribution' | 'leverage' | 'timing' | 'grip_fighting'
  | 'hip_movement' | 'frames' | 'pressure' | 'angle'
  | 'connection' | 'posture' | 'base' | 'transitions'
  | 'combinations' | 'setups' | 'counters' | 'defense'
  | 'fundamentals' | 'competition' | 'mindset' | 'longevity';
```

---

## 4. Belt Personalization Integration

### 4.1 Recommendation Categories by Belt

| Belt | Primary Categories | Difficulty Range |
|------|-------------------|------------------|
| White | escapes, basic-sweeps, closed-guard, mount-defense | 1-3 |
| Blue | guard-systems, passing-fundamentals, submission-chains | 2-5 |
| Purple | advanced-guards, leg-locks, combination-attacks | 4-8 |
| Brown | advanced-leg-locks, competition-footage, teaching | 6-10 |
| Black | competition-analysis, innovation, teaching-methodology | 7-10 |

### 4.2 Weekly Recommendation Targets

| Belt | Videos/Week | Instructional | QuickTip | Mindset |
|------|-------------|---------------|----------|---------|
| White | 3 | 2 | 1 | 0 |
| Blue | 5 | 3 | 1 | 1 |
| Purple | 5 | 3 | 1 | 1 |
| Brown | 3 | 2 | 0 | 1 |
| Black | 2 | 1 | 0 | 1 |

### 4.3 Recommendation Reasons

The system uses these reasons to explain why a video is recommended:

| Reason | Description | Priority |
|--------|-------------|----------|
| `recent_struggle` | User struggled with this in recent sessions | High |
| `plateau_technique` | Stuck at "developing" for 3+ weeks | High |
| `belt_level_gap` | Core technique for belt not yet proficient | Medium |
| `chain_completion` | Completes a technique chain user is building | Medium |
| `fundamentals_refresh` | Fundamental not practiced in 30+ days | Low |
| `next_progression` | Natural next step from mastered technique | Medium |
| `training_focus` | Matches user's stated training goals | Medium |

---

## 5. Instructor Curation Strategy

### 5.1 Priority Instructors - Technique

| Instructor | Style | Best For | Channel |
|------------|-------|----------|---------|
| John Danaher | Conceptual, systematic | All levels, systems | B-Team Jiu-Jitsu |
| Gordon Ryan | Competition-focused | Blue+, pressure passing | B-Team Jiu-Jitsu |
| Lachlan Giles | Clear pedagogy | All levels | Absolute MMA St Kilda |
| Craig Jones | No-gi specialist | Blue+, leg locks | Craig Jones |
| Stephan Kesting | Beginner-friendly | White/Blue | Grapplearts |
| Gustavo Gasperin | Visual, clear demos | White-Purple | MMALeech |

### 5.2 Priority Instructors - Mindset/Lifestyle

| Instructor | Focus | Best For |
|------------|-------|----------|
| Jocko Willink | Discipline, mental toughness | All belts |
| Firas Zahabi | Training philosophy, longevity | Older practitioners |
| Chewjitsu (Nick Albin) | Belt psychology, motivation | White/Blue |
| Rob Biernacki | Conceptual, hobbyist focus | Blue+ hobbyists |

### 5.3 Expansion Targets

| Gap | Recommended Instructors |
|-----|------------------------|
| Women competitors | Ffion Davies, Beatriz Mesquita |
| Modern leg lockers | Mikey Musumeci, Kade Ruotolo |
| Age-specific content | Pedro Sauer, Rickson Gracie interviews |

---

## 6. Video Sourcing Guidelines

### 6.1 Quality Criteria

Videos must meet these minimum standards:

| Criterion | Minimum | Preferred |
|-----------|---------|-----------|
| Video quality | 720p | 1080p+ |
| Audio clarity | Understandable | Clear, no background noise |
| Instruction style | Step-by-step | Conceptual + step-by-step |
| Technique correctness | Accurate | Competition-proven |
| Production value | Acceptable | Professional |

### 6.2 Content Guidelines

- **No outdated techniques** - Avoid pre-2010 content unless foundational
- **Prefer recent uploads** - Within last 3-5 years
- **Verify accuracy** - Cross-reference with multiple sources
- **Check legality** - Note IBJJF/competition legality in metadata
- **Include both gi and no-gi** - Aim for 50/50 split

### 6.3 Fair Use Considerations

- Use official instructor channels when possible
- Credit instructors in video metadata
- Link to original content
- Do not host/download videos - embed only

---

## 7. Implementation Roadmap

### Phase 1: Enrichment (Week 1-2)

**Goal:** Tag existing 53 unique videos with enrichment data

Tasks:
- [ ] Complete enrichment template for all existing videos
- [ ] Add difficulty_level, belt_prerequisite, gi_nogi to each
- [ ] Tag concepts for cross-video discovery
- [ ] Identify and mark placeholder videos for replacement

Deliverable: `video_enrichment_template.csv` fully populated

### Phase 2: Critical Gap Fill (Week 3-4)

**Goal:** Address 0% coverage positions

Tasks:
- [ ] Add 15+ Leg Entanglement videos (heel hooks, ashi garami, saddle)
- [ ] Add 20+ Open Guard videos (DLR, spider, lasso, X-guard)
- [ ] Source from Lachlan Giles, Craig Jones, Mikey Musumeci

Deliverable: Leg Entanglements at 30%+, Open Guard at 40%+

### Phase 3: Placeholder Replacement (Week 5-6)

**Goal:** Reduce placeholder reliance from 49% to <15%

Tasks:
- [ ] Replace `ypi3ie6hKTI` (22 uses) with technique-specific videos
- [ ] Replace `tyI3aszI4qo` (13 uses) with specific mount videos
- [ ] Replace `JX0HL0WpYPs` (13 uses) with specific clinch videos
- [ ] Add variety to Side Control, Back Control videos

Deliverable: Each technique has unique, specific video

### Phase 4: Video Type Expansion (Week 7-8)

**Goal:** Launch quicktip, competition, chain video types

Tasks:
- [ ] Source 30+ quicktip videos (1-3 min each)
- [ ] Source 20+ competition footage/breakdowns
- [ ] Source 15+ chain/flow videos
- [ ] Update UI to filter by video type

Deliverable: All 6 video types populated

### Phase 5: Belt-Specific Playlists (Week 9-10)

**Goal:** Create curated learning paths by belt

Tasks:
- [ ] White Belt Essentials playlist (20 videos)
- [ ] Blue Belt Development playlist (30 videos)
- [ ] Purple Belt Systems playlist (25 videos)
- [ ] Brown Belt Refinement playlist (15 videos)
- [ ] Black Belt Mastery playlist (10 videos)

Deliverable: Playlists integrated into recommendation engine

---

## 8. Success Metrics

### 8.1 Coverage Targets

| Metric | Current | MVP Target | Launch Target |
|--------|---------|------------|---------------|
| Overall coverage | 31.9% | 50% | 75% |
| Unique videos | 53 | 150 | 250 |
| Placeholder reliance | 49% | 15% | <5% |
| Video types used | 3/6 | 5/6 | 6/6 |

### 8.2 User Engagement Targets

| Metric | Target |
|--------|--------|
| Videos watched per session | 2+ |
| Watch completion rate | 70%+ |
| Recommendation click-through | 30%+ |
| "Helpful" rating | 80%+ |

---

## 9. Technical Integration

### 9.1 File Locations

| File | Purpose |
|------|---------|
| `/prototype/src/data/techniqueVideos.ts` | Video data store |
| `/prototype/src/types/techniqueVideos.ts` | TypeScript types |
| `/docs/domain-knowledge/bjj-techniques/video_enrichment_template.csv` | Enrichment working doc |
| `/prototype/src/config/belt-system/feature-adaptations.ts` | Belt recommendations |

### 9.2 Related Components

| Component | Location | Purpose |
|-----------|----------|---------|
| UpNextVideos | `/components/features/UpNextVideos.tsx` | Video recommendation display |
| YouTubeEmbed | `/components/ui/YouTubeEmbed.tsx` | Video player |
| TechniqueLibrary | `/components/features/TechniqueLibrary.tsx` | Browse with videos |

### 9.3 Recommendation Engine

Located in `/prototype/src/data/techniqueVideos.ts`:

- `generateRecommendations()` - Core recommendation logic
- `getBeltSpecificRecommendations()` - Belt-filtered recommendations
- `getVideosForTechnique()` - Technique-specific lookup

---

## 10. Appendix

### 10.1 Related Documents

- [VIDEO_COVERAGE_AUDIT.md](./VIDEO_COVERAGE_AUDIT.md) - Coverage analysis
- [BELT_INTEGRATION_SPEC.md](../BELT_INTEGRATION_SPEC.md) - Belt personalization
- [BELT_PERSONALIZATION_SYSTEM.md](../BELT_PERSONALIZATION_SYSTEM.md) - Psychology profiles

### 10.2 Change Log

| Date | Version | Changes |
|------|---------|---------|
| Jan 2025 | 1.0 | Initial document |

---

## 11. Open Questions

1. **Video hosting**: Should we build a caching layer for YouTube thumbnails?
2. **Offline support**: What videos (if any) should be downloadable for iOS?
3. **User-generated content**: Should users be able to add their own video links?
4. **Instructor partnerships**: Should we pursue official content partnerships?
