"""
Geocode gyms missing lat/lng coordinates.

Uses the free US Census Geocoder (no API key required).
Falls back to constructing a full address string for batch upload.
"""

from __future__ import annotations

import time
from typing import Optional, Tuple

import requests
from tqdm import tqdm

from config import USER_AGENT

CENSUS_GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"


def _geocode_single(address: str, session: requests.Session) -> tuple[float, float] | None:
    """Geocode a single address via the US Census Geocoder."""
    params = {
        "address": address,
        "benchmark": "Public_AR_Current",
        "format": "json",
    }
    try:
        resp = session.get(CENSUS_GEOCODER_URL, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        matches = data.get("result", {}).get("addressMatches", [])
        if matches:
            coords = matches[0]["coordinates"]
            return (float(coords["y"]), float(coords["x"]))  # lat, lng
    except (requests.RequestException, KeyError, ValueError, IndexError):
        pass

    return None


def _build_address_string(gym: dict) -> str | None:
    """Build a full address string for geocoding."""
    parts = []
    if gym.get("address"):
        parts.append(gym["address"])
    if gym.get("city"):
        parts.append(gym["city"])
    if gym.get("state"):
        parts.append(gym["state"])
    if gym.get("zip"):
        parts.append(gym["zip"])

    return ", ".join(parts) if len(parts) >= 2 else None


def geocode_missing(gyms: list[dict]) -> list[dict]:
    """Geocode gyms that are missing lat/lng.

    Uses the free US Census Geocoder API (no API key needed).
    Rate-limited to ~1 request per second.
    """
    needs_geocoding = [g for g in gyms if not (g.get("lat") and g.get("lng"))]
    already_have = len(gyms) - len(needs_geocoding)

    print(f"  Geocoding: {already_have} already have coords, {len(needs_geocoding)} need geocoding")

    if not needs_geocoding:
        return gyms

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    success = 0
    failed = 0

    for gym in tqdm(needs_geocoding, desc="Geocoding"):
        addr_str = _build_address_string(gym)
        if not addr_str:
            failed += 1
            continue

        coords = _geocode_single(addr_str, session)
        if coords:
            gym["lat"] = coords[0]
            gym["lng"] = coords[1]
            success += 1
        else:
            failed += 1

        time.sleep(1.0)  # Census API rate limit

    print(f"  Geocoded: {success} success, {failed} failed")
    return gyms
