/**
 * Analyze "Duplicate" Question Sets
 * ==================================
 * Check ALL fields to see if these are truly duplicates
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
  console.log('🔬 Analyzing "duplicate" question sets in detail\n');

  // Fetch all question sets with ALL fields
  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('*')
    .order('title, created_at');

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

  // Find "duplicates" and analyze differences
  const duplicates = Array.from(groupedByTitle.entries())
    .filter(([_, sets]) => sets.length > 1);

  console.log(`Analyzing first 3 "duplicate" sets:\n`);

  for (let i = 0; i < Math.min(3, duplicates.length); i++) {
    const [title, sets] = duplicates[i];

    console.log(`\n${'='.repeat(80)}`);
    console.log(`"${title}" - ${sets.length} copies\n`);

    for (let j = 0; j < sets.length; j++) {
      const set = sets[j];
      console.log(`Copy ${j + 1}:`);
      console.log(`  ID: ${set.id.substring(0, 8)}...`);
      console.log(`  Created: ${set.created_at.substring(0, 19)}`);
      console.log(`  career_id: ${set.career_id ? set.career_id.substring(0, 8) + '...' : 'NULL'}`);
      console.log(`  career_cluster: ${set.career_cluster || 'NULL'}`);
      console.log(`  tags: ${JSON.stringify(set.tags)}`);
      console.log(`  total_questions: ${set.total_questions}`);
      console.log(`  question_set_type: ${set.question_set_type}`);
      console.log(`  subject: ${set.subject}`);
      console.log(`  career_sector: ${set.career_sector}`);
      console.log('');
    }
  }

  // Count differences
  console.log(`\n${'='.repeat(80)}`);
  console.log(`\nAnalyzing patterns across all ${duplicates.length} duplicate groups:\n`);

  let differentCareerCluster = 0;
  let differentCareerIds = 0;
  let differentTags = 0;
  let trueDuplicates = 0;

  for (const [_, sets] of duplicates) {
    const clusters = new Set(sets.map(s => s.career_cluster || 'NULL'));
    const careers = new Set(sets.map(s => s.career_id || 'NULL'));
    const tagSets = new Set(sets.map(s => JSON.stringify(s.tags)));

    if (clusters.size > 1) differentCareerCluster++;
    if (careers.size > 1) differentCareerIds++;
    if (tagSets.size > 1) differentTags++;

    if (clusters.size === 1 && careers.size === 1 && tagSets.size === 1) {
      trueDuplicates++;
    }
  }

  console.log(`Groups with different career_cluster values: ${differentCareerCluster}`);
  console.log(`Groups with different career_id values: ${differentCareerIds}`);
  console.log(`Groups with different tags: ${differentTags}`);
  console.log(`Groups that are TRUE duplicates (all fields identical): ${trueDuplicates}`);
}

main().catch(console.error);
