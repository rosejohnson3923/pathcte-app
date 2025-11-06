#!/bin/bash

# Apply Unified Configurable Scoring Migration
# Implements configurable scoring system for all game modes

set -e

echo "=========================================="
echo "Applying Unified Configurable Scoring"
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
MIGRATION_FILE="database/migrations/047_unified_configurable_scoring.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "This migration:"
echo "  - Creates game_mode_scoring table with configurable points/penalties"
echo "  - Sets all modes to 25/-10/-10 (correct/incorrect/no-answer)"
echo "  - Updates submit_answer_securely() to use config"
echo "  - Updates apply_no_answer_penalty() to work for all modes"
echo "  - Supports setting penalties to 0 to disable them"
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
