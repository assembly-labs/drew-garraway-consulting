"""
JiuJitsu.com gym directory scraper.

Crawls gyms.jiujitsu.com state → city → gym detail pages.
City pages have name/address/phone. Detail pages add coordinates + website.
"""

from __future__ import annotations

import json
import re
import time

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from config import US_STATES, REQUEST_DELAY, USER_AGENT, RAW_DIR

BASE_URL = "https://gyms.jiujitsu.com"
SOURCE_NAME = "jiujitsu_com"

# Map state codes to full names for URL slugs
STATE_NAMES = {
    "AL": "alabama", "AK": "alaska", "AZ": "arizona", "AR": "arkansas",
    "CA": "california", "CO": "colorado", "CT": "connecticut", "DE": "delaware",
    "FL": "florida", "GA": "georgia", "HI": "hawaii", "ID": "idaho",
    "IL": "illinois", "IN": "indiana", "IA": "iowa", "KS": "kansas",
    "KY": "kentucky", "LA": "louisiana", "ME": "maine", "MD": "maryland",
    "MA": "massachusetts", "MI": "michigan", "MN": "minnesota", "MS": "mississippi",
    "MO": "missouri", "MT": "montana", "NE": "nebraska", "NV": "nevada",
    "NH": "new-hampshire", "NJ": "new-jersey", "NM": "new-mexico", "NY": "new-york",
    "NC": "north-carolina", "ND": "north-dakota", "OH": "ohio", "OK": "oklahoma",
    "OR": "oregon", "PA": "pennsylvania", "RI": "rhode-island", "SC": "south-carolina",
    "SD": "south-dakota", "TN": "tennessee", "TX": "texas", "UT": "utah",
    "VT": "vermont", "VA": "virginia", "WA": "washington", "WV": "west-virginia",
    "WI": "wisconsin", "WY": "wyoming", "DC": "district-of-columbia",
}


def _get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT})
    return s


def scrape_state_cities(session: requests.Session, state_code: str) -> list[str]:
    """Get list of city page URLs for a state."""
    state_name = STATE_NAMES.get(state_code)
    if not state_name:
        return []

    url = f"{BASE_URL}/gyms/{state_name}/"
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    city_urls = []

    for link in soup.find_all("a", href=re.compile(rf"^{BASE_URL}/gyms/{state_name}/")):
        href = link["href"].rstrip("/")
        # Skip the state page itself
        if href == f"{BASE_URL}/gyms/{state_name}":
            continue
        city_urls.append(href + "/")

    return city_urls


