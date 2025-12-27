#!/bin/bash

# Deployment script for habit-tracker to GitHub Pages
# This script builds the app and copies files to the correct location for GitHub Pages

set -e  # Exit on error

echo "🚀 Deploying habit-tracker to GitHub Pages..."

# Navigate to the habit-tracker source directory
cd accountable/habit-tracker

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building production bundle..."
npm run build

echo "📂 Copying build files to GitHub Pages location..."
# Copy the built files to the location GitHub Pages serves from
cp -r dist/* ./

echo "✅ Build files copied successfully!"

# Return to root directory
cd ../..

echo "📝 Checking git status..."
git status

echo ""
echo "🎉 Deployment prepared! Next steps:"
echo "1. Review the changes with: git status"
echo "2. Add files: git add -A"
echo "3. Commit: git commit -m 'Deploy habit-tracker update'"
echo "4. Push to GitHub: git push origin main"
echo ""
echo "The app will be live at: https://drewgarraway.com/accountable/habit-tracker/"