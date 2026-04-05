#!/usr/bin/env python3
"""
BJJ Gym Scraper — Main Pipeline Runner

Usage:
    python run.py                  # Full pipeline: scrape → normalize → dedupe → geocode → save
    python run.py scrape           # Scrape only (saves raw data)
    python run.py process          # Process existing raw data (normalize → dedupe → geocode → save)
    python run.py upload           # Upload processed data to Supabase
    python run.py all              # Full pipeline + upload to Supabase
    python run.py test             # Quick test: scrape 2 states only (TX, CA)
"""

import json
import sys
from datetime import datetime, timezone

from config import RAW_DIR, MERGED_DIR, READY_DIR


def scrape(test_mode: bool = False, source: str = "all"):
    """Run scrapers and save raw data.

    Args:
        test_mode: If True, only scrape a small subset.
        source: Which scraper to run — "bjjmetrics", "jiujitsu", "10thplanet", or "all".
    """
    if source in ("all", "bjjmetrics"):
        from scrapers.bjjmetrics import run as bjjmetrics_run
        states = ["TX", "CA"] if test_mode else None
        bjjmetrics_run(states=states)

    if source in ("all", "jiujitsu"):
        from scrapers.jiujitsu_com import run as jiujitsu_run
        states = ["PA"] if test_mode else None
        jiujitsu_run(states=states)

    if source in ("all", "10thplanet"):
        from scrapers.tenth_planet import run as tenth_planet_run
        tenth_planet_run()


def process():
    """Process raw scraped data through the pipeline."""
    from pipeline.normalize import normalize_all
    from pipeline.deduplicate import deduplicate
    from pipeline.geocode import geocode_missing

    # Load raw data from all sources
    all_gyms = []
    for raw_file in RAW_DIR.glob("*.json"):
        with open(raw_file) as f:
            data = json.load(f)
            print(f"  Loaded {len(data)} gyms from {raw_file.name}")
            all_gyms.extend(data)

    if not all_gyms:
        print("ERROR: No raw data found. Run 'python run.py scrape' first.")
        return []

    print(f"\n--- Normalize ---")
    gyms = normalize_all(all_gyms)

    print(f"\n--- Deduplicate ---")
    gyms = deduplicate(gyms)

    print(f"\n--- Geocode missing coordinates ---")
    gyms = geocode_missing(gyms)

    # Save intermediate
    merged_file = MERGED_DIR / "gyms_merged.json"
    with open(merged_file, "w") as f:
        json.dump(gyms, f, indent=2)
    print(f"\n  Saved merged data to {merged_file}")

    # Prepare final output
    timestamp = datetime.now(timezone.utc).isoformat()
    for gym in gyms:
        gym["last_verified"] = timestamp
        # Clean up internal fields
        gym.pop("source", None)
        gym.pop("address_raw", None)

    ready_file = READY_DIR / "gyms.json"
    with open(ready_file, "w") as f:
        json.dump(gyms, f, indent=2)

    # Stats
    with_coords = sum(1 for g in gyms if g.get("lat") and g.get("lng"))
    with_affiliation = sum(1 for g in gyms if g.get("affiliation"))
    with_phone = sum(1 for g in gyms if g.get("phone"))
    with_website = sum(1 for g in gyms if g.get("website"))

    print(f"\n=== Pipeline Complete ===")
    print(f"  Total gyms:      {len(gyms)}")
    print(f"  With coords:     {with_coords} ({100*with_coords//max(len(gyms),1)}%)")
    print(f"  With affiliation: {with_affiliation}")
    print(f"  With phone:      {with_phone}")
    print(f"  With website:    {with_website}")
    print(f"  Saved to:        {ready_file}")

    return gyms


def upload_to_supabase():
    """Upload processed data to Supabase."""
    from upload import upload
    upload()


def main():
    args = sys.argv[1:]
    command = args[0] if args else "scrape_and_process"

    if command == "scrape":
        scrape()
    elif command == "process":
        process()
    elif command == "upload":
        upload_to_supabase()
    elif command == "all":
        scrape()
        process()
        upload_to_supabase()
    elif command == "test":
        scrape(test_mode=True)
        process()
    else:
        # Default: scrape + process (no upload)
        scrape()
        process()


if __name__ == "__main__":
    main()
