# Library Process Documentation Review Portal

## Overview
This folder contains the transcribed library process documentation from Tredyffrin Public Library's reference desk materials. All 47 HEIC images have been converted into 24 searchable markdown documents.

## Quick Start

### Open the Review Portal
Simply open this file in your browser:
```
library-documentation-review-complete.html
```

Or double-click the file `open-review-portal.html` to launch it automatically.

## Features

### 📚 Organized Navigation
- **5 Main Categories:**
  - Digital Services & Apps (6 documents)
  - Patron Services (5 documents)
  - Policies & Procedures (6 documents)
  - Meeting Rooms (5 documents)
  - Operations (2 documents)

### 🔍 Search Functionality
- Real-time search across all document titles and content
- Automatically expands categories when matches are found

### 📋 Document Information
Each document displays:
- Original source image reference (e.g., IMG_8297.HEIC)
- Category classification
- Markdown filename
- Visual element indicators (screenshots, QR codes noted in brackets)

### 💻 Responsive Design
- Desktop: Side-by-side navigation and content
- Mobile: Collapsible sidebar with toggle button
- Print-friendly: Clean output without navigation elements

## Files Structure

### Transcribed Documents (24 files)
- `*.md` - Individual markdown files for each process
- `CONVERSION_SUMMARY.md` - Detailed conversion report

### Review Portal
- `library-documentation-review-complete.html` - Self-contained review portal with all content embedded
- `review-portal.html` - Template version
- `open-review-portal.html` - Quick launcher
- `generate_review_portal.py` - Script to regenerate the portal if needed

## How to Review Transcriptions

1. **Open the Portal**: Double-click `library-documentation-review-complete.html`
2. **Browse by Category**: Click category headers to expand/collapse
3. **Select a Document**: Click any document title in the sidebar
4. **Review Content**:
   - Check the transcribed text against the source image reference
   - Visual elements are marked with [brackets]
   - Original formatting is preserved in markdown
5. **Search**: Use the search bar to find specific content
6. **Print**: Use Ctrl/Cmd + P to print any document

## Document Statistics
- **Total Images Processed**: 47 HEIC files
- **Documents Created**: 24 markdown files
- **Categories**: 5 major sections
- **Source Folders**:
  - Reference Desk Processes (33 images)
  - Other (12 images)
  - Reference Desk Tasks Checklist (2 images)
  - Patron Documents (0 images - empty)

## Regenerating the Portal
If you need to regenerate the review portal after making edits:
```bash
python3 generate_review_portal.py
```

This will read all markdown files and create a new `library-documentation-review-complete.html` with updated content.

---

*Generated: December 8, 2024*
*Tredyffrin Public Library - Chester County Library System*