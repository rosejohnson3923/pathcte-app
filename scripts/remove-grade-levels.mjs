/**
 * Remove Grade Level Values from Question Sets
 * All questions are now suitable for grades 6-12 (no filtering needed)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../packages/web/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function main() {
  console.log('🚀 Removing grade level values from question sets\n');

  // Get count before update
  const { count: beforeCount } = await supabase
    .from('question_sets')
    .select('*', { count: 'exact', head: true })
    .not('grade_level', 'eq', '{}');

  console.log(`Found ${beforeCount} question sets with non-empty grade_level\n`);

  // Update all question sets to have empty grade_level arrays
  const { error } = await supabase.rpc('update_all_grade_levels');

  if (error) {
    // If RPC doesn't exist, do it the direct way
    console.log('Using direct update method...');
    const { data, error: updateError } = await supabase
      .from('question_sets')
      .update({ grade_level: [] })
      .not('id', 'is', null)  // Match all records
      .select('id');

    if (updateError) {
      console.error('❌ Error updating question sets:', updateError);
      process.exit(1);
    }

    console.log(`✅ Updated ${data?.length || 0} question sets`);
  } else {
    console.log(`✅ Updated question sets via RPC`);
  }

  // Verify the update
  const { count: totalCount } = await supabase
    .from('question_sets')
    .select('*', { count: 'exact', head: true });

  const { count: emptyCount } = await supabase
    .from('question_sets')
    .select('*', { count: 'exact', head: true })
    .eq('grade_level', []);

  console.log(`\n📊 Summary:`);
  console.log(`  - Total question sets: ${totalCount}`);
  console.log(`  - Sets with empty grade_level: ${emptyCount}`);
  console.log(`\n🎉 Grade level removal complete!`);
}

main().catch(console.error);
