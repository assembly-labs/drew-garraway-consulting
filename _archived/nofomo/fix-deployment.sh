#!/bin/bash

# NO FOMO - Fix Production Deployment
# This script fixes the broken deployment at drewgarraway.com/nofomo/

echo "🔧 NO FOMO Production Fix Script"
echo "================================="
echo ""

# Step 1: Ensure we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the nofomo directory"
    exit 1
fi

echo "✅ Step 1: Directory confirmed"

# Step 2: Clean and rebuild
echo "🧹 Step 2: Cleaning old builds..."
rm -rf dist
rm -rf deploy-ready

# Step 3: Install dependencies (in case any are missing)
echo "📦 Step 3: Ensuring dependencies are installed..."
npm install

# Step 4: Build production version
echo "🔨 Step 4: Building production version..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Step 5: Create deployment-ready folder structure
echo "📁 Step 5: Creating deployment structure..."
mkdir -p deploy-ready

# Copy all dist contents to deploy-ready
cp -r dist/* deploy-ready/

# Step 6: Verify the build
echo "🔍 Step 6: Verifying production build..."
if [ -f "deploy-ready/index.html" ]; then
    # Check if index.html has the correct production scripts
    if grep -q "/nofomo/assets/index-" deploy-ready/index.html; then
        echo "✅ Production build verified!"
    else
        echo "⚠️  Warning: index.html might not have correct asset paths"
    fi
else
    echo "❌ index.html not found in deploy-ready!"
    exit 1
fi

# Step 7: Show deployment instructions
echo ""
echo "🎉 DEPLOYMENT READY!"
echo "==================="
echo ""
echo "The production files are ready in the 'deploy-ready' folder."
echo ""
echo "📋 TO FIX THE BROKEN SITE:"
echo ""
echo "Option A: Manual Upload (Immediate Fix)"
echo "----------------------------------------"
echo "1. Upload the CONTENTS of 'deploy-ready/' to your server"
echo "2. The files should go to: /public_html/nofomo/ (or wherever drewgarraway.com/nofomo points)"
echo "3. Make sure to upload:"
echo "   - index.html (from deploy-ready/, NOT from root!)"
echo "   - assets/ folder with all .js and .css files"
echo ""
echo "Option B: GitHub Pages (If using GitHub Pages deployment)"
echo "---------------------------------------------------------"
echo "1. Commit these changes:"
echo "   git add dist/"
echo "   git commit -m 'Fix production build'"
echo "   git push origin main"
echo "2. GitHub Actions will deploy automatically"
echo ""
echo "Option C: Using Git Subtree (For subdirectory deployment)"
echo "---------------------------------------------------------"
echo "   git subtree push --prefix=nofomo/dist origin gh-pages"
echo ""
echo "⚠️  CRITICAL: The current site is serving the WRONG index.html!"
echo "   - WRONG: /index.html (development version with src/main.jsx)"
echo "   - RIGHT: /dist/index.html (production version with bundled assets)"
echo ""
echo "📁 File Structure Should Be:"
echo "   drewgarraway.com/"
echo "   └── nofomo/"
echo "       ├── index.html (from dist/)"
echo "       └── assets/"
echo "           ├── index-[hash].js"
echo "           └── index-[hash].css"
echo ""

# Create a verification file
echo "Creating deployment verification file..."
echo "Deployment Date: $(date)" > deploy-ready/deployment-info.txt
echo "Build Version: Production" >> deploy-ready/deployment-info.txt
echo "Base Path: /nofomo/" >> deploy-ready/deployment-info.txt

echo "✅ Script complete! Follow the instructions above to fix the site."