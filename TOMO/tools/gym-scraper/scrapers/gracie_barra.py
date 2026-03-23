"""
Gracie Barra school directory scraper.

All US school data is server-rendered on the find-a-school page.
Parses the HTML list directly — no API calls needed.
"""

from __future__ import annotations

import json
import re

import requests
from bs4 import BeautifulSoup

from config import USER_AGENT, RAW_DIR

BASE_URL = "https://graciebarra.com"
SOURCE_NAME = "gracie_barra"

# US state name → 2-letter code mapping
STATE_TO_CODE = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
    "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
    "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
    "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
    "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS",
    "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
    "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
    "north carolina": "NC", "north dakota": "ND", "ohio": "OH", "oklahoma": "OK",
    "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
    "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
    "vermont": "VT", "virginia": "VA", "washington": "WA", "west virginia": "WV",
    "wisconsin": "WI", "wyoming": "WY", "district of columbia": "DC",
}


def _get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    })
    return s


def _parse_address(address_text: str) -> dict:
    """Parse 'street , city. state. zip' format."""
    result = {}

    # Pattern: "22 Washington St , Weymouth. Massachusetts. 2188"
    # or: "55 Waukegan Road , Deerfield. Illinois. 60015"
    parts = re.split(r'\s*[,.]\s*', address_text.strip())

    if len(parts) >= 4:
        # street , city . state . zip
        result["address"] = parts[0].strip().rstrip(",")
        result["city"] = parts[1].strip()
        state_name = parts[2].strip().lower()
        result["state"] = STATE_TO_CODE.get(state_name, state_name.upper()[:2])
        # Zip might be truncated (e.g., "2188" instead of "02188")
        zip_raw = parts[3].strip()
        if zip_raw.isdigit():
            result["zip"] = zip_raw.zfill(5)  # Pad to 5 digits
        else:
            result["zip"] = zip_raw
    elif len(parts) >= 3:
        result["address"] = parts[0].strip()
        result["city"] = parts[1].strip()
        state_name = parts[2].strip().lower()
        result["state"] = STATE_TO_CODE.get(state_name, "")

    return result


def run() -> list[dict]:
    """Scrape all Gracie Barra US locations."""
    session = _get_session()

    print(f"\n=== Gracie Barra Scraper ===")

    url = f"{BASE_URL}/find-a-school/"
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"ERROR: Failed to fetch page: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    gyms = []

    # School data is in div.school_card elements inside country accordion sections.
    # We only want "USA" and "United States" sections (not Australia, Canada, etc.)
    us_cards = []
    for title_el in soup.find_all("a", class_="school_country"):
        country = title_el.get_text(strip=True)
        if country in ("USA", "United States"):
            parent_li = title_el.find_parent("li")
            if parent_li:
                us_cards.extend(parent_li.find_all("div", class_="school_card"))

    print(f"  Found {len(us_cards)} US school cards")

    for card in us_cards:
        title_div = card.find("div", class_="title")
        if not title_div:
            continue

        name_text = title_div.get_text(strip=True)
        if not name_text or len(name_text) < 2:
            continue

        # Skip "Coming Soon" entries
        is_coming_soon = "coming soon" in name_text.lower()

        # Get address from div.location
        location_div = card.find("div", class_="location")
        address_text = location_div.get_text(strip=True) if location_div else ""

        if not address_text:
            continue

        # Parse address
        addr = _parse_address(address_text)

        # Only include US locations
        if addr.get("state") and len(addr["state"]) == 2:
            us_states = {"AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID",
                        "IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS",
                        "MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
                        "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
                        "WI","WY","DC"}
            if addr["state"] not in us_states:
                continue
        else:
            continue

        # Get website link
        website = None
        for a in card.find_all("a", href=True):
            if "visit website" in a.get_text(strip=True).lower():
                website = a["href"]
                break
            elif "graciebarra.com/" in a["href"] and "/timetable" not in a["href"]:
                website = a["href"]

        # Build clean name
        clean_name = re.sub(r'\s*[-–]\s*coming\s+soon\s*', '', name_text, flags=re.I).strip()
        display_name = f"Gracie Barra {clean_name}"

        slug = f"gb_{re.sub(r'[^a-z0-9]+', '_', clean_name.lower()).strip('_')}"

        gym = {
            "slug": slug,
            "name": display_name,
            "affiliation": "Gracie Barra",
            "source": SOURCE_NAME,
            "styles": ["bjj", "no-gi", "self-defense"],
            **addr,
        }

        if website:
            gym["website"] = website

        if not is_coming_soon:
            gyms.append(gym)

    # Dedupe by slug
    seen = set()
    unique = []
    for g in gyms:
        if g["slug"] not in seen:
            seen.add(g["slug"])
            unique.append(g)

    # Save
    output_file = RAW_DIR / "gracie_barra.json"
    with open(output_file, "w") as f:
        json.dump(unique, f, indent=2)

    print(f"Done! {len(unique)} US Gracie Barra schools saved to {output_file}")
    return unique


if __name__ == "__main__":
    run()
