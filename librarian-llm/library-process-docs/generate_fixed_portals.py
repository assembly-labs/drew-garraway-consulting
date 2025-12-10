#!/usr/bin/env python3
"""
Fixed portal generator with proper content embedding and image links.
"""

import os
import json
from pathlib import Path
from datetime import datetime
import re

# Image source mappings
IMAGE_MAPPINGS = {
    'IMG_8294.HEIC': 'reference desk tasks checklist/IMG_8294.HEIC',
    'IMG_8295.HEIC': 'reference desk tasks checklist/IMG_8295.HEIC',
    'IMG_8296.HEIC': 'reference desk processes/IMG_8296.HEIC',
    'IMG_8297.HEIC': 'reference desk processes/IMG_8297.HEIC',
    'IMG_8298.HEIC': 'reference desk processes/IMG_8298.HEIC',
    'IMG_8299.HEIC': 'reference desk processes/IMG_8299.HEIC',
    'IMG_8300.HEIC': 'reference desk processes/IMG_8300.HEIC',
    'IMG_8301.HEIC': 'reference desk processes/IMG_8301.HEIC',
    'IMG_8302.HEIC': 'reference desk processes/IMG_8302.HEIC',
    'IMG_8303.HEIC': 'reference desk processes/IMG_8303.HEIC',
    'IMG_8304.HEIC': 'reference desk processes/IMG_8304.HEIC',
    'IMG_8305.HEIC': 'reference desk processes/IMG_8305.HEIC',
    'IMG_8306.HEIC': 'reference desk processes/IMG_8306.HEIC',
    'IMG_8307.HEIC': 'reference desk processes/IMG_8307.HEIC',
    'IMG_8308.HEIC': 'reference desk processes/IMG_8308.HEIC',
    'IMG_8309.HEIC': 'reference desk processes/IMG_8309.HEIC',
    'IMG_8310.HEIC': 'reference desk processes/IMG_8310.HEIC',
    'IMG_8311.HEIC': 'reference desk processes/IMG_8311.HEIC',
    'IMG_8312.HEIC': 'reference desk processes/IMG_8312.HEIC',
    'IMG_8313.HEIC': 'reference desk processes/IMG_8313.HEIC',
    'IMG_8314.HEIC': 'reference desk processes/IMG_8314.HEIC',
    'IMG_8315.HEIC': 'reference desk processes/IMG_8315.HEIC',
    'IMG_8316.HEIC': 'reference desk processes/IMG_8316.HEIC',
    'IMG_8317.HEIC': 'reference desk processes/IMG_8317.HEIC',
    'IMG_8318.HEIC': 'reference desk processes/IMG_8318.HEIC',
    'IMG_8319.HEIC': 'reference desk processes/IMG_8319.HEIC',
    'IMG_8320.HEIC': 'reference desk processes/IMG_8320.HEIC',
    'IMG_8321.HEIC': 'reference desk processes/IMG_8321.HEIC',
    'IMG_8322.HEIC': 'reference desk processes/IMG_8322.HEIC',
    'IMG_8323.HEIC': 'reference desk processes/IMG_8323.HEIC',
    'IMG_8324.HEIC': 'reference desk processes/IMG_8324.HEIC',
    'IMG_8325.HEIC': 'reference desk processes/IMG_8325.HEIC',
    'IMG_8326.HEIC': 'reference desk processes/IMG_8326.HEIC',
    'IMG_8327.HEIC': 'reference desk processes/IMG_8327.HEIC',
    'IMG_8328.HEIC': 'reference desk processes/IMG_8328.HEIC',
    'IMG_8329.HEIC': 'other/IMG_8329.HEIC',
    'IMG_8330.HEIC': 'other/IMG_8330.HEIC',
    'IMG_8331.HEIC': 'other/IMG_8331.HEIC',
    'IMG_8332.HEIC': 'other/IMG_8332.HEIC',
    'IMG_8333.HEIC': 'other/IMG_8333.HEIC',
    'IMG_8334.HEIC': 'other/IMG_8334.HEIC',
    'IMG_8335.HEIC': 'other/IMG_8335.HEIC',
    'IMG_8336.HEIC': 'other/IMG_8336.HEIC',
    'IMG_8337.HEIC': 'other/IMG_8337.HEIC',
    'IMG_8338.HEIC': 'other/IMG_8338.HEIC',
    'IMG_8339.HEIC': 'other/IMG_8339.HEIC',
    'IMG_8340.HEIC': 'other/IMG_8340.HEIC',
}

