#!/bin/bash

# Build the app
echo "Building app..."
npm run build

# Deploy by committing and pushing
echo "Deploying to GitHub Pages..."

# Add all files from dist
git add dist/

# Commit
git commit -m "Deploy zero-chill-tracker: $(date '+%Y-%m-%d %H:%M:%S')"

# Push
git push origin main

echo "✅ Deployment complete!"
echo "Your site will be live at: https://drewgarraway.com/zero-chill-tracker/"
