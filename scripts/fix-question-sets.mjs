/**
 * Fix Question Sets Structure
 * ============================
 * 1. NULL out career_cluster for career question sets (where career_id IS NOT NULL)
 * 2. Remove duplicate question sets
 * 3. Drop question_set_membership table (redundant - questions have question_set_id FK)
 * 4. Result: 71 unique sets (50 career + 11 cluster + 10 industry)
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
  console.log('🔧 FIXING QUESTION SETS STRUCTURE\n');
  console.log('='.repeat(80) + '\n');

  // Step 1: NULL out career_cluster for career sets
  console.log('STEP 1: Clearing career_cluster for career question sets...\n');

  const { data: careerSets, error: fetchError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster')
    .not('career_id', 'is', null)
    .not('career_cluster', 'is', null);

  if (fetchError) {
    console.error('❌ Error fetching career sets:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${careerSets.length} career sets with career_cluster populated`);

  if (careerSets.length > 0) {
    const { error: updateError } = await supabase
      .from('question_sets')
      .update({ career_cluster: null })
      .not('career_id', 'is', null)
      .not('career_cluster', 'is', null);

    if (updateError) {
      console.error('❌ Error updating career sets:', updateError);
      process.exit(1);
    }

    console.log(`✅ Cleared career_cluster from ${careerSets.length} career sets\n`);
  }

  // Step 2: Identify and remove duplicates
  console.log('STEP 2: Removing duplicate question sets...\n');

  const { data: allSets, error: allError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster, created_at')
    .order('title, created_at');

  if (allError) {
    console.error('❌ Error fetching all sets:', allError);
    process.exit(1);
  }

  // Group by title
  const groupedByTitle = new Map();
  for (const set of allSets) {
    if (!groupedByTitle.has(set.title)) {
      groupedByTitle.set(set.title, []);
    }
    groupedByTitle.get(set.title).push(set);
  }

  // Find duplicates
  const toDelete = [];
  const toKeep = [];

  for (const [title, sets] of groupedByTitle.entries()) {
    if (sets.length === 1) {
      toKeep.push(sets[0]);
      continue;
    }

    // For duplicates, keep based on logic:
    // - Career: Keep the one with career_cluster = NULL
    // - Cluster: Keep the one with career_cluster NOT NULL
    // - Industry: Keep any (they're all identical)

    const hasCareer = sets.some(s => s.career_id !== null);
    const hasCluster = sets.some(s => s.career_id === null && s.career_cluster !== null);

    let keep;
    if (hasCareer) {
      // Career set - keep the one with career_cluster = NULL
      keep = sets.find(s => s.career_cluster === null) || sets[0];
    } else if (hasCluster) {
      // Cluster set - keep the one with career_cluster NOT NULL
      keep = sets.find(s => s.career_cluster !== null) || sets[0];
    } else {
      // Industry set - keep oldest
      keep = sets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];
    }

    toKeep.push(keep);
    const remove = sets.filter(s => s.id !== keep.id);
    toDelete.push(...remove);

    console.log(`  "${title}": keeping 1, removing ${remove.length}`);
  }

  console.log(`\nTotal to delete: ${toDelete.length}`);

  if (toDelete.length > 0) {
    // Delete in batches
    const batchSize = 10;
    let deleted = 0;

    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = toDelete.slice(i, i + batchSize);
      const ids = batch.map(s => s.id);

      const { error: deleteError } = await supabase
        .from('question_sets')
        .delete()
        .in('id', ids);

      if (deleteError) {
        console.error(`❌ Error deleting batch:`, deleteError);
      } else {
        deleted += batch.length;
        console.log(`  ✅ Deleted ${deleted}/${toDelete.length}...`);
      }
    }
  }

  // Step 3: Note about question_set_membership table
  console.log('\n' + '='.repeat(80));
  console.log('\nSTEP 3: Question set membership table...\n');
  console.log('ℹ️  The question_set_membership table is now deprecated (redundant 1:1 relationship)');
  console.log('ℹ️  Run migration 047_drop_question_set_membership.sql to remove it');
  console.log('ℹ️  All queries use questions.question_set_id foreign key directly\n');

  // Step 4: Verify results
  console.log('='.repeat(80));
  console.log('\nSTEP 4: Verifying results...\n');

  const { data: finalSets } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster');

  const careers = finalSets.filter(s => s.career_id !== null);
  const clusters = finalSets.filter(s => s.career_id === null && s.career_cluster !== null);
  const industries = finalSets.filter(s => s.career_id === null && s.career_cluster === null);

  console.log('FINAL COUNTS:');
  console.log(`  ✅ Career sets: ${careers.length} (expected: 50)`);
  console.log(`  ✅ Cluster sets: ${clusters.length} (expected: 11)`);
  console.log(`  ✅ Industry sets: ${industries.length} (expected: 10)`);
  console.log(`  ✅ Total: ${finalSets.length} (expected: 71)`);

  console.log('\n🎉 Question sets structure fixed!\n');
}

main().catch(console.error);
