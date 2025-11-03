#!/bin/bash

# PathCTE Durable Functions - Local Testing Script
# Run this to test your Azure Functions locally

set -e

echo "======================================"
echo "PathCTE Durable Functions - Local Test"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Azurite is installed
echo "1. Checking Azurite..."
if ! command -v azurite &> /dev/null; then
    echo -e "${RED}✗ Azurite not found${NC}"
    echo "  Installing Azurite..."
    npm install -g azurite
    echo -e "${GREEN}✓ Azurite installed${NC}"
else
    echo -e "${GREEN}✓ Azurite is installed${NC}"
fi

# Check if SUPABASE_SERVICE_KEY is set
echo ""
echo "2. Checking local.settings.json..."
SERVICE_KEY=$(grep -o '"SUPABASE_SERVICE_KEY": "[^"]*"' local.settings.json | cut -d'"' -f4)

if [ -z "$SERVICE_KEY" ]; then
    echo -e "${YELLOW}⚠ SUPABASE_SERVICE_KEY is not set${NC}"
    echo ""
    echo "Please add your Supabase service role key to local.settings.json:"
    echo "  1. Go to https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso/settings/api"
    echo "  2. Copy the 'service_role' key (NOT the anon key)"
    echo "  3. Add it to local.settings.json:"
    echo '     "SUPABASE_SERVICE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."'
    echo ""
    echo -e "${RED}Cannot proceed without SUPABASE_SERVICE_KEY${NC}"
    exit 1
else
    echo -e "${GREEN}✓ SUPABASE_SERVICE_KEY is configured${NC}"
fi

# Build the project
echo ""
echo "3. Building TypeScript..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Start Azurite in background
echo ""
echo "4. Starting Azurite storage emulator..."
pkill -f azurite 2>/dev/null || true
mkdir -p /tmp/azurite
azurite --silent --location /tmp/azurite &
AZURITE_PID=$!
echo -e "${GREEN}✓ Azurite started (PID: $AZURITE_PID)${NC}"

# Wait for Azurite to be ready
sleep 2

# Start Azure Functions
echo ""
echo "5. Starting Azure Functions..."
echo -e "${YELLOW}Press Ctrl+C to stop the Functions runtime${NC}"
echo ""
echo "======================================"
echo "Functions will be available at:"
echo "  http://localhost:7071/api/..."
echo "======================================"
echo ""

# Trap to cleanup on exit
trap "echo ''; echo 'Stopping Azurite...'; kill $AZURITE_PID 2>/dev/null; exit" INT TERM

# Start Functions (this will run until Ctrl+C)
func start

# Cleanup (only reached if func start exits normally)
kill $AZURITE_PID 2>/dev/null
