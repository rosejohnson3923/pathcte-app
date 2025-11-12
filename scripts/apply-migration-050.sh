#!/bin/bash

# CRITICAL FIX: Prevent negative scores from penalties
# This fixes the issue where wrong answers can cause negative scores

set -e

echo "=========================================="
echo "CRITICAL FIX: Negative Score Prevention"
echo "=========================================="
echo ""
echo "⚠️  CRITICAL BUG FIX"
echo "Students are getting database constraint errors when"
echo "answering questions incorrectly because penalties can"
echo "cause negative scores."
echo ""
echo "This happens when a player has fewer points than the"
echo "penalty amount (e.g., 5 points with -10 penalty = -5)."
echo ""

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
MIGRATION_FILE="database/migrations/050_fix_negative_score_penalty.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "This fix:"
echo "  ✅ Caps score at 0 in submit_answer_securely()"
echo "  ✅ Caps score at 0 in apply_no_answer_penalty()"
echo "  ✅ Prevents database constraint violations"
echo "  ✅ Ensures scores never go negative"
echo ""
echo "To apply this CRITICAL fix:"
echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "  2. Copy and paste the contents below"
echo "  3. Click 'Run'"
echo ""
echo "Migration content:"
echo "=========================================="
cat "$MIGRATION_FILE"
echo "=========================================="
