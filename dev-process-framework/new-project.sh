#!/bin/bash

# =============================================================================
# New Project Starter Script
# Creates a new project with all templates and folder structure
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script lives (dev-process-framework/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_DIR="$SCRIPT_DIR"
TEMPLATES_DIR="$FRAMEWORK_DIR/templates"

# =============================================================================
# Functions
# =============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

show_usage() {
    echo "Usage: ./new-project.sh <project-name> [options]"
    echo ""
    echo "Options:"
    echo "  --path <path>    Create project at specific path (default: current directory)"
    echo "  --next           Initialize with Next.js"
    echo "  --vite           Initialize with Vite + React"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./new-project.sh my-awesome-app"
    echo "  ./new-project.sh my-app --path ~/Projects"
    echo "  ./new-project.sh my-app --next"
}

# =============================================================================
# Parse Arguments
# =============================================================================

PROJECT_NAME=""
PROJECT_PATH="."
INIT_TYPE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --path)
            PROJECT_PATH="$2"
            shift 2
            ;;
        --next)
            INIT_TYPE="next"
            shift
            ;;
        --vite)
            INIT_TYPE="vite"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
        *)
            PROJECT_NAME="$1"
            shift
            ;;
    esac
done

# Validate project name
if [ -z "$PROJECT_NAME" ]; then
    print_error "Project name is required"
    show_usage
    exit 1
fi

# Convert to kebab-case
PROJECT_NAME_KEBAB=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr '_' '-')

# Full project path
FULL_PATH="$PROJECT_PATH/$PROJECT_NAME_KEBAB"

# =============================================================================
# Main Script
# =============================================================================

print_header "Creating New Project: $PROJECT_NAME_KEBAB"

# Check if directory already exists
if [ -d "$FULL_PATH" ]; then
    print_error "Directory already exists: $FULL_PATH"
    exit 1
fi

# Create project directory
print_info "Creating project directory..."
mkdir -p "$FULL_PATH"
cd "$FULL_PATH"

# =============================================================================
# Create Folder Structure
# =============================================================================

print_info "Creating folder structure..."

# Documentation folders
mkdir -p docs/research
mkdir -p docs/strategy
mkdir -p docs/brand
mkdir -p docs/design
mkdir -p docs/technical
mkdir -p docs/gtm

# Source folders (placeholder until framework init)
mkdir -p src/components/ui
mkdir -p src/components/features
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/styles

# Prototype folder
mkdir -p prototype/src/components
mkdir -p prototype/src/pages
mkdir -p prototype/src/mocks

print_success "Folder structure created"

# =============================================================================
# Copy Templates
# =============================================================================

print_info "Copying templates..."

# Copy and customize CLAUDE.md
cat > CLAUDE.md << EOF
# $PROJECT_NAME_KEBAB

## Overview

[One sentence: what this project is]

## Current Phase

**Phase 0: Research**

