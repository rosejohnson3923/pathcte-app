/**
 * Check for Duplicate Question Sets - Detailed View
 * ==================================================
 * Check duplicates with question_set_type field
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
  console.log('🔍 Checking for duplicate question sets (detailed)\n');

  // Fetch all question sets
  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster, total_questions, question_set_type, created_at')
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
    console.log('🔄 Checking first 5 duplicate sets:\n');

    for (let i = 0; i < Math.min(5, duplicates.length); i++) {
      const [title, sets] = duplicates[i];
      const type = sets[0].career_cluster ? 'Cluster' :
                   sets[0].career_id ? 'Career' : 'Industry';

      console.log(`  "${title}" (${type}):`);
      for (const set of sets) {
        console.log(`    - Type: ${set.question_set_type || 'NULL'} | Questions: ${set.total_questions} | Created: ${set.created_at.substring(0, 19)}`);
      }
      console.log('');
    }

    // Check if they have different types
    const uniqueTypes = new Set();
    for (const [_, sets] of duplicates) {
      for (const set of sets) {
        uniqueTypes.add(set.question_set_type);
      }
    }

    console.log(`\n📋 Unique question_set_type values found:`);
    console.log(Array.from(uniqueTypes).map(t => `  - ${t || 'NULL'}`).join('\n'));
  } else {
    console.log('✅ No duplicates found!');
  }
}

main().catch(console.error);
