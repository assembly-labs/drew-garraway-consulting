# Reference Document
## Toshiba e-STUDIO 2525AC Documentation Project — Tredyffrin Public Library

*This document explains how the library's copier/scanner/printer documentation was developed.*

---

## Project Overview

**Purpose:** Create patron-facing and staff-facing documentation for the Toshiba e-STUDIO 2525AC multifunction device at Tredyffrin Public Library.

**Date:** December 2024

**Deliverables Created:**
| File | Type | Audience |
|------|------|----------|
| `01-Patron-Quick-Start.md` | Quick reference guide | Patrons |
| `02-Patron-FAQ.md` | Frequently asked questions | Patrons |
| `03-Existing-Signage-Transcription.md` | Transcription of current signs | Reference |
| `05-Print-Ready-Signs.md` | Ready-to-print signage text | Patrons |
| `06-Patron-FAQ.html` | Web-ready FAQ with styling | Patrons |
| `07-Staff-Guide.md` | Complete operations guide | Staff |

---

## Research Methodology

### Primary Sources (Official Toshiba Documentation)

All workflows were validated against official Toshiba manuals:

1. **Multifunctional Digital Color Systems – Copy** (Copying manual)
   - Covers: Basic copy procedure, color modes, duplex, paper selection, canceling jobs

2. **Multifunctional Digital Color Systems – Scan** (Scanning manual)
   - Covers: Scan-to-USB, Scan-to-Email, file formats, resolution, Job Finish requirement

3. **Printing Guide** (Color MFP series)
   - Covers: Driver settings, orientation, color selection, Hold Print, Private Print

4. **Troubleshooting Guide** (Color MFPs)
   - Covers: Paper jam clearance, error recovery, fuser unit warnings

5. **Quick Start Guide** (e-STUDIO 2020AC/2520AC/2525AC)
   - Covers: Simplified tasks for basic operations

### Secondary Sources (Institutional Cross-Validation)

Workflows were cross-validated against guides from libraries and universities using the same equipment:

| Institution | Document | Used For |
|-------------|----------|----------|
| Dickinson College ITS | Toshiba Scanning Step-by-Step | Scan workflows, DPI guidance |
| Dickinson College ITS | Scanning to Department Shared Folder | Network scanning |
| Milford Library Cooperative | Scan Documents to USB Drive | USB scanning procedure |
| Clarendon Hills Library | How to Scan Using Toshiba Copier | USB scanning verification |
| Bank Street Library | Scanning to USB Drive | USB removal timing |
| Stony Brook University IT | Copying on Toshiba Printers | Copy workflow, orientation |
| Mount Saint Mary College | Copying with PaperCut | PaperCut integration |
| Western University Schulich | Scan to USB on Toshiba e-Studio | USB scanning |
| Western University SSTS | Printing/Copying/Scanning | PaperCut environment |
| Kenmore-Town of Tonawanda UFSD | Hold or Private Printing | Hold/Private print workflow |
| MHA Help Desk | Hold Print and Private Printing | Hold/Private print verification |

### Validation Criteria

Each documented workflow required:
- At least one official Toshiba source
- At least one institutional source confirming the procedure
- Testing against known TPL configuration where possible

---

## Library-Specific Customizations

### Print Release System

**Standard Toshiba:** Native Hold Print / Private Print via device hard disk

**TPL Configuration:** Elevate Sky Print (third-party print management)

| Component | TPL Implementation |
|-----------|-------------------|
| Printer name at computer | Cloud Print |
| Release interface | Elevate Sky Print (orange cloud icon) |
| Authentication | User ID + Password (taped to monitor) |
| Job indicator | Number in white circle |
| Payment | Front Desk after printing |

**Documentation Impact:** All printing instructions were rewritten to reflect Elevate Sky Print workflow rather than native Toshiba hold/release.

### Existing Signage Integration

Three existing signs were photographed and transcribed:
1. "Printing from Public Computer" — Cloud Print selection
2. "Printing Your Document" — Elevate Sky Print release steps
3. "Printing Prices" — Current pricing

