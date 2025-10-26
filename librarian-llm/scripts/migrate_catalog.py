#!/usr/bin/env python3
"""
Migrate catalog.json to add itemType field and optionally remove null fields.

Usage:
  python scripts/migrate_catalog.py [--remove-nulls]

Options:
  --remove-nulls  Remove null fields from Library of Things items
"""

import json
import sys
import argparse
from pathlib import Path

def migrate_catalog(remove_nulls=False):
    """Migrate catalog to add itemType and optionally remove nulls."""

    catalog_path = Path(__file__).parent.parent / 'data' / 'catalog.json'

    print(f"Reading catalog from: {catalog_path}")

    with open(catalog_path, 'r') as f:
        catalog = json.load(f)

    print(f"Found {len(catalog)} items")

    # Track changes
    added_type = 0
    removed_fields = 0

    # Add itemType and optionally remove nulls
    for item in catalog:
        # Add itemType if missing
        if 'itemType' not in item:
            if item['id'].startswith('book_'):
                item['itemType'] = 'book'
            elif item['id'].startswith('lot_'):
                item['itemType'] = 'thing'
            elif item['id'].startswith('game_'):
                item['itemType'] = 'game'
            elif item['id'].startswith('dvd_') or item['id'].startswith('movie_'):
                item['itemType'] = 'dvd'
            else:
                item['itemType'] = 'book'  # default fallback
            added_type += 1

        # Remove null fields for non-book items if requested
        if remove_nulls and item['itemType'] in ['thing', 'equipment']:
            fields_to_check = ['isbn', 'author', 'publication_year', 'pages']
            for field in fields_to_check:
                if field in item and item[field] is None:
                    del item[field]
                    removed_fields += 1

    # Save migrated catalog
    with open(catalog_path, 'w') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print("✅ MIGRATION COMPLETE")
    print("=" * 60)
    print(f"Added itemType to: {added_type} items")
    if remove_nulls:
        print(f"Removed null fields: {removed_fields} fields")
    print(f"\nCatalog saved to: {catalog_path}")
    print("=" * 60)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Migrate catalog.json')
    parser.add_argument('--remove-nulls', action='store_true',
                        help='Remove null fields from Library of Things items')
    args = parser.parse_args()

    migrate_catalog(remove_nulls=args.remove_nulls)