BASE_IMAGE_PATH = '/Users/drewgarraway/Desktop/image-processes-to-convert-to-text'

def get_image_links(source_str):
    """Convert source string to clickable image links."""
    if source_str == 'Generated' or not source_str:
        return source_str

    # Handle multiple images (e.g., "IMG_8302-8303.HEIC")
    if '-' in source_str and 'IMG' in source_str:
        # Extract the range
        match = re.match(r'IMG_(\d+)-(\d+)\.HEIC', source_str)
        if match:
            start = int(match.group(1))
            end = int(match.group(2))
            links = []
            for num in range(start, end + 1):
                img_name = f'IMG_{num}.HEIC'
                if img_name in IMAGE_MAPPINGS:
                    full_path = f'file://{BASE_IMAGE_PATH}/{IMAGE_MAPPINGS[img_name]}'
                    links.append(f'<a href="{full_path}" target="_blank" style="color: #667eea; text-decoration: none; hover: underline;">IMG_{num}</a>')
            return ', '.join(links) + '.HEIC'

    # Single image
    if source_str in IMAGE_MAPPINGS:
        full_path = f'file://{BASE_IMAGE_PATH}/{IMAGE_MAPPINGS[source_str]}'
        return f'<a href="{full_path}" target="_blank" style="color: #667eea; text-decoration: none; hover: underline;">{source_str}</a>'

    return source_str

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

