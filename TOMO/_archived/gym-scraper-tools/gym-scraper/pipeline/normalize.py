"""
Normalize gym records for deduplication and upload.

Standardizes names, addresses, phone numbers, states, and infers
affiliations from gym names.
"""

from __future__ import annotations

import re

from config import PRIORITY_AFFILIATIONS

# Common name variations to normalize
NAME_SUBSTITUTIONS = {
    "brazilian jiu-jitsu": "bjj",
    "brazilian jiu jitsu": "bjj",
    "jiu-jitsu": "jiu jitsu",
    "jiujitsu": "jiu jitsu",
}

# Affiliation patterns (order matters — more specific first)
AFFILIATION_PATTERNS = [
    (r"\b10th\s*planet\b", "10th Planet"),
    (r"\bgracie\s*barra\b", "Gracie Barra"),
    (r"\brenzo\s*gracie\b", "Renzo Gracie"),
    (r"\bralph\s*gracie\b", "Ralph Gracie"),
    (r"\broger\s*gracie\b", "Roger Gracie"),
    (r"\bcarlson\s*gracie\b", "Carlson Gracie"),
    (r"\bgracie\s*humaita\b", "Gracie Humaita"),
    (r"\bgracie\s*academy\b", "Gracie Academy"),
    (r"\balliance\b", "Alliance"),
    (r"\batos\b", "Atos"),
    (r"\bcheckmat\b", "Checkmat"),
    (r"\bribeiro\b", "Ribeiro"),
    (r"\bnova\s*uni[aã]o\b", "Nova Uniao"),
    (r"\bgf\s*team\b", "GF Team"),
    (r"\bcicero\s*costha\b", "Cicero Costha"),
    (r"\bsbg\b", "SBG"),
]


def normalize_phone(phone: str | None) -> str | None:
    """Strip phone to digits only, return None if invalid."""
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    # US numbers: strip leading 1 if 11 digits
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    return digits if len(digits) == 10 else None


def normalize_state(state: str | None) -> str | None:
    """Ensure state is a 2-letter uppercase code."""
    if not state:
        return None
    state = state.strip().upper()
    return state if len(state) == 2 and state.isalpha() else None


def infer_affiliation(name: str) -> str | None:
    """Try to detect affiliation from gym name."""
    name_lower = name.lower()
    for pattern, affiliation in AFFILIATION_PATTERNS:
        if re.search(pattern, name_lower):
            return affiliation
    return None


def normalize_name(name: str) -> str:
    """Clean up gym name for display."""
    if not name:
        return ""
    # Fix common encoding issues
    name = name.replace("&amp;", "&").replace("&#39;", "'")
    # Collapse whitespace
    name = re.sub(r"\s+", " ", name).strip()
    return name


def normalize_gym(gym: dict) -> dict:
    """Normalize a single gym record."""
    result = {**gym}

    # Name
    result["name"] = normalize_name(result.get("name", ""))

    # State
    result["state"] = normalize_state(result.get("state"))

    # Phone
    result["phone"] = normalize_phone(result.get("phone"))

    # Affiliation — infer from name if not already set
    if not result.get("affiliation") and result.get("name"):
        result["affiliation"] = infer_affiliation(result["name"])

    # Rating — convert to float
    if result.get("rating"):
        try:
            result["rating"] = round(float(result["rating"]), 1)
        except (ValueError, TypeError):
            result["rating"] = None

    # Review count — convert to int
    if result.get("review_count"):
        try:
            result["review_count"] = int(result["review_count"])
        except (ValueError, TypeError):
            result["review_count"] = None

    # Lat/lng — convert to float
    for coord in ("lat", "lng"):
        if result.get(coord):
            try:
                result[coord] = float(result[coord])
            except (ValueError, TypeError):
                result[coord] = None

    # Website — ensure https
    if result.get("website"):
        w = result["website"].strip()
        if w and not w.startswith(("http://", "https://")):
            w = "https://" + w
        result["website"] = w

    # Styles — ensure list
    if result.get("styles") and isinstance(result["styles"], str):
        result["styles"] = [s.strip() for s in result["styles"].split(",")]

    # Filter out non-BJJ gyms (must have bjj or jiu jitsu related style)
    styles = result.get("styles", [])
    if styles:
        bjj_styles = {"bjj", "no-gi", "gracie jiu jitsu", "jiu jitsu"}
        if not any(s.lower() in bjj_styles for s in styles):
            result["_is_bjj"] = False
        else:
            result["_is_bjj"] = True
    else:
        # No styles listed — assume BJJ since it came from a BJJ directory
        result["_is_bjj"] = True

    return result


def normalize_all(gyms: list[dict]) -> list[dict]:
    """Normalize a list of gym records and filter non-BJJ."""
    normalized = [normalize_gym(g) for g in gyms]
    bjj_only = [g for g in normalized if g.pop("_is_bjj", True)]
    print(f"  Normalized {len(gyms)} → {len(bjj_only)} BJJ gyms")
    return bjj_only
