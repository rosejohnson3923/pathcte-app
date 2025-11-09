/**
 * Check Difficulty Level Values
 * ==============================
 * See what difficulty_level values exist in the database
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
  console.log('🔍 Checking difficulty_level values in database\n');

  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('id, title, difficulty_level, career_id, career_cluster');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  // Group by difficulty_level
  const byDifficulty = new Map();

  for (const set of questionSets) {
    const diff = set.difficulty_level || 'NULL';
    if (!byDifficulty.has(diff)) {
      byDifficulty.set(diff, []);
    }
    byDifficulty.get(diff).push(set);
  }

  console.log('Difficulty Level Distribution:\n');

  for (const [difficulty, sets] of Array.from(byDifficulty.entries()).sort()) {
    const careers = sets.filter(s => s.career_id !== null).length;
    const clusters = sets.filter(s => s.career_id === null && s.career_cluster !== null).length;
    const industries = sets.filter(s => s.career_id === null && s.career_cluster === null).length;

    console.log(`"${difficulty}": ${sets.length} sets`);
    console.log(`  - Careers: ${careers}`);
    console.log(`  - Clusters: ${clusters}`);
    console.log(`  - Industries: ${industries}`);
    console.log(`  Examples: ${sets.slice(0, 3).map(s => s.title).join(', ')}`);
    console.log('');
  }

  console.log('Filter Logic Test:\n');
  console.log('When user selects "easy":');
  console.log('  Should show sets with difficulty_level = "easy" OR "mixed"');
  console.log('');
  console.log('When user selects "medium":');
  console.log('  Should show sets with difficulty_level = "medium" OR "mixed"');
  console.log('');
  console.log('When user selects "hard":');
  console.log('  Should show sets with difficulty_level = "hard" OR "mixed"');
}

main().catch(console.error);
