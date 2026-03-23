"""
Upload gym data to Supabase.

Upserts gym records into the `gyms` table using the service_role key.
Idempotent — safe to run repeatedly.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from supabase import create_client
from tqdm import tqdm

from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, READY_DIR


# Fields that map directly to the gyms table
TABLE_FIELDS = {
    "name", "slug", "address", "city", "state", "zip",
    "lat", "lng", "affiliation", "is_headquarters", "website",
    "phone", "instagram", "rating", "review_count", "styles",
    "head_instructor", "google_place_id", "sources", "source_ids",
    "verified", "last_verified",
}

BATCH_SIZE = 100


def _prepare_record(gym: dict) -> dict:
    """Convert a gym dict to a Supabase-ready record."""
    record = {}
    for key in TABLE_FIELDS:
        if key in gym and gym[key] is not None:
            record[key] = gym[key]

    # Ensure sources is a list
    if "sources" not in record:
        source = gym.get("source")
        record["sources"] = [source] if source else []

    # Ensure source_ids is a dict
    if "source_ids" not in record:
        record["source_ids"] = {}

    return record


def upload(gyms: list[dict] | None = None, file_path: Path | None = None):
    """Upload gyms to Supabase.

    Args:
        gyms: List of gym dicts to upload.
        file_path: Path to JSON file to load gyms from.
            If neither is provided, loads from data/ready/gyms.json.
    """
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
        return

    if gyms is None:
        file_path = file_path or READY_DIR / "gyms.json"
        if not file_path.exists():
            print(f"ERROR: No data file found at {file_path}")
            print("  Run the scraper first: python run.py scrape")
            return
        with open(file_path) as f:
            gyms = json.load(f)

    print(f"\n=== Uploading {len(gyms)} gyms to Supabase ===\n")

    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    success = 0
    errors = 0

    # Upload in batches
    for i in tqdm(range(0, len(gyms), BATCH_SIZE), desc="Uploading"):
        batch = gyms[i : i + BATCH_SIZE]
        records = [_prepare_record(g) for g in batch]

        try:
            # Upsert on slug (unique identifier from source)
            result = (
                client.table("gyms")
                .upsert(records, on_conflict="slug")
                .execute()
            )
            success += len(records)
        except Exception as e:
            print(f"\n  [ERROR] Batch {i // BATCH_SIZE}: {e}")
            # Try individual inserts for the failed batch
            for record in records:
                try:
                    client.table("gyms").upsert(
                        record, on_conflict="slug"
                    ).execute()
                    success += 1
                except Exception as e2:
                    errors += 1
                    print(f"  [SKIP] {record.get('name', '?')}: {e2}")

    print(f"\nDone! {success} uploaded, {errors} errors")


if __name__ == "__main__":
    upload()
