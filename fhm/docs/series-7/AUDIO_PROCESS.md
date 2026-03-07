# Audio Library Process

How audio files get from raw recording to the live Series 7 Audio Library.

---

## Overview

Audio content falls into two categories:

| Type | Location | Badge Style | Content |
|---|---|---|---|
| **Exam Reviews** | `assets/audio/exam-reviews/` | Burgundy | Wrong-answer deep dives from practice exams |
| **Chapter Deep Dives** | `assets/audio/chapters/chXX/` | Navy | Topic-by-topic coverage of chapter material |

The audio library page lives at `pages/series-7/series-7-audio-library.html`.

---

## Process

### Phase 1: Content Creation

**For Exam Reviews:**

1. Screenshot wrong answers from practice exam (save to Desktop folder)
2. Process screenshots through the intake pipeline:
   - **Resize** images first to avoid stalling: `sips -Z 1200 input.png --out output.png`
   - **Read** images in batches of 3 (anti-timeout strategy)
   - **Extract** all questions, wrong answers, correct answers, and feedback into raw notes
3. Save raw notes to `content/series-7/raw-notes/practice-exam-wrong-answers-YYYY-MM-DD.md`
4. Write a **two-host podcast script** that teaches the lessons conversationally
   - Follow FHM brand voice (90/10 rule, no definitions first, explain the "why")
   - Group questions by topic area
   - Include a wrap-up segment identifying patterns across mistakes
5. Save script to `content/series-7/raw-notes/podcast-script-wrong-answers-YYYY-MM-DD.md`
6. Generate audio from script (external tool — NotebookLM, etc.)

**For Chapter Deep Dives:**

1. Use the chapter's written content as source material
2. Write a podcast script covering the chapter's core concepts
3. Generate audio from script

### Phase 2: Validate & Optimize

Every audio file must pass these checks before being added to the repo.

**Step 1 — Check metadata:**

```bash
afinfo input.m4a
```

Verify:
- Format is AAC (.m4a)
- Duration is reasonable (check against script length)
- Note the duration for the HTML card (round to nearest minute)

**Step 2 — Check optimization status:**

```bash
afinfo input.m4a | grep optimized
```

If it says `not optimized`, the moov atom is at the end of the file. This **must** be fixed or browsers will:
- Show incorrect duration
- Fail to seek properly
- Appear to cut off playback after ~4 minutes on longer files

**Step 3 — Optimize with ffmpeg:**

```bash
ffmpeg -i input.m4a -c copy -movflags +faststart output.m4a
```

This re-muxes only — no re-encoding, no quality loss, same file size. It moves the moov atom (metadata) to the front of the file so browsers can stream properly.

**Step 4 — Verify optimization:**

```bash
afinfo output.m4a | grep optimized
# Must say "optimized" (NOT "not optimized")
```

### Phase 3: Add to Repository

**Step 1 — Copy to correct directory:**

For exam reviews:
```bash
cp optimized-file.m4a assets/audio/exam-reviews/
```

For chapter deep dives:
```bash
mkdir -p assets/audio/chapters/chXX/
cp optimized-file.m4a assets/audio/chapters/chXX/
```

**Step 2 — File naming convention:**

- Use `Title_Case_With_Underscores.m4a`
- Keep names descriptive but concise
- Examples:
  - `Why_Common_Sense_Fails_the_Series_7.m4a`
  - `19_Psychological_Traps_On_The_Series_7.m4a`
  - `Equity_Stock_Defined_From_Buttonwood_to_ADRs.m4a`

### Phase 4: Update the Audio Library Page

Edit `pages/series-7/series-7-audio-library.html` and add a new `<article class="audio-card">` block in the appropriate section.

**Exam Review card template:**

```html
<article class="audio-card">
    <div class="audio-card__header">
        <span class="audio-card__chapter audio-card__chapter--review">Exam Review</span>
        <div class="audio-card__info">
            <h2 class="audio-card__title">[TITLE]</h2>
            <div class="audio-card__meta">
                <span>[XX] questions</span>
                <span>[XX] min</span>
            </div>
        </div>
    </div>
    <p class="audio-card__description">
        [2-3 sentence description of what's covered and the key takeaway]
    </p>
    <div class="audio-card__topics">
        <span>[Topic 1]</span>
        <span>[Topic 2]</span>
        <!-- Add topic chips for each major area covered -->
    </div>
    <div class="audio-card__player">
        <audio
            controls
            preload="metadata"
            aria-label="[TITLE] - [XX] minutes, [XX] questions reviewed"
        >
            <source
                src="../../assets/audio/exam-reviews/[FILENAME].m4a"
                type="audio/mp4">
            Your browser does not support the audio element.
        </audio>
    </div>
</article>
```

