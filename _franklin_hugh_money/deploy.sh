#!/bin/bash
# Franklin Hugh Money Deployment Script
# Created: 2024-12-05
# Updated: 2024-12-12 - Dynamic file detection, content validation
# Purpose: Automate deployment of Franklin Hugh Money pages to repository root

echo "🚀 Franklin Hugh Money Deployment Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "public" ]; then
    echo "❌ Error: Must run from _franklin_hugh_money directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Step 0: Run content validation
echo "🔍 Step 0: Validating content sync..."
node scripts/validate-content.js
if [ $? -ne 0 ]; then
    echo ""
    echo "   ⚠️  Content validation found issues (see above)"
    read -p "   Continue anyway? (y/n): " continue_deploy
    if [ "$continue_deploy" != "y" ] && [ "$continue_deploy" != "Y" ]; then
        echo "   Deployment cancelled. Fix issues and try again."
        exit 1
    fi
fi
echo ""

# Step 1: Cache busting
echo "🔄 Step 1: Running cache-bust..."
node scripts/cache-bust.js
if [ $? -eq 0 ]; then
    echo "   ✓ Cache busting complete"
else
    echo "   ✗ Cache busting failed"
    exit 1
fi
echo ""

# Step 2: Copy all public files to repo root
echo "📋 Step 2: Copying files to deployment location..."

# Copy main FHM pages
cp public/index.html ../franklin-hugh-money.html && echo "   ✓ index.html → franklin-hugh-money.html"
cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html && echo "   ✓ franklin-hugh-money-treasury.html"

# Copy SIE study materials and navigation
cp public/sie-study-materials.html ../sie-study-materials.html && echo "   ✓ sie-study-materials.html"
cp public/sie-navigation.css ../sie-navigation.css && echo "   ✓ sie-navigation.css"
cp public/sie-navigation-config.js ../sie-navigation-config.js && echo "   ✓ sie-navigation-config.js"
cp public/sie-navigation-component.js ../sie-navigation-component.js && echo "   ✓ sie-navigation-component.js"

# Dynamically copy ALL SIE chapter HTML files
echo "   Copying SIE chapter files..."
chapter_count=0
for file in public/sie-chapter-*.html; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "../$filename" && echo "   ✓ $filename"
        ((chapter_count++))
    fi
done
echo "   Total: $chapter_count chapter files copied"

echo ""
echo "📦 Step 3: Preparing git commit..."
cd ..

# Check git status
echo "   Current changes:"
git status --short franklin-hugh-money*.html sie-*.html sie-*.css sie-*.js

# Add all deployed files
git add franklin-hugh-money*.html sie-*.html sie-*.css sie-*.js

# Get commit message from user or use default
echo ""
echo "📝 Step 4: Commit message (press Enter for default):"
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
echo "⬆️  Step 5: Pushing to remote..."
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
echo "   • https://drewgarraway.com/sie-study-materials.html"
echo ""
echo "💡 Tip: Use incognito mode to avoid cache issues when checking"

# Return to original directory
cd _franklin_hugh_money
