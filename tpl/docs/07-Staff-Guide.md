# Staff Operations Guide
## Toshiba e-STUDIO 2525AC — Tredyffrin Public Library

*Internal document for Reference Desk staff, front-desk staff, and IT liaison*

---

# Section A: System Overview

## What the e-STUDIO 2525AC Can Do

The Toshiba e-STUDIO 2525AC is a multifunction device (MFP) that provides:

| Function | Description |
|----------|-------------|
| **Copy** | Photocopy documents in B/W or color, single or duplex |
| **Scan** | Digitize documents to USB, email, or network folder |
| **Print** | Output documents sent from library computers via Cloud Print / Elevate Sky Print |

### Key Specifications
- **Speed:** Up to 25 pages per minute (color and B/W)
- **Paper Sizes:** Letter, Legal, Ledger (11x17)
- **Paper Capacity:** Multiple drawers + bypass tray
- **Duplex:** Automatic two-sided copying, scanning, and printing
- **Scan Formats:** PDF, TIFF, JPEG, XPS, PDF/A, DOCX, XLSX, PPTX (some require OCR)

---

## Tredyffrin-Specific Configuration

| Feature | Configuration at TPL |
|---------|---------------------|
| **Print Release System** | Elevate Sky Print (not native Toshiba hold/release) |
| **Printer Name** | Cloud Print (selected at public computers) |
| **Authentication** | User ID and Password taped to computer monitors |
| **Payment** | Pay at Front Desk immediately after printing |
| **Scan to Email** | Available (check SMTP status if issues arise) |
| **Scan to USB** | Enabled |
| **Scan to Network** | Not available for patrons |

---

## Common Library-Specific Limitations

| Limitation | Reason |
|------------|--------|
| Patrons cannot refill paper | Staff responsibility; prevents jams from incorrect loading |
| Patrons cannot clear jams | Safety (hot fuser) and equipment protection |
| No bypass tray for patrons | Special media requires staff assistance |
| No network folder scanning | Security; not configured for public use |
| No USB printing | Security risk; disabled |
| Hold/Private Print unavailable | Library uses Elevate Sky Print instead |

---

## Features to Keep Disabled/Hidden in Public Mode

- **e-Filing and Overlay printing** — Privacy concerns
- **USB printing** — Security risk (malware)
- **Scan-to-FTP/SMTP settings** — Admin-only
- **Twin Color and Proof Print** — Confuses patrons
- **Admin menus** — Should be password-protected

---

# Section B: Mode-by-Mode Deep Dive

## Copy Mode

### Accessing Copy Mode
- Press the **COPY** hard key, OR
- Tap **Home → Copy** on touch panel
- PaperCut environments may require **Access Device → Copy**

### Color Settings
| Option | Use When |
|--------|----------|
| **Black** | Default for cost savings; text documents |
| **Full Color** | Patron explicitly needs color output |
| **Auto Color** | NOT recommended — may misjudge light colors |

**Staff Note:** Default is set to Black to reduce costs. If patron complains about B/W output, verify they selected Full Color before pressing Start.

### Duplex Logic
| Setting | Meaning |
|---------|---------|
| **1→1** | Single-sided original → single-sided copy (default) |
| **1→2** | Single-sided original → double-sided copy |
| **2→2** | Double-sided original → double-sided copy |
| **2→1** | Double-sided original → single-sided copy |

### Tray Selection Behavior
- Machine auto-selects drawer based on detected original size
- To override: tap **Paper** and select specific drawer or **Bypass tray**
- Bypass tray requires specifying paper size/type manually

### Common Copy Misconfigurations
| Issue | Cause | Fix |
|-------|-------|-----|
| Blank output | Document placed wrong way | ADF = face up; Glass = face down |
| Unexpected B/W | Auto Color selected or default is Black | Select Full Color explicitly |
| Wrong paper size | Auto-select chose wrong drawer | Manually select Paper → correct drawer |
| Partial image | Original not aligned to corner arrow | Re-position on glass |

---

## Scan Mode

### Accessing Scan Mode
- Press **SCAN** hard key, OR
- Tap **Home → Scan**
- Some models have **Simple Scan** button for quick access

### Scan Destinations

| Destination | Button Path | Notes |
|-------------|-------------|-------|
| **USB** | Scan → USB or File/USB → USB Media | Must wait for "Found USB Device" first |
| **Email** | Scan → E-mail | Requires SMTP configuration |
| **Network Folder** | Scan → File → Remote 1 | Staff only; not for patrons |

### File Formats
| Format | Best For | Notes |
|--------|----------|-------|
| **PDF** | Multi-page documents | Default recommendation |
| **JPEG** | Photos, single images | Color/grayscale only |
| **TIFF** | Archival quality | Large files |
| **Slim PDF** | Smaller files | Reduced quality |
| **DOCX/XLSX/PPTX** | Editable documents | Requires OCR enabled |

