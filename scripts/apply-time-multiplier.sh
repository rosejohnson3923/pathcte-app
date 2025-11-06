#!/bin/bash

# Apply Time Multiplier Migration
# Adds configurable time multipliers to game mode configuration

set -e

echo "=========================================="
echo "Applying Time Multiplier Configuration"
echo "=========================================="

# Load environment variables
if [ -f "packages/web/.env" ]; then
    export $(cat packages/web/.env | grep -v '^#' | xargs)
fi

# Check for required environment variables
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "Error: VITE_SUPABASE_URL must be set in packages/web/.env"
    exit 1
fi

# Extract database connection info from Supabase URL
DB_HOST=$(echo $VITE_SUPABASE_URL | sed 's|https://||' | sed 's|http://||' | cut -d'/' -f1)
PROJECT_REF=$(echo $DB_HOST | cut -d'.' -f1)

echo "Supabase Project: $PROJECT_REF"
echo ""

# Apply migration using Supabase SQL Editor
MIGRATION_FILE="database/migrations/048_add_time_multiplier.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "This migration:"
echo "  - Adds time_multiplier column to game_mode_scoring table"
echo "  - Sets Lightning! Path (speed_run) to 0.5 (half time)"
echo "  - Keeps all other modes at 1.0 (normal time)"
echo "  - Allows configurable time limits per game mode"
echo ""
echo "To apply this migration:"
echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "  2. Copy and paste the contents below"
echo "  3. Click 'Run'"
echo ""
echo "Migration content:"
echo "=========================================="
cat "$MIGRATION_FILE"
echo "=========================================="