See \`docs/PROCESS.md\` for phase details.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TBD |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | TBD |
| Auth | TBD |
| Hosting | TBD |

---

## Folder Structure

\`\`\`
src/
├── components/       # Reusable UI components
│   ├── ui/          # Basic components (Button, Input)
│   └── features/    # Feature-specific components
├── lib/             # Utility functions
├── types/           # TypeScript types
└── styles/          # Global styles

prototype/           # Phase 4 prototype code
├── src/
│   ├── components/
│   ├── pages/
│   └── mocks/
\`\`\`

---

## Conventions

### File Naming
- Files: \`kebab-case.ts\`
- Components: \`PascalCase.tsx\`
- Folders: \`kebab-case/\`

### Code Style
- Use TypeScript strict mode
- Prefer \`const\` over \`let\`
- Use async/await over .then()

---

## Commands

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Check linting
\`\`\`

---

## Current Focus

Phase 0: Research & Discovery

---

## Do NOT

- [ ] Use \`any\` type
- [ ] Commit \`.env\` files
- [ ] Skip error handling
- [ ] Use inline styles (use Tailwind)

---

*Last updated: $(date +%Y-%m-%d)*
EOF
print_success "Created CLAUDE.md"

# Copy PRD template
if [ -f "$TEMPLATES_DIR/PRD-TEMPLATE.md" ]; then
    sed "s/\[Product Name\]/$PROJECT_NAME_KEBAB/g" "$TEMPLATES_DIR/PRD-TEMPLATE.md" > docs/PRD.md
    print_success "Created docs/PRD.md"
else
    touch docs/PRD.md
    print_info "Created empty docs/PRD.md (template not found)"
fi

# Copy Handoff template
if [ -f "$TEMPLATES_DIR/HANDOFF-TEMPLATE.md" ]; then
    sed "s/\[Project Name\]/$PROJECT_NAME_KEBAB/g" "$TEMPLATES_DIR/HANDOFF-TEMPLATE.md" > docs/HANDOFF.md
    print_success "Created docs/HANDOFF.md"
else
    touch docs/HANDOFF.md
fi

# Copy Tickets template
if [ -f "$TEMPLATES_DIR/TICKETS-TEMPLATE.md" ]; then
    sed "s/\[Project Name\]/$PROJECT_NAME_KEBAB/g" "$TEMPLATES_DIR/TICKETS-TEMPLATE.md" > docs/TICKETS.md
    print_success "Created docs/TICKETS.md"
else
    touch docs/TICKETS.md
fi

# Copy Process reference
if [ -f "$FRAMEWORK_DIR/PROCESS.md" ]; then
    cp "$FRAMEWORK_DIR/PROCESS.md" docs/PROCESS.md
    print_success "Copied docs/PROCESS.md"
fi

# Copy Team Workflow
if [ -f "$FRAMEWORK_DIR/TEAM-WORKFLOW.md" ]; then
    cp "$FRAMEWORK_DIR/TEAM-WORKFLOW.md" docs/TEAM-WORKFLOW.md
    print_success "Copied docs/TEAM-WORKFLOW.md"
fi

# Copy Junior Dev Guide
if [ -f "$FRAMEWORK_DIR/JUNIOR-DEV-GUIDE.md" ]; then
    cp "$FRAMEWORK_DIR/JUNIOR-DEV-GUIDE.md" docs/JUNIOR-DEV-GUIDE.md
    print_success "Copied docs/JUNIOR-DEV-GUIDE.md"
fi

# Copy Phase Gates
if [ -f "$FRAMEWORK_DIR/checklists/PHASE-GATES.md" ]; then
    mkdir -p docs/checklists
    cp "$FRAMEWORK_DIR/checklists/PHASE-GATES.md" docs/checklists/PHASE-GATES.md
    print_success "Copied docs/checklists/PHASE-GATES.md"
fi

# Copy Quickstart
if [ -f "$FRAMEWORK_DIR/QUICKSTART.md" ]; then
    cp "$FRAMEWORK_DIR/QUICKSTART.md" docs/QUICKSTART.md
    print_success "Copied docs/QUICKSTART.md"
fi

# =============================================================================
# Create README
# =============================================================================

cat > README.md << EOF
# $PROJECT_NAME_KEBAB

[One sentence description]

## Status

**Phase 0: Research**

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Documentation

- [Product Requirements](docs/PRD.md)
- [Development Process](docs/PROCESS.md)
- [Technical Handoff](docs/HANDOFF.md)
- [Development Tickets](docs/TICKETS.md)

## Team

- [Team Workflow](docs/TEAM-WORKFLOW.md)
- [Junior Dev Guide](docs/JUNIOR-DEV-GUIDE.md)

## Tech Stack

See [CLAUDE.md](CLAUDE.md) for full tech stack and conventions.
EOF
print_success "Created README.md"

# =============================================================================
# Create .gitignore
# =============================================================================

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local
*.env

# IDE
.idea/
.vscode/settings.json
.vscode/launch.json
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
*.log
npm-debug.log*

# Cache
.cache/
.turbo/
.eslintcache

# Secrets
*.pem
*.key
*_rsa
*_ed25519
credentials.json
EOF
print_success "Created .gitignore"

# =============================================================================
# Create .env.example
# =============================================================================

cat > .env.example << 'EOF'
# =============================================================================
# Environment Variables
# Copy this to .env.local and fill in values
# =============================================================================

# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# External APIs (add as needed)
# STRIPE_SECRET_KEY=
# ANTHROPIC_API_KEY=
EOF
print_success "Created .env.example"

# =============================================================================
# Create placeholder docs
# =============================================================================

# Research docs
echo "# Market Analysis

## Overview

[Market analysis content]

## Market Size

## Trends

## Opportunities
" > docs/research/MARKET-ANALYSIS.md

echo "# Competitor Analysis

## Competitors

| Competitor | Strengths | Weaknesses | Differentiator |
|------------|-----------|------------|----------------|
| | | | |

## Analysis
" > docs/research/COMPETITOR-ANALYSIS.md

echo "# User Research

## Methodology

## Key Findings

## User Personas
" > docs/research/USER-RESEARCH.md

print_success "Created research doc placeholders"

# Strategy docs
echo "# Vision

## Mission

## Vision

## Values
" > docs/strategy/VISION.md

echo "# Value Proposition

## Problem

## Solution

## Unique Value
" > docs/strategy/VALUE-PROP.md

print_success "Created strategy doc placeholders"

# Brand docs
echo "# Brand Voice

## Tone

## Personality

## Do's and Don'ts
" > docs/brand/BRAND-VOICE.md

echo "# Visual Identity

## Colors

## Typography

## Logo

## Design Tokens
" > docs/brand/VISUAL-IDENTITY.md

print_success "Created brand doc placeholders"

# Design docs
echo "# User Flows

## Core Flow

## Secondary Flows
" > docs/design/USER-FLOWS.md

echo "# Information Architecture

## Site Map

## Navigation
" > docs/design/INFORMATION-ARCHITECTURE.md

print_success "Created design doc placeholders"

# Technical docs
echo "# Architecture

## Overview

## Tech Stack

## Infrastructure
" > docs/technical/ARCHITECTURE.md

echo "# Database Schema

## Models

## Relationships
" > docs/technical/DATABASE-SCHEMA.md

echo "# API Specification

## Endpoints

## Authentication
" > docs/technical/API-SPEC.md

print_success "Created technical doc placeholders"

# GTM docs
echo "# GTM Strategy

## Target Audience

## Channels

## Timeline
" > docs/gtm/GTM-STRATEGY.md

print_success "Created GTM doc placeholders"

# =============================================================================
# Create Feature List
# =============================================================================

cat > docs/FEATURE-LIST.md << 'EOF'
# Feature List

## MVP (Must Have)

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| | | P0 | ⚪ |
| | | P0 | ⚪ |
| | | P0 | ⚪ |

## Post-MVP (Nice to Have)

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| | | P1 | ⚪ |
| | | P2 | ⚪ |

## Out of Scope

- [Feature we're not building]
- [Another feature we're not building]
EOF
print_success "Created docs/FEATURE-LIST.md"

# =============================================================================
# Initialize Git
# =============================================================================

print_info "Initializing git repository..."
git init -q
git add .
git commit -q -m "Initial project setup with templates

🤖 Generated with Claude Code"
print_success "Git repository initialized with initial commit"

# =============================================================================
# Optional: Initialize Framework
# =============================================================================

if [ "$INIT_TYPE" = "next" ]; then
    print_info "Initializing Next.js..."
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
    print_success "Next.js initialized"
elif [ "$INIT_TYPE" = "vite" ]; then
    print_info "Initializing Vite + React..."
    npm create vite@latest . -- --template react-ts
    print_success "Vite + React initialized"
fi

# =============================================================================
# Summary
# =============================================================================

print_header "Project Created Successfully!"

echo ""
echo -e "Project location: ${GREEN}$FULL_PATH${NC}"
echo ""
echo "Folder structure:"
echo "  ├── CLAUDE.md           (AI context)"
echo "  ├── README.md           (Project overview)"
echo "  ├── .gitignore          (Git ignore rules)"
echo "  ├── .env.example        (Environment template)"
echo "  ├── docs/"
echo "  │   ├── PRD.md          (Product requirements)"
echo "  │   ├── PROCESS.md      (Development process)"
echo "  │   ├── HANDOFF.md      (Technical handoff)"
echo "  │   ├── TICKETS.md      (Development tickets)"
echo "  │   ├── FEATURE-LIST.md (Feature priorities)"
echo "  │   ├── research/       (Phase 0 docs)"
echo "  │   ├── strategy/       (Phase 1 docs)"
echo "  │   ├── brand/          (Phase 2 docs)"
echo "  │   ├── design/         (Phase 3 docs)"
echo "  │   ├── technical/      (Phase 5 docs)"
echo "  │   └── gtm/            (GTM docs)"
echo "  ├── prototype/          (Phase 4 code)"
echo "  └── src/                (Phase 6 production code)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. cd $FULL_PATH"
echo "  2. Open CLAUDE.md and update the overview"
echo "  3. Start with Phase 0: Research"
echo "  4. Follow docs/PROCESS.md for guidance"
echo ""
echo -e "${GREEN}Happy building!${NC}"
