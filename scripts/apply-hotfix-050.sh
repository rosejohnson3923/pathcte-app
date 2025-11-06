#!/bin/bash

# CRITICAL HOTFIX: Allow negative points and NULL answers
# This fixes database constraints that prevent the penalty system from working

set -e

echo "=========================================="
echo "CRITICAL HOTFIX: Game Answers Constraints"
echo "=========================================="
echo ""
echo "⚠️  CRITICAL BUG FIX"
echo "Students are experiencing errors when submitting incorrect answers."
echo ""
echo "Root cause: Two database constraints are blocking the penalty system:"
echo "  1. CHECK (points_earned >= 0) - prevents -10 penalties"
echo "  2. selected_option_index NOT NULL - prevents no-answer records"
echo ""
echo "This migration:"
echo "  ✅ Allows negative points_earned (-1000 to 1000)"
echo "  ✅ Allows NULL for selected_option_index (no-answer cases)"
echo "  ✅ Fixes duplicate submission bug (answers were failing, so hasAnswered never set)"
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
MIGRATION_FILE="database/migrations/050_allow_negative_points_and_null_answers.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "To apply this CRITICAL hotfix:"
echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "  2. Copy and paste the contents below"
echo "  3. Click 'Run'"
echo ""
echo "Migration content:"
echo "=========================================="
cat "$MIGRATION_FILE"
echo "=========================================="
