#!/usr/bin/env python3
"""
Generate a self-contained HTML review portal with all markdown content embedded.
"""

import os
import json
from pathlib import Path

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

def main():
    # Define the document structure
    documents = {
        'digital-services': [
            {'id': 'chester-county-app', 'title': 'Chester County Library App Download',
             'file': 'chester-county-library-app-download.md', 'source': 'IMG_8297.HEIC', 'icon': 'fa-mobile-alt'},
            {'id': 'mobile-app', 'title': 'Mobile App Instructions',
             'file': 'mobile-app-instructions.md', 'source': 'IMG_8312-8313.HEIC', 'icon': 'fa-tablet'},
            {'id': 'libby', 'title': 'Libby - Getting Started',
             'file': 'libby-getting-started.md', 'source': 'IMG_8302-8303.HEIC', 'icon': 'fa-book-reader'},
            {'id': 'kanopy', 'title': 'Kanopy Streaming Service',
             'file': 'kanopy.md', 'source': 'IMG_8301.HEIC', 'icon': 'fa-video'},
            {'id': 'nytimes', 'title': 'New York Times Digital Access',
             'file': 'new-york-times-digital-access.md', 'source': 'IMG_8309.HEIC', 'icon': 'fa-newspaper'},
            {'id': 'printing', 'title': 'Public Computer Printing',
             'file': 'public-computer-printing.md', 'source': 'IMG_8329-8330.HEIC', 'icon': 'fa-print'}
        ],
        'patron-services': [
            {'id': 'pin-creation', 'title': 'Creating a Patron PIN',
             'file': 'creating-patron-pin.md', 'source': 'IMG_8310-8311.HEIC', 'icon': 'fa-key'},
            {'id': 'ill', 'title': 'Interlibrary Loan',
             'file': 'interlibrary-loan.md', 'source': 'IMG_8300.HEIC', 'icon': 'fa-exchange-alt'},
            {'id': 'donations', 'title': 'Book Donations - Red Fox Book Shop',
             'file': 'book-donations-red-fox-book-shop.md', 'source': 'IMG_8299.HEIC', 'icon': 'fa-gift'},
            {'id': 'museum-pass', 'title': 'Museum Pass Program',
             'file': 'museum-pass-program-punch-card.md', 'source': 'IMG_8306-8308.HEIC', 'icon': 'fa-ticket-alt'},
            {'id': 'copying', 'title': 'Copying at Front Desk',
             'file': 'copying-at-front-desk.md', 'source': 'IMG_8331.HEIC', 'icon': 'fa-copy'}
        ],
        'policies': [
            {'id': 'policies-overview', 'title': 'Library Policies Overview',
             'file': 'library-policies-overview.md', 'source': 'IMG_8314-8317.HEIC', 'icon': 'fa-scroll'},
            {'id': 'definitions', 'title': 'Library Definitions',
             'file': 'library-definitions.md', 'source': 'IMG_8320.HEIC', 'icon': 'fa-book'},
            {'id': 'ccls-toc', 'title': 'CCLS Borrowing Policy TOC',
             'file': 'chester-county-library-system-table-of-contents.md', 'source': 'IMG_8319.HEIC', 'icon': 'fa-list'},
            {'id': 'library-cards', 'title': 'Library Cards & Responsibilities',
             'file': 'library-cards-and-patron-responsibilities.md', 'source': 'IMG_8321-8325.HEIC', 'icon': 'fa-id-card'},
            {'id': 'claims-holds', 'title': 'Claims, Notices & Holds',
             'file': 'library-claims-returned-notices-holds.md', 'source': 'IMG_8326-8328.HEIC', 'icon': 'fa-clipboard-check'},
            {'id': 'library-info', 'title': 'Tredyffrin Libraries Info',
             'file': 'tredyffrin-township-libraries-info.md', 'source': 'IMG_8318.HEIC', 'icon': 'fa-info-circle'}
        ],
        'meeting-rooms': [
            {'id': 'room-rental', 'title': 'Meeting Room Rentals',
             'file': 'meeting-room-rentals-tredyffrin.md', 'source': 'IMG_8332.HEIC', 'icon': 'fa-calendar-check'},
            {'id': 'rental-form1', 'title': 'Rental Request Form - Page 1',
             'file': 'meeting-room-rental-request-form.md', 'source': 'IMG_8333.HEIC', 'icon': 'fa-file-alt'},
            {'id': 'rental-form2', 'title': 'Rental Request Form - Page 2',
             'file': 'meeting-room-rental-request-form-page2.md', 'source': 'IMG_8334.HEIC', 'icon': 'fa-file-signature'},
            {'id': 'room-policy', 'title': 'Meeting Room Policy Guidelines',
             'file': 'meeting-room-policy-guidelines.md', 'source': 'IMG_8335-8339.HEIC', 'icon': 'fa-gavel'},
            {'id': 'room-appeal', 'title': 'Meeting Room Denial Appeal',
             'file': 'meeting-room-denial-appeal.md', 'source': 'IMG_8340.HEIC', 'icon': 'fa-balance-scale'}
        ],
        'operations': [
            {'id': 'ref-desk-checklist', 'title': 'Reference Desk Checklist',
             'file': 'reference-desk-opening-closing-checklist.md', 'source': 'IMG_8294-8295.HEIC', 'icon': 'fa-tasks'},
            {'id': 'toc', 'title': 'Reference Desk Table of Contents',
             'file': 'table-of-contents.md', 'source': 'IMG_8296.HEIC', 'icon': 'fa-list-ol'}
        ]
    }

    # Base directory for markdown files
    base_dir = Path(__file__).parent

    # Load all markdown content
    content_data = {}
    for category, docs in documents.items():
        for doc in docs:
            filepath = base_dir / doc['file']
            if filepath.exists():
                content = read_markdown_file(filepath)
                content_data[doc['id']] = escape_js_string(content)
                print(f"✓ Loaded: {doc['file']}")
            else:
                content_data[doc['id']] = escape_js_string(f"# {doc['title']}\n\nFile not found: {doc['file']}")
                print(f"✗ Missing: {doc['file']}")

    # Generate the embedded content JavaScript
    embedded_content = "const embeddedContent = {\n"
    for doc_id, content in content_data.items():
        embedded_content += f'    "{doc_id}": `{content}`,\n'
    embedded_content += "};\n"

    # Read the template HTML
    template_path = base_dir / 'review-portal.html'
    with open(template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Insert the embedded content before the loadAllDocuments function
    insert_marker = "// Store all document content"
    replacement = f"{embedded_content}\n        // Store all document content"
    html_content = html_content.replace(insert_marker, replacement)

    # Update the loadAllDocuments function to use embedded content
    old_function = """// Load all documents
        async function loadAllDocuments() {
            const basePath = '/Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/librarian-llm/library-process-docs/';

            // Show loading initially
            for (const [category, docs] of Object.entries(documents)) {
                for (const doc of docs) {
                    try {
                        const response = await fetch(`file://${basePath}${doc.file}`);
                        if (response.ok) {
                            documentContent[doc.id] = await response.text();
                        }
                    } catch (error) {
                        // For now, we'll use placeholder content if files can't be loaded
                        documentContent[doc.id] = `# ${doc.title}\\n\\n*Content will be loaded from: ${doc.file}*\\n\\nSource Image: ${doc.source}`;
                    }
                }
            }
        }"""

    new_function = """// Load all documents
        async function loadAllDocuments() {
            // Copy embedded content to documentContent
            Object.keys(embeddedContent).forEach(key => {
                documentContent[key] = embeddedContent[key];
            });
        }"""

    html_content = html_content.replace(old_function, new_function)

    # Save the complete HTML file
    output_path = base_dir / 'library-documentation-review-complete.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"\n✅ Generated complete review portal: {output_path}")
    print(f"   Total documents embedded: {len(content_data)}")

    # Also create a simple launcher HTML for easy access
    launcher_html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Library Documentation Review</title>
    <meta http-equiv="refresh" content="0; url=file://{output_path}">
</head>
<body>
    <p>Redirecting to review portal...</p>
    <p>If not redirected, <a href="file://{output_path}">click here</a></p>
</body>
</html>"""

    launcher_path = base_dir / 'open-review-portal.html'
    with open(launcher_path, 'w', encoding='utf-8') as f:
        f.write(launcher_html)

    print(f"   Launcher created: {launcher_path}")
    print("\nTo view the documentation review portal, open:")
    print(f"   {output_path}")

if __name__ == "__main__":
    main()