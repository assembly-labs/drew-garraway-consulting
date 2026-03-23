"""
Alliance BJJ school directory scraper.

Uses the WordPress AJAX API at allianceofficial.com to fetch schools
by country → state → schools.
"""

from __future__ import annotations

import json
import re
import time

import requests
from bs4 import BeautifulSoup

from config import USER_AGENT, REQUEST_DELAY, RAW_DIR

BASE_URL = "https://www.allianceofficial.com"
AJAX_URL = f"{BASE_URL}/wp-admin/admin-ajax.php"
SOURCE_NAME = "alliance"

# Map Portuguese state names to 2-letter codes
PT_STATE_TO_CODE = {
    "alabama": "AL", "alasca": "AK", "arizona": "AZ", "arkansas": "AR",
    "california": "CA", "califórnia": "CA", "carolina do norte": "NC",
    "carolina do sul": "SC", "colorado": "CO", "connecticut": "CT",
    "delaware": "DE", "florida": "FL", "georgia": "GA", "havaí": "HI",
    "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN",
    "iowa": "IA", "kansas": "KS", "kentucky": "KY", "louisiana": "LA",
    "maine": "ME", "maryland": "MD", "massachusetts": "MA", "michigan": "MI",
    "minnesota": "MN", "mississippi": "MS", "missouri": "MO", "montana": "MT",
    "nebraska": "NE", "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
    "novo méxico": "NM", "nova york": "NY", "ohio": "OH", "oklahoma": "OK",
    "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI",
    "south carolina": "SC", "south dakota": "SD", "tennessee": "TN",
    "texas": "TX", "utah": "UT", "vermont": "VT", "virginia": "VA",
    "washington": "WA", "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY",
}


def _get_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({
        "User-Agent": USER_AGENT,
        "X-Requested-With": "XMLHttpRequest",
    })
    return s


def _parse_school_html(html: str, state_code: str) -> list[dict]:
    """Parse the escola HTML fragments into gym dicts."""
    soup = BeautifulSoup(html, "html.parser")
    gyms = []

    for escola in soup.find_all("div", class_="escola"):
        widget = escola.find("div", class_="escola__widget")
        if not widget:
            continue

        h2 = widget.find("h2")
        if not h2:
            continue

        name = h2.get_text(strip=True)
        if not name:
            continue

        gym = {
            "name": name,
            "affiliation": "Alliance",
            "source": SOURCE_NAME,
            "state": state_code,
            "styles": ["bjj", "no-gi"],
        }

        # City from h3
        h3 = widget.find("h3")
        if h3:
            gym["city"] = h3.get_text(strip=True)

        # Phone from tel: link
        tel_link = widget.find("a", href=re.compile(r"^tel:"))
        if tel_link:
            gym["phone"] = tel_link.get_text(strip=True)

        # Address from <p> elements (first one that looks like an address)
        for p in widget.find_all("p"):
            text = p.get_text(strip=True)
            if text and not text.startswith("Prof") and not text.startswith("@"):
                gym["address"] = text
                break

        # Head instructor
        for p in widget.find_all("p"):
            text = p.get_text(strip=True)
            if text.startswith("Prof"):
                instructor = re.sub(r"^Prof\.?\s*Responsável\s*:\s*", "", text).strip()
                if instructor:
                    gym["head_instructor"] = instructor
                break

        # Website (non-social, non-tel, non-mailto link)
        for a in widget.find_all("a", href=True):
            href = a["href"]
            if (href.startswith("http") and
                "instagram" not in href and "facebook" not in href and
                "twitter" not in href and "youtube" not in href and
                "allianceofficial.com" not in href):
                gym["website"] = href
                break

        # Instagram
        for a in widget.find_all("a", href=re.compile(r"instagram\.com")):
            handle = a["href"].rstrip("/").split("/")[-1]
            if handle and handle != "instagram.com":
                gym["instagram"] = handle
            break

        # Build slug
        slug_base = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
        gym["slug"] = f"alliance_{slug_base}"

        gyms.append(gym)

    return gyms


def run() -> list[dict]:
    """Scrape all Alliance BJJ US locations."""
    session = _get_session()

    print(f"\n=== Alliance BJJ Scraper ===")

    # Step 1: Get US states
    resp = session.post(AJAX_URL, data={
        "action": "buscar_ufs", "pais": "Estados Unidos"
    }, timeout=15)

    try:
        states = json.loads(resp.text)
    except json.JSONDecodeError:
        print(f"ERROR: Failed to get states: {resp.text[:100]}")
        return []

    print(f"  Found {len(states)} US states with Alliance schools")

    # Step 2: Fetch schools for each state
    all_gyms = []
    for state_name in states:
        state_code = PT_STATE_TO_CODE.get(state_name.lower(), "")
        if not state_code:
            # Try direct 2-letter match
            if len(state_name) == 2 and state_name.upper().isalpha():
                state_code = state_name.upper()
            else:
                print(f"  WARNING: Unknown state '{state_name}', skipping")
                continue

        resp = session.post(AJAX_URL, data={
            "action": "buscar_escolas",
            "pais": "Estados Unidos",
            "uf": state_name,
        }, timeout=30)

        try:
            data = json.loads(resp.text)
            total = data.get("total", 0)
            html = data.get("html", "")
        except json.JSONDecodeError:
            print(f"  {state_code}: ERROR parsing response")
            continue

        if total > 0 and html:
            gyms = _parse_school_html(html, state_code)
            all_gyms.extend(gyms)
            print(f"  {state_code} ({state_name}): {len(gyms)} schools")
        else:
            print(f"  {state_code} ({state_name}): 0 schools")

        time.sleep(REQUEST_DELAY * 0.5)

    # Dedupe by slug
    seen = set()
    unique = []
    for g in all_gyms:
        if g["slug"] not in seen:
            seen.add(g["slug"])
            unique.append(g)

    # Save
    output_file = RAW_DIR / "alliance.json"
    with open(output_file, "w") as f:
        json.dump(unique, f, indent=2)

    print(f"\nDone! {len(unique)} US Alliance schools saved to {output_file}")
    return unique


if __name__ == "__main__":
    run()
