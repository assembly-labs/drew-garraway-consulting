# TOMO Video Database Enrichment Workflow

**Last Updated:** January 2025
**Owner:** Product Team

---

## Overview

This document defines the systematic workflow for enriching the TOMO technique video database. The goal is to increase video coverage from ~32% to 50%+ while maintaining quality standards.

---

## 1. Video Selection Criteria

### Approved Instructors (Black Belts Only)

| Tier | Instructors | Expertise |
|------|-------------|-----------|
| **1 (Primary)** | John Danaher, Gordon Ryan, Lachlan Giles, Craig Jones, Roger Gracie, Marcelo Garcia | Systems, fundamentals, competition |
| **2 (Specialist)** | Bernardo Faria, Mikey Musumeci, André Galvão, Tom DeBlass, Stephan Kesting, Jon Thomas | Position specialists |
| **3 (Specialized)** | Keenan Cornelius, Gui/Rafael Mendes, Ffion Davies, Demian Maia | Specific systems (lapel, berimbolo) |
| **Mindset** | Jocko Willink, Firas Zahabi, Chewjitsu | Philosophy, longevity, psychology |

### Video Quality Requirements

- **Minimum Quality Score:** 3/5 (prefer 4-5)
- **Audio:** Clear explanation, no background noise interference
- **Video:** Good lighting, clear camera angle
- **Content:** Teaches technique explicitly (not just shows it)
- **Language:** English or with English subtitles

### Content Requirements

- Video must **actually teach** the mapped technique (not just mention it)
- Technique should be a **primary focus** (not a brief aside)
- For multi-technique videos, each mapped technique should get **meaningful coverage**
- Avoid mapping to videos where technique appears only in combination/flow

---

## 2. Technique ID Structure

| Position | Prefix | Example | CSV Source |
|----------|--------|---------|------------|
| Closed Guard | CG | CG_001 | guard_closed.csv |
| Half Guard | HG | HG_001 | guard_half.csv |
| Open Guard | OG | OG_001 | guard_open.csv |
| Mount | MT | MT_001 | mount.csv |
| Side Control | SC | SC_001 | side_control.csv |
| Back Control | BC | BC_001 | back_control.csv |
| Knee on Belly | KB | KB_001 | knee_on_belly.csv |
| North-South | NS | NS_001 | north_south.csv |
| Turtle | TT | TT_001 | turtle.csv |
| Takedowns | TD | TD_001 | standing_takedowns.csv |
| Clinch | CL | CL_001 | standing_clinch.csv |
| Guard Passing | GP | GP_001 | guard_passing.csv |
| **Leg Entanglements** | LE | LE_001 | leg_entanglements.csv |
| **Submissions** | SM | SM_001 | submissions_master.csv |

**Critical Gap Positions:** LE (0% → target 30%), OG (11% → target 50%), SM (26% → target 50%)

---

## 3. Video Entry Schema

```typescript
interface TechniqueVideo {
  // === REQUIRED FIELDS ===
  technique_id: string;        // e.g., "LE_001"
  video_type: VideoType;       // 'instructional' | 'quicktip' | 'competition' | 'chain' | 'mindset' | 'lifestyle'
  youtube_id: string;          // YouTube video ID (11 chars, e.g., "dQw4w9WgXcQ")
  instructor: string;          // Must be approved instructor
  title: string;               // Video title from YouTube
  duration_seconds: number;    // Total video length

  // === ENRICHMENT FIELDS (required for new entries) ===
  difficulty_level: 1-10;      // Maps to belt progression
  belt_prerequisite: BeltLevel;// 'white' | 'blue' | 'purple' | 'brown' | 'black'
  gi_nogi: 'gi' | 'nogi' | 'both';
  concepts: ConceptTag[];      // 2-4 tags from approved list
  quality_score: 1-5;          // Teaching/production quality
  source_channel: string;      // YouTube channel name

  // === OPTIONAL FIELDS ===
  timestamp_start?: number;    // For clips from longer videos
  timestamp_end?: number;
  related_techniques?: string[];
  prerequisites?: string[];
}
```

### Difficulty Level Guide

| Level | Belt | Description |
|-------|------|-------------|
| 1-2 | White | Day-1 fundamentals |
| 3-4 | White/Blue | Intermediate fundamentals |
| 5-6 | Blue | Advanced basics, combinations |
| 7-8 | Purple | Complex chains, specialist techniques |
| 9-10 | Brown/Black | Elite competition techniques |

### Concept Tags (Approved List)

```
fundamentals, leverage, timing, grip_fighting, hip_movement, frames,
pressure, angle, connection, posture, base, transitions, combinations,
setups, counters, defense, competition, mindset, longevity
```

---

## 4. Adding New Videos: Step-by-Step

### Step 1: Find Video
1. Search YouTube for approved instructors + technique name
2. Verify instructor is on approved list
3. Watch video to confirm it teaches the technique

### Step 2: Gather Metadata
```
- YouTube URL: https://youtube.com/watch?v=XXXXXXXXXXX
- YouTube ID: XXXXXXXXXXX (11-char code after v=)
- Title: [exact title from YouTube]
- Duration: [X minutes Y seconds → convert to seconds]
- Channel: [channel name]
```

