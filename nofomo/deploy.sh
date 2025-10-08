#!/bin/bash

# NO FOMO Deployment Script
# This script builds and deploys the app to the correct location

echo "🚀 Starting NO FOMO deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the nofomo directory."
    exit 1
fi

# Build the production version
echo "📦 Building production version..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

# Create a temporary deployment directory
echo "📁 Preparing deployment files..."
rm -rf deploy-temp
mkdir -p deploy-temp

# Copy the built files
cp -r dist/* deploy-temp/

# Important: Since this deploys to drewgarraway.com/nofomo/
# We need to ensure the correct structure

echo "✅ Build complete! Files ready in deploy-temp/"
echo ""
echo "📋 Next steps for deployment:"
echo "1. The production files are in the 'deploy-temp' directory"
echo "2. Upload the CONTENTS of deploy-temp/ to your web server's /nofomo/ directory"
echo "3. Make sure to upload:"
echo "   - index.html"
echo "   - assets/ folder and all its contents"
echo ""
echo "⚠️  IMPORTANT: Upload the contents of deploy-temp/, not the dist/ or root directory!"
echo ""
echo "🔒 Don't forget to set the VITE_POLYGON_API_KEY environment variable on your server!"