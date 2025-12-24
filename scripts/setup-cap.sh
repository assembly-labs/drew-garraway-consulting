#!/bin/bash
# Setup script for CAP (Championship Athletic Prospects)
# Installs dependencies and sets up Supabase

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/../CAP"

echo "🚀 Setting up CAP (Championship Athletic Prospects)..."

# Check for Docker (required for Supabase local)
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed."
    echo "   For local Supabase, install Docker Desktop: https://www.docker.com/products/docker-desktop"
    echo "   Continuing without local Supabase..."
    SKIP_SUPABASE=true
fi

# Check if Docker is running
if [ -z "$SKIP_SUPABASE" ] && ! docker info &> /dev/null; then
    echo "⚠️  Docker is not running."
    echo "   Continuing without local Supabase..."
    SKIP_SUPABASE=true
fi

cd "$PROJECT_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Supabase - Local Development
# Run `npx supabase start` to get these values
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
SUPABASE_SERVICE_KEY=your-service-key-from-supabase-start

# Stripe - Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Replicate - Image Processing
REPLICATE_API_TOKEN=r8_...

# Anthropic Claude - AI Features
ANTHROPIC_API_KEY=sk-ant-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF
    echo "⚠️  Don't forget to add your API keys to .env.local"
fi

# Start Supabase if Docker is available
if [ -z "$SKIP_SUPABASE" ]; then
    echo "🗄️  Starting Supabase local development..."

    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo "   Installing Supabase CLI..."
        npm install -g supabase
    fi

    # Start Supabase
    npx supabase start

    echo ""
    echo "📋 Supabase is running. Copy the keys above into .env.local"
fi

echo ""
echo "✅ CAP setup complete!"
echo ""
echo "To start development:"
echo "  cd CAP && npm run dev"
echo ""
if [ -z "$SKIP_SUPABASE" ]; then
    echo "Supabase:"
    echo "  Studio: http://localhost:54323"
    echo "  API: http://localhost:54321"
    echo ""
    echo "To stop Supabase:"
    echo "  cd CAP && npx supabase stop"
fi
