#!/bin/bash

#==============================================================================
#  🚀 ONE-CLICK SETUP AND TEST SCRIPT FOR TEXT READER
#==============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo ""
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}    TEXT READER - COMPLETE SETUP & TESTING SOLUTION${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}This script will:${NC}"
echo "  1. ✅ Check/install dependencies"
echo "  2. ✅ Generate SSL certificates"
echo "  3. ✅ Create app icons"
echo "  4. ✅ Start HTTPS server"
echo "  5. ✅ Open in browser"
echo "  6. ✅ Show iPhone testing instructions"
echo ""
echo -e "${BOLD}${GREEN}Ready? Press Enter to continue (or Ctrl+C to cancel)${NC}"
read

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Starting automated setup...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Make test script executable
chmod +x test_now.sh

# Run the main test script
./test_now.sh