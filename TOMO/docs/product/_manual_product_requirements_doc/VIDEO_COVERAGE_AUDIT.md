# TOMO Video Database Coverage Audit Report

**Generated:** January 2025
**Status:** Current state analysis

---

## Executive Summary

The TOMO technique video library has **31.9% coverage** of the core technique catalog, with **115 of 361 techniques** having at least one video. The database contains **169 video entries** across **53 unique YouTube videos**, heavily reliant on 7 placeholder videos that account for 49% of instructional content.

**Key Finding:** 68.1% of the technique catalog (246 techniques) has zero video coverage, with critical gaps in advanced positions and leg lock techniques.

---

## 1. Technique Count Per Position Category

| Category | Total Techniques | Covered | Missing | Coverage % | Status |
|----------|------------------|---------|---------|------------|--------|
| **Closed Guard (CG)** | 30 | 20 | 10 | **66.7%** | Needs Work |
| **Clinch (CL)** | 20 | 11 | 9 | **55.0%** | Needs Work |
| **Mount (MT)** | 20 | 11 | 9 | **55.0%** | Needs Work |
| **Back Control (BC)** | 20 | 8 | 12 | **40.0%** | Critical |
| **Guard Passing (GP)** | 30 | 12 | 18 | **40.0%** | Critical |
| **Side Control (SC)** | 25 | 8 | 17 | **32.0%** | Critical |
| **Takedowns (TD)** | 25 | 7 | 18 | **28.0%** | Critical |
| **Half Guard (HG)** | 30 | 8 | 22 | **26.7%** | Critical |
| **Knee on Belly (KB)** | 15 | 4 | 11 | **26.7%** | Critical |
| **North-South (NS)** | 15 | 4 | 11 | **26.7%** | Critical |
| **Submissions (SM)** | 50 | 13 | 37 | **26.0%** | Critical |
| **Turtle (TT)** | 18 | 4 | 14 | **22.2%** | Critical |
| **Open Guard (OG)** | 45 | 5 | 40 | **11.1%** | Critical |
| **Leg Entanglements (LE)** | 18 | 0 | 18 | **0.0%** | Critical |
| **TOTAL** | **361** | **115** | **246** | **31.9%** | |

---

## 2. Video Database Summary

### Video Coverage Metrics

- **Total Video Entries:** 169 (including duplicates)
- **Unique YouTube IDs:** 53
- **Unique Techniques with Videos:** 115 (plus 6 bonus instructor variants)

### Video Type Distribution

| Type | Count | Percentage |
|------|-------|-----------|
| **Instructional** | 138 | 81.7% |
| **Lifestyle** | 17 | 10.1% |
| **Mindset** | 14 | 8.3% |
| **QuickTip** | 0 | 0% |
| **Competition** | 0 | 0% |
| **Chain** | 0 | 0% |
| **TOTAL** | **169** | **100%** |

### Mindset & Lifestyle Content Breakdown

| Category | Count |
|----------|-------|
| Belt Journey (BJ) | 7 |
| Mental Game (MG) | 7 |
| Age & Longevity (AL) | 6 |
| Lifestyle Balance (LB) | 6 |
| Injury & Recovery (IR) | 5 |
| **TOTAL** | **31** |

---

## 3. Placeholder Video Usage Analysis

**Critical Finding:** 7 videos account for **49.1% of all instructional content** (83 of 169 entries).

### Highly Reused Videos

| YouTube ID | Uses | Instructor | Title |
|------------|------|-----------|-------|
| **ypi3ie6hKTI** | 22 | John Danaher | John Danaher Explains Closed Guard Fundamentals |
| **tyI3aszI4qo** | 13 | Gordon Ryan | Early Hand Fighting From Mount |
| **JX0HL0WpYPs** | 13 | Gordon Ryan | How To Do The Perfect Front Headlock And Turtle Escapes |
| **gnAhAdE_A90** | 12 | Lachlan Giles | The Best Way To Escape Side Control |
| **_fbCcWyYthQ** | 9 | Firas Zahabi | Training Smart - Never Be Sore Philosophy |
| **k-lCzVAzJpg** | 7 | Lachlan Giles | Escaping The Back - Pay Attention To The Leg Work |
| **Ze10eulM1xg** | 7 | John Danaher | How To Build The Perfect Half Guard Game For No Gi |

---

## 4. Critical Coverage Gaps

### Tier 1: Complete Zero Coverage
- **Leg Entanglements (LE)** - 18/18 techniques missing (0%)
  - *Impact:* Modern leg lock meta not addressed; critical for blue+ belts

### Tier 2: Critically Undercovered (<15%)
- **Open Guard (OG)** - 40/45 techniques missing (11%)
  - *Impact:* Only 5 of 45 techniques covered; butterfly/DLR variants nearly absent

### Tier 3: Severely Undercovered (15-30%)
- Submissions (SM) - 37/50 missing (26%)
- Half Guard (HG) - 22/30 missing (27%)
- Knee on Belly (KB) - 11/15 missing (27%)
- North-South (NS) - 11/15 missing (27%)
- Takedowns (TD) - 18/25 missing (28%)
- Turtle (TT) - 14/18 missing (22%)

---

## 5. Recommendations by Priority

### IMMEDIATE (0-2 weeks)
1. **Replace top 7 placeholder videos** with technique-specific content
2. **Add Leg Entanglements content** (currently 0%)
3. **Expand Open Guard (OG)** from 11% to 40%+

### SHORT-TERM (2-4 weeks)
4. **Bulk up Guard Passing (GP)** - currently 40%
5. **Improve Half Guard (HG)** - currently 27%
6. **Add Submissions variety** - currently 26%

### LONG-TERM (4-12 weeks)
7. Build missing technical position content
8. Establish instructor rotation to reduce placeholder reliance

---

## 6. Coverage Target for Launch

| Position | Current | Target | Gap |
|----------|---------|--------|-----|
| Overall | 31.9% | 50%+ | +18% |
| Leg Entanglements | 0% | 30% | +30% |
| Open Guard | 11% | 50% | +39% |
| Submissions | 26% | 50% | +24% |

---

## Related Documents

- **Video Database Requirements:** `/docs/product/_manual_product_requirements_doc/VIDEO_DATABASE.md`
- **Enrichment Template:** `/docs/domain-knowledge/bjj-techniques/video_enrichment_template.csv`
- **Source Data:** `/prototype/src/data/techniqueVideos.ts`