### Resolution (DPI) Guidelines
| Use Case | Recommended DPI |
|----------|-----------------|
| Email attachment | 200 dpi |
| Print-quality archive | 300 dpi |
| OCR processing | 200-300 dpi minimum |
| Quick preview | 100-150 dpi |

**Note:** Higher DPI = larger file size = longer email transmission time

### Duplex Scanning
| Option | Behavior |
|--------|----------|
| **Single** | Scans one side only |
| **Book** | Scans both sides, same orientation |
| **Tablet** | Scans both sides, back rotated 180° |

### Critical: Job Finish
**Patrons MUST press Job Finish after scanning.** Without this step:
- Multi-page scans may not save
- Email may not send
- USB file may be incomplete

---

## Print Mode (Elevate Sky Print)

### How Printing Works at TPL

1. **At the computer:** Patron selects **Cloud Print** and clicks Print
2. **At the printer:** Patron uses **Elevate Sky Print** to release

### Elevate Sky Print Release Steps
1. Touch the orange **Elevate Sky Print** icon
2. Enter User ID and Password from computer monitor
3. Touch green **Go** button
4. Touch icon with **number in white circle** (job count)
5. Select document(s) to print
6. Confirm settings (Color, 2-Sided, Copies)
7. Touch **Print**

### Print Settings at Release
| Setting | Options |
|---------|---------|
| **Color** | Auto Color, B&W |
| **Duplex** | Single, 2-Sided |
| **Copies** | Adjust quantity |
| **Paper** | Auto, Letter, Tabloid |

### Common Print Issues
| Issue | Likely Cause | Staff Action |
|-------|--------------|--------------|
| Job not appearing | Wrong printer selected | Have patron re-print to Cloud Print |
| No number in circle | Job didn't send | Check computer print queue |
| Job expired | Jobs timeout after ~2 hours | Re-send from computer |
| Wrong orientation | Driver setting mismatch | Adjust Portrait/Landscape before printing |

---

# Section C: Troubleshooting Playbook

*Organized by symptom. Work top-to-bottom: fastest check first.*

---

## Printed Blank Pages

1. **Check document placement**
   - ADF: Face UP
   - Glass: Face DOWN, aligned to corner arrow
2. **Check original has content** (not blank page)
3. **Check color mode** — may have printed white text on white
4. If persists: Test with known good document

---

## Wrong Paper Size Output

1. **Check paper size setting** in Copy → Paper
2. **Verify drawer contents** match expected size
3. **Check original size** — machine may have auto-detected incorrectly
4. For printing: Check driver paper size setting at computer

---

## Won't Print Double-Sided

1. **Verify duplex is enabled** at printer (Elevate Sky Print settings)
2. **Check driver settings** on computer for 2-Sided option
3. **Confirm paper type supports duplex** (some heavy stock cannot duplex)
4. If option is grayed out: May be admin-disabled — escalate to IT

---

## Scan Didn't Arrive (Email)

1. **Patron check spam/junk folder**
2. **Confirm Job Finish was pressed**
3. **Check file size** — large scans may timeout
4. **Verify email address** was entered correctly
5. If repeated failures: Check SMTP server status (admin task)

**Workaround:** Use Scan to USB for long documents (10+ pages)

---

## USB Not Recognized

1. **Re-insert firmly** — wait 5 seconds between attempts
2. **Try different USB port** if available
3. **Check drive format** — must be FAT32 or exFAT (not NTFS)
4. **Try different USB drive** to rule out drive failure
5. If no drives work: USB port may be disabled or malfunctioning — escalate

---

## Machine Asks for Login

**For printing (Elevate Sky Print):**
- User ID and Password are on computer monitor (e.g., "0001")

**For copying/scanning:**
- May require library card swipe or credentials
- If patron doesn't have credentials: Assist with guest access if available

---

## Orientation Is Wrong

**For copies:**
1. Check document placement orientation
2. Use **Rotation** setting in scan options

**For prints:**
1. Check Portrait/Landscape in computer print settings
2. Verify document orientation before sending

---

## Paper Jam

**DO NOT let patrons attempt to clear jams.**

### Staff Jam Clearance (High-Level)
1. Follow on-screen instructions indicating jam location
2. Open indicated cover (look for flashing indicator)
3. Remove jammed paper carefully — pull in direction of paper path
4. **CAUTION:** Fuser unit is HOT — allow cooling if needed
5. Close all covers securely
6. Machine should auto-resume or prompt to restart job

**When to escalate to vendor:**
- Repeated jams in same location
- Paper fragments remain inside
- Error persists after clearing
- Unusual noises from paper path

---

## Job Stuck in Queue

1. Try canceling and re-sending
2. Check for error messages on device
3. Power cycle printer (last resort — notify IT first)
4. If pattern continues: May indicate network or driver issue

---

# Section D: Admin-Dependent Features

