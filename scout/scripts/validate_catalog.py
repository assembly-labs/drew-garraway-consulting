#!/usr/bin/env python3
"""
Validate catalog.json structure and data integrity.

Usage:
  python scripts/validate_catalog.py
"""

import json
import sys
from collections import defaultdict
from pathlib import Path

def validate_catalog():
    """Validate catalog structure and integrity."""

    catalog_path = Path(__file__).parent.parent / 'data' / 'catalog.json'

    print("=" * 80)
    print("CATALOG VALIDATION REPORT")
    print("=" * 80)

    # Load catalog
    try:
        with open(catalog_path) as f:
            catalog = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ INVALID JSON: {e}")
        return False
    except FileNotFoundError:
        print(f"❌ FILE NOT FOUND: {catalog_path}")
        return False

    print(f"✅ JSON is valid")
    print(f"📊 Total items: {len(catalog)}")

    # Check itemType presence
    print("\n1️⃣  ITEM TYPE CHECK")
    missing_type = [item['id'] for item in catalog if 'itemType' not in item]
    if missing_type:
        print(f"   ❌ {len(missing_type)} items missing itemType:")
        for item_id in missing_type[:10]:
            print(f"      • {item_id}")
        if len(missing_type) > 10:
            print(f"      ... and {len(missing_type) - 10} more")
    else:
        print("   ✅ All items have itemType")

    # Count by type
    print("\n2️⃣  ITEM TYPE DISTRIBUTION")
    type_counts = defaultdict(int)
    for item in catalog:
        type_counts[item.get('itemType', 'MISSING')] += 1

    for item_type in sorted(type_counts.keys()):
        count = type_counts[item_type]
        icon = {
            'book': '📚',
            'thing': '📦',
            'equipment': '🔧',
            'game': '🎮',
            'dvd': '📀',
            'audiovisual': '🎬',
            'comic': '💬',
            'MISSING': '❓'
        }.get(item_type, '📋')
        print(f"   {icon} {item_type}: {count} items")

    # Check for duplicate IDs
    print("\n3️⃣  DUPLICATE ID CHECK")
    id_counts = defaultdict(int)
    for item in catalog:
        id_counts[item['id']] += 1

    duplicates = {k: v for k, v in id_counts.items() if v > 1}
    if duplicates:
        print(f"   ❌ Found {len(duplicates)} duplicate IDs:")
        for item_id, count in duplicates.items():
            print(f"      • {item_id}: appears {count} times")
    else:
        print("   ✅ No duplicate IDs")

    # Check for duplicate ISBNs (excluding nulls/missing)
    print("\n4️⃣  DUPLICATE ISBN CHECK")
    isbn_counts = defaultdict(list)
    for item in catalog:
        if 'isbn' in item and item['isbn'] is not None:
            isbn_counts[item['isbn']].append(item['id'])

    dup_isbns = {k: v for k, v in isbn_counts.items() if len(v) > 1}
    if dup_isbns:
        print(f"   ⚠️  Found {len(dup_isbns)} duplicate ISBNs:")
        for isbn, item_ids in list(dup_isbns.items())[:5]:
            print(f"      • {isbn}: {', '.join(item_ids)}")
    else:
        print("   ✅ No duplicate ISBNs")

    # Check for null fields
    print("\n5️⃣  NULL FIELD CHECK")
    null_counts = defaultdict(int)
    null_items = defaultdict(list)
    for item in catalog:
        for key, value in item.items():
            if value is None:
                null_counts[key] += 1
                null_items[key].append(item['id'])

    if null_counts:
        print(f"   ⚠️  Found {sum(null_counts.values())} null values:")
        for field in sorted(null_counts.keys()):
            count = null_counts[field]
            print(f"      • {field}: {count} items")
            # Show first few items
            sample_items = null_items[field][:3]
            print(f"        Examples: {', '.join(sample_items)}")
    else:
        print("   ✅ No null fields")

    # Check required fields
    print("\n6️⃣  REQUIRED FIELD CHECK")
    required_fields = ['id', 'title', 'formats', 'description']
    missing_required = []

    for item in catalog:
        for field in required_fields:
            if field not in item:
                missing_required.append((item.get('id', 'UNKNOWN'), field))

    if missing_required:
        print(f"   ❌ Missing required fields:")
        for item_id, field in missing_required[:10]:
            print(f"      • {item_id}: missing '{field}'")
    else:
        print("   ✅ All items have required fields")

    # Check data types
    print("\n7️⃣  DATA TYPE CHECK")
    type_errors = []

    for item in catalog:
        item_id = item.get('id', 'UNKNOWN')

        if not isinstance(item.get('id'), str):
            type_errors.append((item_id, 'id should be string'))

        if not isinstance(item.get('title'), str):
            type_errors.append((item_id, 'title should be string'))

        if not isinstance(item.get('formats'), list):
            type_errors.append((item_id, 'formats should be list'))

        if 'rating' in item and item['rating'] is not None:
            if not isinstance(item['rating'], (int, float)):
                type_errors.append((item_id, 'rating should be number'))

        if 'popular' in item and not isinstance(item['popular'], bool):
            type_errors.append((item_id, 'popular should be boolean'))

    if type_errors:
        print(f"   ❌ Type errors:")
        for item_id, error in type_errors[:10]:
            print(f"      • {item_id}: {error}")
    else:
        print("   ✅ All data types correct")

    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)

    total_issues = (
        len(missing_type) +
        len(duplicates) +
        len(missing_required) +
        len(type_errors)
    )

    if total_issues == 0:
        print("✅ CATALOG IS VALID - NO CRITICAL ISSUES")
        print(f"   Total items: {len(catalog)}")
        print(f"   Item types: {len(type_counts)}")
        if null_counts:
            print(f"   ⚠️  Contains {sum(null_counts.values())} null values (consider migrating)")
        return True
    else:
        print(f"❌ FOUND {total_issues} CRITICAL ISSUE(S)")
        print("\nRECOMMENDATIONS:")
        if missing_type:
            print("  • Run: python scripts/migrate_catalog.py")
        if null_counts:
            print("  • Run: python scripts/migrate_catalog.py --remove-nulls")
        print("=" * 80)
        return False

if __name__ == '__main__':
    success = validate_catalog()
    sys.exit(0 if success else 1)
