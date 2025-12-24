#!/bin/bash
# Setup script for Assembly Agentic Articles
# Starts Docker services and installs dependencies

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/../assembly-agentic-articles"

echo "🚀 Setting up Assembly Agentic Articles..."

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    echo "   Install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "📦 Starting Docker services (PostgreSQL + Redis)..."
cd "$PROJECT_DIR"
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if PostgreSQL is ready
until docker exec assembly-postgres pg_isready -U assembly -d assembly_content &> /dev/null; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Check if Redis is ready
until docker exec assembly-redis redis-cli ping &> /dev/null; do
    echo "   Waiting for Redis..."
    sleep 2
done
echo "✅ Redis is ready"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$PROJECT_DIR/backend"
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << 'EOF'
NODE_ENV=development
PORT=3001

# Database (Docker)
DATABASE_URL=postgresql://assembly:assembly_dev@localhost:5432/assembly_content

# Redis (Docker)
REDIS_URL=redis://localhost:6379

# Anthropic Claude API (required)
ANTHROPIC_API_KEY=your-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=dev-secret-local-testing-only-change-in-production
EOF
    echo "⚠️  Don't forget to add your ANTHROPIC_API_KEY to backend/.env"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$PROJECT_DIR/frontend"
npm install

# Create frontend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:3001/api
EOF
fi

echo ""
echo "✅ Assembly setup complete!"
echo ""
echo "To start development:"
echo "  Terminal 1: cd assembly-agentic-articles/backend && npm run dev"
echo "  Terminal 2: cd assembly-agentic-articles/frontend && npm start"
echo ""
echo "Database:"
echo "  PostgreSQL: postgresql://assembly:assembly_dev@localhost:5432/assembly_content"
echo "  Redis: redis://localhost:6379"
echo ""
echo "To stop Docker services:"
echo "  cd assembly-agentic-articles && docker-compose down"
