/**
 * Check for Duplicate Question Sets
 * ===================================
 * Identify duplicate question sets by title and type
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
  console.log('🔍 Checking for duplicate question sets\n');

  // Fetch all question sets
  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster, total_questions, created_at')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  // Group by title
  const groupedByTitle = new Map();

  for (const set of questionSets) {
    if (!groupedByTitle.has(set.title)) {
      groupedByTitle.set(set.title, []);
    }
    groupedByTitle.get(set.title).push(set);
  }

  // Find duplicates
  const duplicates = Array.from(groupedByTitle.entries())
    .filter(([_, sets]) => sets.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log(`📊 Total question sets: ${questionSets.length}`);
  console.log(`📊 Unique titles: ${groupedByTitle.size}`);
  console.log(`📊 Titles with duplicates: ${duplicates.length}\n`);

  if (duplicates.length > 0) {
    console.log('🔄 Duplicate question sets:\n');

    for (const [title, sets] of duplicates) {
      const type = sets[0].career_cluster ? 'Cluster' :
                   sets[0].career_id ? 'Career' : 'Industry';

      console.log(`  "${title}" (${type}) - ${sets.length} copies:`);
      for (const set of sets) {
        console.log(`    - ID: ${set.id.substring(0, 8)}... | Questions: ${set.total_questions} | Created: ${set.created_at}`);
      }
      console.log('');
    }
  } else {
    console.log('✅ No duplicates found!');
  }
}

main().catch(console.error);
