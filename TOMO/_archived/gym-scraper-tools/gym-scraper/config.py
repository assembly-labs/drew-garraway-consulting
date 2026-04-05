"""Configuration for gym scraper pipeline."""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
MERGED_DIR = DATA_DIR / "merged"
READY_DIR = DATA_DIR / "ready"

# Ensure data dirs exist
for d in [RAW_DIR, MERGED_DIR, READY_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Google Places (optional, for future use)
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY", "")

# Scraping
REQUEST_DELAY = 1.0  # seconds between requests (be polite)
USER_AGENT = "TOMO-GymScraper/1.0 (BJJ training app; gym directory builder)"

# US state codes
US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "DC",
]

# Priority affiliations to tag
PRIORITY_AFFILIATIONS = [
    "Alliance",
    "10th Planet",
    "Gracie Barra",
    "Renzo Gracie",
    "Ribeiro",
    "Atos",
    "Checkmat",
    "Carlson Gracie",
    "GF Team",
    "Nova Uniao",
    "Cicero Costha",
    "SBG",
]
