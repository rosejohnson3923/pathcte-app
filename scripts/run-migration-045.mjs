/**
 * Run Migration 045: Add Question Pools Architecture
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../packages/web/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

console.log('📦 Running migration: Add Question Pools Architecture\n');

const sql = readFileSync(join(__dirname, '../database/migrations/045_add_question_pools_architecture.sql'), 'utf-8');

// Execute the entire migration as a transaction
const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

if (error) {
  console.error('❌ Migration failed:', error.message);
  console.error('Details:', error);
  process.exit(1);
}

console.log('✅ Migration completed successfully!\n');

// Verify results
const { count: membershipCount } = await supabase
  .from('question_set_membership')
  .select('*', { count: 'exact', head: true });

const { data: clustersPopulated } = await supabase
  .from('question_sets')
  .select('career_cluster')
  .not('career_id', 'is', null)
  .not('career_cluster', 'is', null);

console.log('📊 Migration Results:');
console.log(`  - question_set_membership records: ${membershipCount}`);
console.log(`  - question_sets with career_cluster: ${clustersPopulated?.length || 0}`);
console.log('\n✅ All existing questions migrated to new architecture!');
