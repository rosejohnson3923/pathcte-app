#!/bin/bash

# Add Admin User Type Migration
# Extends the user_type enum to include 'admin' for system administrators

set -e

echo "=========================================="
echo "Adding Admin User Type"
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
MIGRATION_FILE="database/migrations/051_add_admin_user_type.sql"

echo "Migration file: $MIGRATION_FILE"
echo ""
echo "This migration:"
echo "  - Adds 'admin' to the user_type CHECK constraint"
echo "  - Updates sysadmin@esposure.gg to admin role (if exists)"
echo "  - Adds RLS policies for admins to view/manage all profiles"
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