These were incorporated into:
- Quick Start guide (printing section)
- FAQ (printing questions)
- Staff Guide (TPL configuration section)

### Terminology Standardization

| Standard Term | Used Throughout |
|---------------|-----------------|
| Reference Desk Librarian | For help/assistance references |
| Front Desk | For payment instructions |
| Cloud Print | Printer name at computer |
| Elevate Sky Print | Release system at printer |

---

## Document Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    PATRON DOCUMENTS                          │
├─────────────────────────────────────────────────────────────┤
│  01-Quick-Start  ←→  02-FAQ  ←→  05-Signs  ←→  06-FAQ.html │
│      (guide)         (detail)    (signage)      (web)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    (informs & supports)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     STAFF DOCUMENT                           │
├─────────────────────────────────────────────────────────────┤
│  07-Staff-Guide                                              │
│    Section A: System Overview                                │
│    Section B: Mode-by-Mode Deep Dive                        │
│    Section C: Troubleshooting Playbook                      │
│    Section D: Admin-Dependent Features                      │
│    Section E: Staff Scripts                                 │
│    Section F: Source List                                   │
│    Section G: Open Questions                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Decisions Made

### 1. Document Orientation Instructions
**Decision:** Emphasize "ADF = face UP, Glass = face DOWN" throughout
**Reason:** Research identified orientation mistakes as the #1 patron failure point

### 2. Job Finish Emphasis
**Decision:** Highlight Job Finish requirement prominently in all scan instructions
**Reason:** Multiple sources noted patrons walking away without pressing Job Finish, resulting in lost scans

### 3. USB Removal Warning
**Decision:** Include explicit "Wait for 'USB Device can be removed'" warning
**Reason:** Early USB removal causes file corruption; documented in multiple institutional guides

### 4. Paper Jam Policy
**Decision:** Instruct patrons to notify staff; do not attempt self-clearance
**Reason:** Safety (hot fuser unit) and equipment protection concerns

### 5. Pricing Inclusion
**Decision:** Include specific pricing in patron documents
**Reason:** Existing signage had pricing; reduces questions and sets expectations

### 6. Hold Print Removal
**Decision:** Remove references to native Toshiba Hold Print/Private Print
**Reason:** TPL uses Elevate Sky Print; native options would confuse patrons

---

## Configuration-Dependent Items

The following items may vary if TPL configuration changes:

| Item | Current Setting | If Changed, Update |
|------|-----------------|-------------------|
| Printer name | Cloud Print | All printing instructions |
| Release system | Elevate Sky Print | All printing instructions |
| User ID location | Bottom of monitor | Quick Start, FAQ, Staff Guide |
| B/W price (Letter) | $0.10 + tax | Signs, FAQ, Quick Start |
| Color price (Letter) | $0.30 + tax | Signs, FAQ, Quick Start |
| Payment location | Front Desk | All payment references |
| Scan-to-Email | Enabled | FAQ, Staff Guide |
| Scan-to-USB | Enabled | All scan instructions |

---

## Items to Verify On-Site

Before finalizing deployment, verify:

- [ ] Paper tray assignments (which drawer = which size)
- [ ] Default color setting (B/W default?)
- [ ] Auto-logout timeout duration
- [ ] Scan-to-email attachment size limits
- [ ] USB port locations (which are active)
- [ ] Job retention time in Elevate Sky Print
- [ ] Any color copying restrictions

---

## Maintenance Notes

### When to Update Documents

| Trigger | Action |
|---------|--------|
| Pricing changes | Update: 01, 02, 05, 06 |
| Print system changes | Update: 01, 02, 05, 06, 07 |
| New features enabled | Update: 02, 07 |
| Terminology changes | Update: All documents |
| Toshiba firmware update | Review: 07 (button names, menus) |

### Version Control

All documents are stored in:
```
/tpl/
```

Recommend maintaining version history via Git commits with descriptive messages.

---

## Contact

For questions about this documentation project or the research methodology:

*[Insert library contact or project owner]*

---

*Document created: December 2024*
*Last updated: December 2024*
