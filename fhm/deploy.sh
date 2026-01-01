#!/bin/bash
# Franklin Hugh Money Deployment Script
# Created: 2024-12-05
# Updated: 2024-12-23 - Simplified for subdirectory serving (no more copy-to-root)
# Purpose: Validate, cache-bust, and push Franklin Hugh Money updates

echo "🚀 Franklin Hugh Money Deployment Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "assets" ]; then
    echo "❌ Error: Must run from fhm directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Step 1: Run content validation
echo "🔍 Step 1: Validating content sync..."
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

# Step 2: Cache busting
echo "🔄 Step 2: Running cache-bust..."
node scripts/cache-bust.js
if [ $? -eq 0 ]; then
    echo "   ✓ Cache busting complete"
else
    echo "   ✗ Cache busting failed"
    exit 1
fi
echo ""

# Step 3: Git operations
echo "📦 Step 3: Preparing git commit..."
cd ..

# Check git status for FHM files
echo "   Current changes:"
git status --short fhm/

# Add all FHM files
git add fhm/

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
echo "   • https://drewgarraway.com/fhm/"
echo "   • https://drewgarraway.com/fhm/pages/sie/sie-study-materials.html"
echo ""
echo "💡 Tip: Use incognito mode to avoid cache issues when checking"

# Return to original directory
cd fhm
