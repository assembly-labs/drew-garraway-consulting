"""
BJJMetrics.com scraper.

Crawls /gyms/gyms_by_state/{STATE} for each US state to get gym slugs,
then visits each /gyms/gym/{slug} detail page to extract full data
including coordinates from Schema.org JSON-LD.
"""

from __future__ import annotations

import json
import re
import time
from pathlib import Path
from typing import Optional

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from config import US_STATES, REQUEST_DELAY, USER_AGENT, RAW_DIR

BASE_URL = "https://bjjmetrics.com"
SOURCE_NAME = "bjjmetrics"


def _get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT})
    return s


def scrape_state_listing(session: requests.Session, state: str) -> list[dict]:
    """Scrape the state listing page to get gym slugs and basic info."""
    url = f"{BASE_URL}/gyms/gyms_by_state/{state}"
    resp = session.get(url, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    gyms = []

    # Find all gym card links — they point to /gyms/gym/{slug}
    for link in soup.find_all("a", href=re.compile(r"^/gyms/gym/")):
        slug = link["href"].replace("/gyms/gym/", "").strip("/")
        if not slug:
            continue
        # Avoid duplicate slugs from "View Details" links
        if any(g["slug"] == slug for g in gyms):
            continue
        gyms.append({
            "slug": slug,
            "name": link.get_text(strip=True),
            "state": state,
        })

    return gyms


def scrape_gym_detail(session: requests.Session, slug: str) -> dict | None:
    """Scrape a gym detail page for full data via Schema.org JSON-LD."""
    url = f"{BASE_URL}/gyms/gym/{slug}"
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  [WARN] Failed to fetch {slug}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    gym = {"slug": slug, "source": SOURCE_NAME}

    # --- Extract Schema.org JSON-LD ---
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string)
        except (json.JSONDecodeError, TypeError):
            continue

        if isinstance(data, dict) and data.get("@type") == "SportsActivityLocation":
            gym["name"] = data.get("name", "")

            # Address can be a string or a PostalAddress object
            addr = data.get("address", "")
            if isinstance(addr, dict):
                gym["address_raw"] = addr.get("streetAddress", "")
                gym["state"] = addr.get("addressRegion", "")
                city = addr.get("addressLocality", "")
                if city:
                    gym["city"] = city
            else:
                gym["address_raw"] = addr

            gym["phone"] = data.get("telephone", "")
            gym["website"] = data.get("url", "")
            gym["rating"] = data.get("aggregateRating", {}).get("ratingValue")
            gym["review_count"] = data.get("aggregateRating", {}).get("reviewCount")

            # Coordinates — try geo object first, then hasMap URL
            geo = data.get("geo", {})
            if geo:
                gym["lat"] = geo.get("latitude")
                gym["lng"] = geo.get("longitude")
            else:
                # Extract from hasMap: "https://www.google.com/maps?q=LAT,LNG"
                has_map = data.get("hasMap", "")
                if has_map and "q=" in has_map:
                    try:
                        coords_str = has_map.split("q=")[1].split("&")[0]
                        lat_str, lng_str = coords_str.split(",")
                        gym["lat"] = float(lat_str)
                        gym["lng"] = float(lng_str)
                    except (ValueError, IndexError):
                        pass

            # Instructors
            employees = data.get("employee", [])
            if isinstance(employees, dict):
                employees = [employees]
            if employees:
                gym["head_instructor"] = employees[0].get("name", "")

            # Instagram from sameAs
            same_as = data.get("sameAs", [])
            if isinstance(same_as, str):
                same_as = [same_as]
            for link_url in same_as:
                if "instagram.com" in str(link_url):
                    handle = str(link_url).rstrip("/").split("/")[-1]
                    gym["instagram"] = handle
                    break

            break  # Found the main schema, stop looking

    # --- Extract styles from tags ---
    styles = []
    for span in soup.find_all("span"):
        text = span.get_text(strip=True).lower()
        if text in (
            "bjj", "no-gi", "mma", "muay thai", "wrestling", "judo",
            "boxing", "kickboxing", "self-defense", "gracie jiu jitsu",
            "karate", "aikido", "yoga",
        ):
            styles.append(text)
    if styles:
        gym["styles"] = list(dict.fromkeys(styles))  # dedupe, preserve order

    return gym if gym.get("name") else None


def parse_address(address_raw) -> dict:
    """Parse a raw address string into components."""
    if not address_raw:
        return {}
    if isinstance(address_raw, dict):
        # Already parsed by Schema.org handler
        return {}

    address_raw = str(address_raw)
    # Pattern: "street, city, STATE ZIP, country"
    parts = [p.strip() for p in address_raw.split(",")]
    result = {}

    if len(parts) >= 3:
        result["address"] = parts[0]
        result["city"] = parts[1]
        # State + ZIP: "TX 77401"
        state_zip = parts[2].strip()
        match = re.match(r"([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?", state_zip)
        if match:
            result["state"] = match.group(1)
            result["zip"] = match.group(2) or ""
    elif len(parts) == 2:
        result["address"] = parts[0]
        result["city"] = parts[1]
    elif len(parts) == 1:
        result["address"] = parts[0]

    return result


def run(states: list[str] | None = None) -> list[dict]:
    """Run the full BJJMetrics scrape.

    Args:
        states: List of state codes to scrape. Defaults to all US states.

    Returns:
        List of gym dicts ready for the pipeline.
    """
    states = states or US_STATES
    session = _get_session()
    all_gyms = []
    all_slugs = []

    print(f"\n=== BJJMetrics Scraper ===")
    print(f"Scraping {len(states)} states...\n")

    # Phase 1: Get all slugs from state listing pages
    for state in tqdm(states, desc="State listings"):
        try:
            gyms = scrape_state_listing(session, state)
            all_slugs.extend(gyms)
            if gyms:
                tqdm.write(f"  {state}: {len(gyms)} gyms")
        except requests.RequestException as e:
            tqdm.write(f"  {state}: ERROR - {e}")
        time.sleep(REQUEST_DELAY * 0.5)  # Lighter delay for listing pages

    # Dedupe slugs (same gym might appear in multiple states somehow)
    seen_slugs = set()
    unique_slugs = []
    for g in all_slugs:
        if g["slug"] not in seen_slugs:
            seen_slugs.add(g["slug"])
            unique_slugs.append(g)

    print(f"\nFound {len(unique_slugs)} unique gyms across {len(states)} states")
    print(f"Fetching detail pages...\n")

    # Phase 2: Fetch detail pages for each gym
    for entry in tqdm(unique_slugs, desc="Gym details"):
        detail = scrape_gym_detail(session, entry["slug"])
        if detail:
            # Parse the address into components
            addr = parse_address(detail.pop("address_raw", ""))
            detail.update({k: v for k, v in addr.items() if k not in detail or not detail[k]})

            # Use state from listing if detail didn't parse it
            if not detail.get("state") and entry.get("state"):
                detail["state"] = entry["state"]

            all_gyms.append(detail)
        time.sleep(REQUEST_DELAY)

    # Save raw output to a batch-specific file to avoid race conditions
    batch_label = "_".join(states[:4]) if len(states) <= 4 else f"{states[0]}_{len(states)}states"
    output_file = RAW_DIR / f"bjjmetrics_{batch_label}.json"
    with open(output_file, "w") as f:
        json.dump(all_gyms, f, indent=2)

    print(f"\nDone! {len(all_gyms)} gyms saved to {output_file}")
    return all_gyms


if __name__ == "__main__":
    run()
