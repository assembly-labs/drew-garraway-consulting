#!/bin/bash
# Franklin Hugh Money Deployment Script
# Created: 2024-12-05
# Updated: 2024-12-12 - Now deploys all public files
# Purpose: Automate deployment of Franklin Hugh Money pages to repository root

echo "🚀 Franklin Hugh Money Deployment Script"
echo "========================================"
echo ""

# Pre-deployment checklist reminder
echo "📋 PRE-DEPLOYMENT CHECKLIST"
echo "   See docs/DEPLOYMENT_CHECKLIST.md for full details"
echo ""
echo "   Quick checks:"
echo "   • sie-study-materials.html - chapter cards updated?"
echo "   • sie-navigation-config.js - new sections added?"
echo "   • Progress badge count correct?"
echo ""
read -p "   Have you reviewed the checklist? (y/n): " checklist_ok
if [ "$checklist_ok" != "y" ] && [ "$checklist_ok" != "Y" ]; then
    echo ""
    echo "   ⚠️  Please review docs/DEPLOYMENT_CHECKLIST.md before deploying"
    echo "   Run again when ready."
    exit 0
fi
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "public" ]; then
    echo "❌ Error: Must run from _franklin_hugh_money directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Step 0: Cache busting
echo "🔄 Step 0: Running cache-bust..."
node scripts/cache-bust.js
if [ $? -eq 0 ]; then
    echo "   ✓ Cache busting complete"
else
    echo "   ✗ Cache busting failed"
    exit 1
fi
echo ""

# Step 1: Copy all public files to repo root
echo "📋 Step 1: Copying files to deployment location..."

# Copy main FHM pages
cp public/index.html ../franklin-hugh-money.html && echo "   ✓ index.html → franklin-hugh-money.html"
cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html && echo "   ✓ franklin-hugh-money-treasury.html"

# Copy SIE study materials
cp public/sie-study-materials.html ../sie-study-materials.html && echo "   ✓ sie-study-materials.html"

# Copy SIE Chapter 5
cp public/sie-chapter-5.html ../sie-chapter-5.html && echo "   ✓ sie-chapter-5.html"
cp public/sie-chapter-5-municipal.html ../sie-chapter-5-municipal.html && echo "   ✓ sie-chapter-5-municipal.html"
cp public/sie-chapter-5-money-markets.html ../sie-chapter-5-money-markets.html && echo "   ✓ sie-chapter-5-money-markets.html"

# Copy SIE Chapter 6
for file in public/sie-chapter-6-*.html; do
    filename=$(basename "$file")
    cp "$file" "../$filename" && echo "   ✓ $filename"
done

# Copy shared assets (CSS, JS)
cp public/sie-navigation.css ../sie-navigation.css && echo "   ✓ sie-navigation.css"
cp public/sie-navigation-config.js ../sie-navigation-config.js && echo "   ✓ sie-navigation-config.js"
cp public/sie-navigation-component.js ../sie-navigation-component.js && echo "   ✓ sie-navigation-component.js"

echo ""
echo "📦 Step 2: Preparing git commit..."
cd ..

# Check git status
echo "   Current changes:"
git status --short franklin-hugh-money*.html sie-*.html sie-*.css sie-*.js

# Add all deployed files
git add franklin-hugh-money*.html sie-*.html sie-*.css sie-*.js

# Get commit message from user or use default
echo ""
echo "📝 Step 3: Commit message (press Enter for default):"
read -p "   Message: " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Deploy Franklin Hugh Money updates"
fi

# Commit
git commit -m "$commit_msg

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

if [ $? -eq 0 ]; then
    echo "   ✓ Changes committed"
else
    echo "   ℹ️  No changes to commit (files may already be up to date)"
fi

# Push
echo ""
echo "⬆️  Step 4: Pushing to remote..."
git push ssh main

if [ $? -eq 0 ]; then
    echo "   ✓ Successfully pushed to remote"
else
    echo "   ✗ Push failed - check your SSH configuration"
    exit 1
fi

# Success message
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Your changes will be live in 1-2 minutes at:"
echo "   • https://drewgarraway.com/franklin-hugh-money.html"
echo "   • https://drewgarraway.com/sie-study-materials.html"
echo "   • https://drewgarraway.com/sie-chapter-5.html"
echo "   • https://drewgarraway.com/sie-chapter-6-investment-company-basics.html"
echo ""
echo "💡 Tip: Use incognito mode to avoid cache issues when checking"

# Return to original directory
cd _franklin_hugh_money
