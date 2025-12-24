#!/bin/bash
# Setup script for Cool Curriculum (AI Lesson Planner)
# Installs dependencies and creates environment file

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/../cool-curriculum/ai-lesson-planner"

echo "🚀 Setting up Cool Curriculum (AI Lesson Planner)..."

cd "$PROJECT_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Anthropic Claude API Key
REACT_APP_ANTHROPIC_API_KEY=your-api-key-here

# Proxy URL (default for local development)
REACT_APP_PROXY_URL=http://localhost:3001
EOF
    echo "⚠️  Don't forget to add your REACT_APP_ANTHROPIC_API_KEY to .env"
fi

echo ""
echo "✅ Cool Curriculum setup complete!"
echo ""
echo "⚠️  This project requires TWO terminal windows:"
echo ""
echo "Terminal 1 - Start the proxy server:"
echo "  cd cool-curriculum/ai-lesson-planner && npm run server"
echo "  (Runs on port 3001)"
echo ""
echo "Terminal 2 - Start the React app:"
echo "  cd cool-curriculum/ai-lesson-planner && npm start"
echo "  (Runs on port 3000)"
echo ""
echo "Why two servers?"
echo "  The proxy server keeps your API key secure on the backend."
echo "  The React app makes requests to the proxy, which forwards to Claude."
