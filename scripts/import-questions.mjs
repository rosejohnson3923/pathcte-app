/**
 * Import Question Sets from JSON to Supabase
 * ============================================
 * Imports industry and career questions from JSON files to PathCTE database
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load PathCTE environment variables
config({ path: join(__dirname, '../packages/web/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const SYSTEM_ADMIN_ID = '07951691-658a-4808-b2f8-c497c067edfa';

async function importQuestionSet(questionSetData) {
  const { questions, ...questionSetFields } = questionSetData;

  // Insert question set
  // IMPORTANT: Career sets (career_id NOT NULL) should have career_cluster = NULL
  // Only cluster fundamental sets should have career_cluster populated
  const career_cluster = questionSetFields.career_id
    ? null
    : (questionSetFields.career_cluster || null);

  const { data: questionSet, error: setError} = await supabase
    .from('question_sets')
    .insert({
      creator_id: SYSTEM_ADMIN_ID,
      title: questionSetFields.title,
      description: questionSetFields.description,
      subject: questionSetFields.subject,
      career_sector: questionSetFields.career_sector,
      career_cluster: career_cluster,
      career_id: questionSetFields.career_id || null,
      grade_level: questionSetFields.grade_level || [],
      difficulty_level: questionSetFields.difficulty_level,
      tags: questionSetFields.tags,
      is_public: questionSetFields.is_public,
      is_verified: questionSetFields.is_verified,
      total_questions: questionSetFields.total_questions,
      question_set_type: 'career_quest',
    })
    .select('id')
    .single();

  if (setError) {
    throw new Error(`Failed to insert question set: ${setError.message}`);
  }

  console.log(`  ✅ Created question set: ${questionSetFields.title}`);

  // Insert questions in batches
  const questionsToInsert = questions.map((q, index) => ({
    question_set_id: questionSet.id,
    question_text: q.question_text,
    question_type: 'multiple_choice',
    options: q.options,
    time_limit_seconds: q.time_limit_seconds || 30,
    points: q.points || 10,
    order_index: index,
    difficulty: q.difficulty || 'medium',
    business_driver: q.business_driver || null,
  }));

  const { data: insertedQuestions, error: questionsError } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select('id');

  if (questionsError) {
    throw new Error(`Failed to insert questions: ${questionsError.message}`);
  }

  console.log(`  ✅ Inserted ${questions.length} questions`);

  // NOTE: question_set_membership table has been deprecated
  // Questions are linked directly via question_set_id foreign key

  return questionSet.id;
}

async function importFromJSON(filePath, description) {
  console.log(`\n📥 Importing ${description}...`);
  console.log(`📁 File: ${filePath}`);

  const fileContent = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  console.log(`📊 Found ${data.length} question sets to import\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const questionSetData of data) {
    try {
      await importQuestionSet(questionSetData);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Import complete: ${successCount} successful, ${errorCount} failed`);
}

async function main() {
  console.log('🚀 PathCTE Question Import Tool\n');
  console.log('📍 Database:', process.env.VITE_SUPABASE_URL);
  console.log('👤 System Admin:', SYSTEM_ADMIN_ID);

  try {
    // Import industry questions (Career Quest)
    await importFromJSON(
      join(__dirname, '../../pathfinity-app/pathket-questions.json'),
      'Industry Questions (Career Quest)'
    );

    // Import career questions (Explore Careers)
    await importFromJSON(
      join(__dirname, '../../pathfinity-app/explore-careers-questions.json'),
      'Career Questions (Explore Careers)'
    );

    // Import career cluster questions (Career Cluster Fundamentals)
    await importFromJSON(
      join(__dirname, '../../pathfinity-app/career-cluster-questions.json'),
      'Career Cluster Questions (Fundamentals)'
    );

    console.log('\n🎉 All imports complete!\n');

    // Show summary
    const { count: setsCount } = await supabase
      .from('question_sets')
      .select('*', { count: 'exact', head: true });

    const { count: questionsCount } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Database Summary:');
    console.log(`  - Total question sets: ${setsCount}`);
    console.log(`  - Total questions: ${questionsCount}`);

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

main();
