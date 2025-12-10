#!/usr/bin/env python3
"""
Generate two separate portals: Staff (Librarian) and Public (Patron)
Based on document categorization analysis.
"""

import os
import json
from pathlib import Path
from datetime import datetime

def read_markdown_file(filepath):
    """Read and return markdown content from file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def escape_js_string(s):
    """Escape string for JavaScript."""
    return (s.replace('\\', '\\\\')
             .replace('`', '\\`')
             .replace('$', '\\$')
             .replace('\n', '\\n')
             .replace('\r', '\\r')
             .replace('"', '\\"')
             .replace("'", "\\'"))

def create_portal_html(title, subtitle, color_scheme, categories, documents, output_file, portal_type):
    """Create a portal HTML file with the specified content."""

    # Read the base template
    template_path = Path(__file__).parent / 'review-portal.html'
    with open(template_path, 'r', encoding='utf-8') as f:
        html_template = f.read()

    # Customize for the portal type
    html_template = html_template.replace(
        'Tredyffrin Library Process Documentation Review',
        title
    )

    # Adjust color scheme based on portal type
    if portal_type == 'staff':
        # Professional blue/green for staff
        html_template = html_template.replace(
            '--primary-color: #2c5530;',
            '--primary-color: #1a365d;'
        )
        html_template = html_template.replace(
            '--secondary-color: #4a7c59;',
            '--secondary-color: #2c5282;'
        )
        html_template = html_template.replace(
            '--accent-color: #8fb996;',
            '--accent-color: #90cdf4;'
        )
    else:
        # Friendly green for public
        html_template = html_template.replace(
            '--primary-color: #2c5530;',
            '--primary-color: #22543d;'
        )
        html_template = html_template.replace(
            '--secondary-color: #4a7c59;',
            '--secondary-color: #38a169;'
        )
        html_template = html_template.replace(
            '--accent-color: #8fb996;',
            '--accent-color: #9ae6b4;'
        )

    # Build the documents object
    docs_js = "const documents = {\n"
    for category_key, category_info in categories.items():
        docs_js += f"    '{category_key}': [\n"
        for doc in category_info['docs']:
            docs_js += f"        {{\n"
            docs_js += f"            id: '{doc['id']}',\n"
            docs_js += f"            title: '{doc['title']}',\n"
            docs_js += f"            file: '{doc['file']}',\n"
            docs_js += f"            source: '{doc['source']}',\n"
            docs_js += f"            icon: '{doc['icon']}'\n"
            docs_js += f"        }},\n"
        docs_js += "    ],\n"
    docs_js += "};\n"

    # Build embedded content
    embedded_content = "const embeddedContent = {\n"
    for doc_id, content in documents.items():
        embedded_content += f"    '{doc_id}': `{escape_js_string(content)}`,\n"
    embedded_content += "};\n"

    # Build categories HTML
    categories_html = ""
    for category_key, category_info in categories.items():
        categories_html += f"""
            <div class="category" data-category="{category_key}">
                <div class="category-header">
                    <span><i class="fas {category_info['icon']}"></i> {category_info['name']}</span>
                    <span class="doc-count">{len(category_info['docs'])}</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="category-items"></div>
            </div>
        """

    # Update the HTML with categories
    html_template = html_template.replace(
        '<div class="category expanded"',
        categories_html + '\n            <div style="display:none" class="category expanded"'
    )

    # Replace the documents definition
    html_template = html_template.replace(
        '// Document database\n        const documents = {',
        f'// Document database\n        {docs_js}\n\n        {embedded_content}\n\n        // Original placeholder\n        const documents_old = {{'
    )

    # Update loadAllDocuments to use embedded content
    html_template = html_template.replace(
        'documentContent[doc.id] = await response.text();',
        'documentContent[doc.id] = embeddedContent[doc.id] || await response.text();'
    )

    # Update the welcome screen based on portal type
    if portal_type == 'staff':
        welcome_html = f"""
                    <div class="welcome-screen">
                        <h2><i class="fas fa-user-shield"></i> {title}</h2>
                        <p>{subtitle}</p>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">{sum(len(cat['docs']) for cat in categories.values())}</div>
                                <div class="stat-label">Staff Documents</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{len(categories)}</div>
                                <div class="stat-label">Categories</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">🔒</div>
                                <div class="stat-label">Internal Only</div>
                            </div>
                        </div>
                        <div style="margin-top: 3rem; padding: 1.5rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; text-align: left;">
                            <h3 style="color: #856404; margin-bottom: 1rem;">
                                <i class="fas fa-exclamation-triangle"></i> Staff Access Only
                            </h3>
                            <p style="color: #856404;">
                                This portal contains internal library procedures and policies.
                                Do not share this content with patrons or unauthorized individuals.
                                Some documents contain sensitive operational information.
                            </p>
                        </div>
                    </div>
        """
    else:
        welcome_html = f"""
                    <div class="welcome-screen">
                        <h2><i class="fas fa-book-open"></i> {title}</h2>
                        <p>{subtitle}</p>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">{sum(len(cat['docs']) for cat in categories.values())}</div>
                                <div class="stat-label">Help Guides</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{len(categories)}</div>
                                <div class="stat-label">Service Areas</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">📚</div>
                                <div class="stat-label">Resources</div>
                            </div>
                        </div>
                        <div style="margin-top: 3rem; padding: 1.5rem; background: #d4edda; border-left: 4px solid #28a745; border-radius: 8px; text-align: left;">
                            <h3 style="color: #155724; margin-bottom: 1rem;">
                                <i class="fas fa-info-circle"></i> Welcome to Your Library Resources
                            </h3>
                            <p style="color: #155724;">
                                Browse our collection of help guides and instructions for using library services.
                                These materials are designed to help you make the most of your library experience.
                                Feel free to print any guide for your reference.
                            </p>
                        </div>
                    </div>
        """

    html_template = html_template.replace(
        '<div class="welcome-screen">',
        welcome_html.replace('<div class="welcome-screen">', '')
    )

    # Write the output file
    output_path = Path(__file__).parent / output_file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_template)

    return output_path

def main():
    """Generate two separate portals based on document categorization."""

    base_dir = Path(__file__).parent

    print("📚 Generating Separated Documentation Portals")
    print("=" * 50)

    # STAFF PORTAL DATA
    staff_categories = {
        'operations': {
            'name': 'Daily Operations',
            'icon': 'fa-clock',
            'docs': [
                {'id': 'ref-desk-checklist', 'title': 'Reference Desk Opening/Closing',
                 'file': 'reference-desk-opening-closing-checklist.md',
                 'source': 'IMG_8294-8295.HEIC', 'icon': 'fa-tasks'},
                {'id': 'toc', 'title': 'Reference Desk Resources TOC',
                 'file': 'table-of-contents.md',
                 'source': 'IMG_8296.HEIC', 'icon': 'fa-list-ol'}
            ]
        },
        'policies': {
            'name': 'Policies & Procedures',
            'icon': 'fa-gavel',
            'docs': [
                {'id': 'policies-overview', 'title': 'Library Policies & Enforcement',
                 'file': 'library-policies-overview.md',
                 'source': 'IMG_8314-8317.HEIC', 'icon': 'fa-scroll'},
                {'id': 'definitions', 'title': 'CCLS Definitions',
                 'file': 'library-definitions.md',
                 'source': 'IMG_8320.HEIC', 'icon': 'fa-book'},
                {'id': 'ccls-toc', 'title': 'CCLS Policy Structure',
                 'file': 'chester-county-library-system-table-of-contents.md',
                 'source': 'IMG_8319.HEIC', 'icon': 'fa-list'},
                {'id': 'library-cards', 'title': 'Library Cards & Enforcement',
                 'file': 'library-cards-and-patron-responsibilities.md',
                 'source': 'IMG_8321-8325.HEIC', 'icon': 'fa-id-card'},
                {'id': 'claims-holds', 'title': 'Claims & Collection Procedures',
                 'file': 'library-claims-returned-notices-holds.md',
                 'source': 'IMG_8326-8328.HEIC', 'icon': 'fa-clipboard-check'}
            ]
        },
        'patron-assistance': {
            'name': 'Patron Assistance Guides',
            'icon': 'fa-hands-helping',
            'docs': [
                {'id': 'chester-app-guide', 'title': 'Helping Patrons: App Download',
                 'file': 'chester-county-library-app-download.md',
                 'source': 'IMG_8297.HEIC', 'icon': 'fa-mobile-alt'},
                {'id': 'pin-assistance', 'title': 'Helping Patrons: Create PIN',
                 'file': 'creating-patron-pin.md',
                 'source': 'IMG_8310-8311.HEIC', 'icon': 'fa-key'}
            ]
        },
        'administration': {
            'name': 'Administrative',
            'icon': 'fa-briefcase',
            'docs': [
                {'id': 'room-appeal', 'title': 'Meeting Room Appeal Process',
                 'file': 'meeting-room-denial-appeal.md',
                 'source': 'IMG_8340.HEIC', 'icon': 'fa-balance-scale'},
                {'id': 'room-policy-full', 'title': 'Meeting Room Policy (Full)',
                 'file': 'meeting-room-policy-guidelines.md',
                 'source': 'IMG_8335-8339.HEIC', 'icon': 'fa-gavel'}
            ]
        }
    }

    # PATRON PORTAL DATA
    patron_categories = {
        'digital-services': {
            'name': 'Digital Services & Apps',
            'icon': 'fa-laptop',
            'docs': [
                {'id': 'mobile-app', 'title': 'Mobile App Instructions',
                 'file': 'mobile-app-instructions.md',
                 'source': 'IMG_8312-8313.HEIC', 'icon': 'fa-tablet'},
                {'id': 'libby', 'title': 'Getting Started with Libby',
                 'file': 'libby-getting-started.md',
                 'source': 'IMG_8302-8303.HEIC', 'icon': 'fa-book-reader'},
                {'id': 'kanopy', 'title': 'Kanopy Streaming Service',
                 'file': 'kanopy.md',
                 'source': 'IMG_8301.HEIC', 'icon': 'fa-video'},
                {'id': 'nytimes', 'title': 'NY Times Digital Access',
                 'file': 'new-york-times-digital-access.md',
                 'source': 'IMG_8309.HEIC', 'icon': 'fa-newspaper'},
                {'id': 'pin-create', 'title': 'Creating Your PIN',
                 'file': 'creating-patron-pin.md',
                 'source': 'IMG_8310-8311.HEIC', 'icon': 'fa-key'}
            ]
        },
        'computer-services': {
            'name': 'Computer & Printing',
            'icon': 'fa-desktop',
            'docs': [
                {'id': 'printing', 'title': 'Printing from Computers',
                 'file': 'public-computer-printing.md',
                 'source': 'IMG_8329-8330.HEIC', 'icon': 'fa-print'},
                {'id': 'copying', 'title': 'Making Copies',
                 'file': 'copying-at-front-desk.md',
                 'source': 'IMG_8331.HEIC', 'icon': 'fa-copy'}
            ]
        },
        'library-programs': {
            'name': 'Programs & Services',
            'icon': 'fa-calendar-alt',
            'docs': [
                {'id': 'ill', 'title': 'Interlibrary Loan Service',
                 'file': 'interlibrary-loan.md',
                 'source': 'IMG_8300.HEIC', 'icon': 'fa-exchange-alt'},
                {'id': 'museum-pass', 'title': 'Museum Pass Program',
                 'file': 'museum-pass-program-punch-card.md',
                 'source': 'IMG_8306-8308.HEIC', 'icon': 'fa-ticket-alt'},
                {'id': 'donations', 'title': 'Book Donation Schedule',
                 'file': 'book-donations-red-fox-book-shop.md',
                 'source': 'IMG_8299.HEIC', 'icon': 'fa-gift'}
            ]
        },
        'meeting-rooms': {
            'name': 'Meeting Rooms',
            'icon': 'fa-door-open',
            'docs': [
                {'id': 'room-rental', 'title': 'Meeting Room Rentals',
                 'file': 'meeting-room-rentals-tredyffrin.md',
                 'source': 'IMG_8332.HEIC', 'icon': 'fa-calendar-check'},
                {'id': 'rental-form1', 'title': 'Rental Request Form (Page 1)',
                 'file': 'meeting-room-rental-request-form.md',
                 'source': 'IMG_8333.HEIC', 'icon': 'fa-file-alt'},
                {'id': 'rental-form2', 'title': 'Rental Request Form (Page 2)',
                 'file': 'meeting-room-rental-request-form-page2.md',
                 'source': 'IMG_8334.HEIC', 'icon': 'fa-file-signature'}
            ]
        },
        'general-info': {
            'name': 'General Information',
            'icon': 'fa-info-circle',
            'docs': [
                {'id': 'library-info', 'title': 'Library Hours & Locations',
                 'file': 'tredyffrin-township-libraries-info.md',
                 'source': 'IMG_8318.HEIC', 'icon': 'fa-map-marker-alt'}
            ]
        }
    }

    # Load all document content
    print("\n📖 Loading document content...")

    staff_content = {}
    for category in staff_categories.values():
        for doc in category['docs']:
            filepath = base_dir / doc['file']
            if filepath.exists():
                content = read_markdown_file(filepath)
                staff_content[doc['id']] = content
                print(f"  ✓ Loaded: {doc['file']}")

    patron_content = {}
    for category in patron_categories.values():
        for doc in category['docs']:
            filepath = base_dir / doc['file']
            if filepath.exists():
                content = read_markdown_file(filepath)
                patron_content[doc['id']] = content
                # Don't duplicate print if already loaded for staff
                if doc['id'] not in staff_content:
                    print(f"  ✓ Loaded: {doc['file']}")

    # Generate Staff Portal
    print("\n🔒 Generating Staff Portal...")
    staff_portal = create_portal_html(
        title="Tredyffrin Library Staff Portal",
        subtitle="Internal procedures and reference materials for library staff",
        color_scheme="blue",
        categories=staff_categories,
        documents=staff_content,
        output_file="staff-portal.html",
        portal_type="staff"
    )
    print(f"  ✓ Created: {staff_portal}")

    # Generate Patron Portal
    print("\n📚 Generating Patron Portal...")
    patron_portal = create_portal_html(
        title="Tredyffrin Library Help Center",
        subtitle="Guides and resources for using library services",
        color_scheme="green",
        categories=patron_categories,
        documents=patron_content,
        output_file="patron-portal.html",
        portal_type="patron"
    )
    print(f"  ✓ Created: {patron_portal}")

    # Create index page with links to both
    index_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tredyffrin Library Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
            font-size: 2.5rem;
        }
        .portal-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        .portal-card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .portal-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 50px rgba(0,0,0,0.2);
        }
        .portal-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .staff-icon { color: #2c5282; }
        .patron-icon { color: #38a169; }
        h2 {
            color: #333;
            margin-bottom: 0.5rem;
        }
        p {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        .portal-link {
            display: inline-block;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        }
        .staff-link {
            background: #2c5282;
            color: white;
        }
        .staff-link:hover {
            background: #2a69a6;
        }
        .patron-link {
            background: #38a169;
            color: white;
        }
        .patron-link:hover {
            background: #48bb78;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 2rem;
            color: #856404;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Tredyffrin Library Documentation</h1>
        <div class="portal-grid">
            <div class="portal-card">
                <div class="portal-icon staff-icon">🔒</div>
                <h2>Staff Portal</h2>
                <p>Internal procedures, policies, and reference materials for library staff only.</p>
                <a href="staff-portal.html" class="portal-link staff-link">Access Staff Portal</a>
            </div>
            <div class="portal-card">
                <div class="portal-icon patron-icon">👥</div>
                <h2>Patron Resources</h2>
                <p>Help guides and instructions for library services that can be shared with patrons.</p>
                <a href="patron-portal.html" class="portal-link patron-link">View Patron Resources</a>
            </div>
        </div>
        <div class="warning">
            <strong>⚠️ Access Notice:</strong> The Staff Portal contains sensitive operational information.
            Please ensure appropriate access controls are in place before deployment.
        </div>
    </div>
</body>
</html>"""

    index_path = base_dir / 'index-separated.html'
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_html)

    print(f"\n📄 Created index page: {index_path}")

    print("\n" + "=" * 50)
    print("✅ Portal Generation Complete!")
    print(f"\n📊 Summary:")
    print(f"  • Staff Portal: {len(staff_content)} documents")
    print(f"  • Patron Portal: {len(patron_content)} documents")
    print(f"  • Total unique documents: {len(set(list(staff_content.keys()) + list(patron_content.keys())))}")
    print(f"\n🚀 To view the portals:")
    print(f"  1. Open: {index_path}")
    print(f"  2. Choose the appropriate portal")
    print(f"\n⚠️  Remember:")
    print(f"  • Staff Portal should be password-protected in production")
    print(f"  • Patron Portal can be publicly accessible")

if __name__ == "__main__":
    main()