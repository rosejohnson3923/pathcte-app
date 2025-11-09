/**
 * Analyze Content Gaps
 * =====================
 * Identifies question sets that need more questions to meet the 30-question minimum
 * Requirement: Each question set needs at least 30 questions (to support 25 question games)
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
  console.log('📊 Analyzing Content Gaps\n');
  console.log('Target: 30+ questions per set (to support 25 question games)\n');
  console.log('='.repeat(80) + '\n');

  // Get all question sets
  const { data: questionSets } = await supabase
    .from('question_sets')
    .select('*')
    .order('title');

  // For each set, count questions by difficulty
  const results = [];

  for (const set of questionSets) {
    const { data: questions } = await supabase
      .from('questions')
      .select('id, difficulty')
      .eq('question_set_id', set.id);

    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    questions?.forEach(q => {
      const diff = q.difficulty || 'unknown';
      if (diff in byDifficulty) {
        byDifficulty[diff]++;
      }
    });

    const total = questions?.length || 0;
    const needsMore = total < 30;

    results.push({
      id: set.id,
      title: set.title,
      type: set.career_id ? 'Career' : (set.career_cluster ? 'Cluster' : 'Industry'),
      total,
      easy: byDifficulty.easy,
      medium: byDifficulty.medium,
      hard: byDifficulty.hard,
      needsMore,
      gap: Math.max(0, 30 - total)
    });
  }

  // Sort by total ascending to see which need most help
  results.sort((a, b) => a.total - b.total);

  // Show sets needing content
  const needsContent = results.filter(r => r.needsMore);
  console.log(`📋 Sets needing content: ${needsContent.length} / ${results.length}\n`);

  if (needsContent.length > 0) {
    console.log('Question Sets needing more content:\n');

    // Group by type
    const byType = {
      Career: needsContent.filter(r => r.type === 'Career'),
      Cluster: needsContent.filter(r => r.type === 'Cluster'),
      Industry: needsContent.filter(r => r.type === 'Industry')
    };

    for (const [type, sets] of Object.entries(byType)) {
      if (sets.length > 0) {
        console.log(`\n${type} (${sets.length} sets):`);
        console.log('-'.repeat(80));

        sets.forEach(r => {
          console.log(`\n  ${r.title}`);
          console.log(`    Total: ${r.total} questions (need ${r.gap} more to reach 30)`);
          console.log(`    Easy: ${r.easy}, Medium: ${r.medium}, Hard: ${r.hard}`);

          // Identify which difficulties are particularly lacking
          const lacking = [];
          if (r.easy < 10) lacking.push(`Easy (${r.easy}/10)`);
          if (r.medium < 10) lacking.push(`Medium (${r.medium}/10)`);
          if (r.hard < 10) lacking.push(`Hard (${r.hard}/10)`);

          if (lacking.length > 0) {
            console.log(`    ⚠️  Low on: ${lacking.join(', ')}`);
          }
        });
      }
    }
  } else {
    console.log('✅ All question sets have 30+ questions!\n');
  }

  // Overall statistics
  console.log('\n' + '='.repeat(80));
  console.log('\n📈 OVERALL STATISTICS\n');

  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  const totalEasy = results.reduce((sum, r) => sum + r.easy, 0);
  const totalMedium = results.reduce((sum, r) => sum + r.medium, 0);
  const totalHard = results.reduce((sum, r) => sum + r.hard, 0);

  console.log(`Question Sets: ${results.length}`);
  console.log(`Total Questions: ${totalQuestions}`);
  console.log(`Average per Set: ${(totalQuestions / results.length).toFixed(1)}`);

  console.log(`\nDifficulty Distribution:`);
  console.log(`  Easy:   ${totalEasy.toString().padStart(4)} (${(totalEasy/totalQuestions*100).toFixed(1)}%)`);
  console.log(`  Medium: ${totalMedium.toString().padStart(4)} (${(totalMedium/totalQuestions*100).toFixed(1)}%)`);
  console.log(`  Hard:   ${totalHard.toString().padStart(4)} (${(totalHard/totalQuestions*100).toFixed(1)}%)`);

  if (needsContent.length > 0) {
    const totalGap = needsContent.reduce((sum, r) => sum + r.gap, 0);
    console.log(`\n🎯 Additional Questions Needed: ${totalGap}`);
    console.log(`   To reach 30 per set minimum\n`);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(console.error);