def scrape_city_page(session: requests.Session, city_url: str) -> list[dict]:
    """Scrape a city page for gym listings (name, address, phone, slug)."""
    try:
        resp = session.get(city_url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    gyms = []

    # Find all gym links — they point to /gym/{slug}/
    for link in soup.find_all("a", href=re.compile(r"^https://gyms\.jiujitsu\.com/gym/")):
        slug = link["href"].rstrip("/").split("/")[-1]
        name = link.get_text(strip=True)
        if not name or not slug:
            continue
        # Avoid duplicates within the page
        if any(g["slug"] == slug for g in gyms):
            continue

        gym = {
            "slug": f"jjcom_{slug}",
            "name": name,
            "source": SOURCE_NAME,
        }

        # Try to find address and phone near this link
        # They're typically in the same list item or adjacent elements
        parent = link.find_parent("li") or link.find_parent("div")
        if parent:
            text = parent.get_text(separator="\n")
            lines = [l.strip() for l in text.split("\n") if l.strip()]

            for line in lines:
                # Phone pattern
                if re.match(r"^\+?1?\s*[\d\-\(\)\s]{10,}", line):
                    gym["phone"] = line
                # Address pattern (contains state abbreviation + zip)
                elif re.search(r",\s*[A-Z]{2}\s+\d{5}", line):
                    gym["address_raw"] = line

        # Parse address if found
        if gym.get("address_raw"):
            parsed = _parse_address(gym["address_raw"])
            gym.update(parsed)

        gym["detail_url"] = f"{BASE_URL}/gym/{slug}/"
        gyms.append(gym)

    return gyms


def scrape_gym_detail(session: requests.Session, gym: dict) -> dict:
    """Scrape individual gym page for coordinates and website."""
    url = gym.get("detail_url", "")
    if not url:
        return gym

    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException:
        return gym

    soup = BeautifulSoup(resp.text, "html.parser")

    # Extract coordinates from JavaScript (gform object or similar)
    for script in soup.find_all("script"):
        if script.string and ("latitude" in script.string or "lat" in script.string):
            # Look for coordinate patterns
            lat_match = re.search(r'"?latitude"?\s*[:=]\s*([-\d.]+)', script.string)
            lng_match = re.search(r'"?longitude"?\s*[:=]\s*([-\d.]+)', script.string)
            if lat_match and lng_match:
                try:
                    gym["lat"] = float(lat_match.group(1))
                    gym["lng"] = float(lng_match.group(1))
                except ValueError:
                    pass
                break

            # Alternative: look for [lat, lng] pattern
            coord_match = re.search(r'\[(-?\d+\.\d+),\s*(-?\d+\.\d+)\]', script.string)
            if coord_match:
                try:
                    gym["lat"] = float(coord_match.group(1))
                    gym["lng"] = float(coord_match.group(2))
                except ValueError:
                    pass
                break

    # Extract website link
    for link in soup.find_all("a", href=True):
        href = link["href"]
        text = link.get_text(strip=True).lower()
        if ("website" in text or "visit" in text) and href.startswith("http"):
            if "jiujitsu.com" not in href and "facebook.com" not in href:
                gym["website"] = href
                break

    # Also check for website in strong/li elements
    if not gym.get("website"):
        for strong in soup.find_all("strong"):
            if "website" in strong.get_text(strip=True).lower():
                next_link = strong.find_next("a", href=True)
                if next_link and next_link["href"].startswith("http"):
                    gym["website"] = next_link["href"]
                    break

    # Try to get phone from detail page if not from city page
    if not gym.get("phone"):
        for strong in soup.find_all("strong"):
            if "phone" in strong.get_text(strip=True).lower():
                phone_text = strong.find_next(string=True)
                if phone_text:
                    gym["phone"] = phone_text.strip()
                    break

    return gym


def _parse_address(address_raw: str) -> dict:
    """Parse address string into components."""
    if not address_raw:
        return {}

    parts = [p.strip() for p in address_raw.split(",")]
    result = {}

    if len(parts) >= 3:
        result["address"] = parts[0]
        result["city"] = parts[1]
        state_zip = parts[2].strip()
        match = re.match(r"([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?", state_zip)
        if match:
            result["state"] = match.group(1)
            result["zip"] = match.group(2) or ""
    elif len(parts) == 2:
        result["address"] = parts[0]
        result["city"] = parts[1]

    return result


def run(states: list[str] | None = None, fetch_details: bool = True) -> list[dict]:
    """Run the jiujitsu.com scrape.

    Args:
        states: State codes to scrape. Defaults to all US states.
        fetch_details: If True, fetch individual gym pages for coords/website.
    """
    states = states or US_STATES
    session = _get_session()
    all_gyms = []

    print(f"\n=== JiuJitsu.com Scraper ===")
    print(f"Scraping {len(states)} states...\n")

    # Phase 1: Get city URLs for each state
    all_city_urls = []
    for state in tqdm(states, desc="State pages"):
        city_urls = scrape_state_cities(session, state)
        all_city_urls.extend(city_urls)
        if city_urls:
            tqdm.write(f"  {state}: {len(city_urls)} cities")
        time.sleep(REQUEST_DELAY * 0.3)

    print(f"\nFound {len(all_city_urls)} city pages")

    # Phase 2: Scrape each city page
    for city_url in tqdm(all_city_urls, desc="City pages"):
        gyms = scrape_city_page(session, city_url)
        all_gyms.extend(gyms)
        time.sleep(REQUEST_DELAY * 0.3)

    # Dedupe by slug
    seen = set()
    unique_gyms = []
    for g in all_gyms:
        if g["slug"] not in seen:
            seen.add(g["slug"])
            unique_gyms.append(g)

    print(f"\nFound {len(unique_gyms)} unique gyms")

    # Phase 3: Optionally fetch detail pages for coords + website
    if fetch_details:
        print("Fetching detail pages for coordinates + website...\n")
        for gym in tqdm(unique_gyms, desc="Gym details"):
            scrape_gym_detail(session, gym)
            # Clean up internal fields
            gym.pop("detail_url", None)
            gym.pop("address_raw", None)
            time.sleep(REQUEST_DELAY)

    # Save
    batch_label = "_".join(states[:4]) if len(states) <= 4 else f"{states[0]}_{len(states)}states"
    output_file = RAW_DIR / f"jiujitsu_com_{batch_label}.json"
    with open(output_file, "w") as f:
        json.dump(unique_gyms, f, indent=2)

    print(f"\nDone! {len(unique_gyms)} gyms saved to {output_file}")
    return unique_gyms


if __name__ == "__main__":
    run()
