#!/usr/bin/env python3
"""
Add librarian-themed ipsum text to all catalog items without details
This creates placeholder content for items that haven't received full details yet
"""

import json
import random
from pathlib import Path

# Define the catalog path
CATALOG_PATH = Path(__file__).parent.parent / "data" / "catalog.json"

# Librarian ipsum components
LIBRARIAN_PARAGRAPHS = [
    "Dive into the stacks of arcane knowledge where Dewey decimals dance with forgotten tomes. Shelves whisper secrets of card catalogs, interlibrary loans weaving tales of overdue fines and rare editions. Patrons peruse periodicals under fluorescent glow, reference desks guarding bibliographic enigmas. Renew your checkout for endless literary adventures.",

    "Navigate labyrinthine corridors where spine labels chronicle centuries of wisdom, dust motes illuminating manuscript collections. Reserve systems hum with digital catalogs while microfiche readers preserve yesterday's headlines. Circulation desks process boundless inquiries as archival boxes cradle fragile ephemera. Silence enfolds the reading room's scholarly pursuits.",

    "Reference librarians curate annotated bibliographies beneath vaulted ceilings, special collections harboring first editions and illuminated manuscripts. Vertical files overflow with clippings while checkout cards document generations of readers. Interlibrary loan networks span continents, delivering obscure treatises to eager researchers. The book drop swallows returned volumes into sorting chambers.",

    "Acquisitions departments negotiate with antiquarian booksellers as preservation specialists repair leather bindings. Catalogers craft MARC records with meticulous precision while subject headings organize boundless information. Stacks compact mechanically, maximizing space for burgeoning collections. Late fees accrue on forgotten volumes as hold lists grow exponentially.",

    "Circulation statistics track popular titles through automated systems, barcodes replacing pocket cards of bygone eras. Quiet study carrels offer sanctuary while group rooms echo with collaborative learning. Reserve collections support curricula as databases unlock paywalled journals. Book sales clear withdrawn materials, funding future acquisitions.",

    "Archivists white-gloved handle primary sources, oral histories preserved on deteriorating media. Finding aids navigate institutional records while provenance research authenticates donations. Climate-controlled vaults protect rare maps and photographic negatives. Digital repositories ensure perpetual access to fragile materials.",

    "Children's sections burst with colorful bindings, storytime circles fostering early literacy. Young adult collections address contemporary themes while graphic novels legitimize sequential art. Summer reading programs incentivize exploration as book clubs cultivate community. Banned books displays champion intellectual freedom.",

    "Genealogy resources trace ancestral roots through census records and vital statistics, local history archives documenting community evolution. Newspapers on microfilm chronicle decades of current events while city directories map historical addresses. Cemetery transcriptions aid family researchers as immigration records reveal migration patterns."
]

BOOK_DESCRIPTORS = [
    "tome of bibliographic fascination",
    "volume awaiting cataloging adventures",
    "literary treasure from the stacks",
    "reference material extraordinaire",
    "circulating classic of the collection",
    "reserved reading for curious minds",
    "archived narrative of endless shelves"
]

THING_DESCRIPTORS = [
    "item from the Library of Things collection",
    "borrowable resource for creative exploration",
    "circulating object of practical utility",
    "hands-on tool for community engagement",
    "checkout-able equipment for your projects",
    "shared resource fostering innovation",
    "non-traditional lending material"
]

AWARDS = [
    "Dewey Decimal Award for Classification Excellence",
    "Interlibrary Loan Network Recognition",
    "Reference Desk Service Medal",
    "Circulation Statistics Achievement",
    "Card Catalog Preservation Society Honor",
    "Overdue Fine Amnesty Commendation"
]

FUN_FACTS = [
    "This item has circulated through seventeen library systems",
    "Originally cataloged using the pre-digital card system",
    "Featured in a library display celebrating National Library Week",
    "Subject to recall if requested by another patron",
    "Available in multiple formats across branch locations",
    "Requires special handling per preservation guidelines",
    "Part of a rotating collection among consortium libraries"
]