### Step 3: Determine Enrichment Data
```
- technique_id: [from CSV catalog]
- video_type: [instructional/quicktip/etc]
- difficulty_level: [1-10 based on content complexity]
- belt_prerequisite: [minimum belt to benefit]
- gi_nogi: [watch video to determine]
- concepts: [2-4 most relevant tags]
- quality_score: [1-5]
```

### Step 4: Add to Database
Add entry to `/prototype/src/data/techniqueVideos.ts` in the appropriate position section.

### Step 5: Verify
- Run `npm run build` to check for TypeScript errors
- Check video plays in app

---

## 5. Multi-Technique Video Mapping

When a single video teaches multiple techniques, create separate entries for each:

```typescript
// Example: Danaher's Closed Guard video covers multiple techniques
{ technique_id: 'CG_001', youtube_id: 'ypi3ie6hKTI', concepts: ['fundamentals', 'posture'] },
{ technique_id: 'CG_002', youtube_id: 'ypi3ie6hKTI', concepts: ['hip_movement', 'timing'] },
{ technique_id: 'CG_009', youtube_id: 'ypi3ie6hKTI', concepts: ['hip_movement', 'angle'] },
```

**Guidelines:**
- Each mapping should have **unique concepts** reflecting what the video teaches for THAT technique
- Don't over-map: only include techniques that get meaningful coverage
- Same video can have different `difficulty_level` per technique if content varies

---

## 6. Priority Queue (Current Gaps)

### Tier 1: Critical (0-15% coverage)

| Position | Techniques | Current | Priority Techniques |
|----------|------------|---------|---------------------|
| **Leg Entanglements** | 18 | 2 (11%) | LE_003 (Saddle), LE_005 (50/50), LE_007 (K-Guard) |
| **Open Guard** | 45 | 5 (11%) | OG_001 (DLR), OG_009 (Spider), OG_022 (X-Guard) |

### Tier 2: Severe (15-30% coverage)

| Position | Techniques | Current | Priority Techniques |
|----------|------------|---------|---------------------|
| **Submissions** | 50 | 13 (26%) | SM_007 (Arm Triangle), SM_008 (D'arce), SM_020 (Armbar) |
| **Half Guard** | 30 | 8 (27%) | HG_005 (Deep Half), HG_025 (Calf Slicer) |
| **Takedowns** | 25 | 7 (28%) | TD_003 (Ankle Pick), TD_007 (Arm Drag) |

---

## 7. CSV Enrichment Template

For batch additions, use this CSV format:

```csv
technique_id,video_type,youtube_id,instructor,title,duration_seconds,difficulty_level,belt_prerequisite,gi_nogi,concepts,quality_score,source_channel
LE_003,instructional,CFTLb8iywJg,Lachlan Giles,Defending And Escaping The Saddle,600,7,purple,nogi,defense|counters|fundamentals,5,Absolute MMA St Kilda
OG_021,instructional,MXcQfCIh7n4,Gordon Ryan,The Most Basic Principles Of Butterfly And Open Guard,780,4,blue,both,transitions|hip_movement|setups,5,B-Team Jiu-Jitsu
```

**Notes:**
- Concepts use `|` separator (pipe)
- All times in seconds
- Include header row

---

## 8. Validation Checklist

Before committing new entries:

- [ ] Instructor is on approved list
- [ ] YouTube ID is valid (11 characters, video exists)
- [ ] Video actually teaches mapped technique
- [ ] All required fields populated
- [ ] Difficulty level matches belt prerequisite
- [ ] Concepts are from approved list
- [ ] No duplicate technique_id + youtube_id combinations
- [ ] Build passes (`npm run build`)

---

## 9. Existing Videos Optimization

Before searching for new videos, check if existing videos can cover more techniques:

### High-Value Multi-Technique Videos

| YouTube ID | Instructor | Title | Current Mappings | Potential Additions |
|------------|------------|-------|------------------|---------------------|
| ypi3ie6hKTI | Danaher | Closed Guard Fundamentals | CG_001-017 | CG_020, CG_021 |
| MXcQfCIh7n4 | Gordon Ryan | Butterfly/Open Guard | OG_001-003, OG_019-020 | OG_021, OG_028, OG_038 |
| CFTLb8iywJg | Lachlan Giles | Defending The Saddle | SM_028, LE_002 | LE_003, LE_005 |
| isv_6Hd1Iac | Danaher | Guard Passing No-Gi | GP_003-004, GP_017, GP_021 | GP_001, GP_006 |
| JX0HL0WpYPs | Gordon Ryan | Front Headlock/Turtle | TD_006, CL_001-009, TT_002,005 | TT_003, CL_011 |

---

## 10. Metrics & Goals

### Coverage Targets

| Position | Current | Target | Gap |
|----------|---------|--------|-----|
| Overall | 31.9% | 50% | +18% |
| Leg Entanglements | 11% | 30% | +19% |
| Open Guard | 11% | 50% | +39% |
| Submissions | 26% | 50% | +24% |

### Quality Metrics

- Average quality score: ≥4.0
- Tier 1 instructor coverage: ≥60%
- Multi-video techniques (redundancy): ≥20%

---

## Related Documents

- **Coverage Audit:** `/docs/product/_manual_product_requirements_doc/VIDEO_COVERAGE_AUDIT.md`
- **Technique Catalogs:** `/docs/domain-knowledge/bjj-techniques/bjj_library/*.csv`
- **Video Data:** `/prototype/src/data/techniqueVideos.ts`
- **Type Definitions:** `/prototype/src/types/techniqueVideos.ts`
