#!/bin/bash
# Franklin Hugh Money Deployment Script
# Created: 2024-12-05
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

echo "📋 Step 1: Copying files to deployment location..."
cp public/index.html ../franklin-hugh-money.html
if [ $? -eq 0 ]; then
    echo "   ✓ Copied index.html → franklin-hugh-money.html"
else
    echo "   ✗ Failed to copy index.html"
    exit 1
fi

cp public/franklin-hugh-money-treasury.html ../franklin-hugh-money-treasury.html
if [ $? -eq 0 ]; then
    echo "   ✓ Copied treasury page"
else
    echo "   ✗ Failed to copy treasury page"
    exit 1
fi

# Navigate to repository root
echo ""
echo "📦 Step 2: Preparing git commit..."
cd ..

# Check git status
echo "   Current changes:"
git status --short franklin-hugh-money*.html

# Add files
git add franklin-hugh-money*.html

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
echo "   • https://drewgarraway.com/franklin-hugh-money-treasury.html"
echo ""
echo "💡 Tip: Use incognito mode to avoid cache issues when checking"

# Return to original directory
cd _franklin_hugh_money