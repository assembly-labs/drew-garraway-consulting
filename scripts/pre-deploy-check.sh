#!/bin/bash

# Pre-Deployment Checklist Script
# Ensures safe deployments for monorepo prototypes

set -e  # Exit on error

echo ""
echo "🔍 =============================================="
echo "   PRE-DEPLOYMENT CHECKLIST"
echo "=============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Not a git repository!${NC}"
    exit 1
fi

# Check for uncommitted changes
echo -e "${BLUE}📝 Checking for changes...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${GREEN}✅ Changes detected${NC}"
    echo ""
    git status --short
    echo ""
else
    echo -e "${YELLOW}⚠️  No uncommitted changes found${NC}"
    echo "Either you've already committed, or there's nothing to deploy."
    read -p "Continue anyway? (y/n): " continue_check
    if [[ $continue_check != "y" ]]; then
        exit 0
    fi
fi

# Identify which prototype is being modified
echo ""
echo -e "${BLUE}🎯 Identifying modified prototype...${NC}"
echo ""

CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || git status --short | awk '{print $2}')

# Array of known prototypes
declare -A PROTOTYPES=(
    ["librarian-llm"]="Librarian LLM"
    ["cantstopwontstop"]="CantStopWontStop"
    ["nofomo"]="NoFomo"
    ["assembly-agentic-articles"]="Assembly Agentic Articles"
    ["gym/prototype"]="Gym Prototype"
)

# Detect which prototypes have changes
AFFECTED_PROTOTYPES=()
for dir in "${!PROTOTYPES[@]}"; do
    if echo "$CHANGED_FILES" | grep -q "^$dir/"; then
        AFFECTED_PROTOTYPES+=("$dir")
    fi
done

if [ ${#AFFECTED_PROTOTYPES[@]} -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No changes detected in known prototype directories${NC}"
    echo "Changes might be in root files or other directories."
    echo ""
    echo "Changed files:"
    echo "$CHANGED_FILES"
    echo ""
    read -p "Continue deployment? (y/n): " continue_deploy
    if [[ $continue_deploy != "y" ]]; then
        exit 0
    fi
else
    echo -e "${GREEN}✅ Detected changes in:${NC}"
    for proto in "${AFFECTED_PROTOTYPES[@]}"; do
        echo "   - ${PROTOTYPES[$proto]} ($proto)"
    done
    echo ""
fi

# Check for common deployment issues
echo -e "${BLUE}🔍 Checking for common issues...${NC}"
echo ""

# Check 1: node_modules
if echo "$CHANGED_FILES" | grep -q "node_modules"; then
    echo -e "${RED}❌ CRITICAL: Attempting to commit node_modules!${NC}"
    echo "   node_modules should NEVER be committed."
    echo "   Add them to .gitignore immediately."
    exit 1
else
    echo -e "${GREEN}✅ No node_modules in commit${NC}"
fi

# Check 2: .env files
if echo "$CHANGED_FILES" | grep -q "\.env$"; then
    echo -e "${RED}❌ CRITICAL: Attempting to commit .env file!${NC}"
    echo "   .env files contain secrets and should NEVER be committed."
    echo "   Use Netlify environment variables instead."
    exit 1
else
    echo -e "${GREEN}✅ No .env files in commit${NC}"
fi

# Check 3: Large files
echo ""
echo -e "${BLUE}📦 Checking file sizes...${NC}"
LARGE_FILES=$(git diff --cached --name-only | xargs -I {} sh -c 'if [ -f "{}" ]; then size=$(wc -c < "{}"); if [ $size -gt 1048576 ]; then echo "{} ($(echo $size | awk "{print \$1/1048576 \"MB\"}"))"  ; fi; fi' 2>/dev/null)

if [ -n "$LARGE_FILES" ]; then
    echo -e "${YELLOW}⚠️  Large files detected (>1MB):${NC}"
    echo "$LARGE_FILES"
    echo ""
    read -p "Continue anyway? (y/n): " continue_large
    if [[ $continue_large != "y" ]]; then
        exit 0
    fi
else
    echo -e "${GREEN}✅ No unusually large files${NC}"
fi

# Check 4: Test builds for affected prototypes
echo ""
echo -e "${BLUE}🔨 Testing builds for affected prototypes...${NC}"
echo ""

BUILD_ERRORS=0

for proto in "${AFFECTED_PROTOTYPES[@]}"; do
    echo -e "${BLUE}Building: ${PROTOTYPES[$proto]}${NC}"

    if [ -f "$proto/package.json" ]; then
        cd "$proto" || exit 1

        # Check if node_modules exists, if not, install
        if [ ! -d "node_modules" ]; then
            echo "   Installing dependencies..."
            npm install --silent
        fi

        # Run build
        echo "   Running build..."
        if npm run build > /tmp/build-$proto.log 2>&1; then
            echo -e "${GREEN}✅ Build successful${NC}"
        else
            echo -e "${RED}❌ Build FAILED${NC}"
            echo "   Check log: /tmp/build-$proto.log"
            cat /tmp/build-$proto.log
            BUILD_ERRORS=$((BUILD_ERRORS + 1))
        fi

        cd - > /dev/null || exit 1
    else
        echo -e "${YELLOW}⚠️  No package.json found, skipping build test${NC}"
    fi
    echo ""
done

if [ $BUILD_ERRORS -gt 0 ]; then
    echo -e "${RED}❌ $BUILD_ERRORS build(s) failed!${NC}"
    echo "Fix build errors before deploying."
    exit 1
fi

# Final summary
echo ""
echo -e "${BLUE}=============================================="
echo "   SUMMARY"
echo "===============================================${NC}"
echo ""

if [ ${#AFFECTED_PROTOTYPES[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ Ready to deploy:${NC}"
    for proto in "${AFFECTED_PROTOTYPES[@]}"; do
        echo "   - ${PROTOTYPES[$proto]}"
    done
else
    echo -e "${YELLOW}⚠️  No specific prototypes detected${NC}"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "   1. Review changes: git diff"
echo "   2. Stage changes: git add <files>"
echo "   3. Commit: git commit -m 'Your message'"
echo "   4. Deploy: git push origin main"
echo ""

# Ask for confirmation
read -p "🚀 Push to GitHub now? (y/n): " do_push

if [[ $do_push == "y" ]]; then
    echo ""
    echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
    git push origin main
    echo ""
    echo -e "${GREEN}✅ Deployed successfully!${NC}"
    echo ""
    echo "Monitor deployments at: https://app.netlify.com"
else
    echo ""
    echo -e "${YELLOW}⚠️  Deployment cancelled${NC}"
    echo "Run 'git push origin main' when ready."
fi

echo ""
echo -e "${GREEN}Done!${NC}"
echo ""
