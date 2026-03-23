#!/bin/bash

# Git Repository Cleanup Script
# Removes node_modules and other artifacts from git tracking
# Does NOT delete local files - only stops tracking them

set -e

echo ""
echo "🧹 =============================================="
echo "   GIT REPOSITORY CLEANUP"
echo "=============================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if in git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Not in a git repository!${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will remove the following from git tracking:${NC}"
echo "   - node_modules/"
echo "   - dist/"
echo "   - build/"
echo "   - .env files"
echo "   - .DS_Store files"
echo ""
echo -e "${BLUE}Note: Local files will NOT be deleted - only untracked from git${NC}"
echo ""

read -p "Continue? (y/n): " confirm
if [[ $confirm != "y" ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}🔍 Finding tracked files that should be ignored...${NC}"
echo ""

# Find and remove node_modules
echo "Checking for node_modules..."
NODE_MODULES=$(git ls-files | grep "node_modules/" || true)
if [ -n "$NODE_MODULES" ]; then
    echo -e "${YELLOW}Found $(echo "$NODE_MODULES" | wc -l) node_modules files${NC}"
    echo "Removing from git..."
    git rm -r --cached */node_modules/ 2>/dev/null || true
    git rm -r --cached node_modules/ 2>/dev/null || true
    echo -e "${GREEN}✅ node_modules removed from git tracking${NC}"
else
    echo -e "${GREEN}✅ No node_modules tracked${NC}"
fi

# Find and remove dist/build folders
echo ""
echo "Checking for dist/build folders..."
DIST_FILES=$(git ls-files | grep -E "(dist/|build/)" || true)
if [ -n "$DIST_FILES" ]; then
    echo -e "${YELLOW}Found $(echo "$DIST_FILES" | wc -l) dist/build files${NC}"
    echo "Removing from git..."
    git rm -r --cached */dist/ 2>/dev/null || true
    git rm -r --cached */build/ 2>/dev/null || true
    git rm -r --cached dist/ 2>/dev/null || true
    git rm -r --cached build/ 2>/dev/null || true
    echo -e "${GREEN}✅ dist/build folders removed from git tracking${NC}"
else
    echo -e "${GREEN}✅ No dist/build folders tracked${NC}"
fi

# Find and remove .env files
echo ""
echo "Checking for .env files..."
ENV_FILES=$(git ls-files | grep "\.env$" || true)
if [ -n "$ENV_FILES" ]; then
    echo -e "${RED}⚠️  Found .env files:${NC}"
    echo "$ENV_FILES"
    read -p "Remove from git? (y/n): " remove_env
    if [[ $remove_env == "y" ]]; then
        echo "$ENV_FILES" | xargs git rm --cached
        echo -e "${GREEN}✅ .env files removed from git tracking${NC}"
    fi
else
    echo -e "${GREEN}✅ No .env files tracked${NC}"
fi

# Find and remove .DS_Store files
echo ""
echo "Checking for .DS_Store files..."
DS_STORE=$(git ls-files | grep "\.DS_Store" || true)
if [ -n "$DS_STORE" ]; then
    echo -e "${YELLOW}Found $(echo "$DS_STORE" | wc -l) .DS_Store files${NC}"
    echo "Removing from git..."
    echo "$DS_STORE" | xargs git rm --cached
    echo -e "${GREEN}✅ .DS_Store files removed from git tracking${NC}"
else
    echo -e "${GREEN}✅ No .DS_Store files tracked${NC}"
fi

# Check status
echo ""
echo -e "${BLUE}📊 Current status:${NC}"
git status --short | head -20

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "   1. Review changes: git status"
echo "   2. Commit cleanup: git commit -m '🧹 Remove build artifacts and node_modules from git'"
echo "   3. Push changes: git push origin main"
echo ""
echo -e "${YELLOW}Note: Your local files are still there! Only git tracking was removed.${NC}"
echo ""
