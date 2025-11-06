#!/bin/bash

# CRITICAL HOTFIX: Restore bypass flag in submit_answer_securely
# This fixes the issue where students cannot submit answers

set -e

echo "=========================================="
echo "CRITICAL HOTFIX: Submit Answer Bypass"
echo "=========================================="
echo ""
echo "⚠️  CRITICAL BUG FIX"
echo "Students cannot currently submit answers due to missing"
echo "bypass flag in submit_answer_securely function."
echo ""
echo "This was caused by migration 047 accidentally removing"
echo "the bypass flag when updating the scoring system."
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
MIGRATION_FILE="database/migrations/049_fix_submit_answer_bypass.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "This hotfix:"
echo "  ✅ Restores bypass flag to submit_answer_securely()"
echo "  ✅ Adds bypass flag to apply_no_answer_penalty()"
echo "  ✅ Allows students to submit answers again"
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
