# Internal Documents

**IMPORTANT: This folder is git-ignored and should NEVER be committed to version control.**

This folder contains private, sensitive, and non-public materials for the PropWise AI project. Store confidential information here that should not be shared publicly.

---

## Folder Structure

```
internal/
├── research/              # Market research, industry analysis
├── design/                # Design files, mockups, prototypes
├── brand/                 # Brand assets, logos, style guides
├── credentials/           # API keys, passwords, access tokens
├── project-management/    # Timelines, Gantt charts, resource planning
├── notes/                 # Meeting notes, brainstorming, ideas
├── competitor-analysis/   # Competitor screenshots, features, pricing
├── user-testing/          # User test recordings, transcripts, feedback
├── financials/            # Budgets, projections, invoices
└── legal/                 # Contracts, NDAs, legal agreements
```

---

## Folder Descriptions

### `/research/`
Market research, industry reports, and analysis documents.
- Industry statistics
- Market size estimates
- Trend analysis
- HOA/property management research

### `/design/`
Design assets and working files (not final production assets).
- Figma exports
- Wireframe iterations
- Design explorations
- UI/UX research

### `/brand/`
Brand identity materials once developed.
- Logo files (all formats)
- Color palettes
- Typography specifications
- Brand guidelines document
- Icon libraries

### `/credentials/`
**HIGHLY SENSITIVE** - API keys, passwords, and access credentials.
- Anthropic API keys
- Cloudflare credentials
- Service account passwords
- Third-party API tokens

**Security Notes:**
- Consider using a password manager instead of files
- Encrypt sensitive files if storing here
- Never share this folder
- Rotate credentials regularly

### `/project-management/`
Project planning and tracking materials.
- Timeline documents
- Sprint planning
- Resource allocation
- Milestone tracking
- Budget tracking

### `/notes/`
Informal notes and working documents.
- Meeting notes
- Brainstorming sessions
- Decision logs
- Quick ideas
- Phone call summaries

### `/competitor-analysis/`
Competitive intelligence and analysis.
- Competitor feature matrices
- Pricing comparisons
- Screenshots of competitor products
- SWOT analyses
- Market positioning research

### `/user-testing/`
User research and testing materials.
- Test session recordings
- Interview transcripts
- Survey responses
- Feedback summaries
- Persona development research
- Usability test reports

### `/financials/`
Financial documents and projections.
- Budget spreadsheets
- Cost projections
- Revenue forecasts
- Investor materials
- Invoices and receipts

### `/legal/`
Legal documents and agreements.
- Contracts
- NDAs
- Terms of service drafts
- Privacy policy drafts
- Liability considerations
- Insurance documents

---

## Best Practices

1. **Never commit this folder** - It's in .gitignore for a reason
2. **Back up regularly** - Since it's not in git, ensure you have backups
3. **Use clear naming** - Date prefix files: `2024-12-16_meeting-notes.md`
4. **Keep organized** - Don't let the root `internal/` become a dumping ground
5. **Encrypt sensitive files** - Especially in `/credentials/` and `/financials/`
6. **Clean up regularly** - Archive old materials, delete outdated docs

---

## File Naming Convention

Use consistent naming for easy searching:

```
YYYY-MM-DD_description_version.ext

Examples:
2024-12-16_competitor-analysis.xlsx
2024-12-16_user-interview-maria.md
2024-12-16_brand-colors-v2.pdf
```

---

## Sharing Internal Documents

If you need to share internal documents:

1. **Never email credentials** - Use a secure password manager
2. **Use secure sharing** - Encrypted email or secure file sharing
3. **Track who has access** - Know who has seen sensitive materials
4. **Revoke access when done** - Remove sharing permissions after use

---

## Questions?

Contact the project owner for guidance on what should go in this folder.
