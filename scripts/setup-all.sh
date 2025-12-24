#!/bin/bash
# Master setup script - installs dependencies for all projects
# Run this once after cloning the repository

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR/.."

echo "🚀 Setting up all projects in drew-garraway-consulting..."
echo ""

# Simple Vite/React projects - just npm install
SIMPLE_PROJECTS=(
    "scout"
    "nofomo"
    "zero-chill-tracker"
    "career-chat"
    "fuckyougotrain"
    "accountable/habit-tracker"
    "BJJJ/prototype"
)

for project in "${SIMPLE_PROJECTS[@]}"; do
    if [ -d "$ROOT_DIR/$project" ] && [ -f "$ROOT_DIR/$project/package.json" ]; then
        echo "📦 Installing $project..."
        cd "$ROOT_DIR/$project"
        npm install
    fi
done

# Check for complex projects and offer to set them up
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Simple projects installed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Complex projects require additional setup:"
echo ""
echo "  CAP (Next.js + Supabase):"
echo "    bash scripts/setup-cap.sh"
echo ""
echo "  Assembly Agentic Articles (Docker + PostgreSQL + Redis):"
echo "    bash scripts/setup-assembly.sh"
echo ""
echo "  Cool Curriculum (Two-server setup):"
echo "    bash scripts/setup-cool-curriculum.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
