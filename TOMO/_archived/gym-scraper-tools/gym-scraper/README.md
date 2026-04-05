# BJJ Gym Scraper

Scrapes BJJ gym data from multiple sources, deduplicates, geocodes, and uploads to Supabase for TOMO's onboarding gym picker.

## Setup

```bash
cd tools/gym-scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
# Edit .env with your Supabase credentials
```

## Usage

```bash
# Quick test — scrapes only TX and CA (~500 gyms, ~10 min)
python run.py test

# Full scrape — all 50 states + DC (~3,700 gyms, ~90 min)
python run.py scrape

# Process raw data (normalize, dedupe, geocode)
python run.py process

# Upload to Supabase
python run.py upload

# Full pipeline: scrape → process → upload
python run.py all
```

## Data Sources

| Source | Gyms | Status |
|--------|------|--------|
| BJJMetrics.com | ~3,700 | Active |
| Google Places API | ~5,000-8,000 | Planned (needs API key) |
| 10th Planet directory | ~150-200 | Planned |
| JiuJitsu.com | ~4,000 | Planned |

## Pipeline Steps

1. **Scrape** — Pull gym listings from each source, save to `data/raw/`
2. **Normalize** — Standardize names, phones, states; infer affiliations from names
3. **Deduplicate** — Block on (state, city), fuzzy-match names + coords, merge records
4. **Geocode** — Fill missing lat/lng via US Census Geocoder (free, no API key)
5. **Upload** — Upsert to Supabase `gyms` table

## Weekly Cron

To keep data fresh, schedule a weekly run:

```bash
# crontab -e
0 3 * * 0 cd /path/to/gym-scraper && .venv/bin/python run.py all >> /tmp/gym-scraper.log 2>&1
```

## App Integration

The TOMO app queries nearby gyms during onboarding:

```typescript
const { data } = await supabase.rpc('find_nearby_gyms', {
  user_lat: location.latitude,
  user_lng: location.longitude,
  radius_miles: 25,
  max_results: 20
});
```

## Files

```
gym-scraper/
├── run.py                 # Main pipeline runner
├── config.py              # Settings, API keys, state list
├── upload.py              # Supabase upserter
├── scrapers/
│   └── bjjmetrics.py      # BJJMetrics.com scraper
├── pipeline/
│   ├── normalize.py       # Name/phone/state standardization
│   ├── deduplicate.py     # Fuzzy matching + merge
│   └── geocode.py         # US Census Geocoder
└── data/                  # gitignored
    ├── raw/               # Raw scrape output per source
    ├── merged/            # Post-dedup intermediate
    └── ready/             # Final, ready for upload
```