def generate_book_details():
    """Generate librarian ipsum details for a book"""
    return {
        "extendedDescription": random.choice(LIBRARIAN_PARAGRAPHS) + " " + random.choice(LIBRARIAN_PARAGRAPHS[:4]),
        "authorBio": f"A distinguished author whose works reside in special collections worldwide, their bibliography spans multiple subjects and classifications. {random.choice(LIBRARIAN_PARAGRAPHS[4:6])}",
        "awards": random.sample(AWARDS, 3),
        "reviews": [
            {
                "reviewer": "Library Journal",
                "quote": random.choice(LIBRARIAN_PARAGRAPHS).split('.')[0] + ".",
                "rating": random.randint(3, 5)
            },
            {
                "reviewer": "School Library Journal",
                "quote": random.choice(BOOK_DESCRIPTORS).capitalize() + " that enriches any collection."
            }
        ],
        "funFacts": random.sample(FUN_FACTS, 4),
        "targetAudience": "Patrons seeking literary enrichment, reference researchers, circulation enthusiasts, and readers exploring the full spectrum of cataloged materials.",
        "similarTitles": [
            "The Card Catalog Chronicles",
            "Dewey and the Decimal System",
            "Tales from the Reference Desk"
        ]
    }

def generate_thing_details():
    """Generate librarian ipsum details for a Library of Things item"""
    return {
        "whatsIncluded": [
            "Primary item as cataloged in circulation system",
            "Instructional materials and documentation",
            "Storage container or protective case",
            "Checkout card with usage guidelines",
            "Return envelope for patron feedback"
        ],
        "howToUse": random.choice(LIBRARIAN_PARAGRAPHS[2:5]) + " Consult reference materials for detailed instructions. Return to circulation desk upon completion of checkout period.",
        "careInstructions": "Handle according to library preservation guidelines. Store in provided case when not in use. Report damage to circulation desk immediately. Do not attempt unauthorized repairs or modifications.",
        "safetyInfo": "Review all documentation before use. Adult supervision may be required per library policy. Follow manufacturer guidelines as archived in reference collection. Renew checkout if additional time needed.",
        "recommendedUses": [
            "Educational exploration and skill development",
            "Community projects and creative endeavors",
            "Research and experimentation",
            "Personal enrichment activities",
            "Workshop and group learning sessions"
        ],
        "phillyTips": [
            "Check branch hours before pickup or return",
            "Philadelphia Free Library cardholders receive priority access",
            "Coordinate with reference desk for related materials",
            "Reserve online through library catalog system",
            "Join library programs featuring this item type",
            "Provide circulation feedback to inform future acquisitions"
        ],
        "bestSeasons": ["Year-round circulation"],
        "ageRecommendation": "Ages vary per item classification - consult circulation policies",
        "depositAmount": 25.0,
        "replacementCost": 75.0
    }

def main():
    """Add librarian ipsum to all items without details"""
    print("Adding librarian ipsum to items without details...")
    print()

    # Load catalog
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Track counts
    books_updated = 0
    things_updated = 0

    # Add ipsum to items without details
    for item in catalog:
        # Skip items that already have details
        if 'details' in item and item['details']:
            continue

        # Determine item type and generate appropriate ipsum
        if item['itemType'] == 'book':
            item['details'] = generate_book_details()
            books_updated += 1
            print(f"✓ Added ipsum to: {item['id']} - {item['title']} (book)")
        elif item['itemType'] in ['thing', 'equipment']:
            item['details'] = generate_thing_details()
            things_updated += 1
            print(f"✓ Added ipsum to: {item['id']} - {item['title']} (thing)")

    # Save updated catalog
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    # Summary
    print()
    print("=" * 60)
    print("✅ LIBRARIAN IPSUM COMPLETE")
    print("=" * 60)
    print(f"Added ipsum details to {books_updated + things_updated} items")
    print(f"  📚 Books: {books_updated}")
    print(f"  📦 Library of Things: {things_updated}")
    print()

    # Count total items with details
    total_with_details = sum(1 for item in catalog if 'details' in item and item['details'])
    total_items = len(catalog)
    percentage = (total_with_details / total_items) * 100

    print(f"Total items with details: {total_with_details} / {total_items} ({percentage:.1f}%)")
    print("=" * 60)

if __name__ == "__main__":
    main()
