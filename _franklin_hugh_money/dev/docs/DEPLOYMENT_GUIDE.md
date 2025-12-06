# Deployment Guide
## Franklin Hugh Money Project

---

## 🚨 CRITICAL: Deployment Structure

**THE LIVE SITE SERVES FROM THE REPOSITORY ROOT, NOT FROM SUBDIRECTORIES!**

This is the #1 source of deployment issues. Read this section carefully.

### File Structure Mapping

| Development Location | Live URL | Deployment Location |
|---------------------|----------|-------------------|
| `_franklin_hugh_money/public/index.html` | `/franklin-hugh-money.html` | Repository root |
| `_franklin_hugh_money/public/franklin-hugh-money-treasury.html` | `/franklin-hugh-money-treasury.html` | Repository root |

### Why This Matters
- We develop in `_franklin_hugh_money/public/` for organization
- The live site serves from the repository root directory
- **Files MUST be copied to root** for changes to appear live

---

## 📋 Deployment Checklist

### Before Every Deployment

1. **Verify file names match live URLs**
   ```bash
   # Check the live URL structure
   # https://drewgarraway.com/franklin-hugh-money.html
   # https://drewgarraway.com/franklin-hugh-money-treasury.html
   ```

2. **Copy files from development to deployment location**
   ```bash
   # From _franklin_hugh_money directory
   cp public/index.html ../franklin-hugh-money.html
   cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html
   ```

3. **Commit and push from root**
   ```bash
   # Navigate to repository root
   cd ..

   # Add the root-level files
   git add franklin-hugh-money*.html

   # Commit with descriptive message
   git commit -m "Update Franklin Hugh Money pages"

   # Push using SSH (not HTTPS which requires auth)
   git push ssh main
   ```

4. **Verify deployment**
   - Wait 1-2 minutes for deployment
   - Check live URLs
   - Use browser incognito mode to avoid cache issues

---

## 🔧 Common Issues & Solutions

### Issue: "My changes aren't showing up!"

**Diagnosis Steps:**
1. Check which file you edited
2. Check where you committed it
3. Check the live URL you're visiting

**Solution:**
```bash
# You probably edited the file in public/ but didn't copy to root
cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html
cd .. && git add franklin-hugh-money-treasury.html && git commit -m "Fix deployment" && git push ssh main
```

### Issue: "Git push fails with authentication error"

**Solution:**
```bash
# Use SSH remote instead of HTTPS
git push ssh main  # Instead of: git push origin main
```

### Issue: "The wrong file is being served"

**Check:**
- File naming consistency
- `treasury-analysis.html` was renamed to `franklin-hugh-money-treasury.html`
- Index links must point to correct filenames

---

## 🏗️ Project Structure

```
drew-garraway-consulting/          # Repository root (deployment location)
├── franklin-hugh-money.html       # DEPLOYED: Main page
├── franklin-hugh-money-treasury.html  # DEPLOYED: Treasury analysis
├── _franklin_hugh_money/          # Development directory
│   ├── public/                    # Working files
│   │   ├── index.html            # DEV: Main page source
│   │   └── franklin-hugh-money-treasury.html  # DEV: Treasury source
│   ├── dev/                      # Documentation
│   └── src/                      # Future source files
└── [other projects...]
```

---

## 🚀 Quick Deploy Script

Save this as `deploy.sh` in the `_franklin_hugh_money` directory:

```bash
#!/bin/bash
# Franklin Hugh Money Deployment Script

echo "🚀 Starting deployment..."

# Copy files to root
echo "📋 Copying files to deployment location..."
cp public/index.html ../franklin-hugh-money.html
cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html

# Navigate to root
cd ..

# Git operations
echo "📦 Committing changes..."
git add franklin-hugh-money*.html
git commit -m "Deploy Franklin Hugh Money updates"

echo "⬆️ Pushing to remote..."
git push ssh main

echo "✅ Deployment complete! Check live site in 1-2 minutes."
echo "📍 URLs:"
echo "   - https://drewgarraway.com/franklin-hugh-money.html"
echo "   - https://drewgarraway.com/franklin-hugh-money-treasury.html"
```

Make it executable:
```bash
chmod +x deploy.sh
```

---

## 📊 Visualization-Specific Notes

### Plotly.js Best Practices
1. **Always clear loading messages first**
   ```javascript
   const loadingDiv = container.querySelector('.loading');
   if (loadingDiv) loadingDiv.remove();
   ```

2. **Treemap text configuration**
   - Use `textinfo: 'text'` with complete formatted text
   - Avoid mixing `texttemplate` with `textinfo`

3. **Sankey diagram structure**
   - Maintain consistent node hierarchy
   - Don't add asymmetric subcategories

---

## 🔍 Debugging Deployments

### Check deployment status:
1. View GitHub repository to confirm push succeeded
2. Check file timestamps in root directory
3. Use browser DevTools Network tab to verify which file is being served
4. Clear browser cache or use incognito mode

### Useful commands:
```bash
# Check what files are in root vs public
ls -la ../franklin-hugh-money*.html
ls -la public/*.html

# See last commit affecting root files
git log -1 --name-only ../franklin-hugh-money*.html

# Compare files
diff public/index.html ../franklin-hugh-money.html
```

---

*Last Updated: 2024-12-05*
*Created after debugging session where deployment structure mismatch caused updates not to appear live*