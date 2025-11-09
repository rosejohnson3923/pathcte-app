/**
 * Analyze Current Architecture
 * =============================
 * Understand how questions, question_sets, and membership are structured
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
  console.log('🔍 ANALYZING CURRENT ARCHITECTURE\n');
  console.log('='.repeat(80) + '\n');

  // 1. Check question_sets
  const { data: questionSets, error: setsError } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster, total_questions')
    .limit(5);

  console.log('1. QUESTION_SETS TABLE (sample):');
  console.log('Columns: id, title, career_id, career_cluster, total_questions');
  if (questionSets) {
    for (const set of questionSets) {
      console.log(`  - "${set.title}"`);
      console.log(`    career_id: ${set.career_id ? set.career_id.substring(0, 8) + '...' : 'NULL'}`);
      console.log(`    career_cluster: ${set.career_cluster || 'NULL'}`);
      console.log(`    total_questions: ${set.total_questions}`);
    }
  }

  // Count total
  const { count: totalSets } = await supabase
    .from('question_sets')
    .select('*', { count: 'exact', head: true });
  console.log(`\n  Total question sets: ${totalSets}\n`);

  // 2. Check questions table structure
  const { data: sampleQuestions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .limit(3);

  console.log('2. QUESTIONS TABLE (sample):');
  if (sampleQuestions && sampleQuestions.length > 0) {
    const fields = Object.keys(sampleQuestions[0]);
    console.log(`  Columns: ${fields.join(', ')}\n`);

    for (const q of sampleQuestions) {
      console.log(`  Question: "${q.question_text.substring(0, 50)}..."`);
      console.log(`    question_set_id: ${q.question_set_id ? q.question_set_id.substring(0, 8) + '...' : 'NULL'}`);
      console.log(`    career_id: ${q.career_id ? 'EXISTS' : 'NULL'}`);
      console.log(`    career_cluster: ${q.career_cluster || 'NULL'}`);
      console.log(`    business_driver: ${q.business_driver || 'NULL'}`);
      console.log('');
    }
  }

  // Count total questions
  const { count: totalQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  console.log(`  Total questions: ${totalQuestions}\n`);

  // 3. Check question_set_membership
  const { data: membership, error: membershipError } = await supabase
    .from('question_set_membership')
    .select('*')
    .limit(5);

  console.log('3. QUESTION_SET_MEMBERSHIP TABLE (sample):');
  if (membership && membership.length > 0) {
    const fields = Object.keys(membership[0]);
    console.log(`  Columns: ${fields.join(', ')}\n`);

    for (const m of membership) {
      console.log(`  question_set_id: ${m.question_set_id.substring(0, 8)}... → question_id: ${m.question_id.substring(0, 8)}...`);
    }
  }

  // Count total memberships
  const { count: totalMemberships } = await supabase
    .from('question_set_membership')
    .select('*', { count: 'exact', head: true });
  console.log(`\n  Total membership records: ${totalMemberships}\n`);

  // 4. Architecture Summary
  console.log('='.repeat(80));
  console.log('\n4. ARCHITECTURE SUMMARY:\n');

  console.log(`Current State:`);
  console.log(`  - ${totalSets} question sets`);
  console.log(`  - ${totalQuestions} questions`);
  console.log(`  - ${totalMemberships} membership links`);

  console.log(`\nExpected State (Question Pools Architecture):`);
  console.log(`  - 3 question sets (Career, Industry, Cluster)`);
  console.log(`  - ~3000 questions`);
  console.log(`  - Questions linked via membership table`);
  console.log(`  - Filtering done by question metadata (career_id, career_cluster)`);

  console.log(`\nKEY QUESTION: Do questions have career_id and career_cluster fields?`);
  console.log(`Answer: ${sampleQuestions && sampleQuestions.length > 0 ?
    (sampleQuestions[0].hasOwnProperty('career_id') ? 'YES' : 'NO') : 'UNKNOWN'}`);
}

main().catch(console.error);
