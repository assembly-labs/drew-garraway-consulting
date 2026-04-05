"""
Deduplicate gym records across sources.

Uses blocking on (state, city) and fuzzy name matching to find duplicates,
then merges records keeping the richest data.
"""

import math
from collections import defaultdict

from thefuzz import fuzz


# Thresholds
NAME_SIMILARITY_THRESHOLD = 85      # token_set_ratio score
ADDRESS_SIMILARITY_THRESHOLD = 80
COORD_PROXIMITY_MILES = 0.15         # ~800 feet


def _haversine_miles(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Distance in miles between two lat/lng points."""
    R = 3959  # Earth radius in miles
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(a))


def _normalize_for_compare(name: str) -> str:
    """Lowercase and strip common suffixes for comparison."""
    n = name.lower().strip()
    for suffix in (" llc", " inc", " academy", " school", " bjj", " jiu jitsu", " jiu-jitsu"):
        if n.endswith(suffix):
            n = n[: -len(suffix)].strip()
    return n


def _is_duplicate(a: dict, b: dict) -> bool:
    """Check if two gym records are likely the same gym."""
    # Phone match is a strong signal
    if a.get("phone") and b.get("phone") and a["phone"] == b["phone"]:
        return True

    # Google Place ID match is definitive
    if a.get("google_place_id") and b.get("google_place_id"):
        if a["google_place_id"] == b["google_place_id"]:
            return True

    # Name similarity
    name_a = _normalize_for_compare(a.get("name", ""))
    name_b = _normalize_for_compare(b.get("name", ""))
    name_score = fuzz.token_set_ratio(name_a, name_b)

    if name_score < NAME_SIMILARITY_THRESHOLD:
        return False

    # If names are similar, check coords or address
    if (a.get("lat") and a.get("lng") and b.get("lat") and b.get("lng")):
        dist = _haversine_miles(a["lat"], a["lng"], b["lat"], b["lng"])
        if dist < COORD_PROXIMITY_MILES:
            return True

    # Address similarity as fallback
    if a.get("address") and b.get("address"):
        addr_score = fuzz.token_set_ratio(
            a["address"].lower(), b["address"].lower()
        )
        if addr_score >= ADDRESS_SIMILARITY_THRESHOLD:
            return True

    # Very high name match alone (exact or near-exact)
    if name_score >= 95:
        return True

    return False


def _merge_records(primary: dict, secondary: dict) -> dict:
    """Merge two gym records, preferring primary but filling gaps from secondary."""
    merged = {**primary}

    # Fill in missing fields from secondary
    for key in secondary:
        if key == "sources":
            continue  # handled separately
        if not merged.get(key) and secondary.get(key):
            merged[key] = secondary[key]

    # Merge sources
    sources = set(merged.get("sources", []) or [])
    sources.update(secondary.get("sources", []) or [])
    if merged.get("source"):
        sources.add(merged["source"])
    if secondary.get("source"):
        sources.add(secondary["source"])
    merged["sources"] = sorted(sources)

    # Merge source_ids
    ids = {**(merged.get("source_ids") or {}), **(secondary.get("source_ids") or {})}
    if ids:
        merged["source_ids"] = ids

    return merged


def _richness_score(gym: dict) -> int:
    """Score how complete a record is (higher = more data)."""
    score = 0
    for field in ("name", "address", "city", "state", "zip", "lat", "lng",
                  "phone", "website", "instagram", "rating", "head_instructor",
                  "affiliation"):
        if gym.get(field):
            score += 1
    if gym.get("lat") and gym.get("lng"):
        score += 3  # coords are extra valuable
    return score


def deduplicate(gyms: list[dict]) -> list[dict]:
    """Deduplicate a list of gym records.

    Uses blocking on (state, city) to limit comparisons, then fuzzy
    matching within each block.
    """
    # Block by (state, city_lower)
    blocks: dict[str, list[dict]] = defaultdict(list)
    no_location = []

    for gym in gyms:
        state = (gym.get("state") or "").upper()
        city = (gym.get("city") or "").lower().strip()
        if state and city:
            blocks[f"{state}:{city}"].append(gym)
        else:
            no_location.append(gym)

    merged_gyms = []
    total_dupes = 0

    for block_key, block_gyms in blocks.items():
        # Sort by richness so the best record is primary
        block_gyms.sort(key=_richness_score, reverse=True)

        used = set()
        for i, gym_a in enumerate(block_gyms):
            if i in used:
                continue
            merged = gym_a
            for j in range(i + 1, len(block_gyms)):
                if j in used:
                    continue
                if _is_duplicate(merged, block_gyms[j]):
                    merged = _merge_records(merged, block_gyms[j])
                    used.add(j)
                    total_dupes += 1
            merged_gyms.append(merged)

    # Add gyms without location info (can't dedupe them reliably)
    merged_gyms.extend(no_location)

    print(f"  Deduplication: {len(gyms)} → {len(merged_gyms)} ({total_dupes} duplicates merged)")
    return merged_gyms
