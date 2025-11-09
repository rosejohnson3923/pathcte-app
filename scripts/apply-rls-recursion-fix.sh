#!/bin/bash

echo "🔧 Applying RLS Recursion Fix (Migration 052)"
echo "============================================="
echo ""
echo "This will remove the problematic admin RLS policies"
echo "that cause infinite recursion when loading profiles."
echo ""
echo "Please run this SQL in Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso/sql/new"
echo ""
echo "=========================================="
cat database/migrations/052_fix_admin_rls_recursion.sql
echo "=========================================="
echo ""
echo "After running the SQL, press Enter to continue..."
read
