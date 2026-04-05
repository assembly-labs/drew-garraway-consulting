"""
10th Planet Jiu-Jitsu locations scraper.

Scrapes the locations page which has all gym data embedded in page source.
Coordinates are included in the map data.
"""

from __future__ import annotations

import json
import re
import time

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from config import USER_AGENT, RAW_DIR

BASE_URL = "https://10thplanetjj.com"
SOURCE_NAME = "10thplanet"


def _get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT})
    # 10th Planet has TLS cert issues, skip verification
    s.verify = False
    return s


def run() -> list[dict]:
    """Scrape all 10th Planet locations."""
    session = _get_session()

    print(f"\n=== 10th Planet Scraper ===")

    # Suppress SSL warnings since we're using verify=False
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    url = f"{BASE_URL}/locations/"
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"ERROR: Failed to fetch locations page: {e}")
        # Try alternative URL
        try:
            resp = session.get("https://www.10thplanetjj.com/locations/", timeout=30)
            resp.raise_for_status()
        except requests.RequestException as e2:
            print(f"ERROR: Alternative URL also failed: {e2}")
            return []

    soup = BeautifulSoup(resp.text, "html.parser")
    gyms = []

    # Strategy 1: Look for gmwMapObjects or similar embedded JSON
    for script in soup.find_all("script"):
        if not script.string:
            continue

        # Look for map marker data
        if "gmwMapObjects" in script.string or "marker" in script.string.lower():
            # Extract JSON arrays/objects with lat/lng
            # Pattern: {lat: XX.XX, lng: -XX.XX, title: "..."}
            marker_pattern = re.findall(
                r'\{[^}]*?"?lat(?:itude)?"?\s*:\s*([-\d.]+)[^}]*?"?lng|lon(?:gitude)?"?\s*:\s*([-\d.]+)[^}]*?\}',
                script.string
            )

            # Try to find structured marker objects
            # Look for arrays of objects with coordinates
            json_matches = re.findall(r'(\[{.*?}\])', script.string, re.DOTALL)
            for match in json_matches:
                try:
                    data = json.loads(match)
                    if isinstance(data, list):
                        for item in data:
                            if isinstance(item, dict) and ("lat" in item or "latitude" in item):
                                gym = _parse_marker(item)
                                if gym:
                                    gyms.append(gym)
                except (json.JSONDecodeError, TypeError):
                    pass

    # Strategy 2: Parse location cards/listings from HTML
    if not gyms:
        print("  No map data found, parsing HTML listings...")
        # Look for location cards
        for card in soup.find_all(["div", "article", "li"], class_=re.compile(r"location|gym|academy", re.I)):
            gym = _parse_location_card(card)
            if gym:
                gyms.append(gym)

    # Strategy 3: Find all links to individual location pages
    if not gyms:
        print("  Trying individual location links...")
        location_links = set()
        for link in soup.find_all("a", href=re.compile(r"/locations?/[^/]+", re.I)):
            href = link["href"]
            if href not in location_links and "/locations/" != href.rstrip("/"):
                location_links.add(href)

        for href in tqdm(list(location_links), desc="Location pages"):
            full_url = href if href.startswith("http") else BASE_URL + href
            gym = _scrape_location_page(session, full_url)
            if gym:
                gyms.append(gym)
            time.sleep(1.0)

    # Tag all as 10th Planet affiliation
    for gym in gyms:
        gym["affiliation"] = "10th Planet"
        gym["source"] = SOURCE_NAME

    # Save
    output_file = RAW_DIR / "10thplanet.json"
    with open(output_file, "w") as f:
        json.dump(gyms, f, indent=2)

    print(f"\nDone! {len(gyms)} gyms saved to {output_file}")
    return gyms


def _parse_marker(item: dict) -> dict | None:
    """Parse a map marker object into a gym dict."""
    lat = item.get("lat") or item.get("latitude")
    lng = item.get("lng") or item.get("lon") or item.get("longitude")
    name = item.get("title") or item.get("name") or ""

    if not name:
        return None

    gym = {
        "slug": f"10p_{re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')}",
        "name": name,
        "affiliation": "10th Planet",
    }

    if lat and lng:
        try:
            gym["lat"] = float(lat)
            gym["lng"] = float(lng)
        except (ValueError, TypeError):
            pass

    # Extract address components if available
    for key in ("address", "street", "streetAddress"):
        if key in item:
            gym["address"] = item[key]
    for key in ("city", "addressLocality"):
        if key in item:
            gym["city"] = item[key]
    for key in ("state", "addressRegion"):
        if key in item:
            gym["state"] = item[key]
    for key in ("zip", "postalCode"):
        if key in item:
            gym["zip"] = item[key]

    if item.get("url") or item.get("website"):
        gym["website"] = item.get("url") or item.get("website")

    return gym


def _parse_location_card(card) -> dict | None:
    """Parse a location card HTML element."""
    name_el = card.find(["h2", "h3", "h4", "strong"])
    if not name_el:
        return None

    name = name_el.get_text(strip=True)
    if not name or len(name) < 3:
        return None

    gym = {
        "slug": f"10p_{re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')}",
        "name": name if "10th planet" in name.lower() else f"10th Planet {name}",
        "affiliation": "10th Planet",
    }

    # Look for address text
    text = card.get_text(separator="\n")
    for line in text.split("\n"):
        line = line.strip()
        if re.search(r",\s*[A-Z]{2}\s+\d{5}", line):
            gym["address_raw"] = line
            break

    # Look for links
    for link in card.find_all("a", href=True):
        href = link["href"]
        if "google.com/maps" in href or "goo.gl" in href:
            # Extract coords from maps link
            coord_match = re.search(r"@?([-\d.]+),([-\d.]+)", href)
            if coord_match:
                gym["lat"] = float(coord_match.group(1))
                gym["lng"] = float(coord_match.group(2))
        elif href.startswith("http") and "10thplanet" not in href:
            gym["website"] = href

    return gym


def _scrape_location_page(session: requests.Session, url: str) -> dict | None:
    """Scrape an individual location page."""
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    title = soup.find("h1")
    if not title:
        return None

    name = title.get_text(strip=True)
    gym = {
        "slug": f"10p_{re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')}",
        "name": name if "10th planet" in name.lower() else f"10th Planet {name}",
        "affiliation": "10th Planet",
    }

    # Look for address, phone, coords in page content
    text = soup.get_text(separator="\n")
    for line in text.split("\n"):
        line = line.strip()
        if re.search(r",\s*[A-Z]{2}\s+\d{5}", line) and not gym.get("address"):
            parts = [p.strip() for p in line.split(",")]
            if len(parts) >= 3:
                gym["address"] = parts[0]
                gym["city"] = parts[1]
                state_match = re.match(r"([A-Z]{2})\s*(\d{5})?", parts[2])
                if state_match:
                    gym["state"] = state_match.group(1)
                    gym["zip"] = state_match.group(2) or ""

    # Coords from map embeds
    for script in soup.find_all("script"):
        if script.string and re.search(r"[-\d.]+,\s*-[-\d.]+", script.string or ""):
            coord_match = re.search(r"([-\d]{2,3}\.\d+),\s*([-\d]{2,3}\.\d+)", script.string)
            if coord_match:
                lat, lng = float(coord_match.group(1)), float(coord_match.group(2))
                if 24 < lat < 50 and -130 < lng < -60:  # US bounds check
                    gym["lat"] = lat
                    gym["lng"] = lng
                    break

    return gym


if __name__ == "__main__":
    run()
