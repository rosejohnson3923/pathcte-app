#!/bin/bash

# Apply RLS Recursion Fix Migration
# Fixes circular dependency between game_sessions and game_players RLS policies

set -e

echo "=========================================="
echo "Applying RLS Recursion Fix Migration"
echo "=========================================="

# Load environment variables
if [ -f "packages/web/.env" ]; then
    export $(cat packages/web/.env | grep -v '^#' | xargs)
fi

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in packages/web/.env"
    exit 1
fi

# Extract database connection info from Supabase URL
DB_HOST=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|http://||' | cut -d'/' -f1)
PROJECT_REF=$(echo $DB_HOST | cut -d'.' -f1)

echo "Supabase Project: $PROJECT_REF"
echo ""

# Apply migration using Supabase SQL Editor or psql
MIGRATION_FILE="database/migrations/037_fix_game_sessions_rls_recursion.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "To apply this migration, you have two options:"
echo ""
echo "Option 1: Use Supabase Dashboard"
echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "  2. Copy and paste the contents of: $MIGRATION_FILE"
echo "  3. Click 'Run'"
echo ""
echo "Option 2: Use psql (if you have direct database access)"
echo "  psql '<your-database-connection-string>' -f $MIGRATION_FILE"
echo ""
echo "Migration content:"
echo "=========================================="
cat "$MIGRATION_FILE"
echo "=========================================="