*These features depend on administrator configuration and may vary.*

---

## Scan-to-Email Requirements

| Requirement | Notes |
|-------------|-------|
| SMTP Server | Must be configured with valid server address |
| Authentication | May require username/password for SMTP |
| Sender Address | Often locked to authenticated user's email |
| Attachment Limits | Server may reject large files |
| TLS/SSL | May be required for secure transmission |

**If scan-to-email fails repeatedly:** Check SMTP configuration in admin panel or contact IT.

---

## Job Accounting (Elevate Sky Print)

| Feature | TPL Configuration |
|---------|-------------------|
| **System** | Elevate Sky Print |
| **Authentication** | User ID + Password (on monitor) |
| **Tracking** | Jobs tracked by user ID |
| **Payment** | Collected at Front Desk |

**Note:** Native Toshiba Hold Print/Private Print are NOT used.

---

## Network Folder Scanning

| Status | Not available for patrons |
|--------|--------------------------|
| **Reason** | Security; requires network credentials |
| **Staff Use** | May be available via Remote 1, Remote 2 if configured |

---

## USB Port Status

| Setting | Expected |
|---------|----------|
| Scan to USB | Enabled |
| Print from USB | Disabled (security) |

If USB scanning stops working: Check if port was disabled in admin settings.

---

## Features That May Be Disabled

| Feature | Reason |
|---------|--------|
| OCR (DOCX/XLSX output) | May not be licensed |
| PDF encryption | Admin decision |
| Color copying | May be restricted to reduce costs |
| Duplex | Rarely, but may be limited |
| High-resolution scanning | To control file sizes |

---

# Section E: Staff Scripts

*Short verbal guides for assisting patrons without touching their documents.*

---

## "Let me show you the quick fix"

### For wrong document orientation:
> "The feeder needs documents face-up, but the glass needs them face-down. Let me show you where the arrow is — line up your corner there."

### For missing Job Finish:
> "After you scan all your pages, you need to press Job Finish — that's the button that actually saves your file. Without it, the scan doesn't complete."

### For print job not appearing:
> "Let's check — did you select Cloud Print at the computer? If you see a number in this white circle, that's your job. No number means it didn't come through."

---

## "Here's how to avoid this next time"

### For USB corruption:
> "The machine needs a moment to finish writing to your USB drive. Always wait until you see 'USB Device can be removed' on the screen before pulling it out."

### For wrong color output:
> "The machine defaults to black and white to save money. If you need color, tap Full Color before you press Start, and you'll see it change on the screen."

### For email scan not arriving:
> "Email scans can be slow if the file is large. Check your spam folder first. For longer documents — more than 10 pages or so — USB is more reliable."

---

## "When it's okay to ask for help"

Standard phrases for reassuring patrons:

> "This machine can be tricky — you're not the first person to have this question."

> "Paper jams happen. Just let us know and we'll take care of it."

> "There's no way to break it by pressing the wrong button. You can always press Stop or Home to start over."

---

# Section F: Source List

## Official Toshiba Documentation
1. Multifunctional Digital Color Systems – Copy (Copying manual)
2. Multifunctional Digital Color Systems – Scan (Scanning manual)
3. Printing Guide (color MFP printers)
4. Troubleshooting Guide (color MFPs)
5. Quick Start Guide (e-STUDIO 2020AC/2520AC/2525AC)

## Institutional Guides (Cross-Validation)
6. Dickinson College ITS — Toshiba Scanning Step-by-Step
7. Dickinson College ITS — Scanning to Department Shared Folder
8. Milford Library Cooperative — Scan Documents to USB Drive
9. Clarendon Hills Library — How to Scan Using Toshiba Copier
10. Bank Street Library — Scanning to USB Drive
11. Stony Brook University IT — Copying on Toshiba Printers
12. Mount Saint Mary College — Copying with PaperCut
13. Western University Schulich — Scan to USB on Toshiba e-Studio
14. Western University SSTS — Printing/Copying/Scanning Instructions
15. Kenmore-Town of Tonawanda UFSD — Hold or Private Printing
16. MHA Help Desk — Hold Print and Private Printing

---

# Section G: Open Questions / Verify On-Site

The following items are configuration-dependent and should be verified for TPL:

| Item | Question | How to Verify |
|------|----------|---------------|
| Paper tray assignments | Which drawer has Letter? Legal? | Check drawer labels |
| Default color setting | Is B/W the default? | Test at copier |
| Auto-logout timeout | How long before auto-logout? | Check admin settings |
| Scan-to-email limits | Max attachment size? | Test or check SMTP config |
| USB port location | Which ports are active? | Physical inspection |
| Job retention time | How long before jobs expire? | Check Elevate Sky Print settings |
| Guest access | Available for patrons without ID? | Policy decision |
| Color copy restrictions | Any limits on color copying? | Check admin settings |

---

*End of Staff Guide*
