/**
 * Clean Question Set Titles
 * ==========================
 * Remove suffixes like "- Career Exploration", "- Industry Exploration", "- Cluster"
 * and remove duplicate cluster sets
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
  console.log('🧹 Cleaning question set titles\n');

  // Fetch all question sets
  const { data: questionSets, error: fetchError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster')
    .order('title');

  if (fetchError) {
    console.error('❌ Error fetching question sets:', fetchError);
    process.exit(1);
  }

  console.log(`Found ${questionSets.length} question sets\n`);

  // Track duplicates for clusters
  const clusterTitles = new Map();
  const duplicateIds = [];

  let updateCount = 0;

  for (const set of questionSets) {
    let newTitle = set.title;
    let needsUpdate = false;

    // Remove suffixes
    const suffixes = [
      ' - Career Exploration',
      ' - Industry Exploration',
      ' - Cluster',
      ' - CTE Cluster',
      ' - Career Cluster'
    ];

    for (const suffix of suffixes) {
      if (newTitle.endsWith(suffix)) {
        newTitle = newTitle.replace(suffix, '');
        needsUpdate = true;
      }
    }

    // Track cluster duplicates
    if (set.career_cluster) {
      if (clusterTitles.has(newTitle)) {
        // This is a duplicate
        duplicateIds.push(set.id);
        console.log(`  🔄 Found duplicate cluster: "${set.title}" (will be removed)`);
      } else {
        clusterTitles.set(newTitle, set.id);
      }
    }

    // Update title if needed
    if (needsUpdate && !duplicateIds.includes(set.id)) {
      const { error: updateError } = await supabase
        .from('question_sets')
        .update({ title: newTitle })
        .eq('id', set.id);

      if (updateError) {
        console.error(`  ❌ Error updating "${set.title}":`, updateError);
      } else {
        console.log(`  ✅ Updated: "${set.title}" → "${newTitle}"`);
        updateCount++;
      }
    }
  }

  // Remove duplicates
  if (duplicateIds.length > 0) {
    console.log(`\n🗑️  Removing ${duplicateIds.length} duplicate cluster sets...\n`);

    for (const id of duplicateIds) {
      const { error: deleteError } = await supabase
        .from('question_sets')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error(`  ❌ Error deleting duplicate:`, deleteError);
      } else {
        console.log(`  ✅ Deleted duplicate cluster set`);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  - Titles updated: ${updateCount}`);
  console.log(`  - Duplicates removed: ${duplicateIds.length}`);
  console.log(`\n🎉 Title cleanup complete!`);
}

main().catch(console.error);
