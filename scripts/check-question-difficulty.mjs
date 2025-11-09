/**
 * Check Question Difficulty Values
 * =================================
 * See what difficulty values exist on individual questions
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
  console.log('🔍 Checking difficulty values on individual questions\n');

  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text, difficulty, question_set_id')
    .limit(100);

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log(`Sample of ${questions.length} questions:\n`);

  // Group by difficulty
  const byDifficulty = new Map();

  for (const q of questions) {
    const diff = q.difficulty || 'NULL';
    if (!byDifficulty.has(diff)) {
      byDifficulty.set(diff, 0);
    }
    byDifficulty.set(diff, byDifficulty.get(diff) + 1);
  }

  console.log('Question Difficulty Distribution (sample):');
  for (const [difficulty, count] of Array.from(byDifficulty.entries()).sort()) {
    console.log(`  "${difficulty}": ${count} questions`);
  }

  // Get total count by difficulty
  const { data: allStats } = await supabase
    .from('questions')
    .select('difficulty');

  if (allStats) {
    const allByDiff = new Map();
    for (const q of allStats) {
      const diff = q.difficulty || 'NULL';
      if (!allByDiff.has(diff)) {
        allByDiff.set(diff, 0);
      }
      allByDiff.set(diff, allByDiff.get(diff) + 1);
    }

    console.log('\n\nTotal Question Difficulty Distribution (all 3000 questions):');
    for (const [difficulty, count] of Array.from(allByDiff.entries()).sort()) {
      const percentage = ((count / allStats.length) * 100).toFixed(1);
      console.log(`  "${difficulty}": ${count} questions (${percentage}%)`);
    }
  }

  console.log('\n\nKEY FINDING:');
  console.log('  - question_sets.difficulty_level = "medium" (set-level)');
  console.log('  - questions.difficulty = varies (question-level)');
  console.log('\nThe filter should work based on question difficulty, not question_set difficulty!');
}

main().catch(console.error);
