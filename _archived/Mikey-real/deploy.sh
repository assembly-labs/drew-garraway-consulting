#!/bin/bash

# Mikey Real Estate Exam Prep - Deploy Script
# Builds and deploys to Cloudflare Pages

set -e

echo "🔨 Building production bundle..."
npm run build

echo "📦 Build complete. Output in /dist"
echo ""
echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=mikey-real-estate --commit-dirty=true

echo ""
echo "✅ Deploy complete!"
