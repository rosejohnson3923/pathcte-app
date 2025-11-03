#!/bin/bash

# PathCTE Durable Functions - Dependency Check
# Run this before testing to ensure all dependencies are installed

set -e

echo "======================================"
echo "PathCTE Functions - Dependency Check"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ALL_GOOD=true

# Check 1: Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ALL_GOOD=false
fi

# Check 2: npm
echo ""
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    ALL_GOOD=false
fi

# Check 3: Azurite
echo ""
echo "3. Checking Azurite..."
if command -v azurite &> /dev/null; then
    echo -e "${GREEN}✓ Azurite installed${NC}"
else
    echo -e "${RED}✗ Azurite not found${NC}"
    echo "  Install: npm install -g azurite"
    ALL_GOOD=false
fi

# Check 4: Azure Functions Core Tools
echo ""
echo "4. Checking Azure Functions Core Tools..."
if command -v func &> /dev/null; then
    FUNC_VERSION=$(func --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓ Azure Functions Core Tools installed: $FUNC_VERSION${NC}"
else
    echo -e "${RED}✗ Azure Functions Core Tools not found${NC}"
    echo "  Install: npm install -g azure-functions-core-tools@4 --unsafe-perm true"
    ALL_GOOD=false
fi

# Check 5: libicu (ICU library)
echo ""
echo "5. Checking ICU library..."
if ldconfig -p 2>/dev/null | grep -q libicuuc; then
    echo -e "${GREEN}✓ libicu installed${NC}"
else
    echo -e "${RED}✗ libicu not found${NC}"
    echo ""
    echo -e "${YELLOW}This is the critical missing dependency!${NC}"
    echo ""
    echo "  Install with:"
    echo "    sudo apt-get update && sudo apt-get install -y libicu-dev"
    echo ""
    echo "  Or on other systems:"
    echo "    - Ubuntu/Debian: sudo apt-get install libicu-dev"
    echo "    - Fedora/RHEL: sudo dnf install libicu-devel"
    echo "    - macOS: brew install icu4c"
    echo ""
    ALL_GOOD=false
fi

# Check 6: Supabase Service Key
echo ""
echo "6. Checking Supabase configuration..."
SERVICE_KEY=$(grep -o '"SUPABASE_SERVICE_KEY": "[^"]*"' local.settings.json | cut -d'"' -f4)

if [ -z "$SERVICE_KEY" ]; then
    echo -e "${RED}✗ SUPABASE_SERVICE_KEY is not set${NC}"
    ALL_GOOD=false
else
    echo -e "${GREEN}✓ SUPABASE_SERVICE_KEY is configured${NC}"
fi

# Check 7: TypeScript compilation
echo ""
echo "7. Checking TypeScript build..."
if [ -d "dist" ]; then
    DIST_FILES=$(find dist -name "*.js" 2>/dev/null | wc -l)
    if [ "$DIST_FILES" -gt 0 ]; then
        echo -e "${GREEN}✓ TypeScript compiled ($DIST_FILES JS files)${NC}"
    else
        echo -e "${YELLOW}⚠ dist/ folder exists but no JS files found${NC}"
        echo "  Run: npm run build"
    fi
else
    echo -e "${RED}✗ dist/ folder not found${NC}"
    echo "  Run: npm run build"
    ALL_GOOD=false
fi

# Summary
echo ""
echo "======================================"
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✓ All dependencies installed!${NC}"
    echo ""
    echo "You're ready to run:"
    echo "  ./test-local.sh"
else
    echo -e "${RED}✗ Some dependencies are missing${NC}"
    echo ""
    echo "Please install missing dependencies above."
    echo ""
    echo "Most common fix (WSL/Ubuntu):"
    echo "  sudo apt-get update && sudo apt-get install -y libicu-dev"
fi
echo "======================================"
