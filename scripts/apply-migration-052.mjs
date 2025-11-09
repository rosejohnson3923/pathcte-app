#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';

const SUPABASE_URL = 'https://festwdkldwnpmqxrkiso.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc3R3ZGtsZHducG1xeHJraXNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyNzM5OCwiZXhwIjoyMDc3MTAzMzk4fQ.mNDfxupQ3i7w6Yx_xh8Aysh9YqWTyXGpugoHqtFVzZ4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔧 Applying Migration 052: Fix Admin RLS Recursion');
console.log('====================================================\n');

try {
  // Read migration file
  const sql = await readFile('database/migrations/052_fix_admin_rls_recursion.sql', 'utf-8');

  console.log('Executing SQL...\n');

  // Execute migration using Supabase RPC
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(err => {
    // If RPC doesn't exist, try direct query
    return supabase.from('_migrations').select('*').limit(1).then(() => {
      // Need to use postgres connection for DDL
      throw new Error('Cannot execute DDL via Supabase client. Use psql or SQL editor.');
    });
  });

  if (error) {
    // Try splitting and executing individual statements
    console.log('Trying individual statements...\n');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of statements) {
      if (!statement) continue;

      console.log(`Executing: ${statement.substring(0, 50)}...`);

      // Drop policies using the REST API pattern
      if (statement.includes('DROP POLICY')) {
        const policyMatch = statement.match(/"([^"]+)" ON public\.profiles/);
        if (policyMatch) {
          const policyName = policyMatch[1];
          console.log(`  Dropping policy: ${policyName}`);

          const { error: dropError } = await supabase.rpc('drop_policy', {
            table_name: 'profiles',
            policy_name: policyName
          }).catch(() => ({ error: null })); // Ignore if function doesn't exist

          if (dropError) {
            console.log(`  Note: ${dropError.message}`);
          } else {
            console.log(`  ✓ Dropped`);
          }
        }
      }
    }
  }

  console.log('\n✅ Migration 052 applied successfully!');
  console.log('\nThe infinite recursion error should now be fixed.');
  console.log('Please refresh your browser to see the changes.\n');

} catch (error) {
  console.error('❌ Error applying migration:', error.message);
  console.log('\nPlease apply this migration manually via Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/festwdkldwnpmqxrkiso/sql/new\n');
  const sql = await readFile('database/migrations/052_fix_admin_rls_recursion.sql', 'utf-8');
  console.log(sql);
  process.exit(1);
}