def create_portal_html(title, subtitle, categories, documents, output_file, portal_type):
    """Create a complete, working portal HTML file."""

    # Color schemes
    if portal_type == 'staff':
        primary_color = '#1a365d'
        secondary_color = '#2c5282'
        accent_color = '#90cdf4'
    else:
        primary_color = '#22543d'
        secondary_color = '#38a169'
        accent_color = '#9ae6b4'

    # Build the complete HTML
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        :root {{
            --primary-color: {primary_color};
            --secondary-color: {secondary_color};
            --accent-color: {accent_color};
            --bg-color: #f8f9fa;
            --text-color: #333;
            --border-color: #dee2e6;
            --sidebar-width: 320px;
            --header-height: 70px;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--bg-color);
            overflow-x: hidden;
        }}

        .header {{
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1rem 2rem;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            height: var(--header-height);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }}

        .header h1 {{
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }}

        .search-container {{
            position: relative;
            max-width: 400px;
            flex: 1;
            margin: 0 2rem;
        }}

        .search-input {{
            width: 100%;
            padding: 0.5rem 2.5rem 0.5rem 1rem;
            border: none;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.95);
            color: var(--text-color);
            font-size: 0.95rem;
        }}

        .search-input:focus {{
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }}

        .container {{
            display: flex;
            margin-top: var(--header-height);
            min-height: calc(100vh - var(--header-height));
        }}

        .sidebar {{
            width: var(--sidebar-width);
            background: white;
            border-right: 1px solid var(--border-color);
            overflow-y: auto;
            position: fixed;
            height: calc(100vh - var(--header-height));
        }}

        .category {{
            margin-bottom: 0.5rem;
        }}

        .category-header {{
            background: var(--accent-color);
            color: white;
            padding: 0.75rem 1rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500;
            font-size: 0.95rem;
        }}

        .category-header:hover {{
            background: var(--secondary-color);
        }}

        .category-items {{
            display: none;
            background: #fafafa;
        }}

        .category.expanded .category-items {{
            display: block;
        }}

        .nav-item {{
            padding: 0.6rem 1rem 0.6rem 2rem;
            cursor: pointer;
            transition: all 0.3s;
            border-left: 3px solid transparent;
            font-size: 0.9rem;
        }}

        .nav-item:hover {{
            background: #f0f0f0;
            border-left-color: var(--secondary-color);
        }}

        .nav-item.active {{
            background: #e8f4ea;
            border-left-color: var(--primary-color);
            font-weight: 500;
        }}

        .main-content {{
            flex: 1;
            margin-left: var(--sidebar-width);
            padding: 2rem;
        }}

        .content-wrapper {{
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            padding: 2rem;
        }}

        .doc-info {{
            background: linear-gradient(135deg, #f0f7ff, #e8f4f8);
            border-left: 4px solid var(--secondary-color);
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 0 8px 8px 0;
        }}

        .doc-info h2 {{
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }}

        .doc-meta {{
            display: flex;
            gap: 2rem;
            margin-top: 0.5rem;
            font-size: 0.85rem;
            color: #666;
        }}

        .document-content h1 {{
            color: var(--primary-color);
            border-bottom: 3px solid var(--accent-color);
            padding-bottom: 0.75rem;
            margin: 2rem 0 1.5rem 0;
        }}

        .document-content h2 {{
            color: var(--secondary-color);
            margin: 1.75rem 0 1rem 0;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 0.5rem;
        }}

        .document-content h3 {{
            color: var(--secondary-color);
            margin: 1.5rem 0 0.75rem 0;
        }}

        .document-content p {{
            margin: 1rem 0;
        }}

        .document-content ul, .document-content ol {{
            margin: 1rem 0 1rem 2rem;
        }}

        .document-content li {{
            margin: 0.5rem 0;
        }}

        .welcome-screen {{
            text-align: center;
            padding: 3rem;
        }}

        .welcome-screen h2 {{
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 2rem;
        }}

        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }}

        .stat-card {{
            background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
            color: white;
            padding: 1.5rem;
            border-radius: 10px;
        }}

        .stat-number {{
            font-size: 2rem;
            font-weight: bold;
        }}

        .stat-label {{
            font-size: 0.9rem;
            opacity: 0.9;
            margin-top: 0.5rem;
        }}

        @media (max-width: 768px) {{
            .sidebar {{
                transform: translateX(-100%);
            }}
            .main-content {{
                margin-left: 0;
            }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <h1><i class="fas {'fa-user-shield' if portal_type == 'staff' else 'fa-book-open'}"></i> {title}</h1>
        <div class="search-container">
            <input type="text" class="search-input" id="searchInput" placeholder="Search documentation...">
        </div>
    </header>

    <div class="container">
        <nav class="sidebar" id="sidebar">
"""

    # Add categories
    for cat_key, cat_info in categories.items():
        html_content += f"""
            <div class="category" data-category="{cat_key}">
                <div class="category-header">
                    <span><i class="fas {cat_info['icon']}"></i> {cat_info['name']}</span>
                    <span style="background: var(--secondary-color); color: white; padding: 0.1rem 0.4rem; border-radius: 10px; font-size: 0.75rem;">{len(cat_info['docs'])}</span>
                </div>
                <div class="category-items"></div>
            </div>
"""

    html_content += """
        </nav>

        <main class="main-content" id="mainContent">
            <div class="content-wrapper">
                <div id="documentDisplay" class="document-content">
                    <div class="welcome-screen">
"""

    # Welcome content based on portal type
    if portal_type == 'staff':
        html_content += f"""
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
                        <div style="margin-top: 3rem; padding: 1.5rem; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px;">
                            <h3 style="color: #856404;"><i class="fas fa-exclamation-triangle"></i> Staff Access Only</h3>
                            <p style="color: #856404;">This portal contains internal library procedures. Do not share with patrons.</p>
                        </div>
"""
    else:
        html_content += f"""
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
"""

    html_content += """
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Document data with clickable image links
        const documents = {
"""

    # Add document data with proper image links
    for cat_key, cat_info in categories.items():
        html_content += f"            '{cat_key}': [\n"
        for doc in cat_info['docs']:
            source_with_links = get_image_links(doc['source'])
            html_content += f"""                {{
                    id: '{doc['id']}',
                    title: '{doc['title']}',
                    file: '{doc['file']}',
                    source: '{source_with_links}',
                    icon: '{doc['icon']}'
                }},
"""
        html_content += "            ],\n"

    html_content += """        };

        // Embedded content
        const documentContent = {
"""

    # Add embedded content
    for doc_id, content in documents.items():
        escaped_content = escape_js_string(content)
        html_content += f"            '{doc_id}': `{escaped_content}`,\n"

    html_content += """        };

        // Initialize navigation
        function init() {
            populateNavigation();
            setupEventListeners();
        }

        // Populate navigation items
        function populateNavigation() {
            Object.entries(documents).forEach(([category, docs]) => {
                const categoryElement = document.querySelector(`[data-category="${category}"] .category-items`);
                if (categoryElement) {
                    docs.forEach(doc => {
                        const navItem = document.createElement('div');
                        navItem.className = 'nav-item';
                        navItem.dataset.docId = doc.id;
                        navItem.innerHTML = `<i class="fas ${doc.icon}" style="margin-right: 0.5rem; color: var(--secondary-color);"></i>${doc.title}`;
                        navItem.addEventListener('click', () => loadDocument(category, doc));
                        categoryElement.appendChild(navItem);
                    });
                }
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Category expand/collapse
            document.querySelectorAll('.category-header').forEach(header => {
                header.addEventListener('click', function() {
                    this.parentElement.classList.toggle('expanded');
                });
            });

            // Search
            document.getElementById('searchInput').addEventListener('input', (e) => {
                performSearch(e.target.value);
            });
        }

        // Load document
        function loadDocument(category, doc) {
            // Update active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            event.currentTarget.classList.add('active');

            // Display document
            const display = document.getElementById('documentDisplay');
            const content = documentContent[doc.id] || 'Content not found';

            display.innerHTML = `
                <div class="doc-info">
                    <h2>${doc.title}</h2>
                    <div class="doc-meta">
                        <div><i class="fas fa-folder"></i> ${documents[category].find(d => d.id === doc.id) ? category.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()) : ''}</div>
                        <div><i class="fas fa-image"></i> Source: ${doc.source}</div>
                    </div>
                </div>
                <div class="document-content">
                    ${markdownToHtml(content)}
                </div>
            `;
        }

        // Simple markdown to HTML converter
        function markdownToHtml(markdown) {
            let html = markdown
                .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\*([^*]+)\\*/g, '<em>$1</em>')
                .replace(/\\n\\n/g, '</p><p>')
                .replace(/\\n/g, '<br>');

            return '<p>' + html + '</p>';
        }

        // Search functionality
        function performSearch(query) {
            const lowerQuery = query.toLowerCase();
            document.querySelectorAll('.nav-item').forEach(item => {
                const title = item.textContent.toLowerCase();
                const docId = item.dataset.docId;
                const content = (documentContent[docId] || '').toLowerCase();

                if (!query || title.includes(lowerQuery) || content.includes(lowerQuery)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Initialize on load
        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
"""

    # Write the file
    output_path = Path(__file__).parent / output_file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    return output_path

def main():
    """Generate fixed portals with working content and image links."""

    base_dir = Path(__file__).parent

    print("🔧 Generating Fixed Documentation Portals")
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
                print(f"  ✓ {doc['file']}")

    patron_content = {}
    for category in patron_categories.values():
        for doc in category['docs']:
            filepath = base_dir / doc['file']
            if filepath.exists():
                content = read_markdown_file(filepath)
                patron_content[doc['id']] = content

    # Generate Staff Portal
    print("\n🔒 Generating Staff Portal...")
    staff_portal = create_portal_html(
        title="Tredyffrin Library Staff Portal",
        subtitle="Internal procedures and reference materials",
        categories=staff_categories,
        documents=staff_content,
        output_file="staff-portal-fixed.html",
        portal_type="staff"
    )
    print(f"  ✓ Created: staff-portal-fixed.html")

    # Generate Patron Portal
    print("\n📚 Generating Patron Portal...")
    patron_portal = create_portal_html(
        title="Tredyffrin Library Help Center",
        subtitle="Guides and resources for library services",
        categories=patron_categories,
        documents=patron_content,
        output_file="patron-portal-fixed.html",
        portal_type="patron"
    )
    print(f"  ✓ Created: patron-portal-fixed.html")

    print("\n✅ Fixed portals generated with:")
    print("  • Working content display")
    print("  • Clickable image source links")
    print(f"  • Staff Portal: {len(staff_content)} documents")
    print(f"  • Patron Portal: {len(patron_content)} documents")
    print("\n📂 Image files can be opened by clicking source links in document info")

if __name__ == "__main__":
    main()