**Chapter Deep Dive card template:**

```html
<article class="audio-card">
    <div class="audio-card__header">
        <span class="audio-card__chapter">Chapter [XX]</span>
        <div class="audio-card__info">
            <h2 class="audio-card__title">[TITLE]</h2>
            <div class="audio-card__meta">
                <span>[XX] min</span>
                <span>[Subtitle / Topic Area]</span>
            </div>
        </div>
    </div>
    <p class="audio-card__description">
        [2-3 sentence description of chapter content covered]
    </p>
    <div class="audio-card__player">
        <audio
            controls
            preload="metadata"
            aria-label="[TITLE] - [XX] minutes"
        >
            <source
                src="../../assets/audio/chapters/chXX/[FILENAME].m4a"
                type="audio/mp4">
            Your browser does not support the audio element.
        </audio>
    </div>
    <a href="series-7-chapter-XX-[slug].html" class="audio-card__link">
        Read the full chapter
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
            stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
        </svg>
    </a>
</article>
```

**Key differences between the two templates:**
- Exam reviews use `audio-card__chapter--review` class (burgundy badge)
- Exam reviews include `audio-card__topics` div with topic chips
- Exam reviews show question count in meta
- Chapter deep dives include a "Read the full chapter" link
- Chapter deep dives show topic area subtitle in meta

---

## Current Audio Inventory

### Exam Reviews (3 files)

| File | Title | Questions | Duration |
|---|---|---|---|
| `Why_Common_Sense_Fails_the_Series_7.m4a` | Why Common Sense Fails the Series 7 | 19 | 42 min |
| `36_Tricky_Series_7_Exam_Traps.m4a` | 36 Tricky Series 7 Exam Traps | 36 | 80 min |
| `19_Psychological_Traps_On_The_Series_7.m4a` | 19 Psychological Traps on the Series 7 | 19 | 21 min |

### Chapter Deep Dives (10 files across 7 chapters)

| Chapter | File | Title | Duration |
|---|---|---|---|
| Ch 1 | `Equity_Stock_Defined_From_Buttonwood_to_ADRs.m4a` | Equity Stock Defined: From Buttonwood to ADRs | 31 min |
| Ch 6 | `The_Mechanics_of_Packaged_Investment_Products.m4a` | The Mechanics of Packaged Investment Products | 15 min |
| Ch 7 | `trading-markets-podcast.m4a` | Trading Markets: Market Structure, Brokers & Dealers | 13 min |
| Ch 8 | `Trading_Rules_and_Settlement_Mechanics.m4a` | Trading Rules and Settlement Mechanics | 15 min |
| Ch 8 | `trade-processing-podcast.m4a` | *(not listed on audio library page)* | — |
| Ch 10 | `Monetizing_Uncertainty_With_Straddles_And_Strangles.m4a` | Monetizing Uncertainty With Straddles and Strangles | 16 min |
| Ch 10 | `The_Financial_Rules_Behind_Your_Brokerage_Account.m4a` | The Financial Rules Behind Your Brokerage Account | 17 min |
| Ch 10 | `CIP_KYC_and_Suitability_Rules_Explained.m4a` | CIP, KYC, and Suitability Rules Explained | 35 min |
| Ch 11 | `Reg_T_Margin_Rules_and_Leverage_History.m4a` | Reg T Margin Rules and Leverage History | 35 min |
| Ch 11 | `Financial_Account_Rules_Leverage_Fiduciary_Options.m4a` | Financial Account Rules, Leverage, Fiduciary & Options | 38 min |
| Ch 18 | `Bond_Phantom_Income_and_Amortization_Traps.m4a` | Bond Phantom Income and Amortization Traps | 17 min |

---

## Troubleshooting

**Audio cuts off after ~4 minutes:**
File is not web-optimized. Run the ffmpeg faststart command and re-deploy.

**Duration shows as 0:00 or incorrect in browser:**
Same cause — moov atom is at the end. Optimize with faststart.

**Audio doesn't play at all:**
- Check the `src` path in the HTML matches the actual file location
- Verify `type="audio/mp4"` is set on the `<source>` element
- Confirm the file was actually committed and deployed (check `.gitignore` isn't blocking it)

**File is very large (100MB+):**
Consider whether the bit rate is appropriate. Most podcast content sounds fine at 128 kbps mono. If the source is 256 kbps stereo and doesn't need to be, re-encode:
```bash
ffmpeg -i input.m4a -c:a aac -b:a 128k -ac 1 -movflags +faststart output.m4a
```
