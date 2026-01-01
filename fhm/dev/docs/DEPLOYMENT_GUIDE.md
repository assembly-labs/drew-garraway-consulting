# Deployment Guide
## Franklin Hugh Money Project

---

## Current Deployment Structure

**The site is served via Cloudflare Pages from the `fhm/` subdirectory.**

No more copying files to the repository root. The deploy script handles everything.

### Live URLs

| Page | URL |
|------|-----|
| Main Site | https://drewgarraway.com/fhm/ |
| SIE Study Materials | https://drewgarraway.com/fhm/sie-study-materials.html |
| Treasury Analysis | https://drewgarraway.com/fhm/franklin-hugh-money-treasury.html |

---

## Quick Deployment

From the `fhm` directory:

```bash
./deploy.sh
```

The script will:
1. Validate content sync
2. Run cache-busting on CSS/JS files
3. Stage and commit changes
4. Push to remote

---

## Manual Deployment Steps

If you prefer to deploy manually:

```bash
# 1. Navigate to project directory
cd fhm

# 2. Run cache-bust (updates version hashes in HTML files)
node scripts/cache-bust.js

# 3. Stage changes
cd ..
git add fhm/

# 4. Commit with descriptive message
git commit -m "Your commit message"

# 5. Push to remote
git push ssh main
```

---

## Troubleshooting

### Changes not appearing on live site

1. **Clear browser cache** or use incognito mode
2. Wait 1-2 minutes for Cloudflare to propagate changes
3. Verify the commit was pushed: `git log -1 --oneline`
4. Check Cloudflare Pages dashboard for build status

### Cache-busting issues

If CSS/JS changes aren't reflected:

```bash
# Force regenerate version hashes
node scripts/cache-bust.js

# Verify hashes updated in HTML files
grep -r "\.css\?v=" *.html | head -5
```

### Git push fails

```bash
# Use SSH remote
git push ssh main

# If SSH issues, check your SSH key is added
ssh -T git@github.com
```

---

## Project Structure

```
drew-garraway-consulting/           # Repository root
└── fhm/                            # This project (deployment root)
    ├── index.html                  # Main landing page
    ├── sie-study-materials.html    # SIE course index
    ├── sie-chapter-*.html          # Chapter pages
    ├── assets/                     # CSS, JS, images, audio
    │   ├── css/
    │   ├── js/
    │   ├── images/
    │   └── audio/
    ├── scripts/                    # Build/deployment scripts
    ├── dev/                        # Development docs & logs
    └── content/                    # Source content & organization
```

---

## Cache-Bust Workflow

The `cache-bust.js` script generates content-based hashes for CSS and JS files, appending them as version query parameters (e.g., `?v=a34c2881`). This forces browsers to fetch new versions when files change.

Files processed:
- `assets/css/*.css`
- `assets/js/*.js`

---

*Last Updated: 2024-12-24*
