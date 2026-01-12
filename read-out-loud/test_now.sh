#!/bin/bash

#==============================================================================
#  TEXT READER - AUTOMATED LOCAL TEST SCRIPT
#==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 TEXT READER - AUTOMATED TESTING SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get local IP
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
    else
        hostname -I | awk '{print $1}'
    fi
}

# Step 1: Check Python
echo -e "${BLUE}[1/6]${NC} Checking Python installation..."
if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.${NC}"
    echo "   Run: brew install python3"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✅ Python $PYTHON_VERSION found${NC}"

# Step 2: Check/Install mkcert
echo -e "${BLUE}[2/6]${NC} Checking mkcert installation..."
if ! command_exists mkcert; then
    echo -e "${YELLOW}⚠️  mkcert not found. Installing...${NC}"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            echo "Installing mkcert via Homebrew..."
            brew install mkcert
            mkcert -install
        else
            echo -e "${RED}❌ Homebrew not found. Please install mkcert manually:${NC}"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            echo "   brew install mkcert"
            echo "   mkcert -install"
            exit 1
        fi
    else
        echo -e "${RED}❌ Please install mkcert manually for your system${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ mkcert found${NC}"
fi

# Step 3: Check/Generate certificates
echo -e "${BLUE}[3/6]${NC} Checking SSL certificates..."
if [[ ! -f "localhost.pem" ]] || [[ ! -f "localhost-key.pem" ]]; then
    echo "Generating SSL certificates..."
    LOCAL_IP=$(get_local_ip)
    mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1 $LOCAL_IP
    echo -e "${GREEN}✅ SSL certificates generated${NC}"
else
    echo -e "${GREEN}✅ SSL certificates found${NC}"
fi

# Step 4: Check icons
echo -e "${BLUE}[4/6]${NC} Checking app icons..."
if [[ ! -f "icons/icon-192.png" ]] || [[ ! -f "icons/icon-512.png" ]]; then
    echo "Icons missing. Generating..."
    python3 generate_icons.py
else
    echo -e "${GREEN}✅ Icons found${NC}"
fi

# Step 5: Kill any existing server
echo -e "${BLUE}[5/6]${NC} Checking for existing servers..."
if lsof -Pi :8443 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Stopping existing server on port 8443..."
    kill $(lsof -Pi :8443 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 1
fi
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Stopping existing server on port 8000..."
    kill $(lsof -Pi :8000 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 1
fi
echo -e "${GREEN}✅ Ports cleared${NC}"

# Step 6: Get network info
LOCAL_IP=$(get_local_ip)

# Create QR code Python script
cat > generate_qr.py << 'EOF'
#!/usr/bin/env python3
import sys

def generate_qr_ascii(url):
    """Generate ASCII QR code for URL"""
    # Simple ASCII representation (not a real QR code, but visually similar)
    print("\n" + "█" * 25)
    print("█" + " " * 23 + "█")
    print("█  Scan QR or visit:   █")
    print("█" + " " * 23 + "█")
    print("█" * 25)
    print(f"\n📱 {url}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        generate_qr_ascii(sys.argv[1])
EOF

# Start the server
echo -e "${BLUE}[6/6]${NC} Starting HTTPS server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}📱 LOCAL ACCESS (Your Laptop):${NC}"
echo "   https://localhost:8443"
echo ""
echo -e "${GREEN}📱 iPhone/iPad ACCESS:${NC}"
echo "   https://$LOCAL_IP:8443"
echo ""

# Generate QR code display
python3 generate_qr.py "https://$LOCAL_IP:8443"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 QUICK TEST CHECKLIST:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. ✅ On iPhone: Open Safari (not Chrome)"
echo "2. ✅ Enter: https://$LOCAL_IP:8443"
echo "3. ✅ Tap 'Advanced' → 'Proceed to $LOCAL_IP'"
echo "4. ✅ Tap 'Import File' → Should open Files app"
echo "5. ✅ Select a PDF → Should load text"
echo "6. ✅ Tap Share → 'Add to Home Screen'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Open in default browser
echo -e "${BLUE}Opening in your default browser...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://localhost:8443" 2>/dev/null || true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://localhost:8443" 2>/dev/null || true
fi

echo -e "${GREEN}🚀 Server starting...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the HTTPS server
python3 server_https.py